import { Camera, Brain, Barcode, BarChart3, BookOpen, Users } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const features = [
  { icon: Camera, title: "Image Scanner", description: "Photograph any ingredient list. Our OCR extracts and analyses every component instantly.", bg: "linear-gradient(150deg,#bbf7d0,#86efac)", text: "#116534" },
  { icon: Brain, title: "AI Analysis", description: "Plain-language explanations tuned for beginners, parents, athletes and scientists alike.", bg: "linear-gradient(150deg,#bfdbfe,#93c5fd)", text: "#1e40af" },
  { icon: Barcode, title: "Barcode Scanner", description: "Scan any product barcode to instantly retrieve full ingredient data via Open Food Facts.", bg: "linear-gradient(150deg,#ddd6fe,#c4b5fd)", text: "#6d28d9" },
  { icon: BarChart3, title: "Health Scoring", description: "An A-to-F grade weighing processing level, additive density, sugar, sodium and nutrition.", bg: "linear-gradient(150deg,#bbf7d0,#86efac)", text: "#116534" },
  { icon: BookOpen, title: "Evidence-Based", description: "Every claim is backed by FDA, EFSA and WHO sources plus peer-reviewed references.", bg: "linear-gradient(150deg,#fde68a,#fcd34d)", text: "#b45309" },
  { icon: Users, title: "Audience Modes", description: "Switch between Simple, Parent, Athlete and Scientific for tailored explanations.", bg: "linear-gradient(150deg,#fecaca,#fca5a5)", text: "#b91c1c" },
];

export function FeaturesGrid() {
  return (
    <div className="max-w-[1180px] mx-auto px-5 md:px-10 pt-16 pb-5">
      <Reveal className="text-center">
        <div className="inline-block font-mono-label font-semibold text-[11px] tracking-[.14em] px-3 py-1.5 rounded-full" style={{ color: "var(--brand-600)", background: "rgba(22,101,52,.09)", border: "1px solid rgba(22,101,52,.16)" }}>
          EVERYTHING YOU NEED
        </div>
        <h2 className="font-heading font-extrabold text-[32px] md:text-[42px] leading-[1.02] tracking-[-.025em] mt-4" style={{ color: "var(--ink)" }}>
          Powerful features for<br />informed decisions
        </h2>
      </Reveal>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-9">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <Reveal key={f.title} delay={i * 0.05} className="glass rounded-[18px] p-6 transition-transform hover:-translate-y-1">
              <div className="w-11 h-11 rounded-[13px] flex items-center justify-center" style={{ background: f.bg, color: f.text }}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="mt-4 font-heading font-bold text-lg" style={{ color: "var(--ink-2)" }}>{f.title}</div>
              <div className="mt-1.5 text-[13.5px] leading-relaxed" style={{ color: "var(--muted)" }}>{f.description}</div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
