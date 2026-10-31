// All Ingredient seed rows. Expansion batches are appended to BATCHES in order.
import { INGREDIENTS, MORE_INGREDIENTS } from "./core";
import type { SeedIngredient } from "./types";
import { applyCodeRegistry } from "./codes";
import { BATCH_01 } from "./batch-01";
import { BATCH_02 } from "./batch-02";
import { BATCH_03 } from "./batch-03";
import { BATCH_04 } from "./batch-04";
import { BATCH_05 } from "./batch-05";
import { BATCH_06 } from "./batch-06";
import { BATCH_07 } from "./batch-07";
import { BATCH_08 } from "./batch-08";
import { BATCH_09 } from "./batch-09";
import { BATCH_10 } from "./batch-10";
import { BATCH_11 } from "./batch-11";
import { BATCH_12 } from "./batch-12";
import { BATCH_13 } from "./batch-13";
import { BATCH_14 } from "./batch-14";
import { BATCH_15 } from "./batch-15";
import { BATCH_16 } from "./batch-16";
import { BATCH_17 } from "./batch-17";
import { BATCH_18 } from "./batch-18";
import { BATCH_19 } from "./batch-19";
import { BATCH_20 } from "./batch-20";
import { BATCH_21 } from "./batch-21";
import { BATCH_22 } from "./batch-22";
import { BATCH_23 } from "./batch-23";
import { BATCH_24 } from "./batch-24";
import { BATCH_25 } from "./batch-25";
import { BATCH_26 } from "./batch-26";
import { BATCH_27 } from "./batch-27";
import { BATCH_28 } from "./batch-28";
import { BATCH_29 } from "./batch-29";
import { BATCH_30 } from "./batch-30";
import { BATCH_31 } from "./batch-31";
import { BATCH_32 } from "./batch-32";
import { BATCH_33 } from "./batch-33";
import { BATCH_34 } from "./batch-34";
import { BATCH_35 } from "./batch-35";
import { BATCH_36 } from "./batch-36";
import { BATCH_37 } from "./batch-37";
import { BATCH_38 } from "./batch-38";
import { BATCH_39 } from "./batch-39";

const BATCHES: SeedIngredient[][] = [
  BATCH_01,
  BATCH_02,
  BATCH_03,
  BATCH_04,
  BATCH_05,
  BATCH_06,
  BATCH_07,
  BATCH_08,
  BATCH_09,
  BATCH_10,
  BATCH_11,
  BATCH_12,
  BATCH_13,
  BATCH_14,
  BATCH_15,
  BATCH_16,
  BATCH_17,
  BATCH_18,
  BATCH_19,
  BATCH_20,
  BATCH_21,
  BATCH_22,
  BATCH_23,
  BATCH_24,
  BATCH_25,
  BATCH_26,
  BATCH_27,
  BATCH_28,
  BATCH_29,
  BATCH_30,
  BATCH_31,
  BATCH_32,
  BATCH_33,
  BATCH_34,
  BATCH_35,
  BATCH_36,
  BATCH_37,
  BATCH_38,
  BATCH_39,
];

export const CORE_INGREDIENTS: SeedIngredient[] = [...INGREDIENTS, ...MORE_INGREDIENTS].map((r) => ({
  ...r,
  eNumber: r.eNumber || null,
  adiValue: r.adiValue ?? null,
}));
const RAW_EXPANSION: SeedIngredient[] = BATCHES.flat();
const registry = applyCodeRegistry([...CORE_INGREDIENTS, ...RAW_EXPANSION]);

/** Every seed row after duplicate merges, code fixes and the alias/code backfill (codes.ts). */
export const ALL_INGREDIENTS: SeedIngredient[] = registry.rows;
export const CODE_REGISTRY_REPORT = registry.report;
const expansionSlugs = new Set(RAW_EXPANSION.map((r) => r.slug));
export const EXPANSION_INGREDIENTS: SeedIngredient[] = ALL_INGREDIENTS.filter((r) => expansionSlugs.has(r.slug));
