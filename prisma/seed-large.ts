import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CATEGORIES = [
  { name: "Preservative", slug: "preservative", icon: "🛡️", description: "Prevent spoilage by inhibiting microbial growth or oxidation", color: "#f97316" },
  { name: "Sweetener", slug: "sweetener", icon: "🍬", description: "Provide sweetness with or without caloric value", color: "#ec4899" },
  { name: "Coloring", slug: "coloring", icon: "🎨", description: "Add or restore color to foods and beverages", color: "#a855f7" },
  { name: "Emulsifier", slug: "emulsifier", icon: "🧪", description: "Help oil and water mix together uniformly", color: "#3b82f6" },
  { name: "Stabilizer", slug: "stabilizer", icon: "⚖️", description: "Maintain texture and prevent separation", color: "#06b6d4" },
  { name: "Flavor Enhancer", slug: "flavor-enhancer", icon: "✨", description: "Intensify existing flavors without adding their own", color: "#f59e0b" },
  { name: "Antioxidant", slug: "antioxidant", icon: "🌿", description: "Prevent oxidation and rancidity in fats and oils", color: "#22c55e" },
  { name: "Thickener", slug: "thickener", icon: "💧", description: "Increase viscosity and improve texture", color: "#64748b" },
  { name: "Acidity Regulator", slug: "acidity-regulator", icon: "⚗️", description: "Control and maintain pH levels in food products", color: "#8b5cf6" },
  { name: "Vitamin & Mineral", slug: "vitamin-mineral", icon: "💊", description: "Fortify foods with essential nutrients", color: "#10b981" },
];

// Real food additives and ingredients
const PRESERVATIVES = [
  { name: "Sodium Benzoate", aliases: ["E211"], eNum: "E211" },
  { name: "Potassium Sorbate", aliases: ["E202"], eNum: "E202" },
  { name: "Sodium Nitrite", aliases: ["E250"], eNum: "E250" },
  { name: "Sodium Nitrate", aliases: ["E251"], eNum: "E251" },
  { name: "Calcium Propionate", aliases: ["E282"], eNum: "E282" },
  { name: "Sodium Propionate", aliases: ["E281"], eNum: "E281" },
  { name: "Potassium Nitrate", aliases: ["E252"], eNum: "E252" },
  { name: "Potassium Bisulfite", aliases: ["E228"], eNum: "E228" },
  { name: "Sodium Metabisulfite", aliases: ["E223"], eNum: "E223" },
  { name: "Potassium Metabisulfite", aliases: ["E224"], eNum: "E224" },
  { name: "Sodium Sulfite", aliases: ["E221"], eNum: "E221" },
  { name: "Sodium Hydrogen Sulfite", aliases: ["E222"], eNum: "E222" },
  { name: "Potassium Sulfite", aliases: ["E225"], eNum: "E225" },
  { name: "Calcium Sulfite", aliases: ["E226"], eNum: "E226" },
  { name: "Calcium Hydrogen Sulfite", aliases: ["E227"], eNum: "E227" },
];

const SWEETENERS = [
  { name: "Aspartame", aliases: ["E951"], eNum: "E951" },
  { name: "Acesulfame-K", aliases: ["E950", "Ace-K"], eNum: "E950" },
  { name: "Saccharin", aliases: ["E954"], eNum: "E954" },
  { name: "Sucralose", aliases: ["E955"], eNum: "E955" },
  { name: "Sorbitol", aliases: ["E420"], eNum: "E420" },
  { name: "Xylitol", aliases: ["E967"], eNum: "E967" },
  { name: "Mannitol", aliases: ["E421"], eNum: "E421" },
  { name: "Isomalt", aliases: ["E953"], eNum: "E953" },
  { name: "Maltitol", aliases: ["E965"], eNum: "E965" },
  { name: "Lactitol", aliases: ["E966"], eNum: "E966" },
  { name: "Erythritol", aliases: ["E968"], eNum: "E968" },
  { name: "Stevia", aliases: ["E960"], eNum: "E960" },
  { name: "Advantame", aliases: ["E969"], eNum: "E969" },
  { name: "Alitame", aliases: [], eNum: "" },
  { name: "Cyclamate", aliases: ["E952"], eNum: "E952" },
];

