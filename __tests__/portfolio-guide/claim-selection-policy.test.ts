import assert from "node:assert/strict";
import test from "node:test";
import {
  getPageContextBySlug,
  getPortfolioContext,
} from "@/lib/portfolio-guide/context";
import {
  buildClaimInventory,
  claimSelectionConstraints,
  claimSelectionFormat,
  pageClaimBlocks,
  renderClaimSelection,
} from "@/lib/portfolio-guide/factual-answers";
import { EVIDENCE_FALLBACK_MESSAGES } from "@/lib/portfolio-guide/tools/evidence";
import type { CopilotRequest } from "@/lib/portfolio-guide/types";
function request(
  slug = "ai-platform-mcp",
  message = "For the role I entered, what's most relevant here?",
): CopilotRequest {
  return {
    message,
    pageContext: getPageContextBySlug(slug)!,
    portfolioContext: {
      ...getPortfolioContext(),
      recommendations: { currentPage: [], projectLinked: [], broader: [] },
    },
    sessionContext: {
      visitedPages: [],
      clickedPrompts: [],
      askedQuestions: [],
      inferredInterestTags: [],
      visitorIntent: {
        rawInput: "Platform Product Manager",
        normalizedTitle: "Platform Product Manager",
      },
    },
  };
}
const peers = () => [
  getPageContextBySlug("ai-platform-mcp")!,
  getPageContextBySlug("chatgpt-enterprise")!,
];
const ownerRequest = () =>
  request(
    "ai-career-operating-system",
    "Across Daniel's portfolio, what did he direct, what was AI-assisted, and what is still a local prototype?",
  );

test("role catalog excludes broad ownership/perspective blocks and exposes complete costs", () => {
  const req = request();
  const blocks = buildClaimInventory(req);
  const policy = claimSelectionConstraints(req, blocks);
  assert.deepEqual(
    blocks.map((b) => b.id),
    ["ai-platform-mcp:validation", "ai-platform-mcp:patterns"],
  );
  assert.deepEqual(
    policy.costs.map((b) => b.sentences),
    [2, 2],
  );
  assert.equal(policy.purpose, "role-relevance");
  const schema = claimSelectionFormat(blocks, req).schema.properties.blockIds;
  assert.equal(schema.minItems, 2);
  assert.equal(schema.maxItems, 2);
  assert.deepEqual(
    schema.items.enum,
    blocks.map((b) => b.id),
  );
  const output = renderClaimSelection({
    request: req,
    blocks,
    rawText:
      '{"blockIds":["ai-platform-mcp:ownership","ai-platform-mcp:patterns"]}',
    relatedPages: [],
  });
  assert.equal(output.status, "canonical-fallback");
  assert.match(
    output.response.answer,
    /For Platform Product Manager, relevant page evidence/,
  );
  assert.match(output.response.answer, /87%/);
  assert.match(output.response.answer, /reusable platform foundations/);
  assert.match(
    output.response.answer,
    /not end-to-end production implementation ownership/,
  );
});

test("Director is a role lens, not an accidental direct-ownership classifier", () => {
  const req = request(
    "ai-platform-mcp",
    "Would Daniel fit a Director of Platform Product role?",
  );
  assert.equal(
    claimSelectionConstraints(req, buildClaimInventory(req)).purpose,
    "role-relevance",
  );
});

