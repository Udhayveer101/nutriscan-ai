// OCR benchmark: Tesseract (same eng model + judge gate as the browser) across preprocessing variants.
// Data: ocr-bench/data/**/NAME.(jpg|jpeg|png|webp) + NAME.gt.txt (the label text, any wrapping).
// Run: npx tsx scripts/ocr-bench/bench-ocr.ts [--variants raw3,norm6] [--dir synthetic|real] [--limit N]
// Metrics: CER/WER (lowercased, whitespace-collapsed), ingredient recall via parseIngredientList on
// ground truth vs read, trusted rate, and false-trust (gate said "trusted" but ingredients were wrong).
import sharp from "sharp";
import { createWorker, type Worker } from "tesseract.js";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { findIngredientSection, parseIngredientList } from "../../lib/label-parser";
import { judgeLocalRead } from "../../lib/local-ocr";
import { cropAndRead, orient, readPage, type Page } from "./pipeline";

const ROOT = process.cwd();
const arg = (k: string) => { const i = process.argv.indexOf(`--${k}`); return i > 0 ? process.argv[i + 1] : undefined; };

type Pre = (img: sharp.Sharp) => Promise<Buffer>;
const up = (img: sharp.Sharp) => img.rotate().grayscale().resize({ width: Number(arg("width") ?? 1600), kernel: "lanczos3" }); // fixed width: tiny photos are enlarged, big ones reduced (--width N)
const PRE: Record<string, Pre> = {
  raw: (i) => i.png().toBuffer(),
  norm: (i) => up(i).normalise().sharpen().png().toBuffer(),
  clahe: async (i) => sharp(await up(i).png().toBuffer()).clahe({ width: 64, height: 64, maxSlope: 3 }).png().toBuffer(),
};
// A variant reads one photo with one worker. Static ones: <pre><psm> (raw3 = what the browser does today).
// Multi-pass ones: rot<psm> = auto-rotate then page read; crop = auto-rotate, find "INGREDIENTS", crop, re-read.
type Read = { data: Page; width: number };
interface Variant { name: string; run: (file: string, w: Worker) => Promise<Read> }
const orientCache = new Map<string, Promise<number>>(), pageCache = new Map<string, Promise<Read>>();
const orientOf = (f: string, w: Worker) => { if (!orientCache.has(f)) orientCache.set(f, orient(f, w)); return orientCache.get(f)!; };
const pageOf = (f: string, w: Worker, mode = "6") => { const k = f + mode; if (!pageCache.has(k)) pageCache.set(k, orientOf(f, w).then((d) => readPage(f, d, w, mode))); return pageCache.get(k)!; };
const makeVariant = (v: string): Variant => {
  const rot = v.match(/^rot(\d+)$/);
  if (rot) return { name: v, run: (f, w) => pageOf(f, w, rot[1]) };
  if (v === "crop") return { name: v, run: async (f, w) => cropAndRead(f, await orientOf(f, w), await pageOf(f, w), w) };
  const m = v.match(/^([a-z]+)(\d+)$/);
  if (!m || !PRE[m[1]]) throw new Error(`bad variant ${v}`);
  return { name: v, run: async (f, w) => {
    await w.setParameters({ tessedit_pageseg_mode: m[2] as never });
    const buf = await PRE[m[1]](sharp(f));
    return { data: (await w.recognize(buf, {}, { text: true, blocks: true })).data, width: (await sharp(buf).metadata()).width ?? 0 };
  } };
};
const VARIANTS = (arg("variants") ?? "raw3,raw6,norm3,norm6,clahe6").split(",").map(makeVariant);

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();
function lev<T>(a: T[], b: T[]): number {
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[b.length];
}
// Self-check: fails loudly if the metric itself is wrong.
if (lev([..."kitten"], [..."sitting"]) !== 3 || lev([], ["a"]) !== 1) throw new Error("lev broken");

function listImages(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) return listImages(p);
    return /\.(jpe?g|png|webp)$/i.test(f) && existsSync(p.replace(/\.[^.]+$/, ".gt.txt")) ? [p] : [];
  });
}

// Real photos are grouped by manifest tier/rotation (ocr-upright | ocr-rotated | visual-hard); synthetic by filename.
const entryOf = (() => {
  const cache = new Map<string, Map<string, { tier: string; rotation: number }>>();
  return (file: string) => {
    const dir = file.slice(0, file.lastIndexOf("/"));
    if (!cache.has(dir)) {
      const m = new Map();
      if (existsSync(join(dir, "manifest.jsonl"))) for (const l of readFileSync(join(dir, "manifest.jsonl"), "utf8").trim().split("\n")) { const j = JSON.parse(l); m.set(j.id, j); }
      cache.set(dir, m);
    }
    return cache.get(dir)!.get(file.slice(file.lastIndexOf("/") + 1).replace(/\.[^.]+$/, ""));
  };
})();
const groupOf = (file: string) => {
  {
    const e = entryOf(file);
    if (e) return e.tier === "visual" ? "visual-hard" : e.rotation ? "ocr-rotated" : "ocr-upright";
    return file.match(/_([a-z]+)\.[^.]+$/)?.[1] ?? "other";
  }
};

