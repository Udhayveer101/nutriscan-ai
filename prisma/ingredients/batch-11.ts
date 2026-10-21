// Expansion batch 11 — Pool 6: culinary herbs, roots and spice blends.
import type { SeedIngredient, SeedRef } from "./types";
import { wholeFoods } from "./whole";
import { euFlavourings } from "./refs";
import { SPICE_RISK, ISO676 } from "./batch-10";

const ESTRAGOLE: SeedRef = { title: "Opinion of the Scientific Committee on Food on Estragole (1-Allyl-4-methoxybenzene)", authors: "Scientific Committee on Food (European Commission)", journal: "SCF opinions", year: 2001,
  findings: "Estragole is genotoxic and carcinogenic in rodents; exposure should be reduced, though the contribution from culinary herbs is small." };
const VITK: SeedRef = { title: "Warfarin (drug information)", authors: "U.S. National Library of Medicine", journal: "MedlinePlus Drug Information", year: 2023, url: "https://medlineplus.gov/druginfo/meds/a682277.html",
  findings: "People on warfarin should keep their intake of vitamin K-rich foods, such as leafy green vegetables, consistent." };

const SMALL = "None at culinary amounts.";
const herb = wholeFoods("spice-herb", {
  refs: [],
  benefits: "Adds flavour and aroma without salt or sugar; used in amounts too small to matter nutritionally.",
  concerns: SMALL,
});
const dried = { refs: [SPICE_RISK] };

