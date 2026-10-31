// Expansion batch 39 — Pool 6: more mushrooms and seaweeds, speciality oils, cocoa-butter
// equivalents (Directive 2000/36/EC) and the blended fats that earlier batches never linked.
import type { SeedIngredient, SeedRef } from "./types";
import { family } from "./build";
import { wholeFoods } from "./whole";

const CBE: SeedRef = { title: "Directive 2000/36/EC relating to cocoa and chocolate products intended for human consumption", authors: "European Parliament and Council", journal: "Official Journal of the European Communities, L 197", year: 2000,
  url: "https://eur-lex.europa.eu/eli/dir/2000/36/oj", findings: "Allows up to 5% of six named vegetable fats (illipe, palm oil, sal, shea, kokum gurgi, mango kernel) in chocolate, with labelling." };
const IODINE: SeedRef = { title: "Scientific Opinion on Dietary Reference Values for iodine", authors: "EFSA Panel on Dietetic Products, Nutrition and Allergies (NDA)", journal: "EFSA Journal 12(5):3660", year: 2014,
  findings: "Sets an upper intake of 600 µg/day for adults; some brown seaweeds can exceed this in a single portion." };
const TFA: SeedRef = { title: "Commission Regulation (EU) 2019/649 amending Annex III to Regulation (EC) No 1925/2006 as regards trans fat", authors: "European Commission", journal: "Official Journal of the European Union, L 110", year: 2019,
  findings: "Limits trans fat other than that naturally occurring in animal fat to 2 g per 100 g of fat in food for the final consumer." };

const shroom = wholeFoods("fungi-seaweed", {
  refs: [],
  benefits: "Low in calories; B vitamins, selenium, potassium and beta-glucan fibre.",
  concerns: "None for cultivated mushrooms. Never eat wild mushrooms without expert identification.",
});
const weed = wholeFoods("fungi-seaweed", {
  refs: [IODINE],
  benefits: "Iodine, fibre and minerals; adds umami.",
  concerns: "Seaweeds can be very high in iodine and sometimes arsenic; eat in moderation.",
});
const oil = wholeFoods("oil-fat", {
  refs: [],
  sciConsensus: "A minimally processed, usually cold-pressed speciality oil, scored as a whole-food fat.",
  benefits: "Unsaturated fats and vitamin E.",
  concerns: "Energy-dense like all fats; otherwise none.",
});
const cbe = wholeFoods("oil-fat", {
  refs: [CBE],
  sciConsensus: "A tropical vegetable fat permitted (up to 5%) as a cocoa-butter equivalent in EU chocolate.",
  benefits: "Hard, stable fat with a melting profile close to cocoa butter.",
  concerns: "High in saturated (mostly stearic) fat. In chocolate it must be declared as 'contains vegetable fats in addition to cocoa butter'.",
});
const blended = family({
  categorySlug: "oil-fat", evidenceLevel: "MODERATE", isNatural: false, isVegan: true,
  sciConsensus: "An industrial blended fat (NOVA 4). Scored through the scanner's margarine/shortening profile: a moderate concern when it dominates a product.",
  fdaStatus: "Food (standard of identity for margarine, 21 CFR 166.110); PHOs no longer GRAS", efsaStatus: "Food; trans fat capped at 2 g/100 g fat (Reg. (EU) 2019/649)",
  fssaiStatus: "Food; TFA capped at 2% (FSSAI 2022)", whoStatus: "WHO calls for elimination of industrial trans fat",
  benefits: "Cheaper and more spreadable than butter; usually lower in saturated fat than butter.",
  concerns: "An industrial fat often high in saturated fat from palm; older or unregulated products can still contain trans fat.",
  refs: [TFA],
});

