import test, { type TestContext } from "node:test";
import assert from "node:assert/strict";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { prepareSearchScope } from "../../lib/portfolio-guide/evals/search-scope";
import {
  createSearchBudgetGuard,
  searchManifestHash,
  searchSha256,
} from "../../lib/portfolio-guide/evals/search-budget";
import { createFileSearchJournal } from "../../lib/portfolio-guide/evals/search-budget-journal";
import { createSearchFixtureTransport } from "../../lib/portfolio-guide/evals/search-fixture";
import { nativeQueryCache } from "../../lib/portfolio-guide/evals/search-native";
import { getPortfolioSearchDocuments } from "../../lib/portfolio-guide/search";
import { corpusHash } from "../../lib/search/hybrid";
import {
  validateNativeReview,
  type ReviewPacket,
} from "../../scripts/lib/eval-artifacts";

const evidence = resolve(
  "../review-evidence/semantic-search-preparation-20261017",
);
// These synthetic tests belong to the immutable October 17 approved corpus.
// Changed content uses ownership-release-status.test.ts; do not rewrite budget pins.
const available =
  [
    resolve(evidence, "native-final/proposal.json"),
    resolve(evidence, "paid-test-proposal.json"),
    resolve(evidence, "paid-test-queries.json"),
    resolve(evidence, "cache-reconciliation/reused-vectors.json"),
    resolve("../resumecustomizer-search/lib/evidence/search.ts"),
    "/Users/danielnash/Code/DanielNash/ResumeCustomizer/evals/search/career-queries.json",
  ].every((file) => existsSync(file)) &&
  corpusHash(getPortfolioSearchDocuments()) ===
    "1b9efb69391740d0b314fd5f3d58984af6bdc4b8bb2ab21456b97b8b96d92e8d";
const frozenTest = (name: string, fn: (t: TestContext) => void | Promise<void>) =>
  test(name, {
    skip: !available
      ? "Historical frozen-corpus integration: requires original proposal, caches, paired checkout, and pre-correction content; current saved-capture regression runs separately"
      : false,
  }, fn);
const root = mkdtempSync(resolve(tmpdir(), "native-search-tests-"));
process.on("exit", () => rmSync(root, { recursive: true, force: true }));
let count = 0;
function fixture() {
  const output = resolve(root, `scope-${count++}`);
  const { manifest, approval } = prepareSearchScope({
    portfolioRoot: process.cwd(),
    careerRoot: resolve("../resumecustomizer-search"),
    proposal: resolve(evidence, "native-final/proposal.json"),
    queries: resolve(evidence, "paid-test-queries.json"),
    output,
    native: {
      reuse: resolve(evidence, "cache-reconciliation/reused-vectors.json"),
      queryCache:
        "/Users/danielnash/Code/DanielNash/ResumeCustomizer/evals/search/career-queries.json",
      originalProposal: resolve(evidence, "paid-test-proposal.json"),
    },
  });
  const bundle = JSON.parse(readFileSync(manifest.publicBundle!.path, "utf8"));
  const base = createSearchFixtureTransport(
    bundle,
    nativeQueryCache(manifest, bundle),
  );
  manifest.executionMode = "fake";
  approval.scopeSha256 = searchManifestHash(manifest);
  approval.approved = true;
  approval.pricingVerified = true;
  const attempts: Array<{ model: string; request: Record<string, unknown> }> =
    [];
  const make = (
    mutate?: (
      body: Record<string, unknown>,
      reply: Record<string, unknown>,
    ) => void,
  ) =>
    createSearchBudgetGuard({
      manifest,
      approval,
      journal: createFileSearchJournal(manifest.journalDirectory!),
      transport: async (r) => {
        const request = JSON.parse(r.body);
        attempts.push({ model: request.model, request });
        const response = await base(r);
        const reply = JSON.parse(response.body);
        mutate?.(request, reply);
        return { ...response, body: JSON.stringify(reply) };
      },
    });
  return { manifest, approval, bundle, attempts, make, output };
}

