import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Educational Hub",
  description: "Learn about food additives, preservatives, ultra-processed foods, and how to read food labels.",
};

const CATEGORY_COLORS: Record<string, { text: string; bg: string }> = {
  Methodology: { text: "#1e40af", bg: "#dbeafe" },
  Additives: { text: "#6d28d9", bg: "#ede9fe" },
  Sweeteners: { text: "#be185d", bg: "#fce7f3" },
  Nutrition: { text: "#15803d", bg: "#dcfce7" },
  "Consumer Guide": { text: "#b45309", bg: "#fef3c7" },
  Science: { text: "#0e7490", bg: "#cffafe" },
};

const ARTICLES = [
  { slug: "how-we-score", title: "How NutriScan AI scores ingredients", excerpt: "A transparent breakdown of our A+ to F grading — what factors we weigh, and why.", category: "Methodology", readTime: 5 },
  { slug: "our-methodology", title: "Our Methodology", excerpt: "The scientific approach, evidence levels, and regulatory alignment behind every score.", category: "Methodology", readTime: 8 },
  { slug: "preservatives-explained", title: "Preservatives: what they are & why they're used", excerpt: "From sodium benzoate to potassium sorbate — a complete guide to the most common preservatives.", category: "Additives", readTime: 7 },
  { slug: "artificial-sweeteners", title: "The truth about artificial sweeteners", excerpt: "Aspartame, sucralose, acesulfame-K — what does the science actually say about sugar substitutes?", category: "Sweeteners", readTime: 8 },
  { slug: "ultra-processed-foods", title: "What are ultra-processed foods?", excerpt: "Understanding the NOVA classification system and why processing level matters for health.", category: "Nutrition", readTime: 6 },
  { slug: "reading-food-labels", title: "How to read food labels like an expert", excerpt: "Ingredient lists, nutrition facts, serving sizes — everything you need to decode any package.", category: "Consumer Guide", readTime: 10 },
  { slug: "evidence-levels", title: "Understanding evidence levels in nutrition", excerpt: "Strong vs. moderate vs. limited evidence — how to think critically about nutrition research.", category: "Science", readTime: 6 },
];

export default function LearnPage() {
  return (
    <div style={{ background: "var(--bg)" }} className="min-h-screen">
      {/* Dark hero */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(165deg,#0b1f16 0%,#123024 55%,#0e5231 130%)" }}>
        <div className="absolute w-[420px] h-[420px] rounded-full pointer-events-none animate-drift" style={{ background: "radial-gradient(circle, rgba(74,222,128,.28), transparent 68%)", top: -120, right: -40 }} />
        <div className="absolute w-[360px] h-[360px] rounded-full pointer-events-none animate-drift-rev" style={{ background: "radial-gradient(circle, rgba(45,212,191,.2), transparent 68%)", bottom: -160, left: "8%" }} />

        <div className="relative z-[5] max-w-[1180px] mx-auto px-5 md:px-10 pt-32 md:pt-40 pb-[88px]">
          <div className="inline-flex items-center gap-2 font-mono-label font-semibold text-[11px] tracking-[.14em] px-3 py-1.5 rounded-full" style={{ color: "#86efac", border: "1px solid rgba(134,239,172,.3)" }}>
            EDUCATIONAL HUB
          </div>
          <h1 className="font-heading font-extrabold text-[38px] md:text-[64px] leading-[.98] tracking-[-.03em] text-white mt-5 max-w-[820px]">
            Understand food science <span style={{ color: "#4ade80" }}>without the noise.</span>
          </h1>
          <p className="mt-5 max-w-[620px] text-[17px] md:text-[18px] leading-relaxed" style={{ color: "#a9c9b5" }}>
            Evidence-based reads on labels, additives and nutrition claims. Learn to read a label like an expert — and understand the science behind every grade we give.
          </p>
        </div>
      </div>

      {/* Article grid — overlaps hero */}
      <div className="max-w-[1180px] mx-auto px-5 md:px-10 -mt-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ARTICLES.map((article, i) => {
            const colors = CATEGORY_COLORS[article.category] ?? { text: "var(--muted-2)", bg: "rgba(20,70,45,.06)" };
            return (
              <Reveal key={article.slug} delay={i * 0.04}>
                <Link href={`/learn/${article.slug}`} className="glass block rounded-[18px] overflow-hidden transition-transform hover:-translate-y-1 h-full">
                  <div className="ph h-[110px]">ARTICLE COVER IMAGE</div>
                  <div className="p-5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono-label text-[10px] font-semibold px-2.5 py-1 rounded-[6px]" style={{ color: colors.text, background: colors.bg }}>
                        {article.category.toUpperCase()}
                      </span>
                      <span className="flex items-center gap-1 font-mono-label text-[11px]" style={{ color: "var(--muted-4)" }}>
                        <Clock className="w-3 h-3" /> {article.readTime} MIN
                      </span>
                    </div>
                    <h2 className="font-heading font-bold text-[18px] leading-tight mt-3" style={{ color: "var(--ink-2)" }}>{article.title}</h2>
                    <p className="text-[13px] leading-relaxed mt-2" style={{ color: "var(--muted)" }}>{article.excerpt}</p>
                    <div className="flex items-center gap-1.5 text-[12.5px] font-semibold mt-3.5" style={{ color: "var(--brand-800)" }}>
                      Read article <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>

        {/* Want to go deeper */}
        <Reveal delay={0.2} className="mt-6 mb-16 relative rounded-[22px] overflow-hidden p-8 md:p-11" style={{ background: "linear-gradient(150deg,#1a7a3e,#0d4c26)", boxShadow: "0 26px 60px -24px rgba(15,82,40,.6)" }}>
          <div className="absolute w-[280px] h-[280px] rounded-full pointer-events-none animate-drift" style={{ background: "radial-gradient(circle, rgba(74,222,128,.3), transparent 70%)", top: -120, right: -40 }} />
          <div className="relative flex items-center justify-between gap-8 flex-wrap">
            <div>
              <h2 className="font-heading font-extrabold text-[26px] md:text-[30px] text-white">Want to go deeper?</h2>
              <p className="mt-3 max-w-[460px] text-[15px] leading-relaxed" style={{ color: "#c8e6d2" }}>
                Our hub grows every week with new reads on ingredient safety, nutrition science and label literacy.
              </p>
            </div>
            <Link href="/ingredients" className="inline-flex items-center gap-2 px-6 py-4 rounded-[13px] font-semibold text-[15px] bg-white whitespace-nowrap transition-transform hover:-translate-y-0.5" style={{ color: "#0e3a1f", boxShadow: "0 12px 28px -8px rgba(0,0,0,.4)" }}>
              Explore the database <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
