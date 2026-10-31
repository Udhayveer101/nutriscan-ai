// Expansion batch 23 — Pool 6: edible mushrooms, seaweeds and microalgae.
import type { SeedIngredient, SeedRef } from "./types";
import { wholeFoods } from "./whole";

const IODINE: SeedRef = { title: "Tolerable Upper Intake Levels for Vitamins and Minerals: Iodine", authors: "Scientific Committee on Food / EFSA Panel on Dietetic Products, Nutrition and Allergies", journal: "EFSA", year: 2006,
  findings: "Set a tolerable upper intake level for iodine of 600 µg/day for adults; brown seaweeds can exceed this in a single serving." };
const HIJIKI: SeedRef = { title: "Advice to consumers on hijiki seaweed (inorganic arsenic)", authors: "Food Standards Agency (UK)", journal: "FSA consumer advice", year: 2004,
  findings: "Hijiki contains high levels of inorganic arsenic; the FSA advises consumers not to eat it." };

const shroom = wholeFoods("fungi-seaweed", {
  refs: [],
  benefits: "Low in calories; B vitamins, selenium, potassium and fibre (beta-glucans); UV-exposed mushrooms provide vitamin D.",
  concerns: "None for cultivated mushrooms. Never eat wild mushrooms without expert identification.",
});
const weed = wholeFoods("fungi-seaweed", {
  refs: [IODINE],
  benefits: "Iodine, fibre and minerals; adds umami.",
  concerns: "Brown seaweeds can contain very high iodine, which can disturb thyroid function if eaten often.",
});

