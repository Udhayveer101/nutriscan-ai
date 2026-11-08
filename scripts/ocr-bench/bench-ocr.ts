// OCR benchmark: Tesseract (same eng model + judge gate as the browser) across preprocessing variants.
// Data: ocr-bench/data/**/NAME.(jpg|jpeg|png|webp) + NAME.gt.txt (the label text, any wrapping).
// Run: npx tsx scripts/ocr-bench/bench-ocr.ts [--variants raw3,norm6] [--dir synthetic|real] [--limit N]
// Metrics: CER/WER (lowercased, whitespace-collapsed), ingredient recall via parseIngredientList on
// ground truth vs read, trusted rate, and false-trust (gate said "trusted" but ingredients were wrong).
import sharp from "sharp";
import { createWorker } from "tesseract.js";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseIngredientList } from "../../lib/label-parser";
import { judgeLocalRead } from "../../lib/local-ocr";

const ROOT = process.cwd();
const arg = (k: string) => { const i = process.argv.indexOf(`--${k}`); return i > 0 ? process.argv[i + 1] : undefined; };

type Pre = (img: sharp.Sharp) => Promise<Buffer>;
const up = (img: sharp.Sharp) => img.rotate().grayscale().resize({ width: 1600, withoutReduction: false, kernel: "lanczos3" }); // fixed width: tiny photos are enlarged, big ones reduced
const PRE: Record<string, Pre> = {
  raw: (i) => i.png().toBuffer(),
  norm: (i) => up(i).normalise().sharpen().png().toBuffer(),
  clahe: async (i) => sharp(await up(i).png().toBuffer()).clahe({ width: 64, height: 64, maxSlope: 3 }).png().toBuffer(),
};
// name = <pre><psm>; baseline = raw3 = what the browser does today.
const VARIANTS = (arg("variants") ?? "raw3,raw6,norm3,norm6,clahe6").split(",").map((v) => {
  const m = v.match(/^([a-z]+)(\d+)$/);
  if (!m || !PRE[m[1]]) throw new Error(`bad variant ${v}`);
  return { name: v, pre: PRE[m[1]], psm: m[2] };
});

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

async function main() {
  const sub = arg("dir");
  let images = listImages(join(ROOT, "ocr-bench/data", sub ?? "")).sort();
  const limit = Number(arg("limit") ?? 0);
  if (limit) images = images.filter((_, i) => i % Math.ceil(images.length / limit) === 0).slice(0, limit);
  if (!images.length) { console.log("no images with .gt.txt under ocr-bench/data (run gen-synthetic.ts first)"); return; }

  const workers = await Promise.all(Array.from({ length: 4 }, () => createWorker("eng", 1, { langPath: ROOT, gzip: false, cacheMethod: "none" })));
  const rows: Record<string, { cer: number[]; wer: number[]; recall: number[]; trusted: number; falseTrust: number; n: number; byProfile: Record<string, number[]> }> = {};
  for (const v of VARIANTS) rows[v.name] = { cer: [], wer: [], recall: [], trusted: 0, falseTrust: 0, n: 0, byProfile: {} };

  for (const v of VARIANTS) {
    const r = rows[v.name];
    await Promise.all(workers.map((w) => w.setParameters({ tessedit_pageseg_mode: v.psm as never })));
    const queue = [...images];
    await Promise.all(workers.map(async (w) => {
      for (let file = queue.shift(); file; file = queue.shift()) {
      const gt = readFileSync(file.replace(/\.[^.]+$/, ".gt.txt"), "utf8");
      const buf = await v.pre(sharp(file));
      const width = (await sharp(buf).metadata()).width ?? 0;
      const { data } = await w.recognize(buf, {}, { text: true, blocks: true });
      const g = norm(gt), t = norm(data.text);
      const cer = lev([...g], [...t]) / g.length;
      const gw = g.split(" "), tw = t.split(" ");
      const wer = lev(gw, tw) / gw.length;
      const gi = parseIngredientList(gt).map(norm), ti = new Set(parseIngredientList(data.text).map(norm));
      const recall = gi.length ? gi.filter((x) => ti.has(x)).length / gi.length : 1;
      const j = judgeLocalRead(data, width);
      r.n++; r.cer.push(cer); r.wer.push(wer); r.recall.push(recall);
      if (j?.trusted) { r.trusted++; if (recall < 1) r.falseTrust++; }
      const prof = file.match(/_([a-z]+)\.[^.]+$/)?.[1] ?? "real";
      (r.byProfile[prof] ??= []).push(recall);
      }
    }));
    process.stderr.write(`done ${v.name}\n`);
  }
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
