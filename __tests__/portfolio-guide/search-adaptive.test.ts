import assert from "node:assert/strict";
import test from "node:test";
import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { resolve, dirname } from "node:path";
import { prepareSearchScope } from "../../lib/portfolio-guide/evals/search-scope";
import {
  createSearchBudgetGuard,
  searchManifestHash,
  searchSha256,
  verifyFrozenSearchFiles,
  type FrozenSearchManifest,
  type SearchTransport,
} from "../../lib/portfolio-guide/evals/search-budget";
import { createFileSearchJournal } from "../../lib/portfolio-guide/evals/search-budget-journal";
import {
  adaptiveSourceInventory,
  auditSearchGeneration,
  runAdaptiveCase,
  type PublicSearchBundle,
} from "../../lib/portfolio-guide/evals/search-adaptive";
import { createSearchFixtureTransport } from "../../lib/portfolio-guide/evals/search-fixture";

const evidence = resolve(
  "../review-evidence/semantic-search-preparation-20261017",
);
const careerRoot = resolve("../resumecustomizer-search");
const available =
  existsSync(resolve(evidence, "paid-test-proposal.json")) &&
  existsSync(resolve(careerRoot, "lib/evidence/search.ts"));
const root = mkdtempSync(resolve(tmpdir(), "adaptive-search-tests-"));
process.on("exit", () => rmSync(root, { recursive: true, force: true }));
let id = 0;
function fixture() {
  const output = resolve(root, `scope-${id++}`);
  const prepared = prepareSearchScope({
    portfolioRoot: process.cwd(),
    careerRoot,
    proposal: resolve(evidence, "paid-test-proposal.json"),
    queries: resolve(evidence, "paid-test-queries.json"),
    output,
  });
  const { manifest, approval } = prepared;
  approval.approved = true;
  approval.pricingVerified = true;
  const bundle = JSON.parse(
    readFileSync(manifest.publicBundle!.path, "utf8"),
  ) as PublicSearchBundle;
  const base = createSearchFixtureTransport(bundle);
  const attempts: Array<{ model: string; body: string }> = [];
  const transport: SearchTransport = async (request) => {
    attempts.push({
      model: JSON.parse(request.body).model,
      body: request.body,
    });
    return base(request);
  };
  const make = (override?: SearchTransport) =>
    createSearchBudgetGuard({
      manifest,
      approval,
      journal: createFileSearchJournal(manifest.journalDirectory!),
      transport: override ?? transport,
    });
  return { ...prepared, bundle, base, attempts, transport, make, output };
}
const options = {
  skip: !available
    ? "Requires the frozen isolated ResumeCustomizer candidate and original local proposal"
    : false,
};

