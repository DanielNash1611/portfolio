import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { parseArgs } from "node:util";
import {
  prepareSearchScope,
  durableDirectory,
} from "../lib/portfolio-guide/evals/search-scope";
import {
  createSearchBudgetGuard,
  searchManifestHash,
  searchSha256,
  verifyFrozenSearchFiles,
  type FrozenSearchManifest,
  type SearchApproval,
  type SearchTransport,
} from "../lib/portfolio-guide/evals/search-budget";
import { createFileSearchJournal } from "../lib/portfolio-guide/evals/search-budget-journal";
import { loadAdaptiveBundle } from "../lib/portfolio-guide/evals/search-adaptive";
import { createSearchFixtureTransport } from "../lib/portfolio-guide/evals/search-fixture";

const { values } = parseArgs({
  options: {
    mode: { type: "string", default: "prepare" },
    "career-root": { type: "string" },
    proposal: { type: "string" },
    queries: { type: "string" },
    output: { type: "string" },
    manifest: { type: "string" },
    approval: { type: "string" },
    "allow-paid": { type: "boolean", default: false },
  },
  strict: true,
});
async function main() {
  if (values.mode === "prepare") {
    if (
      !values["career-root"] ||
      !values.proposal ||
      !values.queries ||
      !values.output
    )
      throw new Error("prepare_requires_career_root_proposal_queries_output");
    const result = prepareSearchScope({
      portfolioRoot: process.cwd(),
      careerRoot: values["career-root"],
      proposal: values.proposal,
      queries: values.queries,
      output: values.output,
      requireClean: true,
    });
    console.log(
      JSON.stringify({
        mode: "prepared_only",
        executionId: result.manifest.executionId,
        scopeSha256: searchManifestHash(result.manifest),
        output: resolve(values.output),
        approval: "pending",
        providerCalls: 0,
      }),
    );
    return;
  }
  if (!["fake", "live"].includes(values.mode!) || !values.manifest)
    throw new Error("explicit_mode_and_manifest_required");
  const manifest = JSON.parse(
    readFileSync(values.manifest, "utf8"),
  ) as FrozenSearchManifest;
  verifyFrozenSearchFiles(manifest);
  const bundle = loadAdaptiveBundle(manifest);
  if (
    !manifest.journalDirectory ||
    resolve(values.manifest) !==
      resolve(dirname(manifest.journalDirectory), "manifest.json")
  )
    throw new Error("manifest_registry_binding_required");
  let approval: SearchApproval;
  let transport: SearchTransport;
  if (values.mode === "fake") {
    if (values["allow-paid"] || values.approval || !values.output)
      throw new Error("fake_mode_requires_separate_output_and_no_paid_options");
    durableDirectory(resolve(values.output));
    durableDirectory(resolve(values.output, "registry"));
    manifest.executionId = searchSha256(`${manifest.executionId}:FAKE_ONLY`);
    manifest.journalDirectory = resolve(values.output, "registry");
    approval = {
      approved: true,
      pricingVerified: true,
      executionId: manifest.executionId,
      scopeSha256: searchManifestHash(manifest),
      proposalSha256: manifest.proposalSha256,
      historySha256: manifest.historySha256,
      incrementalCeilingNano: 2e9,
      overallCeilingNano: 10e9,
    };
    transport = createSearchFixtureTransport(bundle);
  } else {
    if (!values["allow-paid"] || !values.approval || values.output)
      throw new Error("live_requires_explicit_paid_flag_and_frozen_approval");
    approval = JSON.parse(readFileSync(values.approval, "utf8"));
    // This closure is not invoked until approval, file validation, exclusive
    // claim and the full durable reservation have all succeeded.
    const rawFetch = globalThis.fetch;
    transport = async ({ url, method, body, signal }) => {
      const key = process.env.OPENAI_API_KEY;
      if (!key) throw new Error("approved_execution_credential_unavailable");
      const response = await rawFetch(url, {
        method,
        body,
        signal,
        redirect: "error",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
      });
      return { status: response.status, body: await response.text() };
    };
  }
  // Production helpers cannot escape through global fetch. The sole live
  // capability above is private to the guard's one-attempt transport.
  globalThis.fetch = async () => {
    throw new Error("unbudgeted_transport_forbidden");
  };
  const journal = createFileSearchJournal(manifest.journalDirectory);
  const guard = createSearchBudgetGuard({
    manifest,
    approval,
    journal,
    transport,
  });
  const result = await guard.execute();
  const report = {
    mode: values.mode,
    semanticQualityEvidence: values.mode === "live",
    ...result,
  };
  journal.artifact!("completed", report);
  console.log(
    JSON.stringify({
      mode: values.mode,
      cases: result.results.length,
      calls: result.snapshot.ledger.length,
      reservedNano: result.snapshot.reservedNano,
      stopped: result.snapshot.stopped,
      journal: manifest.journalDirectory,
    }),
  );
}
main().catch(() => {
  console.error(
    "Search evaluation stopped. Inspect immutable journal evidence; no retry/resume.",
  );
  process.exitCode = 1;
});
