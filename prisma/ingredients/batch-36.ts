// Expansion batch 36 — Pool 6: processed meats (linked to the processed-meat KB profile, IARC
// Group 1), offal and game, more fish and seafood, stocks and broths.
import type { SeedIngredient, SeedRef } from "./types";
import { family } from "./build";
import { wholeFoods } from "./whole";
import { euAllergens, iarc } from "./refs";

const PROCESSED = iarc(114, "Red Meat and Processed Meat", 2018,
  "Processed meat is carcinogenic to humans (Group 1), based on colorectal cancer: each 50 g/day is associated with an ~18% higher risk. Red meat is probably carcinogenic (Group 2A).");
const RED = iarc(114, "Red Meat and Processed Meat", 2018,
  "Red meat is probably carcinogenic to humans (Group 2A, colorectal cancer); guidelines suggest limiting it to about 350–500 g cooked per week.");
const FISH = euAllergens("Fish and products thereof are declarable allergens.");
const CRUST = euAllergens("Crustaceans and products thereof are declarable allergens.");
const MOLL = euAllergens("Molluscs and products thereof are declarable allergens.");
const MERCURY: SeedRef = { title: "Advice about eating fish: for those who might become or are pregnant or breastfeeding and children ages 1–11 years", authors: "U.S. Food and Drug Administration and Environmental Protection Agency", journal: "FDA", year: 2022,
  findings: "Lists shark, swordfish, king mackerel, bigeye tuna and other large predators as 'choices to avoid' because of their mercury content." };
const VIT_A: SeedRef = { title: "Scientific Opinion on Dietary Reference Values for vitamin A", authors: "EFSA Panel on Dietetic Products, Nutrition and Allergies (NDA)", journal: "EFSA Journal", year: 2015,
  findings: "Sets a tolerable upper intake of 3,000 µg retinol/day; liver is so rich in retinol that pregnant women are advised to avoid it." };

const meatProd = family({
  categorySlug: "culinary", evidenceLevel: "STRONG", isNatural: false, isVegan: false,
  sciConsensus: "Processed meat: IARC Group 1 carcinogen. The scanner links it to its processed-meat profile, so it is a concern when it is a main ingredient.",
  fdaStatus: "Food (USDA-FSIS standards of identity)", efsaStatus: "Food; curing additives regulated separately", fssaiStatus: "Food (FSSAI meat product standards)", whoStatus: "IARC Group 1 (colorectal cancer)",
  benefits: "Protein, iron, zinc and vitamin B12, and flavour.",
  concerns: "IARC Group 1 carcinogen: each 50 g a day raises colorectal cancer risk by about 18%. Usually high in salt and saturated fat, and often cured with nitrite.",
  refs: [PROCESSED],
});
const offal = wholeFoods("meat-seafood", {
  refs: [RED], isVegan: false,
  benefits: "Very rich in iron, zinc, vitamin B12 and other B vitamins.",
  concerns: "Red meat and offal: IARC Group 2A for red meat. Organ meats are high in cholesterol and purines (gout).",
});
const game = wholeFoods("meat-seafood", {
  refs: [], isVegan: false,
  benefits: "Lean protein, iron, zinc and vitamin B12.",
  concerns: "None beyond those of other meats.",
});
const fish = wholeFoods("meat-seafood", {
  refs: [FISH], isVegan: false,
  benefits: "Lean protein, iodine, selenium and vitamin D; oily fish supply omega-3 EPA and DHA.",
  concerns: "Fish is a declarable allergen.",
});
const shell = wholeFoods("meat-seafood", {
  refs: [MOLL], isVegan: false,
  benefits: "Lean protein, zinc, selenium, iodine and vitamin B12.",
  concerns: "Molluscs are a declarable allergen.",
});
const prep = wholeFoods("culinary", { refs: [], isVegan: false });

