import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Lightbulb } from "lucide-react";

export const metadata: Metadata = {
  title: "Educational Hub",
  description: "Learn about food additives, preservatives, ultra-processed foods, and how to read food labels.",
};

const ARTICLES = [
  {
    slug: "how-we-score",
    title: "How NutriScan AI Scores Ingredients",
    excerpt: "A transparent breakdown of our A+ to F grading methodology — what factors we weigh and why.",
    category: "Methodology",
    readTime: 5,
    emoji: "📊",
  },
  {
    slug: "our-methodology",
    title: "Our Methodology",
    excerpt: "Deep dive into NutriScan AI's scientific approach, algorithm, evidence levels, and regulatory alignment.",
    category: "Methodology",
    readTime: 8,
    emoji: "🔍",
  },
  {
    slug: "preservatives-explained",
    title: "Preservatives: What They Are and Why They're Used",
    excerpt: "From sodium benzoate to potassium sorbate — a complete guide to the most common food preservatives.",
    category: "Additives",
    readTime: 7,
    emoji: "🧪",
  },
  {
    slug: "artificial-sweeteners",
    title: "The Truth About Artificial Sweeteners",
    excerpt: "Aspartame, sucralose, acesulfame-K — what does the science actually say about sugar substitutes?",
    category: "Sweeteners",
    readTime: 8,
    emoji: "🍬",
  },
  {
    slug: "ultra-processed-foods",
    title: "What Are Ultra-Processed Foods?",
    excerpt: "Understanding the NOVA classification system and why processing level matters for health.",
    category: "Nutrition",
    readTime: 6,
    emoji: "🏭",
  },
  {
    slug: "reading-food-labels",
    title: "How to Read Food Labels Like an Expert",
    excerpt: "Ingredient lists, nutrition facts, serving sizes — everything you need to decode any food package.",
    category: "Consumer Guide",
    readTime: 10,
    emoji: "📋",
  },
  {
    slug: "evidence-levels",
    title: "Understanding Evidence Levels in Nutrition Science",
    excerpt: "Strong vs. moderate vs. limited evidence — how to think critically about nutrition research.",
    category: "Science",
    readTime: 6,
    emoji: "🔬",
  },
];

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-navy-900 via-navy-800 to-green-950 text-white py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-emerald-400/20 flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Educational Hub</div>
              <h1 className="text-4xl md:text-5xl font-extrabold">Understand Food Science</h1>
            </div>
          </div>
          <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">
            Evidence-based articles to help you make sense of food labels, additives, and nutrition claims. Learn how to read labels like an expert and understand the science behind ingredient safety.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ARTICLES.map((article) => {
            // Category colors
            const categoryColors: Record<string, { bg: string; border: string; badge: string }> = {
              Methodology: { bg: "bg-blue-50 hover:bg-blue-100", border: "border-blue-200 hover:border-blue-300", badge: "bg-blue-100 text-blue-700" },
              Additives: { bg: "bg-purple-50 hover:bg-purple-100", border: "border-purple-200 hover:border-purple-300", badge: "bg-purple-100 text-purple-700" },
              Sweeteners: { bg: "bg-pink-50 hover:bg-pink-100", border: "border-pink-200 hover:border-pink-300", badge: "bg-pink-100 text-pink-700" },
              Nutrition: { bg: "bg-green-50 hover:bg-green-100", border: "border-green-200 hover:border-green-300", badge: "bg-green-100 text-green-700" },
              "Consumer Guide": { bg: "bg-orange-50 hover:bg-orange-100", border: "border-orange-200 hover:border-orange-300", badge: "bg-orange-100 text-orange-700" },
              Science: { bg: "bg-cyan-50 hover:bg-cyan-100", border: "border-cyan-200 hover:border-cyan-300", badge: "bg-cyan-100 text-cyan-700" },
            };

            const colors = categoryColors[article.category] || { bg: "bg-gray-50 hover:bg-gray-100", border: "border-gray-200 hover:border-gray-300", badge: "bg-gray-100 text-gray-700" };

            return (
              <Link
                key={article.slug}
                href={`/learn/${article.slug}`}
                className={`group block rounded-2xl p-7 border ${colors.border} ${colors.bg} transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
              >
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{article.emoji}</div>
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-xs font-bold ${colors.badge} px-2.5 py-1 rounded-full`}>
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-600">
                    <Clock className="w-3.5 h-3.5" />
                    {article.readTime} min
                  </span>
                </div>
                <h2 className="font-bold text-lg text-navy-900 mb-3 group-hover:text-green-700 transition-colors leading-tight">
                  {article.title}
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed mb-5">{article.excerpt}</p>
                <div className="flex items-center gap-1.5 text-green-700 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Read article
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-20 p-8 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
          <div className="max-w-2xl">
            <h3 className="text-2xl font-bold text-navy-900 mb-3">Want to Learn More?</h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Our educational hub is constantly growing. Check back often for new articles on food science, ingredient safety, and nutrition research.
            </p>
            <Link href="/ingredients" className="inline-flex items-center gap-2 px-6 py-3 bg-green-900 text-white rounded-xl font-semibold hover:bg-green-800 transition-colors">
              Explore Ingredient Database
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
