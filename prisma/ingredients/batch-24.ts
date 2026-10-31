// Expansion batch 24 — Pool 6: traditional sugars and syrups; coffee, teas, cocoa and infusion plants.
// Sugars route to the unrefined-sugar-syrups KB profile (free sugars, HIGH when dominant).
import type { SeedIngredient, SeedRef } from "./types";
import { family } from "./build";
import { wholeFoods } from "./whole";
import { whoSugars, efsa, iarc, paper } from "./refs";
import { EU_CONTAMINANTS } from "./batch-13";

const CAFFEINE = efsa("Dietetic Products, Nutrition and Allergies (NDA)", "Scientific Opinion on the safety of caffeine", 2015,
  "Habitual caffeine intakes up to 400 mg/day (200 mg/day in pregnancy) do not raise safety concerns for healthy adults.");
const HOT_BEV = iarc(116, "Drinking Coffee, Mate, and Very Hot Beverages", 2018,
  "Coffee drinking was not classifiable as to carcinogenicity (Group 3); drinking very hot beverages above 65 °C, including mate, is probably carcinogenic (Group 2A) for the oesophagus.");
export const EMA_HERBAL = (plant: string, findings: string): SeedRef => ({ title: `European Union herbal monograph: ${plant}`, authors: "European Medicines Agency, Committee on Herbal Medicinal Products (HMPC)",
  journal: "EMA herbal medicines", year: 2024, url: "https://www.ema.europa.eu/en/human-regulatory-overview/herbal-medicinal-products", findings });

const sugar = family({
  categorySlug: "sugar-syrup", evidenceLevel: "STRONG", isNatural: true, isVegan: true,
  sciConsensus: "A traditional sugar. It carries traces of minerals and flavour, but nutritionally it is free sugar like any other.",
  fdaStatus: "Food (counts as added sugar on US labels)", efsaStatus: "Food (counts toward free sugars)", fssaiStatus: "Food (FSS Act general provisions)", whoStatus: "Free sugar: WHO advises <10% of energy",
  benefits: "Flavour and sweetness; small amounts of minerals not present in white sugar.",
  concerns: "A free sugar: WHO advises keeping free sugars below 10% (ideally 5%) of energy. 'Natural' or 'unrefined' sugars are not meaningfully healthier than white sugar.",
  refs: [whoSugars("Recommends limiting free sugars, including those in syrups, honey and unrefined sugars, to under 10% of energy.")],
});

const bev = wholeFoods("botanical", {
  refs: [],
  sciConsensus: "A traditional beverage plant. Scored as a whole food.",
  concerns: "None at usual intakes.",
});
const COFFEE_C = "Caffeine: EFSA considers up to 400 mg/day safe for adults and 200 mg/day in pregnancy.";

