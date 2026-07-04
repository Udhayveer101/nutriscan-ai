import { gradeMeta, gradeMetaFromScore, type Grade } from "@/lib/grade";

interface Props {
  grade?: Grade;
  score?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = {
  sm: { box: 24, font: 12, radius: 7 },
  md: { box: 30, font: 14, radius: 9 },
  lg: { box: 40, font: 20, radius: 12 },
};

/** A+ through F grade chip using the shared brand palette (lib/grade.ts). */
export function GradeBadge({ grade, score, size = "md", className = "" }: Props) {
  const meta = grade ? gradeMeta(grade) : gradeMetaFromScore(score ?? 0);
  const s = SIZES[size];
  return (
    <div
      className={`flex-shrink-0 flex items-center justify-center font-heading font-bold ${className}`}
      style={{
        width: s.box,
        height: s.box,
        fontSize: s.font,
        borderRadius: s.radius,
        background: meta.bg,
        color: meta.text,
        border: `1px solid ${meta.border}`,
      }}
    >
      {meta.label}
    </div>
  );
}