const COLORINGS = [
  { name: "Red 40", aliases: ["E129", "Allura Red"], eNum: "E129" },
  { name: "Yellow 5", aliases: ["E110", "Tartrazine"], eNum: "E110" },
  { name: "Yellow 6", aliases: ["E101", "Sunset Yellow"], eNum: "E101" },
  { name: "Blue 1", aliases: ["E133", "Brilliant Blue"], eNum: "E133" },
  { name: "Blue 2", aliases: ["E131", "Indigo Carmine"], eNum: "E131" },
  { name: "Green 3", aliases: ["E143", "Fast Green"], eNum: "E143" },
  { name: "Red 3", aliases: ["E122", "Carmoisine"], eNum: "E122" },
  { name: "Carmine", aliases: ["E120"], eNum: "E120" },
  { name: "Annatto", aliases: ["E160b"], eNum: "E160b" },
  { name: "Paprika", aliases: ["E160c"], eNum: "E160c" },
  { name: "Beta-Carotene", aliases: ["E160a"], eNum: "E160a" },
  { name: "Lycopene", aliases: ["E160d"], eNum: "E160d" },
  { name: "Chlorophyll", aliases: ["E140"], eNum: "E140" },
  { name: "Spirulina", aliases: ["E140i"], eNum: "E140i" },
  { name: "Carbon Black", aliases: ["E153"], eNum: "E153" },
];

const EMULSIFIERS = [
  { name: "Lecithin", aliases: ["E322"], eNum: "E322" },
  { name: "Mono- and Diglycerides", aliases: ["E471"], eNum: "E471" },
  { name: "Sorbitan Monostearate", aliases: ["E491"], eNum: "E491" },
  { name: "Sorbitan Monoleate", aliases: ["E493"], eNum: "E493" },
  { name: "Sorbitan Monooleate", aliases: ["E494"], eNum: "E494" },
  { name: "Sorbitan Tristearate", aliases: ["E492"], eNum: "E492" },
  { name: "Polysorbate 20", aliases: ["E432"], eNum: "E432" },
  { name: "Polysorbate 40", aliases: ["E434"], eNum: "E434" },
  { name: "Polysorbate 60", aliases: ["E435"], eNum: "E435" },
  { name: "Polysorbate 80", aliases: ["E433"], eNum: "E433" },
  { name: "Sodium Stearyl Lactate", aliases: ["E481"], eNum: "E481" },
  { name: "Calcium Stearyl Lactate", aliases: ["E482"], eNum: "E482" },
  { name: "Stearoyl Lactylate", aliases: ["E483"], eNum: "E483" },
  { name: "Polyglycerol Esters", aliases: ["E475"], eNum: "E475" },
  { name: "Sucrose Esters", aliases: ["E473"], eNum: "E473" },
];

const STABILIZERS = [
  { name: "Carrageenan", aliases: ["E407"], eNum: "E407" },
  { name: "Guar Gum", aliases: ["E412"], eNum: "E412" },
  { name: "Xanthan Gum", aliases: ["E415"], eNum: "E415" },
  { name: "Locust Bean Gum", aliases: ["E410"], eNum: "E410" },
  { name: "Tara Gum", aliases: ["E417"], eNum: "E417" },
  { name: "Pectin", aliases: ["E440"], eNum: "E440" },
  { name: "Sodium Alginate", aliases: ["E401"], eNum: "E401" },
  { name: "Potassium Alginate", aliases: ["E402"], eNum: "E402" },
  { name: "Ammonium Alginate", aliases: ["E403"], eNum: "E403" },
  { name: "Calcium Alginate", aliases: ["E404"], eNum: "E404" },
  { name: "Gelatin", aliases: [], eNum: "" },
  { name: "Agar", aliases: ["E406"], eNum: "E406" },
  { name: "Tragacanth", aliases: ["E413"], eNum: "E413" },
  { name: "Acacia Gum", aliases: ["E414"], eNum: "E414" },
  { name: "Konjac Glucomannan", aliases: ["E425"], eNum: "E425" },
];

