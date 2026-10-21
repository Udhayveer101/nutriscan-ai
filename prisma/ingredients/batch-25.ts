// Expansion batch 25 — Pool 6: culinary ingredients — salts and salty sauces, juices, vinegars,
// coconut milk, spirits used in cooking, and pasta/noodles.
// Salty sauces route through the salt bulk rule, juices through the fruit-juice (free sugar) profile,
// spirits through the ethanol profile; the rest are whole foods.
import type { SeedIngredient, SeedRef } from "./types";
import { family } from "./build";
import { wholeFoods } from "./whole";
import { whoSugars, iarc, euAllergens } from "./refs";

const WHO_SODIUM: SeedRef = { title: "Guideline: Sodium intake for adults and children", authors: "World Health Organization", journal: "WHO Guidelines", year: 2012,
  url: "https://www.who.int/publications/i/item/9789241504836", findings: "Recommends adults consume less than 2 g sodium (5 g salt) per day to reduce blood pressure and cardiovascular risk." };
const ALCOHOL = iarc(100, "Personal Habits and Indoor Combustions (100E): Consumption of Alcoholic Beverages", 2012,
  "Alcoholic beverages and the ethanol in them are carcinogenic to humans (Group 1), causing cancers of the mouth, throat, oesophagus, liver, colorectum and female breast.");
const SOY = euAllergens("Soybeans and cereals containing gluten are declarable allergens.");
const FISH = euAllergens("Fish and molluscs are declarable allergens.");

const base = { evidenceLevel: "STRONG" as const, fdaStatus: "Food (not regulated as an additive)", efsaStatus: "Food (not regulated as an additive)", fssaiStatus: "Food (FSS Act general provisions)", whoStatus: "No ADI (food)" };
const salty = family({
  ...base, categorySlug: "culinary", isNatural: true, isVegan: true, refs: [WHO_SODIUM],
  sciConsensus: "A traditional high-salt seasoning. The scanner treats it like salt: a concern when it dominates, minor in trace amounts.",
  concerns: "Very high in salt; WHO advises under 5 g salt a day.",
});
const juice = family({
  ...base, categorySlug: "culinary", isNatural: true, isVegan: true, refs: [whoSugars("Counts sugars naturally present in fruit juices and concentrates as free sugars, to be kept under 10% of energy.")],
  sciConsensus: "Fruit juice keeps some vitamins but loses the fibre; WHO counts its sugars as free sugars.",
  concerns: "WHO counts juice sugars as free sugars: as a sweetening ingredient it is added sugar under another name, even when labelled 'no added sugar'.",
  benefits: "Vitamin C and potassium; some polyphenols.",
});
const spirit = family({
  ...base, categorySlug: "culinary", isNatural: true, isVegan: true, refs: [ALCOHOL],
  sciConsensus: "An alcoholic beverage used as an ingredient. Alcohol is an IARC Group 1 carcinogen with no safe threshold.",
  concerns: "Contains alcohol (IARC Group 1). Not all of it cooks off: baked or simmered dishes can retain 5–85% depending on time. Avoid in pregnancy and for children.",
  benefits: "Flavour.",
  whoStatus: "Alcohol: WHO states no safe level for health",
});
const culinary = wholeFoods("culinary", { refs: [] });

