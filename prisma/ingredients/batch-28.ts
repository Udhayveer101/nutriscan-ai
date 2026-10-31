// Expansion batch 28 — Pool 6: more cheeses, fish species, shellfish, game and offal.
import type { SeedIngredient, SeedRef } from "./types";
import { wholeFoods } from "./whole";
import { euAllergens, efsa, iarc } from "./refs";
import { MILK } from "./batch-20";

const WHO_SFA: SeedRef = { title: "Saturated fatty acid and trans-fatty acid intake for adults and children: WHO guideline", authors: "World Health Organization", journal: "WHO Guidelines", year: 2023,
  url: "https://www.who.int/publications/i/item/9789240073630", findings: "Recommends limiting saturated fat to under 10% of energy." };
const PREG: SeedRef = { title: "Foods to avoid in pregnancy", authors: "National Health Service (England)", journal: "NHS website", year: 2023, url: "https://www.nhs.uk/pregnancy/keeping-well/foods-to-avoid/",
  findings: "Advises pregnant women to avoid unpasteurised and mould-ripened soft cheeses unless cooked, because of Listeria." };
const SEAFOOD = efsa("Dietetic Products, Nutrition and Allergies (NDA)", "Scientific Opinion on health benefits of seafood (fish and shellfish) consumption in relation to health risks associated with exposure to methylmercury", 2014,
  "One to two servings of seafood a week are associated with better fetal neurodevelopment and lower coronary mortality; high-mercury species should be limited.");
const FISH = euAllergens("Fish and products thereof are declarable allergens.");
const CRUST = euAllergens("Crustaceans and products thereof are declarable allergens.");
const MOLL = euAllergens("Molluscs and products thereof are declarable allergens.");
const RED_MEAT = iarc(114, "Red Meat and Processed Meat", 2018, "Classified red meat as probably carcinogenic (Group 2A), mainly for colorectal cancer.");

const CHEESE_C = "Milk allergen. High in saturated fat and salt, so portion size matters.";
const cheese = wholeFoods("dairy-egg", {
  refs: [MILK, WHO_SFA], isVegan: false,
  sciConsensus: "A traditional processed food (NOVA group 3): milk, cultures, rennet and salt. Scored as a whole food; saturated fat and salt are the main considerations.",
  benefits: "Concentrated protein, calcium and vitamin B12.", concerns: CHEESE_C,
});
const fish = wholeFoods("meat-seafood", { refs: [SEAFOOD, FISH], isVegan: false, benefits: "Lean high-quality protein, iodine, selenium and vitamin B12.", concerns: "Fish allergen." });
const shell = wholeFoods("meat-seafood", { refs: [SEAFOOD], isVegan: false, benefits: "Lean protein, zinc, iron and vitamin B12.", concerns: "A declarable allergen." });
const meat = wholeFoods("meat-seafood", { refs: [], isVegan: false, benefits: "Complete protein, iron, zinc and B vitamins.", concerns: "Cook thoroughly." });
const OILY = "Long-chain omega-3 (EPA and DHA), vitamin D and protein.";

