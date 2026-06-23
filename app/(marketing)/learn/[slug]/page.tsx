import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, BookOpen } from "lucide-react";
import type { Metadata } from "next";

interface ArticleSection {
  type: "intro" | "section" | "subsection" | "list" | "highlight" | "warning" | "table";
  title?: string;
  content?: string;
  items?: string[];
  rows?: { label: string; value: string; note?: string }[];
}

interface Article {
  title: string;
  category: string;
  readTime: number;
  emoji: string;
  tagline: string;
  sections: ArticleSection[];
}

const ARTICLES: Record<string, Article> = {
  "how-we-score": {
    title: "How NutriScan AI Scores Ingredients",
    category: "Methodology",
    readTime: 5,
    emoji: "📊",
    tagline: "A transparent look at our A+ to F grading system and the six factors behind every score.",
    sections: [
      {
        type: "intro",
        content:
          "Our scoring system is designed to give you a fair, balanced, and evidence-based picture of any food product. We never aim to alarm — only to inform. Every score is a composite of six weighted dimensions, each grounded in nutritional science and regulatory standards.",
      },
      {
        type: "table",
        title: "Grade Scale",
        rows: [
          { label: "A+", value: "90–100", note: "Minimal additives, predominantly natural ingredients" },
          { label: "A", value: "80–89", note: "Very good profile, minor well-studied additives" },
          { label: "B", value: "70–79", note: "Decent product, some additives at acceptable levels" },
          { label: "C", value: "55–69", note: "Mixed profile with notable additives" },
          { label: "D", value: "40–54", note: "Higher additive density — worth being aware of" },
          { label: "F", value: "0–39", note: "Significant additive concerns or ultra-processed" },
        ],
      },
      {
        type: "section",
        title: "The Six Scoring Dimensions",
        content: "Each product is evaluated across six weighted categories. Here's exactly how the maths works:",
      },
      {
        type: "list",
        items: [
          "Ingredient Quality (30%) — Each ingredient's individual safety score from our database. Natural, minimally processed ingredients score higher.",
          "Additive Density (25%) — We count artificial preservatives, colorings, and sweeteners. More artificial additives = lower score.",
          "Processing Level (20%) — Based on the NOVA classification. Ultra-processed foods receive significant penalties.",
          "Sugar Content (10%) — Evaluated against WHO recommendations of under 10% of daily calories from added sugar.",
          "Sodium Content (10%) — Assessed against recommended daily sodium intake levels.",
          "Concern Penalties (5%) — Ingredients with HIGH individual concern ratings receive additional deductions.",
        ],
      },
      {
        type: "highlight",
        title: "What We Never Do",
        content:
          "We never label an ingredient as 'dangerous' unless there is strong scientific consensus supporting that characterisation. We always present balanced information with cited sources. Our scores are population-level assessments, not personal medical recommendations.",
      },
    ],
  },

  "our-methodology": {
    title: "Our Methodology",
    category: "Methodology",
    readTime: 8,
    emoji: "🔍",
    tagline: "The scientific approach behind NutriScan AI's ingredient database, evidence standards, and AI analysis.",
    sections: [
      {
        type: "intro",
        content:
          "NutriScan AI was built on one principle: every claim must be backed by evidence. Our methodology draws from regulatory science, peer-reviewed research, and established nutritional frameworks to deliver analysis you can trust.",
      },
      {
        type: "section",
        title: "Data Sources",
        content: "Our ingredient database is built from the following authoritative sources:",
      },
      {
        type: "list",
        items: [
          "FDA GRAS Database — Generally Recognised as Safe designations for US food additives.",
          "EFSA Food Additives Database — European Food Safety Authority re-evaluations and opinions.",
          "WHO/JECFA Reports — Joint FAO/WHO Expert Committee on Food Additives assessments.",
          "FSSAI Standards — Food Safety and Standards Authority of India permitted additives list.",
          "PubMed peer-reviewed literature — For individual ingredient safety and efficacy research.",
        ],
      },
      {
        type: "section",
        title: "Evidence Standards",
        content:
          "We assign every ingredient an evidence level that reflects how well-studied its safety profile is:",
      },
      {
        type: "list",
        items: [
          "Strong Evidence — Multiple large human studies, meta-analyses, and consistent regulatory consensus.",
          "Moderate Evidence — Several studies with generally consistent findings, regulatory approval.",
          "Limited Evidence — Some studies exist but results are mixed or populations studied are small.",
          "Insufficient Evidence — Very few studies; regulatory status uncertain or under review.",
        ],
      },
      {
        type: "section",
        title: "AI Explanation Pipeline",
        content:
          "When you scan a product, our AI (Google Gemini) is given strict instructions to remain evidence-based. It is explicitly prohibited from making unsupported medical claims and is prompted to present balanced information at the appropriate complexity level for your chosen mode.",
      },
      {
        type: "highlight",
        title: "Scientific Integrity Commitment",
        content:
          "NutriScan AI is an educational tool, not a medical device. We commit to updating ingredient profiles as new research emerges, always citing our sources, and never overstating the strength of evidence.",
      },
    ],
  },


  "preservatives-explained": {
    title: "Preservatives Explained",
    category: "Additives",
    readTime: 7,
    emoji: "🧪",
    tagline: "From sodium benzoate to potassium sorbate — what preservatives actually do and what the science says.",
    sections: [
      {
        type: "intro",
        content:
          "Before refrigeration, food spoilage caused widespread illness and waste. Preservatives extend shelf life by inhibiting bacteria, moulds, yeasts, and oxidation. Here's what you need to know about the most common ones.",
      },
      {
        type: "section",
        title: "Sodium Benzoate (E211)",
        content:
          "One of the most widely used preservatives in acidic beverages and condiments. FDA status: GRAS. When combined with vitamin C in acidic drinks, it can form trace amounts of benzene — but levels detected are consistently well below safety limits. The EFSA confirmed safety at current use levels in 2016.",
      },
      {
        type: "section",
        title: "Potassium Sorbate (E202)",
        content:
          "Naturally derived from sorbic acid found in rowan berries. Used in cheese, wine, and dried fruits. Considered one of the safest preservatives globally. FDA: GRAS. EFSA ADI: 3 mg/kg body weight/day.",
      },
      {
        type: "section",
        title: "Sodium Nitrite (E250)",
        content:
          "Used in cured meats to prevent botulism — a genuinely life-threatening risk. Can contribute to nitrosamine formation. The IARC classifies processed meat (not nitrites alone) as Group 1. Context is crucial: the risk must be weighed against the real danger of botulism in inadequately preserved meat.",
      },
      {
        type: "section",
        title: "BHA & BHT (E320, E321)",
        content:
          "Antioxidant preservatives used in fats and oils. BHA is listed as 'reasonably anticipated to be a human carcinogen' by the NTP, yet the FDA still classifies it as GRAS. This reflects genuine ongoing scientific debate — an area to watch.",
      },
      {
        type: "highlight",
        title: "The Bottom Line",
        content:
          "Most preservatives approved for food use have been extensively tested and are safe at the amounts found in food. Concerns typically arise at doses far above what you'd consume in a normal diet. Use our ingredient pages to check the specific evidence for any preservative you're curious about.",
      },
    ],
  },

  "artificial-sweeteners": {
    title: "The Truth About Artificial Sweeteners",
    category: "Sweeteners",
    readTime: 8,
    emoji: "🍬",
    tagline: "Aspartame, sucralose, acesulfame-K — what the science actually says, without the headlines.",
    sections: [
      {
        type: "intro",
        content:
          "Artificial sweeteners have been surrounded by controversy for decades. Separating evidence from noise is difficult when media headlines often conflate 'hazard identification' with 'proven harm.' Here is the current scientific picture.",
      },
      {
        type: "section",
        title: "Aspartame",
        content:
          "About 200× sweeter than sugar. FDA-approved since 1981. In July 2023, IARC listed it as Group 2B ('possibly carcinogenic') — the same tier as coffee and pickled vegetables. Crucially, WHO/JECFA simultaneously reaffirmed its ADI of 40 mg/kg/day as safe. The IARC classification is a hazard identification, not a risk assessment.",
      },
      {
        type: "section",
        title: "Sucralose",
        content:
          "About 600× sweeter than sugar. FDA-approved since 1998. Recent studies suggest possible minor effects on glucose metabolism, but only at doses well above typical dietary consumption. Solid overall safety record.",
      },
      {
        type: "section",
        title: "Acesulfame-K (Ace-K)",
        content:
          "130–200× sweeter than sugar. One of the most thoroughly tested food additives. No credible evidence of carcinogenicity or adverse effects at approved use levels. Often combined with aspartame to mask aftertastes.",
      },
      {
        type: "table",
        title: "Quick Comparison",
        rows: [
          { label: "Aspartame", value: "200× sweeter", note: "Avoid if PKU; FDA/EFSA approved" },
          { label: "Sucralose", value: "600× sweeter", note: "Stable in heat; FDA/EFSA approved" },
          { label: "Acesulfame-K", value: "200× sweeter", note: "Often blended; FDA/EFSA approved" },
          { label: "Saccharin", value: "300× sweeter", note: "Oldest sweetener; FDA approved" },
          { label: "Stevia", value: "200–300× sweeter", note: "Natural origin; GRAS" },
        ],
      },
      {
        type: "highlight",
        title: "Who Should Be Cautious",
        content:
          "People with phenylketonuria (PKU) must avoid aspartame — it contains phenylalanine. Pregnant women are advised to limit consumption of all high-intensity sweeteners as a precaution, though no harm has been established. For everyone else, moderate use at approved levels is considered safe by all major regulatory bodies.",
      },
    ],
  },

  "ultra-processed-foods": {
    title: "What Are Ultra-Processed Foods?",
    category: "Nutrition",
    readTime: 6,
    emoji: "🏭",
    tagline: "Understanding the NOVA classification and why processing level matters more than any single ingredient.",
    sections: [
      {
        type: "intro",
        content:
          "The NOVA classification system, developed by researchers at the University of São Paulo, groups foods not by nutrient content but by how much they have been industrially processed. It has become one of the most influential frameworks in modern nutrition research.",
      },
      {
        type: "table",
        title: "The NOVA Groups",
        rows: [
          { label: "Group 1", value: "Unprocessed or minimally processed", note: "Fruits, vegetables, eggs, plain meat" },
          { label: "Group 2", value: "Processed culinary ingredients", note: "Oils, butter, sugar, salt, flour" },
          { label: "Group 3", value: "Processed foods", note: "Canned fish, cheese, cured meats, beer" },
          { label: "Group 4", value: "Ultra-processed foods (UPF)", note: "Soft drinks, instant noodles, packaged snacks" },
        ],
      },
      {
        type: "section",
        title: "What Makes a Food Ultra-Processed?",
        content:
          "Ultra-processed foods (NOVA 4) typically contain ingredients you would never find in a home kitchen: emulsifiers, artificial colourings, flavour enhancers, humectants, anti-caking agents, and preservatives — all designed to make cheap raw materials taste, look, and feel appealing.",
      },
      {
        type: "section",
        title: "What the Research Shows",
        content:
          "Multiple large cohort studies (EPIC, NutriNet-Santé, UK Biobank) associate higher UPF consumption with increased risk of obesity, type 2 diabetes, cardiovascular disease, and all-cause mortality. However, most evidence is observational — causality is not fully established.",
      },
      {
        type: "warning",
        title: "An Important Nuance",
        content:
          "Not all ultra-processed foods are equally harmful. Wholegrain breakfast cereals and plant-based milks are technically NOVA 4 but carry a different risk profile to cola or processed meat. Processing level is a useful signal — not an absolute verdict.",
      },
      {
        type: "highlight",
        title: "How NutriScan Uses Processing Level",
        content:
          "Processing level contributes 20% to our overall health score. We identify NOVA 4 products based on additive profiles and penalise them accordingly — but we always show the full ingredient breakdown so you can make your own informed judgement.",
      },
    ],
  },

  "reading-food-labels": {
    title: "How to Read Food Labels Like an Expert",
    category: "Consumer Guide",
    readTime: 10,
    emoji: "📋",
    tagline: "Everything you need to decode ingredient lists, nutrition panels, and marketing claims on any package.",
    sections: [
      {
        type: "intro",
        content:
          "Food labels contain a huge amount of information — but they're also full of legal loopholes, marketing tricks, and confusing formats. Here's the expert guide to reading every section.",
      },
      {
        type: "section",
        title: "The Ingredients List",
        content:
          "Ingredients are listed in descending order by weight. The first ingredient is the most abundant. If sugar appears in the top three of a product marketed as 'healthy,' that's a red flag. Watch for multiple sugar aliases (glucose syrup, fructose, maltose, dextrose) spread throughout the list to make sugar appear lower.",
      },
      {
        type: "section",
        title: "The Nutrition Facts Panel",
        content:
          "Always check the serving size first — manufacturers often use unrealistically small servings to make numbers look better. Ingredients to watch: sodium (aim for under 600mg per serving), added sugars (under 6g per serving for snacks), and saturated fat.",
      },
      {
        type: "list",
        items: [
          "Per 100g vs per serving — always compare 'per 100g' figures across products for a fair comparison.",
          "'No added sugar' — doesn't mean sugar-free; the product may be naturally high in sugars.",
          "'Low fat' — often compensated with more sugar to maintain palatability.",
          "'Natural flavours' — a legal term covering thousands of compounds, both natural and synthetic.",
          "'Whole grain' — must be the first ingredient to qualify as a genuinely whole grain product.",
        ],
      },
      {
        type: "section",
        title: "E Numbers",
        content:
          "E numbers are not inherently bad — they are simply the EU's system for approved additives. E300 is vitamin C. E322 is lecithin from sunflower or soy. The number tells you the ingredient has passed regulatory review. NutriScan AI maps every E number to its full name and safety profile.",
      },
      {
        type: "highlight",
        title: "The Simplest Rule",
        content:
          "The shorter the ingredients list and the more recognisable the ingredients are, the less processed the product generally is. If you can picture every ingredient in its natural form, that's usually a good sign.",
      },
    ],
  },

  "evidence-levels": {
    title: "Understanding Evidence Levels in Nutrition Science",
    category: "Science",
    readTime: 6,
    emoji: "🔬",
    tagline: "Strong vs. moderate vs. limited evidence — how to think critically about nutrition research.",
    sections: [
      {
        type: "intro",
        content:
          "Not all scientific evidence is equal. A single rat study is very different from a meta-analysis of 50 human trials. NutriScan AI uses a four-tier evidence system to help you understand how confident the science really is.",
      },
      {
        type: "section",
        title: "The Evidence Hierarchy",
        content: "In nutrition science, evidence is ranked by study quality:",
      },
      {
        type: "list",
        items: [
          "Systematic Reviews & Meta-analyses — Pool results from many studies to find consensus. Gold standard.",
          "Randomised Controlled Trials (RCTs) — Strong causal evidence; participants randomly assigned.",
          "Cohort Studies — Track large groups over time; good for spotting associations.",
          "Case-Control Studies — Compare people with/without a condition retrospectively.",
          "Animal & In Vitro Studies — Useful for hypotheses but don't directly apply to humans.",
          "Expert Opinion & Case Reports — Useful context but not definitive evidence.",
        ],
      },
      {
        type: "table",
        title: "Our Four Evidence Tiers",
        rows: [
          { label: "Strong", value: "Meta-analyses + RCTs + regulatory consensus", note: "High confidence" },
          { label: "Moderate", value: "Multiple consistent studies, regulatory approval", note: "Good confidence" },
          { label: "Limited", value: "Mixed results or small study populations", note: "Some uncertainty" },
          { label: "Insufficient", value: "Very few studies or contradictory findings", note: "Use caution" },
        ],
      },
      {
        type: "warning",
        title: "A Common Misconception",
        content:
          "IARC 'possibly carcinogenic' (Group 2B) is often misreported as 'causes cancer.' It means limited evidence in humans — the same category includes coffee and aloe vera. Always look at the risk assessment, not just the hazard classification.",
      },
      {
        type: "highlight",
        title: "How to Read Our Ingredient Pages",
        content:
          "Every ingredient page shows its evidence level badge, links to research references, and notes when findings conflict. We encourage you to read the original studies and form your own informed view.",
      },
    ],
  },
};

