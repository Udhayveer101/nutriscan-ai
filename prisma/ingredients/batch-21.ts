// Expansion batch 21 — Pool 6: eggs, other milks and dairy fractions, fresh meat and poultry.
import type { SeedIngredient } from "./types";
import { wholeFoods } from "./whole";
import { euAllergens, iarc } from "./refs";
import { MILK } from "./batch-20";

const EGG = euAllergens("Eggs and products thereof are declarable allergens.");
const RED_MEAT = iarc(114, "Red Meat and Processed Meat", 2018,
  "Classified red meat as probably carcinogenic to humans (Group 2A), mainly for colorectal cancer, and processed meat as carcinogenic (Group 1); risk rises about 17–18% per 100 g/day of red meat and per 50 g/day of processed meat.");
const RED_C = "IARC classifies red meat as probably carcinogenic (Group 2A, colorectal cancer); guidelines suggest limiting it to about 350–500 g cooked per week. [METHODOLOGY FLAG: scored as a whole food because the scanner has no non-additive concern path.]";

const egg = wholeFoods("dairy-egg", {
  refs: [EGG], isVegan: false,
  benefits: "High-quality protein, choline, vitamin B12, vitamin D, selenium, lutein and zeaxanthin.",
  concerns: "Egg is a declarable allergen, especially common in young children. Raw or lightly cooked eggs carry a Salmonella risk unless from a vaccinated flock.",
});
const dairy = wholeFoods("dairy-egg", { refs: [MILK], isVegan: false, benefits: "Protein, calcium and B vitamins.", concerns: "Milk allergen." });
const redMeat = wholeFoods("meat-seafood", {
  refs: [RED_MEAT], isVegan: false,
  sciConsensus: "Unprocessed red meat: a nutrient-dense food that IARC classifies as probably carcinogenic at high intakes.",
  benefits: "Complete protein, highly absorbable (haem) iron, zinc and vitamin B12.",
  concerns: RED_C,
});
const poultry = wholeFoods("meat-seafood", {
  refs: [], isVegan: false,
  benefits: "Lean complete protein, niacin, vitamin B6 and selenium.",
  concerns: "Raw poultry commonly carries Campylobacter and Salmonella; cook thoroughly and avoid washing raw chicken.",
});

