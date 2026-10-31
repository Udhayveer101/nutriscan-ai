// Expansion batch 38 — Pool 4: more chemically defined flavouring substances from the EU
// Union list (Reg. (EU) 872/2012), each with its CAS number so a CAS on a spec sheet links too.
import type { SeedIngredient } from "./types";
import { family } from "./build";
import { jecfa } from "./refs";

const UNION_LIST = { title: "Commission Implementing Regulation (EU) No 872/2012 adopting the list of flavouring substances", authors: "European Commission", journal: "Official Journal of the European Union, L 267", year: 2012, url: "https://eur-lex.europa.eu/eli/reg_impl/2012/872/oj", findings: "Union list of flavouring substances authorised for use in food." };

const chemical = family({
  categorySlug: "flavouring", evidenceLevel: "MODERATE", isNatural: false,
  sciConsensus: "Evaluated as a flavouring agent by JECFA and EFSA: no safety concern at estimated intakes from flavouring use.",
  fdaStatus: "Permitted flavouring (GRAS or 21 CFR 172.515)", efsaStatus: "On the EU Union list of flavouring substances",
  fssaiStatus: "Permitted flavouring substance", whoStatus: "JECFA: no safety concern at current intake as a flavouring agent",
  benefits: "Flavour at parts-per-million levels.",
  concerns: "None at flavouring levels.",
  safetyScore: 88,
  refs: [UNION_LIST, jecfa("Procedure for the safety evaluation of flavouring agents (44th meeting)", 1995, "Established the stepwise procedure JECFA uses to evaluate flavouring agents by structural class and estimated intake.")],
});

