import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.openfoodfacts.org" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "nutriscan-ai-taupe.vercel.app"],
    },
  },
  poweredByHeader: false,
  async rewrites() {
    // Browsers request /favicon.ico regardless of <link rel=icon>; serve the SVG logo instead of a 404.
    return [{ source: "/favicon.ico", destination: "/logo.svg" }];
  },
  async headers() {
    // Baseline production security headers. No CSP here — Next inline styles/scripts and
    // the webcam make a strict CSP a separate, careful task (see vault Security Audit).
    const security = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=()" },
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
    ];
    return [{ source: "/:path*", headers: security }];
  },
};

export default nextConfig;
