// Expansion batch 18 — Pool 6: nuts, seeds and nut/seed pastes and flours.
import type { SeedIngredient } from "./types";
import { wholeFoods, AUNE_NUT } from "./whole";
import { euAllergens, euNovelFoods } from "./refs";
import { EU_CONTAMINANTS } from "./batch-13";

const TREE = euAllergens("Nuts (almond, hazelnut, walnut, cashew, pecan, Brazil nut, pistachio, macadamia) are declarable allergens.");
const PEANUT = euAllergens("Peanuts and products thereof are declarable allergens.");
const SESAME = euAllergens("Sesame seeds and products thereof are declarable allergens.");
const AFLA = EU_CONTAMINANTS("Sets maximum aflatoxin levels for groundnuts (peanuts), tree nuts and oilseeds.");
const TREE_C = "A tree nut: a declarable allergen that can cause severe reactions.";

const nut = wholeFoods("nut-seed", {
  refs: [AUNE_NUT],
  benefits: "Unsaturated fat, protein, fibre, vitamin E and magnesium; a daily handful of nuts is linked to lower cardiovascular disease and mortality.",
  concerns: TREE_C,
});
const seed = wholeFoods("nut-seed", {
  refs: [],
  benefits: "Unsaturated fat, protein, fibre and minerals.",
  concerns: "None.",
});

