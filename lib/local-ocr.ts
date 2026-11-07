// Label reading for the upload flow, local-first.
//
// Tesseract (WebAssembly) runs in the user's own browser: no API key, no quota, no cost, so it
// never "runs out". The AI OCR endpoint (/api/scan/upload, free-tier Gemini → Groq) is only a
// backup: started when the local read is untrusted, or still running after HEDGE_MS (slow
// phones, first visit while the model downloads). The first trusted read wins; a weak local
// read is kept only for when AI OCR also fails (quota spent, timeout).
import type { Worker } from "tesseract.js";
import { assessOcrQuality, findIngredientSection, parseIngredientList } from "./label-parser";

const HEDGE_MS = 1500;
// Past this, an untrusted local read is shown (the user reviews the list before analysing)
// instead of waiting on a slow AI call — free-tier Gemini has timed out at 10 s.
const DEADLINE_MS = 3000;
const MIN_MEAN_CONFIDENCE = 80;
const LOW_WORD_CONFIDENCE = 60;

export interface LabelRead {
  ingredients: string[];
  ingredientText: string;
  provider: string;
}

let workerP: Promise<Worker> | null = null;

/** Load the engine and English model ahead of the first scan (cached by the browser after that). */
export function warmLocalOcr(): Promise<Worker> {
  if (!workerP) {
    workerP = import("tesseract.js").then(({ createWorker }) => createWorker("eng"));
    workerP.catch(() => { workerP = null; }); // retry on the next call
  }
  return workerP;
}

async function readLocal(file: Blob): Promise<{ read: LabelRead; trusted: boolean } | null> {
  const worker = await warmLocalOcr();
  const { data } = await worker.recognize(file, {}, { text: true, blocks: true });
  const words = (data.blocks ?? []).flatMap((b) => b.paragraphs.flatMap((p) => p.lines.flatMap((l) => l.words)));
  // A low-confidence word holding a digit is a likely misread code ("£217" read for E211, and
  // E217 is a different additive): such a read is never trusted, and the word is dropped from
  // it — a missing code is safer than the wrong additive.
  const shaky = new Set(words.filter((w) => w.confidence < LOW_WORD_CONFIDENCE && /\d/.test(w.text)).map((w) => w.text));
  // Whole tokens only: a shaky "1" must not eat the 1 inside "E150d".
  const text = data.text.split(/(\s+)/).map((tok) => (shaky.has(tok) ? " " : tok)).join("");
  const ingredients = parseIngredientList(text);
  const gate = assessOcrQuality(text);
  // Garbage ("asdf qwer") must not be shown as a list and scored A+: needs the gate or a header.
  if (!ingredients.length || (!gate.acceptable && !/ingred/i.test(text))) return null;
  return {
    read: { ingredients, ingredientText: findIngredientSection(text), provider: "tesseract" },
    trusted: gate.acceptable && data.confidence >= MIN_MEAN_CONFIDENCE && !shaky.size,
  };
}

async function readRemote(file: File, signal: AbortSignal): Promise<LabelRead | null> {
  const fd = new FormData();
  fd.append("image", file);
  const res = await fetch("/api/scan/upload", { method: "POST", body: fd, signal });
  if (!res.ok) return null;
  const d = await res.json();
  const ingredients: string[] = Array.isArray(d.ingredients) ? d.ingredients : [];
  return ingredients.length ? { ingredients, ingredientText: d.ingredientText ?? "", provider: d.ocrProvider ?? "ai" } : null;
}

/**
 * Resolves with the first trusted read, else the best weak one, else null. Rejects only on abort.
 * When a weak read was shown and AI OCR answers later, `onUpgrade` gets the better read
 * (until `signal` aborts — the caller aborts on submit or on a new photo).
 */
export function readLabel(file: File, signal: AbortSignal, onUpgrade?: (r: LabelRead) => void): Promise<LabelRead | null> {
  return new Promise((resolve, reject) => {
    let pending = 1;
    let remoteStarted = false;
    let settled = false;
    let late = false;
    let shownWeak = false;
    let weak: LabelRead | null = null;

    const finish = (r: LabelRead | null) => {
      if (settled) return;
      settled = true;
      shownWeak = !!r && r === weak;
      clearTimeout(timer);
      clearTimeout(deadline);
      resolve(r);
    };
    const settle = (r: LabelRead | null, trusted: boolean) => {
      pending--;
      if (settled) {
        if (r && trusted && shownWeak && !signal.aborted) onUpgrade?.(r);
        return;
      }
      if (r && trusted) return finish(r);
      if (r && !weak) weak = r;
      if (!remoteStarted) return startRemote();
      if ((late && weak) || pending === 0) finish(weak);
    };
    const startRemote = () => {
      if (remoteStarted || settled) return;
      remoteStarted = true;
      pending++;
      readRemote(file, signal).then((r) => settle(r, true), () => settle(null, false));
    };

    const timer = setTimeout(startRemote, HEDGE_MS);
    const deadline = setTimeout(() => { late = true; if (weak) finish(weak); }, DEADLINE_MS);
    readLocal(file).then(
      (r) => settle(r?.read ?? null, r?.trusted ?? false),
      (err) => { console.warn("local OCR failed", err); settle(null, false); },
    );
    signal.addEventListener("abort", () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      clearTimeout(deadline);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}
