// Expansion batch 35 — Pool 6: label staples (water, iodised salt, milk solids), more sugars,
// juice concentrates and fermentation staples. These are among the most common words on
// real labels that earlier batches did not yet link to a row.
import type { SeedIngredient, SeedRef } from "./types";
import { family } from "./build";
import { wholeFoods } from "./whole";
import { whoSugars, euAllergens } from "./refs";
import { MILK } from "./batch-20";

const WHO_SODIUM: SeedRef = { title: "Guideline: Sodium intake for adults and children", authors: "World Health Organization", journal: "WHO Guidelines", year: 2012,
  findings: "Recommends adults consume under 2 g sodium (5 g salt) a day; salt should be iodised." };
const WHO_IODINE: SeedRef = { title: "Salt reduction and iodine fortification strategies in public health", authors: "World Health Organization", journal: "WHO technical report", year: 2014,
  findings: "Universal salt iodisation remains the main strategy to prevent iodine deficiency; salt reduction and iodisation policies are compatible." };
const WHO_WATER: SeedRef = { title: "Guidelines for drinking-water quality (4th ed., incorporating the 1st and 2nd addenda)", authors: "World Health Organization", journal: "WHO Guidelines", year: 2022,
  findings: "Sets health-based guideline values for microbial and chemical contaminants in drinking water." };
const GLUTEN = euAllergens("Cereals containing gluten are declarable allergens.");

const base = { evidenceLevel: "STRONG" as const, fdaStatus: "Food (not regulated as an additive)", efsaStatus: "Food (not regulated as an additive)", fssaiStatus: "Food (FSS Act general provisions)", whoStatus: "No ADI (food)" };
const sugar = family({
  categorySlug: "sugar-syrup", evidenceLevel: "STRONG", isNatural: true, isVegan: true,
  sciConsensus: "A sugar or syrup. Nutritionally it is free sugar like any other, whatever its colour or origin.",
  fdaStatus: "Food (counts as added sugar on US labels)", efsaStatus: "Food (counts toward free sugars)", fssaiStatus: "Food (FSS Act general provisions)", whoStatus: "Free sugar: WHO advises <10% of energy",
  benefits: "Sweetness, texture and browning.",
  concerns: "A free sugar: WHO advises keeping free sugars below 10% (ideally 5%) of energy.",
  refs: [whoSugars("Recommends limiting free sugars, including those in syrups, honey and unrefined sugars, to under 10% of energy.")],
});
const juice = family({
  ...base, categorySlug: "culinary", isNatural: true, isVegan: true,
  refs: [whoSugars("Counts sugars naturally present in fruit juices and concentrates as free sugars, to be kept under 10% of energy.")],
  sciConsensus: "Juice boiled down to a syrup. WHO counts its sugars as free sugars.",
  concerns: "Used to sweeten 'no added sugar' products: nutritionally it is added sugar under another name.",
  benefits: "Sweetness and fruit flavour.",
});
const salty = family({
  ...base, categorySlug: "culinary", isNatural: true, isVegan: true, refs: [WHO_SODIUM],
  sciConsensus: "Salt. The scanner treats it as a concern when it dominates a product and minor in trace amounts.",
  concerns: "WHO advises under 5 g salt a day.",
});
const culinary = wholeFoods("culinary", { refs: [] });
const dairy = wholeFoods("dairy-egg", {
  refs: [MILK], isVegan: false,
  benefits: "Protein, calcium and B vitamins.",
  concerns: "Milk is a declarable allergen; lactose may cause symptoms in lactose intolerance.",
});

