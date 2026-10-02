export const MAX_ANALYTICS_BODY_BYTES = 12_000;
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const path =
  /^\/(?:[a-z0-9_-]+(?:\.[a-z0-9_-]+)*(?:\/[a-z0-9_-]+(?:\.[a-z0-9_-]+)*)*)?\/?$/i;
const groups = new Set([
  "home",
  "work",
  "product",
  "creative",
  "case_study",
  "thinking",
  "music",
  "resume",
  "about",
  "contact",
  "other",
]);
const events = new Set([
  "page_viewed",
  "internal_link_clicked",
  "external_link_clicked",
  "download_clicked",
  "scroll_depth_reached",
  "contact_submitted",
]);

function cleanPath(value: unknown): string | null {
  return typeof value === "string" && value.length <= 500 && path.test(value)
    ? value
    : null;
}
function cleanHost(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 255) return null;
  return /^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i.test(value)
    ? value.toLowerCase()
    : null;
}

export function normalizeAnalyticsPayload(value: unknown, now = Date.now()) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const payload = value as Record<string, unknown>;
  if (
    typeof payload.clientEventId !== "string" ||
    !uuid.test(payload.clientEventId) ||
    typeof payload.visitorId !== "string" ||
    !/^visitor_[a-z0-9_-]{1,100}$/i.test(payload.visitorId) ||
    typeof payload.sessionId !== "string" ||
    !/^session_[a-z0-9_-]{1,100}$/i.test(payload.sessionId) ||
    typeof payload.eventName !== "string" ||
    !events.has(payload.eventName) ||
    typeof payload.occurredAt !== "string"
  )
    return null;
  const timestamp = Date.parse(payload.occurredAt);
  if (
    !Number.isFinite(timestamp) ||
    timestamp < now - 7 * 86_400_000 ||
    timestamp > now + 300_000
  )
    return null;
  const raw =
    payload.properties &&
    typeof payload.properties === "object" &&
    !Array.isArray(payload.properties)
      ? (payload.properties as Record<string, unknown>)
      : {};
  const properties: Record<string, string | number> = {};
  const addPath = (key: string) => {
    const result = cleanPath(raw[key]);
    if (result) properties[key] = result;
  };
  const addGroup = (key: string) => {
    if (typeof raw[key] === "string" && groups.has(raw[key]))
      properties[key] = raw[key];
  };
  if (
    payload.eventName === "page_viewed" ||
    payload.eventName === "scroll_depth_reached"
  )
    addGroup("page_group");
  if (
    payload.eventName.endsWith("_link_clicked") ||
    payload.eventName === "download_clicked"
  )
    addPath("from_path");
  if (
    payload.eventName === "internal_link_clicked" ||
    payload.eventName === "download_clicked"
  )
    addPath("target_path");
  if (payload.eventName === "internal_link_clicked") addGroup("target_group");
  if (payload.eventName === "external_link_clicked") {
    const host = cleanHost(raw.target_host);
    if (host) properties.target_host = host;
  }
  if (payload.eventName === "scroll_depth_reached") {
    if (![25, 50, 75, 100].includes(raw.threshold as number)) return null;
    properties.threshold = raw.threshold as number;
  }
  return {
    clientEventId: payload.clientEventId,
    visitorId: payload.visitorId,
    sessionId: payload.sessionId,
    eventName: payload.eventName,
    occurredAt: new Date(timestamp).toISOString(),
    pagePath: cleanPath(payload.pagePath),
    referrerHost: cleanHost(payload.referrerHost),
    deviceClass: ["mobile", "tablet", "desktop"].includes(
      payload.deviceClass as string,
    )
      ? payload.deviceClass
      : null,
    properties,
  };
}
