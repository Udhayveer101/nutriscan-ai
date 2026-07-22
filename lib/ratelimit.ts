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

// Best-effort client IP from proxy headers (Vercel sets x-forwarded-for).
export function clientKey(req: Request, scope: string): string {
  const fwd = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = fwd || req.headers.get("x-real-ip") || "unknown";
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
