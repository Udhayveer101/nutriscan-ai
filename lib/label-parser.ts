// Deterministic ingredient-list parser: label text → clean ingredient names, in label order.
//
// Replaces the LLM extraction call that used to sit on every scan's critical path (≈0.3–19 s
// on Groq's free tier, and a hard outage when the model was retired). Normalisation the LLM
// used to do is already covered downstream: the ingredient index resolves E/INS/CAS codes,
// aliases, plurals and OCR typos, and the KB lookup reads raw label text.
// Self-check: `npx tsx scripts/bench-scan.ts`.

/** The ingredient declaration inside a full OCR transcript (falls back to the whole text). */
export function findIngredientSection(rawText: string): string {
  // A blank line right after "," ";" or "(" is a wrapped list, not the end of it (Tesseract
  // separates widely spaced lines with blank lines).
  rawText = rawText.replace(/([,;(])[ \t]*\n\s*\n\s*/g, "$1 ");
  const patterns = [
    /ingr[eé]dients?\s*:?\s*([\s\S]*?)(?:\n\s*\n|\bnutrition facts\b|\bsupplement facts\b|\bdirections\b|\bwarning\b|\bnet weight\b|$)/i,
    /ingr[eé]dients?\s*:?\s*([\s\S]*)/i,
  ];
  for (const pattern of patterns) {
    const match = rawText.match(pattern);
    // Any real content counts: "Ingredients: Peanuts" is a whole, valid list.
    if (match?.[1] && /[a-z0-9]{2}/i.test(match[1])) {
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

// ── OCR quality gate (shared by server AI OCR and in-browser Tesseract) ───────
// Structural check, not text length: does this look like a real ingredient
// declaration (comma-separated list, ingredient/E-number vocabulary)?
const E_NUMBER = /\be\s?-?\d{3}[a-z]?\b/i;
const ADDITIVE_WORDS = /\b(sodium|acid|extract|flavou?r|preservative|emulsifier|colou?r|starch|syrup|oil|lecithin|gum|sugar|salt)\b/i;

export function assessOcrQuality(rawText: string): { acceptable: boolean; confidence: number } {
  const section = findIngredientSection(rawText);
  const hasIngredientLabel = /ingr[eé]dients?\s*:/i.test(rawText);
  const itemCount = (section.match(/,/g) ?? []).length + 1;
  const hasENumber = E_NUMBER.test(section);
  const hasAdditiveWord = ADDITIVE_WORDS.test(section);

  // An explicit "Ingredients:" header is decisive; otherwise require a comma-separated
  // list plus at least one additive/E-number signal.
  const acceptable = hasIngredientLabel
    ? itemCount >= 2
    : itemCount >= 3 && (hasENumber || hasAdditiveWord);

  const confidence = acceptable
    ? Math.min(0.95, 0.6 + itemCount * 0.03 + (hasENumber ? 0.1 : 0) + (hasIngredientLabel ? 0.1 : 0))
    : Math.min(0.5, 0.15 + itemCount * 0.03);

  return { acceptable, confidence };
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
  // "Emulsifier: Soya Lecithin" — a role prefix before a colon is dropped like a bracket head.
  const role = /^([^:([]+):\s*(.+)$/.exec(p);
  if (role && FUNCTION_HEAD.test(role[1].trim())) p = role[2].trim();
  if (BARE_CODE.test(p)) p = `INS ${p}`; // "…: 322, 471" — a bare top-level number is an INS code
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

const COMPOUND_PREFIX = /^(?:high|low|whole|non|semi|multi|partially|fully|sodium|potassium|calcium|glucose|fructose|corn|soy|wheat|milk|freeze|spray|sun|stone|cold|reduced|fat|sugar|gluten|lactose|caffeine)$/i;

/** Label text (OCR transcript or pasted list) → sanitized ingredient names in label order. */
export function parseIngredientList(text: string): string[] {
  let section = findIngredientSection(text)
    // OCR splits a word across a line break ("emul-\nsifier") → rejoin. A real compound
    // ("high-\nfructose", "whole-\ngrain") keeps its hyphen; "mono-\nand di-" stays apart.
    // ponytail: fixed prefix list, extend it when a label shows another compound.
    .replace(/(\w*)([a-z])-[ \t]*\n\s*(?!(?:and|or)\b)([a-z])/gi, (_, w, c, d) =>
      `${w}${c}${COMPOUND_PREFIX.test(w + c) ? "-" : ""}${d}`)
    .replace(/\s*[•·]\s*/g, ", ");
  // Comma-separated lists wrap across lines; a list with no commas is one ingredient per line.
  section = /[,;]/.test(section) ? section.replace(/\s*\n\s*/g, " ") : section.replace(/\s*\n\s*/g, ", ");
  section = section.replace(/\s+&\s+/g, ", ");
  const out: string[] = [];
  for (const part of splitTopLevel(section)) expand(part, out);
  // Only an all-caps label is re-cased, so "PGPR" in a mixed-case list stays as printed.
  return sanitizeIngredients(/[a-z]/.test(section) ? out : out.map(tidyCase));
}
