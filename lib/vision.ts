import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import { extractIngredientsFromText } from "./gemini";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── Gemini OCR ────────────────────────────────────────────────────────────────

async function ocrWithGemini(
  imageBase64: string,
  mimeType: string
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const safeMime = (
    mimeType.includes("heic") || mimeType.includes("heif") ? "image/jpeg" : mimeType
  ) as "image/jpeg" | "image/png" | "image/webp" | "image/gif";

  const result = await model.generateContent([
    { inlineData: { mimeType: safeMime, data: imageBase64 } },
    {
      text: `You are reading a food product label. Extract ALL text visible on the label exactly as it appears.

Focus especially on:
- The INGREDIENTS list (may start with "Ingredients:", "INGREDIENTS:", "Ingrédients:" etc.)
- Any text in parentheses (these are sub-ingredients of the preceding item)
- "Contains less than X% of:" sections
- E-numbers like E211, E322, etc.
- Percentage values next to ingredients

Do NOT summarize or interpret — transcribe the text verbatim, preserving parentheses, commas, and structure exactly as seen on the label.
If the image quality is poor, do your best to read the text.

Output the raw transcribed text only. No explanations.`,
    },
  ]);

  return result.response.text().trim();
}

// ── Groq Vision OCR (fallback) ────────────────────────────────────────────────

async function ocrWithGroq(
  imageBase64: string,
  mimeType: string
): Promise<string> {
  const safeMime = (
    mimeType.includes("heic") || mimeType.includes("heif") ? "image/jpeg" : mimeType
  );

  const completion = await groq.chat.completions.create({
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: { url: `data:${safeMime};base64,${imageBase64}` },
          },
          {
            type: "text",
            text: `You are reading a food product label. Extract ALL text visible on the label exactly as it appears.

Focus especially on:
- The INGREDIENTS list (may start with "Ingredients:", "INGREDIENTS:", "Ingrédients:" etc.)
- Any text in parentheses (sub-ingredients)
- "Contains less than X% of:" sections
- E-numbers like E211, E322, etc.
- Percentage values next to ingredients

Do NOT summarize — transcribe verbatim, preserving parentheses, commas and structure exactly as seen.

Output the raw transcribed text only. No explanations.`,
          },
        ],
      },
    ],
    max_tokens: 1024,
  });

  return completion.choices[0]?.message?.content?.trim() ?? "";
}

// ── Shared helpers ─────────────────────────────────────────────────────────────

function isQuotaError(err: unknown): boolean {
  const msg = String((err as { message?: string })?.message ?? "").toLowerCase();
  const status = (err as { status?: number })?.status;
  return status === 429 || msg.includes("quota") || msg.includes("rate limit") || msg.includes("resource_exhausted");
}

export function findIngredientSection(rawText: string): string {
  const patterns = [
    /ingredients?\s*:?\s*([\s\S]*?)(?:\n\s*\n|\bnutrition facts\b|\bsupplement facts\b|\bdirections\b|\bwarning\b|\bnet weight\b|$)/i,
    /ingredients?\s*:?\s*([\s\S]*)/i,
    /ingr[eé]dients?\s*:?\s*([\s\S]*?)(?:\n\s*\n|$)/i,
  ];

  for (const pattern of patterns) {
    const match = rawText.match(pattern);
    if (match?.[1] && match[1].trim().length > 10) {
      let section = match[1].trim();
      section = section.replace(/\n?\bCONTAINS\b(?!\s+less\s+than)[^.]*\.?\s*$/im, "").trim();
      section = section.replace(/\n?\bMAY CONTAIN\b[^.]*\.?\s*$/im, "").trim();
      return section;
    }
  }

  const lines = rawText.split("\n").filter(Boolean);
  const candidateLines = lines.filter((l) => l.split(",").length >= 3);
  if (candidateLines.length > 0) {
    return candidateLines
      .sort((a, b) => b.split(",").length - a.split(",").length)
      .slice(0, 3)
      .join(", ");
  }

  return rawText;
}

// ── Stage 2: OCR quality gate ────────────────────────────────────────────────
// Structural check, not text length: does this look like a real ingredient
// declaration (comma-separated list, ingredient/E-number vocabulary)?
const E_NUMBER = /\be\s?-?\d{3}[a-z]?\b/i;
const ADDITIVE_WORDS = /\b(sodium|acid|extract|flavou?r|preservative|emulsifier|colou?r|starch|syrup|oil|lecithin|gum|sugar|salt)\b/i;

