// Ingredient evaluation engine — redesigned from first principles.
//
// Methodology (see vault Methodology.md):
//   1. NOVA processing classification sets the SCORE CEILING (a bag of chips cannot
//      score like an apple, no matter the position weighting). This is the fix for
//      the old "start at 65 and subtract" model that let ultra-processed foods rank high.
//   2. Composition quality — position-weighted (label order ≈ descending weight),
//      graded against the cited additive knowledge base (lib/additives.ts).
//   3. Additive burden — count × severity of flagged additives.
//   4. Hard caps — any CRITICAL (banned/carcinogenic) additive caps the grade; NOVA-4
//      ultra-processed foods are capped below "healthy".
//   5. Interactions — documented combination risks subtract (lib/interactions.ts).
//   6. Explainability — every ingredient gets a reason + evidence confidence.

import { lookupAdditive, isWholeFood, type ConcernLevel, type Evidence } from "./additives";
import { detectInteractions, type InteractionHit } from "./interactions";

export type ScoreGrade = "A_PLUS" | "A" | "B" | "C" | "D" | "F";

export interface AllergenMatch {
  allergen: string;
  matchedIngredient: string;
}

// ── Allergens (unchanged domain data) ────────────────────────────────────────
const ALLERGEN_MAP: Record<string, string[]> = {
  "Gluten / Wheat":   ["wheat", "flour", "gluten", "semolina", "spelt", "kamut", "barley", "rye", "oat", "triticale", "enriched flour", "wheat starch", "wheat germ", "malt"],
  "Milk / Dairy":     ["milk", "lactose", "whey", "casein", "butter", "cream", "cheese", "yogurt", "lactalbumin", "lactoglobulin", "dairy"],
  "Eggs":             ["egg", "albumin", "globulin", "lysozyme", "mayonnaise", "meringue", "ovalbumin"],
  "Peanuts":          ["peanut", "groundnut", "monkey nut", "arachis oil"],
  "Tree Nuts":        ["almond", "cashew", "walnut", "pecan", "pistachio", "macadamia", "hazelnut", "brazil nut", "chestnut", "coconut"],
  "Soy":              ["soy", "soya", "tofu", "tempeh", "miso", "edamame", "soybean", "soy lecithin", "soy protein"],
  "Fish":             ["fish", "cod", "salmon", "tuna", "trout", "haddock", "pollock", "tilapia", "anchovy", "sardine", "halibut"],
  "Shellfish":        ["shrimp", "prawn", "crab", "lobster", "crayfish", "scallop", "clam", "oyster", "mussel", "squid", "shellfish"],
  "Sesame":           ["sesame", "tahini", "sesame oil", "sesame seed"],
  "Mustard":          ["mustard", "mustard seed", "mustard oil", "mustard flour"],
  "Celery":           ["celery", "celeriac"],
  "Lupin":            ["lupin", "lupine"],
  "Sulphites":        ["sulphite", "sulfite", "sulphur dioxide", "sulfur dioxide", "e220", "e221", "e222", "e223", "e224", "e225", "e226", "e227", "e228"],
  "Molluscs":         ["mollusc", "mollusk", "squid", "octopus", "snail", "abalone"],
};

export function detectAllergens(ingredientNames: string[]): AllergenMatch[] {
  const found: AllergenMatch[] = [];
  const seen = new Set<string>();
  for (const name of ingredientNames) {
    const lower = name.toLowerCase();
    for (const [allergen, keywords] of Object.entries(ALLERGEN_MAP)) {
      if (seen.has(allergen)) continue;
      if (keywords.some((k) => lower.includes(k))) {
        found.push({ allergen, matchedIngredient: name });
        seen.add(allergen);
      }
    }
  }
  return found;
}

