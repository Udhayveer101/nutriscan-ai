// Knowledge-base consistency guardrail. Run: npx tsx scripts/check-kb.ts
// Fails (exit 1) when two profiles claim the same keyword or E-number, or when a
// profile's own keyword resolves to a different profile (a shorter keyword hijacked
// by a longer one elsewhere). Seed rows whose name/E-number resolve to different
// profiles, or seed rows that collide or the scanner can't resolve, are reported too:
// errors for expansion rows, warnings for the older core rows.
import { ADDITIVES, lookupAdditive, type ConcernLevel } from "../lib/additives";
import { assessIngredient } from "../lib/scoring";
import { ALL_INGREDIENTS, EXPANSION_INGREDIENTS } from "../prisma/ingredients";
import { CATEGORIES } from "../prisma/ingredients/categories";

const errors: string[] = [];
const warnings: string[] = [];

const ids = new Map<string, number>();
for (const a of ADDITIVES) ids.set(a.id, (ids.get(a.id) ?? 0) + 1);
for (const [id, n] of Array.from(ids)) if (n > 1) errors.push(`duplicate profile id "${id}"`);

const kwOwner = new Map<string, string>();
const eOwner = new Map<string, string>();
for (const a of ADDITIVES) {
  for (const k of a.keywords) {
    if (k !== k.toLowerCase()) errors.push(`${a.id}: keyword "${k}" is not lowercase`);
    const prev = kwOwner.get(k);
    if (prev && prev !== a.id) errors.push(`keyword "${k}" on both ${prev} and ${a.id}`);
    kwOwner.set(k, a.id);
  }
  for (const e of a.eNumbers ?? []) {
    const prev = eOwner.get(e);
    if (prev && prev !== a.id) errors.push(`E-number ${e} on both ${prev} and ${a.id}`);
    eOwner.set(e, a.id);
  }
}

// Every keyword and E-number must resolve back to the profile that declares it.
for (const a of ADDITIVES) {
  for (const k of a.keywords) {
    const hit = lookupAdditive(k);
    if (hit?.id !== a.id) errors.push(`${a.id}: keyword "${k}" resolves to ${hit?.id ?? "nothing"}`);
  }
  for (const e of a.eNumbers ?? []) {
    const hit = lookupAdditive(e.toUpperCase());
    if (hit?.id !== a.id) errors.push(`${a.id}: ${e} resolves to ${hit?.id ?? "nothing"}`);
  }
}

// ── Seed rows (prisma/ingredients) ─────────────────────────────────────────────
// Core rows predate this check, so their problems are warnings; expansion rows
// (batch-NN.ts) must be clean.
const BAND: Record<ConcernLevel, [number, number]> = { CRITICAL: [3, 25], HIGH: [25, 45], MEDIUM: [45, 70], LOW: [70, 97] };
const RANK: Record<ConcernLevel, number> = { LOW: 0, MEDIUM: 1, HIGH: 2, CRITICAL: 3 };
const expansion = new Set(EXPANSION_INGREDIENTS.map((r) => r.slug));
const WHOLE_CATS = new Set(["spice-herb", "fruit", "vegetable", "grain", "legume", "nut-seed", "dairy-egg", "meat-seafood", "fungi-seaweed", "culture"]);
const nameOwner = new Map<string, string>();   // lowercase name/alias → slug
const codeOwner = new Map<string, string>();
const slugSeen = new Set<string>();
let rows = 0;
for (const r of ALL_INGREDIENTS) {
  rows++;
  const isNew = expansion.has(r.slug);
  const report = (msg: string) => (isNew ? errors : warnings).push(`seed ${r.slug}: ${msg}`);
  if (!CATEGORIES.some((c) => c.slug === r.categorySlug)) errors.push(`seed ${r.slug}: unknown categorySlug "${r.categorySlug}"`);
  if (slugSeen.has(r.slug)) errors.push(`duplicate seed slug "${r.slug}"`);
  slugSeen.add(r.slug);

  // One label name belongs to one row (the analysis route matches name/alias exactly).
  for (const n of new Set([r.name, ...r.aliases].map((x) => x.toLowerCase().trim()))) {
    const prev = nameOwner.get(n);
    if (prev && prev !== r.slug) report(`name/alias "${n}" already used by ${prev}`);
    else nameOwner.set(n, r.slug);
  }
  if (r.eNumber) {
    const prev = codeOwner.get(r.eNumber.toLowerCase());
    if (prev) report(`E-number ${r.eNumber} already used by ${prev}`);
    else codeOwner.set(r.eNumber.toLowerCase(), r.slug);
  }

  // Name and E-number must land on the same profile.
  const byName = lookupAdditive(r.name);
  const byCode = r.eNumber ? lookupAdditive(r.eNumber) : null;
  if (byName && byCode && byName.id !== byCode.id) report(`name → ${byName.id}, code ${r.eNumber} → ${byCode.id}`);
  if (r.eNumber && !byCode) report(`E-number ${r.eNumber} resolves to no profile`);
  if (!isNew) continue;

  // Gate 6: the scanner must recognise the label name, and aliases must not route elsewhere.
  const a = assessIngredient(r.name, 0);
  if (a.evidence === "INSUFFICIENT" && a.reason.startsWith("Unrecognised")) report(`name "${r.name}" is not recognised by the scanner`);
  for (const al of r.aliases) {
    const hit = lookupAdditive(al);
    if (hit && byName && hit.id !== byName.id) report(`alias "${al}" → ${hit.id}, name → ${byName.id}`);
    if (!hit && byName) report(`alias "${al}" escapes the KB profile ${byName.id} its name resolves to`);
    if (hit && !byName && a.isWhole) report(`alias "${al}" → ${hit.id}, but name is a whole food`);
    if (!hit && a.isWhole && !assessIngredient(al, 0).isWhole) report(`alias "${al}" is not recognised as the whole food its name is`);
    if (!byName && !a.isWhole && a.evidence !== "INSUFFICIENT" && assessIngredient(al, 0).reason !== a.reason) report(`alias "${al}" does not hit the same bulk rule as its name`);
  }
  // Whole-food categories must not resolve to a KB profile: any KB hit counts as an additive (NOVA 4).
  if (WHOLE_CATS.has(r.categorySlug) && byName) report(`whole food routes to KB profile ${byName.id}`);
  // Gate 5: a row with its own profile mirrors that profile's certainty.
  const own = ADDITIVES.find((p) => p.id === r.slug);
  if (own && own.evidence !== r.evidenceLevel) report(`evidenceLevel ${r.evidenceLevel} ≠ KB evidence ${own.evidence}`);
  // safetyScore sits in the band of the worst concern the scanner will apply.
  const worst = byName
    ? ([byName.dominant, byName.moderate, byName.trace] as ConcernLevel[]).reduce((x, y) => (RANK[y] > RANK[x] ? y : x))
    : a.concern;
  const [lo, hi] = BAND[worst];
  if (!Number.isInteger(r.safetyScore) || r.safetyScore < lo || r.safetyScore > hi) report(`safetyScore ${r.safetyScore} outside ${worst} band ${lo}-${hi}`);
  if (!r.refs?.length) report("no research references");
}

for (const w of warnings) console.log(`WARN  ${w}`);
for (const e of errors) console.log(`ERROR ${e}`);
console.log(`\n${ADDITIVES.length} profiles, ${kwOwner.size} keywords, ${eOwner.size} E-numbers, ${rows} seed rows (${EXPANSION_INGREDIENTS.length} expansion)`);
console.log(errors.length ? `✗ ${errors.length} KB error(s)` : "✓ KB consistent");
if (errors.length) process.exit(1);
