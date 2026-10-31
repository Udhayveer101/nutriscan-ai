// Expansion batch 29 — Pool 7: remaining spices, EU-authorised insects and novel foods, restricted botanicals, areca nut.
import type { SeedIngredient, SeedRef } from "./types";
import { wholeFoods } from "./whole";
import { euAllergens, euNovelFoods, efsa, iarc } from "./refs";
import { SPICE_RISK, ISO676 } from "./batch-10";
import { fruit } from "./batch-12";
import { veg } from "./batch-14";

const SMALL = "None at culinary amounts. Like all dried spices it can carry Salmonella if not heat- or steam-treated.";
const spice = wholeFoods("spice-herb", {
  refs: [SPICE_RISK, ISO676],
  concerns: SMALL,
  benefits: "Adds flavour and aroma without salt or sugar; used in amounts too small to matter nutritionally.",
});

// EU novel-food authorisations for insects (Implementing Regulations amending the Union list, 2017/2470).
const insectReg = (no: string, species: string, forms: string): SeedRef => ({
  title: `Commission Implementing Regulation (EU) ${no} authorising the placing on the market of ${species} as a novel food`, authors: "European Commission",
  journal: "Official Journal of the European Union", year: Number(no.slice(0, 4)), url: `https://eur-lex.europa.eu/eli/reg_impl/${no}/oj`,
  findings: `Authorises ${forms} under Regulation (EU) 2015/2283, with labelling that the food may cause reactions in people allergic to crustaceans, molluscs and dust mites.` });
const INSECT_C = "Can cause allergic reactions in people allergic to crustaceans, molluscs or dust mites (EU labelling requirement).";
const insect = wholeFoods("meat-seafood", {
  isVegan: false, concerns: INSECT_C,
  benefits: "High in protein, with fibre (chitin), iron, zinc and B vitamins.",
  sciConsensus: "An EU-authorised novel food (Regulation (EU) 2015/2283). EFSA concluded it is safe under the proposed conditions of use; the main risk is allergy.",
});

const oil = wholeFoods("oil-fat", { refs: [] });

const ANNEX_III = "Regulation (EC) No 1925/2006 Annex III";
const reg = (no: string, subject: string, findings: string): SeedRef => ({
  title: `Commission Regulation (EU) ${no} amending Annex III to Regulation (EC) No 1925/2006 as regards ${subject}`, authors: "European Commission",
  journal: "Official Journal of the European Union", year: Number(no.slice(0, 4)), url: `https://eur-lex.europa.eu/eli/reg/${no}/oj`, findings });
const HAD_REG = reg("2021/468", "botanical species containing hydroxyanthracene derivatives",
  "Prohibits aloe-emodin, emodin, danthron and aloe-leaf preparations containing hydroxyanthracene derivatives in food (Part A) and places senna, cascara, frangula and rhubarb-root preparations under scrutiny (Part C).");
const HAD_EFSA = efsa("Food Additives and Nutrient Sources added to Food (ANS)", "Safety of hydroxyanthracene derivatives for use in food", 2018,
  "Aloe-emodin, emodin and danthron are genotoxic and aloe extracts are carcinogenic in rats; no safe daily intake of hydroxyanthracene derivatives could be set.", "10.2903/j.efsa.2018.5090");
const kb = { isNatural: true, isVegan: true, adiValue: null, eNumber: null, categorySlug: "botanical" } as const;

