import Groq from "groq-sdk";

// Created on first use so builds and imports don't require GROQ_API_KEY.
let groqClient: Groq | null = null;
export const groq = () => (groqClient ??= new Groq({ apiKey: process.env.GROQ_API_KEY }));
// Groq retires models without notice (llama-3.3-70b-versatile and llama-4-scout returned
// model_not_found in Nov 2026 and took every scan down): check
// `GET https://api.groq.com/openai/v1/models` before changing these.
// Free-tier limits are per model (qwen3.8-27b: 1,000 output tokens/min), so explanations run on
// a different model than the OCR fallback and can never starve it.
export const GROQ_MODEL = "qwen/qwen3.8-27b";          // vision OCR fallback
const EXPLAIN_MODEL = "openai/gpt-oss-20b";             // deferred ingredient explanations

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
  const completion = await groq().chat.completions.create({
    model: EXPLAIN_MODEL,
    reasoning_effort: "low",
    max_tokens: 200, // includes the model's reasoning tokens
    messages: [
      { role: "system", content: MODE_SYSTEM_PROMPTS[req.mode] },
      {
        role: "user",
        content: `In exactly 1-2 short sentences, explain the food ingredient "${req.ingredientName}" (category: ${req.category}) for a consumer scanning a label.
${req.context ? `Our evidence base says: ${req.context}\nStay consistent with it.` : ""}

Lead with the single most important thing: the main health concern, or why it's fine, or its main benefit. Be specific (name the concern), not vague. No preamble, no lists, no "in conclusion" — just the 1-2 sentences.`,
      },
    ],
  });

  const text = completion.choices[0]?.message?.content?.trim();
  if (!text) throw new Error("empty explanation"); // caller falls back to the KB reason
  return text;
}
