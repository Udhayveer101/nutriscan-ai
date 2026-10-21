// Expansion batch 06 — Pool 5: mineral forms used in fortification and supplements.
import type { SeedIngredient } from "./types";
import { family } from "./build";
import { efsa, euFortification, euSupplements } from "./refs";

const NDA = "Dietetic Products, Nutrition and Allergies (NDA)";
const drv = (nutrient: string, year: number, findings: string) => efsa(NDA, `Scientific Opinion on Dietary Reference Values for ${nutrient}`, year, findings);
const ANS = "Food Additives and Nutrient Sources added to Food (ANS)";

const mineral = family({
  categorySlug: "vitamin-mineral", evidenceLevel: "STRONG", isNatural: false,
  sciConsensus: "An authorised mineral source; safe at fortification and supplement levels below the tolerable upper intake level.",
  fdaStatus: "GRAS / permitted nutrient source", efsaStatus: "Listed mineral form for foods and/or supplements (Reg. 1925/2006, Dir. 2002/46/EC)",
  fssaiStatus: "Permitted mineral form for fortification/nutraceuticals", whoStatus: "Nutrient; no ADI",
  refs: [euFortification("Annex II lists the mineral substances that may be added to foods."), euSupplements("Annex II lists the mineral substances permitted in food supplements.")],
});

const CA = drv("calcium", 2015, "PRI 950–1000 mg/day for adults; UL 2500 mg/day.");
const MG = drv("magnesium", 2015, "Adequate intake 350 mg/day (men), 300 mg/day (women); UL for supplemental magnesium 250 mg/day (laxative effect).");
const FE = drv("iron", 2015, "PRI 11 mg/day (men), 16 mg/day (premenopausal women).");
const ZN = drv("zinc", 2014, "PRI depends on phytate intake (9.4–16.3 mg/day men); UL 25 mg/day.");
const CU = drv("copper", 2015, "Adequate intake 1.6 mg/day (men), 1.3 mg/day (women); UL 5 mg/day.");
const SE = efsa(NDA, "Scientific opinion on the tolerable upper intake level for selenium", 2023, "UL lowered to 255 µg/day for adults.");
const I = drv("iodine", 2014, "Adequate intake 150 µg/day for adults; UL 600 µg/day.");

