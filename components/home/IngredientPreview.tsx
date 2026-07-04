import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { GradeBadge } from "@/components/ui/GradeBadge";
import { EvidenceBar } from "@/components/ui/EvidenceBar";
import type { Grade } from "@/lib/grade";

const PREVIEW: { name: string; slug: string; tag: string; grade: Grade; score: number; tagColor: string; tagBg: string }[] = [
  { name: "Sodium Benzoate", slug: "sodium-benzoate", tag: "PRESERVATIVE · E211", grade: "C", score: 53, tagColor: "#b45309", tagBg: "#fef3c7" },
  { name: "Ascorbic Acid", slug: "ascorbic-acid", tag: "ANTIOXIDANT · E300", grade: "A", score: 92, tagColor: "#15803d", tagBg: "#dcfce7" },
  { name: "Aspartame", slug: "aspartame", tag: "SWEETENER · E951", grade: "F", score: 31, tagColor: "#1e40af", tagBg: "#dbeafe" },
  { name: "Red 40", slug: "red-40", tag: "COLORING · E129", grade: "F", score: 28, tagColor: "#dc2626", tagBg: "#fee2e2" },
  { name: "Lecithin", slug: "lecithin", tag: "EMULSIFIER · E322", grade: "A", score: 88, tagColor: "#15803d", tagBg: "#dcfce7" },
  { name: "Carrageenan", slug: "carrageenan", tag: "STABILIZER · E407", grade: "C", score: 57, tagColor: "#b45309", tagBg: "#fef3c7" },
];

function barColors(score: number): [string, string] {
  if (score >= 80) return ["#4ade80", "#16a34a"];
  if (score >= 50) return ["#fcd34d", "#f59e0b"];
  return ["#fca5a5", "#ef4444"];
}

export function IngredientPreview() {
  return (
    <div className="max-w-[1180px] mx-auto px-5 md:px-10 pt-16 pb-5">
      <Reveal className="flex items-end justify-between flex-wrap gap-4 mb-6">
        <div>
          <div className="inline-block font-mono-label font-semibold text-[11px] tracking-[.14em] px-3 py-1.5 rounded-full" style={{ color: "var(--brand-600)", background: "rgba(22,101,52,.09)", border: "1px solid rgba(22,101,52,.16)" }}>
            INGREDIENT DATABASE
          </div>
          <h2 className="font-heading font-extrabold text-[28px] md:text-[40px] leading-[1.02] tracking-[-.025em] mt-3.5" style={{ color: "var(--ink)" }}>
            2,000+ ingredients,<br />decoded for you
          </h2>
        </div>
        <Link href="/ingredients" className="glass px-[18px] py-3 rounded-xl font-semibold text-[14px] transition-transform hover:-translate-y-0.5" style={{ color: "var(--ink-3)" }}>
          Browse all ingredients →
        </Link>
      </Reveal>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {PREVIEW.map((ing, i) => {
          const [from, to] = barColors(ing.score);
          return (
            <Reveal key={ing.name} delay={i * 0.04}>
              <Link href={`/ingredients/${ing.slug}`} className="glass block rounded-2xl p-[18px] transition-transform hover:-translate-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono-label text-[9.5px] font-semibold tracking-[.08em] px-2 py-0.5 rounded-[5px]" style={{ color: ing.tagColor, background: ing.tagBg }}>
                      {ing.tag}
                    </span>
                    <div className="mt-2.5 font-heading font-bold text-[17px]" style={{ color: "var(--ink-2)" }}>{ing.name}</div>
                  </div>
                  <GradeBadge grade={ing.grade} />
                </div>
                <div className="flex justify-between font-mono-label text-[10px] mt-3.5" style={{ color: "var(--muted-4)" }}>
                  <span>SAFETY</span>
                  <span>{ing.score}/100</span>
                </div>
                <div className="mt-1.5">
                  <EvidenceBar value={ing.score} from={from} to={to} />
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
