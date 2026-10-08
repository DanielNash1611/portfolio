import { createHmac } from "node:crypto";
import { getDatabaseClient, type DatabaseClient } from "@/lib/db";

export const SUGGESTION_WINDOW_SECONDS = 600;
export const SUGGESTION_CLIENT_LIMIT = 8;
export const SUGGESTION_GLOBAL_LIMIT = 40;

export function matchesRequestHost(request: Request): boolean {
  // Next's production server can normalize its URL to an internal bind address.
  // The browser Origin must still match the actual HTTP Host and protocol.
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return false;
  try {
    const parsed = new URL(origin);
    return (
      parsed.origin === origin &&
      parsed.host === host &&
      parsed.protocol === new URL(request.url).protocol
    );
  } catch {
    return false;
  }
}

export function createSuggestionLimiter() {
  const windowMs = SUGGESTION_WINDOW_SECONDS * 1000;
  let hits: { ip: string; at: number }[] = [];
  return (ip: string, now = Date.now()): number => {
    hits = hits.filter((hit) => hit.at > now - windowMs);
    const own = hits.filter((hit) => hit.ip === ip);
    const blocked =
      hits.length >= SUGGESTION_GLOBAL_LIMIT
        ? hits
        : own.length >= SUGGESTION_CLIENT_LIMIT
          ? own
          : null;
    if (blocked)
      return Math.max(1, Math.ceil((blocked[0].at + windowMs - now) / 1000));
    hits.push({ ip, at: now });
    return 0;
  };
}

export function hashSuggestionClient(ip: string, secret: string) {
  if (!secret.trim()) throw new Error("Suggestion privacy secret is missing");
  return createHmac("sha256", secret)
    .update(`product-workspace:suggestions:${ip}`)
    .digest("hex");
}

export function createDurableSuggestionLimiter(
  sql: DatabaseClient,
  secret: string,
) {
  if (!secret.trim()) throw new Error("Suggestion privacy secret is missing");
  return async (ip: string): Promise<number> => {
    const clientHash = hashSuggestionClient(ip, secret);
    // Separate statements in a READ COMMITTED transaction are intentional:
    // after the advisory lock is acquired, the quota query sees any admission
    // committed by a different instance while this transaction was waiting.
    const results = await sql.transaction<false, false>(
      (txn) => [
        txn.query("SELECT pg_advisory_xact_lock(hashtextextended($1, 0))", [
          "product-workspace:suggestion-admission:v1",
        ]),
        txn.query(
          `DELETE FROM product_workspace_suggestion_limits
           WHERE created_at <= clock_timestamp() - make_interval(secs => $1)`,
          [SUGGESTION_WINDOW_SECONDS],
        ),
        txn.query(
          `WITH request_clock AS (
             SELECT clock_timestamp() AS at
           ), quota AS (
             SELECT COUNT(*)::int AS total,
                    COUNT(*) FILTER (WHERE client_hash = $1)::int AS own,
                    MIN(created_at) AS first_global,
                    MIN(created_at) FILTER (WHERE client_hash = $1) AS first_own
             FROM product_workspace_suggestion_limits, request_clock
             WHERE created_at > request_clock.at - make_interval(secs => $2)
           ), admitted AS (
             INSERT INTO product_workspace_suggestion_limits (client_hash, created_at)
             SELECT $1, request_clock.at
             FROM quota, request_clock
             WHERE quota.total < $3 AND quota.own < $4
             RETURNING id
           )
           SELECT CASE
             WHEN EXISTS (SELECT 1 FROM admitted) THEN 0
             ELSE GREATEST(1, CEIL(EXTRACT(EPOCH FROM (
               CASE WHEN quota.total >= $3 THEN quota.first_global ELSE quota.first_own END
               + make_interval(secs => $2) - request_clock.at
             )))::int)
           END AS retry_after
           FROM quota, request_clock`,
          [
            clientHash,
            SUGGESTION_WINDOW_SECONDS,
            SUGGESTION_GLOBAL_LIMIT,
            SUGGESTION_CLIENT_LIMIT,
          ],
        ),
      ],
      {
        arrayMode: false,
        fullResults: false,
        isolationLevel: "ReadCommitted",
        fetchOptions: { signal: AbortSignal.timeout(5_000) },
      },
    );
    const row = results[2]?.[0] as { retry_after?: unknown } | undefined;
    const retryAfter = row?.retry_after;
    if (
      typeof retryAfter !== "number" ||
      !Number.isInteger(retryAfter) ||
      retryAfter < 0 ||
      retryAfter > SUGGESTION_WINDOW_SECONDS
    )
      throw new Error("Suggestion admission could not be verified");
    return retryAfter;
  };
}

const localLimit = createSuggestionLimiter();

export async function checkSuggestionLimit(ip: string): Promise<number> {
  if (process.env.NODE_ENV !== "production") return localLimit(ip);
  const secret =
    process.env.PRODUCT_WORKSPACE_PRIVACY_SALT?.trim() ||
    process.env.PORTFOLIO_GUIDE_PRIVACY_SALT?.trim() ||
    process.env.FEEDBACK_RATE_LIMIT_SECRET?.trim();
  if (!secret) throw new Error("Suggestion privacy secret is missing");
  return createDurableSuggestionLimiter(getDatabaseClient(), secret)(ip);
}

export async function readBoundedJson(
  request: Request,
  maxBytes = 32_000,
): Promise<unknown> {
  if (!request.body) throw new Error("Missing body");
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let size = 0;
  let text = "";
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        await reader.cancel();
        throw new Error("Body too large");
      }
      text += decoder.decode(value, { stream: true });
    }
    return JSON.parse(text + decoder.decode());
  } finally {
    reader.releaseLock();
  }
}
