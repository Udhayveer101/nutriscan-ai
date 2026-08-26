// Lightweight fixed-window rate limiter.
// ponytail: in-memory Map — protects a single warm serverless instance from burst abuse,
// but does NOT share state across instances. For production-grade global limiting swap the
// Map for Upstash Redis (@upstash/ratelimit) — same call site, drop-in. Good enough to stop
// a single client hammering the paid LLM endpoints; upgrade when you run multi-instance.

interface Window { count: number; resetAt: number; }
const buckets = new Map<string, Window>();

export interface RateLimitResult { ok: boolean; remaining: number; retryAfter: number; }

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const w = buckets.get(key);
  if (!w || now >= w.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }
  w.count++;
  if (w.count > limit) {
    return { ok: false, remaining: 0, retryAfter: Math.ceil((w.resetAt - now) / 1000) };
  }
  return { ok: true, remaining: limit - w.count, retryAfter: 0 };
}

// Client IP for the limit key, taken from headers the platform sets rather than ones the
// caller can choose. The leftmost entry of x-forwarded-for is whatever the client sent, so
// keying on it lets anyone bypass the limit on the paid LLM routes by rotating one header.
// Vercel's own x-vercel-forwarded-for (and x-real-ip) are written by the proxy and cannot be
// spoofed from outside; x-forwarded-for is used only as a last resort, and then its RIGHTMOST
// entry, which is the hop the proxy actually observed.
export function clientKey(req: Request, scope: string): string {
  const trusted =
    req.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip")?.trim();
  const parts = req.headers.get("x-forwarded-for")?.split(",").map((s) => s.trim()).filter(Boolean);
  const ip = trusted || parts?.[parts.length - 1] || "unknown";
  return `${scope}:${ip}`;
}

// Opportunistic cleanup so the Map can't grow unbounded on a long-lived instance.
export function sweep(): void {
  const now = Date.now();
  for (const [k, w] of buckets) if (now >= w.resetAt) buckets.delete(k);
}

// ── self-check ──────────────────────────────────────────────────────────────
export function _demo(): void {
  const k = "test:1.2.3.4";
  buckets.clear();
  let last: RateLimitResult = { ok: true, remaining: 0, retryAfter: 0 };
  for (let i = 0; i < 5; i++) last = rateLimit(k, 3, 60_000);
  if (last.ok) throw new Error("limiter failed to block after limit");
  if (rateLimit("test:other", 3, 60_000).ok !== true) throw new Error("limiter blocked wrong key");
  // eslint-disable-next-line no-console
  console.log("ratelimit.ts self-check OK");
}
