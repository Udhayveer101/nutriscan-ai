"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

const ERROR_MESSAGES: Record<string, { title: string; desc: string }> = {
  Configuration:   { title: "Server configuration error", desc: "Missing or invalid server environment variables (AUTH_SECRET, DATABASE_URL, etc.)." },
  AccessDenied:    { title: "Access denied", desc: "You do not have permission to sign in." },
  Verification:    { title: "Verification link expired", desc: "The sign-in link has expired. Please request a new one." },
  OAuthSignin:     { title: "OAuth sign-in error", desc: "Could not start Google sign-in. Check that the OAuth client ID is correct." },
  OAuthCallback:   { title: "OAuth callback error", desc: "Google returned an error during sign-in. The redirect URI may not be registered in Google Console." },
  OAuthCreateAccount: { title: "Account creation failed", desc: "Could not create your account. There may be a database connection issue." },
  EmailCreateAccount: { title: "Account creation failed", desc: "Could not create your account. Please try again." },
  Callback:        { title: "Callback error", desc: "An error occurred during the sign-in callback." },
  OAuthAccountNotLinked: { title: "Email already used", desc: "You already have an account with a different sign-in method." },
  Default:         { title: "Sign-in error", desc: "An unknown error occurred. Please try again." },
};

function ErrorContent() {
  const params = useSearchParams();
  const error = params.get("error") ?? "Default";
  const info = ERROR_MESSAGES[error] ?? ERROR_MESSAGES.Default;

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--ios-bg)" }}>
      <div className="w-full max-w-sm">
        <div className="ios-card p-6 space-y-4 text-center">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto">
            <span className="text-2xl">⚠️</span>
          </div>
          <div>
            <h1 className="font-bold text-[18px] text-gray-900">{info.title}</h1>
            <p className="text-[14px] mt-2 leading-relaxed" style={{ color: "var(--ios-label2)" }}>
              {info.desc}
            </p>
          </div>

          {/* Show raw error code for debugging */}
          <div className="px-3 py-2 rounded-xl text-left text-[12px] font-mono" style={{ background: "rgba(255,59,48,0.06)", color: "#c0392b" }}>
            error: {error}
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Link href="/auth/signin" className="btn-primary py-3 justify-center">
              Try again
            </Link>
            <Link href="/" className="btn-secondary py-3 justify-center">
              Go home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense>
      <ErrorContent />
    </Suspense>
  );
}
