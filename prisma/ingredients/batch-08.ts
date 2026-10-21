// Expansion batch 08 — Pool 5: live cultures and probiotic strains named on labels.
// Cultures route as whole-food markers (WHOLEFOOD_KEYWORDS): a fermented food with
// live cultures is NOVA 1/2, so a KB profile (which counts as an additive) would mis-score yoghurt.
import type { SeedIngredient } from "./types";
import { family } from "./build";
import { efsa } from "./refs";

const BIOHAZ = "Biological Hazards (BIOHAZ)";
const QPS = efsa(BIOHAZ, "Update of the list of qualified presumption of safety (QPS) recommended microbiological agents intentionally added to food or feed", 2023,
  "Lists bacterial and yeast species presumed safe for use in the food chain, including the lactobacilli, bifidobacteria, Streptococcus thermophilus, Lactococcus lactis and Bacillus species named here (with strain-level qualifications).");
const YOGHURT_CLAIM = efsa("Dietetic Products, Nutrition and Allergies (NDA)", "Scientific Opinion on the substantiation of health claims related to live yoghurt cultures and improved lactose digestion", 2010,
  "Yoghurt containing at least 10^8 CFU of live L. delbrueckii subsp. bulgaricus and S. thermophilus per gram improves lactose digestion in people with lactose maldigestion.");
const CHEESE = { title: "General Standard for Cheese (CXS 283-1978)", authors: "Codex Alimentarius Commission", journal: "Codex Alimentarius", year: 1978, url: "https://www.fao.org/fao-who-codexalimentarius/", findings: "Permits harmless lactic acid bacteria, moulds and other microbial cultures in cheese making." };

const culture = family({
  categorySlug: "culture", evidenceLevel: "STRONG", isNatural: true,
  sciConsensus: "A species on EFSA's Qualified Presumption of Safety list with a long history of use in fermented foods. 'Probiotic' benefits are strain-specific; no general probiotic health claim is authorised in the EU.",
  fdaStatus: "GRAS (traditional fermentation use; strain-specific GRAS notices)", efsaStatus: "QPS-listed species; probiotic health claims not authorised",
  fssaiStatus: "Permitted in probiotic foods (FSSAI Health Supplements regulations)", whoStatus: "FAO/WHO probiotic guidelines apply",
  refs: [QPS],
});

const strain = (slug: string, name: string, aliases: string[], purposeShort: string, purpose: string, benefits: string, commonProducts: string[], safetyScore = 92, extra: Partial<SeedIngredient> = {}) =>
  culture({ slug, name, aliases, purposeShort, purpose, benefits,
    concerns: "Safe for healthy people. Rare bloodstream infections have been reported in severely immunocompromised patients or those with central lines given high-dose probiotics.",
    commonProducts, safetyScore, ...extra });