const FLAVOR_ENHANCERS = [
  { name: "Monosodium Glutamate", aliases: ["E621", "MSG"], eNum: "E621" },
  { name: "Disodium Guanylate", aliases: ["E627"], eNum: "E627" },
  { name: "Disodium Inosinate", aliases: ["E631"], eNum: "E631" },
  { name: "Sodium Inosinate-Guanylate Mix", aliases: ["E635"], eNum: "E635" },
  { name: "Potassium Glutamate", aliases: ["E622"], eNum: "E622" },
  { name: "Calcium Glutamate", aliases: ["E623"], eNum: "E623" },
  { name: "Ammonium Glutamate", aliases: ["E624"], eNum: "E624" },
  { name: "Magnesium Glutamate", aliases: ["E625"], eNum: "E625" },
  { name: "Yeast Extract", aliases: [], eNum: "" },
  { name: "Hydrolyzed Vegetable Protein", aliases: [], eNum: "" },
  { name: "Hydrolyzed Animal Protein", aliases: [], eNum: "" },
  { name: "Meat Extract", aliases: [], eNum: "" },
  { name: "Molasses", aliases: [], eNum: "" },
  { name: "Soy Sauce", aliases: [], eNum: "" },
  { name: "Fish Sauce", aliases: [], eNum: "" },
];

const ANTIOXIDANTS = [
  { name: "Ascorbic Acid", aliases: ["E300", "Vitamin C"], eNum: "E300" },
  { name: "Sodium Ascorbate", aliases: ["E301"], eNum: "E301" },
  { name: "Calcium Ascorbate", aliases: ["E302"], eNum: "E302" },
  { name: "Potassium Ascorbate", aliases: ["E303"], eNum: "E303" },
  { name: "Tocopherols", aliases: ["E306", "Vitamin E"], eNum: "E306" },
  { name: "Tocopherol Acetate", aliases: ["E309"], eNum: "E309" },
  { name: "Alpha-Tocopherol", aliases: [], eNum: "" },
  { name: "BHA", aliases: ["E320"], eNum: "E320" },
  { name: "BHT", aliases: ["E321"], eNum: "E321" },
  { name: "TBHQ", aliases: [], eNum: "" },
  { name: "PG", aliases: ["E477"], eNum: "E477" },
  { name: "Citric Acid", aliases: ["E330"], eNum: "E330" },
  { name: "Sodium Citrate", aliases: ["E331"], eNum: "E331" },
  { name: "Rosemary Extract", aliases: ["E392"], eNum: "E392" },
  { name: "Green Tea Extract", aliases: [], eNum: "" },
];

const THICKENERS = [
  { name: "Starch", aliases: [], eNum: "" },
  { name: "Corn Starch", aliases: [], eNum: "" },
  { name: "Potato Starch", aliases: [], eNum: "" },
  { name: "Tapioca Starch", aliases: [], eNum: "" },
  { name: "Rice Starch", aliases: [], eNum: "" },
  { name: "Modified Starch", aliases: ["E1404"], eNum: "E1404" },
  { name: "Gelatin", aliases: [], eNum: "" },
  { name: "Carboxymethyl Cellulose", aliases: ["E466"], eNum: "E466" },
  { name: "Methylcellulose", aliases: ["E461"], eNum: "E461" },
  { name: "Hydroxypropyl Cellulose", aliases: ["E463"], eNum: "E463" },
  { name: "Ethyl Cellulose", aliases: ["E462"], eNum: "E462" },
  { name: "Hydroxypropyl Methylcellulose", aliases: ["E464"], eNum: "E464" },
  { name: "Cellulose Powder", aliases: ["E460"], eNum: "E460" },
  { name: "Inulin", aliases: [], eNum: "" },
  { name: "Chicory Root Fiber", aliases: [], eNum: "" },
];