export const BATCH_28: SeedIngredient[] = [
  ...cheese([
    ["Pecorino", ["pecorino romano", "pecorino cheese", "pecorino sardo"], "Hard Italian sheep's milk cheese", "Grated over pasta (cacio e pepe, carbonara).", "", "Milk allergen. Very salty.", ["Carbonara", "Cacio e pepe"], 80],
    ["Grana Padano", ["grana padano cheese"], "Hard Italian grating cheese", "Similar to Parmesan; grated over pasta and in sauces.", "", "Milk allergen. Very salty. Contains lysozyme (E1105) from egg, so it is not suitable for egg allergy.", ["Pasta", "Pesto", "Sauces"], 80, { refs: [MILK, euAllergens("Eggs and products thereof are declarable allergens.")] }],
    ["Provolone", ["provolone cheese", "provola"], "Stretched-curd Italian cheese", "Sliced in sandwiches and melted on pizza.", "", CHEESE_C, ["Sandwiches", "Pizza"], 82],
    ["Manchego", ["manchego cheese", "queso manchego"], "Spanish sheep's milk cheese", "Eaten with quince paste and in tapas.", "", CHEESE_C, ["Tapas", "Cheeseboards"], 82],
    ["Gruyère", ["gruyere", "gruyère cheese", "le gruyère"], "Swiss alpine cheese", "Used in fondue, French onion soup and gratins.", "", CHEESE_C, ["Fondue", "French onion soup", "Croque monsieur"], 82],
    ["Edam", ["edam cheese", "edammer"], "Mild Dutch cheese", "Sliced in sandwiches and snacks.", "Lower in fat than many hard cheeses.", CHEESE_C, ["Sandwiches", "Snacks"], 84],
    ["Red Leicester", ["red leicester cheese", "leicester cheese"], "Orange English hard cheese", "Sliced and grated like cheddar.", "", "Milk allergen. High in saturated fat and salt; coloured with annatto (E160b).", ["Sandwiches", "Toasties"], 80],
    ["Monterey Jack", ["jack cheese", "pepper jack"], "Mild American semi-hard cheese", "Melted in quesadillas, nachos and burgers.", "", CHEESE_C, ["Quesadillas", "Burgers"], 82],
    ["Havarti", ["havarti cheese"], "Creamy Danish semi-soft cheese", "Sliced in sandwiches.", "", CHEESE_C, ["Sandwiches"], 82],
    ["Burrata", ["burrata cheese"], "Mozzarella filled with cream", "Fresh mozzarella pouch filled with stracciatella; served with tomatoes.", "", "Milk allergen. High in saturated fat; very perishable.", ["Salads", "Pizza"], 80],
    ["Queso Fresco", ["queso blanco", "fresh mexican cheese"], "Fresh Latin American cheese", "Crumbled over tacos, beans and salads.", "Protein and calcium; mild and lower in fat.", "Milk allergen. Unpasteurised queso fresco has caused deadly Listeria outbreaks; pregnant women should only eat pasteurised versions.", ["Tacos", "Enchiladas"], 82, { refs: [MILK, PREG] }],
    ["Comté", ["comte", "comté cheese"], "French alpine hard cheese", "Eaten on cheeseboards and melted in gratins.", "", CHEESE_C, ["Cheeseboards", "Gratins"], 82],
  ]),
  ...fish([
    ["Sole", ["dover sole", "lemon sole", "sole fillet"], "Delicate flatfish", "Pan-fried (sole meunière) or baked.", "", "Fish allergen.", ["Sole meunière"], 94],
    ["Plaice", ["plaice fillet", "european plaice"], "Mild British flatfish", "Fried, baked or breaded.", "", "Fish allergen.", ["Breaded fish", "Fish and chips"], 94],
    ["Halibut", ["atlantic halibut", "pacific halibut"], "Large firm flatfish", "Grilled, roasted or poached.", "", "Fish allergen. Moderate mercury in large fish.", ["Fillets", "Fish pies"], 92],
    ["Monkfish", ["monkfish tail", "anglerfish", "lotte"], "Firm meaty white fish", "Roasted, grilled or curried.", "", "Fish allergen.", ["Curries", "Stews"], 94],
    ["Catfish", ["channel catfish", "catfish fillet", "magur"], "Farmed freshwater fish", "Fried in cornmeal (US South) or curried.", "", "Fish allergen.", ["Fried catfish", "Fish curry"], 94],
    ["Carp", ["common carp", "katla", "catla", "mrigal"], "Freshwater fish", "Eaten in Central European, Chinese and Indian cooking.", "", "Fish allergen. Many small bones.", ["Fish curry", "Christmas carp"], 94, { src: "ifct" }],
    ["Snapper", ["red snapper", "snapper fillet"], "Firm white reef fish", "Grilled, fried or steamed whole.", "", "Fish allergen.", ["Grilled fish", "Fish tacos"], 94],
    ["Sea Bream", ["dorade", "gilt-head bream", "porgy", "bream"], "Mild Mediterranean fish", "Grilled or baked whole.", "", "Fish allergen.", ["Grilled fish"], 94],
    ["Mahi-mahi", ["mahi mahi", "dorado", "dolphinfish"], "Firm tropical fish", "Grilled as steaks or in fish tacos.", "", "Fish allergen. Scombroid (histamine) poisoning if poorly chilled.", ["Fish tacos", "Grilled fish"], 92],
    ["King Mackerel", ["kingfish", "surmai", "seer fish", "vanjaram"], "Large predatory mackerel", "Fried or curried in Indian coastal cooking; grilled as steaks.", OILY,
      "Fish allergen. Very high in mercury: FDA advises pregnant women and children to avoid king mackerel.", ["Surmai fry", "Fish curry"], 74, { src: "ifct" }],
    ["Eel", ["unagi", "freshwater eel", "smoked eel", "anago"], "Rich oily fish", "Grilled with sweet glaze (unagi) or smoked.", OILY, "Fish allergen. Raw eel blood is toxic (must be cooked). European eel is critically endangered.", ["Unagi don", "Smoked eel"], 88],
    ["Sprats", ["brisling", "sprat", "smoked sprats"], "Small oily fish", "Smoked, canned in oil or fried.", OILY, "Fish allergen. Low in mercury.", ["Canned fish", "Smoked sprats"], 96],
    ["Whitebait", ["whitebait fish"], "Tiny young fish eaten whole", "Floured and deep-fried.", OILY, "Fish allergen. Usually deep-fried.", ["Fried whitebait"], 90],
    ["Bombay Duck", ["bombil", "harpadon nehereus"], "Soft lizardfish (not a duck)", "Fried fresh or dried and salted in Maharashtra and Bengal.", "Protein and calcium.", "Fish allergen. Dried bombil is very salty.", ["Bombil fry", "Dried fish"], 92, { src: "ifct" }],
  ]),
  ...shell([
    ["Crayfish", ["crawfish", "crawdads", "freshwater crayfish"], "Freshwater crustacean", "Boiled in Cajun crawfish boils or used in sandwiches.", "", "Crustacean allergen.", ["Crawfish boil", "Sandwiches"], 90, { refs: [CRUST] }],
    ["Cockles", ["cockle", "cerastoderma edule"], "Small saltwater bivalve", "Boiled and eaten with vinegar or in paella.", "", "Mollusc allergen; filter feeders can carry norovirus and algal toxins.", ["Seaside snacks", "Paella"], 88, { refs: [MOLL] }],
    ["Whelks", ["whelk", "buccinum undatum"], "Sea snail", "Boiled and eaten with vinegar or in Asian dishes.", "", "Mollusc allergen.", ["Seaside snacks"], 90, { refs: [MOLL] }],
    ["Abalone", ["abalone meat", "paua"], "Prized marine snail", "Braised, sliced or canned in Chinese cuisine.", "", "Mollusc allergen.", ["Chinese banquets"], 90, { refs: [MOLL] }],
  ]),
  ...meat([
    ["Rabbit", ["rabbit meat", "wild rabbit"], "Lean white game meat", "Stewed, braised or in pies.", "Very lean protein, vitamin B12 and selenium.", "Too lean to live on alone ('rabbit starvation'); otherwise none.", ["Stews", "Paella valenciana"], 92],
    ["Bison", ["buffalo meat", "american bison", "bison mince"], "Lean red meat", "Used in burgers and steaks.", "Leaner than beef; iron, zinc and vitamin B12.", "Red meat (IARC Group 2A). [METHODOLOGY FLAG: scored as a whole food.]", ["Burgers", "Steaks"], 74, { refs: [RED_MEAT] }],
    ["Goose", ["goose meat", "roast goose"], "Rich dark poultry", "Roasted at Christmas; also smoked or confited.", "Iron and B vitamins.", "Very fatty skin.", ["Roast goose", "Confit"], 86],
    ["Quail", ["quail meat", "quails"], "Small game bird", "Roasted, grilled or stuffed.", "Iron, protein and B vitamins.", "Cook thoroughly (Salmonella).", ["Roasted quail"], 90],
    ["Pheasant", ["pheasant meat"], "Lean game bird", "Roasted, braised or in game pies.", "Lean protein and iron.", "Shot game can contain lead fragments.", ["Game pies", "Roasts"], 88],
    ["Beef Tripe", ["tripe", "honeycomb tripe", "menudo tripe"], "Edible cattle stomach lining", "Slow-cooked in menudo, pho, trippa and Indian curries.", "Protein, vitamin B12 and zinc; low in fat.", "Must be thoroughly cleaned and cooked.", ["Menudo", "Pho", "Trippa"], 88],
    ["Ox Tongue", ["beef tongue", "lengua", "lamb tongue"], "Rich tender offal", "Boiled and sliced, or used in tacos de lengua.", "Protein, zinc and vitamin B12.", "High in fat; red meat offal. Pickled tongue is a processed meat.", ["Tacos de lengua", "Cold cuts"], 84],
    ["Lamb Kidney", ["lambs kidneys", "ox kidney", "beef kidney", "pig kidney"], "Organ meat", "Used in steak and kidney pie and devilled kidneys.", "Very rich in vitamin B12, iron and selenium.", "High in purines (a concern in gout) and cholesterol.", ["Steak and kidney pie", "Devilled kidneys"], 84],
    ["Bone Marrow", ["beef marrow", "marrow bones", "nalli"], "Fatty tissue inside bones", "Roasted and spread on toast, or cooked into nalli nihari and bone broths.", "Energy-dense fat; collagen and some minerals.", "Very high in fat.", ["Nalli nihari", "Bone broth", "Roast marrow"], 80],
    ["Chicken Gizzards", ["gizzards", "gizzard", "chicken gizzard"], "Muscular poultry stomach", "Fried, stewed or grilled on skewers.", "Lean protein, iron, zinc and vitamin B12.", "Cook thoroughly.", ["Fried gizzards", "Yakitori"], 90],
  ]),
];
