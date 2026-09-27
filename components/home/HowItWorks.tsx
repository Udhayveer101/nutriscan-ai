import { Reveal } from "@/components/ui/Reveal";

const steps = [
  { icon: "↑", title: "Snap the label", description: "Camera, paste text, or scan a barcode." },
  { icon: "◎", title: "We read it", description: "OCR + NLP identify every component." },
  { icon: "◆", title: "Grade it A+ to F", description: "A composite health score, per ingredient." },
  { icon: "✦", title: "Explain it plainly", description: "Tuned to you: parent, athlete, scientist." },
];

export function HowItWorks() {
  return (
    <div className="max-w-[1180px] mx-auto px-5 md:px-10 pt-2 pb-3">
      <Reveal className="glass rounded-[18px] p-6 md:p-7 relative grid grid-cols-2 md:grid-cols-4 gap-2">
        <div className="hidden md:block absolute left-7 right-7 top-[48px] h-px" style={{ background: "repeating-linear-gradient(90deg, #bcd0c2 0 6px, transparent 6px 12px)" }} />
        {steps.map((step) => (
          <div key={step.title} className="relative">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg"
              style={{ background: "linear-gradient(150deg,#34d399,#059669)", boxShadow: "0 6px 16px -4px rgba(5,150,105,.5)" }}
            >
              {step.icon}
            </div>
            <div className="mt-3 font-heading font-bold text-[15px]" style={{ color: "var(--ink-2)" }}>{step.title}</div>
            <div className="mt-0.5 text-[12.5px] leading-relaxed" style={{ color: "var(--muted)" }}>{step.description}</div>
          </div>
        ))}
      </Reveal>
    </div>
  );
}
