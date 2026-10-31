// Whole and minimally processed foods. These route through WHOLEFOOD_WORDS in
// lib/additives.ts (never a KB profile, which would count them as additives).
import type { SeedIngredient, SeedRef } from "./types";
import { family } from "./build";
import { fdc, paper } from "./refs";

export const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const IFCT: SeedRef = { title: "Indian Food Composition Tables 2017", authors: "Longvah T, Ananthan R, Bhaskarachary K, Venkaiah K", journal: "National Institute of Nutrition (ICMR), Hyderabad", year: 2017,
  findings: "Analytical nutrient composition of foods commonly eaten in India." };
export const AUNE_FV = paper("Aune D et al.", 2017, "Fruit and vegetable intake and the risk of cardiovascular disease, total cancer and all-cause mortality: a systematic review and dose-response meta-analysis of prospective studies", "International Journal of Epidemiology 46(3):1029–1056",
  "Higher fruit and vegetable intake (up to ~800 g/day) was associated with lower cardiovascular disease, cancer and all-cause mortality.", "10.1093/ije/dyw319");
export const AUNE_WG = paper("Aune D et al.", 2016, "Whole grain consumption and risk of cardiovascular disease, cancer, and all cause and cause specific mortality: systematic review and dose-response meta-analysis of prospective studies", "BMJ 353:i2716",
  "Each 90 g/day of whole grains was associated with lower risk of coronary heart disease, cardiovascular disease, cancer and all-cause mortality.", "10.1136/bmj.i2716");
export const AUNE_NUT = paper("Aune D et al.", 2016, "Nut consumption and risk of cardiovascular disease, total cancer, all-cause and cause-specific mortality: a systematic review and dose-response meta-analysis of prospective studies", "BMC Medicine 14:207",
  "A handful (28 g/day) of nuts was associated with lower coronary heart disease, cardiovascular disease, cancer and all-cause mortality.", "10.1186/s12916-016-0730-3");
export const AFSHIN_LEG = paper("Afshin A, Micha R, Khatibzadeh S, Mozaffarian D", 2014, "Consumption of nuts and legumes and risk of incident ischemic heart disease, stroke, and diabetes: a systematic review and meta-analysis", "American Journal of Clinical Nutrition 100(1):278–288",
  "Legume intake was associated with lower ischaemic heart disease risk.", "10.3945/ajcn.113.076901");

type Row = [name: string, aliases: string[], purposeShort: string, purpose: string, benefits: string, concerns: string, commonProducts: string[], safetyScore?: number, extra?: Partial<SeedIngredient> & { src?: "ifct" | "own" }];

/** Builds whole-food rows for one category. `fdcFinding` describes what FoodData Central records for the food. */
export const wholeFoods = (categorySlug: string, defaults: Partial<SeedIngredient> & { refs?: SeedRef[] }, fdcFinding = (n: string) => `Nutrient composition entry for ${n.toLowerCase()}.`) => {
  const make = family({
    categorySlug, evidenceLevel: "STRONG", isNatural: true, isVegan: true,
    sciConsensus: "A whole or minimally processed food. Scored as a positive contributor; no additive safety assessment applies.",
    fdaStatus: "Food (not regulated as an additive)", efsaStatus: "Food (not regulated as an additive)",
    fssaiStatus: "Food (FSS Act general provisions)", whoStatus: "No ADI (food)",
    ...defaults,
  });
  // src: "fdc" (default) cites FoodData Central, "ifct" the Indian tables, "own" only the family and row refs.
  return (rows: Row[], ref: "fdc" | "ifct" | "own" = "fdc"): SeedIngredient[] => rows.map(([name, aliases, purposeShort, purpose, benefits, concerns, commonProducts, safetyScore = 90, extra = {}]) => {
    const { src = ref, ...rest } = extra;
    const base = src === "fdc" ? [fdc(fdcFinding(name))] : src === "ifct" ? [IFCT] : [];
    return make({ slug: slugify(name), name, aliases, purposeShort, purpose, commonProducts, safetyScore,
      ...(benefits ? { benefits } : {}), ...(concerns ? { concerns } : {}),
      ...rest, refs: [...base, ...(rest.refs ?? [])] });
  });
};