export const BATCH_23: SeedIngredient[] = [
  ...shroom([
    ["Button Mushrooms", ["mushrooms", "mushroom", "white mushrooms", "chestnut mushrooms", "cremini", "portobello mushrooms", "champignons", "agaricus bisporus", "sliced mushrooms"], "The common cultivated mushroom", "Eaten raw, fried, in sauces, soups, pizzas and ready meals; chestnut and portobello are the same species at later stages.", "", "", ["Pizza", "Soups", "Stroganoff", "Ready meals"], 96],
    ["Shiitake Mushrooms", ["shiitake", "shitake", "dried shiitake", "lentinula edodes"], "Meaty Asian mushroom", "Used fresh or dried in stir-fries, soups, broths and dumplings.", "", "Undercooked shiitake can cause a striking whip-like itchy rash (shiitake dermatitis) in a few people; cook thoroughly.", ["Miso soup", "Stir-fries", "Dumplings"], 92],
    ["Oyster Mushrooms", ["oyster mushroom", "pleurotus ostreatus", "king oyster mushroom", "king trumpet mushroom", "eryngii"], "Delicate fan-shaped mushroom", "Stir-fried, fried as a vegan 'chicken' or used in soups.", "", "", ["Stir-fries", "Vegan dishes"], 96],
    ["Enoki Mushrooms", ["enoki", "enokitake", "golden needle mushrooms"], "Long thin white mushrooms", "Used in hot pots, ramen and salads.", "", "Enoki has caused several Listeria outbreaks; cook rather than eat raw.", ["Hot pot", "Ramen"], 90],
    ["Porcini", ["cep", "ceps", "penny bun", "boletus edulis", "dried porcini"], "Prized wild bolete mushroom", "Usually sold dried; used in risotto, pasta sauces and stocks.", "", "None for commercial porcini. Dried wild mushrooms can carry sand and, rarely, misidentified species.", ["Risotto", "Pasta sauces", "Stock"], 94],
    ["Chanterelles", ["chanterelle", "girolles", "cantharellus cibarius"], "Golden wild mushroom", "Sautéed and served with eggs, pasta and game.", "", "Wild-harvested: misidentification with toxic look-alikes is possible.", ["Pasta", "Omelettes"], 92],
    ["Morels", ["morel mushrooms", "morchella", "gucchi"], "Honeycomb-capped wild mushroom", "Sautéed or used in cream sauces; gucchi are prized in Kashmiri cooking.", "", "Must be thoroughly cooked: raw or undercooked morels cause gastrointestinal illness. False morels are toxic look-alikes.", ["Cream sauces", "Kashmiri pulao"], 86],
    ["Wood Ear Mushrooms", ["wood ear", "black fungus", "cloud ear fungus", "auricularia"], "Crunchy black jelly fungus", "Rehydrated and used in hot and sour soup, salads and stir-fries.", "", "Soaked fungus left at room temperature for long periods has caused fatal bongkrekic acid poisoning; soak briefly and refrigerated.", ["Hot and sour soup", "Stir-fries"], 88],
    ["Maitake", ["hen of the woods", "grifola frondosa"], "Frilly clustering mushroom", "Roasted, sautéed or used in soups and tempura.", "", "", ["Tempura", "Roasted dishes"], 96],
    ["Black Truffle", ["white truffle", "tuber melanosporum", "summer truffle", "tuber magnatum"], "Prized underground fungus", "Shaved over pasta and eggs; small amounts appear in truffle products.", "Aroma in tiny amounts.", "None, but most 'truffle oil' and 'truffle flavour' products are flavoured with synthetic 2,4-dithiapentane, not truffle.", ["Truffle pasta", "Truffle crisps"], 94],
  ]),
  ...weed([
    ["Nori", ["laver", "nori sheets", "seaweed sheets", "porphyra", "roasted seaweed"], "Thin dried red seaweed sheets", "Used to wrap sushi and onigiri and eaten as roasted seaweed snacks.", "Iodine, vitamin A, protein and fibre; lower in iodine than brown seaweeds.", "Moderate iodine; roasted snacks are salted and oiled.", ["Sushi", "Seaweed snacks", "Ramen"], 94],
    ["Kelp", ["kombu", "konbu", "kelp powder", "laminaria", "dashima"], "Large brown seaweed", "Dried kombu flavours dashi stock; kelp powder is used in supplements and seasoning.", "Glutamates for umami; iodine.", "Kombu and kelp supplements can contain extremely high iodine (far above the 600 µg/day upper limit per serving), risking thyroid problems.", ["Dashi", "Supplements", "Seasonings"], 78],
    ["Wakame", ["wakame seaweed", "undaria pinnatifida", "miyeok"], "Silky brown seaweed", "Rehydrated in miso soup and seaweed salads.", "Iodine, magnesium, folate and fucoxanthin.", "High in iodine if eaten frequently. Seaweed salad is usually dressed with sugar and colours.", ["Miso soup", "Seaweed salad"], 88],
    ["Dulse", ["dulse flakes", "palmaria palmata"], "Red Atlantic seaweed", "Eaten dried as a snack or flaked as a seasoning.", "Iodine, potassium and protein.", "Moderately high iodine.", ["Seasoning flakes", "Snacks"], 90],
    ["Hijiki", ["hiziki", "sargassum fusiforme"], "Black stringy brown seaweed", "Simmered in Japanese side dishes.", "Fibre, iron and calcium.", "Very high in inorganic arsenic (a carcinogen); the UK FSA and other agencies advise against eating it. [METHODOLOGY FLAG: scored as a whole food because the scanner has no concern path for contaminated foods.]", ["Japanese side dishes"], 70, { refs: [HIJIKI] }],
    ["Sea Moss", ["irish moss", "chondrus crispus", "sea moss gel"], "Red seaweed sold as a gel", "Boiled into a gel and added to smoothies; historically the source of carrageenan.", "Fibre and minerals.", "Iodine and heavy-metal content vary widely; health claims for sea moss supplements are unproven.", ["Smoothies", "Sea moss gel"], 86],
    ["Spirulina", ["spirulina powder", "arthrospira platensis", "blue-green algae powder"], "Blue-green microalga powder", "Dried cyanobacterium added to smoothies, supplements and green powders. (Spirulina extract is also a blue colour.)", "Protein-rich, with iron and phycocyanin. Its vitamin B12 is mostly an inactive analogue.",
      "Poor-quality products can be contaminated with microcystin toxins and heavy metals; avoid in phenylketonuria.", ["Green powders", "Smoothies", "Supplements"], 86],
    ["Chlorella", ["chlorella powder", "chlorella vulgaris", "chlorella tablets"], "Green freshwater microalga", "Dried and sold as tablets and green powders.", "Protein, iron and vitamin K.", "High vitamin K (warfarin interactions); quality varies.", ["Green powders", "Supplements"], 88],
  ]),
];
