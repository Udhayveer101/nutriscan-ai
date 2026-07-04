import { scoreToGrade, type ScoreGrade } from "./scoring";

export type Grade = ScoreGrade;

interface GradeMeta {
  label: string;
  text: string;
  bg: string;
  border: string;
  barFrom: string;
  barTo: string;
}

const GRADE_META: Record<Grade, GradeMeta> = {
  A_PLUS: { label: "A+", text: "#15803d", bg: "#bbf7d0", border: "#a7e3ba", barFrom: "#4ade80", barTo: "#16a34a" },
  A:      { label: "A",  text: "#15803d", bg: "#dcfce7", border: "#a7e3ba", barFrom: "#4ade80", barTo: "#16a34a" },
  B:      { label: "B",  text: "#4d7c0f", bg: "#d9f99d", border: "#bef264", barFrom: "#a3e635", barTo: "#4d7c0f" },
  C:      { label: "C",  text: "#b45309", bg: "#fef3c7", border: "#fcd88a", barFrom: "#fcd34d", barTo: "#f59e0b" },
  D:      { label: "D",  text: "#c2410c", bg: "#ffedd5", border: "#fbcfa0", barFrom: "#fdba74", barTo: "#ea580c" },
  F:      { label: "F",  text: "#dc2626", bg: "#fee2e2", border: "#f7b4b4", barFrom: "#fca5a5", barTo: "#ef4444" },
};

export function gradeMeta(grade: Grade): GradeMeta {
  return GRADE_META[grade] ?? GRADE_META.C;
}

export function gradeMetaFromScore(score: number): GradeMeta {
  return gradeMeta(scoreToGrade(score));
}
