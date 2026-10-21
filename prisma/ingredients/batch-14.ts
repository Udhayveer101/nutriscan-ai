// Expansion batch 14 — Pool 6: everyday vegetables, roots and tubers.
import type { SeedIngredient, SeedRef } from "./types";
import { wholeFoods, AUNE_FV } from "./whole";
import { efsa, euAllergens } from "./refs";
import { EU_CONTAMINANTS } from "./batch-13";

const ACRYLAMIDE = efsa("Contaminants in the Food Chain (CONTAM)", "Scientific Opinion on acrylamide in food", 2015,
  "Acrylamide, formed when starchy foods such as potatoes are fried, roasted or baked at high temperatures, raises concern for carcinogenic effects at current exposure levels.");
export const VITK: SeedRef = { title: "Warfarin (drug information)", authors: "U.S. National Library of Medicine", journal: "MedlinePlus Drug Information", year: 2023, url: "https://medlineplus.gov/druginfo/meds/a682277.html",
  findings: "People on warfarin should keep their intake of vitamin K-rich foods, such as leafy green vegetables, consistent." };
const FODMAP = "Rich in fructans (FODMAPs), which can trigger symptoms in people with irritable bowel syndrome.";

export const veg = wholeFoods("vegetable", {
  refs: [AUNE_FV],
  benefits: "Provides fibre, vitamins, minerals and polyphenols; higher vegetable intake is linked to lower cardiovascular and all-cause mortality.",
  concerns: "None.",
});

