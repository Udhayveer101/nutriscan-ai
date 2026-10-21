// Expansion batch 12 — Pool 6: fruit (temperate, citrus, berries).
import type { SeedIngredient, SeedRef } from "./types";
import { wholeFoods, AUNE_FV } from "./whole";

export const LATEX_FRUIT: SeedRef = { title: "Latex-fruit syndrome: frequency of cross-reacting IgE antibodies", authors: "Brehler R, Theissen U, Mohr C, Luger T", journal: "Allergy 52(4):404–410", year: 1997,
  findings: "People with natural rubber latex allergy frequently show IgE cross-reactivity to banana, avocado, kiwi and chestnut." };
const GRAPEFRUIT: SeedRef = { title: "Grapefruit Juice and Some Drugs Don't Mix", authors: "U.S. Food and Drug Administration", journal: "FDA Consumer Updates", year: 2017,
  url: "https://www.fda.gov/consumers/consumer-updates/grapefruit-juice-and-some-drugs-dont-mix", findings: "Grapefruit and its juice block the gut enzyme CYP3A4, raising blood levels of drugs such as some statins and calcium-channel blockers." };

export const EU_CLAIMS = (findings: string): SeedRef => ({ title: "Commission Regulation (EU) No 432/2012 establishing a list of permitted health claims made on foods", authors: "European Commission",
  journal: "Official Journal of the European Union, L 136", year: 2012, url: "https://eur-lex.europa.eu/eli/reg/2012/432/oj", findings });

export const fruit = wholeFoods("fruit", {
  refs: [AUNE_FV],
  benefits: "Provides fibre, vitamins and polyphenols; higher fruit and vegetable intake is linked to lower cardiovascular and all-cause mortality.",
  concerns: "None.",
  isVegan: true,
});

