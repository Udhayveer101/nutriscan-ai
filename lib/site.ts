// Canonical public origin for absolute URLs (sitemap, robots, Open Graph).
// Set NEXT_PUBLIC_SITE_URL when a custom domain goes live.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://nutriscan-ai-taupe.vercel.app").replace(/\/$/, "");
