// Expansion batch 31 — Pool 6: more vegetables (leafy greens, roots, squashes, chillies,
// edible flowers and regional vegetables from India, East Asia, Africa and Europe).
import type { SeedIngredient, SeedRef } from "./types";
import { AUNE_FV, IFCT } from "./whole";
import { fdc } from "./refs";
import { veg, VITK } from "./batch-14";

export const FAO_TFP: SeedRef = { title: "Traditional food plants: a resource book for promoting the exploitation and consumption of food plants in arid, semi-arid and sub-humid lands of Eastern Africa", authors: "Food and Agriculture Organization of the United Nations",
  journal: "FAO Food and Nutrition Paper 42", year: 1988, findings: "Describes the composition, preparation and food use of traditional leafy vegetables, fruits and roots." };
const F = (n: string) => fdc(`Nutrient composition entry for ${n.toLowerCase()}.`);
const own = { src: "own" as const };
const fdcRef = (n: string, extra: SeedRef[] = []) => ({ src: "own" as const, refs: [AUNE_FV, F(n), ...extra] });
const ifct = { src: "ifct" as const, refs: [AUNE_FV] };
const fao = { src: "own" as const, refs: [AUNE_FV, FAO_TFP] };
const LEAFY = "Folate, vitamin K, vitamin A carotenoids and fibre.";
const VITK_C = "High in vitamin K: keep intake consistent if taking warfarin.";
const CHILLI_C = "Very pungent (capsaicin): can irritate the mouth and gut; handle with care.";
const CHILLI_B = "Vitamin C and capsaicin.";

