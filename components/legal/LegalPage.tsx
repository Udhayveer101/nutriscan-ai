import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Section {
  title: string;
  content: string | string[];
  type?: "text" | "list" | "highlight";
}

interface Props {
  badge: string;
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: Section[];
}

export function LegalPage({ badge, title, subtitle, lastUpdated, sections }: Props) {
  const tocItems = sections.filter((s) => s.title);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Hero */}
      <div className="text-white py-16 md:py-20 px-4 pt-32 md:pt-40" style={{ background: "linear-gradient(165deg,#0b1f16 0%,#123024 55%,#0e5231 130%)" }}>
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
          <div className="inline-block px-3 py-1 rounded-full font-mono-label text-xs font-bold mb-4" style={{ background: "rgba(255,255,255,.1)", color: "#86efac", border: "1px solid rgba(255,255,255,.1)" }}>
            {badge.toUpperCase()}
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold mb-4 tracking-[-.02em]">{title}</h1>
          <p className="text-white/60 text-base">{subtitle}</p>
          <p className="text-white/40 text-sm mt-2">Last updated: {lastUpdated}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">

          {/* Table of contents */}
          <div className="lg:col-span-1">
            <div className="glass sticky top-28 rounded-2xl p-5">
              <p className="font-mono-label text-xs font-bold tracking-wider mb-4" style={{ color: "var(--muted-3)" }}>CONTENTS</p>
              <nav className="space-y-1">
                {tocItems.map((s, i) => (
                  <a
                    key={i}
                    href={`#section-${i}`}
                    className="block text-sm font-medium transition-all py-1 pl-2 border-l-2 hover:text-[color:var(--brand-800)] hover:border-[color:var(--brand-600)]"
                    style={{ color: "var(--muted-2)", borderColor: "transparent" }}
                  >
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3 space-y-4">
            {sections.map((section, i) => (
              <div
                key={i}
                id={`section-${i}`}
                className="glass rounded-2xl p-7"
                style={section.type === "highlight" ? { borderLeft: "4px solid var(--brand-600)" } : undefined}
              >
                {section.title && (
                  <h2 className="text-lg font-heading font-bold mb-4 flex items-center gap-2" style={{ color: "var(--ink-2)" }}>
                    <span className="w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center flex-shrink-0" style={{ background: "#dcfce7", color: "#15803d" }}>
                      {i + 1}
                    </span>
                    {section.title}
                  </h2>
                )}

                {Array.isArray(section.content) ? (
                  <ul className="space-y-2">
                    {section.content.map((item, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2" style={{ background: "var(--brand-500)" }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{section.content}</p>
                )}
              </div>
            ))}

            {/* Footer note */}
            <div className="p-5 rounded-2xl text-sm" style={{ background: "#fffbeb", border: "1px solid #fde68a", color: "#92400e" }}>
              If you have any questions about this document, contact us at{" "}
              <a href="mailto:legal@nutriscan.ai" className="font-semibold underline">
                legal@nutriscan.ai
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
