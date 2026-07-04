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
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Hero */}
      <div className="text-white py-20 md:py-24 px-4 pt-32 md:pt-40 text-center" style={{ background: "linear-gradient(165deg,#0b1f16 0%,#123024 55%,#0e5231 130%)" }}>
        <h1 className="font-heading text-4xl md:text-6xl font-extrabold mb-6 tracking-[-.02em]">
          Making food labels
          <br />
          <span style={{ color: "#4ade80" }}>transparent for everyone</span>
        </h1>
        <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
          NutriScan AI was built because most consumers cannot understand ingredient
          lists — and they shouldn&apos;t have to have a chemistry degree to know what&apos;s in their food.
        </p>
      </div>

      {/* Mission */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl font-extrabold mb-6" style={{ color: "var(--ink)" }}>Our Mission</h2>
          <p className="text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
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
              <div key={v.title} className="glass p-6 rounded-2xl">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "var(--brand-800)" }}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-heading font-bold mb-2" style={{ color: "var(--ink-2)" }}>{v.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{v.description}</p>
              </div>
            );
          })}
        </div>

        {/* Legal disclaimer section */}
        <div className="rounded-2xl p-8" style={{ background: "#fffbeb", border: "1px solid #fde68a" }}>
          <h3 className="font-heading font-bold mb-4 text-xl" style={{ color: "#78350f" }}>Important Disclaimer</h3>
          <div className="space-y-3 text-sm leading-relaxed" style={{ color: "#92400e" }}>
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
