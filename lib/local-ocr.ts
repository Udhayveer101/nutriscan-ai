// Label reading for the upload flow: AI OCR first (/api/scan/upload, Gemini → Groq), in-browser
// Tesseract (WebAssembly) only as the last resort when AI OCR fails (quota spent, timeout, offline).
// Why last: on real full-package photos (ocr-bench, 101 photos) Tesseract recovers only ~23% of
// ingredients exactly and its "trusted" reads were often wrong, so it must never pre-empt the AI.
import type { Worker } from "tesseract.js";
import { assessOcrQuality, findIngredientSection, parseIngredientList } from "./label-parser";

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
  const [{ data }, width] = await Promise.all([
    worker.recognize(file, {}, { text: true, blocks: true }),
    createImageBitmap(file).then((b) => { const w = b.width; b.close(); return w; }, () => 0),
  ]);
  return judgeLocalRead(data, width);
}

type TesseractPage = Awaited<ReturnType<Worker["recognize"]>>["data"];

/** Tesseract page → parsed read + whether it may skip AI OCR. Pure: the OCR lab tests this directly. */
export function judgeLocalRead(data: TesseractPage, imageWidth = 0): { read: LabelRead; trusted: boolean } | null {
  const words = (data.blocks ?? []).flatMap((b) => b.paragraphs.flatMap((p) => p.lines.flatMap((l) => l.words)));
  // Text touching the photo's left/right edge is probably cut off ("ACESULFAME POTASSI").
  const edge = imageWidth * 0.01;
  const clipped = imageWidth > 0 && words.some((w) => w.bbox.x0 <= edge || w.bbox.x1 >= imageWidth - edge);
  // A low-confidence word holding a digit is a likely misread code ("£217" read for E211, and
  // E217 is a different additive): such a read is never trusted, and the word is dropped from
  // it — a missing code is safer than the wrong additive.
  const shaky = new Set(words.filter((w) => w.confidence < LOW_WORD_CONFIDENCE && /\d/.test(w.text)).map((w) => w.text));
  // Whole tokens only: a shaky "1" must not eat the 1 inside "E150d".
  const text = data.text.split(/(\s+)/).map((tok) => (shaky.has(tok) ? " " : tok)).join("");
  const ingredients = parseIngredientList(text);
  const gate = assessOcrQuality(text);
  // Any doubtful word inside the declaration ("Sait", "COC! 0A") means a 1-character misread may
  // be hiding a different ingredient: let AI OCR read it instead.
  const section = findIngredientSection(text);
  const doubtful = words.some((w) => w.confidence < LOW_WORD_CONFIDENCE && w.text.length > 1 && section.includes(w.text));
  // Garbage ("asdf qwer") must not be shown as a list and scored A+: needs the gate or a header.
  if (!ingredients.length || (!gate.acceptable && !/ingred/i.test(text))) return null;
  return {
    read: { ingredients, ingredientText: section, provider: "tesseract" },
    trusted: gate.acceptable && data.confidence >= MIN_MEAN_CONFIDENCE && !shaky.size && !clipped && !doubtful,
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

/** AI OCR first; Tesseract only if it fails. Resolves with a read or null; rejects only on abort. */
export async function readLabel(file: File, signal: AbortSignal): Promise<LabelRead | null> {
  const abort = () => { throw new DOMException("Aborted", "AbortError"); };
  try {
    const ai = await readRemote(file, signal);
    if (ai) return ai;
  } catch (err) {
    if (signal.aborted) abort();
    console.warn("AI OCR failed, falling back to local OCR", err);
  }
  if (signal.aborted) abort();
  try {
    const local = await readLocal(file);
    if (signal.aborted) abort();
    return local?.read ?? null;
  } catch (err) {
    if (signal.aborted) abort();
    console.warn("local OCR failed", err);
    return null;
  }
}
