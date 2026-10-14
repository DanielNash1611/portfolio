// Explicit owner preference, separate from analytics consent and per-app identities.
const OWNER_KEY = "daniel-analytics:owner";
const OWNER_COOKIE = "daniel_analytics_owner";

export function isOwnerTraffic() {
  if (typeof window === "undefined") return false;
  try {
    const local = window.localStorage.getItem(OWNER_KEY);
    if (local === "true" || local === "false") return local === "true";
  } catch {
    /* use the preference cookie when storage is unavailable */
  }
  try {
    return document.cookie
      .split(";")
      .some((item) => item.trim() === OWNER_COOKIE + "=1");
  } catch {
    return false;
  }
}

export function setupOwnerTraffic() {
  if (typeof window === "undefined") return;
  let url;
  try {
    url = new URL(window.location.href);
  } catch {
    return;
  }
  let setting = url.searchParams.get("analytics_owner");
  // A sign-in redirect can preserve the setup marker in its same-origin return URL.
  if (setting === null && url.searchParams.has("callbackUrl")) {
    try {
      const callback = new URL(url.searchParams.get("callbackUrl"));
      if (callback.origin === url.origin) {
        setting = callback.searchParams.get("analytics_owner");
        if (setting === "1" || setting === "0") {
          callback.searchParams.delete("analytics_owner");
          url.searchParams.set("callbackUrl", callback.href);
        }
      }
    } catch {
      /* unrelated sign-in parameters remain untouched */
    }
  }
  if (setting !== "1" && setting !== "0") return;
  const owner = setting === "1";
  try {
    window.localStorage.setItem(OWNER_KEY, String(owner));
    // Explicit owner enrollment keeps testing recorded. DNT/GPC still take precedence.
    if (owner)
      window.localStorage.setItem("daniel-analytics:disabled", "false");
  } catch {
    /* consent and identifiers retain their usual memory fallback */
  }
  for (const domain of ["danielnash.co", "musicofdanielnash.com"]) {
    if (url.hostname === domain || url.hostname.endsWith("." + domain)) {
      try {
        document.cookie = `${OWNER_COOKIE}=${owner ? "1" : "0"}; Max-Age=31536000; Path=/; Domain=${domain}; SameSite=Lax; Secure`;
      } catch {
        /* local preference remains usable */
      }
    }
  }
  url.searchParams.delete("analytics_owner");
  try {
    window.history.replaceState(
      window.history.state,
      "",
      url.pathname + url.search + url.hash,
    );
  } catch {
    /* setup never interrupts the app */
  }
}
