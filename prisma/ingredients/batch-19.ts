// Expansion batch 19 — Pool 6: cooking oils and animal fats.
// High-omega-6 seed oils route through the scanner's seed-oil bulk rule (MEDIUM when dominant);
// cold-pressed specialty oils and animal fats route as whole foods, matching olive oil and butter.
import type { SeedIngredient, SeedRef } from "./types";
import { wholeFoods } from "./whole";
import { paper, euAllergens } from "./refs";
import { EU_CONTAMINANTS } from "./batch-13";

const AHA_N6 = paper("Harris WS et al.", 2009, "Omega-6 fatty acids and risk for cardiovascular disease: a science advisory from the American Heart Association Nutrition Subcommittee", "Circulation 119(6):902–907",
  "Omega-6 PUFA intake of at least 5–10% of energy, replacing saturated fat, is associated with lower coronary heart disease risk; the advisory does not support reducing omega-6 intake.", "10.1161/CIRCULATIONAHA.108.191627");
const WHO_SFA: SeedRef = { title: "Saturated fatty acid and trans-fatty acid intake for adults and children: WHO guideline", authors: "World Health Organization", journal: "WHO Guidelines", year: 2023,
  url: "https://www.who.int/publications/i/item/9789240073630", findings: "Recommends limiting saturated fat to under 10% of energy and replacing it with polyunsaturated fat, monounsaturated fat or whole-grain carbohydrate." };

const SEED_C = "A refined, high-omega-6 seed oil, which the scanner flags when it dominates a product. The evidence is mixed: the AHA finds omega-6 fats that replace saturated fat lower heart-disease risk. Ultra-processed foods made with it are the bigger issue.";
const seedOil = wholeFoods("oil-fat", {
  refs: [AHA_N6], evidenceLevel: "MODERATE", isNatural: false,
  sciConsensus: "A refined vegetable oil. Safe; the scanner's concern is about high omega-6 intake from ultra-processed foods, where the evidence is mixed.",
  benefits: "Mostly polyunsaturated fat; vitamin E.", concerns: SEED_C,
});
const oil = wholeFoods("oil-fat", {
  refs: [],
  sciConsensus: "A minimally processed culinary fat, scored like olive oil and butter as a whole food.",
  concerns: "Energy-dense like all fats; otherwise none.",
});
const animalFat = wholeFoods("oil-fat", {
  refs: [WHO_SFA], isVegan: false,
  sciConsensus: "A traditional animal fat. WHO advises keeping saturated fat below 10% of energy.",
  concerns: "High in saturated fat; WHO advises keeping saturated fat below 10% of energy.",
});