// ── Concern resolution (now KB-backed) ───────────────────────────────────────
const CONCERN_RANK: Record<ConcernLevel, number> = { LOW: 0, MEDIUM: 1, HIGH: 2, CRITICAL: 3 };
const RANK_CONCERN: ConcernLevel[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

// Sugar/salt/oil are "amounts", not additives — handled here for dominance sensitivity.
const BULK_RULES: { keywords: string[]; dominant: ConcernLevel; moderate: ConcernLevel; trace: ConcernLevel; note: string }[] = [
  { keywords: ["salt", "sodium chloride", "sea salt"], dominant: "HIGH", moderate: "MEDIUM", trace: "LOW",
    note: "Salt — WHO recommends <5g/day; dominant salt is a cardiovascular risk." },
  { keywords: ["sugar", "sucrose", "glucose", "dextrose", "fructose", "corn syrup", "cane sugar", "invert sugar"], dominant: "HIGH", moderate: "MEDIUM", trace: "LOW",
    note: "Added sugar — WHO recommends <10% of energy; dominant sugar is a metabolic risk." },
  { keywords: ["sunflower oil", "soybean oil", "corn oil", "cottonseed oil", "vegetable oil", "canola"], dominant: "MEDIUM", moderate: "LOW", trace: "LOW",
    note: "Refined seed oil — high omega-6; excess intake is pro-inflammatory." },
  { keywords: ["enriched flour", "refined flour", "bleached flour", "white flour", "all-purpose flour"], dominant: "MEDIUM", moderate: "LOW", trace: "LOW",
    note: "Refined flour — high glycaemic index, stripped of fibre and micronutrients." },
];

export interface IngredientAssessment {
  name: string;
  position: number;
  concern: ConcernLevel;
  evidence: Evidence;
  category?: string;
  reason: string;         // plain-language "why this concern"
  ref?: string;           // authority behind the concern
  isAdditive: boolean;
  isWhole: boolean;
}

function bracket(position: number): "dominant" | "moderate" | "trace" {
  return position <= 2 ? "dominant" : position <= 6 ? "moderate" : "trace";
}

// Assess one ingredient against KB + bulk rules. This is the single source of concern.
export function assessIngredient(name: string, position: number): IngredientAssessment {
  const b = bracket(position);
  const additive = lookupAdditive(name);
  if (additive) {
    return {
      name, position, concern: additive[b], evidence: additive.evidence,
      category: additive.category, reason: additive.note, ref: additive.ref,
      isAdditive: !["antioxidant"].includes(additive.category) || CONCERN_RANK[additive[b]] > 0,
      isWhole: false,
    };
  }
  for (const rule of BULK_RULES) {
    if (rule.keywords.some((k) => name.toLowerCase().includes(k))) {
      return {
        name, position, concern: rule[b], evidence: "STRONG",
        reason: rule.note, isAdditive: false, isWhole: false,
      };
    }
  }
  if (isWholeFood(name)) {
    return { name, position, concern: "LOW", evidence: "STRONG",
      reason: "Whole/minimally processed food — a positive contributor.", isAdditive: false, isWhole: true };
  }
  // Unknown ingredient — a chemical-sounding name is a mild ultra-processing signal.
  const chemical = /\b(e\d{3}|acid|ate$|ide$|ose$|yl |ester|extract|hydro|mono|di\w)/i.test(name);
  return {
    name, position, concern: chemical ? "MEDIUM" : "LOW", evidence: "INSUFFICIENT",
    reason: chemical
      ? "Unrecognised additive-like ingredient; not in the knowledge base — treated as mild processing signal (low confidence)."
      : "Unrecognised ingredient with no documented concern.",
    isAdditive: chemical, isWhole: false,
  };
}

// Back-compat: old callers used inferConcernLevel(name) with no position.
export function inferConcernLevel(name: string): ConcernLevel {
  return assessIngredient(name, 0).concern;
}

// Back-compat shim retained for any external caller.
export function adjustConcernForConcentration(name: string, _base: ConcernLevel, position: number): ConcernLevel {
  const a = assessIngredient(name, position);
  // Never downgrade a CRITICAL from the KB.
  return a.concern === "CRITICAL" ? "CRITICAL" : a.concern;
}

// ── NOVA processing classification ───────────────────────────────────────────
export type NovaGroup = 1 | 2 | 3 | 4;

const REFINED_OIL = /vegetable oil|sunflower oil|soybean oil|corn oil|cottonseed oil|palm oil|canola/i;
const ADDED_SUGAR = /sugar|sucrose|corn syrup|high fructose|dextrose|glucose syrup|invert sugar|maltodextrin/i;
const ADDED_SALT = /^salt$|sodium chloride|sea salt/i;
// Cosmetic/ultra markers — deliberately excludes bare "natural flavor" (that alone is NOVA 3).
const ULTRA_MARKER = /artificial flavou?r|dye|colou?r|red \d|yellow \d|blue \d|sweetener|emulsifier|hydrogenated/i;

export function classifyNova(assessments: IngredientAssessment[]): { group: NovaGroup; reason: string } {
  const additiveCount = assessments.filter((a) => a.isAdditive).length;
  const ultraMarker = assessments.some((a) =>
    ["coloring", "sweetener", "flavor enhancer", "emulsifier"].includes(a.category ?? "") || ULTRA_MARKER.test(a.name));
  // Added sugar in the top 3 ingredients = hallmark of an ultra-processed food.
  const sugarDominant = assessments.some((a) => a.position <= 2 && ADDED_SUGAR.test(a.name));
  const refinedOil = assessments.some((a) => REFINED_OIL.test(a.name));
  const addedSaltOrSugar = assessments.some((a) => ADDED_SALT.test(a.name) || ADDED_SUGAR.test(a.name));
  const wholeCount = assessments.filter((a) => a.isWhole).length;

  if (additiveCount >= 2 || ultraMarker || sugarDominant) {
    return { group: 4, reason: `Ultra-processed (NOVA 4): ${additiveCount} additive(s)${ultraMarker ? ", cosmetic/ultra markers" : ""}${sugarDominant ? ", added sugar among main ingredients" : ""}.` };
  }
  if (additiveCount === 1 || refinedOil || addedSaltOrSugar) {
    const why = additiveCount === 1 ? "a preservative/additive" : refinedOil ? "refined oil" : "added salt/sugar";
    return { group: 3, reason: `Processed (NOVA 3): contains ${why} alongside foods.` };
  }
  if (wholeCount >= assessments.length - 1 && assessments.length > 0) {
    return { group: 1, reason: "Unprocessed / minimally processed (NOVA 1)." };
  }
  return { group: 2, reason: "Processed culinary ingredients (NOVA 2)." };
}

// NOVA sets the ceiling — the single most important anti-inflation lever.
// Calibrated so ultra-processed foods (NOVA 4) cannot exceed a D, and processed
// snacks (NOVA 3) cannot exceed a C, regardless of how "clean" the short list looks.
const NOVA_CEILING: Record<NovaGroup, number> = { 1: 100, 2: 85, 3: 60, 4: 40 };

// ── Public breakdown (API-compatible; new fields are additive) ───────────────
export interface ScoreBreakdown {
  overall: number;
  grade: ScoreGrade;
  gradeLabel: string;
  processing: number;
  additiveDensity: number;
  ingredientQuality: number;
  sugarContent: number;
  sodiumContent: number;
  // ── new explainability fields ──
  novaGroup?: NovaGroup;
  confidence?: "high" | "moderate" | "low";
  reasons?: string[];
  interactions?: InteractionHit[];
  ingredientReasons?: { name: string; concern: ConcernLevel; reason: string; ref?: string; evidence: Evidence }[];
}

const CONCERN_PENALTY: Record<ConcernLevel, number> = { LOW: 0, MEDIUM: 12, HIGH: 28, CRITICAL: 55 };

function positionWeight(position: number): number {
  return Math.exp(-0.15 * position); // pos0 ≈ 1.0, pos10 ≈ 0.22
}

export interface IngredientInput {
  name: string;
  safetyScore?: number;
  concernLevel?: ConcernLevel;
  isNatural?: boolean;
  category?: string;
  position?: number;
}

/**
 * Core evaluator. Accepts either raw label names (preferred) or the legacy
 * IngredientInput shape. Produces a fully explainable, reproducible score.
 */
export function evaluateProduct(
  ingredients: IngredientInput[],
  opts: { sugarPercentage?: number; sodiumMg?: number } = {}
): ScoreBreakdown {
  if (!ingredients.length) return defaultScore();

  const assessments = ingredients.map((ing, idx) =>
    assessIngredient(ing.name ?? "", ing.position ?? idx));

  const nova = classifyNova(assessments);
  const ceiling = NOVA_CEILING[nova.group];

  // Composition quality: position-weighted concern → quality 0-100.
  let weightedPenalty = 0, weightTotal = 0;
  for (const a of assessments) {
    const w = positionWeight(a.position);
    weightedPenalty += CONCERN_PENALTY[a.concern] * w;
    weightTotal += w;
  }
  const avgPenalty = weightTotal > 0 ? weightedPenalty / weightTotal : 0;
  const ingredientQuality = clamp(100 - avgPenalty);

  // Additive burden: each flagged additive costs, scaled by severity & position.
  const additiveBurden = assessments.reduce((acc, a) => {
    if (!a.isAdditive) return acc;
    return acc + CONCERN_PENALTY[a.concern] * 0.4 * positionWeight(a.position);
  }, 0);
  const additiveDensity = clamp(100 - additiveBurden);

  // Processing score derived from NOVA (transparent, not ad-hoc).
  const processing = clamp({ 1: 95, 2: 82, 3: 62, 4: 38 }[nova.group]);

  // Sugar / sodium — only credited when nutrition data is actually supplied.
  // Otherwise their weight is redistributed to the composition terms, so a product
  // never receives a free +20 for data we don't have (a key anti-inflation fix).
  const hasNutrition = (opts.sugarPercentage ?? 0) > 0 || (opts.sodiumMg ?? 0) > 0;
  const sugarContent = clamp(100 - (opts.sugarPercentage ?? 0) * 4);
  const sodiumContent = clamp(100 - Math.floor((opts.sodiumMg ?? 0) / 8));

  let raw: number;
  if (hasNutrition) {
    raw = ingredientQuality * 0.34 + additiveDensity * 0.24 + processing * 0.22 +
          sugarContent * 0.10 + sodiumContent * 0.10;
  } else {
    // Renormalise the three composition terms to sum to 1.0 (0.34+0.24+0.22 = 0.80).
    raw = (ingredientQuality * 0.34 + additiveDensity * 0.24 + processing * 0.22) / 0.80;
  }

  const reasons: string[] = [nova.reason];

  // Apply NOVA ceiling — the anti-inflation guarantee.
  if (raw > ceiling) {
    reasons.push(`Score capped at ${ceiling} by processing level (NOVA ${nova.group}).`);
    raw = ceiling;
  }

  // Post-ceiling separation: HIGH-concern additives keep biting even after the NOVA
  // cap, so a dye/BHT-laden product ranks below a cleaner ultra-processed one.
  // HIGH-concern additives, plus cosmetic additives (dyes/sweeteners/flavour enhancers)
  // at MEDIUM+ — cosmetics have no nutritional justification, so presence counts.
  const isCosmetic = (c?: string) => ["coloring", "sweetener", "flavor enhancer"].includes(c ?? "");
  const highAdditives = assessments.filter((a) =>
    a.isAdditive && (a.concern === "HIGH" ||
      (isCosmetic(a.category) && CONCERN_RANK[a.concern] >= CONCERN_RANK.MEDIUM)));
  if (highAdditives.length) {
    raw -= highAdditives.length * 5;
    reasons.push(`−${highAdditives.length * 5}: ${highAdditives.length} high-concern additive(s) (${highAdditives.map((a) => a.name).join(", ")}).`);
  }

  // Hard caps for CRITICAL additives (banned/carcinogenic) — override everything.
  const critical = assessments.filter((a) => a.concern === "CRITICAL");
  if (critical.length) {
    const cap = 25;
    if (raw > cap) reasons.push(`Score capped at ${cap}: contains a banned/high-risk ingredient (${critical.map((c) => c.name).join(", ")}).`);
    raw = Math.min(raw, cap);
  }

  // Interactions — documented combination risks.
  const interactions = detectInteractions(assessments.map((a) => a.name));
  for (const hit of interactions) {
    raw -= hit.penalty;
    reasons.push(`−${hit.penalty}: ${hit.title}.`);
  }

  const overall = Math.round(clamp(raw));

  // Confidence from the evidence behind the worst concerns.
  const worst = assessments.reduce((m, a) => Math.max(m, CONCERN_RANK[a.concern]), 0);
  const drivers = assessments.filter((a) => CONCERN_RANK[a.concern] === worst && worst > 0);
  const strong = drivers.every((d) => d.evidence === "STRONG" || d.evidence === "MODERATE");
  const anyInsufficient = drivers.some((d) => d.evidence === "INSUFFICIENT");
  const confidence: "high" | "moderate" | "low" =
    worst === 0 ? "high" : anyInsufficient ? "low" : strong ? "high" : "moderate";

  return {
    overall,
    grade: scoreToGrade(overall),
    gradeLabel: gradeToLabel(scoreToGrade(overall)),
    processing: Math.round(processing),
    additiveDensity: Math.round(additiveDensity),
    ingredientQuality: Math.round(ingredientQuality),
    sugarContent: Math.round(sugarContent),
    sodiumContent: Math.round(sodiumContent),
    novaGroup: nova.group,
    confidence,
    reasons,
    interactions,
    ingredientReasons: assessments.map((a) => ({
      name: a.name, concern: a.concern, reason: a.reason, ref: a.ref, evidence: a.evidence,
    })),
  };
}

// Back-compat wrapper: old signature routes into the new engine.
export function calculateHealthScore(
  ingredients: IngredientInput[],
  sugarPercentage = 0,
  sodiumMg = 0,
  _isUltraProcessed = false
): ScoreBreakdown {
  return evaluateProduct(ingredients, { sugarPercentage, sodiumMg });
}

export function scoreToGrade(score: number): ScoreGrade {
  if (score >= 90) return "A_PLUS";
  if (score >= 78) return "A";
  if (score >= 65) return "B";
  if (score >= 50) return "C";
  if (score >= 35) return "D";
  return "F";
}

export function gradeToLabel(grade: ScoreGrade): string {
  return ({ A_PLUS: "A+", A: "A", B: "B", C: "C", D: "D", F: "F" } as Record<ScoreGrade, string>)[grade];
}

function clamp(n: number): number { return Math.min(100, Math.max(0, n)); }

function defaultScore(): ScoreBreakdown {
  return {
    overall: 50, grade: "C", gradeLabel: "C",
    processing: 50, additiveDensity: 60, ingredientQuality: 50,
    sugarContent: 60, sodiumContent: 60,
    novaGroup: 2, confidence: "low", reasons: ["No ingredients provided."],
    interactions: [], ingredientReasons: [],
  };
}

// re-export for callers
export type { ConcernLevel } from "./additives";
export { RANK_CONCERN };