async function main() {
  const sub = arg("dir");
  let images = listImages(join(ROOT, "ocr-bench/data", sub ?? "")).sort();
  const limit = Number(arg("limit") ?? 0);
  if (limit) images = images.filter((_, i) => i % Math.ceil(images.length / limit) === 0).slice(0, limit);
  if (!images.length) { console.log("no images with .gt.txt under ocr-bench/data (run gen-synthetic.ts first)"); return; }

  const workers = await Promise.all(Array.from({ length: 4 }, () => createWorker("eng", 1, { langPath: ROOT, gzip: false, cacheMethod: "none" })));
  const cropped: Record<string, number> = {};
  const rows: Record<string, { cer: number[]; wer: number[]; recall: number[]; trusted: number; falseTrust: number; n: number; byProfile: Record<string, number[]> }> = {};
  for (const v of VARIANTS) rows[v.name] = { cer: [], wer: [], recall: [], trusted: 0, falseTrust: 0, n: 0, byProfile: {} };

  for (const v of VARIANTS) {
    const r = rows[v.name];
    const queue = [...images];
    await Promise.all(workers.map(async (w) => {
      for (let file = queue.shift(); file; file = queue.shift()) {
      const gt = readFileSync(file.replace(/\.[^.]+$/, ".gt.txt"), "utf8");
      const res = await v.run(file, w);
      const { data, width } = res;
      if ((res as { cropped?: boolean }).cropped) cropped[v.name] = (cropped[v.name] ?? 0) + 1;
      // Full-package photos contain far more than the list, so CER/WER compare the extracted ingredient section (approximate: it may run on into "Contains..." lines).
      const g = norm(gt), t = norm(findIngredientSection(data.text) || data.text);
      const cer = lev([...g], [...t]) / g.length;
      const gw = g.split(" "), tw = t.split(" ");
      const wer = lev(gw, tw) / gw.length;
      const gi = parseIngredientList(gt).map(norm), ti = new Set(parseIngredientList(data.text).map(norm));
      const recall = gi.length ? gi.filter((x) => ti.has(x)).length / gi.length : 1;
      const j = judgeLocalRead(data, width);
      r.n++; r.cer.push(cer); r.wer.push(wer); r.recall.push(recall);
      if (j?.trusted) { r.trusted++; if (recall < 1) r.falseTrust++; }
      const prof = groupOf(file);
      (r.byProfile[prof] ??= []).push(recall);
      }
    }));
    process.stderr.write(`done ${v.name}\n`);
  }
  if (orientCache.size) { // orientation accuracy against the rotation the verifier found (OCR-verified photos only)
    let ok = 0, n = 0; const miss: string[] = [];
    for (const [f, p] of orientCache) { const e = entryOf(f); if (e?.tier !== "ocr") continue; n++; const d = await p; if (d === e.rotation) ok++; else miss.push(`${f.split("/").pop()}(want ${e.rotation}, got ${d})`); }
    console.log(`\norientation accuracy: ${ok}/${n}${miss.length ? "  misses: " + miss.slice(0, 8).join(", ") : ""}`);
  }
  for (const [k, c] of Object.entries(cropped)) console.log(`${k}: header found and cropped on ${c}/${images.length}`);
  await Promise.all(workers.map((w) => w.terminate()));

  const mean = (a: number[]) => a.reduce((x, y) => x + y, 0) / (a.length || 1);
  const pct = (x: number) => (x * 100).toFixed(1).padStart(5) + "%";
  console.log(`\n${images.length} images, ingredient recall = share of true ingredients read exactly\n`);
  console.log("variant   CER     WER     recall  trusted  false-trust   recall by profile");
  const out: object[] = [];
  for (const v of VARIANTS) {
    const r = rows[v.name];
    const prof = Object.entries(r.byProfile).map(([k, a]) => `${k} ${(mean(a) * 100).toFixed(0)}`).join(" | ");
    console.log(`${v.name.padEnd(9)} ${pct(mean(r.cer))} ${pct(mean(r.wer))} ${pct(mean(r.recall))} ${pct(r.trusted / r.n)}  ${String(r.falseTrust).padStart(3)}/${String(r.trusted).padEnd(4)}     ${prof}`);
    out.push({ variant: v.name, cer: mean(r.cer), wer: mean(r.wer), recall: mean(r.recall), trusted: r.trusted, falseTrust: r.falseTrust, n: r.n });
  }
  mkdirSync(join(ROOT, "ocr-bench/results"), { recursive: true });
  writeFileSync(join(ROOT, `ocr-bench/results/${new Date().toISOString().replace(/[:.]/g, "-")}.json`), JSON.stringify(out, null, 2));
}
main().then(() => process.exit(0), (e) => { console.error(e); process.exit(1); });
