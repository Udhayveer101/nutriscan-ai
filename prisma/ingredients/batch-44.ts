// Expansion batch 44 — Pool 7: more starter and probiotic cultures and food enzymes.
// Strain names follow the 2020 Lactobacillus reclassification (Zheng et al.), with the old
// names kept as aliases because labels still use them.
import type { SeedIngredient, SeedRef } from "./types";
import { family } from "./build";
import { wholeFoods } from "./whole";
import { efsa, euEnzymes, euNovelFoods } from "./refs";

const QPS = efsa("Biological Hazards (BIOHAZ)", "Update of the list of qualified presumption of safety (QPS) recommended microbiological agents intentionally added to food or feed", 2023,
  "Lists bacteria and yeasts with a qualified presumption of safety for use in food, based on body of knowledge and absence of safety concerns.");
const ZHENG: SeedRef = { title: "A taxonomic note on the genus Lactobacillus: description of 23 novel genera", authors: "Zheng J et al.", journal: "International Journal of Systematic and Evolutionary Microbiology 70(4):2782–2858", year: 2020,
  doi: "10.1099/ijsem.0.004107", findings: "Split Lactobacillus into 25 genera (e.g. Lacticaseibacillus, Lactiplantibacillus, Latilactobacillus)." };

const culture = wholeFoods("culture", {
  refs: [QPS], isNatural: true,
  sciConsensus: "A food-grade microorganism used to ferment foods or as a probiotic. Scored as a traditional food component.",
  fdaStatus: "GRAS or traditional use in fermented foods", efsaStatus: "QPS-listed or traditional use", fssaiStatus: "Permitted culture / probiotic (FSSAI 2022)", whoStatus: "No ADI (microorganism)",
  benefits: "Ferments food, adding flavour and preservation; some strains have probiotic evidence.",
  concerns: "None for healthy people. Probiotics should be used with medical advice in severely immunocompromised people.",
});
const enzyme = family({
  categorySlug: "enzyme", evidenceLevel: "MODERATE", isNatural: false, isVegan: true,
  sciConsensus: "A food enzyme used as a processing aid; most are inactivated during processing and do not need to be labelled as ingredients.",
  fdaStatus: "GRAS notice or 21 CFR 184", efsaStatus: "Under evaluation for the EU Union list of food enzymes (Reg. (EC) 1332/2008)", fssaiStatus: "Permitted processing aid", whoStatus: "JECFA: ADI not specified for most food enzymes",
  benefits: "Speeds up a specific reaction (breaking down starch, protein or fat) without chemical additives.",
  concerns: "Can be a respiratory allergen for factory workers; negligible residues in food.", safetyScore: 88,
  refs: [euEnzymes("Food enzymes are being assessed by EFSA for a Union list; until then national rules apply.")],
});

