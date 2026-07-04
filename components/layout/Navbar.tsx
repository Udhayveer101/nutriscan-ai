"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Scan, Leaf, LayoutDashboard, BookOpen, ChevronDown, LogOut, RefreshCw, SlidersHorizontal } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

const NAV_LINKS = [
  { href: "/scan", label: "Scan" },
  { href: "/ingredients", label: "Ingredients" },
  { href: "/learn", label: "Learn" },
];

const TABS = [
  { href: "/scan", label: "Scan", icon: Scan },
  { href: "/ingredients", label: "Ingredients", icon: Leaf },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/dashboard", label: "Profile", icon: LayoutDashboard },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <>
      {/* ── Top nav ──────────────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 md:px-[26px] pt-4" style={{ paddingTop: "max(16px, env(safe-area-inset-top))" }}>
        <nav className="glass max-w-[1180px] mx-auto flex items-center justify-between rounded-2xl px-3 md:px-[18px] py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(150deg,#22c55e,#116534)", boxShadow: "0 4px 12px rgba(22,163,74,.4)" }}>
              <div className="w-3.5 h-3.5 bg-white" style={{ borderRadius: "0 60% 0 60%", transform: "rotate(45deg)" }} />
            </div>
            <span className="font-heading font-extrabold text-[18px] tracking-tight whitespace-nowrap" style={{ color: "var(--ink-2)" }}>
              NutriScan<span style={{ color: "var(--brand-600)" }}> AI</span>
            </span>
          </Link>

          {/* Center links */}
          <div className="hidden md:flex items-center gap-1.5 font-semibold text-[14px]">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-3.5 py-2 rounded-[9px] transition-colors"
                style={isActive(href)
                  ? { background: "rgba(22,101,52,.1)", color: "var(--brand-800)" }
                  : { color: "var(--ink-3)" }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3 font-semibold text-[14px]">
            {session ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2 pl-1 pr-1 md:pr-2 py-1 rounded-full transition-colors hover:bg-black/[.03]"
                >
                  {session.user?.image ? (
                    <Image src={session.user.image} alt={session.user.name ?? "You"} width={34} height={34} className="rounded-full" />
                  ) : (
                    <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: "var(--brand-800)" }}>
                      {session.user?.name?.[0] ?? "U"}
                    </div>
                  )}
                  <ChevronDown className="hidden md:block w-3.5 h-3.5 transition-transform" style={{ color: "var(--muted-2)", transform: menuOpen ? "rotate(180deg)" : "none" }} />
                </button>

                {menuOpen && (
                  <div className="glass absolute right-0 top-[calc(100%+10px)] w-60 rounded-2xl p-1.5 z-50">
                    <div className="px-3 py-2.5 mb-1 border-b" style={{ borderColor: "var(--separator)" }}>
                      <p className="font-heading font-bold text-[14px] truncate" style={{ color: "var(--ink)" }}>{session.user?.name ?? "Your account"}</p>
                      <p className="text-[12px] truncate" style={{ color: "var(--muted-3)" }}>{session.user?.email}</p>
                    </div>
                    <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-colors hover:bg-black/[.04]" style={{ color: "var(--ink-3)" }}>
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link href="/onboarding?edit=1" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-colors hover:bg-black/[.04]" style={{ color: "var(--ink-3)" }}>
                      <SlidersHorizontal className="w-4 h-4" /> Edit preferences
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-colors hover:bg-black/[.04] text-left"
                      style={{ color: "var(--ink-3)" }}
                    >
                      <RefreshCw className="w-4 h-4" /> Switch account
                    </button>
                    <div className="my-1 border-t" style={{ borderColor: "var(--separator)" }} />
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13.5px] font-semibold transition-colors hover:bg-red-50 text-left text-red-600"
                    >
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/signin" className="hidden sm:inline-block px-3.5 py-2 rounded-[9px] transition-colors" style={{ color: "var(--ink-3)" }}>
                  Sign in
                </Link>
                <Link href="/scan" className="btn-primary py-2 px-4 text-[13.5px]">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* ── Mobile bottom tab bar ──────────────────────────────── */}
      <div className="tab-bar md:hidden">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link key={href} href={href} className="tab-item">
              <Icon className="w-[24px] h-[24px] transition-colors duration-150" strokeWidth={active ? 2.2 : 1.6} style={{ color: active ? "var(--brand-600)" : "#8e9c93" }} />
              <span className="text-[10px] font-medium mt-0.5 transition-colors duration-150" style={{ color: active ? "var(--brand-600)" : "#8e9c93" }}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
