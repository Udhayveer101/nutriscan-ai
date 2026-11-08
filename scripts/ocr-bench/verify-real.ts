// Verifies collected candidates BEFORE they enter the OCR bench. A candidate passes only if:
//  1. it decodes as an image, is >= 800 px on its long side and is not blank;
//  2. its ground-truth text is present in the photo: an independent, deliberately generous read
//     (CLAHE @2400 px, sparse-text psm 11, best of 4 rotations) finds >= 50% of the GT's distinct words.
// A failed check can be overridden only by ocr-bench/data/manual-verified.txt (eyeballed, tier "visual").
// Passed -> ocr-bench/data/real/ (with .gt.txt + manifest line). Failed stay in candidates/ with the
// reason in ocr-bench/data/verify-report.json. Caveat: check 2 drops photos the generous read also
// can't read, so the real set is slightly easier than reality — the report counts them.
// Run: npx tsx scripts/ocr-bench/verify-real.ts
import sharp from "sharp";
import { createWorker } from "tesseract.js";
import { appendFileSync, copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const CAND = join(ROOT, "ocr-bench/data/candidates");
const REAL = join(ROOT, "ocr-bench/data/real");
const MIN_OVERLAP = 0.5;
// Photos a person opened and confirmed by eye (see the file header); used only when the OCR check fails.
const MANUAL = new Set(readFileSync(join(ROOT, "ocr-bench/data/manual-verified.txt"), "utf8").split("\n").filter((l) => l && !l.startsWith("#")));

const words = (s: string) => new Set(s.toLowerCase().match(/[a-z]{3,}/g) ?? []);

async function main() {
  const ids = readdirSync(CAND).filter((f) => f.endsWith(".jpg")).map((f) => f.slice(0, -4)).sort();
  const manifest = new Map(readFileSync(join(CAND, "manifest.jsonl"), "utf8").trim().split("\n").map((l) => { const j = JSON.parse(l); return [j.id, j]; }));
  rmSync(REAL, { recursive: true, force: true });
  mkdirSync(REAL, { recursive: true });

  const workers = await Promise.all(Array.from({ length: 4 }, async () => {
    const w = await createWorker("eng", 1, { langPath: ROOT, gzip: false, cacheMethod: "none" });
    await w.setParameters({ tessedit_pageseg_mode: "11" as never });
    return w;
  }));
  const report: { id: string; ok: boolean; reason: string; overlap?: number; rotation?: number; w?: number; h?: number }[] = [];
  const queue = [...ids];
  await Promise.all(workers.map(async (w) => {
    for (let id = queue.shift(); id; id = queue.shift()) {
      const file = join(CAND, `${id}.jpg`);
      const fail = (reason: string, extra: object = {}) => report.push({ id, ok: false, reason, ...extra });
      try {
        const img = sharp(file).rotate();
        const meta = await img.metadata();
        const st = await img.clone().grayscale().stats();
        const long = Math.max(meta.width ?? 0, meta.height ?? 0);
        if (long < 800) { fail("too small", { w: meta.width, h: meta.height }); continue; }
        if (st.channels[0].stdev < 20) { fail("blank/flat image"); continue; }
        const buf = await img.clone().grayscale().resize({ width: 2400, withoutEnlargement: false }).png().toBuffer();
        const gt = words(readFileSync(join(CAND, `${id}.gt.txt`), "utf8"));
        // Many phone photos are stored sideways (no EXIF flag): try each rotation, keep the best.
        let overlap = 0, rotation = 0;
        for (const deg of [0, 90, 270, 180]) {
          for (const clahe of [true, false]) { // CLAHE sometimes wrecks dark/low-contrast shots; plain gray is the fallback
            let pipe = sharp(buf).rotate(deg);
            pipe = clahe ? pipe.clahe({ width: 64, height: 64, maxSlope: 3 }) : pipe.normalise();
            const got = words((await w.recognize(await pipe.png().toBuffer())).data.text);
            const o = [...gt].filter((x) => got.has(x)).length / gt.size;
            if (o > overlap) { overlap = o; rotation = deg; }
            if (overlap >= MIN_OVERLAP) break;
          }
          if (overlap >= MIN_OVERLAP) break;
        }
        const tier = overlap >= MIN_OVERLAP ? "ocr" : MANUAL.has(id) ? "visual" : null;
        if (!tier) { fail("ground truth not found in photo", { overlap, w: meta.width, h: meta.height }); continue; }
        copyFileSync(file, join(REAL, `${id}.jpg`));
        copyFileSync(join(CAND, `${id}.gt.txt`), join(REAL, `${id}.gt.txt`));
        appendFileSync(join(REAL, "manifest.jsonl"), JSON.stringify({ ...manifest.get(id), rotation: tier === "ocr" ? rotation : 0, tier }) + "\n");
        report.push({ id, ok: true, reason: tier, overlap, rotation: tier === "ocr" ? rotation : 0, w: meta.width, h: meta.height });
      } catch (e) { fail(`decode/OCR error: ${(e as Error).message}`); }
    }
  }));
  await Promise.all(workers.map((w) => w.terminate()));

  report.sort((a, b) => a.id.localeCompare(b.id));
  writeFileSync(join(ROOT, "ocr-bench/data/verify-report.json"), JSON.stringify(report, null, 2));
  const ok = report.filter((r) => r.ok).length;
  const why = report.filter((r) => !r.ok).reduce<Record<string, number>>((m, r) => ({ ...m, [r.reason]: (m[r.reason] ?? 0) + 1 }), {});
  console.log(`verified ${ok}/${report.length} -> ocr-bench/data/real; rejected:`, why);
}
main().then(() => process.exit(0), (e) => { console.error(e); process.exit(1); });
