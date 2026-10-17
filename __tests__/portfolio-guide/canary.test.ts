import assert from "node:assert/strict";
import test from "node:test";
import {
  getAllCanonicalPageContexts,
  getPageContextBySlug,
  getPortfolioContext,
} from "@/lib/portfolio-guide/context";
import { runGuardedCanary } from "@/lib/portfolio-guide/evals/canary";
import type {
  CanaryApproval,
  CanaryPacket,
  CanaryJournal,
} from "@/lib/portfolio-guide/evals/canary";
import { routingEvalCases } from "@/lib/portfolio-guide/evals/routing-cases";
import type { CopilotRequest } from "@/lib/portfolio-guide/types";
const scopeSha256 = "a".repeat(64);
const approval: CanaryApproval = {
  approved: false,
  pricingVerified: false,
  ceilingUsd: 10,
  scopeSha256,
  targetModelConfirmed: false,
  tokenCountingPricingVerified: false,
  tokenCountingChargeUsd: -1,
};
function packet(): CanaryPacket {
  const request: CopilotRequest = {
    message: "How does Daniel's career connect across the portfolio?",
    pageContext: getPageContextBySlug("ai-platform-mcp")!,
    portfolioContext: getPortfolioContext(),
    sessionContext: {
      visitedPages: [],
      clickedPrompts: [],
      askedQuestions: [],
      inferredInterestTags: [],
    },
  };
  return {
    models: {
      proposedAnswer: "gpt-5.6-terra",
      router: "gpt-6-luna",
      judge: "gpt-6.1-sol",
    },
    sources: getAllCanonicalPageContexts(),
    cases: Array.from({ length: 6 }, (_, i) => ({
      evalCase: {
        id: `synthetic-${i}`,
        judgeExpectations: ["Preserve source and prototype limits."],
      },
      request: {
        ...request,
        message:
          i === 4
            ? "What did Daniel own on this page?"
            : i === 5
              ? "Can I get a resume PDF?"
              : `${request.message} Synthetic scenario ${i}.`,
      },
    })),
    routingCases: routingEvalCases.map((c, i) => ({
      ...c,
      id: `routing-${i}`,
    })),
  };
}
function journal() {
  const records: Record<string, unknown> = {};
  let claimed = false;
  const value: CanaryJournal = {
    claim: () => {
      if (claimed) throw new Error("run already claimed");
      claimed = true;
    },
    budget: (state) => {
      records.ledger = state;
    },
    result: (name, record) => {
      if (name in records) throw new Error("duplicate result");
      records[name] = record;
    },
  };
  return { value, records };
}
test("dry canary exercises bounded adapter without external transport or API access", async () => {
  const log = journal();
  let externalCalls = 0;
  const result = await runGuardedCanary({
    packet: packet(),
    scopeSha256,
    approval,
    dryRun: true,
    journal: log.value,
    transport: async () => {
      externalCalls++;
      throw new Error("external call forbidden");
    },
  });
  assert.equal(externalCalls, 0);
  assert.equal(result.semanticClaimsAllowed, false);
  assert.equal(result.deploymentVerified, false);
  assert.equal(result.workflows, 6);
  assert.equal(result.pairedJudgments, 6);
  assert.equal(result.routing.length, 32);
  assert.ok(result.countCalls <= 30);
  assert.ok(result.budget.reservedUsd <= 7.776);
  assert.ok(result.budget.ledger.every((e) => e.status === "complete"));
  assert.ok(log.records["synthetic-0-judge-original"]);
  await assert.rejects(
    runGuardedCanary({
      packet: packet(),
      scopeSha256,
      approval,
      dryRun: true,
      journal: log.value,
    }),
    /already claimed/,
  );
});
test("live adapter blocks unconfirmed model/counting pricing before transport or journal claim", async () => {
  let touched = false;
  for (const change of [
    approval,
    {
      ...approval,
      approved: true,
      pricingVerified: true,
      targetModelConfirmed: true,
    },
  ]) {
    await assert.rejects(
      runGuardedCanary({
        packet: packet(),
        scopeSha256,
        approval: change,
        dryRun: false,
        apiKey: "test-only",
        journal: {
          claim: () => {
            touched = true;
          },
          budget: () => {},
          result: () => {},
        },
        transport: async () => {
          touched = true;
          throw new Error();
        },
      }),
      /confirmed model/,
    );
  }
  assert.equal(touched, false);
});
test("model or frozen-source changes cannot silently enter a canary", async () => {
  const changedModel = packet();
  changedModel.models.proposedAnswer = "gpt-5.4";
  await assert.rejects(
    runGuardedCanary({
      packet: changedModel,
      scopeSha256,
      approval,
      dryRun: true,
      journal: journal().value,
    }),
    /Model change/,
  );
  const changedSources = packet();
  changedSources.sources = [];
  await assert.rejects(
    runGuardedCanary({
      packet: changedSources,
      scopeSha256,
      approval,
      dryRun: true,
      journal: journal().value,
    }),
    /source bundle/,
  );
});
