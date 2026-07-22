// Generate Obsidian vault ingredient pages from the single source of truth (lib/additives.ts).
// FleetCare pattern: knowledge lives in code; vault is a rendered, queryable view.
// Run: npx tsx scripts/gen-vault.ts
import { writeFileSync, mkdirSync } from "fs";
import { ADDITIVES } from "../lib/additives";
import { INTERACTIONS } from "../lib/interactions";

const VAULT = "Nutriscan AI";
mkdirSync(`${VAULT}/Ingredients`, { recursive: true });
const today = new Date().toISOString().slice(0, 10);

for (const a of ADDITIVES) {
  const md = `---
type: ingredient-profile
category: ${a.category}
evidence: ${a.evidence}
last_reviewed: ${today}
---

# ${a.name}

**Category:** ${a.category}  ·  **Function:** ${a.function}
**Evidence strength:** ${a.evidence}
${a.eNumbers?.length ? `**E-number(s):** ${a.eNumbers.join(", ")}` : ""}
${a.adi ? `**ADI:** ${a.adi}` : ""}

## Concern by concentration
| Position | Concern |
|---|---|
| Dominant (0–2) | ${a.dominant} |
| Moderate (3–6) | ${a.moderate} |
| Trace (7+) | ${a.trace} |

## Regulatory status
${a.regulatory}

## Assessment
${a.note}

${a.populations?.length ? `## Population-specific concerns\n${a.populations.map((p) => `- ${p}`).join("\n")}` : ""}

## Reference
${a.ref}

_Source of truth: \`lib/additives.ts\` → \`${a.id}\`. Do not edit by hand — regenerate via \`scripts/gen-vault.ts\`._
`;
  writeFileSync(`${VAULT}/Ingredients/${a.name.replace(/[/\\]/g, "-")}.md`, md);
}

// Index
const index = `# Ingredient Knowledge Base\n\n${ADDITIVES.length} profiled additives. Generated ${today}.\n\n` +
  ADDITIVES.map((a) => `- [[${a.name.replace(/[/\\]/g, "-")}]] — ${a.category}, ${a.evidence} evidence, dominant=${a.dominant}`).join("\n");
writeFileSync(`${VAULT}/Ingredients/_index.md`, index);

console.log(`Generated ${ADDITIVES.length} ingredient pages + index (${INTERACTIONS.length} interactions documented separately).`);
