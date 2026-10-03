import test from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { normalizeFeedback, networkKey } from "../lib/feedback";
import { POST } from "../app/api/feedback/route";
const payload = {
  clientSubmissionId: "11111111-1111-4111-8111-111111111111",
  category: "problem",
  message: "A link did not open.",
  pagePath: "/resume",
  visitorId: "visitor_test",
  sessionId: "session_test",
};
test("feedback validates explicit fields and drops unexpected content", () => {
  const clean = normalizeFeedback({
    ...payload,
    message: "  A link did not open.  ",
    email: "private@example.test",
    properties: { secret: "private" },
  });
  assert.deepEqual(clean, payload);
  assert.equal(
    normalizeFeedback({ ...payload, visitorId: null, sessionId: null })
      ?.visitorId,
    null,
  );
  for (const change of [
    { message: " " },
    { message: "x".repeat(2001) },
    { message: "bad\0text" },
    { category: "bad" },
    { category: ["problem"] },
    { category: { toString: null } },
    { clientSubmissionId: "bad" },
    { pagePath: "/?email=private" },
    { visitorId: "private@example.test" },
    { sessionId: null },
  ])
    assert.equal(normalizeFeedback({ ...payload, ...change }), null);
});
test("network keys rotate daily and expose no raw address", () => {
  const key = networkKey(
    "192.0.2.1",
    "synthetic-secret",
    new Date("2026-10-01T00:00:00Z"),
  );
  assert.match(key, /^[a-f0-9]{64}$/);
  assert.ok(!key.includes("192.0.2.1"));
  assert.notEqual(
    key,
    networkKey(
      "192.0.2.1",
      "synthetic-secret",
      new Date("2026-10-02T00:00:00Z"),
    ),
  );
});
test("feedback rejects cross-site, malformed, oversized, and honeypot bodies before persistence", async () => {
  const request = (body: string, origin = "http://localhost:3000") =>
    new NextRequest("http://localhost:3000/api/feedback", {
      method: "POST",
      headers: { origin, "content-type": "application/json" },
      body,
    });
  assert.equal(
    (await POST(request(JSON.stringify(payload), "https://other.example")))
      .status,
    403,
  );
  assert.equal((await POST(request("null"))).status, 400);
  assert.equal(
    (
      await POST(
        request(JSON.stringify({ ...payload, extra: "é".repeat(6500) })),
      )
    ).status,
    413,
  );
  assert.equal(
    (await POST(request(JSON.stringify({ ...payload, website: "spam" }))))
      .status,
    400,
  );
});
test("feedback never reports success without database and limiter configuration", async () => {
  const original = process.env.FEEDBACK_RATE_LIMIT_SECRET;
  delete process.env.FEEDBACK_RATE_LIMIT_SECRET;
  try {
    const response = await POST(
      new NextRequest("http://localhost:3000/api/feedback", {
        method: "POST",
        headers: {
          origin: "http://localhost:3000",
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      }),
    );
    assert.equal(response.status, 503);
    assert.equal((await response.json()).ok, false);
  } finally {
    if (original === undefined) delete process.env.FEEDBACK_RATE_LIMIT_SECRET;
    else process.env.FEEDBACK_RATE_LIMIT_SECRET = original;
  }
});
test("feedback identity honors opt-outs before accessing browser storage", async () => {
  const { feedbackAnalyticsIdentity } = await import("../lib/analytics");
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window"),
    originalNavigator = Object.getOwnPropertyDescriptor(
      globalThis,
      "navigator",
    );
  try {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        get localStorage() {
          throw new Error("Must not access storage");
        },
      },
    });
    Object.defineProperty(globalThis, "navigator", {
      configurable: true,
      value: { doNotTrack: "1" },
    });
    assert.equal(feedbackAnalyticsIdentity(), null);
    Object.defineProperty(globalThis, "navigator", {
      configurable: true,
      value: { globalPrivacyControl: true },
    });
    assert.equal(feedbackAnalyticsIdentity(), null);
  } finally {
    if (originalWindow)
      Object.defineProperty(globalThis, "window", originalWindow);
    else Reflect.deleteProperty(globalThis, "window");
    if (originalNavigator)
      Object.defineProperty(globalThis, "navigator", originalNavigator);
    else Reflect.deleteProperty(globalThis, "navigator");
  }
});