export const BATCH_18: SeedIngredient[] = [
  ...nut([
    ["Almonds", ["almond", "whole almonds", "flaked almonds", "sliced almonds", "blanched almonds", "badam"], "Popular tree nut", "Eaten whole, flaked or ground in snacks, cereals, baking and sweets.", "", `${TREE_C} Bitter almonds (not sold as snacks) contain amygdalin.`, ["Granola", "Trail mix", "Baking"], 90, { refs: [TREE, AFLA] }],
    ["Cashews", ["cashew nuts", "cashew", "kaju", "cashew pieces"], "Kidney-shaped tree nut", "Eaten roasted, added to curries and stir-fries, or blended into vegan creams and cheeses.", "", `${TREE_C} 'Raw' cashews are steam-treated to remove the urushiol-containing shell liquid.`, ["Korma", "Vegan cheese", "Snacks"], 90, { refs: [TREE] }],
    ["Walnuts", ["walnut", "walnut pieces", "walnut halves", "akhrot"], "Wrinkled tree nut high in omega-3", "Eaten as a snack, in baking, salads and pestos.", "The richest nut source of plant omega-3 (ALA); EU-authorised claim that 30 g/day of walnuts improves blood vessel elasticity.", TREE_C, ["Brownies", "Salads", "Banana bread"], 90, { refs: [TREE] }],
    ["Pecans", ["pecan nuts", "pecan", "pecan halves"], "Buttery American tree nut", "Used in pies, baking, cereals and snacks.", "", TREE_C, ["Pecan pie", "Granola"], 90, { refs: [TREE] }],
    ["Pistachios", ["pistachio nuts", "pistachio", "pista"], "Green tree nut", "Eaten as a snack and used in sweets, ice cream and baklava.", "Lutein, potassium and protein.", `${TREE_C} Pistachios are prone to aflatoxin contamination; the EU sets limits.`, ["Baklava", "Kulfi", "Snacks"], 88, { refs: [TREE, AFLA] }],
    ["Hazelnuts", ["hazelnut", "filberts", "cobnuts", "roasted hazelnuts"], "Round tree nut", "Used in chocolate spreads, pralines, baking and snacks.", "", `${TREE_C} Also a common cause of oral allergy symptoms in birch-pollen allergy.`, ["Chocolate spread", "Praline", "Biscotti"], 88, { refs: [TREE] }],
    ["Macadamia Nuts", ["macadamia", "macadamias", "queensland nuts"], "Rich buttery tree nut", "Eaten roasted and used in cookies and confectionery.", "Mostly monounsaturated fat.", TREE_C, ["Cookies", "Confectionery"], 90, { refs: [TREE] }],
    ["Brazil Nuts", ["brazil nut", "brazils", "para nuts"], "Large selenium-rich nut", "Eaten as a snack and in mixed nuts.", "Extremely rich in selenium; one or two nuts meet daily needs.", `${TREE_C} So high in selenium that eating many daily can exceed the safe upper limit.`, ["Mixed nuts", "Chocolate-coated nuts"], 84, { refs: [TREE, AFLA] }],
    ["Pine Nuts", ["pine kernels", "pignoli", "chilgoza", "pinon nuts"], "Edible seeds of pine cones", "Used in pesto, salads and Middle Eastern dishes.", "Pinolenic acid, vitamin E and magnesium.",
      "Some imported pine nuts cause 'pine mouth', a harmless but persistent bitter taste lasting days. A tree-nut-like allergen for some people.", ["Pesto", "Salads", "Baklava"], 88],
    ["Chestnuts", ["sweet chestnuts", "roasted chestnuts", "chestnut puree", "chestnut flour", "marrons"], "Starchy low-fat nut", "Roasted, puréed, candied (marrons glacés) or ground into gluten-free flour.", "Low in fat; fibre and vitamin C, unlike most nuts.", "Can cross-react in latex allergy. Not the same as horse chestnuts, which are toxic.", ["Stuffing", "Marrons glacés", "Chestnut flour"], 94],
    ["Peanuts", ["peanut", "groundnuts", "groundnut", "monkey nuts", "roasted peanuts", "moongphali"], "Legume eaten as a nut", "Eaten roasted and salted, as peanut butter, in satay sauce, chikki and confectionery.", "Protein, niacin, vitamin E and unsaturated fat.",
      "Peanut is a major allergen causing severe and fatal reactions. Prone to aflatoxin contamination; the EU sets strict limits.", ["Peanut butter", "Satay sauce", "Chikki", "Chocolate bars"], 84, { refs: [PEANUT, AFLA] }],
    ["Peanut Butter", ["peanut paste", "groundnut paste", "smooth peanut butter", "crunchy peanut butter"], "Ground roasted peanuts", "Roasted peanuts ground into a paste; sometimes with salt, sugar or palm oil added.", "Protein, niacin and unsaturated fat.",
      "Peanut is a major allergen. Many brands add sugar, salt and hydrogenated or palm oil; check the label.", ["Sandwiches", "Satay sauce", "Cookies"], 84, { refs: [PEANUT, AFLA] }],
    ["Almond Butter", ["almond paste", "almond spread"], "Ground almonds as a spread", "Almonds ground into a smooth or crunchy paste.", "", TREE_C, ["Spreads", "Smoothies", "Energy balls"], 90, { refs: [TREE] }],
    ["Ground Almonds", ["almond flour", "almond meal", "badam powder"], "Finely ground almonds", "Used in gluten-free and low-carb baking, macarons, frangipane and korma.", "", TREE_C, ["Macarons", "Frangipane", "Gluten-free cakes"], 90, { refs: [TREE] }],
  ]),
  ...seed([
    ["Sesame Seeds", ["sesame seed", "sesame", "til", "gingelly seeds", "black sesame", "white sesame seeds", "hulled sesame"], "Tiny oil-rich seeds", "Sprinkled on breads and sushi, made into tahini and halva, and used in chikki and Asian cooking.", "Calcium (unhulled), magnesium, lignans (sesamin) and unsaturated fat.",
      "Sesame is a declarable allergen in the EU and (since 2023) a major allergen in the US; reactions can be severe.", ["Burger buns", "Tahini", "Til chikki"], 86, { refs: [SESAME] }],
    ["Tahini", ["tahina", "sesame paste", "tahini paste"], "Ground sesame paste", "Sesame seeds ground to a paste; a key ingredient of hummus, halva and dressings.", "Calcium, magnesium and unsaturated fat.",
      "Sesame is a declarable allergen. Tahini has caused several Salmonella outbreaks.", ["Hummus", "Halva", "Dressings"], 86, { refs: [SESAME] }],
    ["Sunflower Seeds", ["sunflower seed", "sunflower kernels", "hulled sunflower seeds"], "Seeds of the sunflower", "Eaten as a snack and added to breads, cereals and salads.", "Vitamin E, selenium and magnesium.", "Salted, in-shell snack seeds are high in salt.", ["Seeded bread", "Trail mix", "Salads"], 94],
    ["Pumpkin Seeds", ["pepitas", "pumpkin seed kernels", "pumpkin seed"], "Green hulled squash seeds", "Eaten as a snack and added to breads, cereals and salads.", "Magnesium, zinc, iron and protein.", "None.", ["Seeded bread", "Granola", "Salads"], 96],
    ["Flaxseed", ["flaxseeds", "linseed", "linseeds", "ground flaxseed", "milled flaxseed", "golden linseed", "alsi"], "Small omega-3-rich seed", "Added whole or ground to breads, cereals, smoothies and egg replacers.", "Richest common plant source of ALA omega-3; lignans and soluble fibre. Whole seeds pass undigested; grind them for the benefit.", "None at food amounts.", ["Seeded bread", "Smoothies", "Granola"], 94],
    ["Chia Seeds", ["chia seed", "salvia hispanica", "chia"], "Gel-forming omega-3 seed", "Soaked into puddings or added to breads, cereals and drinks.", "ALA omega-3, fibre and calcium.",
      "Authorised as a novel food in the EU with use limits in some categories. Dry seeds swell with water; eating them dry and then drinking has caused oesophageal blockage.", ["Chia pudding", "Bread", "Drinks"], 92, { refs: [euNovelFoods("Chia seed (Salvia hispanica) listed with specifications and conditions of use.")] }],
    ["Hemp Seeds", ["hemp hearts", "hulled hemp seeds", "shelled hemp seeds"], "Nutty seeds of the hemp plant", "Eaten hulled on cereals, salads and in smoothies.", "Complete protein; omega-3 and omega-6 fats in a balanced ratio.",
      "Seeds can carry traces of THC from the plant; the EU sets maximum THC levels for hemp seeds and products.", ["Smoothies", "Salads", "Cereals"], 92, { refs: [EU_CONTAMINANTS("Sets maximum levels of delta-9-THC equivalents in hemp seeds and hemp seed products.")] }],
    ["Lotus Seeds", ["lotus seed", "lotus nuts", "kamal gatta"], "Seeds of the sacred lotus", "Boiled into Asian sweet soups or ground into lotus seed paste for mooncakes.", "Protein and magnesium; low in fat.", "Lotus seed paste is heavily sweetened.", ["Mooncakes", "Sweet soups"], 94],
  ]),
];
