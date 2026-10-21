// Builders for ResearchReference rows that recur across batches. Each builder only
// covers a document whose identity is certain (regulation, CFR section, named opinion);
// volume/page/DOI are filled in only where they are known, never guessed.
import type { SeedRef } from "./types";

export const euAdditives = (findings: string): SeedRef => ({
  title: "Regulation (EC) No 1333/2008 on food additives (Union list, Annex II/III)",
  authors: "European Parliament and Council of the European Union",
  journal: "Official Journal of the European Union, L 354", year: 2008,
  url: "https://eur-lex.europa.eu/eli/reg/2008/1333/oj", findings,
});

export const euFlavourings = (findings: string): SeedRef => ({
  title: "Regulation (EC) No 1334/2008 on flavourings and certain food ingredients with flavouring properties",
  authors: "European Parliament and Council of the European Union",
  journal: "Official Journal of the European Union, L 354", year: 2008,
  url: "https://eur-lex.europa.eu/eli/reg/2008/1334/oj", findings,
});

export const euEnzymes = (findings: string): SeedRef => ({
  title: "Regulation (EC) No 1332/2008 on food enzymes",
  authors: "European Parliament and Council of the European Union",
  journal: "Official Journal of the European Union, L 354", year: 2008,
  url: "https://eur-lex.europa.eu/eli/reg/2008/1332/oj", findings,
});

export const euSolvents = (findings: string): SeedRef => ({
  title: "Directive 2009/32/EC on extraction solvents used in the production of foodstuffs and food ingredients",
  authors: "European Parliament and Council of the European Union",
  journal: "Official Journal of the European Union, L 141", year: 2009,
  url: "https://eur-lex.europa.eu/eli/dir/2009/32/oj", findings,
});

export const euFortification = (findings: string): SeedRef => ({
  title: "Regulation (EC) No 1925/2006 on the addition of vitamins and minerals and of certain other substances to foods",
  authors: "European Parliament and Council of the European Union",
  journal: "Official Journal of the European Union, L 404", year: 2006,
  url: "https://eur-lex.europa.eu/eli/reg/2006/1925/oj", findings,
});

export const euSupplements = (findings: string): SeedRef => ({
  title: "Directive 2002/46/EC on the approximation of the laws of the Member States relating to food supplements",
  authors: "European Parliament and Council of the European Union",
  journal: "Official Journal of the European Communities, L 183", year: 2002,
  url: "https://eur-lex.europa.eu/eli/dir/2002/46/oj", findings,
});

export const euNovelFoods = (findings: string): SeedRef => ({
  title: "Commission Implementing Regulation (EU) 2017/2470 establishing the Union list of novel foods",
  authors: "European Commission",
  journal: "Official Journal of the European Union, L 351", year: 2017,
  url: "https://eur-lex.europa.eu/eli/reg_impl/2017/2470/oj", findings,
});

export const euAllergens = (findings: string): SeedRef => ({
  title: "Regulation (EU) No 1169/2011 on the provision of food information to consumers (Annex II: substances causing allergies or intolerances)",
  authors: "European Parliament and Council of the European Union",
  journal: "Official Journal of the European Union, L 304", year: 2011,
  url: "https://eur-lex.europa.eu/eli/reg/2011/1169/oj", findings,
});

export const cfr = (section: string, title: string, findings: string): SeedRef => ({
  title: `21 CFR ${section} — ${title}`,
  authors: "U.S. Food and Drug Administration",
  journal: "Code of Federal Regulations, Title 21", year: 2024,
  url: `https://www.ecfr.gov/current/title-21/section-${section}`, findings,
});

export const efsa = (panel: string, title: string, year: number, findings: string, doi?: string): SeedRef => ({
  title, authors: `EFSA Panel on ${panel}`, journal: "EFSA Journal", year, findings, ...(doi ? { doi } : {}),
});

export const jecfa = (title: string, year: number, findings: string): SeedRef => ({
  title, authors: "Joint FAO/WHO Expert Committee on Food Additives (JECFA)", journal: "WHO Technical Report Series / WHO Food Additives Series", year, findings,
});

export const iarc = (volume: number, title: string, year: number, findings: string): SeedRef => ({
  title: `IARC Monographs Volume ${volume}: ${title}`,
  authors: "International Agency for Research on Cancer", journal: "IARC Monographs on the Identification of Carcinogenic Hazards to Humans",
  year, url: `https://publications.iarc.who.int/`, findings,
});

export const fdc = (findings: string): SeedRef => ({
  title: "FoodData Central",
  authors: "U.S. Department of Agriculture, Agricultural Research Service",
  journal: "USDA FoodData Central", year: 2019, url: "https://fdc.nal.usda.gov/", findings,
});

export const whoSugars = (findings: string): SeedRef => ({
  title: "Guideline: Sugars intake for adults and children",
  authors: "World Health Organization", journal: "WHO Guidelines", year: 2015,
  url: "https://www.who.int/publications/i/item/9789241549028", findings,
});

export const codexGsfa = (findings: string): SeedRef => ({
  title: "General Standard for Food Additives (CXS 192-1995) and Class Names and International Numbering System for Food Additives (CXG 36-1989)",
  authors: "Codex Alimentarius Commission", journal: "Codex Alimentarius", year: 1995,
  url: "https://www.fao.org/fao-who-codexalimentarius/codex-texts/dbs/gsfa/en/", findings,
});

export const fssaiAdditives = (findings: string): SeedRef => ({
  title: "Food Safety and Standards (Food Products Standards and Food Additives) Regulations, 2011",
  authors: "Food Safety and Standards Authority of India", journal: "Gazette of India", year: 2011,
  url: "https://www.fssai.gov.in/", findings,
});

export const paper = (authors: string, year: number, title: string, journal: string, findings: string, doi?: string): SeedRef => ({
  title, authors, journal, year, findings, ...(doi ? { doi } : {}),
});
