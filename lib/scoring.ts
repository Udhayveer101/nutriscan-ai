export type ScoreGrade = "A_PLUS" | "A" | "B" | "C" | "D" | "F";

export interface AllergenMatch {
  allergen: string;
  matchedIngredient: string;
}

// The 14 major allergens (EU) + common US top-9 allergens
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

export interface ScoreBreakdown {
  overall: number;
  grade: ScoreGrade;
  gradeLabel: string;
  processing: number;
  additiveDensity: number;
  ingredientQuality: number;
  sugarContent: number;
  sodiumContent: number;
}

export interface IngredientInput {
  name: string;
  safetyScore?: number;
  concernLevel?: "LOW" | "MEDIUM" | "HIGH";
  isNatural?: boolean;
  category?: string;
  position?: number; // 0 = first/most abundant ingredient on label
}

const CATEGORY_WEIGHTS: Record<string, number> = {
  preservative: -15,
  coloring: -18,
  "artificial coloring": -20,
  sweetener: -12,
  "artificial sweetener": -16,
  emulsifier: -8,
  stabilizer: -8,
  "flavor enhancer": -12,
  "artificial flavor": -14,
  antioxidant: +3,
  vitamin: +10,
  mineral: +8,
  natural: +2,
  thickener: -5,
  "acidity regulator": -6,
  oil: -5,
  fat: -8,
  starch: -4,
  flour: +2,
};

// CRITICAL: Ingredients banned in multiple countries or with strong direct links to cancer/serious illness at normal doses
const CRITICAL_CONCERN_KEYWORDS = [
  "partially hydrogenated", "hydrogenated vegetable", "hydrogenated fat", // trans fats — banned in US, EU, many countries
  "sodium nitrite", "sodium nitrate", "potassium nitrite", "potassium nitrate", // WHO Group 1 carcinogen in processed meats
  "potassium bromate", // banned in EU, UK, Canada, India — carcinogenic
  "brominated vegetable oil", "bvo", // banned in EU, Japan, India
  "red 3", "erythrosine", // banned in cosmetics due to cancer risk, still in some foods
  "titanium dioxide", "e171", // banned as food additive in EU — DNA damage
  "propyl gallate", // linked to cancer in animal studies, banned in several countries
  "4-methylimidazole", // caramel colouring byproduct, carcinogenic
];

// Known high-concern ingredients (lowercase match)
const HIGH_CONCERN_KEYWORDS = [
  "palm oil", "trans fat",
  "high fructose corn syrup", "hfcs", "monosodium glutamate", "msg",
  "bha", "bht", "tbhq",
  "red 40", "yellow 5", "yellow 6", "blue 1", "blue 2",
  "aspartame", "saccharin", "acesulfame", "sodium benzoate",
  "carrageenan", "hydrogenated",
];

const MEDIUM_CONCERN_KEYWORDS = [
  "corn syrup", "maltodextrin", "dextrose", "modified starch",
  "soybean oil", "canola oil", "vegetable oil", "sunflower oil",
  "artificial flavor", "natural flavor", "yeast extract",
  "sodium", "salt", "sugar", "enriched flour",
];

export function inferConcernLevel(name: string): "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" {
  const lower = name.toLowerCase();
  if (CRITICAL_CONCERN_KEYWORDS.some((k) => lower.includes(k))) return "CRITICAL";
  if (HIGH_CONCERN_KEYWORDS.some((k) => lower.includes(k))) return "HIGH";
  if (MEDIUM_CONCERN_KEYWORDS.some((k) => lower.includes(k))) return "MEDIUM";
  return "LOW";
}

const CONCERN_PENALTIES: Record<string, number> = {
  LOW: 0,
  MEDIUM: -12,
  HIGH: -25,
  CRITICAL: -40,
};

// Exponential decay: ingredients listed first are present in higher amounts.
// Position 0 = dominant ingredient (~full weight), position 10 = trace (~22% weight).
function positionWeight(position: number): number {
  return Math.exp(-0.15 * position);
}

