// Evidence-based additive knowledge base — the scientific "source of truth" overlay.
// Keyed by canonical concepts; matched against label text via keywords + E-numbers.
// Every non-trivial claim carries a regulatory/consensus reference. This is deliberately
// curated (high-impact additives) rather than auto-generated — see vault Methodology.md.
// ponytail: hand-curated ~45 entries covers the additives that actually move a score;
// add rows here (single source) when validation surfaces a gap — no code change needed.

export type Evidence = "STRONG" | "MODERATE" | "LIMITED" | "INSUFFICIENT";
export type ConcernLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface AdditiveProfile {
  id: string;
  name: string;
  keywords: string[];        // lowercase substrings matched against label text
  eNumbers?: string[];       // e.g. ["e211"]
  category: string;
  function: string;
  // Concern by concentration bracket (label order ≈ descending weight).
  // dominant = positions 0-2, moderate = 3-6, trace = 7+. null = keep base.
  dominant: ConcernLevel;
  moderate: ConcernLevel;
  trace: ConcernLevel;
  evidence: Evidence;        // strength of evidence behind the concern
  adi?: string;              // Acceptable Daily Intake (regulatory)
  regulatory: string;        // one-line status across bodies
  populations?: string[];    // groups with heightened concern
  note: string;              // the "why", plain language, for explanations
  ref: string;               // primary authority for the claim
}

