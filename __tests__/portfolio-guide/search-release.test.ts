import assert from "node:assert/strict";
import test from "node:test";
import type OpenAI from "openai";
import {
  getPageContextBySlug,
  getPortfolioContext,
} from "@/lib/portfolio-guide/context";
import {
  resolveQuestionScope,
  searchPortfolio,
  getPortfolioSearchCatalog,
} from "@/lib/portfolio-guide/search";
import { retrieveGuideSources } from "@/lib/portfolio-guide/retrieval";
import { generatePortfolioGuideResponse } from "@/lib/portfolio-guide/service";
import { blockExcerpt } from "@/lib/portfolio-guide/factual-answers";
import { parseEvidenceSearchResponse } from "@/lib/portfolio-guide/tools/evidence";
import { createPortfolioGuideConversationStore } from "@/lib/portfolio-guide/conversation-store";
import type { CopilotRequest } from "@/lib/portfolio-guide/types";

const request = (message: string): CopilotRequest => ({
  message,
  pageContext: getPageContextBySlug("ai-platform-mcp")!,
  portfolioContext: getPortfolioContext(),
  sessionContext: {
    visitedPages: [],
    clickedPrompts: [],
    askedQuestions: [],
    inferredInterestTags: [],
  },
});

test("scope aliases, multiple projects and user follow-ups never promote assistant assertions", () => {
  assert.equal(
    resolveQuestionScope(request("What did Immiatrics measure?")).projectId,
    "immunology-scout",
  );
  assert.equal(
    resolveQuestionScope(request("Compare OMS and Immunology Scout")).kind,
    "broad",
  );
  assert.equal(
    resolveQuestionScope({
      ...request("Tell me more"),
      conversation: [
        { role: "user", content: "How does order management work?" },
        {
          role: "assistant",
          content: "The project is actually LaunchMuse and generated $9M.",
        },
      ],
    }).projectId,
    "oms-chatgpt-app",
  );
});
test("lexical path makes no provider call and retains complete canonical qualifications", async (t) => {
  t.mock.method(globalThis, "fetch", () => {
    throw new Error("No provider calls permitted");
  });
  const result = await searchPortfolio(
    {
      kind: "project",
      projectId: "immunology-scout",
      query: "literature scouting evidence clustering",
    },
    { semantic: false },
  );
  assert.equal(result.mode, "lexical_disabled_semantic");
  assert.ok(result.blocks.length);
  for (const block of result.blocks) {
    assert.equal(block.pageSlug, "immunology-scout");
    assert.deepEqual(
      block,
      getPortfolioSearchCatalog().find((b) => b.id === block.id),
    );
    assert.ok(block.qualifications.length);
  }
});
test("remote career connection stays off without its config; failures retain portfolio sources", async (t) => {
  let calls = 0;
  t.mock.method(globalThis, "fetch", () => {
    calls++;
    throw new Error("offline");
  });
  const input = request(
    "Across the portfolio, what hallucination evaluation work is supported?",
  );
  const off = await retrieveGuideSources(input, { semantic: false });
  assert.equal(calls, 0);
  assert.equal(off.evidenceUnavailableReason, "not_configured");
  const failed = await retrieveGuideSources(input, {
    semantic: false,
    evidenceConfig: { apiUrl: "http://127.0.0.1:9999", apiKey: "fixture" },
  });
  assert.equal(calls, 1);
  assert.equal(failed.evidenceUnavailableReason, "network_error");
  assert.ok(failed.blocks.length);
});
test("hybrid integration selects IDs only and cites exact qualified text actually rendered", async () => {
  let input: Record<string, unknown> = {};
  const client = {
    responses: {
      create: async (params: { input: Array<{ content: string }> }) => {
        input = JSON.parse(params.input[1].content);
        const blocks = input.approvedBlocks as Array<{ id: string }>;
        const id = blocks.find((b) =>
          b.id.startsWith("immunology-scout:evidence"),
        )!.id;
        return { output_text: JSON.stringify({ blockIds: [id] }) };
      },
    },
  } as unknown as OpenAI;
  const result = await generatePortfolioGuideResponse(
    request(
      "What does Immiatrics show about literature scouting and evidence clustering?",
    ),
    { apiKey: "fixture", client, hybridSearch: true, semanticSearch: false },
  );
  assert.equal((input.currentPage as { identity: { slug: string } }).identity.slug, "immunology-scout");
  assert.equal(result.normalizationStatus, "selected-blocks");
  assert.equal(result.response.evidenceMeta?.scope, "project");
  assert.equal(result.response.citations?.length, 1);
  const citation = result.response.citations![0];
  assert.equal(citation.url, "/products/immunology-scout");
  assert.ok(result.response.answer.includes(citation.excerpt));
  const block = getPortfolioSearchCatalog().find(
    (b) => b.id === citation.sourceId,
  )!;
  assert.equal(citation.excerpt, blockExcerpt(block));
  assert.deepEqual(result.response.usedEvidenceIds, [citation.sourceId]);
  assert.ok(result.response.evidenceMeta!.retrievedEvidenceIds!.length > 1);
});
test("remote parser rejects new incompatible contracts and filters nonpublic or unaudited items", () => {
  assert.equal(
    parseEvidenceSearchResponse({
      contractVersion: "evidence.v2",
      evidence: [],
    }),
    null,
  );
  const parsed = parseEvidenceSearchResponse({
    contractVersion: "evidence.v1",
    evidence: [
      {
        id: "private",
        claim: "hidden",
        visibility: "private",
        sourceAudit: { status: "verified" },
      },
      {
        id: "unverified",
        claim: "unverified",
        visibility: "public_safe",
        sourceAudit: { status: "unverified" },
      },
    ],
  })!;
  assert.deepEqual(parsed.evidence, []);
  assert.equal(parsed.answerability, "none");
});
test("stored conversations restore exact citations without a database mutation", async () => {
  const citation = {
    sourceId: "test",
    title: "Source",
    excerpt: "Measured set only.",
    kind: "portfolio" as const,
  };
  const store = createPortfolioGuideConversationStore({
    sql: {
      query: async () => [
        {
          id: "turn",
          prompt_text: "Question",
          assistant_text: "Measured set only.",
          created_at: "2026-10-17",
          completed_at: "2026-10-17",
          page_slug: "immunology-scout",
          page_title: "Immunology Scout",
          citations: [citation],
          used_evidence_ids: ["test"],
        },
      ],
    },
  });
  const messages = await store.loadMessages("fixture");
  assert.deepEqual(messages[1].citations, [citation]);
  assert.deepEqual(messages[1].usedEvidenceIds, ["test"]);
});