test(
  "actual adaptive pipeline uses production retrieval/rendering, 17 bounded calls and no fetch or credential escape",
  options,
  async (t) => {
    let escaped = 0,
      credentials = 0;
    t.mock.method(globalThis, "fetch", async () => {
      escaped++;
      throw new Error("unbudgeted fetch");
    });
    const env = process.env;
    process.env = new Proxy(env, {
      get(target, key) {
        if (key === "OPENAI_API_KEY") {
          credentials++;
          throw new Error("credential read");
        }
        return Reflect.get(target, key);
      },
    });
    t.after(() => {
      process.env = env;
    });
    const f = fixture(),
      g = f.make();
    const result = await g.execute();
    assert.equal(result.results.length, 6);
    assert.equal(result.rankings.length, 23);
    assert.equal(
      result.rankings.filter((r) => r.kind === "portfolio" && r.lexicalPass)
        .length,
      7,
    );
    assert.equal(
      result.rankings.filter((r) => r.kind === "career" && r.lexicalPass)
        .length,
      15,
    );
    assert.equal(f.attempts.length, 17);
    assert.equal(
      f.attempts.filter((a) => a.model === "text-embedding-3-small").length,
      3,
    );
    assert.equal(f.attempts.filter((a) => a.model === "gpt-6-luna").length, 2);
    assert.equal(result.snapshot.reservedNano, 1_558_080_000);
    assert.equal(result.snapshot.stopped, false);
    assert.equal(Object.keys(result.snapshot.acceptedCases).length, 6);
    assert.equal(result.snapshot.bypassedRouting.length, 4);
    assert.equal(escaped, 0);
    assert.equal(credentials, 0);
    const folder = resolve(
      f.manifest.journalDirectory!,
      f.manifest.executionId,
    );
    const files = readdirSync(folder);
    assert.equal(files.filter((p) => p.startsWith("raw-")).length, 17);
    assert.equal(files.filter((p) => p.startsWith("request-")).length, 17);
    const indexes = JSON.parse(
      readFileSync(resolve(folder, "artifact-indexes.json"), "utf8"),
    );
    assert.equal(indexes.career.records.length, 27);
    assert.equal(indexes.portfolio.records.length, 63);
    for (const old of f.bundle.career.cache.records)
      assert.deepEqual(
        indexes.career.records.find((r: { id: string }) => r.id === old.id)
          .vector,
        old.vector,
      );
    for (const a of f.attempts.filter((a) =>
      ["gpt-5.6-terra", "gpt-6.1-sol"].includes(a.model),
    )) {
      const packet = JSON.parse(a.body);
      assert.equal(packet.store, false);
      assert.equal(packet.service_tier, "default");
      assert.equal(packet.tools, undefined);
      assert.ok(Buffer.byteLength(a.body) + 1024 <= 48000);
    }
    const first = result.results[0];
    for (const key of ["title", "url", "kind", "excerpt"] as const) {
      const changed = structuredClone(first.generation);
      Object.assign(changed.response.citations![0], { [key]: "wrong" });
      assert.throws(() => auditSearchGeneration(f.bundle, first.id, changed));
    }
    let afterMiss = 0;
    await assert.rejects(
      runAdaptiveCase(f.bundle, indexes, "qualification", {
        queryVector() {
          throw new Error("query_cache_miss_no_transport");
        },
        call: async () => {
          afterMiss++;
          return {};
        },
        bypassRouting() {},
        record() {},
      }),
      /cache_miss/,
    );
    assert.equal(afterMiss, 0);
    assert.equal(escaped, 0);
    await assert.rejects(g.execute());
    assert.equal(f.attempts.length, 17);
    assert.throws(() => f.make(), /EEXIST/);
  },
);

for (const issue of [
  "invalid-routing",
  "failed-routing",
  "invalid-selection",
  "model-tool-call",
  "invalid-judge-score",
  "failed-judge",
  "missing-usage",
] as const)
  test(
    `actual runner stops without retry after ${issue}`,
    options,
    async (t) => {
      let escapes = 0;
      t.mock.method(globalThis, "fetch", async () => {
        escapes++;
        throw new Error("forbidden");
      });
      const f = fixture();
      const transport: SearchTransport = async (r) => {
        const model = JSON.parse(r.body).model;
        f.attempts.push({ model, body: r.body });
        if (issue === "failed-routing" && model === "gpt-6-luna")
          throw new Error("fixture transport failure");
        const result = await f.base(r);
        const data = JSON.parse(result.body);
        if (issue === "invalid-routing" && model === "gpt-6-luna")
          data.answers = [];
        if (issue === "invalid-selection" && model === "gpt-5.6-terra")
          data.output[0].content[0].text = JSON.stringify({
            blockIds: ["unapproved-private-id"],
          });
        if (issue === "model-tool-call" && model === "gpt-5.6-terra")
          data.output = [
            {
              type: "function_call",
              name: "searchCareerEvidence",
              arguments: '{"query":"unapproved"}',
            },
          ];
        if (issue === "invalid-judge-score" && model === "gpt-6.1-sol") {
          const j = JSON.parse(data.output[0].content[0].text);
          j.scores.groundedness = 999;
          data.output[0].content[0].text = JSON.stringify(j);
        }
        if (issue === "failed-judge" && model === "gpt-6.1-sol") {
          const j = JSON.parse(data.output[0].content[0].text);
          j.verdict = "fail";
          data.output[0].content[0].text = JSON.stringify(j);
        }
        if (issue === "missing-usage") delete data.usage;
        return { ...result, body: JSON.stringify(data) };
      };
      const g = f.make(transport);
      await assert.rejects(g.execute());
      const expected = issue.endsWith("routing")
        ? 6
        : issue.includes("judge")
          ? 5
          : issue === "missing-usage"
            ? 1
            : 4;
      assert.equal(f.attempts.length, expected);
      assert.equal(g.snapshot().stopped, true);
      assert.equal(escapes, 0);
      await assert.rejects(g.execute());
      assert.equal(f.attempts.length, expected);
      const folder = resolve(
        f.manifest.journalDirectory!,
        f.manifest.executionId,
      );
      assert.ok(existsSync(resolve(folder, "artifact-failure.json")));
      if (issue === "invalid-selection")
        assert.ok(
          existsSync(
            resolve(folder, "artifact-generation-patent-measurement.json"),
          ),
        );
    },
  );

