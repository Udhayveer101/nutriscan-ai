import Groq from "groq-sdk";

// Created on first use so builds and imports don't require GROQ_API_KEY.
let groqClient: Groq | null = null;
// maxRetries 0: withRetry below already retries; the SDK's own 2 retries stacked on top
// turned one failing call into 9 attempts and ~20 s before the user saw an error.
export const groqOptions = { maxRetries: 0, timeout: 15_000 };
const groq = () => (groqClient ??= new Groq({ apiKey: process.env.GROQ_API_KEY, ...groqOptions }));
// Groq shut down llama-3.3-70b-versatile on 2026-08-16. Qwen 3.8 27B is Groq's current
// multimodal instruct model (also used for vision OCR fallback); reasoning is switched off
// so the small max_tokens budgets below go to the answer, not thinking tokens.
export const GROQ_MODEL = "qwen/qwen3.8-27b";
const MODEL = GROQ_MODEL;

// Defensive: drop any <think>…</think> block a reasoning-capable model might still emit.
export const stripThinking = (s: string | null | undefined) =>
  (s ?? "").replace(/<think>[\s\S]*?<\/think>/g, "").trim();

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
  const completion = await withRetry(() => groq().chat.completions.create({
    model: MODEL,
    reasoning_effort: "none",
    max_tokens: 90,
    messages: [
      { role: "system", content: MODE_SYSTEM_PROMPTS[req.mode] },
      {
        role: "user",
        content: `In exactly 1-2 short sentences, explain the food ingredient "${req.ingredientName}" (category: ${req.category}) for a consumer scanning a label.
${req.context ? `Context: ${req.context}` : ""}

Lead with the single most important thing: the main health concern, or why it's fine, or its main benefit. Be specific (name the concern), not vague. No preamble, no lists, no "in conclusion" — just the 1-2 sentences.`,
      },
    ],
  }));

  return stripThinking(completion.choices[0]?.message?.content) || "Analysis unavailable.";
}

// Extraction must never be a single point of failure: if Groq is down, rate-limited or
// returns nothing usable, fall back to a deterministic parse of the label text.
export async function extractIngredientsFromText(text: string): Promise<string[]> {
  try {
    const fromLlm = await extractIngredientsWithLlm(text);
    if (fromLlm.length) return fromLlm;
  } catch (err) {
    console.error("LLM ingredient extraction failed — using local parser", err);
  }
  return parseIngredientsLocally(text);
}

async function extractIngredientsWithLlm(text: string): Promise<string[]> {
  const completion = await withRetry(() => groq().chat.completions.create({
    model: MODEL,
    reasoning_effort: "none",
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

  const responseText = stripThinking(completion.choices[0]?.message?.content) || "{}";

  try {
    const parsed = JSON.parse(responseText);
    const ingredients = parsed.ingredients ?? parsed.items ?? Object.values(parsed)[0];
    return sanitizeIngredients(Array.isArray(ingredients) ? ingredients : []);
  } catch {
    return [];
  }
}

// Deterministic label parser (fallback). Splits on top-level commas/semicolons, expands
// "Parent (a, b)" into parent + children, keeps code/percentage brackets on the name
// ("Sodium Benzoate (E211)"), and drops allergen statements ("Contains: …", "May contain …").
const ALLERGEN_TAIL = /\b(?:contains|allergy advice|allergens?|may contain|may also contain|produced in a factory|made in a factory)\b\s*:?/i;

function splitTopLevel(s: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = "";
  for (const ch of s) {
    if (ch === "(" || ch === "[") depth++;
    else if (ch === ")" || ch === "]") depth = Math.max(0, depth - 1);
    if ((ch === "," || ch === ";") && depth === 0) {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out;
}

function cleanName(s: string): string {
  return s
    .replace(/\(?\s*\d+(?:[.,]\d+)?\s*%\s*\)?/g, "") // "(87%)", "10%"
    .replace(/^\s*(?:and\/or|and|or)\s+/i, "")
    .replace(/[.:*]+\s*$/, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseIngredientsLocally(text: string): string[] {
  let body = text.replace(/\r?\n/g, " ");
  const start = body.search(/ingredients?\s*:/i);
  if (start >= 0) body = body.slice(start).replace(/^ingredients?\s*:/i, "");
  const tail = body.search(ALLERGEN_TAIL);
  if (tail > 0) body = body.slice(0, tail);

  const names: string[] = [];
  const walk = (segment: string) => {
    const m = segment.match(/^([^([]*)[([](.*)[)\]]\s*([^()[\]]*)$/);
    if (!m) {
      names.push(cleanName(segment));
      return;
    }
    const [, parent, inner, after] = m;
    // A bracket holding only codes/percentages qualifies the name: keep it attached.
    if (/^\s*(?:(?:e|ins)\s*-?\s*)?\d{3,4}[a-h]?(?:\s*\(?[ivx]{1,4}\)?)?(?:\s*[,&/]\s*(?:(?:e|ins)\s*-?\s*)?\d{3,4}[a-h]?(?:\s*\(?[ivx]{1,4}\)?)?)*\s*$/i.test(inner)) {
      names.push(cleanName(`${parent} (${inner.trim()})${after ? " " + after : ""}`));
      return;
    }
    if (/^\s*\d+(?:[.,]\d+)?\s*%\s*$/.test(inner)) {
      names.push(cleanName(`${parent} ${after}`));
      return;
    }
    if (cleanName(parent)) names.push(cleanName(parent));
    for (const child of splitTopLevel(inner)) walk(child.trim());
  };
  for (const seg of splitTopLevel(body)) if (seg.trim()) walk(seg.trim());
  return sanitizeIngredients(names);
}

// ── Stage 5: deterministic sanitization ───────────────────────────────────────
// The LLM already strips most non-ingredient text; this is the safety net that
// removes garbage the model may leak through and de-duplicates. Pure + testable —
// see scripts/bench-scan.ts for the self-check.
const GARBAGE = /^(nutrition|serving|calories?|total|per\s|daily value|\d+\s*(g|mg|kcal|%)|www\.|http)/i;

export function sanitizeIngredients(names: unknown[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of names) {
    if (typeof raw !== "string") continue;
    const name = raw.trim().replace(/\s+/g, " ");
    // Drop empties, pure numbers/punctuation, over-long OCR fragments, nutrition rows.
    if (name.length < 2 || name.length > 120) continue;
    if (!/[a-z]/i.test(name)) continue;
    if (GARBAGE.test(name)) continue;
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(name);
  }
  return out;
}

export async function generateProductSummary(
  productName: string,
  ingredients: string[],
  scoreBreakdown: Record<string, number | string>,
  mode: ExplanationMode
): Promise<string> {
  const completion = await withRetry(() => groq().chat.completions.create({
    model: MODEL,
    reasoning_effort: "none",
    max_tokens: 120,
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

  return stripThinking(completion.choices[0]?.message?.content);
}
