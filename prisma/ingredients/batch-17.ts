// Expansion batch 17 — Pool 6: pulses, dals and soy foods.
import type { SeedIngredient, SeedRef } from "./types";
import { wholeFoods, AFSHIN_LEG } from "./whole";
import { euAllergens, efsa } from "./refs";
import { VITK } from "./batch-14";

const SOY = euAllergens("Soybeans and products thereof are declarable allergens.");
const LUPIN = euAllergens("Lupin and products thereof are declarable allergens.");
const PHA: SeedRef = { title: "Bad Bug Book: Foodborne Pathogenic Microorganisms and Natural Toxins Handbook (2nd ed.) — Phytohaemagglutinin", authors: "U.S. Food and Drug Administration", journal: "FDA", year: 2012,
  findings: "Raw or undercooked red kidney beans contain phytohaemagglutinin; as few as four or five raw beans can cause severe vomiting. Boiling for at least 10 minutes destroys it; slow cookers may not." };
const ISOFLAVONES = efsa("Food Additives and Nutrient Sources added to Food (ANS)", "Risk assessment for peri- and post-menopausal women taking food supplements containing isolated isoflavones", 2015,
  "Found no evidence of harm to breast, uterus or thyroid from isolated isoflavone supplements at studied doses in post-menopausal women.");
const WIND = "Contains oligosaccharides (raffinose, stachyose) that cause wind; soaking and thorough cooking help.";

const pulse = wholeFoods("legume", {
  refs: [AFSHIN_LEG],
  benefits: "A pulse rich in protein, fibre, folate, iron and potassium; regular legume intake is linked to lower ischaemic heart disease risk.",
  concerns: WIND,
});

