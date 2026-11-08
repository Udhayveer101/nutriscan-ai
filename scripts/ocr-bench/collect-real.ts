// Collects real package photos + human-annotated ingredient text from the Open Food Facts
// "ingredient-detection" dataset on Hugging Face (CC BY-SA 4.0; photos are CC BY-SA 3.0 OFF uploads)
// into ocr-bench/data/candidates/. Ground truth = the annotated ingredient span of the OCR text.
// Nothing is trusted yet: run verify-real.ts before the OCR bench.
// Run: npx tsx scripts/ocr-bench/collect-real.ts [--want 150]
import { appendFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "ocr-bench/data/candidates");
const UA = { "User-Agent": "nutriscan-ocr-bench/0.1 (research; ~1 req/s)" };
const want = Number(process.argv[process.argv.indexOf("--want") + 1]) || 150;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface Row { text: string; offsets: number[][]; meta: { barcode: string; image_id: string; url: string } }

async function rows(split: string): Promise<Row[]> {
  const all: Row[] = [];
  for (let offset = 0; ; offset += 100) {
    const u = `https://datasets-server.huggingface.co/rows?dataset=openfoodfacts%2Fingredient-detection&config=default&split=${split}&offset=${offset}&length=100`;
    let r = await fetch(u, { headers: UA, signal: AbortSignal.timeout(60_000) });
    for (let i = 1; !r.ok && i <= 4; i++) { // datasets-server 503s transiently
      console.error(`${split}@${offset}: HTTP ${r.status}, retry ${i}`);
      await sleep(5000 * i);
      r = await fetch(u, { headers: UA, signal: AbortSignal.timeout(60_000) });
    }
    if (!r.ok) throw new Error(`${split}@${offset}: HTTP ${r.status}`);
    const j = await r.json();
    all.push(...j.rows.map((x: { row: Row }) => x.row));
    if (offset + 100 >= j.num_rows_total) return all;
    await sleep(500);
  }
}

// One annotated span, English-looking (ASCII-heavy, has commas), sane length.
function span(r: Row): string | null {
  if (r.offsets.length !== 1) return null;
  const t = r.text.slice(r.offsets[0][0], r.offsets[0][1]).replace(/\s+/g, " ").trim();
  if (t.length < 40 || t.length > 800 || !t.includes(",")) return null;
  if ((t.match(/[A-Za-z0-9 ,.:;()%&'\-\/\[\]*]/g) ?? []).length / t.length < 0.97) return null;
  if (!/\b(sugar|salt|water|oil|flour|milk|acid|starch|extract|flavou?r|syrup|natural)\b/i.test(t)) return null; // English food words
  return t;
}

const rng = (seed: number) => () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

async function main() {
  mkdirSync(OUT, { recursive: true });
  const pool = [...(await rows("test"))]
    .map((r) => ({ r, gt: span(r) })).filter((x): x is { r: Row; gt: string } => !!x.gt);
  const seen = new Set<string>();
  const uniq = pool.filter(({ r }) => (seen.has(r.meta.barcode) ? false : (seen.add(r.meta.barcode), true)));
  const rand = rng(7);
  uniq.sort(() => rand() - 0.5);
  console.log(`${pool.length} English single-span rows, ${uniq.length} unique products; downloading up to ${want}`);

  let got = 0;
  for (const { r, gt } of uniq) {
    if (got >= want) break;
    const id = `${r.meta.barcode}_${r.meta.image_id}`;
    if (existsSync(join(OUT, `${id}.jpg`))) { got++; continue; } // resumable
    const url = r.meta.url.replace("static.openfoodfacts.org", "images.openfoodfacts.org").replace(/\.json$/, ".jpg");
    let buf: Buffer;
    try {
      const res = await fetch(url, { headers: UA, signal: AbortSignal.timeout(90_000) });
      if (!res.ok || !(res.headers.get("content-type") ?? "").startsWith("image/")) continue;
      buf = Buffer.from(await res.arrayBuffer());
    } catch (e) { console.error(`skip ${id}: ${(e as Error).message}`); continue; }
    await sleep(1000);
    writeFileSync(join(OUT, `${id}.jpg`), buf);
    writeFileSync(join(OUT, `${id}.gt.txt`), gt + "\n");
    appendFileSync(join(OUT, "manifest.jsonl"), JSON.stringify({ id, product: `https://world.openfoodfacts.org/product/${r.meta.barcode}`, image: url, bytes: buf.length, license: "CC BY-SA (Open Food Facts contributors)" }) + "\n");
    if (++got % 10 === 0) console.log(`${got}/${want}`);
  }
  console.log(`done: ${got} candidates in ${OUT}`);
}
main().catch((e) => { console.error(e); process.exit(1); });
