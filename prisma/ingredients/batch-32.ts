// Expansion batch 32 — Pool 6: more herbs, regional spices and dry spice blends.
// Blends are listed only where they are spices alone (no salt, sugar or anti-caking agent
// in the traditional recipe); a branded blend with added salt still lists salt separately.
import type { SeedIngredient, SeedRef } from "./types";
import { wholeFoods } from "./whole";
import { SPICE_RISK, ISO676 } from "./batch-10";

const COUMARIN_EFSA: SeedRef = { title: "Coumarin in flavourings and other food ingredients with flavouring properties (Scientific Opinion)", authors: "EFSA Panel on Food Additives, Flavourings, Processing Aids and Materials in Contact with Food (AFC)",
  journal: "EFSA Journal", year: 2008, findings: "Confirmed a tolerable daily intake of 0.1 mg coumarin/kg bw; cassia cinnamon can contain enough coumarin for heavy users to exceed it." };
const ARECA_BETEL: SeedRef = { title: "IARC Monographs Volume 85: Betel-quid and Areca-nut Chewing and Some Areca-nut-derived Nitrosamines", authors: "International Agency for Research on Cancer",
  journal: "IARC Monographs on the Evaluation of Carcinogenic Risks to Humans", year: 2004, url: "https://publications.iarc.who.int/", findings: "Betel quid with or without tobacco, and areca nut, are carcinogenic to humans (Group 1); the betel leaf itself was not classified as carcinogenic." };

const SMALL = "None at culinary amounts. Like all dried spices it can carry Salmonella if not heat- or steam-treated.";
const spice = wholeFoods("spice-herb", {
  refs: [SPICE_RISK, ISO676],
  benefits: "Adds flavour and aroma without salt or sugar; used in amounts too small to matter nutritionally.",
  concerns: SMALL,
});
const herb = wholeFoods("spice-herb", {
  refs: [ISO676],
  benefits: "Adds flavour and aroma without salt or sugar; used in amounts too small to matter nutritionally.",
  concerns: "None at culinary amounts.",
});
const blend = wholeFoods("spice-herb", {
  refs: [SPICE_RISK, ISO676],
  sciConsensus: "A traditional blend of ground spices and herbs. Scored as a whole food; check the label for added salt, sugar or anti-caking agents.",
  benefits: "Flavour without salt or sugar when the blend contains spices only.",
  concerns: "Check the label: commercial versions may add salt or anti-caking agents, and ground spices can carry Salmonella if untreated.",
});
const own = { src: "own" as const };

