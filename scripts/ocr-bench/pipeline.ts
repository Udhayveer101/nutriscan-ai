// Experimental OCR pipeline stages for full-package photos (sharp + tesseract.js, Node only).
//  orient(): pick the rotation (0/90/180/270) that yields the most readable words.
//  readPage(): oriented page, CLAHE @2400 px, psm 6.
//  cropAndRead(): find the "INGREDIENTS" header, crop around it, rescale so cap height ~32 px, re-read.
// If this wins in the bench it gets ported to the browser (canvas) path in lib/local-ocr.ts.
import sharp from "sharp";
import type { Worker } from "tesseract.js";

export type Page = Awaited<ReturnType<Worker["recognize"]>>["data"];
const OUT = { text: true, blocks: true } as const;
const PAGE_W = 2400;
const ORIENT_W = 1600;
const CAP_H = 32; // target header cap height in px for the crop pass
const clahe = (b: Buffer) => sharp(b).clahe({ width: 64, height: 64, maxSlope: 3 }).png().toBuffer();
const psm = (w: Worker, mode: string) => w.setParameters({ tessedit_pageseg_mode: mode as never });

export const wordsOf = (p: Page) => (p.blocks ?? []).flatMap((b) => b.paragraphs.flatMap((pa) => pa.lines.flatMap((l) => l.words)));
const goodWords = (p: Page) => wordsOf(p).filter((w) => w.confidence >= 60 && /^[A-Za-z]{3,}$/.test(w.text.replace(/[.,:;()]/g, ""))).length;

export const orientStats: { deg: number }[] = [];

/** Rotation (clockwise degrees) that makes the text upright. Sparse psm 11 at ORIENT_W; 0 wins early when clearly readable. */
export async function orient(file: string, w: Worker): Promise<number> {
  const small = await sharp(file).rotate().grayscale().resize({ width: ORIENT_W }).png().toBuffer();
  await psm(w, "11");
  let best = 0, bestScore = -1;
  for (const deg of [0, 90, 270, 180]) {
    const s = goodWords((await w.recognize(await sharp(small).rotate(deg).png().toBuffer(), {}, OUT)).data);
    if (deg === 0 && s >= 15) return 0;
    if (s > bestScore) { best = deg; bestScore = s; }
  }
  return best;
}

async function upright(file: string, deg: number): Promise<Buffer> {
  const base = await sharp(file).rotate().grayscale().resize({ width: PAGE_W }).png().toBuffer();
  return sharp(base).rotate(deg).png().toBuffer();
}

export async function readPage(file: string, deg: number, w: Worker, mode = "6"): Promise<{ data: Page; width: number }> {
  const img = await upright(file, deg);
  await psm(w, mode);
  const buf = await clahe(img);
  return { data: (await w.recognize(buf, {}, OUT)).data, width: (await sharp(buf).metadata()).width ?? 0 };
}

/** Header box -> crop -> rescale -> re-read. Falls back to `page` (the full read) when no header is found. */
export async function cropAndRead(file: string, deg: number, page: { data: Page; width: number }, w: Worker): Promise<{ data: Page; width: number; cropped: boolean }> {
  const hdr = wordsOf(page.data).filter((x) => /^ingredi/i.test(x.text) && x.confidence >= 40).sort((a, b) => b.confidence - a.confidence)[0];
  if (!hdr) return { ...page, cropped: false };
  const h = Math.max(10, hdr.bbox.y1 - hdr.bbox.y0);
  const img = await upright(file, deg);
  const { width: W = 0, height: H = 0 } = await sharp(img).metadata();
  const x0 = Math.max(0, Math.round(hdr.bbox.x0 - 2 * h)), y0 = Math.max(0, Math.round(hdr.bbox.y0 - h));
  const x1 = Math.min(W, Math.round(hdr.bbox.x0 + 45 * h)), y1 = Math.min(H, Math.round(hdr.bbox.y0 + 22 * h));
  if (x1 - x0 < 50 || y1 - y0 < 50) return { ...page, cropped: false };
  const scale = Math.min(3, Math.max(0.5, CAP_H / h));
  const crop = await sharp(img).extract({ left: x0, top: y0, width: x1 - x0, height: y1 - y0 }).resize({ width: Math.round((x1 - x0) * scale) }).png().toBuffer();
  await psm(w, "6");
  const buf = await clahe(crop);
  // width 0: the crop edge cuts text on purpose, so the "touches the photo edge" check does not apply.
  return { data: (await w.recognize(buf, {}, OUT)).data, width: 0, cropped: true };
}
