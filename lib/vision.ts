import tesseract from "node-tesseract-ocr";
import sharp from "sharp";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

// Convert HEIC/HEIF to JPEG via sharp (Tesseract can't read HEIC directly)
async function convertHeicToJpeg(inputPath: string, outputPath: string): Promise<void> {
  await sharp(inputPath).jpeg({ quality: 95 }).toFile(outputPath);
}

// Pre-process image with sharp to maximise OCR accuracy
async function preprocessImage(inputPath: string, outputPath: string): Promise<void> {
  await sharp(inputPath)
    .resize({ width: 2400, withoutEnlargement: false }) // upscale small images
    .grayscale()
    .normalise() // stretch contrast to full range
    .sharpen({ sigma: 1.5, m1: 1.5, m2: 0.7 }) // sharpen edges
    .linear(1.4, -30) // increase contrast: multiply + subtract
    .threshold(145) // binarise — white bg, black text
    .png()
    .toFile(outputPath);
}

async function runTesseract(imgPath: string, psm: number): Promise<string> {
  try {
    return await tesseract.recognize(imgPath, {
      lang: "eng",
      oem: 1, // LSTM only
      psm,
    });
  } catch {
    return "";
  }
}

export async function extractTextFromImage(
  imageBase64: string,
  mimeType = "image/jpeg"
): Promise<{ text: string; confidence: number }> {
  const isHeic = mimeType.includes("heic") || mimeType.includes("heif");
  const ext = isHeic ? ".heic" : mimeType.includes("png") ? ".png" : ".jpg";
  const id = Date.now();
  const rawFile = path.join(os.tmpdir(), `nutriscan-raw-${id}${ext}`);
  const convertedFile = path.join(os.tmpdir(), `nutriscan-converted-${id}.jpg`);
  const processedFile = path.join(os.tmpdir(), `nutriscan-proc-${id}.png`);

  try {
    fs.writeFileSync(rawFile, Buffer.from(imageBase64, "base64"));

    // Convert HEIC → JPEG first so sharp & Tesseract can handle it
    if (isHeic) await convertHeicToJpeg(rawFile, convertedFile);

    // Use converted JPEG if HEIC, otherwise original
    const sourceFile = isHeic ? convertedFile : rawFile;

    // Pre-process for OCR
    await preprocessImage(sourceFile, processedFile);

    // Try multiple PSM modes and pick the longest result (most text extracted)
    // PSM 6 = uniform block of text (best for ingredient panels)
    // PSM 4 = single column of text of variable sizes
    // PSM 3 = fully automatic (fallback)
    const [text6, text4, text3] = await Promise.all([
      runTesseract(processedFile, 6),
      runTesseract(processedFile, 4),
      runTesseract(processedFile, 3),
    ]);

    // Also try on source image in case preprocessing hurts a clear image
    const textRaw = await runTesseract(sourceFile, 6);

    // Pick the result with the most ingredient-like content
    const candidates = [text6, text4, text3, textRaw].map((t) => cleanOcrText(t));
    const best = candidates.reduce((a, b) => score(a) >= score(b) ? a : b);

    const confidence = best.length > 200 ? 0.92 : best.length > 100 ? 0.78 : best.length > 40 ? 0.55 : 0.3;
    return { text: best, confidence };
  } finally {
    for (const f of [rawFile, convertedFile, processedFile]) {
      try { if (fs.existsSync(f)) fs.unlinkSync(f); } catch { /* ignore */ }
    }
  }
}

// Score a candidate OCR result for how ingredient-like it is
function score(text: string): number {
  if (!text) return 0;
  const lower = text.toLowerCase();
  let s = text.length;
  // Bonus for ingredient keywords
  if (/ingredient/i.test(text)) s += 300;
  if (lower.includes("sugar")) s += 100;
  if (lower.includes("salt")) s += 80;
  if (lower.includes("oil")) s += 80;
  // Bonus for lots of commas (ingredient lists are comma-separated)
  s += (text.match(/,/g) ?? []).length * 15;
  // Bonus for parentheses (sub-ingredient notation)
  s += (text.match(/[()]/g) ?? []).length * 10;
  return s;
}

// Fix common Tesseract OCR errors in food labels
function cleanOcrText(text: string): string {
  if (!text) return "";
  return text
    // Common OCR symbol misreads
    .replace(/\|/g, "I")
    .replace(/l(?=[a-z])/g, "l") // keep lowercase l
    .replace(/0(?=[a-zA-Z])/g, "O") // 0 before letters → O
    .replace(/(?<=[a-zA-Z])0/g, "o") // 0 after letters → o
    .replace(/\bS0dium\b/gi, "Sodium")
    .replace(/\bCa1cium\b/gi, "Calcium")
    .replace(/\bMagnes1um\b/gi, "Magnesium")
    // Fix broken lines within ingredient list (single newline in middle of comma list)
    .replace(/,\s*\n\s*/g, ", ")
    // Collapse excessive whitespace
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function findIngredientSection(rawText: string): string {
  const text = rawText;

  // --- Priority patterns: explicit "Ingredients:" header ---
  const patterns = [
    // Stop at double newline, nutrition facts, supplement facts, directions, or end
    /ingredients?\s*:?\s*([\s\S]*?)(?:\n\s*\n|\bnutrition facts\b|\bsupplement facts\b|\bdirections\b|\bwarning\b|\bnet weight\b|\$)/i,
    /ingredients?\s*:?\s*([\s\S]*)/i,
    // Indian labels: "INGREDIENTS:" in all caps
    /INGREDIENTS\s*:?\s*([\s\S]*?)(?:\n\s*\n|NUTRITION|NET WT|$)/,
    // French bilingual labels: "Ingrédients:"
    /ingr[eé]dients?\s*:?\s*([\s\S]*?)(?:\n\s*\n|$)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1] && match[1].trim().length > 10) {
      let section = match[1].trim();

      // Strip standalone allergen declaration at end: "CONTAINS WHEAT, EGG..."
      // but NOT "contains less than 2% of:" which is still part of ingredients
      section = section.replace(/\n?\bCONTAINS\b(?!\s+less\s+than)[^.]*\.?\s*$/im, "").trim();
      // Strip "May contain traces of..."
      section = section.replace(/\n?\bMAY CONTAIN\b[^.]*\.?\s*$/im, "").trim();

      return section;
    }
  }

  // --- Fallback 1: find lines that look like ingredient lists (≥3 commas) ---
  const lines = text.split("\n").filter(Boolean);
  const candidateLines = lines.filter((l) => l.split(",").length >= 3);
  if (candidateLines.length > 0) {
    // Join consecutive candidate lines (ingredient list can span multiple lines)
    return candidateLines
      .sort((a, b) => b.split(",").length - a.split(",").length)
      .slice(0, 3)
      .join(", ");
  }

  // --- Fallback 2: return full text and let the AI sort it out ---
  return text;
}

export async function extractTextFromImageFile(file: File): Promise<{
  text: string;
  ingredientText: string;
  confidence: number;
}> {
  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  // Browsers often report empty type for HEIC — infer from extension
  const name = file.name.toLowerCase();
  const mimeType =
    file.type ||
    (name.endsWith(".heic") ? "image/heic" :
     name.endsWith(".heif") ? "image/heif" :
     name.endsWith(".png")  ? "image/png"  :
     "image/jpeg");

  const { text, confidence } = await extractTextFromImage(base64, mimeType);
  const ingredientText = findIngredientSection(text);

  return { text, ingredientText, confidence };
}
