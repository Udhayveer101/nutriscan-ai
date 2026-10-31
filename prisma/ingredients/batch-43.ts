// Expansion batch 43 — Pool 6: remaining regional fruits, chillies, gourds, greens and
// pickled vegetables that earlier produce batches did not cover.
import type { SeedIngredient } from "./types";
import { wholeFoods, AUNE_FV, IFCT } from "./whole";
import { MORTON } from "./batch-30";
import { FAO_TFP } from "./batch-31";

const own = { src: "own" as const };
const morton = { src: "own" as const, refs: [AUNE_FV, MORTON] };
const ifct = { src: "own" as const, refs: [AUNE_FV, IFCT] };
const fao = { src: "own" as const, refs: [AUNE_FV, FAO_TFP] };
const CHILLI_C = "Pungent (capsaicin): can irritate the mouth and gut.";
const CHILLI_B = "Vitamin C and capsaicin.";

const fruit = wholeFoods("fruit", { refs: [AUNE_FV], benefits: "Fibre, vitamin C and polyphenols.", concerns: "None." });
const veg = wholeFoods("vegetable", { refs: [AUNE_FV], benefits: "Fibre, vitamins and minerals.", concerns: "None." });

export const BATCH_43: SeedIngredient[] = [
  ...fruit([
    ["Kabosu", ["kabosu citrus", "citrus sphaerocarpa"], "Sour Japanese citrus", "Juice used on fish, in ponzu and drinks.", "", "None.", ["Ponzu", "Drinks"], 95, own],
    ["Sudachi", ["sudachi citrus", "citrus sudachi"], "Small green Japanese citrus", "Squeezed over grilled fish and noodles.", "", "None.", ["Japanese dishes"], 95, own],
    ["Ugli Fruit", ["uniq fruit", "jamaican tangelo"], "Knobbly grapefruit–orange hybrid", "Eaten fresh like a grapefruit.", "", "Contains furanocoumarins that may interact with some medicines.", ["Fresh fruit"], 92, own],
    ["Kinnow", ["kinnow mandarin", "kinoo"], "Punjab mandarin hybrid", "Eaten fresh and juiced in North India and Pakistan.", "", "None.", ["Kinnow juice"], 95, ifct],
    ["Galia Melon", ["galia"], "Green-fleshed netted melon", "Eaten fresh.", "", "None.", ["Fruit salads"], 95, own],
    ["Casaba Melon", ["casaba", "winter melon (casaba)"], "Mild wrinkled-skin melon", "Eaten fresh.", "", "None.", ["Fruit salads"], 95, own],
    ["Khirni", ["manilkara hexandra", "rayan", "ksheerini"], "Small sweet Indian summer fruit", "Eaten fresh or dried.", "", "None.", ["Fresh fruit"], 94, ifct],
    ["Cocoplum", ["coco plum", "chrysobalanus icaco", "icaco"], "Small tropical coastal plum", "Eaten fresh or preserved in syrup.", "", "None.", ["Preserves"], 94, morton],
    ["Monstera Fruit", ["monstera deliciosa", "fruit salad plant", "ceriman"], "Cone-like tropical fruit", "Eaten only when fully ripe, as scales lift off.", "", "Unripe fruit contains irritant calcium oxalate crystals.", ["Fresh fruit"], 88, morton],
    ["Ilama", ["annona macroprophyllata", "annona diversifolia"], "Central American custard-apple relative", "Eaten fresh.", "", "Seeds are toxic and should not be eaten.", ["Fresh fruit"], 94, morton],
    ["Miracle Fruit", ["miracle berry", "synsepalum dulcificum", "miraculin berry"], "Berry that makes sour taste sweet", "Its protein miraculin makes sour foods taste sweet for an hour.", "", "Dried miracle berry is an EU novel food.", ["Flavour-tripping tablets"], 90, morton],
    ["Lasoda", ["gunda", "cordia myxa", "assyrian plum", "lasora"], "Sticky fruit used for pickles", "Raw fruit pickled in Rajasthan and Gujarat.", "", "None.", ["Pickles"], 92, ifct],
    ["Tendu Fruit", ["diospyros melanoxylon", "kendu fruit", "coromandel ebony fruit"], "Wild Indian persimmon", "Ripe fruit eaten fresh in central India.", "", "None.", ["Fresh fruit"], 94, ifct],
    ["Mahua Flowers", ["mahua", "madhuca longifolia flowers", "mahuwa"], "Sweet fleshy flowers of the mahua tree", "Eaten dried, cooked or fermented into mahua liquor.", "Sugars and minerals.", "None as food; fermented mahua is alcoholic.", ["Traditional sweets", "Mahua liquor"], 90, ifct],
  ]),
  ...veg([
    ["Kachri", ["kachri powder", "cucumis callosus", "wild cucumber (kachri)", "mango kachri"], "Wild Rajasthani melon", "Dried and powdered as a souring and tenderising spice.", "", "None.", ["Ker sangri", "Meat tenderiser"], 92, ifct],
    ["Sponge Gourd", ["gilki", "nenua", "luffa cylindrica", "smooth luffa"], "Smooth-skinned luffa", "Cooked as a vegetable when young.", "", "Very bitter specimens contain cucurbitacins and should be discarded.", ["Gilki sabzi"], 94, ifct],
    ["Raw Papaya", ["green papaya", "kacha papita", "unripe papaya"], "Unripe papaya used as a vegetable", "Used in som tam salad, curries and as a meat tenderiser.", "", "Unripe papaya latex (papain) can trigger allergy; traditionally avoided in pregnancy.", ["Som tam", "Curries"], 92, own],
    ["Fresh Turmeric", ["turmeric root", "fresh turmeric root", "kacchi haldi", "raw turmeric"], "Fresh turmeric rhizome", "Grated into curries, pickles and drinks.", "", "None at culinary amounts.", ["Pickles", "Golden milk"], 95, own],
    ["Green Garlic", ["spring garlic", "young garlic", "hara lahsun"], "Immature garlic with green tops", "Used like spring onions.", "", "None.", ["Stir-fries", "Chutneys"], 95, own],
    ["Black Garlic", ["aged black garlic", "fermented black garlic"], "Slow-aged sweet garlic", "Used in sauces and as a condiment.", "", "None.", ["Sauces"], 94, own],
    ["Pickled Ginger", ["sushi ginger", "beni shoga"], "Ginger pickled in sweet vinegar", "Served with sushi.", "", "Often sweetened and sometimes coloured.", ["Sushi"], 86, own],
    ["Hearts of Palm", ["palm hearts", "palmito", "heart of palm"], "Inner core of certain palms", "Used in salads and as a vegan seafood substitute.", "", "Usually canned in brine.", ["Salads"], 92, own],
    ["Chickweed", ["stellaria media", "common chickweed"], "Wild salad green", "Eaten raw in salads.", "", "None.", ["Foraged salads"], 94, fao],
    ["Lamb's Quarters", ["chenopodium album greens", "fat hen", "wild spinach"], "Wild spinach-like green", "Cooked like spinach.", "", "Contains oxalates.", ["Foraged greens"], 92, fao],
    ["Wood Sorrel", ["oxalis", "oxalis acetosella", "sour grass"], "Lemony wild leaf", "Used raw as a garnish.", "", "High in oxalic acid; eat in small amounts.", ["Garnishes"], 88, own],
    ["Sea Beet", ["wild beet", "beta vulgaris maritima"], "Wild ancestor of beetroot and chard", "Leaves cooked like spinach.", "", "None.", ["Foraged greens"], 94, own],
    ["Agretti", ["salsola soda", "monk's beard", "barba di frate"], "Succulent Italian salt-marsh green", "Blanched and dressed with olive oil.", "", "None.", ["Italian sides"], 94, own],
    ["Ice Plant", ["mesembryanthemum crystallinum", "crystalline ice plant"], "Salty succulent salad leaf", "Eaten raw in salads.", "", "None.", ["Salads"], 94, own],
    // Chillies
    ["Byadgi Chilli", ["byadgi mirchi", "kaddi chilli"], "Mild, deep-red Karnataka chilli", "Used for colour in South Indian dishes.", CHILLI_B, CHILLI_C, ["Bisi bele bath", "Sambar powder"], 92, ifct],
    ["Guntur Chilli", ["guntur sannam", "s4 chilli"], "Hot Andhra chilli", "The main chilli of Andhra cooking and chilli powders.", CHILLI_B, CHILLI_C, ["Chilli powder", "Pickles"], 92, ifct],
    ["Dalle Khursani", ["dalle chilli", "round chilli (sikkim)", "akabare"], "Very hot round Himalayan chilli", "Used in pickles in Sikkim and Nepal.", CHILLI_B, CHILLI_C, ["Pickles"], 90, own],
    ["Guajillo Chilli", ["guajillo", "guajillo pepper"], "Dried mild-medium Mexican chilli", "Used in salsas and adobo.", CHILLI_B, CHILLI_C, ["Salsas", "Adobo"], 92, own],
    ["Pasilla Chilli", ["pasilla", "chile negro", "pasilla pepper"], "Dried dark Mexican chilli", "Used in mole sauces.", CHILLI_B, CHILLI_C, ["Mole"], 92, own],
    ["Shishito Peppers", ["shishito", "shishitō"], "Mild Japanese frying pepper", "Blistered and served as a snack.", CHILLI_B, "Mostly mild; about one in ten is hot.", ["Izakaya snacks"], 95, own],
    ["Anaheim Pepper", ["anaheim chilli", "new mexico chile", "hatch chile"], "Mild long green chilli", "Roasted and used in Southwestern US dishes.", CHILLI_B, CHILLI_C, ["Salsas", "Chile verde"], 94, own],
    ["Banana Pepper", ["banana peppers", "yellow wax pepper", "hungarian wax pepper"], "Mild yellow pepper", "Pickled and used on sandwiches and pizza.", CHILLI_B, "Pickled versions are salty.", ["Pizza", "Sandwiches"], 94, own],
    ["Pepperoncini", ["peperoncini", "friggitelli", "tuscan peppers"], "Mild pickling pepper", "Pickled and used in salads and on sandwiches.", CHILLI_B, "Pickled versions are salty.", ["Antipasti", "Salads"], 94, own],
    ["Cherry Pepper", ["cherry peppers", "pimento pepper", "hot cherry pepper"], "Round red pepper", "Pickled or stuffed.", CHILLI_B, CHILLI_C, ["Stuffed peppers"], 94, own],
    ["Fresno Chilli", ["fresno pepper", "fresno"], "Red jalapeño-like chilli", "Used fresh in salsas.", CHILLI_B, CHILLI_C, ["Salsas"], 94, own],
  ]),
];
