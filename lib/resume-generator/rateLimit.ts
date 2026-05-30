// Lightweight in-memory rate limiter for the public resume-generator API.
//
// The existing contact rate limiter (lib/contactRateLimit.ts) is backed by the
// Neon `contact_submissions` table, which is specific to contact submissions.
// Rather than overload that table, this uses a small sliding-window counter in
// process memory: per-IP create limits plus a global ceiling (contract §6).
//
// Caveat: process-local state only — it resets on cold start and is not shared
// across serverless instances. Thread G can swap this for a durable store
// (Redis/Upstash or a dedicated table) during final integration without
// changing callers.

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const PER_IP_MAX = 5;
const GLOBAL_MAX = 60;

const perIpHits = new Map<string, number[]>();
let globalHits: number[] = [];

function prune(hits: number[], now: number): number[] {
  const cutoff = now - WINDOW_MS;
  return hits.filter((t) => t > cutoff);
}

export type RateLimitResult = {
  limited: boolean;
  retryAfterSeconds: number;
};

export function checkResumeRateLimit(ip: string): RateLimitResult {
  const now = Date.now();

  globalHits = prune(globalHits, now);
  const ipHits = prune(perIpHits.get(ip) ?? [], now);

  if (ipHits.length >= PER_IP_MAX || globalHits.length >= GLOBAL_MAX) {
    const oldest = Math.min(...[ipHits[0], globalHits[0]].filter(Boolean));
    const retryAfterSeconds = Number.isFinite(oldest)
      ? Math.max(1, Math.ceil((oldest + WINDOW_MS - now) / 1000))
      : Math.ceil(WINDOW_MS / 1000);
    perIpHits.set(ip, ipHits);
    return { limited: true, retryAfterSeconds };
  }

  ipHits.push(now);
  globalHits.push(now);
  perIpHits.set(ip, ipHits);

  return { limited: false, retryAfterSeconds: 0 };
}