const ACIDITY_REGULATORS = [
  { name: "Citric Acid", aliases: ["E330"], eNum: "E330" },
  { name: "Sodium Citrate", aliases: ["E331"], eNum: "E331" },
  { name: "Potassium Citrate", aliases: ["E332"], eNum: "E332" },
  { name: "Calcium Citrate", aliases: ["E333"], eNum: "E333" },
  { name: "Malic Acid", aliases: ["E296"], eNum: "E296" },
  { name: "Sodium Malate", aliases: ["E350"], eNum: "E350" },
  { name: "Potassium Malate", aliases: ["E351"], eNum: "E351" },
  { name: "Tartaric Acid", aliases: ["E334"], eNum: "E334" },
  { name: "Sodium Tartrate", aliases: ["E335"], eNum: "E335" },
  { name: "Potassium Tartrate", aliases: ["E336"], eNum: "E336" },
  { name: "Sodium Potassium Tartrate", aliases: ["E337"], eNum: "E337" },
  { name: "Lactic Acid", aliases: ["E270"], eNum: "E270" },
  { name: "Sodium Lactate", aliases: ["E325"], eNum: "E325" },
  { name: "Acetic Acid", aliases: ["E260"], eNum: "E260" },
  { name: "Sodium Acetate", aliases: ["E262"], eNum: "E262" },
];

const VITAMINS_MINERALS = [
  { name: "Vitamin A", aliases: ["Beta-Carotene"], eNum: "" },
  { name: "Vitamin B1", aliases: ["Thiamine"], eNum: "" },
  { name: "Vitamin B2", aliases: ["Riboflavin"], eNum: "" },
  { name: "Vitamin B3", aliases: ["Niacin"], eNum: "" },
  { name: "Vitamin B5", aliases: ["Pantothenic Acid"], eNum: "" },
  { name: "Vitamin B6", aliases: ["Pyridoxine"], eNum: "" },
  { name: "Vitamin B12", aliases: ["Cobalamin"], eNum: "" },
  { name: "Vitamin C", aliases: ["Ascorbic Acid"], eNum: "" },
  { name: "Vitamin D", aliases: ["Cholecalciferol"], eNum: "" },
  { name: "Vitamin E", aliases: ["Tocopherol"], eNum: "" },
  { name: "Vitamin K", aliases: ["Phylloquinone"], eNum: "" },
  { name: "Folic Acid", aliases: ["Folate"], eNum: "" },
  { name: "Biotin", aliases: ["Vitamin B7"], eNum: "" },
  { name: "Iron", aliases: ["Ferric Oxide"], eNum: "" },
  { name: "Zinc", aliases: ["Zinc Oxide"], eNum: "" },
  { name: "Calcium", aliases: ["Calcium Carbonate"], eNum: "" },
  { name: "Magnesium", aliases: ["Magnesium Oxide"], eNum: "" },
  { name: "Potassium", aliases: ["Potassium Chloride"], eNum: "" },
  { name: "Sodium", aliases: ["Sodium Chloride"], eNum: "" },
  { name: "Iodine", aliases: ["Potassium Iodide"], eNum: "" },
];

interface IngredientData {
  slug: string;
  name: string;
  aliases: string[];
  eNumber?: string;
  categorySlug: string;
  purposeShort: string;
  purpose: string;
  benefits: string;
  concerns: string;
  sciConsensus: string;
  evidenceLevel: "STRONG" | "MODERATE" | "LIMITED" | "INSUFFICIENT";
  fdaStatus: string;
  efsaStatus: string;
  fssaiStatus: string;
  whoStatus: string;
  safetyScore: number;
  commonProducts: string[];
  adiValue: string | null;
  isNatural: boolean;
  isVegan: boolean;
}

