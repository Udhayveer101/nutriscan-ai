// Expansion batch 33 — Pool 6: more nuts, seeds, nut butters, pulses, pulse flours and soy foods.
import type { SeedIngredient } from "./types";
import { wholeFoods, AUNE_NUT, AFSHIN_LEG } from "./whole";
import { euAllergens } from "./refs";

const TREE = euAllergens("Nuts (almond, hazelnut, walnut, cashew, pecan, Brazil nut, pistachio, macadamia) are declarable allergens.");
const PEANUT = euAllergens("Peanuts and products thereof are declarable allergens.");
const SOY = euAllergens("Soybeans and products thereof are declarable allergens.");
const TREE_C = "A tree nut: a declarable allergen that can cause severe reactions.";
const WIND = "Contains oligosaccharides that cause wind; soaking and thorough cooking help.";

const nut = wholeFoods("nut-seed", {
  refs: [AUNE_NUT],
  benefits: "Unsaturated fat, protein, fibre, vitamin E and magnesium; regular nut intake is linked to lower cardiovascular disease and mortality.",
  concerns: "None for most people.",
});
const seed = wholeFoods("nut-seed", {
  refs: [],
  benefits: "Unsaturated fat, protein, fibre and minerals.",
  concerns: "None.",
});
const pulse = wholeFoods("legume", {
  refs: [AFSHIN_LEG],
  benefits: "A pulse rich in protein, fibre, folate, iron and potassium; regular legume intake is linked to lower ischaemic heart disease risk.",
  concerns: WIND,
});
const soy = wholeFoods("legume", {
  refs: [SOY],
  benefits: "Complete plant protein with fibre, potassium and isoflavones.",
  concerns: "Soy is a declarable allergen.",
});

