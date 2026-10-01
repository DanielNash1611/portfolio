import test from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { normalizeAnalyticsPayload } from "../lib/analytics-payload";
import { getAppEnv } from "../lib/db";
import { POST } from "../app/api/analytics/route";

const now = Date.now();
const payload = {
  clientEventId: "12345678-1234-1234-1234-123456789abc",
  visitorId: "visitor_test",
  sessionId: "session_test",
  eventName: "page_viewed",
  occurredAt: new Date(now).toISOString(),
  pagePath: "/creative/gravity",
  properties: { page_group: "creative" },
};
test("analytics only retains event-specific properties", () => {
  const result = normalizeAnalyticsPayload(
    {
      ...payload,
      properties: {
        page_group: "creative",
        email: "person@example.test",
        nested: { message: "private" },
        label: "private",
        name: "private",
      },
    },
    now,
  );
  assert.deepEqual(result?.properties, { page_group: "creative" });
});
test("analytics rejects malformed events and bounds timestamps", () => {
  for (const value of [
    null,
    [],
    { ...payload, clientEventId: "no" },
    { ...payload, visitorId: "email@example.test" },
    { ...payload, eventName: "custom" },
    { ...payload, occurredAt: "2099-01-01" },
    { ...payload, occurredAt: "2000-01-01" },
  ])
    assert.equal(normalizeAnalyticsPayload(value, now), null);
});
test("analytics removes URL query data and invalid scroll values", () => {
  assert.equal(
    normalizeAnalyticsPayload(
      {
        ...payload,
        pagePath: "/?email=person@example.test",
        referrerHost: "https://example.test/private",
      },
      now,
    )?.pagePath,
    null,
  );
  assert.equal(
    normalizeAnalyticsPayload(
      {
        ...payload,
        eventName: "scroll_depth_reached",
        properties: { threshold: "75" },
      },
      now,
    ),
    null,
  );
  assert.deepEqual(
    normalizeAnalyticsPayload(
      {
        ...payload,
        eventName: "scroll_depth_reached",
        properties: { threshold: 75 },
      },
      now,
    )?.properties,
    { threshold: 75 },
  );
});
test("analytics retains real résumé download paths without URL parameters", () => {
  assert.deepEqual(
    normalizeAnalyticsPayload(
      {
        ...payload,
        eventName: "download_clicked",
        properties: {
          from_path: "/resume",
          target_path: "/resumes/daniel-nash-ai-product-leader.pdf",
          email: "private",
        },
      },
      now,
    )?.properties,
    {
      from_path: "/resume",
      target_path: "/resumes/daniel-nash-ai-product-leader.pdf",
    },
  );
});
test("Vercel preview takes precedence over an inherited production label", () => {
  const prior = { vercel: process.env.VERCEL_ENV, app: process.env.APP_ENV };
  try {
    process.env.VERCEL_ENV = "preview";
    process.env.APP_ENV = "production";
    assert.equal(getAppEnv(), "preview");
  } finally {
    if (prior.vercel === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = prior.vercel;
    if (prior.app === undefined) delete process.env.APP_ENV;
    else process.env.APP_ENV = prior.app;
  }
});
test("ingestion handles null JSON and limits bodies without Content-Length", async () => {
  const request = (body: string) =>
    new NextRequest("http://localhost:3000/api/analytics", {
      method: "POST",
      headers: {
        origin: "http://localhost:3000",
        "content-type": "application/json",
      },
      body,
    });
  assert.equal((await POST(request("null"))).status, 400);
  assert.equal(
    (
      await POST(
        request(JSON.stringify({ ...payload, padding: "x".repeat(12000) })),
      )
    ).status,
    413,
  );
});
test("ingestion rejects other Vercel origins", async () => {
  const request = new NextRequest("http://localhost:3000/api/analytics", {
    method: "POST",
    headers: { origin: "https://other.vercel.app" },
    body: JSON.stringify(payload),
  });
  assert.equal((await POST(request)).status, 403);
});
test("same-origin delivery uses the original Host when NextURL normalizes loopback", async () => {
  const request = new NextRequest("http://localhost:4317/api/analytics", {
    method: "POST",
    headers: { origin: "http://127.0.0.1:4317", host: "127.0.0.1:4317" },
    body: "null",
  });
  assert.equal((await POST(request)).status, 400);
});

test("blocked browser storage keeps identifiers stable and a failed beacon uses fetch", async () => {
  const { track } = await import("../lib/analytics");
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const originalNavigator = Object.getOwnPropertyDescriptor(
    globalThis,
    "navigator",
  );
  const originalDocument = Object.getOwnPropertyDescriptor(
    globalThis,
    "document",
  );
  const originalFetch = globalThis.fetch;
  const originalEnv = process.env.NODE_ENV;
  const sent: Array<Record<string, unknown>> = [];
  const fakeWindow = {
    location: { pathname: "/resume" },
    innerWidth: 1200,
    get localStorage() {
      throw new Error("Storage denied");
    },
    get sessionStorage() {
      throw new Error("Storage denied");
    },
  };
  try {
    Object.defineProperty(globalThis, "window", {
      value: fakeWindow,
      configurable: true,
    });
    Object.defineProperty(globalThis, "document", {
      value: { referrer: "" },
      configurable: true,
    });
    Object.defineProperty(globalThis, "navigator", {
      value: { doNotTrack: "0", sendBeacon: () => false },
      configurable: true,
    });
    (process.env as Record<string, string | undefined>).NODE_ENV = "production";
    globalThis.fetch = async (_url, init) => {
      sent.push(JSON.parse(String(init?.body)));
      return new Response();
    };
    track("page_viewed");
    track("download_clicked");
    assert.equal(sent.length, 2);
    assert.equal(sent[0].visitorId, sent[1].visitorId);
    assert.equal(sent[0].sessionId, sent[1].sessionId);
    Object.defineProperty(globalThis, "navigator", {
      value: { doNotTrack: "1" },
      configurable: true,
    });
    track("page_viewed");
    assert.equal(sent.length, 2);
  } finally {
    for (const [name, descriptor] of [
      ["window", originalWindow],
      ["navigator", originalNavigator],
      ["document", originalDocument],
    ] as const) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else Reflect.deleteProperty(globalThis, name);
    }
    globalThis.fetch = originalFetch;
    if (originalEnv === undefined)
      delete (process.env as Record<string, string | undefined>).NODE_ENV;
    else
      (process.env as Record<string, string | undefined>).NODE_ENV =
        originalEnv;
  }
});
