import Groq from "groq-sdk";

// Created on first use so builds and imports don't require GROQ_API_KEY.
// No retries: the SDK default (2 retries honouring a 429's retry-after) could hold a row for
// ~2 min once the free quota ran out — past the 60 s function limit, so the KB-text fallback
// was never written and the explanation stayed blank. Fail fast; callers fall back.
let groqClient: Groq | null = null;
export const groq = () =>
  (groqClient ??= new Groq({ apiKey: process.env.GROQ_API_KEY, maxRetries: 0, timeout: 10_000 }));
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
  context?: string;
}

// The flagged additives recur across scans (sodium benzoate, Red 40…), so a warm instance answers
// repeats without touching the free quota.
// ponytail: per-instance memory, a DB table if cold starts make the hit rate too low.
const explainCache = new Map<string, string>();

/**
 * One request per scan, not one per ingredient: Groq's free tier caps requests per day (1,000)
 * and output tokens per minute, and eight separate calls each repeated the system prompt and
 * reserved their own max_tokens — one scan could hit the per-minute cap alone.
 * Returns one entry per input, null where no AI text came back (caller uses the KB reason).
 * Numbered lines, not JSON: a reply cut off by max_tokens still yields every finished line.
 */
export async function generateIngredientExplanations(
  items: IngredientExplanationRequest[],
  mode: ExplanationMode
): Promise<(string | null)[]> {
  const key = (it: IngredientExplanationRequest) => `${mode}|${it.ingredientName.toLowerCase()}|${it.context ?? ""}`;
  const out = items.map((it) => explainCache.get(key(it)) ?? null);
  const todo = items.flatMap((it, i) => (out[i] === null ? [{ it, i }] : []));
  if (!todo.length) return out;

  const list = todo
    .map(({ it }, n) => `${n + 1}. ${it.ingredientName} (category: ${it.category})` +
      (it.context ? ` — our evidence base says: ${it.context}` : ""))
    .join("\n");
  const completion = await groq().chat.completions.create({
    model: EXPLAIN_MODEL,
    reasoning_effort: "low",
    max_tokens: 150 + 80 * todo.length, // includes the model's reasoning tokens
    messages: [
      { role: "system", content: MODE_SYSTEM_PROMPTS[mode] },
      {
        role: "user",
        content: `For each numbered food ingredient below, write exactly 1-2 short sentences for a consumer scanning a label. Where our evidence base is given, stay consistent with it.

Lead with the single most important thing: the main health concern, or why it's fine, or its main benefit. Be specific (name the concern), not vague. No preamble, no "in conclusion".

Reply with one line per ingredient, in the same order, formatted "<number>. <sentences>" — nothing else.

${list}`,
      },
    ],
  });

  // Numbered line → text; unnumbered lines continue the previous item (wrapped replies).
  const got = new Map<number, string>();
  let cur = -1;
  for (const line of (completion.choices[0]?.message?.content ?? "").split("\n")) {
    const m = line.trim().match(/^(\d+)[.)]\s+(.+)$/);
    if (m) { cur = Number(m[1]) - 1; if (!got.has(cur)) got.set(cur, m[2].trim()); else cur = -1; }
    else if (cur >= 0 && line.trim()) got.set(cur, `${got.get(cur)} ${line.trim()}`);
  }
  // Cut off by max_tokens: the last item is unfinished — drop it.
  if (completion.choices[0]?.finish_reason === "length" && cur >= 0) got.delete(cur);
  // Cache only a complete, one-line-per-item reply: a skipped and renumbered reply shifts texts
  // onto the wrong ingredient, and caching would spread that to later scans.
  const cacheable = got.size === todo.length && completion.choices[0]?.finish_reason !== "length";
  for (const [n, raw] of got) {
    const hit = todo[n];
    if (!hit) continue;
    let text = raw;
    const label = `${hit.it.ingredientName.toLowerCase()}:`; // "Red 40: …" repeats the row's own name
    if (text.toLowerCase().startsWith(label)) text = text.slice(label.length).trim();
    if (!text) continue;
    out[hit.i] = text;
    if (cacheable) {
      if (explainCache.size >= 5000) explainCache.clear();
      explainCache.set(key(hit.it), text);
    }
  }
  return out;
}
