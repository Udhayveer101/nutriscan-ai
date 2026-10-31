// Code and alias registry, applied to every seed row (core and batches) in index.ts.
//
// Goal: an OCR hit on any name, alias, E-number, INS number or CAS number links to exactly
// one canonical row. This file does three things, in order:
//   1. MERGED     drops rows that duplicate another row, folding their names into the keeper.
//   2. FIXES      per-row corrections: Codex sub-codes for salts that shared a family code,
//                 and aliases that pointed at a different ingredient.
//   3. backfill   generated aliases for every row: "E330"/"INS 330" forms of its code, the
//                 parts of a name like "Salt (Sodium Chloride)", US/UK spellings, and curated
//                 CAS numbers. A generated alias is only added when no other row owns it and
//                 the scanner routes it exactly like the row's name (so scores cannot change).
// scripts/check-db.ts verifies the result.
import type { SeedIngredient } from "./types";
import { lookupAdditive, extractCodes } from "../../lib/additives";
import { assessIngredient } from "../../lib/scoring";
import { normalizeKey, casChecksumOk } from "../../lib/ingredient-index";
import { CAS } from "./cas";

/** Duplicate row → the row it is merged into. The seed deletes the old DB row after re-pointing references. */
export const MERGED: Record<string, string> = {
  "red-3": "erythrosine",               // same dye (E127), two rows
  "vegetable-glycerin": "glycerol",     // same substance (E422); source is not a separate additive
};

interface Fix { eNumber?: string | null; add?: string[]; remove?: string[] }

/**
 * Per-row corrections. Sub-codes follow the Codex Class Names and International
 * Numbering System (CAC/GL 36-1989): each salt gets its own (i)/(ii)/(iii) code so a
 * label code links to one substance. The family code (E500, E341…) stays with the family row.
 */
