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
  accentColor?: string;
}

export function LegalPage({ badge, title, subtitle, lastUpdated, sections, accentColor = "green" }: Props) {
  const tocItems = sections.filter((s) => s.title);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero */}
      <div className={`bg-gradient-to-br from-navy-900 to-${accentColor}-950 text-white py-16 px-4`}>
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
          <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-${accentColor}-300 border border-white/10 mb-4`}>
            {badge}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{title}</h1>
          <p className="text-white/60 text-base">{subtitle}</p>
          <p className="text-white/40 text-sm mt-2">Last updated: {lastUpdated}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Table of contents */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Contents</p>
              <nav className="space-y-1">
                {tocItems.map((s, i) => (
                  <a
                    key={i}
                    href={`#section-${i}`}
                    className="block text-sm text-gray-500 hover:text-green-800 hover:font-medium transition-all py-1 pl-2 border-l-2 border-transparent hover:border-green-600"
                  >
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3 space-y-5">
            {sections.map((section, i) => (
              <div
                key={i}
                id={`section-${i}`}
                className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-7 ${
                  section.type === "highlight" ? "border-l-4 border-l-green-500" : ""
                }`}
              >
                {section.title && (
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-green-50 text-green-700 text-xs font-black flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    {section.title}
                  </h2>
                )}

                {Array.isArray(section.content) ? (
                  <ul className="space-y-2">
                    {section.content.map((item, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm text-gray-600 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0 mt-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-600 leading-relaxed">{section.content}</p>
                )}
              </div>
            ))}

            {/* Footer note */}
            <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl text-sm text-amber-800">
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
