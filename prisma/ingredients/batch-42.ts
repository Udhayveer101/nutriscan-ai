// Expansion batch 42 — Pool 6: fruit and vegetable purées, powders and juices, plant-based
// milks and yoghurts, candied fruit, and more teas and beverage plants.
import type { SeedIngredient, SeedRef } from "./types";
import { family } from "./build";
import { wholeFoods } from "./whole";
import { whoSugars, efsa } from "./refs";

const CAFFEINE = efsa("Dietetic Products, Nutrition and Allergies (NDA)", "Scientific Opinion on the safety of caffeine", 2015,
  "Single doses up to 200 mg and daily intakes up to 400 mg do not raise safety concerns for healthy adults; 200 mg/day in pregnancy.");
const PLANT_MILK: SeedRef = { title: "Plant-based drinks: nutritional considerations", authors: "British Dietetic Association", journal: "BDA Food Fact Sheet", year: 2021,
  findings: "Plant drinks other than soy are low in protein; choose unsweetened, calcium- and iodine-fortified versions, and do not use rice drinks for children under five (arsenic)." };

const fruitVeg = wholeFoods("vegetable", {
  refs: [],
  benefits: "Keeps most of the fruit or vegetable's vitamins, minerals and colour.",
  concerns: "None.",
});
const fruit = wholeFoods("fruit", {
  refs: [],
  benefits: "Keeps the fruit's fibre, vitamins and flavour.",
  concerns: "None.",
});
const plantMilk = wholeFoods("culinary", {
  refs: [PLANT_MILK],
  sciConsensus: "A plant-based dairy alternative. Scored as a minimally processed food; check for added sugar and fortification.",
  benefits: "Dairy-free; often fortified with calcium and vitamins.",
  concerns: "Lower in protein than cow's milk (except soy); unsweetened and fortified versions are best.",
});
const tea = wholeFoods("botanical", {
  refs: [],
  sciConsensus: "A traditional beverage plant. Scored as a whole food.",
  benefits: "Polyphenols and flavour without calories.",
  concerns: "None at usual intakes.",
});
const candied = family({
  categorySlug: "sugar-syrup", evidenceLevel: "STRONG", isNatural: false, isVegan: true,
  sciConsensus: "Fruit preserved in sugar syrup: most of its weight is added sugar.",
  fdaStatus: "Food (counts as added sugar)", efsaStatus: "Food (counts toward free sugars)", fssaiStatus: "Food (FSS Act general provisions)", whoStatus: "Free sugar: WHO advises <10% of energy",
  benefits: "Flavour and colour in baking.",
  concerns: "Mostly added sugar; cheaper products are often coloured with synthetic dyes (listed separately).",
  refs: [whoSugars("Counts sugars added to foods, including those in candied fruit, as free sugars.")],
});

