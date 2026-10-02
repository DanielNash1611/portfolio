import { product } from "./analytics-products";
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const id = /^(visitor|session)_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function resolveProductOrigin(app: string, origin: string | null) {
  const spec = product(app);
  if (!spec || !origin) return null;
  if ((spec.origins as readonly string[]).includes(origin)) return "production";
  // Anchor to the exact project and verified owner. Other Vercel tenants cannot qualify.
  if (new RegExp("^https://" + spec.previewPrefix + "-[a-z0-9-]+-danash1611-3756s-projects\\.vercel\\.app$").test(origin)) return "preview";
  return null;
}

export function normalizeProductEvent(value: unknown, origin: string | null, collectorEnv: string, now = Date.now()) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  if (typeof input.app !== "string") return null;
  const spec = product(input.app);
  const environment = resolveProductOrigin(input.app, origin);
  if (!spec || !environment || typeof input.eventName !== "string") return null;
  const events: readonly string[] = ["page_viewed", ...spec.start, ...spec.complete, ...spec.actions];
  if (!events.includes(input.eventName) || typeof input.clientEventId !== "string" || !uuid.test(input.clientEventId) ||
    typeof input.visitorId !== "string" || !id.test(input.visitorId) || !input.visitorId.startsWith("visitor_") ||
    typeof input.sessionId !== "string" || !id.test(input.sessionId) || !input.sessionId.startsWith("session_") ||
    typeof input.occurredAt !== "string") return null;
  const at = Date.parse(input.occurredAt);
  if (!Number.isFinite(at) || at < now - 7 * 86400000 || at > now + 300000) return null;
  // Exact static routes only. Raw identifiers, query strings, referrers and free-form properties are dropped.
  const pagePath = typeof input.pagePath === "string" && (spec.pages as readonly string[]).includes(input.pagePath) ? input.pagePath : null;
  return {
    app: input.app,
    environment: collectorEnv === "production" ? (input.validation === true ? "validation" : environment) : collectorEnv,
    clientEventId: input.clientEventId, visitorId: input.visitorId, sessionId: input.sessionId,
    eventName: input.eventName, occurredAt: new Date(at).toISOString(), pagePath,
    deviceClass: ["mobile", "tablet", "desktop"].includes(input.deviceClass as string) ? input.deviceClass : null,
    properties: {},
  };
}
