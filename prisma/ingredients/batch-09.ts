// Expansion batch 09 — Pool 5: prebiotics, isolated fibres and protein ingredients.
import type { SeedIngredient } from "./types";
import { family } from "./build";
import { efsa, euAllergens, euNovelFoods, paper } from "./refs";

const NDA = "Dietetic Products, Nutrition and Allergies (NDA)";
const NOVA = paper("Monteiro CA et al.", 2019, "Ultra-processed foods: what they are and how to identify them", "Public Health Nutrition 22(5):936–941",
  "Lists isolated proteins, gluten, casein, whey and soluble/insoluble fibres among the industrial ingredients that mark ultra-processed foods.");
const FDA_FIBRE = { title: "The Declaration of Certain Isolated or Synthetic Non-Digestible Carbohydrates as Dietary Fiber on Nutrition and Supplement Facts Labels: Guidance for Industry", authors: "U.S. Food and Drug Administration", journal: "FDA Guidance Documents", year: 2018, findings: "Recognises mixed plant cell-wall fibres, resistant starch and several oligosaccharides as dietary fibre based on physiological benefit." };

const hmo = family({
  categorySlug: "nutrient", evidenceLevel: "MODERATE", isNatural: false,
  sciConsensus: "Authorised novel food; EFSA found it safe for infants and other groups at the proposed (breast-milk-like) levels.",
  fdaStatus: "GRAS notices (no objection) for infant formula", efsaStatus: "Authorised novel food with conditions of use",
  fssaiStatus: "Not specifically listed", whoStatus: "No ADI",
  benefits: "Mirrors an oligosaccharide naturally abundant in human breast milk that feeds infant bifidobacteria.",
  concerns: "None found at authorised levels. Made by microbial fermentation; free of milk protein.",
  commonProducts: ["Infant formula", "Follow-on formula", "Supplements"],
  refs: [euNovelFoods("Listed with specifications and maximum levels for infant formula and other categories.")],
});

const fibre = family({
  categorySlug: "protein-fibre", evidenceLevel: "MODERATE", isNatural: true,
  sciConsensus: "A food ingredient with no safety concern at use levels. Counts as dietary fibre; NOVA treats isolated fibres as markers of ultra-processing.",
  fdaStatus: "Food ingredient; dietary fibre status per FDA 2018 guidance", efsaStatus: "Food ingredient (not an additive)",
  fssaiStatus: "Permitted food ingredient", whoStatus: "No ADI (food)",
  concerns: "Large amounts can cause bloating; otherwise none.",
  refs: [FDA_FIBRE, NOVA],
});

const protein = family({
  categorySlug: "protein-fibre", evidenceLevel: "MODERATE", isNatural: false,
  sciConsensus: "A nutritionally useful protein ingredient with no toxicological concern; NOVA lists isolated proteins as ultra-processing markers.",
  fdaStatus: "Food ingredient (GRAS)", efsaStatus: "Food ingredient; allergen labelling applies by source",
  fssaiStatus: "Permitted food ingredient", whoStatus: "No ADI (food)",
  refs: [NOVA],
});

