// Expansion batch 10 — Pool 6: whole spices (seeds, fruits, barks, flowers).
import type { SeedIngredient, SeedRef } from "./types";
import { wholeFoods } from "./whole";
import { euAllergens, efsa } from "./refs";

export const SPICE_RISK: SeedRef = { title: "FDA Risk Profile: Pathogens and Filth in Spices", authors: "U.S. Food and Drug Administration", journal: "FDA Center for Food Safety and Applied Nutrition", year: 2017,
  url: "https://www.fda.gov/food/cfsan-risk-safety-assessments/fda-risk-profile-pathogens-and-filth-spices",
  findings: "Imported spices had a higher Salmonella and filth prevalence than other FDA-regulated foods; recommends validated pathogen-reduction treatments." };
const CODEX_CUMIN: SeedRef = { title: "Standard for Cumin (CXS 327-2017)", authors: "Codex Alimentarius Commission", journal: "Codex Alimentarius", year: 2017,
  url: "https://www.fao.org/fao-who-codexalimentarius/", findings: "Defines whole and ground cumin (Cuminum cyminum) and its quality criteria." };
export const ISO676: SeedRef = { title: "ISO 676: Spices and condiments — Botanical nomenclature", authors: "International Organization for Standardization", journal: "ISO standards", year: 1995,
  findings: "Lists the accepted botanical names of plants used as spices and condiments." };
const ESTRAGOLE: SeedRef = { title: "Opinion of the Scientific Committee on Food on Estragole (1-Allyl-4-methoxybenzene)", authors: "Scientific Committee on Food (European Commission)", journal: "SCF opinions", year: 2001,
  findings: "Estragole is genotoxic and carcinogenic in rodents; exposure should be reduced, though the contribution from culinary herbs and spices is small." };
const POPPY = efsa("Contaminants in the Food Chain (CONTAM)", "Update of the Scientific Opinion on opium alkaloids in poppy seeds", 2018,
  "Set an acute reference dose of 10 µg morphine/kg bw; heavily contaminated, unwashed poppy seeds can exceed it.");

const spice = wholeFoods("spice-herb", {
  refs: [SPICE_RISK],
  concerns: "None at culinary amounts. Like all dried spices it can carry Salmonella if not heat- or steam-treated.",
  benefits: "Adds flavour and aroma without salt or sugar; used in amounts too small to matter nutritionally.",
});

const SMALL = "None at culinary amounts. Like all dried spices it can carry Salmonella if not heat- or steam-treated.";