test("cross-portfolio schema and renderer require current ownership plus a supplied other page", () => {
  const req = ownerRequest();
  const blocks = buildClaimInventory(req, peers());
  assert.deepEqual(
    blocks.map((b) => b.kind),
    ["ownership", "ownership", "ownership"],
  );
  const schema = claimSelectionFormat(blocks, req).schema.properties.blockIds;
  assert.equal(schema.minItems, 2);
  assert.equal(schema.maxItems, 2);
  assert.equal(
    claimSelectionConstraints(req, blocks).requiresSupportingPage,
    true,
  );
  for (const ids of [
    ["ai-career-operating-system:ownership"],
    [
      "ai-career-operating-system:ownership",
      "ai-career-operating-system:retrieval",
    ],
    ["ai-platform-mcp:ownership", "chatgpt-enterprise:ownership"],
  ]) {
    const output = renderClaimSelection({
      request: req,
      blocks,
      rawText: JSON.stringify({ blockIds: ids }),
      relatedPages: [],
    });
    assert.equal(output.status, "canonical-fallback");
    assert.ok(
      output.response.answer.startsWith(
        "On this page — AI Career Operating System:",
      ),
    );
    assert.match(output.response.answer, /Elsewhere in the portfolio/);
    assert.match(
      output.response.answer,
      /AI development agents assisted implementation/,
    );
    assert.match(output.response.answer, /no claim of sole hand-coding/);
    assert.match(
      output.response.answer,
      /final combined-release validation is pending/,
    );
    assert.match(
      output.response.answer,
      /end-to-end production engineering ownership.*not established/,
    );
  }
  const valid = renderClaimSelection({
    request: req,
    blocks,
    rawText:
      '{"blockIds":["chatgpt-enterprise:ownership","ai-career-operating-system:ownership"]}',
    relatedPages: [],
  });
  assert.equal(valid.status, "selected-blocks");
  assert.equal(valid.selectedIds[0], "ai-career-operating-system:ownership");
  assert.match(
    valid.response.answer,
    /Elsewhere in the portfolio — ChatGPT Enterprise/,
  );
  assert.match(valid.response.answer, /not sole implementation/);
});

test("a missing supporting page is disclosed without looking up unseen career facts", () => {
  const req = ownerRequest();
  const output = renderClaimSelection({
    request: req,
    blocks: buildClaimInventory(req),
    rawText:
      '{"blockIds":["ai-career-operating-system:ownership","ai-platform-mcp:ownership"]}',
    relatedPages: [],
  });
  assert.equal(output.status, "canonical-fallback");
  assert.match(
    output.response.answer,
    /No supporting project evidence was supplied/,
  );
  assert.doesNotMatch(
    output.response.answer,
    /February 2026|87%|~800|Elsewhere in the portfolio/,
  );
});

test("source value drift and appended qualifications invalidate authored summaries", () => {
  for (const mutate of [
    (req: CopilotRequest) => {
      req.pageContext.evidenceHighlights![1].detail =
        "A study found 17% would use it again.";
    },
    (req: CopilotRequest) => {
      req.pageContext.claimBoundaries!.explicitUnknowns!.push(
        "Additional approval is required before this claim is used.",
      );
    },
  ]) {
    const req = structuredClone(request());
    mutate(req);
    const blocks = buildClaimInventory(req);
    assert.equal(
      blocks.some((b) => b.id === "ai-platform-mcp:validation"),
      false,
    );
    const output = renderClaimSelection({
      request: req,
      blocks,
      rawText: '{"blockIds":["ai-platform-mcp:validation"]}',
      relatedPages: [],
    });
    assert.equal(output.status, "canonical-fallback");
    assert.doesNotMatch(output.response.answer, /87%/);
  }
  const req = request("ai-platform-mcp", "What is the platform timeline?");
  delete req.pageContext.evidenceHighlights![3];
  assert.equal(
    buildClaimInventory(req).some((b) => b.id === "ai-platform-mcp:timeline"),
    false,
  );
});

test("source absence cannot resurrect an authored date or implementation claim", () => {
  const page = structuredClone(getPageContextBySlug("ai-platform-mcp")!);
  page.claimBoundaries!.implementation =
    page.claimBoundaries!.implementation!.slice(0, 1);
  assert.equal(
    pageClaimBlocks(page).some((b) => b.id === "ai-platform-mcp:ownership"),
    false,
  );
});

