import assert from "node:assert/strict";
import test from "node:test";
import { createHash } from "node:crypto";
import {
  createEvaluationBudgetGuard,
  evaluationExecutionIdentity,
  evaluationHistoryManifestHash,
  reconcileApprovedEvaluationHistory,
  reconcileCompletedEvaluationLedgers,
  type ApprovedEvaluationHistory,
  type CapturedEvaluationExecution,
} from "@/lib/portfolio-guide/evals/budget";

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
  assert.equal(result.reservedUsd, 0.3442);
  assert.equal(result.ledger[0].usageCostUpperBoundNano, 805_000);
  assert.equal(result.ledger[0].status, "complete");
  assert.doesNotMatch(JSON.stringify(result), /Synthetic public-safe/);
});
test("full planned call ceilings reserve $8.2284 and reject an extra call", async () => {
  const budget = guard({}, async (_input, options) =>
    Response.json({
      model: JSON.parse(options!.body as string).model,
      usage: { input_tokens: 100, output_tokens: 0 },
    }),
  );
  for (let i = 0; i < 12; i++) await budget.fetch(endpoint, init(payload(i)));
  for (let i = 0; i < 6; i++)
    await budget.fetch(endpoint, init(payload(i, "gpt-6.1-sol")));
  for (let i = 0; i < 36; i++)
    await budget.fetch(
      "https://api.openai.com/v1/decisions",
      init(JSON.stringify({ model: "gpt-6-luna", input: String(i) })),
    );
  assert.equal(budget.snapshot().reservedUsd, 8.2284);
  await assert.rejects(budget.fetch(endpoint, init(payload(12))), /call limit/);
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
      input: "x".repeat(100000),
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
  assert.equal(missing.snapshot().reservedUsd, 0.3442);
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
    assert.equal(budget.snapshot().reservedUsd, 0.3442);
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

test("the unchanged large evidence packet is admitted by a conservative byte bound without extra API calls", async () => {
  const largeBody = JSON.stringify({
    model: "gpt-5.6-terra",
    store: false,
    service_tier: "default",
    max_output_tokens: 1200,
    input: "x".repeat(70000),
  });
  let calls = 0;
  const budget = createEvaluationBudgetGuard({
    approval,
    scopeSha256,
    fetch: async (_input, options) => {
      calls++;
      assert.equal(options!.body, largeBody);
      return Response.json({
        usage: { input_tokens: 20000, output_tokens: 1 },
      });
    },
  });
  await budget.fetch(endpoint, init(largeBody));
  assert.equal(calls, 1);
  assert.equal(
    budget.snapshot().ledger[0].inputTokenSource,
    "byte-upper-bound",
  );
  const oversized = largeBody.replace("x".repeat(70000), "x".repeat(100000));
  await assert.rejects(budget.fetch(endpoint, init(oversized)), /input bound/);
  assert.equal(calls, 1);
});

test("completed prior usage consumes the total approval while original reservations remain immutable", async () => {
  const prior = guard();
  await prior.fetch(endpoint, init());
  const ledger = prior.snapshot();
  const serialized = JSON.stringify(ledger);
  let transported = false;
  const cumulative = createEvaluationBudgetGuard({
    approval: { ...approval, ceilingUsd: 0.3449 },
    scopeSha256,
    priorCompletedLedgers: [ledger],
    fetch: async () => {
      transported = true;
      return Response.json({ usage: { input_tokens: 100, output_tokens: 30 } });
    },
  });
  await assert.rejects(cumulative.fetch(endpoint, init(payload(1))), /budget/);
  assert.equal(transported, false);
  assert.equal(cumulative.snapshot().priorUsageCostUpperBoundUsd, 0.000805);
  assert.equal(JSON.stringify(ledger), serialized);
});

test("unknown, missing, inconsistent or duplicated prior usage stops before a new transport", async () => {
  const prior = guard();
  await prior.fetch(endpoint, init());
  const original = prior.snapshot();
  for (const mutate of [
    (state: typeof original) => {
      state.ledger[0].status = "unknown";
    },
    (state: typeof original) => {
      delete state.ledger[0].inputTokens;
    },
    (state: typeof original) => {
      state.ledger[0].usageCostUpperBoundNano = 0;
    },
    (state: typeof original) => {
      state.reservedUsd = 0;
    },
    (state: typeof original) => {
      state.counts.answer = 2;
    },
  ]) {
    const changed = structuredClone(original);
    mutate(changed);
    assert.throws(() =>
      createEvaluationBudgetGuard({
        approval,
        scopeSha256,
        priorCompletedLedgers: [changed],
        fetch: async () => {
          throw new Error("transport must not run");
        },
      }),
    );
  }
  assert.throws(
    () =>
      createEvaluationBudgetGuard({
        approval,
        scopeSha256,
        priorCompletedLedgers: [original, original],
        fetch: async () => Response.json({}),
      }),
    /duplicate/,
  );
});

test("a cumulative ledger cannot be reused without its settled parent ledger", async () => {
  const first = guard();
  await first.fetch(endpoint, init());
  const second = createEvaluationBudgetGuard({
    approval,
    scopeSha256,
    priorCompletedLedgers: [first.snapshot()],
    fetch: async () =>
      Response.json({ usage: { input_tokens: 100, output_tokens: 0 } }),
  });
  await second.fetch(endpoint, init(payload(1)));
  assert.throws(
    () =>
      createEvaluationBudgetGuard({
        approval,
        scopeSha256,
        priorCompletedLedgers: [second.snapshot()],
        fetch: async () => Response.json({}),
      }),
    /prior ledger chain/,
  );
  const third = createEvaluationBudgetGuard({
    approval,
    scopeSha256,
    priorCompletedLedgers: [first.snapshot(), second.snapshot()],
    fetch: async () => Response.json({}),
  });
  assert.equal(third.snapshot().priorUsageCostUpperBoundUsd, 0.00113);
});

const hash = (value: string) =>
  createHash("sha256").update(value).digest("hex");
async function reviewedHistory() {
  const first = guard();
  await first.fetch(endpoint, init());
  const one = first.snapshot();
  const two = structuredClone(one);
  two.priorUsageCostUpperBoundUsd = 0.000805;
  two.totalAdmittedUpperBoundUsd = 0.345005;
  const records: CapturedEvaluationExecution[] = [one, two].map(
    (ledger, index) => ({
      runClaimJson: JSON.stringify({
        scopeSha256,
        startedAt: `2026-10-17T0${index}:00:00.000Z`,
        mode: "live",
        retriesAllowed: false,
      }),
      approvalJson: JSON.stringify({
        ...approval,
        approvalReference: `separate-human-approval-${index}`,
      }),
      ledgerJson: JSON.stringify(ledger),
    }),
  );
  const manifest: ApprovedEvaluationHistory = {
    approved: true,
    executions: records.map((record) => ({
      executionId: evaluationExecutionIdentity(record.runClaimJson),
      scopeSha256,
      runClaimSha256: hash(record.runClaimJson),
      approvalSha256: hash(record.approvalJson),
      ledgerSha256: hash(record.ledgerJson),
    })),
    expectedCallCount: 2,
    expectedUsageCostUpperBoundNano: 1_610_000,
  };
  return { manifest, records };
}
function reviewedGuard(
  history: Awaited<ReturnType<typeof reviewedHistory>>,
  claimExecution: () => void,
  transport?: typeof fetch,
) {
  const executionId = "b".repeat(64);
  return createEvaluationBudgetGuard({
    scopeSha256,
    executionId,
    approvedPriorHistory: history,
    claimExecution,
    approval: {
      ...approval,
      executionId,
      historyManifestSha256: evaluationHistoryManifestHash(history.manifest),
      executionLimits: {
        calls: { answer: 2, judge: 2, routing: 1 },
        maximumReservedNano: 2_036_800_000,
        maximumTotalAdmissionNano: 2_038_410_000,
      },
    },
    fetch:
      transport ??
      (async (_url, options) =>
        Response.json({
          model: JSON.parse(options!.body as string).model,
          usage: { input_tokens: 100, output_tokens: 30 },
        })),
  });
}
test("reviewed separately approved runs count both identical payload charges without changing original ledgers", async () => {
  const history = await reviewedHistory();
  const before = JSON.stringify(history);
  assert.throws(
    () =>
      reconcileCompletedEvaluationLedgers(
        history.records.map((record) => JSON.parse(record.ledgerJson)),
      ),
    /duplicate/,
  );
  const receipt = reconcileApprovedEvaluationHistory(history);
  assert.equal(receipt.callCount, 2);
  assert.equal(receipt.usageCostUpperBoundNano, 1_610_000);
  assert.equal(JSON.stringify(history), before);
  let claimed = false,
    calls = 0;
  const next = reviewedGuard(
    history,
    () => {
      assert.equal(claimed, false);
      claimed = true;
    },
    async () => {
      assert.equal(claimed, true);
      calls++;
      return Response.json({ usage: { input_tokens: 100, output_tokens: 30 } });
    },
  );
  await next.fetch(endpoint, init()); // Intentional cross-run repeat of the same payload.
  await assert.rejects(next.fetch(endpoint, init()), /Duplicate/);
  assert.equal(calls, 1);
  assert.equal(next.snapshot().priorUsageCostUpperBoundUsd, 0.00161);
});
test("reviewed history rejects mismatched approvals, omissions, reused runs, duplicate same-run calls and unresolved usage", async () => {
  const original = await reviewedHistory();
  const mutations = [
    (h: typeof original) => {
      h.manifest.approved = false;
    },
    (h: typeof original) => {
      h.manifest.expectedCallCount--;
    },
    (h: typeof original) => {
      h.manifest.expectedUsageCostUpperBoundNano--;
    },
    (h: typeof original) => {
      h.records[0].ledgerJson += " ";
    },
    (h: typeof original) => {
      h.manifest.executions[1] = h.manifest.executions[0];
      h.records[1] = h.records[0];
    },
    (h: typeof original) => {
      h.records.shift();
      h.manifest.executions.shift();
      h.manifest.expectedCallCount--;
      h.manifest.expectedUsageCostUpperBoundNano = 805_000;
    },
    ...["unknown", "reserved", "duplicate"].map(
      (status) => (h: typeof original) => {
        const ledger = JSON.parse(h.records[0].ledgerJson);
        if (status === "duplicate") {
          ledger.ledger.push(ledger.ledger[0]);
          ledger.counts.answer++;
          ledger.reservedUsd *= 2;
          ledger.totalAdmittedUpperBoundUsd *= 2;
        } else ledger.ledger[0].status = status;
        h.records[0].ledgerJson = JSON.stringify(ledger);
        h.manifest.executions[0].ledgerSha256 = hash(h.records[0].ledgerJson);
      },
    ),
    (h: typeof original) => {
      h.records[1].approvalJson = h.records[0].approvalJson;
      h.manifest.executions[1].approvalSha256 = hash(h.records[1].approvalJson);
    },
  ];
  for (const mutate of mutations) {
    const history = structuredClone(original);
    mutate(history);
    assert.throws(() => reconcileApprovedEvaluationHistory(history));
  }
});
test("durable run claim prevents concurrent guard instances or process reruns from admitting an execution twice", async () => {
  const history = await reviewedHistory();
  let claimed = false,
    calls = 0;
  const claim = () => {
    if (claimed) throw new Error("Execution already claimed");
    claimed = true;
  };
  const transport: typeof fetch = async () => {
    calls++;
    return Response.json({ usage: { input_tokens: 10, output_tokens: 0 } });
  };
  const first = reviewedGuard(history, claim, transport),
    second = reviewedGuard(history, claim, transport);
  await first.fetch(endpoint, init());
  await assert.rejects(
    second.fetch(endpoint, init(payload(1))),
    /already claimed/,
  );
  await assert.rejects(second.fetch(endpoint, init(payload(2))), /stopped/);
  assert.equal(calls, 1);
});
test("reviewed execution admits exactly its five-call reservation with all prior spend included", async () => {
  const history = await reviewedHistory();
  const budget = reviewedGuard(
    history,
    () => {},
    async (_url, options) =>
      Response.json({
        model: JSON.parse(options!.body as string).model,
        usage: { input_tokens: 100, output_tokens: 0 },
      }),
  );
  await budget.fetch(endpoint, init());
  await budget.fetch(endpoint, init(payload(1)));
  await budget.fetch(endpoint, init(payload(0, "gpt-6.1-sol")));
  await budget.fetch(endpoint, init(payload(1, "gpt-6.1-sol")));
  await budget.fetch(
    "https://api.openai.com/v1/decisions",
    init(JSON.stringify({ model: "gpt-6-luna", input: "one" })),
  );
  assert.equal(budget.snapshot().reservedUsd, 2.0368);
  assert.equal(budget.snapshot().totalAdmittedUpperBoundUsd, 2.03841);
  await assert.rejects(
    budget.fetch(endpoint, init(payload(2))),
    /execution call limit/,
  );
  await assert.rejects(
    budget.fetch(
      "https://api.openai.com/v1/decisions",
      init(JSON.stringify({ model: "gpt-6-luna", input: "two" })),
    ),
    /execution call limit/,
  );
  const valid = {
    ...approval,
    executionId: "b".repeat(64),
    historyManifestSha256: evaluationHistoryManifestHash(history.manifest),
    executionLimits: {
      calls: { answer: 2, judge: 2, routing: 1 },
      maximumReservedNano: 2_036_800_000,
      maximumTotalAdmissionNano: 2_038_409_999,
    },
  };
  assert.throws(
    () =>
      createEvaluationBudgetGuard({
        approval: valid,
        scopeSha256,
        executionId: valid.executionId,
        approvedPriorHistory: history,
        claimExecution: () => {},
        fetch: async () => Response.json({}),
      }),
    /cumulative reservation/,
  );
});
test("reviewed executions still stop on uncertain usage and reject simultaneous transport", async () => {
  const history = await reviewedHistory();
  let release!: (value: Response) => void;
  const budget = reviewedGuard(
    history,
    () => {},
    async () =>
      new Promise<Response>((resolve) => {
        release = resolve;
      }),
  );
  const first = budget.fetch(endpoint, init());
  await assert.rejects(
    budget.fetch(endpoint, init(payload(1))),
    /sequentially/,
  );
  release(Response.json({}));
  await assert.rejects(first, /usage/);
  await assert.rejects(budget.fetch(endpoint, init(payload(1))), /stopped/);
  assert.equal(budget.snapshot().reservedUsd, 0.3442);
});