export const BATCH_33: SeedIngredient[] = [
  ...nut([
    ["Tiger Nuts", ["tigernuts", "chufa", "earth almonds", "tiger nut flour"], "Small sedge tuber eaten like a nut", "Eaten as a snack, ground into flour or made into horchata de chufa.", "High in resistant starch and insoluble fibre.", "Not a botanical nut and not a tree-nut allergen.", ["Horchata", "Gluten-free baking"]],
    ["Pili Nuts", ["pili nut", "canarium nuts"], "Rich Philippine tree nut", "Eaten roasted or sprouted as a snack.", "", "Tree-nut cross-reactivity is possible.", ["Snack packs", "Nut butters"]],
    ["Candlenut", ["kemiri", "buah keras", "kukui nut"], "Oily Southeast Asian nut used as a thickener", "Ground into Indonesian and Malaysian curry pastes as a thickener.", "", "Toxic when raw; always cooked before eating.", ["Rendang paste", "Sambal"], 82],
    ["Baru Nuts", ["baru almonds", "baru nut"], "Brazilian savanna seed eaten like a nut", "Eaten roasted as a snack.", "", "Always roasted; raw seeds contain trypsin inhibitors.", ["Snack packs", "Trail mix"]],
    ["Cashew Butter", ["cashew nut butter", "cashew spread"], "Spread of ground cashews", "Used as a spread and as a base for vegan sauces.", "", TREE_C, ["Spreads", "Vegan sauces"], 88, { refs: [TREE] }],
    ["Hazelnut Butter", ["hazelnut paste", "hazelnut spread (unsweetened)"], "Paste of roasted hazelnuts", "Used in confectionery, spreads and baking.", "", TREE_C, ["Chocolate spreads", "Pralines"], 88, { refs: [TREE] }],
    ["Pistachio Paste", ["pistachio butter", "pistachio cream (unsweetened)"], "Paste of ground pistachios", "Used in gelato, pastries and confectionery.", "", TREE_C, ["Gelato", "Macarons"], 88, { refs: [TREE] }],
    ["Pecan Butter", ["pecan nut butter"], "Spread of ground pecans", "Used as a spread and in baking.", "", TREE_C, ["Spreads"], 88, { refs: [TREE] }],
    ["Walnut Butter", ["walnut paste"], "Spread of ground walnuts", "Used as a spread and in sauces.", "", TREE_C, ["Spreads"], 88, { refs: [TREE] }],
    ["Macadamia Butter", ["macadamia nut butter"], "Spread of ground macadamias", "Used as a spread and in raw desserts.", "", TREE_C, ["Spreads", "Raw desserts"], 88, { refs: [TREE] }],
    ["Praline Paste", ["praliné", "hazelnut praline"], "Caramelised nuts ground to a paste", "Used in chocolates, pastries and fillings.", "", `${TREE_C} About half sugar by weight.`, ["Chocolates", "Paris-Brest"], 70, { refs: [TREE] }],
    ["Marzipan", ["almond marzipan", "marchpane"], "Sweet almond and sugar paste", "Used to cover cakes and in confectionery.", "", `${TREE_C} Typically 30–50% sugar.`, ["Stollen", "Simnel cake", "Confectionery"], 70, { refs: [TREE] }],
    ["Acorns", ["acorn", "oak nuts", "dotori"], "Oak tree nut", "Leached and ground into flour or Korean dotorimuk jelly.", "", "Raw acorns are high in tannins and must be leached before eating.", ["Dotorimuk", "Acorn bread"], 85],
    ["Beech Nuts", ["beechnuts", "beech mast"], "Small nut of the beech tree", "Eaten roasted in small amounts.", "", "Raw nuts in quantity can cause stomach upset.", ["Foraged snacks"], 85],
    ["Hickory Nuts", ["hickory nut", "shagbark hickory nuts"], "North American tree nut", "Eaten and used in baking like pecans.", "", TREE_C, ["Baking"], 90],
    ["Black Walnuts", ["black walnut", "eastern black walnut"], "Strongly flavoured American walnut", "Used in baking and ice cream.", "", TREE_C, ["Ice cream", "Baking"], 90, { refs: [TREE] }],
    ["Peanut Flour", ["defatted peanut flour", "roasted peanut flour", "powdered peanut butter"], "Ground, partly defatted peanuts", "Used in protein bars, baking and powdered peanut butter.", "High in protein.", "Peanut is a declarable allergen that can cause severe reactions.", ["Protein bars", "Powdered peanut butter"], 86, { refs: [PEANUT] }],
  ]),
  ...seed([
    ["Sunflower Seed Butter", ["sunflower butter", "sunbutter", "sunflower seed spread"], "Spread of ground sunflower seeds", "Used as a nut-free alternative to peanut butter.", "Vitamin E and magnesium.", "None.", ["School-safe spreads"], 88],
    ["Pumpkin Seed Butter", ["pepita butter", "pumpkin seed spread"], "Spread of ground pumpkin seeds", "Used as a nut-free spread.", "Magnesium, zinc and iron.", "None.", ["Spreads"], 88],
    ["Melon Seeds", ["magaz", "char magaz", "egusi", "melon seed kernels"], "Kernels of melon and gourd seeds", "Used in Indian sweets, thandai and West African egusi soup.", "Protein and unsaturated fat.", "None.", ["Thandai", "Egusi soup", "Mithai"], 88],
    ["Cucumber Seeds", ["kheera beej", "cucumber seed kernels"], "Dried cucumber kernels", "Part of Indian char magaz blends and sweets.", "Protein and unsaturated fat.", "None.", ["Thandai"], 88],
    ["Basil Seeds", ["sabja", "sabja seeds", "tukmaria", "sweet basil seeds", "falooda seeds"], "Gelling seeds of sweet basil", "Soaked and added to falooda, sherbets and drinks.", "Soluble fibre that swells into a gel.", "Must be soaked before eating to avoid a choking risk.", ["Falooda", "Basil seed drinks"], 86],
    ["Perilla Seeds", ["perilla seed", "deulkkae", "egoma"], "Oily seeds of the perilla plant", "Ground into Korean soups and used whole in Japanese cooking.", "Rich in alpha-linolenic acid (omega-3).", "None.", ["Korean soups"], 88],
    ["Makhana", ["fox nuts", "phool makhana", "gorgon nut", "euryale seeds"], "Popped seeds of the fox nut water lily", "Roasted as a snack or cooked in kheer and curries.", "Low in fat, with protein and fibre.", "None (flavoured snacks add salt and oil).", ["Roasted makhana", "Kheer"], 88],
    ["Coconut Flour", ["coconut powder (defatted)", "defatted coconut flour"], "Dried, defatted coconut meat ground fine", "Used in gluten-free and low-carb baking.", "Very high in fibre.", "None.", ["Gluten-free baking"], 88],
    ["Chia Flour", ["ground chia", "milled chia seed"], "Ground chia seeds", "Used in gluten-free baking.", "Fibre and ALA omega-3.", "None.", ["Gluten-free baking"], 90],
    ["Sacha Inchi", ["sacha inchi seeds", "inca peanut", "plukenetia volubilis"], "Amazonian seed high in omega-3", "Eaten roasted and pressed for oil and protein powder.", "High in ALA omega-3 and protein.", "Must be roasted; raw seeds contain alkaloids.", ["Protein powders", "Snacks"], 86],
    ["Pine Nut Butter", ["pine nut paste"], "Paste of ground pine nuts", "Used in spreads and sauces.", "", "Some people experience temporary 'pine mouth' taste disturbance.", ["Spreads"], 88],
    ["Lotus Seed Paste", ["lian rong", "lotus paste"], "Sweetened paste of lotus seeds", "Used to fill mooncakes and buns.", "", "Usually sweetened with a lot of sugar.", ["Mooncakes", "Lotus buns"], 70],
  ]),
  ...pulse([
    ["Great Northern Beans", ["great northern bean", "large white beans"], "Medium white bean", "Used in soups, stews and baked beans.", "", WIND, ["Soups", "Baked beans"]],
    ["Flageolet Beans", ["flageolets", "flageolet"], "Pale green French bean", "Served with lamb and in salads.", "", WIND, ["French cassoulets", "Salads"]],
    ["Tepary Beans", ["tepary bean"], "Drought-tolerant desert bean", "Used in soups and stews.", "", WIND, ["Soups"]],
    ["Bambara Groundnut", ["bambara beans", "jugo beans", "vigna subterranea"], "African underground pulse", "Boiled, roasted or ground into flour.", "", WIND, ["African stews"]],
    ["Pink Beans", ["pink bean", "habichuelas rosadas"], "Small pinkish bean", "Used in Caribbean and Latin American stews.", "", WIND, ["Stewed beans"]],
    ["Mayocoba Beans", ["peruano beans", "canary beans", "mayocoba"], "Yellow Peruvian bean", "Used in refried beans and stews.", "", WIND, ["Refried beans"]],
    ["Gigante Beans", ["gigantes", "giant white beans", "gigandes"], "Very large white bean", "Baked in tomato sauce in Greek cooking.", "", WIND, ["Gigantes plaki"]],
    ["Anasazi Beans", ["anasazi bean"], "Speckled heirloom bean", "Used in soups and chilli.", "", WIND, ["Chilli"]],
    ["Marrowfat Peas", ["marrowfat pea", "dried marrowfat peas", "mushy peas"], "Mature dried green peas", "Soaked and cooked into mushy peas.", "", WIND, ["Mushy peas", "Wasabi peas"]],
    ["Yellow Peas", ["whole yellow peas", "dried yellow peas", "peela matar"], "Whole dried yellow field peas", "Used in Indian ragda and pea soups.", "", WIND, ["Ragda", "Pea soup"]],
    ["Sprouted Moong", ["sprouted whole moong", "sprouted green gram", "sprouted mung beans"], "Germinated whole mung beans", "Eaten in salads and usal.", "", "Raw sprouts can carry Salmonella or E. coli; cook for vulnerable groups.", ["Usal", "Sprout salads"], 88],
    ["Lentil Flour", ["red lentil flour", "lentil powder"], "Ground dried lentils", "Used in gluten-free pasta, snacks and batters.", "", WIND, ["Lentil pasta", "Snacks"]],
    ["Fava Bean Flour", ["faba bean flour", "broad bean flour", "faba protein"], "Ground dried fava beans", "Used in bread improvers, plant proteins and snacks.", "", `${WIND} People with G6PD deficiency must avoid fava beans (favism).`, ["Bread", "Plant-based meats"], 84],
    ["Mung Bean Flour", ["moong flour", "green gram flour", "mung flour"], "Ground mung beans", "Used in cheela, noodles and plant-based egg.", "", WIND, ["Cheela", "Plant-based egg"]],
    ["Urad Flour", ["urad dal flour", "black gram flour", "ulundu flour"], "Ground split black gram", "Used in papad, dosa and vada mixes.", "", WIND, ["Papad", "Dosa mixes"]],
    ["Pea Flour", ["yellow pea flour", "split pea flour", "green pea flour"], "Ground dried peas", "Used in snacks, pasta and as a protein ingredient.", "", WIND, ["Snacks", "Pasta"]],
    ["Jack Beans", ["jack bean", "canavalia ensiformis"], "Tropical bean eaten young", "Young pods and well-cooked seeds are eaten in Asia.", "", "Raw mature beans contain canavanine and lectins; long cooking needed.", ["Curries"], 75],
    ["Sweet Lupin", ["sweet lupin beans", "sweet lupin flour", "lupine flour"], "Low-alkaloid lupin seed", "Used as flour and protein in breads and pasta.", "High in protein and fibre.", "Lupin is a declarable EU allergen with cross-reactivity to peanut.", ["Bread", "Gluten-free pasta"], 84, { refs: [euAllergens("Lupin and products thereof are declarable allergens.")] }],
    ["Mesquite Flour", ["mesquite powder", "mesquite pod flour"], "Ground mesquite pods", "Used in baking and smoothies.", "Fibre and minerals.", "None.", ["Baking"], 88],
  ]),
  ...soy([
    ["Soy Milk", ["soya milk", "soymilk", "soya drink", "soy drink", "soybean milk"], "Drink made from soaked, ground soybeans", "Used as a dairy-free milk.", "Protein close to cow's milk.", "Soy is a declarable allergen; sweetened versions add sugar.", ["Plant milks", "Lattes"], 85],
    ["Yuba", ["tofu skin", "bean curd sheet", "fu pi", "beancurd skin"], "Skin lifted from simmering soy milk", "Used in Chinese and Japanese dishes.", "", "Soy is a declarable allergen.", ["Dim sum", "Stir-fries"], 88],
    ["Soy Nuts", ["roasted soybeans", "soya nuts"], "Dry-roasted soybeans", "Eaten as a crunchy snack.", "", "Soy is a declarable allergen.", ["Snack mixes"], 86],
    ["Doenjang", ["korean soybean paste", "dwenjang"], "Fermented Korean soybean paste", "Used in stews and dipping sauces.", "", "Soy is a declarable allergen; very high in salt.", ["Doenjang jjigae", "Ssamjang"], 70],
    ["Douchi", ["fermented black beans", "dou chi"], "Salted fermented black soybeans", "Used in Chinese black bean sauce.", "", "Soy is a declarable allergen; very high in salt.", ["Black bean sauce"], 70],
    ["Soya Chunks", ["soya nuggets", "soy chunks", "meal maker", "soya granules"], "Dried textured defatted soy flour pieces", "Rehydrated and cooked in curries.", "Very high in protein.", "Soy is a declarable allergen.", ["Soya curry", "Pulao"], 82],
    ["Okara", ["soy pulp", "tofu lees", "kirazu"], "Pulp left after making soy milk", "Used in baking, croquettes and as fibre.", "High in fibre and protein.", "Soy is a declarable allergen.", ["Okara cookies"], 88],
    ["Black Soybeans", ["black soybean", "kuromame", "black soya beans"], "Black-skinned soybean", "Simmered in Japanese New Year dishes and used in soy milks.", "", "Soy is a declarable allergen.", ["Kuromame", "Soy milk"], 90],
    ["Gochujang", ["korean chilli paste", "korean red pepper paste", "gochu jang"], "Fermented Korean chilli and rice paste", "Used in bibimbap, marinades and stews.", "", "Contains soy and often wheat; high in salt and sugar.", ["Bibimbap", "Tteokbokki"], 70],
  ]),
];
