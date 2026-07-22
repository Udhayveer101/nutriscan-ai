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
    keywords: ["sodium nitrite", "sodium nitrate", "potassium nitrite", "potassium nitrate"],
    eNumbers: ["e249", "e250", "e251", "e252"],
    category: "preservative", function: "Cure / colour fixative in processed meat",
    dominant: "CRITICAL", moderate: "HIGH", trace: "MEDIUM", evidence: "STRONG",
    adi: "Nitrite 0.07 mg/kg bw/day (EFSA 2017)",
    regulatory: "Permitted with limits; processed meat = IARC Group 1 carcinogen",
    populations: ["infants (methaemoglobinaemia)", "colorectal cancer risk"],
    note: "Forms carcinogenic nitrosamines with amines under heat/stomach acid. Processed meats containing these are a WHO Group 1 carcinogen.",
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
    id: "aspartame", name: "Aspartame", keywords: ["aspartame"], eNumbers: ["e951"],
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
    id: "hfcs", name: "High Fructose Corn Syrup", keywords: ["high fructose corn syrup", "hfcs", "glucose-fructose syrup"],
    category: "sweetener", function: "Caloric sweetener",
    dominant: "HIGH", moderate: "MEDIUM", trace: "LOW", evidence: "MODERATE",
    regulatory: "GRAS; no ADI (a sugar, not an additive)",
    populations: ["metabolic syndrome", "diabetes", "NAFLD risk"],
    note: "As a dominant ingredient it is added sugar in bulk — linked to obesity, type-2 diabetes and fatty liver. Concern scales with amount.",
    ref: "WHO sugars guideline 2015; AHA added-sugar limits",
  },
  {
    id: "msg", name: "Monosodium Glutamate", keywords: ["monosodium glutamate", "msg"], eNumbers: ["e621"],
    category: "flavor enhancer", function: "Umami flavour enhancer",
    dominant: "HIGH", moderate: "MEDIUM", trace: "LOW", evidence: "LIMITED",
    adi: "EFSA 30 mg/kg bw/day (glutamates, 2017)",
    regulatory: "GRAS; EFSA set a group ADI in 2017 (first ever)",
    populations: ["self-reported sensitivity"],
    note: "Long-standing 'safe' status, but EFSA introduced an ADI in 2017 after neurotoxicity signals at high intake. Dominant use (heavy seasoning) is the concern, not trace.",
    ref: "EFSA 2017 glutamates re-evaluation",
  },
  {
    id: "palm-oil", name: "Palm Oil", keywords: ["palm oil", "palm kernel", "palm fat"],
    category: "fat", function: "Cheap solid fat",
    dominant: "HIGH", moderate: "HIGH", trace: "MEDIUM", evidence: "MODERATE",
    regulatory: "Permitted; refining produces 3-MCPD/glycidyl esters (EFSA concern)",
    note: "High in saturated fat; high-temperature refining forms glycidyl esters (genotoxic carcinogens). Concern rises with amount and refining.",
    ref: "EFSA 2016 process contaminants in palm oil",
  },
  {
    id: "sodium-benzoate", name: "Sodium Benzoate", keywords: ["sodium benzoate", "benzoic acid"], eNumbers: ["e211", "e210"],
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
    id: "caramel-color-iv", name: "Caramel Colour (Class III/IV)", keywords: ["caramel color", "caramel colour", "e150c", "e150d"], eNumbers: ["e150c", "e150d"],
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
    keywords: ["red 40", "allura red", "yellow 5", "tartrazine", "yellow 6", "sunset yellow",
               "blue 1", "brilliant blue", "blue 2", "indigotine", "green 3", "ponceau"],
    eNumbers: ["e129", "e102", "e110", "e133", "e132", "e124"],
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
    id: "modified-starch", name: "Modified Starch", keywords: ["modified starch", "modified food starch", "modified corn starch"],
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
    id: "sucralose", name: "Sucralose", keywords: ["sucralose"], eNumbers: ["e955"],
    category: "sweetener", function: "Artificial sweetener",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "LIMITED",
    adi: "15 mg/kg bw/day (EFSA)",
    regulatory: "Approved; heat-degradation & sucralose-6-acetate concerns (2023)",
    note: "Long considered inert, but 2023 research on the metabolite sucralose-6-acetate raised genotoxicity questions. Heating (baking) may form chloropropanols.",
    ref: "Schiffman 2023; EFSA opinion",
  },
  {
    id: "potassium-sorbate", name: "Potassium Sorbate", keywords: ["potassium sorbate", "sorbic acid"], eNumbers: ["e202", "e200"],
    category: "preservative", function: "Antimicrobial preservative",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "INSUFFICIENT",
    adi: "3 mg/kg bw/day (EFSA 2015)",
    regulatory: "Approved; among the safer preservatives",
    note: "One of the better-tolerated preservatives; low toxicity. Minor genotoxicity flags at very high doses only.",
    ref: "EFSA 2015 sorbates re-evaluation",
  },
  {
    id: "polysorbate-80", name: "Polysorbate 80", keywords: ["polysorbate 80", "polysorbate 60", "polysorbate"], eNumbers: ["e433", "e435"],
    category: "emulsifier", function: "Emulsifier",
    dominant: "MEDIUM", moderate: "MEDIUM", trace: "LOW", evidence: "LIMITED",
    adi: "25 mg/kg bw/day (EFSA)",
    regulatory: "Approved; emulsifier–microbiome research emerging",
    populations: ["gut inflammation"],
    note: "Emerging research links dietary emulsifiers to gut-microbiome disruption and low-grade inflammation in animal models.",
    ref: "Chassaing et al. 2015 (Nature)",
  },
  {
    id: "carboxymethylcellulose", name: "Carboxymethylcellulose (CMC)", keywords: ["carboxymethylcellulose", "cellulose gum", "cmc"], eNumbers: ["e466"],
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
    id: "ascorbic-acid", name: "Ascorbic Acid (Vitamin C)", keywords: ["ascorbic acid", "vitamin c", "sodium ascorbate"], eNumbers: ["e300"],
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
    id: "tocopherol", name: "Tocopherols (Vitamin E)", keywords: ["tocopherol", "vitamin e"], eNumbers: ["e306", "e307"],
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
    id: "sulphites", name: "Sulphites (SO₂, metabisulphites)", keywords: ["sulphite", "sulfite", "metabisulphite", "metabisulfite", "sulphur dioxide", "sulfur dioxide"], eNumbers: ["e220", "e221", "e223", "e224", "e228"],
    category: "preservative", function: "Preservative / antioxidant",
    dominant: "HIGH", moderate: "HIGH", trace: "MEDIUM", evidence: "STRONG",
    adi: "0.7 mg/kg bw/day SO₂ (EFSA)", regulatory: "Approved; mandatory allergen declaration (EU/US)",
    populations: ["asthmatics (bronchospasm)", "sulphite-sensitive"],
    note: "Can trigger severe asthmatic reactions; a declarable allergen. EFSA flagged that the ADI is easily exceeded by high consumers.",
    ref: "EFSA 2016 sulphites re-evaluation",
  },
  {
    id: "propyl-gallate", name: "Propyl Gallate", keywords: ["propyl gallate", "propyl ester"], eNumbers: ["e310"],
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
    id: "stevia", name: "Steviol Glycosides (Stevia)", keywords: ["stevia", "steviol", "rebaudioside"], eNumbers: ["e960"],
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
    id: "xylitol", name: "Xylitol", keywords: ["xylitol"], eNumbers: ["e967"],
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
    id: "mono-diglycerides", name: "Mono- and Diglycerides", keywords: ["mono- and diglycerides", "monoglycerides", "diglycerides", "mono and diglycerides"], eNumbers: ["e471"],
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
    id: "disodium-edta", name: "Disodium EDTA", keywords: ["edta", "disodium edta", "calcium disodium edta"], eNumbers: ["e385"],
    category: "antioxidant", function: "Sequestrant / preservative",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "LIMITED",
    adi: "2.5 mg/kg bw/day (EFSA)", regulatory: "Approved with limits",
    note: "Chelates trace metals to prevent spoilage; can impair mineral absorption at high intake. Restricted to specific foods.",
    ref: "EFSA 2018 EDTA re-evaluation",
  },
  {
    id: "sodium-phosphates", name: "Sodium/Potassium Phosphates", keywords: ["sodium phosphate", "potassium phosphate", "sodium tripolyphosphate", "trisodium phosphate"], eNumbers: ["e339", "e340", "e451", "e452"],
    category: "acidity regulator", function: "Emulsifying salt / stabiliser",
    dominant: "MEDIUM", moderate: "MEDIUM", trace: "LOW", evidence: "MODERATE",
    regulatory: "Approved; EFSA 2019 group phosphate ADI", populations: ["chronic kidney disease", "cardiovascular"],
    note: "Added phosphates are highly bioavailable; high dietary phosphate is linked to cardiovascular and kidney risk. EFSA set a group ADI in 2019.",
    ref: "EFSA 2019 phosphates re-evaluation",
  },
  {
    id: "aluminium-additives", name: "Aluminium-containing Additives", keywords: ["aluminium", "aluminum", "sodium aluminium phosphate", "aluminium sulphate"], eNumbers: ["e541", "e173", "e520", "e523"],
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
    id: "guar-gum", name: "Guar Gum", keywords: ["guar gum", "guar"], eNumbers: ["e412"],
    category: "thickener", function: "Natural thickener (fibre)",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    regulatory: "Approved; a soluble fibre",
    note: "Plant-derived soluble fibre; well tolerated, mild positive (slows glucose absorption). No ADI needed.",
    ref: "EFSA 2017 guar gum",
  },
  {
    id: "xanthan-gum", name: "Xanthan Gum", keywords: ["xanthan gum", "xanthan"], eNumbers: ["e415"],
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
    id: "locust-bean-gum", name: "Locust Bean Gum", keywords: ["locust bean gum", "carob gum"], eNumbers: ["e410"],
    category: "thickener", function: "Natural thickener",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    regulatory: "Approved; no ADI", note: "Carob-seed fibre; benign. (Restricted in infant formula pending review.)",
    ref: "EFSA 2017 locust bean gum",
  },
  {
    id: "calcium-propionate", name: "Calcium Propionate", keywords: ["calcium propionate", "sodium propionate", "propionic acid"], eNumbers: ["e282", "e281", "e280"],
    category: "preservative", function: "Antifungal (bread)",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "LIMITED",
    regulatory: "Approved; EFSA re-affirmed safety 2014",
    populations: ["children (behavioural reports)"],
    note: "Common bread mould inhibitor. Generally safe; limited reports of behavioural effects in sensitive children.",
    ref: "EFSA 2014 propionates",
  },
  {
    id: "sodium-erythorbate", name: "Sodium Erythorbate", keywords: ["erythorbate", "erythorbic acid"], eNumbers: ["e316", "e315"],
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
    id: "sodium-stearoyl-lactylate", name: "Sodium Stearoyl Lactylate", keywords: ["stearoyl lactylate", "ssl", "sodium stearoyl"], eNumbers: ["e481", "e482"],
    category: "emulsifier", function: "Dough conditioner / emulsifier",
    dominant: "MEDIUM", moderate: "LOW", trace: "LOW", evidence: "LIMITED",
    adi: "20 mg/kg bw/day (EFSA)", regulatory: "Approved",
    note: "Synthetic emulsifier and a marker of ultra-processed bread; low toxicity within ADI.",
    ref: "EFSA 2013 stearoyl lactylates",
  },
  {
    id: "lactic-acid", name: "Lactic Acid", keywords: ["lactic acid"], eNumbers: ["e270"],
    category: "acidity regulator", function: "Acidulant",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    regulatory: "GRAS; no ADI", note: "Naturally occurring (fermentation); benign acidulant and preservative.",
    ref: "EFSA lactic acid",
  },
  {
    id: "malic-acid", name: "Malic Acid", keywords: ["malic acid"], eNumbers: ["e296"],
    category: "acidity regulator", function: "Acidulant",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    regulatory: "Approved; no ADI", note: "Found naturally in apples; benign tart flavouring/acidulant.",
    ref: "EFSA malic acid",
  },
  {
    id: "sodium-citrate", name: "Sodium Citrate", keywords: ["sodium citrate", "trisodium citrate"], eNumbers: ["e331"],
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
    id: "beta-carotene", name: "Beta-Carotene (E160a)", keywords: ["beta-carotene", "beta carotene", "carotene"], eNumbers: ["e160a"],
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
    id: "inulin", name: "Inulin / Chicory Fibre", keywords: ["inulin", "chicory root", "chicory fiber", "chicory fibre", "oligofructose"],
    category: "thickener", function: "Prebiotic fibre",
    dominant: "LOW", moderate: "LOW", trace: "LOW", evidence: "STRONG",
    regulatory: "GRAS; a recognised dietary fibre", populations: ["IBS/FODMAP-sensitive (bloating)"],
    note: "A prebiotic fibre with genuine benefits (gut microbiome, satiety); mild positive. Can cause bloating in FODMAP-sensitive people.",
    ref: "EFSA inulin health claims",
  },
];