test(
  "adaptive public methods cannot admit caller packets, gates or lazy query embeddings",
  options,
  async () => {
    for (const method of ["packet", "case", "bypass", "miss"]) {
      const f = fixture(),
        g = f.make();
      if (method === "packet")
        await assert.rejects(g.call("routing", "ownership", "{}"));
      if (method === "case")
        assert.throws(() =>
          g.acceptCase("patent-measurement", {
            judgePassed: true,
            sourceSafety: true,
            citations: true,
            qualifications: true,
          }),
        );
      if (method === "bypass")
        assert.throws(() => g.bypassRouting("patent-measurement"));
      if (method === "miss") assert.throws(() => g.queryVector("cache miss"));
      await assert.rejects(g.execute());
      assert.equal(f.attempts.length, 0);
    }
  },
);

test(
  "changed questions or catalog cannot be hidden behind unchanged corpus hash labels",
  options,
  () => {
    for (const target of ["question", "catalog"]) {
      const f = fixture();
      if (target === "question")
        f.bundle.questions[0].question = "Unapproved private question";
      else f.bundle.career.items[0].claim = "Unapproved claim";
      writeFileSync(f.manifest.publicBundle!.path, JSON.stringify(f.bundle));
      const digest = searchSha256(readFileSync(f.manifest.publicBundle!.path));
      f.manifest.publicBundle!.sha256 = digest;
      f.manifest.files.find(
        (r) => r.path === f.manifest.publicBundle!.path,
      )!.sha256 = digest;
      f.approval.scopeSha256 = searchManifestHash(f.manifest);
      assert.throws(() => f.make());
      assert.equal(f.attempts.length, 0);
    }
  },
);

