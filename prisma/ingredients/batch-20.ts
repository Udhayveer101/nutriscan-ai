// Expansion batch 20 — Pool 6: milks, fermented milks, Indian dairy and cheeses.
// Cheeses are named individually: a bare "cheese" keyword would also catch processed cheese and cheese powders.
import type { SeedIngredient, SeedRef } from "./types";
import { wholeFoods } from "./whole";
import { euAllergens } from "./refs";

export const MILK = euAllergens("Milk and products thereof (including lactose) are declarable allergens.");
const PREG: SeedRef = { title: "Foods to avoid in pregnancy", authors: "National Health Service (England)", journal: "NHS website", year: 2023, url: "https://www.nhs.uk/pregnancy/keeping-well/foods-to-avoid/",
  findings: "Advises pregnant women to avoid mould-ripened soft cheeses (brie, camembert) and soft blue cheeses unless cooked, and unpasteurised milk and soft cheeses, because of Listeria." };
const WHO_SFA: SeedRef = { title: "Saturated fatty acid and trans-fatty acid intake for adults and children: WHO guideline", authors: "World Health Organization", journal: "WHO Guidelines", year: 2023,
  url: "https://www.who.int/publications/i/item/9789240073630", findings: "Recommends limiting saturated fat to under 10% of energy." };

const MILK_C = "Milk is a declarable allergen; lactose may cause symptoms in lactose intolerance.";
const dairy = wholeFoods("dairy-egg", {
  refs: [MILK], isVegan: false,
  benefits: "Protein, calcium, iodine, vitamin B12 and riboflavin.",
  concerns: MILK_C,
});
const CHEESE_C = "Milk allergen. High in saturated fat and salt, so portion size matters.";
const cheese = wholeFoods("dairy-egg", {
  refs: [MILK, WHO_SFA], isVegan: false,
  sciConsensus: "A traditional processed food (NOVA group 3): milk, cultures, rennet and salt. Scored as a whole food; saturated fat and salt are the main considerations.",
  benefits: "Concentrated protein, calcium and vitamin B12; aged cheeses are very low in lactose.",
  concerns: CHEESE_C,
});
const SOFT = { refs: [PREG] };