export const BATCH_35: SeedIngredient[] = [
  ...culinary([
    ["Water", ["drinking water", "purified water", "filtered water", "potable water", "aqua"], "Water", "The most common ingredient on labels: dilutes drinks, hydrates doughs and forms brines.", "None needed.", "None. Listed first in drinks and sauces where it is the main ingredient.", ["Drinks", "Sauces", "Bread"], 97, { refs: [WHO_WATER] }],
    ["Carbonated Water", ["sparkling water", "soda water", "carbonated mineral water", "seltzer", "club soda"], "Water with dissolved carbon dioxide", "The base of soft drinks and sparkling waters.", "None needed.", "Carbonic acid is mildly acidic; plain sparkling water is far less erosive to teeth than soft drinks.", ["Soft drinks", "Sparkling water"], 95, { refs: [WHO_WATER] }],
    ["Mineral Water", ["natural mineral water", "spring water", "spring mineral water"], "Water from a protected underground source", "Bottled as drinking water and used in drinks.", "Naturally contains calcium, magnesium and bicarbonate.", "Some mineral waters are high in sodium; check the label.", ["Bottled water"], 96, { refs: [WHO_WATER] }],
    ["Lemon Juice", ["fresh lemon juice", "lemon juice from concentrate", "nimbu ras"], "Juice of lemons", "Adds sourness to drinks, dressings and sauces, and stops browning.", "Vitamin C.", "Acidic; frequent sipping can erode tooth enamel.", ["Dressings", "Drinks", "Sauces"], 92],
    ["Spirit Vinegar", ["distilled vinegar", "distilled white vinegar", "spirit vinegar (distilled)", "alcohol vinegar"], "Vinegar made from distilled alcohol", "Used in pickles, sauces, ketchup and crisps.", "Acidity and preservation without additives.", "None.", ["Ketchup", "Pickles", "Mayonnaise"], 94],
    ["Cocoa Mass", ["cocoa liquor", "cocoa paste", "chocolate liquor", "cacao mass", "unsweetened chocolate"], "Ground roasted cocoa nibs", "The base of all chocolate.", "Cocoa flavanols, fibre, iron and magnesium.", "Naturally contains caffeine and theobromine; can carry cadmium depending on origin (EU limits apply).", ["Chocolate", "Baking chocolate"], 88],
    ["Nutritional Yeast", ["nooch", "inactive yeast flakes", "deactivated yeast", "savoury yeast flakes"], "Deactivated yeast flakes", "Gives a cheesy, savoury flavour to vegan dishes and snacks.", "Protein and B vitamins; often fortified with B12.", "None.", ["Vegan cheese sauces", "Popcorn seasoning"], 92],
    ["Brewer's Yeast", ["brewers yeast", "debittered brewer's yeast"], "Inactive yeast left from brewing", "Used as a supplement and savoury ingredient.", "B vitamins and chromium.", "None.", ["Supplements", "Savoury spreads"], 90],
    ["Sourdough Starter", ["sourdough", "levain", "sourdough culture", "sour dough", "natural leaven"], "Wild yeast and lactic bacteria culture", "Leavens and sours bread without commercial yeast.", "Long fermentation lowers phytate and can improve mineral availability.", "Made from wheat or rye flour: contains gluten.", ["Sourdough bread"], 92, { refs: [GLUTEN] }],
  ]),
  salty({ slug: "iodised-salt", name: "Iodised Salt", aliases: ["iodized salt", "iodised table salt", "iodized table salt", "salt (iodised)", "double fortified salt"], purposeShort: "Table salt with added iodine", purpose: "Salt fortified with potassium iodide or iodate to prevent iodine deficiency; mandatory for edible salt in India.",
    benefits: "Prevents iodine deficiency (goitre, impaired child development).", safetyScore: 36, commonProducts: ["Table salt", "Snacks", "Ready meals"], refs: [WHO_SODIUM, WHO_IODINE],
    concerns: "Still salt: WHO advises under 5 g a day. Iodisation is a public-health benefit, not a reason to eat more." }),
  ...dairy([
    ["Milk Solids", ["total milk solids", "milk solids non-fat", "msnf", "non-fat milk solids", "dairy solids"], "Dried milk components declared together", "The dried protein, lactose and minerals of milk, used in chocolate, ice cream and bakery.", "Protein and calcium.", "Milk allergen. A label term covering milk powder, whey and milk proteins together.", ["Milk chocolate", "Ice cream", "Biscuits"], 82],
    ["Dairy Whitener", ["dairy creamer", "milk whitener", "spray dried dairy whitener"], "Sweetened milk powder for tea and coffee", "Used in tea, coffee and vending machines.", "Milk protein and calcium.", "Milk allergen. Indian standards allow up to 18% added sugar.", ["Tea premixes", "Coffee premixes"], 72],
    ["Clotted Cream", ["devonshire cream", "cornish clotted cream"], "Thick scalded cream", "Served with scones and in desserts.", "", "Milk allergen. About 55–64% fat, mostly saturated.", ["Cream teas", "Fudge"], 74],
    ["Rabri", ["rabdi", "rabadi"], "Reduced sweetened milk with layers of cream", "Served as a dessert and with jalebi or kulfi.", "", "Milk allergen. Sweetened with sugar.", ["Rabri jalebi", "Kulfi"], 72],
    ["Shrikhand", ["srikhand", "amrakhand", "chakka"], "Sweetened strained yoghurt", "Served as a dessert in Maharashtra and Gujarat.", "Protein and calcium.", "Milk allergen. Sweetened with sugar.", ["Puri shrikhand"], 74],
    ["Colby Cheese", ["colby", "colby jack"], "Mild American washed-curd cheese", "Used in sandwiches and melts.", "Protein and calcium.", "Milk allergen. High in saturated fat and salt.", ["Sandwiches"], 78],
  ]),
  sugar({ slug: "brown-sugar", name: "Brown Sugar", aliases: ["soft brown sugar", "light brown sugar", "dark brown sugar"], purposeShort: "White sugar coated with molasses", purpose: "Refined sugar with molasses added back for colour and flavour; used in baking and sauces.", safetyScore: 30, commonProducts: ["Biscuits", "BBQ sauce", "Cakes"] }),
  sugar({ slug: "icing-sugar", name: "Icing Sugar", aliases: ["powdered sugar", "confectioners' sugar", "confectioners sugar", "powder sugar", "10x sugar"], purposeShort: "Finely powdered sugar", purpose: "Sugar milled to a powder, often with starch or an anti-caking agent; used in icings and confectionery.", safetyScore: 30, commonProducts: ["Icing", "Doughnuts", "Confectionery"] }),
  sugar({ slug: "caster-sugar", name: "Caster Sugar", aliases: ["castor sugar", "superfine sugar", "baker's sugar"], purposeShort: "Fine-grained white sugar", purpose: "Dissolves quickly; used in meringues, sponges and drinks.", safetyScore: 30, commonProducts: ["Cakes", "Meringues"] }),
  sugar({ slug: "rock-sugar", name: "Rock Sugar", aliases: ["mishri", "misri", "rock candy", "crystal sugar", "lump sugar", "bing tang"], purposeShort: "Large sugar crystals", purpose: "Crystallised sugar used in Indian mouth fresheners and Chinese tonics.", safetyScore: 32, commonProducts: ["Mukhwas", "Chinese desserts"] }),
  sugar({ slug: "panela", name: "Panela", aliases: ["piloncillo", "rapadura", "chancaca", "sucanat"], purposeShort: "Unrefined whole cane sugar", purpose: "Sugar-cane juice boiled and set into blocks; the Latin American equivalent of jaggery.", safetyScore: 32, commonProducts: ["Agua de panela", "Mexican sweets"] }),
  sugar({ slug: "date-sugar", name: "Date Sugar", aliases: ["date sugar powder"], purposeShort: "Ground dried dates", purpose: "Dried dates ground to a sugar-like powder; used in 'refined sugar free' products.", safetyScore: 44, benefits: "Keeps the date's fibre and potassium.", commonProducts: ["Energy bars", "Baby snacks"],
    concerns: "Still concentrated sugar, though unlike syrups it keeps the fruit's fibre." }),
  sugar({ slug: "birch-syrup", name: "Birch Syrup", aliases: ["birch syrup (pure)"], purposeShort: "Syrup from birch sap", purpose: "Birch tree sap boiled down to a tangy syrup.", safetyScore: 32, commonProducts: ["Gourmet syrups"] }),
  sugar({ slug: "raw-cane-sugar", name: "Raw Cane Sugar", aliases: ["raw sugar", "golden caster sugar", "golden granulated sugar"], purposeShort: "Lightly refined golden cane sugar", purpose: "Cane sugar crystallised with a little molasses left on.", safetyScore: 30, commonProducts: ["Biscuits", "Granola"] }),
  sugar({ slug: "coconut-nectar", name: "Coconut Nectar", aliases: ["coconut syrup", "coconut sap syrup", "coconut blossom nectar"], purposeShort: "Syrup from coconut-flower sap", purpose: "Coconut sap boiled to a syrup and marketed as a natural sweetener.", safetyScore: 32, commonProducts: ["Raw desserts", "Snack bars"] }),
  sugar({ slug: "palm-jaggery", name: "Palm Jaggery", aliases: ["karupatti", "palm gur"], purposeShort: "Jaggery from palmyra sap", purpose: "Palmyra sap boiled into dark blocks; used in Tamil sweets and coffee.", safetyScore: 32, commonProducts: ["Karupatti coffee", "South Indian sweets"] }),
  sugar({ slug: "sugar-syrup", name: "Sugar Syrup", aliases: ["liquid sugar", "sucrose syrup"], purposeShort: "Sugar dissolved in water", purpose: "Sweetens drinks, canned fruit and Indian sweets.", safetyScore: 30, commonProducts: ["Canned fruit", "Gulab jamun", "Cocktails"] }),
  sugar({ slug: "pearl-sugar", name: "Pearl Sugar", aliases: ["nib sugar", "hail sugar", "sugar nibs", "belgian pearl sugar"], purposeShort: "Hard compressed sugar nuggets", purpose: "Sprinkled on buns and Liège waffles; does not melt in baking.", safetyScore: 30, commonProducts: ["Liège waffles", "Swedish buns"] }),
  sugar({ slug: "manuka-honey", name: "Manuka Honey", aliases: ["manuka", "mānuka honey"], purposeShort: "New Zealand honey from manuka flowers", purpose: "A premium honey graded by its methylglyoxal (MGO) content.", safetyScore: 75, commonProducts: ["Premium honey", "Lozenges"],
    concerns: "Nutritionally a free sugar like any honey; health claims for eating it are not authorised. Never give honey to infants under 12 months (botulism)." }),
  sugar({ slug: "honeycomb", name: "Honeycomb", aliases: ["comb honey", "honey comb"], purposeShort: "Honey still in its wax comb", purpose: "Eaten as is or on desserts.", safetyScore: 75, commonProducts: ["Desserts", "Cheese boards"],
    concerns: "A free sugar like any honey. Never give honey to infants under 12 months (botulism). ('Honeycomb' toffee is a different, sugar-and-bicarbonate sweet.)" }),
  juice({ slug: "fruit-juice-concentrate", name: "Fruit Juice Concentrate", aliases: ["concentrated fruit juice", "fruit juice concentrates", "concentrated fruit juices"], purposeShort: "Fruit juice boiled down to a syrup", purpose: "Sweetens 'no added sugar' snacks, cereals and drinks.", safetyScore: 34, commonProducts: ["Fruit snacks", "Juice drinks", "Cereal bars"] }),
  juice({ slug: "apple-juice-concentrate", name: "Apple Juice Concentrate", aliases: ["concentrated apple juice"], purposeShort: "Concentrated apple juice", purpose: "A neutral-tasting sweetener in fruit snacks, baby foods and juice drinks.", safetyScore: 34, commonProducts: ["Fruit snacks", "Baby food"] }),
  juice({ slug: "grape-juice-concentrate", name: "Grape Juice Concentrate", aliases: ["concentrated grape juice", "white grape juice concentrate", "concentrated white grape juice"], purposeShort: "Concentrated grape juice", purpose: "One of the most common hidden sweeteners in fruit snacks and drinks.", safetyScore: 34, commonProducts: ["Fruit snacks", "Juice drinks"] }),
  juice({ slug: "pear-juice-concentrate", name: "Pear Juice Concentrate", aliases: ["concentrated pear juice"], purposeShort: "Concentrated pear juice", purpose: "Sweetens baby foods and snacks.", safetyScore: 34, commonProducts: ["Baby food", "Fruit bars"] }),
];
