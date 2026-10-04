// Knowledge-base consistency guardrail. Run: npx tsx scripts/check-kb.ts
// Fails (exit 1) when two profiles claim the same keyword or E-number, or when a
// profile's own keyword resolves to a different profile (a shorter keyword hijacked
// by a longer one elsewhere). Seed rows whose name/E-number resolve to different
// profiles are reported as warnings.
import * as fs from "fs";
import * as path from "path";
import { ADDITIVES, lookupAdditive } from "../lib/additives";

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

// Seed rows: the row name and its E-number should land on the same profile.
const seed = fs.readFileSync(path.join(__dirname, "../prisma/seed.ts"), "utf8");
const ROW = /name:\s*"([^"]+)"[\s\S]*?eNumber:\s*(?:"([^"]*)"|null)/g;
let rows = 0;
for (const m of Array.from(seed.matchAll(ROW))) {
  const [, name, eNumber] = m;
  if (!eNumber) continue;
  rows++;
  const byName = lookupAdditive(name);
  const byCode = lookupAdditive(eNumber);
  if (byName && byCode && byName.id !== byCode.id) {
    warnings.push(`seed "${name}" (${eNumber}): name → ${byName.id}, code → ${byCode.id}`);
  }
}

for (const w of warnings) console.log(`WARN  ${w}`);
for (const e of errors) console.log(`ERROR ${e}`);
console.log(`\n${ADDITIVES.length} profiles, ${kwOwner.size} keywords, ${eOwner.size} E-numbers, ${rows} seed rows with codes checked`);
console.log(errors.length ? `✗ ${errors.length} KB error(s)` : "✓ KB consistent");
if (errors.length) process.exit(1);