export const BATCH_17: SeedIngredient[] = [
  ...pulse([
    ["Chickpeas", ["chickpea", "garbanzo beans", "kabuli chana", "chole", "cooked chickpeas"], "Nutty cream-coloured pulse", "Cooked whole in chana masala, hummus, falafel, salads and soups.", "", WIND, ["Hummus", "Chana masala", "Falafel"], 96],
    ["Black Chickpeas", ["kala chana", "desi chana", "bengal gram", "brown chickpeas"], "Small dark-skinned chickpea", "Cooked whole in curries and chaat or roasted as a snack.", "Higher in fibre than kabuli chickpeas; protein and iron.", WIND, ["Kala chana curry", "Roasted chana"], 96, { src: "ifct" }],
    ["Chana Dal", ["split bengal gram", "split chickpeas", "chana daal"], "Split skinned black chickpeas", "Cooked as dal and ground into besan.", "Protein and fibre; low glycaemic index.", WIND, ["Chana dal", "Namkeen"], 96, { src: "ifct" }],
    ["Besan", ["gram flour", "chickpea flour", "garbanzo bean flour", "chana flour"], "Flour of ground chickpeas or chana dal", "Used for pakoras, bhajis, kadhi, dhokla, sweets (laddoo) and gluten-free baking.", "High in protein and fibre; gluten-free.", "None for the flour; fried besan snacks are energy-dense.", ["Pakoras", "Dhokla", "Besan laddoo"], 94],
    ["Lentils", ["brown lentils", "green lentils", "puy lentils", "beluga lentils", "whole masoor", "lentil"], "Lens-shaped pulse that needs no soaking", "Cooked in soups, stews, salads and dals.", "", "Less wind-producing than beans; otherwise none.", ["Lentil soup", "Salads", "Veggie burgers"], 96],
    ["Red Lentils", ["masoor dal", "split red lentils", "masoor daal", "red split lentils"], "Quick-cooking split lentils", "Cook to a purée in dals, soups and baby food.", "Protein, folate and iron.", "None.", ["Masoor dal", "Lentil soup", "Baby food"], 96],
    ["Mung Beans", ["moong", "green gram", "whole moong", "mung bean", "sabut moong"], "Small green pulse", "Cooked whole in curries and soups, sprouted, or made into dal and noodles.", "Protein, folate and fibre; easy to digest.", "None.", ["Moong curry", "Sprouts salad", "Glass noodles"], 96],
    ["Moong Dal", ["split mung beans", "yellow moong dal", "moong daal", "split green gram"], "Split skinned mung beans", "Cooked into light dals, khichdi, halwa and fried namkeen.", "Easily digested protein; low in wind-causing sugars.", "None.", ["Khichdi", "Moong dal halwa", "Namkeen"], 96, { src: "ifct" }],
    ["Urad Dal", ["black gram", "urad", "split black gram", "urad daal", "white lentils"], "Black gram, whole or split", "Ground into idli and dosa batter, cooked into dal makhani, and fried into vada and papad.", "Protein, fibre, iron and magnesium.", WIND, ["Idli", "Dosa", "Dal makhani", "Papad"], 96, { src: "ifct" }],
    ["Toor Dal", ["pigeon peas", "arhar dal", "tuvar dal", "tur dal", "red gram", "gandules"], "Split pigeon peas", "The everyday dal of much of India; used in sambar and varan.", "Protein, folate and fibre.", WIND, ["Sambar", "Dal tadka", "Rice and peas"], 96, { src: "ifct" }],
    ["Kidney Beans", ["red kidney beans", "rajma", "dark red kidney beans"], "Large red beans", "Cooked in rajma, chilli con carne and bean salads; usually canned.", "Protein, fibre, iron and folate.",
      "Raw or undercooked kidney beans contain phytohaemagglutinin and cause severe vomiting; dried beans must be soaked and boiled hard for at least 10 minutes. Canned beans are safe.", ["Rajma", "Chilli con carne", "Bean salads"], 90, { refs: [PHA] }],
    ["Black Beans", ["black turtle beans", "turtle beans", "frijoles negros"], "Small glossy black beans", "Used in Latin American soups, burritos and rice dishes.", "Anthocyanins in the skin; protein and fibre.", WIND, ["Burritos", "Black bean soup", "Feijoada"], 96],
    ["Pinto Beans", ["pinto bean", "frijoles pintos"], "Speckled beige beans", "Used in refried beans, chilli and burritos.", "", WIND, ["Refried beans", "Chilli"], 96],
    ["Haricot Beans", ["navy beans", "white beans", "pea beans", "boston beans"], "Small white beans", "The bean in canned baked beans; also used in soups.", "", WIND, ["Baked beans", "Soups", "Cassoulet"], 96],
    ["Cannellini Beans", ["cannellini", "white kidney beans", "fagioli"], "Large white Italian beans", "Used in minestrone, salads and dips.", "", "Like kidney beans, raw cannellini contain lectins and must be boiled thoroughly.", ["Minestrone", "Bean salads", "Dips"], 94, { refs: [PHA] }],
    ["Butter Beans", ["lima beans", "lima bean", "madagascar beans"], "Large creamy beans", "Used in stews, salads and succotash.", "", "Raw lima beans contain cyanogenic glycosides; commercial varieties are low and cooking removes the risk. Despite the name, they contain no butter.", ["Stews", "Succotash"], 94],
    ["Borlotti Beans", ["cranberry beans", "roman beans", "borlotti"], "Speckled Italian beans", "Used in pasta e fagioli, stews and salads.", "", WIND, ["Pasta e fagioli", "Stews"], 96],
    ["Black-eyed Beans", ["black-eyed peas", "black eyed peas", "lobia", "cowpeas", "chawli"], "Cream beans with a black eye", "Cooked in curries, stews and Southern US and West African dishes.", "", WIND, ["Lobia curry", "Hoppin' John", "Akara"], 96],
    ["Adzuki Beans", ["azuki beans", "aduki beans"], "Small sweet red beans", "Boiled with sugar into red bean paste for East Asian sweets, or cooked in rice.", "", "Red bean paste is heavily sweetened.", ["Red bean paste", "Mochi", "Dorayaki"], 94],
    ["Broad Beans", ["fava beans", "faba beans", "fava bean", "ful medames"], "Large flat green or brown beans", "Eaten fresh, dried, or stewed as ful medames; ground for falafel in Egypt.", "Protein, fibre, folate and L-DOPA.",
      "Can trigger acute haemolysis (favism) in people with G6PD deficiency, which is common in Mediterranean, African and Asian populations.", ["Ful medames", "Falafel", "Salads"], 84],
    ["Soybeans", ["soya beans", "soy beans", "soybean", "whole soybeans"], "High-protein oilseed legume", "Cooked whole, or processed into tofu, soy milk, tempeh, miso, soy sauce and flour.", "Complete protein with isoflavones, fibre and polyunsaturated fat.",
      "Soy is a declarable allergen. Isoflavones are phyto-oestrogens; EFSA found no harm from supplements in post-menopausal women.", ["Tofu", "Soy milk", "Snacks"], 90, { refs: [SOY, ISOFLAVONES] }],
    ["Edamame", ["edamame beans", "green soybeans", "mukimame"], "Young green soybeans", "Steamed in the pod as a snack or shelled into salads and stir-fries.", "Protein, fibre, folate and vitamin K.", "Soy is a declarable allergen.", ["Snacks", "Poke bowls", "Salads"], 92, { refs: [SOY] }],
    ["Tofu", ["bean curd", "firm tofu", "silken tofu", "soya bean curd", "tofu puffs"], "Pressed soy milk curd", "Soy milk coagulated with calcium sulphate, magnesium chloride (nigari) or acid and pressed into blocks.", "Complete protein; calcium-set tofu is a significant calcium source.", "Soy is a declarable allergen.", ["Stir-fries", "Mapo tofu", "Plant-based meals"], 92, { refs: [SOY] }],
    ["Tempeh", ["tempe", "soy tempeh"], "Fermented soybean cake", "Whole soybeans bound by Rhizopus mould into a firm cake; sliced and fried, steamed or marinated.", "Complete protein and fibre; fermentation reduces phytate.", "Soy is a declarable allergen.", ["Tempeh stir-fry", "Plant-based burgers"], 92, { refs: [SOY] }],
    ["Natto", ["nattō", "fermented soybeans natto"], "Sticky fermented Japanese soybeans", "Soybeans fermented with Bacillus subtilis var. natto, eaten with rice.", "The richest food source of vitamin K2 (menaquinone-7); protein and nattokinase.",
      "Very high in vitamin K2; people on warfarin are told to avoid it. Soy is a declarable allergen.", ["Japanese breakfast"], 88, { refs: [SOY, VITK] }],
    ["Miso", ["miso paste", "white miso", "red miso", "shiro miso", "aka miso"], "Fermented soybean paste", "Soybeans fermented with salt and koji (often with rice or barley); used in soups, glazes and dressings.", "Fermented; adds umami so less salt is needed elsewhere.", "Very high in salt. Soy is a declarable allergen; barley miso contains gluten.", ["Miso soup", "Glazes", "Dressings"], 82, { refs: [SOY] }],
    ["Soy Flour", ["soya flour", "defatted soy flour", "full-fat soy flour", "soybean flour"], "Ground soybeans", "Added to bread, baked goods and meat products for protein and dough conditioning.", "Concentrated soy protein and fibre.", "Soy is a declarable allergen.", ["Bread", "Baked goods", "Meat products"], 88, { refs: [SOY] }],
    ["Okara", ["soy pulp", "soybean pulp", "tofu dregs"], "Soy pulp left from soy milk", "The fibrous residue from making soy milk and tofu, used in baking, patties and stir-fries.", "High in fibre with some protein.", "Soy is a declarable allergen; perishable.", ["Patties", "Baked goods"], 92, { refs: [SOY] }],
    ["Split Peas", ["yellow split peas", "green split peas", "matar dal", "dried peas"], "Dried split field peas", "Cooked into pea soup, dal and pease pudding.", "", WIND, ["Pea soup", "Pease pudding", "Dal"], 96],
    ["Pea Flour", ["yellow pea flour", "split pea flour", "field pea flour"], "Ground dried peas", "Used in gluten-free baking, pasta, snacks and meat alternatives.", "Protein and fibre; gluten-free.", "None.", ["Gluten-free pasta", "Snacks", "Meat alternatives"], 94],
    ["Marrowfat Peas", ["mushy peas", "processed peas", "marrowfat"], "Mature dried green peas", "Soaked and cooked into mushy peas, or roasted as wasabi-pea snacks.", "Protein and fibre.", "Canned mushy peas often contain added colours and salt.", ["Mushy peas", "Wasabi peas"], 92],
    ["Horse Gram", ["kulthi", "kollu", "ulavalu", "macrotyloma uniflorum"], "Hardy brown pulse", "Cooked into soups (rasam), curries and sprouted salads in South India.", "Very high in protein, iron and fibre.", WIND, ["Kollu rasam", "Kulthi dal"], 96, { src: "ifct" }],
    ["Moth Beans", ["matki", "mat beans", "turkish gram", "vigna aconitifolia"], "Small drought-tolerant bean", "Sprouted for misal or used in curries and namkeen.", "Protein and fibre.", WIND, ["Misal pav", "Namkeen", "Sprouts"], 96, { src: "ifct" }],
    ["Lupin Beans", ["lupini beans", "lupini", "lupin flour", "lupine beans"], "Brined yellow legume", "Brined lupini are eaten as a snack; lupin flour is added to breads and gluten-free foods.", "Very high in protein and fibre; low in starch.",
      "Lupin is a declarable EU allergen that cross-reacts with peanut. Bitter (inadequately debittered) lupins contain toxic alkaloids.", ["Snacks", "Bread", "Gluten-free products"], 82, { refs: [LUPIN] }],
    ["Carob", ["carob powder", "carob flour", "carob pods", "carob chips"], "Sweet pod used as a cocoa substitute", "Roasted ground pods used as a caffeine-free chocolate substitute. (Locust bean gum comes from the seeds.)", "Naturally sweet, high in fibre and polyphenols; caffeine-free.", "Naturally high in sugar; carob confectionery often adds fat and sugar.", ["Carob bars", "Baking", "Drinks"], 92],
  ]),
];