export const BATCH_25: SeedIngredient[] = [
  salty({ slug: "himalayan-pink-salt", name: "Himalayan Pink Salt", aliases: ["pink salt", "sendha namak", "himalayan salt", "pink himalayan salt"], purposeShort: "Pink rock salt from Pakistan", purpose: "Mined rock salt (halite) coloured by iron oxide traces; used as table salt and on fasting days in India.",
    benefits: "Flavour; trace minerals are too small to matter. Not iodised, unlike most table salt.", safetyScore: 32, commonProducts: ["Snacks", "Vrat foods", "Gourmet salt"],
    concerns: "It is still about 98% sodium chloride: no healthier than table salt, and usually not iodised." }),
  salty({ slug: "black-salt", name: "Black Salt", aliases: ["kala namak", "kala namak salt", "himalayan black salt"], purposeShort: "Sulphurous Indian rock salt", purpose: "Rock salt kiln-fired with charcoal and seeds, giving an eggy sulphur flavour; used in chaat masala and chutneys.",
    benefits: "Distinctive eggy flavour (used in vegan egg dishes).", safetyScore: 34, commonProducts: ["Chaat masala", "Jaljeera", "Chutneys"] }),
  salty({ slug: "soy-sauce", name: "Soy Sauce", aliases: ["soya sauce", "shoyu", "light soy sauce", "dark soy sauce", "naturally brewed soy sauce"], purposeShort: "Fermented soy and wheat seasoning", purpose: "Soybeans and wheat fermented with koji and brine; used in Asian cooking, marinades and snacks.",
    benefits: "Umami; adds savouriness so less salt can be used elsewhere.", safetyScore: 36, commonProducts: ["Stir-fries", "Marinades", "Noodles", "Crisps"],
    concerns: "Very high in salt. Contains soy and usually wheat (gluten). Cheap 'non-brewed' soy sauce is made by acid hydrolysis and can contain 3-MCPD.", refs: [SOY] }),
  salty({ slug: "tamari", name: "Tamari", aliases: ["tamari soy sauce", "gluten-free soy sauce"], purposeShort: "Wheat-free Japanese soy sauce", purpose: "Soy sauce brewed with little or no wheat; popular as a gluten-free seasoning.",
    benefits: "Umami; usually wheat-free.", safetyScore: 36, commonProducts: ["Gluten-free sauces", "Dressings"], concerns: "Very high in salt. Contains soy; check gluten-free labelling.", refs: [SOY] }),
  salty({ slug: "fish-sauce", name: "Fish Sauce", aliases: ["nam pla", "nuoc mam", "patis", "fermented fish sauce"], purposeShort: "Fermented anchovy and salt liquid", purpose: "Anchovies fermented with salt for months; a staple seasoning of Southeast Asian cooking.",
    benefits: "Intense umami.", safetyScore: 34, commonProducts: ["Thai curries", "Pho", "Dipping sauces", "Kimchi"], isVegan: false,
    concerns: "Extremely salty. Fish allergen; can contain histamine.", refs: [FISH] }),
  salty({ slug: "oyster-sauce", name: "Oyster Sauce", aliases: ["oyster sauce (contains oyster extract)"], purposeShort: "Sweet-savoury oyster extract sauce", purpose: "Oyster extract with sugar, salt and thickeners, usually with caramel colour and MSG; used in Cantonese stir-fries.",
    benefits: "Umami.", safetyScore: 34, commonProducts: ["Stir-fries", "Noodles"], isVegan: false, isNatural: false,
    concerns: "Very high in salt and contains sugar; commercial brands typically add MSG, caramel colour and modified starch. Mollusc allergen; often contains wheat.", refs: [FISH] }),
  juice({ slug: "apple-juice", name: "Apple Juice", aliases: ["apple juice from concentrate", "cloudy apple juice", "pressed apple juice"], purposeShort: "Pressed apple juice used as drink or sweetener", purpose: "Drunk on its own and used to sweeten juice drinks, baby foods, snacks and 'no added sugar' products.", safetyScore: 40, commonProducts: ["Juice drinks", "Baby food", "Fruit snacks"] }),
  juice({ slug: "orange-juice", name: "Orange Juice", aliases: ["orange juice from concentrate", "freshly squeezed orange juice", "not from concentrate orange juice"], purposeShort: "Juice of oranges", purpose: "Drunk at breakfast and used in juice drinks, smoothies and sauces.", benefits: "Rich in vitamin C, folate and potassium.", safetyScore: 40, commonProducts: ["Breakfast juice", "Smoothies", "Juice drinks"] }),
  juice({ slug: "grape-juice", name: "Grape Juice", aliases: ["white grape juice", "red grape juice", "grape juice from concentrate"], purposeShort: "Juice of grapes, a common sweetener", purpose: "Drunk on its own and widely used to sweeten juice drinks, fruit snacks and baby food.", safetyScore: 38, commonProducts: ["Juice drinks", "Fruit snacks", "Baby food"] }),
  juice({ slug: "pineapple-juice", name: "Pineapple Juice", aliases: ["pineapple juice from concentrate"], purposeShort: "Juice of pineapples", purpose: "Drunk on its own and used in tropical juice drinks, cocktails and marinades.", benefits: "Vitamin C and manganese.", safetyScore: 40, commonProducts: ["Tropical juice drinks", "Marinades"] }),
  spirit({ slug: "rum", name: "Rum", aliases: ["dark rum", "white rum", "spiced rum"], purposeShort: "Sugar-cane spirit used in baking and desserts", purpose: "Distilled spirit from cane molasses or juice; used in rum cake, Christmas pudding, tiramisu and rum-raisin ice cream.", safetyScore: 32, commonProducts: ["Christmas pudding", "Rum cake", "Rum and raisin ice cream"] }),
  spirit({ slug: "brandy", name: "Brandy", aliases: ["cognac", "armagnac", "fruit brandy"], purposeShort: "Wine spirit used in desserts and sauces", purpose: "Distilled wine (or fruit wine) used to flambé, in Christmas cakes, mincemeat, pâtés and sauces.", safetyScore: 32, commonProducts: ["Christmas cake", "Mincemeat", "Brandy butter"] }),
  spirit({ slug: "whisky", name: "Whisky", aliases: ["whiskey", "scotch whisky", "bourbon whiskey"], purposeShort: "Grain spirit used in sauces and desserts", purpose: "Distilled grain spirit used in sauces, marmalades, cakes and chocolates.", safetyScore: 32, commonProducts: ["Whisky marmalade", "Sauces", "Chocolates"] }),
  spirit({ slug: "vodka", name: "Vodka", aliases: ["grain vodka", "potato vodka"], purposeShort: "Neutral spirit", purpose: "Neutral distilled spirit used in penne alla vodka, liqueur chocolates and as a solvent for extracts.", safetyScore: 32, commonProducts: ["Penne alla vodka", "Liqueur chocolates"] }),
  spirit({ slug: "sake", name: "Sake", aliases: ["nihonshu", "cooking sake", "ryorishu"], purposeShort: "Japanese rice wine used in cooking", purpose: "Brewed rice wine used to tenderise and flavour Japanese dishes, marinades and sauces.", safetyScore: 34, commonProducts: ["Teriyaki", "Marinades", "Japanese simmered dishes"] }),
  ...culinary([
    ["Balsamic Vinegar", ["aceto balsamico", "balsamic vinegar of modena", "balsamic glaze", "aceto balsamico di modena"], "Sweet-sour Italian grape vinegar", "Cooked grape must aged with wine vinegar; used in dressings and glazes.", "Flavour with little fat or salt.",
      "Commercial 'of Modena' balsamic may contain caramel colour (E150d) and added sugar; glazes are syrupy.", ["Dressings", "Glazes", "Salads"], 88],
    ["Malt Vinegar", ["brown malt vinegar", "malt vinegar condiment"], "Vinegar brewed from malted barley", "The classic chip-shop vinegar, also used for pickling.", "Flavour.", "Made from barley: contains trace gluten unless distilled.", ["Fish and chips", "Pickled onions", "Crisps seasoning"], 90],
    ["Rice Vinegar", ["rice wine vinegar", "seasoned rice vinegar", "komezu"], "Mild vinegar made from rice", "Used in sushi rice, dressings and pickles.", "Mild acidity.", "Seasoned rice vinegar contains added sugar and salt.", ["Sushi rice", "Dressings", "Pickles"], 92],
    ["Wine Vinegar", ["red wine vinegar", "white wine vinegar", "sherry vinegar", "champagne vinegar"], "Vinegar fermented from wine", "Used in vinaigrettes, sauces (béarnaise) and pickles.", "Flavour with no fat.", "None. Alcohol is fully converted, though traces may remain.", ["Vinaigrettes", "Sauces", "Pickles"], 94],
    ["Coconut Milk", ["coconut milk (canned)", "light coconut milk", "nariyal doodh", "santan"], "Pressed coconut flesh in water", "Grated coconut pressed with water; used in curries, soups, desserts and dairy-free drinks.", "Medium-chain fats; lactose-free.",
      "High in saturated fat. Canned coconut milk often contains guar gum and sometimes sulphites. Coconut milk drinks are usually fortified and thickened.", ["Thai curries", "Laksa", "Dairy-free desserts"], 84],
    ["Coconut Cream", ["creamed coconut", "coconut cream (canned)", "thick coconut milk"], "Thick concentrated coconut milk", "The rich first pressing of coconut, used in curries, desserts and whipped toppings.", "Lactose-free.", "Very high in saturated fat.", ["Desserts", "Curries", "Piña colada"], 80],
    ["Pasta", ["dried pasta", "durum wheat pasta", "spaghetti", "penne", "macaroni", "fusilli", "tagliatelle", "lasagne sheets"], "Dried durum wheat pasta", "Durum semolina and water, extruded and dried; the base of countless dishes and ready meals.", "Lower glycaemic index than bread; wholewheat pasta adds fibre.",
      "Contains gluten. Refined unless wholewheat.", ["Ready meals", "Pasta salads", "Soups"], 88, { refs: [euAllergens("Cereals containing gluten are declarable allergens.")] }],
    ["Rice Noodles", ["rice vermicelli", "flat rice noodles", "rice sticks", "pho noodles", "ho fun"], "Noodles made from rice flour", "Used in pho, pad thai, spring rolls and stir-fries.", "Gluten-free.", "Rice products contribute inorganic arsenic.", ["Pad Thai", "Pho", "Spring rolls"], 88],
    ["Glass Noodles", ["cellophane noodles", "mung bean noodles", "sweet potato noodles", "dangmyeon", "fensi"], "Translucent starch noodles", "Noodles made from mung bean, sweet potato or pea starch; used in japchae, spring rolls and soups.", "Gluten-free.", "Mostly starch with little protein or fibre. Some imported brands have been found to contain aluminium-based additives.", ["Japchae", "Spring rolls", "Hot pot"], 86],
    ["Udon", ["udon noodles", "sanuki udon"], "Thick Japanese wheat noodles", "Served in broths, stir-fried or chilled.", "Low in fat.", "Contains gluten. Fresh vacuum-packed udon often contains acidity regulators.", ["Noodle soups", "Stir-fries"], 88, { refs: [euAllergens("Cereals containing gluten are declarable allergens.")] }],
    ["Soba", ["soba noodles", "buckwheat noodles", "juwari soba"], "Japanese buckwheat noodles", "Served chilled with dipping sauce or in hot broth.", "Buckwheat adds rutin and fibre.", "Most soba also contains wheat (gluten); buckwheat itself can cause severe allergy.", ["Zaru soba", "Noodle salads"], 88],
  ]),
];

