// Deterministic ingredient-list parser: label text → clean ingredient names, in label order.
//
// Replaces the LLM extraction call that used to sit on every scan's critical path (≈0.3–19 s
// on Groq's free tier, and a hard outage when the model was retired). Normalisation the LLM
// used to do is already covered downstream: the ingredient index resolves E/INS/CAS codes,
// aliases, plurals and OCR typos, and the KB lookup reads raw label text.
// Self-check: `npx tsx scripts/bench-scan.ts`.

/** The ingredient declaration inside a full OCR transcript (falls back to the whole text). */
export function findIngredientSection(rawText: string): string {
  const patterns = [
    /ingr[eé]dients?\s*:?\s*([\s\S]*?)(?:\n\s*\n|\bnutrition facts\b|\bsupplement facts\b|\bdirections\b|\bwarning\b|\bnet weight\b|$)/i,
    /ingr[eé]dients?\s*:?\s*([\s\S]*)/i,
  ];
  for (const pattern of patterns) {
    const match = rawText.match(pattern);
    if (match?.[1] && match[1].trim().length > 10) {
      return match[1]
        .trim()
        // Trailing allergen statements ("CONTAINS: WHEAT, SOY.", "May contain nuts") are not ingredients.
        .replace(/\n?\bCONTAINS\b(?!\s+(?:less|\d))[^.]*\.?\s*$/im, "")
        .replace(/\n?\bMAY CONTAIN\b[^.]*\.?\s*$/im, "")
        .trim();
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

const GARBAGE = /^(nutrition|serving|calories?|total|per\s|daily value|\d+\s*(g|mg|kcal|%)|www\.|http)/i;

/** Drop empties, numbers, nutrition rows and over-long fragments; de-duplicate (case-insensitive). */
export function sanitizeIngredients(names: unknown[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of names) {
    if (typeof raw !== "string") continue;
    const name = raw.trim().replace(/\s+/g, " ");
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

/** Split on `,` `;` and "and/or" outside brackets; also on ". " sentence breaks ("Chocolate. Contains less than 2% of: …"). */
function splitTopLevel(s: string): string[] {
  const out: string[] = [];
  let depth = 0, cur = "";
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if ("([{".includes(c)) depth++;
    else if (")]}".includes(c)) depth = Math.max(0, depth - 1);
    // "Chocolate. Contains …" breaks; "Vit. C" and "2.5%" do not.
    const sentenceBreak = c === "." && depth === 0 && /^\s+[a-z]{3}/i.test(s.slice(i + 1));
    if (depth === 0 && (c === "," || c === ";" || sentenceBreak)) { out.push(cur); cur = ""; continue; }
    if (depth === 0 && /^and\/or\b/i.test(s.slice(i))) { out.push(cur); cur = ""; i += 5; continue; }
    cur += c;
  }
  out.push(cur);
  return out;
}

// Group headers that name a function, not a substance: "Emulsifiers (E322, E471)" lists two
// ingredients, so the header itself is dropped. Food headers ("Enriched Flour (…)") are kept.
const FUNCTION_HEAD = /^(?:emulsifiers?|leavening(?: agents?)?|raising agents?|acidity regulators?|acidulants?|preservatives?|colou?rs?|colou?rings?|stabili[sz]ers?|thickeners?|antioxidants?|sweeteners?|flavou?r enhancers?|humectants?|gelling agents?|firming agents?|anti-?caking agents?|glazing agents?|thickening agents?|vitamins?|minerals?|vitamins and minerals)$/i;
const LEAD_IN = /^(?:and\s+|contains?\s+(?:less than\s+)?\d+(?:[.,]\d+)?\s*%\s*(?:or less\s+)?of\s*:?\s*|less than\s+\d+(?:[.,]\d+)?\s*%\s*of\s*:?\s*|\d+(?:[.,]\d+)?\s*%\s*or less of\s*:?\s*)/i;
const BARE_CODE = /^\d{3,4}[a-z]?(?:\s*\(\s*[ivx]{1,4}\s*\))?$/i;
const ROMAN = /^(?:i|ii|iii|iv|v|vi|vii|viii|ix|x)$/;

/** ALL-CAPS OCR → Title Case, keeping codes ("E211") and roman numerals ("(ii)") intact. */
function tidyCase(s: string): string {
  if (/[a-z]/.test(s)) return s;
  return s.toLowerCase().replace(/[a-z]+/g, (w, at: number) =>
    ROMAN.test(w) && s[at - 1] === "(" ? w : w[0].toUpperCase() + w.slice(1));
}

// "Vegetable Oil (Sunflower, Corn)" means sunflower oil and corn oil, not the whole foods.
// (Not flour: "Enriched Flour (Niacin, Iron…)" lists what was added to the flour.)
const KIND_TAIL = /\b(oil|fat|starch)s?$/i;

function expand(part: string, out: string[], kind = ""): void {
  let p = part.replace(/\s+/g, " ").trim().replace(/[.*†:]+$/, "").trim();
  p = p.replace(LEAD_IN, "").trim();
  if (!p || FUNCTION_HEAD.test(p)) return; // a bare "Emulsifier" names a role, not an ingredient
  // "Head (a, b, c)" — a bracket group with several items is a compound ingredient.
  const m = /^([^([{]*)[([{](.*)[)\]}]\s*(?:\d+(?:[.,]\d+)?\s*%)?$/.exec(p);
  if (m && splitTopLevel(m[2]).length > 1) {
    const head = m[1].trim().replace(/[:\-–]+$/, "").trim();
    if (head && !FUNCTION_HEAD.test(head)) out.push(head);
    const tail = KIND_TAIL.exec(head)?.[1] ?? "";
    for (const child of splitTopLevel(m[2])) {
      const c = child.trim();
      expand(BARE_CODE.test(c) ? `INS ${c}` : c, out, tail);
    }
    return;
  }
  out.push(kind && !new RegExp(`\\b${kind}`, "i").test(p) && !/\d/.test(p) ? `${p} ${kind}` : p);
}

/** Label text (OCR transcript or pasted list) → sanitized ingredient names in label order. */
export function parseIngredientList(text: string): string[] {
  let section = findIngredientSection(text);
  // Comma-separated lists wrap across lines; a list with no commas is one ingredient per line.
  section = /[,;]/.test(section) ? section.replace(/\s*\n\s*/g, " ") : section.replace(/\s*\n\s*/g, ", ");
  section = section.replace(/\s+&\s+/g, ", ");
  const out: string[] = [];
  for (const part of splitTopLevel(section)) expand(part, out);
  // Only an all-caps label is re-cased, so "PGPR" in a mixed-case list stays as printed.
  return sanitizeIngredients(/[a-z]/.test(section) ? out : out.map(tidyCase));
}