export const BATCH_24: SeedIngredient[] = [
  sugar({ slug: "muscovado-sugar", name: "Muscovado Sugar", aliases: ["muscovado", "dark muscovado"], purposeShort: "Moist dark unrefined cane sugar", purpose: "Partially refined cane sugar that keeps its molasses; used in baking, toffee and barbecue sauces.", safetyScore: 32, commonProducts: ["Gingerbread", "Sticky toffee pudding", "BBQ sauce"] }),
  sugar({ slug: "demerara-sugar", name: "Demerara Sugar", aliases: ["demerara", "turbinado sugar", "turbinado"], purposeShort: "Large golden crystals of light cane sugar", purpose: "Lightly refined crystallised cane sugar used on crumbles, in coffee and baking.", safetyScore: 32, commonProducts: ["Crumbles", "Coffee", "Flapjacks"] }),
  sugar({ slug: "coconut-sugar", name: "Coconut Sugar", aliases: ["coconut palm sugar", "coconut sap sugar"], purposeShort: "Sugar from coconut palm sap", purpose: "Boiled, dried coconut-flower sap marketed as a 'low-GI' alternative sugar.", safetyScore: 32, commonProducts: ["Health bars", "Granola", "Baking"],
    concerns: "A free sugar like any other: mostly sucrose. Its low-GI claim rests on very limited testing." }),
  sugar({ slug: "palm-sugar", name: "Palm Sugar", aliases: ["gula melaka", "gula jawa", "nam tan pip", "palmyra jaggery"], purposeShort: "Sugar from palm sap", purpose: "Boiled sap of sugar, palmyra or nipa palms; used in Thai, Malaysian and Indonesian cooking and desserts.", safetyScore: 32, commonProducts: ["Pad Thai", "Cendol", "Curries"] }),
  sugar({ slug: "khandsari", name: "Khandsari", aliases: ["khandsari sugar", "desi khand"], purposeShort: "Traditional Indian open-pan cane sugar", purpose: "Semi-refined cane sugar made by small-scale open-pan processing in India.", safetyScore: 32, commonProducts: ["Indian sweets", "Sharbat"] }),
  sugar({ slug: "nolen-gur", name: "Nolen Gur", aliases: ["khejur gur", "date palm jaggery", "notun gur", "patali gur"], purposeShort: "Winter date-palm jaggery of Bengal", purpose: "Sap of the date palm boiled into liquid or solid jaggery; used in Bengali winter sweets.", safetyScore: 32, commonProducts: ["Sandesh", "Rasgulla", "Payesh"] }),
  sugar({ slug: "kithul-treacle", name: "Kithul Treacle", aliases: ["kithul jaggery", "kitul treacle", "kithul pani"], purposeShort: "Fishtail-palm syrup of Sri Lanka", purpose: "Boiled sap of the kithul palm, poured over curd and used in sweets.", safetyScore: 32, commonProducts: ["Curd and treacle", "Sri Lankan sweets"] }),
  sugar({ slug: "sorghum-syrup", name: "Sorghum Syrup", aliases: ["sorghum molasses", "sweet sorghum syrup"], purposeShort: "Syrup from sweet sorghum cane", purpose: "Juice of sweet sorghum stalks boiled into a syrup; a Southern US sweetener.", safetyScore: 32, commonProducts: ["Biscuits", "Baking"] }),
  sugar({ slug: "pomegranate-molasses", name: "Pomegranate Molasses", aliases: ["pomegranate syrup", "dibs rumman", "nar ekşisi"], purposeShort: "Tart reduced pomegranate juice", purpose: "Pomegranate juice boiled down to a sweet-sour syrup; used in Middle Eastern dressings and marinades.", benefits: "Tart flavour; some polyphenols.",
    safetyScore: 38, commonProducts: ["Muhammara", "Fattoush dressing", "Marinades"], concerns: "Concentrated fruit sugar (free sugar), though used in small amounts; some brands add sugar." }),
  sugar({ slug: "grape-molasses", name: "Grape Molasses", aliases: ["pekmez", "grape syrup"], purposeShort: "Reduced grape-juice syrup", purpose: "Grape juice boiled down to a thick syrup; eaten with tahini in Turkey and the Levant.", safetyScore: 32, commonProducts: ["Tahini-pekmez", "Desserts"] }),
  sugar({ slug: "carob-syrup", name: "Carob Syrup", aliases: ["carob molasses", "carob pekmez", "harrub syrup"], purposeShort: "Syrup from carob pods", purpose: "Carob pods soaked and boiled into a dark syrup; a Mediterranean sweetener.", safetyScore: 32, commonProducts: ["Desserts", "Health foods"] }),
  ...bev([
    ["Coffee", ["ground coffee", "roast coffee", "roasted coffee", "instant coffee", "soluble coffee", "coffee extract", "decaffeinated coffee", "espresso"], "Roasted coffee beans and their extract", "Brewed or instant coffee used in drinks, tiramisu, ice cream and confectionery.", "Rich in chlorogenic acids; moderate coffee drinking is associated with lower risk of type 2 diabetes and liver disease.",
      `${COFFEE_C} IARC found coffee not classifiable as a carcinogen. Roasting forms some acrylamide.`, ["Iced coffee drinks", "Tiramisu", "Coffee ice cream"], 90, { src: "own", refs: [CAFFEINE, HOT_BEV] }],
    ["Black Tea", ["tea", "tea leaves", "black tea leaves", "assam tea", "darjeeling tea", "ceylon tea", "chai patti", "tea extract"], "Fermented leaves of Camellia sinensis", "Brewed as tea, masala chai and iced tea, and used in tea-flavoured foods.", "Flavonoids (theaflavins); hydration. Less caffeine per cup than coffee.",
      `${COFFEE_C} Tannins reduce absorption of non-haem iron when drunk with meals.`, ["Masala chai", "Iced tea", "Kombucha"], 92, { src: "own", refs: [CAFFEINE] }],
    ["Green Tea", ["green tea leaves", "sencha", "gunpowder tea", "kahwa"], "Unfermented Camellia sinensis leaves", "Brewed as tea and used in drinks and desserts.", "Catechins (EGCG) and L-theanine.",
      "None as a brewed drink. Concentrated green tea extracts (not the brewed tea) have caused liver injury; the EU restricts EGCG in supplements.", ["Green tea drinks", "Desserts"], 94, { src: "own", refs: [CAFFEINE] }],
    ["Matcha", ["matcha powder", "matcha green tea", "powdered green tea"], "Stone-ground shaded green tea", "Whole tea leaf powder whisked into drinks or added to lattes, ice cream and baking.", "Because the whole leaf is consumed, provides more catechins and caffeine per serving than brewed green tea.",
      `${COFFEE_C} Higher caffeine than brewed green tea.`, ["Matcha latte", "Ice cream", "Confectionery"], 90, { src: "own", refs: [CAFFEINE] }],
    ["Oolong Tea", ["oolong", "wulong tea", "tieguanyin"], "Partly oxidised Chinese tea", "Brewed as tea and used in milk-tea drinks.", "Catechins and theaflavins.", COFFEE_C, ["Milk tea", "Bottled tea"], 94, { src: "own", refs: [CAFFEINE] }],
    ["Rooibos", ["redbush tea", "rooibos tea", "red bush", "aspalathus linearis"], "Caffeine-free South African herbal tea", "Fermented needle-like leaves brewed as a caffeine-free tea.", "Caffeine-free; low in tannins; contains aspalathin.", "None.", ["Herbal tea", "Iced tea"], 96,
      { src: "own", refs: [paper("Joubert E, de Beer D", 2011, "Rooibos (Aspalathus linearis) beyond the farm gate: from herbal tea to potential phytopharmaceutical", "South African Journal of Botany 77(4):869–886", "Reviews rooibos composition (aspalathin and other flavonoids), processing and safety as a caffeine-free herbal tea.")] }],
    ["Chamomile", ["camomile", "chamomile flowers", "chamomile tea", "matricaria recutita", "matricaria chamomilla"], "Apple-scented daisy flowers", "Dried flower heads brewed as a calming herbal tea.", "Traditionally used for mild digestive upset and sleep (traditional use only).",
      "Can cause allergic reactions in people allergic to ragweed and other daisy-family plants.", ["Herbal tea", "Sleep blends"], 92, { src: "own", refs: [EMA_HERBAL("Matricaria recutita L., flos (chamomile flower)", "Recognises traditional use of chamomile flower for minor gastrointestinal complaints; notes Asteraceae allergy.")] }],
    ["Hibiscus", ["hibiscus flowers", "roselle", "hibiscus sabdariffa", "sorrel drink", "karkade", "jamaica flowers"], "Tart red calyces brewed as a drink", "Dried calyces brewed into hibiscus tea, agua de jamaica and Caribbean sorrel.", "Anthocyanins; small trials show modest blood-pressure lowering.", "None at drink amounts.", ["Herbal tea", "Agua de jamaica", "Sorrel drink"], 94],
    ["Yerba Mate", ["mate", "maté", "ilex paraguariensis", "chimarrão"], "Caffeinated South American infusion", "Dried leaves brewed as mate and used in energy drinks.", "Polyphenols and caffeine.",
      `${COFFEE_C} Drinking it very hot (above 65 °C) is probably carcinogenic (oesophagus); smoke-dried mate can contain PAHs.`, ["Mate drinks", "Energy drinks"], 86, { src: "own", refs: [CAFFEINE, HOT_BEV] }],
    ["Cacao Nibs", ["cocoa nibs", "raw cacao nibs", "cacao beans", "cocoa beans"], "Crushed roasted cocoa beans", "Sprinkled on cereals, bowls and baking for a bitter chocolate crunch.", "Fibre, magnesium, iron and flavanols; no added sugar.",
      "Cocoa accumulates cadmium (higher in some Latin American origins); the EU limits cadmium in cocoa products. Contains caffeine and theobromine.", ["Smoothie bowls", "Granola", "Baking"], 90, { refs: [EU_CONTAMINANTS("Sets maximum cadmium levels for cocoa powder and chocolate products.")] }],
    ["Kombucha", ["kombucha tea", "fermented tea"], "Fermented sweetened tea", "Sweet tea fermented by a SCOBY of bacteria and yeasts into a tangy drink.", "Organic acids and, if unpasteurised, live microbes; health claims are largely unproven.",
      "Contains residual sugar and traces of alcohol (sometimes above 0.5% if over-fermented); home brews can become contaminated.", ["Kombucha drinks"], 88],
    ["Coconut Water", ["tender coconut water", "nariyal pani", "young coconut water"], "Clear liquid from young coconuts", "Drunk fresh or packaged; used in smoothies and sports-type drinks.", "Potassium and electrolytes; lower in sugar than fruit juice.", "Packaged versions can have added sugar.", ["Drinks", "Smoothies"], 94],
    ["Elderflower", ["elder flower", "elderflowers", "sambucus nigra flowers"], "Fragrant flowers of the elder tree", "Made into cordials, sparkling drinks and desserts.", "Flavour.", "None for the flowers in drinks; cordials are mostly sugar.", ["Elderflower cordial", "Pressé", "Desserts"], 92,
      { src: "own", refs: [EMA_HERBAL("Sambucus nigra L., flos (elder flower)", "Recognises traditional use of elder flower for early symptoms of the common cold.")] }],
    ["Lavender", ["lavender flowers", "culinary lavender", "lavandula angustifolia"], "Fragrant purple flower", "Dried flowers used sparingly in baking, teas and herb blends (herbes de Provence).", "Aroma.", "Strong flavour; essential oil is a separate, much more concentrated product.", ["Shortbread", "Herbal tea", "Herbes de Provence"], 92,
      { src: "own", refs: [EMA_HERBAL("Lavandula angustifolia Miller, flos (lavender flower)", "Recognises traditional use of lavender flower for mild stress and to aid sleep.")] }],
    ["Nettle", ["stinging nettle", "nettle leaf", "nettle tea", "urtica dioica"], "Leafy wild green", "Young leaves cooked in soups or dried for tea.", "Vitamin K, calcium, iron and vitamin A when cooked as a green.", "Must be cooked or dried to deactivate the sting. High in vitamin K.", ["Nettle soup", "Herbal tea"], 92],
    ["Lemon Balm", ["melissa", "melissa officinalis", "lemon balm leaves"], "Lemon-scented mint-family herb", "Fresh or dried leaves used in teas, salads and desserts.", "Traditionally used for mild stress and sleep.", "None at food amounts.", ["Herbal tea", "Desserts"], 94,
      { src: "own", refs: [EMA_HERBAL("Melissa officinalis L., folium (melissa leaf)", "Recognises traditional use of melissa leaf for mild symptoms of mental stress and to aid sleep.")] }],
  ]),
];
