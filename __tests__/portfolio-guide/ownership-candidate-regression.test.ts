import assert from "node:assert/strict";
import test from "node:test";
import type OpenAI from "openai";
import fixture from "./fixtures/jpd-ownership-selection.json";
import {
  getPageContextBySlug,
  getPortfolioContext,
} from "@/lib/portfolio-guide/context";
import {
  getPortfolioSearchCatalog,
  resolveQuestionScope,
} from "@/lib/portfolio-guide/search";
import {
  buildClaimInventory,
  blockExcerpt,
  claimSelectionConstraints,
  claimSelectionFormat,
  pageClaimBlocks,
  renderClaimSelection,
} from "@/lib/portfolio-guide/factual-answers";
import { retrieveGuideSources } from "@/lib/portfolio-guide/retrieval";
import { generatePortfolioGuideResponse } from "@/lib/portfolio-guide/service";
import { getNamedProjectIds } from "@/lib/portfolio-guide/project-references";
import type { CopilotRequest } from "@/lib/portfolio-guide/types";
import type { EvidenceSearchResponse } from "@/lib/portfolio-guide/tools/evidence";

const request = (
  page = fixture.pageSlug,
  message = fixture.question,
): CopilotRequest => ({
  message,
  scope: "portfolio",
  pageContext: structuredClone(getPageContextBySlug(page)!),
  portfolioContext: getPortfolioContext(),
  sessionContext: {
    visitedPages: [],
    clickedPrompts: [],
    askedQuestions: [],
    inferredInterestTags: [],
  },
});
const capturedBlocks = () =>
  fixture.retrievedPortfolioIds.map((id) => {
    const block = getPortfolioSearchCatalog().find(
      (candidate) => candidate.id === id,
    );
    assert.ok(block);
    return block;
  });
const approvedCareer: EvidenceSearchResponse = {
  query: fixture.question,
  answerability: "high",
  confidence: "high",
  evidence: [
    {
      id: "product-operating-model-institutionalized",
      project: "Guitar Center",
      claim:
        "Defined product practices across intake, discovery, prioritization, and decision forums, and built an eight-week onboarding program for product managers and stakeholder groups.",
      claimBoundaries: ["No adoption, completion or business-impact claims."],
      supportingDetails: [],
      capabilityTags: [],
      metricTags: [],
      metrics: [],
      sourceAudit: {
        status: "verified",
        sourceType: "user-approved-public-fixture",
        lastReviewedAt: null,
      },
      visibility: "public_safe",
      recommendedUse: "Public approved evidence",
    },
  ],
};

test("named ownership proof remains available when optional retrieval is off", () => {
  const input = request("ai-career-operating-system");
  const blocks = buildClaimInventory(input);
  assert.deepEqual(blocks.map((b) => b.id), [fixture.expectedOwnershipId]);
  const answer = renderClaimSelection({ request: input, blocks, rawText: fixture.rawSelection, relatedPages: [] });
  assert.deepEqual(answer.selectedIds, [fixture.expectedOwnershipId]);
});

for (const page of [fixture.pageSlug, "ai-career-operating-system"]) {
  test(`captured JPD ownership omission is repaired from ${page}`, () => {
    const input = request(page);
    const ranked = capturedBlocks();
    assert.ok(!ranked.some((b) => b.id === fixture.expectedOwnershipId));
    const blocks = buildClaimInventory(input, [], approvedCareer, ranked);
    assert.deepEqual(
      blocks.map((b) => b.id),
      [fixture.expectedOwnershipId],
    );
    const authored = pageClaimBlocks(
      getPageContextBySlug(fixture.pageSlug)!,
    ).find((b) => b.id === fixture.expectedOwnershipId)!;
    assert.deepEqual(blocks[0], authored);
    const constraints = claimSelectionConstraints(input, blocks);
    assert.equal(constraints.primaryPageSlug, fixture.pageSlug);
    assert.equal(constraints.purpose, "focused-project-ownership");
    assert.equal(
      claimSelectionFormat(blocks, input).schema.properties.blockIds.minItems,
      1,
    );
    for (const rawText of [
      fixture.rawSelection,
      '{"blockIds":["ai-platform-mcp:ownership"]}',
    ]) {
      const answer = renderClaimSelection({
        request: input,
        blocks,
        rawText,
        relatedPages: [],
        careerEvidence: approvedCareer,
      });
      assert.deepEqual(answer.selectedIds, [fixture.expectedOwnershipId]);
      assert.equal(answer.status, "canonical-fallback");
      for (const text of [...authored.claims, ...authored.qualifications])
        assert.ok(answer.response.answer.includes(text));
      assert.doesNotMatch(
        answer.response.answer,
        /supplied approved evidence does not establish/,
      );
      assert.doesNotMatch(
        answer.response.answer,
        /eight-week|AI-assisted implementation|solely implemented/,
      );
    }
  });
}

