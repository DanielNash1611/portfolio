import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  getAppEnv,
  getDatabaseBranchName,
  getDatabaseClient,
  isDatabaseConfigured,
} from "@/lib/db";
import { isAllowedOrigin } from "@/lib/contact";
import {
  MAX_ANALYTICS_BODY_BYTES,
  normalizeAnalyticsPayload,
} from "@/lib/analytics-payload";

function allowedOrigin(request: NextRequest): boolean {
  if (isAllowedOrigin(request)) return true;
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const parsed = new URL(origin);
    // NextURL can normalize 127.0.0.1 to localhost. Compare the original Host
    // header for same-origin delivery while retaining configured site origins.
    return (
      parsed.host === request.headers.get("host") &&
      parsed.protocol === request.nextUrl.protocol
    );
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (
    request.headers.get("sec-fetch-site") === "cross-site" ||
    !allowedOrigin(request)
  ) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }
  if (
    Number(request.headers.get("content-length") ?? 0) >
    MAX_ANALYTICS_BODY_BYTES
  ) {
    return NextResponse.json({ ok: false }, { status: 413 });
  }
  let value: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) return NextResponse.json({ ok: false }, { status: 400 });
    const chunks: Uint8Array[] = [];
    let bytes = 0;
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > MAX_ANALYTICS_BODY_BYTES) {
        await reader.cancel();
        return NextResponse.json({ ok: false }, { status: 413 });
      }
      chunks.push(chunk.value);
    }
    value = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const payload = normalizeAnalyticsPayload(value);
  if (!payload) return NextResponse.json({ ok: false }, { status: 400 });
  if (!isDatabaseConfigured("pooled"))
    return NextResponse.json({ ok: true, stored: false });
  try {
    await getDatabaseClient().query(
      `
      INSERT INTO analytics_events (
        id, client_event_id, occurred_at, app, app_env, database_branch_name,
        visitor_id, session_id, event_name, page_path, referrer_host, device_class, properties
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13::jsonb)
      ON CONFLICT (client_event_id) DO NOTHING`,
      [
        randomUUID(),
        payload.clientEventId,
        payload.occurredAt,
        "portfolio",
        getAppEnv(),
        getDatabaseBranchName(),
        payload.visitorId,
        payload.sessionId,
        payload.eventName,
        payload.pagePath,
        payload.referrerHost,
        payload.deviceClass,
        JSON.stringify(payload.properties),
      ],
    );
  } catch (error) {
    console.error("[analytics:ingest] Database write failed", {
      code: (error as { code?: string })?.code,
    });
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true, stored: true });
}