export const FIXES: Record<string, Fix> = {
  // Carbonates (INS 500–503)
  "sodium-carbonate": { eNumber: "E500(i)", remove: ["E500"] },
  "sodium-bicarbonate": { eNumber: "E500(ii)", remove: ["E500"], add: ["sodium hydrogen carbonate"] },
  "sodium-sesquicarbonate": { eNumber: "E500(iii)", remove: ["E500iii"] },
  "potassium-carbonate": { eNumber: "E501(i)", remove: ["E501"] },
  "potassium-bicarbonate": { eNumber: "E501(ii)", remove: ["E501ii"], add: ["potassium hydrogen carbonate"] },
  "ammonium-carbonate": { eNumber: "E503(i)", remove: ["E503", "hartshorn", "baker's ammonia"] },
  "ammonium-bicarbonate": { eNumber: "E503(ii)", remove: ["E503"], add: ["ammonium hydrogen carbonate"] },
  // Calcium phosphates (INS 341) and diphosphates (INS 450)
  "monocalcium-phosphate": { eNumber: "E341(i)", remove: ["E341i"] },
  "dicalcium-phosphate": { eNumber: "E341(ii)", remove: ["E341ii"] },
  "sodium-acid-pyrophosphate": { eNumber: "E450(i)", remove: ["E450i"], add: ["disodium diphosphate", "disodium dihydrogen diphosphate"] },
  "tetrasodium-pyrophosphate": { eNumber: "E450(iii)", remove: ["E450"], add: ["tetrasodium diphosphate"] },
  // Cellulose (INS 460), sorbitol (420), maltitol (965)
  "microcrystalline-cellulose": { eNumber: "E460(i)", remove: ["E460"] },
  "powdered-cellulose": { eNumber: "E460(ii)", remove: ["E460ii"] },
  "sorbitol-syrup": { eNumber: "E420(ii)", remove: ["E420ii"] },
  "maltitol": { remove: ["maltitol syrup"] },
  "maltitol-syrup": { eNumber: "E965(ii)", remove: ["E965ii"] },
  // Tocopherols: E306 is the mixed-tocopherol extract; E307–E309 are the single forms.
  "tocopherols": { remove: ["E307", "E308", "E309", "alpha-tocopherol"] },
  // Lecithin E322 belongs to the generic row; soy lecithin is a source of it (keeps E322 for display).
  "soy-lecithin": { remove: ["E322", "Lecithin", "Sunflower Lecithin"], add: ["soya lecithin", "soybean lecithin"] },
  // Aliases that named a different ingredient.
  "vanilla-extract": { remove: ["vanillin"] },
  "starch": { remove: ["tapioca starch", "potato starch", "rice starch"] },
  "soy-protein": { remove: ["textured soy protein"] },
  "gelatin": { remove: ["hydrolyzed collagen"] },
  "ethylparaben": { remove: ["sodium ethyl p-hydroxybenzoate", "E215"] },
  "methylparaben": { remove: ["sodium methyl p-hydroxybenzoate", "E219"] },
  "modified-starch": { remove: ["E1400-E1450", "hydroxypropyl starch"] },
  "niacin": { remove: ["nicotinic acid"] },
  "nicotinic-acid": { remove: ["niacin", "vitamin B3"] },
  "beta-cyclodextrin": { remove: ["cyclodextrin"] },
  "cherry": { remove: ["sour cherries", "morello cherries"] },   // sour cherry is its own species (batch 30)
  "broccoli": { remove: ["tenderstem broccoli"] },             // tenderstem is broccolini (batch 31)
  "green-chilli": { remove: ["serrano chilli"] },              // serrano has its own row (batch 31)
  "cinnamon": { remove: ["cassia cinnamon"] },
  "sacha-inchi-oil": { remove: ["sacha inchi"] },
  "calcium-disodium-edta": { remove: ["disodium EDTA"] },        // E386 has its own row (batch 37)
  // Rows that came in without the code their substance carries (main's weekly batches).
  "magnesium-citrate": { eNumber: "E345" },
  "calcium-glycerophosphate": { eNumber: "E383" },
  "ferrous-carbonate": { eNumber: "E505" },
  "magnesium-sulphate": { eNumber: "E518" },
  "copper-sulphate": { eNumber: "E519" },
  "l-leucine": { eNumber: "E641" },
  "sodium-lauryl-sulfate": { eNumber: "E487" },
  "tannic-acid": { eNumber: "E181" },
  "papain": { eNumber: "E1101(ii)" },
  "bromelain": { eNumber: "E1101(iii)" },
  "glucose-oxidase": { eNumber: "E1102" },
  // STPP keeps the bare E451 most labels print; the potassium salt is E451(ii) (batch 37).
  "sodium-tripolyphosphate": { eNumber: "E451(i)", add: ["INS 451", "pentasodium triphosphate", "pentasodium tripolyphosphate"] },
  // Common label spellings that earlier rows were missing (from the label benchmark).
  "cumin-seed": { add: ["cumin", "cumin powder", "ground cumin"] },
  "vitamin-d": { add: ["vitamin d3", "vitamin d2", "ergocalciferol"] },
  "dextrose": { add: ["dextrose monohydrate", "anhydrous dextrose"] },
  "cocoa-powder": { add: ["cocoa", "cocoa solids"] },
  "bakers-yeast": { add: ["yeast", "active dry yeast", "instant yeast", "fresh yeast"] },
  "whole-milk-powder": { add: ["milk powder", "dried milk", "full cream milk powder"] },
  "cream": { add: ["double cream", "heavy cream", "whipping cream", "single cream", "fresh cream"] },
  "yoghurt": { add: ["plain yogurt", "dahi (curd)"] },
  "egg": { add: ["pasteurised egg", "pasteurized egg", "whole egg"] },              // the seed has its own row (batch 33)                 // cassia has its own row (batch 32)
  // Rows that had no alternative name or code.
  "maltodextrin": { add: ["maltodextrine", "malto-dextrin"] },
  "potato-starch": { add: ["native potato starch", "unmodified potato starch"] },
  "rice-starch": { add: ["native rice starch", "unmodified rice starch"] },
  "magnesium-gluconate": { eNumber: "E580" },
  "magnesium-lactate": { eNumber: "E329" },
  "magnesium-glycerophosphate": { add: ["magnesium glycerylphosphate"] },
  "zinc-picolinate": { add: ["zinc pyridine-2-carboxylate"] },
  "zinc-carbonate": { add: ["zinc(II) carbonate"] },
  "manganese-gluconate": { add: ["manganese(II) gluconate"] },
};

