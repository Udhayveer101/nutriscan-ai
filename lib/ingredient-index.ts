// In-memory index that links an OCR'd label name to one canonical Ingredient row.
//
// Built once per server instance from every row's name, aliases and codes, so a scan
// resolves each detected ingredient with hash lookups instead of asking Postgres to
// compare every row case-insensitively. Resolution order, cheapest and safest first:
//
//   1. exact     normalised name or alias            "Soy Lecithin", "INS 322" (as alias)
//   2. code      E / INS / CAS code anywhere in text   "Emulsifier (322)", "E339(ii)", "CAS 77-92-9"
//   3. cleaned   text outside / inside brackets,      "Ascorbic Acid (Vitamin C)", "Sugar 12%",
//                percentages and plurals stripped     "Emulsifier (Soy Lecithin)", "Almond"
//   4. fuzzy     OCR typos, via a trigram index plus  "Potassium Sorbale" → Potassium Sorbate
//                a bounded edit-distance check
//
// Fuzzy matching only accepts a single clear winner whose numbers and chemical suffix
// (-ate/-ite/-ide…) are unchanged, so "sodium nitrte" (equally close to nitrite and
// nitrate) and "polysorbate 60" vs "80" never link to the wrong substance.
import { extractCodes } from "./additives";

export interface IndexRow {
  id: string;
  slug: string;
  name: string;
  aliases: string[];
  eNumber: string | null;
}

export type MatchVia = "exact" | "code" | "cleaned" | "fuzzy";

export interface IndexMatch<R extends IndexRow = IndexRow> {
  row: R;
  via: MatchVia;
  /** The normalised key that matched (for logging and tests). */
  key: string;
}

/** Lowercase, strip accents, and collapse everything except letters and digits to single spaces. */
export function normalizeKey(s: string): string {
  return s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const CAS_RE = /\b(\d{2,7})-(\d{2})-(\d)\b/g;

/** Valid CAS Registry Number check digit. */
export function casChecksumOk(cas: string): boolean {
  const m = /^(\d{2,7})-(\d{2})-(\d)$/.exec(cas);
  if (!m) return false;
  const digits = (m[1] + m[2]).split("").reverse();
  const sum = digits.reduce((acc, d, i) => acc + Number(d) * (i + 1), 0);
  return sum % 10 === Number(m[3]);
}

/** All additive codes in a string, each as its candidates most-specific first ("e339ii", "e339"). */
export function codeKeys(text: string): string[][] {
  const lower = text.toLowerCase();
  const out = extractCodes(lower);
  // A bare code alias such as "INS 330" or "E 330" is handled by extractCodes; CAS numbers here.
  for (const m of Array.from(lower.matchAll(CAS_RE))) out.push([`cas ${m[1]}-${m[2]}-${m[3]}`]);
  return out;
}

// ── Fuzzy helpers ─────────────────────────────────────────────────────────────

function trigrams(key: string): string[] {
  const s = ` ${key} `;
  const out = new Set<string>();
  for (let i = 0; i + 3 <= s.length; i++) out.add(s.slice(i, i + 3));
  return Array.from(out);
}

/** Levenshtein distance, abandoning early once it must exceed `max`. */
export function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      cur.push(v);
      if (v < rowMin) rowMin = v;
    }
    if (rowMin > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}

const allowedEdits = (len: number) => (len < 5 ? 0 : len < 10 ? 1 : 2);
const DIGITS = (s: string) => s.replace(/[^0-9]+/g, " ").trim();
// Chemical endings that name different substances: nitrite ≠ nitrate, sulphide ≠ sulphite.
const SUFFIX = /(ate|ite|ide|ine|ene|ane|ol|ose|one|ium)$/;
// Count prefixes: di- vs tri- sodium phosphate are different salts.
const COUNT_PREFIX = /^(mono|di|tri|tetra|penta|hexa|hepta|octa|poly)/;

function safeFuzzyPair(q: string, k: string): boolean {
  if (DIGITS(q) !== DIGITS(k)) return false;
  const qt = q.split(" ");
  const kt = k.split(" ");
  if (qt.length !== kt.length) return false;
  for (let i = 0; i < qt.length; i++) {
    if (qt[i] === kt[i]) continue;
    const qs = SUFFIX.exec(qt[i])?.[1];
    const ks = SUFFIX.exec(kt[i])?.[1];
    if (qs && ks && qs !== ks) return false;
    const qp = COUNT_PREFIX.exec(qt[i])?.[1];
    const kp = COUNT_PREFIX.exec(kt[i])?.[1];
    if ((qp || kp) && qp !== kp) return false;
  }
  return true;
}

// ── Index ────────────────────────────────────────────────────────────────────

export class IngredientIndex<R extends IndexRow = IndexRow> {
  readonly rows: R[];
  private readonly exact = new Map<string, number>();
  private readonly codes = new Map<string, number>();
  private readonly fuzzyKeys: string[] = [];
  private readonly fuzzyRow: number[] = [];
  private readonly grams = new Map<string, number[]>();
  /** Keys claimed by two different rows; they resolve to neither (validation reports them). */
  readonly collisions: { key: string; rows: [string, string] }[] = [];

