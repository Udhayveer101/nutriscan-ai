// Scan-pipeline benchmark + Stage-5 sanitizer self-check.
//   Run: npx tsx scripts/bench-scan.ts
//
// The dominant scan-time cost was the per-ingredient explanation call. This script
// A/B-benchmarks the OLD prompt (150-200 word, 5-part) against the NEW prompt
// (1-2 sentences, max_tokens 90) on the same ingredients so the latency win is
// measured, not assumed (Phase 5). Needs GROQ_API_KEY (pass via
// `npx tsx --env-file=.env.local scripts/bench-scan.ts`); skips the live A/B if absent.
import Groq from "groq-sdk";
import { sanitizeIngredients } from "../lib/gemini";

// ── Stage 5 sanitizer self-check (always runs, no API needed) ─────────────────
function assert(cond: boolean, msg: string) { if (!cond) throw new Error("FAIL: " + msg); }
{
  const out = sanitizeIngredients([
    "Sugar", "sugar", "  Sugar  ",           // dedupe (case + whitespace)
    "Water", "", "  ", "123", "45mg",         // garbage: empty, numeric, nutrition
    "Nutrition Facts", "Calories 200",        // nutrition rows
    "www.brand.com",                          // url
    "x".repeat(200),                          // over-long OCR fragment
    "Citric Acid (E330)",                     // real, keep
    42, null,                                 // non-strings
  ] as unknown[]);
  assert(out.length === 3, `expected 3 survivors, got ${out.length}: ${JSON.stringify(out)}`);
  assert(out[0] === "Sugar" && out[1] === "Water" && out[2] === "Citric Acid (E330)", "wrong survivors: " + JSON.stringify(out));
  console.log("Stage 5 sanitizer self-check OK →", JSON.stringify(out));
}

const key = process.env.GROQ_API_KEY;
if (!key) {
  console.log("\n(no GROQ_API_KEY — skipping live explanation A/B benchmark)");
  process.exit(0);
}

const groq = new Groq({ apiKey: key });
const MODEL = "llama-3.3-70b-versatile";
const SYSTEM = "You are a straightforward food expert explaining ingredients to everyday consumers. Be honest about health risks.";
const SAMPLE = ["Sodium Benzoate", "Aspartame", "High Fructose Corn Syrup", "Citric Acid", "Red 40"];

const OLD_PROMPT = (n: string) => `Explain the food ingredient "${n}" (category: Food Additive).

Provide:
1. What it is and what it does in food
2. Why manufacturers use it
3. Documented health concerns backed by research
4. Who should especially avoid it
5. One-line verdict

Keep your response to 150-200 words.`;

const NEW_PROMPT = (n: string) => `In exactly 1-2 short sentences, explain the food ingredient "${n}" (category: Food Additive) for a consumer scanning a label. Lead with the single most important thing: the main health concern, or why it's fine. Be specific, not vague. No preamble, no lists.`;

async function run(label: string, prompt: (n: string) => string, maxTokens?: number) {
  const start = performance.now();
  const results = await Promise.all(SAMPLE.map((n) =>
    groq.chat.completions.create({
      model: MODEL,
      ...(maxTokens ? { max_tokens: maxTokens } : {}),
      messages: [{ role: "system", content: SYSTEM }, { role: "user", content: prompt(n) }],
    })
  ));
  const ms = performance.now() - start;
  const tokens = results.reduce((a, r) => a + (r.usage?.completion_tokens ?? 0), 0);
  const words = results.reduce((a, r) => a + (r.choices[0]?.message?.content?.split(/\s+/).length ?? 0), 0);
  console.log(`  ${label.padEnd(6)}  ${Math.round(ms).toString().padStart(5)} ms   ${String(tokens).padStart(4)} tok   ${String(words).padStart(4)} words`);
  return { ms, tokens, words };
}

(async () => {
  console.log(`\n=== Explanation A/B (${SAMPLE.length} ingredients, parallel) ===`);
  const oldR = await run("OLD", OLD_PROMPT);
  const newR = await run("NEW", NEW_PROMPT, 90);
  const pct = (a: number, b: number) => `${Math.round((1 - b / a) * 100)}%`;
  console.log(`\n  latency  −${pct(oldR.ms, newR.ms)}   output tokens −${pct(oldR.tokens, newR.tokens)}   words −${pct(oldR.words, newR.words)}`);
  console.log("  (single run; LLM latency is noisy — run a few times for a stable mean)\n");
})();
