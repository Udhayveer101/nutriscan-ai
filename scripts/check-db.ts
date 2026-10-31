// Ingredient database guardrail. Run: npx tsx scripts/check-db.ts
// Fails (exit 1) unless:
//   • there are more than 2,000 unique ingredient rows (unique slugs);
//   • no name or alias (after normalising case, accents and punctuation) belongs to two rows;
//   • no E/INS/CAS code links to two rows;
//   • every row that owns an additive code lists it as both "E…" and "INS …";
//   • every row has at least one alias, and every CAS alias has a valid check digit;
//   • every name, alias and code of every row links back to that same row through the
//     scanner's IngredientIndex (what an OCR hit on it would resolve to).
import { ALL_INGREDIENTS } from "../prisma/ingredients";
import { IngredientIndex, normalizeKey, codeKeys, casChecksumOk } from "../lib/ingredient-index";
import { codeForms } from "../prisma/ingredients/codes";

const MIN_ROWS = 2000;
const errors: string[] = [];
const err = (m: string) => errors.push(m);

// Unique rows.
const slugs = new Set<string>();
for (const r of ALL_INGREDIENTS) {
  if (slugs.has(r.slug)) err(`duplicate slug ${r.slug}`);
  slugs.add(r.slug);
}
if (slugs.size <= MIN_ROWS) err(`only ${slugs.size} unique ingredients; need more than ${MIN_ROWS}`);

// Names and aliases: one owner per normalised key.
const nameOwner = new Map<string, string>();
const isCodeText = (s: string) => /^\s*(?:(?:e|ins)\s*-?\s*\d{3,4}[a-z]?(?:\s*\(?\s*[ivx]{1,4}\s*\)?)?|cas\s*\d{2,7}-\d{2}-\d)\s*$/i.test(s);
for (const r of ALL_INGREDIENTS) {
  for (const n of new Set([r.name, ...r.aliases].filter((x) => !isCodeText(x)).map(normalizeKey))) {
    if (!n) continue;
    const prev = nameOwner.get(n);
    if (prev && prev !== r.slug) err(`"${n}" is a name/alias of both ${prev} and ${r.slug}`);
    else nameOwner.set(n, r.slug);
  }
}

// Codes: one owner per code key; owners list both E and INS forms.
const codeOwner = new Map<string, string>();
let codeRows = 0, casCount = 0;
for (const r of ALL_INGREDIENTS) {
  const keys = new Set<string>();
  for (const a of r.aliases.filter(isCodeText)) for (const c of codeKeys(a)) keys.add(c[0]);
  for (const k of Array.from(keys)) {
    const prev = codeOwner.get(k);
    if (prev && prev !== r.slug) err(`code ${k} is listed by both ${prev} and ${r.slug}`);
    else codeOwner.set(k, r.slug);
  }
  for (const a of r.aliases) {
    const cas = /^CAS (\S+)$/.exec(a)?.[1];
    if (cas) { casCount++; if (!casChecksumOk(cas)) err(`${r.slug}: CAS ${cas} fails its check digit`); }
  }
}
for (const r of ALL_INGREDIENTS) {
  if (!r.eNumber) continue;
  const own = codeKeys(r.eNumber)[0]?.[0];
  if (!own) { err(`${r.slug}: eNumber "${r.eNumber}" is not a valid code`); continue; }
  const owner = codeOwner.get(own);
  if (owner && owner !== r.slug) continue;           // a source variant of another row's code (e.g. soy lecithin, E322)
  codeRows++;
  const have = new Set(r.aliases.map(normalizeKey));
  for (const f of codeForms(r.eNumber)) if (!have.has(normalizeKey(f))) err(`${r.slug}: missing code alias "${f}"`);
}

// Every row has an alternative name or code.
for (const r of ALL_INGREDIENTS) if (!r.aliases.length) err(`${r.slug}: no aliases`);

// Round trip through the scanner's index.
const index = new IngredientIndex(ALL_INGREDIENTS.map((r) => ({ id: r.slug, slug: r.slug, name: r.name, aliases: r.aliases, eNumber: r.eNumber })));
for (const c of index.collisions) err(`index collision on "${c.key}": ${c.rows.join(" / ")}`);
let probes = 0;
for (const r of ALL_INGREDIENTS) {
  const owned = codeKeys(r.eNumber ?? "")[0]?.[0];
  const probesFor = [r.name, ...r.aliases, ...(owned && codeOwner.get(owned) === r.slug ? codeForms(r.eNumber!) : [])];
  for (const p of probesFor) {
    probes++;
    const m = index.matchExact(p);
    if (m?.row.slug !== r.slug) err(`"${p}" (${r.slug}) links to ${m?.row.slug ?? "nothing"}`);
  }
}

const aliasCount = ALL_INGREDIENTS.reduce((n, r) => n + r.aliases.length, 0);
for (const e of errors.slice(0, 200)) console.log(`ERROR ${e}`);
if (errors.length > 200) console.log(`… and ${errors.length - 200} more`);
console.log(`\n${slugs.size} unique ingredients, ${aliasCount} aliases, ${codeRows} rows owning an E/INS code, ${casCount} CAS numbers, ${probes} name/alias/code probes`);
console.log(errors.length ? `✗ ${errors.length} DB error(s)` : `✓ ingredient DB consistent (> ${MIN_ROWS} rows, no duplicates, every code and alias links to its row)`);
if (errors.length) process.exit(1);
