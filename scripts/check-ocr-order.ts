// readLabel must try AI OCR first and never touch Tesseract when it succeeds; abort must reject.
import { readLabel } from "../lib/local-ocr";
const assert = (c: boolean, m: string) => { if (!c) throw new Error("FAIL: " + m); };
let calls = 0;
globalThis.fetch = (async () => { calls++; return new Response(JSON.stringify({ ingredients: ["Sugar", "Salt"], ocrProvider: "gemini" })); }) as typeof fetch;
(async () => {
  const f = new File([new Uint8Array(4)], "a.jpg", { type: "image/jpeg" });
  const r = await readLabel(f, new AbortController().signal);
  assert(r?.provider === "gemini" && r.ingredients.length === 2 && calls === 1, "AI first");
  const ac = new AbortController(); ac.abort();
  globalThis.fetch = (async () => { throw new DOMException("x", "AbortError"); }) as typeof fetch;
  let name = ""; await readLabel(f, ac.signal).catch((e) => (name = e.name));
  assert(name === "AbortError", "abort rejects");
  console.log("ocr order check OK");
})();