export const BATCH_42: SeedIngredient[] = [
  ...fruitVeg([
    ["Tomato Powder", ["dried tomato powder", "tomato flakes"], "Dehydrated ground tomatoes", "Used in seasonings, soups and snack coatings.", "Lycopene.", "", ["Crisps seasoning", "Instant soups"], 90],
    ["Ginger Paste", ["ginger puree", "adrak paste"], "Ground fresh ginger", "Used in curries and marinades.", "", "Commercial pastes often contain salt, acid and preservatives (listed separately).", ["Curries", "Marinades"], 90],
    ["Garlic Paste", ["lahsun paste"], "Ground fresh garlic", "Used in curries, sauces and marinades.", "", "Commercial pastes often contain salt, acid and preservatives (listed separately).", ["Curries", "Sauces"], 90],
    ["Ginger Garlic Paste", ["ginger-garlic paste", "adrak lahsun paste"], "Ground ginger and garlic blend", "The base of many Indian curries.", "", "Commercial pastes often contain salt, acid and preservatives (listed separately).", ["Curries", "Biryani"], 90],
    ["Spinach Powder", ["dried spinach powder", "palak powder"], "Dehydrated ground spinach", "Colours pasta and adds greens to smoothies.", "Iron, folate and vitamin K.", "", ["Green pasta", "Smoothie powders"], 90],
    ["Kale Powder", ["dried kale powder"], "Dehydrated ground kale", "Added to green powders and snacks.", "Vitamins K and C.", "", ["Green powders"], 90],
    ["Beetroot Powder", ["beet powder", "dried beetroot powder", "beet root powder"], "Dehydrated ground beetroot", "Used for colour and in sports nitrate drinks.", "Nitrate (may modestly improve endurance).", "Colours urine pink (harmless).", ["Sports drinks", "Natural colouring"], 90],
    ["Beetroot Juice", ["beet juice"], "Pressed beetroot juice", "Drunk for sports performance and used as a colour.", "Dietary nitrate.", "", ["Sports shots", "Juices"], 88],
    ["Carrot Juice", ["fresh carrot juice"], "Pressed carrot juice", "Used in juice blends and baby food; also a colouring food.", "Beta-carotene.", "", ["Juice blends", "Baby food"], 88],
    ["Wheatgrass", ["wheatgrass powder", "wheat grass", "wheatgrass juice"], "Young wheat shoots", "Juiced or powdered in green drinks.", "Chlorophyll, vitamins and minerals.", "Claims of detox benefits are unproven.", ["Green powders", "Juice shots"], 88],
    ["Barley Grass", ["barley grass powder", "young barley leaves", "aojiru"], "Young barley shoots", "Powdered in green drinks.", "Vitamins and minerals.", "Claims of detox benefits are unproven.", ["Green powders", "Aojiru"], 88],
  ]),
  ...fruit([
    ["Apple Purée", ["apple puree", "unsweetened apple puree"], "Cooked, puréed apples", "Used in baby food, pouches and baking.", "", "Fruit purées in pouches are softer on teeth than juice but still count partly as free sugar when highly processed.", ["Baby pouches", "Baking"], 90],
    ["Banana Purée", ["banana puree", "mashed banana"], "Puréed ripe banana", "Used in baby food and smoothies.", "", "", ["Baby pouches", "Smoothies"], 90],
    ["Strawberry Purée", ["strawberry puree", "strawberry pulp"], "Puréed strawberries", "Used in yoghurts, ice cream and smoothies.", "", "", ["Yoghurt", "Ice cream"], 90],
    ["Fruit Purée", ["fruit puree", "mixed fruit puree", "fruit pulp"], "Puréed fruit", "Used in baby food, smoothies and fruit snacks.", "", "Highly processed purées in snacks behave more like free sugar than whole fruit.", ["Baby pouches", "Fruit snacks"], 86],
    ["Fig Paste", ["fig puree", "fig filling"], "Ground dried figs", "Used in fig rolls and bars.", "", "", ["Fig rolls", "Bars"], 88],
    ["Vanilla Paste", ["vanilla bean paste"], "Vanilla seeds in a thick syrup", "Used in baking and desserts.", "", "Usually sweetened with sugar syrup.", ["Desserts", "Baking"], 88],
    ["Vanilla Powder", ["ground vanilla", "ground vanilla bean", "vanilla bean powder"], "Ground whole vanilla pods", "Used in baking and drinks.", "", "None.", ["Baking"], 92],
  ]),
  ...plantMilk([
    ["Almond Milk", ["almond drink", "almond beverage"], "Drink made from ground almonds and water", "Used as a dairy-free milk.", "", "Often only 2–3% almonds; a tree-nut allergen.", ["Plant milks", "Lattes"], 82],
    ["Oat Milk", ["oat drink", "oat beverage", "oatmilk"], "Drink made from enzyme-treated oats", "Used as a dairy-free milk.", "", "Enzyme treatment turns oat starch into maltose, giving a higher glycaemic load than cow's milk.", ["Plant milks", "Lattes"], 82],
    ["Rice Milk", ["rice drink", "rice beverage"], "Drink made from milled rice", "Used as a dairy-free milk.", "", "Low in protein; UK FSA advises against rice drinks for children under five because of arsenic.", ["Plant milks"], 76],
    ["Cashew Milk", ["cashew drink", "cashew beverage"], "Drink made from cashews and water", "Used as a creamy dairy-free milk.", "", "A tree-nut allergen; low in protein.", ["Plant milks"], 82],
    ["Soy Yoghurt", ["soy yogurt", "soya yoghurt", "soya yogurt", "cultured soya"], "Fermented soy milk", "Used as a dairy-free yoghurt.", "Protein close to dairy yoghurt.", "Soy is a declarable allergen.", ["Dairy-free yoghurt"], 84],
    ["Coconut Yoghurt", ["coconut yogurt", "cultured coconut milk"], "Fermented coconut milk", "Used as a dairy-free yoghurt.", "", "Very low in protein and high in saturated fat.", ["Dairy-free yoghurt"], 78],
  ]),
  ...tea([
    ["White Tea", ["bai mu dan", "silver needle tea", "white tea leaves"], "Lightly processed young tea leaves", "Brewed as a delicate tea.", "", "Contains caffeine.", ["Tea", "Iced tea"], 92, { src: "own", refs: [CAFFEINE] }],
    ["Pu-erh Tea", ["pu-erh", "puer tea", "pu'er tea"], "Aged, fermented Yunnan tea", "Brewed as an earthy tea.", "", "Contains caffeine.", ["Tea"], 90, { src: "own", refs: [CAFFEINE] }],
    ["Jasmine Tea", ["jasmine green tea", "jasmine scented tea"], "Tea scented with jasmine blossoms", "Brewed hot or iced.", "", "Contains caffeine.", ["Tea", "Bubble tea"], 92, { src: "own", refs: [CAFFEINE] }],
    ["Chrysanthemum Tea", ["chrysanthemum flowers", "ju hua"], "Infusion of dried chrysanthemum flowers", "Drunk hot or sweetened as a bottled drink.", "", "Daisy-family allergy.", ["Bottled herbal tea"], 92],
    ["Barley Tea", ["mugicha", "boricha", "roasted barley tea"], "Infusion of roasted barley", "Drunk hot or cold in Japan and Korea.", "", "Contains gluten traces; acrylamide forms in roasting.", ["Bottled teas"], 90],
    ["Corn Silk", ["corn silk tea", "oksusu suyeom cha", "stigma maydis"], "Silky threads of maize", "Brewed as a mild Korean tea.", "", "Diuretic effect.", ["Korean teas"], 90],
    ["Guayusa", ["ilex guayusa", "guayusa leaf"], "Caffeinated Amazonian holly", "Brewed as tea and used in energy drinks.", "Caffeine with L-theanine-like smoothness claimed.", "Contains caffeine.", ["Energy drinks", "Tea"], 86, { src: "own", refs: [CAFFEINE] }],
    ["Honeybush", ["cyclopia", "honeybush tea"], "South African herbal tea", "Brewed like rooibos.", "", "None.", ["Herbal tea"], 94],
    ["Lotus Leaf Tea", ["lotus leaf", "he ye"], "Infusion of dried lotus leaves", "Drunk in China and sold for weight loss.", "", "Weight-loss claims unproven.", ["Herbal tea"], 90],
    ["Osmanthus", ["osmanthus flowers", "gui hua", "sweet osmanthus"], "Fragrant golden tea flower", "Used in teas, jellies and wines.", "", "None.", ["Osmanthus tea", "Desserts"], 92],
    ["Masala Chai", ["chai", "spiced tea", "masala tea"], "Black tea brewed with spices", "Drunk with milk and sugar across India.", "", "Contains caffeine; usually sweetened.", ["Chai premixes"], 88, { src: "own", refs: [CAFFEINE] }],
  ]),
  candied({ slug: "candied-peel", name: "Candied Peel", aliases: ["mixed peel", "candied citrus peel", "candied orange peel", "candied lemon peel"], purposeShort: "Citrus peel preserved in sugar", purpose: "Used in fruit cakes, panettone and hot cross buns.", safetyScore: 36, commonProducts: ["Fruit cake", "Panettone"] }),
  candied({ slug: "glace-cherries", name: "Glacé Cherries", aliases: ["glace cherries", "candied cherries", "cocktail cherries", "maraschino cherries"], purposeShort: "Cherries candied in sugar syrup", purpose: "Used in cakes, biscuits and as decoration.", safetyScore: 32, commonProducts: ["Cherry cake", "Biscuits"],
    concerns: "Mostly added sugar; usually coloured with erythrosine (E127) or another dye." }),
  candied({ slug: "tutti-frutti", name: "Tutti Frutti", aliases: ["tutti-frutti", "candied papaya", "candied fruit"], purposeShort: "Dyed candied papaya pieces", purpose: "Used in Indian cakes, ice cream and biscuits.", safetyScore: 30, commonProducts: ["Fruit cake", "Ice cream"],
    concerns: "Raw papaya candied in sugar syrup and coloured with synthetic dyes; mostly added sugar." }),
  candied({ slug: "crystallised-ginger", name: "Crystallised Ginger", aliases: ["candied ginger", "crystallized ginger", "stem ginger in syrup"], purposeShort: "Ginger cooked in sugar syrup", purpose: "Eaten as a sweet and used in baking.", safetyScore: 36, commonProducts: ["Biscuits", "Cakes"] }),
];