// ── Generated aliases ─────────────────────────────────────────────────────────

/** "e341ii" → ["E341(ii)", "INS 341(ii)"]; "e160a" → ["E160a", "INS 160a"]. */
export function codeForms(eNumber: string): string[] {
  const c = extractCodes(eNumber.toLowerCase())[0]?.[0];
  if (!c) return [];
  const m = /^e(\d{3,4})([a-h]?)([ivx]*)$/.exec(c);
  if (!m) return [];
  const code = `${m[1]}${m[2]}${m[3] ? `(${m[3]})` : ""}`;
  return [`E${code}`, `INS ${code}`];
}

const SPELLINGS: [RegExp, string][] = [
  [/sulph/g, "sulf"], [/sulf/g, "sulph"],
  [/colour/g, "color"], [/color/g, "colour"],
  [/flavour/g, "flavor"], [/flavor/g, "flavour"],
  [/fibre/g, "fiber"], [/fiber/g, "fibre"],
  [/aluminium/g, "aluminum"], [/aluminum/g, "aluminium"],
  [/hydrolysed/g, "hydrolyzed"], [/hydrolyzed/g, "hydrolysed"],
  [/oxidised/g, "oxidized"], [/oxidized/g, "oxidised"],
  [/stabiliser/g, "stabilizer"], [/stabilizer/g, "stabiliser"],
  [/yoghurt/g, "yogurt"], [/yogurt/g, "yoghurt"],
  [/\bchilli\b/g, "chili"], [/\bchili\b/g, "chilli"],
  [/glycerine/g, "glycerin"],
  [/caesium/g, "cesium"],
];

// Bracketed words that describe a role, not a substance ("Zinc Oxide (fortificant)").
const NOT_A_NAME = /^(?:colou?r|enzyme|fortificant|.*\bfortificant|class [ivx]+|food[- ]grade|natural|synthetic|processing aid|bulk|enzymatically produced|.*\bsalt\)?)$/i;

/** The scanner's verdict for a name: KB profile, bulk rule, whole food, or unrecognised. */
function route(name: string): string {
  const kb = lookupAdditive(name);
  if (kb) return `kb:${kb.id}`;
  const a = assessIngredient(name, 0);
  if (a.isWhole) return "whole";
  if (a.evidence === "INSUFFICIENT") return a.isAdditive ? "unknown-chemical" : "unknown";
  return `bulk:${a.reason}`;
}

export interface BackfillReport {
  merged: number;
  fixed: number;
  added: { code: number; namePart: number; spelling: number; cas: number };
  skipped: { alias: string; slug: string; why: string }[];
}