const CATEGORY_COLORS: Record<string, string> = {
  Methodology: "bg-blue-100 text-blue-800",
  Additives: "bg-purple-100 text-purple-800",
  Sweeteners: "bg-pink-100 text-pink-800",
  Nutrition: "bg-green-100 text-green-800",
  "Consumer Guide": "bg-orange-100 text-orange-800",
  Science: "bg-cyan-100 text-cyan-800",
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES[slug];
  if (!article) return { title: "Article Not Found" };
  return { title: article.title, description: article.tagline };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = ARTICLES[slug];
  if (!article) notFound();

  const badgeColor = CATEGORY_COLORS[article.category] ?? "bg-gray-100 text-gray-700";

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero */}
      <div className="bg-gradient-to-br from-navy-900 to-green-950 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Educational Hub
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">{article.emoji}</span>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${badgeColor}`}>
                {article.category}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-white/50">
                <Clock className="w-3.5 h-3.5" />
                {article.readTime} min read
              </span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            {article.title}
          </h1>
          <p className="text-lg text-white/70 leading-relaxed">{article.tagline}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-5">
        {article.sections.map((section, i) => {
          if (section.type === "intro") {
            return (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-green-700" />
                  <span className="text-xs font-bold text-green-700 uppercase tracking-wider">Overview</span>
                </div>
                <p className="text-gray-700 leading-relaxed text-base">{section.content}</p>
              </div>
            );
          }

          if (section.type === "highlight") {
            return (
              <div key={i} className="bg-green-50 border border-green-200 border-l-4 border-l-green-600 rounded-2xl p-7">
                {section.title && (
                  <h3 className="font-bold text-green-900 mb-3 text-base">✅ {section.title}</h3>
                )}
                <p className="text-green-800 leading-relaxed text-sm">{section.content}</p>
              </div>
            );
          }

          if (section.type === "warning") {
            return (
              <div key={i} className="bg-amber-50 border border-amber-200 border-l-4 border-l-amber-500 rounded-2xl p-7">
                {section.title && (
                  <h3 className="font-bold text-amber-900 mb-3 text-base">⚠️ {section.title}</h3>
                )}
                <p className="text-amber-800 leading-relaxed text-sm">{section.content}</p>
              </div>
            );
          }

          if (section.type === "list") {
            return (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
                {section.title && (
                  <h2 className="font-bold text-gray-900 mb-5 text-lg">{section.title}</h2>
                )}
                <ul className="space-y-3">
                  {section.items?.map((item, j) => {
                    const [bold, ...rest] = item.split(" — ");
                    const hasLabel = item.includes(" — ");
                    return (
                      <li key={j} className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                          {j + 1}
                        </span>
                        <span className="text-sm text-gray-600 leading-relaxed">
                          {hasLabel ? (
                            <>
                              <strong className="text-gray-900">{bold}</strong>
                              {" — "}
                              {rest.join(" — ")}
                            </>
                          ) : (
                            item
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          }

          if (section.type === "table" && section.rows) {
            return (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {section.title && (
                  <div className="px-7 py-5 border-b border-gray-100">
                    <h2 className="font-bold text-gray-900 text-lg">{section.title}</h2>
                  </div>
                )}
                <div className="divide-y divide-gray-50">
                  {section.rows.map((row, j) => (
                    <div key={j} className="flex items-center gap-4 px-7 py-4 hover:bg-gray-50 transition-colors">
                      <span className="w-14 flex-shrink-0 font-black text-green-900 text-sm">{row.label}</span>
                      <span className="flex-1 text-sm font-medium text-gray-800">{row.value}</span>
                      {row.note && (
                        <span className="text-xs text-gray-400 flex-shrink-0 hidden sm:block">{row.note}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          if (section.type === "section" || section.type === "subsection") {
            return (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
                {section.title && (
                  <h2 className="font-bold text-gray-900 mb-3 text-lg flex items-center gap-2">
                    <span className="w-1 h-5 rounded-full bg-green-600 flex-shrink-0" />
                    {section.title}
                  </h2>
                )}
                <p className="text-sm text-gray-600 leading-relaxed">{section.content}</p>
              </div>
            );
          }

          return null;
        })}

        {/* Disclaimer */}
        <div className="p-5 bg-gray-100 rounded-2xl text-xs text-gray-500 leading-relaxed">
          <strong>Educational content only.</strong> This article is for general informational purposes and does not
          constitute medical or dietary advice. Consult a qualified healthcare professional for personalised guidance.
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4">
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All articles
          </Link>
          <Link href="/ingredients" className="btn-primary text-sm py-2.5">
            Explore ingredient database
          </Link>
        </div>
      </div>
    </div>
  );
}