// ─────────────────────────────────────────────────────────────────────────────
// CRITICAL — banned in multiple jurisdictions or WHO Group 1/2 at normal exposure.
// These set a hard ceiling regardless of amount.
// ─────────────────────────────────────────────────────────────────────────────
export const ADDITIVES: AdditiveProfile[] = [
  {
    id: "partially-hydrogenated-oil", name: "Partially Hydrogenated Oil (trans fat)",
    keywords: ["partially hydrogenated", "hydrogenated vegetable", "hydrogenated fat"],
    category: "fat", function: "Solid fat / shelf life",
    dominant: "CRITICAL", moderate: "CRITICAL", trace: "CRITICAL", evidence: "STRONG",
    regulatory: "Banned FDA (2018), EU (2021), WHO elimination target",
    populations: ["everyone — no safe intake"],
    note: "Industrial trans fat. No safe level; directly raises LDL, lowers HDL, strongly linked to coronary heart disease.",
    ref: "WHO REPLACE 2018; FDA 2015 final determination on PHOs",
  },
  {
    id: "potassium-bromate", name: "Potassium Bromate", keywords: ["potassium bromate"], eNumbers: ["e924"],
    category: "flour treatment", function: "Dough strengthener",
    dominant: "CRITICAL", moderate: "CRITICAL", trace: "HIGH", evidence: "STRONG",
    regulatory: "Banned EU, UK, Canada, India, Brazil; IARC Group 2B",
    populations: ["everyone"],
    note: "Possible human carcinogen; residual bromate causes renal/thyroid tumours in animals. Banned in most of the world, still permitted in the US.",
    ref: "IARC Monograph Vol. 73; FSSAI ban 2016",
  },
  {
    id: "sodium-nitrite", name: "Sodium/Potassium Nitrite & Nitrate",
    keywords: ["sodium nitrite", "sodium nitrate", "potassium nitrite", "potassium nitrate", "saltpetre", "saltpeter", "cultured celery"],
    eNumbers: ["e249", "e250", "e251", "e252"],
    category: "preservative", function: "Cure / colour fixative in processed meat",
    dominant: "CRITICAL", moderate: "HIGH", trace: "MEDIUM", evidence: "STRONG",
    adi: "Nitrite 0.07 mg/kg bw/day (EFSA 2017)",
    regulatory: "Permitted with limits; processed meat = IARC Group 1 carcinogen",
    populations: ["infants (methaemoglobinaemia)", "colorectal cancer risk"],
    note: "Forms carcinogenic nitrosamines with amines under heat/stomach acid. Processed meats containing these are a WHO Group 1 carcinogen. \"Cultured celery\" powder in \"uncured\" meats is the same nitrite from a vegetable source, at similar residual levels.",
    ref: "IARC 2015 (processed meat); EFSA 2017 nitrite re-evaluation",
  },
  {
    id: "titanium-dioxide", name: "Titanium Dioxide", keywords: ["titanium dioxide"], eNumbers: ["e171"],
    category: "coloring", function: "Whitener / opacifier",
    dominant: "CRITICAL", moderate: "HIGH", trace: "HIGH", evidence: "MODERATE",
    regulatory: "Banned as food additive in EU (2022); still allowed US",
    populations: ["everyone"],
    note: "EFSA could no longer rule out genotoxicity from nanoparticles; EU withdrew its safety approval and banned it in food.",
    ref: "EFSA 2021 opinion; EU Reg. 2022/63",
  },
  {
    id: "brominated-vegetable-oil", name: "Brominated Vegetable Oil", keywords: ["brominated vegetable oil", "bvo"], eNumbers: ["e443"],
    category: "stabilizer", function: "Emulsifier in citrus sodas",
    dominant: "CRITICAL", moderate: "HIGH", trace: "MEDIUM", evidence: "MODERATE",
    regulatory: "Banned EU, Japan, India; FDA revoked authorization 2024",
    note: "Bromine accumulates in tissue; animal studies show thyroid and neurological effects. FDA revoked its US food use in 2024.",
    ref: "FDA final rule 2024; EU E443 prohibition",
  },
  {
    id: "red-3", name: "Red 3 (Erythrosine)", keywords: ["red 3", "erythrosine"], eNumbers: ["e127"],
    category: "coloring", function: "Synthetic red dye",
    dominant: "CRITICAL", moderate: "HIGH", trace: "MEDIUM", evidence: "MODERATE",
    regulatory: "FDA revoked food authorization Jan 2025; banned in cosmetics since 1990",
    populations: ["children"],
    note: "Caused thyroid tumours in rats; FDA revoked its use in food and ingested drugs in 2025 under the Delaney Clause.",
    ref: "FDA 2025 revocation; 21 CFR Delaney Clause",
  },

  // ───────────────────────────────────────────────────────────────────────────
  // HIGH concern — solid evidence of risk at typical/dominant exposure.
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "aspartame", name: "Aspartame", keywords: ["aspartame", "aspartame-acesulfame salt", "aspartame acesulfame salt"], eNumbers: ["e951", "e962"],
    category: "sweetener", function: "Artificial sweetener",
    dominant: "HIGH", moderate: "HIGH", trace: "MEDIUM", evidence: "LIMITED",
    adi: "40 mg/kg bw/day (EFSA); 50 (FDA)",
    regulatory: "Approved; IARC Group 2B 'possibly carcinogenic' (2023)",
    populations: ["phenylketonuria (PKU) — must avoid"],
    note: "IARC classified it possibly carcinogenic in 2023, though JECFA kept the ADI. Contraindicated in PKU. Evidence for harm at normal intake is limited but contested.",
    ref: "IARC/JECFA joint 2023 assessment",
  },
  {
    id: "bha", name: "BHA (Butylated Hydroxyanisole)", keywords: ["bha", "butylated hydroxyanisole"], eNumbers: ["e320"],
    category: "antioxidant", function: "Fat antioxidant",
    dominant: "HIGH", moderate: "HIGH", trace: "MEDIUM", evidence: "MODERATE",
    adi: "0.5 mg/kg bw/day (JECFA)",
    regulatory: "IARC Group 2B; NTP 'reasonably anticipated' carcinogen",
    note: "Forestomach tumours in rodents; listed as reasonably anticipated to be a human carcinogen. Used at trace levels but concern is real.",
    ref: "IARC Vol. 40; NTP Report on Carcinogens",
  },
  {
    id: "bht", name: "BHT (Butylated Hydroxytoluene)", keywords: ["bht", "butylated hydroxytoluene"], eNumbers: ["e321"],
    category: "antioxidant", function: "Fat antioxidant",
    dominant: "HIGH", moderate: "MEDIUM", trace: "MEDIUM", evidence: "LIMITED",
    adi: "0.25 mg/kg bw/day (EFSA 2012)",
    regulatory: "Approved EU/FDA; mixed animal evidence",
    note: "Related to BHA; animal evidence is mixed (both tumour promotion and inhibition reported). EFSA re-affirmed its ADI in 2012.",
    ref: "EFSA 2012 re-evaluation of BHT",
  },
  {
    id: "tbhq", name: "TBHQ", keywords: ["tbhq", "tertiary butylhydroquinone"], eNumbers: ["e319"],
    category: "antioxidant", function: "Fat antioxidant",
    dominant: "HIGH", moderate: "HIGH", trace: "MEDIUM", evidence: "LIMITED",
    adi: "0.7 mg/kg bw/day (JECFA)",
    regulatory: "Approved with limits; emerging immune-effect research",
    note: "Within ADI regarded as safe, but recent immunotoxicology research links it to impaired immune response. Used in fried/packaged foods.",
    ref: "JECFA; EFSA 2004 opinion",
  },
  {
    id: "hfcs", name: "High Fructose Corn Syrup", keywords: ["high fructose corn syrup", "hfcs", "glucose-fructose syrup", "fructose-glucose syrup", "isoglucose"],
    category: "sweetener", function: "Caloric sweetener",
    dominant: "HIGH", moderate: "MEDIUM", trace: "LOW", evidence: "MODERATE",
    regulatory: "GRAS; no ADI (a sugar, not an additive)",
    populations: ["metabolic syndrome", "diabetes", "NAFLD risk"],
    note: "As a dominant ingredient it is added sugar in bulk — linked to obesity, type-2 diabetes and fatty liver. Concern scales with amount.",
    ref: "WHO sugars guideline 2015; AHA added-sugar limits",
  },
  {
    id: "msg", name: "Monosodium Glutamate", keywords: ["monosodium glutamate", "msg", "glutamic acid", "monopotassium glutamate", "calcium diglutamate", "magnesium diglutamate", "monoammonium glutamate", "glutamate"], eNumbers: ["e621", "e620", "e622", "e623", "e624", "e625"],
    category: "flavor enhancer", function: "Umami flavour enhancer",
    dominant: "HIGH", moderate: "MEDIUM", trace: "LOW", evidence: "LIMITED",
    adi: "EFSA 30 mg/kg bw/day (glutamates, 2017)",
    regulatory: "GRAS; EFSA set a group ADI in 2017 (first ever)",
    populations: ["self-reported sensitivity"],
    note: "Long-standing 'safe' status, but EFSA introduced an ADI in 2017 after neurotoxicity signals at high intake. Dominant use (heavy seasoning) is the concern, not trace.",
    ref: "EFSA 2017 glutamates re-evaluation",
  },
  {
    id: "palm-oil", name: "Palm Oil", keywords: ["palm oil", "palm kernel", "palm fat", "palm olein", "palmolein", "palm stearin", "fractionated palm"],
    category: "fat", function: "Cheap solid fat",
    dominant: "HIGH", moderate: "HIGH", trace: "MEDIUM", evidence: "MODERATE",
    regulatory: "Permitted; refining produces 3-MCPD/glycidyl esters (EFSA concern)",
    note: "High in saturated fat; high-temperature refining forms glycidyl esters (genotoxic carcinogens). Concern rises with amount and refining.",
    ref: "EFSA 2016 process contaminants in palm oil",
  },
  {
    id: "sodium-benzoate", name: "Sodium Benzoate", keywords: ["sodium benzoate", "benzoic acid", "potassium benzoate", "benzoate"], eNumbers: ["e211", "e210", "e212", "e213"],
    category: "preservative", function: "Antimicrobial preservative",
    dominant: "HIGH", moderate: "HIGH", trace: "MEDIUM", evidence: "MODERATE",
    adi: "5 mg/kg bw/day (EFSA)",
    regulatory: "Approved; benzene-formation risk with ascorbic acid",
    populations: ["children (hyperactivity, w/ dyes)"],
    note: "Safe alone within ADI, but reacts with vitamin C in acidic drinks to form benzene, a known carcinogen. See interaction analysis.",
    ref: "EFSA 2016; FDA benzene-in-beverages advisory",
  },
  {
    id: "carrageenan", name: "Carrageenan", keywords: ["carrageenan"], eNumbers: ["e407"],
    category: "thickener", function: "Gelling/thickening agent",
    dominant: "HIGH", moderate: "MEDIUM", trace: "LOW", evidence: "LIMITED",
    regulatory: "Approved; EFSA 2018 flagged degraded-carrageenan uncertainty",
    populations: ["IBD / gut-sensitive individuals"],
    note: "Food-grade is approved, but animal and in-vitro studies link it to intestinal inflammation; EFSA could not set a firm safety margin in 2018.",
    ref: "EFSA 2018 carrageenan re-evaluation",
  },
  {
    id: "phosphoric-acid", name: "Phosphoric Acid", keywords: ["phosphoric acid"], eNumbers: ["e338"],
    category: "acidity regulator", function: "Acidulant in colas",
    dominant: "HIGH", moderate: "MEDIUM", trace: "LOW", evidence: "MODERATE",
    regulatory: "Approved; EFSA 2019 set group ADI for phosphates",
    populations: ["chronic kidney disease", "bone density"],
    note: "High cola intake is associated with lower bone mineral density and kidney strain. EFSA introduced a phosphate group ADI in 2019.",
    ref: "EFSA 2019 phosphates re-evaluation",
  },
  {
    id: "caramel-color-iv", name: "Caramel Colour (Class III/IV)", keywords: ["sulphite ammonia caramel", "sulfite ammonia caramel", "ammonia caramel", "class iii caramel", "class iv caramel", "caramel color", "caramel colour", "e150c", "e150d"], eNumbers: ["e150c", "e150d"],
    category: "coloring", function: "Brown colouring",
    dominant: "HIGH", moderate: "MEDIUM", trace: "LOW", evidence: "LIMITED",
    adi: "4-MEI-related; EFSA 100–200 mg/kg for caramels",
    regulatory: "Approved; 4-MEI contaminant listed by California Prop 65",
    note: "Ammonia-process caramel colours contain 4-methylimidazole, a possible carcinogen (Prop 65 listed). Concern is the contaminant, not the colour itself.",
    ref: "IARC 4-MEI; California OEHHA Prop 65",
  },

  // Synthetic azo/colour dyes — Southampton study (hyperactivity)
  {
    id: "azo-dyes", name: "Synthetic Colour Dyes (Red 40, Yellow 5/6, etc.)",
    keywords: ["indigo carmine", "cochineal red a", "red 40", "allura red", "yellow 5", "tartrazine", "yellow 6", "sunset yellow",
               "blue 1", "brilliant blue", "blue 2", "indigotine", "ponceau",
               "quinoline yellow", "carmoisine", "azorubine"],
    eNumbers: ["e129", "e102", "e110", "e133", "e132", "e124", "e104", "e122"],
    category: "coloring", function: "Synthetic colour",
    dominant: "HIGH", moderate: "MEDIUM", trace: "LOW", evidence: "MODERATE",
    regulatory: "Approved; EU mandates hyperactivity warning label",
    populations: ["children (ADHD-type behaviour)"],
    note: "The Southampton study linked these dyes to hyperactivity in children; the EU requires a warning label, the US does not. Purely cosmetic — no nutritional value.",
    ref: "McCann et al. 2007 (Lancet); EU Reg. 1333/2008 Annex V",
  },

  // ───────────────────────────────────────────────────────────────────────────
  // MEDIUM — refined/ultra-processed markers, real but modest concern.
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "maltodextrin", name: "Maltodextrin", keywords: ["maltodextrin"],
    category: "thickener", function: "Filler / bulking agent",
    dominant: "MEDIUM", moderate: "MEDIUM", trace: "LOW", evidence: "LIMITED",
    regulatory: "GRAS", populations: ["diabetes (GI ~110)", "gut microbiome"],
    note: "Higher glycaemic index than table sugar; a marker of ultra-processing with negligible nutrition. Some evidence of adverse gut-microbiome effects.",
    ref: "FDA GRAS; Nickerson 2015 (gut microbiome)",
  },
  {
    id: "modified-starch", name: "Modified Starch", keywords: ["osa starch", "modified starch", "modified food starch", "modified corn starch", "modified maize starch", "modified tapioca starch", "modified potato starch", "dextrin", "oxidised starch", "oxidized starch", "monostarch phosphate", "distarch phosphate", "acetylated starch", "starch acetate", "acetylated distarch adipate", "hydroxypropyl starch", "hydroxypropyl distarch phosphate", "acetylated oxidised starch", "starch sodium octenyl succinate", "sodium starch octenyl succinate", "acid treated starch", "acid-treated starch", "alkaline treated starch", "alkali treated starch", "bleached starch", "enzyme treated starch", "enzyme-treated starch", "alkaline-treated starch", "alkali-treated starch", "distarch glycerol"],
    eNumbers: ["e1400", "e1401", "e1402", "e1403", "e1404", "e1405", "e1410", "e1412", "e1413", "e1414", "e1420", "e1422", "e1440", "e1442", "e1450", "e1451", "e1411"],
    category: "thickener", function: "Texture / stability",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "INSUFFICIENT",
    regulatory: "GRAS",
    note: "Chemically/physically altered starch. Safe, but a refined ingredient signalling ultra-processing with little nutritional contribution.",
    ref: "FDA 21 CFR 172.892",
  },
  {
    id: "acesulfame-k", name: "Acesulfame Potassium", keywords: ["acesulfame", "ace-k"], eNumbers: ["e950"],
    category: "sweetener", function: "Artificial sweetener",
    dominant: "MEDIUM", moderate: "MEDIUM", trace: "LOW", evidence: "LIMITED",
    adi: "9 mg/kg bw/day (EFSA)",
    regulatory: "Approved; EFSA re-evaluation ongoing",
    note: "Non-caloric; within ADI regarded safe but original safety studies were criticised and EFSA is re-evaluating. Common in diet drinks.",
    ref: "EFSA 2000; ongoing re-evaluation",
  },
  {
    id: "sucralose", name: "Sucralose", keywords: ["trichlorogalactosucrose", "sucralose"], eNumbers: ["e955"],
    category: "sweetener", function: "Artificial sweetener",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "LIMITED",
    adi: "15 mg/kg bw/day (EFSA)",
    regulatory: "Approved; heat-degradation & sucralose-6-acetate concerns (2023)",
    note: "Long considered inert, but 2023 research on the metabolite sucralose-6-acetate raised genotoxicity questions. Heating (baking) may form chloropropanols.",
    ref: "Schiffman 2023; EFSA opinion",
  },
  {
    id: "potassium-sorbate", name: "Potassium Sorbate", keywords: ["potassium sorbate", "sorbic acid", "calcium sorbate", "sorbate"], eNumbers: ["e202", "e200", "e203"],
    category: "preservative", function: "Antimicrobial preservative",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "INSUFFICIENT",
    adi: "3 mg/kg bw/day (EFSA 2015)",
    regulatory: "Approved; among the safer preservatives",
    note: "One of the better-tolerated preservatives; low toxicity. Minor genotoxicity flags at very high doses only.",
    ref: "EFSA 2015 sorbates re-evaluation",
  },
  {
    id: "polysorbate-80", name: "Polysorbate 80", keywords: ["polyoxyethylene sorbitan", "polysorbate 80", "polysorbate 60", "polysorbate 40", "polysorbate 65", "polysorbate", "tween 40", "tween 65"], eNumbers: ["e433", "e434", "e435", "e436"],
    category: "emulsifier", function: "Emulsifier",
    dominant: "MEDIUM", moderate: "MEDIUM", trace: "LOW", evidence: "LIMITED",
    adi: "25 mg/kg bw/day (EFSA)",
    regulatory: "Approved; emulsifier–microbiome research emerging",
    populations: ["gut inflammation"],
    note: "Emerging research links dietary emulsifiers to gut-microbiome disruption and low-grade inflammation in animal models.",
    ref: "Chassaing et al. 2015 (Nature)",
  },
  {
    id: "carboxymethylcellulose", name: "Carboxymethylcellulose (CMC)", keywords: ["carboxymethylcellulose", "carboxymethyl cellulose", "cellulose gum", "cmc", "croscarmellose"], eNumbers: ["e466", "e468", "e469"],
    category: "thickener", function: "Thickener / stabiliser",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "LIMITED",
    regulatory: "Approved; emulsifier–microbiome research",
    populations: ["gut inflammation"],
    note: "Like other synthetic emulsifiers, human RCT (2022) showed altered gut microbiota and mucus layer. Modest, emerging concern.",
    ref: "Chassaing et al. 2022 (Gastroenterology)",
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Nutrients / benign — positive or neutral, to prevent false penalties.
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "ascorbic-acid", name: "Ascorbic Acid (Vitamin C)", keywords: ["ascorbic acid", "vitamin c", "sodium ascorbate", "calcium ascorbate", "potassium ascorbate", "magnesium ascorbate", "zinc ascorbate", "magnesium l-ascorbate"], eNumbers: ["e300", "e301", "e302"],
    category: "antioxidant", function: "Antioxidant / vitamin",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    regulatory: "GRAS; essential nutrient",
    note: "Vitamin C — beneficial antioxidant. Caveat: with benzoate preservatives in acidic drinks it can drive benzene formation (see interactions).",
    ref: "EFSA vitamin C DRV",
  },
  {
    id: "citric-acid", name: "Citric Acid", keywords: ["citric acid"], eNumbers: ["e330"],
    category: "acidity regulator", function: "Acidulant",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    regulatory: "GRAS",
    note: "Naturally occurring, generally benign. Very high intake can erode dental enamel but no systemic concern.",
    ref: "FDA GRAS",
  },
  {
    id: "tocopherol", name: "Tocopherols (Vitamin E)", keywords: ["tocopherol", "vitamin e"], eNumbers: ["e306", "e307", "e308", "e309"],
    category: "antioxidant", function: "Natural antioxidant",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    regulatory: "GRAS; a preferred natural alternative to BHA/BHT",
    note: "Natural fat antioxidant and vitamin — a positive substitute for synthetic BHA/BHT.",
    ref: "EFSA tocopherols",
  },
  {
    id: "lecithin", name: "Lecithin", keywords: ["lecithin", "soy lecithin", "sunflower lecithin"], eNumbers: ["e322"],
    category: "emulsifier", function: "Natural emulsifier",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    regulatory: "GRAS",
    note: "Naturally derived emulsifier (soy/sunflower); well tolerated. Only note is soy allergen source.",
    ref: "EFSA lecithins",
  },

  // ── Expansion batch (curated ~35; regulatory-cited) ─────────────────────────
  {
    id: "sulphites", name: "Sulphites (SO₂, metabisulphites)", keywords: ["sulphite", "sulfite", "metabisulphite", "metabisulfite", "sulphur dioxide", "sulfur dioxide"], eNumbers: ["e220", "e221", "e222", "e223", "e224", "e226", "e227", "e228"],
    category: "preservative", function: "Preservative / antioxidant",
    dominant: "HIGH", moderate: "HIGH", trace: "MEDIUM", evidence: "STRONG",
    adi: "0.7 mg/kg bw/day SO₂ (EFSA)", regulatory: "Approved; mandatory allergen declaration (EU/US)",
    populations: ["asthmatics (bronchospasm)", "sulphite-sensitive"],
    note: "Can trigger severe asthmatic reactions; a declarable allergen. EFSA flagged that the ADI is easily exceeded by high consumers.",
    ref: "EFSA 2016 sulphites re-evaluation",
  },
  {
    id: "propyl-gallate", name: "Propyl Gallate", keywords: ["trihydroxybenzoate", "propyl gallate", "propyl ester"], eNumbers: ["e310"],
    category: "antioxidant", function: "Fat antioxidant",
    dominant: "HIGH", moderate: "MEDIUM", trace: "LOW", evidence: "LIMITED",
    adi: "1.4 mg/kg bw/day (EFSA 2014)", regulatory: "Approved; endocrine-activity research",
    note: "Some studies suggest weak endocrine-disrupting activity; used with BHA/BHT in fats. Within ADI regarded as acceptable.",
    ref: "EFSA 2014 gallates re-evaluation",
  },
  {
    id: "saccharin", name: "Saccharin", keywords: ["saccharin"], eNumbers: ["e954"],
    category: "sweetener", function: "Artificial sweetener",
    dominant: "MEDIUM", moderate: "MEDIUM", trace: "LOW", evidence: "LIMITED",
    adi: "5 mg/kg bw/day (EFSA)", regulatory: "Approved; historic bladder-tumour scare (rat-specific, delisted)",
    note: "The 1970s bladder-cancer signal was shown to be a rat-specific mechanism; delisted as a carcinogen. Non-caloric, used in tabletop sweeteners.",
    ref: "NTP delisting 2000; EFSA opinion",
  },
  {
    id: "stevia", name: "Steviol Glycosides (Stevia)", keywords: ["stevia", "steviol", "rebaudioside", "stevioside", "reb m"], eNumbers: ["e960"],
    category: "sweetener", function: "Natural high-intensity sweetener",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    adi: "4 mg/kg bw/day steviol (EFSA/JECFA)", regulatory: "Approved; a preferred natural sweetener",
    note: "Plant-derived, non-caloric, no genotoxicity concern within ADI — a comparatively benign sweetener choice.",
    ref: "EFSA 2010 steviol glycosides",
  },
  {
    id: "erythritol", name: "Erythritol", keywords: ["erythritol"], eNumbers: ["e968"],
    category: "sweetener", function: "Sugar alcohol",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "LIMITED",
    regulatory: "Approved; 2023 cardiovascular-association research",
    populations: ["cardiovascular risk (emerging)"],
    note: "Well tolerated digestively, but 2023 research associated high circulating erythritol with thrombosis and cardiovascular events — an emerging, unsettled signal.",
    ref: "Witkowski et al. 2023 (Nature Medicine)",
  },
  {
    id: "xylitol", name: "Xylitol", keywords: ["wood sugar", "birch sugar", "xylitol"], eNumbers: ["e967"],
    category: "sweetener", function: "Sugar alcohol",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "LIMITED",
    regulatory: "Approved; 2023 cardiovascular-association research",
    populations: ["cardiovascular risk (emerging)", "dogs (toxic)"],
    note: "Dental benefits are established, but 2024 research linked high circulating xylitol to platelet reactivity and cardiovascular events. Note: highly toxic to dogs.",
    ref: "Witkowski et al. 2024 (European Heart Journal)",
  },
  {
    id: "sorbitol", name: "Sorbitol", keywords: ["sorbitol"], eNumbers: ["e420"],
    category: "sweetener", function: "Sugar alcohol / humectant",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    regulatory: "Approved; EU laxative warning above 10%",
    populations: ["IBS", "children (GI upset)"],
    note: "Poorly absorbed; causes bloating and a laxative effect in quantity. EU requires an 'excessive consumption may cause laxative effects' warning.",
    ref: "EFSA polyols; EU labelling rules",
  },
  {
    id: "mono-diglycerides", name: "Mono- and Diglycerides", keywords: ["glycerol monostearate", "glyceryl monostearate", "mono- and diglycerides", "monoglycerides", "diglycerides", "mono and diglycerides"], eNumbers: ["e471"],
    category: "emulsifier", function: "Emulsifier",
    dominant: "MEDIUM", moderate: "MEDIUM", trace: "LOW", evidence: "LIMITED",
    regulatory: "Approved; can contain trans fats (not label-declared)",
    note: "A hallmark ultra-processing emulsifier; commercial preparations can contain trans fats that escape the 'trans fat' label line. Emulsifier–microbiome concerns apply.",
    ref: "EFSA 2017 E471; FDA trans-fat labelling gap",
  },
  {
    id: "propylene-glycol", name: "Propylene Glycol", keywords: ["propylene glycol"], eNumbers: ["e1520"],
    category: "emulsifier", function: "Humectant / carrier",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "25 mg/kg bw/day (EFSA)", regulatory: "GRAS (US); EFSA set an ADI (2018)",
    note: "Generally low toxicity but EFSA introduced an ADI in 2018 after finding intakes could exceed safe levels in high consumers.",
    ref: "EFSA 2018 propylene glycol",
  },
  {
    id: "carmine", name: "Carmine / Cochineal (E120)", keywords: ["carmine", "cochineal", "carminic acid"], eNumbers: ["e120"],
    category: "coloring", function: "Natural red colour (insect-derived)",
    dominant: "MEDIUM", moderate: "MEDIUM", trace: "LOW", evidence: "MODERATE",
    regulatory: "Approved; documented anaphylaxis cases",
    populations: ["allergy/anaphylaxis", "vegans (insect-derived)"],
    note: "Natural but a documented cause of IgE-mediated allergic reactions including anaphylaxis; not vegetarian/vegan.",
    ref: "EFSA 2015 cochineal; case reports",
  },
  {
    id: "disodium-edta", name: "Disodium EDTA", keywords: ["edta", "disodium edta", "calcium disodium edta"], eNumbers: ["e385", "e386"],
    category: "antioxidant", function: "Sequestrant / preservative",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "LIMITED",
    adi: "2.5 mg/kg bw/day (EFSA)", regulatory: "Approved with limits",
    note: "Chelates trace metals to prevent spoilage; can impair mineral absorption at high intake. Restricted to specific foods.",
    ref: "EFSA 2018 EDTA re-evaluation",
  },
  {
    id: "sodium-phosphates", name: "Sodium/Potassium/Magnesium Phosphates", keywords: ["sodium phosphate", "potassium phosphate", "sodium dihydrogen phosphate", "magnesium phosphate", "trimagnesium phosphate", "dimagnesium phosphate", "monomagnesium phosphate", "sodium tripolyphosphate", "trisodium phosphate", "tetrasodium pyrophosphate", "pyrophosphate", "sodium hexametaphosphate", "hexametaphosphate", "polyphosphate", "ammonium phosphate", "diammonium phosphate", "monoammonium phosphate", "ammonium dihydrogen phosphate", "diammonium hydrogen phosphate"], eNumbers: ["e339", "e340", "e343", "e450", "e451", "e452", "e342"],
    category: "acidity regulator", function: "Emulsifying salt / stabiliser",
    dominant: "MEDIUM", moderate: "MEDIUM", trace: "LOW", evidence: "MODERATE",
    regulatory: "Approved; EFSA 2019 group phosphate ADI", populations: ["chronic kidney disease", "cardiovascular"],
    note: "Added phosphates are highly bioavailable; high dietary phosphate is linked to cardiovascular and kidney risk. EFSA set a group ADI in 2019.",
    ref: "EFSA 2019 phosphates re-evaluation",
  },
  {
    id: "aluminium-additives", name: "Aluminium-containing Additives", keywords: ["aluminium", "aluminum", "sodium aluminium phosphate", "aluminium sulphate", "sodium aluminium sulphate", "sodium aluminum sulfate", "aluminosilicate", "aluminium silicate", "aluminium potassium sulphate", "potassium aluminium sulphate", "aluminum potassium sulfate", "potash alum", "potassium alum", "aluminium ammonium sulphate", "aluminum ammonium sulfate", "ammonium alum", "kaolin", "starch aluminium octenyl succinate", "starch aluminum octenyl succinate", "aluminium potassium sulfate", "aluminum potassium sulphate", "aluminium ammonium sulfate", "aluminum ammonium sulphate"], eNumbers: ["e541", "e173", "e520", "e521", "e522", "e523", "e554", "e555", "e556", "e559", "e1452"],
    category: "acidity regulator", function: "Leavening / anticaking / colour",
    dominant: "HIGH", moderate: "MEDIUM", trace: "LOW", evidence: "MODERATE",
    adi: "1 mg/kg bw/week aluminium (EFSA TWI)", regulatory: "Restricted; EFSA set a tolerable weekly intake",
    populations: ["kidney impairment", "infants"],
    note: "Aluminium accumulates; EFSA set a tolerable weekly intake that many populations approach. Use restricted in the EU.",
    ref: "EFSA 2008 aluminium TWI",
  },
  {
    id: "natamycin", name: "Natamycin", keywords: ["natamycin", "pimaricin"], eNumbers: ["e235"],
    category: "preservative", function: "Antifungal surface preservative",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "0.3 mg/kg bw/day (EFSA)", regulatory: "Approved; surface use on cheese/sausage only",
    note: "A medically-related antifungal; restricted to surface treatment to limit antimicrobial-resistance concerns. Low systemic exposure.",
    ref: "EFSA 2009 natamycin",
  },
  {
    id: "guar-gum", name: "Guar Gum", keywords: ["guar gum", "guar", "partially hydrolysed guar gum", "partially hydrolyzed guar gum", "phgg", "sunfiber"], eNumbers: ["e412"],
    category: "thickener", function: "Natural thickener (fibre)",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    regulatory: "Approved; a soluble fibre",
    note: "Plant-derived soluble fibre; well tolerated, mild positive (slows glucose absorption). No ADI needed.",
    ref: "EFSA 2017 guar gum",
  },
  {
    id: "xanthan-gum", name: "Xanthan Gum", keywords: ["corn sugar gum", "xanthan gum", "xanthan"], eNumbers: ["e415"],
    category: "thickener", function: "Fermentation-derived thickener",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    regulatory: "Approved; no ADI (very low toxicity)",
    note: "Widely used, very low toxicity, no ADI assigned. Minor GI effects only at very high intake.",
    ref: "EFSA 2017 xanthan gum",
  },
  {
    id: "pectin", name: "Pectin", keywords: ["pectin"], eNumbers: ["e440"],
    category: "thickener", function: "Natural gelling fibre",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    regulatory: "Approved; a soluble fibre, no ADI",
    note: "Fruit-derived soluble fibre — benign, mildly beneficial. Traditional jam setting agent.",
    ref: "EFSA 2017 pectins",
  },
  {
    id: "locust-bean-gum", name: "Locust Bean, Tara & Cassia Gums", keywords: ["tara gum", "cassia gum", "locust bean gum", "carob bean gum", "carob gum"], eNumbers: ["e410", "e417", "e427"],
    category: "thickener", function: "Natural thickener",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    regulatory: "Approved; no ADI", note: "Carob-seed fibre; benign. (Restricted in infant formula pending review.)",
    ref: "EFSA 2017 locust bean gum",
  },
  {
    id: "calcium-propionate", name: "Calcium Propionate", keywords: ["calcium propionate", "sodium propionate", "potassium propionate", "propionic acid"], eNumbers: ["e282", "e281", "e280", "e283"],
    category: "preservative", function: "Antifungal (bread)",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "LIMITED",
    regulatory: "Approved; EFSA re-affirmed safety 2014",
    populations: ["children (behavioural reports)"],
    note: "Common bread mould inhibitor. Generally safe; limited reports of behavioural effects in sensitive children.",
    ref: "EFSA 2014 propionates",
  },
  {
    id: "sodium-erythorbate", name: "Sodium Erythorbate", keywords: ["erythorbate", "potassium erythorbate", "calcium erythorbate"], eNumbers: ["e316", "e317", "e318"],
    category: "antioxidant", function: "Antioxidant / cure accelerator",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    regulatory: "Approved", note: "Isomer of vitamin C used to speed curing and prevent oxidation; low toxicity. Note: often accompanies nitrites in cured meats.",
    ref: "EFSA erythorbates",
  },
  {
    id: "nisin", name: "Nisin", keywords: ["nisin"], eNumbers: ["e234"],
    category: "preservative", function: "Natural antimicrobial peptide",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "1 mg/kg bw/day (EFSA)", regulatory: "Approved with limits",
    note: "Bacteriocin from lactic bacteria; low toxicity, effective against spoilage organisms. Restricted to specific foods.",
    ref: "EFSA 2017 nisin",
  },
  {
    id: "glycerol", name: "Glycerol (Glycerin)", keywords: ["glycerol", "glycerin", "glycerine"], eNumbers: ["e422"],
    category: "emulsifier", function: "Humectant",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    regulatory: "Approved; no ADI (very low toxicity)",
    note: "A benign humectant/sweet-tasting sugar alcohol; only laxative in very large amounts.",
    ref: "EFSA 2017 glycerol",
  },
  {
    id: "carnauba-wax", name: "Carnauba Wax", keywords: ["carnauba"], eNumbers: ["e903"],
    category: "thickener", function: "Glazing agent",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "7 mg/kg bw/day (EFSA)", regulatory: "Approved with limits",
    note: "Plant wax used to glaze confectionery; low toxicity, surface use only.",
    ref: "EFSA 2012 carnauba wax",
  },
  {
    id: "shellac", name: "Shellac", keywords: ["shellac"], eNumbers: ["e904"],
    category: "thickener", function: "Glazing agent",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "LIMITED",
    regulatory: "Approved; surface use", populations: ["vegans (insect-derived)"],
    note: "Insect-derived glaze for coating sweets and pills; benign but not vegan.",
    ref: "EFSA shellac",
  },
  {
    id: "sodium-stearoyl-lactylate", name: "Sodium Stearoyl Lactylate", keywords: ["stearoyl lactylate", "ssl", "sodium stearoyl"], eNumbers: ["e481"],
    category: "emulsifier", function: "Dough conditioner / emulsifier",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "LIMITED",
    adi: "20 mg/kg bw/day (EFSA)", regulatory: "Approved",
    note: "Synthetic emulsifier and a marker of ultra-processed bread; low toxicity within ADI.",
    ref: "EFSA 2013 stearoyl lactylates",
  },
  {
    id: "lactic-acid", name: "Lactic Acid", keywords: ["lactic acid", "sodium lactate", "potassium lactate", "calcium lactate", "magnesium lactate"], eNumbers: ["e270", "e325", "e326", "e327", "e329"],
    category: "acidity regulator", function: "Acidulant",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    regulatory: "GRAS; no ADI", note: "Naturally occurring (fermentation); benign acidulant and preservative.",
    ref: "EFSA lactic acid",
  },
  {
    id: "malic-acid", name: "Malic Acid & Malates", keywords: ["malic acid", "sodium malate", "potassium malate", "calcium malate", "sodium hydrogen malate", "calcium hydrogen malate", "potassium hydrogen malate", "ammonium malate"], eNumbers: ["e296", "e350", "e351", "e352", "e349"],
    category: "acidity regulator", function: "Acidulant",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    regulatory: "Approved; no ADI", note: "Found naturally in apples; benign tart flavouring/acidulant.",
    ref: "EFSA malic acid",
  },
  {
    id: "sodium-citrate", name: "Sodium & Potassium Citrates", keywords: ["trimagnesium dicitrate", "sodium citrate", "trisodium citrate", "potassium citrate", "tripotassium citrate", "monopotassium citrate", "ammonium citrate", "magnesium citrate", "trimagnesium citrate"], eNumbers: ["e331", "e332", "e380", "e345"],
    category: "acidity regulator", function: "Buffer / emulsifying salt",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    regulatory: "GRAS; no ADI", note: "Benign buffer and emulsifying salt (e.g. in processed cheese).",
    ref: "EFSA citrates",
  },
  {
    id: "calcium-carbonate", name: "Calcium Carbonate", keywords: ["calcium carbonate"], eNumbers: ["e170"],
    category: "acidity regulator", function: "Anticaking / colour / fortificant",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    regulatory: "GRAS", note: "Chalk — benign, also a calcium source. No safety concern at food levels.",
    ref: "EFSA calcium carbonate",
  },
  {
    id: "beta-carotene", name: "Beta-Carotene & Apocarotenal (E160a, E160e)", keywords: ["provitamin a", "beta-carotene", "beta carotene", "carotene", "beta-apo-8'-carotenal", "beta-apo-8-carotenal", "apocarotenal", "apo-carotenal"], eNumbers: ["e160a", "e160e"],
    category: "coloring", function: "Natural orange colour / provitamin A",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    regulatory: "Approved; provitamin A", populations: ["smokers (high-dose supplement caution)"],
    note: "Natural colour and vitamin A precursor; benign as a food colour. (High-dose supplements only are cautioned for smokers.)",
    ref: "EFSA 2012 carotenes",
  },
  {
    id: "annatto", name: "Annatto (E160b)", keywords: ["annatto", "bixin", "norbixin"], eNumbers: ["e160b"],
    category: "coloring", function: "Natural yellow-orange colour",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    regulatory: "Approved", populations: ["rare intolerance"],
    note: "Seed-derived natural colour; generally benign with rare reports of intolerance.",
    ref: "EFSA 2016 annatto",
  },
  {
    id: "potassium-chloride", name: "Potassium Chloride", keywords: ["potassium chloride"], eNumbers: ["e508"],
    category: "acidity regulator", function: "Salt substitute",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    regulatory: "GRAS", populations: ["chronic kidney disease", "on potassium-sparing drugs"],
    note: "Used to cut sodium; beneficial for most, but a real hyperkalaemia risk for people with kidney disease or on certain medications.",
    ref: "WHO sodium-reduction guidance",
  },
  {
    id: "gellan-gum", name: "Gellan Gum", keywords: ["gellan gum", "gellan"], eNumbers: ["e418"],
    category: "thickener", function: "Fermentation-derived gelling agent",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    regulatory: "Approved; no numerical ADI", note: "Microbial polysaccharide; low toxicity, used in plant milks and jellies.",
    ref: "EFSA 2018 gellan gum",
  },
  {
    id: "inulin", name: "Inulin / Chicory Fibre & Prebiotic Oligosaccharides", keywords: ["inulin", "chicory root", "chicory fiber", "chicory fibre", "oligofructose", "fructooligosaccharide", "fructo-oligosaccharide", "galactooligosaccharide", "galacto-oligosaccharide"],
    category: "thickener", function: "Prebiotic fibre",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    regulatory: "GRAS; a recognised dietary fibre", populations: ["IBS/FODMAP-sensitive (bloating)"],
    note: "A prebiotic fibre with genuine benefits (gut microbiome, satiety); mild positive. Can cause bloating in FODMAP-sensitive people.",
    ref: "EFSA inulin health claims",
  },

  // ── Expansion 2026-07: Preservatives ────────────────────────────────────────
  {
    id: "dimethyl-dicarbonate", name: "Dimethyl Dicarbonate", keywords: ["dimethyl dicarbonate", "dmdc", "velcorin"], eNumbers: ["e242"],
    category: "preservative", function: "Cold-sterilisation beverage preservative",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "not specified — decomposes before consumption (EFSA 2015)",
    regulatory: "Approved EU (≤250 mg/L) & FDA; hydrolyses to methanol + CO₂ within hours",
    populations: ["none at approved levels"],
    note: "Added to beverages to kill yeasts/moulds, then breaks down almost entirely into methanol and CO₂ before the drink is consumed. Methanol contribution is far below that of many fruit juices. EFSA re-evaluation (2015) raised no safety concern at permitted use.",
    ref: "EFSA Journal 2015;13(12):4319",
  },
  {
    id: "lysozyme", name: "Lysozyme", keywords: ["lysozyme"], eNumbers: ["e1105"],
    category: "preservative", function: "Enzyme preservative (anti-Clostridium)",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "not specified (JECFA — enzyme naturally present in the body)",
    regulatory: "Approved EU & FDA; used mainly in hard cheese and wine",
    populations: ["egg-allergic (derived from hen egg white)"],
    note: "A naturally occurring enzyme (also in tears, saliva, egg white) that lyses bacterial cell walls. Low toxicological concern, but it is an egg-white protein and must be declared as an allergen.",
    ref: "EFSA 2018 re-evaluation of lysozyme; JECFA",
  },
  {
    id: "ethyl-lauroyl-arginate", name: "Ethyl Lauroyl Arginate (LAE)", keywords: ["ethyl lauroyl arginate", "lauric arginate", "lauroyl arginate"], eNumbers: ["e243"],
    category: "preservative", function: "Cationic antimicrobial surfactant",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "0.5 mg/kg bw/day (EFSA)",
    regulatory: "Approved EU (limited categories) & FDA GRAS; rapidly hydrolysed to natural metabolites",
    populations: ["none identified at ADI"],
    note: "A broad-spectrum preservative metabolised to lauric acid and L-arginine — components of a normal diet. Safe within the ADI; use is restricted to specific food categories in the EU.",
    ref: "EFSA Journal 2019;17(1):5498",
  },

  // ── Expansion 2026-07: Emulsifiers ──────────────────────────────────────────
  {
    id: "datem", name: "DATEM (E472e)", keywords: ["diacetyl tartaric acid ester", "datem", "diacetyl tartaric", "mono- and diacetyl tartaric", "e472e"], eNumbers: ["e472e"],
    category: "emulsifier", function: "Dough conditioner / crumb softener",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "0–50 mg/kg bw/day (JECFA)",
    regulatory: "Approved EU & FDA GRAS",
    populations: ["none identified at normal intake"],
    note: "Made from mono-/diglycerides and tartaric acid; strengthens dough and softens bread crumb. Digested like ordinary fats and acids. Marker of ultra-processed bread rather than a toxicological hazard.",
    ref: "EFSA 2019 re-evaluation of E472e; JECFA",
  },
  {
    id: "pgpr", name: "PGPR (E476)", keywords: ["pgpr", "polyglycerol polyricinoleate", "e476"], eNumbers: ["e476"],
    category: "emulsifier", function: "Viscosity reducer in chocolate",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "0–25 mg/kg bw/day (EFSA)",
    regulatory: "Approved EU & FDA",
    populations: ["none identified at ADI"],
    note: "Made from castor oil and glycerol; lets chocolate flow with less cocoa butter. No genotoxicity or meaningful toxicity within the ADI. Signals a cost-reduced/ultra-processed chocolate.",
    ref: "EFSA Journal 2017;15(3):4743",
  },
  {
    id: "sorbitan-esters", name: "Sorbitan Esters (E491–E495)", keywords: ["sorbitan monostearate", "sorbitan tristearate", "sorbitan monolaurate", "span 20", "span 60", "span 65", "sorbitan monooleate", "sorbitan monopalmitate", "span 80", "span 40", "e491", "e492", "sorbitan tripalmitate"], eNumbers: ["e491", "e492", "e493", "e494", "e495", "e496"],
    category: "emulsifier", function: "Emulsifier / crystallisation control",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "0–25 mg/kg bw/day as sorbitan esters (EFSA)",
    regulatory: "Approved EU & FDA",
    populations: ["none identified at ADI"],
    note: "Synthetic emulsifiers from sorbitol and fatty acids, used in cakes, toppings and confectionery. Low toxicity within the group ADI; hydrolysed to sorbitol and fatty acids.",
    ref: "EFSA Journal 2017;15(5):4788",
  },
  {
    id: "polysorbate-20", name: "Polysorbate 20 (E432)", keywords: ["polysorbate 20", "polyoxyethylene sorbitan monolaurate", "tween 20", "e432"], eNumbers: ["e432"],
    category: "emulsifier", function: "Detergent-type emulsifier",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "0–25 mg/kg bw/day as polysorbates (EFSA)",
    regulatory: "Approved EU & FDA",
    populations: ["IBD / gut-sensitive (emerging microbiome data)"],
    note: "A polysorbate detergent emulsifier. Safe within the group ADI, but polysorbates are among the emulsifiers linked in animal and early human studies to thinning of the gut mucus layer and microbiome shifts — an emerging, not settled, concern.",
    ref: "EFSA 2015 polysorbates; Chassaing et al. 2015/2022",
  },
  {
    id: "sucrose-esters", name: "Sucrose Esters of Fatty Acids (E473)", keywords: ["sucrose ester", "sucrose fatty acid ester", "sucroglyceride", "e473", "e474"], eNumbers: ["e473", "e474"],
    category: "emulsifier", function: "Emulsifier / aerating agent",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "0–30 mg/kg bw/day (EFSA)",
    regulatory: "Approved EU & FDA",
    populations: ["gut-sensitive (emerging microbiome data)"],
    note: "Emulsifiers from sucrose and fatty acids used in drinks, bakery and dairy. Digested to sugar and fats; within the ADI no classical toxicity, but included among emulsifiers under investigation for gut-microbiome and glucose-metabolism effects in recent models.",
    ref: "EFSA Journal 2021;19(11):6885; Nat. Commun. 2024",
  },
  {
    id: "acetylated-monoglycerides", name: "Acetylated Mono-/Diglycerides (E472a)", keywords: ["acetic acid esters of mono", "acetylated mono- and diglycerides", "acetylated monoglyceride", "acetic acid ester of mono", "acetoglyceride", "e472a"], eNumbers: ["e472a"],
    category: "emulsifier", function: "Emulsifier / coating film",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "not specified (JECFA)",
    regulatory: "Approved EU & FDA GRAS",
    populations: ["none identified"],
    note: "Mono-/diglycerides esterified with acetic acid; used as emulsifiers and edible coatings. Digested as ordinary dietary fat and acetic acid. Low concern; an ultra-processing marker.",
    ref: "EFSA 2017 re-evaluation of mono-diglyceride esters",
  },
  {
    id: "ammonium-phosphatides", name: "Ammonium Phosphatides (E442)", keywords: ["ammonium phosphatide", "emulsifier ynt", "e442"], eNumbers: ["e442"],
    category: "emulsifier", function: "Chocolate emulsifier",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "0–30 mg/kg bw/day (EFSA)",
    regulatory: "Approved EU & FDA; used almost only in chocolate",
    populations: ["none identified at ADI"],
    note: "A synthetic lecithin-like emulsifier used to control chocolate viscosity. Digested like phospholipids and fats; no safety concern within the ADI.",
    ref: "EFSA Journal 2018;16(7):5334",
  },
  {
    id: "calcium-stearoyl-lactylate", name: "Calcium Stearoyl-2-Lactylate (E482)", keywords: ["calcium stearoyl lactylate", "calcium stearoyl-2-lactylate", "csl", "e482"], eNumbers: ["e482"],
    category: "emulsifier", function: "Dough strengthener / whipping agent",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "0–25 mg/kg bw/day as stearoyl lactylates (EFSA)",
    regulatory: "Approved EU & FDA",
    populations: ["none identified at ADI"],
    note: "The calcium analogue of the widely used sodium stearoyl lactylate; strengthens dough and stabilises foams. Metabolised to stearic and lactic acid; low concern within the group ADI.",
    ref: "EFSA Journal 2013;11(5):3144",
  },
  {
    id: "polyglycerol-esters", name: "Polyglycerol Esters of Fatty Acids (E475)", keywords: ["polyglycerol ester", "polyglycerol fatty acid ester", "e475"], eNumbers: ["e475"],
    category: "emulsifier", function: "Cake and aeration emulsifier",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "0–25 mg/kg bw/day (EFSA)",
    regulatory: "Approved EU & FDA",
    populations: ["none identified at ADI"],
    note: "Emulsifiers from polyglycerol and fatty acids, common in cakes, icings and non-dairy creamers. Hydrolysed to glycerol and fats; no safety concern within the ADI.",
    ref: "EFSA Journal 2017;15(12):5089",
  },
  {
    id: "stearyl-tartrate", name: "Stearyl Tartrate (E483)", keywords: ["stearyl tartrate", "e483"], eNumbers: ["e483"],
    category: "emulsifier", function: "Flour treatment / emulsifier",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "LIMITED",
    adi: "0–0.5 mg/kg bw/day (JECFA)",
    regulatory: "Approved EU (limited) & permitted in some markets",
    populations: ["none identified at ADI"],
    note: "A minor emulsifier/flour-treatment ester of stearyl alcohol and tartaric acid, used mainly in bakery. Limited modern data; low expected concern within a conservative ADI.",
    ref: "JECFA; EFSA inventory E483",
  },

  // ── Expansion 2026-07: Sweeteners ───────────────────────────────────────────
  {
    id: "sucrose", name: "Sugar (Sucrose)", keywords: ["sugar", "sucrose", "cane sugar", "beet sugar", "table sugar", "caster sugar", "icing sugar", "brown sugar", "granulated sugar", "mishri", "misri", "rock candy", "bing tang"], eNumbers: [],
    category: "sweetener", function: "Free sugar / sweetener",
    dominant: "HIGH", moderate: "MEDIUM", trace: "LOW", evidence: "STRONG",
    regulatory: "Not restricted (a food)",
    populations: ["diabetes; weight/dental health"],
    note: "Common table sugar — a free sugar. Overconsumption is linked to obesity, type-2 diabetes and dental caries. Not toxic; the concern is dose and its prevalence high on ingredient lists. Note: bare 'sugar' is matched here, but 'sugar alcohol' names resolve to their own polyol profiles first.",
    ref: "WHO 2015 free-sugars guideline",
  },
  {
    id: "neotame", name: "Neotame (E961)", keywords: ["neotame"], eNumbers: ["e961"],
    category: "sweetener", function: "High-intensity artificial sweetener (~8000× sugar)",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "LIMITED",
    adi: "0–2 mg/kg bw/day (EFSA/JECFA)",
    regulatory: "Approved EU & FDA",
    populations: ["IBS / gut-sensitive (emerging in-vitro data)"],
    note: "A very potent aspartame-derived sweetener, used in tiny amounts and considered safe within the ADI. A 2024 in-vitro study reported gut-epithelial and microbiome damage; this is early laboratory evidence, not a regulatory conclusion. Unlike aspartame it carries no phenylalanine warning.",
    ref: "EFSA 2007; Shil & Chichger, Front. Nutr. 2024",
  },
  {
    id: "advantame", name: "Advantame (E969)", keywords: ["advantame"], eNumbers: ["e969"],
    category: "sweetener", function: "High-intensity artificial sweetener (~20000× sugar)",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "0–5 mg/kg bw/day (EFSA)",
    regulatory: "Approved EU & FDA",
    populations: ["none identified at ADI"],
    note: "The most potent approved sweetener; used in trace amounts. Poorly absorbed, not genotoxic or carcinogenic in the EFSA assessment. Safe within the ADI.",
    ref: "EFSA Journal 2013;11(7):3301",
  },
  {
    id: "cyclamate", name: "Cyclamate (E952)", keywords: ["cyclamate", "cyclamic acid", "sodium cyclamate"], eNumbers: ["e952"],
    category: "sweetener", function: "Artificial sweetener (~30–50× sugar)",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "0–7 mg/kg bw/day (EFSA)",
    regulatory: "Approved EU; BANNED in the US since 1969 (not re-approved)",
    populations: ["none confirmed at ADI"],
    note: "Banned by the FDA in 1969 after a bladder-tumour signal in rats; later reviews did not confirm human carcinogenicity and it remains approved in the EU within the ADI. The US ban persists. Metabolised by gut bacteria to cyclohexylamine in some people.",
    ref: "EFSA re-evaluation; FDA 1969 ban (still in force)",
  },
  {
    id: "allulose", name: "Allulose (D-psicose)", keywords: ["allulose", "psicose", "d-psicose"], eNumbers: [],
    category: "sweetener", function: "Rare sugar / bulk sweetener (~70% sweetness, ~0.4 kcal/g)",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "no numeric ADI; FDA GRAS",
    regulatory: "FDA GRAS & excluded from 'added sugars'; NOT yet approved as a novel food in the EU",
    populations: ["high intake → mild GI/laxative effect"],
    note: "A naturally occurring rare sugar largely not metabolised for energy, so it barely raises blood glucose or insulin. Generally well tolerated; large amounts can cause bloating. Awaiting EU novel-food authorisation.",
    ref: "FDA GRAS notices; FDA 2019 added-sugars guidance",
  },
  {
    id: "mannitol", name: "Mannitol (E421)", keywords: ["mannitol"], eNumbers: ["e421"],
    category: "sweetener", function: "Polyol bulk sweetener (~0.5× sugar)",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    adi: "not specified; laxative-effect labelling required",
    regulatory: "Approved EU & FDA GRAS",
    populations: ["children / IBS (laxative effect)"],
    note: "A sugar alcohol that is poorly absorbed, so it draws water into the gut and can cause bloating and diarrhoea in larger amounts (laxative warning required). Low glycaemic impact and non-cariogenic.",
    ref: "EFSA 2018 re-evaluation of polyols; FDA GRAS",
  },
  {
    id: "lactitol", name: "Lactitol (E966)", keywords: ["lactitol"], eNumbers: ["e966"],
    category: "sweetener", function: "Polyol bulk sweetener (~0.4× sugar)",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    adi: "not specified; laxative-effect labelling required",
    regulatory: "Approved EU & FDA GRAS",
    populations: ["children / IBS (laxative effect)"],
    note: "A sugar alcohol from lactose, poorly absorbed and low glycaemic. Non-cariogenic; excess causes bloating and a laxative effect. Not suitable for those avoiding dairy-derived ingredients in some sourcing.",
    ref: "EFSA 2018 re-evaluation of polyols",
  },
  {
    id: "glucose-syrup", name: "Glucose Syrup", keywords: ["glucose syrup", "corn syrup", "liquid glucose"], eNumbers: [],
    category: "sweetener", function: "Bulk sugar syrup / free sugars",
    dominant: "HIGH", moderate: "MEDIUM", trace: "LOW", evidence: "STRONG",
    regulatory: "Not restricted (a food, not an additive)",
    populations: ["diabetes; weight/dental health"],
    note: "A refined free-sugar syrup that raises blood glucose and adds empty calories; overconsumption is linked to obesity, type-2 diabetes and dental caries. The concern is dose and free-sugar status, not toxicity.",
    ref: "WHO 2015 free-sugars guideline",
  },
  {
    id: "dextrose", name: "Dextrose (Glucose)", keywords: ["dextrose", "d-glucose"], eNumbers: [],
    category: "sweetener", function: "Free sugar / bulking sweetener",
    dominant: "HIGH", moderate: "MEDIUM", trace: "LOW", evidence: "STRONG",
    regulatory: "Not restricted (a food)",
    populations: ["diabetes; weight/dental health"],
    note: "Pure glucose used to sweeten and bulk foods; the highest-glycaemic common sugar. A free sugar whose overconsumption drives the same metabolic and dental risks as other added sugars.",
    ref: "WHO 2015 free-sugars guideline",
  },
  {
    id: "invert-sugar", name: "Invert Sugar", keywords: ["invert sugar", "invert syrup", "inverted sugar"], eNumbers: [],
    category: "sweetener", function: "Sugar syrup / free sugars",
    dominant: "HIGH", moderate: "MEDIUM", trace: "LOW", evidence: "STRONG",
    regulatory: "Not restricted (a food)",
    populations: ["diabetes; weight/dental health"],
    note: "A glucose+fructose syrup from hydrolysed sucrose, used for moisture and sweetness in confectionery. Nutritionally a free sugar; the concern is added-sugar load, not toxicity.",
    ref: "WHO 2015 free-sugars guideline",
  },
  {
    id: "agave-syrup", name: "Agave Syrup (Nectar)", keywords: ["agave syrup", "agave nectar"], eNumbers: [],
    category: "sweetener", function: "Fructose-rich sweetener syrup",
    dominant: "HIGH", moderate: "MEDIUM", trace: "LOW", evidence: "MODERATE",
    regulatory: "Not restricted (a food)",
    populations: ["diabetes; fructose-sensitive; weight"],
    note: "Marketed as natural and low-GI, but agave syrup is very high in fructose (often higher than HFCS), and high fructose intake is linked to fatty-liver and metabolic effects. A free sugar despite the health-halo marketing.",
    ref: "WHO 2015 free-sugars guideline; fructose-metabolism reviews",
  },

  // ── Expansion 2026-07: Flavour enhancers ────────────────────────────────────
  {
    id: "maltol", name: "Maltol (E636)", keywords: ["maltol"], eNumbers: ["e636"],
    category: "flavor enhancer", function: "Sweet/caramel aroma enhancer",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "0–1 mg/kg bw/day (EFSA)",
    regulatory: "Approved EU & FDA GRAS",
    populations: ["none identified at ADI"],
    note: "Occurs naturally in roasted malt and baked bread; enhances sweet and caramel notes so products can use less sugar. Safe within the ADI.",
    ref: "EFSA Journal 2021 re-evaluation of maltol",
  },
  {
    id: "ethyl-maltol", name: "Ethyl Maltol (E637)", keywords: ["ethyl maltol"], eNumbers: ["e637"],
    category: "flavor enhancer", function: "Sweet/cotton-candy aroma enhancer",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "0–2 mg/kg bw/day (EFSA)",
    regulatory: "Approved EU & FDA GRAS",
    populations: ["none identified at ADI"],
    note: "A synthetic, more potent analogue of maltol with a candy-floss aroma. Not naturally occurring but well characterised and safe within the ADI.",
    ref: "EFSA re-evaluation of ethyl maltol; JECFA",
  },
  {
    id: "hydrolyzed-vegetable-protein", name: "Hydrolysed Vegetable Protein (HVP)", keywords: ["hydrolysed vegetable protein", "hydrolyzed vegetable protein", "hydrolysed soy protein", "hvp", "hydrolysed protein"], eNumbers: [],
    category: "flavor enhancer", function: "Savoury/umami flavour base (free glutamate)",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    regulatory: "Permitted; acid-HVP process can form 3-MCPD (regulated limits)",
    populations: ["MSG-avoiders (free glutamate); gout (purines)"],
    note: "Protein broken down to release free glutamate for a meaty, savoury taste — functionally an MSG source. Acid hydrolysis can generate 3-MCPD, a processing contaminant now capped by EU/FDA limits; modern production controls it.",
    ref: "EFSA 2016/2020 3-MCPD opinions",
  },
  {
    id: "vanillin", name: "Vanillin", keywords: ["vanillin"], eNumbers: [],
    category: "flavor enhancer", function: "Vanilla flavouring",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    regulatory: "FDA GRAS; EU permitted flavouring",
    populations: ["none identified"],
    note: "The principal aroma compound of vanilla, usually made synthetically or from lignin/ferulic acid. Chemically identical to the natural molecule and safe at flavouring levels.",
    ref: "JECFA flavouring evaluation; FEMA GRAS",
  },
  {
    id: "ethyl-vanillin", name: "Ethyl Vanillin", keywords: ["ethyl vanillin"], eNumbers: [],
    category: "flavor enhancer", function: "Intense vanilla flavouring",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    adi: "0–3 mg/kg bw/day (JECFA)",
    regulatory: "FDA GRAS; EU permitted flavouring",
    populations: ["none identified at ADI"],
    note: "A synthetic vanilla flavouring roughly 3× stronger than vanillin. Well characterised and safe at flavouring use levels.",
    ref: "JECFA flavouring evaluation; FEMA GRAS",
  },
  {
    id: "smoke-flavouring", name: "Smoke Flavouring", keywords: ["smoke flavour", "smoke flavor", "liquid smoke", "smoke flavouring", "smoke flavoring"], eNumbers: [],
    category: "flavor enhancer", function: "Smoke aroma without smoking",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    regulatory: "EU authorised list (2023/24 re-evaluations); PAH limits apply",
    populations: ["none confirmed at authorised use"],
    note: "Purified condensed smoke that flavours foods without traditional smoking, generally with fewer polycyclic aromatic hydrocarbons (PAHs) than smoked products. EFSA's 2023–24 re-evaluations narrowed some authorisations; approved primaries have PAH controls.",
    ref: "EFSA 2023/2024 smoke-flavouring re-evaluations",
  },

  // ── Expansion 2026-07: Antioxidants ─────────────────────────────────────────
  {
    id: "rosemary-extract", name: "Rosemary Extract (E392)", keywords: ["rosemary extract", "extract of rosemary", "rosemary antioxidant"], eNumbers: ["e392"],
    category: "antioxidant", function: "Natural antioxidant (carnosic acid)",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "0–0.3 mg/kg bw/day (as carnosic+carnosol, EFSA)",
    regulatory: "Approved EU & FDA GRAS",
    populations: ["none identified at ADI"],
    note: "A plant-derived antioxidant increasingly used to replace synthetic BHA/BHT in oils and meats. Well tolerated; a comparatively clean-label choice.",
    ref: "EFSA Journal 2008 rosemary extracts; FDA GRAS",
  },
  {
    id: "ascorbyl-palmitate", name: "Ascorbyl Palmitate (E304)", keywords: ["ascorbyl palmitate", "fat-soluble vitamin c"], eNumbers: ["e304"],
    category: "antioxidant", function: "Fat-soluble vitamin-C antioxidant",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    adi: "0–1.25 mg/kg bw/day (EFSA)",
    regulatory: "Approved EU & FDA GRAS",
    populations: ["none identified at ADI"],
    note: "A fat-soluble ester of vitamin C used to protect oils and fatty foods from rancidity. Hydrolysed to ascorbic acid and palmitic acid; low concern.",
    ref: "EFSA 2015 re-evaluation of ascorbyl esters",
  },
  {
    id: "erythorbic-acid", name: "Erythorbic Acid (E315)", keywords: ["erythorbic acid", "isoascorbic acid"], eNumbers: ["e315"],
    category: "antioxidant", function: "Antioxidant / cure accelerator",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    adi: "not specified (JECFA)",
    regulatory: "Approved EU & FDA GRAS",
    populations: ["none identified"],
    note: "A stereoisomer of vitamin C with strong antioxidant action but little vitamin activity; used in cured meats and drinks. Low toxicity.",
    ref: "EFSA 2016 re-evaluation of erythorbate; FDA GRAS",
  },
  {
    id: "gallates", name: "Gallates (Octyl/Dodecyl, E311/E312)", keywords: ["octyl gallate", "dodecyl gallate", "lauryl gallate"], eNumbers: ["e311", "e312"],
    category: "antioxidant", function: "Synthetic fat antioxidant",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "0–0.5 mg/kg bw/day as gallates (EFSA, temporary)",
    regulatory: "Approved EU (some uses) & FDA",
    populations: ["contact-allergy prone; infants"],
    note: "Longer-chain relatives of propyl gallate used to stop fats going rancid. Can cause contact allergy/dermatitis in sensitive people; conservative ADI. Synthetic antioxidants like the gallates are a step down from natural options.",
    ref: "EFSA 2015 re-evaluation of gallates",
  },
  {
    id: "green-tea-extract", name: "Green Tea Extract (Catechins/EGCG)", keywords: ["green tea extract", "catechins", "egcg", "epigallocatechin"], eNumbers: [],
    category: "antioxidant", function: "Polyphenol antioxidant",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "food levels safe; ≥800 mg EGCG/day (supplement) → liver-injury caution (EFSA 2018)",
    regulatory: "Permitted as flavour/antioxidant; supplement doses flagged",
    populations: ["high-dose supplement users (liver)"],
    note: "Antioxidant polyphenols with plausible benefits at dietary levels. EFSA (2018) found that high-dose EGCG supplements (≥800 mg/day) can raise liver enzymes — a supplement, not a food-additive, concern.",
    ref: "EFSA Journal 2018;16(4):5239 (green tea catechins)",
  },
  {
    id: "stannous-chloride", name: "Stannous Chloride (E512)", keywords: ["stannous chloride", "tin(ii) chloride", "tin dichloride"], eNumbers: ["e512"],
    category: "antioxidant", function: "Colour-retention antioxidant (tin)",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "PTWI 14 mg/kg bw/week for tin (JECFA)",
    regulatory: "Approved EU (mainly canned white asparagus) & FDA",
    populations: ["none at permitted low use"],
    note: "A tin salt used to keep pale canned vegetables from discolouring. Excess tin can irritate the gut, so use is tightly limited; at permitted levels it is safe.",
    ref: "EFSA 2018 re-evaluation of stannous chloride",
  },
  {
    id: "hexylresorcinol", name: "4-Hexylresorcinol (E586)", keywords: ["hexylresorcinol", "4-hexylresorcinol"], eNumbers: ["e586"],
    category: "antioxidant", function: "Anti-browning agent for shellfish",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "residue-limited (very low use on prawns/shrimp)",
    regulatory: "Approved EU & FDA for crustaceans",
    populations: ["shellfish consumers (trace residue)"],
    note: "Prevents blackspot (melanosis) on prawns and shrimp. Used at very low levels with residue limits; low concern at permitted use.",
    ref: "EFSA re-evaluation of 4-hexylresorcinol",
  },
  {
    id: "guaiac-resin", name: "Guaiac Resin / Gum Guaiac (E314)", keywords: ["guaiac resin", "gum guaiac", "guaiac gum"], eNumbers: ["e314"],
    category: "antioxidant", function: "Natural resin antioxidant",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "LIMITED",
    adi: "0–2.5 mg/kg bw/day (JECFA)",
    regulatory: "Approved EU (limited) & FDA",
    populations: ["none confirmed at ADI"],
    note: "A natural tree resin used to protect fats and oils from rancidity. Limited modern data but long use history; low expected concern within the ADI.",
    ref: "JECFA gum guaiac evaluation",
  },
  {
    id: "citric-acid-esters", name: "Citric Acid Esters of Monoglycerides (E472c)", keywords: ["citric acid esters of mono", "citric acid ester", "citrem", "e472c"], eNumbers: ["e472c"],
    category: "antioxidant", function: "Antioxidant synergist / emulsifier",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "not specified (JECFA)",
    regulatory: "Approved EU & FDA GRAS",
    populations: ["none identified"],
    note: "Monoglycerides esterified with citric acid; both emulsify and chelate pro-oxidant metals to slow rancidity. Digested as fats and citric acid; low concern.",
    ref: "EFSA 2018 re-evaluation of E472c",
  },
  {
    id: "ascorbyl-stearate", name: "Ascorbyl Stearate (E305)", keywords: ["ascorbyl stearate"], eNumbers: ["e305"],
    category: "antioxidant", function: "Fat-soluble vitamin-C antioxidant",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "LIMITED",
    adi: "0–1.25 mg/kg bw/day as ascorbyl esters (EFSA)",
    regulatory: "Approved EU (limited) & FDA",
    populations: ["none identified at ADI"],
    note: "The stearate ester of vitamin C, functioning like ascorbyl palmitate to protect fats. Hydrolysed to ascorbic and stearic acid; low concern.",
    ref: "EFSA 2015 re-evaluation of ascorbyl esters",
  },

  // ── Expansion 2026-07: Thickeners ───────────────────────────────────────────
  {
    id: "gum-arabic", name: "Gum Arabic / Acacia Gum (E414)", keywords: ["gum arabic", "acacia gum", "gum acacia", "octenyl succinic acid modified gum arabic", "osa-modified gum arabic", "modified gum arabic"], eNumbers: ["e414", "e423"],
    category: "thickener", function: "Natural gum / stabiliser / soluble fibre",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    adi: "not specified (JECFA — very low toxicity)",
    regulatory: "Approved EU & FDA GRAS",
    populations: ["none identified"],
    note: "A natural tree exudate used to stabilise drinks and confectionery; also a fermentable soluble fibre with mild prebiotic benefit. Very well tolerated.",
    ref: "EFSA 2017 re-evaluation of gum arabic; FDA GRAS",
  },
  {
    id: "tragacanth", name: "Gum Tragacanth (E413)", keywords: ["tragacanth", "gum tragacanth"], eNumbers: ["e413"],
    category: "thickener", function: "Natural gum thickener/stabiliser",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "not specified (JECFA)",
    regulatory: "Approved EU & FDA GRAS",
    populations: ["rare allergy reports"],
    note: "A natural plant gum used in dressings and icings. Very low toxicity; rare hypersensitivity reported. Poorly absorbed dietary fibre.",
    ref: "EFSA 2017 re-evaluation of tragacanth; FDA GRAS",
  },
  {
    id: "karaya-gum", name: "Karaya Gum (E416)", keywords: ["karaya gum", "gum karaya", "sterculia gum"], eNumbers: ["e416"],
    category: "thickener", function: "Natural gum thickener / soluble fibre",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "not specified (JECFA)",
    regulatory: "Approved EU & FDA GRAS",
    populations: ["none identified"],
    note: "A natural tree gum used as a thickener and bulk laxative; poorly absorbed. Very low toxicity at food levels.",
    ref: "EFSA 2016 re-evaluation of karaya gum",
  },
  {
    id: "alginates", name: "Alginates (E400–E405)", keywords: ["alginate", "alginic acid", "sodium alginate", "calcium alginate", "propylene glycol alginate"], eNumbers: ["e400", "e401", "e402", "e403", "e404", "e405"],
    category: "thickener", function: "Seaweed-derived gel/thickener",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    adi: "not specified for alginates; PGA (E405) 0–70 mg/kg (EFSA)",
    regulatory: "Approved EU & FDA GRAS",
    populations: ["none identified at normal intake"],
    note: "Gelling fibres extracted from brown seaweed, used in dairy, sauces and restructured foods. Poorly absorbed and well tolerated. Propylene glycol alginate has its own numeric ADI but is safe within it.",
    ref: "EFSA 2017 re-evaluation of alginates; JECFA",
  },
  {
    id: "native-starch", name: "Native Starch (tapioca/potato/rice/corn)", keywords: ["starch", "tapioca starch", "potato starch", "rice starch", "arrowroot", "wheat starch", "tapioca flour", "corn starch", "cornstarch", "maize starch", "corn flour", "tapioca pearls", "sabudana", "sabudana pearls"], eNumbers: [],
    category: "thickener", function: "Unmodified starch thickener",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    regulatory: "Foods, not additives",
    populations: ["none (refined carbohydrate)"],
    note: "Unmodified starches used to thicken sauces and bind foods. Essentially a refined carbohydrate — no additive-toxicity concern; contributes digestible starch calories.",
    ref: "Standard food-composition references",
  },
  {
    id: "psyllium-husk", name: "Psyllium Husk", keywords: ["psyllium", "psyllium husk", "ispaghula", "plantago ovata"], eNumbers: [],
    category: "thickener", function: "Soluble-fibre thickener / bulking agent",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    regulatory: "GRAS; authorised EU health claims (cholesterol, bowel function)",
    populations: ["take with adequate water (choking risk if dry)"],
    note: "A soluble fibre used to thicken and bind (especially gluten-free baking) with genuine, health-claim-backed benefits for cholesterol and bowel regularity. A clear positive; must be taken with enough fluid.",
    ref: "EFSA authorised health claims for psyllium/ispaghula",
  },

  // ── Expansion 2026-07: Stabilizers ──────────────────────────────────────────
  {
    id: "calcium-salts-firming", name: "Calcium Chloride / Sulfate / Lactate (firming)", keywords: ["calcium chloride", "calcium sulfate", "calcium sulphate"], eNumbers: ["e509", "e516"],
    category: "stabilizer", function: "Firming agent / stabiliser / calcium source",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    adi: "not specified (JECFA)",
    regulatory: "Approved EU & FDA GRAS",
    populations: ["none identified at food levels"],
    note: "Calcium salts that firm canned vegetables and tofu and stabilise texture. Provide dietary calcium; very low toxicity. Calcium chloride tastes salty/bitter in excess.",
    ref: "EFSA re-evaluations of calcium salts; FDA GRAS",
  },
  {
    id: "magnesium-chloride", name: "Magnesium Chloride (E511)", keywords: ["magnesium chloride", "nigari"], eNumbers: ["e511"],
    category: "stabilizer", function: "Firming agent / tofu coagulant",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    adi: "not specified (JECFA)",
    regulatory: "Approved EU & FDA GRAS",
    populations: ["large amounts → laxative effect"],
    note: "Used to coagulate tofu (nigari) and firm vegetables; a source of magnesium. Very low toxicity; excess has a laxative effect.",
    ref: "EFSA re-evaluation of magnesium salts; FDA GRAS",
  },
  {
    id: "polydextrose", name: "Polydextrose (E1200)", keywords: ["polydextrose"], eNumbers: ["e1200"],
    category: "stabilizer", function: "Bulking agent / soluble fibre",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    adi: "not specified; laxative threshold noted",
    regulatory: "Approved EU & FDA GRAS",
    populations: ["large amounts → bloating/laxative effect"],
    note: "A synthetic soluble fibre used to replace sugar and fat and add bulk. Low glycaemic and partially fermented; large amounts cause bloating. Low concern.",
    ref: "EFSA 2018 re-evaluation of polydextrose",
  },
  {
    id: "gum-ghatti", name: "Gum Ghatti (E419)", keywords: ["gum ghatti", "ghatti"], eNumbers: ["e419"],
    category: "stabilizer", function: "Natural gum emulsifier/stabiliser",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "LIMITED",
    adi: "not specified (JECFA)",
    regulatory: "Permitted (limited); FDA GRAS for some uses",
    populations: ["none confirmed"],
    note: "A natural tree gum used to stabilise emulsions such as flavour oils in drinks. Limited modern data but long use history; low expected concern.",
    ref: "JECFA gum ghatti evaluation",
  },
  {
    id: "processed-eucheuma-seaweed", name: "Processed Eucheuma Seaweed (E407a)", keywords: ["processed eucheuma seaweed", "eucheuma", "semi-refined carrageenan"], eNumbers: ["e407a"],
    category: "stabilizer", function: "Seaweed gel/stabiliser (carrageenan relative)",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "not specified; same debate as carrageenan",
    regulatory: "Approved EU & FDA",
    populations: ["gut-sensitive (as with carrageenan)"],
    note: "A semi-refined seaweed extract closely related to carrageenan, used to gel dairy and plant milks. Shares carrageenan's unresolved debate over possible gut inflammation from degraded fractions; food-grade material is considered acceptable by regulators.",
    ref: "EFSA 2018 re-evaluation of carrageenan/PES",
  },

  // ── Expansion 2026-07: Acidity regulators ───────────────────────────────────
  {
    id: "glucono-delta-lactone", name: "Glucono-delta-lactone (E575)", keywords: ["glucono delta lactone", "glucono-delta-lactone", "gdl", "gluconolactone", "gluconic acid", "sodium gluconate", "potassium gluconate", "calcium gluconate"], eNumbers: ["e575", "e574", "e576", "e577", "e578"],
    category: "acidity regulator", function: "Slow-release acidifier / coagulant",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    adi: "not specified (JECFA)",
    regulatory: "Approved EU & FDA GRAS",
    populations: ["none identified"],
    note: "Slowly hydrolyses to gluconic acid, giving gradual acidification — used to set silken tofu and in cured meats and baking. Metabolised normally; very low toxicity.",
    ref: "EFSA re-evaluation of gluconic acid/GDL; FDA GRAS",
  },
  {
    id: "food-alkalis", name: "Food Alkalis (hydroxides & carbonates, E500–E527)", keywords: ["sodium hydroxide", "potassium hydroxide", "calcium hydroxide", "ammonium hydroxide", "sodium carbonate", "potassium carbonate", "slaked lime", "calcium oxide", "magnesium hydroxide"], eNumbers: ["e500i", "e501", "e524", "e525", "e526", "e527", "e528", "e529"],
    category: "acidity regulator", function: "pH adjuster / alkali",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    adi: "not specified (JECFA)",
    regulatory: "Approved EU & FDA GRAS",
    populations: ["none at food levels (corrosive only when concentrated)"],
    note: "Alkaline processing agents that raise pH (e.g. in cocoa 'Dutching', noodles, masa). Corrosive in concentrated form but fully reacted/neutralised in the finished food; no consumer concern at use levels.",
    ref: "EFSA re-evaluations of carbonates/hydroxides; FDA GRAS",
  },
  {
    id: "calcium-citrate", name: "Calcium Citrate (E333)", keywords: ["calcium citrate", "ccm"], eNumbers: ["e333"],
    category: "acidity regulator", function: "Buffer / firming agent / calcium source",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    adi: "not specified (JECFA)",
    regulatory: "Approved EU & FDA GRAS",
    populations: ["none identified"],
    note: "A citrate salt that buffers pH, firms texture and supplies well-absorbed calcium. Very low toxicity.",
    ref: "EFSA re-evaluation of citrates; FDA GRAS",
  },
  {
    id: "adipic-acid", name: "Adipic Acid & Adipates (E355–E357)", keywords: ["adipic acid", "sodium adipate", "potassium adipate", "adipate"], eNumbers: ["e355", "e356", "e357"],
    category: "acidity regulator", function: "Tart acidulant / buffer",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "0–5 mg/kg bw/day (JECFA)",
    regulatory: "Approved EU & FDA GRAS",
    populations: ["none identified at ADI"],
    note: "Provides a smooth tartness in powdered drinks, gelatin desserts and baking powders; non-hygroscopic, so it keeps powders dry. Safe within the ADI.",
    ref: "JECFA evaluation of adipic acid; FDA GRAS",
  },
  {
    id: "succinic-acid", name: "Succinic Acid (E363)", keywords: ["succinic acid"], eNumbers: ["e363"],
    category: "acidity regulator", function: "Acidulant / flavour (umami-sour)",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "acceptable (JECFA); a normal metabolic intermediate",
    regulatory: "Approved EU & FDA GRAS",
    populations: ["none identified"],
    note: "A tart acidulant that is also a normal intermediate of energy metabolism (the citric-acid cycle). Very low toxicity at food levels.",
    ref: "EFSA 2021 re-evaluation of succinic acid",
  },

  // ── Expansion 2026-07: Colours ──────────────────────────────────────────────
  {
    id: "chlorophylls", name: "Chlorophylls & Copper Chlorophyllins (E140/E141)", keywords: ["chlorophyll", "chlorophyllin", "copper chlorophyll"], eNumbers: ["e140", "e141"],
    category: "coloring", function: "Natural/nature-identical green colour",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "not specified; copper complexes 0–15 mg/kg (EFSA)",
    regulatory: "Approved EU & FDA",
    populations: ["none identified at ADI"],
    note: "Green pigments from plants; the copper-stabilised chlorophyllins are more stable. Low toxicity; the copper form has an ADI to bound copper intake. A relatively clean-label colour.",
    ref: "EFSA 2015 re-evaluation of chlorophylls/chlorophyllins",
  },
  {
    id: "iron-oxides", name: "Iron Oxides & Hydroxides (E172)", keywords: ["iron oxide", "iron hydroxide", "ferric oxide"], eNumbers: ["e172"],
    category: "coloring", function: "Mineral colour (red/yellow/black)",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "0–0.5 mg/kg bw/day as iron (EFSA)",
    regulatory: "Approved EU & FDA",
    populations: ["none identified at ADI"],
    note: "Mineral pigments giving earthy reds, yellows and blacks in coatings and decorations. Poorly absorbed; safe within an iron-based ADI.",
    ref: "EFSA 2015 re-evaluation of iron oxides",
  },
  {
    id: "canthaxanthin", name: "Canthaxanthin (E161g)", keywords: ["canthaxanthin"], eNumbers: ["e161g"],
    category: "coloring", function: "Orange-red carotenoid colour",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "0–0.03 mg/kg bw/day (EFSA)",
    regulatory: "Approved EU (very limited) & FDA",
    populations: ["high intake → retinal pigment deposits"],
    note: "An orange-red carotenoid. High supplemental doses can deposit crystals in the retina, so the food ADI is deliberately low and uses are restricted. Safe within the strict ADI.",
    ref: "EFSA 2010 re-evaluation of canthaxanthin",
  },
  {
    id: "lutein", name: "Lutein (E161b)", keywords: ["lutein", "xanthophyll"], eNumbers: ["e161b"],
    category: "coloring", function: "Yellow carotenoid colour",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "0–1 mg/kg bw/day (EFSA)",
    regulatory: "Approved EU & FDA",
    populations: ["none identified at ADI"],
    note: "A yellow carotenoid from marigolds and greens that is also a normal dietary nutrient concentrated in the eye's macula. Low concern; a comparatively clean-label colour.",
    ref: "EFSA 2010 re-evaluation of lutein",
  },
  {
    id: "spirulina-extract", name: "Spirulina Extract (Phycocyanin)", keywords: ["spirulina extract", "phycocyanin", "spirulina concentrate"], eNumbers: [],
    category: "coloring", function: "Natural blue colour",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    regulatory: "FDA approved colour; EU permitted as a colouring food/extract",
    populations: ["none identified"],
    note: "A natural blue from blue-green algae, increasingly used to replace synthetic blue dyes in confectionery and drinks. Low toxicity; a clean-label choice.",
    ref: "FDA colour additive approval (spirulina extract)",
  },
  {
    id: "patent-blue-v", name: "Patent Blue V (E131)", keywords: ["patent blue", "patent blue v"], eNumbers: ["e131"],
    category: "coloring", function: "Synthetic blue dye (triarylmethane)",
    dominant: "MEDIUM", moderate: "MEDIUM", trace: "LOW", evidence: "MODERATE",
    adi: "0–5 mg/kg bw/day (EFSA)",
    regulatory: "Approved EU; NOT permitted in the US",
    populations: ["allergy/intolerance-prone"],
    note: "A synthetic blue dye that can trigger allergic reactions (including rare anaphylaxis) in sensitive people. Approved in the EU within the ADI but not permitted as a food colour in the US.",
    ref: "EFSA 2013 re-evaluation of Patent Blue V",
  },
  {
    id: "brilliant-black-bn", name: "Brilliant Black BN (E151)", keywords: ["brilliant black", "black pn", "brilliant black bn"], eNumbers: ["e151"],
    category: "coloring", function: "Synthetic black azo dye",
    dominant: "MEDIUM", moderate: "MEDIUM", trace: "LOW", evidence: "MODERATE",
    adi: "0–5 mg/kg bw/day (EFSA)",
    regulatory: "Approved EU; NOT permitted in the US",
    populations: ["intolerance-prone"],
    note: "A synthetic azo dye giving a black shade. Poorly absorbed; approved in the EU within the ADI but not permitted in the US. A synthetic colour with no nutritional value.",
    ref: "EFSA 2010 re-evaluation of Brilliant Black BN",
  },
  {
    id: "litholrubine-bk", name: "Litholrubine BK (E180)", keywords: ["litholrubine", "lithol rubine"], eNumbers: ["e180"],
    category: "coloring", function: "Synthetic azo dye (cheese rind)",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "LIMITED",
    adi: "0–1.5 mg/kg bw/day (EFSA)",
    regulatory: "Approved EU — edible cheese rind only; NOT in the US",
    populations: ["intolerance-prone"],
    note: "A synthetic azo dye restricted to colouring the edible rind of some cheeses. Limited data; a conservative ADI applies. Little consumer exposure.",
    ref: "EFSA 2010 re-evaluation of Litholrubine BK",
  },

  // ── Expansion 2026-07: Raising agents ───────────────────────────────────────
  {
    id: "leavening-bicarbonates", name: "Bicarbonates & Carbonates (leavening)", keywords: ["sodium bicarbonate", "bicarbonate of soda", "baking soda", "potassium bicarbonate", "ammonium bicarbonate", "ammonium carbonate", "sodium sesquicarbonate", "magnesium carbonate"], eNumbers: ["e500", "e501ii", "e503", "e504"],
    category: "raising agent", function: "CO₂-releasing leavening / buffer",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    adi: "not specified (JECFA)",
    regulatory: "Approved EU & FDA GRAS",
    populations: ["sodium-restricted (for the sodium salts)"],
    note: "Bicarbonate/carbonate leaveners release CO₂ to raise dough. Very low toxicity; the main practical note is sodium content for the sodium salts. Ammonium carbonates ('baker's ammonia') bake off entirely in thin biscuits.",
    ref: "EFSA re-evaluations of carbonates; FDA GRAS",
  },
  {
    id: "calcium-phosphates", name: "Calcium Phosphates (E341)", keywords: ["monocalcium phosphate", "dicalcium phosphate", "tricalcium phosphate", "calcium phosphate", "edible bone phosphate", "bone phosphate"], eNumbers: ["e341", "e542"],
    category: "raising agent", function: "Leavening acid / calcium source / anti-caking",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "group phosphate ADI 40 mg/kg as P (EFSA)",
    regulatory: "Approved EU & FDA GRAS",
    populations: ["reduced kidney function (phosphate load)"],
    note: "Calcium salts of phosphoric acid used as baking acids, calcium fortificants and free-flow agents. Low intrinsic toxicity, but they add to total dietary phosphate, which is the reason for EFSA's group phosphate ADI.",
    ref: "EFSA 2019 phosphate group ADI",
  },
  {
    id: "bakers-yeast", name: "Baker's Yeast", keywords: ["baker's yeast", "bakers yeast", "saccharomyces cerevisiae", "yeast (leavening)"], eNumbers: [],
    category: "raising agent", function: "Biological leavening",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    regulatory: "Food, not an additive",
    populations: ["none (yeast-allergy is rare)"],
    note: "A living organism that ferments dough to raise it, contributing B vitamins and flavour. A traditional, minimally processed leavening — a positive relative to chemical raising agents.",
    ref: "Standard food-science references",
  },

  // ── Expansion 2026-07: Humectants ───────────────────────────────────────────
  {
    id: "triacetin", name: "Triacetin & Diacetin (E1518/E1517)", keywords: ["diacetin", "glyceryl diacetate", "triacetin", "glyceryl triacetate", "glycerol triacetate", "monoacetin", "glyceryl monoacetate", "glycerol monoacetate"], eNumbers: ["e1518", "e1517", "e1516"],
    category: "humectant", function: "Humectant / carrier solvent",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "0–14 mg/kg bw/day (EFSA)",
    regulatory: "Approved EU & FDA GRAS",
    populations: ["none identified at ADI"],
    note: "A glycerol ester used to retain moisture and carry flavours; digested to glycerol and acetic acid. Safe within the ADI.",
    ref: "EFSA 2017 re-evaluation of triacetin",
  },
  {
    id: "triethyl-citrate", name: "Triethyl Citrate (E1505)", keywords: ["triethyl citrate"], eNumbers: ["e1505"],
    category: "humectant", function: "Humectant / carrier / foam stabiliser",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "0–1 mg/kg bw/day (EFSA)",
    regulatory: "Approved EU & FDA GRAS",
    populations: ["none identified at ADI"],
    note: "A citric-acid ester used to hold moisture, stabilise egg-white foam and carry flavours. Digested to citric acid and ethanol; safe within the ADI.",
    ref: "EFSA re-evaluation of triethyl citrate",
  },
  {
    id: "trehalose", name: "Trehalose", keywords: ["trehalose"], eNumbers: [],
    category: "humectant", function: "Humectant / mild sweetener / cryoprotectant",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    regulatory: "FDA GRAS; EU authorised novel food",
    populations: ["rare trehalase deficiency (GI symptoms)"],
    note: "A naturally occurring sugar that retains moisture and protects texture on freezing. Digested to glucose (a free sugar), so it counts toward sugar intake; people with rare trehalase deficiency get GI symptoms.",
    ref: "EFSA novel-food opinion on trehalose",
  },
  {
    id: "polyol-syrups", name: "Polyols (maltitol/isomalt/sorbitol/polyglycitol syrups)", keywords: ["sorbitol syrup", "maltitol syrup", "maltitol", "isomalt", "polyglycitol syrup", "hydrogenated glucose syrup", "hydrogenated starch hydrolysate", "sugar alcohol", "polyols"], eNumbers: ["e953", "e964", "e965", "e420ii"],
    category: "humectant", function: "Humectant / bulk sweetener syrup",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    adi: "not specified; laxative-effect labelling required",
    regulatory: "Approved EU & FDA GRAS",
    populations: ["children / IBS (laxative effect)"],
    note: "Sugar-alcohol syrups that retain moisture and sweeten with a lower glycaemic impact than sugar. Non-cariogenic, but larger amounts cause bloating and a laxative effect (labelling required).",
    ref: "EFSA 2018 re-evaluation of polyols",
  },
  {
    id: "betaine", name: "Betaine", keywords: ["betaine", "trimethylglycine"], eNumbers: [],
    category: "humectant", function: "Humectant / nutrient",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    regulatory: "EU authorised (limited); a natural dietary component",
    populations: ["high supplemental doses (raised cholesterol)"],
    note: "A compound found in beetroot and grains that retains moisture and has an authorised health claim for homocysteine metabolism at defined intakes. Very high supplemental doses can raise blood lipids; food levels are fine.",
    ref: "EFSA authorised health claim for betaine",
  },
  {
    id: "unrefined-sugar-syrups", name: "Unrefined Sugars & Syrups (molasses, jaggery, maple/golden/date syrup)", keywords: ["maple sugar", "unrefined cane sugar", "chancaca", "sucanat", "karupatti", "coconut sap syrup", "coconut blossom nectar", "birch syrup", "molasses", "treacle", "golden syrup", "date syrup", "cane syrup", "jaggery", "coconut sugar", "palm sugar", "maple syrup", "panela", "rapadura", "khandsari", "sorghum syrup", "evaporated cane juice", "cane juice", "muscovado", "demerara", "turbinado", "piloncillo", "carob syrup", "coconut nectar", "coconut syrup", "coconut sap sugar", "pekmez", "gur", "kithul", "gula jawa", "gula melaka", "nam tan pip", "desi khand", "dibs rumman", "nar ek\u015fisi", "harrub syrup", "grape syrup", "pomegranate syrup"], eNumbers: [],
    category: "humectant", function: "Humectant / sweetener (free sugars)",
    dominant: "HIGH", moderate: "MEDIUM", trace: "LOW", evidence: "STRONG",
    regulatory: "Foods, not additives",
    populations: ["diabetes; weight/dental health"],
    note: "Traditional syrups that keep foods moist and add sweetness. They carry some minerals (molasses especially) but are still free sugars — the main concern is added-sugar load, not toxicity.",
    ref: "WHO 2015 free-sugars guideline",
  },

  // ── Expansion 2026-07: Anti-caking agents ───────────────────────────────────
  {
    id: "silicates-anticaking", name: "Silicates (silicon dioxide/calcium silicate/talc/bentonite)", keywords: ["silicon dioxide", "silica", "calcium silicate", "sodium silicate", "talc", "bentonite", "magnesium silicate", "magnesium trisilicate", "diatomaceous earth", "kieselguhr", "diatomite", "zinc silicate", "potassium silicate"], eNumbers: ["e551", "e552", "e553", "e558", "e550", "e557", "e560"],
    category: "anti-caking agent", function: "Free-flow / anti-caking",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "not specified; nano-fraction of E551 under review",
    regulatory: "Approved EU & FDA GRAS (silicon dioxide nano-form re-examined)",
    populations: ["none confirmed at food levels"],
    note: "Mineral powders that keep salt, spices and powders free-flowing. Poorly absorbed and low-concern; EFSA has flagged data gaps on the nanoparticle fraction of silicon dioxide (E551), prompting ongoing review rather than a ban.",
    ref: "EFSA 2018 re-evaluation of silicon dioxide (E551)",
  },
  {
    id: "cellulose-bulking", name: "Cellulose (microcrystalline/powdered, E460)", keywords: ["microcrystalline cellulose", "powdered cellulose", "cellulose powder", "cellulose gel"], eNumbers: ["e460"],
    category: "anti-caking agent", function: "Anti-caking / bulking fibre",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    adi: "not specified (JECFA)",
    regulatory: "Approved EU & FDA GRAS",
    populations: ["none identified"],
    note: "Purified plant cellulose used to prevent caking (e.g. shredded cheese) and add insoluble fibre. Not absorbed; very low concern. Chiefly an ultra-processing marker.",
    ref: "EFSA 2018 re-evaluation of celluloses",
  },
  {
    id: "ferrocyanides", name: "Ferrocyanides (E535/E536/E538)", keywords: ["sodium ferrocyanide", "potassium ferrocyanide", "calcium ferrocyanide", "ferrocyanide"], eNumbers: ["e535", "e536", "e538"],
    category: "anti-caking agent", function: "Anti-caking agent for salt",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "0–0.03 mg/kg bw/day (EFSA, as ferrocyanide)",
    regulatory: "Approved EU & FDA",
    populations: ["none at permitted low use"],
    note: "Keep table salt free-flowing. The cyanide is tightly bound in a stable iron complex and not released in the body; use is limited and safe within the low ADI.",
    ref: "EFSA 2018 re-evaluation of ferrocyanides",
  },
  {
    id: "stearic-acid-salts", name: "Stearic Acid & Stearate Salts (E470/E570)", keywords: ["stearic acid", "magnesium stearate", "calcium stearate", "sodium stearate", "fatty acid salts", "potassium stearate", "salts of fatty acids"], eNumbers: ["e470", "e570"],
    category: "anti-caking agent", function: "Anti-caking / release agent",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    adi: "not specified (JECFA)",
    regulatory: "Approved EU & FDA GRAS",
    populations: ["none identified"],
    note: "Fatty acids and their salts used to stop powders caking and to release from moulds. Digested as ordinary dietary fat; very low concern.",
    ref: "EFSA re-evaluation of fatty acids/salts; FDA GRAS",
  },
  {
    id: "mineral-anticaking", name: "Mineral Anti-caking Agents (magnesium oxide, ammonium ferric citrate)", keywords: ["magnesium oxide", "ammonium ferric citrate", "iron ammonium citrate", "ferric ammonium citrate"], eNumbers: ["e530", "e381"],
    category: "anti-caking agent", function: "Anti-caking / free-flow",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "not specified (JECFA)",
    regulatory: "Approved EU & FDA GRAS",
    populations: ["none at food levels"],
    note: "Minerals that keep salt and powders free-flowing, contributing trace magnesium or iron. Poorly absorbed at these low levels; low concern.",
    ref: "EFSA re-evaluations of magnesium oxide / ferric citrates",
  },

  // ── Expansion 2026-07: Flour treatment agents ───────────────────────────────
  {
    id: "azodicarbonamide", name: "Azodicarbonamide (E927a / ADA)", keywords: ["azodicarbonamide", "ada flour"], eNumbers: ["e927a"],
    category: "flour treatment", function: "Dough oxidiser / bleaching",
    dominant: "HIGH", moderate: "MEDIUM", trace: "LOW", evidence: "MODERATE",
    adi: "no ADI; use questioned",
    regulatory: "BANNED EU & Australia; permitted US (≤45 ppm)",
    populations: ["everyone (precautionary)"],
    note: "A dough conditioner that breaks down to semicarbazide and, on baking, trace urethane (ethyl carbamate) — a probable carcinogen. Banned in the EU and Australia; still allowed in the US. Best avoided.",
    ref: "WHO/IPCS ADA assessment; EU ban; FDA 21 CFR 172.806",
  },
  {
    id: "flour-bleaching-oxidisers", name: "Flour Bleaching/Oxidising Agents (E926/E928/E930)", keywords: ["benzoyl peroxide", "chlorine dioxide", "calcium peroxide", "flour bleach", "potassium persulphate", "potassium persulfate", "ammonium persulphate", "ammonium persulfate", "chlorinated flour"], eNumbers: ["e926", "e928", "e930", "e922", "e923", "e925"],
    category: "flour treatment", function: "Bleaching / maturing agent",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "varies; largely spent during processing",
    regulatory: "BANNED EU; permitted US",
    populations: ["precautionary"],
    note: "Oxidisers that whiten and age flour quickly. They react and largely break down during processing, but the EU prohibits them (preferring naturally aged flour) while the US permits them. A processing shortcut, not a nutrient.",
    ref: "EU flour-additive rules; FDA GRAS listings",
  },
  {
    id: "l-cysteine", name: "L-Cysteine (E920)", keywords: ["l-cysteine", "cysteine", "cysteine hydrochloride"], eNumbers: ["e920"],
    category: "flour treatment", function: "Dough reducing agent",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "not specified (an amino acid)",
    regulatory: "Approved EU & FDA GRAS",
    populations: ["source-sensitive (may be from hair/feathers)"],
    note: "An amino acid used to relax dough for even rising (pizza, pretzels). Safe as a nutrient; the main note is sourcing — some L-cysteine is extracted from human hair or poultry feathers, a concern for vegetarian/religious diets. Synthetic and fermentation sources exist.",
    ref: "EFSA re-evaluation of L-cysteine; FDA GRAS",
  },
  {
    id: "ammonium-chloride-flour", name: "Ammonium Chloride (E510)", keywords: ["ammonium chloride", "sal ammoniac"], eNumbers: ["e510"],
    category: "flour treatment", function: "Yeast nutrient / dough conditioner",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "not specified (JECFA)",
    regulatory: "Approved EU & FDA GRAS",
    populations: ["none at food levels (also a strong-salty flavour in salty liquorice)"],
    note: "Feeds yeast and conditions dough; also gives salty liquorice its bite. Low toxicity at food levels.",
    ref: "EFSA re-evaluation of ammonium chloride; FDA GRAS",
  },
  {
    id: "dough-enzymes", name: "Food Enzymes (amylase, protease, rennet, lactase, invertase)", keywords: ["alpha-amylase", "amylase", "protease", "glucose oxidase", "xylanase", "fungal enzyme", "transglutaminase", "papain", "bromelain", "invertase", "lactase", "lipase", "pectinase", "rennet", "chymosin", "beta-galactosidase", "cellulase", "glucoamylase", "amyloglucosidase", "pullulanase", "phospholipase", "asparaginase", "catalase", "glucose isomerase", "xylose isomerase", "tannase", "naringinase", "phytase", "beta-glucanase", "lipoxygenase", "beta-amylase", "acetolactate decarboxylase", "lactoperoxidase", "pectin lyase", "polygalacturonase", "pectinesterase", "food enzymes", "aldc", "anti-staling enzyme", "bromelin", "cellulolytic enzyme", "debranching enzyme", "enzyme-active soy flour", "glucan 1,4-alpha-glucosidase", "glucanase", "lipolytic enzyme", "meat glue", "pectolytic enzymes", "pineapple enzyme", "protein-glutamine gamma-glutamyltransferase", "tannin acylhydrolase", "\u03b2-galactosidase", "\u03b2-glucanase"], eNumbers: ["e1100", "e1101", "e1102", "e1103", "e1104"],
    category: "flour treatment", function: "Enzymatic dough improver (processing aid)",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "not specified (processing aids, largely inactivated on baking)",
    regulatory: "Approved EU & FDA GRAS",
    populations: ["bakery workers (occupational allergen); rare food allergy", "vegetarians (animal rennet is from calf stomach; microbial rennet is not)"],
    note: "Enzymes that improve dough handling, volume and shelf life, clot milk for cheese (rennet/chymosin), or break down lactose. Most are denatured by baking or stay in tiny amounts. Very low consumer concern; enzyme dust is a recognised occupational allergen for bakers.",
    ref: "EFSA/FDA enzyme evaluations",
  },
  {
    id: "malted-barley-flour", name: "Malted Barley Flour", keywords: ["malted barley flour", "malt flour", "barley malt flour"], eNumbers: [],
    category: "flour treatment", function: "Natural enzymatic flour improver",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    regulatory: "Food, not an additive",
    populations: ["coeliac / gluten-avoiders (contains gluten)"],
    note: "A traditional, minimally processed flour treatment: malted barley supplies natural amylase enzymes to feed yeast and improve crust. Contains gluten. A clean-label improver — a positive relative to synthetic oxidisers.",
    ref: "Standard baking-science references",
  },

  // ── Expansion 2026-07: Vitamins & minerals (fortificants) ───────────────────
  {
    id: "added-vitamins", name: "Added Vitamins & Nutrients (fortification)", keywords: ["inositol", "l-carnitine", "carnitine", "choline chloride", "choline bitartrate", "pteroylmonoglutamic acid", "cyanocobalamin", "vitamin b12", "vitamin a palmitate", "retinyl palmitate", "tocopheryl acetate", "vitamin e acetate", "thiamine", "thiamin mononitrate", "pyridoxine", "vitamin b6", "calcium pantothenate", "pantothenic acid", "biotin", "vitamin k", "menadione", "cholecalciferol", "vitamin d", "ergocalciferol", "vitamin a", "folic acid", "folate", "niacin", "nicotinamide", "riboflavin", "vitamin b2", "vitamin b1", "vitamin b3", "retinol", "retinyl acetate", "vitamin a acetate", "tocopheryl succinate", "tocopheryl acid succinate", "tocotrienol", "phylloquinone", "phytonadione", "vitamin k1", "menaquinone", "vitamin k2", "mk-7", "thiamine hydrochloride", "thiamin hydrochloride", "niacinamide", "nicotinamide riboside", "nicotinic acid", "panthenol", "dexpanthenol", "sodium pantothenate", "pyridoxal 5'-phosphate", "pyridoxal-5-phosphate", "pyridoxal phosphate", "methylfolate", "l-methylfolate", "5-methyltetrahydrofolate", "5-mthf", "methylcobalamin", "hydroxocobalamin", "adenosylcobalamin", "cobamamide", "sodium d-pantothenate", "acetyl-l-carnitine", "alcar", "dibencozide", "hydroxycobalamin", "mecobalamin", "metafolin", "methyl b12", "niagen", "nr", "p5p", "plp", "provitamin b5", "vitamin b5"], eNumbers: ["e101", "e101a", "e375"],
    category: "vitamin & mineral", function: "Nutrient fortification",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    regulatory: "Approved fortificants (EU & FDA)",
    populations: ["fat-soluble vitamins (A, E, K) have upper limits at very high supplement doses"],
    note: "Added vitamins that restore or fortify nutrient content — generally a positive. Water-soluble vitamins (B group) are very safe as excess is excreted; fat-soluble vitamins (A especially) have upper intake limits but food-fortification levels are safe.",
    ref: "EFSA/IOM dietary reference values & upper limits",
  },
  {
    id: "added-minerals", name: "Added Minerals (fortification)", keywords: ["magnesium glycerylphosphate", "zinc pyridine-2-carboxylate", "zinc(ii) carbonate", "manganese(ii) gluconate", "ferrous fumarate", "ferrous sulphate", "ferrous sulfate", "zinc oxide", "zinc sulphate", "potassium iodide", "potassium iodate", "sodium selenite", "manganese sulphate", "copper sulphate", "iron (", "iron fortificant", "elemental iron", "reduced iron", "electrolytic iron", "ferric pyrophosphate", "ferric orthophosphate", "ferrous bisglycinate", "ferrous gluconate", "ferrous lactate", "zinc acetate", "calcium iodate", "calcium glycerophosphate", "calcium bisglycinate", "calcium l-threonate", "magnesium gluconate", "magnesium glycerophosphate", "magnesium bisglycinate", "magnesium glycinate", "magnesium aspartate", "ferric sodium edta", "sodium iron edta", "sodium feredetate", "ferrous carbonate", "ferrous citrate", "ferric citrate", "ferric saccharate", "ferrous succinate", "zinc sulfate", "zinc gluconate", "zinc citrate", "zinc bisglycinate", "zinc picolinate", "zinc carbonate", "zinc chloride", "copper sulfate", "copper gluconate", "cupric gluconate", "cupric citrate", "copper citrate", "copper bisglycinate", "cupric oxide", "sodium iodide", "sodium iodate", "sodium selenate", "sodium hydrogen selenite", "selenomethionine", "l-selenomethionine", "selenium yeast", "selenium-enriched yeast", "chromium picolinate", "chromium chloride", "chromium(iii) chloride", "chromium nicotinate", "sodium molybdate", "ammonium molybdate", "manganese sulfate", "manganese gluconate", "manganese citrate", "manganese carbonate", "sodium fluoride", "potassium fluoride", "calcium fluoride", "nafeedta", "calcium amino acid chelate", "calcium glycerylphosphate", "calcium glycinate", "calcium threonate", "chromic chloride", "chromium trichloride", "chromium(iii) picolinate", "copper glycinate", "cupric sulphate", "ferric phosphate", "ferrochel", "iron bisglycinate", "iron glycinate", "iron(ii) carbonate", "iron(ii) citrate", "iron(ii) succinate", "iron(iii) citrate", "iron(iii) phosphate", "kf", "kio3", "magnesium amino acid chelate", "naf", "nai", "selenised yeast", "trizinc dicitrate", "zinc glycinate", "cupric sulfate", "iron (fortification)"], eNumbers: ["e579", "e585", "e650", "e505", "e519", "e580", "e383"],
    category: "vitamin & mineral", function: "Nutrient fortification",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    regulatory: "Approved fortificants (EU & FDA)",
    populations: ["iron overload (haemochromatosis); mineral upper limits"],
    note: "Mineral fortificants correcting common deficiencies (iron, zinc, iodine, selenium). Beneficial at fortification levels; iron and zinc have upper intake limits, and iron fortificants matter for people with iron-overload conditions.",
    ref: "EFSA/IOM dietary reference values & upper limits",
  },
  // ── Expansion 2026-09: colours ──────────────────────────────────────────────
  {
    id: "plant-colours", name: "Plant-derived Colours (curcumin, paprika, lycopene, beetroot, anthocyanins)",
    keywords: ["curcumin", "turmeric extract", "turmeric oleoresin", "paprika extract", "paprika oleoresin", "capsanthin", "capsorubin", "lycopene", "beetroot red", "beet red", "betanin", "anthocyanin", "grape skin extract", "black carrot extract", "purple carrot extract", "beet juice concentrate", "beetroot juice concentrate", "crocin"],
    eNumbers: ["e100", "e160c", "e160d", "e162", "e163", "e164"],
    category: "coloring", function: "Natural colour",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    adi: "Curcumin 3, paprika extract 24, lycopene 0.5 mg/kg bw/day; beetroot red & anthocyanins not specified (EFSA)",
    regulatory: "EU-approved (E100/E160c/E160d/E162/E163); FDA-exempt colours from natural sources",
    note: "Colours extracted from turmeric, paprika, tomato, beetroot and berries/grapes. EFSA re-evaluations (2010–2015) found no safety concern at use levels; several are also normal dietary constituents.",
    ref: "EFSA re-evaluations of E100 (2010), E160c (2015), E160d (2008), E162 (2015), E163 (2013)",
  },
  {
    id: "other-synthetic-dyes", name: "Other Synthetic Dyes (Amaranth, Green S, Brown HT)",
    keywords: ["amaranth dye", "fd&c red no. 2", "fd&c red 2", "green s colour", "green s color", "food green s", "lissamine green", "brown ht", "chocolate brown ht"],
    eNumbers: ["e123", "e142", "e155"],
    category: "coloring", function: "Synthetic colour",
    dominant: "HIGH", moderate: "MEDIUM", trace: "LOW", evidence: "LIMITED",
    adi: "Amaranth 0.15, Green S 5, Brown HT 1.5 mg/kg bw/day (EFSA 2010)",
    regulatory: "EU-approved (Amaranth only in aperitif wines & fish roe); none permitted as food colours in the US (Amaranth delisted 1976)",
    populations: ["children"],
    note: "Synthetic azo/triarylmethane dyes with purely cosmetic function. Amaranth was banned in the US in 1976 over tumour signals and has a very low EU ADI; EFSA flagged that children can exceed the Brown HT ADI.",
    ref: "EFSA ANS 2010 re-evaluations of E123, E142, E155",
  },
  {
    id: "red-2g", name: "Red 2G (E128)", keywords: ["red 2g"], eNumbers: ["e128"],
    category: "coloring", function: "Synthetic red dye (sausages)",
    dominant: "CRITICAL", moderate: "HIGH", trace: "HIGH", evidence: "MODERATE",
    regulatory: "Withdrawn in EU (2007); not permitted in US",
    populations: ["everyone"],
    note: "Metabolised to aniline, a carcinogen in rodents; EFSA could not exclude genotoxic carcinogenicity and its EU authorisation was suspended in 2007.",
    ref: "EFSA AFC opinion 2007 on Red 2G; Commission Reg. (EC) 884/2007",
  },
  {
    id: "vegetable-carbon", name: "Vegetable Carbon (E153)", keywords: ["vegetable carbon", "carbon black", "vegetable black", "activated carbon", "activated charcoal"], eNumbers: ["e153"],
    category: "coloring", function: "Black colour",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "LIMITED",
    regulatory: "EU-approved with PAH purity limits; not permitted as a colour in the US",
    note: "Finely divided charcoal from burnt plant material. EFSA found no concern at reported uses provided polycyclic aromatic hydrocarbon impurities stay within specification.",
    ref: "EFSA ANS 2012 re-evaluation of vegetable carbon (E153)",
  },
  {
    id: "plain-caramel", name: "Plain & Caustic Sulphite Caramel (E150a/E150b)", keywords: ["plain caramel", "caustic caramel", "caustic sulphite caramel", "caustic sulfite caramel", "class ii caramel"], eNumbers: ["e150a", "e150b"],
    category: "coloring", function: "Brown colouring",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "Group ADI 300 mg/kg bw/day for caramel colours; E150b 160 mg/kg bw/day (EFSA 2011)",
    regulatory: "EU/FDA approved",
    note: "Caramels made without ammonia, so they don't carry the 4-MEI contaminant associated with Class III/IV (E150c/E150d) caramels. Low concern.",
    ref: "EFSA ANS 2011 re-evaluation of caramel colours",
  },
  {
    id: "silver-e174", name: "Silver (E174)", keywords: ["edible silver", "silver leaf", "silver foil", "silver varq", "chandi varq", "varak", "vark"], eNumbers: ["e174"],
    category: "coloring", function: "Metallic surface decoration",
    dominant: "MEDIUM", moderate: "MEDIUM", trace: "MEDIUM", evidence: "INSUFFICIENT",
    regulatory: "EU-approved for decoration only; EFSA unable to confirm safety (2016, 2025); FSSAI sets purity standards for silver leaf",
    note: "Used as leaf on sweets and confectionery. EFSA could not conclude on safety in 2016 or its 2025 follow-up because nanoparticle content and genotoxicity data were inadequate. In India, low-grade leaf has been found adulterated with aluminium.",
    ref: "EFSA 2016 & 2025 opinions on silver (E174); FSSAI silver leaf standard 2016",
  },
  {
    id: "gold-e175", name: "Gold (E175)", keywords: ["edible gold", "gold leaf", "gold foil"], eNumbers: ["e175"],
    category: "coloring", function: "Metallic surface decoration",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "LIMITED",
    regulatory: "EU-approved for decoration only",
    note: "Elemental gold is highly insoluble, so EFSA did not expect systemic effects despite the absence of toxicity studies. Purely decorative.",
    ref: "EFSA 2016 re-evaluation of gold (E175)",
  },

  // ── Expansion 2026-09: preservatives ────────────────────────────────────────
  {
    id: "parabens", name: "Parabens (p-hydroxybenzoates, E214–E219)", keywords: ["paraben", "methylparaben", "ethylparaben", "propylparaben", "p-hydroxybenzoate", "4-hydroxybenzoate", "parahydroxybenzoate", "methyl p-hydroxybenzoate", "ethyl p-hydroxybenzoate"],
    eNumbers: ["e214", "e215", "e216", "e217", "e218", "e219"],
    category: "preservative", function: "Antimicrobial preservative",
    dominant: "MEDIUM", moderate: "MEDIUM", trace: "LOW", evidence: "LIMITED",
    adi: "Methyl + ethyl group ADI 10 mg/kg bw/day (EFSA 2004); none for propyl",
    regulatory: "Methyl/ethyl approved EU; propylparaben (E216/E217) removed from the EU list in 2006; GRAS in US",
    populations: ["endocrine-sensitive groups (pregnancy, children)"],
    note: "Preservatives with weak oestrogenic activity. EFSA excluded propylparaben from the group ADI over effects on sperm in rats, and the EU withdrew it from food. Methyl and ethyl parabens remain approved at low use levels.",
    ref: "EFSA AFC 2004 opinion on para-hydroxybenzoates (E214–219)",
  },
  {
    id: "hexamine", name: "Hexamethylenetetramine (E239)", keywords: ["hexamethylenetetramine", "hexamethylene tetramine", "hexamine", "methenamine"], eNumbers: ["e239"],
    category: "preservative", function: "Preservative (Provolone cheese)",
    dominant: "HIGH", moderate: "MEDIUM", trace: "MEDIUM", evidence: "LIMITED",
    adi: "0.15 mg/kg bw/day (JECFA)",
    regulatory: "EU: Provolone cheese only; not permitted as a food additive in the US",
    note: "Works by releasing formaldehyde, which IARC classifies as a human carcinogen (by inhalation). Restricted to one cheese in the EU; residues are low but it is a formaldehyde donor.",
    ref: "JECFA 1973; EU Reg. 1333/2008 Annex II; IARC Vol. 100F (formaldehyde)",
  },
  {
    id: "boric-acid", name: "Boric Acid & Borax (E284/E285)", keywords: ["boric acid", "borax", "sodium tetraborate", "sodium borate"], eNumbers: ["e284", "e285"],
    category: "preservative", function: "Preservative (caviar only)",
    dominant: "HIGH", moderate: "HIGH", trace: "MEDIUM", evidence: "MODERATE",
    adi: "0.16 mg boron/kg bw/day group ADI (EFSA 2013)",
    regulatory: "EU: sturgeon caviar only; not permitted in US foods; prohibited by FSSAI (a known adulterant)",
    populations: ["pregnancy (developmental toxicity)", "children"],
    note: "Boron compounds are reproductive/developmental toxicants (EU CLP Repr. 1B). Legal only in caviar in the EU; elsewhere their presence usually signals illegal adulteration.",
    ref: "EFSA ANS 2013 re-evaluation of E284/E285",
  },
  {
    id: "acetates", name: "Acetic Acid & Acetates (E260–E263)", keywords: ["acetic acid", "glacial acetic acid", "sodium acetate", "sodium diacetate", "potassium acetate", "calcium acetate", "ammonium acetate"],
    eNumbers: ["e260", "e261", "e262", "e263", "e264"],
    category: "acidity regulator", function: "Acidulant / preservative",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    adi: "not specified (JECFA)",
    regulatory: "GRAS; EU-approved quantum satis",
    note: "Acetic acid is the acid in vinegar; its salts give salt-and-vinegar flavour and inhibit moulds and Listeria in meats. Normal metabolites — no toxicity concern at food levels.",
    ref: "JECFA acetic acid and salts; FDA 21 CFR 184.1005/184.1754",
  },
  {
    id: "tartrates", name: "Tartaric Acid & Tartrates (E334–E337, E353, E354)", keywords: ["tartaric acid", "metatartaric acid", "tartrate", "cream of tartar", "potassium bitartrate", "rochelle salt"],
    eNumbers: ["e334", "e335", "e336", "e337", "e353", "e354"],
    category: "acidity regulator", function: "Acidulant / raising acid",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    adi: "240 mg/kg bw/day group ADI as tartaric acid (EFSA 2020)",
    regulatory: "EU-approved; GRAS",
    note: "Grape-derived acid and its salts (cream of tartar is the classic baking acid). EFSA's 2020 re-evaluation raised the group ADI; no concern at use levels.",
    ref: "EFSA FAF 2020 re-evaluation of E334–E337 and E354",
  },
  {
    id: "fumaric-acid", name: "Fumaric Acid (E297)", keywords: ["fumaric acid", "sodium fumarate", "potassium fumarate", "calcium fumarate", "ammonium fumarate"], eNumbers: ["e297", "e365", "e366", "e367", "e368"],
    category: "acidity regulator", function: "Acidulant",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    adi: "6 mg/kg bw/day (SCF 1990)",
    regulatory: "EU-approved; GRAS",
    note: "A normal intermediate of the body's citric-acid cycle. Provides long-lasting sourness in powdered drinks and desserts; no concern within the ADI.",
    ref: "SCF 1990; FDA 21 CFR 172.350",
  },
  {
    id: "mineral-acids", name: "Hydrochloric & Sulphuric Acid (E507/E513)", keywords: ["hydrochloric acid", "sulphuric acid", "sulfuric acid"], eNumbers: ["e507", "e513"],
    category: "acidity regulator", function: "Processing acid / pH control",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    adi: "not specified (JECFA)",
    regulatory: "EU-approved; GRAS",
    note: "Strong acids used in tiny amounts in processing (e.g. starch hydrolysis) and fully neutralised in the finished food. No residual concern.",
    ref: "JECFA; FDA 21 CFR 182.1057/184.1095",
  },
  {
    id: "sulphate-salts", name: "Sodium, Potassium & Ammonium Sulphates (E514/E515/E517)", keywords: ["sodium sulphate", "sodium sulfate", "potassium sulphate", "potassium sulfate", "ammonium sulphate", "ammonium sulfate", "potassium hydrogen sulphate", "magnesium sulphate", "magnesium sulfate", "epsom salt"],
    eNumbers: ["e514", "e515", "e517", "e518"],
    category: "acidity regulator", function: "Carrier / pH control / yeast nutrient",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "not specified (JECFA)",
    regulatory: "EU-approved; GRAS",
    note: "Simple mineral salts used as carriers, acidity regulators and yeast food. Large doses of sulphate are laxative, but food use is far below that.",
    ref: "EFSA 2019 re-evaluation of sulphates E514–E517",
  },

  // ── Expansion 2026-09: gases, glazing & processing agents ───────────────────
  {
    id: "carbon-dioxide", name: "Carbon Dioxide (E290)", keywords: ["carbon dioxide", "co2", "carbonic acid gas"], eNumbers: ["e290"],
    category: "preservative", function: "Carbonation / packaging gas",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    regulatory: "EU-approved quantum satis; GRAS",
    note: "The bubbles in fizzy drinks and a protective packaging gas. No toxicity at food use; carbonation itself is harmless (the concern in sodas is sugar/acids, not CO₂).",
    ref: "FDA 21 CFR 184.1240",
  },
  {
    id: "packaging-gases", name: "Packaging Gases (nitrogen, argon, nitrous oxide…)", keywords: ["nitrogen", "nitrous oxide", "protective atmosphere", "packaging gas", "isobutane", "argon", "helium", "propane", "butane", "n-butane", "oxygen", "hydrogen gas"],
    eNumbers: ["e938", "e939", "e941", "e942", "e943a", "e943b", "e944", "e948", "e949"],
    category: "preservative", function: "Modified-atmosphere packaging / propellant",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    regulatory: "EU-approved quantum satis; GRAS",
    note: "Inert or natural air gases that displace oxygen to keep snacks and salads fresh, or propel whipped cream. They don't remain in the food in meaningful amounts.",
    ref: "EU Reg. 1333/2008 Annex II; FDA 21 CFR 184.1540",
  },
  {
    id: "dimethylpolysiloxane", name: "Dimethylpolysiloxane (E900)", keywords: ["dimethylpolysiloxane", "dimethyl polysiloxane", "polydimethylsiloxane", "dimethicone", "antifoaming agent"], eNumbers: ["e900"],
    category: "stabilizer", function: "Anti-foaming agent (frying oils, drinks)",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "17 mg/kg bw/day (EFSA 2020)",
    regulatory: "EU-approved; FDA 21 CFR 173.340",
    note: "A silicone added in parts-per-million to frying oil and juices to stop foaming. Poorly absorbed; EFSA raised its ADI in 2020 and found no concern at use levels.",
    ref: "EFSA FAF 2020 re-evaluation of E900",
  },
  {
    id: "glazing-waxes", name: "Glazing Waxes (beeswax, candelilla, microcrystalline, montan, PE wax)",
    keywords: ["beeswax", "bees wax", "candelilla", "microcrystalline wax", "montan acid ester", "oxidised polyethylene wax", "oxidized polyethylene wax", "montan wax esters", "pe wax", "petroleum wax", "rice bran wax", "lanolin", "wool fat", "wool wax"],
    eNumbers: ["e901", "e902", "e905", "e912", "e914", "e908", "e913"],
    category: "stabilizer", function: "Glazing / coating agent",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    regulatory: "EU-approved for surface treatment (fruit, confectionery); montan esters & PE wax only on citrus/fruit peel",
    note: "Thin wax coatings that give shine or seal fruit skins. Largely not absorbed; beeswax is animal-derived (not vegan). Montan and polyethylene waxes are restricted to inedible peel.",
    ref: "EFSA 2007 (beeswax), 2012 (candelilla), 2013 (microcrystalline wax) opinions",
  },
  {
    id: "weighting-agents", name: "Beverage Weighting Agents (SAIB E444, Ester Gum E445)", keywords: ["sucrose acetate isobutyrate", "saib", "glycerol ester of wood rosin", "glycerol esters of wood rosin", "glyceryl abietate", "ester gum"],
    eNumbers: ["e444", "e445"],
    category: "stabilizer", function: "Keeps citrus oils suspended in soft drinks",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "E445 10 mg/kg bw/day (EFSA 2023); SAIB 20 mg/kg bw/day (JECFA)",
    regulatory: "EU/FDA approved; the usual replacements for banned brominated vegetable oil",
    note: "Used at low levels in cloudy citrus sodas to stop flavour oils floating. EFSA's re-evaluations found no safety concern; a clear improvement over BVO.",
    ref: "EFSA 2016 (E444) and 2023 follow-up (E445)",
  },
  {
    id: "cyclodextrins", name: "Cyclodextrins (E459)", keywords: ["cyclodextrin", "beta-cyclodextrin", "betadex", "alfadex"], eNumbers: ["e459"],
    category: "stabilizer", function: "Encapsulating carrier for flavours/vitamins",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "Beta-cyclodextrin 5 mg/kg bw/day (JECFA)",
    regulatory: "EU-approved (E459); alpha/gamma forms GRAS in US",
    note: "Ring-shaped starch derivatives that trap flavours or vitamins. Poorly digested in the small intestine and fermented in the colon; no concern within the ADI.",
    ref: "JECFA 1995; EU Reg. 231/2012",
  },
  {
    id: "cellulose-ethers", name: "Cellulose Ethers (methylcellulose, HPMC, E461–E465)",
    keywords: ["methylcellulose", "methyl cellulose", "hydroxypropyl methylcellulose", "hydroxypropyl methyl cellulose", "hypromellose", "hpmc", "hydroxypropyl cellulose", "ethyl cellulose", "ethylcellulose", "ethyl methyl cellulose"],
    eNumbers: ["e461", "e462", "e463", "e464", "e465"],
    category: "thickener", function: "Thickener / binder / capsule material",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "not specified (EFSA 2018 group evaluation of celluloses)",
    regulatory: "EU-approved; GRAS",
    note: "Modified plant cellulose used as a binder in plant-based meats, a thickener, and vegetarian capsule shells. Not absorbed; acts like soluble fibre. EFSA saw no need for a numerical ADI.",
    ref: "EFSA ANS 2018 re-evaluation of celluloses E460–E466, E468, E469",
  },
  {
    id: "lactem-tartaric-esters", name: "Lactic/Tartaric Acid Esters of Mono-/Diglycerides (E472b/d/f)",
    keywords: ["lactem", "lactic acid ester", "lactic acid esters of mono", "lactylated monoglyceride", "mixed acetic and tartaric", "tartaric acid esters of mono"],
    eNumbers: ["e472b", "e472d", "e472f"],
    category: "emulsifier", function: "Emulsifier / whipping agent",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "not specified (JECFA)",
    regulatory: "EU-approved",
    note: "Mono-/diglycerides joined to lactic or tartaric acid, used in cake mixes and whipped toppings. Digested to fats and the parent acids; low concern, though they indicate ultra-processing.",
    ref: "JECFA; EU Reg. 231/2012",
  },
  {
    id: "propylene-glycol-esters", name: "Propylene Glycol Esters of Fatty Acids (E477)", keywords: ["propylene glycol ester", "propylene glycol monostearate", "propane-1,2-diol ester", "propane-1,2-diol esters"], eNumbers: ["e477"],
    category: "emulsifier", function: "Emulsifier (cake mixes, toppings)",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "25 mg/kg bw/day as propylene glycol (EFSA 2018)",
    regulatory: "EU-approved; FDA 21 CFR 172.856",
    note: "Hydrolysed in the gut to fatty acids and propylene glycol; EFSA's 2018 re-evaluation found no concern at use levels.",
    ref: "EFSA ANS 2018 re-evaluation of E477",
  },
  {
    id: "quillaia-extract", name: "Quillaia Extract (E999)", keywords: ["quillaia", "quillaja", "soapbark extract"], eNumbers: ["e999"],
    category: "emulsifier", function: "Foaming agent (soft drinks, cider)",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "3 mg saponins/kg bw/day (EFSA 2019)",
    regulatory: "EU-approved; FDA GRAS",
    note: "A saponin-rich bark extract that creates foam in drinks. EFSA set an ADI in 2019 and found no exposure scenario exceeding it.",
    ref: "EFSA FAF 2019 re-evaluation of E999; 2024 follow-up",
  },
  {
    id: "pullulan", name: "Pullulan (E1204)", keywords: ["pullulan"], eNumbers: ["e1204"],
    category: "thickener", function: "Film former (capsules, breath strips)",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "not specified (JECFA)",
    regulatory: "EU-approved; FDA GRAS",
    note: "A fermentation-derived polysaccharide used for vegetarian capsules and edible films. Behaves like a soluble fibre; no concern.",
    ref: "EFSA 2004 opinion on pullulan; JECFA 2006",
  },

  // ── Expansion 2026-09: gums, gels & proteins ────────────────────────────────
  {
    id: "agar", name: "Agar (E406)", keywords: ["agar", "agar-agar", "agar agar", "japanese gelatin"], eNumbers: ["e406"],
    category: "thickener", function: "Gelling agent",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    adi: "not specified (EFSA 2016)",
    regulatory: "EU-approved; GRAS",
    note: "A seaweed gel used as a vegetarian alternative to gelatin. Not digested — acts as soluble fibre. EFSA found no concern.",
    ref: "EFSA ANS 2016 re-evaluation of agar (E406)",
  },
  {
    id: "konjac", name: "Konjac Gum / Glucomannan (E425)", keywords: ["konjac", "konnyaku", "glucomannan"], eNumbers: ["e425"],
    category: "thickener", function: "Gelling agent / thickener",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    adi: "not specified (EFSA 2017)",
    regulatory: "EU-approved but banned in jelly mini-cups (choking deaths); GRAS",
    populations: ["young children & elderly (choking risk in firm jelly confectionery)"],
    note: "A highly absorbent soluble fibre that forms firm gels. Safe to eat, but firm konjac jelly cups caused choking deaths, so the EU bans it in jelly confectionery.",
    ref: "EFSA ANS 2017 re-evaluation of E425; Commission Decision 2004/374/EC",
  },
  {
    id: "gelatin", name: "Gelatin", keywords: ["gelatin", "gelatine", "bovine gelatin", "pork gelatin", "isinglass", "fish gelatin", "fish gelatine", "swim bladder collagen"], eNumbers: ["e441"],
    category: "thickener", function: "Gelling agent",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    regulatory: "A food ingredient (not an E-number in the EU); GRAS",
    populations: ["vegetarians/vegans; halal/kosher diets (animal source)"],
    note: "Protein made from animal collagen (pig or cattle skin/bones). No safety concern; relevant mainly for dietary and religious choices.",
    ref: "FDA GRAS; EU Reg. 853/2004 (gelatin hygiene)",
  },
  {
    id: "caseinates", name: "Caseinates (milk protein)", keywords: ["caseinate", "sodium caseinate", "calcium caseinate", "casein"], eNumbers: [],
    category: "emulsifier", function: "Protein emulsifier / texturiser",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    regulatory: "Food ingredient; milk allergen must be declared",
    populations: ["milk allergy (still present in 'non-dairy' creamers)"],
    note: "Purified milk protein used in coffee whiteners, processed cheese and meats. Nutritionally fine, but a milk allergen even in products labelled 'non-dairy'.",
    ref: "EU Reg. 1169/2011 Annex II; FDA 21 CFR 182.1748",
  },

  // ── Expansion 2026-09: sweeteners & free sugars ─────────────────────────────
  {
    id: "neohesperidin-dc", name: "Neohesperidin DC (E959)", keywords: ["neohesperidin", "neohesperidine", "nhdc"], eNumbers: ["e959"],
    category: "sweetener", function: "Intense sweetener / flavour modifier",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "20 mg/kg bw/day (EFSA 2022)",
    regulatory: "EU-approved; not an approved sweetener in the US (flavour use only)",
    note: "Made by hydrogenating a bitter-orange flavonoid; ~1,500× sweeter than sugar. EFSA's 2022 re-evaluation raised the ADI from 5 to 20 mg/kg and found no genotoxicity concern.",
    ref: "EFSA FAF 2022 re-evaluation of E959",
  },
  {
    id: "thaumatin", name: "Thaumatin (E957)", keywords: ["thaumatin", "katemfe"], eNumbers: ["e957"],
    category: "sweetener", function: "Intense sweetener / flavour enhancer",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "not specified (JECFA); EFSA 2021: no concern",
    regulatory: "EU-approved; FDA GRAS (flavour)",
    note: "A sweet protein from the West African katemfe fruit; digested like any other protein. EFSA's 2021 re-evaluation found no safety concern.",
    ref: "EFSA FAF 2021 re-evaluation of E957",
  },
  {
    id: "monk-fruit", name: "Monk Fruit Extract (Mogrosides)", keywords: ["monk fruit", "luo han guo", "luohanguo", "mogroside", "siraitia grosvenorii"], eNumbers: [],
    category: "sweetener", function: "Intense sweetener",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "LIMITED",
    regulatory: "FDA GRAS notices (no objection); EFSA 2019 could not conclude on novel-food safety (data gaps)",
    note: "Sweet mogrosides from a Chinese gourd with a long food history. Well tolerated in available studies, but EFSA considered the dossier insufficient in 2019, so long-term evidence is thinner than for stevia.",
    ref: "FDA GRN 301/522/627; EFSA FAF 2019 opinion on Luo Han Fruit extract",
  },
  {
    id: "fruit-juice-concentrate", name: "Fruit Juice Concentrate", keywords: ["juice concentrate", "concentrated fruit juice", "concentrated apple juice", "concentrated grape juice", "concentrated pear juice", "fruit juice powder", "grape must", "apple juice", "orange juice", "grape juice", "pear juice", "pineapple juice", "fruit juice", "white grape juice"], eNumbers: [],
    category: "sweetener", function: "Sweetener (free sugars)",
    dominant: "HIGH", moderate: "MEDIUM", trace: "LOW", evidence: "STRONG",
    regulatory: "Food ingredient; counts as free/added sugar (WHO, FDA)",
    populations: ["diabetes; weight/dental health"],
    note: "Juice boiled down to a sugar syrup — often used so a product can claim 'no added sugar'. WHO counts juice sugars as free sugars, and FDA counts concentrate used to sweeten as added sugar.",
    ref: "WHO 2015 free-sugars guideline; FDA 2016 added-sugars rule",
  },
  {
    id: "fructose", name: "Fructose (added)", keywords: ["fructose", "crystalline fructose", "fruit sugar", "fructose syrup"], eNumbers: [],
    category: "sweetener", function: "Free sugar / sweetener",
    dominant: "HIGH", moderate: "MEDIUM", trace: "LOW", evidence: "STRONG",
    regulatory: "Food ingredient; counts as free/added sugar",
    populations: ["diabetes; fatty-liver disease; fructose malabsorption"],
    note: "Pure fructose added as a sweetener. Low glycaemic index, but metabolised mainly in the liver where high intakes drive fat production and raise triglycerides. A free sugar like any other.",
    ref: "WHO 2015 free-sugars guideline; EFSA 2022 opinion on dietary sugars",
  },
  {
    id: "lactose", name: "Lactose (added)", keywords: ["lactose", "milk sugar"], eNumbers: [],
    category: "sweetener", function: "Bulking agent / carrier / sugar",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    regulatory: "Food ingredient; milk allergen labelling where relevant",
    populations: ["lactose intolerance", "milk allergy (may carry milk protein)"],
    note: "Milk sugar used as a carrier in seasonings and as filler. Less sweet and less cariogenic than sucrose, but a problem for the lactose-intolerant; counts as added sugar when added.",
    ref: "EFSA 2010 opinion on lactose thresholds; FDA added-sugars rule",
  },
  {
    id: "malt-sugars", name: "Malt Extract & Maltose", keywords: ["malt extract", "barley malt extract", "malt syrup", "barley malt syrup", "maltose", "malted barley extract"], eNumbers: [],
    category: "sweetener", function: "Sweetener / flavour / colour (free sugars)",
    dominant: "HIGH", moderate: "MEDIUM", trace: "LOW", evidence: "STRONG",
    regulatory: "Food ingredient; counts as free/added sugar",
    populations: ["coeliac disease (barley gluten)", "diabetes"],
    note: "Sprouted-barley syrup rich in maltose, used in cereals and bread for flavour and browning. Nutritionally a free sugar and a source of gluten.",
    ref: "WHO 2015 free-sugars guideline; EU Reg. 1169/2011 (cereals containing gluten)",
  },
  {
    id: "brown-rice-syrup", name: "Brown Rice Syrup", keywords: ["rice syrup", "brown rice syrup", "rice malt syrup"], eNumbers: [],
    category: "sweetener", function: "Sweetener (free sugars)",
    dominant: "HIGH", moderate: "MEDIUM", trace: "LOW", evidence: "MODERATE",
    regulatory: "Food ingredient; counts as added sugar; EU sets inorganic-arsenic limits for rice products",
    populations: ["infants & toddlers (arsenic)", "diabetes (very high GI)"],
    note: "A glucose/maltose syrup made from rice starch with a very high glycaemic index. Studies found notable inorganic arsenic in products sweetened with it, a particular concern for toddler foods.",
    ref: "Jackson et al. 2012 (Environ Health Perspect); EU Reg. 2023/465 arsenic limits",
  },

  // ── Expansion 2026-09: flavour & other ──────────────────────────────────────
  {
    id: "ribonucleotides", name: "Ribonucleotides (disodium guanylate/inosinate, E626–E635)",
    keywords: ["guanylate", "inosinate", "guanylic acid", "inosinic acid", "ribonucleotide", "disodium 5'-ribonucleotides"],
    eNumbers: ["e626", "e627", "e628", "e629", "e630", "e631", "e632", "e633", "e634", "e635"],
    category: "flavor enhancer", function: "Umami enhancer (synergist with MSG)",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "not specified (JECFA)",
    regulatory: "EU/FDA approved",
    populations: ["gout / hyperuricaemia (purines)", "vegetarians (inosinate may be animal-derived)"],
    note: "Used alongside MSG to multiply savoury taste in crisps and noodles. Metabolised to uric acid, so relevant for gout; otherwise low concern. A strong ultra-processing marker.",
    ref: "JECFA 1993; EU Reg. 1333/2008",
  },
  {
    id: "glycine", name: "Glycine (E640)", keywords: ["glycine", "aminoacetic acid"], eNumbers: ["e640"],
    category: "flavor enhancer", function: "Flavour modifier",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    regulatory: "EU-approved; FDA 21 CFR 172.812",
    note: "The simplest amino acid, naturally abundant in protein. Adds slight sweetness and masks bitterness; no concern.",
    ref: "EU Reg. 1333/2008; FDA 21 CFR 172.812",
  },
  {
    id: "yeast-extract", name: "Yeast Extract", keywords: ["yeast extract", "autolysed yeast", "autolyzed yeast", "yeast autolysate", "hydrolysed yeast", "hydrolyzed yeast"], eNumbers: [],
    category: "flavor enhancer", function: "Savoury flavour (natural free glutamate)",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    regulatory: "Food ingredient (not an additive); GRAS",
    populations: ["MSG-avoiders (contains free glutamate)"],
    note: "Broken-down yeast cells rich in free glutamate and nucleotides — a 'clean label' way to add umami. Safe; it signals flavour engineering rather than a risk.",
    ref: "FDA GRAS; EFSA 2017 glutamate opinion (context)",
  },
  {
    id: "ethanol", name: "Ethanol / Alcohol (E1510)", keywords: ["ethanol", "ethyl alcohol", "alcohol (ethanol)", "rum", "brandy", "cognac", "whisky", "whiskey", "vodka", "sake", "kirsch", "liqueur", "armagnac", "nihonshu", "ryorishu"], eNumbers: ["e1510"],
    category: "preservative", function: "Carrier solvent / preservative",
    dominant: "HIGH", moderate: "MEDIUM", trace: "LOW", evidence: "STRONG",
    regulatory: "Carrier solvent in flavourings; alcoholic ingredients IARC Group 1",
    populations: ["pregnancy", "children", "people avoiding alcohol for health or religious reasons"],
    note: "Usually a trace solvent for flavourings. As a main ingredient it means an alcoholic product — alcohol is an IARC Group 1 carcinogen with no safe threshold identified.",
    ref: "IARC Vol. 100E; WHO Europe 2023 statement on alcohol",
  },
  {
    id: "benzyl-alcohol", name: "Benzyl Alcohol (E1519)", keywords: ["benzyl alcohol"], eNumbers: ["e1519"],
    category: "preservative", function: "Carrier solvent for flavourings",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "5 mg/kg bw/day group ADI with benzoates (JECFA)",
    regulatory: "EU-approved only as a flavouring carrier",
    note: "Metabolised to benzoic acid, so it shares the benzoate group ADI. Present only in trace amounts in flavourings.",
    ref: "JECFA 1996; EU Reg. 1333/2008 Annex III",
  },
  {
    id: "fully-hydrogenated-oil", name: "Fully Hydrogenated Oil", keywords: ["fully hydrogenated", "fully hydrogenated vegetable oil", "fully hydrogenated vegetable fat", "fully hydrogenated palm", "fully hydrogenated soybean", "fully hydrogenated rapeseed", "fully hydrogenated cottonseed", "fully hydrogenated fat"], eNumbers: [],
    category: "fat", function: "Hard fat / structuring",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    regulatory: "Permitted; not a partially hydrogenated oil (no significant trans fat)",
    populations: ["cardiovascular (saturated fat)"],
    note: "Complete hydrogenation turns unsaturated fat into saturated stearic acid, leaving negligible trans fat — unlike partially hydrogenated oils. A saturated, highly processed fat rather than a trans-fat hazard.",
    ref: "FDA 2015 PHO determination (scope excludes fully hydrogenated oils)",
  },
  {
    id: "interesterified-fat", name: "Interesterified Fat", keywords: ["interesterified", "inter-esterified"], eNumbers: [],
    category: "fat", function: "Trans-fat-free hard fat",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "LIMITED",
    regulatory: "Permitted",
    populations: ["cardiovascular (saturated fat)"],
    note: "Fats whose fatty acids have been rearranged to harden them without creating trans fat. Usually rich in saturated fat; long-term metabolic effects are less studied.",
    ref: "Mensink et al. 2016 (Prog Lipid Res) review of interesterified fats",
  },
  // ── 2026-10-04 weekly additions ──────────────────────────────────────────────
  {
    id: "isomaltulose", name: "Isomaltulose (Palatinose)", keywords: ["isomaltulose", "palatinose"], eNumbers: [],
    category: "sweetener", function: "Slow-release sugar (sucrose replacer)",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "no ADI (a carbohydrate food)",
    regulatory: "EU novel food (Decision 2005/457/EC; extended 2024); FDA GRAS",
    populations: ["hereditary fructose intolerance"],
    note: "A disaccharide made enzymatically from sucrose. It is a sugar (4 kcal/g) and counts toward total sugars, but it is digested slowly (low GI) and is not cariogenic. Not the same as isomalt (E953), a polyol.",
    ref: "Commission Decision 2005/457/EC; EFSA NDA 2011 isomaltulose claim opinion",
  },
  {
    id: "tagatose", name: "Tagatose", keywords: ["tagatose", "d-tagatose"], eNumbers: [],
    category: "sweetener", function: "Rare sugar / low-calorie bulk sweetener (~90% sweetness, ~1.5 kcal/g)",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "not specified (JECFA 2004)",
    regulatory: "EU novel food (2005); FDA GRAS",
    populations: ["IBS (laxative at high intake)", "hereditary fructose intolerance"],
    note: "A rare sugar found in small amounts in dairy. Mostly fermented in the colon rather than absorbed, so it barely raises blood glucose; large amounts can cause bloating or a laxative effect.",
    ref: "JECFA 63rd meeting (2004); EU novel food authorisation 2005",
  },
  {
    id: "soluble-fibre-dextrins", name: "Soluble Fibre Dextrins (resistant dextrin, soluble corn fibre)",
    keywords: ["resistant dextrin", "resistant maltodextrin", "soluble corn fibre", "soluble corn fiber", "soluble tapioca fibre", "soluble tapioca fiber", "soluble wheat fibre", "soluble wheat fiber", "wheat dextrin"], eNumbers: [],
    category: "thickener", function: "Soluble dietary fibre / bulking agent / sugar replacer",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "no ADI (food ingredient)",
    regulatory: "FDA recognises resistant maltodextrin/dextrin as dietary fibre (2018); EU food ingredient",
    populations: ["IBS (bloating at high intake)"],
    note: "Starch processed so most of it resists digestion and is fermented in the colon like other soluble fibres. Used to add fibre and replace sugar; large servings can cause gas.",
    ref: "FDA 2018 guidance on non-digestible carbohydrates as dietary fibre",
  },
  {
    id: "plant-fibres", name: "Added Plant Fibres (citrus, oat, bamboo, pea, apple, beta-glucan)",
    keywords: ["citrus fibre", "citrus fiber", "oat fibre", "oat fiber", "bamboo fibre", "bamboo fiber", "pea fibre", "pea fiber", "apple fibre", "apple fiber", "sugar beet fibre", "sugar beet fiber", "potato fibre", "potato fiber", "wheat fibre", "wheat fiber", "oat beta-glucan", "barley beta-glucan", "beta-glucan", "beta glucan", "resistant starch", "high-amylose maize starch", "high amylose maize starch", "arabinoxylan", "wheat arabinoxylan", "apple pomace fibre", "bamboo cellulose", "beet fibre", "beta-1,3/1,6-glucan", "oat hull fibre", "pea cell wall fibre", "pea hull fibre", "wheat bran fibre"], eNumbers: [],
    category: "thickener", function: "Texturiser / water binder / fibre",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    regulatory: "Food ingredients, not additives; FDA counts mixed plant cell-wall fibres as dietary fibre (2018)",
    note: "Milled cell-wall material from fruit, cereal or vegetable by-products. Used to bind water, replace fat or add fibre. Mostly insoluble fibre, except cereal beta-glucan, a soluble fibre with an EU-authorised cholesterol-lowering claim at 3 g/day. No safety concern at use levels.",
    ref: "FDA 2018 guidance on non-digestible carbohydrates as dietary fibre",
  },
  {
    id: "cultured-fermentates", name: "Cultured Fermentates (cultured dextrose/sugar/wheat flour)",
    keywords: ["cultured dextrose", "cultured sugar", "cultured corn sugar", "cultured wheat flour", "cultured wheat", "fermented wheat flour", "fermented dextrose"], eNumbers: [],
    category: "preservative", function: "Clean-label preservative (propionic/acetic acid from fermentation)",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "LIMITED",
    regulatory: "Declared as food ingredients (US GRAS); EU status as additives vs. ingredients is debated",
    note: "A sugar or flour fermented by bacteria such as Propionibacterium, then dried. The preserving effect comes from propionic and acetic acid, the same compounds as E280/E260, so the safety profile is similar. Used at trace levels; it is not a meaningful source of sugar.",
    ref: "FDA GRAS notices for cultured dextrose; EFSA 2014 propionic acid re-evaluation",
  },
  {
    id: "plant-sterols", name: "Plant Sterols & Stanols (E499)",
    keywords: ["plant sterol", "plant stanol", "phytosterol", "phytostanol", "sterol ester", "stanol ester", "stigmasterol"], eNumbers: ["e499"],
    category: "stabilizer", function: "Cholesterol-lowering ingredient / stabiliser",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    regulatory: "EU mandatory warnings (Reg. 1169/2011 Annex III, formerly 608/2004); EFSA-authorised LDL claim (1.5–3 g/day)",
    populations: ["pregnant or breastfeeding women", "children under 5", "sitosterolaemia"],
    note: "Plant compounds that block cholesterol absorption; 1.5–3 g/day lowers LDL by about 7–12%. EU labels must warn that they are not for people who don't need to lower cholesterol, nor for pregnant or nursing women or under-5s, because they also reduce carotenoid absorption.",
    ref: "EFSA 2012 (stigmasterol-rich sterols, E499); EFSA NDA 2010/2012 LDL claim; Reg. (EU) 1169/2011 Annex III",
  },
  {
    id: "soybean-hemicellulose", name: "Soybean Hemicellulose (E426)", keywords: ["soybean hemicellulose", "soy hemicellulose", "soya hemicellulose", "soy polysaccharide", "soybean polysaccharide"], eNumbers: ["e426"],
    category: "stabilizer", function: "Stabiliser / anti-clumping in rice and noodles",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "not specified (EFSA 2017)",
    regulatory: "EU approved; EFSA 2017 re-evaluation: no safety concern",
    populations: ["soy allergy (residual protein)"],
    note: "Soluble fibre extracted from soybean hulls and fermented in the gut. EFSA saw no safety concern but advised reducing residual soy protein and informing allergic consumers.",
    ref: "EFSA ANS Panel 2017 re-evaluation of E426",
  },
  {
    id: "povidones", name: "Polyvinylpyrrolidones (PVP/PVPP, E1201–E1202)",
    keywords: ["polyvinylpyrrolidone", "polyvinylpolypyrrolidone", "povidone", "crospovidone"], eNumbers: ["e1201", "e1202"],
    category: "stabilizer", function: "Tablet binder / beverage clarifier",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "not needed (EFSA 2020); JECFA PVP 0–50 mg/kg bw/day",
    regulatory: "EU approved for supplements and as a beer/wine processing aid; EFSA 2020: no safety concern",
    note: "Synthetic polymers used to bind supplement tablets (PVP) or remove haze from beer and wine (PVPP, filtered out). Not absorbed; EFSA found no safety concern at reported uses.",
    ref: "EFSA FAF Panel 2020 re-evaluation of E1201/E1202 (EFSA J 18:6215)",
  },
  {
    id: "coating-polymers", name: "Supplement Coating Polymers (PVA, methacrylate copolymers, PEG)",
    keywords: ["polyvinyl alcohol", "basic methacrylate copolymer", "neutral methacrylate copolymer", "anionic methacrylate copolymer", "methacrylate copolymer", "polyethylene glycol", "macrogol", "vinylpyrrolidone-vinyl acetate copolymer", "polyvinylpyrrolidone-vinyl acetate", "copovidone", "polyvinyl alcohol-polyethylene glycol graft copolymer", "pva-peg graft copolymer", "pvp-va copolymer"],
    eNumbers: ["e1203", "e1205", "e1206", "e1208", "e1209", "e1521", "e1207"],
    category: "glazing agent", function: "Film coating for tablets and capsules",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "PEG 10 mg/kg bw/day (JECFA); basic methacrylate copolymer not specified (JECFA)",
    regulatory: "EU approved mainly for food supplements and FSMPs",
    note: "Synthetic film-formers used to coat supplement tablets. They pass through the gut largely unabsorbed; exposure estimates sit within the regulatory limits.",
    ref: "EFSA 2018 refined exposure assessment of E1521; JECFA evaluation of basic methacrylate copolymer",
  },
  // ── Expansion 2026-10: remaining EU codes, energy-drink actives, protein isolates ──
  {
    id: "polyoxyethylene-stearate", name: "Polyoxyethylene (40) Stearate (E431)",
    keywords: ["polyoxyethylene (40) stearate", "polyoxyethylene 40 stearate", "polyoxyethylene stearate", "polyoxyl 40 stearate", "peg-40 stearate", "polyoxyethylene (8) stearate", "polyoxyethylene 8 stearate", "polyoxyl 8 stearate"], eNumbers: ["e431", "e430"],
    category: "emulsifier", function: "Synthetic emulsifier",
    dominant: "MEDIUM", moderate: "MEDIUM", trace: "LOW", evidence: "LIMITED",
    adi: "0–25 mg/kg bw/day (JECFA 1973)",
    regulatory: "EU-approved for wine only; not yet re-evaluated by EFSA",
    note: "A polyethoxylated emulsifier chemically close to the polysorbates. Rarely used, and wine labels don't have to list it. Its safety data are old (JECFA 1973), and it falls in the class of synthetic emulsifiers under study for gut-microbiome effects.",
    ref: "JECFA 17th meeting (1973); EU Reg. 1333/2008 Annex II",
  },
  {
    id: "tosom", name: "Thermally Oxidised Soya Bean Oil with Mono-/Diglycerides (E479b)",
    keywords: ["thermally oxidised soya bean oil", "thermally oxidized soybean oil", "oxidised soya bean oil interacted", "oxidized soybean oil interacted", "tosom"], eNumbers: ["e479b"],
    category: "emulsifier", function: "Anti-spattering emulsifier in frying fats",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "LIMITED",
    adi: "SCF 25 / JECFA 30 mg/kg bw/day; EFSA (2018) found the data too limited to confirm an ADI",
    regulatory: "EU-approved only in fat emulsions for frying (max 5 g/kg)",
    populations: ["soy allergy (soya-derived; highly refined)"],
    note: "A niche emulsifier that stops margarine-type frying fats spattering. EFSA's 2018 re-evaluation found no adverse effects up to the highest dose tested in rats, but too little absorption and genotoxicity data to confirm the old ADI. Exposure is very low because use is so narrow.",
    ref: "EFSA FAF Panel 2018, EFSA J 16(10):5420",
  },
  {
    id: "hydrogenated-polydecene", name: "Hydrogenated Poly-1-decene (E907)",
    keywords: ["hydrogenated poly-1-decene", "hydrogenated polydecene", "hydrogenated poly-1 decene", "poly-1-decene"], eNumbers: ["e907"],
    category: "glazing agent", function: "Glazing agent",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "20 mg/kg bw/day (EFSA 2020)",
    regulatory: "EU-approved as a glazing agent on confectionery and dried fruit; EFSA 2020: no safety concern",
    note: "A synthetic hydrocarbon used in tiny amounts to give sweets and dried fruit a glossy, non-stick surface. EFSA set an ADI in 2020; even high consumers (toddlers) stay well below it.",
    ref: "EFSA FAF Panel 2020, EFSA J 18(2):6034",
  },
  {
    id: "carbamide", name: "Carbamide (Urea, E927b)",
    keywords: ["carbamide", "urea"], eNumbers: ["e927b"],
    category: "humectant", function: "Texture and pH-raising agent in sugar-free gum",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "Acceptable in chewing gum up to 3% (JECFA 1993)",
    regulatory: "EU-approved only in chewing gum without added sugar (max 30 g/kg)",
    note: "Urea is a natural body metabolite. In sugar-free gum it neutralises plaque acids. EFSA accepted a dental health claim for this effect (at least 20 mg per piece). No toxicological concern at this use.",
    ref: "JECFA 41st meeting (1993); EFSA NDA Panel 2011 claim on carbamide chewing gum",
  },
  {
    id: "mineral-oil", name: "Food-grade Mineral Oil (liquid paraffin, petrolatum)",
    keywords: ["mineral oil", "white mineral oil", "liquid paraffin", "paraffin oil", "petrolatum", "petroleum jelly"], eNumbers: ["e905a"],
    category: "glazing agent", function: "Release agent / coating / anti-dusting",
    dominant: "HIGH", moderate: "MEDIUM", trace: "MEDIUM", evidence: "MODERATE",
    adi: "High-viscosity white oils 0–20 mg/kg bw/day (JECFA 2002); ADIs for low/medium-viscosity grades withdrawn (JECFA 2012)",
    regulatory: "Not authorised as an additive in the EU; FDA permits food-grade white mineral oil (21 CFR 172.878) as a release agent and coating",
    note: "Petroleum-derived hydrocarbons used to keep sweets, dried fruit and bakery goods from sticking. Saturated hydrocarbons (MOSH) build up in body tissues. EFSA's 2023 opinion found the aromatic fraction (MOAH) a health concern because it includes genotoxic carcinogens. Food-grade white oils are refined to remove most MOAH.",
    ref: "EFSA CONTAM Panel 2023 update on mineral oil hydrocarbons; JECFA 59th (2002) & 76th (2012) meetings; FDA 21 CFR 172.878",
  },
  {
    id: "ethyl-acetate", name: "Ethyl Acetate (extraction solvent / flavouring)",
    keywords: ["ethyl acetate", "ethyl ethanoate"], eNumbers: ["e1504"],
    category: "flavour", function: "Decaffeination and extraction solvent; fruity flavouring",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    adi: "0–25 mg/kg bw/day (JECFA)",
    regulatory: "EU extraction solvent for all uses under good manufacturing practice (Dir. 2009/32/EC); FDA GRAS",
    note: "A simple ester found naturally in fruit and wine. It is used to decaffeinate coffee and tea and as a carrier for flavours, and it evaporates during processing. No concern at the residue levels left in food.",
    ref: "Directive 2009/32/EC Annex I; JECFA evaluation of ethyl acetate",
  },
  {
    id: "caffeine", name: "Added Caffeine (incl. guarana, kola nut)",
    keywords: ["caffeine", "anhydrous caffeine", "caffeine anhydrous", "guarana", "guarana extract", "guarana seed", "kola nut", "paullinia cupana"], eNumbers: [],
    category: "stimulant", function: "Stimulant / bitterness",
    dominant: "MEDIUM", moderate: "MEDIUM", trace: "LOW", evidence: "STRONG",
    adi: "No concern up to 400 mg/day (single dose 200 mg) for healthy adults; 200 mg/day in pregnancy (EFSA 2015)",
    regulatory: "Permitted flavouring in soft drinks; EU requires a 'high caffeine content' warning above 150 mg/L",
    populations: ["children and adolescents (EFSA: about 3 mg/kg bw/day as a guide)", "pregnancy and breastfeeding (≤200 mg/day)", "people with heart-rhythm problems or anxiety"],
    note: "A stimulant added to colas and energy drinks, sometimes via guarana or kola nut. Adults are fine up to about 400 mg a day, but one energy drink can hold 80–160 mg, which is a lot for a child. EFSA linked energy-drink adverse events mainly to high caffeine intake, often with alcohol.",
    ref: "EFSA NDA Panel 2015 Scientific Opinion on the safety of caffeine; EU Reg. 1169/2011 Annex III",
  },
  {
    id: "taurine-glucuronolactone", name: "Taurine & Glucuronolactone (energy-drink actives)",
    keywords: ["taurine", "2-aminoethanesulfonic acid", "glucuronolactone", "glucurono-gamma-lactone", "d-glucurono-γ-lactone"], eNumbers: [],
    category: "nutrient", function: "Energy-drink functional ingredient",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    regulatory: "EFSA 2009: no safety concern at energy-drink levels",
    note: "Taurine is an amino acid made by the body and found in meat and fish. Glucuronolactone is a natural glucose metabolite. EFSA found neither a concern at the doses used in energy drinks. The health questions about these drinks centre on their caffeine and sugar.",
    ref: "EFSA ANS Panel 2009, EFSA Journal 935",
  },
  {
    id: "protein-isolates", name: "Protein Isolates & Textured Proteins",
    keywords: ["protein isolate", "protein concentrate", "textured vegetable protein", "textured soy protein", "textured soya protein", "textured wheat protein", "textured pea protein", "hydrolysed collagen", "hydrolyzed collagen", "collagen peptides", "collagen hydrolysate", "rice protein", "hemp protein", "potato protein", "mung bean protein", "fava bean protein", "faba bean protein", "chickpea protein", "rapeseed protein", "canola protein", "lupin protein", "hydrolysed whey", "hydrolyzed whey", "whey protein hydrolysate", "wheat gluten", "vital wheat gluten", "mycoprotein", "broad bean protein", "fusarium venenatum biomass", "hemp seed protein", "lupine protein", "mpc", "mpi", "seitan flour", "soy protein", "soya protein", "pea protein"], eNumbers: [],
    category: "protein", function: "Protein fortification / meat-like texture",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    regulatory: "Food ingredients, not additives; soy, milk and wheat sources are declarable allergens",
    populations: ["soy, milk or wheat allergy, depending on source"],
    note: "Proteins extracted from soy, pea, milk or wheat, or extruded into meat-like pieces. Nutritionally fine, but NOVA lists them as industrial ingredients that mark a food as ultra-processed.",
    ref: "Monteiro et al. 2019, NOVA classification (Public Health Nutr 22:936)",
  },
  {
    id: "processed-meat", name: "Processed Meat (cured, smoked or salted)",
    keywords: ["bacon", "ham", "salami", "pepperoni", "chorizo", "sausage", "sausages", "frankfurter", "frankfurters", "wiener", "prosciutto", "pancetta", "pastrami", "corned beef", "mortadella", "bresaola", "luncheon meat", "spam", "jerky", "biltong", "nduja", "kabanos", "kielbasa", "gammon", "lardons", "black pudding", "blood sausage", "andouille", "saucisson", "cured meat", "cured pork", "smoked meat", "processed meat", "chicken sausage", "chicken salami", "pork sausage", "rashers", "jamón serrano", "jamon serrano", "jamón ibérico", "jamon iberico", "guanciale", "salame", "chouriço", "chourico", "bangers", "baloney", "polony", "droëwors", "droewors", "n'duja", "cabanossi", "blood pudding", "morcilla", "boudin noir", "salt beef", "bully beef"], eNumbers: [],
    category: "protein", function: "Cured, smoked or salted meat",
    dominant: "HIGH", moderate: "MEDIUM", trace: "LOW", evidence: "STRONG",
    regulatory: "Food; IARC Group 1 carcinogen (colorectal cancer)",
    populations: ["anyone eating it daily; colorectal cancer risk rises ~18% per 50 g/day"],
    note: "Meat transformed by salting, curing, fermentation or smoking. IARC classifies processed meat as carcinogenic to humans (Group 1): each 50 g eaten daily raises colorectal cancer risk by about 18%. Usually also high in salt and often cured with nitrite.",
    ref: "IARC Monographs Vol. 114 (2018), Red Meat and Processed Meat; Bouvard et al. 2015, Lancet Oncol 16:1599",
  },
  // ── Expansion 2026-10 batch 01: leftover and non-EU additives ──
  {
    id: "ethoxyquin", name: "Ethoxyquin (INS 324)", keywords: ["ethoxyquin", "ethoxyquine", "6-ethoxy-1,2-dihydro-2,2,4-trimethylquinoline"], eNumbers: ["e324"],
    category: "antioxidant", function: "Antioxidant for spice colour (paprika, chilli) and animal feed",
    dominant: "MEDIUM", moderate: "MEDIUM", trace: "LOW", evidence: "LIMITED",
    regulatory: "FDA permits it in paprika/chilli powder (21 CFR 172.140); not an authorised food additive in the EU, where its feed authorisation was suspended in 2017",
    note: "A synthetic antioxidant that keeps ground chilli and paprika red. The EU suspended it in animal feed (Reg. 2017/962) because EFSA could not rule out that p-phenetidine, a production impurity and possible mutagen, was present, and data gaps remained. Direct food exposure is small, but the safety dossier is incomplete.",
    ref: "21 CFR 172.140; Commission Implementing Regulation (EU) 2017/962; EFSA FEEDAP Panel 2015 opinion on ethoxyquin",
  },
  {
    id: "sodium-stearyl-fumarate", name: "Sodium Stearyl Fumarate", keywords: ["sodium stearyl fumarate", "ssf"], eNumbers: [],
    category: "anti-caking agent", function: "Tablet lubricant / dough conditioner",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "LIMITED",
    regulatory: "FDA food additive (21 CFR 172.826) in yeast-leavened bakery and processed cereals; not an EU food additive",
    note: "Mainly a lubricant that stops supplement tablets sticking to presses. It breaks down to stearyl alcohol and fumaric acid, both ordinary metabolites. Modern food-safety data are sparse, but use levels are tiny.",
    ref: "21 CFR 172.826",
  },
  {
    id: "olestra", name: "Olestra (sucrose polyester)", keywords: ["olestra", "olean", "sucrose polyester", "sucrose polyesters"], eNumbers: [],
    category: "fat", function: "Non-digestible fat substitute in savoury snacks",
    dominant: "MEDIUM", moderate: "MEDIUM", trace: "LOW", evidence: "MODERATE",
    regulatory: "FDA-approved for savoury snacks (21 CFR 172.867); foods must be fortified with vitamins A, D, E and K; not authorised in the EU or Canada",
    populations: ["children", "people with bowel disorders"],
    note: "Sucrose esterified with 6 to 8 fatty acids, too big to digest, so it adds no calories. It can cause cramping and loose stools, and it carries fat-soluble vitamins and carotenoids out of the gut, which is why the FDA requires added vitamins A, D, E and K. The on-pack warning was dropped in 2003.",
    ref: "FDA final rule on olestra, Federal Register 1996; 21 CFR 172.867",
  },
  {
    id: "docusate-sodium", name: "Dioctyl Sodium Sulfosuccinate (docusate)", keywords: ["dioctyl sodium sulfosuccinate", "sodium dioctyl sulfosuccinate", "docusate sodium", "docusate", "dss"], eNumbers: [],
    category: "emulsifier", function: "Wetting agent / solubiliser in drink mixes and cocoa",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "LIMITED",
    regulatory: "FDA food additive (21 CFR 172.810) at low levels; not an EU food additive; also an over-the-counter stool softener",
    note: "A surfactant that helps powders dissolve. At drug doses it is a stool softener, which is the main effect to expect if intake were high. Food use levels are far below laxative doses.",
    ref: "21 CFR 172.810",
  },
  {
    id: "sodium-lauryl-sulfate", name: "Sodium Lauryl Sulfate", keywords: ["sodium lauryl sulfate", "sodium lauryl sulphate", "sodium dodecyl sulfate", "sodium dodecyl sulphate", "sls"], eNumbers: ["e487"],
    category: "emulsifier", function: "Whipping aid for egg whites; wetting agent",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "LIMITED",
    regulatory: "FDA food additive (21 CFR 172.822) at low levels (e.g. 1000 ppm in dried egg whites); not an EU food additive",
    note: "A detergent best known from toothpaste. In food it is a minor whipping aid. It irritates skin and mucosa at high concentration, but food levels are low and it is metabolised like a fatty alcohol.",
    ref: "21 CFR 172.822",
  },
  {
    id: "castor-oil", name: "Castor Oil (E1503)", keywords: ["castor oil", "ricinus oil"], eNumbers: ["e1503"],
    category: "glazing agent", function: "Release agent / carrier / anti-sticking agent",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "0–0.7 mg/kg bw/day (JECFA)",
    regulatory: "FDA food additive (21 CFR 172.876) as release agent; EU-listed as E1503 for limited uses",
    populations: ["pregnancy (stimulant laxative)"],
    note: "Used in tiny amounts so sweets and supplements don't stick. Its ricinoleic acid is a stimulant laxative at teaspoon doses, which is why the ADI is low. Refined castor oil contains no ricin.",
    ref: "JECFA evaluation of castor oil; 21 CFR 172.876",
  },
  {
    id: "zein", name: "Zein (corn protein glaze)", keywords: ["zein", "corn protein glaze"], eNumbers: [],
    category: "glazing agent", function: "Glaze / coating for sweets, nuts and tablets",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    regulatory: "FDA GRAS-affirmed (21 CFR 184.1984)",
    note: "The main storage protein of maize, used as a vegan alternative to shellac glaze. It is an ordinary food protein and digested as such.",
    ref: "21 CFR 184.1984",
  },
  {
    id: "alitame", name: "Alitame (INS 956)", keywords: ["alitame", "aclame"], eNumbers: ["e956"],
    category: "sweetener", function: "High-intensity sweetener (~2000x sugar)",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "LIMITED",
    adi: "0–1 mg/kg bw/day (JECFA 1996)",
    regulatory: "Permitted in Australia/NZ, China and some other markets; not authorised in the EU or US",
    note: "A dipeptide sweetener made from aspartic acid and alanine. JECFA set an ADI after animal studies showed liver weight increases at high doses. It is rarely used, and fewer regulators have reviewed it than aspartame or sucralose.",
    ref: "JECFA 46th meeting (1996), alitame",
  },
  // ── Expansion 2026-10 batch 02: processing aids ──
  {
    id: "tannic-acid", name: "Tannic Acid (tannins)", keywords: ["tannic acid", "tannins", "gallotannin", "food-grade tannin", "food grade tannin"], eNumbers: ["e181"],
    category: "flavour", function: "Clarifying agent for beer/wine/juice; astringent flavouring",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    regulatory: "FDA GRAS (21 CFR 184.1097); EU-authorised wine/beer processing aid",
    note: "Plant polyphenols that bind proteins, so they are used to clear haze from drinks and add astringency. At very high intake they reduce iron absorption and irritate the gut, but use levels are small and much of the tannin is removed with the haze.",
    ref: "21 CFR 184.1097",
  },
  {
    id: "antimicrobial-washes", name: "Antimicrobial Wash & Sterilant Agents (peroxide, ozone, hypochlorite, peracetic acid)",
    keywords: ["hydrogen peroxide", "ozone", "ozonated", "sodium hypochlorite", "chlorine wash", "chlorinated water", "peracetic acid", "peroxyacetic acid", "bleach (food-grade)", "h2o2", "o3", "paa", "peroxide (processing aid)"], eNumbers: [],
    category: "preservative", function: "Processing aid: disinfects produce, carcasses, packaging or milk",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    regulatory: "FDA permits specified uses (21 CFR 173.368 ozone, 184.1366 hydrogen peroxide, 173.315 wash chemicals); EU restricts pathogen-reduction treatments of meat",
    populations: ["infants and young children (chlorate residues from chlorinated water)"],
    note: "Oxidisers that kill microbes on food surfaces and packaging, then break down to water, oxygen, acetic acid or salt. The main residue question is chlorate and other by-products from chlorine washes, which EFSA linked to iodine-uptake inhibition at high chronic exposure, chiefly for infants.",
    ref: "EFSA CONTAM Panel 2015, risks for public health related to the presence of chlorate in food; 21 CFR 173.368, 184.1366",
  },
  {
    id: "chitosan", name: "Chitosan", keywords: ["chitosan", "deacetylated chitin"], eNumbers: [],
    category: "thickener", function: "Fining agent for wine/juice; dietary fibre in supplements",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    regulatory: "EU wine processing aid (fungal chitosan); EFSA-backed claim for maintaining normal LDL cholesterol at 3 g/day",
    populations: ["crustacean allergy (shellfish-derived chitosan)"],
    note: "A fibre made from crustacean shells or fungal cell walls. It clears wine and juice and, in supplements at 3 g/day, helps maintain normal LDL cholesterol. It can bind fat-soluble vitamins at high intake.",
    ref: "EFSA NDA Panel 2011 opinion on chitosan and maintenance of normal blood LDL-cholesterol",
  },
  // ── Expansion 2026-10 batch 03: solvents, non-EU colours, flavour principles ──
  {
    id: "extraction-solvents",
    name: "Extraction Solvents (hexane, acetone, methanol, methyl acetate…)",
    keywords: ["hexane", "n-hexane", "cyclohexane", "acetone", "methyl acetate", "methyl ethyl ketone", "ethyl methyl ketone", "butanone", "methanol", "methyl alcohol", "isopropyl alcohol", "isopropanol", "propan-2-ol", "diethyl ether", "extraction solvent", "methyl ethanoate", "2-propanol", "dimethyl ketone", "ether (solvent)", "ethyl ether", "hexahydrobenzene", "mek", "propanone", "wood alcohol"],
    eNumbers: [],
    category: "processing aid",
    function: "Extracts oils, flavours, caffeine or colours; evaporated off",
    dominant: "LOW",
    moderate: "LOW",
    trace: "LOW",
    evidence: "MODERATE",
    regulatory: "EU Directive 2009/32/EC sets permitted solvents and residue limits; FDA residue limits in 21 CFR 173 (e.g. 173.270 hexane, 173.210 acetone)",
    note: "Solvents used to pull oil from seeds, decaffeinate coffee or make spice oleoresins. They are removed by evaporation and only trace residues within legal limits remain. Their hazards (hexane neurotoxicity, methanol toxicity) apply at occupational or poisoning doses, not food residues.",
    ref: "Directive 2009/32/EC Annex I; 21 CFR 173 Subpart C",
  },
  {
    id: "dichloromethane",
    name: "Dichloromethane (methylene chloride)",
    keywords: ["dichloromethane", "methylene chloride", "dcm"],
    eNumbers: [],
    category: "processing aid",
    function: "Decaffeination and spice-oleoresin extraction solvent",
    dominant: "MEDIUM",
    moderate: "MEDIUM",
    trace: "MEDIUM",
    evidence: "MODERATE",
    regulatory: "EU residue limits 2 mg/kg roasted coffee, 5 mg/kg tea (Dir. 2009/32/EC); FDA 10 ppm in decaffeinated coffee (21 CFR 173.255); IARC Group 2A",
    populations: ["pregnancy (precautionary)"],
    note: "A chlorinated solvent IARC classifies as probably carcinogenic to humans (Group 2A), mainly from occupational and animal data. Decaf residues are small and within legal limits, but because it is a carcinogen by classification and water or CO2 processes exist, it carries a residual concern. The US EPA banned most consumer and commercial uses in 2024.",
    ref: "IARC Monographs Vol. 110 (dichloromethane, Group 2A); Directive 2009/32/EC; 21 CFR 173.255",
  },
  {
    id: "fast-green-fcf",
    name: "Fast Green FCF (FD&C Green 3, E143)",
    keywords: ["fast green fcf", "fast green", "green 3", "fd&c green no. 3", "food green 3"],
    eNumbers: ["e143"],
    category: "coloring",
    function: "Synthetic blue-green dye",
    dominant: "MEDIUM",
    moderate: "MEDIUM",
    trace: "LOW",
    evidence: "LIMITED",
    adi: "0–25 mg/kg bw/day (JECFA)",
    regulatory: "FDA-certified colour (21 CFR 74.203); not authorised in the EU",
    populations: ["children (synthetic-dye hyperactivity concern, unproven for this dye)"],
    note: "A triphenylmethane dye used in mint-green sweets and drinks in the US. It is poorly absorbed. It was not part of the Southampton hyperactivity study, but it is one of the synthetic dyes being phased out of US foods under 2025 FDA policy.",
    ref: "21 CFR 74.203; JECFA evaluation of Fast Green FCF",
  },
  {
    id: "citrus-red-2",
    name: "Citrus Red No. 2",
    keywords: ["citrus red 2", "citrus red no. 2", "citrus red no 2", "solvent red 80"],
    eNumbers: [],
    category: "coloring",
    function: "Dye for orange peel",
    dominant: "HIGH",
    moderate: "HIGH",
    trace: "MEDIUM",
    evidence: "MODERATE",
    regulatory: "FDA permits only on the skins of oranges not intended for processing, ≤2 ppm (21 CFR 74.302); IARC Group 2B; not permitted in the EU",
    note: "An azo dye sprayed on some Florida orange peels. IARC classes it as possibly carcinogenic (Group 2B) from bladder tumours in animals. Flesh exposure is minimal, but zesting or candying peel delivers it directly.",
    ref: "IARC Monographs Vol. 8 & Suppl. 7 (Citrus Red No. 2, Group 2B); 21 CFR 74.302",
  },
  {
    id: "gardenia-blue",
    name: "Gardenia Blue (genipin-glycine blue)",
    keywords: ["gardenia blue", "genipin", "gardenia jasminoides blue", "genipin-glycine blue"],
    eNumbers: [],
    category: "coloring",
    function: "Plant-derived blue colour",
    dominant: "LOW",
    moderate: "LOW",
    trace: "LOW",
    evidence: "LIMITED",
    regulatory: "FDA-listed colour additive (2023); not an authorised EU food colour",
    note: "Blue pigment made by reacting genipin from gardenia fruit with glycine. Long used in Japan. Fewer independent toxicology studies than for established colours, though no adverse findings at use levels have been reported.",
    ref: "FDA 2023 colour additive listing for gardenia (genipin-glycine) blue",
  },
  {
    id: "butterfly-pea-extract",
    name: "Butterfly Pea Flower Extract",
    keywords: ["butterfly pea", "clitoria ternatea", "blue pea flower"],
    eNumbers: [],
    category: "coloring",
    function: "Plant-derived blue/purple colour",
    dominant: "LOW",
    moderate: "LOW",
    trace: "LOW",
    evidence: "LIMITED",
    regulatory: "FDA-listed colour additive exempt from certification (21 CFR 73.69, 2021)",
    note: "Anthocyanin-rich extract of the Clitoria ternatea flower, blue in neutral drinks and purple-pink when acid is added. A traditional tea ingredient in Southeast Asia; formal toxicology is limited but no concerns are reported at colouring levels.",
    ref: "21 CFR 73.69",
  },
  {
    id: "red-yeast-rice",
    name: "Red Yeast Rice / Monascus (monacolins, angkak)",
    keywords: ["red yeast rice", "monascus", "angkak", "red rice koji", "monacolin"],
    eNumbers: [],
    category: "coloring",
    function: "Traditional red colour; cholesterol supplement (monacolin K)",
    dominant: "HIGH",
    moderate: "MEDIUM",
    trace: "LOW",
    evidence: "MODERATE",
    regulatory: "EU limits monacolins to <3 mg per daily portion with mandatory warnings (Reg. (EU) 2022/860); not an authorised EU colour",
    populations: ["pregnancy and breastfeeding", "people taking statins", "children", "adults over 70"],
    note: "Rice fermented with Monascus mould. It colours Chinese foods red and is sold as a 'natural statin' because monacolin K is identical to lovastatin. EFSA could not identify a safe intake: muscle and liver side effects were reported even at 3 mg/day, and the mycotoxin citrinin can be present.",
    ref: "EFSA ANS Panel 2018, scientific opinion on the safety of monacolins in red yeast rice; Reg. (EU) 2022/860",
  },
  {
    id: "restricted-flavour-principles",
    name: "Restricted Flavour Principles (safrole, methyleugenol, estragole, pulegone, thujone…)",
    keywords: ["safrole", "methyleugenol", "methyl eugenol", "estragole", "pulegone", "menthofuran", "thujone", "beta-asarone", "β-asarone", "teucrin a", "1-allyl-4-methoxybenzene", "4-allyl-1,2-dimethoxybenzene", "4-allylanisole", "methyl chavicol", "shikimol"],
    eNumbers: [],
    category: "flavour",
    function: "Naturally occurring flavour constituents of herbs and spices",
    dominant: "HIGH",
    moderate: "HIGH",
    trace: "MEDIUM",
    evidence: "MODERATE",
    regulatory: "May not be added as such to food in the EU; maximum levels apply to foods containing flavourings or herbs (Reg. 1334/2008 Annex III); safrole and methyleugenol IARC Group 2B",
    populations: ["children", "pregnancy"],
    note: "Compounds found in basil, tarragon, fennel, nutmeg, sassafras, pennyroyal, sage and wormwood. Safrole, methyleugenol and estragole are genotoxic carcinogens in rodents; pulegone and menthofuran are liver-toxic; thujone affects the nervous system. Normal herb use gives low exposure; concentrated extracts and essential oils are the concern.",
    ref: "Regulation (EC) 1334/2008 Annex III; IARC Vol. 101 (methyleugenol) and Vol. 10 (safrole); SCF 2001-2002 opinions on estragole, methyleugenol, safrole",
  },
  {
    id: "coumarin",
    name: "Coumarin",
    keywords: ["coumarin", "tonka bean", "tonka", "1,2-benzopyrone"],
    eNumbers: [],
    category: "flavour",
    function: "Sweet hay/vanilla-like flavour constituent (cassia cinnamon, tonka)",
    dominant: "MEDIUM",
    moderate: "MEDIUM",
    trace: "LOW",
    evidence: "STRONG",
    adi: "TDI 0.1 mg/kg bw/day (EFSA 2008)",
    regulatory: "May not be added as such in the EU; maximum levels in cinnamon-containing foods (e.g. 50 mg/kg traditional bakery); banned as a direct additive in the US (21 CFR 189.130)",
    populations: ["children", "people with liver disease"],
    note: "Naturally present in cassia cinnamon and tonka beans. In a sensitive minority it damages the liver. EFSA's TDI of 0.1 mg/kg bw can be exceeded by children eating a lot of cassia-cinnamon foods. Ceylon cinnamon has little coumarin.",
    ref: "EFSA AFC Panel 2008, Coumarin in flavourings and other food ingredients with flavouring properties; 21 CFR 189.130",
  },
  {
    id: "quinine",
    name: "Quinine (tonic water bitterness)",
    keywords: ["quinine", "quinine hydrochloride", "quinine sulphate", "quinine sulfate", "cinchona"],
    eNumbers: [],
    category: "flavour",
    function: "Bitter flavouring in tonic water and bitter lemon",
    dominant: "MEDIUM",
    moderate: "LOW",
    trace: "LOW",
    evidence: "MODERATE",
    regulatory: "FDA ≤83 ppm in carbonated drinks (21 CFR 172.575); EU requires 'contains quinine' labelling (Directive 2002/67/EC)",
    populations: ["pregnancy", "G6PD deficiency", "people with heart-rhythm disorders or on QT-prolonging drugs", "quinine hypersensitivity"],
    note: "The bitter alkaloid of cinchona bark. Tonic water contains far less than antimalarial doses, but rare hypersensitivity reactions (including blood disorders) have been reported even from tonic water, which is why its presence must be declared.",
    ref: "21 CFR 172.575; Commission Directive 2002/67/EC",
  },
  {
    id: "glycyrrhizin",
    name: "Glycyrrhizin / Liquorice Extract (INS 958)",
    keywords: ["glycyrrhizin", "glycyrrhizic acid", "glycyrrhizinic acid", "ammonium glycyrrhizinate", "liquorice extract", "licorice extract", "liquorice root", "licorice root", "liquorice", "licorice", "glycyrrhiza", "monoammonium glycyrrhizinate", "mulethi"],
    eNumbers: ["e958"],
    category: "sweetener",
    function: "Liquorice flavour; sweetener and foaming agent",
    dominant: "MEDIUM",
    moderate: "MEDIUM",
    trace: "LOW",
    evidence: "STRONG",
    adi: "SCF: ≤100 mg glycyrrhizic acid/day for regular consumers (2003)",
    regulatory: "EU requires 'contains liquorice' labelling, plus a warning for people with hypertension at ≥4 g/kg in confectionery or ≥50 mg/L in drinks (Reg. 1169/2011 Annex III)",
    populations: ["hypertension", "pregnancy", "heart or kidney disease", "people on diuretics or digoxin"],
    note: "Glycyrrhizin in liquorice root blocks an enzyme that inactivates cortisol in the kidney. Regular intakes above about 100 mg a day can raise blood pressure and lower potassium. Liquorice sweets and some herbal teas can supply this much.",
    ref: "SCF 2003 opinion on glycyrrhizinic acid; Regulation (EU) 1169/2011 Annex III",
  },
  {
    id: "pungent-extracts",
    name: "Pungent Principles (capsaicin, capsicum oleoresin, piperine)",
    keywords: ["capsaicin", "capsaicinoids", "capsicum oleoresin", "capsicum extract", "oleoresin capsicum", "piperine", "black pepper extract", "bioperine"],
    eNumbers: [],
    category: "flavour",
    function: "Heat/pungency from chilli and pepper",
    dominant: "MEDIUM",
    moderate: "LOW",
    trace: "LOW",
    evidence: "MODERATE",
    regulatory: "Capsaicin may not be added as such in the EU (Reg. 1334/2008 Annex III); chilli and pepper extracts used as flavourings",
    populations: ["children (extreme-heat 'challenge' products)", "gastro-oesophageal reflux"],
    note: "Concentrated chilli or pepper extracts. At culinary levels they are safe. Very concentrated capsaicin products have caused vomiting, chest pain and hospital visits in children, and the SCF could not set a safe upper intake. Piperine in supplements can increase absorption of some medicines.",
    ref: "SCF 2002 opinion on capsaicin; Regulation (EC) 1334/2008 Annex III",
  },
  // ── Expansion 2026-10 batch 04: flavouring substances and essential oils ──
  {
    id: "flavour-chemicals",
    name: "Named Flavouring Substances (menthol, cinnamaldehyde, citral, limonene…)",
    keywords: ["menthol", "l-menthol", "cinnamaldehyde", "cinnamic aldehyde", "eugenol", "limonene", "d-limonene", "citral", "benzaldehyde", "anethole", "trans-anethole", "carvone", "l-carvone", "linalool", "methyl salicylate", "wintergreen oil", "oil of wintergreen", "eucalyptol", "1,8-cineole", "cineole", "4-allyl-2-methoxyphenol", "anise camphor", "artificial almond", "cinnamal", "coriandrol", "geranial", "lemonal", "linalol"],
    eNumbers: [],
    category: "flavour",
    function: "Flavouring substance",
    dominant: "LOW",
    moderate: "LOW",
    trace: "LOW",
    evidence: "MODERATE",
    regulatory: "Listed on the EU Union list of flavourings (Reg. (EU) 872/2012); evaluated by JECFA as flavouring agents; FDA permits under 21 CFR 172.515 or GRAS",
    populations: ["salicylate-sensitive people and young children (methyl salicylate)", "skin-sensitised people (cinnamaldehyde, citral, eugenol)"],
    note: "Single aroma chemicals, from natural sources or synthesised, used to give mint, cinnamon, clove, citrus, almond, anise or wintergreen notes. At flavouring levels JECFA and EFSA found no safety concern. Several are skin sensitisers, and methyl salicylate (oil of wintergreen) is toxic to small children in concentrated form.",
    ref: "Commission Implementing Regulation (EU) 872/2012 (Union list of flavourings); JECFA flavouring-agent evaluations",
  },
  {
    id: "essential-oils",
    name: "Essential Oils & Natural Extracts (peppermint, citrus, clove, cinnamon, bitter almond…)",
    keywords: ["peppermint oil", "spearmint oil", "mint oil", "orange oil", "sweet orange oil", "lemon oil", "lime oil", "bergamot oil", "grapefruit oil", "mandarin oil", "clove oil", "clove bud oil", "cinnamon oil", "cinnamon bark oil", "cinnamon leaf oil", "cassia oil", "bitter almond oil", "almond essence", "eucalyptus oil", "anise oil", "aniseed oil", "star anise oil", "cardamom oil", "essential oil", "citrus bergamia oil", "eucalyptus globulus oil", "lemon peel oil", "lime peel oil", "mentha piperita oil", "mentha spicata oil", "oil of bitter almond", "orange peel oil", "syzygium aromaticum oil"],
    eNumbers: [],
    category: "flavour",
    function: "Natural flavouring from distilled or pressed plant oils",
    dominant: "MEDIUM",
    moderate: "LOW",
    trace: "LOW",
    evidence: "MODERATE",
    regulatory: "Natural flavourings under Reg. (EC) 1334/2008; FDA GRAS (21 CFR 182.20); maximum levels apply to restricted constituents (pulegone, estragole, coumarin, HCN)",
    populations: ["children (concentrated oils are toxic if swallowed neat)", "people with citrus or mint allergy"],
    note: "Concentrated aroma oils used in drops. At flavouring levels they are safe. Neat oils are potent: some carry restricted constituents (pulegone in mint, coumarin in cassia, hydrogen cyanide in unrectified bitter almond), and bergamot oil contains phototoxic furocoumarins. Dominant use (e.g. oil-based sweets) is unusual and merits caution.",
    ref: "Regulation (EC) 1334/2008 Annex III; 21 CFR 182.20",
  },
  // ── Expansion 2026-10 batch 07: amino acids, nucleotides, omega-3, supplement nutrients ──
  {
    id: "added-amino-acids",
    name: "Added Amino Acids & Nucleotides (BCAA, creatine, theanine, formula nucleotides)",
    keywords: ["l-leucine", "l-isoleucine", "l-valine", "l-lysine", "lysine hydrochloride", "l-lysine hydrochloride", "l-methionine", "dl-methionine", "l-threonine", "l-tryptophan", "l-phenylalanine", "l-histidine", "l-arginine", "arginine alpha-ketoglutarate", "l-glutamine", "l-alanine", "beta-alanine", "β-alanine", "l-aspartic acid", "l-cystine", "l-proline", "l-serine", "l-tyrosine", "l-citrulline", "citrulline malate", "l-ornithine", "branched-chain amino acids", "branched chain amino acids", "bcaa", "creatine monohydrate", "creatine", "gamma-aminobutyric acid", "gaba", "l-theanine", "theanine", "cytidine 5'-monophosphate", "cytidine monophosphate", "uridine 5'-monophosphate", "uridine monophosphate", "disodium uridine", "adenosine 5'-monophosphate", "adenosine monophosphate", "nucleotides", "aakg", "alanine", "amp", "arginine", "aspartate", "aspartic acid", "bcaas", "carnosyn", "citrulline", "cmp", "cystine", "gamma aminobutyric acid", "glutamine", "histidine", "isoleucine", "leucine", "lysine hcl", "methionine", "ornithine", "ornithine aspartate", "phenylalanine", "proline", "serine", "threonine", "tryptophan", "tyrosine", "ump", "valine", "branched-chain amino acid", "branched chain amino acid"],
    eNumbers: ["e641", "e642"],
    category: "nutrient",
    function: "Protein building blocks / sports and infant-formula nutrients",
    dominant: "LOW",
    moderate: "LOW",
    trace: "LOW",
    evidence: "MODERATE",
    regulatory: "Amino acids permitted in foods for specific groups and supplements; nucleotides permitted in infant formula (Reg. (EU) 2016/127); no ULs set for most amino acids (IOM 2005)",
    populations: ["phenylketonuria (phenylalanine)", "people on MAO inhibitors or serotonergic drugs (tryptophan)"],
    note: "Isolated amino acids and nucleotides used in sports drinks, protein products, supplements and infant formula. They are normal food constituents. No upper limits are set for most; single amino acids at very high doses can unbalance metabolism. A 1989 epidemic of eosinophilia-myalgia was traced to a contaminated batch of L-tryptophan, not to tryptophan itself.",
    ref: "Institute of Medicine 2005, Dietary Reference Intakes for Energy, Carbohydrate, Fiber, Fat, Fatty Acids, Cholesterol, Protein, and Amino Acids",
  },
  {
    id: "omega-3-oils",
    name: "Omega-3 Oils & Fatty Acids (fish, krill, algal oil, DHA, EPA)",
    keywords: ["fish oil", "refined fish oil", "krill oil", "algal oil", "algae oil", "schizochytrium oil", "cod liver oil", "docosahexaenoic acid", "eicosapentaenoic acid", "omega-3 fatty acids", "omega 3 fatty acids", "omega-3 concentrate", "dha-rich oil", "dha algal oil", "cod-liver oil", "dha", "epa", "euphausia superba oil"],
    eNumbers: [],
    category: "fat",
    function: "Source of long-chain omega-3 fatty acids",
    dominant: "LOW",
    moderate: "LOW",
    trace: "LOW",
    evidence: "STRONG",
    regulatory: "EU-authorised claims for EPA+DHA and heart function (250 mg/day); EFSA: supplemental EPA+DHA up to 5 g/day raises no safety concern",
    populations: ["fish or crustacean allergy (source-dependent)", "pregnancy (cod liver oil: vitamin A content)", "people on anticoagulants at high doses"],
    note: "Oils rich in EPA and DHA, the long-chain omega-3 fats found in oily fish. They support normal heart, brain and vision function. EFSA found no safety concern up to 5 g/day of supplemental EPA+DHA. Cod liver oil also contains preformed vitamin A, which is limited in pregnancy.",
    ref: "EFSA NDA Panel 2012, Scientific Opinion on the Tolerable Upper Intake Level of EPA, DHA and DPA",
  },
  {
    id: "coenzyme-q10",
    name: "Coenzyme Q10 (ubiquinone)",
    keywords: ["coenzyme q10", "co-enzyme q10", "coq10", "ubiquinone", "ubidecarenone", "ubiquinol"],
    eNumbers: [],
    category: "nutrient",
    function: "Supplement ingredient",
    dominant: "LOW",
    moderate: "LOW",
    trace: "LOW",
    evidence: "MODERATE",
    regulatory: "Sold as a food supplement; EFSA did not substantiate claimed health effects (2010)",
    populations: ["people on warfarin (may reduce its effect)"],
    note: "A compound the body makes for energy production in mitochondria. Supplements are well tolerated; EFSA found claimed energy, heart and blood-pressure benefits not substantiated in healthy people.",
    ref: "EFSA NDA Panel 2010, health claims related to coenzyme Q10",
  },
  {
    id: "supplement-carotenoids",
    name: "Supplement Carotenoids (astaxanthin, zeaxanthin)",
    keywords: ["astaxanthin", "zeaxanthin", "meso-zeaxanthin", "haematococcus pluvialis"],
    eNumbers: [],
    category: "nutrient",
    function: "Antioxidant pigment in supplements and fish feed",
    dominant: "LOW",
    moderate: "LOW",
    trace: "LOW",
    evidence: "MODERATE",
    regulatory: "Authorised novel foods for supplements with maximum daily amounts (astaxanthin 8 mg/day, EFSA 2020)",
    note: "Red and yellow carotenoid pigments. Astaxanthin gives salmon its colour (via feed) and is sold from Haematococcus algae; zeaxanthin accumulates in the retina. EFSA set safe supplement limits; claimed eye and skin benefits are not authorised.",
    ref: "EFSA NDA Panel 2020, Safety of astaxanthin for its use as a novel food in food supplements",
  },
  // ── Expansion 2026-10 batch 09: prebiotics, fibres, proteins ──
  {
    id: "prebiotic-oligosaccharides",
    name: "Prebiotic Oligosaccharides (HMOs, XOS)",
    keywords: ["2'-fucosyllactose", "2'-o-fucosyllactose", "2'-fl", "3-fucosyllactose", "lacto-n-neotetraose", "lacto-n-tetraose", "6'-sialyllactose", "3'-sialyllactose", "human milk oligosaccharides", "human milk oligosaccharide", "xylo-oligosaccharides", "xylooligosaccharides", "xylo-oligosaccharide", "3'-sl", "3-fl", "6'-sl", "lnnt", "lnt", "xos"],
    eNumbers: [],
    category: "nutrient",
    function: "Prebiotic carbohydrates for infant formula and supplements",
    dominant: "LOW",
    moderate: "LOW",
    trace: "LOW",
    evidence: "MODERATE",
    regulatory: "Authorised novel foods in the EU with conditions of use (infant formula, supplements, some foods)",
    note: "Short-chain carbohydrates that resist digestion and feed gut bacteria. Human milk oligosaccharides (HMOs) such as 2'-FL are made by fermentation to mirror breast milk; EFSA found them safe at breast-milk-like levels. XOS come from corn cobs or birch. High intakes can cause wind.",
    ref: "EFSA NDA Panel 2015, safety of 2'-O-fucosyllactose and lacto-N-neotetraose as novel food ingredients; Commission Implementing Regulation (EU) 2017/2470",
  },
  // ── Expansion 2026-10 batch 29: restricted botanicals and areca nut ──
  {
    id: "areca-nut",
    name: "Areca Nut (betel nut, supari)",
    keywords: ["areca nut", "areca", "betel nut", "supari", "pan masala", "paan masala", "arecoline", "areca catechu"],
    eNumbers: [],
    category: "stimulant",
    function: "Chewed stimulant; base of pan masala and mouth fresheners",
    dominant: "CRITICAL",
    moderate: "CRITICAL",
    trace: "CRITICAL",
    evidence: "STRONG",
    regulatory: "IARC Group 1 carcinogen with or without tobacco (Vol. 85, 2004; Vol. 100E, 2012); tobacco and nicotine are prohibited as food ingredients in India (FSS Prohibition and Restrictions on Sales Regulations 2011, 2.3.4)",
    populations: ["everyone", "children", "pregnancy"],
    note: "The seed of the areca palm, chewed alone, in paan or in pan masala and sweetened supari mixes. IARC classes areca nut itself, even without tobacco, as causing oral and oesophageal cancer; it also causes oral submucous fibrosis, a precancerous scarring of the mouth.",
    ref: "IARC Monographs Vol. 85 (2004) Betel-quid and areca-nut chewing; Vol. 100E (2012)",
  },
  {
    id: "ephedra",
    name: "Ephedra (ma huang)",
    keywords: ["ephedra", "ma huang", "ephedrine", "ephedra sinica", "ephedrine alkaloids"],
    eNumbers: [],
    category: "stimulant",
    function: "Herbal stimulant formerly sold in weight-loss and sports supplements",
    dominant: "CRITICAL",
    moderate: "CRITICAL",
    trace: "CRITICAL",
    evidence: "STRONG",
    regulatory: "Prohibited in food in the EU (Reg. 1925/2006 Annex III Part A, added by Reg. (EU) 2015/403); dietary supplements containing ephedrine alkaloids banned by the FDA (2004)",
    populations: ["everyone", "people with heart disease or high blood pressure"],
    note: "Ephedra herb contains ephedrine, an amphetamine-like stimulant. Supplements were linked to strokes, heart attacks, arrhythmias and deaths, which led the FDA to ban them in 2004. The EU prohibits the herb and its preparations in food.",
    ref: "FDA final rule declaring dietary supplements containing ephedrine alkaloids adulterated (69 FR 6788, 2004); Commission Regulation (EU) 2015/403",
  },
  {
    id: "yohimbe",
    name: "Yohimbe Bark (yohimbine)",
    keywords: ["yohimbe", "yohimbine", "yohimbe bark", "pausinystalia yohimbe", "corynanthe yohimbe"],
    eNumbers: [],
    category: "stimulant",
    function: "Bark extract sold in libido and fat-burner supplements",
    dominant: "CRITICAL",
    moderate: "CRITICAL",
    trace: "CRITICAL",
    evidence: "MODERATE",
    regulatory: "Prohibited in food in the EU (Reg. 1925/2006 Annex III Part A, added by Reg. (EU) 2019/650)",
    populations: ["everyone", "people with heart disease, anxiety or high blood pressure"],
    note: "Yohimbine raises blood pressure and heart rate and can cause anxiety and arrhythmias. EFSA could not establish a safe intake and found supplement labels poorly reflect actual yohimbine content; the EU then banned yohimbe bark and its preparations in food.",
    ref: "EFSA ANS Panel 2013, Scientific Opinion on the evaluation of the safety in use of Yohimbe; Commission Regulation (EU) 2019/650",
  },
  {
    id: "aloe-emodin-hads",
    name: "Aloe-emodin, Emodin, Danthron & Aloe Latex",
    keywords: ["aloe-emodin", "aloe emodin", "emodin", "danthron", "dantron", "aloin", "aloe latex", "aloe leaf latex"],
    eNumbers: [],
    category: "processing aid",
    function: "Stimulant-laxative anthranoids in aloe latex and some 'detox' products",
    dominant: "CRITICAL",
    moderate: "CRITICAL",
    trace: "CRITICAL",
    evidence: "MODERATE",
    regulatory: "Prohibited in food in the EU (Reg. 1925/2006 Annex III Part A, added by Reg. (EU) 2021/468); danthron IARC Group 2B",
    populations: ["everyone", "pregnancy", "children"],
    note: "Hydroxyanthracene derivatives from the yellow latex under aloe leaf skin and some other plants. EFSA found aloe-emodin, emodin and danthron genotoxic and aloe extracts carcinogenic in rats, and could not set a safe intake. Decolourised inner-leaf aloe vera gel is a different product.",
    ref: "EFSA ANS Panel 2018, Safety of hydroxyanthracene derivatives for use in food (EFSA Journal 16(1):5090); Commission Regulation (EU) 2021/468; IARC Vol. 50 (danthron)",
  },
  {
    id: "anthranoid-laxative-herbs",
    name: "Senna, Cascara, Frangula & Rhubarb Root",
    keywords: ["senna", "senna leaf", "senna pods", "cassia senna", "sennosides", "cascara", "cascara sagrada", "rhamnus purshiana", "frangula", "frangula bark", "rhamnus frangula", "buckthorn bark", "alder buckthorn", "rhubarb root", "rheum palmatum", "rheum officinale"],
    eNumbers: [],
    category: "processing aid",
    function: "Stimulant-laxative herbs in 'detox', 'slimming' and laxative teas",
    dominant: "HIGH",
    moderate: "HIGH",
    trace: "MEDIUM",
    evidence: "MODERATE",
    regulatory: "Under EU scrutiny in food (Reg. 1925/2006 Annex III Part C, added by Reg. (EU) 2021/468); authorised only as short-term herbal medicines",
    populations: ["pregnancy", "children", "people with bowel disease"],
    note: "Herbs whose hydroxyanthracene glycosides (such as sennosides) irritate the bowel. Fine as a short medicinal course, but daily 'detox' tea use causes diarrhoea, potassium loss and dependence. EFSA could not set a safe intake because some anthranoids are genotoxic.",
    ref: "EFSA ANS Panel 2018, Safety of hydroxyanthracene derivatives for use in food; Commission Regulation (EU) 2021/468",
  },
  {
    id: "dehydroacetic-acid", name: "Dehydroacetic Acid & Sodium Dehydroacetate (INS 265/266)",
    keywords: ["dehydroacetic acid", "sodium dehydroacetate", "dehydroacetate"], eNumbers: ["e265", "e266"],
    category: "preservative", function: "Antifungal preservative",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "LIMITED",
    regulatory: "FDA: cut or peeled squash only, ≤65 ppm residue (21 CFR 172.130); not authorised as a food additive in the EU or Australia/NZ",
    note: "A synthetic pyrone preservative, unrelated to vinegar despite the name. The US permits it only on cut squash at trace residue levels; the EU never authorised it for food.",
    ref: "21 CFR 172.130",
  },
  {
    id: "curdlan", name: "Curdlan (INS 424)", keywords: ["curdlan"], eNumbers: ["e424"],
    category: "thickener", function: "Heat-set gelling agent",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "MODERATE",
    adi: "Not specified (JECFA 2001)",
    regulatory: "FDA food additive (21 CFR 172.809); JECFA ADI not specified; not authorised in the EU",
    note: "A fermentation-made glucose polymer (β-1,3-glucan) that forms a firm gel when heated, used in noodles, tofu and meat analogues. It is largely indigestible, behaving like fibre.",
    ref: "JECFA 57th meeting (2001); 21 CFR 172.809",
  },
];