export const BATCH_20: SeedIngredient[] = [
  ...dairy([
    ["Milk", ["whole milk", "cow's milk", "full cream milk", "semi-skimmed milk", "skimmed milk", "toned milk", "double toned milk", "fresh milk", "pasteurised milk"], "Cow's milk", "Drunk, and used in tea, cereals, desserts, sauces and baking.", "",
      `${MILK_C} Unpasteurised (raw) milk can carry Listeria, E. coli and Campylobacter.`, ["Tea", "Cereal", "Desserts", "Sauces"], 92],
    ["Whole Milk Powder", ["full cream milk powder", "dried whole milk", "whole milk solids", "dried milk"], "Dehydrated full-fat milk", "Spray-dried milk used in chocolate, confectionery, infant formula and bakery.", "Shelf-stable source of milk protein and calcium.", MILK_C, ["Milk chocolate", "Confectionery", "Bakery"], 88],
    ["Buttermilk", ["chaas", "cultured buttermilk", "chhachh", "majjiga"], "Tangy fermented thin milk", "Traditionally the liquid left after churning butter; now usually cultured skimmed milk. Used in baking, marinades and drunk as chaas.", "Lower in fat; contains live cultures when cultured.", MILK_C, ["Pancakes", "Fried chicken marinade", "Chaas"], 92],
    ["Condensed Milk", ["sweetened condensed milk", "condensed skimmed milk"], "Milk concentrated with added sugar", "Milk with water removed and sugar added; used in desserts, fudge, Indian sweets and coffee.", "Shelf-stable milk solids.",
      "About half sugar by weight. [METHODOLOGY FLAG: the label name contains no 'sugar' keyword, so the scanner scores it as plain dairy.] Milk allergen.", ["Fudge", "Kheer", "Vietnamese coffee", "Banoffee pie"], 72],
    ["Evaporated Milk", ["unsweetened condensed milk", "evaporated skimmed milk"], "Unsweetened concentrated milk", "Milk heated to remove about 60% of its water and canned; used in sauces, desserts and coffee.", "Concentrated protein and calcium; no added sugar.", MILK_C, ["Pumpkin pie", "Sauces", "Coffee"], 88],
    ["Khoa", ["khoya", "mawa", "khoa mawa", "dried whole milk khoa"], "Reduced milk solids", "Milk simmered down to a dense paste; the base of many Indian sweets.", "Concentrated milk protein and calcium.",
      "Milk allergen. Very energy-dense, and a frequent target of adulteration (starch, vegetable fat) around festivals.", ["Gulab jamun", "Peda", "Barfi"], 84, { src: "ifct" }],
    ["Paneer", ["indian cottage cheese", "fresh paneer", "malai paneer"], "Fresh acid-set Indian cheese", "Milk curdled with lemon or vinegar and pressed; cooked in curries, tikka and snacks.", "High in protein and calcium.", "Milk allergen. Some low-cost 'paneer' is made from vegetable fat (analogue paneer).", ["Paneer tikka", "Palak paneer", "Wraps"], 90, { src: "ifct" }],
    ["Chhena", ["chhana", "fresh curd cheese"], "Soft unpressed acid-set curd", "Kneaded fresh curds used for Bengali sweets such as rasgulla and sandesh.", "Protein and calcium.", MILK_C, ["Rasgulla", "Sandesh", "Rasmalai"], 90, { src: "ifct" }],
    ["Yoghurt", ["yogurt", "plain yoghurt", "natural yoghurt", "dahi", "set curd", "whole milk yoghurt", "low-fat yoghurt"], "Milk fermented with lactic acid bacteria", "Eaten plain or flavoured, used in raita, lassi, marinades and dips.", "Protein, calcium and live cultures; well tolerated in lactose intolerance (EU claim for live yoghurt cultures).",
      "Milk allergen. Flavoured yoghurts can contain a lot of added sugar.", ["Raita", "Lassi", "Tzatziki", "Breakfast pots"], 94],
    ["Greek Yoghurt", ["greek-style yoghurt", "strained yoghurt", "greek yogurt", "hung curd", "labneh"], "Thick strained yoghurt", "Yoghurt strained of whey; used in dips, breakfasts and baking.", "Roughly twice the protein of regular yoghurt.", "Milk allergen. 'Greek-style' yoghurt may be thickened with milk powder or starch rather than strained.", ["Tzatziki", "Breakfast bowls", "Dips"], 94],
    ["Skyr", ["icelandic yoghurt", "icelandic skyr"], "Icelandic strained cultured dairy", "Very thick, high-protein cultured skimmed milk.", "Very high in protein and low in fat.", MILK_C, ["High-protein pots"], 94],
    ["Quark", ["quark cheese", "magerquark", "topfen"], "Soft fresh cultured cheese", "Used in German and Central European baking, dips and breakfasts.", "High protein, low fat.", MILK_C, ["Cheesecake", "Dips"], 94],
    ["Kefir", ["milk kefir", "kefir drink", "cultured milk drink"], "Fermented milk drink", "Milk fermented by kefir grains (a mix of bacteria and yeasts).", "Contains a wider range of live microbes than yoghurt; protein and calcium.", "Milk allergen. Small amounts of alcohol from yeast fermentation.", ["Kefir drinks", "Smoothies"], 92],
    ["Sour Cream", ["soured cream", "cultured cream"], "Cream soured by lactic acid bacteria", "Used in dips, toppings, sauces and baking.", "", "Milk allergen. High in saturated fat.", ["Dips", "Nachos", "Stroganoff"], 84, { refs: [WHO_SFA] }],
    ["Crème Fraîche", ["creme fraiche", "crème fraiche"], "Thick, mildly sour cultured cream", "Used in French sauces, soups and desserts; does not split when heated.", "", "Milk allergen. High in saturated fat.", ["Sauces", "Soups", "Tarts"], 84, { refs: [WHO_SFA] }],
  ]),
  ...cheese([
    ["Cheddar Cheese", ["cheddar", "mature cheddar", "mild cheddar"], "Firm aged cow's milk cheese", "The most common cheese in the UK and US; used in sandwiches, sauces and snacks.", "", "", ["Sandwiches", "Macaroni cheese", "Crackers"], 82],
    ["Mozzarella", ["mozzarella cheese", "buffalo mozzarella", "low-moisture mozzarella", "fior di latte"], "Stretched-curd Italian cheese", "Fresh or low-moisture pasta filata cheese used on pizza, in salads and baking.", "", "Milk allergen. Saturated fat; lower in salt than most aged cheeses.", ["Pizza", "Caprese salad", "Lasagne"], 84],
    ["Parmesan", ["parmigiano reggiano", "parmesan cheese", "parmigiano"], "Hard aged Italian grating cheese", "Aged hard cheese grated over pasta and used in pesto and sauces.", "Very high in protein and calcium; naturally almost lactose-free.", "Milk allergen. Very salty; traditional Parmigiano Reggiano is made with animal rennet (not vegetarian).", ["Pasta", "Pesto", "Caesar dressing"], 82],
    ["Cream Cheese", ["full-fat soft cheese", "cream cheese spread"], "Soft spreadable fresh cheese", "Used in cheesecake, frosting, bagels and dips.", "Calcium and vitamin A.", "Milk allergen. High in saturated fat; many brands include gums (E410, E412) as stabilisers.", ["Cheesecake", "Frosting", "Bagels"], 80],
    ["Cottage Cheese", ["cottage cheese curds"], "Lumpy fresh curd cheese", "Fresh curds in a creamy dressing, eaten as a high-protein snack.", "High protein, low fat.", "Milk allergen. Can be fairly salty.", ["Snacks", "Salads", "Lasagne"], 90],
    ["Ricotta", ["ricotta cheese", "whey cheese"], "Soft fresh whey cheese", "Made by heating whey; used in lasagne, cannoli and cheesecakes.", "Protein and calcium; lower in fat and salt than most cheeses.", "Milk allergen.", ["Lasagne", "Cannoli", "Ravioli filling"], 90],
    ["Feta", ["feta cheese", "greek feta", "white brine cheese"], "Brined sheep's or goat's milk cheese", "Crumbled into salads, pastries and baked dishes.", "Protein and calcium.", "Milk allergen. Very salty from brining. Avoid unpasteurised feta in pregnancy.", ["Greek salad", "Spanakopita"], 80, SOFT],
    ["Halloumi", ["halloumi cheese", "hellim"], "Firm grilling cheese from Cyprus", "A high-melting-point brined cheese that is grilled or fried.", "Protein and calcium.", "Milk allergen. Very salty and high in saturated fat.", ["Grilled halloumi", "Wraps", "Salads"], 78],
    ["Goat's Cheese", ["goats cheese", "goat cheese", "chèvre", "chevre"], "Cheese made from goat's milk", "Fresh or aged goat cheese used in salads, tarts and on toast.", "Protein and calcium; some people with cow's milk intolerance tolerate it.", "Milk allergen (goat's milk cross-reacts with cow's milk allergy). Avoid soft, mould-ripened goat's cheese in pregnancy unless cooked.", ["Salads", "Tarts"], 82, SOFT],
    ["Blue Cheese", ["stilton", "gorgonzola", "roquefort", "danish blue", "dolcelatte"], "Mould-veined cheese", "Cheese ripened with Penicillium roqueforti; used in dressings, sauces and cheeseboards.", "Protein and calcium.", "Milk allergen. High in salt and saturated fat. Soft blue cheeses should be avoided in pregnancy unless cooked.", ["Blue cheese dressing", "Cheeseboards"], 78, SOFT],
    ["Brie", ["brie cheese", "brie de meaux"], "Soft white-rinded cheese", "Mould-ripened soft cheese eaten on cheeseboards and in sandwiches and baked.", "Protein and calcium.", "Milk allergen. Saturated fat. Avoid in pregnancy unless cooked (Listeria).", ["Cheeseboards", "Sandwiches"], 80, SOFT],
    ["Camembert", ["camembert cheese", "camembert de normandie"], "Soft white-rinded Normandy cheese", "Mould-ripened soft cheese often baked whole.", "Protein and calcium.", "Milk allergen. Saturated fat. Avoid in pregnancy unless cooked (Listeria).", ["Baked camembert", "Cheeseboards"], 80, SOFT],
    ["Gouda", ["gouda cheese"], "Dutch semi-hard cheese", "Sliced in sandwiches and melted in sauces.", "", CHEESE_C, ["Sandwiches", "Toasties"], 82],
    ["Emmental", ["emmentaler", "emmental cheese", "swiss cheese"], "Swiss alpine cheese", "Holey Swiss cheese used in fondue, sandwiches and gratins.", "", CHEESE_C, ["Fondue", "Croque monsieur", "Gratins"], 82],
    ["Mascarpone", ["mascarpone cheese"], "Rich Italian cream cheese", "Acid-set cream used in tiramisu and desserts.", "", "Milk allergen. Very high in saturated fat.", ["Tiramisu", "Cheesecake"], 76],
  ]),
];
