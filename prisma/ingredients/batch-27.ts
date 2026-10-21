// Expansion batch 27 — Pool 6: more fruit (tropical, Indian), nuts and seeds, grains and flours.
import type { SeedIngredient } from "./types";
import { family } from "./build";
import { wholeFoods, AUNE_WG } from "./whole";
import { fruit } from "./batch-12";
import { euAllergens } from "./refs";

const IFCT = { src: "ifct" as const };
const GLUTEN = euAllergens("Cereals containing gluten are declarable allergens.");
const seedNut = wholeFoods("nut-seed", { refs: [], benefits: "Protein, unsaturated fat and minerals.", concerns: "None." });
const grain = wholeFoods("grain", { refs: [AUNE_WG], benefits: "Fibre, B vitamins and minerals.", concerns: "None." });
const flour = family({
  categorySlug: "grain", evidenceLevel: "STRONG", isNatural: true, isVegan: true,
  sciConsensus: "A refined wheat flour. The scanner applies its refined-flour rule (a concern when it dominates a product).",
  fdaStatus: "Food; enriched flour standards of identity apply", efsaStatus: "Food (not regulated as an additive)", fssaiStatus: "Food (FSSAI standards for maida)", whoStatus: "WHO advises choosing whole grains over refined grains",
  benefits: "Versatile baking flour; often fortified with iron and B vitamins.",
  concerns: "Refined: the bran and germ (with most fibre and micronutrients) are removed; high glycaemic index. Contains gluten.",
  refs: [AUNE_WG, GLUTEN],
});