test(
  "CLI fake dispatch and pending live approval never touch credentials or unguarded transport",
  options,
  () => {
    const f = fixture();
    f.approval.approved = false;
    f.approval.pricingVerified = false;
    const trap = resolve(root, "credential-transport-trap.mjs"),
      marker = resolve(root, "forbidden-access-marker");
    writeFileSync(
      trap,
      `import{writeFileSync}from"node:fs";process.env=new Proxy(process.env,{get(t,k){if(k==="OPENAI_API_KEY"){writeFileSync(${JSON.stringify(marker)},"credential");throw Error("credential forbidden");}return Reflect.get(t,k);}});globalThis.fetch=async()=>{writeFileSync(${JSON.stringify(marker)},"transport");throw Error("transport forbidden");};`,
    );
    const command = (args: string[]) =>
      execFileSync(
        process.execPath,
        [
          "--import",
          trap,
          "--import",
          "tsx",
          "scripts/run-search-evaluation.ts",
          ...args,
        ],
        {
          cwd: process.cwd(),
          encoding: "utf8",
          env: { PATH: process.env.PATH, NODE_ENV: "test" },
          stdio: ["ignore", "pipe", "pipe"],
        },
      );
    const text = command([
      "--mode",
      "fake",
      "--manifest",
      resolve(f.output, "manifest.json"),
      "--output",
      resolve(root, "cli-fake"),
    ]);
    assert.equal(JSON.parse(text.trim()).calls, 17);
    assert.equal(existsSync(marker), false);
    assert.throws(() =>
      command([
        "--mode",
        "live",
        "--allow-paid",
        "--manifest",
        resolve(f.output, "manifest.json"),
        "--approval",
        resolve(f.output, "approval-pending.json"),
      ]),
    );
    assert.equal(existsSync(marker), false);
  },
);
test(
  "an omitted source file fails before any adaptive transport",
  options,
  () => {
    const f = fixture();
    f.manifest.files = f.manifest.files.filter(
      (file) => file.path !== resolve("lib/portfolio-guide/retrieval.ts"),
    );
    f.approval.scopeSha256 = searchManifestHash(f.manifest);
    assert.throws(() => f.make(), /source_inventory/);
    assert.equal(f.attempts.length, 0);
  },
);
test("every admission detects new executable shadow files and source symlinks", () => {
  const roots = [
    resolve(root, "shadow-portfolio"),
    resolve(root, "shadow-career"),
  ];
  for (const path of roots)
    for (const name of [
      "lib/evidence",
      "lib/search",
      "scripts/lib",
      "evals/search",
      "content",
      "data",
      "sources",
    ])
      mkdirSync(resolve(path, name), { recursive: true });
  for (const path of adaptiveSourceInventory(roots[0], roots[1])) {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, "fixture");
  }
  const repositories = roots.map((path) => {
    execFileSync("git", ["init", "-q", path]);
    execFileSync("git", [
      "-C",
      path,
      "-c",
      "user.name=Fixture",
      "-c",
      "user.email=fixture@example.invalid",
      "commit",
      "-q",
      "--allow-empty",
      "-m",
      "fixture",
    ]);
    return {
      path,
      head: execFileSync("git", ["-C", path, "rev-parse", "HEAD"], {
        encoding: "utf8",
      }).trim(),
    };
  });
  const manifest = {
    packetMode: "adaptive-v1",
    repositories,
    files: adaptiveSourceInventory(roots[0], roots[1]).map((path) => ({
      path,
      sha256: searchSha256(readFileSync(path)),
    })),
  } as FrozenSearchManifest;
  verifyFrozenSearchFiles(manifest);
  for (const extension of ["js", "jsx", "mjs", "cjs", "mts", "cts"]) {
    const path = resolve(roots[1], `lib/evidence/catalog.${extension}`);
    writeFileSync(path, "unreviewed shadow");
    assert.throws(
      () => verifyFrozenSearchFiles(manifest),
      /frozen_source_inventory_changed/,
    );
    rmSync(path);
  }
  const link = resolve(roots[1], "lib/evidence/catalog.js");
  symlinkSync(resolve(roots[1], "package.json"), link);
  assert.throws(
    () => verifyFrozenSearchFiles(manifest),
    /source_symlink_forbidden/,
  );
  rmSync(link);
  verifyFrozenSearchFiles(manifest);
});
test(
  "approved CLI live-dispatch adapter remains single-attempt with fake fetch and a dummy key",
  options,
  () => {
    for (const denied of [false, true]) {
      const f = fixture();
      const approved = resolve(f.output, "approval-fixture.json");
      writeFileSync(approved, JSON.stringify(f.approval));
      const preload = resolve(f.output, "live-adapter-fixture.mjs"),
        counter = resolve(f.output, "fake-fetch-count");
      writeFileSync(
        preload,
        `import{readFileSync,appendFileSync}from"node:fs";import assert from"node:assert/strict";const {createSearchFixtureTransport}=await import(${JSON.stringify(resolve("lib/portfolio-guide/evals/search-fixture.ts"))});const bundle=JSON.parse(readFileSync(${JSON.stringify(f.manifest.publicBundle!.path)},"utf8"));const fake=createSearchFixtureTransport(bundle);process.env=new Proxy(process.env,{get(t,k){if(k==="OPENAI_API_KEY")return"FAKE_TRANSPORT_ONLY";return Reflect.get(t,k);}});globalThis.fetch=async(url,init)=>{appendFileSync(${JSON.stringify(counter)},"1\\n");assert.equal(init.redirect,"error");assert.equal(init.headers.Authorization,"Bearer FAKE_TRANSPORT_ONLY");assert.equal(init.method,"POST");assert.ok(String(url).startsWith("https://api.openai.com/v1/"));const r=${denied ? '{status:429,body:"fixture denied"}' : "await fake({url,method:init.method,body:init.body,signal:init.signal})"};return new Response(r.body,{status:r.status});};`,
      );
      const invoke = () =>
        execFileSync(
          process.execPath,
          [
            "--import",
            "tsx",
            "--import",
            preload,
            "scripts/run-search-evaluation.ts",
            "--mode",
            "live",
            "--allow-paid",
            "--manifest",
            resolve(f.output, "manifest.json"),
            "--approval",
            approved,
          ],
          {
            cwd: process.cwd(),
            encoding: "utf8",
            env: { PATH: process.env.PATH, NODE_ENV: "test" },
            stdio: ["ignore", "pipe", "pipe"],
          },
        );
      if (denied) assert.throws(invoke);
      else assert.equal(JSON.parse(invoke().trim()).calls, 17);
      assert.equal(
        readFileSync(counter, "utf8").trim().split("\n").length,
        denied ? 1 : 17,
      );
      assert.throws(invoke); // Same execution claim cannot be resumed, even by CLI.
      assert.equal(
        readFileSync(counter, "utf8").trim().split("\n").length,
        denied ? 1 : 17,
      );
    }
  },
);
