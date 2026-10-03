import { createHmac, randomUUID } from "node:crypto";
import { getAppEnv, getDatabaseBranchName, getDatabaseClient } from "@/lib/db";

export const MAX_FEEDBACK_BODY_BYTES = 12_000;
export const FEEDBACK_RETENTION_DAYS = 90;
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const path =
  /^\/(?:[a-z0-9_-]+(?:\.[a-z0-9_-]+)*(?:\/[a-z0-9_-]+(?:\.[a-z0-9_-]+)*)*)?\/?$/i;

export function normalizeFeedback(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const raw = value as Record<string, unknown>;
  if (
    typeof raw.clientSubmissionId !== "string" ||
    !uuid.test(raw.clientSubmissionId)
  )
    return null;
  if (
    typeof raw.category !== "string" ||
    !["problem", "suggestion", "general"].includes(raw.category)
  )
    return null;
  if (typeof raw.message !== "string") return null;
  const message = raw.message.trim();
  if (!message || Array.from(message).length > 2000 || message.includes("\0"))
    return null;
  if (
    typeof raw.pagePath !== "string" ||
    raw.pagePath.length > 500 ||
    !path.test(raw.pagePath)
  )
    return null;
  const hasIdentity = raw.visitorId != null || raw.sessionId != null;
  if (
    hasIdentity &&
    (typeof raw.visitorId !== "string" ||
      !/^visitor_[a-z0-9_-]{1,100}$/i.test(raw.visitorId) ||
      typeof raw.sessionId !== "string" ||
      !/^session_[a-z0-9_-]{1,100}$/i.test(raw.sessionId))
  )
    return null;
  return {
    clientSubmissionId: raw.clientSubmissionId,
    category: raw.category,
    message,
    pagePath: raw.pagePath,
    visitorId: hasIdentity ? (raw.visitorId as string) : null,
    sessionId: hasIdentity ? (raw.sessionId as string) : null,
  };
}
export type FeedbackPayload = NonNullable<ReturnType<typeof normalizeFeedback>>;

export function networkKey(
  ip: string,
  secret: string,
  now = new Date(),
): string {
  return createHmac("sha256", secret)
    .update(`feedback:${now.toISOString().slice(0, 10)}:${ip}`)
    .digest("hex");
}

export async function saveFeedback(payload: FeedbackPayload, key: string) {
  const sql = getDatabaseClient();
  const app = "portfolio",
    environment = getAppEnv();
  const existing = await sql.query<false, false>(
    `SELECT category, message, page_path, visitor_id, session_id, app, app_env
    FROM analytics_feedback WHERE client_submission_id=$1`,
    [payload.clientSubmissionId],
  );
  if (existing.length) {
    const row = existing[0];
    return row.app === app &&
      row.app_env === environment &&
      row.category === payload.category &&
      row.message === payload.message &&
      row.page_path === payload.pagePath &&
      row.visitor_id === payload.visitorId &&
      row.session_id === payload.sessionId
      ? "stored"
      : "conflict";
  }
  // The rate counter is atomic across processes. Retries already stored above consume no slot.
  const result = await sql.query<false, false>(
    `WITH allowed AS (
    INSERT INTO analytics_feedback_rate_limits (network_key, window_start, submissions)
    VALUES ($1,date_trunc('hour',now()),1)
    ON CONFLICT (network_key,window_start) DO UPDATE
      SET submissions=analytics_feedback_rate_limits.submissions+1
      WHERE analytics_feedback_rate_limits.submissions < 5
    RETURNING network_key
  ), saved AS (
    INSERT INTO analytics_feedback (id,client_submission_id,app,app_env,database_branch_name,category,message,page_path,visitor_id,session_id)
    SELECT $2::uuid,$3::uuid,$4,$5,$6,$7,$8,$9,$10,$11 FROM allowed
    ON CONFLICT (client_submission_id) DO NOTHING RETURNING id
  ) SELECT EXISTS(SELECT 1 FROM allowed) AS allowed, EXISTS(SELECT 1 FROM saved) AS stored`,
    [
      key,
      randomUUID(),
      payload.clientSubmissionId,
      app,
      environment,
      getDatabaseBranchName(),
      payload.category,
      payload.message,
      payload.pagePath,
      payload.visitorId,
      payload.sessionId,
    ],
  );
  if (!result[0].allowed) return "limited";
  if (result[0].stored) return "stored";
  // Resolve a concurrent duplicate without acknowledging a different payload.
  const duplicate = await sql.query<false, false>(
    `SELECT 1 FROM analytics_feedback WHERE client_submission_id=$1 AND app=$2 AND app_env=$3
    AND category=$4 AND message=$5 AND page_path=$6 AND visitor_id IS NOT DISTINCT FROM $7 AND session_id IS NOT DISTINCT FROM $8`,
    [
      payload.clientSubmissionId,
      app,
      environment,
      payload.category,
      payload.message,
      payload.pagePath,
      payload.visitorId,
      payload.sessionId,
    ],
  );
  return duplicate.length ? "stored" : "conflict";
}

export async function pruneFeedback() {
  const sql = getDatabaseClient();
  const results = await sql.transaction<false, false>((tx) => [
    tx.query(
      `DELETE FROM analytics_feedback WHERE app='portfolio' AND received_at <= now()-interval '90 days' RETURNING id`,
    ),
    tx.query(
      `DELETE FROM analytics_feedback_rate_limits WHERE window_start <= now()-interval '24 hours' RETURNING network_key`,
    ),
  ]);
  return {
    feedbackDeleted: results[0].length,
    limiterDeleted: results[1].length,
  };
}
