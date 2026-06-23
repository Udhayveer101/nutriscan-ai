import type { Metadata } from "next";
import { Shield, Microscope, Heart, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "About NutriScan AI",
  description: "Our mission is to make food labels transparent and understandable for every consumer.",
};

const VALUES = [
  {
    icon: Shield,
    title: "Science-First",
    description:
      "Every piece of information on NutriScan AI is backed by peer-reviewed research, FDA/EFSA/WHO data, and scientific consensus. We never make claims beyond what evidence supports.",
  },
  {
    icon: Heart,
    title: "Consumer Advocacy",
    description:
      "We believe every person deserves to understand what they are putting into their body. Food transparency is not a luxury — it's a right.",
  },
  {
    icon: Microscope,
    title: "Balanced Information",
    description:
      "We present both benefits and concerns for every ingredient. Our goal is informed decisions, not fear-mongering. Context matters in nutrition science.",
  },
  {
    icon: Globe,
    title: "Globally Relevant",
    description:
      "Regulatory standards differ across countries. We provide FDA, EFSA, FSSAI, and WHO data to give you a comprehensive global picture.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-16 bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-navy-900 to-green-950 text-white py-24 px-4 md:px-8 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
          Making food labels
          <br />
          <span className="text-emerald-400">transparent for everyone</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          NutriScan AI was built because most consumers cannot understand ingredient
          lists — and they shouldn&apos;t have to have a chemistry degree to know what&apos;s in their food.
        </p>
      </div>

      {/* Mission */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-navy-900 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            To empower consumers with clear, accurate, evidence-based information about
            the ingredients in their food — so they can make informed choices that align
            with their health goals, dietary needs, and personal values.
          </p>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {VALUES.map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.title} className="p-6 rounded-2xl border border-gray-100 bg-gray-50">
                <div className="w-10 h-10 rounded-xl bg-green-900 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{v.description}</p>
              </div>
            );
          })}
        </div>

        {/* Legal disclaimer section */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8">
          <h3 className="font-bold text-amber-900 mb-4 text-xl">Important Disclaimer</h3>
          <div className="space-y-3 text-sm text-amber-800 leading-relaxed">
            <p>
              <strong>NutriScan AI is an educational tool, not a medical device.</strong> All
              information provided is for general educational purposes and should not be
              used as a substitute for professional medical or dietary advice.
            </p>
            <p>
              Individual responses to food ingredients vary based on genetics, health
              conditions, medications, and many other factors. Always consult a qualified
              healthcare professional for personalized dietary guidance.
            </p>
            <p>
              Ingredient safety assessments are based on current scientific literature and
              regulatory standards. Food science is evolving — recommendations may change
              as new research emerges.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