export const BATCH_10: SeedIngredient[] = [
  ...spice([
    ["Coriander Seed", ["coriander seeds", "ground coriander", "dhania powder"], "Citrusy seed spice", "Whole or ground seed of Coriandrum sativum used in curries, sausages, pickles and spice blends.", "", SMALL, ["Curry powder", "Pickles", "Spice blends"], 92],
    ["Cumin Seed", ["cumin seeds", "ground cumin", "jeera"], "Earthy seed spice", "Seed of Cuminum cyminum used in Indian, Middle Eastern and Mexican cooking.", "",
      "None at culinary amounts. Ground cumin has been recalled for undeclared peanut/almond contamination (a risk for nut-allergic people); can carry Salmonella if untreated.", ["Curry powder", "Chilli powder blends", "Falafel"], 90, { refs: [CODEX_CUMIN] }],
    ["Cloves", ["whole cloves", "ground cloves", "laung"], "Pungent dried flower bud", "Dried flower buds of Syzygium aromaticum used in baking, spice blends and mulled drinks.", "",
      "None at culinary amounts. Concentrated clove oil (eugenol) is toxic if swallowed in quantity, especially by children.", ["Garam masala", "Gingerbread", "Mulled wine"], 90],
    ["Nutmeg", ["ground nutmeg", "jaiphal"], "Warm, sweet seed spice", "Seed kernel of Myristica fragrans used in baking, sauces and spice blends.", "",
      "Safe at culinary amounts (a pinch). Several grams or more causes myristicin poisoning: nausea, palpitations and hallucinations.", ["Béchamel", "Eggnog", "Pumpkin spice"], 82],
    ["Mace", ["ground mace", "javitri"], "Lacy aril around the nutmeg seed", "The dried red aril surrounding nutmeg, used in baking, sausages and Indian cooking.", "",
      "Safe at culinary amounts; like nutmeg it contains myristicin, which is toxic in large doses.", ["Sausages", "Biryani masala", "Baked goods"], 84],
    ["Long Pepper", ["pippali", "piper longum"], "Hot, sweet catkin-shaped pepper", "Dried fruit spikes of Piper longum used in Indian and North African cooking.", "", SMALL, ["Spice blends", "Pickles"], 90, { refs: [ISO676] }],
    ["Allspice", ["ground allspice", "jamaica pepper"], "Berry tasting of clove, cinnamon and nutmeg", "Dried berries of Pimenta dioica used in Caribbean jerk, baking and pickling.", "", SMALL, ["Jerk seasoning", "Mixed spice", "Pickling spice"], 92],
    ["Star Anise", ["star aniseed", "illicium verum", "chakra phool"], "Star-shaped licorice-flavoured fruit", "Dried star-shaped fruit of Illicium verum used in Chinese five-spice, pho and biryani.", "",
      "Safe as Chinese star anise. The FDA warned (2003) against star-anise teas after illness linked to contamination with toxic Japanese star anise (Illicium anisatum).", ["Five-spice powder", "Pho", "Biryani"], 86, { refs: [ISO676] }],
    ["Anise Seed", ["aniseed", "anise", "pimpinella anisum"], "Licorice-flavoured seed", "Seed of Pimpinella anisum used in baking, liqueurs and sweets.", "",
      "None at culinary amounts. Contains small amounts of estragole, which is genotoxic in rodents at high doses.", ["Biscotti", "Liqueurs", "Sweets"], 90, { refs: [ESTRAGOLE] }],
    ["Fennel Seed", ["fennel seeds", "saunf", "sweet fennel seed"], "Sweet anise-like seed", "Seed of Foeniculum vulgare used in sausages, breads, curries and as an after-meal digestive.", "",
      "None at culinary amounts. Contains estragole; regulators advise against long-term high intake of fennel teas, especially for infants.", ["Italian sausage", "Panch phoron", "Mukhwas"], 88, { refs: [ESTRAGOLE] }],
    ["Caraway Seed", ["caraway", "caraway seeds", "carum carvi"], "Earthy anise-like seed", "Seed of Carum carvi used in rye bread, sauerkraut and cheeses.", "", SMALL, ["Rye bread", "Sauerkraut", "Havarti"], 92],
    ["Dill Seed", ["dill seeds"], "Seed of the dill plant", "Seed of Anethum graveolens used in pickles and breads.", "", SMALL, ["Dill pickles", "Breads"], 92],
    ["Celery Seed", ["celery seeds", "ground celery seed"], "Bitter, savoury seed", "Seed of Apium graveolens used in pickles, coleslaw and celery salt.", "",
      "Celery (including seed) is a declarable EU allergen and can cause severe reactions in sensitised people.", ["Celery salt", "Pickles", "Coleslaw dressing"], 84, { refs: [euAllergens("Celery and celery products are declarable allergens.")] }],
    ["Nigella Seed", ["nigella", "kalonji", "nigella sativa", "black onion seed"], "Small black oniony seed", "Seed of Nigella sativa sprinkled on naan and used in pickles and panch phoron.", "", SMALL, ["Naan", "Pickles", "Panch phoron"], 92, { refs: [ISO676] }],
    ["Ajwain", ["carom seeds", "ajowan", "bishop's weed"], "Thyme-flavoured seed", "Seed of Trachyspermum ammi used in Indian breads, snacks and fritters.", "", SMALL, ["Parathas", "Namkeen", "Pakoras"], 92, { refs: [ISO676] }],
    ["Fenugreek Seed", ["fenugreek seeds", "methi seeds", "methi dana"], "Bitter, maple-scented seed", "Seed of Trigonella foenum-graecum used in curries, pickles and spice blends.", "",
      "None at culinary amounts. Can cross-react in peanut-allergic people. Fenugreek sprouts were the source of the 2011 E. coli O104:H4 outbreak in Europe.", ["Curry powder", "Pickles", "Sambar powder"], 88],
    ["Mustard Seed", ["mustard seeds", "yellow mustard seed", "brown mustard seed", "black mustard seed"], "Pungent seed of mustard plants", "Seeds of Sinapis alba or Brassica juncea/nigra used whole in tempering and ground for mustard.", "",
      "Mustard is a declarable EU allergen; reactions can be severe.", ["Prepared mustard", "Pickles", "Tadka"], 84, { refs: [euAllergens("Mustard and mustard products are declarable allergens.")] }],
    ["Cayenne Pepper", ["cayenne", "ground cayenne"], "Hot ground red chilli", "Dried, ground hot chillies (Capsicum annuum) used to add heat.", "",
      "Capsaicin causes burning and can trigger reflux or gut discomfort in sensitive people; otherwise none at culinary amounts.", ["Hot sauces", "Spice rubs", "Snacks"], 90],
    ["Chilli Flakes", ["red pepper flakes", "crushed red pepper", "chili flakes"], "Crushed dried chillies", "Dried chillies crushed with their seeds, sprinkled on pizza and added to sauces.", "",
      "Capsaicin can irritate the gut in sensitive people. Dried chillies are prone to aflatoxin and Sudan-dye adulteration when poorly sourced.", ["Pizza", "Arrabbiata sauce", "Chilli oil"], 88],
    ["Smoked Paprika", ["pimentón", "pimenton", "smoked sweet paprika"], "Paprika dried over oak smoke", "Spanish-style paprika made from peppers dried over wood smoke.", "",
      "Smoke-drying can leave polycyclic aromatic hydrocarbons; EU limits apply to smoked foods. Otherwise none at culinary amounts.", ["Chorizo", "Patatas bravas", "Barbecue rubs"], 86],
    ["Saffron", ["saffron threads", "kesar", "crocus sativus"], "Dried stigmas of the saffron crocus", "Hand-picked stigmas of Crocus sativus that colour and flavour rice dishes, sweets and drinks.", "",
      "Safe at culinary amounts (milligrams). Doses of several grams are toxic. Frequently adulterated with safflower, dyed fibres or turmeric.", ["Paella", "Biryani", "Kesar sweets"], 88],
    ["Juniper Berries", ["juniper berry", "juniperus communis"], "Piney berry-like cone", "Dried cones of Juniperus communis used in gin, sauerkraut and game dishes.", "", SMALL, ["Gin", "Sauerkraut", "Game marinades"], 90, { refs: [ISO676] }],
    ["Poppy Seed", ["poppy seeds", "khus khus", "khas khas"], "Tiny blue or white seed of the opium poppy", "Seed of Papaver somniferum used on bread, in cakes and in Indian gravies.", "",
      "The seeds themselves contain little morphine, but surface contamination with opium alkaloids can exceed the EFSA acute reference dose in unwashed seeds; large amounts can also trigger positive drug tests.", ["Bagels", "Poppy seed cake", "Korma"], 80, { refs: [POPPY] }],
    ["Black Cardamom", ["badi elaichi", "brown cardamom", "amomum subulatum"], "Smoky large cardamom pod", "Smoke-dried pods of Amomum subulatum used in biryani, garam masala and Sichuan cooking.", "", SMALL, ["Garam masala", "Biryani"], 92, { refs: [ISO676] }],
    ["Vanilla Pod", ["vanilla bean", "vanilla beans", "vanilla pods"], "Cured seed pod of the vanilla orchid", "Fermented and cured pods of Vanilla planifolia; the seeds are scraped into desserts.", "",
      "None. Real vanilla is costly, so 'vanilla flavour' is usually synthetic vanillin instead.", ["Ice cream", "Custard", "Baked goods"], 94],
  ]),
];
