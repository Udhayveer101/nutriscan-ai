"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Scan, Leaf, LayoutDashboard, BookOpen, ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";

const TABS = [
  { href: "/scan",        label: "Scan",       icon: Scan },
  { href: "/ingredients", label: "Ingredients", icon: Leaf },
  { href: "/learn",       label: "Learn",       icon: BookOpen },
  { href: "/dashboard",   label: "Profile",     icon: LayoutDashboard },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <>
      {/* ── Top navigation bar ───────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "ios-glass" : "bg-transparent"
        }`}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <nav className="max-w-7xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-800 to-green-600 rounded-[10px] flex items-center justify-center shadow-sm">
              <Leaf className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-[17px] tracking-tight text-gray-900">
              NutriScan <span className="text-green-700 font-semibold text-sm">AI</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {TABS.slice(0, 3).map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 rounded-xl text-[14px] font-medium transition-all duration-150 ${
                  isActive(href)
                    ? "bg-green-50 text-green-800"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-2">
                <Link href="/dashboard" className="text-[14px] font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-2">
                  Dashboard
                </Link>
                <Link href="/dashboard" className="relative">
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name ?? "User"}
                      width={34}
                      height={34}
                      className="rounded-full ring-2 ring-green-700/20 hover:ring-green-700/50 transition-all"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-green-700 text-white text-sm font-bold flex items-center justify-center">
                      {session.user?.name?.[0] ?? "U"}
                    </div>
                  )}
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/signin" className="text-[14px] font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-xl hover:bg-gray-100/80 transition-all">
                  Sign in
                </Link>
                <Link href="/scan" className="btn-primary py-2 px-4 text-[14px]">
                  Get Started
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile: show sign in button if not logged in */}
          {!session && (
            <Link href="/auth/signin" className="md:hidden btn-primary py-2 px-4 text-[13px]">
              Sign in
            </Link>
          )}
          {session && (
            <Link href="/dashboard" className="md:hidden relative">
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name ?? "User"}
                  width={32}
                  height={32}
                  className="rounded-full ring-2 ring-green-700/20"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-green-700 text-white text-sm font-bold flex items-center justify-center">
                  {session.user?.name?.[0] ?? "U"}
                </div>
              )}
            </Link>
          )}
        </nav>
      </header>

      {/* ── iOS-style bottom tab bar (mobile only) ────────────── */}
      <div className="ios-tab-bar md:hidden">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link key={href} href={href} className="ios-tab-item">
              <Icon
                className="w-[26px] h-[26px] transition-colors duration-150"
                strokeWidth={active ? 2.2 : 1.6}
                style={{ color: active ? "var(--ios-tint)" : "#8e8e93" }}
              />
              <span
                className="text-[10px] font-medium mt-0.5 transition-colors duration-150"
                style={{ color: active ? "var(--ios-tint)" : "#8e8e93" }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