// Whole-food / unprocessed markers → NOVA group 1 signal (positive).
export const WHOLEFOOD_KEYWORDS = [
  "water", "oats", "rolled oats", "whole wheat", "whole grain", "brown rice", "quinoa",
  "almond", "peanut", "cashew", "walnut", "milk", "egg", "tomato", "potato", "onion",
  "garlic", "spinach", "carrot", "apple", "banana", "chickpea", "lentil", "bean",
  "olive oil", "honey", "yogurt", "chicken", "beef", "fish", "salt", "sodium chloride", "black pepper",
  "butter", "ghee", "cream", "vinegar", "tomato paste", "tomato puree",
  "garlic powder", "onion powder", "lemon juice", "tamarind",
  "turmeric", "cardamom", "cinnamon", "ginger", "cumin", "coriander", "clove", "nutmeg", "vanilla", "cocoa",
  "flaxseed", "linseed", "chia seed", "millet", "sorghum", "buckwheat", "fenugreek", "mustard seed",
  "chilli", "chili", "paprika", "asafoetida", "besan", "gram flour", "curry leaves",
  "live cultures", "live and active cultures", "active cultures", "yoghurt cultures", "starter culture", "probiotic culture", "lactobacillus", "lacticaseibacillus", "lactiplantibacillus", "limosilactobacillus", "ligilactobacillus", "bifidobacterium", "bifidus", "streptococcus thermophilus", "lactococcus lactis", "leuconostoc", "pediococcus", "propionibacterium", "saccharomyces boulardii", "bacillus coagulans", "weizmannia coagulans", "bacillus subtilis", "penicillium roqueforti", "penicillium camemberti", "penicillium candidum", "aspergillus oryzae", "koji", "kefir grains", "kombucha culture", "scoby",
];

