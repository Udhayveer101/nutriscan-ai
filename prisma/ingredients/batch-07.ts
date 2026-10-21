// Expansion batch 07 — Pool 5: amino acids, nucleotides, omega-3 sources, other supplement nutrients.
import type { SeedIngredient } from "./types";
import { family } from "./build";
import { efsa, euNovelFoods, paper } from "./refs";

const NDA = "Dietetic Products, Nutrition and Allergies (NDA)";
const IOM = paper("Institute of Medicine", 2005, "Dietary Reference Intakes for Energy, Carbohydrate, Fiber, Fat, Fatty Acids, Cholesterol, Protein, and Amino Acids", "National Academies Press",
  "Sets protein and indispensable amino acid requirements; data were insufficient to set upper levels for individual amino acids.");

const amino = family({
  categorySlug: "nutrient", evidenceLevel: "MODERATE", isNatural: false,
  sciConsensus: "A normal dietary amino acid. No tolerable upper intake level has been set; isolated high doses are not recommended without need.",
  fdaStatus: "Permitted amino acid (21 CFR 172.320) or GRAS", efsaStatus: "Permitted in foods for specific groups and food supplements",
  fssaiStatus: "Permitted in health supplements/nutraceuticals", whoStatus: "No ADI (nutrient)", refs: [IOM],
});

const aa = (slug: string, name: string, aliases: string[], purposeShort: string, purpose: string, benefits: string, concerns: string, commonProducts: string[], safetyScore = 88, extra: Partial<SeedIngredient> = {}) =>
  amino({ slug, name, aliases, purposeShort, purpose, benefits, concerns, commonProducts, safetyScore, ...extra });