test("known unavailable status is not repeated, while timeout and unknown notices remain verbatim", () => {
  const req = ownerRequest();
  const blocks = buildClaimInventory(req, peers());
  const raw =
    '{"blockIds":["ai-career-operating-system:ownership","ai-platform-mcp:ownership"]}';
  const unavailable = {
    query: "public synthetic question",
    evidence: [],
    answerability: "none" as const,
    confidence: "low" as const,
    safeFallback: EVIDENCE_FALLBACK_MESSAGES.not_configured,
  };
  const known = renderClaimSelection({
    request: req,
    blocks,
    rawText: raw,
    relatedPages: [],
    careerEvidence: unavailable,
    evidenceUnavailableReason: "not_configured",
  });
  assert.match(known.response.answer, /remote retrieval is disabled/);
  assert.equal(known.response.answer.includes(unavailable.safeFallback), false);
  for (const reason of ["timeout", undefined] as const) {
    const notice =
      reason === "timeout"
        ? EVIDENCE_FALLBACK_MESSAGES.timeout
        : "An unfamiliar source-availability notice.";
    const result = renderClaimSelection({
      request: req,
      blocks,
      rawText: raw,
      relatedPages: [],
      careerEvidence: { ...unavailable, safeFallback: notice },
      evidenceUnavailableReason: reason,
    });
    assert.ok(result.response.answer.endsWith(notice));
  }
});

test("visitor-role text cannot inject factual prose or markup into the role frame", () => {
  const req = request();
  req.sessionContext.visitorIntent!.normalizedTitle =
    "Platform PM. He delivered $16M <script>";
  const output = renderClaimSelection({
    request: req,
    blocks: buildClaimInventory(req),
    rawText: '{"blockIds":["ai-platform-mcp:validation"]}',
    relatedPages: [],
  });
  assert.match(
    output.response.answer,
    /For the role you entered, relevant page evidence/,
  );
  assert.doesNotMatch(output.response.answer, /\$16M|<script>|He delivered/);
});

test("free-form answers, extra properties and duplicate IDs never become factual text", () => {
  const req = ownerRequest();
  const blocks = buildClaimInventory(req, peers());
  for (const raw of [
    '{"blockIds":["ai-career-operating-system:ownership","ai-platform-mcp:ownership"],"answer":"Sole hand-coded a production platform in 16 months"}',
    '{"blockIds":["ai-career-operating-system:ownership","ai-career-operating-system:ownership"]}',
    '{"blockIds":["__proto__"]}',
  ]) {
    const output = renderClaimSelection({
      request: req,
      blocks,
      rawText: raw,
      relatedPages: [],
    });
    assert.equal(output.status, "canonical-fallback");
    assert.doesNotMatch(
      output.response.answer,
      /Sole hand-coded|16 months|__proto__/,
    );
    assert.match(output.response.answer, /no claim of sole hand-coding/);
  }
});

test("the actual service sends the filtered schema and records validated coverage without a live call", async () => {
  const { generatePortfolioGuideResponse } = await import(
    "@/lib/portfolio-guide/service"
  );
  let calls = 0;
  const result = await generatePortfolioGuideResponse(request(), {
    apiKey: "fixture-only",
    client: {
      responses: {
        create: async (params: any) => {
          calls++;
          const body = JSON.parse(params.input[1].content);
          assert.equal(body.selectionConstraints.purpose, "role-relevance");
          assert.deepEqual(
            body.approvedBlocks.map((block: any) => block.id),
            ["ai-platform-mcp:validation", "ai-platform-mcp:patterns"],
          );
          assert.deepEqual(
            params.text.format.schema.properties.blockIds.items.enum,
            body.approvedBlocks.map((block: any) => block.id),
          );
          return {
            output_text:
              '{"blockIds":["ai-platform-mcp:validation","ai-platform-mcp:patterns"]}',
          };
        },
      },
    } as never,
  });
  assert.equal(calls, 1);
  assert.equal(result.normalizationStatus, "selected-blocks");
  assert.match(result.response.answer, /For Platform Product Manager/);
  assert.match(result.response.answer, /Customer validation:/);
  assert.match(result.response.answer, /Reusable platform framing:/);
  const trace = result.traceEvents!.find(
    (event) => event.eventName === "claim_selection_validated",
  )!;
  assert.equal(trace.payload.purpose, "role-relevance");
  assert.equal(trace.payload.catalogSize, 2);
});