export const BATCH_27: SeedIngredient[] = [
  ...fruit([
    ["Cherimoya", ["annona cherimola", "chirimoya"], "Creamy Andean custard apple", "Eaten fresh with a spoon or in smoothies and ice cream.", "Vitamin C, vitamin B6 and fibre.", "Seeds are toxic and should not be crushed or eaten.", ["Smoothies", "Ice cream"], 92],
    ["Soursop", ["graviola", "guanabana", "annona muricata"], "Tangy spiny tropical fruit", "Pulp used in juices, smoothies and ice cream.", "Vitamin C and fibre.",
      "Contains annonacin; heavy, long-term consumption (especially of teas and supplements) has been linked to atypical parkinsonism in the Caribbean. Cancer-cure claims for graviola are unfounded.", ["Juices", "Ice cream"], 84],
    ["Feijoa", ["pineapple guava", "guavasteen", "acca sellowiana"], "Aromatic green fruit", "Eaten fresh with a spoon or in jams and drinks.", "Vitamin C and fibre.", "None.", ["Jams", "Drinks"], 96],
    ["Acerola", ["barbados cherry", "west indian cherry", "malpighia emarginata", "acerola cherry"], "Tiny cherry with extreme vitamin C", "Used in juices and as acerola powder, a 'natural vitamin C' ingredient.", "Among the richest natural sources of vitamin C.", "None. Acerola powder is used to add vitamin C under a natural-sounding name.", ["Juices", "Supplements", "Fortified snacks"], 94],
    ["Jujube", ["chinese date", "red date", "ber", "ziziphus jujuba", "indian jujube"], "Small apple-like drupe", "Eaten fresh, dried (red dates) or candied; used in Chinese soups and Indian chaat.", "Vitamin C and fibre.", "Dried and candied jujubes are sugar-dense.", ["Chinese soups", "Candied fruit", "Chaat"], 94],
    ["Mamey Sapote", ["mamey", "pouteria sapota"], "Salmon-fleshed tropical fruit", "Eaten fresh or in milkshakes and ice cream.", "Vitamin B6, vitamin C and fibre.", "None.", ["Milkshakes", "Ice cream"], 96],
    ["Physalis", ["cape gooseberry", "goldenberry", "golden berry", "groundcherry", "rasbhari", "physalis peruviana"], "Small golden berry in a papery husk", "Eaten fresh, dried or used as a dessert garnish.", "Vitamin C, beta-carotene and fibre.", "Unripe berries and the husk/leaves contain solanine-type alkaloids; eat only ripe fruit.", ["Garnishes", "Dried fruit mixes"], 92],
    ["Boysenberry", ["boysenberries"], "Large dark hybrid bramble berry", "Used in jams, pies and desserts.", "Fibre, vitamin C and anthocyanins.", "None.", ["Jam", "Pies"], 96],
    ["Crab Apple", ["crabapple", "crab apples", "malus sylvestris"], "Small very sour apple", "Cooked into jelly and preserves.", "Pectin-rich.", "Seeds contain amygdalin like other apples.", ["Crab apple jelly"], 96],
    ["Pomelo", ["pummelo", "chakotra", "citrus maxima", "shaddock"], "Giant mild citrus", "Eaten fresh or in Southeast Asian salads.", "Vitamin C and fibre.", "Contains furanocoumarins like grapefruit and may interact with some medicines.", ["Pomelo salad", "Fresh fruit"], 90],
    ["Tangelo", ["minneola", "tangelos"], "Mandarin–grapefruit hybrid", "Eaten fresh or juiced.", "Vitamin C.", "None.", ["Fresh fruit", "Juice"], 96],
    ["Dragon Fruit", ["pitaya", "pitahaya", "red dragon fruit", "hylocereus"], "Cactus fruit with speckled flesh", "Eaten fresh or in smoothie bowls; red-fleshed varieties colour foods pink.", "Fibre, magnesium and betalains (red varieties).", "Red-fleshed dragon fruit can turn urine pink (harmless).", ["Smoothie bowls", "Fruit salads"], 96],
    ["Sweet Lime", ["mosambi", "musambi", "sweet lemon", "citrus limetta"], "Mild low-acid citrus", "Mostly juiced in India and the Middle East.", "Vitamin C.", "Juice counts as free sugar.", ["Mosambi juice"], 94, IFCT],
    ["Bael", ["bilva", "aegle marmelos", "bael fruit"], "Hard-shelled aromatic Indian fruit", "Pulp made into sharbat and murabba.", "Fibre and vitamin C; traditionally used for digestion.", "Sharbat and murabba are sweetened.", ["Bael sharbat", "Murabba"], 94, IFCT],
    ["Wood Apple", ["kaith", "kavath", "elephant apple", "limonia acidissima"], "Sour-sweet hard-shelled fruit", "Pulp eaten with jaggery or made into chutney and jam.", "Fibre and vitamin C.", "None.", ["Chutney", "Jam"], 94, IFCT],
    ["Phalsa", ["falsa", "grewia asiatica"], "Small purple summer berry", "Eaten fresh with salt or made into sharbat.", "Vitamin C and anthocyanins.", "None.", ["Phalsa sharbat"], 96, IFCT],
    ["Karonda", ["karanda", "carissa carandas", "christ's thorn fruit"], "Sour berry used in pickles", "Pickled, made into chutney, or candied as a cheap substitute for glacé cherries.", "Vitamin C and iron.", "Candied karonda is often dyed and sugared.", ["Pickles", "Candied cherries"], 92, IFCT],
    ["Ackee", ["akee", "blighia sapida", "canned ackee"], "Jamaican fruit eaten cooked", "The arils of ripe, naturally opened fruit are boiled and cooked with saltfish.", "Monounsaturated fat and protein.",
      "Unripe ackee contains hypoglycin A and causes 'Jamaican vomiting sickness' (severe hypoglycaemia). Only canned ackee from FDA-approved processors may be imported to the US.", ["Ackee and saltfish"], 76],
  ]),
  ...seedNut([
    ["Watermelon Seeds", ["watermelon seed kernels", "tarbooz ke beej"], "Hulled watermelon seeds", "Eaten roasted as a snack or ground into Indian gravies (as magaz).", "Protein, magnesium and zinc.", "None.", ["Roasted snacks", "Thandai", "Gravies"], 96],
    ["Garden Cress Seeds", ["halim seeds", "aliv", "chandrasur", "lepidium sativum seeds"], "Tiny iron-rich seeds", "Soaked and added to laddoos, kheer and drinks, especially after childbirth in India.", "Iron, folate and protein.", "None at food amounts.", ["Aliv laddoo", "Kheer"], 94, IFCT],
    ["Ginkgo Nuts", ["ginkgo seeds", "ginkgo biloba nuts", "bai guo"], "Seeds of the ginkgo tree", "Roasted or added to Chinese and Japanese soups and congee.", "Starch and protein; low in fat.",
      "Contain ginkgotoxin (4'-O-methylpyridoxine): eating many, especially for children, can cause seizures. Raw seeds and the fruit pulp are irritant.", ["Chawanmushi", "Congee"], 80],
    ["Chironji", ["charoli", "buchanania lanzan", "cuddapah almond"], "Small lentil-shaped nut", "Used in Indian sweets, kheer and korma.", "Protein and unsaturated fat.", "None.", ["Kheer", "Shrikhand", "Korma"], 94, IFCT],
  ]),
  ...grain([
    ["Popcorn", ["popping corn", "popcorn kernels", "plain popcorn"], "Whole-grain maize that puffs when heated", "Popped and seasoned as a snack.", "A whole grain with fibre; air-popped popcorn is low in calories.",
      "Cinema and microwave popcorn often add a lot of fat, salt and sugar. Kernels are a choking hazard for young children.", ["Snacks", "Microwave popcorn"], 92],
    ["Hominy", ["nixtamalized corn", "posole corn"], "Lime-treated whole maize kernels", "Maize soaked in alkali and hulled; cooked in pozole or ground into grits and masa.", "Nixtamalisation frees niacin; fibre.", "Canned hominy can be salty.", ["Pozole", "Grits"], 94],
    ["Rice Bran", ["stabilised rice bran", "rice polish"], "Outer layer of brown rice", "Added to cereals, bakery and supplements; source of rice bran oil.", "Fibre, B vitamins, vitamin E (tocotrienols) and gamma-oryzanol.", "Accumulates inorganic arsenic, like rice; goes rancid unless stabilised.", ["Cereals", "Supplements"], 88],
    ["Red Rice", ["matta rice", "rosematta rice", "kerala red rice", "red cargo rice", "bhutanese red rice"], "Rice with a red bran layer", "Eaten as a whole grain in Kerala, Sri Lanka and Bhutan.", "Whole grain: fibre and anthocyanin-type pigments.", "Like all rice, a source of inorganic arsenic.", ["Kerala meals", "Rice blends"], 92],
    ["Black Rice", ["forbidden rice", "chak-hao", "purple rice"], "Anthocyanin-rich whole-grain rice", "Used in Asian desserts, salads and rice blends.", "Whole grain rich in anthocyanins.", "Like all rice, a source of inorganic arsenic.", ["Rice blends", "Desserts"], 92],
    ["Triticale", ["triticale flakes", "triticale flour"], "Wheat–rye hybrid grain", "Used in breads, cereals and feed.", "", "Contains gluten.", ["Cereals", "Breads"], 92, { refs: [GLUTEN] }],
    ["Farro", ["emmer", "emmer wheat", "triticum dicoccum", "farro perlato"], "Ancient hulled wheat", "Cooked whole in Italian soups and salads.", "Whole grain with fibre and protein.", "Contains gluten (a wheat).", ["Soups", "Salads"], 92, { refs: [GLUTEN] }],
    ["Wheat Berries", ["whole wheat berries", "wheat kernels"], "Whole wheat kernels", "Cooked whole in salads and porridges or sprouted.", "Whole grain fibre, protein and minerals.", "Contains gluten.", ["Salads", "Porridge"], 94, { refs: [GLUTEN] }],
  ]),
  flour({ slug: "maida", name: "Maida", aliases: ["maida flour", "refined wheat flour (maida)"], purposeShort: "Indian refined white wheat flour", purpose: "Finely milled refined wheat flour used for naan, samosa pastry, biscuits, bread and many snacks.", safetyScore: 58, commonProducts: ["Naan", "Samosa", "Biscuits", "Bhatura"] }),
  flour({ slug: "self-raising-flour", name: "Self-Raising Flour", aliases: ["self-rising flour", "self raising flour"], purposeShort: "White flour with raising agents", purpose: "Plain white flour premixed with baking powder (sodium bicarbonate and an acid) and sometimes salt.", safetyScore: 56, commonProducts: ["Cakes", "Scones", "Pancakes"],
    concerns: "Refined white flour with added raising agents (often sodium acid pyrophosphate, E450), which add sodium. Contains gluten." }),
  flour({ slug: "strong-white-flour", name: "Strong White Flour", aliases: ["bread flour", "strong flour", "white bread flour"], purposeShort: "High-protein white bread flour", purpose: "Refined wheat flour with more gluten-forming protein, used for bread and pizza dough.", safetyScore: 58, commonProducts: ["Bread", "Pizza dough"] }),
];