export const BATCH_31: SeedIngredient[] = [
  ...veg([
    // Leafy greens and salad leaves
    ["Celtuce", ["stem lettuce", "asparagus lettuce", "wosun", "lactuca sativa var. augustana"], "Lettuce grown for its thick stem", "The peeled stem is stir-fried or pickled in Chinese cooking.", "", "None.", ["Stir-fries", "Pickles"], 95, own],
    ["Curly Endive", ["frisee", "frisée", "curly endive lettuce", "cichorium endivia"], "Frilly bitter salad leaf", "Used raw in salads such as frisée aux lardons.", LEAFY, "None.", ["Salads"], 96, fdcRef("Endive, raw")],
    ["Escarole", ["broad-leaved endive", "batavian endive", "scarole"], "Broad-leaved bitter endive", "Eaten raw in salads or braised and added to soups.", LEAFY, "None.", ["Salads", "Italian soups"], 96, own],
    ["Mizuna", ["japanese mustard greens", "spider mustard", "kyona"], "Feathery mild mustard green", "Used raw in salad mixes and cooked in Japanese hot pots.", LEAFY, "None.", ["Salad mixes", "Hot pots"], 96, own],
    ["Tatsoi", ["tat soi", "spoon mustard", "rosette bok choy"], "Spoon-leaved Asian green", "Eaten raw in salads or stir-fried.", LEAFY, "None.", ["Salads", "Stir-fries"], 96, own],
    ["Choy Sum", ["choi sum", "yu choy", "cai xin", "chinese flowering cabbage"], "Flowering Chinese green", "Blanched or stir-fried with garlic or oyster sauce.", LEAFY, "None.", ["Stir-fries", "Noodle soups"], 96, own],
    ["Komatsuna", ["mustard spinach", "japanese mustard spinach", "tendergreen"], "Japanese leafy green", "Stir-fried, pickled or added to soups.", "High in calcium and vitamin C.", "None.", ["Stir-fries", "Soups"], 96, fdcRef("Mustard spinach, (tendergreen), raw")],
    ["Chrysanthemum Greens", ["shungiku", "garland chrysanthemum", "tong ho", "crown daisy"], "Aromatic edible chrysanthemum leaves", "Added to Japanese and Korean hot pots and Chinese stir-fries.", LEAFY, "None.", ["Hot pots", "Stir-fries"], 95, fdcRef("Chrysanthemum, garland, raw")],
    ["Sorrel", ["garden sorrel", "rumex acetosa", "common sorrel", "dock leaves"], "Lemony sour leaf", "Used in soups, sauces for fish and salads.", "Vitamin C.", "High in oxalic acid; people prone to kidney stones should eat it in moderation.", ["Sorrel soup", "Sauces"], 88, fdcRef("Dock, raw")],
    ["Samphire", ["marsh samphire", "sea asparagus", "glasswort", "salicornia"], "Salty succulent sea vegetable", "Blanched and served with fish or eaten raw in salads.", "", "Naturally salty.", ["Fish dishes", "Salads"], 90, own],
    ["Lamb's Lettuce", ["lambs lettuce", "corn salad", "mache", "mâche", "valerianella locusta"], "Tender rosette salad leaf", "Eaten raw in salads.", LEAFY, "None.", ["Salad mixes"], 96, own],
    ["Pea Shoots", ["pea tendrils", "dou miao", "pea sprouts"], "Young pea leaves and tendrils", "Eaten raw in salads or stir-fried.", "Vitamin C and folate.", "None.", ["Salads", "Stir-fries"], 96, own],
    ["Spring Greens", ["collard spring greens", "spring cabbage"], "Loose-leaved young cabbage", "Shredded and steamed or stir-fried.", LEAFY, VITK_C, ["Side dishes"], 96, { src: "own" as const, refs: [AUNE_FV, VITK] }],
    ["Sweet Potato Leaves", ["sweet potato greens", "camote tops", "kamote tops"], "Leaves of the sweet potato vine", "Boiled or stir-fried in Southeast Asia and Africa.", LEAFY, "None.", ["Stir-fries", "Stews"], 95, fdcRef("Sweet potato leaves, raw")],
    ["Cassava Leaves", ["cassava greens", "pondu", "saka-saka", "matapa"], "Leaves of the cassava plant", "Pounded and long-cooked into stews in Central Africa, Mozambique and Indonesia.", "Protein, vitamin A and iron.", "Raw leaves contain cyanogenic glycosides; they must be pounded and cooked thoroughly before eating.", ["Stews"], 80, fao],
    ["Pumpkin Leaves", ["pumpkin greens", "kaddu ke patte", "cucurbita leaves"], "Leaves of the pumpkin vine", "Cooked as a leafy vegetable in India and Africa.", LEAFY, "None.", ["Stews", "Saag"], 95, fdcRef("Pumpkin leaves, raw")],
    ["Radish Greens", ["radish leaves", "mooli leaves", "mooli ke patte"], "Leaves of the radish plant", "Cooked into saag, parathas and stir-fries.", LEAFY, "None.", ["Saag", "Parathas"], 95, ifct],
    ["Chickpea Leaves", ["bengal gram leaves", "chane ka saag", "chana saag"], "Tender chickpea plant leaves", "Cooked as a winter saag in North India.", LEAFY, "None.", ["Saag"], 95, ifct],
    ["Agathi Leaves", ["agathi keerai", "sesbania grandiflora leaves", "hummingbird tree leaves"], "Leaves of the agathi tree", "Cooked into keerai poriyal in Tamil Nadu.", "Rich in calcium, iron and vitamin A.", "None at food amounts.", ["Poriyal"], 94, ifct],
    ["Ponnaganni", ["ponnanganni keerai", "alternanthera sessilis", "sessile joyweed"], "Tamil leafy green", "Cooked as keerai in South Indian homes.", LEAFY, "None.", ["Keerai poriyal"], 95, ifct],
    ["Black Nightshade Leaves", ["manathakkali keerai", "manathakkali", "solanum nigrum leaves", "makoi"], "Cooked leafy green of the nightshade family", "Leaves are cooked into keerai and soups in South India.", LEAFY, "Eat only cooked leaves and fully ripe berries: unripe berries contain solanine.", ["Keerai", "Soups"], 88, ifct],
    ["Jute Mallow", ["molokhia", "mulukhiyah", "ewedu", "corchorus olitorius", "jute leaves"], "Mucilaginous leafy green", "Cooked into Egyptian molokhia and Nigerian ewedu soup.", LEAFY, "None.", ["Molokhia", "Ewedu soup"], 95, { src: "own" as const, refs: [AUNE_FV, FAO_TFP, F("Jute, potherb, raw")] }],
    ["Bitter Leaf", ["bitterleaf", "vernonia amygdalina", "ndole leaves", "onugbu"], "Bitter West African leaf", "Washed to reduce bitterness and cooked into ndolé and onugbu soup.", LEAFY, "None at food amounts.", ["Ndolé", "Onugbu soup"], 94, fao],
    ["Fluted Pumpkin Leaves", ["ugu", "ugwu", "telfairia occidentalis"], "Nigerian leafy vegetable", "Cooked into edikang ikong and egusi soups.", LEAFY, "None.", ["Egusi soup", "Edikang ikong"], 95, fao],
    ["Chaya", ["tree spinach", "cnidoscolus aconitifolius", "chaya leaves"], "Mexican tree spinach", "Leaves are boiled and used like spinach in the Yucatán.", "High in protein, calcium and iron.", "Raw leaves contain cyanogenic glycosides; boil before eating and don't use aluminium pans.", ["Tamales", "Stews"], 82, own],
    ["Broccoli Sprouts", ["broccoli microgreens", "broccoli sprout"], "Three-day-old broccoli shoots", "Eaten raw on salads and sandwiches.", "Rich in glucoraphanin (precursor of sulforaphane).", "Raw sprouts carry a food-poisoning risk; pregnant women and the immunocompromised should cook them.", ["Salads", "Sandwiches"], 92, own],
    // Brassicas and stalks
    ["Broccolini", ["tenderstem broccoli", "baby broccoli", "aspabroc"], "Long-stemmed broccoli hybrid", "Steamed, grilled or stir-fried.", "Vitamin C and folate.", "None.", ["Side dishes", "Stir-fries"], 97, own],
    ["Romanesco", ["romanesco broccoli", "roman cauliflower", "broccoflower"], "Fractal green cauliflower", "Roasted or steamed like cauliflower.", "Vitamin C and fibre.", "None.", ["Side dishes"], 97, own],
    ["Cardoon", ["cardoons", "cynara cardunculus", "cardi"], "Artichoke-relative stalk", "Stalks are braised or baked in Mediterranean dishes.", "", "None.", ["Gratins", "Bagna cauda"], 95, fdcRef("Cardoon, raw")],
    ["Sea Kale", ["seakale", "crambe maritima"], "Coastal brassica shoots", "Blanched shoots are steamed like asparagus.", "", "None.", ["Side dishes"], 95, own],
    // Roots and tubers
    ["Purple Yam", ["ube", "ube halaya", "dioscorea alata", "water yam", "ratalu"], "Violet-fleshed yam", "Boiled and mashed into Filipino ube desserts, or cooked in Gujarati undhiyu.", "Anthocyanins and resistant starch.", "Must be cooked; some raw yams contain irritant compounds.", ["Ube halaya", "Undhiyu", "Desserts"], 92, own],
    ["Oca", ["oxalis tuberosa", "new zealand yam"], "Tangy Andean tuber", "Roasted, boiled or eaten raw.", "", "Contains oxalic acid; sunning or cooking reduces it.", ["Roasts", "Stews"], 92, own],
    ["Yacon", ["yacón", "smallanthus sonchifolius", "yacon root", "yacon syrup"], "Sweet crisp Andean root", "Eaten raw in salads; also made into a low-sugar syrup.", "Rich in fructo-oligosaccharides (prebiotic fibre).", "Large amounts of FOS cause bloating.", ["Salads", "Syrups"], 92, own],
    ["Parsley Root", ["hamburg parsley", "root parsley", "petroselinum crispum var. tuberosum"], "Parsnip-like root of parsley", "Used in Central European soups and stews.", "", "None.", ["Soups", "Stews"], 96, own],
    ["Chinese Yam", ["nagaimo", "yamaimo", "dioscorea polystachya", "huai shan"], "Slimy-textured Asian yam", "Grated raw (tororo) or cooked in soups.", "", "Skin can irritate hands.", ["Tororo", "Soups"], 94, own],
    ["Cocoyam", ["tannia", "yautia", "malanga", "xanthosoma sagittifolium", "new cocoyam"], "Starchy tropical corm", "Boiled, mashed or fried in West Africa and the Caribbean.", "", "Must be cooked: raw corms contain irritant calcium oxalate.", ["Fufu", "Stews"], 92, fdcRef("Yautia (tannier), raw")],
    ["Chinese Artichoke", ["crosnes", "stachys affinis", "knotroot", "japanese artichoke"], "Small knobbly tuber", "Eaten raw, pickled or sautéed.", "", "None.", ["Pickles", "Side dishes"], 95, own],
    ["Water Bamboo", ["jiaobai", "makomo", "zizania latifolia", "manchurian wild rice stem"], "Swollen stem of a wild rice", "Sliced and stir-fried in Chinese cooking.", "", "None.", ["Stir-fries"], 96, own],
    ["Jackfruit Seeds", ["kathal ke beej", "chakka kuru", "jackfruit seed"], "Starchy seeds of the jackfruit", "Boiled or roasted and added to curries in South India.", "Protein and resistant starch.", "Eat cooked only.", ["Curries", "Roasted snacks"], 92, ifct],
    // Alliums
    ["Wild Garlic", ["ramsons", "bear's garlic", "allium ursinum", "wild garlic leaves"], "Garlic-scented woodland leaf", "Used in pesto, soups and butters.", "", "Easily confused with poisonous lily-of-the-valley and autumn crocus when foraged.", ["Pesto", "Soups"], 92, own],
    ["Elephant Garlic", ["allium ampeloprasum elephant", "giant garlic"], "Mild, very large garlic-like bulb", "Roasted or used as a mild garlic.", "", "None.", ["Roasts"], 96, own],
    ["Garlic Scapes", ["garlic scape", "garlic stems", "garlic shoots"], "Curly flower stalks of garlic", "Stir-fried, grilled or made into pesto.", "", "None.", ["Pesto", "Stir-fries"], 96, own],
    ["Chinese Chives", ["garlic chives", "jiu cai", "nira", "allium tuberosum"], "Flat garlicky chives", "Used in dumplings, stir-fries and Korean pancakes.", "", "None.", ["Dumplings", "Stir-fries"], 96, own],
    // Squashes and gourds
    ["Kabocha Squash", ["kabocha", "japanese pumpkin", "kabocha pumpkin"], "Sweet green-skinned winter squash", "Simmered, roasted or made into tempura.", "Beta-carotene and fibre.", "None.", ["Tempura", "Soups"], 96, own],
    ["Acorn Squash", ["acorn squashes"], "Ridged winter squash", "Halved and roasted or stuffed.", "Fibre, potassium and vitamin C.", "None.", ["Roasted squash"], 96, fdcRef("Squash, winter, acorn, raw")],
    ["Spaghetti Squash", ["vegetable spaghetti", "spaghetti marrow"], "Squash whose flesh separates into strands", "Baked and used as a low-carb pasta substitute.", "Low in calories.", "None.", ["Pasta substitute"], 96, fdcRef("Squash, winter, spaghetti, raw")],
    ["Hubbard Squash", ["hubbard"], "Large grey-green winter squash", "Baked, mashed or used in pies.", "Beta-carotene and fibre.", "None.", ["Pies", "Mash"], 96, fdcRef("Squash, winter, hubbard, raw")],
    ["Pattypan Squash", ["pattypan", "scallop squash", "custard marrow"], "Scalloped summer squash", "Sautéed, grilled or stuffed.", "", "None.", ["Side dishes"], 96, fdcRef("Squash, summer, scallop, raw")],
    ["Crookneck Squash", ["yellow squash", "straightneck squash", "yellow crookneck"], "Yellow summer squash", "Sautéed, grilled or added to casseroles.", "", "None.", ["Casseroles", "Side dishes"], 96, fdcRef("Squash, summer, crookneck and straightneck, raw")],
    // Chillies and peppers
    ["Padrón Peppers", ["padron peppers", "pimientos de padrón", "pimientos de padron"], "Small Galician frying peppers", "Blistered in oil and salted as tapas.", CHILLI_B, "Usually mild; the odd one is hot.", ["Tapas"], 94, own],
    ["Poblano Pepper", ["poblano", "poblanos", "ancho chilli", "ancho chile"], "Mild Mexican chilli (dried: ancho)", "Roasted and stuffed (chiles rellenos) or dried for mole.", CHILLI_B, "Mild.", ["Chiles rellenos", "Mole"], 94, own],
    ["Serrano Pepper", ["serrano", "serrano chilli", "serrano chile"], "Hot Mexican green chilli", "Used fresh in salsas and pico de gallo.", CHILLI_B, CHILLI_C, ["Salsas"], 90, fdcRef("Peppers, serrano, raw")],
    ["Habanero", ["habanero pepper", "habanero chilli", "capsicum chinense habanero"], "Very hot fruity chilli", "Used in hot sauces and Yucatán salsas.", CHILLI_B, CHILLI_C, ["Hot sauces", "Salsas"], 88, own],
    ["Scotch Bonnet", ["scotch bonnet pepper", "scotch bonnet chilli"], "Very hot Caribbean chilli", "Flavours jerk seasoning, pepper sauces and stews.", CHILLI_B, CHILLI_C, ["Jerk seasoning", "Pepper sauce"], 88, own],
    ["Kashmiri Chilli", ["kashmiri mirch", "kashmiri red chilli"], "Mild deep-red Indian chilli", "Used for colour more than heat in curries and tandoori marinades.", CHILLI_B, "Mild. Commercial chilli powders have been found adulterated with Sudan dyes; buy from reputable brands.", ["Curries", "Tandoori"], 92, own],
    ["Bhut Jolokia", ["ghost pepper", "naga jolokia", "ghost chilli", "raja mircha"], "Extremely hot chilli from Northeast India", "Used sparingly in chutneys, pickles and hot sauces.", CHILLI_B, "Extremely pungent: large amounts have caused vomiting and, rarely, oesophageal injury.", ["Hot sauces", "Pickles"], 80, own],
    // Flowers, buds, pods and other regional vegetables
    ["Courgette Flowers", ["zucchini flowers", "squash blossoms", "fiori di zucca"], "Edible squash blossoms", "Stuffed and fried, or added to quesadillas and risotto.", "", "None for the flower; fried versions are high in fat.", ["Fritters", "Quesadillas"], 94, own],
    ["Pumpkin Flowers", ["kumro phool", "pumpkin blossoms"], "Edible pumpkin blossoms", "Battered and fried (kumro phool bhaja) or cooked in curries.", "", "None for the flower.", ["Fritters", "Curries"], 94, fdcRef("Pumpkin flowers, raw")],
    ["Vine Leaves", ["grape leaves", "grapevine leaves", "dolma leaves"], "Brined grape leaves", "Wrapped around rice for dolmades and sarma.", "Fibre and vitamin A.", "Brined leaves are salty.", ["Dolmades", "Sarma"], 90, fdcRef("Grape leaves, raw")],
    ["Kachnar Buds", ["kachnar", "bauhinia variegata buds", "kachnar ki kali"], "Flower buds of the orchid tree", "Cooked into curries and pickles in North India.", "", "None.", ["Curries", "Pickles"], 95, own],
    ["Ker", ["kair", "capparis decidua", "ker berries"], "Desert caper berry of Rajasthan", "Soaked to remove bitterness and cooked with sangri.", "", "None after soaking.", ["Ker sangri", "Pickles"], 94, own],
    ["Sangri", ["khejri pods", "prosopis cineraria pods", "sangri beans"], "Dried pods of the khejri tree", "Cooked with ker in the Rajasthani dish ker sangri.", "Protein and fibre.", "None.", ["Ker sangri"], 95, own],
    ["Turkey Berry", ["sundakkai", "sundakai", "solanum torvum", "pea eggplant"], "Small bitter pea-sized eggplant", "Used in Tamil vathal kuzhambu and Thai curries.", "", "None.", ["Vathal kuzhambu", "Thai curries"], 95, ifct],
    ["Garden Egg", ["african eggplant", "solanum aethiopicum", "scarlet eggplant", "garden eggs"], "Small white or orange African eggplant", "Eaten raw with peanut paste or cooked in stews in West Africa.", "", "None.", ["Stews", "Garden egg stew"], 95, fao],
    ["Winged Bean", ["winged beans", "goa bean", "four-angled bean", "psophocarpus tetragonolobus"], "Four-winged tropical pod", "Young pods are sliced into salads and stir-fries.", "Protein-rich legume.", "None.", ["Salads", "Stir-fries"], 96, fdcRef("Winged beans, immature seeds, raw")],
  ]),
];
