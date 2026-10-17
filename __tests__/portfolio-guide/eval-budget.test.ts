import assert from "node:assert/strict";
import test from "node:test";
import { createEvaluationBudgetGuard } from "@/lib/portfolio-guide/evals/budget";

const scopeSha256 = "a".repeat(64);
const approval = {
  approved: true,
  ceilingUsd: 10,
  scopeSha256,
  pricingVerified: true,
};
const payload = (index = 0, model = "gpt-5.6-terra") =>
  JSON.stringify({
    model,
    store: false,
    service_tier: "default",
    max_output_tokens: 1200,
    input: `Synthetic public-safe case ${index}`,
  });
const init = (body = payload()): RequestInit => ({ method: "POST", body });
const endpoint = "https://api.openai.com/v1/responses";
function guard(
  overrides: Partial<typeof approval> = {},
  transport?: typeof fetch,
) {
  let calls = 0;
  const budget = createEvaluationBudgetGuard({
    approval: { ...approval, ...overrides },
    scopeSha256,
    fetch:
      transport ??
      (async () => {
        calls++;
        return Response.json({
          model: "gpt-5.6-terra",
          usage: { input_tokens: 100, output_tokens: 30 },
        });
      }),
  });
  return { ...budget, calls: () => calls };
}
test("unapproved, mismatched or unpriced evaluation never reaches transport", async () => {
  for (const change of [
    { approved: false },
    { pricingVerified: false },
    { scopeSha256: "b".repeat(64) },
    { ceilingUsd: 11 },
  ]) {
    const budget = guard(change);
    await assert.rejects(budget.fetch(endpoint, init()));
    assert.equal(budget.calls(), 0);
  }
});
test("guard reserves the complete role maximum and retains nonsecret usage", async () => {
  const budget = guard();
  await budget.fetch(endpoint, init());
  const result = budget.snapshot();
  assert.equal(result.reservedUsd, 0.3);
  assert.equal(result.ledger[0].usageCostUpperBoundNano, 2_500_000);
  assert.equal(result.ledger[0].status, "complete");
  assert.doesNotMatch(JSON.stringify(result), /Synthetic public-safe/);
});
test("full planned call ceilings reserve $7.776 and reject an extra call", async () => {
  const budget = guard({}, async (_input, options) =>
    Response.json({
      model: JSON.parse(options!.body as string).model,
      usage: { input_tokens: 100, output_tokens: 0 },
    }),
  );
  for (let i = 0; i < 24; i++) await budget.fetch(endpoint, init(payload(i)));
  for (let i = 0; i < 6; i++)
    await budget.fetch(endpoint, init(payload(i, "gpt-6.1-sol")));
  for (let i = 0; i < 36; i++)
    await budget.fetch(
      "https://api.openai.com/v1/decisions",
      init(JSON.stringify({ model: "gpt-6-luna", input: String(i) })),
    );
  assert.equal(budget.snapshot().reservedUsd, 7.776);
  await assert.rejects(budget.fetch(endpoint, init(payload(24))), /call limit/);
});
test("budget rejects insufficient allowance, unknown models, excess tokens and external tools before transport", async () => {
  const budget = guard({ ceilingUsd: 0.29 });
  await assert.rejects(budget.fetch(endpoint, init()), /budget/);
  assert.equal(budget.calls(), 0);
  for (const body of [
    payload(0, "unapproved-model"),
    JSON.stringify({ model: "gpt-5.6-terra", max_output_tokens: 1201 }),
    JSON.stringify({
      model: "gpt-5.6-terra",
      store: false,
      service_tier: "default",
      max_output_tokens: 1200,
      input: "x".repeat(24000),
    }),
    JSON.stringify({
      model: "gpt-5.6-terra",
      store: false,
      service_tier: "default",
      max_output_tokens: 1200,
      tools: [{ type: "web_search" }],
    }),
  ]) {
    const bounded = guard();
    await assert.rejects(bounded.fetch(endpoint, init(body)));
    assert.equal(bounded.calls(), 0);
  }
});
test("duplicate calls, concurrent calls and unknown usage cannot silently retry", async () => {
  const duplicate = guard();
  await duplicate.fetch(endpoint, init());
  await assert.rejects(duplicate.fetch(endpoint, init()), /Duplicate/);
  let release!: (value: Response) => void;
  const concurrent = guard(
    {},
    async () =>
      new Promise<Response>((resolve) => {
        release = resolve;
      }),
  );
  const first = concurrent.fetch(endpoint, init());
  await assert.rejects(
    concurrent.fetch(endpoint, init(payload(1))),
    /sequentially/,
  );
  release(Response.json({ usage: { input_tokens: 20, output_tokens: 0 } }));
  await first;
  const missing = guard({}, async () => Response.json({}));
  await assert.rejects(missing.fetch(endpoint, init()), /usage/);
  await assert.rejects(missing.fetch(endpoint, init(payload(1))), /stopped/);
  assert.equal(missing.snapshot().reservedUsd, 0.3);
});
test("transport errors and exceeded usage keep the reservation and stop further calls", async () => {
  for (const transport of [
    async () => {
      throw new Error("network uncertain");
    },
    async () =>
      Response.json({ usage: { input_tokens: 999999, output_tokens: 2 } }),
    async () => new Response("failure", { status: 500 }),
  ]) {
    const budget = guard({}, transport);
    await assert.rejects(budget.fetch(endpoint, init()));
    assert.equal(budget.snapshot().stopped, true);
    assert.equal(budget.snapshot().reservedUsd, 0.3);
    await assert.rejects(budget.fetch(endpoint, init(payload(1))), /stopped/);
  }
});

