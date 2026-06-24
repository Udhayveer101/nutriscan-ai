import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = "llama-3.3-70b-versatile";

async function withRetry<T>(fn: () => Promise<T>, retries = 2, delayMs = 500): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (i < retries) await new Promise((r) => setTimeout(r, delayMs * (i + 1)));
    }
  }
  throw lastErr;
}

const HONESTY_INSTRUCTION = `Be honest and direct. Do not sugarcoat health risks. If an ingredient has well-documented health concerns backed by credible sources (WHO, FDA, peer-reviewed studies), state them clearly. Do not use vague reassuring language like "generally considered safe" for ingredients with known risks. Reference specific studies or regulatory positions where relevant.`;

export type ExplanationMode = "BEGINNER" | "PARENT" | "ATHLETE" | "SCIENTIFIC";

const MODE_SYSTEM_PROMPTS: Record<ExplanationMode, string> = {
  BEGINNER: `You are a straightforward food expert explaining ingredients to everyday consumers.
Use simple, clear language. Avoid jargon. Be honest — if something is unhealthy, say so clearly without sugarcoating.
If an ingredient has documented health risks, state them plainly. Don't use vague reassuring phrases for known harmful ingredients.
${HONESTY_INSTRUCTION}`,

  PARENT: `You are a nutritionist advising parents about food safety. Be protective and honest.
If an ingredient is harmful — especially for children — say so directly and clearly.
Do not downplay risks. Parents need accurate information to protect their children.
${HONESTY_INSTRUCTION}`,

  ATHLETE: `You are a sports nutritionist advising athletes. Be direct and evidence-based.
Explain exactly how each ingredient affects performance, recovery, and health — both positively and negatively.
Do not sugarcoat negative impacts on athletic performance or long-term health.
${HONESTY_INSTRUCTION}`,

  SCIENTIFIC: `You are a food scientist providing rigorous evidence-based analysis.
Include chemical details, mechanism of action, ADI values, metabolic pathways where relevant.
Cite regulatory status (FDA GRAS, EFSA opinions, WHO JECFA) and flag where regulatory approval does NOT equal safety.
Be precise, cite specific studies or bodies of evidence, and do not shy away from stating known risks.
${HONESTY_INSTRUCTION}`,
};

export interface IngredientExplanationRequest {
  ingredientName: string;
  category: string;
  mode: ExplanationMode;
  context?: string;
}

export async function generateIngredientExplanation(
  req: IngredientExplanationRequest
): Promise<string> {
  const completion = await withRetry(() => groq.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: MODE_SYSTEM_PROMPTS[req.mode] },
      {
        role: "user",
        content: `Explain the food ingredient "${req.ingredientName}" (category: ${req.category}).
${req.context ? `Context: ${req.context}` : ""}

Provide:
1. What it is and what it does in food
2. Why manufacturers use it (often cost-cutting or shelf life — be honest about this)
3. Documented health concerns backed by research — be specific and direct, not vague
4. Who should especially avoid it
5. One-line verdict: is it something consumers should try to avoid?

Keep your response to 150-200 words. Be honest and direct — do not sugarcoat known risks.`,
      },
    ],
  }));

  return completion.choices[0]?.message?.content ?? "Analysis unavailable.";
}

export async function extractIngredientsFromText(text: string): Promise<string[]> {
  const completion = await withRetry(() => groq.chat.completions.create({
    model: MODEL,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are a food scientist that extracts and normalizes food label ingredient lists from OCR-scanned text.

KEY RULES — follow every one:
1. PARENTHESES = sub-ingredients of the preceding item.
   "Vegetable Oil (safflower, soybean, sunflower)" → extract: "Vegetable Oil", "Safflower Oil", "Soybean Oil", "Sunflower Oil"
2. "Contains less than X% of: A, B, C" → extract A, B, C as individual ingredients.
3. "CONTAINS WHEAT, EGG, SOY" (ALL CAPS at end) = allergen declaration → do NOT include as ingredients.
4. "May contain traces of..." → do NOT include.
5. Normalize common abbreviations and variants:
   - "HFCS" → "High Fructose Corn Syrup"
   - "E211" or "E-211" → "Sodium Benzoate"
   - "Vit. C" / "Vit C" → "Ascorbic Acid (Vitamin C)"
   - "BHA" → "Butylated Hydroxyanisole (BHA)"
   - "BHT" → "Butylated Hydroxytoluene (BHT)"
   - "TBHQ" → "Tertiary Butylhydroquinone (TBHQ)"
   - "MSG" → "Monosodium Glutamate"
   - "ca." / "calc." → "Calcium"
   - Common OCR errors: "S0dium" → "Sodium", "Ca1cium" → "Calcium"
6. Fix obvious OCR garbling: "ingreclient" → "ingredient", "Sodiurn" → "Sodium", "comstarch" → "cornstarch"
7. Strip: serving size text, nutrition facts numbers, cooking instructions, percent daily values, brand names.
8. De-duplicate: if the same ingredient appears as both parent and sub-ingredient, include it only once.
9. Preserve meaningful qualifiers: "Enriched Wheat Flour", "Hydrogenated Soybean Oil", "Partially Skimmed Milk".
10. If the text is very garbled (low OCR quality), do your best to identify recognizable ingredient names.

Return ONLY a JSON object. No markdown, no explanation.`,
      },
      {
        role: "user",
        content: `Extract all food ingredients from the text below. Apply all normalization rules. "CONTAINS X, Y" at end = allergen warning, not ingredients — skip it.

TEXT:
${text}

Response format: {"ingredients": ["Ingredient One", "Ingredient Two", ...]}`,
      },
    ],
  }));

  const responseText = completion.choices[0]?.message?.content ?? "{}";

  try {
    const parsed = JSON.parse(responseText);
    const ingredients = parsed.ingredients ?? parsed.items ?? Object.values(parsed)[0];
    return Array.isArray(ingredients) ? ingredients : [];
  } catch {
    return [];
  }
}

export async function generateProductSummary(
  productName: string,
  ingredients: string[],
  scoreBreakdown: Record<string, number | string>,
  mode: ExplanationMode
): Promise<string> {
  const completion = await withRetry(() => groq.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: MODE_SYSTEM_PROMPTS[mode] },
      {
        role: "user",
        content: `Provide a brief product analysis summary for "${productName}".

Key ingredients found: ${ingredients.slice(0, 10).join(", ")}
Overall health score: ${scoreBreakdown.overall}/100 (Grade: ${scoreBreakdown.gradeLabel})

Give a 2-3 sentence honest summary. If the product has many unhealthy ingredients, say so clearly.
Do not soften the verdict for unhealthy products. Consumers deserve accurate information.
If the score is below 50, this is an unhealthy product and your summary should reflect that.`,
      },
    ],
  }));

  return completion.choices[0]?.message?.content ?? "";
}