export const BATCH_44: SeedIngredient[] = [
  ...culture([
    ["Latilactobacillus sakei", ["lactobacillus sakei", "l. sakei"], "Meat and vegetable fermentation bacterium", "Starter culture for salami and kimchi.", "", "", ["Salami", "Kimchi"], 92, { refs: [ZHENG] }],
    ["Levilactobacillus brevis", ["lactobacillus brevis", "l. brevis"], "Heterofermentative lactic bacterium", "Found in sauerkraut, pickles and sourdough.", "", "", ["Sauerkraut", "Sourdough"], 92, { refs: [ZHENG] }],
    ["Lactobacillus delbrueckii subsp. lactis", ["lactobacillus delbrueckii", "l. delbrueckii lactis", "lactobacillus lactis"], "Dairy starter bacterium", "Used in cheese starters.", "", "", ["Cheese"], 92],
    ["Bifidobacterium adolescentis", ["b. adolescentis"], "Adult gut bifidobacterium", "Used in some probiotic products.", "", "", ["Probiotics"], 90],
    ["Lactobacillus crispatus", ["l. crispatus"], "Vaginal-health probiotic species", "Used in women's health probiotics.", "", "", ["Women's probiotics"], 90],
    ["Enterococcus faecium", ["e. faecium", "enterococcus faecium sf68"], "Probiotic and cheese bacterium", "Used in some probiotics and cheeses.", "", "Not QPS-listed: some strains carry antibiotic resistance; only safety-assessed strains should be used.", ["Probiotics", "Cheese"], 82],
    ["Streptococcus salivarius K12", ["streptococcus salivarius", "s. salivarius k12", "blis k12"], "Oral probiotic", "Sold in lozenges for mouth and throat health.", "", "", ["Oral probiotics"], 90],
    ["Clostridium butyricum", ["c. butyricum", "clostridium butyricum miyairi"], "Butyrate-producing spore probiotic", "Used in Japanese and Chinese probiotics.", "", "An authorised EU novel food strain (CBM 588); unrelated to C. botulinum.", ["Probiotics"], 86, { refs: [euNovelFoods("Authorises Clostridium butyricum CBM 588 in food supplements.")] }],
    ["Akkermansia muciniphila", ["akkermansia", "pasteurised akkermansia muciniphila"], "Gut mucus bacterium", "Sold pasteurised as a metabolic-health supplement.", "", "Authorised only in pasteurised form as an EU novel food; benefits still being studied.", ["Supplements"], 86, { refs: [euNovelFoods("Authorises pasteurised Akkermansia muciniphila in food supplements (2022).")] }],
    ["Bacillus clausii", ["b. clausii", "alkalihalobacillus clausii"], "Spore-forming probiotic", "Sold in vials and capsules for diarrhoea.", "", "", ["Probiotics"], 88],
    ["Lentilactobacillus kefiri", ["lactobacillus kefiri", "l. kefiri"], "Kefir-grain bacterium", "Part of kefir grain communities.", "", "", ["Kefir"], 92, { refs: [ZHENG] }],
    ["Geotrichum candidum", ["geotrichum", "galactomyces candidus"], "Velvety cheese-rind yeast-like fungus", "Ripens Camembert, Saint-Marcellin and goat cheeses.", "", "", ["Soft cheeses"], 92],
    ["Debaryomyces hansenii", ["d. hansenii"], "Salt-tolerant ripening yeast", "Ripens surface of cheeses and cured sausages.", "", "", ["Cheese", "Salami"], 92],
    ["Brevibacterium linens", ["b. linens", "red smear bacteria"], "Orange smear-ripening bacterium", "Gives washed-rind cheeses their colour and aroma.", "", "", ["Munster", "Limburger"], 92],
    ["Rhizopus oligosporus", ["tempeh starter", "ragi tempe", "rhizopus microsporus var. oligosporus"], "Tempeh mould", "Binds soybeans into tempeh.", "", "", ["Tempeh"], 92],
    ["Aspergillus sojae", ["a. sojae"], "Koji mould for soy sauce", "Used to brew soy sauce and miso.", "", "", ["Soy sauce", "Miso"], 92],
    ["Zygosaccharomyces rouxii", ["z. rouxii"], "Salt-tolerant soy sauce yeast", "Develops aroma in soy sauce and miso.", "", "", ["Soy sauce"], 92],
    ["Fructilactobacillus sanfranciscensis", ["lactobacillus sanfranciscensis", "l. sanfranciscensis"], "Sourdough bacterium", "The main bacterium of San Francisco sourdough.", "", "", ["Sourdough"], 92, { refs: [ZHENG] }],
    ["Saccharomyces bayanus", ["s. bayanus", "champagne yeast"], "Wine and champagne yeast", "Ferments sparkling wines and ciders.", "", "", ["Sparkling wine", "Cider"], 92],
    ["Oenococcus oeni", ["o. oeni", "malolactic bacteria"], "Wine malolactic bacterium", "Softens wine acidity.", "", "", ["Wine"], 92],
    ["Acetobacter aceti", ["acetobacter", "vinegar bacteria", "mother of vinegar"], "Vinegar bacterium", "Turns alcohol into acetic acid.", "", "", ["Vinegar"], 92],
    ["Kombucha SCOBY", ["scoby", "kombucha culture", "komagataeibacter xylinus", "symbiotic culture of bacteria and yeast"], "Cellulose mat of kombucha microbes", "Ferments sweet tea into kombucha.", "", "Home brews can become contaminated; keep acidic and clean.", ["Kombucha"], 90],
    ["Pediococcus acidilactici", ["p. acidilactici"], "Meat and vegetable fermentation bacterium", "Starter culture for fermented sausages.", "", "", ["Salami"], 92],
    ["Pediococcus pentosaceus", ["p. pentosaceus"], "Lactic bacterium in fermented foods", "Used in fermented sausages and vegetables.", "", "", ["Salami", "Pickles"], 92],
    ["Lactococcus cremoris", ["lactococcus lactis subsp. cremoris", "l. cremoris"], "Cheese and buttermilk starter", "Used in cheddar, buttermilk and sour cream.", "", "", ["Cheddar", "Buttermilk"], 92],
    ["Latilactobacillus curvatus", ["lactobacillus curvatus", "l. curvatus"], "Meat fermentation bacterium", "Starter culture for fermented sausages.", "", "", ["Salami"], 92, { refs: [ZHENG] }],
    ["Staphylococcus carnosus", ["s. carnosus"], "Colour-forming meat starter", "Develops colour and flavour in cured sausages.", "", "A food-grade starter unrelated to S. aureus.", ["Salami"], 90],
    ["Penicillium nalgiovense", ["p. nalgiovense"], "White mould on salami", "Coats dry-cured sausages.", "", "", ["Salami"], 92],
    ["Bacillus subtilis", ["b. subtilis", "bacillus subtilis de111"], "Spore-forming probiotic bacterium", "Used as a probiotic and in some fermented foods.", "", "", ["Probiotics"], 90],
  ]),
  enzyme({ slug: "alpha-galactosidase", name: "Alpha-Galactosidase", aliases: ["α-galactosidase", "melibiase"], purposeShort: "Enzyme that breaks down bean sugars", purpose: "Sold as a digestive aid for beans and used to treat soy milk.", commonProducts: ["Digestive aids"] }),
  enzyme({ slug: "laccase", name: "Laccase", aliases: ["polyphenol oxidase (laccase)"], purposeShort: "Oxidising enzyme", purpose: "Used to remove oxygen in beer and stabilise juices.", commonProducts: ["Beer", "Juice"] }),
  enzyme({ slug: "aminopeptidase", name: "Aminopeptidase", aliases: ["leucine aminopeptidase"], purposeShort: "Protein-trimming enzyme", purpose: "Reduces bitterness in protein hydrolysates and cheese.", commonProducts: ["Protein hydrolysates", "Cheese"] }),
  enzyme({ slug: "pepsin", name: "Pepsin", aliases: ["porcine pepsin", "bovine pepsin"], purposeShort: "Stomach protease", purpose: "Used with chymosin in some rennets.", commonProducts: ["Cheese"], isNatural: true, isVegan: false }),
  enzyme({ slug: "trypsin", name: "Trypsin", aliases: ["porcine trypsin"], purposeShort: "Pancreatic protease", purpose: "Used to make protein hydrolysates and hypoallergenic formulas.", commonProducts: ["Infant formula hydrolysates"], isNatural: true, isVegan: false }),
  enzyme({ slug: "pancreatin", name: "Pancreatin", aliases: ["pancreatic enzymes", "pancrelipase"], purposeShort: "Pig pancreas enzyme mix", purpose: "Used in protein hydrolysis and as a digestive enzyme.", commonProducts: ["Hydrolysates", "Digestive enzymes"], isNatural: true, isVegan: false }),
  enzyme({ slug: "chitinase", name: "Chitinase", aliases: ["chitin hydrolase"], purposeShort: "Chitin-degrading enzyme", purpose: "Used in processing shellfish waste and mushrooms.", commonProducts: ["Processing aid"] }),
  enzyme({ slug: "cyclodextrin-glucanotransferase", name: "Cyclodextrin Glucanotransferase", aliases: ["cgtase", "cyclodextrin glycosyltransferase"], purposeShort: "Enzyme that makes cyclodextrins", purpose: "Converts starch into cyclodextrins.", commonProducts: ["Cyclodextrin production"] }),
  enzyme({ slug: "prolyl-oligopeptidase", name: "Prolyl Oligopeptidase", aliases: ["aspergillus niger prolyl endopeptidase", "an-pep", "prolyl endoprotease"], purposeShort: "Gluten-breaking enzyme", purpose: "Used to make gluten-reduced beer and sold as a digestive aid.", commonProducts: ["Gluten-reduced beer"],
    concerns: "Gluten-reduced beer is not proven safe for coeliacs." }),
  enzyme({ slug: "glutaminase", name: "Glutaminase", aliases: ["l-glutaminase"], purposeShort: "Enzyme that releases glutamate", purpose: "Boosts umami in yeast extracts and soy sauce.", commonProducts: ["Yeast extract", "Soy sauce"] }),
  enzyme({ slug: "peroxidase", name: "Peroxidase", aliases: ["horseradish peroxidase"], purposeShort: "Oxidising enzyme", purpose: "Oxidising enzyme used in food analysis and some processing.", commonProducts: ["Processing aid"] }),
  enzyme({ slug: "nattokinase", name: "Nattokinase", aliases: ["natto kinase", "subtilisin nat"], purposeShort: "Clot-dissolving enzyme from natto", purpose: "Sold as a circulation supplement.", commonProducts: ["Supplements"], safetyScore: 74,
    concerns: "Increases bleeding risk with blood thinners; benefits unproven." }),
  enzyme({ slug: "phosphodiesterase", name: "5'-Phosphodiesterase", aliases: ["nuclease p1", "5'-phosphodiesterase enzyme"], purposeShort: "Enzyme that makes flavour nucleotides", purpose: "Breaks yeast RNA into nucleotides for yeast extracts.", commonProducts: ["Yeast extract"] }),
  enzyme({ slug: "amp-deaminase", name: "AMP Deaminase", aliases: ["adenylic acid deaminase", "5'-adenylic acid deaminase"], purposeShort: "Enzyme that makes inosinate", purpose: "Converts AMP into IMP for umami yeast extracts.", commonProducts: ["Yeast extract"] }),
  enzyme({ slug: "dextranase", name: "Dextranase", aliases: ["dextran hydrolase"], purposeShort: "Sugar-processing enzyme", purpose: "Breaks down dextran gums in sugar refining.", commonProducts: ["Sugar refining"] }),
  enzyme({ slug: "mannanase", name: "Mannanase", aliases: ["beta-mannanase", "β-mannanase"], purposeShort: "Gum-degrading enzyme", purpose: "Used in coffee extraction and gum processing.", commonProducts: ["Instant coffee"] }),
  enzyme({ slug: "transglucosidase", name: "Transglucosidase", aliases: ["alpha-glucosidase (transglucosidase)"], purposeShort: "Enzyme that makes isomalto-oligosaccharides", purpose: "Converts starch into IMO syrups.", commonProducts: ["IMO syrups"] }),
];
