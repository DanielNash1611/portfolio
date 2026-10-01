export type AnalyticsEventProps = Record<string, unknown>;

const VISITOR_KEY = "daniel_analytics_visitor_id";
const SESSION_KEY = "daniel_analytics_session_id";

function createId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function getVisitorId(): string {
  if (typeof window === "undefined") {
    return "server";
  }

  const existing = window.localStorage.getItem(VISITOR_KEY);
  if (existing) return existing;

  const created = createId("visitor");
  window.localStorage.setItem(VISITOR_KEY, created);
  return created;
}

function getSessionId(): string {
  if (typeof window === "undefined") {
    return "server";
  }

  const existing = window.sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  const created = createId("session");
  window.sessionStorage.setItem(SESSION_KEY, created);
  return created;
}

function getDeviceClass(): "mobile" | "tablet" | "desktop" {
  if (typeof window === "undefined") return "desktop";

  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1100) return "tablet";
  return "desktop";
}

function getReferrerHost(): string | null {
  if (typeof document === "undefined" || !document.referrer) return null;

  try {
    return new URL(document.referrer).hostname;
  } catch {
    return null;
  }
}

export function classifyPage(pathname: string): string {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/work")) return "work";
  if (pathname.startsWith("/products")) return "product";
  if (pathname.startsWith("/creative")) return "creative";
  if (pathname.startsWith("/case-studies")) return "case_study";
  if (pathname.startsWith("/thinking")) return "thinking";
  if (pathname.startsWith("/music")) return "music";
  if (pathname.startsWith("/resume")) return "resume";
  if (pathname.startsWith("/about")) return "about";
  if (pathname.startsWith("/contact")) return "contact";
  return "other";
}

export const track = (
  eventName: string,
  properties: AnalyticsEventProps = {},
): void => {
  if (typeof window === "undefined") {
    return;
  }

  const payload = {
    clientEventId: crypto.randomUUID(),
    occurredAt: new Date().toISOString(),
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
    eventName,
    pagePath: window.location.pathname,
    referrerHost: getReferrerHost(),
    deviceClass: getDeviceClass(),
    properties,
  };

  if (process.env.NODE_ENV !== "production") {
    console.info("[analytics]", payload);
    return;
  }

  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon("/api/analytics", blob);
    return;
  }

  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    // Analytics must never break the user experience.
  });
};