export const BATCH_09: SeedIngredient[] = [
  hmo({ slug: "2-fucosyllactose", name: "2'-Fucosyllactose", aliases: ["2'-FL", "2'-O-fucosyllactose"], purposeShort: "Most abundant breast-milk oligosaccharide, added to formula", safetyScore: 92,
    purpose: "Produced by fermentation and added to infant formula and some supplements.",
    refs: [efsa(NDA, "Safety of 2'-O-fucosyllactose as a novel food ingredient pursuant to Regulation (EC) No 258/97", 2015, "Safe for infants at levels found in human milk and for other groups at proposed uses.")] }),
  hmo({ slug: "lacto-n-neotetraose", name: "Lacto-N-neotetraose", aliases: ["LNnT"], purposeShort: "Breast-milk oligosaccharide, added to formula", safetyScore: 92,
    purpose: "Produced by fermentation and added to infant formula, usually with 2'-FL.",
    refs: [efsa(NDA, "Safety of lacto-N-neotetraose as a novel food ingredient pursuant to Regulation (EC) No 258/97", 2015, "Safe for infants at proposed levels in combination with 2'-FL.")] }),
  hmo({ slug: "3-fucosyllactose", name: "3-Fucosyllactose", aliases: ["3-FL"], purposeShort: "Breast-milk oligosaccharide for formula", safetyScore: 90,
    purpose: "Fermentation-derived HMO added to infant formula." }),
  hmo({ slug: "lacto-n-tetraose", name: "Lacto-N-tetraose", aliases: ["LNT"], purposeShort: "Breast-milk oligosaccharide for formula", safetyScore: 90,
    purpose: "Fermentation-derived HMO added to infant formula." }),
  hmo({ slug: "6-sialyllactose", name: "6'-Sialyllactose (sodium salt)", aliases: ["6'-SL"], purposeShort: "Sialylated breast-milk oligosaccharide for formula", safetyScore: 90,
    purpose: "Fermentation-derived HMO added to infant formula." }),
  hmo({ slug: "3-sialyllactose", name: "3'-Sialyllactose (sodium salt)", aliases: ["3'-SL"], purposeShort: "Sialylated breast-milk oligosaccharide for formula", safetyScore: 90,
    purpose: "Fermentation-derived HMO added to infant formula." }),
  hmo({ slug: "xylo-oligosaccharides", name: "Xylo-oligosaccharides", aliases: ["XOS", "xylooligosaccharides"], purposeShort: "Prebiotic fibre from corn cobs or birch", safetyScore: 88,
    purpose: "Short xylose chains added to drinks, dairy and supplements as a prebiotic.", benefits: "Fermented by colonic bacteria; increases bifidobacteria in small trials.",
    concerns: "Wind and bloating at high doses.", commonProducts: ["Prebiotic drinks", "Supplements"] }),
  fibre({ slug: "resistant-starch", name: "Resistant Starch", aliases: ["high-amylose maize starch", "high amylose maize starch", "resistant starch type 2"], purposeShort: "Starch that escapes digestion and acts as fibre",
    purpose: "High-amylose maize or other starches that resist digestion, added to bread, pasta and supplements.",
    benefits: "Lowers the blood-glucose response of the food it replaces; EU-authorised claim for resistant starch replacing digestible starch in bakery products.",
    safetyScore: 90, commonProducts: ["High-fibre bread", "Pasta", "Supplements"],
    refs: [efsa(NDA, "Scientific Opinion on the substantiation of a health claim related to resistant starch and reduction of post-prandial glycaemic responses", 2011, "Replacing digestible starch with resistant starch (≥14% of total starch) reduces post-prandial glycaemic responses.")] }),
  fibre({ slug: "arabinoxylan", name: "Arabinoxylan", aliases: ["wheat arabinoxylan", "arabinoxylan-rich fibre"], purposeShort: "Cereal cell-wall fibre",
    purpose: "Fibre from wheat endosperm or bran added to bread and supplements.", benefits: "EU-authorised claim: arabinoxylan from wheat endosperm (8 g/100 g available carbohydrate) reduces post-meal blood-glucose rise.",
    safetyScore: 90, commonProducts: ["High-fibre bread", "Supplements"],
    refs: [efsa(NDA, "Scientific Opinion on the substantiation of health claims related to arabinoxylan produced from wheat endosperm and reduction of post-prandial glycaemic responses", 2011, "Cause-and-effect relationship established.")] }),
  fibre({ slug: "partially-hydrolysed-guar-gum", name: "Partially Hydrolysed Guar Gum", aliases: ["PHGG", "partially hydrolyzed guar gum", "Sunfiber"], purposeShort: "Low-viscosity soluble fibre from guar",
    purpose: "Guar gum broken into shorter chains so it dissolves without thickening; used in fibre supplements and enteral feeds.", benefits: "Soluble fibre that is well tolerated; some evidence for easing IBS symptoms.",
    safetyScore: 90, commonProducts: ["Fibre supplements", "Enteral nutrition"] }),
  ...([
    ["oat-fibre", "Oat Fibre", ["oat fiber", "oat hull fibre"], "Insoluble fibre from oat hulls", "Milled oat hulls used to add fibre and bind water in bread and low-carb products."],
    ["bamboo-fibre", "Bamboo Fibre", ["bamboo fiber", "bamboo cellulose"], "Insoluble cellulose fibre from bamboo", "Nearly pure insoluble fibre used to add bulk to low-carb baked goods and meat products."],
    ["pea-fibre", "Pea Fibre", ["pea fiber", "pea hull fibre", "pea cell wall fibre"], "Fibre from pea hulls or cotyledons", "Used to add fibre and texture in meat alternatives, bakery and soups."],
    ["apple-fibre", "Apple Fibre", ["apple fiber", "apple pomace fibre"], "Fibre from apple pomace", "Dried apple pomace used to add fibre and bind water in bakery and snacks."],
    ["sugar-beet-fibre", "Sugar Beet Fibre", ["sugar beet fiber", "beet fibre"], "Fibre from sugar beet pulp", "By-product fibre used in bakery and meat products."],
    ["potato-fibre", "Potato Fibre", ["potato fiber"], "Fibre from potato pulp", "Used as a water binder in meat products, sauces and gluten-free bakery."],
    ["wheat-fibre", "Wheat Fibre", ["wheat fiber", "wheat bran fibre"], "Insoluble fibre from wheat", "Milled wheat straw or bran fibre used to add fibre; contains gluten traces unless purified."],
  ] as [string, string, string[], string, string][]).map(([slug, name, aliases, purposeShort, purpose]) => fibre({
    slug, name, aliases, purposeShort, purpose, benefits: "Adds dietary fibre and bulk; helps reduce calories when it replaces flour or fat.",
    safetyScore: 88, commonProducts: ["High-fibre bread", "Low-carb baking", "Meat products"],
    ...(slug === "wheat-fibre" ? { concerns: "Large amounts can cause bloating. Wheat-derived: check gluten status for coeliac disease.", refs: [euAllergens("Cereals containing gluten are declarable allergens.")] } : {}),
  })),
  fibre({ slug: "yeast-beta-glucan", name: "Yeast Beta-Glucan", aliases: ["beta-1,3/1,6-glucan"], purposeShort: "Cell-wall glucan from baker's yeast",
    purpose: "Extracted from yeast cell walls and added to supplements, drinks and cereals.", benefits: "Marketed for immune support; the cholesterol claim for oat/barley beta-glucan does not apply to yeast glucan.",
    concerns: "None identified at authorised levels.", safetyScore: 88, evidenceLevel: "MODERATE", commonProducts: ["Immune supplements", "Fortified drinks"],
    efsaStatus: "Authorised novel food", refs: [euNovelFoods("Yeast beta-glucans listed with specifications and maximum levels.")] }),
  // ── Protein ingredients ──
  protein({ slug: "micellar-casein", name: "Micellar Casein", aliases: ["micellar casein isolate"], purposeShort: "Slow-digesting milk protein",
    purpose: "Milk casein concentrated by filtration, used in protein powders and high-protein yoghurts.", benefits: "High-quality protein digested slowly.",
    concerns: "Milk allergen.", safetyScore: 90, commonProducts: ["Protein powders", "High-protein desserts"], isVegan: false, refs: [euAllergens("Milk is a declarable allergen.")] }),
  protein({ slug: "milk-protein-concentrate", name: "Milk Protein Concentrate", aliases: ["MPC", "milk protein isolate", "MPI"], purposeShort: "Filtered milk protein",
    purpose: "Ultrafiltered skim milk with most lactose removed; used in high-protein dairy, bars and cheese.", benefits: "Complete protein with reduced lactose.",
    concerns: "Milk allergen.", safetyScore: 90, commonProducts: ["High-protein yoghurt", "Protein bars", "Processed cheese"], isVegan: false, refs: [euAllergens("Milk is a declarable allergen.")] }),
  protein({ slug: "hydrolysed-whey-protein", name: "Hydrolysed Whey Protein", aliases: ["whey protein hydrolysate", "hydrolyzed whey protein", "hydrolysed whey"], purposeShort: "Pre-digested whey for formula and sports",
    purpose: "Whey protein broken into peptides; used in hypoallergenic-type infant formulas and fast-absorbing sports products.", benefits: "Easier to digest; partially hydrolysed formulas are used for infants at risk of allergy (benefit evidence is mixed).",
    concerns: "Still a milk allergen unless extensively hydrolysed; bitter taste.", safetyScore: 88, commonProducts: ["Infant formula", "Sports drinks"], isVegan: false, refs: [euAllergens("Milk is a declarable allergen.")] }),
  ...([
    ["rice-protein", "Rice Protein", ["brown rice protein", "rice protein isolate"], "Hypoallergenic plant protein from rice", "Used in vegan protein powders and infant-formula alternatives.", "Rice products can carry inorganic arsenic; reputable suppliers test for it.", 86],
    ["hemp-protein", "Hemp Protein", ["hemp seed protein", "hemp protein powder"], "Protein from hemp seed", "Milled pressed hemp seed used in vegan protein powders.", "THC traces must be within legal limits.", 86],
    ["potato-protein", "Potato Protein", ["potato protein isolate"], "Protein extracted from potato juice", "Used in vegan foams, meat alternatives and bakery.", "Authorised as a novel food in the EU; glycoalkaloid levels are controlled.", 86],
    ["mung-bean-protein", "Mung Bean Protein", ["mung bean protein isolate"], "Protein isolate used in vegan egg", "Used in plant-based egg substitutes.", "Authorised as a novel food in the EU; legume allergy possible.", 86],
    ["fava-bean-protein", "Fava Bean Protein", ["faba bean protein", "broad bean protein"], "Legume protein concentrate", "Used in plant-based milks and meat alternatives.", "People with G6PD deficiency react to fava beans (favism); the risk from isolated protein is not well characterised.", 80],
    ["chickpea-protein", "Chickpea Protein", ["chickpea protein isolate"], "Legume protein", "Used in plant-based dairy and egg alternatives.", "Legume allergy possible.", 88],
    ["rapeseed-protein", "Rapeseed Protein", ["canola protein", "rapeseed protein isolate"], "Protein from rapeseed press cake", "Used in plant-based foods.", "Authorised novel food; can cross-react in people with mustard allergy (both brassicas).", 84],
    ["lupin-protein", "Lupin Protein", ["lupin protein isolate", "lupine protein"], "Legume protein that is a declarable allergen", "Used in vegan foods, bakery and gluten-free products.", "Lupin is an EU-declarable allergen and cross-reacts with peanut allergy.", 80],
  ] as [string, string, string[], string, string, string, number][]).map(([slug, name, aliases, purposeShort, purpose, concerns, safetyScore]) => protein({
    slug, name, aliases, purposeShort, purpose, benefits: "Plant protein source for vegan and allergen-avoiding diets.", concerns, safetyScore,
    commonProducts: ["Protein powders", "Plant-based foods"], isNatural: false,
    ...(slug === "lupin-protein" ? { refs: [euAllergens("Lupin is a declarable allergen.")] } : {}),
    ...(["potato-protein", "mung-bean-protein", "rapeseed-protein"].includes(slug) ? { efsaStatus: "Authorised novel food", refs: [euNovelFoods(`${name} listed with specifications.`)] } : {}),
  })),
  protein({ slug: "vital-wheat-gluten", name: "Vital Wheat Gluten", aliases: ["wheat gluten", "seitan flour"], purposeShort: "Concentrated wheat protein",
    purpose: "Wheat protein washed free of starch; strengthens bread dough and forms the base of seitan and some meat alternatives.", benefits: "Very high protein; improves bread structure.",
    concerns: "Must be avoided in coeliac disease and wheat allergy.", safetyScore: 80, commonProducts: ["Bread", "Seitan", "Meat alternatives"], isNatural: true,
    refs: [euAllergens("Cereals containing gluten (wheat) are declarable allergens.")] }),
  protein({ slug: "mycoprotein", name: "Mycoprotein", aliases: ["Quorn mycoprotein", "Fusarium venenatum biomass"], purposeShort: "Fungal protein behind Quorn",
    purpose: "Biomass of the fungus Fusarium venenatum, grown by fermentation and used in meat alternatives.", benefits: "High in protein and fibre, low in saturated fat; trials show it lowers LDL cholesterol versus meat.",
    concerns: "Rare allergic and gastrointestinal reactions have been reported; products usually include egg white as a binder.", safetyScore: 84, commonProducts: ["Quorn products", "Meat alternatives"],
    refs: [paper("Coelho MOC et al.", 2020, "Mycoprotein as a possible alternative source of dietary protein to support muscle and metabolic health", "Nutrition Reviews 78(6):486–497", "Review of mycoprotein's nutritional profile and metabolic effects, including cholesterol-lowering in trials.")] }),
];