// Named whole foods, matched as whole words (plural-tolerant) so short names such as
// "sage" or "date" can't fire inside "sausage" or "updated".
export const WHOLEFOOD_WORDS: string[] = [
  "mace", "anise", "saunf", "laung", "jeera", "kesar", "ajowan", "ajwain", "aniseed", "nigella", "javitri", "cayenne", "jaiphal", "caraway", "saffron", "kalonji", "pippali", "pimentón", "allspice", "pimenton", "dill seed", "khus khus", "khas khas", "methi dana", "poppy seed", "methi seeds", "fennel seed", "celery seed", "carom seeds", "carum carvi", "long pepper", "badi elaichi", "white pepper", "piper longum", "chakra phool", "bishop's weed", "juniper berry", "dhania powder", "jamaica pepper", "illicium verum", "crocus sativus", "juniper berries", "amomum subulatum", "red pepper flakes", "pimpinella anisum", "white peppercorns", "green peppercorns", "juniperus communis", "crushed red pepper", "green pepper berries",
  "lc1", "lgg", "kōji", "bb-12", "kewda", "b. breve", "l. casei", "l. lactis", "b. lactis", "gulab jal", "b. longum", "a. oryzae", "l. gasseri", "l. reuteri", "b. bifidum", "ganedenbc30", "acidophilus", "white mould", "b. infantis", "l. fermentum", "l. paracasei", "l. rhamnosus", "l. johnsonii", "l. plantarum", "s. boulardii", "p. roqueforti", "l. salivarius", "kefir culture", "p. camemberti", "kewra essence", "l. bulgaricus", "l. helveticus", "natto bacteria", "s. thermophilus", "blue cheese mould", "pandanus odorifer", "heyndrickxia coagulans",
  "hing", "dill", "sage", "adrak", "basil", "methi", "thyme", "pudina", "chives", "wasabi", "saunth", "oregano", "chervil", "parsley", "marjoram", "cilantro", "bay leaf", "estragon", "rosemary", "tarragon", "lal mirch", "asafetida", "spearmint", "kadi patta", "fresh mint", "dried mint", "lemongrass", "curry leaf", "bay leaves", "kari patta", "hara dhania", "horseradish", "mint leaves", "lemon grass", "laurel leaf", "curry powder", "pumpkin spice", "dhania leaves", "mentha spicata", "laurus nobilis", "peppermint leaf", "thymus vulgaris", "mentha piperita", "dried peppermint", "murraya koenigii", "origanum vulgare", "citronella grass", "wasabia japonica", "eutrema japonicum", "pumpkin pie spice", "origanum majorana", "poultry seasoning", "peppermint leaves", "anethum graveolens", "salvia officinalis", "armoracia rusticana", "zingiber officinale", "cymbopogon citratus", "ferula assa-foetida", "allium schoenoprasum", "petroselinum crispum", "peppermint tea leaves", "artemisia dracunculus", "anthriscus cerefolium", "rosmarinus officinalis",
  "plum", "pear", "lime", "grape", "prune", "peach", "lemon", "orange", "damson", "cherry", "raisin", "apricot", "sultana", "satsuma", "cherries", "mandarin", "craisins", "tangerine", "raspberry", "cranberry", "nectarine", "greengage", "blueberry", "grapefruit", "strawberry", "blackberry", "clementine", "cranberries", "blueberries", "raspberries", "blackberries", "strawberries", "dried currants", "zante currants", "bramble berries", "citrus reticulata",
  "fig", "kiwi", "kaki", "amla", "aonla", "olive", "guava", "chiku", "jamun", "mango", "durian", "papita", "papaya", "longan", "chikoo", "anjeer", "kathal", "amrood", "loquat", "pawpaw", "lychee", "quince", "litchi", "sapota", "cumquat", "khajoor", "kamrakh", "kumquat", "coconut", "rhubarb", "avocado", "anardana", "mulberry", "plantain", "rambutan", "jambolan", "sweetsop", "sitaphal", "maracuja", "carambola", "starfruit", "naseberry", "persimmon", "jackfruit", "muskmelon", "membrillo", "sapodilla", "rockmelon", "kiwifruit", "elderberry", "breadfruit", "cantaloupe", "redcurrant", "gooseberry", "mangosteen", "granadilla", "mulberries", "star fruit", "pomegranate", "red currant", "gooseberries", "ribes nigrum", "passionfruit", "ribes rubrum", "blackcurrant", "sharon fruit", "elderberries", "black currant", "passion fruit", "japanese medlar", "annona squamosa", "ribes uva-crispa", "dragon eye fruit", "charentais melon", "garcinia mangostana", "phyllanthus emblica", "sambucus nigra berries",
  "dates", "date paste",
  "yam", "yuca", "okra", "pyaz", "gobi", "kale", "taro", "aloo", "arbi", "leek", "eddoe", "neeps", "palak", "swede", "suran", "mooli", "kaddu", "beets", "turnip", "fennel", "lehsun", "celery", "rocket", "bhindi", "kheera", "radish", "rucola", "kumara", "manioc", "daikon", "parsnip", "baingan", "cabbage", "cassava", "brinjal", "lettuce", "shalgam", "pumpkin", "shallot", "dasheen", "arugula", "roquette", "red beet", "cucumber", "scallion", "beetroot", "rutabaga", "jalapeño", "jalapeno", "capsicum", "zucchini", "broccoli", "dioscorea", "courgette", "chukandar", "asparagus", "colocasia", "aubergine", "calabrese", "finocchio", "artichoke", "little gem", "red pepper", "hari mirch", "shakarkandi", "cauliflower", "cavolo nero", "bell pepper", "mixed leaves", "tapioca root", "green pepper", "sweet pepper", "shimla mirch", "yellow pepper", "lady's finger", "summer squash", "winter squash", "brussels sprout", "ladies' fingers", "apium graveolens", "nasturtium officinale",
  "peas", "tori", "lauki", "ghiya", "turai", "dodka", "chard", "luffa", "nadru", "petha", "matar", "caper", "makai", "karela", "doodhi", "kimchi", "sarson", "chocho", "padwal", "wombok", "jicama", "sahjan", "parwal", "renkon", "parval", "gherkin", "witloof", "alfalfa", "passata", "collard", "kimchee", "moringa", "chaulai", "chayote", "gai choy", "bok choi", "bok choy", "mirliton", "snow pea", "pak choi", "lal saag", "sunchoke", "pak choy", "kohlrabi", "calabash", "celeriac", "kohl rabi", "sweetcorn", "ash gourd", "mangetout", "drumstick", "thotakura", "chichinda", "wax gourd", "knol-khol", "tomatillo", "baby corn", "cornichons", "sweet corn", "silverbeet", "lotus stem", "opo squash", "sauerkraut", "lotus root", "ridge gourd", "petits pois", "white gourd", "kamal kakdi", "snake gourd", "murungakkai", "topinambour", "gawar phali", "christophene", "red amaranth", "corn kernels", "chinese leaf", "bitter gourd", "winter melon", "bamboo shoot", "bottle gourd", "bitter melon", "pointed gourd", "moong sprouts", "belgian endive", "mustard leaves", "mustard greens", "chicory leaves", "haricots verts", "corn on the cob", "lucerne sprouts", "belgian chicory", "amaranth leaves", "eleocharis dulcis", "benincasa hispida", "pachyrhizus erosus", "momordica charantia", "trichosanthes dioica", "physalis philadelphica", "trichosanthes cucumerina", "cyamopsis tetragonoloba pods",
  "rye", "jau", "poha", "masa", "ragi", "teff", "rice", "suji", "rava", "aval", "samai", "bajri", "grits", "jowar", "cumbu", "kodra", "chena", "farik", "dalia", "kamut", "korra", "spelt", "mamra", "kuttu", "kutki", "bajra", "jonna", "kasha", "chura", "sooji", "lapsi", "sanwa", "barley", "mandua", "chawal", "bulgur", "dinkel", "varagu", "frikeh", "thinai", "nachni", "kangni", "kurmura", "burghul", "murmura", "polenta", "basmati", "freekeh", "zizania", "bulghur", "jhangora", "couscous", "cornmeal", "khorasan", "semolina", "wheatgerm", "wheat bran", "panivaragu", "wheat germ", "soba flour", "maize meal", "durum wheat", "maize flour", "echinochloa", "kuthiraivali", "broken wheat", "miller's bran", "makki ka atta", "cracked wheat", "eragrostis tef", "oriental wheat", "setaria italica", "triticum spelta", "eleusine coracana", "panicum miliaceum", "panicum sumatrense", "pumpernickel flour", "pennisetum glaucum", "paspalum scrobiculatum",
  "urad", "tofu", "miso", "tempe", "moong", "kollu", "rajma", "okara", "nattō", "chole", "natto", "matki", "lobia", "carob", "kulthi", "tempeh", "lupini", "chawli", "edamame", "cowpeas", "tur dal", "fagioli", "ulavalu", "gandules", "toor dal", "red gram", "mukimame", "borlotti", "soy pulp", "marrowfat", "arhar dal", "pea flour", "chana dal", "tuvar dal", "soy flour", "masoor dal", "horse gram", "chana daal", "desi chana", "cannellini", "soya flour", "kala chana", "green gram", "black gram", "lupin flour", "bengal gram", "chana flour", "masoor daal", "ful medames", "turkish gram", "kabuli chana", "whole masoor", "frijoles negros", "frijoles pintos", "vigna aconitifolia", "macrotyloma uniflorum",
  "til", "alsi", "chia", "kaju", "pecan", "badam", "pista", "sesame", "tahina", "akhrot", "tahini", "cobnuts", "brazils", "marrons", "pignoli", "pepitas", "filberts", "hazelnut", "chilgoza", "chestnuts", "groundnut", "para nuts", "pine nuts", "pistachio", "macadamia", "pinon nuts", "brazil nut", "moongphali", "lotus seed", "lotus nuts", "hemp seeds", "hemp hearts", "kamal gatta", "monkey nuts", "pine kernels", "chestnut flour", "chestnut puree", "gingelly seeds", "sunflower seed", "queensland nuts", "salvia hispanica", "sunflower kernels",
  "lard", "suet", "tallow", "dripping", "saindoux", "duck fat", "schmaltz", "flax oil", "mustard oil", "theobroma oil", "kachi ghani oil", "rendered pork fat",
  "mawa", "skyr", "brie", "dahi", "khoa", "feta", "quark", "khoya", "gouda", "kefir", "chaas", "chevre", "hellim", "chhena", "topfen", "chhana", "labneh", "paneer", "chèvre", "stilton", "ricotta", "cheddar", "chhachh", "majjiga", "yoghurt", "emmental", "parmesan", "halloumi", "set curd", "camembert", "roquefort", "hung curd", "mozzarella", "magerquark", "parmigiano", "emmentaler", "mascarpone", "gorgonzola", "dolcelatte", "goat cheese", "whey cheese", "danish blue", "blue cheese", "swiss cheese", "fior di latte", "creme fraiche", "crème fraiche", "crème fraîche", "goat's cheese", "cottage cheese", "fresh curd cheese", "white brine cheese", "full-fat soft cheese",
  "mutton",
  "goat", "veal", "whey", "duck", "lamb", "pork", "yolk", "murgh", "chevon", "turkey", "albumen", "venison", "ox liver", "deer meat", "bakra meat",
  "buffalo milk", "bhains ka doodh",
  "cod", "roe", "rui", "tako", "tuna", "swai", "crab", "rohu", "clam", "hake", "basa", "pulpo", "hilsa", "trout", "squid", "prawn", "tarli", "ilish", "mathi", "salmon", "shrimp", "bangda", "scampi", "mussel", "paplet", "jhinga", "moules", "oyster", "kipper", "tarama", "caviar", "tilapia", "vongole", "herring", "bacalao", "merluza", "sardine", "octopus", "anchovy", "haddock", "seabass", "pomfret", "nethili", "scallop", "pollack", "lobster", "pollock", "sea bass", "calamari", "branzino", "mackerel", "pilchard", "rollmops", "anchovies", "pangasius", "boquerones", "langoustine", "labeo rohita", "river cobbler", "tenualosa ilisha",
  "cep", "kelp", "nori", "enoki", "laver", "kombu", "konbu", "dulse", "morels", "gucchi", "hijiki", "wakame", "hiziki", "miyeok", "cremini", "dashima", "maitake", "porcini", "eryngii", "shitake", "wood ear", "shiitake", "girolles", "sea moss", "mushroom", "porphyra", "morchella", "chlorella", "enokitake", "penny bun", "spirulina", "laminaria", "irish moss", "chanterelle", "champignons", "auricularia", "black fungus", "seaweed sheets", "boletus edulis", "roasted seaweed", "palmaria palmata", "cloud ear fungus", "chondrus crispus", "grifola frondosa", "hen of the woods", "lentinula edodes", "agaricus bisporus", "tuber melanosporum", "undaria pinnatifida", "sargassum fusiforme", "pleurotus ostreatus", "arthrospira platensis", "cantharellus cibarius", "blue-green algae powder",
  "white truffle", "black truffle", "summer truffle", "tuber magnatum",
  "tea", "maté", "mate", "kahwa", "oolong", "nettle", "sencha", "matcha", "coffee", "karkade", "roselle", "melissa", "rooibos", "lavender", "hibiscus", "red bush", "camomile", "kombucha", "espresso", "chimarrão", "chamomile", "cacao nibs", "chai patti", "tieguanyin", "elderflower", "nariyal pani", "elder flower", "sorrel drink", "urtica dioica", "jamaica flowers", "aspalathus linearis", "ilex paraguariensis", "matricaria recutita", "matricaria chamomilla", "sambucus nigra flowers", "lavandula angustifolia",
  "soba", "udon", "penne", "fensi", "pasta", "santan", "komezu", "ho fun", "fusilli", "macaroni", "dangmyeon", "spaghetti", "tagliatelle", "pho noodles", "nariyal doodh", "glass noodles", "balsamic glaze", "lasagne sheets", "aceto balsamico", "cellophane noodles",
  "gobo", "kulfa", "tinda", "kairi", "nopal", "ramps", "teora", "kundru", "mochar", "tondli", "bathua", "ambadi", "pitwaa", "rapini", "kakrol", "kantola", "gai lan", "kai lan", "tindora", "basella", "gongura", "ong choy", "poi saag", "kangkong", "lakh dal", "singhara", "singhada", "purslane", "avarekalu", "goosefoot", "nopalitos", "grass pea", "radicchio", "vazhakkai", "beet tops", "ivy gourd", "sem phali", "luni bhaji", "kalmi saag", "alu leaves", "verdolagas", "fiddleheads", "kachcha aam", "cactus pads", "khesari dal", "red chicory", "beet greens", "kachha kela", "spiny gourd", "round gourd", "trapa natans", "patra leaves", "cime di rapa", "vazhaithandu", "teasel gourd", "opuntia pads", "burdock root", "indian squash", "lambsquarters", "kele ka phool", "arctium lappa", "pigweed leaves", "ipomoea aquatica", "allium tricoccum", "coccinia grandis", "momordica dioica", "dandelion leaves", "lathyrus sativus", "fiddlehead ferns", "dandelion greens", "chenopodium album", "portulaca oleracea", "ostrich fern shoots", "morning glory greens", "opuntia ficus-indica fruit", "taraxacum officinale leaves",
  "ber", "akee", "bael", "aliv", "farro", "bilva", "mamey", "falsa", "ackee", "emmer", "kaith", "pomelo", "feijoa", "kavath", "hominy", "jujube", "pitaya", "phalsa", "mosambi", "acerola", "karanda", "tangelo", "popcorn", "charoli", "musambi", "bai guo", "soursop", "pummelo", "karonda", "physalis", "red date", "chironji", "minneola", "rasbhari", "chakotra", "shaddock", "graviola", "pitahaya", "chak-hao", "cherimoya", "triticale", "chirimoya", "guanabana", "hylocereus", "chandrasur", "guavasteen", "boysenberry", "ginkgo nuts", "posole corn", "goldenberry", "halim seeds", "groundcherry", "chinese date", "popping corn", "ginkgo seeds", "golden berry", "dragon fruit", "boysenberries", "wheat berries", "wheat kernels", "citrus maxima", "aegle marmelos", "citrus limetta", "blighia sapida", "grewia asiatica", "ziziphus jujuba", "annona muricata", "acca sellowiana", "tarbooz ke beej", "annona cherimola", "carissa carandas", "malus sylvestris", "nixtamalized corn", "buchanania lanzan", "triticum dicoccum", "limonia acidissima", "garden cress seeds", "ginkgo biloba nuts", "malpighia emarginata", "christ's thorn fruit", "lepidium sativum seeds",
  "eel", "paua", "carp", "sole", "edam", "quail", "goose", "sprat", "whelk", "comté", "magur", "bison", "katla", "lotte", "catla", "anago", "tripe", "comte", "bream", "unagi", "nalli", "porgy", "bombil", "plaice", "surmai", "rabbit", "mrigal", "dorade", "cockle", "dorado", "lengua", "gizzard", "gruyere", "havarti", "snapper", "burrata", "edammer", "abalone", "provola", "halibut", "gruyère", "vanjaram", "crawdads", "manchego", "pheasant", "pecorino", "brisling", "mahi mahi", "provolone", "mahi-mahi", "whitebait", "ox kidney", "ox tongue", "pig kidney", "pepper jack", "bone marrow", "jack cheese", "marrow bones", "grana padano", "buffalo meat", "queso fresco", "queso blanco", "red leicester", "monterey jack", "leicester cheese", "buccinum undatum", "harpadon nehereus", "cerastoderma edule", "fresh mexican cheese",
  "noni", "sumac", "loomi", "timur", "cubeb", "kiwano", "sumach", "summaq", "baobab", "galanga", "rosehip", "huajiao", "salsify", "mealworm", "galangal", "rose hip", "laos root", "loganberry", "cloudberry", "scorzonera", "cowberries", "limoo amani", "zanthoxylum", "kabab chini", "lingonberry", "noomi basra", "pink pepper", "jelly melon", "baies roses", "java pepper", "sacha inchi", "cloudberries", "piper cubeba", "loganberries", "horned melon", "buffalo worm", "schinus molle", "rhus coriaria", "house cricket", "tailed pepper", "guinea grains", "lingonberries", "cricket flour", "dried locusts", "edible locust", "inca inchi oil", "cricket powder", "sichuan pepper", "dried crickets", "szechuan pepper", "pink peppercorn", "melegueta pepper", "migratory locust", "tenebrio molitor", "acheta domesticus", "rubus chamaemorus", "rosa canina fruit", "morinda citrifolia", "locusta migratoria", "rubus loganobaccus", "adansonia digitata", "grains of paradise", "sichuan peppercorns", "cucumis metuliferus", "aframomum melegueta", "szechuan peppercorns", "vaccinium vitis-idaea", "alphitobius diaperinus", "tragopogon porrifolius", "plukenetia volubilis oil", "schinus terebinthifolius",
  "atta", "malai", "kewra", "oatmeal", "peppers", "currants", "oat flakes", "jumbo oats", "fresh cream", "porridge oats", "wholemeal flour", "wholewheat flour", "wholegrain wheat flour",
  "wholemeal",
  "wholewheat",
  // 2026-10 batch 30: fruit
  "açaí berry", "acai", "açaí", "acai berry", "acai puree", "euterpe oleracea", "goji berry", "goji", "goji berries", "wolfberry", "lycium barbarum", "gou qi zi", "sea buckthorn", "sea buckthorn berries", "seabuckthorn", "hippophae rhamnoides", "sallow thorn", "aronia berry", "aronia", "chokeberry", "black chokeberry", "aronia melanocarpa", "bilberry", "bilberries", "whortleberry", "vaccinium myrtillus", "huckleberry", "huckleberries", "vaccinium membranaceum", "haskap berry", "haskap", "lonicera caerulea", "white currant", "sloe", "sloes", "blackthorn fruit", "sloe berries", "prunus spinosa", "mirabelle", "mirabelles", "mirabelle de nancy", "medlar", "medlars", "mespilus germanica", "nashi", "pyrus pyrifolia", "muscadine", "muscadines", "scuppernong", "vitis rotundifolia", "rowan berries", "rowan", "rowanberries", "sorbus aucuparia", "mountain ash berries", "serviceberry", "serviceberries", "saskatoon berry", "saskatoons", "juneberry", "amelanchier", "barberry", "barberries", "zereshk", "berberis vulgaris", "dried barberries", "dewberry", "dewberries", "rubus caesius", "salmonberry", "salmonberries", "rubus spectabilis", "crowberry", "crowberries", "empetrum nigrum", "tayberry", "tayberries", "jostaberry", "jostaberries", "josta", "wineberry", "wineberries", "japanese wineberry", "rubus phoenicolasius", "cornus mas", "prunus cerasus", "kiwiberry", "kiwiberries", "actinidia arguta", "yuzu", "yuzu juice", "yuzu zest", "citrus junos", "calamansi", "kalamansi", "calamondin", "citrofortunella microcarpa", "citron", "citrons", "citrus medica", "etrog", "cedro", "citrus australasica", "buddha's hand", "buddhas hand", "fingered citron", "citrus medica var. sarcodactylis", "sanguinello", "citrus aurantium fruit", "bergamot fruit", "citrus bergamia", "tamarillo", "tamarillos", "solanum betaceum", "salak", "snake fruit", "salacca zalacca", "salak pondoh", "jabuticaba", "jaboticaba", "plinia cauliflora", "cupuaçu", "cupuacu", "cupuassu", "theobroma grandiflorum", "lucuma", "lucuma powder", "lúcuma", "pouteria lucuma", "camu camu", "camu camu powder", "myrciaria dubia", "maqui berry", "maqui", "maqui powder", "aristotelia chilensis", "bilimbi", "bilimbi fruit", "averrhoa bilimbi", "tree sorrel", "irumban puli", "harfarauri", "phyllanthus acidus", "tadgola", "nungu", "toddy palm fruit", "palmyra fruit", "borassus flabellifer", "caju", "anacardium occidentale fruit", "langsat", "lanzones", "duku", "langsat fruit", "lansium parasiticum", "santol", "cotton fruit", "sandoricum koetjape", "kechapi", "marang", "artocarpus odoratissimus", "johey oak", "tarap", "pulasan", "pulasan fruit", "jambu air", "bell fruit", "syzygium samarangense", "jambos", "syzygium jambos", "pitanga", "eugenia uniflora", "psidium cattleianum", "pepino melon", "pepino", "pepino dulce", "solanum muricatum", "babaco", "babaco fruit", "vasconcellea heilbornii", "champagne fruit", "marula", "marula fruit", "sclerocarya birrea", "mamoncillo", "quenepa", "genip", "melicoccus bijugatus", "black sapote", "chocolate pudding fruit", "diospyros nigra", "zapote negro", "white sapote", "casimiroa edulis", "zapote blanco", "canistel", "pouteria campechiana", "yellow sapote", "abiu", "pouteria caimito", "caimito", "atemoya", "atemoyas", "bullock's heart", "ramphal", "annona reticulata", "bullocks heart", "lakoocha", "monkey jack", "barhal", "artocarpus lacucha", "dheu", "champedak", "cempedak", "artocarpus integer", "passiflora tarminiana", "curuba", "taxo", "kokum", "kokam", "garcinia indica", "kokum rind", "amsul", "bhirand",
  // 2026-10 batch 31: vegetables
  "celtuce", "wosun", "lactuca sativa var. augustana", "curly endive", "frisee", "frisée", "cichorium endivia", "escarole", "broad-leaved endive", "batavian endive", "scarole", "mizuna", "spider mustard", "kyona", "tatsoi", "tat soi", "spoon mustard", "choy sum", "choi sum", "yu choy", "cai xin", "komatsuna", "tendergreen", "chrysanthemum greens", "shungiku", "garland chrysanthemum", "tong ho", "crown daisy", "sorrel", "garden sorrel", "rumex acetosa", "common sorrel", "dock leaves", "samphire", "marsh samphire", "glasswort", "salicornia", "corn salad", "mache", "mâche", "valerianella locusta", "pea shoots", "pea tendrils", "dou miao", "pea sprouts", "spring greens", "camote tops", "kamote tops", "pondu", "saka-saka", "matapa", "cucurbita leaves", "chane ka saag", "chana saag", "agathi leaves", "agathi keerai", "sesbania grandiflora leaves", "hummingbird tree leaves", "ponnaganni", "ponnanganni keerai", "alternanthera sessilis", "sessile joyweed", "black nightshade leaves", "manathakkali keerai", "manathakkali", "solanum nigrum leaves", "makoi", "jute mallow", "molokhia", "mulukhiyah", "ewedu", "corchorus olitorius", "jute leaves", "bitter leaf", "bitterleaf", "vernonia amygdalina", "ndole leaves", "onugbu", "ugu", "ugwu", "telfairia occidentalis", "chaya", "cnidoscolus aconitifolius", "chaya leaves", "broccolini", "aspabroc", "romanesco", "broccoflower", "cardoon", "cardoons", "cynara cardunculus", "cardi", "seakale", "crambe maritima", "ube", "ube halaya", "ratalu", "oca", "oxalis tuberosa", "yacon", "yacón", "smallanthus sonchifolius", "yacon root", "yacon syrup", "nagaimo", "yamaimo", "huai shan", "cocoyam", "tannia", "yautia", "malanga", "xanthosoma sagittifolium", "new cocoyam", "crosnes", "stachys affinis", "knotroot", "jiaobai", "makomo", "chakka kuru", "ramsons", "allium ursinum", "allium ampeloprasum elephant", "jiu cai", "nira", "allium tuberosum", "kabocha squash", "kabocha", "acorn squash", "acorn squashes", "hubbard squash", "hubbard", "pattypan squash", "pattypan", "custard marrow", "crookneck squash", "yellow squash", "straightneck squash", "yellow crookneck", "pimientos de padrón", "pimientos de padron", "poblano pepper", "poblano", "poblanos", "ancho chile", "serrano pepper", "serrano", "serrano chile", "habanero", "habanero pepper", "scotch bonnet", "scotch bonnet pepper", "kashmiri mirch", "bhut jolokia", "ghost pepper", "naga jolokia", "raja mircha", "squash blossoms", "fiori di zucca", "kumro phool", "vine leaves", "grapevine leaves", "dolma leaves", "kachnar buds", "kachnar", "bauhinia variegata buds", "kachnar ki kali", "ker", "kair", "capparis decidua", "ker berries", "sangri", "khejri pods", "prosopis cineraria pods", "sundakkai", "sundakai", "solanum torvum", "solanum aethiopicum", "psophocarpus tetragonolobus",
  // 2026-10 batch 32: herbs, spices and blends
  "horapha", "ocimum basilicum var. thyrsiflora", "tulsi", "tulasi", "kaprao", "ocimum tenuiflorum", "ocimum sanctum", "maenglak", "ocimum × africanum", "sabja leaves", "rau ram", "laksa leaf", "vietnamese mint", "persicaria odorata", "culantro", "ngo gai", "recao", "eryngium foetidum", "shiso", "perilla leaves", "perilla", "kkaennip", "perilla frutescens", "lovage", "levisticum officinale", "summer savory", "savory", "satureja hortensis", "bohnenkraut", "winter savory", "satureja montana", "mountain savory", "hyssop", "hyssopus officinalis", "borage", "borage leaves", "borage flowers", "starflower", "borago officinalis", "aloysia citrodora", "verveine", "epazote", "dysphania ambrosioides", "wormseed", "citrus hystrix leaves", "bai makrut", "pandan leaves", "pandan", "screwpine leaves", "pandanus amaryllifolius", "daun pandan", "rampe", "betel leaf", "paan leaf", "paan", "piper betle", "vettilai", "nagavalli", "tej patta", "tejpat", "cinnamomum tamala", "malabathrum", "sweet cicely", "myrrhis odorata", "garden myrrh", "backhousia citriodora", "rose petals", "dried rose petals", "rose buds", "gulkand petals", "rosa damascena petals", "cassia", "cassia bark", "cinnamomum cassia", "dalchini (cassia)", "mahlab", "mahleb", "prunus mahaleb", "mahlepi", "amchur", "amchoor", "aamchur", "stone flower", "kalpasi", "dagad phool", "black stone flower", "parmotrema perlatum", "marathi moggu", "marati moggu", "kapok buds", "ceiba pentandra buds", "radhuni", "trachyspermum roxburghianum", "randhuni", "bunium persicum", "fingerroot", "krachai", "kra chai", "temu kunci", "boesenbergia rotunda", "kencur", "cekur", "zedoary", "kachur", "amba haldi", "curcuma zedoaria", "curcuma amada", "mavinakayi shunti", "grains of selim", "xylopia aethiopica", "selim pepper", "kani pepper", "uda", "korarima", "aframomum corrorima", "gochugaru", "gochu garu", "aleppo pepper", "pul biber", "halaby pepper", "urfa biber", "isot pepper", "urfa pepper", "espelette pepper", "piment d'espelette", "chipotle", "chipotle pepper", "chipotle powder", "piri piri", "peri peri", "pili pili", "mustard powder", "ground mustard", "english mustard powder", "dry mustard", "mustard flour", "wattleseed", "acacia seed", "wattle seed", "acacia victoriae seed", "tasmanian pepperberry", "mountain pepper", "pepperberry", "tasmannia lanceolata", "garam masala", "garam masala powder", "gorom moshla", "chaat masala", "chat masala", "panch phoron", "panch phoran", "bengali five spice", "pach phoron", "sambar powder", "sambar masala", "sambhar powder", "rasam powder", "rasam podi", "saathamudhu podi", "goda masala", "kala masala", "maharashtrian goda masala", "za'atar", "zaatar", "zahtar", "za atar", "ras el hanout", "ras al hanout", "ras-el-hanout", "baharat", "bahārāt", "arabic seven spice", "seven spice", "berbere", "berbere spice", "ethiopian berbere", "dukkah", "duqqa", "dukka", "egyptian dukkah", "chinese five spice", "five spice powder", "five-spice", "wu xiang fen", "shichimi togarashi", "shichimi", "japanese seven spice", "nanami togarashi", "herbes de provence", "provencal herbs", "herbes de provence blend", "italian seasoning", "italian herbs", "italian herb seasoning", "mixed spice", "pudding spice", "british mixed spice",
  // 2026-10 batch 33: nuts, seeds and legumes
  "tiger nuts", "tigernuts", "chufa", "tiger nut flour", "pili nuts", "pili nut", "canarium nuts", "candlenut", "kemiri", "buah keras", "kukui nut", "baru nuts", "baru nut", "praline paste", "praliné", "marzipan", "marchpane", "acorns", "acorn", "oak nuts", "dotori", "beech nuts", "beechnuts", "beech mast", "hickory nuts", "hickory nut", "shagbark hickory nuts", "melon seeds", "magaz", "char magaz", "egusi", "melon seed kernels", "sabja", "sabja seeds", "tukmaria", "falooda seeds", "deulkkae", "egoma", "makhana", "fox nuts", "phool makhana", "gorgon nut", "euryale seeds", "plukenetia volubilis", "pine nut paste", "lian rong", "lotus paste", "flageolets", "flageolet", "vigna subterranea", "habichuelas rosadas", "mayocoba", "gigantes", "gigandes", "faba protein", "mung flour", "ulundu flour", "canavalia ensiformis", "sweet lupin", "lupine flour", "mesquite flour", "mesquite powder", "mesquite pod flour", "soya drink", "soy drink", "yuba", "fu pi", "soy nuts", "soya nuts", "doenjang", "dwenjang", "douchi", "dou chi", "soya chunks", "soya nuggets", "soy chunks", "meal maker", "soya granules", "kirazu", "kuromame", "gochujang", "gochu jang",
  // 2026-10 batch 34: grains and noodles
  "einkorn", "einkorn wheat", "triticum monococcum", "einkorn flour", "fonio", "fonio grain", "digitaria exilis", "acha", "amaranth grain", "amaranth flour", "rajgira", "rajgira flour", "ramdana", "popped amaranth", "sprouted wheat", "germinated wheat", "diastatic malt", "graham flour", "chapati flour", "chapatti flour", "roti flour", "puffed wheat", "wheat puffs", "pulut hitam", "sona masuri", "sona masoori", "vialone nano", "maize kernels", "maize", "field corn", "dent corn", "dried corn", "mochiko", "shiratamako", "wheat vermicelli", "vermicelli", "seviyan", "semiya", "sevaiyan", "lo mein noodles", "chow mein noodles", "ramen noodles", "ramen", "alkaline noodles", "breadcrumbs", "bread crumbs", "dried breadcrumbs", "rusk crumbs", "golden breadcrumbs", "panko", "panko breadcrumbs", "japanese breadcrumbs", "matzo meal", "matzah meal", "matzoh meal", "orzo", "risoni", "gnocchi", "gnocchi di patate", "seitan", "wheat meat", "sago", "sago pearls", "sagu", "farinha de mandioca", "garri", "gari", "durum flour", "semola rimacinata", "chakki durum",
  // 2026-10 batch 35: label staples
  "aqua", "seltzer", "club soda", "nimbu ras", "chocolate liquor", "cacao mass", "unsweetened chocolate", "nutritional yeast", "nooch", "inactive yeast flakes", "deactivated yeast", "savoury yeast flakes", "brewer's yeast", "brewers yeast", "debittered brewer's yeast", "sourdough starter", "sourdough", "levain", "sourdough culture", "sour dough", "natural leaven", "msnf", "dairy solids", "dairy whitener", "spray dried dairy whitener", "rabri", "rabdi", "rabadi", "shrikhand", "srikhand", "amrakhand", "chakka", "colby cheese", "colby", "colby jack", "mishri", "misri", "rock candy", "bing tang", "chancaca", "sucanat", "birch syrup", "karupatti", "manuka",
  // 2026-10 batch 36: meat, offal, fish and seafood
  "hogget", "sheep meat", "heart", "ox heart", "kaleji-dil", "oxtail", "ox tail", "pig trotters", "pigs trotters", "pig's feet", "paya", "phoenix claws", "sweetbreads", "thymus", "kaleji", "pigs liver", "pig liver", "foie gras", "foie gras de canard", "wild boar", "boar meat", "sanglier", "jungli suar", "kangaroo", "kangaroo meat", "roo meat", "ostrich", "ostrich meat", "ostrich fillet", "elk", "elk meat", "wapiti", "moose meat", "partridge", "grey partridge", "pigeon", "squab", "wood pigeon", "guinea fowl", "guineafowl", "pintade", "frog legs", "frogs legs", "cuisses de grenouille", "snails", "escargot", "escargots", "helix snails", "grouper", "hammour", "garoupa", "skate", "ray wings", "skate wings", "thornback ray", "shark", "shark meat", "huss", "john dory", "st pierre", "saint pierre", "dory", "turbot", "turbot fillet", "barramundi", "bhetki", "arctic char", "char", "salvelinus alpinus", "perch", "european perch", "yellow perch", "river perch", "pike", "northern pike", "zander", "pike-perch", "walleye", "anoplopoma fimbria", "yellowtail", "hamachi", "japanese amberjack", "buri", "amberjack", "mullet", "grey mullet", "red mullet", "bhangan", "rawas", "indian threadfin", "eleutheronema tetradactylum", "pearl spot", "karimeen", "green chromide", "etroplus suratensis", "karuvadu", "sukhi machli", "bonito flakes", "katsuobushi", "dried bonito", "bonito", "surimi", "seafood sticks", "kamaboko", "sepia", "sea urchin", "uni", "ricci di mare", "ormer", "bao yu", "krill", "antarctic krill", "euphausia superba", "krill meal", "hae bee", "camarão seco", "belacan", "terasi", "kapi", "bagoong", "balachong", "bone broth",
];

