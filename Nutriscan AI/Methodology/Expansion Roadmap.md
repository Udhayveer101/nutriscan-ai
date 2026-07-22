---
type: roadmap
date: 2026-07-23
scope: category-by-category ingredient database expansion (+10 per category)
status: in-progress
---

# Ingredient Database Expansion Roadmap — 2026-07

Links: [[Scoring Methodology]] · [[Interaction Analysis]] · [[Adding Ingredients]]

## Baseline audit (2026-07-23)

- `prisma/seed.ts`: **162 ingredients**, 15 categories.
- `lib/additives.ts` (scanner KB): **63 cited profiles** — the scoring source of truth.
- Per-category counts: coloring 23, natural 25, thickener 15, preservative 13, sweetener 13,
  acidity-regulator 10, antioxidant 9, emulsifier 7, flavor-enhancer 7, anti-caking 6,
  vitamin-mineral 4, raising-agent 4, humectant 3, **stabilizer 1**, **flour-treatment 1**.

### Consistency findings
- Seed splits `sodium-nitrite` / `sodium-nitrate`; KB merges them into one profile — acceptable
  (KB keyword match covers both), but seed aliases must not overlap.
- `riboflavin` sits in coloring (E101) — it is also vitamin B2; alias, don't duplicate, when
  expanding vitamin-mineral.
- Dual-function additives (ascorbic acid: antioxidant + flour treatment; glucono-delta-lactone:
  acidity regulator + raising agent) get ONE seed entry in their primary category with the other
  role stated in `purpose`.
- Every new seed ingredient MUST have a matching KB profile in `lib/additives.ts` (or match an
  existing profile's keywords) — otherwise the scanner scores it as unknown.

## Implementation order (scan frequency × current gap)

| # | Category | Now | Candidate additions (dedup-checked against seed) |
|---|---|---|---|
| 1 | Preservative | 13 | benzoic acid E210, potassium benzoate E212, sodium propionate E281, potassium metabisulphite E224, sodium sulphite E221, dimethyl dicarbonate E242, lysozyme E1105, sodium lactate E325, potassium lactate E326, calcium disodium EDTA E385 |
| 2 | Emulsifier | 7 | DATEM E472e, PGPR E476, sorbitan monostearate E491, polysorbate 20 E432, sucrose esters E473, acetylated mono-diglycerides E472a, ammonium phosphatides E442, calcium stearoyl lactylate E482, sunflower lecithin, polyglycerol esters E475 |
| 3 | Sweetener | 13 | neotame E961, advantame E969, cyclamate E952, allulose, mannitol E421, lactitol E966, glucose syrup, dextrose, invert sugar, agave nectar |
| 4 | Flavor Enhancer | 7 | glutamic acid E620, monopotassium glutamate E622, maltol E636, ethyl maltol E637, hydrolyzed vegetable protein, autolyzed yeast extract, vanillin, ethyl vanillin, smoke flavour, torula yeast |
| 5 | Antioxidant | 9 | rosemary extract E392, ascorbyl palmitate E304, erythorbic acid E315, octyl gallate E311, dodecyl gallate E312, citric acid esters E472c, green tea extract (catechins), stannous chloride E512, 4-hexylresorcinol E586, glucose oxidase |
| 6 | Thickener | 15 | gum arabic E414, tragacanth E413, sodium CMC E466, sodium alginate E401, propylene glycol alginate E405, tapioca starch, potato starch, rice starch, arrowroot, psyllium husk |
| 7 | Stabilizer | 1 | calcium chloride E509, calcium sulfate E516, magnesium chloride E511, calcium lactate E327, sodium tripolyphosphate E451i, tetrasodium pyrophosphate E450iii, sodium hexametaphosphate E452i, polydextrose E1200, cellulose gel E460i, gum ghatti |
| 8 | Acidity Regulator | 10 | glucono-delta-lactone E575, sodium hydroxide E524, potassium hydroxide E525, calcium hydroxide E526, sodium carbonate E500i, potassium carbonate E501i, calcium citrate E333, adipic acid E355, succinic acid E363, ammonium hydroxide E527 |
| 9 | Coloring | 23 | carmine E120 (KB exists, seed missing), chlorophylls E140, copper chlorophyllins E141, iron oxides E172, canthaxanthin E161g, apocarotenal E160e, spirulina extract, butterfly pea flower extract, safflower yellow, vegetable carbon E153-adjacent dedup check vs carbon-black |
| 10 | Raising Agent | 4 | monocalcium phosphate E341i, sodium acid pyrophosphate E450i, dicalcium phosphate E341ii, potassium bicarbonate E501ii, ammonium carbonate E503i, sodium aluminum sulfate E521, baker's yeast, calcium oxide E529, magnesium carbonate E504 (dual anti-caking), potassium carbonate? (dedup vs #8 — resolve at research time) |
| 11 | Humectant | 3 | triacetin E1518, triethyl citrate E1505, maltitol syrup, sorbitol syrup E420ii, polyglycitol syrup E964, PEG E1521, trehalose, betaine, lactitol? (dedup vs sweetener), honey-based humectants — thinnest category; reclassification allowed if <10 legitimate candidates |
| 12 | Anti-caking | 6 | sodium aluminosilicate E554, calcium aluminosilicate E556, potassium ferrocyanide E536, sodium ferrocyanide E535, magnesium carbonate E504, magnesium oxide E530, tricalcium phosphate E341iii, iron ammonium citrate E381, stearic acid E570, bentonite E558 |
| 13 | Flour Treatment | 1 | azodicarbonamide E927a, benzoyl peroxide E928, chlorine dioxide E926, L-cysteine E920, calcium peroxide E930, ammonium chloride E510, alpha-amylase, malted barley flour, transglutaminase, vital wheat gluten (dedup vs natural) |
| 14 | Vitamin & Mineral | 4 | cyanocobalamin B12, vitamin A palmitate, dl-alpha-tocopheryl acetate, thiamine mononitrate B1, pyridoxine hydrochloride B6, calcium pantothenate B5, zinc oxide, potassium iodide, ferrous fumarate, biotin |
| 15 | Natural Ingredient | 25 | butter, ghee, cream, vinegar, tomato paste, garlic powder, onion powder, lemon juice concentrate, jaggery, tamarind |

## Per-category workflow (gate — no skipping)

1. **Research (Joe)** — EFSA/FDA/JECFA/IARC + reviews for each candidate; capture ADI, regulatory status, evidence strength.
2. **Standards check (John)** — naming/E-number/taxonomy consistency with existing KB.
3. **Critic pass (Joe Doe)** — dupes, aliases, weak sources, unfair scores; reject substandard entries.
4. Implement: `lib/additives.ts` profile + `prisma/seed.ts` entry.
5. `npx tsx scripts/validate-scoring.ts` — must stay green.
6. `npx tsx scripts/gen-vault.ts` + `npx tsc --noEmit`.
7. Scanner spot check (lookupAdditive on the new names/aliases).
8. **Sup** signs off; only then next category.
