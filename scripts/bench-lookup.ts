// Ingredient-lookup benchmark: before (linear KB scan + case-insensitive OR query over the
// whole Ingredient table) vs after (indexed KB lookup + in-memory IngredientIndex + fetch by
// primary key). Run: npx tsx scripts/bench-lookup.ts
// The DB half needs DATABASE_URL pointing at a seeded database; it is skipped otherwise.
import { PrismaClient } from "@prisma/client";
import { lookupAdditive, lookupAdditiveLinear } from "../lib/additives";
import { IngredientIndex } from "../lib/ingredient-index";

// Realistic OCR'd labels: plain names, E/INS codes, aliases, bracketed codes, typos.
export const LABELS: string[][] = [
  ["Sugar", "Enriched Flour", "Palm Oil", "Cocoa", "High Fructose Corn Syrup", "Soy Lecithin", "Artificial Flavor", "Salt", "Baking Soda"],
  ["Carbonated Water", "High Fructose Corn Syrup", "Caramel Color", "Phosphoric Acid", "Natural Flavor", "Caffeine"],
  ["Carbonated Water", "Citric Acid", "Aspartame", "Sodium Benzoate", "Ascorbic Acid", "Yellow 5"],
  ["Wheat Flour", "Water", "Yeast", "Salt", "Potassium Bromate", "E471", "INS 282", "Ascorbic Acid (E300)"],
  ["Corn", "Sugar", "Corn Syrup", "Red 40", "Yellow 6", "BHT", "Trisodium Phosphate", "Vitamin D3"],
  ["Milk Solids", "Sugar", "Cocoa Butter", "Emulsifier (322)", "INS 476", "E1442", "Stabiliser (INS 415)", "Raising Agent (500(ii))"],
  ["Potatoes", "Vegetable Oil", "Salt", "Monosodium Glutamate", "E627", "E631", "Maltodextrin", "Onion Powder", "Garlic Powder"],
  ["Refined Wheat Flour (Maida)", "Palm Oil", "Sugar", "Invert Syrup", "Leavening Agents [503(ii), 500(ii)]", "Iodised Salt", "Milk Solids", "Emulsifiers (E322, E471)", "Artificial Flavouring Substances (Vanilla)"],
  ["Water", "Sugar", "Acidity Regulator (330)", "Preservative (211)", "Sucralose", "Acesulfame K", "Colour (E129)", "Potassium Sorbate"],
  ["Pork", "Salt", "Sugar", "Sodium Nitrite", "Sodium Erythorbate", "Smoke Flavouring", "E250", "Carrageenan"],
  ["Chickpeas", "Tahini", "Olive Oil", "Lemon Juice", "Garlic", "Cumin", "Xanthan Gum", "Guar Gum", "Polysorbate 80"],
  ["Oats", "Honey", "Almonds", "Sunflower Oil", "Tocopherols", "Rosemary Extract", "Natural Vanilla Flavour", "Sea Salt", "Molasses"],
  ["Potassium Sorbale", "Sodium Benzoafe", "Xanthan Gurn", "Maltodextrine", "Citric Acld", "Soya Lecithin", "Dextrose Monohydrate"],
];
const NAMES = LABELS.flat();

const time = (fn: () => void, reps: number) => { const t = performance.now(); for (let i = 0; i < reps; i++) fn(); return (performance.now() - t) / reps; };
const f = (n: number, d = 3) => n.toFixed(d);

// ── KB lookup (scoring path) ─────────────────────────────────────────────────
// Uncached comparison: lowercase variants defeat the cache so every call does real work.
let v = 0;
const fresh = () => NAMES.map((n) => `${n} ${(v++).toString(36)}`);
lookupAdditive("warm-up");
const linUs = (time(() => { for (const n of fresh()) lookupAdditiveLinear(n); }, 20) / NAMES.length) * 1000;
const idxUs = (time(() => { for (const n of fresh()) lookupAdditive(n); }, 20) / NAMES.length) * 1000;
const hotUs = (time(() => { for (const n of NAMES) lookupAdditive(n); }, 200) / NAMES.length) * 1000;
console.log("\n=== KB additive lookup, per ingredient name ===");
console.log(`  linear scan (before)     ${f(linUs, 1).padStart(7)} µs`);
console.log(`  indexed, first sight     ${f(idxUs, 1).padStart(7)} µs   (${f(linUs / idxUs, 0)}× faster)`);
console.log(`  indexed, repeat (cache)  ${f(hotUs, 2).padStart(7)} µs`);

// ── DB linking ───────────────────────────────────────────────────────────────
(async () => {
  if (!process.env.DATABASE_URL) { console.log("\n(no DATABASE_URL — skipping the DB benchmark)"); return; }
  const prisma = new PrismaClient();
  const before = async (ex: string[]) => {
    const all = await prisma.ingredient.findMany({
      where: { OR: ex.flatMap((name) => [{ name: { equals: name, mode: "insensitive" as const } }, { eNumber: { equals: name, mode: "insensitive" as const } }]) },
      include: { category: true },
    });
    return ex.map((name) => { const l = name.toLowerCase(); return all.find((r) => r.name.toLowerCase() === l || r.eNumber?.toLowerCase() === l || r.aliases.some((a) => a.toLowerCase() === l)) ?? null; });
  };
  let t = performance.now();
  const rows = await prisma.ingredient.findMany({ select: { id: true, slug: true, name: true, aliases: true, eNumber: true } });
  const loadMs = performance.now() - t;
  t = performance.now();
  const index = new IngredientIndex(rows);
  const buildMs = performance.now() - t;
  const after = async (ex: string[]) => {
    const m = ex.map((n) => index.match(n));
    const ids = Array.from(new Set(m.flatMap((x) => (x ? [x.row.id] : []))));
    const got = ids.length ? await prisma.ingredient.findMany({ where: { id: { in: ids } }, include: { category: true } }) : [];
    const byId = new Map(got.map((r) => [r.id, r]));
    return m.map((x) => (x ? byId.get(x.row.id) ?? null : null));
  };
  for (const l of LABELS) { await before(l); await after(l); }   // warm connections and plans
  const REPS = 20;
  const run = async (fn: (l: string[]) => Promise<unknown[]>) => {
    const t0 = performance.now();
    for (let k = 0; k < REPS; k++) for (const l of LABELS) await fn(l);
    return (performance.now() - t0) / (REPS * LABELS.length);
  };
  const bMs = await run(before);
  const aMs = await run(after);
  const matchUs = (time(() => { for (const n of NAMES) index.match(n); }, 200) / NAMES.length) * 1000;
  let bHit = 0, aHit = 0;
  for (const l of LABELS) { bHit += (await before(l)).filter(Boolean).length; aHit += (await after(l)).filter(Boolean).length; }
  console.log(`\n=== DB linking, per label (${rows.length} ingredient rows, local Postgres) ===`);
  console.log(`  before: OR of case-insensitive equals   ${f(bMs, 2).padStart(7)} ms   recognised ${bHit}/${NAMES.length}`);
  console.log(`  after:  index match + fetch by id        ${f(aMs, 2).padStart(7)} ms   recognised ${aHit}/${NAMES.length}`);
  console.log(`  index match alone                       ${f(matchUs, 1).padStart(7)} µs per name`);
  console.log(`  one-off per server instance: load ${f(loadMs, 1)} ms + build ${f(buildMs, 1)} ms`);
  console.log("  (production adds network round-trips to the hosted DB; both paths make one query per scan)");
  await prisma.$disconnect();
})();