let WORD_RE: RegExp | null = null;
const wholeWordRe = (): RegExp =>
  (WORD_RE ??= new RegExp(`(?:^|[^a-z])(?:${WHOLEFOOD_WORDS.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") || "(?!)"})(?:e?s)?(?![a-z])`));

const NAME = (a: AdditiveProfile) => a;
void NAME; // keep tree-shaker honest; profiles are the export

// Pull additive codes out of label text as whole tokens: "E1200", "E 407a", "INS 330",
// "E341(i)", and bare Codex codes in brackets such as "acidity regulator (330, 331)".
// Each code yields candidates most-specific first: "e341ai" → e341ai, e341a, e341.
const CODE_RE = /(?:^|[^a-z])(?:e|ins)\s*-?\s*(\d{3,4})([a-h](?![a-z]))?(?:\s*\(\s*([ivx]{1,4})\s*\)|([ivx]{1,4})(?![a-z]))?(?!\d)/g;
const BRACKET_RE = /\(((?:[^()]|\([ivx]{1,4}\))*)\)/g;
const BARE_LIST = /^\s*\d{3,4}[a-h]?(?:\([ivx]{1,4}\))?(?:\s*[,&/]\s*\d{3,4}[a-h]?(?:\([ivx]{1,4}\))?)*\s*$/;
const BARE_CODE = /(\d{3,4})([a-h])?(?:\(([ivx]{1,4})\))?/g;

