import { ALL_INGREDIENTS } from "../prisma/ingredients";
import { lookupAdditive, isWholeFood } from "../lib/additives";
for (const n of process.argv.slice(2)) {
  const l=n.toLowerCase();
  const rows = ALL_INGREDIENTS.filter(i=>i.name.toLowerCase().includes(l)||i.aliases.some(a=>a.toLowerCase().includes(l))).map(i=>i.slug+(i.eNumber?`(${i.eNumber})`:""));
  console.log(n.padEnd(34), "|", lookupAdditive(n)?.id ?? (isWholeFood(n)?"WHOLE":"NONE"), "|", rows.slice(0,4).join(","));
}