  constructor(rows: R[]) {
    this.rows = rows;
    rows.forEach((r, i) => {
      const claim = (map: Map<string, number>, key: string) => {
        if (!key) return;
        const prev = map.get(key);
        if (prev === undefined) map.set(key, i);
        else if (prev !== i && prev !== -1) {
          this.collisions.push({ key, rows: [rows[prev].slug, r.slug] });
          map.set(key, -1);
        }
      };
      const names = [r.name, ...r.aliases];
      for (const n of names) {
        const codeOnly = /^\s*(?:(?:e|ins)\s*-?\s*\d{3,4}[a-z]?(?:\s*\(?\s*[ivx]{1,4}\s*\)?)?|cas\s*\d{2,7}-\d{2}-\d)\s*$/i.test(n);
        if (!codeOnly) claim(this.exact, normalizeKey(n));
      }
      // Codes: the eNumber field and any code written as an alias ("INS 330", "E330", "CAS 77-92-9").
      const codeTexts = [r.eNumber ?? "", ...r.aliases.filter((a) => /\d/.test(a))];
      for (const t of codeTexts) {
        const found = codeKeys(t);
        // Only an alias that IS a code counts; "Polysorbate 80" contains no code token.
        for (const cands of found) claim(this.codes, cands[0]);
      }
    });
    // Fuzzy keys: names and word aliases long enough to fuzz safely.
    rows.forEach((r, i) => {
      for (const n of [r.name, ...r.aliases]) {
        const k = normalizeKey(n);
        if (k.length < 5 || this.exact.get(k) !== i) continue;
        const id = this.fuzzyKeys.length;
        this.fuzzyKeys.push(k);
        this.fuzzyRow.push(i);
        for (const g of trigrams(k)) {
          let list = this.grams.get(g);
          if (!list) this.grams.set(g, (list = []));
          list.push(id);
        }
      }
    });
  }

  get size(): number {
    return this.rows.length;
  }

  private hit(map: Map<string, number>, key: string): R | null {
    const i = map.get(key);
    return i === undefined || i < 0 ? null : this.rows[i];
  }

  /** Exact name/alias, then codes. No cleaning, no fuzz. */
  matchExact(raw: string): IndexMatch<R> | null {
    const key = normalizeKey(raw);
    const row = this.hit(this.exact, key);
    if (row) return { row, via: "exact", key };
    for (const cands of codeKeys(raw)) {
      for (const c of cands) {
        const r = this.hit(this.codes, c);
        if (r) return { row: r, via: "code", key: c };
      }
    }
    return null;
  }

  match(raw: string, opts: { fuzzy?: boolean } = {}): IndexMatch<R> | null {
    const direct = this.matchExact(raw);
    if (direct) return direct;

    // Cleaned variants: outside brackets, then each bracket's content; minus % and plurals.
    const lower = raw.toLowerCase();
    const outside = lower.replace(/\([^)]*\)|\[[^\]]*\]|\{[^}]*\}/g, " ");
    const inside = Array.from(lower.matchAll(/\(([^)]*)\)|\[([^\]]*)\]/g)).map((m) => m[1] ?? m[2]);
    const variants: string[] = [];
    for (const v of [outside, ...inside]) {
      const k = normalizeKey(v.replace(/\d+(?:[.,]\d+)?\s*%/g, " ").replace(/^\s*(?:contains|and|with)\s+/, ""));
      if (!k) continue;
      variants.push(k);
      if (k.endsWith("ies")) variants.push(k.slice(0, -3) + "y");
      else if (k.endsWith("es")) variants.push(k.slice(0, -2), k.slice(0, -1));
      else if (k.endsWith("s")) variants.push(k.slice(0, -1));
      else variants.push(k + "s");
    }
    for (const k of variants) {
      const row = this.hit(this.exact, k);
      if (row) return { row, via: "cleaned", key: k };
    }

    if (opts.fuzzy === false) return null;
    return this.fuzzy(normalizeKey(outside) || normalizeKey(raw));
  }

  /** Trigram candidates, verified by bounded edit distance; returns only a unique best. */
  fuzzy(key: string): IndexMatch<R> | null {
    const max = allowedEdits(key.length);
    if (!max) return null;
    const qg = trigrams(key);
    const shared = new Map<number, number>();
    for (const g of qg) {
      const list = this.grams.get(g);
      if (!list) continue;
      for (const id of list) shared.set(id, (shared.get(id) ?? 0) + 1);
    }
    // With d edits a string keeps at least |grams| - 3d of its trigrams.
    const need = Math.max(1, qg.length - 3 * max);
    let best = -1;
    let bestD = max + 1;
    let tie = false;
    for (const [id, n] of Array.from(shared)) {
      if (n < need) continue;
      const k = this.fuzzyKeys[id];
      const d = editDistance(key, k, max);
      if (d > max || d > allowedEdits(k.length)) continue;
      if (d < bestD) {
        best = id;
        bestD = d;
        tie = false;
      } else if (d === bestD && this.fuzzyRow[id] !== this.fuzzyRow[best]) {
        tie = true;
      }
    }
    if (best < 0 || tie || !safeFuzzyPair(key, this.fuzzyKeys[best])) return null;
    return { row: this.rows[this.fuzzyRow[best]], via: "fuzzy", key: this.fuzzyKeys[best] };
  }
}