frozenTest("native adapter makes exactly 2 embeddings, 2 deployed router calls and 6 selections, then freezes an unreviewed Codex packet", async (t) => {
  let escaped = 0;
  t.mock.method(globalThis, "fetch", async () => {
    escaped++;
    throw Error("No unbudgeted network");
  });
  const originalEnv = process.env;
  let credentialReads = 0;
  process.env = new Proxy(originalEnv, {
    get(target, key) {
      if (
        typeof key === "string" &&
        /API_KEY|TOKEN|SECRET|DATABASE_URL/.test(key)
      ) {
        credentialReads++;
        throw Error("Credential access forbidden in fake tests");
      }
      return Reflect.get(target, key);
    },
  });
  t.after(() => {
    process.env = originalEnv;
  });
  const f = fixture();
  const guard = f.make();
  let result;
  try {
    result = await guard.execute();
  } catch (error) {
    const file = resolve(
      f.manifest.journalDirectory!,
      f.manifest.executionId,
      "artifact-failure.json",
    );
    assert.fail(
      JSON.stringify({
        failure: JSON.parse(readFileSync(file, "utf8")).code,
        models: f.attempts.map((a) => a.model),
      }),
    );
  }
  assert.equal(f.attempts.length, 10);
  assert.deepEqual(
    f.attempts
      .filter((a) => a.model === "text-embedding-3-small")
      .map((a) => (a.request.input as string[]).length),
    [17, 63],
  );
  assert.equal(f.attempts.filter((a) => a.model === "gpt-6-luna").length, 2);
  assert.equal(f.attempts.filter((a) => a.model === "gpt-5.6-terra").length, 6);
  assert.equal(
    f.attempts.some((a) => a.model === "gpt-6.1-sol"),
    false,
  );
  assert.equal(result.snapshot.reservedNano, 765760000);
  assert.equal(result.qualityStatus, "awaiting-active-codex-chat-review");
  assert.ok(result.results.every((r) => r.checks.judgePassed === false));
  const directory = resolve(
    f.manifest.journalDirectory!,
    f.manifest.executionId,
  );
  const packet: ReviewPacket = JSON.parse(
    readFileSync(resolve(directory, "artifact-review-packet.json"), "utf8"),
  );
  assert.equal(packet.reviewMode, "active-codex-chat");
  assert.equal(packet.cases.length, 6);
  assert.ok(
    packet.cases.every(
      (c) =>
        (c.generation as { sampleKind: string }).sampleKind ===
        "synthetic-fake",
    ),
  );
  assert.equal(escaped, 0);
  assert.equal(credentialReads, 0);
  const review = {
    packetHash: packet.packetHash,
    rubricHash: packet.rubricHash,
    reviewer: "active-codex-chat",
    model: null,
    usage: null,
    cases: packet.cases.map((c) => ({
      id: c.id,
      verdict: "uncertain",
      rationale: "Synthetic interface check; no semantic evaluation.",
      findings: [],
    })),
  };
  assert.equal(validateNativeReview(packet, review).cases.length, 6);
  review.packetHash = "stale";
  assert.throws(() => validateNativeReview(packet, review), /Stale/);
  assert.equal(
    readdirSync(directory).filter((x) => x.startsWith("request-")).length,
    10,
  );
});

frozenTest("native pending approval makes zero transport attempts", () => {
  const f = fixture();
  f.approval.approved = false;
  assert.throws(() => f.make(), /explicit_frozen_approval/);
  assert.equal(f.attempts.length, 0);
});
frozenTest("native mode rejects inherited $2 ceiling instead of transferring old approval", () => {
  const f = fixture();
  f.approval.incrementalCeilingNano = 2e9;
  assert.throws(() => f.make(), /explicit_frozen_approval/);
  assert.equal(f.attempts.length, 0);
});
frozenTest("native malformed embedding stops before every later provider call and retains full reservation", async () => {
  const f = fixture();
  const g = f.make((request, reply) => {
    if (request.model === "text-embedding-3-small")
      (reply.data as Array<{ embedding: number[] }>)[0].embedding = [1];
  });
  await assert.rejects(g.execute());
  assert.equal(f.attempts.length, 1);
  assert.equal(g.snapshot().ledger[0].status, "unknown");
  await assert.rejects(g.execute());
  assert.equal(f.attempts.length, 1);
});
frozenTest("native cache source hash and exact vector values are bound before transport", () => {
  const f = fixture();
  const cache = JSON.parse(readFileSync(f.manifest.nativeReuse!.path, "utf8"));
  cache.vectors.queries[0].vector[0] += 0.1;
  const path = resolve(f.output, "changed-reuse.json");
  writeFileSync(path, JSON.stringify(cache));
  f.manifest.nativeReuse = { path, sha256: searchSha256(readFileSync(path)) };
  f.manifest.files.push(f.manifest.nativeReuse);
  assert.throws(
    () => nativeQueryCache(f.manifest, f.bundle),
    /origin_mismatch/,
  );
  assert.equal(f.attempts.length, 0);
});
frozenTest("native live source mutation after approval is rejected with no requests", () => {
  const f = fixture();
  f.manifest.embeddingInputs["career-index"][0] += " changed";
  f.approval.scopeSha256 = searchManifestHash(f.manifest);
  assert.throws(() => f.make(), /embedding_inputs_changed/);
  assert.equal(f.attempts.length, 0);
});
frozenTest("native arbitrary model calls and external acceptance gates stay closed", async () => {
  const f = fixture();
  const g = f.make();
  await assert.rejects(g.call("routing", "ownership", "{}"), /runner_owned/);
  assert.equal(f.attempts.length, 0);
});
for (const issue of ["routing", "selection", "usage", "retrieval"] as const)
  frozenTest(`native ${issue} failure closes later calls`, async () => {
    const f = fixture();
    const guard = f.make((request, reply) => {
      if (issue === "routing" && request.model === "gpt-6-luna")
        reply.answers = [];
      if (issue === "selection" && request.model === "gpt-5.6-terra")
        (
          reply.output as Array<{ content: Array<{ text: string }> }>
        )[0].content[0].text = '{"blockIds":["invented-id"]}';
      if (issue === "usage") delete reply.usage;
      if (
        issue === "retrieval" &&
        request.model === "text-embedding-3-small" &&
        (request.input as string[]).length === 17
      )
        (reply.data as Array<{ embedding: number[] }>).forEach(
          (r) => (r.embedding = Array(1536).fill(0)),
        );
    });
    await assert.rejects(guard.execute());
    const calls = f.attempts.length;
    await assert.rejects(guard.execute());
    assert.equal(f.attempts.length, calls);
    assert.ok(calls < 10);
    assert.equal(guard.snapshot().stopped, true);
  });