export const BATCH_11: SeedIngredient[] = [
  ...herb([
    ["Basil", ["sweet basil", "basil leaves", "dried basil", "fresh basil"], "Sweet, peppery leafy herb", "Fresh or dried leaves of Ocimum basilicum used in pesto, tomato sauces and salads.", "",
      "None at culinary amounts. Contains estragole, which is genotoxic in rodents at high doses; the amount in food use is small.", ["Pesto", "Pasta sauce", "Pizza"], 92, { refs: [ESTRAGOLE] }],
    ["Bay Leaf", ["bay leaves", "laurel leaf", "laurus nobilis"], "Aromatic leaf for slow cooking", "Dried leaves of Laurus nobilis simmered in stocks, stews and rice, then removed.", "",
      "Whole leaves stay stiff and sharp after cooking; swallowed pieces can lodge in the throat or gut, so remove them before serving.", ["Stocks", "Stews", "Biryani"], 90, dried],
    ["Oregano", ["dried oregano", "origanum vulgare", "wild marjoram"], "Pungent Mediterranean herb", "Dried leaves of Origanum vulgare used on pizza, in tomato sauces and Greek cooking.", "", SMALL, ["Pizza", "Tomato sauce", "Seasoning blends"], 92, dried],
    ["Thyme", ["dried thyme", "fresh thyme", "thymus vulgaris"], "Earthy woody herb", "Leaves of Thymus vulgaris used in stocks, roasts, stuffings and za'atar.", "", SMALL, ["Stuffing", "Stocks", "Roast seasonings"], 92, dried],
    ["Rosemary", ["rosemary leaves", "fresh rosemary", "dried rosemary", "rosmarinus officinalis"], "Resinous needle-leaved herb", "Leaves of Salvia rosmarinus used with roast meat, potatoes and breads. (Rosemary extract, E392, is a separate antioxidant additive.)", "", SMALL, ["Focaccia", "Roast potatoes", "Lamb dishes"], 92, dried],
    ["Sage", ["sage leaves", "dried sage", "salvia officinalis", "rubbed sage"], "Savoury, slightly bitter herb", "Leaves of Salvia officinalis used in stuffings, sausages and brown-butter sauces.", "",
      "None at culinary amounts. Sage contains thujone, a neurotoxin at high doses; the EU caps thujone in foods made with sage preparations.", ["Stuffing", "Sausages", "Saltimbocca"], 88,
      { refs: [SPICE_RISK, euFlavourings("Annex III sets maximum levels of thujone in foods containing sage preparations.")] }],
    ["Marjoram", ["sweet marjoram", "origanum majorana"], "Mild, sweet oregano relative", "Leaves of Origanum majorana used in sausages, stuffings and herb blends.", "", SMALL, ["Sausages", "Herbes de Provence"], 92, dried],
    ["Tarragon", ["french tarragon", "estragon", "artemisia dracunculus"], "Anise-flavoured herb", "Leaves of Artemisia dracunculus used in béarnaise sauce, mustards and vinegars.", "",
      "None at culinary amounts. Tarragon is naturally high in estragole, which is genotoxic in rodents at high doses.", ["Béarnaise", "Dijon mustard", "Tarragon vinegar"], 88, { refs: [ESTRAGOLE] }],
    ["Parsley", ["flat-leaf parsley", "curly parsley", "parsley leaves", "dried parsley", "petroselinum crispum"], "Fresh, grassy leafy herb", "Leaves of Petroselinum crispum used fresh or dried as garnish and in sauces, tabbouleh and stocks.", "Rich in vitamin K and vitamin C when eaten in quantity, as in tabbouleh.",
      "Very high in vitamin K; people on warfarin should keep intake consistent.", ["Tabbouleh", "Chimichurri", "Garnish"], 92, { refs: [VITK] }],
    ["Coriander Leaves", ["cilantro", "fresh coriander", "coriander leaf", "dhania leaves", "hara dhania"], "Bright, citrusy leafy herb", "Fresh leaves of Coriandrum sativum used in salsas, curries, chutneys and Asian dishes.", "Contributes vitamin K, vitamin A and vitamin C when used generously.",
      "None. A soapy taste in some people is genetic (an olfactory receptor variant), not a safety issue.", ["Salsa", "Green chutney", "Curries"], 94],
    ["Dill", ["dill weed", "fresh dill", "dill leaves", "anethum graveolens"], "Feathery anise-like herb", "Leaves of Anethum graveolens used with fish, potatoes, yoghurt and pickles.", "", SMALL, ["Gravlax", "Tzatziki", "Pickles"], 92],
    ["Chives", ["chopped chives", "allium schoenoprasum"], "Mild onion-flavoured herb", "Hollow leaves of Allium schoenoprasum used fresh on potatoes, eggs and dips.", "", SMALL, ["Sour cream dips", "Omelettes", "Potato salad"], 94],
    ["Spearmint", ["mint leaves", "fresh mint", "dried mint", "pudina", "spearmint leaves", "mentha spicata"], "Sweet, cooling mint herb", "Leaves of Mentha spicata, the usual culinary 'mint', used in chutneys, sauces, salads and teas.", "",
      "None at culinary amounts. Mint flavourings and oils are separate ingredients.", ["Mint sauce", "Mint chutney", "Tabbouleh"], 94],
    ["Peppermint Leaves", ["peppermint leaf", "dried peppermint", "peppermint tea leaves", "mentha piperita"], "Strongly menthol mint leaf", "Leaves of Mentha × piperita used mainly in herbal teas and confectionery.", "",
      "None at culinary amounts. Can worsen heartburn (relaxes the lower oesophageal sphincter).", ["Peppermint tea", "Confectionery"], 92],
    ["Chervil", ["dried chervil", "anthriscus cerefolium"], "Delicate anise-parsley herb", "Leaves of Anthriscus cerefolium used in French fines herbes, soups and egg dishes.", "", SMALL, ["Fines herbes", "Soups"], 92, dried],
    ["Lemongrass", ["lemon grass", "cymbopogon citratus", "citronella grass"], "Lemon-scented grass stalk", "Stalks of Cymbopogon citratus used in Thai curries, soups and teas.", "", SMALL, ["Thai curry paste", "Tom yum", "Herbal tea"], 94],
    ["Curry Leaves", ["curry leaf", "kadi patta", "kari patta", "murraya koenigii"], "Aromatic leaf of South Indian cooking", "Fresh leaves of Murraya koenigii fried in oil for tempering dals, chutneys and snacks.", "", SMALL, ["Sambar", "Poha", "Chivda"], 94, { src: "ifct" }],
    ["Fenugreek Leaves", ["methi leaves", "kasuri methi", "dried fenugreek leaves", "methi"], "Bitter leafy herb used fresh or dried", "Fresh leaves cooked as a vegetable; dried leaves (kasuri methi) crumbled into curries and breads.", "Fresh leaves are a good source of iron, folate and vitamin K.",
      "Can cross-react in peanut-allergic people.", ["Methi thepla", "Butter chicken", "Aloo methi"], 92, { src: "ifct" }],
    ["Wasabi Root", ["wasabi", "real wasabi", "wasabia japonica", "eutrema japonicum"], "Pungent Japanese rhizome", "Grated rhizome of Eutrema japonicum served with sushi. Most 'wasabi' paste outside Japan is horseradish and mustard coloured green.", "",
      "None at condiment amounts; pungent isothiocyanates can irritate. Check imitation pastes for colours.", ["Sushi", "Wasabi peas", "Dressings"], 90],
    ["Horseradish", ["horseradish root", "prepared horseradish", "armoracia rusticana"], "Pungent grated root", "Grated root of Armoracia rusticana, usually preserved in vinegar, served with beef and fish.", "",
      "None at condiment amounts; isothiocyanates can irritate the mouth and stomach.", ["Horseradish sauce", "Cocktail sauce", "Imitation wasabi"], 90],
    ["Curry Powder", ["madras curry powder", "curry powder blend"], "Ground spice blend", "A blend typically of coriander, turmeric, cumin, fenugreek, chilli and other spices.", "",
      "None at culinary amounts. Some imported turmeric-based blends have been found adulterated with lead chromate; buy from reputable brands.", ["Curry sauces", "Coronation chicken", "Instant noodles"], 88, dried],
    ["Chilli Powder", ["chili powder", "red chilli powder", "lal mirch", "kashmiri chilli powder"], "Ground dried chillies or a chilli spice blend", "In India, ground dried red chillies; in the US, a blend of ground chillies with cumin, oregano and garlic.", "",
      "Capsaicin can irritate the gut in sensitive people. Poorly sourced chilli powder has been found adulterated with Sudan dyes and contaminated with aflatoxins.", ["Curries", "Chilli con carne", "Snacks"], 86, dried],
    ["Pumpkin Pie Spice", ["pumpkin spice", "pumpkin spice mix"], "Sweet baking spice blend", "Cinnamon, ginger, nutmeg and cloves or allspice, used in pumpkin pie and seasonal drinks.", "", SMALL, ["Pumpkin pie", "Seasonal lattes", "Baked goods"], 92, dried],
    ["Poultry Seasoning", ["poultry seasoning blend"], "Savoury herb blend for stuffing", "A blend of sage, thyme, marjoram, rosemary and pepper.", "", SMALL, ["Stuffing", "Roast chicken", "Gravy"], 92, dried],
    ["Ginger Root", ["fresh ginger", "ginger root", "ground ginger", "dried ginger", "saunth"], "Pungent rhizome used fresh or dried", "Rhizome of Zingiber officinale used fresh in curries and stir-fries and dried in baking and drinks.", "Gingerols give pungency; good trial evidence that ginger reduces nausea, including in pregnancy.",
      "None at culinary amounts. High supplemental doses can cause heartburn.", ["Gingerbread", "Ginger beer", "Curries", "Stir-fries"], 94],
    ["Asafoetida", ["hing", "asafetida", "ferula assa-foetida"], "Pungent dried resin used in tempering", "Dried gum resin from Ferula roots, used in pinches in dals and pickles for an onion-garlic flavour.", "",
      "Commercial hing is compounded with wheat flour (and sometimes gum arabic), so it is not gluten-free unless labelled.", ["Dal", "Sambar", "Pickles"], 88, { src: "own", refs: [ISO676] }],
  ]),
];