// Whole-food / unprocessed markers → NOVA group 1 signal (positive).
export const WHOLEFOOD_KEYWORDS = [
  "water", "oats", "rolled oats", "whole wheat", "whole grain", "brown rice", "quinoa",
  "almond", "peanut", "cashew", "walnut", "milk", "egg", "tomato", "potato", "onion",
  "garlic", "spinach", "carrot", "apple", "banana", "chickpea", "lentil", "bean",
  "olive oil", "honey", "yogurt", "chicken", "beef", "fish", "salt", "black pepper",
];

const NAME = (a: AdditiveProfile) => a;
void NAME; // keep tree-shaker honest; profiles are the export

export function lookupAdditive(rawName: string): AdditiveProfile | null {
  const lower = rawName.toLowerCase().trim();
  for (const a of ADDITIVES) {
    if (a.eNumbers?.some((e) => lower.replace(/[\s-]/g, "").includes(e))) return a;
    if (a.keywords.some((k) => lower.includes(k))) return a;
  }
  return null;
}

export function isWholeFood(rawName: string): boolean {
  const lower = rawName.toLowerCase().trim();
  // Only treat as whole food if no additive profile claims it.
  if (lookupAdditive(rawName)) return false;
  return WHOLEFOOD_KEYWORDS.some((k) => lower === k || lower.includes(k));
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
