export type AnalyticsEventProps = Record<string, unknown>;

const VISITOR_KEY = "daniel_analytics_visitor_id";
const SESSION_KEY = "daniel_analytics_session_id";
const fallbackIds = new Map<string, string>();

function storedId(
  storageName: "localStorage" | "sessionStorage",
  key: string,
  prefix: string,
): string {
  try {
    const storage = window[storageName];
    const existing = storage.getItem(key);
    if (existing) return existing;
    const created = fallbackIds.get(key) ?? createId(prefix);
    fallbackIds.set(key, created);
    storage.setItem(key, created);
    return created;
  } catch {
    const created = fallbackIds.get(key) ?? createId(prefix);
    fallbackIds.set(key, created);
    return created;
  }
}

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

  return storedId("localStorage", VISITOR_KEY, "visitor");
}

function getSessionId(): string {
  if (typeof window === "undefined") {
    return "server";
  }

  return storedId("sessionStorage", SESSION_KEY, "session");
}

// Explicit feedback uses the same pseudonymous identity as event collection.
// Opt-outs return before touching storage or creating identifiers.
export function feedbackAnalyticsIdentity(): {
  visitorId: string;
  sessionId: string;
} | null {
  if (
    typeof window === "undefined" ||
    navigator.doNotTrack === "1" ||
    (navigator as Navigator & { globalPrivacyControl?: boolean })
      .globalPrivacyControl === true ||
    process.env.NEXT_PUBLIC_ANALYTICS_DISABLED === "true"
  )
    return null;
  return { visitorId: getVisitorId(), sessionId: getSessionId() };
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
  if (
    typeof window === "undefined" ||
    navigator.doNotTrack === "1" ||
    process.env.NEXT_PUBLIC_ANALYTICS_DISABLED === "true"
  )
    return;

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
    try {
      if (navigator.sendBeacon("/api/analytics", blob)) return;
    } catch {
      // Browsers can reject beacon delivery; try the fetch fallback.
    }
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