export function applyCodeRegistry(rows: SeedIngredient[]): { rows: SeedIngredient[]; report: BackfillReport } {
  const report: BackfillReport = { merged: 0, fixed: 0, added: { code: 0, namePart: 0, spelling: 0, cas: 0 }, skipped: [] };

  // 1. Merge duplicates.
  const bySlug = new Map(rows.map((r) => [r.slug, { ...r, aliases: [...r.aliases] }]));
  for (const [drop, keep] of Object.entries(MERGED)) {
    const d = bySlug.get(drop);
    const k = bySlug.get(keep);
    if (!d || !k) continue;
    k.aliases.push(d.name, ...d.aliases);
    bySlug.delete(drop);
    report.merged++;
  }
  // 2. Fixes.
  for (const [slug, fix] of Object.entries(FIXES)) {
    const r = bySlug.get(slug);
    if (!r) continue;
    if (fix.eNumber !== undefined) r.eNumber = fix.eNumber;
    if (fix.remove) {
      const rm = new Set(fix.remove.map(normalizeKey));
      r.aliases = r.aliases.filter((a) => !rm.has(normalizeKey(a)));
    }
    if (fix.add) r.aliases.push(...fix.add);
    report.fixed++;
  }
  const out = Array.from(bySlug.values());

  // Ownership: every name, then every explicit alias, claims its normalised key.
  const owner = new Map<string, string>();
  for (const r of out) if (!owner.has(normalizeKey(r.name))) owner.set(normalizeKey(r.name), r.slug);
  for (const r of out) for (const a of r.aliases) if (!owner.has(normalizeKey(a))) owner.set(normalizeKey(a), r.slug);
  // Code ownership: first explicit claimant of a code key (rows sharing a family code
  // are variants and must not each list it; scripts/check-db.ts reports conflicts).
  const codeOwner = new Map<string, string>();
  const codeKey = (s: string) => extractCodes(s.toLowerCase())[0]?.[0];
  for (const r of out) for (const a of r.aliases) { const c = codeKey(a); if (c && /^(?:e|ins)\s*-?\s*\d/i.test(a.trim()) && !codeOwner.has(c)) codeOwner.set(c, r.slug); }
  for (const r of out) { const c = r.eNumber && codeKey(r.eNumber); if (c && !codeOwner.has(c)) codeOwner.set(c, r.slug); }

  // 3. Backfill.
  for (const r of out) {
    const nameRoute = route(r.name);
    const tryAdd = (alias: string, kind: keyof BackfillReport["added"], checkRoute = true) => {
      const k = normalizeKey(alias);
      if (!k || k === normalizeKey(r.name)) return;
      if (r.aliases.some((a) => normalizeKey(a) === k)) return;
      const o = owner.get(k);
      if (o && o !== r.slug) { report.skipped.push({ alias, slug: r.slug, why: `owned by ${o}` }); return; }
      if (checkRoute && route(alias) !== nameRoute && !(kind === "code" && nameRoute.startsWith("unknown"))) { report.skipped.push({ alias, slug: r.slug, why: `routes to ${route(alias)}, name to ${nameRoute}` }); return; }
      r.aliases.push(alias);
      owner.set(k, r.slug);
      report.added[kind]++;
    };

    // Codes: only the row that owns the code gets its E/INS forms.
    if (r.eNumber) {
      const c = codeKey(r.eNumber);
      if (c && codeOwner.get(c) === r.slug) for (const f of codeForms(r.eNumber)) tryAdd(f, "code");
    }
    // Name parts: "Salt (Sodium Chloride)" → "Salt", "Sodium Chloride".
    const m = /^(.*?)\s*\(([^()]+)\)\s*$/.exec(r.name);
    if (m) {
      tryAdd(m[1], "namePart");
      if (!NOT_A_NAME.test(m[2]) && !/^(?:e|ins)\s*\d/i.test(m[2]) && m[2].replace(/[^a-z]/gi, "").length >= 4) tryAdd(m[2], "namePart");
    }
    // US/UK spellings of the name and every alias.
    for (const base of [r.name, ...r.aliases]) {
      const lower = base.toLowerCase();
      for (const [re, to] of SPELLINGS) {
        re.lastIndex = 0;
        if (re.test(lower)) { re.lastIndex = 0; tryAdd(lower.replace(re, to), "spelling"); }
      }
    }
    // CAS Registry Numbers (curated list; check digit verified).
    const cas = CAS[r.slug];
    if (cas && casChecksumOk(cas)) tryAdd(`CAS ${cas}`, "cas", false);
  }
  return { rows: out, report };
}
