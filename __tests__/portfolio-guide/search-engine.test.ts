import assert from "node:assert/strict";
import test from "node:test";
import {
  buildIndex,
  corpusHash,
  EMBEDDING_MODEL,
  embedQuery,
  hashText,
  rankHybrid,
  validIndex,
  type EmbeddingIndex,
} from "@/lib/search/hybrid";

test("semantic vectors recover a lexical miss, while project scope remains binding", () => {
  const docs = [
    { id: "a", projectId: "science", text: "Research source verification" },
    { id: "b", projectId: "sales", text: "Revenue dashboards" },
  ];
  const v = [1, ...new Array(1535).fill(0)];
  const index: EmbeddingIndex = {
    version: 1,
    model: EMBEDDING_MODEL,
    corpusHash: corpusHash(docs),
    records: docs.map((d) => ({ id: d.id, hash: hashText(d.text), vector: v })),
  };
  assert.equal(validIndex(index, docs), true);
  assert.deepEqual(rankHybrid(docs, "epistemic reliability"), []);
  assert.equal(
    rankHybrid(docs, "epistemic reliability", { index, queryVector: v })[0].id,
    "a",
  );
  assert.deepEqual(
    rankHybrid(docs, "epistemic reliability", {
      index,
      queryVector: v,
      projectId: "sales",
    }).map((h) => h.id),
    ["b"],
  );
  assert.equal(
    validIndex(index, [{ ...docs[0], revision: "changed" }, docs[1]]),
    false,
  );
  assert.equal(
    validIndex(
      { ...index, records: [index.records[0], index.records[0]] },
      docs,
    ),
    false,
  );
});

test("embedding failure, malformed vectors and missing key degrade without retries", async (t) => {
  let calls = 0;
  t.mock.method(globalThis, "fetch", async () => {
    calls++;
    return new Response("{}", { status: 429 });
  });
  assert.equal(await embedQuery("no key", undefined), undefined);
  assert.equal(calls, 0);
  assert.equal(await embedQuery("provider failure", "test-only"), undefined);
  assert.equal(calls, 1);
  t.mock.method(
    globalThis,
    "fetch",
    async () => new Response(JSON.stringify({ data: [{ embedding: [1] }] })),
  );
  assert.equal(await embedQuery("malformed vector", "test-only"), undefined);
});

test("index preparation reuses reviewed hashes and enforces a request ceiling", async (t) => {
  const docs = Array.from({ length: 65 }, (_, n) => ({
    id: String(n),
    text: `text ${n}`,
    projectId: "x",
  }));
  let calls = 0;
  t.mock.method(
    globalThis,
    "fetch",
    async (_url: unknown, init: RequestInit) => {
      calls++;
      const body = JSON.parse(String(init.body));
      return new Response(
        JSON.stringify({
          data: body.input.map((_: string, index: number) => ({
            index,
            embedding: new Array(1536).fill(1),
          })),
        }),
      );
    },
  );
  await assert.rejects(buildIndex(docs, "test-only", undefined, 1), /limit/);
  assert.equal(calls, 1);
  const index = await buildIndex(docs.slice(0, 2), "test-only", undefined, 1);
  const priorCalls = calls;
  const reused = await buildIndex(
    docs.slice(0, 2).map((d) => ({ ...d, revision: "new-source" })),
    "test-only",
    index,
    1,
  );
  assert.equal(calls, priorCalls);
  assert.equal(
    validIndex(
      reused,
      docs.slice(0, 2).map((d) => ({ ...d, revision: "new-source" })),
    ),
    true,
  );
});