export const BATCH_29: SeedIngredient[] = [
  ...spice([
    ["Sichuan Pepper", ["sichuan peppercorns", "szechuan pepper", "szechuan peppercorns", "huajiao", "timur", "zanthoxylum"], "Numbing citrusy husk spice", "Dried husks of Zanthoxylum species that make the mouth tingle; used in Sichuan cooking and Nepali timur chutney.", "", SMALL, ["Mapo tofu", "Chilli oil", "Five-spice"], 92, { src: "own" }],
    ["Galangal", ["galanga", "alpinia galanga", "thai ginger", "laos root"], "Piney ginger-like rhizome", "Rhizome of Alpinia galanga used fresh or dried in Thai, Indonesian and Malaysian curries and soups.", "", SMALL, ["Tom kha", "Curry pastes", "Rendang"], 92, { src: "own" }],
    ["Cubeb", ["cubeb pepper", "tailed pepper", "java pepper", "piper cubeba", "kabab chini"], "Peppery tailed berry", "Dried berries of Piper cubeba used in North African ras el hanout and Indonesian cooking.", "", SMALL, ["Ras el hanout", "Gin botanicals"], 92, { src: "own" }],
    ["Grains of Paradise", ["melegueta pepper", "aframomum melegueta", "guinea grains"], "Peppery West African seed", "Seeds of Aframomum melegueta used in West African cooking, spice blends and beer.", "", SMALL, ["Spice blends", "Beer", "Gin"], 92, { src: "own" }],
    ["Sumac", ["sumac powder", "sumach", "rhus coriaria", "summaq"], "Tart red berry spice", "Ground dried berries of Rhus coriaria sprinkled on kebabs, salads (fattoush) and za'atar.", "", "None at culinary amounts. Culinary sumac is unrelated to poison sumac (Toxicodendron).", ["Za'atar", "Fattoush", "Kebabs"], 92, { src: "own" }],
    ["Pink Peppercorns", ["pink pepper", "pink peppercorn", "baies roses", "schinus terebinthifolius", "schinus molle"], "Sweet peppery dried berry", "Dried berries of Schinus species added to peppercorn mixes and desserts.", "",
      "Not a true pepper: it belongs to the cashew family, so people allergic to cashew or pistachio may react.", ["Peppercorn blends", "Desserts"], 88, { src: "own" }],
    ["Black Lime", ["loomi", "dried lime", "noomi basra", "limoo amani"], "Whole lime dried until black", "Limes boiled in brine and sun-dried; used whole or ground in Persian and Gulf stews and rice.", "", SMALL, ["Ghormeh sabzi", "Machboos"], 92],
  ]),
  ...insect([
    ["House Cricket", ["acheta domesticus", "cricket powder", "cricket flour", "dried crickets"], "Edible cricket (EU novel food)", "Frozen, dried or powdered crickets used in protein bars, pasta and snacks.", "", "", ["Protein bars", "Cricket pasta", "Snacks"], 86, { src: "own", refs: [insectReg("2022/188", "frozen, dried and powder forms of Acheta domesticus", "frozen, dried and powdered house cricket")] }],
    ["Yellow Mealworm", ["mealworm", "mealworms", "tenebrio molitor", "dried mealworm larvae"], "Edible beetle larva (EU novel food)", "Dried mealworm larvae eaten whole as a snack or ground into flour.", "", "", ["Snacks", "Insect flour", "Protein bars"], 86, { src: "own", refs: [insectReg("2021/882", "dried Tenebrio molitor larva", "dried yellow mealworm larvae")] }],
    ["Migratory Locust", ["locusta migratoria", "edible locust", "dried locusts"], "Edible locust (EU novel food)", "Frozen, dried or powdered locusts eaten as snacks or ground into flour.", "", "", ["Snacks", "Insect flour"], 86, { src: "own", refs: [insectReg("2021/1975", "frozen, dried and powder forms of Locusta migratoria", "frozen, dried and powdered migratory locust")] }],
    ["Lesser Mealworm", ["alphitobius diaperinus", "buffalo worm", "buffalo worms"], "Edible beetle larva (EU novel food)", "Frozen, paste, dried or powdered larvae used in snacks and processed foods.", "", "", ["Snacks", "Insect flour"], 86, { src: "own", refs: [insectReg("2023/58", "frozen, paste, dried and powder forms of Alphitobius diaperinus larvae", "frozen, paste, dried and powdered lesser mealworm larvae")] }],
  ]),
  ...fruit([
    ["Baobab", ["baobab fruit pulp", "baobab powder", "baobab fruit", "adansonia digitata"], "Dry powdery African tree fruit", "Naturally dried fruit pulp of Adansonia digitata used in smoothies, bars and drinks.", "Fibre, vitamin C and potassium.", "None.", ["Smoothies", "Snack bars", "Drinks"], 94,
      { src: "own", refs: [euNovelFoods("Dried baobab fruit pulp is on the Union list of authorised novel foods.")] }],
    ["Noni", ["noni juice", "noni fruit", "morinda citrifolia"], "Pungent Pacific fruit sold as juice", "Fruit of Morinda citrifolia sold mainly as pasteurised juice.", "Vitamin C and potassium.", "No authorised health claims despite heavy marketing.", ["Noni juice"], 90,
      { src: "own", refs: [euNovelFoods("Noni juice (Morinda citrifolia) is on the Union list of authorised novel foods.")] }],
    ["Lingonberries", ["lingonberry", "cowberries", "vaccinium vitis-idaea"], "Tart red Nordic berry", "Made into jam served with meatballs and game, or eaten in porridge.", "", "None. Lingonberry jam is mostly sugar.", ["Lingonberry jam", "Meatballs"], 94],
    ["Cloudberries", ["cloudberry", "bakeapple", "rubus chamaemorus"], "Amber Arctic berry", "Wild berries eaten fresh, as jam or in liqueur in Scandinavia and Canada.", "", "None.", ["Jam", "Desserts"], 94],
    ["Rose Hips", ["rosehip", "rosehips", "rose hip", "rosa canina fruit"], "Fruit of the wild rose", "Made into syrups, teas, soups and jams.", "Very rich in vitamin C.", "Irritant hairs around the seeds must be removed.", ["Rosehip syrup", "Rosehip tea", "Nyponsoppa"], 94],
    ["Kiwano", ["horned melon", "jelly melon", "cucumis metuliferus"], "Spiky orange melon with green jelly", "Pulp scooped and eaten fresh or in drinks.", "", "None.", ["Fresh fruit", "Drinks"], 96],
    ["Loganberries", ["loganberry", "rubus loganobaccus"], "Raspberry-blackberry hybrid", "Eaten fresh or made into jam and pies.", "", "None.", ["Jam", "Pies"], 96],
  ]),
  ...veg([
    ["Salsify", ["oyster plant", "black salsify", "scorzonera", "tragopogon porrifolius"], "Long slender root vegetable", "Peeled roots boiled, roasted or added to gratins.", "Inulin, fibre and potassium.", "None.", ["Gratins", "Roasted roots"], 96],
  ]),
  ...oil([
    ["Sacha Inchi Oil", ["sacha inchi", "plukenetia volubilis oil", "inca inchi oil"], "Seed oil from the Amazonian sacha inchi plant", "Cold-pressed oil used in dressings and supplements.", "Rich in plant omega-3 (ALA).", "None known at food amounts.", ["Dressings", "Supplements"], 90,
      { src: "own", refs: [euNovelFoods("Sacha inchi oil (Plukenetia volubilis) is on the Union list of authorised novel foods.")] }],
  ]),
  { ...kb, slug: "areca-nut", name: "Areca Nut", aliases: ["betel nut", "supari", "pan masala", "paan masala", "areca catechu", "arecoline"],
    purposeShort: "Chewed palm seed classed as a human carcinogen", purpose: "Seed of the areca palm chewed alone, in paan, in pan masala and in sweetened supari mouth-freshener mixes.",
    benefits: "None.", concerns: "IARC Group 1 carcinogen even without tobacco: causes mouth and oesophageal cancer and oral submucous fibrosis. Addictive. Sweetened supari is marketed to children.",
    sciConsensus: "IARC classifies areca nut as carcinogenic to humans (Group 1), with or without tobacco.", evidenceLevel: "STRONG",
    fdaStatus: "No food-ingredient authorisation", efsaStatus: "Not authorised as a food", fssaiStatus: "Tobacco and nicotine prohibited as food ingredients (FSS Reg. 2.3.4)",
    whoStatus: "IARC Group 1 (Vol. 85, 100E)", safetyScore: 8, commonProducts: ["Pan masala", "Supari mixes", "Mukhwas"],
    refs: [iarc(85, "Betel-quid and Areca-nut Chewing and Some Areca-nut-derived Nitrosamines", 2004, "Areca nut is carcinogenic to humans (Group 1); causes oral cancer and oral submucous fibrosis."),
      iarc(100, "Personal Habits and Indoor Combustions (Vol. 100E)", 2012, "Reaffirmed betel quid with and without tobacco, and areca nut, as Group 1 carcinogens.")] },
  { ...kb, slug: "ephedra", name: "Ephedra", aliases: ["ma huang", "ephedra sinica", "ephedrine", "ephedrine alkaloids"],
    purposeShort: "Banned stimulant herb", purpose: "Herb containing ephedrine, formerly sold in weight-loss, energy and sports supplements.",
    benefits: "None in food.", concerns: "Linked to strokes, heart attacks, arrhythmias and deaths. Banned in food in the EU and in US dietary supplements.",
    sciConsensus: "Banned by the FDA (2004) and the EU (2015) after serious cardiovascular harm.", evidenceLevel: "STRONG",
    fdaStatus: "Supplements with ephedrine alkaloids are adulterated (banned 2004)", efsaStatus: "Prohibited (Annex III Part A, Reg. 2015/403)", fssaiStatus: "Not permitted",
    whoStatus: "No ADI", safetyScore: 6, commonProducts: ["Illegal weight-loss supplements", "Pre-workouts"],
    refs: [{ title: "Final Rule Declaring Dietary Supplements Containing Ephedrine Alkaloids Adulterated Because They Present an Unreasonable Risk", authors: "U.S. Food and Drug Administration", journal: "Federal Register 69(28):6788–6854", year: 2004,
      findings: "Ephedrine-alkaloid supplements raise blood pressure and heart rate and present an unreasonable risk of illness or injury; their sale is prohibited." },
      reg("2015/403", "Ephedra species and Yohimbe (Pausinystalia yohimbe (K. Schum) Pierre ex Beille)", "Places the herb Ephedra and its preparations in Part A (prohibited).")] },
  { ...kb, slug: "yohimbe", name: "Yohimbe", aliases: ["yohimbe bark", "yohimbine", "pausinystalia yohimbe", "corynanthe yohimbe"],
    purposeShort: "Banned bark stimulant", purpose: "Bark extract sold in libido, fat-burner and pre-workout supplements.",
    benefits: "None in food.", concerns: "Raises blood pressure and heart rate; causes anxiety and arrhythmias. EFSA could not set a safe intake, and the EU bans it in food.",
    sciConsensus: "EFSA (2013) could not conclude on a safe intake; the EU prohibited yohimbe in food in 2019.", evidenceLevel: "MODERATE",
    fdaStatus: "No food-ingredient authorisation", efsaStatus: "Prohibited (Annex III Part A, Reg. 2019/650)", fssaiStatus: "Not permitted",
    whoStatus: "No ADI", safetyScore: 12, commonProducts: ["Libido supplements", "Fat burners", "Pre-workouts"],
    refs: [efsa("Food Additives and Nutrient Sources added to Food (ANS)", "Scientific Opinion on the evaluation of the safety in use of Yohimbe (Pausinystalia yohimbe (K. Schum.) Pierre ex Beille)", 2013,
      "Could not conclude on a safe intake; yohimbine causes raised blood pressure, tachycardia and anxiety, and labelled contents were unreliable."),
      reg("2019/650", "Yohimbe (Pausinystalia yohimbe (K. Schum) Pierre ex Beille)", "Places yohimbe bark and its preparations in Part A (prohibited).")] },
  { ...kb, slug: "aloe-emodin-hads", name: "Aloe Latex (aloe-emodin, emodin, danthron)", aliases: ["aloe-emodin", "aloe emodin", "emodin", "danthron", "dantron", "aloin", "aloe latex", "aloe leaf latex"],
    purposeShort: "Banned laxative anthranoids", purpose: "Yellow latex from under aloe leaf skin and related anthranoid compounds, once used as laxatives and in some aloe drinks.",
    benefits: "None in food.", concerns: "Genotoxic; aloe extract is carcinogenic in rats. Banned in food in the EU. Decolourised inner-leaf aloe vera gel is a different product.",
    sciConsensus: "EFSA (2018) found aloe-emodin, emodin and danthron genotoxic and could not set a safe intake; the EU prohibits them in food.", evidenceLevel: "MODERATE",
    fdaStatus: "Aloe laxatives removed from OTC monograph (2002)", efsaStatus: `Prohibited (${ANNEX_III} Part A, Reg. 2021/468)`, fssaiStatus: "Not permitted",
    whoStatus: "Danthron IARC Group 2B", safetyScore: 12, commonProducts: ["Aloe drinks (older formulations)", "Detox supplements"],
    refs: [HAD_EFSA, HAD_REG, iarc(50, "Pharmaceutical Drugs (danthron)", 1990, "Danthron classified as possibly carcinogenic to humans (Group 2B).")] },
  { ...kb, slug: "anthranoid-laxative-herbs", name: "Senna, Cascara & Frangula", aliases: ["senna", "senna leaf", "senna pods", "cassia senna", "sennosides", "cascara", "cascara sagrada", "rhamnus purshiana", "frangula", "frangula bark", "rhamnus frangula", "buckthorn bark", "alder buckthorn", "rhubarb root", "rheum palmatum", "rheum officinale"],
    purposeShort: "Stimulant-laxative herbs in 'detox' teas", purpose: "Herbs whose hydroxyanthracene glycosides stimulate the bowel; sold in laxative, slimming and 'detox' teas.",
    benefits: "Effective short-term laxatives as authorised herbal medicines.", concerns: "Daily use causes diarrhoea, potassium loss and dependence; some anthranoids are genotoxic. Under EU scrutiny in food; avoid in pregnancy and in children.",
    sciConsensus: "EFSA (2018) could not set a safe intake for hydroxyanthracene derivatives; the EU placed these herbs under scrutiny in food.", evidenceLevel: "MODERATE",
    fdaStatus: "Senna is an OTC laxative drug ingredient", efsaStatus: `Under scrutiny (${ANNEX_III} Part C, Reg. 2021/468)`, fssaiStatus: "Not permitted in foods for daily use",
    whoStatus: "No ADI", safetyScore: 38, commonProducts: ["Detox teas", "Slimming teas", "Laxative teas"],
    refs: [HAD_EFSA, HAD_REG] },
];