export const BATCH_19: SeedIngredient[] = [
  ...seedOil([
    ["Safflower Oil", ["safflower seed oil", "high oleic safflower oil"], "Seed oil from safflower", "Used in dressings, frying and margarines.", "", "", ["Dressings", "Margarine", "Snacks"], 60],
    ["Grapeseed Oil", ["grape seed oil"], "Light oil pressed from wine-grape seeds", "Used for frying, dressings and mayonnaise.", "", "", ["Mayonnaise", "Dressings"], 60],
    ["Rice Bran Oil", ["rice-bran oil"], "Oil from the bran of rice", "A popular frying oil in India, Japan and Thailand.", "Contains gamma-oryzanol and tocotrienols; a more balanced fatty-acid profile than most seed oils.", "", ["Fried snacks", "Namkeen", "Tempura"], 62],
    ["Sesame Oil", ["gingelly oil", "til oil", "til ka tel", "toasted sesame oil", "nallennai"], "Nutty oil pressed from sesame seeds", "Untoasted oil is used for cooking in South India; toasted oil seasons East Asian food.", "Sesame lignans (sesamin, sesamol) make it unusually stable.",
      `${SEED_C} Sesame oil can trigger reactions in sesame allergy (a declarable allergen).`, ["Stir-fries", "Dressings", "Pickles"], 60, { refs: [euAllergens("Sesame seeds and products thereof are declarable allergens.")] }],
    ["Groundnut Oil", ["peanut oil", "arachis oil", "moongphali tel"], "Oil pressed from peanuts", "Common frying oil in India, China and West Africa.", "Monounsaturated and polyunsaturated fat; vitamin E.",
      `${SEED_C} Highly refined peanut oil carries little protein and is exempt from US allergen labelling, but the EU still requires it to be labelled, and cold-pressed peanut oil can trigger peanut allergy.`, ["Fried snacks", "Stir-fries"], 60, { refs: [euAllergens("Peanuts and products thereof are declarable allergens; Annex II grants no exemption for refined peanut oil.")] }],
    ["Corn Oil", ["maize oil", "corn germ oil"], "Oil from maize germ", "Used for frying, margarines and baking.", "", "", ["Margarine", "Fried foods"], 60],
    ["Cottonseed Oil", ["cotton seed oil", "binola oil"], "Oil from cotton seeds", "Used for frying and in shortenings and snack foods.", "", `${SEED_C} Crude cottonseed oil contains toxic gossypol, which refining removes.`, ["Crisps", "Shortening"], 58],
  ]),
  ...oil([
    ["Avocado Oil", ["avocado fruit oil", "cold-pressed avocado oil"], "Oil pressed from avocado flesh", "Used for high-heat cooking, dressings and mayonnaise.", "Mostly monounsaturated fat, similar to olive oil.", "Energy-dense like all fats. Studies of retail avocado oil found many samples oxidised or adulterated.", ["Mayonnaise", "Dressings", "Crisps"], 88],
    ["Walnut Oil", ["walnut kernel oil"], "Nutty cold-pressed oil", "Used in dressings and drizzled on finished dishes.", "Plant omega-3 (ALA) and omega-6.", "Unrefined walnut oil may contain walnut allergens. Spoils quickly; do not heat strongly.", ["Dressings"], 88, { refs: [euAllergens("Nuts and products thereof are declarable allergens.")] }],
    ["Flaxseed Oil", ["linseed oil", "flax oil", "cold-pressed linseed oil"], "Omega-3-rich seed oil", "Used cold in dressings and as a supplement.", "The richest common source of plant omega-3 (ALA).", "Oxidises rapidly; must be kept cold and not used for cooking.", ["Supplements", "Dressings"], 90],
    ["Almond Oil", ["sweet almond oil"], "Mild oil pressed from sweet almonds", "Used in baking, confectionery and dressings.", "Monounsaturated fat and vitamin E.", "Unrefined almond oil can trigger tree-nut allergy. Not the same as bitter almond oil.", ["Baking", "Confectionery"], 88, { refs: [euAllergens("Nuts and products thereof are declarable allergens.")] }],
    ["Mustard Oil", ["sarson ka tel", "kachi ghani mustard oil", "kachi ghani oil", "mustard seed oil"], "Pungent oil used in North and East Indian cooking", "Cold-pressed (kachi ghani) oil from mustard seed, used for cooking and pickles in India and Bangladesh.", "Low in saturated fat; rich in monounsaturated fat and plant omega-3.",
      "Traditional mustard oil is high in erucic acid, which damaged heart tissue in animal studies. The EU caps erucic acid in edible oils and the US does not permit expressed mustard oil as a cooking oil. Mustard is also an allergen. [METHODOLOGY FLAG: the scanner cannot express a concern for a whole food, so this scores as a positive.]",
      ["Pickles", "Bengali and Punjabi cooking"], 72, { refs: [EU_CONTAMINANTS("Sets maximum erucic acid levels for vegetable oils and fats."), euAllergens("Mustard and products thereof are declarable allergens.")] }],
    ["Cocoa Butter", ["cacao butter", "theobroma oil"], "Fat pressed from cocoa beans", "The fat of chocolate; also used in confectionery coatings.", "Stable fat; contains stearic acid, which raises LDL less than other saturated fats.", "High in saturated fat.", ["Chocolate", "White chocolate", "Confectionery"], 84, { refs: [WHO_SFA] }],
  ]),
  ...animalFat([
    ["Lard", ["pork lard", "rendered pork fat", "leaf lard", "saindoux"], "Rendered pork fat", "Used in pastry, frying and traditional baking.", "Mostly monounsaturated and saturated fat; flaky pastry.", "", ["Pastry", "Tamales", "Refried beans"], 76],
    ["Beef Tallow", ["tallow", "beef dripping", "dripping", "rendered beef fat"], "Rendered beef fat", "Used for frying chips, in pastry and in some traditional foods.", "Heat-stable frying fat.", "", ["Chips", "Pastry", "Pemmican"], 74],
    ["Suet", ["beef suet", "shredded suet"], "Hard fat from around beef kidneys", "Shredded and used in British puddings, dumplings and mincemeat.", "Gives light pastry and dumplings.", "High in saturated fat. 'Vegetable suet' is usually palm oil based.", ["Christmas pudding", "Dumplings", "Mincemeat"], 74],
    ["Duck Fat", ["rendered duck fat"], "Rendered poultry fat", "Used for confit and roast potatoes.", "More monounsaturated fat than butter or beef fat.", "", ["Confit", "Roast potatoes"], 78],
    ["Chicken Fat", ["schmaltz", "rendered chicken fat"], "Rendered chicken fat", "Used in Jewish and Central European cooking and in commercial stocks and flavourings.", "Mostly monounsaturated fat.", "", ["Chopped liver", "Stocks", "Soups"], 78],
  ]),
];
