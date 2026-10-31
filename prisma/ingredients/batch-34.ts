// Expansion batch 34 — Pool 6: more grains, rice varieties, grain flakes, noodles and starchy staples.
import type { SeedIngredient } from "./types";
import { wholeFoods, AUNE_WG } from "./whole";
import { euAllergens } from "./refs";

const GLUTEN = euAllergens("Cereals containing gluten (wheat, rye, barley, oats, spelt, khorasan wheat) are declarable allergens.");
const GLUTEN_C = "Contains gluten: unsuitable for coeliac disease and wheat allergy.";
const REFINED = "A refined grain product: most of the bran and germ are removed. Fine in a mixed diet; whole-grain versions are better.";
const ARSENIC = "Rice takes up more inorganic arsenic than other cereals; vary grains and cook in plenty of water for infants.";

const whole = wholeFoods("grain", {
  refs: [AUNE_WG],
  benefits: "A whole grain providing fibre, B vitamins, magnesium and iron; whole-grain intake is linked to lower cardiovascular disease and mortality.",
  concerns: "None.",
});
const refined = wholeFoods("grain", {
  refs: [],
  benefits: "A starchy staple providing energy.",
  concerns: REFINED,
});

export const BATCH_34: SeedIngredient[] = [
  ...whole([
    ["Einkorn", ["einkorn wheat", "triticum monococcum", "einkorn flour"], "Ancient diploid wheat", "Used in breads, pasta and flakes.", "", GLUTEN_C, ["Artisan bread"], 90, { refs: [GLUTEN] }],
    ["Brown Rice", ["wholegrain rice", "whole grain rice", "husked rice", "cargo rice"], "Rice with the bran layer intact", "Cooked as a side, in rice cakes and brown rice flour.", "", ARSENIC, ["Rice cakes", "Rice bowls"], 90],
    ["Fonio", ["fonio grain", "digitaria exilis", "acha"], "Tiny West African millet", "Cooked like couscous or porridge.", "", "None.", ["Porridge", "Couscous-style dishes"], 90],
    ["Amaranth Grain", ["amaranth flour", "rajgira", "rajgira flour", "ramdana", "popped amaranth"], "Pseudo-cereal seed of the amaranth plant", "Popped into laddoos or ground into fasting flours.", "Protein (including lysine), iron and magnesium.", "None. Unrelated to the dye amaranth (E123).", ["Rajgira laddoo", "Fasting rotis"], 90],
    ["Steel-Cut Oats", ["steel cut oats", "pinhead oats", "irish oats", "oat groats"], "Whole oat groats chopped into pieces", "Cooked into porridge.", "Beta-glucan fibre that lowers LDL cholesterol.", "Oats are often contaminated with wheat; only 'gluten-free' oats suit coeliacs.", ["Porridge"], 94, { refs: [GLUTEN] }],
    ["Instant Oats", ["quick oats", "quick-cooking oats", "instant oat flakes"], "Thin, pre-cooked oat flakes", "Used in instant porridge and baking.", "Beta-glucan fibre.", "Higher glycaemic index than whole or steel-cut oats.", ["Instant porridge", "Flapjacks"], 88, { refs: [GLUTEN] }],
    ["Sprouted Wheat", ["sprouted whole wheat", "germinated wheat"], "Germinated whole wheat grains", "Used in breads and flours.", "", GLUTEN_C, ["Sprouted bread"], 90, { refs: [GLUTEN] }],
    ["Malted Barley", ["barley malt", "malted barley grains", "diastatic malt"], "Germinated and dried barley", "Used in brewing, malt drinks, breads and cereals.", "", GLUTEN_C, ["Malted drinks", "Beer", "Bread"], 85, { refs: [GLUTEN] }],
    ["Graham Flour", ["coarse wholemeal flour"], "Coarsely ground whole wheat flour", "Used in graham crackers and breads.", "", GLUTEN_C, ["Graham crackers"], 88, { refs: [GLUTEN] }],
    ["Chapati Flour", ["chapatti flour", "roti flour"], "Finely stone-ground whole wheat flour", "Used for rotis and parathas.", "", GLUTEN_C, ["Roti", "Paratha"], 90, { refs: [GLUTEN] }],
    ["Red Rice Flakes", ["red poha", "red rice poha"], "Flattened red rice", "Cooked as poha or eaten in snacks.", "", ARSENIC, ["Poha"], 88],
    ["Millet Flakes", ["millet flakes (rolled)", "rolled millet"], "Flattened millet grains", "Used in porridge and mueslis.", "", "None.", ["Muesli", "Porridge"], 88],
    ["Spelt Flakes", ["rolled spelt", "spelt flakes (rolled)"], "Flattened spelt grains", "Used in mueslis and porridge.", "", GLUTEN_C, ["Muesli"], 88, { refs: [GLUTEN] }],
    ["Puffed Quinoa", ["popped quinoa", "quinoa puffs"], "Puffed quinoa seeds", "Used in cereals and bars.", "", "None.", ["Cereal bars"], 86],
    ["Puffed Wheat", ["wheat puffs", "puffed whole wheat"], "Puffed whole wheat grains", "Eaten as cereal.", "", GLUTEN_C, ["Breakfast cereal"], 84, { refs: [GLUTEN] }],
    ["Black Glutinous Rice", ["black sticky rice", "pulut hitam", "forbidden sticky rice"], "Dark purple sticky rice", "Used in Southeast Asian desserts.", "Anthocyanins.", ARSENIC, ["Black rice pudding"], 88],
    ["Sona Masoori Rice", ["sona masuri", "sona masoori"], "Light medium-grain South Indian rice", "Cooked as everyday rice in South India.", "", ARSENIC, ["Rice meals"], 86],
    ["Arborio Rice", ["risotto rice", "carnaroli rice", "vialone nano"], "Starchy Italian short-grain rice", "Used for risotto and rice pudding.", "", `${REFINED} ${ARSENIC}`, ["Risotto"], 82],
    ["Sushi Rice", ["japonica rice", "calrose rice", "japanese rice"], "Sticky short-grain rice", "Used for sushi and onigiri.", "", `${REFINED} ${ARSENIC}`, ["Sushi", "Onigiri"], 82],
    ["Bomba Rice", ["paella rice", "calasparra rice"], "Absorbent Spanish short-grain rice", "Used for paella.", "", `${REFINED} ${ARSENIC}`, ["Paella"], 82],
    ["Idli Rice", ["idli rava", "rice rava", "rice semolina", "rice grits"], "Parboiled rice or coarse rice semolina for idli", "Ground with urad dal for idli and dosa batter.", "", ARSENIC, ["Idli", "Dosa"], 84],
    ["Maize Kernels", ["maize", "field corn", "dent corn", "dried corn"], "Dried mature corn grains", "Milled into meal, grits and masa, or nixtamalised.", "", "None.", ["Tortillas", "Cornbread"], 88],
  ]),
  ...refined([
    ["Glutinous Rice Flour", ["sweet rice flour", "mochiko", "sticky rice flour", "shiratamako"], "Flour of sticky rice", "Used for mochi, tangyuan and gluten-free baking.", "", `${REFINED} ${ARSENIC}`, ["Mochi", "Tangyuan"], 78],
    ["Wheat Vermicelli", ["vermicelli", "seviyan", "semiya", "sevaiyan"], "Very thin wheat noodles", "Used in kheer, upma and soups.", "", `${REFINED} ${GLUTEN_C}`, ["Seviyan kheer", "Upma"], 74, { refs: [GLUTEN] }],
    ["Egg Noodles", ["egg noodle", "lo mein noodles", "chow mein noodles", "egg pasta"], "Wheat noodles made with egg", "Used in stir-fries and soups.", "", `${REFINED} ${GLUTEN_C} Contains egg.`, ["Chow mein", "Noodle soups"], 76, { refs: [GLUTEN] }],
    ["Ramen Noodles", ["ramen", "chuka soba", "alkaline noodles"], "Alkaline wheat noodles", "Served in ramen soups.", "", `${REFINED} ${GLUTEN_C} Instant ramen is fried and comes with a high-salt seasoning.`, ["Ramen"], 72, { refs: [GLUTEN] }],
    ["Breadcrumbs", ["bread crumbs", "dried breadcrumbs", "rusk crumbs", "golden breadcrumbs"], "Dried, ground bread", "Used to coat and bind meat, fish and vegetables.", "", `${REFINED} ${GLUTEN_C} Commercial breadcrumbs can contain added salt and colours.`, ["Fish fingers", "Nuggets", "Kebabs"], 70, { refs: [GLUTEN] }],
    ["Panko", ["panko breadcrumbs", "japanese breadcrumbs"], "Light, flaky Japanese breadcrumbs", "Used to coat fried foods.", "", `${REFINED} ${GLUTEN_C}`, ["Katsu", "Coated snacks"], 70, { refs: [GLUTEN] }],
    ["Matzo Meal", ["matzah meal", "matzoh meal"], "Ground unleavened bread", "Used in matzo balls and as a coating.", "", `${REFINED} ${GLUTEN_C}`, ["Matzo balls"], 74, { refs: [GLUTEN] }],
    ["Orzo", ["risoni", "orzo pasta"], "Rice-shaped pasta", "Used in soups and salads.", "", `${REFINED} ${GLUTEN_C}`, ["Soups", "Salads"], 76, { refs: [GLUTEN] }],
    ["Gnocchi", ["potato gnocchi", "gnocchi di patate"], "Potato and flour dumplings", "Boiled and served with sauce.", "", `${REFINED} ${GLUTEN_C}`, ["Ready meals"], 74, { refs: [GLUTEN] }],
    ["Seitan", ["wheat meat"], "Cooked wheat gluten dough", "Used as a high-protein meat substitute.", "Very high in protein.", GLUTEN_C, ["Vegan meats"], 80, { refs: [GLUTEN] }],
    ["Sago", ["sago pearls", "sagu"], "Starch from the pith of sago palms", "Used in puddings and pearls.", "", "Almost pure starch with little protein or fibre. (In India 'sabudana' is usually tapioca.)", ["Sago pudding"], 72],
    ["Cassava Flour", ["manioc flour", "yuca flour", "farinha de mandioca", "garri", "gari"], "Flour of dried whole cassava root", "Used in gluten-free baking, fufu and farofa.", "", "Must be made from properly processed cassava; poorly processed roots can contain cyanogenic glycosides.", ["Fufu", "Gluten-free bread"], 78],
    ["Cake Flour", ["soft wheat flour", "pastry flour"], "Low-protein refined wheat flour", "Used for cakes, pastries and biscuits.", "", `${REFINED} ${GLUTEN_C}`, ["Cakes", "Biscuits"], 70, { refs: [GLUTEN] }],
    ["Durum Wheat Flour", ["durum flour", "semola rimacinata", "chakki durum"], "Finely milled durum wheat", "Used for pasta and some breads.", "", `${REFINED} ${GLUTEN_C}`, ["Pasta", "Bread"], 76, { refs: [GLUTEN] }],
  ]),
];
