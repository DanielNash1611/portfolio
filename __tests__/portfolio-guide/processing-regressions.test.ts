import assert from "node:assert/strict";
import test from "node:test";
import type OpenAI from "openai";
import {
  getAllCanonicalPageContexts,
  getPageContextBySlug,
  getPortfolioContext,
} from "@/lib/portfolio-guide/context";
import {
  buildClaimInventory,
  pageClaimBlocks,
  renderClaimSelection,
} from "@/lib/portfolio-guide/factual-answers";
import {
  generatePortfolioGuideResponse,
  processPortfolioGuideAnswer,
} from "@/lib/portfolio-guide/service";
import type { CopilotRequest } from "@/lib/portfolio-guide/types";

function request(
  slug = "ai-platform-mcp",
  message = "Summarize this page",
): CopilotRequest {
  return {
    message,
    pageContext: getPageContextBySlug(slug)!,
    portfolioContext: getPortfolioContext(),
    sessionContext: {
      visitedPages: [],
      clickedPrompts: [],
      askedQuestions: [],
      inferredInterestTags: [],
    },
  };
}
function render(req: CopilotRequest, rawText: string) {
  return renderClaimSelection({
    request: req,
    blocks: buildClaimInventory(req),
    rawText,
    relatedPages: [],
  });
}

test("every canonical block comes from supplied source fields and retains all mapped qualifications", () => {
  for (const page of getAllCanonicalPageContexts()) {
    const blocks = pageClaimBlocks(page);
    assert.ok(blocks.length, page.slug);
    assert.equal(new Set(blocks.map((block) => block.id)).size, blocks.length);
    for (const block of blocks) {
      const output = render(
        request(page.slug),
        JSON.stringify({ blockIds: [block.id] }),
      );
      for (const text of [...block.claims, ...block.qualifications])
        assert.ok(
          output.response.answer.includes(text),
          `${block.id}: ${text}`,
        );
      assert.ok(
        block.sourceRefs.every((ref) => ref.startsWith(`${page.slug}.`)),
      );
    }
  }
});

test("selection rejects prose, unknown IDs, extra fields, duplicates and oversized lists without rendering them", () => {
  const req = request();
  for (const raw of [
    "He shipped a platform in 16 months with measurable business outcomes.",
    JSON.stringify({ answer: "He led pilots and solely built everything." }),
    JSON.stringify({ blockIds: ["invented:16-months"] }),
    JSON.stringify({
      blockIds: ["ai-platform-mcp:validation"],
      answer: "paid $16M",
    }),
    JSON.stringify({
      blockIds: ["ai-platform-mcp:validation", "ai-platform-mcp:validation"],
    }),
    JSON.stringify({
      blockIds: [
        "ai-platform-mcp:validation",
        "ai-platform-mcp:patterns",
        "ai-platform-mcp:timeline",
      ],
    }),
  ]) {
    const result = render(req, raw);
    assert.equal(result.status, "canonical-fallback");
    assert.doesNotMatch(
      result.response.answer,
      /16 months|measurable business outcomes|he led pilots|solely built|paid \$16M/i,
    );
    assert.match(result.response.answer, /87%.*would use it again/);
  }
});

test("timeline is exact approved dates and vision/engineering/outcome limits, with no inferred interval", () => {
  const result = render(
    request("ai-platform-mcp", "Show the impact"),
    '{"blockIds":["ai-platform-mcp:timeline"]}',
  );
  assert.equal(result.status, "selected-blocks");
  assert.match(
    result.response.answer,
    /February 2025.*October 2025.*February 2026/,
  );
  assert.match(
    result.response.answer,
    /does not establish.*full original vision/,
  );
  assert.match(result.response.answer, /end-to-end production engineering/);
  assert.match(
    result.response.answer,
    /does not establish faster or more reliable scaling/,
  );
  assert.doesNotMatch(
    result.response.answer,
    /\b(?:12|16) months|rapid end-to-end delivery/,
  );
});

test("role relevance renders prototype intent and reusable patterns without business-outcome promotion", () => {
  const result = render(
    request(
      "ai-platform-mcp",
      "For the role I entered, what's most relevant here?",
    ),
    '{"blockIds":["ai-platform-mcp:validation","ai-platform-mcp:patterns"]}',
  );
  assert.match(result.response.answer, /87%.*would use it again/);
  assert.match(result.response.answer, /reusable platform foundations/);
  assert.match(
    result.response.answer,
    /does not describe end-to-end production implementation ownership/,
  );
  assert.doesNotMatch(
    result.response.answer,
    /delivery of measurable business outcomes/,
  );
});

test("rollout source and rendered block retain collaborative helped-lead attribution", () => {
  const req = request("ai-strategy");
  assert.match(req.pageContext.evidenceHighlights![1].detail, /helping lead/);
  const result = render(req, '{"blockIds":["ai-strategy:rollout"]}');
  assert.match(result.response.answer, /helped lead early ChatGPT rollout/);
  assert.match(result.response.answer, /pre-call preparation and drafting/);
  assert.doesNotMatch(result.response.answer, /he led pilots/);
});

