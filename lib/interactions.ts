// Scientifically documented ingredient interactions — risks that emerge only from
// combinations, invisible when scoring ingredients individually. Conservative by design:
// only interactions with real regulatory/peer-reviewed backing are listed. See vault
// Interactions.md. Each rule requires ALL trigger groups to be present on the label.

import { extractCodes } from "./additives";

export interface InteractionRule {
  id: string;
  title: string;
  // Each group is a set of keyword alternatives; the rule fires only when EVERY
  // group has at least one match among the ingredient names.
  requires: string[][];
  penalty: number;          // points subtracted from final score when triggered
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  evidence: "STRONG" | "MODERATE" | "LIMITED";
  explanation: string;      // shown to the user
  ref: string;
}

export const INTERACTIONS: InteractionRule[] = [
  {
    id: "benzene-formation",
    title: "Benzene formation risk (benzoate + vitamin C)",
    requires: [
      ["sodium benzoate", "potassium benzoate", "benzoic acid", "e211", "e210", "e212"],
      ["ascorbic acid", "vitamin c", "citric acid", "sodium ascorbate", "e300"],
    ],
    penalty: 20, severity: "HIGH", evidence: "MODERATE",
    explanation:
      "Benzoate preservatives can react with ascorbic acid (vitamin C) in acidic conditions to form benzene, a known human carcinogen — the effect is worse with heat and light exposure during storage. The FDA has documented this in soft drinks.",
    ref: "FDA 'Data on Benzene in Soft Drinks'; Gardner & Lawrence 1993",
  },
  {
    id: "nitrosamine-formation",
    title: "Nitrosamine formation (nitrite + protein/amines)",
    requires: [
      ["sodium nitrite", "potassium nitrite", "sodium nitrate", "e249", "e250", "e251"],
      ["pork", "beef", "bacon", "ham", "sausage", "meat", "protein", "fish"],
    ],
    penalty: 18, severity: "HIGH", evidence: "STRONG",
    explanation:
      "Nitrite preservatives combine with amines in protein-rich (cured meat) foods, especially under high-heat cooking, to form nitrosamines — WHO Group 1 carcinogens. This is the core reason processed meats are classified as carcinogenic.",
    ref: "IARC 2015 processed meat monograph; EFSA 2017",
  },
  {
    id: "dye-benzoate-hyperactivity",
    title: "Additive hyperactivity mixture (dyes + benzoate)",
    requires: [
      ["red 40", "yellow 5", "yellow 6", "tartrazine", "sunset yellow", "allura red", "quinoline yellow", "carmoisine", "azorubine", "ponceau 4r",
       "e129", "e102", "e110", "e104", "e122", "e124"],
      ["sodium benzoate", "benzoic acid", "e211"],
    ],
    penalty: 12, severity: "MEDIUM", evidence: "MODERATE",
    explanation:
      "The Southampton study tested synthetic colour dyes together with sodium benzoate and found increased hyperactivity in children — the combination, not any single dye, was the tested exposure. Products pairing both warrant extra caution for children.",
    ref: "McCann et al. 2007 (The Lancet)",
  },
  {
    id: "phosphate-caffeine-calcium",
    title: "Bone-mineral concern (phosphoric acid + caffeine)",
    requires: [
      ["phosphoric acid", "e338"],
      ["caffeine", "cola"],
    ],
    penalty: 6, severity: "MEDIUM", evidence: "LIMITED",
    explanation:
      "Colas combine phosphoric acid with caffeine; observational studies associate high cola intake with reduced bone mineral density, attributed partly to this pairing displacing calcium and increasing excretion.",
    ref: "Tucker et al. 2006 (Am J Clin Nutr)",
  },
];

export interface InteractionHit {
  id: string;
  title: string;
  severity: InteractionRule["severity"];
  penalty: number;
  evidence: InteractionRule["evidence"];
  explanation: string;
  ref: string;
}

const E_CODE = /^e\d{3,4}[a-z]*$/;

export function detectInteractions(ingredientNames: string[]): InteractionHit[] {
  const hay = ingredientNames.map((n) => n.toLowerCase());
  const codes = hay.flatMap((name) => extractCodes(name).flat());
  const hits: InteractionHit[] = [];
  for (const rule of INTERACTIONS) {
    // E-numbers match as whole codes (E1105 lysozyme must not count as E110).
    const allPresent = rule.requires.every((group) =>
      group.some((kw) => (E_CODE.test(kw) ? codes.includes(kw) : hay.some((name) => name.includes(kw))))
    );
    if (allPresent) {
      const { requires: _r, ...rest } = rule;
      void _r;
      hits.push(rest);
    }
  }
  return hits;
}

// ── self-check ──────────────────────────────────────────────────────────────
export function _demo(): void {
  const soda = detectInteractions(["Carbonated Water", "Sodium Benzoate", "Ascorbic Acid (Vitamin C)"]);
  if (!soda.some((h) => h.id === "benzene-formation")) throw new Error("benzene interaction missed");
  const bacon = detectInteractions(["Pork", "Salt", "Sodium Nitrite"]);
  if (!bacon.some((h) => h.id === "nitrosamine-formation")) throw new Error("nitrosamine interaction missed");
  const safe = detectInteractions(["Oats", "Water", "Salt"]);
  if (safe.length) throw new Error("false-positive interaction");
  // eslint-disable-next-line no-console
  console.log("interactions.ts self-check OK");
}