test("reservation is persisted before transport, and journal failure prevents a request", async () => {
  const events: string[] = [];
  const budget = createEvaluationBudgetGuard({
    approval,
    scopeSha256,
    onChange: (state) => {
      events.push(state.ledger.at(-1)!.status);
    },
    fetch: async () => {
      assert.deepEqual(events, ["reserved"]);
      events.push("transport");
      return Response.json({ usage: { input_tokens: 20, output_tokens: 0 } });
    },
  });
  await budget.fetch(endpoint, init());
  assert.deepEqual(events, ["reserved", "transport", "complete"]);
  let transported = false;
  const failedJournal = createEvaluationBudgetGuard({
    approval,
    scopeSha256,
    onChange: () => {
      throw new Error("journal unavailable");
    },
    fetch: async () => {
      transported = true;
      return Response.json({});
    },
  });
  await assert.rejects(
    failedJournal.fetch(endpoint, init()),
    /journal unavailable/,
  );
  assert.equal(transported, false);
  assert.equal(failedJournal.snapshot().stopped, true);
});

test("large requests require a matching verified token-count receipt and never lose evidence to fit", async () => {
  const largeBody = JSON.stringify({
    model: "gpt-5.6-terra",
    store: false,
    service_tier: "default",
    max_output_tokens: 1200,
    input: "x".repeat(70000),
  });
  let transported = false;
  const budget = createEvaluationBudgetGuard({
    approval,
    scopeSha256,
    countInputTokens: async (_body, requestSha256) => ({
      inputTokens: 20000,
      requestSha256,
      model: "gpt-5.6-terra",
    }),
    fetch: async (_input, options) => {
      transported = true;
      assert.equal(options!.body, largeBody);
      return Response.json({
        usage: { input_tokens: 20000, output_tokens: 1 },
      });
    },
  });
  await budget.fetch(endpoint, init(largeBody));
  assert.equal(transported, true);
  assert.equal(
    budget.snapshot().ledger[0].inputTokenSource,
    "verified-counter",
  );
  const mismatch = createEvaluationBudgetGuard({
    approval,
    scopeSha256,
    countInputTokens: async () => ({
      inputTokens: 1,
      requestSha256: "wrong",
      model: "gpt-5.6-terra",
    }),
    fetch: async () => {
      throw new Error("must not reach transport");
    },
  });
  await assert.rejects(mismatch.fetch(endpoint, init(largeBody)), /receipt/);
  assert.equal(mismatch.snapshot().stopped, true);
  assert.equal(mismatch.snapshot().reservedUsd, 0);
});