export const BATCH_21: SeedIngredient[] = [
  ...egg([
    ["Egg", ["eggs", "whole egg", "whole eggs", "hen's egg", "liquid egg", "free-range eggs", "pasteurised whole egg"], "Hen's egg", "Used whole in baking, pasta, sauces, mayonnaise and as a binder.", "", "", ["Cakes", "Mayonnaise", "Fresh pasta", "Quiche"], 92],
    ["Egg White", ["egg whites", "albumen", "liquid egg white", "dried egg white", "egg white powder"], "The protein-rich white of the egg", "Used for meringues, macarons, protein products and as a binder and glaze.", "Almost pure protein with no fat or cholesterol.",
      "Egg white proteins (ovalbumin, ovomucoid) are the main egg allergens. Raw egg white binds biotin.", ["Meringue", "Macarons", "Protein bars", "Quorn products"], 90],
    ["Egg Yolk", ["egg yolks", "yolk", "egg yolk powder", "liquid egg yolk"], "The fatty yolk of the egg", "Used as an emulsifier in mayonnaise, custards, pasta and ice cream.", "Choline, vitamin D, vitamin A, lutein and zeaxanthin.", "Egg allergen. Raw yolk in homemade mayonnaise and desserts carries a Salmonella risk.", ["Mayonnaise", "Custard", "Ice cream"], 90],
    ["Duck Eggs", ["duck egg"], "Large rich-yolked egg", "Used in baking, salted eggs and Asian dishes.", "More fat, protein and vitamin B12 per egg than hens' eggs.", "Egg allergen; duck eggs carry a higher Salmonella risk and should be thoroughly cooked.", ["Baking", "Salted duck eggs"], 88],
    ["Quail Eggs", ["quail egg", "quails eggs"], "Tiny speckled eggs", "Boiled as snacks and garnishes or in Asian dishes.", "Similar nutrients to hens' eggs per gram.", "Egg allergen; small enough to be a choking hazard for young children.", ["Salads", "Canapés", "Skewers"], 90],
  ]),
  ...dairy([
    ["Goat's Milk", ["goat milk", "goats milk", "goat's milk powder"], "Milk from goats", "Drunk and used in yoghurt, cheese and some infant formulas.", "Similar nutrients to cow's milk; slightly smaller fat globules.", "Milk allergen: goat's milk cross-reacts in most people with cow's milk allergy and is not a substitute. Contains lactose.", ["Goat yoghurt", "Infant formula", "Cheese"], 90],
    ["Buffalo Milk", ["water buffalo milk", "bhains ka doodh"], "Rich milk of the water buffalo", "The main dairy milk in much of South Asia; used for paneer, ghee, curd and mozzarella di bufala.", "Higher in fat, protein and calcium than cow's milk.", "Milk allergen. Higher in fat and saturated fat than cow's milk.", ["Paneer", "Ghee", "Buffalo mozzarella"], 90, { src: "ifct" }],
    ["Camel Milk", ["camel's milk"], "Milk of the dromedary camel", "Drunk fresh or fermented in the Middle East, Africa and Rajasthan; sold as powder and chocolate.", "Lower in fat than cow's milk; vitamin C.", "Often sold raw, with Brucella and MERS-coronavirus concerns; choose pasteurised.", ["Camel milk chocolate", "Fermented camel milk"], 86, { src: "own", refs: [MILK] }],
    ["Sheep's Milk", ["sheep milk", "ewe's milk", "ewes milk"], "Milk from sheep", "Mainly made into cheeses (feta, pecorino, roquefort) and yoghurt.", "Higher in protein, fat and calcium than cow's milk.", "Milk allergen; cross-reacts with cow's milk allergy.", ["Pecorino", "Feta", "Yoghurt"], 90],
    ["Whey Powder", ["sweet whey powder", "dried whey", "whey solids", "demineralised whey powder", "whey"], "Dried whey from cheese making", "The dried liquid left after cheese making; used in bakery, confectionery, snacks and infant formula.", "Lactose and whey proteins.", "Milk allergen; high in lactose.", ["Biscuits", "Crisps seasoning", "Infant formula"], 86],
    ["Anhydrous Milk Fat", ["butteroil", "butter oil", "milk fat", "anhydrous butter oil"], "Pure dried milk fat", "Butter fat with water and milk solids removed; used in chocolate, bakery and recombined dairy.", "Concentrated dairy fat; vitamin A.", "Milk allergen. Almost entirely fat, about two-thirds saturated.", ["Chocolate", "Bakery", "Recombined milk"], 78],
  ]),
  ...redMeat([
    ["Beef", ["beef mince", "minced beef", "ground beef", "beef steak", "beef chuck", "stewing beef"], "Meat from cattle", "Eaten as steaks, roasts, mince, burgers and in stews.", "", "", ["Burgers", "Bolognese", "Stews"], 72],
    ["Lamb", ["lamb mince", "minced lamb", "lamb shoulder", "lamb leg"], "Meat from sheep", "Roasted, grilled, minced into koftas or slow-cooked in curries and stews.", "", "", ["Lamb curry", "Koftas", "Roast lamb"], 72],
    ["Pork", ["pork mince", "minced pork", "pork shoulder", "pork belly", "pork loin"], "Fresh meat from pigs", "Roasted, grilled, minced or slow-cooked. (Bacon, ham and sausages are processed meats.)", "", `${RED_C} Undercooked pork can carry Trichinella and hepatitis E.`, ["Dumplings", "Roast pork", "Stir-fries"], 72],
    ["Goat Meat", ["goat", "chevon", "bakra meat"], "Meat from goats", "The 'mutton' of South Asian curries and biryanis; also eaten across Africa and the Caribbean.", "Leaner than lamb and beef; iron and protein.", "", ["Mutton curry", "Biryani", "Curry goat"], 74],
    ["Veal", ["veal escalope", "veal mince"], "Meat from young calves", "Used in escalopes, schnitzel and osso buco.", "Lean protein, B vitamins and zinc.", "", ["Wiener schnitzel", "Osso buco"], 74],
    ["Venison", ["deer meat", "venison mince"], "Meat from deer", "Roasted, grilled or made into sausages and burgers.", "Very lean; iron and B vitamins.", `${RED_C} Wild game shot with lead ammunition can contain lead fragments.`, ["Game pies", "Venison burgers"], 74],
    ["Beef Liver", ["ox liver", "beef livers"], "Organ meat", "Fried or made into pâtés and sausages.", "Extremely rich in vitamin A, vitamin B12, folate, iron and copper.",
      "So high in preformed vitamin A that pregnant women are advised to avoid liver and liver products. Liver is not covered by the IARC red-meat classification but is still red meat offal.", ["Pâté", "Liver and onions", "Haggis"], 74],
  ]),
  ...poultry([
    ["Chicken", ["chicken breast", "chicken thigh", "chicken meat", "chicken mince", "skinless chicken", "murgh"], "Meat from chickens", "The most eaten meat worldwide: roasted, grilled, curried and in ready meals and sandwiches.", "", "", ["Ready meals", "Sandwiches", "Curries"], 90],
    ["Turkey", ["turkey breast", "turkey mince", "turkey meat"], "Meat from turkeys", "Roasted whole or used as mince, deli slices and breast steaks.", "Lean protein, niacin and selenium.", "", ["Roast turkey", "Turkey mince", "Sandwich fillings"], 90],
    ["Duck", ["duck breast", "duck meat", "duck leg"], "Rich dark poultry meat", "Roasted, confited or used in Chinese and French dishes.", "Iron, B vitamins and protein.", "Duck skin is very fatty; cook thoroughly (Campylobacter, Salmonella).", ["Peking duck", "Confit de canard"], 86],
    ["Chicken Liver", ["chicken livers"], "Poultry organ meat", "Fried, curried or blended into pâté.", "Very rich in vitamin A, folate, iron and vitamin B12.",
      "Very high in vitamin A (pregnant women are advised to avoid liver). Chicken liver pâté has caused Campylobacter outbreaks when livers were undercooked.", ["Pâté", "Chicken liver curry"], 84],
  ]),
];
