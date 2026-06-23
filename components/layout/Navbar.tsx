"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Scan, Leaf, BookOpen, Menu, X, ChevronRight, Sparkles } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

const navLinks = [
  { href: "/scan", label: "Scan Product", icon: Scan },
  { href: "/ingredients", label: "Ingredient DB", icon: Leaf },
  { href: "/features", label: "Features", icon: Sparkles },
  { href: "/learn", label: "Learn", icon: BookOpen },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-green-900 to-emerald rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
            <Leaf className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-lg text-navy-900">
            Nutri<span className="text-green-900">Scan</span>{" "}
            <span className="text-emerald text-sm font-semibold">AI</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname === href || pathname.startsWith(href + "/")
                  ? "bg-green-50 text-green-900"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Auth CTA */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="btn-ghost text-sm">
                Dashboard
              </Link>
              {session.user?.image ? (
                <Link href="/dashboard" className="relative">
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? "User"}
                    width={32}
                    height={32}
                    className="rounded-full ring-2 ring-green-900/20 hover:ring-green-900 transition-all"
                  />
                </Link>
              ) : (
                <Link
                  href="/dashboard"
                  className="w-8 h-8 rounded-full bg-green-900 text-white text-sm font-bold flex items-center justify-center hover:bg-green-800 transition-colors"
                >
                  {session.user?.name?.[0] ?? "U"}
                </Link>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/signin" className="btn-ghost text-sm">
                Sign in
              </Link>
              <Link href="/scan" className="btn-primary text-sm py-2">
                Start Scanning
                <ChevronRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-b border-gray-100 shadow-lg"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    pathname === href
                      ? "bg-green-50 text-green-900"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
              <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
                {session ? (
                  <Link href="/dashboard" className="btn-primary w-full justify-center">
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link href="/auth/signin" className="btn-secondary w-full justify-center">
                      Sign in
                    </Link>
                    <Link href="/scan" className="btn-primary w-full justify-center">
                      Start Scanning
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