test("the service cites only the complete JPD ownership block after captured empty selection", async (t) => {
  t.mock.method(globalThis, "fetch", () => {
    throw new Error("No live requests permitted");
  });
  let calls = 0;
  const client = {
    responses: {
      create: async (
        params: { input: Array<{ content: string }> },
        options: { maxRetries?: number },
      ) => {
        calls++;
        assert.equal(options.maxRetries, 0);
        const packet = JSON.parse(params.input[1].content);
        assert.deepEqual(
          packet.approvedBlocks.map((b: { id: string }) => b.id),
          [fixture.expectedOwnershipId],
        );
        return { output_text: fixture.rawSelection };
      },
    },
  } as unknown as OpenAI;
  const result = await generatePortfolioGuideResponse(request(), {
    apiKey: "synthetic-only",
    client,
    decisions: { enabled: false, apiKey: "synthetic-only" },
    hybridSearch: true,
    retrieveSources: (input) =>
      retrieveGuideSources(input, {
        portfolioSearch: async () => ({
          blocks: capturedBlocks(),
          mode: "hybrid-fixture",
        }),
        careerSearch: async () => ({ ok: true, data: approvedCareer }),
      }),
  });
  assert.equal(calls, 1);
  assert.deepEqual(result.response.usedEvidenceIds, [
    fixture.expectedOwnershipId,
  ]);
  assert.equal(result.response.citations?.length, 1);
  assert.equal(
    result.response.citations?.[0].url,
    "/case-studies/jira-product-discovery",
  );
  assert.equal(
    result.response.citations?.[0].excerpt,
    blockExcerpt(
      pageClaimBlocks(getPageContextBySlug(fixture.pageSlug)!).find(
        (b) => b.id === fixture.expectedOwnershipId,
      )!,
    ),
  );
  assert.equal(
    result.response.evidenceMeta?.resumeCustomizerEvidenceUsed,
    false,
  );
  assert.equal(result.response.evidenceMeta?.pageContextUsed, true);
});

test("missing current-page ownership source cannot be resurrected from the authored template", () => {
  const input = request();
  input.pageContext.claimBoundaries = {};
  assert.ok(
    !pageClaimBlocks(input.pageContext).some((b) => b.kind === "ownership"),
  );
  const blocks = buildClaimInventory(
    input,
    [],
    approvedCareer,
    capturedBlocks(),
  );
  assert.deepEqual(blocks, []);
  const answer = renderClaimSelection({
    request: input,
    blocks,
    rawText: fixture.rawSelection,
    relatedPages: [],
  });
  assert.deepEqual(answer.selectedIds, []);
  assert.match(answer.response.answer, /does not establish/);
});

test("an unknown project, role lens or previous assistant text cannot create a JPD target", () => {
  const input = request(
    "ai-career-operating-system",
    "What did Daniel own at Unlisted Moon Company?",
  );
  input.sessionContext.visitorIntent = { rawInput: "JPD leader" };
  input.conversation = [
    {
      role: "assistant",
      content: "Daniel solely built the Jira Product Discovery program.",
    },
  ];
  const blocks = buildClaimInventory(
    input,
    [],
    approvedCareer,
    capturedBlocks(),
  );
  assert.ok(
    !blocks.some(
      (b) =>
        b.pageSlug === fixture.pageSlug || b.pageSlug === "career-evidence",
    ),
  );
  assert.equal(claimSelectionConstraints(input, blocks).minBlocks, 0);
  assert.deepEqual(
    renderClaimSelection({
      request: input,
      blocks,
      rawText: fixture.rawSelection,
      relatedPages: [],
    }).selectedIds,
    [],
  );
});

test("JPD alias is explicit, comparisons stay broad, and unrelated questions retain existing policy", () => {
  assert.deepEqual(getNamedProjectIds("What did Daniel own in JPD?"), [
    fixture.pageSlug,
  ]);
  assert.deepEqual(getNamedProjectIds("JPDish experience"), []);
  assert.equal(
    resolveQuestionScope({
      ...request(),
      scope: undefined,
      message: "What did Daniel own in JPD?",
    }).projectId,
    fixture.pageSlug,
  );
  assert.equal(
    resolveQuestionScope(
      request("ai-platform-mcp", "Compare JPD and Immunology Scout"),
    ).kind,
    "broad",
  );
  const role = request(
    "ai-platform-mcp",
    "Would Daniel fit a Director of Platform Product role?",
  );
  assert.notEqual(
    claimSelectionConstraints(
      role,
      buildClaimInventory(role, [], undefined, capturedBlocks()),
    ).purpose,
    "focused-project-ownership",
  );
});

test("a deictic ownership question keeps the supplied current-page proof in Whole portfolio scope", () => {
  const input = request(fixture.pageSlug, "What did Daniel own here?");
  const blocks = buildClaimInventory(input, [], undefined, capturedBlocks());
  assert.deepEqual(
    blocks.map((b) => b.id),
    [fixture.expectedOwnershipId],
  );
  assert.deepEqual(
    renderClaimSelection({
      request: input,
      blocks,
      rawText: fixture.rawSelection,
      relatedPages: [],
    }).selectedIds,
    [fixture.expectedOwnershipId],
  );
});
