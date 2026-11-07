import { GoogleGenerativeAI } from "@google/generative-ai";
import { groq, GROQ_MODEL } from "./gemini";
import { assessOcrQuality, findIngredientSection, parseIngredientList } from "./label-parser";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Nov 2026 bench on a rotated, downscaled label: gemini-3.1-flash-lite median 2.3 s with the
// same transcript as gemini-2.5-flash (4.5 s, thinking on). Groq vision is the fallback only:
// its free tier ranged 0.8–19 s (rate-limit queuing), so it gets no retries and a hard timeout.
const GEMINI_MODEL = "gemini-3.1-flash-lite";
const OCR_TIMEOUT_MS = 10_000;

const OCR_PROMPT = `You are reading a food product label. Extract ALL text visible on the label exactly as it appears.

Focus especially on:
- The INGREDIENTS list (may start with "Ingredients:", "INGREDIENTS:", "Ingrédients:" etc.)
- Any text in parentheses (these are sub-ingredients of the preceding item)
- "Contains less than X% of:" sections
- E-numbers like E211, E322, etc.
- Percentage values next to ingredients

Do NOT summarize or interpret — transcribe the text verbatim, preserving parentheses, commas, and structure exactly as seen on the label.
If the image quality is poor, do your best to read the text.

Output the raw transcribed text only. No explanations.`;

async function ocrWithGemini(imageBase64: string, mimeType: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL }, { timeout: OCR_TIMEOUT_MS });
  const result = await model.generateContent([
    { inlineData: { mimeType, data: imageBase64 } },
    { text: OCR_PROMPT },
  ]);
  return result.response.text().trim();
}

async function ocrWithGroq(imageBase64: string, mimeType: string): Promise<string> {
  const completion = await groq().chat.completions.create(
    {
      model: GROQ_MODEL,
      max_tokens: 1024,
      messages: [{
        role: "user",
        content: [
          { type: "image_url", image_url: { url: `data:${mimeType};base64,${imageBase64}` } },
          { type: "text", text: OCR_PROMPT },
        ],
      }],
    },
    { timeout: OCR_TIMEOUT_MS, maxRetries: 0 },
  );
  return completion.choices[0]?.message?.content?.trim() ?? "";
}

// The single object the upload endpoint returns. `ingredients` is canonical; `rawText`
// and `ingredientText` are for debugging and the UI preview only.
export interface StructuredOcr {
  ingredients: string[];
  rawText: string;
  ingredientText: string;
  confidence: number;
  ocrProvider: "gemini" | "groq";
}

export async function structuredOcrFromImageFile(file: File): Promise<StructuredOcr> {
  const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
  const name = file.name.toLowerCase();
  // Gemini reads HEIC/HEIF natively; labelling those bytes as JPEG (the old behaviour) fails.
  const mimeType =
    file.type ||
    (name.endsWith(".heic") ? "image/heic" :
     name.endsWith(".heif") ? "image/heif" :
     name.endsWith(".png")  ? "image/png"  :
     name.endsWith(".webp") ? "image/webp" :
     "image/jpeg");

  let text = "";
  let ocrProvider: "gemini" | "groq" = "gemini";
  let gate = { acceptable: false, confidence: 0 };

  try {
    text = await ocrWithGemini(base64, mimeType);
    gate = assessOcrQuality(text);
  } catch (err) {
    console.warn("Gemini OCR failed — falling back to Groq vision", err);
  }

  // Gemini errored or the text doesn't look like an ingredient list: try Groq vision and
  // keep whichever transcript structurally looks more like a real ingredient list.
  if (!gate.acceptable) {
    try {
      const groqText = await ocrWithGroq(base64, mimeType);
      const groqGate = assessOcrQuality(groqText);
      if (groqGate.confidence > gate.confidence) {
        text = groqText;
        gate = groqGate;
        ocrProvider = "groq";
      }
    } catch (err) {
      console.error("Groq vision OCR failed", err);
    }
  }

  if (!text) throw new Error("OCR_BOTH_FAILED");

  return {
    ingredients: parseIngredientList(text),
    rawText: text,
    ingredientText: findIngredientSection(text),
    confidence: gate.confidence,
    ocrProvider,
  };
}