export const BATCH_39: SeedIngredient[] = [
  ...shroom([
    ["Shimeji", ["shimeji mushrooms", "beech mushrooms", "buna shimeji", "brown beech mushroom"], "Clustered Japanese beech mushroom", "Used in stir-fries, soups and hot pots.", "", "Must be cooked; bitter when raw.", ["Hot pots", "Stir-fries"]],
    ["Lion's Mane Mushroom", ["lion's mane", "lions mane", "hericium erinaceus", "monkey head mushroom", "pom pom mushroom"], "Shaggy white mushroom", "Cooked like seafood and sold as powders and supplements.", "", "Brain-health claims for supplements are not established in humans.", ["Supplements", "Vegan crab cakes"], 86],
    ["Straw Mushroom", ["straw mushrooms", "paddy straw mushroom", "volvariella volvacea"], "Small hooded Asian mushroom", "Used canned in Chinese and Thai dishes.", "", "", ["Tom yum", "Stir-fries"]],
    ["Nameko", ["nameko mushrooms", "pholiota microspora"], "Slippery amber Japanese mushroom", "Used in miso soup and noodles.", "", "", ["Miso soup"]],
    ["Matsutake", ["matsutake mushroom", "pine mushroom", "tricholoma matsutake"], "Prized aromatic pine mushroom", "Grilled, steamed in rice or in clear soups.", "", "", ["Matsutake gohan"]],
    ["Tremella", ["snow fungus", "white fungus", "silver ear", "tremella fuciformis"], "Jelly-like white fungus", "Used in Chinese sweet soups.", "Soluble polysaccharide fibre.", "None.", ["Sweet soups"]],
    ["Cordyceps Militaris", ["cordyceps flower", "orange cordyceps", "cordyceps militaris fruiting body"], "Cultivated orange caterpillar fungus", "Used in Chinese soups and as a supplement.", "", "Supplements are unproven for performance claims; cultivated fruiting bodies are eaten as food in China.", ["Soups", "Supplements"], 80],
    ["Chicken of the Woods", ["sulphur shelf", "laetiporus sulphureus"], "Bright orange bracket fungus", "Foraged and cooked as a chicken-like meat substitute.", "", "Must be well cooked; some people react with stomach upset.", ["Foraged dishes"], 82],
  ]),
  ...weed([
    ["Sea Lettuce", ["ulva", "ulva lactuca", "aonori", "green laver"], "Thin green seaweed", "Flaked as aonori on okonomiyaki or used in salads.", "", "Seaweeds can be very high in iodine; eat in moderation.", ["Okonomiyaki", "Seaweed seasoning"], 88],
    ["Arame", ["eisenia bicyclis", "arame seaweed"], "Mild shredded brown seaweed", "Rehydrated for salads and stir-fries.", "", "", ["Salads"], 84],
    ["Sea Grapes", ["umibudo", "green caviar", "caulerpa lentillifera"], "Bead-like green seaweed", "Eaten fresh with dipping sauces.", "", "Seaweeds can be very high in iodine; eat in moderation.", ["Okinawan dishes"], 88],
    ["Bladderwrack", ["fucus vesiculosus", "rockweed"], "Brown seaweed with air bladders", "Used in kelp supplements and seasonings.", "", "Very high and variable iodine content; supplements can disturb thyroid function.", ["Supplements"], 72],
    ["Sea Spaghetti", ["thongweed", "himanthalia elongata"], "Long strap-like brown seaweed", "Cooked like pasta or added to salads.", "", "", ["Salads"], 86],
  ]),
  ...oil([
    ["Hemp Seed Oil", ["hemp oil", "hempseed oil", "cold-pressed hemp oil"], "Green oil pressed from hemp seeds", "Used in dressings and supplements.", "Rich in omega-3 ALA and omega-6 fats.", "Contains no meaningful THC when made from food-grade seed; must not be heated strongly.", ["Dressings", "Supplements"], 84],
    ["Pumpkin Seed Oil", ["kürbiskernöl", "styrian pumpkin seed oil"], "Dark green Austrian seed oil", "Drizzled on salads, soups and ice cream.", "", "", ["Dressings"], 84],
    ["Hazelnut Oil", ["filbert oil"], "Oil pressed from hazelnuts", "Used in dressings and baking.", "Monounsaturated fat and vitamin E.", "Cold-pressed oils can trigger tree-nut allergy.", ["Dressings"], 84],
    ["Macadamia Oil", ["macadamia nut oil"], "Buttery oil from macadamia nuts", "Used for cooking and dressings.", "Very high in monounsaturated fat.", "Cold-pressed oils can trigger tree-nut allergy.", ["Dressings"], 84],
    ["Argan Oil", ["culinary argan oil", "roasted argan oil"], "Moroccan oil from argan kernels", "Used in amlou and as a dressing.", "", "", ["Amlou", "Couscous"], 84],
    ["Camelina Oil", ["false flax oil", "gold-of-pleasure oil", "camelina sativa oil"], "Omega-3 rich oil", "Used in dressings and cooking.", "High in ALA omega-3.", "", ["Dressings"], 84],
    ["Black Seed Oil", ["nigella oil", "kalonji oil", "black cumin seed oil", "nigella sativa oil"], "Oil pressed from nigella seeds", "Used as a supplement and flavouring.", "", "Supplement doses have caused rare liver and kidney problems; culinary amounts are fine.", ["Supplements", "Dressings"], 80],
    ["Pistachio Oil", ["pistachio nut oil"], "Green oil from pistachios", "Used in dressings and desserts.", "", "Cold-pressed oils can trigger tree-nut allergy.", ["Dressings"], 84],
    ["Camellia Seed Oil", ["tea seed oil", "camellia oil", "camellia oleifera oil"], "Chinese cooking oil from tea-plant seeds", "Used for stir-frying in southern China.", "High in monounsaturated fat.", "", ["Stir-fries"], 84],
    ["Wheat Germ Oil", ["wheatgerm oil"], "Oil from the germ of wheat", "Used as a vitamin E supplement and in dressings.", "Very rich in vitamin E.", "", ["Supplements"], 84],
    ["Niger Seed Oil", ["ramtil oil", "guizotia abyssinica oil"], "Oil from niger (ramtil) seed", "A cooking oil in Ethiopia and parts of India.", "", "", ["Ethiopian dishes"], 82],
  ]),
  ...cbe([
    ["Shea Butter", ["shea stearin", "shea fat", "shea olein", "butyrospermum parkii"], "Fat from shea nuts", "Used as a cocoa-butter equivalent and in confectionery fats.", "", "", ["Chocolate", "Coatings"], 76],
    ["Illipe Butter", ["illipe fat", "borneo tallow", "shorea stenoptera butter"], "Fat from Borneo illipe nuts", "Cocoa-butter equivalent in chocolate.", "", "", ["Chocolate"], 76],
    ["Sal Fat", ["sal butter", "sal seed fat", "shorea robusta fat"], "Fat from sal tree seeds", "Cocoa-butter equivalent in chocolate.", "", "", ["Chocolate"], 76],
    ["Kokum Butter", ["kokum fat", "garcinia indica butter", "kokum gurgi fat"], "Fat from kokum seeds", "Cocoa-butter equivalent in chocolate.", "", "", ["Chocolate"], 76],
    ["Mango Kernel Fat", ["mango kernel butter", "mango seed butter"], "Fat from mango stones", "Cocoa-butter equivalent in chocolate.", "", "", ["Chocolate"], 76],
    ["Cocoa Butter Equivalent", ["cbe", "cocoa butter equivalents", "vegetable fats (cbe)"], "Blend of tropical fats that mimics cocoa butter", "Replaces up to 5% of cocoa butter in EU chocolate.", "", "", ["Chocolate", "Coatings"], 74],
  ]),
  blended({ slug: "margarine", name: "Margarine", aliases: ["table margarine", "cake margarine", "baking margarine"], purposeShort: "Blended vegetable fat spread", purpose: "Spread on bread and used in baking and pastry instead of butter.", safetyScore: 56, commonProducts: ["Biscuits", "Pastry", "Spreads"] }),
  blended({ slug: "vegetable-shortening", name: "Vegetable Shortening", aliases: ["shortening", "bakery shortening", "all-purpose shortening"], purposeShort: "Solid vegetable fat for baking and frying", purpose: "Makes pastry flaky and biscuits short; used for deep-frying.", safetyScore: 54, commonProducts: ["Biscuits", "Pastry", "Fried snacks"] }),
  blended({ slug: "vanaspati", name: "Vanaspati", aliases: ["vegetable ghee", "vanaspati ghee"], purposeShort: "Indian hydrogenated vegetable cooking fat", purpose: "Hardened vegetable oil used like ghee in Indian sweets, bakery and street food.", safetyScore: 50, commonProducts: ["Mithai", "Bakery", "Street food"],
    concerns: "Historically a major source of trans fat; FSSAI has capped it at 2% since 2022, but enforcement varies. High in saturated fat." }),
  blended({ slug: "fat-spread", name: "Fat Spread", aliases: ["vegetable fat spread", "dairy-free spread", "low-fat spread", "reduced-fat spread"], purposeShort: "Spread with less fat than margarine", purpose: "Lower-fat spreads made with water, oils and emulsifiers.", safetyScore: 58, commonProducts: ["Spreads"] }),
];