export const BATCH_12: SeedIngredient[] = [
  ...fruit([
    ["Apple", ["apples", "fresh apple", "dried apple", "apple pieces"], "Common pome fruit", "Eaten fresh, dried, puréed or cooked in pies, sauces and baby food.", "", "None. Seeds contain small amounts of amygdalin; swallowing a few whole seeds is harmless.", ["Apple sauce", "Pies", "Baby food", "Snack bars"], 96],
    ["Pear", ["pears", "pear puree", "pear pieces"], "Sweet pome fruit", "Eaten fresh, poached, canned or puréed; pear juice concentrate is a common sweetener.", "", "None for the fruit. As juice concentrate it counts as free sugar.", ["Canned fruit", "Baby food", "Desserts"], 96],
    ["Banana", ["bananas", "banana pieces", "banana flakes"], "Starchy tropical fruit", "Eaten fresh, dried or puréed in baby food, smoothies and baking.", "A source of potassium and vitamin B6.",
      "Cross-reacts in some people with latex allergy (latex-fruit syndrome).", ["Smoothies", "Banana bread", "Baby food"], 94, { refs: [LATEX_FRUIT] }],
    ["Orange", ["oranges", "orange segments", "orange pulp", "orange zest"], "Sweet citrus fruit", "Eaten fresh or used for juice, zest and marmalade.", "Rich in vitamin C and folate.", "None for the fruit. Orange juice counts as free sugar under WHO guidance.", ["Marmalade", "Fruit salad", "Juice"], 96],
    ["Lemon", ["lemons", "lemon zest", "lemon peel", "lemon pulp"], "Sour citrus fruit", "Juice, zest and peel used to flavour drinks, dressings, baking and preserves.", "Vitamin C; acidity allows less salt for the same flavour impact.", "Citric acid can erode tooth enamel with frequent sipping.", ["Lemonade", "Dressings", "Lemon curd"], 96],
    ["Lime", ["limes", "lime zest", "lime juice", "key lime"], "Sharp green citrus fruit", "Juice and zest used in Mexican, Thai and Indian cooking and in drinks.", "Vitamin C.",
      "Lime juice on skin exposed to sunlight can cause a blistering rash (phytophotodermatitis). Acid can erode tooth enamel.", ["Salsa", "Thai curries", "Key lime pie", "Drinks"], 94],
    ["Grapefruit", ["grapefruits", "pink grapefruit", "grapefruit segments"], "Bitter-sweet large citrus", "Eaten fresh or as juice.", "Vitamin C and, in pink varieties, lycopene.",
      "Interacts with many medicines (some statins, calcium-channel blockers and others) by blocking the enzyme CYP3A4; check with a pharmacist if on regular medication.", ["Juice", "Fruit salad"], 84, { refs: [GRAPEFRUIT] }],
    ["Mandarin", ["mandarins", "mandarin oranges", "tangerine", "clementine", "satsuma", "citrus reticulata"], "Small easy-peel citrus", "Eaten fresh or canned in syrup.", "Vitamin C and beta-cryptoxanthin.", "None. Canned mandarins in syrup add sugar.", ["Canned fruit", "Fruit cups", "Salads"], 96],
    ["Grapes", ["grape", "red grapes", "green grapes", "table grapes"], "Juicy vine fruit", "Eaten fresh; also made into juice, raisins and wine.", "Polyphenols including resveratrol in red skins.",
      "Whole grapes are a known choking hazard for young children; cut them lengthwise.", ["Fruit salad", "Snack packs"], 94],
    ["Raisins", ["raisin", "sultanas", "sultana", "golden raisins", "zante currants", "dried currants", "currants"], "Dried grapes", "Grapes dried in the sun or by machine; used in cereals, baking and trail mix.", "Fibre, potassium and polyphenols.",
      "Very sugar-dense and sticky on teeth. Golden raisins are usually treated with sulphur dioxide (E220), which can trigger asthma in sensitive people.", ["Muesli", "Fruit cake", "Trail mix"], 86],
    ["Strawberry", ["strawberries", "strawberry pieces", "freeze-dried strawberries"], "Sweet red berry", "Eaten fresh, frozen or freeze-dried, and used in jams, yoghurts and desserts.", "High in vitamin C and anthocyanins.",
      "Can trigger oral allergy symptoms in some people with birch-pollen allergy. Strawberry 'flavour' is a separate ingredient.", ["Jam", "Yoghurt", "Cereal"], 94],
    ["Raspberry", ["raspberries", "raspberry pieces", "freeze-dried raspberries"], "Tart red bramble berry", "Eaten fresh or frozen and used in jams, desserts and yoghurts.", "Among the highest-fibre fruits; vitamin C and ellagitannins.",
      "Frozen raspberries have been linked to norovirus and hepatitis A outbreaks; boil imported frozen berries if advised.", ["Jam", "Desserts", "Yoghurt"], 94],
    ["Blueberry", ["blueberries", "wild blueberries", "dried blueberries"], "Small blue berry rich in anthocyanins", "Eaten fresh, frozen or dried and used in muffins, cereals and yoghurts.", "Rich in anthocyanins; fibre and vitamin K.",
      "Dried blueberries are often sweetened and oil-coated.", ["Muffins", "Cereal", "Yoghurt"], 96],
    ["Blackberry", ["blackberries", "bramble berries"], "Dark bramble berry", "Eaten fresh or frozen and used in crumbles, jams and desserts.", "High in fibre, vitamin C and anthocyanins.", "None.", ["Crumbles", "Jam"], 96],
    ["Cranberry", ["cranberries", "dried cranberries", "craisins"], "Tart red bog berry", "Rarely eaten raw; sold dried, as sauce or as juice.", "Proanthocyanidins; whole fruit adds fibre.",
      "Dried cranberries and cranberry juice drinks are almost always heavily sweetened.", ["Trail mix", "Cranberry sauce", "Juice drinks"], 88],
    ["Cherry", ["cherries", "sweet cherries", "sour cherries", "morello cherries", "dried cherries"], "Stone fruit with sweet or sour varieties", "Eaten fresh, dried, canned or used in desserts.", "Anthocyanins; vitamin C.",
      "Pits contain amygdalin; swallowing whole pits is harmless but crushed kernels release cyanide. Glacé and maraschino cherries are sugared and often coloured.", ["Black Forest gateau", "Dried fruit mix", "Desserts"], 92],
    ["Plum", ["plums", "damson", "greengage"], "Juicy stone fruit", "Eaten fresh or used in jams, crumbles and sauces.", "Vitamin C, fibre and polyphenols.", "None for the flesh; kernels are cyanogenic if crushed.", ["Jam", "Plum sauce", "Crumbles"], 96],
    ["Prunes", ["prune", "dried plums", "prune puree"], "Dried plums", "Plums of prune cultivars dried; eaten as snacks or used as a fat replacer in baking.", "EU-authorised claim: dried plums of prune cultivars (about 100 g/day) contribute to normal bowel function.",
      "Sugar-dense; large amounts have a laxative effect (sorbitol and fibre).", ["Snacks", "Baking", "Baby food"], 90, { refs: [EU_CLAIMS("Authorises the claim that dried plums of prune cultivars contribute to normal bowel function (100 g/day).")] }],
    ["Peach", ["peaches", "peach slices", "diced peaches"], "Fuzzy-skinned stone fruit", "Eaten fresh or canned and used in desserts, yoghurts and baby food.", "Vitamin C and carotenoids.", "None. Canned peaches in syrup add sugar.", ["Canned fruit", "Yoghurt", "Desserts"], 96],
    ["Nectarine", ["nectarines"], "Smooth-skinned peach", "A smooth-skinned peach variety eaten fresh.", "Vitamin C and carotenoids.", "None.", ["Fresh fruit", "Salads"], 96],
    ["Apricot", ["apricots", "fresh apricots"], "Small orange stone fruit", "Eaten fresh or used in jams and baking.", "Beta-carotene and potassium.",
      "None for the flesh. Apricot kernels are a separate product and are dangerous in quantity (cyanide).", ["Jam", "Pastries"], 96],
    ["Dried Apricots", ["dried apricot", "unsulphured apricots", "sulphured apricots"], "Dried apricot halves", "Apricots dried whole or halved; bright orange ones are treated with sulphur dioxide.", "Concentrated source of potassium, fibre and beta-carotene.",
      "Sugar-dense. Bright orange dried apricots contain sulphur dioxide (E220), which can trigger asthma in sensitive people.", ["Trail mix", "Tagines", "Cereal bars"], 86],
  ]),
];
