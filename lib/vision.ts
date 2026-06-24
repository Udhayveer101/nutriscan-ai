import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function extractTextFromImage(
  imageBase64: string,
  mimeType = "image/jpeg"
): Promise<{ text: string; confidence: number }> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  // HEIC → treat as jpeg for the API
  const safeMime = (
    mimeType.includes("heic") || mimeType.includes("heif") ? "image/jpeg" : mimeType
  ) as "image/jpeg" | "image/png" | "image/webp" | "image/gif";

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: safeMime,
        data: imageBase64,
      },
    },
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

  const text = result.response.text().trim();
  const confidence = text.length > 200 ? 0.95 : text.length > 80 ? 0.80 : text.length > 20 ? 0.55 : 0.2;

  return { text, confidence };
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

export async function extractTextFromImageFile(file: File): Promise<{
  text: string;
  ingredientText: string;
  confidence: number;
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

  const { text, confidence } = await extractTextFromImage(base64, mimeType);
  const ingredientText = findIngredientSection(text);

  return { text, ingredientText, confidence };
}