export const BATCH_32: SeedIngredient[] = [
  ...herb([
    ["Thai Basil", ["horapha", "anise basil", "ocimum basilicum var. thyrsiflora"], "Anise-scented basil", "Added to Thai curries, stir-fries and pho.", "", "", ["Thai curries", "Pho"], 96, own],
    ["Holy Basil", ["tulsi", "tulasi", "kaprao", "ocimum tenuiflorum", "ocimum sanctum"], "Peppery sacred basil", "Used in Thai pad kaprao and drunk as tulsi tea.", "", "None at culinary or tea amounts.", ["Pad kaprao", "Tulsi tea"], 94, own],
    ["Lemon Basil", ["thai lemon basil", "maenglak", "ocimum × africanum", "sabja leaves"], "Citrus-scented basil", "Used in Thai and Indonesian dishes; its seeds are sabja.", "", "", ["Curries", "Salads"], 96, own],
    ["Vietnamese Coriander", ["rau ram", "laksa leaf", "vietnamese mint", "persicaria odorata"], "Peppery coriander-like herb", "Eaten raw in Vietnamese salads and Malaysian laksa.", "", "", ["Laksa", "Salads"], 96, own],
    ["Culantro", ["ngo gai", "sawtooth coriander", "recao", "eryngium foetidum", "mexican coriander"], "Strong long-leaved coriander relative", "Used in Caribbean sofrito and Vietnamese soups.", "", "", ["Sofrito", "Pho"], 96, own],
    ["Shiso", ["perilla leaves", "perilla", "kkaennip", "beefsteak plant", "perilla frutescens"], "Minty basil-like leaf", "Wrapped around sushi and Korean barbecue, or pickled.", "", "", ["Sushi", "Korean barbecue"], 96, own],
    ["Lovage", ["levisticum officinale", "love parsley"], "Celery-flavoured herb", "Used in soups, stews and salads.", "", "", ["Soups", "Stews"], 96, own],
    ["Summer Savory", ["savory", "satureja hortensis", "bohnenkraut"], "Peppery herb for beans", "Flavours bean dishes, sausages and herbes de Provence.", "", "", ["Bean dishes", "Sausages"], 96, own],
    ["Winter Savory", ["satureja montana", "mountain savory"], "Pungent perennial savory", "Used with beans, meats and stuffings.", "", "", ["Stuffings", "Bean dishes"], 96, own],
    ["Hyssop", ["hyssopus officinalis"], "Bitter minty herb", "Used in small amounts in salads, soups and liqueurs such as Chartreuse.", "", "Hyssop essential oil contains pinocamphone and can trigger seizures; the herb in culinary amounts is fine.", ["Liqueurs", "Soups"], 92, own],
    ["Borage", ["borage leaves", "borage flowers", "starflower", "borago officinalis"], "Cucumber-flavoured herb and flower", "Leaves in salads and green sauce; flowers decorate drinks.", "", "Contains small amounts of pyrrolizidine alkaloids; occasional culinary use is fine, regular large amounts are not advised.", ["Salads", "Pimm's", "Green sauce"], 86, own],
    ["Lemon Verbena", ["aloysia citrodora", "verveine", "lemon beebrush"], "Intensely lemony herb", "Infused as a tea (verveine) and in desserts.", "", "", ["Herbal tea", "Desserts"], 96, own],
    ["Epazote", ["dysphania ambrosioides", "mexican tea", "wormseed"], "Pungent Mexican herb", "Cooked with black beans and in quesadillas.", "", "Contains ascaridole, which is toxic in large amounts; use as a seasoning only.", ["Black beans", "Quesadillas"], 88, own],
    ["Makrut Lime Leaves", ["kaffir lime leaves", "lime leaves", "citrus hystrix leaves", "bai makrut"], "Aromatic double lime leaf", "Torn into Thai curries, soups and curry pastes.", "", "", ["Tom yum", "Thai curries"], 96, own],
    ["Pandan Leaves", ["pandan", "screwpine leaves", "pandanus amaryllifolius", "daun pandan", "rampe"], "Vanilla-scented leaf", "Flavours rice, cakes, kaya and desserts in Southeast and South Asia.", "", "", ["Nasi lemak", "Pandan cake", "Kaya"], 96, own],
    ["Betel Leaf", ["paan leaf", "paan", "piper betle", "vettilai", "nagavalli"], "Heart-shaped chewing leaf", "Wrapped into paan; also used in some Thai dishes (miang kham).", "", "The leaf is not classed as carcinogenic, but paan usually contains areca nut (IARC Group 1) and often tobacco.", ["Paan", "Miang kham"], 86, { src: "own" as const, refs: [ISO676, ARECA_BETEL] }],
    ["Indian Bay Leaf", ["tej patta", "tejpat", "cinnamomum tamala", "malabathrum"], "Cinnamon-scented Indian bay leaf", "Added whole to biryani, pulao and curries.", "", "", ["Biryani", "Pulao", "Curries"], 96, own],
    ["Sweet Cicely", ["myrrhis odorata", "garden myrrh"], "Aniseed-scented herb", "Leaves sweeten stewed fruit; seeds are eaten green.", "", "", ["Stewed fruit"], 96, own],
    ["Lemon Myrtle", ["backhousia citriodora", "lemon ironwood"], "Australian lemon-scented leaf", "Dried leaf flavours tea, baking and seafood.", "", "", ["Tea", "Baking"], 96, own],
    ["Rose Petals", ["dried rose petals", "rose buds", "gulkand petals", "rosa damascena petals"], "Fragrant edible petals", "Dried petals flavour ras el hanout, gulkand and Persian desserts.", "", "Use food-grade petals; florist roses may carry pesticides.", ["Gulkand", "Ras el hanout", "Desserts"], 95, own],
  ]),
  ...spice([
    ["Cassia", ["cassia bark", "cassia cinnamon", "chinese cinnamon", "cinnamomum cassia", "dalchini (cassia)"], "Coarse common cinnamon", "The cinnamon most sold in the US and Asia, used in baking and curries.", "",
      "High in coumarin: heavy daily use (for example spoonfuls in supplements) can exceed the EFSA tolerable intake; Ceylon cinnamon has far less.", ["Baking", "Curries", "Chai"], 86, { refs: [COUMARIN_EFSA] }],
    ["Mahlab", ["mahleb", "mahaleb cherry", "prunus mahaleb", "mahlepi"], "Cherry-stone kernel spice", "Ground kernels flavour Greek, Turkish and Middle Eastern breads and pastries.", "", SMALL, ["Tsoureki", "Ka'ak"], 92],
    ["Amchur", ["amchoor", "dry mango powder", "mango powder", "aamchur"], "Sour dried green-mango powder", "Adds tang to chaat, chana masala and stuffed vegetables.", "", SMALL, ["Chaat", "Chana masala"], 94],
    ["Stone Flower", ["kalpasi", "dagad phool", "black stone flower", "parmotrema perlatum"], "Earthy dried lichen spice", "Used in Chettinad and Maharashtrian masalas such as goda masala.", "", SMALL, ["Chettinad masala", "Goda masala"], 92],
    ["Marathi Moggu", ["marati moggu", "kapok buds", "ceiba pentandra buds"], "Dried kapok flower bud", "Used in Chettinad and Bisi bele bath masalas.", "", SMALL, ["Chettinad masala", "Bisi bele bath"], 92],
    ["Radhuni", ["wild celery seed", "trachyspermum roxburghianum", "randhuni"], "Celery-like Bengali seed spice", "Used in Bengali panch phoron variants and dals.", "", SMALL, ["Dals", "Bengali curries"], 92],
    ["Black Cumin", ["shahi jeera", "kala jeera", "bunium persicum", "royal cumin"], "Sweeter dark cumin", "Used in biryanis, garam masala and Kashmiri dishes.", "", SMALL, ["Biryani", "Garam masala"], 92],
    ["Fingerroot", ["krachai", "kra chai", "temu kunci", "boesenbergia rotunda", "chinese ginger"], "Finger-shaped Thai rhizome", "Used in Thai fish curries and jungle curries.", "", SMALL, ["Thai curries"], 94],
    ["Kencur", ["aromatic ginger", "sand ginger", "kaempferia galanga", "cekur"], "Camphor-scented rhizome", "Used in Indonesian beras kencur drink and sambals.", "", SMALL, ["Beras kencur", "Sambal"], 94],
    ["Zedoary", ["white turmeric", "kachur", "amba haldi", "curcuma zedoaria"], "Bitter white-fleshed turmeric relative", "Pickled or used fresh in Indian and Indonesian cooking.", "", SMALL, ["Pickles"], 94],
    ["Mango Ginger", ["amba haldi (mango ginger)", "curcuma amada", "mavinakayi shunti"], "Rhizome with a raw-mango aroma", "Pickled fresh in South India.", "", SMALL, ["Pickles"], 94],
    ["Grains of Selim", ["xylopia aethiopica", "selim pepper", "kani pepper", "uda"], "Smoky West African pod spice", "Used in Senegalese café Touba and West African pepper soup.", "", SMALL, ["Pepper soup", "Café Touba"], 92],
    ["Korarima", ["ethiopian cardamom", "false cardamom", "aframomum corrorima"], "Ethiopian cardamom", "Used in berbere and mitmita blends and coffee.", "", SMALL, ["Berbere", "Coffee"], 92],
    ["Gochugaru", ["korean chilli flakes", "korean red pepper powder", "gochu garu"], "Mild sweet Korean chilli flakes", "Used in kimchi, stews and gochujang.", "", SMALL, ["Kimchi", "Stews"], 92],
    ["Aleppo Pepper", ["pul biber", "halaby pepper", "aleppo chilli"], "Fruity semi-dried chilli flakes", "Sprinkled on kebabs, eggs and salads.", "", SMALL, ["Kebabs", "Dips"], 92],
    ["Urfa Biber", ["isot pepper", "urfa pepper", "urfa chilli"], "Smoky dark Turkish chilli flakes", "Used on meats, dips and salads.", "", SMALL, ["Kebabs", "Dips"], 92],
    ["Espelette Pepper", ["piment d'espelette", "espelette chilli"], "Mild Basque chilli powder", "Used in Basque cooking and on charcuterie.", "", SMALL, ["Basque dishes"], 92],
    ["Chipotle", ["chipotle pepper", "chipotle chilli", "chipotle powder", "smoked jalapeño"], "Smoke-dried jalapeño", "Ground or in adobo sauce for Mexican dishes.", "", SMALL, ["Salsas", "Marinades"], 92],
    ["Piri Piri", ["peri peri", "african bird's eye chilli", "pili pili"], "Small very hot African chilli", "Used in piri-piri sauces and marinades.", "", "Very pungent (capsaicin).", ["Piri-piri chicken", "Hot sauces"], 90],
    ["Mustard Powder", ["ground mustard", "english mustard powder", "dry mustard", "mustard flour"], "Ground mustard seed", "Used in dressings, sauces, pickles and as a mustard base.", "", "Mustard is a declarable allergen in the EU.", ["Dressings", "Pickles", "Sauces"], 90],
    ["Wattleseed", ["acacia seed", "wattle seed", "acacia victoriae seed"], "Roasted Australian acacia seed", "Ground into coffee-like flavouring for desserts and bread.", "", SMALL, ["Desserts", "Bread"], 92],
    ["Tasmanian Pepperberry", ["mountain pepper", "pepperberry", "tasmannia lanceolata"], "Hot native Australian berry", "Used ground like pepper.", "", SMALL, ["Seasonings"], 92],
  ], "own"),
  ...blend([
    ["Garam Masala", ["garam masala powder", "gorom moshla"], "Warm North Indian spice blend", "Cardamom, cinnamon, cloves, cumin, pepper and more, added at the end of cooking.", "", "", ["Curries", "Biryani"], 92],
    ["Chaat Masala", ["chat masala"], "Tangy salty spice blend", "Amchur, cumin, black salt and chilli sprinkled on chaat and fruit.", "", "Contains black salt, so it adds sodium.", ["Chaat", "Fruit salad"], 86],
    ["Panch Phoron", ["panch phoran", "bengali five spice", "pach phoron"], "Bengali whole five-seed mix", "Fenugreek, nigella, cumin, mustard and fennel seeds tempered in oil.", "", "", ["Dals", "Bengali vegetables"], 94],
    ["Sambar Powder", ["sambar masala", "sambhar powder"], "South Indian lentil-stew spice blend", "Roasted coriander, chillies, fenugreek, cumin and lentils for sambar.", "", "", ["Sambar"], 92],
    ["Rasam Powder", ["rasam podi", "saathamudhu podi"], "Peppery South Indian soup spice", "Pepper, cumin, coriander and chillies ground for rasam.", "", "", ["Rasam"], 92],
    ["Goda Masala", ["kala masala", "maharashtrian goda masala"], "Sweet smoky Maharashtrian blend", "Roasted coconut, sesame and spices for amti and masale bhat.", "", "", ["Amti", "Masale bhat"], 92],
    ["Za'atar", ["zaatar", "zahtar", "za atar"], "Thyme, sumac and sesame blend", "Mixed with olive oil on manakish bread and dips.", "", "Contains sesame, a declarable allergen; some blends add salt.", ["Manakish", "Dips"], 90],
    ["Ras el Hanout", ["ras al hanout", "ras-el-hanout"], "Moroccan 'head of the shop' blend", "A complex mix of up to dozens of spices for tagines and couscous.", "", "", ["Tagines", "Couscous"], 92],
    ["Baharat", ["bahārāt", "arabic seven spice", "seven spice"], "Middle Eastern all-purpose blend", "Pepper, allspice, cinnamon, cloves and cumin for meats and rice.", "", "", ["Kebabs", "Rice dishes"], 92],
    ["Berbere", ["berbere spice", "ethiopian berbere"], "Hot Ethiopian chilli blend", "Chilli, fenugreek, korarima and other spices for wat stews.", "", "", ["Doro wat", "Misir wat"], 92],
    ["Dukkah", ["duqqa", "dukka", "egyptian dukkah"], "Egyptian nut, seed and spice mix", "Hazelnuts, sesame, coriander and cumin, eaten with bread and oil.", "", "Contains tree nuts and sesame (declarable allergens).", ["Bread dips", "Salads"], 90],
    ["Chinese Five Spice", ["five spice powder", "five-spice", "wu xiang fen"], "Star anise-led Chinese blend", "Star anise, cloves, cassia, Sichuan pepper and fennel for roast meats.", "", "", ["Char siu", "Roast duck"], 92],
    ["Shichimi Togarashi", ["shichimi", "japanese seven spice", "nanami togarashi"], "Japanese seven-spice chilli mix", "Chilli, sansho, orange peel, sesame and nori sprinkled on noodles.", "", "Contains sesame (a declarable allergen).", ["Udon", "Yakitori"], 92],
    ["Herbes de Provence", ["provencal herbs", "herbes de provence blend"], "Dried southern French herb mix", "Thyme, savory, rosemary, oregano and sometimes lavender for grills and stews.", "", "", ["Grilled meats", "Ratatouille"], 94],
    ["Italian Seasoning", ["italian herbs", "italian herb seasoning"], "Dried Italian herb mix", "Oregano, basil, thyme, rosemary and marjoram for sauces and pizza.", "", "", ["Pasta sauce", "Pizza"], 94],
    ["Mixed Spice", ["pudding spice", "british mixed spice"], "British sweet baking spice", "Cinnamon, nutmeg, allspice, cloves and ginger for cakes and puddings.", "", "", ["Christmas pudding", "Hot cross buns"], 94],
  ], "own"),
];