test("ownership selection cannot omit direction, AI assistance, no sole coding, implementation or local status", () => {
  const req = request(
    "ai-career-operating-system",
    "Across the portfolio, what did Daniel direct, what was AI-assisted, and what is still a local prototype?",
  );
  for (const raw of [
    '{"blockIds":[]}',
    '{"blockIds":["ai-career-operating-system:media"]}',
    "invalid",
  ]) {
    const result = render(req, raw);
    assert.match(result.response.answer, /Defined the product thesis/);
    assert.match(result.response.answer, /AI development agents/);
    assert.match(result.response.answer, /does not claim sole hand-coding/);
    assert.match(
      result.response.answer,
      /support authenticated resume-job API/,
    );
    assert.match(result.response.answer, /locally tested Decisions API/);
    assert.match(
      result.response.answer,
      /Final combined-release validation remains pending/,
    );
    assert.match(
      result.response.answer,
      /remote career retrieval remains disabled/,
    );
  }
});

test("inventory proof stays qualified and never receives model-generated performance conclusions", () => {
  const result = render(
    request("ai-career-operating-system"),
    '{"blockIds":["ai-career-operating-system:media"]}',
  );
  assert.match(result.response.answer, /147.65 MiB to 81.58 MiB/);
  assert.match(result.response.answer, /excludes server bundles/);
  assert.match(result.response.answer, /not independently rerun/);
  assert.match(
    result.response.answer,
    /no runtime, billing, storage-reclamation or semantic AI-quality outcome/,
  );
  assert.match(result.response.answer, /implementation was AI-assisted/);
});

test("supporting facts require actual supplied blocks and retain explicit broader attribution", () => {
  const req = request();
  const supporting = getPageContextBySlug("chatgpt-enterprise")!;
  const blocks = buildClaimInventory(req, [supporting]);
  const foreign = blocks.find((block) => block.pageSlug === supporting.slug)!;
  const scoped = renderClaimSelection({
    request: req,
    blocks,
    rawText: JSON.stringify({ blockIds: [foreign.id] }),
    relatedPages: [],
  });
  assert.equal(scoped.status, "canonical-fallback");
  const broader = renderClaimSelection({
    request: {
      ...req,
      message: "Across the portfolio, what experience is relevant?",
    },
    blocks,
    rawText: JSON.stringify({ blockIds: [foreign.id] }),
    relatedPages: [],
  });
  assert.match(
    broader.response.answer,
    /Elsewhere in the portfolio — ChatGPT Enterprise/,
  );
  assert.ok(
    foreign.claims.every((claim) => broader.response.answer.includes(claim)),
  );
  assert.equal(
    render(req, JSON.stringify({ blockIds: [foreign.id] })).status,
    "canonical-fallback",
  );
});

test("generator instructions and unavailable evidence are complete after rendering", () => {
  const req = request(
    "ai-platform-mcp",
    "Generate a PDF resume for this job description",
  );
  const output = processPortfolioGuideAnswer({
    request: req,
    rawText: '{"blockIds":[]}',
    relatedPages: [],
    careerEvidence: {
      evidence: [],
      safeFallback: "The evidence layer is unavailable.",
      answerability: "none",
    } as never,
  });
  assert.match(
    output.finalized.answer,
    /\/resume\/generate.*paste the job description in the generator flow/,
  );
  assert.match(output.finalized.answer, /only after that flow runs/);
  assert.match(output.finalized.answer, /The evidence layer is unavailable\.$/);
});

test("model receives schema-bound public selection IDs; free-form output falls back without another call", async () => {
  let calls = 0;
  const result = await generatePortfolioGuideResponse(request(), {
    apiKey: "fixture",
    client: {
      responses: {
        create: async (params: Record<string, unknown>) => {
          calls++;
          assert.equal(
            (params.text as { format: { type: string } }).format.type,
            "json_schema",
          );
          const input = params.input as Array<{ content: string }>;
          const packet = JSON.parse(input[1].content);
          assert.ok(
            packet.approvedBlocks.every((block: { id: string }) => block.id),
          );
          assert.equal(packet.previousAssistantAnswer, undefined);
          return {
            output_text:
              "Invented 16 months, sole implementation and measured business outcomes.",
          };
        },
      },
    } as unknown as OpenAI,
  });
  assert.equal(calls, 1);
  assert.equal(result.normalizationStatus, "canonical-fallback");
  assert.doesNotMatch(
    result.response.answer,
    /Invented|16 months|sole implementation and measured/,
  );
});

test("the exact three local failures and original paid ownership raw response use safe canonical fallback", async () => {
  const { default: captures } = await import(
    "./fixtures/factual-selection-regressions.json"
  );
  for (const captured of captures) {
    const output = render(
      request(captured.slug, captured.question),
      captured.rawText,
    );
    assert.equal(output.status, "canonical-fallback", captured.caseId);
    assert.doesNotMatch(
      output.response.answer,
      /roughly 16|rapid end.to.end delivery|delivery of measurable business outcomes|he led pilots/i,
    );
    if (captured.caseId === "original-paid-ownership-credit") {
      assert.match(output.response.answer, /AI development agents/);
      assert.match(output.response.answer, /does not claim sole hand-coding/);
      assert.match(output.response.answer, /locally tested Decisions API/);
    }
  }
});

test("private and unaudited career records cannot enter the selector allowlist", () => {
  const req = request();
  const evidence = {
    evidence: [
      {
        id: "private",
        claim: "PRIVATE CLAIM",
        visibility: "private",
        sourceAudit: { status: "verified" },
      },
      {
        id: "unverified",
        claim: "UNVERIFIED CLAIM",
        visibility: "public_safe",
        sourceAudit: { status: "unverified" },
      },
    ],
  };
  const blocks = buildClaimInventory(req, [], evidence as never);
  assert.equal(
    blocks.some((block) => block.id.startsWith("career:")),
    false,
  );
  assert.doesNotMatch(JSON.stringify(blocks), /PRIVATE CLAIM|UNVERIFIED CLAIM/);
});
