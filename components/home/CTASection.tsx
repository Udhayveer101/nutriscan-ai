import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

export function CTASection() {
  return (
    <div className="max-w-[1180px] mx-auto px-5 md:px-10 pt-8 pb-16 md:pb-[70px]">
      <Reveal
        className="relative rounded-[26px] overflow-hidden px-6 md:px-10 py-14 md:py-16 text-center"
        style={{ background: "linear-gradient(150deg,#1a7a3e,#0d4c26)", boxShadow: "0 30px 70px -28px rgba(15,82,40,.7)" }}
      >
        <div className="absolute w-[300px] h-[300px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(74,222,128,.35), transparent 70%)", top: -120, left: -60 }} />
        <div className="absolute w-[280px] h-[280px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(74,222,128,.28), transparent 70%)", bottom: -120, right: -40 }} />

        <div className="relative">
          <div className="inline-flex items-center gap-2 font-mono-label font-semibold text-[11px] tracking-[.12em] px-3.5 py-1.5 rounded-full" style={{ color: "#bbf7d0", background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.2)" }}>
            FREE TO USE · NO ACCOUNT REQUIRED
          </div>
          <h2 className="font-heading font-extrabold text-[30px] md:text-[46px] leading-[1.03] tracking-[-.03em] text-white mt-5 max-w-[600px] mx-auto">
            Start understanding your food today
          </h2>
          <p className="mt-4 max-w-[460px] mx-auto text-[16px] leading-relaxed" style={{ color: "#c8e6d2" }}>
            Scan your first product in seconds — no signup, no paywall, just the truth about what you eat.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-7">
            <Link href="/scan" className="inline-flex items-center gap-2 px-6 py-4 rounded-[13px] font-semibold text-[15px] bg-white transition-transform hover:-translate-y-0.5" style={{ color: "#0e3a1f", boxShadow: "0 12px 28px -8px rgba(0,0,0,.4)" }}>
              Scan a product now →
            </Link>
            <Link href="/ingredients" className="inline-flex items-center gap-2 px-6 py-4 rounded-[13px] font-semibold text-[15px] text-white transition-colors hover:bg-white/20" style={{ background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.25)" }}>
              Browse ingredients
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
