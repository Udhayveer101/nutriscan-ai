// Expansion batch 30 — Pool 6: more fruit (berries, citrus, tropical and regional fruit).
// Tropical species are sourced to Morton's Fruits of Warm Climates; species with a USDA
// FoodData Central entry cite it; the rest cite the fruit-and-vegetable meta-analysis only.
import type { SeedIngredient, SeedRef } from "./types";
import { AUNE_FV } from "./whole";
import { fdc } from "./refs";
import { fruit } from "./batch-12";

export const MORTON: SeedRef = { title: "Fruits of Warm Climates", authors: "Morton JF", journal: "Julia F. Morton, Miami, FL (Purdue University NewCROP online edition)", year: 1987,
  url: "https://hort.purdue.edu/newcrop/morton/index.html", findings: "Describes the botany, composition and food uses of tropical and subtropical fruits." };
const F = (n: string) => fdc(`Nutrient composition entry for ${n.toLowerCase()}.`);
const own = { src: "own" as const };
const morton = { src: "own" as const, refs: [AUNE_FV, MORTON] };
const fdcRef = (n: string) => ({ src: "own" as const, refs: [AUNE_FV, F(n)] });
const GOOD = "Fibre, vitamin C and polyphenols.";

export const BATCH_30: SeedIngredient[] = [
  ...fruit([
    // Berries and temperate fruit
    ["Açaí Berry", ["acai", "açaí", "acai berry", "acai puree", "euterpe oleracea"], "Purple Amazonian palm berry", "Frozen pulp or powder used in smoothie bowls and drinks.", "Anthocyanins and fibre; unusually high in fat for a fruit.", "None for the fruit. Bowls and drinks are often heavily sweetened.", ["Acai bowls", "Smoothies", "Juices"], 90, morton],
    ["Goji Berry", ["goji", "goji berries", "wolfberry", "lycium barbarum", "gou qi zi"], "Dried red Chinese berry", "Dried berries eaten as a snack and in trail mixes and teas.", "Carotenoids (zeaxanthin) and fibre.", "May interact with warfarin (case reports). Dried berries are often sulphited.", ["Trail mix", "Snack bars", "Teas"], 88, fdcRef("Goji berries, dried")],
    ["Sea Buckthorn", ["sea buckthorn berries", "seabuckthorn", "hippophae rhamnoides", "sallow thorn"], "Tart orange berry", "Juiced or made into purée, jam and drinks; the oil is used in supplements.", "Very high in vitamin C and carotenoids.", "None at food amounts.", ["Juices", "Jams", "Supplements"], 92, own],
    ["Aronia Berry", ["aronia", "chokeberry", "black chokeberry", "aronia melanocarpa"], "Astringent dark berry", "Juiced and dried; added to jams, teas and smoothies.", "One of the richest fruit sources of anthocyanins.", "None.", ["Juices", "Jams", "Teas"], 94, own],
    ["Bilberry", ["bilberries", "european blueberry", "whortleberry", "vaccinium myrtillus"], "Wild European blueberry", "Eaten fresh, in jams and pies; extracts are sold as supplements.", "Anthocyanin-rich berry.", "None.", ["Jams", "Pies", "Supplements"], 94, own],
    ["Huckleberry", ["huckleberries", "vaccinium membranaceum"], "Wild North American berry", "Used in jams, pies and syrups.", "", "None.", ["Jams", "Pies", "Syrups"], 94, own],
    ["Haskap Berry", ["haskap", "honeyberry", "honeysuckle berry", "lonicera caerulea"], "Elongated blue honeysuckle berry", "Eaten fresh or in jams, juices and baking.", "Anthocyanin-rich.", "None.", ["Jams", "Juices"], 94, own],
    ["White Currant", ["white currants", "ribes rubrum white"], "Pale variety of redcurrant", "Used fresh, in jellies and desserts.", GOOD, "None.", ["Jellies", "Desserts"], 95, fdcRef("Currants, red and white, raw")],
    ["Sloe", ["sloes", "blackthorn fruit", "sloe berries", "prunus spinosa"], "Very astringent wild plum", "Used to flavour sloe gin, jams and jellies.", "", "Raw sloes are too astringent to eat; the stones contain amygdalin and should not be crushed.", ["Sloe gin", "Jams"], 90, own],
    ["Mirabelle Plum", ["mirabelle", "mirabelles", "mirabelle de nancy"], "Small yellow plum", "Eaten fresh, in tarts, jams and fruit brandy.", "", "None.", ["Tarts", "Jams", "Fruit brandy"], 95, own],
    ["Medlar", ["medlars", "mespilus germanica"], "Brown fruit eaten bletted (over-ripe)", "Eaten soft after bletting, or made into medlar jelly.", "", "None.", ["Medlar jelly"], 94, own],
    ["Asian Pear", ["asian pears", "nashi", "nashi pear", "sand pear", "pyrus pyrifolia"], "Crisp round pear", "Eaten fresh; grated into Korean marinades.", "", "None.", ["Korean marinades", "Fruit salads"], 96, fdcRef("Pears, asian, raw")],
    ["Muscadine Grape", ["muscadine", "muscadines", "scuppernong", "vitis rotundifolia"], "Thick-skinned American grape", "Eaten fresh or made into juice, jelly and wine.", "Skin and seeds are rich in polyphenols.", "None.", ["Jellies", "Juices"], 94, fdcRef("Grapes, muscadine, raw")],
    ["Rowan Berries", ["rowan", "rowanberries", "sorbus aucuparia", "mountain ash berries"], "Bitter orange berry", "Cooked into rowan jelly to serve with game.", "", "Raw berries contain parasorbic acid, which cooking breaks down; eat cooked only.", ["Rowan jelly"], 88, own],
    ["Serviceberry", ["serviceberries", "saskatoon berry", "saskatoons", "juneberry", "amelanchier"], "Sweet blue-purple berry", "Eaten fresh, in pies, jams and pemmican.", "", "None.", ["Pies", "Jams"], 95, fdcRef("Serviceberries, raw")],
    ["Barberry", ["barberries", "zereshk", "berberis vulgaris", "dried barberries"], "Tart dried red berry", "Dried berries scattered over Persian rice dishes (zereshk polo).", "", "None at culinary amounts. Concentrated berberine supplements made from the root are a different matter.", ["Zereshk polo", "Rice dishes"], 92, own],
    ["Dewberry", ["dewberries", "rubus caesius"], "Trailing wild blackberry relative", "Eaten fresh, in pies and jams.", "", "None.", ["Pies", "Jams"], 95, own],
    ["Salmonberry", ["salmonberries", "rubus spectabilis"], "Orange-red Pacific raspberry", "Eaten fresh or in jams; a traditional Alaska Native food.", "", "None.", ["Jams"], 95, fdcRef("Salmonberries, raw (Alaska Native)")],
    ["Crowberry", ["crowberries", "empetrum nigrum"], "Small black Arctic berry", "Eaten fresh or mixed into akutaq and preserves.", "", "None.", ["Preserves"], 94, fdcRef("Crowberries, raw (Alaska Native)")],
    ["Tayberry", ["tayberries"], "Blackberry–raspberry cross", "Eaten fresh, in jams and desserts.", "", "None.", ["Jams", "Desserts"], 95, own],
    ["Jostaberry", ["jostaberries", "josta"], "Blackcurrant–gooseberry cross", "Eaten fresh, in jams and pies.", "", "None.", ["Jams", "Pies"], 95, own],
    ["Wineberry", ["wineberries", "japanese wineberry", "rubus phoenicolasius"], "Sticky red wild raspberry", "Eaten fresh or in jams.", "", "None.", ["Jams"], 95, own],
    ["Cornelian Cherry", ["cornelian cherries", "cornus mas", "dogwood cherry"], "Tart red dogwood fruit", "Made into jams, syrups and Persian and Turkish sour drinks.", "", "None.", ["Jams", "Syrups"], 94, own],
    ["Sour Cherry", ["sour cherries", "morello cherry", "morello cherries", "tart cherry", "tart cherries", "montmorency cherry", "prunus cerasus"], "Tart cooking cherry", "Used in pies, jams, juice concentrates and dried.", "Anthocyanin-rich.", "None for the fruit; tart cherry juice concentrate counts as free sugar.", ["Pies", "Juices", "Dried fruit"], 95, fdcRef("Cherries, sour, red, raw")],
    ["Kiwiberry", ["kiwiberries", "hardy kiwi", "baby kiwi", "actinidia arguta"], "Grape-sized smooth kiwi", "Eaten whole, skin and all.", "High in vitamin C.", "Can cross-react with kiwi allergy.", ["Snacks", "Fruit salads"], 94, own],
    // Citrus
    ["Yuzu", ["yuzu juice", "yuzu zest", "citrus junos"], "Aromatic Japanese citrus", "Juice and zest flavour ponzu, desserts and drinks.", "Vitamin C.", "None.", ["Ponzu", "Desserts", "Drinks"], 95, own],
    ["Calamansi", ["kalamansi", "calamondin", "philippine lime", "citrofortunella microcarpa"], "Small sour Philippine citrus", "Juice used in drinks, marinades and as a condiment.", "Vitamin C.", "None.", ["Juices", "Marinades"], 95, morton],
    ["Citron", ["citrons", "citrus medica", "etrog", "cedro"], "Thick-rinded ancestral citrus", "The rind is candied for baking; little juice.", "", "None for the fruit; candied peel is high in sugar.", ["Candied peel", "Fruitcake"], 92, morton],
    ["Finger Lime", ["finger limes", "caviar lime", "citrus australasica"], "Australian citrus with caviar-like pearls", "Pulp vesicles garnish seafood, desserts and drinks.", "", "None.", ["Garnishes", "Seafood dishes"], 95, own],
    ["Buddha's Hand", ["buddhas hand", "fingered citron", "citrus medica var. sarcodactylis"], "Fingered fragrant citron", "Zest and candied rind are used for aroma.", "", "None.", ["Candied peel", "Infusions"], 94, own],
    ["Blood Orange", ["blood oranges", "moro orange", "tarocco orange", "sanguinello"], "Red-fleshed sweet orange", "Eaten fresh and juiced; anthocyanins give the red flesh.", "Vitamin C and anthocyanins.", "None.", ["Juices", "Salads", "Desserts"], 96, own],
    ["Seville Orange", ["seville oranges", "bitter orange fruit", "sour orange", "citrus aurantium fruit"], "Bitter marmalade orange", "Used for marmalade and in Cuban and Yucatán marinades.", "", "None for the fruit at food amounts. Concentrated bitter-orange extracts (synephrine) used in weight-loss supplements are a different matter.", ["Marmalade", "Marinades"], 92, morton],
    ["Bergamot Orange", ["bergamot fruit", "citrus bergamia"], "Aromatic Calabrian citrus", "Juice and zest flavour sweets; the peel oil scents Earl Grey tea.", "", "Peel oil is photosensitising on skin; no concern from the fruit as food.", ["Earl Grey tea", "Marmalade"], 94, own],
    // Tropical and subtropical
    ["Tamarillo", ["tamarillos", "tree tomato", "solanum betaceum"], "Egg-shaped tangy tree tomato", "Eaten scooped, in chutneys, sauces and juices.", "Vitamin C, vitamin A and fibre.", "None.", ["Chutneys", "Juices"], 94, morton],
    ["Salak", ["snake fruit", "salacca zalacca", "salak pondoh"], "Scaly-skinned Indonesian palm fruit", "Eaten fresh or candied.", "", "None.", ["Fresh fruit", "Candied fruit"], 94, morton],
    ["Jabuticaba", ["jaboticaba", "brazilian grape tree", "plinia cauliflora"], "Grape-like fruit growing on the trunk", "Eaten fresh, in jellies, wine and liqueurs.", "Anthocyanins in the skin.", "None.", ["Jellies", "Liqueurs"], 94, morton],
    ["Cupuaçu", ["cupuacu", "cupuassu", "theobroma grandiflorum"], "Amazonian cacao relative", "Pulp used in juices, ice cream and sweets; seeds make a chocolate-like product.", "", "None.", ["Juices", "Ice cream"], 94, own],
    ["Lucuma", ["lucuma powder", "lúcuma", "pouteria lucuma", "eggfruit (lucuma)"], "Maple-flavoured Andean fruit", "Dried powder flavours ice cream, smoothies and desserts.", "Fibre and carotenoids.", "None.", ["Ice cream", "Smoothies"], 92, own],
    ["Camu Camu", ["camu camu powder", "myrciaria dubia"], "Very sour Amazonian berry", "Dried powder used as a vitamin C source in smoothies and supplements.", "Among the richest natural sources of vitamin C.", "None at food amounts.", ["Supplements", "Smoothies"], 92, own],
    ["Maqui Berry", ["maqui", "maqui powder", "aristotelia chilensis"], "Dark Chilean berry", "Freeze-dried powder used in drinks and smoothies.", "Very high in anthocyanins.", "None.", ["Powders", "Smoothies"], 92, own],
    ["Bilimbi", ["bilimbi fruit", "averrhoa bilimbi", "tree sorrel", "irumban puli"], "Very sour cucumber-shaped fruit", "Used in Keralan fish curries, pickles and chutneys.", "", "Very high in oxalic acid: case reports link large amounts of bilimbi juice to acute kidney injury. Culinary use is safe.", ["Fish curries", "Pickles"], 82, morton],
    ["Star Gooseberry", ["otaheite gooseberry", "harfarauri", "phyllanthus acidus", "country gooseberry"], "Sour ribbed berry", "Eaten with salt and chilli, pickled or made into preserves.", "", "None at culinary amounts.", ["Pickles", "Preserves"], 92, morton],
    ["Ice Apple", ["tadgola", "nungu", "toddy palm fruit", "palmyra fruit", "borassus flabellifer"], "Jelly-like palmyra palm kernel", "Translucent kernels eaten fresh in summer in South India.", "Hydrating and low in calories.", "None.", ["Fresh fruit", "Summer desserts"], 95, own],
    ["Cashew Apple", ["cashew fruit", "caju", "anacardium occidentale fruit"], "Fleshy stalk of the cashew nut", "Juiced, made into feni (Goa) and preserves.", "Very high in vitamin C.", "Astringent raw; cashew-allergic people may react.", ["Juices", "Feni", "Preserves"], 90, morton],
    ["Langsat", ["lanzones", "duku", "langsat fruit", "lansium parasiticum"], "Clustered translucent Southeast Asian fruit", "Eaten fresh.", "", "The bitter seeds should not be eaten.", ["Fresh fruit"], 94, morton],
    ["Santol", ["cotton fruit", "sandoricum koetjape", "kechapi"], "Sweet-sour Southeast Asian fruit", "Eaten fresh, candied or cooked in curries.", "", "Swallowed seeds have caused bowel perforation; do not swallow them.", ["Candied fruit", "Curries"], 90, morton],
    ["Marang", ["artocarpus odoratissimus", "johey oak", "tarap"], "Fragrant breadfruit relative", "Sweet white pulp eaten fresh in Borneo and the Philippines.", "", "None.", ["Fresh fruit"], 94, morton],
    ["Pulasan", ["pulasan fruit"], "Sweet rambutan relative", "Eaten fresh.", "", "None.", ["Fresh fruit"], 95, morton],
    ["Wax Apple", ["jambu air", "java apple", "bell fruit", "syzygium samarangense"], "Crisp bell-shaped fruit", "Eaten fresh, often with salt or chilli.", "Hydrating and low in calories.", "None.", ["Fresh fruit", "Salads"], 95, morton],
    ["Rose Apple", ["rose apples", "jambos", "syzygium jambos"], "Rose-scented crisp fruit", "Eaten fresh or made into preserves.", "", "The seeds are reported to be toxic; eat the flesh only.", ["Preserves", "Fresh fruit"], 92, { src: "own" as const, refs: [AUNE_FV, MORTON, F("Rose-apples, raw")] }],
    ["Surinam Cherry", ["pitanga", "brazilian cherry", "eugenia uniflora"], "Ribbed tart cherry", "Eaten fresh, in juices, jams and sorbets.", "Vitamin C and carotenoids.", "None.", ["Juices", "Jams"], 95, { src: "own" as const, refs: [AUNE_FV, MORTON, F("Pitanga (surinam-cherry), raw")] }],
    ["Strawberry Guava", ["cattley guava", "cherry guava", "psidium cattleianum"], "Small red guava", "Eaten fresh, in jams and jellies.", "Vitamin C.", "None.", ["Jams", "Jellies"], 95, { src: "own" as const, refs: [AUNE_FV, MORTON, F("Guavas, strawberry, raw")] }],
    ["Pepino Melon", ["pepino", "pepino dulce", "melon pear", "solanum muricatum"], "Mild melon-like nightshade fruit", "Eaten fresh.", "", "None.", ["Fresh fruit"], 95, morton],
    ["Babaco", ["babaco fruit", "vasconcellea heilbornii", "champagne fruit"], "Seedless Andean papaya relative", "Eaten fresh, juiced or in desserts.", "", "Contains papain; latex-allergic people may react.", ["Juices", "Desserts"], 94, morton],
    ["Marula", ["marula fruit", "sclerocarya birrea"], "Southern African plum-like fruit", "Eaten fresh, made into jelly, beer and the cream liqueur Amarula.", "Very high in vitamin C.", "None.", ["Jelly", "Liqueur"], 94, own],
    ["Mamoncillo", ["spanish lime", "quenepa", "genip", "melicoccus bijugatus"], "Green-skinned Caribbean fruit", "The tangy pulp is sucked off the seed.", "", "Choking hazard for children because of the large seed.", ["Fresh fruit"], 94, morton],
    ["Black Sapote", ["chocolate pudding fruit", "diospyros nigra", "zapote negro"], "Persimmon relative with dark custardy pulp", "Ripe pulp used in desserts and smoothies.", "Vitamin C.", "Unripe fruit is bitter and irritating; eat only when very soft.", ["Desserts", "Smoothies"], 94, morton],
    ["White Sapote", ["casimiroa edulis", "mexican apple", "zapote blanco"], "Creamy custard-like fruit", "Eaten fresh.", "", "The seeds are sedative and should not be eaten.", ["Fresh fruit"], 92, morton],
    ["Canistel", ["egg fruit", "eggfruit", "pouteria campechiana", "yellow sapote"], "Yolk-textured yellow fruit", "Used in milkshakes, custards and baking.", "Carotenoids.", "None.", ["Milkshakes", "Custards"], 94, morton],
    ["Abiu", ["pouteria caimito", "caimito"], "Sweet caramel-flavoured fruit", "Eaten fresh.", "", "Skin latex is sticky; eat the flesh.", ["Fresh fruit"], 95, morton],
    ["Atemoya", ["atemoyas", "custard apple hybrid"], "Cherimoya–sugar apple hybrid", "Eaten fresh.", "", "Seeds are toxic if crushed; do not eat them.", ["Fresh fruit"], 94, morton],
    ["Bullock's Heart", ["ramphal", "annona reticulata", "netted custard apple", "bullocks heart"], "Reddish custard apple", "Eaten fresh.", "", "Seeds are toxic if crushed; do not eat them.", ["Fresh fruit"], 94, morton],
    ["Lakoocha", ["monkey jack", "barhal", "artocarpus lacucha", "dheu"], "Small jackfruit relative", "Eaten fresh, pickled or cooked in curries and chutneys in eastern India.", "", "None.", ["Chutneys", "Curries", "Pickles"], 94, morton],
    ["Champedak", ["cempedak", "artocarpus integer"], "Smaller, sweeter jackfruit relative", "Eaten fresh or fried in batter.", "", "None for the fruit; fritters are fried.", ["Fresh fruit", "Fritters"], 94, own],
    ["Banana Passionfruit", ["banana passion fruit", "passiflora tarminiana", "curuba", "taxo"], "Elongated Andean passionfruit", "Pulp used in juices and desserts.", "", "None.", ["Juices", "Desserts"], 95, own],
    ["Kokum", ["kokam", "garcinia indica", "kokum rind", "amsul", "bhirand"], "Sour purple Konkan fruit", "Dried rind sours Goan and Konkani curries and the sol kadhi drink.", "", "None at culinary amounts.", ["Sol kadhi", "Fish curries", "Sherbets"], 94, own],
  ]),
];
