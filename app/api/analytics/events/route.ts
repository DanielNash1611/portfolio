import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getAppEnv, getDatabaseBranchName, getDatabaseClient, isDatabaseConfigured } from "@/lib/db";
import { MAX_ANALYTICS_BODY_BYTES } from "@/lib/analytics-payload";
import { normalizeProductEvent, resolveProductOrigin } from "@/lib/product-analytics";
import { PRODUCTS } from "@/lib/analytics-products";

export const runtime = "nodejs";
function cors(origin: string | null) {
  const allowed = origin && Object.keys(PRODUCTS).some(app => resolveProductOrigin(app, origin));
  return {
    "Cache-Control": "no-store",
    Vary: "Origin",
    ...(allowed ? { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" } : {}),
  };
}
export function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin");
  const headers = cors(origin);
  return new NextResponse(null, { status: "Access-Control-Allow-Origin" in headers ? 204 : 403, headers });
}
export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const headers = cors(origin);
  const reply = (status: number, stored = false) => NextResponse.json({ ok: status === 200, stored }, { status, headers });
  if (!("Access-Control-Allow-Origin" in headers)) return reply(403);
  if (request.headers.get("dnt") === "1" || request.headers.get("sec-gpc") === "1") return reply(200);
  if (Number(request.headers.get("content-length") ?? 0) > MAX_ANALYTICS_BODY_BYTES) return reply(413);
  let value: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) return reply(400);
    const chunks: Uint8Array[] = [];
    let bytes = 0;
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > MAX_ANALYTICS_BODY_BYTES) { await reader.cancel(); return reply(413); }
      chunks.push(chunk.value);
    }
    value = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch { return reply(400); }
  const values = Array.isArray(value) ? value : [value];
  if (!values.length || values.length > 10) return reply(400);
  const events = values.map(item => normalizeProductEvent(item, origin, getAppEnv()));
  if (events.some(item => !item)) return reply(400);
  if (!isDatabaseConfigured("pooled")) return reply(200);
  try {
    const sql = getDatabaseClient();
    await sql.transaction(tx => events.map(item => {
      const event = item!;
      return tx.query(`
        INSERT INTO analytics_events (
          id,client_event_id,occurred_at,app,app_env,database_branch_name,
          visitor_id,session_id,event_name,page_path,device_class,properties
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'{}'::jsonb)
        ON CONFLICT (client_event_id) DO NOTHING`, [
          randomUUID(), event.clientEventId, event.occurredAt, event.app, event.environment,
          getDatabaseBranchName(), event.visitorId, event.sessionId, event.eventName, event.pagePath, event.deviceClass
        ]);
    }));
  } catch { return reply(503); }
  return reply(200, true);
}
