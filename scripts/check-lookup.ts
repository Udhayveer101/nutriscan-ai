// Equivalence guardrail for the indexed KB lookup. Run: npx tsx scripts/check-lookup.ts
// lookupAdditive (hash map + Aho–Corasick + cache) must return exactly what the original
// linear scan returns, for every keyword, code, seed name/alias and a few thousand
// realistic label strings built from them. Any difference fails the run.
import { ADDITIVES, lookupAdditive, lookupAdditiveLinear, WHOLEFOOD_WORDS } from "../lib/additives";
import { ALL_INGREDIENTS } from "../prisma/ingredients";

const inputs = new Set<string>();
for (const a of ADDITIVES) {
  for (const k of a.keywords) inputs.add(k).add(k.toUpperCase()).add(`${k}s`).add(`x${k}`).add(`${k}x`).add(`contains ${k} (2%)`);
  for (const e of a.eNumbers ?? []) {
    const d = e.slice(1);
    inputs.add(e).add(`E ${d}`).add(`INS ${d}`).add(`E-${d}`).add(`emulsifier (${d})`).add(`colour (${e.toUpperCase()})`);
  }
}
for (const r of ALL_INGREDIENTS) for (const n of [r.name, ...r.aliases]) inputs.add(n).add(`${n} (${r.eNumber ?? "x"})`);
for (const w of WHOLEFOOD_WORDS) inputs.add(w);
// Pairwise mash-ups catch longest-match and tie-break differences.
const kws = ADDITIVES.flatMap((a) => a.keywords);
let seed = 7;
const rnd = (n: number) => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed % n; };
for (let i = 0; i < 5000; i++) inputs.add(`${kws[rnd(kws.length)]} ${kws[rnd(kws.length)]}`);
for (let i = 0; i < 2000; i++) inputs.add(`${kws[rnd(kws.length)]}${kws[rnd(kws.length)]}`);

let diff = 0;
for (const s of Array.from(inputs)) {
  const a = lookupAdditive(s)?.id ?? null;
  const b = lookupAdditiveLinear(s)?.id ?? null;
  const again = lookupAdditive(s)?.id ?? null;   // cached path
  if (a !== b || again !== b) {
    diff++;
    if (diff <= 20) console.log(`DIFF "${s}": indexed=${a} cached=${again} linear=${b}`);
  }
}
console.log(`${inputs.size} inputs compared`);
if (diff) { console.log(`✗ ${diff} difference(s)`); process.exit(1); }
console.log("✓ indexed lookup identical to linear scan");
