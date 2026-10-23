import assert from "node:assert/strict";
import test from "node:test";
import {
  callEvidenceTool,
  EVIDENCE_FETCH_TIMEOUT_MS,
} from "@/lib/portfolio-guide/tools/evidence";
const config = { apiUrl: "https://synthetic.test", apiKey: "synthetic-only" };

test("a delayed cold-start response uses one bounded attempt and can succeed", async (t) => {
  const timeout = new AbortController();
  let calls = 0;
  t.mock.method(AbortSignal, "timeout", (ms: number) => {
    assert.equal(ms, 40000);
    return timeout.signal;
  });
  let release!: (response: Response) => void;
  t.mock.method(
    globalThis,
    "fetch",
    async (_url: RequestInfo | URL, init?: RequestInit) => {
      calls++;
      assert.ok(init?.signal);
      return new Promise<Response>((resolve) => {
        release = resolve;
      });
    },
  );
  const result = callEvidenceTool(
    { query: "Synthetic public onboarding question" },
    config,
  );
  assert.equal(calls, 1);
  release(new Response(JSON.stringify({ evidence: [] }), { status: 200 }));
  assert.equal((await result).ok, true);
  assert.equal(calls, 1);
  assert.ok(EVIDENCE_FETCH_TIMEOUT_MS < 60000);
});

for (const phase of ["headers", "body"] as const) {
  test(`timeout during ${phase} aborts once and returns the timeout fallback reason`, async (t) => {
    const timeout = new AbortController();
    let calls = 0;
    t.mock.method(AbortSignal, "timeout", () => timeout.signal);
    let started!: () => void;
    const ready = new Promise<void>((resolve) => {
      started = resolve;
    });
    const pending = (signal: AbortSignal) =>
      new Promise<never>((_resolve, reject) => {
        signal.addEventListener("abort", () => reject(signal.reason), {
          once: true,
        });
        started();
      });
    t.mock.method(
      globalThis,
      "fetch",
      async (_url: RequestInfo | URL, init?: RequestInit) => {
        calls++;
        const signal = init?.signal;
        assert.ok(signal);
        if (phase === "headers") return pending(signal);
        const response = new Response("{}");
        t.mock.method(response, "json", () => pending(signal));
        return response;
      },
    );
    const result = callEvidenceTool(
      { query: "Synthetic public question" },
      config,
    );
    await ready;
    timeout.abort(new DOMException("Synthetic timeout", "TimeoutError"));
    assert.deepEqual(await result, { ok: false, reason: "timeout" });
    assert.equal(calls, 1);
  });
}

test("caller cancellation still aborts body reading without a replacement request", async (t) => {
  const caller = new AbortController();
  const budget = new AbortController();
  let calls = 0;
  t.mock.method(AbortSignal, "timeout", () => budget.signal);
  let started!: () => void;
  const ready = new Promise<void>((resolve) => {
    started = resolve;
  });
  t.mock.method(
    globalThis,
    "fetch",
    async (_url: RequestInfo | URL, init?: RequestInit) => {
      calls++;
      const signal = init?.signal;
      assert.ok(signal);
      const response = new Response("{}");
      t.mock.method(
        response,
        "json",
        () =>
          new Promise<never>((_resolve, reject) => {
            signal.addEventListener("abort", () => reject(signal.reason), {
              once: true,
            });
            started();
          }),
      );
      return response;
    },
  );
  const result = callEvidenceTool(
    { query: "Synthetic public question" },
    config,
    caller.signal,
  );
  await ready;
  caller.abort(new DOMException("Cancelled", "AbortError"));
  assert.deepEqual(await result, { ok: false, reason: "network_error" });
  assert.equal(calls, 1);
  assert.equal(budget.signal.aborted, false);
});