export const BATCH_36: SeedIngredient[] = [
  meatProd({ slug: "bacon", name: "Bacon", aliases: ["streaky bacon", "back bacon", "smoked bacon", "bacon bits", "lardons", "rashers"], purposeShort: "Cured, often smoked pork belly or loin", purpose: "Fried as is and used in sandwiches, pasta sauces, quiches and flavourings.", safetyScore: 30, commonProducts: ["Sandwiches", "Carbonara", "Quiche"] }),
  meatProd({ slug: "ham", name: "Ham", aliases: ["cooked ham", "smoked ham", "honey roast ham", "gammon", "cured ham", "parma ham"], purposeShort: "Cured pork leg", purpose: "Sliced cooked or dry-cured pork used in sandwiches, pizzas and salads.", safetyScore: 32, commonProducts: ["Sandwiches", "Pizza", "Salads"] }),
  meatProd({ slug: "prosciutto", name: "Prosciutto", aliases: ["prosciutto crudo", "prosciutto di parma", "serrano ham", "jamón serrano", "jamon iberico"], purposeShort: "Dry-cured raw ham", purpose: "Thinly sliced air-dried ham served raw.", safetyScore: 32, commonProducts: ["Antipasti", "Pizza"] }),
  meatProd({ slug: "pancetta", name: "Pancetta", aliases: ["pancetta cubes", "guanciale"], purposeShort: "Italian cured pork belly", purpose: "Used diced in pasta sauces and soups.", safetyScore: 30, commonProducts: ["Carbonara", "Amatriciana"] }),
  meatProd({ slug: "salami", name: "Salami", aliases: ["milano salami", "napoli salami", "chicken salami", "salame"], purposeShort: "Fermented dry-cured sausage", purpose: "Sliced in sandwiches, pizzas and platters.", safetyScore: 30, commonProducts: ["Pizza", "Sandwiches"] }),
  meatProd({ slug: "pepperoni", name: "Pepperoni", aliases: ["pepperoni slices", "beef pepperoni"], purposeShort: "Spicy cured sausage", purpose: "The most common pizza topping in the US.", safetyScore: 30, commonProducts: ["Pizza", "Snack sticks"] }),
  meatProd({ slug: "chorizo", name: "Chorizo", aliases: ["spanish chorizo", "chouriço", "mexican chorizo"], purposeShort: "Paprika-spiced pork sausage", purpose: "Used in paellas, stews and on pizzas.", safetyScore: 30, commonProducts: ["Paella", "Pizza"] }),
  meatProd({ slug: "sausage", name: "Sausage", aliases: ["sausages", "pork sausage", "chicken sausage", "sausage meat", "bangers"], purposeShort: "Seasoned minced meat in a casing", purpose: "Grilled, fried or used in rolls, stews and breakfasts.", safetyScore: 34, commonProducts: ["Sausage rolls", "Breakfasts", "Hot dogs"],
    concerns: "Counts as processed meat (IARC Group 1) when salted or cured, as almost all are. Often high in salt and saturated fat; cheap sausages may be low in meat." }),
  meatProd({ slug: "frankfurter", name: "Frankfurter", aliases: ["frankfurters", "wiener", "wieners", "hot dog sausage", "vienna sausage"], purposeShort: "Smoked emulsified sausage", purpose: "The sausage in hot dogs.", safetyScore: 28, commonProducts: ["Hot dogs"] }),
  meatProd({ slug: "pastrami", name: "Pastrami", aliases: ["beef pastrami", "turkey pastrami"], purposeShort: "Brined, spiced and smoked beef", purpose: "Sliced in deli sandwiches.", safetyScore: 30, commonProducts: ["Deli sandwiches"] }),
  meatProd({ slug: "corned-beef", name: "Corned Beef", aliases: ["salt beef", "bully beef", "canned corned beef"], purposeShort: "Salt-cured beef", purpose: "Eaten in sandwiches and hash.", safetyScore: 30, commonProducts: ["Corned beef hash", "Sandwiches"] }),
  meatProd({ slug: "mortadella", name: "Mortadella", aliases: ["baloney", "polony"], purposeShort: "Emulsified cooked pork sausage", purpose: "Sliced in sandwiches.", safetyScore: 28, commonProducts: ["Sandwiches"] }),
  meatProd({ slug: "bresaola", name: "Bresaola", aliases: ["bresaola della valtellina"], purposeShort: "Air-dried salted beef", purpose: "Served thinly sliced as antipasto.", safetyScore: 34, commonProducts: ["Antipasti"] }),
  meatProd({ slug: "luncheon-meat", name: "Luncheon Meat", aliases: ["spam", "pork luncheon meat", "chopped pork and ham", "canned luncheon meat"], purposeShort: "Canned cured pork loaf", purpose: "Fried or sliced in sandwiches, musubi and noodle dishes.", safetyScore: 26, commonProducts: ["Musubi", "Budae jjigae"] }),
  meatProd({ slug: "jerky", name: "Jerky", aliases: ["beef jerky", "meat jerky", "turkey jerky"], purposeShort: "Dried, salted meat strips", purpose: "Eaten as a high-protein snack.", safetyScore: 34, commonProducts: ["Snacks"] }),
  meatProd({ slug: "biltong", name: "Biltong", aliases: ["droëwors", "droewors"], purposeShort: "South African air-dried cured meat", purpose: "Eaten as a snack.", safetyScore: 34, commonProducts: ["Snacks"] }),
  meatProd({ slug: "nduja", name: "Nduja", aliases: ["'nduja", "n'duja"], purposeShort: "Spreadable spicy Calabrian salami", purpose: "Spread on bread or stirred into pasta and pizza.", safetyScore: 28, commonProducts: ["Pizza", "Pasta"] }),
  meatProd({ slug: "kabanos", name: "Kabanos", aliases: ["kabanosy", "cabanossi", "kielbasa", "polish sausage"], purposeShort: "Thin dry-smoked pork sausage", purpose: "Eaten as a snack and in stews.", safetyScore: 30, commonProducts: ["Snacks", "Bigos"] }),
  meatProd({ slug: "black-pudding", name: "Black Pudding", aliases: ["blood sausage", "blood pudding", "morcilla", "boudin noir"], purposeShort: "Sausage of blood, fat and oats", purpose: "Fried as part of a cooked breakfast.", safetyScore: 32, benefits: "Very high in iron.", commonProducts: ["Full breakfast"] }),
  meatProd({ slug: "andouille", name: "Andouille", aliases: ["andouille sausage", "andouillette"], purposeShort: "Smoked pork sausage", purpose: "Used in gumbo and jambalaya.", safetyScore: 30, commonProducts: ["Gumbo", "Jambalaya"] }),
  meatProd({ slug: "saucisson", name: "Saucisson", aliases: ["saucisson sec", "dry sausage"], purposeShort: "French dry-cured sausage", purpose: "Sliced as an aperitif.", safetyScore: 30, commonProducts: ["Charcuterie"] }),
  ...offal([
    ["Mutton", ["mutton meat", "hogget", "sheep meat"], "Meat of mature sheep (or goat, in South Asia)", "Used in curries, biryanis and stews.", "", "", ["Mutton curry", "Biryani"], 82],
    ["Heart", ["beef heart", "ox heart", "lamb heart", "chicken hearts", "kaleji-dil"], "Heart muscle", "Grilled, stewed or minced into sausages.", "", "", ["Anticuchos", "Stews"], 84],
    ["Oxtail", ["ox tail", "beef tail"], "Gelatinous beef tail", "Slow-cooked in stews and soups.", "", "", ["Oxtail soup", "Kare-kare"], 82],
    ["Pig Trotters", ["pigs trotters", "pork feet", "pig's feet", "pork hock", "paya"], "Pig feet", "Slow-cooked for gelatin-rich stews and paya.", "Collagen-rich.", "", ["Paya", "Stews"], 80],
    ["Chicken Feet", ["chicken paws", "phoenix claws"], "Chicken feet", "Simmered for stock or braised in dim sum.", "Collagen-rich.", "None.", ["Dim sum", "Stock"], 84],
    ["Sweetbreads", ["thymus", "veal sweetbreads", "lamb sweetbreads"], "Thymus and pancreas glands", "Fried or braised as a delicacy.", "", "", ["Restaurant dishes"], 82],
    ["Lamb Liver", ["lambs liver", "mutton liver", "kaleji"], "Lamb or mutton liver", "Fried or cooked in kaleji masala.", "", "Extremely high in vitamin A: avoid in pregnancy.", ["Liver and onions", "Kaleji masala"], 80, { refs: [RED, VIT_A] }],
    ["Pork Liver", ["pigs liver", "pig liver"], "Pig liver", "Used in pâtés, faggots and liver sausage.", "", "Extremely high in vitamin A: avoid in pregnancy.", ["Pâté", "Liver sausage"], 80, { refs: [RED, VIT_A] }],
    ["Foie Gras", ["fattened duck liver", "fattened goose liver", "foie gras de canard"], "Liver of force-fed duck or goose", "Served as a terrine or seared.", "", "Very high in saturated fat and vitamin A. Production by force-feeding is banned in several countries on welfare grounds.", ["Terrines"], 72, { refs: [VIT_A] }],
  ]),
  ...game([
    ["Wild Boar", ["boar meat", "sanglier", "jungli suar"], "Meat of wild pig", "Used in stews, sausages and ragù.", "", "Must be thoroughly cooked (risk of Trichinella and hepatitis E).", ["Ragù", "Game sausages"], 84],
    ["Kangaroo", ["kangaroo meat", "roo meat"], "Lean Australian game meat", "Grilled as steaks or minced.", "Very lean and rich in iron.", "None.", ["Steaks", "Burgers"], 88],
    ["Ostrich", ["ostrich meat", "ostrich fillet"], "Lean red poultry meat", "Grilled as steaks.", "Very lean.", "None.", ["Steaks"], 88],
    ["Elk", ["elk meat", "wapiti", "moose meat"], "Lean large-deer meat", "Grilled, roasted or minced.", "Very lean.", "None.", ["Game burgers"], 88],
    ["Partridge", ["grey partridge", "red-legged partridge"], "Small game bird", "Roasted whole.", "", "Shot game can contain lead pellet fragments.", ["Roast game"], 86],
    ["Pigeon", ["squab", "wood pigeon"], "Small dark-meat bird", "Roasted or pan-seared breasts.", "", "Shot game can contain lead pellet fragments.", ["Restaurant dishes"], 86],
    ["Guinea Fowl", ["guineafowl", "pintade"], "Lean game-like poultry", "Roasted like chicken.", "", "None.", ["Roasts"], 90],
    ["Frog Legs", ["frogs legs", "cuisses de grenouille"], "Frog hind legs", "Fried or sautéed.", "Lean protein.", "None.", ["French and Asian dishes"], 86],
    ["Snails", ["escargot", "escargots", "helix snails"], "Land snails", "Cooked in garlic butter.", "Lean protein and iron.", "Molluscs are a declarable allergen.", ["Escargots de Bourgogne"], 86, { refs: [MOLL] }],
  ]),
  ...fish([
    ["Grouper", ["hammour", "garoupa", "rock cod"], "Large firm white fish", "Grilled, steamed or curried.", "", "Fish allergen. Large reef fish can carry ciguatera toxin.", ["Steamed fish"], 86],
    ["Skate", ["ray wings", "skate wings", "thornback ray"], "Wing-shaped cartilaginous fish", "Pan-fried with brown butter.", "", "Fish allergen.", ["Skate wing"], 86],
    ["Shark", ["shark meat", "dogfish", "rock salmon", "huss"], "Meat of small sharks", "Fried or curried.", "", "Fish allergen. Sharks accumulate mercury: FDA advises pregnant women and children to avoid.", ["Fish and chips", "Curries"], 72, { refs: [FISH, MERCURY] }],
    ["John Dory", ["st pierre", "saint pierre", "dory"], "Flat white sea fish", "Pan-fried fillets.", "", "Fish allergen.", ["Restaurant dishes"], 90],
    ["Turbot", ["turbot fillet"], "Premium flatfish", "Roasted or poached.", "", "Fish allergen.", ["Restaurant dishes"], 90],
    ["Barramundi", ["asian sea bass", "bhetki"], "Mild white fish", "Grilled, steamed or in Bengali bhetki fry.", "", "Fish allergen.", ["Fish fry", "Grilled fish"], 90],
    ["Arctic Char", ["char", "salvelinus alpinus"], "Cold-water salmon relative", "Grilled or smoked.", "Omega-3 fats.", "Fish allergen.", ["Smoked fish"], 92],
    ["Perch", ["european perch", "yellow perch", "river perch"], "Freshwater white fish", "Pan-fried fillets.", "", "Fish allergen.", ["Fried fish"], 90],
    ["Pike", ["northern pike", "zander", "pike-perch", "walleye"], "Freshwater predatory fish", "Used in quenelles and fried fillets.", "", "Fish allergen.", ["Quenelles"], 88],
    ["Sablefish", ["black cod", "butterfish (sablefish)", "anoplopoma fimbria"], "Rich, oily white fish", "Miso-glazed or smoked.", "Omega-3 fats.", "Fish allergen.", ["Miso black cod"], 90],
    ["Yellowtail", ["hamachi", "japanese amberjack", "buri", "amberjack"], "Oily Japanese sashimi fish", "Eaten raw as sashimi or grilled.", "Omega-3 fats.", "Fish allergen.", ["Sashimi", "Sushi"], 88],
    ["Mullet", ["grey mullet", "red mullet", "bhangan"], "Coastal fish", "Grilled whole or curried.", "", "Fish allergen.", ["Grilled fish"], 90],
    ["Indian Salmon", ["rawas", "indian threadfin", "eleutheronema tetradactylum"], "Popular Indian threadfin", "Fried or curried.", "", "Fish allergen.", ["Fish fry"], 90],
    ["Pearl Spot", ["karimeen", "green chromide", "etroplus suratensis"], "Kerala brackish-water fish", "Fried or baked in banana leaf.", "", "Fish allergen.", ["Karimeen pollichathu"], 90],
    ["Dried Fish", ["karuvadu", "sukhi machli", "dry fish"], "Salted, sun-dried fish", "Fried or cooked in curries and chutneys.", "", "Fish allergen. Very high in salt.", ["Karuvadu curry", "Chutneys"], 70],
    ["Bonito Flakes", ["katsuobushi", "dried bonito", "bonito"], "Smoked, dried, shaved skipjack tuna", "Used to make dashi and as a topping.", "Umami and protein.", "Fish allergen. Smoked: contains some polycyclic aromatic hydrocarbons (EU limits apply).", ["Dashi", "Okonomiyaki"], 80],
    ["Anchovy Paste", ["anchovy purée", "anchovy cream"], "Ground salted anchovies", "Used in dressings, sauces and spreads.", "", "Fish allergen. Very high in salt.", ["Caesar dressing", "Pasta sauces"], 70],
    ["Surimi", ["crab sticks", "seafood sticks", "imitation crab", "kamaboko", "fish paste"], "Washed, minced white fish formed into shapes", "Used in sushi, salads and seafood sticks.", "", "Fish allergen. Usually contains added starch, sugar, salt and flavourings; often lower in protein than fish.", ["Crab sticks", "California rolls"], 70],
  ]),
  ...shell([
    ["Cuttlefish", ["sepia", "cuttle fish"], "Squid-like cephalopod", "Grilled, stewed or used for its ink.", "", "Molluscs are a declarable allergen.", ["Squid ink pasta", "Stews"], 90],
    ["Sea Urchin", ["uni", "sea urchin roe", "ricci di mare"], "Gonads of sea urchins", "Eaten raw as sushi or with pasta.", "", "Allergen cross-reactivity with shellfish is possible.", ["Sushi", "Pasta"], 88],
    ["Abalone", ["paua", "ormer", "bao yu"], "Large sea snail", "Braised or sliced raw.", "", "Molluscs are a declarable allergen.", ["Chinese banquets"], 88],
  ]),
  ...wholeFoods("meat-seafood", { refs: [CRUST], isVegan: false, benefits: "Protein, iodine, omega-3 and astaxanthin.", concerns: "Crustaceans are a declarable allergen." })([
    ["Krill", ["antarctic krill", "euphausia superba", "krill meal"], "Tiny Antarctic crustacean", "Used mainly for krill oil supplements and in some Asian foods.", "", "Crustaceans are a declarable allergen.", ["Krill oil", "Shrimp paste"], 86],
    ["Dried Shrimp", ["dried prawns", "sukha jhinga", "hae bee", "camarão seco"], "Small sun-dried shrimps", "Used for umami in Asian, Indian and West African cooking.", "", "Crustaceans are a declarable allergen. Often salted.", ["XO sauce", "Chutneys"], 80],
    ["Shrimp Paste", ["belacan", "terasi", "kapi", "bagoong", "balachong"], "Fermented ground shrimp paste", "Used in Southeast Asian curry pastes and sambals.", "", "Crustaceans are a declarable allergen. Very high in salt.", ["Sambal", "Thai curry pastes"], 70],
  ]),
  ...prep([
    ["Bone Broth", ["beef bone broth", "chicken bone broth"], "Long-simmered bone stock", "Drunk on its own or used in soups.", "Gelatin and some minerals.", "Health claims (gut, joints) lack good evidence.", ["Soups", "Sipping broths"], 86],
  ]),
];
