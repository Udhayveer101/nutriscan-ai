// Expansion batch 22 — Pool 6: fish and shellfish.
import type { SeedIngredient, SeedRef } from "./types";
import { wholeFoods } from "./whole";
import { efsa, euAllergens } from "./refs";

const SEAFOOD = efsa("Dietetic Products, Nutrition and Allergies (NDA)", "Scientific Opinion on health benefits of seafood (fish and shellfish) consumption in relation to health risks associated with exposure to methylmercury", 2014,
  "One to two servings of seafood a week (three to four in pregnancy) are associated with better fetal neurodevelopment and lower coronary heart disease mortality; high-mercury species should be limited.");
const FDA_FISH: SeedRef = { title: "Advice about Eating Fish: For Those Who Might Become or Are Pregnant or Breastfeeding and Children Ages 1–11 Years", authors: "U.S. Food and Drug Administration and U.S. Environmental Protection Agency", journal: "FDA/EPA consumer advice", year: 2021,
  url: "https://www.fda.gov/food/consumers/advice-about-eating-fish", findings: "Groups fish into best choices, good choices and choices to avoid (king mackerel, marlin, orange roughy, shark, swordfish, tilefish, bigeye tuna) by mercury content." };
const FISH = euAllergens("Fish and products thereof are declarable allergens.");
const CRUST = euAllergens("Crustaceans and products thereof are declarable allergens.");
const MOLL = euAllergens("Molluscs and products thereof are declarable allergens.");

const OILY = "Long-chain omega-3 (EPA and DHA), vitamin D, selenium and high-quality protein.";
const WHITE = "Lean high-quality protein, iodine, selenium and vitamin B12.";
const fish = wholeFoods("meat-seafood", {
  refs: [SEAFOOD, FISH], isVegan: false,
  sciConsensus: "Fish is a nutrient-dense food; EFSA recommends one to two servings a week, limiting high-mercury species.",
  benefits: WHITE,
  concerns: "Fish is a declarable allergen.",
});
const shellfish = wholeFoods("meat-seafood", {
  refs: [SEAFOOD], isVegan: false,
  benefits: "Lean protein, zinc, iodine, selenium and vitamin B12.",
  concerns: "A declarable allergen that can cause severe reactions.",
});
const RAW_SHELL = "Mollusc allergen. Raw or undercooked bivalves filter seawater and can carry norovirus, Vibrio and algal toxins; vulnerable groups should eat them cooked.";

