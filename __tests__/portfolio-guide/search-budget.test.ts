import assert from "node:assert/strict";
import test from "node:test";
import { execFileSync } from "node:child_process";
import {
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import {
  createSearchBudgetGuard,
  SEARCH_CASES,
  SEARCH_LIMITS,
  SEARCH_RULES,
  searchManifestHash,
  searchSha256,
  type FrozenSearchManifest,
  type SearchApproval,
  type SearchCase,
  type SearchEntry,
  type SearchJournal,
  type SearchReply,
  type SearchSnapshot,
  type SearchStage,
  type SearchTransport,
} from "../../lib/portfolio-guide/evals/search-budget";
import { createFileSearchJournal } from "../../lib/portfolio-guide/evals/search-budget-journal";

const queryPath = resolve("__tests__/fixtures/search-budget-queries.json");
const queries = JSON.parse(readFileSync(queryPath, "utf8")) as Array<{
  query: string;
}>;
const root = mkdtempSync(resolve(tmpdir(), "search-budget-tests-"));
process.on("exit", () => rmSync(root, { recursive: true, force: true }));
const repo = resolve(root, "repo");
execFileSync("git", ["init", "-q", repo]);
execFileSync("git", [
  "-C",
  repo,
  "-c",
  "user.name=Budget fixture",
  "-c",
  "user.email=fixture@example.invalid",
  "commit",
  "-q",
  "--allow-empty",
  "-m",
  "fixture",
]);
const fixtureHead = execFileSync("git", ["-C", repo, "rev-parse", "HEAD"], {
  encoding: "utf8",
}).trim();
let identity = 0;
type Json = Record<string, unknown>;
const modelStages = [
  "routing",
  "relevance-ID-selection",
  "source-aware-judge",
] as const;
const embeddingStages = [
  "career-index",
  "portfolio-index",
  "query-vectors",
] as const;
function packet(stage: SearchStage, id?: SearchCase, extra: Json = {}): string {
  const rule = SEARCH_RULES[stage];
  return JSON.stringify(
    rule.inputs
      ? {
          model: rule.model,
          input:
            stage === "query-vectors"
              ? queries.map((q) => q.query)
              : Array.from(
                  { length: rule.inputs },
                  (_, i) => `approved ${stage} ${i}`,
                ),
          dimensions: 1536,
          encoding_format: "float",
          ...extra,
        }
      : {
          model: rule.model,
          ...(rule.output ? { store: false, service_tier: "default" } : {}),
          input: `frozen public packet ${id}`,
          ...(rule.output
            ? { max_output_tokens: rule.output }
            : { questions: [] }),
          ...extra,
        },
  );
}
function reply(stage: SearchStage, body: string): SearchReply {
  const rule = SEARCH_RULES[stage];
  return {
    status: 200,
    body: JSON.stringify({
      model: rule.model,
      ...(rule.inputs
        ? {
            data: (JSON.parse(body).input as string[]).map((_, index) => ({
              index,
              embedding: Array.from({ length: 1536 }, (_, d) =>
                d === index ? 1 : 0,
              ),
            })),
          }
        : { service_tier: "default", status: "completed" }),
      usage: rule.inputs
        ? { prompt_tokens: 20, total_tokens: 20 }
        : {
            input_tokens: 20,
            output_tokens: rule.output ? 10 : 0,
            total_tokens: rule.output ? 30 : 20,
          },
    }),
  };
}
function setup(
  change?: (manifest: FrozenSearchManifest, approval: SearchApproval) => void,
) {
  const file = resolve(root, `frozen-${identity++}.txt`);
  writeFileSync(file, "FAKE approval fixture only; no provider authorization");
  const manifest: FrozenSearchManifest = {
    executionId: searchSha256(file),
    proposalSha256: searchSha256(readFileSync(file)),
    historySha256: SEARCH_LIMITS.historySha256,
    files: [
      file,
      queryPath,
      resolve("lib/portfolio-guide/evals/search-budget.ts"),
      resolve("lib/portfolio-guide/evals/search-budget-journal.ts"),
      resolve("__tests__/portfolio-guide/search-budget.test.ts"),
    ].map((path) => ({ path, sha256: searchSha256(readFileSync(path)) })),
    repositories: [
      {
        path: process.cwd(),
        head: execFileSync("git", ["rev-parse", "HEAD"], {
          encoding: "utf8",
        }).trim(),
      },
      { path: repo, head: fixtureHead },
    ],
    corpusHashes: {
      career:
        "4adfeda571d38965d06be767a1549c6d7f426e8f5bf17a8e52d1b53ccababa94",
      portfolio:
        "1b9efb69391740d0b314fd5f3d58984af6bdc4b8bb2ab21456b97b8b96d92e8d",
    },
    embeddingInputs: Object.fromEntries(
      embeddingStages.map((s) => [s, JSON.parse(packet(s)).input]),
    ) as FrozenSearchManifest["embeddingInputs"],
    routingMode: Object.fromEntries(
      SEARCH_CASES.map((id) => [id, "call"]),
    ) as FrozenSearchManifest["routingMode"],
    requestSha256: Object.fromEntries(
      modelStages.map((s) => [
        s,
        Object.fromEntries(
          SEARCH_CASES.map((id) => [id, searchSha256(packet(s, id))]),
        ),
      ]),
    ) as FrozenSearchManifest["requestSha256"],
  };
  const approval: SearchApproval = {
    approved: true,
    pricingVerified: true,
    scopeSha256: searchManifestHash(manifest),
    executionId: manifest.executionId,
    proposalSha256: manifest.proposalSha256,
    historySha256: manifest.historySha256,
    incrementalCeilingNano: 2e9,
    overallCeilingNano: 10e9,
  };
  change?.(manifest, approval);
  const events: SearchSnapshot[] = [];
  const raw: Array<{ slot: string; result: SearchReply }> = [];
  const claims = new Set<string>();
  const attempts: Array<{ stage: SearchStage; body: string }> = [];
  const journal: SearchJournal = {
    claim(id) {
      if (claims.has(id)) throw new Error("claimed");
      claims.add(id);
    },
    append(s) {
      events.push(structuredClone(s));
    },
    raw(slot, result) {
      raw.push({ slot, result: structuredClone(result) });
    },
  };
  const transport: SearchTransport = async (request) => {
    const model = JSON.parse(request.body).model as string;
    const stage = Object.keys(SEARCH_RULES).find(
      (s) =>
        SEARCH_RULES[s as SearchStage].model === model &&
        SEARCH_RULES[s as SearchStage].inputs ===
          (Array.isArray(JSON.parse(request.body).input)
            ? JSON.parse(request.body).input.length
            : 0),
    ) as SearchStage;
    attempts.push({ stage, body: request.body });
    const last = events.at(-1)!.ledger.at(-1)!;
    assert.equal(last.status, "reserved");
    assert.equal(last.requestSha256, searchSha256(request.body));
    assert.equal(
      request.url,
      `https://api.openai.com/v1/${SEARCH_RULES[stage].endpoint}`,
    );
    assert.equal(request.method, "POST");
    assert.equal(request.signal.aborted, false);
    return reply(stage, request.body);
  };
  const make = (
    options: {
      transport?: SearchTransport;
      journal?: SearchJournal;
      timeoutMs?: number;
    } = {},
  ) =>
    createSearchBudgetGuard({
      manifest,
      approval,
      journal,
      transport,
      ...options,
    });
  return {
    manifest,
    approval,
    file,
    events,
    raw,
    claims,
    attempts,
    journal,
    transport,
    make,
  };
}
async function embed(guard: ReturnType<typeof createSearchBudgetGuard>) {
  for (const stage of embeddingStages)
    await guard.call(stage, undefined, packet(stage));
}
async function all(guard: ReturnType<typeof createSearchBudgetGuard>) {
  await embed(guard);
  for (const id of SEARCH_CASES) {
    for (const stage of modelStages)
      await guard.call(stage, id, packet(stage, id));
    guard.acceptCase(id, {
      judgePassed: true,
      sourceSafety: true,
      citations: true,
      qualifications: true,
    });
  }
}
async function beforeStage(
  guard: ReturnType<typeof createSearchBudgetGuard>,
  stage: (typeof modelStages)[number],
) {
  await embed(guard);
  for (const prior of modelStages.slice(0, modelStages.indexOf(stage)))
    await guard.call(prior, SEARCH_CASES[0], packet(prior, SEARCH_CASES[0]));
}
function assertStopped(
  guard: ReturnType<typeof createSearchBudgetGuard>,
  expectedEntries: number,
) {
  const s = guard.snapshot();
  assert.equal(s.stopped, true);
  assert.equal(s.ledger.length, expectedEntries);
  assert.equal(
    s.reservedNano,
    s.ledger.reduce((sum, e) => sum + e.reservedNano, 0),
  );
}

test("frozen proposal maximum is exactly 21 calls, $1.56128 reserved, $3.2941168 known cumulative", async () => {
  const f = setup();
  const g = f.make();
  await all(g);
  assert.equal(f.attempts.length, 21);
  assert.equal(f.raw.length, 21);
  assert.equal(g.snapshot().stopped, false);
  assert.equal(g.snapshot().reservedNano, 1_561_280_000);
  assert.equal(g.snapshot().cumulativeAdmissionNano, 3_294_116_800);
  assert.equal(
    g.snapshot().ledger.every((e) => e.status === "complete"),
    true,
  );
  const counts = Object.fromEntries(
    Object.keys(SEARCH_RULES).map((s) => [
      s,
      g.snapshot().ledger.filter((e) => e.stage === s).length,
    ]),
  );
  for (const stage of Object.keys(SEARCH_RULES) as SearchStage[])
    assert.equal(counts[stage], SEARCH_RULES[stage].calls);
  const snapshot = g.snapshot();
  snapshot.ledger[0].status = "unknown";
  assert.equal(g.snapshot().ledger[0].status, "complete");
});

for (const [name, mutate] of Object.entries({
  "no approval": (_m: FrozenSearchManifest, a: SearchApproval) => {
    a.approved = false;
  },
  "unverified price": (_m: FrozenSearchManifest, a: SearchApproval) => {
    a.pricingVerified = false;
  },
  "wrong scope": (_m: FrozenSearchManifest, a: SearchApproval) => {
    a.scopeSha256 = "0".repeat(64);
  },
  "wrong execution": (_m: FrozenSearchManifest, a: SearchApproval) => {
    a.executionId = "0".repeat(64);
  },
  "wrong proposal": (_m: FrozenSearchManifest, a: SearchApproval) => {
    a.proposalSha256 = "0".repeat(64);
  },
  "wrong history": (_m: FrozenSearchManifest, a: SearchApproval) => {
    a.historySha256 = "0".repeat(64);
  },
  "increment above $2": (_m: FrozenSearchManifest, a: SearchApproval) => {
    a.incrementalCeilingNano++;
  },
  "increment cannot fit": (_m: FrozenSearchManifest, a: SearchApproval) => {
    a.incrementalCeilingNano = 1_561_279_999;
  },
  "overall above $10": (_m: FrozenSearchManifest, a: SearchApproval) => {
    a.overallCeilingNano++;
  },
  "overall cannot fit": (_m: FrozenSearchManifest, a: SearchApproval) => {
    a.overallCeilingNano = 3_732_836_799;
  },
  "fractional cents accounting": (
    _m: FrozenSearchManifest,
    a: SearchApproval,
  ) => {
    a.incrementalCeilingNano -= 0.5;
  },
}))
  test(`rejects ${name} before claim or transport`, () => {
    const f = setup(mutate);
    assert.throws(() => f.make());
    assert.equal(f.claims.size, 0);
    assert.equal(f.attempts.length, 0);
  });

test("atomic durable claim prevents construction or resume of the same execution", () => {
  const f = setup();
  f.make();
  assert.throws(() => f.make(), /claimed/);
  assert.equal(f.attempts.length, 0);
});
test("initial journal failure consumes claim and does not expose transport", () => {
  const f = setup();
  assert.throws(
    () =>
      f.make({
        journal: {
          ...f.journal,
          append() {
            throw new Error("disk");
          },
        },
      }),
    /journal_failure/,
  );
  assert.throws(() => f.make(), /claimed/);
  assert.equal(f.attempts.length, 0);
});
test("failed reservation write prevents transport and retains full unknown reservation", async () => {
  const f = setup();
  const g = f.make({
    journal: {
      ...f.journal,
      append(s) {
        if (s.ledger.length) throw new Error("disk");
        f.journal.append(s);
      },
    },
  });
  await assert.rejects(
    g.call("career-index", undefined, packet("career-index")),
  );
  assertStopped(g, 1);
  assert.equal(g.snapshot().reservedNano, 80_000);
  assert.equal(f.attempts.length, 0);
});

for (const stage of embeddingStages)
  for (const [label, override] of Object.entries({
    "wrong model": { model: "text-embedding-3-large" },
    "wrong dimensions": { dimensions: 3072 },
    base64: { encoding_format: "base64" },
    "extra input": {
      input: Array.from({ length: SEARCH_RULES[stage].inputs + 1 }, () => "x"),
    },
    "different text": {
      input: Array.from(
        { length: SEARCH_RULES[stage].inputs },
        () => "not approved",
      ),
    },
    "token arrays": { input: [[1, 2, 3]] },
    tools: { tools: [{ type: "web_search" }] },
    "too many bytes": { input: ["x".repeat(SEARCH_RULES[stage].input)] },
  }))
    test(`${stage} rejects ${label}, permanently, without transport`, async () => {
      const f = setup();
      const g = f.make();
      await assert.rejects(
        g.call(stage, undefined, packet(stage, undefined, override)),
      );
      assertStopped(g, 0);
      await assert.rejects(
        g.call("career-index", undefined, packet("career-index")),
      );
      assert.equal(f.attempts.length, 0);
    });

test("queries fixture and payload are bound to the original exact SHA, not normalized", async () => {
  assert.equal(
    searchSha256(readFileSync(queryPath)),
    SEARCH_LIMITS.queriesSha256,
  );
  const f = setup();
  const g = f.make();
  await embed(g);
  const vector = g.queryVector(queries[0].query);
  vector[0] = 999;
  assert.equal(g.queryVector(queries[0].query)[0], 1);
  assert.throws(() => g.queryVector(queries[0].query + " "), /cache_miss/);
  assertStopped(g, 3);
  assert.equal(f.attempts.length, 3);
  assert.throws(() => g.queryVector(queries[0].query));
});
test("a query cache miss before batch completion cannot issue a lazy embedding", () => {
  const f = setup();
  const g = f.make();
  assert.throws(() => g.queryVector(queries[0].query), /cache_miss/);
  assertStopped(g, 0);
  assert.equal(f.attempts.length, 0);
});
test("all batches and every model case slot are single use; no replacement cases", async () => {
  for (const stage of embeddingStages) {
    const f = setup();
    const g = f.make();
    await g.call(stage, undefined, packet(stage));
    await assert.rejects(g.call(stage, undefined, packet(stage)));
    assertStopped(g, 1);
    assert.equal(f.attempts.length, 1);
  }
  for (const stage of modelStages) {
    const f = setup();
    const g = f.make();
    await beforeStage(g, stage);
    await g.call(stage, SEARCH_CASES[0], packet(stage, SEARCH_CASES[0]));
    await assert.rejects(
      g.call(stage, SEARCH_CASES[0], packet(stage, SEARCH_CASES[0])),
    );
    assertStopped(g, 4 + modelStages.indexOf(stage));
    assert.equal(f.attempts.length, 4 + modelStages.indexOf(stage));
  }
  const f = setup();
  const g = f.make();
  await assert.rejects(
    g.call(
      "routing",
      "replacement" as SearchCase,
      packet("routing", "ownership"),
    ),
  );
  assertStopped(g, 0);
});
test("full 21-call plan rejects a 22nd attempt without refunds or extra transport", async () => {
  const f = setup();
  const g = f.make();
  await all(g);
  await assert.rejects(
    g.call("routing", "ownership", packet("routing", "ownership")),
  );
  assertStopped(g, 21);
  assert.equal(f.attempts.length, 21);
  assert.equal(g.snapshot().reservedNano, SEARCH_LIMITS.maximumReservationNano);
});
for (const stage of modelStages)
  for (const [label, override] of Object.entries({
    "output overflow": { max_output_tokens: SEARCH_RULES[stage].output + 1 },
    streaming: { stream: true },
    background: { background: true },
    "priority tier": { service_tier: "priority" },
    "stored response": { store: true },
    "hosted tool": { tools: [{ type: "web_search" }] },
    "different public packet": { input: "replacement packet" },
    "oversized input": { input: "x".repeat(SEARCH_RULES[stage].input) },
  }))
    test(`${stage} rejects ${label} with no model attempt`, async () => {
      const f = setup();
      const g = f.make();
      await beforeStage(g, stage);
      await assert.rejects(
        g.call(
          stage,
          SEARCH_CASES[0],
          packet(stage, SEARCH_CASES[0], override),
        ),
      );
      assertStopped(g, 3 + modelStages.indexOf(stage));
      assert.equal(f.attempts.length, 3 + modelStages.indexOf(stage));
    });
test("model stages require all embedding batches and stable case identities", async () => {
  const f = setup();
  const g = f.make();
  await assert.rejects(
    g.call("routing", "ownership", packet("routing", "ownership")),
  );
  assertStopped(g, 0);
});

for (const [label, change] of Object.entries({
  "missing usage": (d: Json) => {
    delete d.usage;
  },
  "missing model": (d: Json) => {
    delete d.model;
  },
  "wrong model": (d: Json) => {
    d.model = "text-embedding-3-large";
  },
  "arbitrary model suffix": (d: Json) => {
    d.model = "text-embedding-3-small-evil";
  },
  "inconsistent total": (d: Json) => {
    (d.usage as Json).total_tokens = 21;
  },
  "negative usage": (d: Json) => {
    (d.usage as Json).prompt_tokens = -1;
  },
  "fractional usage": (d: Json) => {
    (d.usage as Json).prompt_tokens = 0.5;
  },
  "unsafe usage": (d: Json) => {
    (d.usage as Json).prompt_tokens = Number.MAX_SAFE_INTEGER + 1;
  },
  "over-bound usage": (d: Json) => {
    d.usage = { prompt_tokens: 4000, total_tokens: 4000 };
  },
  "wrong dimension": (d: Json) => {
    (d.data as Array<{ embedding: number[] }>)[0].embedding.pop();
  },
  "nonfinite dimension": (d: Json) => {
    (d.data as Array<{ embedding: unknown[] }>)[0].embedding[0] = null;
  },
  "duplicate index": (d: Json) => {
    (d.data as Array<{ index: number }>)[1].index = 0;
  },
  "negative index": (d: Json) => {
    (d.data as Array<{ index: number }>)[0].index = -1;
  },
  "out-of-range index": (d: Json) => {
    (d.data as Array<{ index: number }>)[1].index = 2;
  },
  "missing vector": (d: Json) => {
    (d.data as unknown[]).pop();
  },
  "extra vector": (d: Json) => {
    (d.data as unknown[]).push((d.data as unknown[])[0]);
  },
}))
  test(`uncertain embedding ${label}: raw receipt first, full reservation retained, no retry`, async () => {
    const f = setup();
    let attempts = 0;
    const g = f.make({
      transport: async (r) => {
        attempts++;
        const result = reply("career-index", r.body);
        const d = JSON.parse(result.body) as Json;
        change(d);
        return { ...result, body: JSON.stringify(d) };
      },
    });
    await assert.rejects(
      g.call("career-index", undefined, packet("career-index")),
    );
    assertStopped(g, 1);
    assert.equal(g.snapshot().ledger[0].status, "unknown");
    assert.equal(g.snapshot().reservedNano, 80_000);
    assert.equal(f.raw.length, 1);
    await assert.rejects(
      g.call("portfolio-index", undefined, packet("portfolio-index")),
    );
    assert.equal(attempts, 1);
  });
for (const status of [401, 403, 429, 500])
  test(`HTTP ${status} is immutable raw evidence and never retried`, async () => {
    const f = setup();
    const g = f.make({
      transport: async () => ({ status, body: "provider denial fixture" }),
    });
    await assert.rejects(
      g.call("career-index", undefined, packet("career-index")),
    );
    assertStopped(g, 1);
    assert.deepEqual(f.raw[0].result, {
      status,
      body: "provider denial fixture",
    });
  });
test("network errors cannot leak a credential-bearing error and never refund", async () => {
  const f = setup();
  const g = f.make({
    transport: async () => {
      throw new Error("secret-fixture-do-not-log");
    },
  });
  await assert.rejects(
    g.call("career-index", undefined, packet("career-index")),
    /search_evaluation_failed_no_retry/,
  );
  assertStopped(g, 1);
  assert.equal(JSON.stringify(g.snapshot()).includes("secret-fixture"), false);
  assert.equal(f.raw.length, 0);
});
test("timeout aborts once, keeps reservation and forbids replacement while late transport resolves", async () => {
  const f = setup();
  let signal: AbortSignal | undefined;
  let finish!: (r: SearchReply) => void;
  const g = f.make({
    timeoutMs: 5,
    transport: async (r) => {
      signal = r.signal;
      return new Promise((resolve) => {
        finish = resolve;
      });
    },
  });
  await assert.rejects(
    g.call("career-index", undefined, packet("career-index")),
  );
  assert.equal(signal!.aborted, true);
  assertStopped(g, 1);
  finish(reply("career-index", packet("career-index")));
  await assert.rejects(
    g.call("career-index", undefined, packet("career-index")),
  );
  assert.equal(g.snapshot().ledger[0].status, "unknown");
});
test("concurrency stops both the in-flight request and all later calls", async () => {
  const f = setup();
  let finish!: (r: SearchReply) => void;
  const g = f.make({
    transport: async () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  });
  const first = g.call("career-index", undefined, packet("career-index"));
  await assert.rejects(
    g.call("portfolio-index", undefined, packet("portfolio-index")),
    /concurrent/,
  );
  finish(reply("career-index", packet("career-index")));
  await assert.rejects(first);
  assertStopped(g, 1);
  assert.equal(g.snapshot().ledger[0].status, "unknown");
});
test("changed frozen file is checked at admission and after transport", async () => {
  for (const after of [false, true]) {
    const f = setup();
    const g = f.make({
      transport: async (r) => {
        writeFileSync(f.file, "changed");
        return reply("career-index", r.body);
      },
    });
    if (!after) writeFileSync(f.file, "changed");
    await assert.rejects(
      g.call("career-index", undefined, packet("career-index")),
    );
    assertStopped(g, after ? 1 : 0);
    assert.equal(f.raw.length, after ? 1 : 0);
  }
});
test("frozen repository HEAD changes stop admission without a call", async () => {
  const f = setup();
  const g = f.make();
  f.manifest.repositories[0].head = "0".repeat(40); // Mutation of caller object cannot alter the cloned manifest.
  const current = execFileSync("git", ["-C", repo, "rev-parse", "HEAD"], {
    encoding: "utf8",
  }).trim();
  execFileSync("git", [
    "-C",
    repo,
    "-c",
    "user.name=Budget fixture",
    "-c",
    "user.email=fixture@example.invalid",
    "commit",
    "-q",
    "--allow-empty",
    "-m",
    "changed",
  ]);
  await assert.rejects(
    g.call("career-index", undefined, packet("career-index")),
  );
  assertStopped(g, 0);
  execFileSync("git", ["-C", repo, "reset", "--soft", current]);
});
test("raw-receipt or settlement journal failure hard-stops and retains unknown charge", async () => {
  for (const rawFails of [true, false]) {
    const f = setup();
    const journal = {
      ...f.journal,
      raw(slot: string, r: SearchReply) {
        if (rawFails) throw new Error("disk");
        f.journal.raw(slot, r);
      },
      append(s: SearchSnapshot) {
        if (s.ledger.some((e: SearchEntry) => e.status === "complete"))
          throw new Error("disk");
        f.journal.append(s);
      },
    };
    const g = f.make({ journal });
    await assert.rejects(
      g.call("career-index", undefined, packet("career-index")),
    );
    assertStopped(g, 1);
    assert.equal(g.snapshot().ledger[0].status, "unknown");
    assert.equal(g.snapshot().reservedNano, 80_000);
  }
});
test("quality failure is an explicit terminal stop and cache reads also stop", async () => {
  const f = setup();
  const g = f.make();
  await embed(g);
  g.stop("source_safety_failure");
  assertStopped(g, 3);
  await assert.rejects(
    g.call("routing", "ownership", packet("routing", "ownership")),
  );
  assert.throws(() => g.queryVector(queries[0].query));
  assert.equal(f.attempts.length, 3);
});
test("file journal uses exclusive claims, immutable raw files, fsynced event history and no overwrite", async () => {
  const f = setup();
  const registry = mkdtempSync(resolve(root, "registry-"));
  const journal = createFileSearchJournal(registry);
  const g = f.make({
    journal,
    transport: async (r) => reply("career-index", r.body),
  });
  await g.call("career-index", undefined, packet("career-index"));
  const folder = resolve(registry, f.manifest.executionId);
  const names = readdirSync(folder);
  assert.ok(names.includes("claim.json"));
  assert.ok(names.includes("raw-career-index--batch.json"));
  assert.equal(names.filter((n) => n.startsWith("event-")).length, 3);
  assert.throws(
    () =>
      createFileSearchJournal(registry).claim(
        f.manifest.executionId,
        searchManifestHash(f.manifest),
        { manifest: f.manifest, approval: f.approval },
      ),
    /EEXIST/,
  );
  assert.throws(
    () =>
      journal.raw("career-index:batch", { status: 500, body: "replacement" }),
    /EEXIST/,
  );
  assert.equal(
    JSON.parse(
      readFileSync(resolve(folder, "raw-career-index--batch.json"), "utf8"),
    ).status,
    200,
  );
  const reserved = JSON.parse(
    readFileSync(resolve(folder, "event-0001.json"), "utf8"),
  ) as SearchSnapshot;
  assert.equal(reserved.ledger[0].status, "reserved");
  assert.equal(reserved.reservedNano, 80_000);
});

test("rules and case exports cannot be mutated to increase caps", () => {
  assert.ok(Object.isFrozen(SEARCH_RULES));
  assert.ok(Object.values(SEARCH_RULES).every(Object.isFrozen));
  assert.ok(Object.isFrozen(SEARCH_CASES));
  assert.throws(() => Object.assign(SEARCH_RULES.routing, { calls: 100 }));
  assert.throws(() =>
    Object.assign(SEARCH_RULES["relevance-ID-selection"], { inputNano: 0 }),
  );
});
for (const hook of ["claim", "append", "raw"] as const)
  test(`mandatory journal ${hook} hook cannot be omitted`, () => {
    const f = setup();
    const journal = {
      ...f.journal,
      [hook]: undefined,
    } as unknown as SearchJournal;
    assert.throws(() => f.make({ journal }));
    assert.equal(f.attempts.length, 0);
    assert.equal(f.claims.size, 0);
  });
for (const timeoutMs of [
  0,
  -1,
  0.5,
  60_001,
  Number.NaN,
  Number.POSITIVE_INFINITY,
])
  test(`invalid timeout ${timeoutMs} cannot construct a guard`, () => {
    const f = setup();
    assert.throws(() => f.make({ timeoutMs }));
    assert.equal(f.claims.size, 0);
  });
test("file journal refuses a missing registry instead of creating an unsynced parent chain", () => {
  assert.throws(
    () => createFileSearchJournal(resolve(root, "not-provisioned", "registry")),
    /ENOENT/,
  );
});
test("caller manifest, approval and returned vector mutation cannot relax the frozen scope", async () => {
  const f = setup();
  const g = f.make();
  f.manifest.embeddingInputs["career-index"][0] = "not approved";
  f.approval.incrementalCeilingNano = 100e9;
  await g.call("career-index", undefined, packet("career-index"));
  assert.equal(g.snapshot().reservedNano, 80_000);
  assert.equal(f.attempts.length, 1);
});
test("duplicate JSON input keys cannot hide unapproved embedding text", async () => {
  const f = setup();
  const g = f.make();
  const body = packet("career-index").replace(
    '"input":',
    '"input":["unapproved hidden input"],"input":',
  );
  await assert.rejects(g.call("career-index", undefined, body));
  assertStopped(g, 0);
  assert.equal(f.attempts.length, 0);
});
test("case and stage order are enforced and an unaccepted case cannot advance", async () => {
  for (const [stage, id] of [
    ["source-aware-judge", SEARCH_CASES[0]],
    ["relevance-ID-selection", SEARCH_CASES[0]],
    ["routing", SEARCH_CASES[1]],
  ] as const) {
    const f = setup();
    const g = f.make();
    await embed(g);
    await assert.rejects(g.call(stage, id, packet(stage, id)));
    assertStopped(g, 3);
  }
  const f = setup();
  const g = f.make();
  await embed(g);
  for (const stage of modelStages)
    await g.call(stage, SEARCH_CASES[0], packet(stage, SEARCH_CASES[0]));
  await assert.rejects(
    g.call("routing", SEARCH_CASES[1], packet("routing", SEARCH_CASES[1])),
  );
  assertStopped(g, 6);
});
for (const key of [
  "judgePassed",
  "sourceSafety",
  "citations",
  "qualifications",
] as const)
  test(`failed ${key} gate stops before a later case`, async () => {
    const f = setup();
    const g = f.make();
    await embed(g);
    for (const stage of modelStages)
      await g.call(stage, SEARCH_CASES[0], packet(stage, SEARCH_CASES[0]));
    assert.throws(() =>
      g.acceptCase(SEARCH_CASES[0], {
        judgePassed: true,
        sourceSafety: true,
        citations: true,
        qualifications: true,
        [key]: false,
      }),
    );
    await assert.rejects(
      g.call("routing", SEARCH_CASES[1], packet("routing", SEARCH_CASES[1])),
    );
    assertStopped(g, 6);
    assert.equal(f.attempts.length, 6);
  });
for (const stage of modelStages)
  for (const [label, mutate] of Object.entries({
    "missing model": (d: Json) => {
      delete d.model;
    },
    "wrong model": (d: Json) => {
      d.model = "unapproved";
    },
    "malformed model snapshot": (d: Json) => {
      d.model =
        (SEARCH_RULES[stage].model.includes(".")
          ? SEARCH_RULES[stage].model.replace(".", "X")
          : SEARCH_RULES[stage].model + "-unapproved") + "-2026-10-17";
    },
    "unexpected tier": (d: Json) => {
      d.service_tier = "priority";
    },
    "missing usage": (d: Json) => {
      delete d.usage;
    },
    "inconsistent usage": (d: Json) => {
      (d.usage as Json).total_tokens = 999;
    },
    "input above byte bound": (d: Json) => {
      d.usage = {
        input_tokens: SEARCH_RULES[stage].input,
        output_tokens: 0,
        total_tokens: SEARCH_RULES[stage].input,
      };
    },
    "output over cap including reasoning": (d: Json) => {
      d.usage = {
        input_tokens: 20,
        output_tokens: SEARCH_RULES[stage].output + 1,
        total_tokens: 21 + SEARCH_RULES[stage].output,
        output_tokens_details: {
          reasoning_tokens: SEARCH_RULES[stage].output + 1,
        },
      };
    },
  }))
    test(`${stage} uncertain ${label} retains its complete reservation and stops`, async () => {
      const f = setup();
      let reached = 0;
      const g = f.make({
        transport: async (r) => {
          const target = JSON.parse(r.body).model === SEARCH_RULES[stage].model;
          if (!target) return f.transport(r);
          reached++;
          const result = reply(stage, r.body);
          const d = JSON.parse(result.body) as Json;
          mutate(d);
          return { ...result, body: JSON.stringify(d) };
        },
      });
      await beforeStage(g, stage);
      await assert.rejects(
        g.call(stage, SEARCH_CASES[0], packet(stage, SEARCH_CASES[0])),
      );
      assertStopped(g, 4 + modelStages.indexOf(stage));
      assert.equal(reached, 1);
      const entry = g.snapshot().ledger.at(-1)!;
      const rule = SEARCH_RULES[stage];
      assert.equal(entry.status, "unknown");
      assert.equal(
        entry.reservedNano,
        rule.input * rule.inputNano + rule.output * rule.outputNano,
      );
      assert.equal(f.raw.length, 4 + modelStages.indexOf(stage));
    });
for (const stage of ["relevance-ID-selection", "source-aware-judge"] as const)
  test(`${stage} missing tier or incomplete response is uncertain`, async () => {
    for (const missingTier of [true, false]) {
      const f = setup();
      const g = f.make({
        transport: async (r) => {
          if (JSON.parse(r.body).model !== SEARCH_RULES[stage].model)
            return f.transport(r);
          const result = reply(stage, r.body);
          const d = JSON.parse(result.body) as Json;
          if (missingTier) delete d.service_tier;
          else d.status = "incomplete";
          return { ...result, body: JSON.stringify(d) };
        },
      });
      await beforeStage(g, stage);
      await assert.rejects(
        g.call(stage, SEARCH_CASES[0], packet(stage, SEARCH_CASES[0])),
      );
      assertStopped(g, 4 + modelStages.indexOf(stage));
    }
  });
test("malformed JSON and oversized raw responses are preserved before rejection", async () => {
  for (const body of ["{bad json", "x".repeat(4 * 1024 * 1024 + 1)]) {
    const f = setup();
    const g = f.make({ transport: async () => ({ status: 200, body }) });
    await assert.rejects(
      g.call("career-index", undefined, packet("career-index")),
    );
    assertStopped(g, 1);
    assert.equal(f.raw[0].result.body, body);
  }
});
test("late receipt is persisted once after timeout but never settles the unknown reservation", async () => {
  const f = setup();
  let finish!: (r: SearchReply) => void;
  const g = f.make({
    timeoutMs: 1,
    transport: async () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  });
  await assert.rejects(
    g.call("career-index", undefined, packet("career-index")),
  );
  finish(reply("career-index", packet("career-index")));
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(f.raw.length, 1);
  assert.equal(g.snapshot().ledger[0].status, "unknown");
  assert.equal(g.snapshot().reservedNano, 80_000);
  assertStopped(g, 1);
});
test("a frozen routing bypass is journaled and consumes no transport or reservation", async () => {
  const f = setup((m, a) => {
    m.routingMode[SEARCH_CASES[0]] = "bypass";
    a.scopeSha256 = searchManifestHash(m);
  });
  const g = f.make();
  await embed(g);
  g.bypassRouting(SEARCH_CASES[0]);
  assert.equal(f.attempts.length, 3);
  assert.equal(g.snapshot().reservedNano, 1_280_000);
  assert.deepEqual(g.snapshot().bypassedRouting, [SEARCH_CASES[0]]);
  for (const stage of modelStages.slice(1))
    await g.call(stage, SEARCH_CASES[0], packet(stage, SEARCH_CASES[0]));
  g.acceptCase(SEARCH_CASES[0], {
    judgePassed: true,
    sourceSafety: true,
    citations: true,
    qualifications: true,
  });
  assert.equal(g.snapshot().acceptedCases[SEARCH_CASES[0]]?.judgePassed, true);
  await g.call("routing", SEARCH_CASES[1], packet("routing", SEARCH_CASES[1]));
  assert.equal(f.attempts.length, 6);
});
test("unapproved, duplicate and charged routing bypasses stop without replacement calls", async () => {
  const f = setup();
  const g = f.make();
  await embed(g);
  assert.throws(() => g.bypassRouting(SEARCH_CASES[0]));
  assertStopped(g, 3);
  const f2 = setup((m, a) => {
    m.routingMode[SEARCH_CASES[0]] = "bypass";
    a.scopeSha256 = searchManifestHash(m);
  });
  const g2 = f2.make();
  await embed(g2);
  g2.bypassRouting(SEARCH_CASES[0]);
  assert.throws(() => g2.bypassRouting(SEARCH_CASES[0]));
  assertStopped(g2, 3);
  const f3 = setup((m, a) => {
    m.routingMode[SEARCH_CASES[0]] = "bypass";
    a.scopeSha256 = searchManifestHash(m);
  });
  const g3 = f3.make();
  await embed(g3);
  await assert.rejects(
    g3.call("routing", SEARCH_CASES[0], packet("routing", SEARCH_CASES[0])),
  );
  assertStopped(g3, 3);
  assert.equal(f3.attempts.length, 3);
});
for (const stage of ["relevance-ID-selection", "source-aware-judge"] as const)
  test(`${stage} usage above a smaller frozen output cap remains uncertain`, async () => {
    const limited = packet(stage, SEARCH_CASES[0], { max_output_tokens: 100 });
    const f = setup((m, a) => {
      m.requestSha256[stage][SEARCH_CASES[0]] = searchSha256(limited);
      a.scopeSha256 = searchManifestHash(m);
    });
    const g = f.make({
      transport: async (r) => {
        if (JSON.parse(r.body).model !== SEARCH_RULES[stage].model)
          return f.transport(r);
        const result = reply(stage, r.body);
        const data = JSON.parse(result.body);
        data.usage = {
          input_tokens: 20,
          output_tokens: 101,
          total_tokens: 121,
        };
        return { ...result, body: JSON.stringify(data) };
      },
    });
    await beforeStage(g, stage);
    await assert.rejects(g.call(stage, SEARCH_CASES[0], limited));
    assertStopped(g, 4 + modelStages.indexOf(stage));
    assert.equal(g.snapshot().ledger.at(-1)!.status, "unknown");
  });
