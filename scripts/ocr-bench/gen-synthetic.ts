// Renders LABELS into degraded label photos (4 profiles each) + .gt.txt ground truth.
// Deterministic (seeded). Run: npx tsx scripts/ocr-bench/gen-synthetic.ts
// A synthetic set is only a proxy: drop real photos + .gt.txt into ocr-bench/data/real/ for the real score.
import sharp from "sharp";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { LABELS } from "./labels";

const OUT = join(process.cwd(), "ocr-bench/data/synthetic");

const rng = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

interface Profile {
  name: string; fs: number; width: number; bg: string; fg: string; font: string;
  rot: number; blur: number; noise: number; glare: boolean; shrink: number; jpeg: number;
}
const PROFILES: Profile[] = [
  { name: "clean", fs: 22, width: 900, bg: "#ffffff", fg: "#111111", font: "Arial", rot: 0, blur: 0, noise: 0, glare: false, shrink: 1, jpeg: 90 },
  { name: "phone", fs: 18, width: 800, bg: "#f3ead2", fg: "#1a1a1a", font: "Arial Narrow", rot: 2.5, blur: 0.7, noise: 18, glare: false, shrink: 1, jpeg: 65 },
  { name: "glare", fs: 20, width: 850, bg: "#d8d4c8", fg: "#4a4a4a", font: "Arial", rot: 1.5, blur: 0.5, noise: 10, glare: true, shrink: 1, jpeg: 70 },
  { name: "lowres", fs: 14, width: 700, bg: "#ffffff", fg: "#222222", font: "Arial", rot: 4, blur: 0.9, noise: 20, glare: false, shrink: 0.6, jpeg: 40 },
];

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

function wrap(text: string, maxChars: number): string[] {
  const lines: string[] = [];
  let cur = "";
  for (const w of text.split(" ")) {
    if (cur && (cur + " " + w).length > maxChars) { lines.push(cur); cur = w; } else cur = cur ? cur + " " + w : w;
  }
  return cur ? [...lines, cur] : lines;
}

async function render(text: string, p: Profile, rand: () => number): Promise<Buffer> {
  const pad = 30;
  const lines = wrap(text, Math.floor((p.width - pad * 2) / (p.fs * 0.5)));
  const lh = Math.round(p.fs * 1.35);
  const height = pad * 2 + lines.length * lh;
  const glare = p.glare
    ? `<defs><radialGradient id="g" cx="${30 + rand() * 40}%" cy="${20 + rand() * 60}%" r="45%"><stop offset="0" stop-color="#fff" stop-opacity="0.85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#g)"/>`
    : "";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${p.width}" height="${height}"><rect width="100%" height="100%" fill="${p.bg}"/>` +
    `<g font-family="${p.font}, Arial, sans-serif" font-size="${p.fs}" fill="${p.fg}">` +
    lines.map((l, i) => `<text x="${pad}" y="${pad + p.fs + i * lh}">${esc(l)}</text>`).join("") + `</g>${glare}</svg>`;

  let img = sharp(Buffer.from(svg), { density: 96 }).png();
  if (p.rot) img = sharp(await img.toBuffer()).rotate((rand() < 0.5 ? -1 : 1) * p.rot * (0.5 + rand() * 0.5), { background: p.bg });
  if (p.blur) img = sharp(await img.png().toBuffer()).blur(p.blur);
  let buf = await img.png().toBuffer();
  const { width, height: h } = await sharp(buf).metadata();
  if (p.noise) {
    const noise = await sharp({ create: { width: width!, height: h!, channels: 3, background: "#808080", noise: { type: "gaussian", mean: 128, sigma: p.noise } } }).png().toBuffer();
    buf = await sharp(buf).composite([{ input: noise, blend: "soft-light" }]).png().toBuffer();
  }
  if (p.shrink < 1) {
    buf = await sharp(buf).resize(Math.round(width! * p.shrink)).png().toBuffer(); // low-res capture; not upscaled back
  }
  return sharp(buf).jpeg({ quality: p.jpeg }).toBuffer();
}

async function main() {
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });
  let n = 0;
  for (let i = 0; i < LABELS.length; i++) {
    for (const p of PROFILES) {
      const id = `${String(i).padStart(3, "0")}_${p.name}`;
      writeFileSync(join(OUT, `${id}.jpg`), await render(LABELS[i], p, rng(i * 31 + p.fs)));
      writeFileSync(join(OUT, `${id}.gt.txt`), LABELS[i] + "\n");
      n++;
    }
  }
  console.log(`wrote ${n} images to ${OUT}`);
}
main();
