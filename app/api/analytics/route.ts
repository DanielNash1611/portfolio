import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  getAppEnv,
  getDatabaseBranchName,
  getDatabaseClient,
  isDatabaseConfigured,
} from "@/lib/db";

const APP_NAME = "portfolio";
const MAX_BODY_BYTES = 12_000;
const eventNamePattern = /^[a-z0-9_]{1,80}$/;
const blockedPropertyFragments = [
  "email",
  "phone",
  "message",
  "prompt",
  "content",
  "full_name",
  "fullname",
  "ip",
  "user_agent",
];

type AnalyticsPayload = {
  clientEventId?: unknown;
  occurredAt?: unknown;
  visitorId?: unknown;
  sessionId?: unknown;
  eventName?: unknown;
  pagePath?: unknown;
  referrerHost?: unknown;
  deviceClass?: unknown;
  properties?: unknown;
};

function isAllowedOrigin(request: NextRequest): boolean {
  if (request.headers.get("sec-fetch-site") === "cross-site") {
    return false;
  }

  const origin = request.headers.get("origin");
  if (!origin) {
    return true;
  }

  try {
    const hostname = new URL(origin).hostname.toLowerCase();
    return (
      hostname === "danielnash.co" ||
      hostname === "www.danielnash.co" ||
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.endsWith(".vercel.app")
    );
  } catch {
    return false;
  }
}

function normalizeString(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const normalized = value.trim();
  return normalized ? normalized.slice(0, maxLength) : null;
}

function isBlockedPropertyKey(key: string): boolean {
  const normalized = key.toLowerCase();
  return blockedPropertyFragments.some((fragment) =>
    normalized.includes(fragment),
  );
}

function sanitizeValue(value: unknown, depth = 0): unknown {
  if (depth > 2 || value === null) return null;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") return value.slice(0, 300);

  if (Array.isArray(value)) {
    return value.slice(0, 20).map((item) => sanitizeValue(item, depth + 1));
  }

  if (typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, nestedValue] of Object.entries(value).slice(0, 30)) {
      if (isBlockedPropertyKey(key)) continue;
      result[key.slice(0, 80)] = sanitizeValue(nestedValue, depth + 1);
    }
    return result;
  }

  return null;
}

function sanitizeProperties(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }
  return sanitizeValue(value) as Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  if (!isDatabaseConfigured("pooled")) {
    return NextResponse.json({ ok: true, stored: false });
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false }, { status: 413 });
  }

  let payload: AnalyticsPayload;
  try {
    payload = (await request.json()) as AnalyticsPayload;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const clientEventId = normalizeString(payload.clientEventId, 80);
  const visitorId = normalizeString(payload.visitorId, 120);
  const sessionId = normalizeString(payload.sessionId, 120);
  const eventName = normalizeString(payload.eventName, 80);
  const pagePath = normalizeString(payload.pagePath, 500);
  const referrerHost = normalizeString(payload.referrerHost, 255);
  const deviceClass = normalizeString(payload.deviceClass, 20);
  const occurredAt = normalizeString(payload.occurredAt, 80);

  if (
    !clientEventId ||
    !visitorId ||
    !sessionId ||
    !eventName ||
    !eventNamePattern.test(eventName)
  ) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const occurredAtDate = occurredAt ? new Date(occurredAt) : new Date();
  if (Number.isNaN(occurredAtDate.getTime())) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const safeDeviceClass =
    deviceClass === "mobile" ||
    deviceClass === "tablet" ||
    deviceClass === "desktop"
      ? deviceClass
      : null;

  const propertiesJson = JSON.stringify(sanitizeProperties(payload.properties));
  if (Buffer.byteLength(propertiesJson, "utf8") > 8_000) {
    return NextResponse.json({ ok: false }, { status: 413 });
  }

  try {
    await getDatabaseClient().query(
      `
        INSERT INTO analytics_events (
          id, client_event_id, occurred_at, app, app_env, database_branch_name,
          visitor_id, session_id, event_name, page_path, referrer_host,
          device_class, properties
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13::jsonb
        )
        ON CONFLICT (client_event_id) DO NOTHING
      `,
      [
        randomUUID(),
        clientEventId,
        occurredAtDate.toISOString(),
        APP_NAME,
        getAppEnv(),
        getDatabaseBranchName(),
        visitorId,
        sessionId,
        eventName,
        pagePath,
        referrerHost,
        safeDeviceClass,
        propertiesJson,
      ],
    );
  } catch (error) {
    console.error("[analytics:ingest]", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true, stored: true });
}
