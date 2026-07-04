import { EvidenceBar } from "@/components/ui/EvidenceBar";

interface Props {
  label: string;
  value: number;
  description?: string;
  delay?: number;
}

function barColors(value: number): [string, string] {
  if (value >= 80) return ["#4ade80", "#16a34a"];
  if (value >= 65) return ["#a3e635", "#65a30d"];
  if (value >= 50) return ["#fcd34d", "#f59e0b"];
  if (value >= 35) return ["#fdba74", "#ea580c"];
  return ["#fca5a5", "#ef4444"];
}

export function ScoreGauge({ label, value, description, delay = 0 }: Props) {
  const [from, to] = barColors(value);
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="font-semibold text-[13px]" style={{ color: "var(--ink-2)" }}>{label}</span>
        <span className="font-mono-label font-bold text-[13px]" style={{ color: to }}>{value}<span className="text-[10px] font-normal" style={{ color: "var(--muted-3)" }}>/100</span></span>
      </div>
      <EvidenceBar value={value} from={from} to={to} delay={delay} />
      {description && <p className="text-[11px] mt-1.5" style={{ color: "var(--muted-3)" }}>{description}</p>}
    </div>
  );
}