function codeCandidates(digits: string, letter?: string, roman?: string): string[] {
  const base = `e${digits}`;
  const out: string[] = [];
  if (letter && roman) out.push(`${base}${letter}${roman}`);
  if (letter) out.push(`${base}${letter}`);
  if (roman) out.push(`${base}${roman}`);
  out.push(base);
  return out;
}

export function extractCodes(lower: string): string[][] {
  const codes: string[][] = [];
  for (const m of Array.from(lower.matchAll(CODE_RE))) codes.push(codeCandidates(m[1], m[2], m[3] ?? m[4]));
  for (const b of Array.from(lower.matchAll(BRACKET_RE))) {
    if (!BARE_LIST.test(b[1])) continue;
    for (const m of Array.from(b[1].matchAll(BARE_CODE))) codes.push(codeCandidates(m[1], m[2], m[3]));
  }
  return codes;
}

// Short keywords (four letters or fewer, e.g. "bha", "msg", "guar") must stand as whole
// words, so "bha" can't fire inside "bhaji" or "bhains", nor "msg" inside a longer token.
const SHORT_KW = new Map<string, RegExp>();
function keywordHit(lower: string, k: string): boolean {
  if (k.replace(/[^a-z]/g, "").length > 4) return lower.includes(k);
  let re = SHORT_KW.get(k);
  if (!re) SHORT_KW.set(k, (re = new RegExp(`(?:^|[^a-z0-9])${k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![a-z0-9])`)));
  return re.test(lower);
}