export const BATCH_14: SeedIngredient[] = [
  ...veg([
    ["Tomato", ["tomatoes", "fresh tomatoes", "chopped tomatoes", "diced tomatoes", "plum tomatoes", "cherry tomatoes"], "Juicy red fruit used as a vegetable", "Eaten raw and cooked into sauces, soups, curries and ketchup.", "Lycopene (better absorbed when cooked with fat), vitamin C and potassium.", "None.", ["Pasta sauce", "Ketchup", "Soups", "Curries"], 96],
    ["Potato", ["potatoes", "dehydrated potato", "potato flakes", "mashed potato", "aloo"], "Starchy staple tuber", "Boiled, mashed, baked or fried; dried as flakes for snacks and instant mash.", "Potassium, vitamin C and fibre (with skin).",
      "Green or sprouting potatoes contain solanine. Frying, roasting and baking form acrylamide; fried potato products are energy-dense.", ["Crisps", "Chips", "Instant mash", "Curries"], 88, { refs: [ACRYLAMIDE] }],
    ["Onion", ["onions", "red onion", "white onion", "brown onion", "fried onions", "pyaz"], "Pungent bulb vegetable", "Used raw, cooked or dried as a flavour base in almost every cuisine.", "Quercetin and other polyphenols; prebiotic fructans.", FODMAP, ["Sauces", "Curries", "Soups", "Snacks"], 94],
    ["Garlic", ["garlic cloves", "fresh garlic", "minced garlic", "garlic puree", "lehsun"], "Pungent bulb used for flavour", "Used fresh, minced, puréed or dried in sauces, marinades and dressings.", "Allicin-derived sulphur compounds; modest blood-pressure lowering in trials of supplements.",
      `${FODMAP} High-dose garlic supplements can increase bleeding risk with anticoagulants.`, ["Garlic bread", "Pasta sauce", "Curries", "Dips"], 92],
    ["Spinach", ["spinach leaves", "baby spinach", "palak", "frozen spinach"], "Dark leafy green", "Eaten raw in salads or cooked in curries, pies and pasta.", "Folate, vitamin K, vitamin A and nitrate; iron is present but poorly absorbed (oxalate).",
      "High in oxalate (kidney-stone risk in susceptible people) and vitamin K (keep intake consistent on warfarin).", ["Palak paneer", "Spanakopita", "Smoothies"], 92, { refs: [VITK] }],
    ["Carrot", ["carrots", "grated carrot", "carrot puree", "baby carrots"], "Sweet orange root", "Eaten raw or cooked; used in soups, cakes, baby food and juices.", "Very high in beta-carotene (vitamin A precursor).",
      "Can cause oral allergy symptoms in people with birch-pollen allergy.", ["Carrot cake", "Soups", "Baby food", "Gajar halwa"], 96],
    ["Broccoli", ["broccoli florets", "tenderstem broccoli", "calabrese"], "Green brassica florets", "Steamed, roasted or stir-fried; used in soups and frozen mixes.", "Vitamin C, vitamin K, folate and glucosinolates (sulforaphane precursors).", "None.", ["Stir-fries", "Soups", "Frozen vegetables"], 96],
    ["Cauliflower", ["cauliflower florets", "cauliflower rice", "gobi", "riced cauliflower"], "White brassica florets", "Roasted, curried, or riced as a low-carb grain substitute.", "Vitamin C, vitamin K and glucosinolates; low in calories.", "None.", ["Aloo gobi", "Cauliflower rice", "Pizza bases"], 96],
    ["Cabbage", ["white cabbage", "green cabbage", "savoy cabbage", "red cabbage", "patta gobi"], "Dense-headed brassica", "Eaten raw in coleslaw, fermented into sauerkraut and kimchi, or cooked.", "Vitamin C, vitamin K and glucosinolates; red cabbage adds anthocyanins.", "None.", ["Coleslaw", "Stir-fries", "Soups"], 96],
    ["Brussels Sprouts", ["brussels sprout"], "Mini cabbage-like buds", "Roasted, steamed or shredded raw.", "Vitamin C, vitamin K and glucosinolates.", "High in vitamin K; keep intake consistent on warfarin.", ["Roast vegetables", "Frozen vegetables"], 94, { refs: [VITK] }],
    ["Kale", ["curly kale", "cavolo nero", "lacinato kale", "kale chips"], "Robust leafy brassica", "Cooked, blended into smoothies or baked into chips.", "Vitamin K, vitamin C, vitamin A, calcium and lutein.", "Very high in vitamin K; keep intake consistent on warfarin.", ["Kale chips", "Smoothies", "Soups"], 94, { refs: [VITK] }],
    ["Lettuce", ["iceberg lettuce", "romaine lettuce", "cos lettuce", "little gem", "butterhead lettuce", "mixed leaves"], "Mild salad leaf", "Eaten raw in salads, sandwiches and wraps.", "Mostly water; romaine provides vitamin A, vitamin K and folate.",
      "Eaten raw, so contamination matters: romaine lettuce caused several E. coli O157 outbreaks; wash leaves and observe recalls.", ["Salads", "Sandwiches", "Burgers"], 94],
    ["Rocket", ["arugula", "rucola", "roquette", "wild rocket"], "Peppery salad leaf", "Eaten raw in salads and on pizza.", "Vitamin K, calcium and nitrate.",
      "Accumulates nitrate; the EU sets a specific maximum nitrate level for rocket.", ["Salads", "Pizza"], 92, { refs: [EU_CONTAMINANTS("Sets maximum nitrate levels for rocket (rucola), spinach and lettuce.")] }],
    ["Watercress", ["water cress", "nasturtium officinale"], "Peppery aquatic leaf", "Eaten raw in salads and sandwiches or blended into soup.", "Vitamin K, vitamin C and glucosinolates.", "Wild-harvested watercress can carry liver fluke; buy cultivated.", ["Salads", "Soups"], 94],
    ["Celery", ["celery stalks", "celery sticks", "celery stick", "apium graveolens"], "Crunchy stalk vegetable", "Eaten raw or used as an aromatic base (with onion and carrot) in stocks, soups and sauces.", "Low in calories; vitamin K and potassium.",
      "Celery is a declarable EU allergen; reactions can be severe.", ["Soups", "Stocks", "Salads"], 86, { refs: [euAllergens("Celery and products thereof are declarable allergens.")] }],
    ["Cucumber", ["cucumbers", "kheera", "english cucumber"], "Watery salad vegetable", "Eaten raw in salads, raita and sandwiches, or pickled.", "Hydrating; low in calories.", "None.", ["Salads", "Raita", "Tzatziki"], 96],
    ["Courgette", ["courgettes", "zucchini", "zucchinis", "summer squash"], "Mild summer squash", "Grilled, roasted, spiralised or baked into breads and fritters.", "Low in calories; vitamin C and potassium.",
      "Rarely, bitter-tasting courgettes contain toxic cucurbitacins; discard any that taste very bitter.", ["Ratatouille", "Courgetti", "Fritters"], 94],
    ["Aubergine", ["eggplant", "aubergines", "brinjal", "baingan", "eggplants"], "Spongy purple nightshade", "Roasted, grilled, fried or puréed into baba ganoush and baingan bharta.", "Fibre and nasunin (an anthocyanin in the skin).",
      "Soaks up large amounts of oil when fried. Despite its name, eggplant contains no egg.", ["Moussaka", "Baba ganoush", "Baingan bharta"], 94],
    ["Bell Pepper", ["bell peppers", "sweet pepper", "capsicum", "red pepper", "green pepper", "yellow pepper", "shimla mirch", "roasted red peppers", "peppers", "mixed peppers"], "Sweet, crunchy capsicum", "Eaten raw, roasted, stuffed or stir-fried.", "Red peppers are among the richest vegetable sources of vitamin C; carotenoids.", "None.", ["Fajitas", "Salads", "Pizza"], 96],
    ["Green Chilli", ["green chillies", "green chili", "hari mirch", "jalapeno", "jalapeño", "serrano chilli", "bird's eye chilli"], "Fresh hot chilli pepper", "Fresh chillies used whole, sliced or pickled for heat.", "Vitamin C; capsaicin.", "Capsaicin causes burning and can irritate the gut in sensitive people.", ["Curries", "Salsa", "Nachos"], 92],
    ["Pumpkin", ["pumpkins", "pumpkin puree", "kaddu"], "Large orange winter squash", "Roasted, puréed into soups and pies, or cooked in curries.", "Very high in beta-carotene; fibre and potassium.", "None. Pumpkin-spice products often contain no pumpkin.", ["Pumpkin pie", "Soups", "Curries"], 96],
    ["Butternut Squash", ["butternut", "butternut pumpkin", "winter squash"], "Sweet orange winter squash", "Roasted or puréed into soups, risottos and baby food.", "Very high in beta-carotene; fibre and potassium.", "None. Despite its name it contains no butter or nuts.", ["Soups", "Risotto", "Baby food"], 96],
    ["Sweet Potato", ["sweet potatoes", "shakarkandi", "kumara", "orange sweet potato"], "Sweet starchy tuber", "Baked, mashed or fried; used in baby food and snacks.", "Orange-fleshed varieties are very high in beta-carotene; fibre and potassium.", "Fried sweet potato fries form acrylamide like other starchy foods.", ["Sweet potato fries", "Baby food", "Curries"], 94],
    ["Yam", ["yams", "true yam", "dioscorea", "white yam", "suran", "elephant foot yam"], "Starchy tropical tuber", "Boiled, pounded or fried as a staple starch in West Africa, the Caribbean and India.", "Starch, fibre and potassium.",
      "Must be peeled and cooked; raw yam contains irritants. (US 'yams' are usually sweet potatoes.)", ["Pounded yam", "Curries", "Chips"], 92],
    ["Cassava", ["cassava root", "yuca", "manioc", "tapioca root"], "Starchy tropical root", "Boiled, fried or processed into flour, gari, fufu and tapioca.", "Energy-dense staple; gluten-free.",
      "Raw cassava contains cyanogenic glycosides (linamarin); it must be peeled, soaked and cooked. Poorly processed bitter cassava causes cyanide poisoning and konzo.", ["Cassava chips", "Fufu", "Gari"], 82],
    ["Taro", ["taro root", "colocasia", "arbi", "dasheen", "eddoe"], "Starchy corm with purple-flecked flesh", "Boiled, fried or steamed in Asian, Pacific and Indian cooking.", "Fibre, potassium and resistant starch.",
      "Raw taro contains calcium oxalate crystals that irritate the mouth; it must be cooked.", ["Taro chips", "Arbi curry", "Bubble tea"], 92],
    ["Beetroot", ["beetroots", "beets", "red beet", "chukandar", "cooked beetroot"], "Earthy red root", "Eaten roasted, pickled, juiced or grated raw.", "Dietary nitrate (lowers blood pressure in trials), folate and betalains.",
      "Harmless pink urine (beeturia) in some people; high in oxalate.", ["Salads", "Juice", "Borscht"], 94],
    ["Parsnip", ["parsnips"], "Sweet pale root", "Roasted, mashed or puréed into soup.", "Fibre, folate and potassium.", "None.", ["Roast vegetables", "Soups"], 96],
    ["Turnip", ["turnips", "shalgam"], "Peppery white root", "Boiled, mashed, pickled or added to stews.", "Vitamin C and fibre; low in calories.", "None.", ["Stews", "Pickles"], 96],
    ["Swede", ["rutabaga", "neeps", "swedes"], "Yellow-fleshed root vegetable", "Boiled and mashed (neeps) or added to pasties and stews.", "Vitamin C and fibre.", "None.", ["Cornish pasty", "Haggis, neeps and tatties"], 96],
    ["Radish", ["radishes", "red radish", "mooli", "daikon", "white radish", "mooli radish"], "Crisp peppery root", "Eaten raw in salads, pickled or cooked; daikon is grated and simmered in Asian cooking.", "Vitamin C; low in calories.", "None.", ["Salads", "Mooli paratha", "Kimchi"], 96],
    ["Leek", ["leeks"], "Mild onion-family stalk", "Cooked in soups, pies and gratins.", "Vitamin K, folate and prebiotic fructans.", FODMAP, ["Leek and potato soup", "Pies"], 94],
    ["Spring Onion", ["spring onions", "scallion", "scallions", "green onion", "green onions", "hara pyaz"], "Young onion with green tops", "Eaten raw or lightly cooked in salads, stir-fries and garnishes.", "Vitamin K and vitamin C.", "Green tops are low-FODMAP; the white bulb is not.", ["Stir-fries", "Salads", "Noodles"], 96],
    ["Shallots", ["shallot", "banana shallot"], "Small, mild onion", "Used in dressings, sauces, Thai curries and pickles.", "Polyphenols and prebiotic fructans.", FODMAP, ["Vinaigrettes", "Thai curry paste", "Fried shallots"], 94],
    ["Asparagus", ["asparagus spears", "green asparagus", "white asparagus"], "Tender green shoots", "Steamed, grilled or roasted; canned white asparagus is popular in Europe.", "Folate, vitamin K and prebiotic fibre.", "None (the smell it gives urine is harmless).", ["Quiches", "Soups", "Canned vegetables"], 96],
    ["Globe Artichoke", ["artichoke", "artichokes", "artichoke hearts", "marinated artichokes"], "Thistle flower bud", "Hearts eaten steamed, grilled, marinated or canned.", "Fibre, inulin and cynarin-type polyphenols.", "Marinated artichokes in jars are oily and salty.", ["Antipasti", "Pizza", "Dips"], 94],
    ["Fennel Bulb", ["florence fennel", "fennel", "finocchio"], "Anise-flavoured bulb", "Eaten raw in salads or roasted and braised.", "Vitamin C, potassium and fibre.", "None at food amounts.", ["Salads", "Roast vegetables"], 96],
    ["Okra", ["ladies' fingers", "lady's finger", "bhindi"], "Mucilaginous green pod", "Fried, stewed or curried; its mucilage thickens gumbo.", "Fibre, vitamin C, vitamin K and folate.", "None.", ["Bhindi masala", "Gumbo"], 96],
  ]),
];
