import { ScannerInterface } from "@/components/scan/ScannerInterface";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scan Product",
  description: "Upload a photo, use camera, paste ingredients, or scan a barcode to analyze food products.",
};

const VERDICT_ROWS = [
  { name: "Ascorbic Acid", meta: "E300 · SAFE", grade: "A", bg: "#dcfce7", text: "#15803d" },
  { name: "Sodium Benzoate", meta: "E211 · MODERATE", grade: "C", bg: "#fef3c7", text: "#b45309" },
  { name: "Red 40", meta: "E129 · AVOID", grade: "F", bg: "#fee2e2", text: "#dc2626" },
];

const BULLETS = [
  { icon: "◆", bg: "#dcfce7", text: "#15803d", title: "Per-ingredient grades", desc: "Every additive scored A to F." },
  { icon: "◈", bg: "#dbeafe", text: "#1e40af", title: "Cited evidence", desc: "Sources you can actually check." },
  { icon: "⚡", bg: "#fef3c7", text: "#b45309", title: "Under 3 seconds", desc: "A full readout before you check out." },
];

export default function ScanPage() {
  return (
    <div
      className="min-h-screen pb-tab-bar md:pb-16"
      style={{ background: "radial-gradient(120% 55% at 85% -6%, #e9f5ec 0%, #f6f5f1 44%, #f6f5f1 100%)" }}
    >
      <div className="max-w-[1180px] mx-auto px-5 md:px-10 pt-28 md:pt-32 pb-2">
        <div
          className="inline-flex items-center gap-2 font-mono-label font-semibold text-[11px] tracking-[.14em] px-3 py-1.5 rounded-full"
          style={{ color: "var(--brand-800)", background: "rgba(22,101,52,.09)", border: "1px solid rgba(22,101,52,.16)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--brand-600)", boxShadow: "0 0 0 4px rgba(22,163,74,.18)" }} />
          LIVE INGREDIENT ANALYSIS
        </div>
        <h1 className="font-heading font-extrabold text-[30px] md:text-[46px] leading-[.98] tracking-[-.03em] mt-4" style={{ color: "var(--ink)" }}>
          Put your food under<br />the microscope.
        </h1>
        <p className="mt-4 max-w-[520px] text-[16px] leading-relaxed" style={{ color: "var(--muted)" }}>
          Upload a photo, paste an ingredient list, or scan a barcode. We grade every component in seconds — and tell you exactly what it means for you.
        </p>
      </div>

      <div className="max-w-[1180px] mx-auto px-5 md:px-10 pt-7 pb-14 grid lg:grid-cols-[1.42fr_.58fr] gap-6 items-start">
        <ScannerInterface />

        {/* Sidebar — what you'll get */}
        <div className="hidden lg:flex flex-col gap-4 sticky top-[96px]">
          <div className="font-mono-label font-bold text-[11px] tracking-[.14em] pl-0.5" style={{ color: "var(--muted-2)" }}>WHAT YOU&apos;LL GET</div>

          <div className="glass relative rounded-[20px] p-5 overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="font-mono-label font-semibold text-[11px] tracking-[.08em]" style={{ color: "var(--brand-800)" }}>◉ SAMPLE VERDICT</div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-heading font-extrabold text-[20px]" style={{ background: "#fef3c7", color: "#b45309", border: "1px solid #fcd88a" }}>C</div>
            </div>
            <div className="mt-3.5 flex flex-col gap-2">
              {VERDICT_ROWS.map((row) => (
                <div key={row.name} className="flex items-center justify-between rounded-[10px] px-[11px] py-2.5" style={{ background: "rgba(255,255,255,.6)", border: "1px solid rgba(20,70,45,.08)" }}>
                  <div>
                    <div className="font-semibold text-[12.5px]" style={{ color: "var(--ink-2)" }}>{row.name}</div>
                    <div className="font-mono-label text-[9.5px]" style={{ color: "var(--muted-3)" }}>{row.meta}</div>
                  </div>
                  <div className="w-6 h-6 rounded-[7px] flex items-center justify-center font-heading font-bold text-[12px]" style={{ background: row.bg, color: row.text }}>
                    {row.grade}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-4 flex flex-col gap-3.5">
            {BULLETS.map((b) => (
              <div key={b.title} className="flex gap-2.5 items-start">
                <div className="w-[26px] h-[26px] flex-none rounded-lg flex items-center justify-center text-[13px]" style={{ background: b.bg, color: b.text }}>{b.icon}</div>
                <div>
                  <div className="font-bold text-[13px]" style={{ color: "var(--ink-2)" }}>{b.title}</div>
                  <div className="text-[11.5px] leading-snug mt-0.5" style={{ color: "var(--muted-2)" }}>{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