export function assessOcrQuality(rawText: string): { acceptable: boolean; confidence: number; reasons: string[] } {
  const reasons: string[] = [];
  const section = findIngredientSection(rawText);
  const hasIngredientLabel = /ingr[eé]dients?\s*:/i.test(rawText);
  const commaCount = (section.match(/,/g) ?? []).length;
  const itemCount = commaCount + 1;
  const hasENumber = E_NUMBER.test(section);
  const hasAdditiveWord = ADDITIVE_WORDS.test(section);

  if (hasIngredientLabel) reasons.push("ingredient section header found");
  if (itemCount >= 3) reasons.push(`${itemCount} comma-separated items`);
  if (hasENumber) reasons.push("E-number detected");
  if (hasAdditiveWord) reasons.push("additive vocabulary detected");

  // Acceptable if it structurally resembles a real ingredient list — an explicit
  // "Ingredients:" header is decisive; otherwise require a comma-separated list
  // plus at least one additive/E-number signal.
  const acceptable = hasIngredientLabel
    ? itemCount >= 2
    : itemCount >= 3 && (hasENumber || hasAdditiveWord);

  const confidence = acceptable
    ? Math.min(0.95, 0.6 + itemCount * 0.03 + (hasENumber ? 0.1 : 0) + (hasIngredientLabel ? 0.1 : 0))
    : Math.min(0.5, 0.15 + itemCount * 0.03);

  return { acceptable, confidence, reasons };
}

// ── Stage 6: structured OCR contract ─────────────────────────────────────────
// The single object every downstream system consumes. Nothing downstream should
// read raw OCR strings — `ingredients` is the canonical, sanitized array.
export interface StructuredOcr {
  ingredients: string[];        // Stage 4/5 canonical, sanitized ingredient array
  rawText: string;              // raw OCR — reference/debug only, not for logic
  ingredientText: string;       // regex-extracted section — for the UI preview only
  confidence: number;           // structural OCR confidence (assessOcrQuality)
  ocrProvider: "gemini" | "groq";
  passesUsed: number;           // OCR passes run (1 = primary only, 2 = + fallback)
  enhancedUsed: boolean;        // Stage 3 enhanced retry — reserved (always false until built)
}

// ── Public API ─────────────────────────────────────────────────────────────────

export async function extractTextFromImageFile(file: File): Promise<{
  text: string;
  ingredientText: string;
  confidence: number;
  ocrProvider: "gemini" | "groq";
  passesUsed: number;
}> {
  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  const name = file.name.toLowerCase();
  const mimeType =
    file.type ||
    (name.endsWith(".heic") ? "image/jpeg" :
     name.endsWith(".heif") ? "image/jpeg" :
     name.endsWith(".png")  ? "image/png"  :
     "image/jpeg");

  let text = "";
  let ocrProvider: "gemini" | "groq" = "gemini";
  let gate = { acceptable: false, confidence: 0, reasons: [] as string[] };
  let passesUsed = 0;

  // Stage 1: OCR pass 1 (Gemini primary)
  try {
    text = await ocrWithGemini(base64, mimeType);
    passesUsed = 1;
    gate = assessOcrQuality(text);
  } catch (geminiErr) {
    const isQuota = isQuotaError(geminiErr);
    console.warn(
      isQuota
        ? "Gemini quota exceeded — falling back to Groq vision"
        : "Gemini OCR failed — falling back to Groq vision",
      geminiErr
    );
  }

  // Stage 2/3: quality gate failed (or Gemini errored) — retry with Groq vision
  // and keep whichever pass structurally looks more like a real ingredient list.
  if (!gate.acceptable) {
    try {
      const groqText = await ocrWithGroq(base64, mimeType);
      passesUsed += 1;
      const groqGate = assessOcrQuality(groqText);
      if (groqGate.confidence > gate.confidence) {
        text = groqText;
        gate = groqGate;
        ocrProvider = "groq";
      }
    } catch (groqErr) {
      if (!text) {
        console.error("Both Gemini and Groq OCR failed", groqErr);
        throw new Error("OCR_BOTH_FAILED");
      }
      // Gemini gave us something, even if it failed the quality gate — degrade gracefully.
    }
  }

  if (!text) throw new Error("OCR_BOTH_FAILED");

  const ingredientText = findIngredientSection(text);

  return { text, ingredientText, confidence: gate.confidence, ocrProvider, passesUsed };
}

// Stage 4 + 6: OCR an image and return the full structured contract. This is the
// entry point the upload endpoint calls — OCR → structure → sanitize, once.
export async function structuredOcrFromImageFile(file: File): Promise<StructuredOcr> {
  const { text, ingredientText, confidence, ocrProvider, passesUsed } =
    await extractTextFromImageFile(file);

  // Stage 4/5: raw OCR → canonical sanitized ingredient array (extract already sanitizes).
  const ingredients = await extractIngredientsFromText(text);

  return {
    ingredients,
    rawText: text,
    ingredientText,
    confidence,
    ocrProvider,
    passesUsed,
    enhancedUsed: false, // ponytail: flips true when Stage 3 enhanced-retry lands
  };
}
