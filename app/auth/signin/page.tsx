"use client";

import { signIn } from "next-auth/react";
import { Leaf } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 pb-8"
      style={{ background: "var(--ios-bg)" }}
    >
      <div className="w-full max-w-sm">
        {/* App icon + title */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-green-800 to-green-600 rounded-[22px] flex items-center justify-center mx-auto shadow-lg">
              <Leaf className="w-10 h-10 text-white" strokeWidth={2} />
            </div>
          </Link>
          <h1 className="text-[28px] font-bold tracking-tight text-gray-900">NutriScan AI</h1>
          <p className="text-[15px] mt-1.5 leading-relaxed" style={{ color: "var(--ios-label2)" }}>
            Sign in to save your scan history and track your nutrition goals.
          </p>
        </div>

        {/* Sign-in card */}
        <div className="ios-card p-6 space-y-4">
          <button
            onClick={() => signIn("google", { callbackUrl: "/scan" })}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-semibold text-[15px] bg-white border transition-all duration-150 active:scale-[0.97] select-none"
            style={{ borderColor: "var(--ios-separator)", color: "var(--ios-label)", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-[11px] leading-relaxed" style={{ color: "var(--ios-label3)" }}>
            By continuing, you agree to our{" "}
            <Link href="/terms" className="underline" style={{ color: "var(--ios-tint)" }}>Terms</Link>
            {" "}and{" "}
            <Link href="/privacy" className="underline" style={{ color: "var(--ios-tint)" }}>Privacy Policy</Link>
          </p>
        </div>

        <p className="text-center text-[14px] mt-6" style={{ color: "var(--ios-label2)" }}>
          No account needed?{" "}
          <Link href="/scan" className="font-semibold" style={{ color: "var(--ios-tint)" }}>
            Scan as guest
          </Link>
        </p>
      </div>
    </div>
  );
}