export const BATCH_22: SeedIngredient[] = [
  ...fish([
    ["Salmon", ["atlantic salmon", "salmon fillet", "pink salmon", "red salmon", "sockeye salmon", "smoked salmon"], "Pink-fleshed oily fish", "Eaten fresh, canned, smoked and in sushi, fish cakes and pâtés.", OILY, "Fish allergen. Smoked salmon is salty and, eaten cold, carries a small Listeria risk in pregnancy.", ["Sushi", "Fish cakes", "Bagels"], 94],
    ["Tuna", ["tuna fish", "skipjack tuna", "yellowfin tuna", "albacore tuna", "canned tuna", "tuna chunks"], "Large ocean fish, usually canned", "Eaten canned in sandwiches and salads, or fresh as steaks and sashimi.", "Lean protein, selenium, vitamin D; fresh tuna has omega-3 (canning reduces it).",
      "Fish allergen. Larger tuna (albacore, bigeye) accumulate more mercury; FDA advises avoiding bigeye and limiting albacore in pregnancy. Poorly stored tuna can cause scombroid (histamine) poisoning.", ["Sandwiches", "Salads", "Sushi"], 86, { refs: [FDA_FISH] }],
    ["Cod", ["atlantic cod", "cod fillet", "bacalao"], "Mild white fish", "Battered for fish and chips, used in fish fingers, fish pies and salted as bacalao.", WHITE, "Fish allergen. Salt cod is very salty unless soaked.", ["Fish and chips", "Fish fingers", "Fish pie"], 94],
    ["Haddock", ["smoked haddock", "haddock fillet"], "White fish of the cod family", "Battered, smoked or used in fish pies and kedgeree.", WHITE, "Fish allergen. Smoked haddock is salty and sometimes dyed yellow.", ["Fish and chips", "Kedgeree"], 94],
    ["Pollock", ["alaska pollock", "pollack", "alaskan pollock", "walleye pollock"], "White fish used in fish fingers", "The main fish in fish fingers, fast-food fish sandwiches and surimi.", WHITE, "Fish allergen.", ["Fish fingers", "Fish sandwiches", "Surimi"], 94],
    ["Hake", ["hake fillet", "merluza"], "Delicate white fish", "Grilled, fried or used in fish fingers and Spanish dishes.", WHITE, "Fish allergen.", ["Fish fingers", "Spanish dishes"], 94],
    ["Mackerel", ["atlantic mackerel", "smoked mackerel", "mackerel fillets", "bangda", "indian mackerel"], "Rich oily fish", "Eaten fresh, smoked, canned or in Indian fish curries.", OILY,
      "Fish allergen. King mackerel (a different, large species) is very high in mercury and should be avoided in pregnancy and by children. Scombroid poisoning if poorly chilled.", ["Fish curry", "Smoked mackerel pâté", "Canned fish"], 92, { refs: [FDA_FISH] }],
    ["Sardines", ["sardine", "pilchards", "pilchard", "canned sardines", "mathi", "tarli"], "Small oily fish eaten whole", "Eaten canned, grilled or fried; bones are soft and eaten.", `${OILY} Calcium when eaten with bones.`, "Fish allergen. Low in mercury.", ["Canned fish", "Toast", "Fish fry"], 96],
    ["Anchovies", ["anchovy", "anchovy fillets", "nethili", "boquerones"], "Tiny strongly flavoured fish", "Salt-cured anchovies flavour Caesar dressing, pizza and sauces; fresh ones are fried in South India.", OILY, "Fish allergen. Cured anchovies are very salty. Anchovy is hidden in Worcestershire sauce and Caesar dressing.", ["Caesar dressing", "Pizza", "Worcestershire sauce"], 90],
    ["Herring", ["kipper", "kippers", "pickled herring", "rollmops", "herring fillets"], "Oily North Sea fish", "Eaten pickled, smoked as kippers, or fried.", OILY, "Fish allergen. Pickled and smoked herring are salty.", ["Kippers", "Rollmops", "Scandinavian dishes"], 92],
    ["Trout", ["rainbow trout", "sea trout", "smoked trout", "trout fillet"], "Freshwater or sea-run oily fish", "Grilled, baked or hot-smoked.", OILY, "Fish allergen. Low in mercury.", ["Smoked trout", "Pâtés"], 96],
    ["Tilapia", ["tilapia fillet", "nile tilapia"], "Mild farmed white fish", "Cheap, widely farmed white fish used in fillets and fish tacos.", "Lean protein, selenium and vitamin B12.", "Fish allergen. Low in omega-3 compared with oily fish.", ["Fish tacos", "Frozen fillets"], 92],
    ["Pangasius", ["basa", "basa fillet", "swai", "river cobbler", "vietnamese catfish"], "Farmed freshwater catfish", "Cheap frozen white fillets used in fish fingers, fish and chips and ready meals.", "Lean protein.", "Fish allergen. Low in omega-3. Frozen fillets are sometimes treated with water-retaining phosphates.", ["Frozen fillets", "Ready meals"], 90],
    ["Sea Bass", ["seabass", "european sea bass", "branzino"], "Firm white-fleshed fish", "Pan-fried, baked or grilled whole.", WHITE, "Fish allergen.", ["Restaurant dishes", "Fish fry"], 94],
    ["Swordfish", ["swordfish steak"], "Large predatory fish", "Grilled as steaks.", "Protein, selenium and vitamin D.", "Fish allergen. Very high in mercury: FDA and EFSA advise pregnant women and children to avoid it.", ["Swordfish steaks"], 74, { refs: [FDA_FISH] }],
    ["Rohu", ["rui", "rohu fish", "labeo rohita"], "Freshwater carp of South Asia", "Fried or curried in Bengali, Odia and Punjabi cooking.", "Protein and some omega-3.", "Fish allergen. Many small bones.", ["Macher jhol", "Fish fry"], 94, { src: "ifct" }],
    ["Hilsa", ["ilish", "hilsa fish", "tenualosa ilisha"], "Prized oily fish of Bengal", "Steamed in mustard (shorshe ilish) or fried.", OILY, "Fish allergen. Very bony.", ["Shorshe ilish", "Ilish bhaja"], 94, { src: "ifct" }],
    ["Pomfret", ["white pomfret", "silver pomfret", "black pomfret", "paplet"], "Flat silvery fish", "Fried, grilled or curried in Indian coastal cooking.", WHITE, "Fish allergen.", ["Pomfret fry", "Tandoori pomfret"], 94, { src: "ifct" }],
    ["Fish Roe", ["roe", "salmon roe", "cod roe", "lumpfish roe", "tarama", "caviar"], "Fish eggs", "Eaten as caviar and roe garnishes, or in taramasalata.", "Very rich in omega-3, vitamin B12 and vitamin D.", "Fish allergen. Cured roe is salty; lumpfish roe is often dyed.", ["Taramasalata", "Sushi", "Canapés"], 88],
  ]),
  ...shellfish([
    ["Prawns", ["prawn", "shrimp", "shrimps", "king prawns", "tiger prawns", "jhinga", "cooked prawns"], "Popular crustacean", "Eaten in curries, stir-fries, cocktails, sushi and dumplings.", "Lean protein, selenium, iodine and vitamin B12.",
      "Crustacean allergen; reactions can be severe. Farmed imports have periodically been rejected for banned antibiotic residues. Sometimes treated with sulphites to stop blackening.", ["Prawn cocktail", "Curries", "Dumplings"], 88, { refs: [CRUST] }],
    ["Crab", ["crab meat", "brown crab", "blue crab", "white crab meat", "mud crab"], "Crustacean with sweet meat", "Eaten fresh, in crab cakes, sandwiches and curries.", "Lean protein, zinc, copper and vitamin B12.", "Crustacean allergen. 'Crab sticks' are surimi made from fish, not crab.", ["Crab cakes", "Sandwiches", "Crab curry"], 90, { refs: [CRUST] }],
    ["Lobster", ["lobster meat", "langoustine", "scampi", "norway lobster"], "Large prized crustacean", "Boiled, grilled or used in bisques and rolls. (Scampi is langoustine tail meat.)", "Lean protein, zinc and selenium.", "Crustacean allergen.", ["Lobster rolls", "Bisque", "Scampi"], 90, { refs: [CRUST] }],
    ["Mussels", ["mussel", "blue mussels", "green-lipped mussels", "moules"], "Farmed bivalve mollusc", "Steamed in wine or curry sauces, or added to paella and seafood mixes.", "Iron, vitamin B12, selenium and omega-3.", RAW_SHELL, ["Moules marinière", "Paella", "Seafood mix"], 88, { refs: [MOLL] }],
    ["Oysters", ["oyster", "rock oysters", "pacific oysters"], "Bivalve often eaten raw", "Eaten raw on the half shell or cooked.", "Exceptionally rich in zinc, vitamin B12 and copper.", RAW_SHELL, ["Raw oysters", "Oyster sauce"], 82, { refs: [MOLL] }],
    ["Scallops", ["scallop", "king scallops", "queen scallops", "bay scallops"], "Sweet bivalve adductor muscle", "Seared, grilled or used in seafood mixes.", "Lean protein, vitamin B12 and selenium.", "Mollusc allergen. Some frozen scallops are soaked in phosphates to add water weight.", ["Seared scallops", "Seafood mix"], 90, { refs: [MOLL] }],
    ["Clams", ["clam", "vongole", "littleneck clams"], "Small bivalve molluscs", "Used in chowder, pasta alle vongole and seafood mixes.", "Very rich in vitamin B12 and iron.", RAW_SHELL, ["Clam chowder", "Spaghetti alle vongole"], 88, { refs: [MOLL] }],
    ["Squid", ["calamari", "squid rings", "baby squid"], "Cephalopod mollusc", "Fried as calamari, grilled or added to seafood dishes.", "Lean protein, copper and vitamin B12.", "Mollusc allergen. Fried calamari is battered and oily.", ["Calamari", "Paella", "Seafood mix"], 90, { refs: [MOLL] }],
    ["Octopus", ["octopus tentacles", "pulpo", "tako"], "Cephalopod mollusc", "Grilled, braised or served in Mediterranean and Japanese dishes.", "Lean protein, iron and vitamin B12.", "Mollusc allergen.", ["Pulpo a la gallega", "Takoyaki"], 90, { refs: [MOLL] }],
  ]),
];
