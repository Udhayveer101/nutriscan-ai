import { Reveal } from "@/components/ui/Reveal";
import { EvidenceBar } from "@/components/ui/EvidenceBar";

const BREAKDOWN = [
  { label: "EVIDENCE STRENGTH", value: "STRONG", w: 86, from: "#4ade80", to: "#16a34a" },
  { label: "REGULATORY STATUS", value: "APPROVED", w: 92, from: "#4ade80", to: "#16a34a" },
  { label: "PROCESSING IMPACT", value: "MODERATE", w: 54, from: "#fcd34d", to: "#f59e0b", valueColor: "#fcd34d" },
  { label: "ADDITIVE CONCERN", value: "ELEVATED", w: 38, from: "#fca5a5", to: "#ef4444", valueColor: "#fca5a5" },
];

export function SocialProof() {
  return (
    <div style={{ background: "linear-gradient(160deg,#0d2016,#123024)", color: "#eafaef" }} className="py-16 md:py-[70px]">
      <div className="max-w-[1180px] mx-auto px-5 md:px-10 grid lg:grid-cols-[.95fr_1.05fr] gap-10 lg:gap-12 items-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 font-mono-label font-semibold text-[11px] tracking-[.14em] px-3 py-1.5 rounded-full" style={{ color: "#86efac", border: "1px solid rgba(134,239,172,.3)" }}>
            HOW WE SCORE
          </div>
          <h2 className="font-heading font-extrabold text-[32px] md:text-[44px] leading-[1.02] tracking-[-.03em] text-white mt-4">
            Graded on evidence,<br />not on vibes.
          </h2>
          <p className="mt-5 max-w-[420px] text-[16px] leading-relaxed" style={{ color: "#a9c9b5" }}>
            Every ingredient runs through a transparent scorecard. We weigh regulatory status, study strength and processing impact — then show you exactly how the grade was reached.
          </p>
          <div className="flex flex-wrap gap-2.5 mt-6 font-mono-label text-[12px] font-semibold">
            {["FDA", "EFSA", "WHO", "150+ STUDIES"].map((chip) => (
              <span key={chip} className="px-3.5 py-2 rounded-[9px]" style={{ background: "rgba(134,239,172,.12)", border: "1px solid rgba(134,239,172,.25)", color: "#bbf7d0" }}>
                {chip}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="glass-dark rounded-[20px] p-7" style={{ boxShadow: "0 24px 60px -20px rgba(0,0,0,.5)" }}>
          <div className="flex items-center justify-between mb-6">
            <div className="font-heading font-bold text-[17px] text-white">Sample scorecard</div>
            <div className="flex items-center gap-2">
              <span className="font-mono-label text-[11px]" style={{ color: "#a9c9b5" }}>GRADE</span>
              <span className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center font-heading font-bold text-[16px]" style={{ background: "#fef3c7", color: "#b45309" }}>C</span>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            {BREAKDOWN.map((row) => (
              <div key={row.label}>
                <div className="flex justify-between font-mono-label text-[11px] mb-1.5" style={{ color: "#c5ddcd" }}>
                  <span>{row.label}</span>
                  <span style={{ color: row.valueColor ?? "#86efac" }}>{row.value}</span>
                </div>
                <EvidenceBar value={row.w} from={row.from} to={row.to} trackColor="rgba(255,255,255,.12)" />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