// [name, aliases (CAS last), what it tastes/smells of, where it is found or used, products, extra]
type F = [string, string[], string, string, string[], Partial<SeedIngredient>?];
const rows: F[] = [
  ["Isoamyl Acetate", ["isopentyl acetate", "banana oil", "CAS 123-92-2"], "Banana and pear-drop aroma", "The main note of banana flavour; also in pear drops and some beers.", ["Banana sweets", "Pear drops"]],
  ["Ethyl Butyrate", ["ethyl butanoate", "CAS 105-54-4"], "Fruity pineapple aroma", "Used in pineapple, orange and tutti-frutti flavours.", ["Fruit drinks", "Sweets"]],
  ["Ethyl Hexanoate", ["ethyl caproate", "CAS 123-66-0"], "Apple and pineapple aroma", "Gives a green-apple note.", ["Fruit drinks", "Chewing gum"]],
  ["Ethyl Propionate", ["ethyl propanoate", "CAS 105-37-3"], "Rum-like fruity aroma", "Used in fruit and rum flavours.", ["Sweets", "Baked goods"]],
  ["Ethyl 2-Methylbutyrate", ["ethyl 2-methylbutanoate", "CAS 7452-79-1"], "Apple and strawberry aroma", "Key apple note.", ["Apple drinks"]],
  ["Methyl Butyrate", ["methyl butanoate", "CAS 623-42-7"], "Apple and pineapple aroma", "Used in fruit flavours.", ["Sweets"]],
  ["Hexyl Acetate", ["n-hexyl acetate", "CAS 142-92-7"], "Pear and apple aroma", "Gives a fresh pear note.", ["Pear sweets"]],
  ["Butyl Acetate", ["n-butyl acetate", "CAS 123-86-4"], "Banana-like solvent aroma", "Minor fruit flavour component.", ["Sweets"]],
  ["Benzyl Acetate", ["CAS 140-11-4"], "Jasmine and pear aroma", "Used in jasmine, pear and strawberry flavours.", ["Sweets", "Tea flavourings"]],
  ["Methyl Anthranilate", ["CAS 134-20-3"], "Concord grape aroma", "The 'grape' of grape sweets and soda.", ["Grape soda", "Grape sweets"]],
  ["Ethyl Methylphenylglycidate", ["strawberry aldehyde", "aldehyde c-16", "CAS 77-83-8"], "Synthetic strawberry aroma", "Classic strawberry flavour in sweets and ice cream.", ["Strawberry sweets", "Ice cream"]],
  ["Gamma-Decalactone", ["γ-decalactone", "CAS 706-14-9"], "Peach aroma", "Key note of peach and apricot flavours; also made by fermentation.", ["Peach drinks", "Yoghurt"], { isNatural: true }],
  ["Delta-Decalactone", ["δ-decalactone", "CAS 705-86-2"], "Creamy coconut-milk aroma", "Gives butter and cream notes.", ["Dairy desserts", "Margarine"]],
  ["Gamma-Undecalactone", ["γ-undecalactone", "aldehyde c-14", "peach aldehyde", "CAS 104-67-6"], "Peach aroma", "Used in peach and apricot flavours.", ["Peach sweets"]],
  ["Gamma-Nonalactone", ["γ-nonalactone", "aldehyde c-18", "coconut aldehyde", "CAS 104-61-0"], "Coconut aroma", "Used in coconut flavours.", ["Coconut sweets"]],
  ["Furaneol", ["strawberry furanone", "furaneol (dmhf)", "CAS 3658-77-3"], "Caramel-strawberry aroma", "Naturally present in strawberries, pineapple and roasted foods.", ["Strawberry flavours", "Caramel"], { isNatural: true }],
  ["Raspberry Ketone", ["rheosmin", "frambinone", "CAS 5471-51-2"], "Raspberry aroma", "The key note of raspberry flavour.", ["Raspberry sweets", "Drinks"],
    { concerns: "Safe at flavouring levels. High-dose 'raspberry ketone' weight-loss supplements are unproven and not evaluated for those doses.", safetyScore: 84 }],
  ["Diacetyl", ["butanedione", "2,3-butanedione", "CAS 431-03-8"], "Butter aroma", "Gives butter flavour in popcorn, margarine and baked goods; also formed in fermentation.", ["Microwave popcorn", "Margarine"],
    { concerns: "Safe to eat at flavouring levels, but inhaling heated diacetyl caused 'popcorn lung' (bronchiolitis obliterans) in factory workers.", safetyScore: 78, isNatural: true }],
  ["Acetoin", ["3-hydroxy-2-butanone", "acetyl methyl carbinol", "CAS 513-86-0"], "Buttery aroma", "Butter flavour; also formed in fermentation.", ["Margarine", "Baked goods"], { isNatural: true }],
  ["2,3-Pentanedione", ["acetyl propionyl", "CAS 600-14-6"], "Butter aroma", "Used as a diacetyl substitute in butter flavours.", ["Popcorn", "Baked goods"],
    { concerns: "Safe to eat at flavouring levels; inhaled in factories it causes similar lung damage to diacetyl.", safetyScore: 80 }],
  ["Phenylethyl Alcohol", ["2-phenylethanol", "phenethyl alcohol", "CAS 60-12-8"], "Rose aroma", "Rose and honey notes in flavours and drinks.", ["Rose-flavoured sweets", "Drinks"], { isNatural: true }],
  ["Cis-3-Hexenol", ["leaf alcohol", "(Z)-3-hexen-1-ol", "CAS 928-96-1"], "Fresh-cut grass aroma", "Gives a green note to fruit flavours.", ["Fruit flavours"], { isNatural: true }],
  ["Hexanal", ["hexanaldehyde", "caproaldehyde", "CAS 66-25-1"], "Green, grassy aroma", "Green apple and tomato notes.", ["Fruit flavours"]],
  ["Octanal", ["aldehyde c-8", "caprylic aldehyde", "CAS 124-13-0"], "Orange-peel aroma", "Citrus note in orange flavours.", ["Orange drinks"]],
  ["Nonanal", ["aldehyde c-9", "pelargonaldehyde", "CAS 124-19-6"], "Rose-citrus aroma", "Citrus and floral notes.", ["Citrus flavours"]],
  ["Decanal", ["aldehyde c-10", "capraldehyde", "CAS 112-31-2"], "Orange-peel aroma", "Strong orange note.", ["Orange drinks"]],
  ["Acetaldehyde", ["ethanal", "CAS 75-07-0"], "Fresh fruity aroma", "Adds freshness to fruit and citrus flavours; also formed naturally in fruit and fermentation.", ["Fruit drinks", "Yoghurt"],
    { concerns: "Safe at flavouring levels. Acetaldehyde from drinking alcohol is IARC Group 1; flavour use adds very little by comparison.", safetyScore: 80, isNatural: true }],
  ["Butyric Acid", ["butanoic acid", "CAS 107-92-6"], "Cheesy, buttery aroma", "Used in butter and cheese flavours.", ["Cheese flavours", "Butter flavours"], { isNatural: true }],
  ["Isovaleric Acid", ["3-methylbutanoic acid", "CAS 503-74-2"], "Cheesy, sweaty aroma", "Used in trace amounts in cheese and fruit flavours.", ["Cheese flavours"]],
  ["Thymol", ["thyme camphor", "CAS 89-83-8"], "Thyme aroma", "Main constituent of thyme oil.", ["Herb flavourings", "Mouthwash"], { isNatural: true }],
  ["Carvacrol", ["CAS 499-75-2"], "Oregano aroma", "Main constituent of oregano oil.", ["Pizza flavourings"], { isNatural: true }],
  ["Piperonal", ["heliotropin", "heliotropine", "CAS 120-57-0"], "Cherry-vanilla aroma", "Used in vanilla and cherry flavours.", ["Vanilla flavours"]],
  ["Anisaldehyde", ["p-anisaldehyde", "4-methoxybenzaldehyde", "CAS 123-11-5"], "Hawthorn and anise aroma", "Used in anise, vanilla and fruit flavours.", ["Liquorice sweets"]],
  ["Nootkatone", ["CAS 4674-50-4"], "Grapefruit aroma", "The key note of grapefruit flavour.", ["Grapefruit drinks"], { isNatural: true }],
  ["Alpha-Ionone", ["α-ionone", "CAS 127-41-3"], "Violet and raspberry aroma", "Used in raspberry and violet flavours.", ["Raspberry sweets", "Parma violets"]],
  ["Beta-Ionone", ["β-ionone", "CAS 14901-07-6"], "Violet and woody aroma", "Formed from beta-carotene; used in berry flavours.", ["Berry flavours"], { isNatural: true }],
  ["Beta-Damascenone", ["β-damascenone", "CAS 23696-85-7"], "Cooked apple and rose aroma", "A trace aroma of roses, wine and apple juice.", ["Apple drinks"], { isNatural: true }],
  ["Sotolon", ["sotolone", "CAS 28664-35-9"], "Fenugreek and maple aroma", "Maple and curry notes; natural in fenugreek.", ["Maple flavours"], { isNatural: true }],
  ["Allyl Isothiocyanate", ["mustard oil (volatile)", "volatile oil of mustard", "CAS 57-06-7"], "Pungent mustard and wasabi flavour", "The heat of mustard, horseradish and wasabi; added to imitation wasabi.", ["Imitation wasabi", "Mustard"],
    { concerns: "Pungent and irritant in concentrated form; safe at flavouring levels.", safetyScore: 82, isNatural: true }],
  ["Allyl Hexanoate", ["allyl caproate", "CAS 123-68-2"], "Pineapple aroma", "Key pineapple note.", ["Pineapple sweets"]],
  ["2-Acetylpyrazine", ["acetylpyrazine", "CAS 22047-25-2"], "Popcorn and roasted aroma", "Roasted nut and popcorn notes.", ["Snacks", "Coffee flavours"]],
  ["2,5-Dimethylpyrazine", ["2,5-dimethyl pyrazine", "CAS 123-32-0"], "Roasted nut and cocoa aroma", "Formed in roasting; used in chocolate and nut flavours.", ["Chocolate flavours", "Snacks"], { isNatural: true }],
  ["Guaiacol", ["2-methoxyphenol", "CAS 90-05-1"], "Smoky aroma", "Smoke and bacon notes; natural in roasted coffee and whisky.", ["Smoky snacks", "Coffee flavours"], { isNatural: true }],
  ["Dimethyl Sulfide", ["dimethyl sulphide", "methyl sulfide", "CAS 75-18-3"], "Cooked corn and seafood aroma", "Gives cooked-sweetcorn and seafood notes.", ["Savoury flavours"], { isNatural: true }],
  ["Methional", ["3-(methylthio)propionaldehyde", "CAS 3268-49-3"], "Cooked potato aroma", "The key note of potato crisps and broths.", ["Crisps", "Savoury flavours"], { isNatural: true }],
  ["Cyclotene", ["methylcyclopentenolone", "maple lactone", "CAS 80-71-7"], "Maple and caramel aroma", "Used in maple, caramel and coffee flavours.", ["Maple syrup flavour", "Caramel"]],
  ["Ethyl Lactate", ["ethyl 2-hydroxypropanoate", "CAS 97-64-3"], "Mild creamy, fruity aroma", "Minor flavour component and solvent.", ["Flavourings"]],
  ["Cinnamyl Alcohol", ["cinnamic alcohol", "CAS 104-54-1"], "Hyacinth-cinnamon aroma", "Used in cinnamon and fruit flavours.", ["Cinnamon sweets"], { concerns: "A skin sensitiser in fragrances; no concern at flavouring levels." }],
  ["Ethyl Cinnamate", ["CAS 103-36-6"], "Fruity balsamic aroma", "Used in fruit and spice flavours.", ["Sweets"]],
  ["Methyl Cinnamate", ["CAS 103-26-4"], "Strawberry aroma", "Natural in strawberries and basil.", ["Strawberry flavours"], { isNatural: true }],
  ["Geraniol", ["CAS 106-24-1"], "Rose aroma", "Main rose note; natural in rose and palmarosa oils.", ["Rose sweets", "Fruit flavours"], { isNatural: true, concerns: "A skin sensitiser in fragrances; no concern at flavouring levels." }],
  ["Citronellol", ["CAS 106-22-9"], "Rose and citrus aroma", "Natural in rose and geranium oils.", ["Fruit flavours"], { isNatural: true }],
  ["Citronellal", ["CAS 106-23-0"], "Lemony citronella aroma", "Natural in citronella and lemon-scented herbs.", ["Citrus flavours"], { isNatural: true }],
  ["Geranyl Acetate", ["CAS 105-87-3"], "Fruity rose aroma", "Used in fruit and floral flavours.", ["Fruit flavours"]],
  ["Linalyl Acetate", ["CAS 115-95-7"], "Bergamot and lavender aroma", "Natural in bergamot and lavender oils; gives Earl Grey its note.", ["Earl Grey tea", "Citrus flavours"], { isNatural: true }],
  ["Menthone", ["l-menthone", "CAS 89-80-5"], "Minty aroma", "A constituent of peppermint oil.", ["Mints"], { isNatural: true }],
  ["Alpha-Pinene", ["α-pinene", "CAS 80-56-8"], "Pine aroma", "Natural in pine, rosemary and juniper; used in gin-type flavours.", ["Gin flavours"], { isNatural: true }],
  ["Beta-Caryophyllene", ["β-caryophyllene", "caryophyllene", "CAS 87-44-5"], "Spicy, woody aroma", "Natural in black pepper and clove.", ["Spice flavours"], { isNatural: true }],
  ["Isoamyl Alcohol", ["isopentyl alcohol", "3-methyl-1-butanol", "CAS 123-51-3"], "Fusel, malty aroma", "A fermentation alcohol used in fruit and whisky flavours.", ["Flavourings"], { isNatural: true }],
];

export const BATCH_38: SeedIngredient[] = rows.map(([name, aliases, purposeShort, purpose, commonProducts, extra = {}]) => chemical({
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), name, aliases, purposeShort, purpose, commonProducts, ...extra,
}));
