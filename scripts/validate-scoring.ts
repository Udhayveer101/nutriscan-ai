// Large-scale sanity validation of the redesigned scoring engine against real products.
// Run: npx tsx scripts/validate-scoring.ts
import { evaluateProduct, detectAllergens } from "../lib/scoring";
import { _demo as additivesDemo } from "../lib/additives";
import { _demo as interactionsDemo } from "../lib/interactions";

interface Product { name: string; ingredients: string[]; expect: [number, number]; }

// Ingredient lists approximate real labels (descending weight order).
const PRODUCTS: Product[] = [
  { name: "Rolled Oats (plain)", ingredients: ["Whole Grain Rolled Oats"], expect: [82, 100] },
  { name: "Bananas", ingredients: ["Banana"], expect: [82, 100] },
  { name: "Plain Greek Yogurt", ingredients: ["Milk", "Live Cultures"], expect: [70, 100] },
  { name: "Canned Chickpeas", ingredients: ["Chickpeas", "Water", "Salt"], expect: [55, 92] },
  { name: "Lay's Classic Chips", ingredients: ["Potatoes", "Vegetable Oil", "Salt"], expect: [30, 60] },
  { name: "Oreo Cookies", ingredients: ["Sugar", "Enriched Flour", "Palm Oil", "Cocoa", "High Fructose Corn Syrup", "Soy Lecithin", "Artificial Flavor"], expect: [0, 40] },
  { name: "Coca-Cola", ingredients: ["Carbonated Water", "High Fructose Corn Syrup", "Caramel Color", "Phosphoric Acid", "Natural Flavor", "Caffeine"], expect: [0, 40] },
  { name: "Diet Soda w/ benzoate+vit C", ingredients: ["Carbonated Water", "Citric Acid", "Aspartame", "Sodium Benzoate", "Ascorbic Acid", "Yellow 5"], expect: [0, 30] },
  { name: "Bacon (cured)", ingredients: ["Pork", "Salt", "Sugar", "Sodium Nitrite"], expect: [0, 25] },
  { name: "Bread w/ potassium bromate", ingredients: ["Wheat Flour", "Water", "Yeast", "Salt", "Potassium Bromate"], expect: [0, 25] },
  { name: "Sugary Cereal", ingredients: ["Corn", "Sugar", "Corn Syrup", "Red 40", "Yellow 6", "BHT"], expect: [0, 35] },
  { name: "Sparkling Water", ingredients: ["Carbonated Water", "Natural Flavor"], expect: [55, 100] },
];

let fail = 0;
console.log("\n=== Scoring validation ===\n");
for (const p of PRODUCTS) {
  const r = evaluateProduct(p.ingredients.map((name, position) => ({ name, position })));
  const [lo, hi] = p.expect;
  const ok = r.overall >= lo && r.overall <= hi;
  if (!ok) fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${p.name.padEnd(34)} score=${String(r.overall).padStart(3)} (${r.gradeLabel})  NOVA${r.novaGroup} conf=${r.confidence}  expect ${lo}-${hi}`);
  if (r.interactions?.length) console.log(`        ⚠ interaction: ${r.interactions.map((i) => i.title).join("; ")}`);
  if (!ok) console.log(`        reasons: ${r.reasons?.join(" | ")}`);
}
additivesDemo(); interactionsDemo();

// Allergen detection self-check — word-boundary matching, no substring false positives.
{
  const hits = detectAllergens(["Sodium Benzoate", "Maltodextrin", "Sunflower Oil"]);
  if (hits.length !== 0) { fail++; console.log(`FAIL  allergen false positives: ${JSON.stringify(hits)}`); }
  const real = detectAllergens(["Enriched Wheat Flour", "Whey Powder", "Oats", "Soy Lecithin"]);
  const names = real.map((h) => h.allergen).sort();
  const want = ["Gluten / Wheat", "Milk / Dairy", "Soy"].sort();
  if (JSON.stringify(names) !== JSON.stringify(want)) { fail++; console.log(`FAIL  allergen misses: got ${JSON.stringify(names)}`); }
  if (fail === 0) console.log("allergen detection self-check OK");
}

console.log(`\n${fail === 0 ? "ALL PASS" : fail + " FAILED"}\n`);
process.exit(fail === 0 ? 0 : 1);
