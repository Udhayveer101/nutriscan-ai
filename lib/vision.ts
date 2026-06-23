import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Groq vision model — far better than Tesseract at reading food labels
// Works in serverless (Vercel) with no binary dependencies
const VISION_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";

export async function extractTextFromImage(
  imageBase64: string,
  mimeType = "image/jpeg"
): Promise<{ text: string; confidence: number }> {
  // Normalise HEIC → treat as jpeg for the API (Groq accepts common image types)
  const safeMime =
    mimeType.includes("heic") || mimeType.includes("heif")
      ? "image/jpeg"
      : mimeType;

  const completion = await groq.chat.completions.create({
    model: VISION_MODEL,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: `data:${safeMime};base64,${imageBase64}`,
            },
          },
          {
            type: "text",
            text: `You are reading a food product label. Extract ALL text visible on the label exactly as it appears.

Focus especially on:
- The INGREDIENTS list (may start with "Ingredients:", "INGREDIENTS:", "Ingrédients:" etc.)
- Any text in parentheses (these are sub-ingredients)
- "Contains less than X% of:" sections
- E-numbers like E211, E322, etc.
- Percentage values next to ingredients

Do NOT summarize or interpret — transcribe the text verbatim, preserving parentheses, commas, and structure exactly as seen.
If the image quality is poor, do your best to read the text.

Output the raw transcribed text only. No explanations.`,
          },
        ],
      },
    ],
    max_tokens: 2048,
  });

  const text = completion.choices[0]?.message?.content?.trim() ?? "";
  const confidence = text.length > 200 ? 0.92 : text.length > 80 ? 0.75 : text.length > 20 ? 0.5 : 0.2;

  return { text, confidence };
}

export function findIngredientSection(rawText: string): string {
  const text = rawText;

  const patterns = [
    /ingredients?\s*:?\s*([\s\S]*?)(?:\n\s*\n|\bnutrition facts\b|\bsupplement facts\b|\bdirections\b|\bwarning\b|\bnet weight\b|$)/i,
    /ingredients?\s*:?\s*([\s\S]*)/i,
    /ingr[eé]dients?\s*:?\s*([\s\S]*?)(?:\n\s*\n|$)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1] && match[1].trim().length > 10) {
      let section = match[1].trim();
      // Strip standalone allergen declaration at end
      section = section.replace(/\n?\bCONTAINS\b(?!\s+less\s+than)[^.]*\.?\s*$/im, "").trim();
      section = section.replace(/\n?\bMAY CONTAIN\b[^.]*\.?\s*$/im, "").trim();
      return section;
    }
  }

  // Fallback: find lines with lots of commas (ingredient lists)
  const lines = text.split("\n").filter(Boolean);
  const candidateLines = lines.filter((l) => l.split(",").length >= 3);
  if (candidateLines.length > 0) {
    return candidateLines
      .sort((a, b) => b.split(",").length - a.split(",").length)
      .slice(0, 3)
      .join(", ");
  }

  return text;
}

export async function extractTextFromImageFile(file: File): Promise<{
  text: string;
  ingredientText: string;
  confidence: number;
}> {
  const arrayBuffer = await file.arrayBuffer();

  // For HEIC, the base64 is passed as-is — Groq handles the conversion server-side
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
