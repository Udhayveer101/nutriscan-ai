import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";

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

// ── Public API ─────────────────────────────────────────────────────────────────

export async function extractTextFromImageFile(file: File): Promise<{
  text: string;
  ingredientText: string;
  confidence: number;
  ocrProvider: "gemini" | "groq";
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

  // Try Gemini first
  try {
    text = await ocrWithGemini(base64, mimeType);
  } catch (geminiErr) {
    const isQuota = isQuotaError(geminiErr);
    console.warn(
      isQuota
        ? "Gemini quota exceeded — falling back to Groq vision"
        : "Gemini OCR failed — falling back to Groq vision",
      geminiErr
    );

    // Fallback to Groq vision
    try {
      text = await ocrWithGroq(base64, mimeType);
      ocrProvider = "groq";
    } catch (groqErr) {
      console.error("Both Gemini and Groq OCR failed", groqErr);
      throw new Error("OCR_BOTH_FAILED");
    }
  }

  if (!text || text.length < 10) {
    // Gemini returned but empty — try Groq as fallback
    try {
      text = await ocrWithGroq(base64, mimeType);
      ocrProvider = "groq";
    } catch {
      // Both attempted — return whatever we have
    }
  }

  const ingredientText = findIngredientSection(text);
  const confidence = text.length > 200 ? 0.95 : text.length > 80 ? 0.80 : text.length > 20 ? 0.55 : 0.2;

  return { text, ingredientText, confidence, ocrProvider };
}