// Reference implementation: scans every profile and every keyword. Kept as the oracle
// that scripts/check-lookup.ts compares the indexed lookup against; not used at runtime.
export function lookupAdditiveLinear(rawName: string): AdditiveProfile | null {
  const lower = rawName.toLowerCase().trim();
  const hit = linearScan(lower);
  if (hit) return hit;
  for (const v of spellingVariants(lower)) { const h = linearScan(v); if (h) return h; }
  return null;
}

function linearScan(lower: string): AdditiveProfile | null {
  for (const candidates of extractCodes(lower)) {
    for (const code of candidates) {
      const hit = ADDITIVES.find((a) => a.eNumbers?.includes(code));
      if (hit) return hit;
    }
  }
  let best: AdditiveProfile | null = null;
  let bestLen = 0;
  for (const a of ADDITIVES) {
    for (const k of a.keywords) {
      if (k.length > bestLen && keywordHit(lower, k)) {
        best = a;
        bestLen = k.length;
      }
    }
  }
  return best;
}

// US/UK spellings. A name the KB misses is retried in the other spelling, so
// "acesulphame K" and "aluminum sulfate" find the profiles that list the other form.
const SPELL_UK: [RegExp, string][] = [
  [/sulf(?!o)/g, "sulph"], [/sulfo/g, "sulpho"], [/color/g, "colour"], [/flavor/g, "flavour"], [/fiber/g, "fibre"],
  [/aluminum/g, "aluminium"], [/yzed/g, "ysed"], [/yzate/g, "ysate"], [/ized/g, "ised"], [/izer/g, "iser"], [/yogurt/g, "yoghurt"],
];
const SPELL_US: [RegExp, string][] = [
  [/sulph/g, "sulf"], [/colour/g, "color"], [/flavour/g, "flavor"], [/fibre/g, "fiber"],
  [/aluminium/g, "aluminum"], [/ysed/g, "yzed"], [/ysate/g, "yzate"], [/ised/g, "ized"], [/iser/g, "izer"], [/yoghurt/g, "yogurt"],
];
export function spellingVariants(lower: string): string[] {
  const out: string[] = [];
  for (const table of [SPELL_UK, SPELL_US]) {
    let v = lower;
    for (const [re, to] of table) v = v.replace(re, to);
    if (v !== lower && !out.includes(v)) out.push(v);
  }
  return out;
}