export const BATCH_07: SeedIngredient[] = [
  aa("l-leucine", "L-Leucine", ["leucine", "INS 641"], "Branched-chain amino acid that triggers muscle protein synthesis", "Added to protein powders and sports drinks; also a Codex-listed flavour enhancer (INS 641).",
    "Essential amino acid; leucine signals muscle protein synthesis.", "Very high doses compete with other amino acids; no UL set.", ["Protein powders", "BCAA drinks"]),
  aa("l-isoleucine", "L-Isoleucine", ["isoleucine"], "Branched-chain essential amino acid", "Part of BCAA blends in sports products.", "Essential amino acid.", "No known concern at supplement doses.", ["BCAA supplements"]),
  aa("l-valine", "L-Valine", ["valine"], "Branched-chain essential amino acid", "Part of BCAA blends in sports products.", "Essential amino acid.", "No known concern at supplement doses.", ["BCAA supplements"]),
  aa("bcaa", "Branched-Chain Amino Acids", ["BCAA", "BCAAs", "branched chain amino acids"], "Leucine-isoleucine-valine blend", "A mix of the three branched-chain amino acids sold for training and recovery.",
    "Supplies essential amino acids; benefits beyond adequate total protein intake are modest.", "No known concern at usual doses; whole protein supplies the same amino acids.", ["Sports drinks", "Pre-workout powders"]),
  aa("l-lysine", "L-Lysine Hydrochloride", ["L-lysine", "lysine hydrochloride", "lysine HCl", "INS 642"], "Essential amino acid often low in cereal diets", "Fortifies cereal foods and supplements; Codex-listed as a flavour enhancer (INS 642).",
    "Lysine is the limiting amino acid in wheat and rice protein.", "No known concern at usual doses.", ["Fortified cereals", "Supplements"]),
  aa("l-methionine", "L-Methionine", ["methionine", "DL-methionine"], "Sulphur-containing essential amino acid", "Used in infant formula, medical foods and supplements.",
    "Essential amino acid; often limiting in legume protein.", "Excess raises homocysteine; avoid high doses.", ["Infant formula", "Medical nutrition"], 84),
  aa("l-threonine", "L-Threonine", ["threonine"], "Essential amino acid", "Used in medical nutrition and supplements.", "Essential amino acid.", "No known concern at usual doses.", ["Medical nutrition", "Supplements"]),
  aa("l-tryptophan", "L-Tryptophan", ["tryptophan"], "Serotonin-precursor amino acid", "Sold as a sleep and mood supplement and used in medical nutrition.",
    "Essential amino acid; precursor of serotonin and niacin.", "A 1989 eosinophilia-myalgia epidemic was linked to a contaminated production batch. Can cause serotonin syndrome with antidepressants or MAO inhibitors.",
    ["Sleep supplements", "Medical nutrition"], 76,
    { refs: [paper("Belongia EA et al.", 1990, "An investigation of the cause of the eosinophilia-myalgia syndrome associated with tryptophan use", "New England Journal of Medicine 323(6):357–365", "Linked the 1989 EMS outbreak to L-tryptophan from a single manufacturer, implicating a contaminant.")] }),
  aa("l-phenylalanine", "L-Phenylalanine", ["phenylalanine"], "Essential amino acid that people with PKU must restrict", "Used in medical nutrition and some supplements.",
    "Essential amino acid; precursor of tyrosine.", "Dangerous for people with phenylketonuria (PKU), who must strictly limit it.", ["Supplements", "Medical nutrition"], 78),
  aa("l-histidine", "L-Histidine", ["histidine"], "Essential amino acid", "Used in medical nutrition and supplements.", "Essential amino acid; precursor of histamine and carnosine.", "No known concern at usual doses.", ["Medical nutrition"]),
  aa("l-arginine", "L-Arginine", ["arginine", "arginine alpha-ketoglutarate", "AAKG"], "Nitric-oxide precursor amino acid", "Sold in 'pump' sports supplements and medical nutrition.",
    "Conditionally essential; precursor of nitric oxide.", "High doses can cause gut upset; may lower blood pressure with antihypertensive drugs.", ["Pre-workout supplements", "Medical nutrition"], 84),
  aa("l-glutamine", "L-Glutamine", ["glutamine"], "Most abundant amino acid in the blood", "Used in sports and clinical nutrition.",
    "Conditionally essential during severe illness.", "No known concern at usual doses; sports-recovery claims are weak.", ["Protein powders", "Clinical nutrition"]),
  aa("l-alanine", "L-Alanine", ["alanine"], "Non-essential amino acid", "Used in clinical nutrition and as a flavour modifier.", "Common dietary amino acid.", "None known.", ["Clinical nutrition", "Flavourings"], 90),
  aa("beta-alanine", "Beta-Alanine", ["β-alanine", "CarnoSyn"], "Sports supplement that raises muscle carnosine", "Taken to buffer acid in muscle during high-intensity exercise.",
    "Raises muscle carnosine; modest performance benefit in some short high-intensity efforts.", "Causes harmless tingling (paraesthesia) at higher single doses.", ["Pre-workout powders"], 84),
  aa("l-aspartic-acid", "L-Aspartic Acid", ["aspartic acid", "aspartate"], "Non-essential amino acid", "Used in supplements and as a building block of aspartame.", "Common dietary amino acid.", "None known at usual doses.", ["Supplements"], 88),
  aa("l-cystine", "L-Cystine", ["cystine"], "Oxidised form of cysteine", "Used in hair and nail supplements and medical nutrition.", "Sulphur amino acid source.", "None known at usual doses.", ["Hair supplements"], 88),
  aa("l-proline", "L-Proline", ["proline"], "Collagen-building amino acid", "Used in supplements and clinical nutrition.", "Abundant in collagen.", "None known.", ["Supplements"], 90),
  aa("l-serine", "L-Serine", ["serine"], "Non-essential amino acid", "Used in clinical nutrition and supplements.", "Precursor of several brain lipids and amino acids.", "None known at usual doses.", ["Supplements"], 90),
  aa("l-tyrosine", "L-Tyrosine", ["tyrosine"], "Precursor of dopamine and thyroid hormones", "Sold as a focus supplement and used in PKU medical foods.",
    "Conditionally essential in PKU.", "May interact with MAO inhibitors and thyroid medication.", ["Focus supplements", "PKU formulas"], 86),
  aa("l-citrulline", "L-Citrulline", ["citrulline", "citrulline malate"], "Amino acid converted to arginine", "Sports supplement; naturally abundant in watermelon.", "Raises arginine and nitric oxide more reliably than arginine itself.", "No known concern at usual doses.", ["Pre-workout powders"]),
  aa("l-ornithine", "L-Ornithine", ["ornithine", "ornithine aspartate"], "Urea-cycle amino acid", "Sold in sports and 'hangover' supplements.", "Urea-cycle intermediate.", "Little evidence for marketed benefits.", ["Supplements"], 86),
  aa("creatine-monohydrate", "Creatine Monohydrate", ["creatine"], "Best-evidenced sports supplement", "Taken (typically 3–5 g/day) to increase muscle phosphocreatine.",
    "EU-authorised claim: 3 g/day improves physical performance in short-term, high-intensity repeated exercise.", "Water weight gain; no harm to healthy kidneys in trials, but people with kidney disease should seek advice.",
    ["Creatine powders", "Sports drinks"], 86, { evidenceLevel: "STRONG", refs: [efsa(NDA, "Scientific Opinion on the substantiation of health claims related to creatine and increase in physical performance during short-term, high intensity, repeated exercise bouts", 2011, "Cause-and-effect relationship established at 3 g/day.")] }),
  aa("gaba", "Gamma-Aminobutyric Acid", ["GABA", "gamma aminobutyric acid"], "Calming neurotransmitter sold as a supplement", "Added to some drinks and chocolate (common in Japan) and supplements.",
    "Natural in fermented foods; evidence for relaxation effects from oral GABA is weak because little crosses into the brain.", "Can lower blood pressure slightly; long-term high-dose data are limited.", ["Relaxation drinks", "Supplements"], 82, { evidenceLevel: "LIMITED" }),
  aa("l-theanine", "L-Theanine", ["theanine", "suntheanine"], "Tea amino acid sold for calm focus", "Naturally present in tea; added to drinks and supplements.",
    "Contributes to tea's umami taste; EFSA found claims on relaxation and cognition not substantiated.", "No known concern at usual doses.", ["Functional drinks", "Supplements", "Green tea"], 86,
    { refs: [efsa(NDA, "Scientific Opinion on the substantiation of health claims related to L-theanine", 2011, "Claims on cognitive function, relaxation and sleep not substantiated.")] }),
  // ── Infant-formula nucleotides ──
  ...([
    ["cytidine-monophosphate", "Cytidine 5'-Monophosphate", ["CMP", "cytidine monophosphate"]],
    ["uridine-monophosphate", "Uridine 5'-Monophosphate (disodium salt)", ["UMP", "disodium uridine 5'-monophosphate", "uridine monophosphate"]],
    ["adenosine-monophosphate", "Adenosine 5'-Monophosphate", ["AMP", "adenosine monophosphate"]],
  ] as [string, string, string[]][]).map(([slug, name, aliases]) => amino({
    slug, name, aliases, purposeShort: "Nucleotide added to infant formula", purpose: "Added to infant formula to approach nucleotide levels in breast milk.",
    benefits: "Breast-milk component; added to formula to support immune and gut development.", concerns: "None at formula levels, which are capped by regulation.",
    safetyScore: 90, commonProducts: ["Infant formula"], fdaStatus: "Used in infant formula", efsaStatus: "Permitted in infant formula within limits (Reg. (EU) 2016/127)",
    refs: [{ title: "Commission Delegated Regulation (EU) 2016/127 on compositional and information requirements for infant formula and follow-on formula", authors: "European Commission", journal: "Official Journal of the European Union, L 25", year: 2016, findings: "Permits nucleotides in infant formula up to specified maximum levels." }],
  })),
  // ── Omega-3 sources ──
  ...([
    ["fish-oil", "Fish Oil", ["refined fish oil", "omega-3 fish oil"], "Oily-fish oil rich in EPA and DHA", "Used in supplements and to fortify bread, milk, spreads and infant formula.", "Fish allergy; fishy aftertaste; high doses may prolong bleeding.", ["Omega-3 capsules", "Fortified spreads", "Infant formula"], false, 88],
    ["krill-oil", "Krill Oil", ["Euphausia superba oil", "Antarctic krill oil"], "Crustacean oil with phospholipid-bound omega-3", "Supplement oil from Antarctic krill.", "Crustacean allergen; sustainability concerns over krill harvesting.", ["Omega-3 capsules"], false, 84],
    ["algal-oil", "Algal Oil (DHA)", ["algae oil", "Schizochytrium oil", "DHA algal oil", "microalgae oil"], "Vegan DHA oil from microalgae", "Fermented microalgae oil used in vegan omega-3 supplements and infant formula.", "No allergen issue; authorised as a novel food with conditions of use.", ["Vegan omega-3", "Infant formula", "Fortified milk"], true, 90],
    ["cod-liver-oil", "Cod Liver Oil", ["cod-liver oil"], "Omega-3 oil also high in vitamins A and D", "Traditional supplement from cod livers.", "High preformed vitamin A: pregnant women should avoid it or keep within limits. Fish allergen.", ["Cod liver oil capsules"], false, 80],
    ["docosahexaenoic-acid", "Docosahexaenoic Acid (DHA)", ["DHA", "docosahexaenoic acid"], "Omega-3 fatty acid of brain and retina", "Purified or concentrated DHA in infant formula and supplements.", "None at usual intakes; source determines allergen status.", ["Infant formula", "Prenatal supplements"], true, 90],
    ["eicosapentaenoic-acid", "Eicosapentaenoic Acid (EPA)", ["EPA", "eicosapentaenoic acid"], "Omega-3 fatty acid concentrate", "Purified or concentrated EPA in supplements.", "High-dose prescription EPA increases atrial fibrillation risk slightly; supplement doses are lower.", ["Omega-3 concentrates"], true, 88],
  ] as [string, string, string[], string, string, string, string[], boolean, number][]).map(([slug, name, aliases, purposeShort, purpose, concerns, commonProducts, isVegan, safetyScore]) => ({
    slug, name, aliases, eNumber: null, categorySlug: "oil-fat", purposeShort, purpose,
    benefits: "Supplies EPA and/or DHA; EU-authorised claims cover normal heart function (250 mg EPA+DHA/day) and DHA for normal brain function and vision.",
    concerns, sciConsensus: "EFSA: supplemental EPA+DHA up to 5 g/day raises no safety concern for adults.",
    evidenceLevel: "STRONG" as const, fdaStatus: "GRAS (menhaden and other fish oils; algal oils via GRAS notices)", efsaStatus: "Food ingredient; algal and krill oils authorised as novel foods",
    fssaiStatus: "Permitted in nutraceuticals", whoStatus: "No ADI (food lipid)", safetyScore, commonProducts, adiValue: "EPA+DHA up to 5 g/day without concern (EFSA)",
    isNatural: true, isVegan,
    refs: [efsa(NDA, "Scientific Opinion on the Tolerable Upper Intake Level of eicosapentaenoic acid (EPA), docosahexaenoic acid (DHA) and docosapentaenoic acid (DPA)", 2012, "Supplemental intakes of EPA+DHA up to 5 g/day do not raise safety concerns for adults."),
      ...(slug === "algal-oil" || slug === "krill-oil" ? [euNovelFoods("Krill oil and Schizochytrium oil listed with specifications and conditions of use.")] : [])],
  })),
  // ── Other supplement nutrients ──
  { slug: "coenzyme-q10", name: "Coenzyme Q10", aliases: ["CoQ10", "ubiquinone", "ubidecarenone", "ubiquinol"], eNumber: null, categorySlug: "nutrient",
    purposeShort: "Energy-metabolism compound sold as a supplement", purpose: "Taken as a supplement, often by people on statins; added to some functional foods.",
    benefits: "Made by the body; EFSA found claimed benefits for energy, heart and blood pressure not substantiated.", concerns: "Well tolerated; may weaken the effect of warfarin.",
    sciConsensus: "Safe at usual supplement doses; efficacy claims not authorised in the EU.", evidenceLevel: "MODERATE",
    fdaStatus: "Dietary supplement ingredient; GRAS notice for food use", efsaStatus: "Food supplement ingredient; health claims rejected", fssaiStatus: "Permitted in nutraceuticals", whoStatus: "No ADI",
    safetyScore: 86, commonProducts: ["CoQ10 capsules", "Heart-health supplements"], adiValue: null, isNatural: false, isVegan: true,
    refs: [efsa(NDA, "Scientific Opinion on the substantiation of health claims related to coenzyme Q10", 2010, "Claims on energy-yielding metabolism, heart function and blood pressure not substantiated.")] },
  { slug: "astaxanthin", name: "Astaxanthin", aliases: ["Haematococcus pluvialis extract", "astaxanthin-rich oleoresin"], eNumber: null, categorySlug: "nutrient",
    purposeShort: "Red carotenoid from algae, salmon-feed colour and supplement", purpose: "Sold as an antioxidant supplement; in feed it gives farmed salmon its pink colour.",
    benefits: "Antioxidant carotenoid; claimed eye, skin and exercise benefits are not authorised.", concerns: "EFSA set a safe supplement amount of 8 mg/day for adults.",
    sciConsensus: "Safe up to 8 mg/day as a novel-food supplement (EFSA 2020).", evidenceLevel: "MODERATE",
    fdaStatus: "Supplement ingredient (algal sources via GRAS/NDI)", efsaStatus: "Authorised novel food for supplements (max 8 mg/day)", fssaiStatus: "Permitted in nutraceuticals", whoStatus: "No ADI",
    safetyScore: 86, commonProducts: ["Antioxidant supplements"], adiValue: "8 mg/day in supplements (EFSA 2020)", isNatural: true, isVegan: true,
    refs: [efsa(NDA, "Safety of astaxanthin for its use as a novel food in food supplements", 2020, "Intake of 8 mg/day from supplements is safe for adults.")] },
  { slug: "zeaxanthin", name: "Zeaxanthin", aliases: ["meso-zeaxanthin", "synthetic zeaxanthin"], eNumber: null, categorySlug: "nutrient",
    purposeShort: "Eye carotenoid sold with lutein", purpose: "Supplement carotenoid, usually combined with lutein for eye health.",
    benefits: "Concentrates in the macula; EU eye-health claims are not authorised.", concerns: "None known at supplement doses within authorised limits.",
    sciConsensus: "Authorised as a novel food for supplements within set daily amounts.", evidenceLevel: "MODERATE",
    fdaStatus: "GRAS notices", efsaStatus: "Authorised novel food for supplements", fssaiStatus: "Permitted in nutraceuticals", whoStatus: "Evaluated with lutein by JECFA",
    safetyScore: 88, commonProducts: ["Eye-health supplements"], adiValue: null, isNatural: true, isVegan: true,
    refs: [euNovelFoods("Synthetic zeaxanthin listed for use in food supplements with a maximum daily amount.")] },
];