export const BATCH_08: SeedIngredient[] = [
  strain("lactobacillus-acidophilus", "Lactobacillus acidophilus", ["L. acidophilus", "acidophilus"], "Classic probiotic lactic acid bacterium",
    "Added to yoghurt, kefir and probiotic supplements.", "Ferments lactose; specific strains have trial evidence for some digestive outcomes.", ["Probiotic yoghurt", "Acidophilus milk", "Supplements"]),
  strain("lactobacillus-rhamnosus", "Lacticaseibacillus rhamnosus", ["Lactobacillus rhamnosus", "L. rhamnosus", "LGG", "Lactobacillus GG"], "Widely studied probiotic species (incl. strain GG)",
    "Used in probiotic drinks, yoghurts and supplements.", "Strain GG has trial evidence for reducing antibiotic-associated diarrhoea in children.", ["Probiotic drinks", "Supplements"]),
  strain("lactobacillus-casei", "Lacticaseibacillus casei", ["Lactobacillus casei", "L. casei"], "Probiotic species in fermented milk drinks",
    "Used in fermented milk shots and cheese ripening.", "Strain-specific evidence for some gut outcomes.", ["Fermented milk drinks", "Cheese"]),
  strain("lactobacillus-paracasei", "Lacticaseibacillus paracasei", ["Lactobacillus paracasei", "L. paracasei", "L. casei Shirota"], "Probiotic species (incl. strain Shirota)",
    "Used in fermented milk drinks and supplements.", "Strain-specific evidence for some gut outcomes.", ["Fermented milk shots", "Supplements"]),
  strain("lactobacillus-plantarum", "Lactiplantibacillus plantarum", ["Lactobacillus plantarum", "L. plantarum"], "Lactic acid bacterium of fermented vegetables",
    "Drives fermentation of sauerkraut, kimchi, sourdough and olives; also sold as a probiotic.", "Common in traditional fermented foods.", ["Sauerkraut", "Kimchi", "Sourdough", "Supplements"]),
  strain("lactobacillus-reuteri", "Limosilactobacillus reuteri", ["Lactobacillus reuteri", "L. reuteri"], "Probiotic species used in infant drops",
    "Sold in infant colic drops and supplements.", "Strain DSM 17938 has trial evidence for reducing crying time in breastfed colicky infants.", ["Infant probiotic drops", "Supplements"]),
  strain("lactobacillus-bulgaricus", "Lactobacillus delbrueckii subsp. bulgaricus", ["Lactobacillus bulgaricus", "L. bulgaricus"], "One of the two classic yoghurt cultures",
    "Ferments milk into yoghurt together with Streptococcus thermophilus.", "Live yoghurt cultures improve lactose digestion (EU-authorised claim).", ["Yoghurt"], 94, { refs: [YOGHURT_CLAIM] }),
  strain("streptococcus-thermophilus", "Streptococcus thermophilus", ["S. thermophilus"], "Classic yoghurt and cheese starter culture",
    "Ferments milk in yoghurt and many cheeses (mozzarella, Swiss types).", "Live yoghurt cultures improve lactose digestion (EU-authorised claim).", ["Yoghurt", "Mozzarella", "Emmental"], 94, { refs: [YOGHURT_CLAIM] }),
  strain("bifidobacterium-lactis", "Bifidobacterium animalis subsp. lactis", ["Bifidobacterium lactis", "B. lactis", "BB-12", "bifidus"], "Most common bifidobacterium in yoghurts",
    "Added to 'bio' yoghurts, infant formula and supplements.", "Tolerates acid and oxygen well; strain-specific evidence for transit and gut outcomes.", ["Bio yoghurt", "Infant formula", "Supplements"]),
  strain("bifidobacterium-longum", "Bifidobacterium longum", ["B. longum"], "Gut-resident bifidobacterium",
    "Sold in supplements and some yoghurts.", "Strain-specific evidence; naturally abundant in the human gut.", ["Supplements"]),
  strain("bifidobacterium-bifidum", "Bifidobacterium bifidum", ["B. bifidum"], "Bifidobacterium species",
    "Sold in supplements.", "Strain-specific evidence.", ["Supplements"]),
  strain("bifidobacterium-breve", "Bifidobacterium breve", ["B. breve"], "Infant-gut bifidobacterium",
    "Added to some infant formulas and supplements.", "Common in breastfed infants' gut; strain-specific evidence.", ["Infant formula", "Supplements"]),
  strain("bifidobacterium-infantis", "Bifidobacterium longum subsp. infantis", ["B. infantis", "Bifidobacterium infantis"], "HMO-digesting infant bifidobacterium",
    "Sold as infant probiotic drops and supplements.", "Uniquely able to digest human milk oligosaccharides.", ["Infant probiotics"]),
  strain("lactobacillus-fermentum", "Limosilactobacillus fermentum", ["Lactobacillus fermentum", "L. fermentum"], "Lactic acid bacterium of sourdough and fermented foods",
    "Found in sourdough, fermented cereals and dairy; some strains sold as probiotics.", "Traditional fermentation organism.", ["Sourdough", "Supplements"]),
  strain("lactobacillus-gasseri", "Lactobacillus gasseri", ["L. gasseri"], "Probiotic species",
    "Sold in supplements and some fermented milks.", "Strain-specific evidence.", ["Supplements"]),
  strain("lactobacillus-helveticus", "Lactobacillus helveticus", ["L. helveticus"], "Cheese starter culture",
    "Used for Swiss-type and Italian hard cheeses and some fermented milks.", "Contributes flavour and reduces bitterness in cheese.", ["Emmental", "Parmesan"]),
  strain("lactobacillus-johnsonii", "Lactobacillus johnsonii", ["L. johnsonii", "LC1"], "Probiotic species",
    "Used in some fermented milks and supplements.", "Strain-specific evidence.", ["Fermented milks"]),
  strain("lactobacillus-salivarius", "Ligilactobacillus salivarius", ["Lactobacillus salivarius", "L. salivarius"], "Probiotic species",
    "Sold in supplements.", "Strain-specific evidence.", ["Supplements"]),
  strain("lactococcus-lactis", "Lactococcus lactis", ["L. lactis", "mesophilic starter culture"], "Main cheese and buttermilk starter culture",
    "Acidifies milk for cheddar, gouda, cottage cheese, sour cream and buttermilk; some strains make nisin.", "Traditional dairy fermentation organism.", ["Cheddar", "Buttermilk", "Sour cream"], 94, { refs: [CHEESE] }),
  strain("leuconostoc-mesenteroides", "Leuconostoc mesenteroides", ["Leuconostoc"], "Lactic acid bacterium of sauerkraut and kimchi",
    "Starts fermentation in sauerkraut, kimchi and pickles.", "Traditional vegetable fermentation organism.", ["Sauerkraut", "Kimchi"]),
  strain("propionibacterium-freudenreichii", "Propionibacterium freudenreichii", ["Propionibacterium shermanii", "Propionibacterium"], "Makes the holes in Swiss cheese",
    "Produces CO2 and propionic acid in Emmental-type cheese; also makes vitamin B12.", "Flavour and eye formation in Swiss cheese.", ["Emmental", "Jarlsberg"], 94, { refs: [CHEESE] }),
  strain("saccharomyces-boulardii", "Saccharomyces boulardii", ["S. boulardii", "Saccharomyces cerevisiae var. boulardii"], "Probiotic yeast",
    "Sold as a probiotic supplement.", "Trial evidence for reducing antibiotic-associated diarrhoea.", ["Probiotic capsules"], 88,
    { concerns: "Safe for healthy people. Fungaemia has been reported in critically ill patients and those with central venous catheters, so it is avoided in those settings." }),
  strain("bacillus-coagulans", "Bacillus coagulans", ["Weizmannia coagulans", "Heyndrickxia coagulans", "GanedenBC30"], "Spore-forming probiotic",
    "Heat-resistant spores survive baking and are added to cereals, bars and supplements.", "Spores survive processing; strain-specific evidence.", ["Probiotic cereals", "Bars", "Supplements"]),
  strain("bacillus-subtilis-natto", "Bacillus subtilis var. natto", ["Bacillus subtilis natto", "natto bacteria"], "Fermentation bacterium of natto",
    "Ferments soybeans into natto; source of vitamin K2 (MK-7).", "Natto is the richest dietary source of menaquinone-7.", ["Natto", "Supplements"]),
  culture({ slug: "penicillium-roqueforti", name: "Penicillium roqueforti", aliases: ["P. roqueforti", "blue cheese mould"], purposeShort: "Blue-cheese mould",
    purpose: "Creates the blue veins and flavour of Roquefort, Stilton and Gorgonzola.", benefits: "Traditional ripening mould.",
    concerns: "Food strains produce little or no mycotoxin in cheese; people with mould allergy or penicillin allergy rarely react.", safetyScore: 90, commonProducts: ["Roquefort", "Stilton", "Gorgonzola"],
    efsaStatus: "Traditional cheese culture", refs: [CHEESE] }),
  culture({ slug: "penicillium-camemberti", name: "Penicillium camemberti", aliases: ["P. camemberti", "Penicillium candidum", "white mould"], purposeShort: "White-rind cheese mould",
    purpose: "Forms the bloomy white rind of Camembert and Brie.", benefits: "Traditional ripening mould.",
    concerns: "No recognised dietary hazard from the mould at cheese levels.", safetyScore: 90, commonProducts: ["Camembert", "Brie"], efsaStatus: "Traditional cheese culture", refs: [CHEESE] }),
  culture({ slug: "aspergillus-oryzae", name: "Aspergillus oryzae (koji)", aliases: ["koji", "koji mould", "A. oryzae", "kōji"], purposeShort: "Koji mould behind soy sauce, miso and sake",
    purpose: "Grown on rice, barley or soybeans to make koji, the starter for soy sauce, miso, sake, mirin and makgeolli.", benefits: "Its enzymes create umami and sweetness in traditional ferments.",
    concerns: "Domesticated strains do not produce aflatoxin; no dietary concern.", safetyScore: 92, commonProducts: ["Soy sauce", "Miso", "Sake", "Mirin"],
    efsaStatus: "Traditional fermentation organism; widely used enzyme source", refs: [{ title: "On the safety of Aspergillus oryzae: a review", authors: "Barbesgaard P, Heldt-Hansen HP, Diderichsen B", journal: "Applied Microbiology and Biotechnology 36:569–572", year: 1992, findings: "A. oryzae has a long history of safe use; domesticated strains do not produce aflatoxins." }] }),
  culture({ slug: "kefir-grains", name: "Kefir Grains", aliases: ["kefir culture", "milk kefir grains", "water kefir grains"], purposeShort: "Symbiotic yeast-bacteria culture for kefir",
    purpose: "A mixed culture of lactic acid bacteria, acetic acid bacteria and yeasts that ferments milk or sugar water into kefir.", benefits: "Lowers lactose and produces a tangy, mildly fizzy fermented drink.",
    concerns: "Home ferments carry contamination risk if hygiene is poor; commercial kefir is safe.", safetyScore: 90, commonProducts: ["Kefir", "Water kefir"], evidenceLevel: "MODERATE" }),
];