// ── Indexed lookup ───────────────────────────────────────────────────────────
// Built once on first use. Codes resolve through a hash map (O(1)); keywords through an
// Aho–Corasick automaton that finds every keyword occurring in the name in one pass over
// the name's characters, however many keywords the KB holds. Results are identical to
// lookupAdditiveLinear: codes first, then the longest keyword, ties to the earlier one.
interface KwEntry { k: string; profile: AdditiveProfile; rank: number; short: boolean }
interface Matcher {
  codes: Map<string, AdditiveProfile>;
  next: Map<string, number>[];   // trie transitions per state
  fail: number[];                // failure links
  out: number[];                 // entry index ending at this state, or -1
  dict: number[];                // nearest failure-ancestor state with an entry, or 0
  entries: KwEntry[];
}
let MATCHER: Matcher | null = null;
const ALNUM = /[a-z0-9]/;

function buildMatcher(): Matcher {
  const codes = new Map<string, AdditiveProfile>();
  for (const a of ADDITIVES) for (const e of a.eNumbers ?? []) if (!codes.has(e)) codes.set(e, a);

  const entries: KwEntry[] = [];
  const next: Map<string, number>[] = [new Map()];
  const out: number[] = [-1];
  const seen = new Set<string>();
  for (const a of ADDITIVES) {
    for (const k of a.keywords) {
      if (!k || seen.has(k)) continue;   // first owner wins, as in the linear scan
      seen.add(k);
      let s = 0;
      for (const ch of k) {
        let t = next[s].get(ch);
        if (t === undefined) {
          t = next.length;
          next.push(new Map());
          out.push(-1);
          next[s].set(ch, t);
        }
        s = t;
      }
      out[s] = entries.length;
      entries.push({ k, profile: a, rank: entries.length, short: k.replace(/[^a-z]/g, "").length <= 4 });
    }
  }
  const fail = new Array<number>(next.length).fill(0);
  const dict = new Array<number>(next.length).fill(0);
  const queue: number[] = [];
  for (const t of Array.from(next[0].values())) queue.push(t);
  while (queue.length) {
    const s = queue.shift()!;
    for (const [ch, t] of Array.from(next[s])) {
      let f = fail[s];
      while (f && !next[f].has(ch)) f = fail[f];
      const ft = next[f].get(ch);
      fail[t] = ft !== undefined && ft !== t ? ft : 0;
      dict[t] = out[fail[t]] >= 0 ? fail[t] : dict[fail[t]];
      queue.push(t);
    }
  }
  return { codes, next, fail, out, dict, entries };
}

function matcher(): Matcher {
  return (MATCHER ??= buildMatcher());
}

function lookupUncached(lower: string): AdditiveProfile | null {
  const m = matcher();
  for (const candidates of extractCodes(lower)) {
    for (const code of candidates) {
      const hit = m.codes.get(code);
      if (hit) return hit;
    }
  }
  // Iterate code points (as `for…of` did when building the trie) so non-ASCII keywords line up.
  const chars = Array.from(lower);
  let best: KwEntry | null = null;
  let s = 0;
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    while (s && !m.next[s].has(ch)) s = m.fail[s];
    s = m.next[s].get(ch) ?? 0;
    for (let o = m.out[s] >= 0 ? s : m.dict[s]; o; o = m.dict[o]) {
      const e = m.entries[m.out[o]];
      if (best && (e.k.length < best.k.length || (e.k.length === best.k.length && e.rank > best.rank))) continue;
      if (e.short) {
        const len = Array.from(e.k).length;
        const before = i - len >= 0 ? chars[i - len] : "";
        const after = i + 1 < chars.length ? chars[i + 1] : "";
        if (ALNUM.test(before) || ALNUM.test(after)) continue;
      }
      best = e;
    }
  }
  return best?.profile ?? null;
}

// Scans look the same names up several times (scoring, NOVA, the route's concern
// column), so remember answers. Bounded so arbitrary input can't grow it forever.
const LOOKUP_CACHE = new Map<string, AdditiveProfile | null>();
const CACHE_MAX = 20_000;

export function lookupAdditive(rawName: string): AdditiveProfile | null {
  const lower = rawName.toLowerCase().trim();
  const cached = LOOKUP_CACHE.get(lower);
  if (cached !== undefined) return cached;
  let hit = lookupUncached(lower);
  if (!hit) for (const v of spellingVariants(lower)) if ((hit = lookupUncached(v))) break;
  if (LOOKUP_CACHE.size >= CACHE_MAX) LOOKUP_CACHE.clear();
  LOOKUP_CACHE.set(lower, hit);
  return hit;
}

const WHOLE_CACHE = new Map<string, boolean>();

export function isWholeFood(rawName: string): boolean {
  const lower = rawName.toLowerCase().trim();
  const cached = WHOLE_CACHE.get(lower);
  if (cached !== undefined) return cached;
  const v = isWholeFoodUncached(lower);
  if (WHOLE_CACHE.size >= CACHE_MAX) WHOLE_CACHE.clear();
  WHOLE_CACHE.set(lower, v);
  return v;
}

function isWholeFoodUncached(lower: string): boolean {
  // Only treat as whole food if no additive profile claims it.
  if (lookupAdditive(lower)) return false;
  // "Strawberry flavour" or "garlic flavouring" is a flavouring, not the food.
  if (/flavou?r/.test(lower)) return false;
  // Composite products named after their main food ("tomato ketchup", "chicken stock") are not that food.
  if (/\b(sauce|ketchup|stock|bouillon|gravy|dressing|marinade)s?\b/.test(lower)) return false;
  return WHOLEFOOD_KEYWORDS.some((k) => lower === k || lower.includes(k)) || wholeWordRe().test(lower);
}

// ── self-check ──────────────────────────────────────────────────────────────
export function _demo(): void {
  const bz = lookupAdditive("Sodium Benzoate (E211)");
  if (!bz || bz.id !== "sodium-benzoate") throw new Error("E-number lookup failed");
  const bromate = lookupAdditive("potassium bromate");
  if (!bromate || bromate.dominant !== "CRITICAL") throw new Error("critical lookup failed");
  if (!isWholeFood("Rolled Oats")) throw new Error("wholefood detection failed");
  if (isWholeFood("Sodium Benzoate")) throw new Error("additive misclassified as wholefood");
  // eslint-disable-next-line no-console
  console.log("additives.ts self-check OK");
}