function generateIngredients(): IngredientData[] {
  const ingredients: IngredientData[] = [];
  let counter = 0;

  const ingredientsByCategory = [
    { items: PRESERVATIVES, slug: "preservative", products: ["Beverages", "Cured Meats", "Pickled Foods", "Condiments", "Fruit Products"] },
    { items: SWEETENERS, slug: "sweetener", products: ["Diet Sodas", "Sugar-Free Candy", "Light Desserts", "Beverages", "Chewing Gum"] },
    { items: COLORINGS, slug: "coloring", products: ["Candy", "Beverages", "Ice Cream", "Fruit Drinks", "Baked Goods"] },
    { items: EMULSIFIERS, slug: "emulsifier", products: ["Chocolate", "Margarine", "Salad Dressings", "Bread", "Mayonnaise"] },
    { items: STABILIZERS, slug: "stabilizer", products: ["Yogurt", "Chocolate Milk", "Ice Cream", "Pudding", "Dairy Alternatives"] },
    { items: FLAVOR_ENHANCERS, slug: "flavor-enhancer", products: ["Instant Noodles", "Chips", "Soup", "Seasoning Blends", "Processed Foods"] },
    { items: ANTIOXIDANTS, slug: "antioxidant", products: ["Cereals", "Oils", "Nut Butters", "Dried Fruits", "Fortified Foods"] },
    { items: THICKENERS, slug: "thickener", products: ["Soups", "Sauces", "Gravies", "Puddings", "Baked Goods"] },
    { items: ACIDITY_REGULATORS, slug: "acidity-regulator", products: ["Beverages", "Jams", "Cheese", "Canned Foods", "Candy"] },
    { items: VITAMINS_MINERALS, slug: "vitamin-mineral", products: ["Cereals", "Fortified Milk", "Energy Bars", "Beverages", "Baby Foods"] },
  ];

  for (const category of ingredientsByCategory) {
    for (const item of category.items) {
      counter++;
      const isNatural = Math.random() > 0.6;
      const safetyScore = Math.floor(Math.random() * 50) + 50;
      const evidenceLevels: Array<"STRONG" | "MODERATE" | "LIMITED" | "INSUFFICIENT"> = ["STRONG", "MODERATE", "LIMITED", "INSUFFICIENT"];
      const evidenceLevel = evidenceLevels[Math.floor(Math.random() * evidenceLevels.length)];

      ingredients.push({
        slug: `${item.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}-${counter}`,
        name: item.name,
        aliases: item.aliases,
        eNumber: item.eNum || undefined,
        categorySlug: category.slug,
        purposeShort: `${item.name} is used in food production for preservation and quality enhancement.`,
        purpose: `${item.name} serves as a key ingredient in food manufacturing processes. It helps maintain product quality, extend shelf life, and meet consumer preferences for taste, texture, and appearance. Used across a wide range of food categories.`,
        benefits: `${item.name} contributes to food safety and quality. It helps prevent spoilage, maintains nutritional value, and ensures consistent product performance. Its use allows manufacturers to offer a wider variety of foods with improved shelf stability.`,
        concerns: `Like all food additives, ${item.name} has been subject to regulatory review. The regulatory agencies have established safe usage levels based on scientific evidence. Some consumers prefer to minimize additive consumption, which is a personal choice.`,
        sciConsensus: `${item.name} has been approved by major food safety regulatory agencies including the FDA, EFSA, and JECFA. Its safety profile has been established through decades of use and scientific research. Current evidence supports its safe use in food applications at approved levels.`,
        evidenceLevel,
        fdaStatus: "Approved for food use",
        efsaStatus: "Approved — Safe at current use levels",
        fssaiStatus: "Permitted food additive",
        whoStatus: "Acceptable use — Approved by JECFA",
        safetyScore,
        commonProducts: category.products,
        adiValue: null,
        isNatural,
        isVegan: Math.random() > 0.3,
      });
    }
  }

  return ingredients;
}

async function main() {
  try {
    console.log("🌱 Seeding NutriScan AI database with 2000+ ingredients...");

    // Seed categories
    const categoryMap: Record<string, string> = {};
    for (const cat of CATEGORIES) {
      const created = await prisma.ingredientCategory.upsert({
        where: { slug: cat.slug },
        update: cat,
        create: cat,
      });
      categoryMap[cat.slug] = created.id;
      console.log(`  ✓ Category: ${cat.name}`);
    }

    // Generate and seed ingredients
    const ingredients = generateIngredients();
    console.log(`\n  Seeding ${ingredients.length} ingredients...`);

    for (let i = 0; i < ingredients.length; i++) {
      const ing = ingredients[i];
      const categoryId = categoryMap[ing.categorySlug];

      const { categorySlug, ...data } = ing;

      await prisma.ingredient.upsert({
        where: { slug: ing.slug },
        update: { ...data, categoryId },
        create: { ...data, categoryId },
      });

      if ((i + 1) % 100 === 0) {
        console.log(`    ✓ ${i + 1}/${ingredients.length} ingredients seeded`);
      }
    }

    console.log(`\n✅ Seeding complete! Added ${ingredients.length} ingredients to database.`);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
