// Shape of one Ingredient seed row. Every row must also resolve in the scanner
// (lookupAdditive, a bulk rule, or WHOLEFOOD_KEYWORDS); scripts/check-kb.ts enforces it.

export type EvidenceLevel = "STRONG" | "MODERATE" | "LIMITED" | "INSUFFICIENT";

// One ResearchReference row. Only real documents; an identifier we could not
// confirm is left out rather than guessed.
export interface SeedRef {
  title: string;
  authors: string;
  journal: string;   // journal, or the issuing authority/series
  year: number;
  doi?: string;
  url?: string;
  findings: string;
}

export interface SeedIngredient {
  slug: string;
  name: string;
  aliases: string[];
  eNumber: string | null;
  categorySlug: string;
  purposeShort: string;
  purpose: string;
  benefits: string;
  concerns: string;
  sciConsensus: string;
  evidenceLevel: EvidenceLevel;
  fdaStatus: string;
  efsaStatus: string;
  fssaiStatus: string;
  whoStatus: string;
  safetyScore: number;
  commonProducts: string[];
  adiValue: string | null;
  isNatural: boolean;
  isVegan: boolean;
  isOrganic?: boolean;
  refs?: SeedRef[];
}
