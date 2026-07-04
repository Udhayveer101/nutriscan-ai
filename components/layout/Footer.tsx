import Link from "next/link";

const footerLinks = {
  Product: [
    { href: "/scan", label: "Scan Ingredients" },
    { href: "/ingredients", label: "Ingredient Database" },
    { href: "/features", label: "Features" },
    { href: "/learn", label: "Educational Hub" },
  ],
  Company: [
    { href: "/about", label: "About Us" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
  Science: [
    { href: "/learn/how-we-score", label: "How We Score" },
    { href: "/learn/our-methodology", label: "Our Methodology" },
    { href: "/learn/evidence-levels", label: "Evidence Levels" },
  ],
};

export function Footer() {
  return (
    <footer style={{ background: "#0b1a12", color: "#c8d6cd" }}>
      <div className="max-w-[1180px] mx-auto px-4 md:px-10 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand */}
        <div className="lg:col-span-2">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(150deg,#22c55e,#116534)" }}>
              <div className="w-3.5 h-3.5 bg-white" style={{ borderRadius: "0 60% 0 60%", transform: "rotate(45deg)" }} />
            </div>
            <span className="font-heading font-extrabold text-[18px] text-white">
              NutriScan<span style={{ color: "#4ade80" }}> AI</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-[13.5px] leading-relaxed" style={{ color: "#8aa093" }}>
            Making food labels transparent and understandable through AI-powered, evidence-based ingredient analysis.
          </p>
          <p className="mt-4 max-w-xs text-[11.5px] leading-relaxed" style={{ color: "#5f7566" }}>
            <strong style={{ color: "#8aa093" }}>Disclaimer:</strong> NutriScan AI provides educational information only.
            Always consult a healthcare professional for medical advice.
          </p>
        </div>

        {/* Links */}
        {Object.entries(footerLinks).map(([category, links]) => (
          <div key={category}>
            <h3 className="font-mono-label font-bold text-[11px] tracking-[.12em]" style={{ color: "#5f7566" }}>
              {category.toUpperCase()}
            </h3>
            <ul className="mt-3.5 space-y-2.5 text-[14px]">
              {links.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="transition-colors hover:text-[#4ade80]" style={{ color: "#c8d6cd" }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="max-w-[1180px] mx-auto px-4 md:px-10 pt-6 pb-6 border-t flex flex-col md:flex-row items-center justify-between gap-3 text-[12.5px]" style={{ borderColor: "rgba(255,255,255,.08)", color: "#5f7566" }}>
        <span>© {new Date().getFullYear()} NutriScan AI. All rights reserved.</span>
        <span className="flex items-center gap-2">
          <span className="w-[7px] h-[7px] rounded-full animate-pulse" style={{ background: "#4ade80", boxShadow: "0 0 0 3px rgba(74,222,128,.2)" }} />
          All systems operational
        </span>
      </div>
    </footer>
  );
}