export function calculateHealthScore(
  ingredients: IngredientInput[],
  sugarPercentage = 0,
  sodiumMg = 0,
  isUltraProcessed = false
): ScoreBreakdown {
  if (!ingredients.length) return defaultScore();

  const total = ingredients.length;

  // 1. Ingredient quality — weight quality scores by position (first ingredient = most abundant)
  let weightedQualitySum = 0;
  let weightTotal = 0;
  ingredients.forEach((ing, idx) => {
    const pos = ing.position ?? idx;
    const w = positionWeight(pos);
    const base = ing.safetyScore ?? 50;
    const concern = ing.concernLevel ?? inferConcernLevel(ing.name ?? "");
    const capped = concern === "CRITICAL" ? Math.min(base, 10)
      : concern === "HIGH" ? Math.min(base, 35)
      : concern === "MEDIUM" ? Math.min(base, 60)
      : base;
    weightedQualitySum += capped * w;
    weightTotal += w;
  });
  const avgQuality = weightTotal > 0 ? weightedQualitySum / weightTotal : 50;

  // 2. Additive density — weight by position (a trace preservative at the end = less bad)
  let weightedProblematic = 0;
  ingredients.forEach((ing, idx) => {
    const pos = ing.position ?? idx;
    const concern = ing.concernLevel ?? inferConcernLevel(ing.name ?? "");
    const isAdditive = !ing.isNatural && ["coloring", "preservative", "sweetener", "flavor enhancer", "emulsifier"].includes(ing.category ?? "");
    if (concern === "HIGH" || concern === "MEDIUM" || isAdditive) {
      weightedProblematic += positionWeight(pos);
    }
  });
  const additiveDensityScore = Math.max(0, 100 - weightedProblematic * 12);

  // 3. Processing level — only flag ultra-processed based on actual harmful additives, never on ingredient count
  const ultraProcessedPenalty = isUltraProcessed ? -25 : 0;
  const highConcernWeighted = ingredients.reduce((acc, ing, idx) => {
    const pos = ing.position ?? idx;
    const concern = ing.concernLevel ?? inferConcernLevel(ing.name ?? "");
    return acc + (concern === "HIGH" ? positionWeight(pos) : 0);
  }, 0);
  const categoryPenaltyTotal = ingredients.reduce((acc, ing) => {
    return acc + (CATEGORY_WEIGHTS[ing.category?.toLowerCase() ?? ""] ?? 0);
  }, 0);
  const processingScore = Math.min(
    100,
    Math.max(0, 70 + categoryPenaltyTotal / total * 1.5 + ultraProcessedPenalty - highConcernWeighted * 10)
  );

  // 4. Position-weighted concern penalties
  const concernPenalty = ingredients.reduce((acc, ing, idx) => {
    const pos = ing.position ?? idx;
    const level = ing.concernLevel ?? inferConcernLevel(ing.name ?? "");
    return acc + (CONCERN_PENALTIES[level] ?? 0) * positionWeight(pos);
  }, 0);

  // 5. Sugar
  const sugarScore = Math.max(0, 100 - sugarPercentage * 4);

  // 6. Sodium
  const sodiumScore = Math.max(0, 100 - Math.floor(sodiumMg / 8));

  const raw =
    avgQuality * 0.30 +
    additiveDensityScore * 0.25 +
    processingScore * 0.20 +
    sugarScore * 0.10 +
    sodiumScore * 0.10 +
    (concernPenalty / Math.max(1, weightTotal)) * 0.05;

  const overall = Math.min(100, Math.max(0, Math.round(raw)));

  return {
    overall,
    grade: scoreToGrade(overall),
    gradeLabel: gradeToLabel(scoreToGrade(overall)),
    processing: Math.round(processingScore),
    additiveDensity: Math.round(additiveDensityScore),
    ingredientQuality: Math.round(avgQuality),
    sugarContent: Math.round(sugarScore),
    sodiumContent: Math.round(sodiumScore),
  };
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
  const labels: Record<ScoreGrade, string> = {
    A_PLUS: "A+", A: "A", B: "B", C: "C", D: "D", F: "F",
  };
  return labels[grade];
}

function defaultScore(): ScoreBreakdown {
  return {
    overall: 50,
    grade: "C",
    gradeLabel: "C",
    processing: 50,
    additiveDensity: 60,
    ingredientQuality: 50,
    sugarContent: 60,
    sodiumContent: 60,
  };
}