export const BATCH_06: SeedIngredient[] = [
  // ── Calcium ──
  mineral({ slug: "calcium-citrate-malate", name: "Calcium Citrate Malate", aliases: ["CCM"], purposeShort: "Highly absorbed calcium for juices",
    purpose: "Calcium source that stays dissolved in fortified juices.", benefits: "Well-absorbed calcium for bone health.", concerns: "UL 2500 mg/day total calcium.",
    safetyScore: 90, commonProducts: ["Calcium-fortified orange juice", "Supplements"], refs: [CA] }),
  mineral({ slug: "calcium-glycerophosphate", name: "Calcium Glycerophosphate", aliases: ["calcium glycerylphosphate"], purposeShort: "Calcium and phosphorus source",
    purpose: "Soluble calcium source in drinks, supplements and some toothpastes.", benefits: "Supplies calcium and phosphate.", concerns: "Contributes to total phosphate intake.",
    safetyScore: 88, commonProducts: ["Fortified drinks", "Supplements"], refs: [CA] }),
  mineral({ slug: "calcium-bisglycinate", name: "Calcium Bisglycinate", aliases: ["calcium glycinate", "calcium amino acid chelate"], purposeShort: "Chelated calcium",
    purpose: "Calcium bound to glycine, used in supplements.", benefits: "Gentle on the stomach.", concerns: "UL 2500 mg/day total calcium.",
    safetyScore: 90, commonProducts: ["Supplements"], refs: [CA] }),
  mineral({ slug: "calcium-l-threonate", name: "Calcium L-Threonate", aliases: ["calcium threonate"], purposeShort: "Calcium salt of threonic acid",
    purpose: "Calcium source in supplements.", benefits: "Supplies calcium.", concerns: "Fewer data than older calcium salts.",
    evidenceLevel: "MODERATE", safetyScore: 86, commonProducts: ["Supplements"],
    refs: [CA, efsa(ANS, "Scientific Opinion on calcium L-threonate for nutritional purposes as a source of calcium", 2008, "No safety concern at the proposed use levels.")] }),
  // ── Magnesium ──
  ...([
    ["magnesium-citrate", "Magnesium Citrate", ["trimagnesium dicitrate"], "Well-absorbed magnesium", "Common supplement and fortificant form of magnesium.", 88],
    ["magnesium-gluconate", "Magnesium Gluconate", [], "Magnesium salt of gluconic acid", "Magnesium source in drinks and supplements.", 88],
    ["magnesium-glycerophosphate", "Magnesium Glycerophosphate", [], "Magnesium and phosphorus source", "Soluble magnesium source used in supplements.", 88],
    ["magnesium-bisglycinate", "Magnesium Bisglycinate", ["magnesium glycinate", "magnesium amino acid chelate"], "Chelated magnesium", "Magnesium bound to glycine, popular in supplements.", 88],
    ["magnesium-sulphate", "Magnesium Sulphate", ["magnesium sulfate", "Epsom salt", "E518"], "Magnesium salt; also a firming agent", "Magnesium source and firming agent (E518) in tofu and brewing water.", 84],
    ["magnesium-lactate", "Magnesium Lactate", ["E329"], "Magnesium salt of lactic acid", "Magnesium source and acidity regulator.", 88],
  ] as [string, string, string[], string, string, number][]).map(([slug, name, aliases, purposeShort, purpose, safetyScore]) => mineral({
    slug, name, aliases, purposeShort, purpose, benefits: "Supplies magnesium for muscle, nerve and bone function.",
    concerns: "Supplemental magnesium above 250 mg/day can cause diarrhoea (EFSA UL). People with kidney failure must avoid magnesium loads.",
    safetyScore, commonProducts: ["Supplements", "Fortified drinks"], refs: [MG] })),
  // ── Iron ──
  mineral({ slug: "ferrous-bisglycinate", name: "Ferrous Bisglycinate", aliases: ["iron bisglycinate", "iron glycinate", "Ferrochel"], purposeShort: "Chelated iron with fewer side effects",
    purpose: "Iron bound to glycine for supplements and fortified foods.", benefits: "Absorbed well even with phytate-rich meals; less constipation than ferrous sulphate.",
    concerns: "Iron excess is harmful in haemochromatosis; supplements are a leading cause of poisoning in young children.",
    safetyScore: 86, commonProducts: ["Iron supplements", "Fortified cereals"],
    refs: [FE, efsa("Food Additives, Flavourings, Processing Aids and Materials in Contact with Food (AFC)", "Opinion on ferrous bisglycinate as a source of iron for use in the manufacturing of foods and in food supplements", 2006, "Acceptable as a source of iron at proposed use levels.")] }),
  mineral({ slug: "ferric-sodium-edta", name: "Ferric Sodium EDTA", aliases: ["sodium iron EDTA", "NaFeEDTA", "sodium feredetate"], purposeShort: "Iron fortificant that works in phytate-rich foods",
    purpose: "Iron fortificant for flour, soy and fish sauce and condiments in low-income settings.", benefits: "Absorbed 2–3× better than ferrous sulphate from high-phytate diets; recommended by WHO for fortifying high-extraction flour.",
    concerns: "Contributes EDTA; intake must stay within the EDTA ADI (1.9 mg/kg bw as EDTA).", safetyScore: 84, commonProducts: ["Fortified flour", "Fish sauce", "Soy sauce"],
    adiValue: "EDTA 1.9 mg/kg bw/day (JECFA)",
    refs: [FE, efsa(ANS, "Scientific Opinion on the use of ferric sodium EDTA as a source of iron added for nutritional purposes to foods", 2010, "Safe under proposed conditions if total EDTA intake stays within the ADI.")] }),
  ...([
    ["ferrous-carbonate", "Ferrous Carbonate", ["iron(II) carbonate"], "Iron salt fortificant", 84],
    ["ferrous-citrate", "Ferrous Citrate", ["iron(II) citrate"], "Iron salt fortificant", 84],
    ["ferric-citrate", "Ferric Citrate", ["iron(III) citrate"], "Iron salt (also a phosphate binder drug)", 84],
    ["ferric-saccharate", "Ferric Saccharate", ["ferric saccharate complex"], "Iron–sucrose complex", 84],
    ["ferric-orthophosphate", "Ferric Orthophosphate", ["ferric phosphate", "iron(III) phosphate"], "Colour-neutral iron for cereals", 84],
    ["ferrous-succinate", "Ferrous Succinate", ["iron(II) succinate"], "Iron salt fortificant", 84],
  ] as [string, string, string[], string, number][]).map(([slug, name, aliases, purposeShort, safetyScore]) => mineral({
    slug, name, aliases, purposeShort, purpose: "Iron source for fortified foods or supplements.",
    benefits: "Helps prevent iron-deficiency anaemia, the most common nutritional deficiency worldwide.",
    concerns: "Excess iron is harmful in haemochromatosis and to children who swallow supplements. Less soluble forms are absorbed less well.",
    safetyScore, commonProducts: ["Fortified cereals", "Infant cereals", "Supplements"], refs: [FE] })),
  // ── Zinc ──
  ...([
    ["zinc-sulphate", "Zinc Sulphate", ["zinc sulfate"]],
    ["zinc-gluconate", "Zinc Gluconate", []],
    ["zinc-citrate", "Zinc Citrate", ["trizinc dicitrate"]],
    ["zinc-bisglycinate", "Zinc Bisglycinate", ["zinc glycinate"]],
    ["zinc-picolinate", "Zinc Picolinate", []],
    ["zinc-carbonate", "Zinc Carbonate", []],
  ] as [string, string, string[]][]).map(([slug, name, aliases]) => mineral({
    slug, name, aliases, purposeShort: "Zinc source", purpose: "Zinc salt for fortified foods, lozenges and supplements.",
    benefits: "Zinc supports immunity, growth and wound healing.",
    concerns: "UL 25 mg/day (EFSA); chronic excess causes copper deficiency.",
    safetyScore: 86, commonProducts: ["Supplements", "Zinc lozenges", "Fortified cereals"], refs: [ZN] })),
  // ── Copper ──
  ...([
    ["copper-sulphate", "Copper Sulphate", ["cupric sulphate", "copper sulfate"]],
    ["copper-gluconate", "Copper Gluconate", ["cupric gluconate"]],
    ["cupric-citrate", "Cupric Citrate", ["copper citrate"]],
    ["copper-bisglycinate", "Copper Bisglycinate", ["copper glycinate"]],
  ] as [string, string, string[]][]).map(([slug, name, aliases]) => mineral({
    slug, name, aliases, purposeShort: "Copper source", purpose: "Copper salt for infant formula, fortified foods and supplements.",
    benefits: "Copper is needed for iron metabolism and connective tissue.",
    concerns: "UL 5 mg/day (EFSA); people with Wilson disease must avoid added copper.",
    safetyScore: 86, commonProducts: ["Infant formula", "Multivitamins"], refs: [CU] })),
  // ── Iodine ──
  mineral({ slug: "potassium-iodate", name: "Potassium Iodate", aliases: ["KIO3"], purposeShort: "Iodine fortificant for salt",
    purpose: "The usual iodine source in iodised salt in hot, humid countries, including India.", benefits: "Salt iodisation has sharply reduced goitre and iodine-deficiency disorders.",
    concerns: "Excess iodine (UL 600 µg/day) can disturb thyroid function.", safetyScore: 88, commonProducts: ["Iodised salt"], fssaiStatus: "Mandated iodine source for iodised salt",
    refs: [I] }),
  mineral({ slug: "sodium-iodide", name: "Sodium Iodide", aliases: ["NaI"], purposeShort: "Iodine source", purpose: "Iodine source in supplements and some fortified foods.",
    benefits: "Prevents iodine deficiency.", concerns: "UL 600 µg/day iodine.", safetyScore: 88, commonProducts: ["Supplements"], refs: [I] }),
  // ── Selenium ──
  mineral({ slug: "sodium-selenite", name: "Sodium Selenite", aliases: ["sodium hydrogen selenite"], purposeShort: "Inorganic selenium source",
    purpose: "Selenium source in supplements, infant formula and fortified foods.", benefits: "Selenium supports antioxidant enzymes and thyroid hormone metabolism.",
    concerns: "Narrow margin: EFSA lowered the UL to 255 µg/day in 2023; chronic excess causes hair and nail loss.", safetyScore: 80, commonProducts: ["Multivitamins", "Infant formula"], refs: [SE] }),
  mineral({ slug: "sodium-selenate", name: "Sodium Selenate", aliases: [], purposeShort: "Inorganic selenium source",
    purpose: "Selenium source in supplements and fortified foods.", benefits: "Supplies selenium.", concerns: "UL 255 µg/day (EFSA 2023).",
    safetyScore: 80, commonProducts: ["Supplements"], refs: [SE] }),
  mineral({ slug: "l-selenomethionine", name: "L-Selenomethionine", aliases: ["selenomethionine"], purposeShort: "Organic selenium form",
    purpose: "Selenium bound to methionine, the main form in foods; used in supplements.", benefits: "Well absorbed.",
    concerns: "Stored in body proteins, so it accumulates more than selenite; UL 255 µg/day.", safetyScore: 80, commonProducts: ["Supplements"],
    refs: [SE, efsa(ANS, "Scientific Opinion on L-selenomethionine as a source of selenium added for nutritional purposes to food supplements", 2009, "Acceptable source of selenium; total intake must respect the UL.")] }),
  mineral({ slug: "selenium-yeast", name: "Selenium-enriched Yeast", aliases: ["selenium yeast", "selenised yeast"], purposeShort: "Yeast grown in selenium-rich media",
    purpose: "Baker's yeast that has absorbed selenium, mainly as selenomethionine; used in supplements.", benefits: "Organic selenium source.",
    concerns: "UL 255 µg/day; selenium content must be standardised.", safetyScore: 80, commonProducts: ["Supplements"], refs: [SE] }),
  // ── Trace elements ──
  mineral({ slug: "chromium-picolinate", name: "Chromium Picolinate", aliases: ["chromium(III) picolinate"], purposeShort: "Chromium supplement form",
    purpose: "Trivalent chromium source in supplements marketed for blood-sugar control.", benefits: "Supplies chromium; EFSA found no evidence chromium is essential, and blood-sugar benefits are unproven.",
    concerns: "Case reports of kidney and liver injury at high doses; some genotoxicity concerns in vitro were not confirmed in vivo.",
    evidenceLevel: "MODERATE", safetyScore: 74, commonProducts: ["Blood-sugar supplements", "Weight-loss supplements"],
    refs: [drv("chromium", 2014, "Concluded there is no evidence of beneficial effects of chromium in healthy people; no DRV set."), efsa(ANS, "Scientific Opinion on chromium picolinate, zinc picolinate and zinc picolinate dihydrate added for nutritional purposes in food supplements", 2009, "No safety concern for chromium picolinate at up to 250 µg Cr(III)/day.")] }),
  mineral({ slug: "chromium-chloride", name: "Chromium(III) Chloride", aliases: ["chromic chloride", "chromium trichloride"], purposeShort: "Chromium source",
    purpose: "Trivalent chromium in supplements and some formula.", benefits: "Supplies chromium; essentiality is debated.",
    concerns: "Trivalent chromium is far less toxic than hexavalent; no concern at supplement doses.", evidenceLevel: "MODERATE", safetyScore: 80, commonProducts: ["Multivitamins"],
    refs: [drv("chromium", 2014, "No DRV set; chromium not considered essential.")] }),
  mineral({ slug: "sodium-molybdate", name: "Sodium Molybdate", aliases: ["ammonium molybdate"], purposeShort: "Molybdenum source",
    purpose: "Molybdenum source in multivitamins and formula.", benefits: "Molybdenum is a cofactor for several enzymes.",
    concerns: "UL 0.6 mg/day (SCF); deficiency and excess are rare.", safetyScore: 88, commonProducts: ["Multivitamins"],
    refs: [drv("molybdenum", 2013, "Adequate intake 65 µg/day for adults.")] }),
  mineral({ slug: "manganese-sulphate", name: "Manganese Sulphate", aliases: ["manganese sulfate"], purposeShort: "Manganese source",
    purpose: "Manganese source in infant formula and supplements.", benefits: "Manganese is a cofactor in bone and metabolic enzymes.",
    concerns: "No EFSA UL could be set; high exposure is neurotoxic (occupational and drinking water).", safetyScore: 84, commonProducts: ["Infant formula", "Multivitamins"],
    refs: [drv("manganese", 2013, "Adequate intake 3 mg/day for adults.")] }),
  mineral({ slug: "manganese-gluconate", name: "Manganese Gluconate", aliases: [], purposeShort: "Manganese source",
    purpose: "Manganese source in supplements.", benefits: "Supplies manganese.", concerns: "No UL set; avoid high-dose supplements.", safetyScore: 84, commonProducts: ["Supplements"],
    refs: [drv("manganese", 2013, "Adequate intake 3 mg/day for adults.")] }),
  mineral({ slug: "sodium-fluoride", name: "Sodium Fluoride", aliases: ["NaF"], purposeShort: "Fluoride source for salt and supplements",
    purpose: "Used in fluoridated salt in some countries and in supplements.", benefits: "Fluoride reduces dental caries.",
    concerns: "Excess in childhood causes dental fluorosis; UL 0.1 mg/kg bw/day for children up to 8 years (EFSA).", safetyScore: 76, commonProducts: ["Fluoridated salt", "Fluoride tablets"],
    refs: [drv("fluoride", 2013, "Adequate intake 0.05 mg/kg bw/day; UL protects against dental fluorosis.")] }),
  mineral({ slug: "potassium-fluoride", name: "Potassium Fluoride", aliases: ["KF"], purposeShort: "Fluoride source for salt",
    purpose: "Fluoride source for fluoridated table salt.", benefits: "Reduces dental caries.",
    concerns: "Same fluorosis risk as other fluorides when total intake is high in young children.", safetyScore: 76, commonProducts: ["Fluoridated salt"],
    refs: [drv("fluoride", 2013, "Adequate intake 0.05 mg/kg bw/day.")] }),
];
