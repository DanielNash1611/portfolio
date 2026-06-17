/**
 * Tests for the evidence-aware response path in generatePortfolioGuideResponse.
 *
 * These exercise the failure modes that previously surfaced as a generic
 * "Unexpected server error" on /work/chatgpt-enterprise. The contract is:
 *   - the call always resolves (it never throws out to the route's 500 handler)
 *   - it degrades to a page-context answer when the deeper evidence layer fails
 *   - it reports why via response.evidenceMeta
 *
 * A fake OpenAI client drives the two-call tool flow deterministically; the
 * ResumeCustomizer HTTP boundary is stubbed via global.fetch.
 */

import assert from "node:assert/strict";
import test from "node:test";
import type OpenAI from "openai";
import { generatePortfolioGuideResponse } from "@/lib/portfolio-guide/service";
import type { CopilotRequest } from "@/lib/portfolio-guide/types";
import type { EvidenceSearchResponse } from "@/lib/portfolio-guide/tools/evidence";

const EVIDENCE_CONFIG = {
  apiUrl: "http://localhost:9999",
  apiKey: "test-evidence-key",
};

const CHATGPT_ENTERPRISE_PROMPT =
  "Use ResumeCustomizer evidence if available: what source-audited bullets support the ChatGPT Enterprise pilot impact claim?";

function createRequest(message = CHATGPT_ENTERPRISE_PROMPT): CopilotRequest {
  return {
    message,
    pageContext: {
      slug: "chatgpt-enterprise",
      href: "/work/chatgpt-enterprise",
      title: "Scaling ChatGPT Enterprise across the org",
      metrics: ["~$2.7M annualized pilot impact"],
      evidenceHighlights: [
        {
          label: "Pilot",
          detail: "Six-month matched-control pilot with measured impact.",
          type: "outcome",
        },
      ],
    },
    portfolioContext: {},
    sessionContext: {
      visitedPages: ["chatgpt-enterprise"],
      clickedPrompts: [],
      askedQuestions: [message],
      inferredInterestTags: ["ai-builder"],
    },
  };
}

const SAMPLE_EVIDENCE: EvidenceSearchResponse = {
  query: "ChatGPT Enterprise pilot impact",
  answerability: "high",
  confidence: "high",
  evidence: [
    {
      id: "chatgpt-enterprise-pilot",
      claim:
        "Daniel launched the first ChatGPT Enterprise pilot and delivered ~$2.7M annualized impact.",
      supportingDetails: ["Six-month matched-control pilot."],
      project: "ChatGPT Enterprise",
      capabilityTags: ["applied_ai", "enablement"],
      metricTags: ["roi"],
      metrics: [
        {
          label: "Annualized impact",
          value: "$2.7M",
          context: "Matched-control pilot",
        },
      ],
      sourceAudit: {
        status: "verified",
        sourceType: "exec_readout",
        lastReviewedAt: "2026-06-11",
      },
      visibility: "public_safe",
      recommendedUse: "Use as ROI evidence for ChatGPT Enterprise.",
    },
  ],
};

const EMPTY_EVIDENCE: EvidenceSearchResponse = {
  query: "ChatGPT Enterprise pilot impact",
  answerability: "none",
  confidence: "low",
  evidence: [],
};

type FakeBehavior = {
  /** Whether the first model call emits a searchCareerEvidence tool call. */
  firstCallsTool: boolean;
  /** When true, the second (synthesis) call rejects, exercising recovery. */
  secondCallThrows?: boolean;
  answerText?: string;
};

/** Minimal stand-in for the OpenAI Responses client used by the service. */
function makeFakeClient(behavior: FakeBehavior): OpenAI {
  let calls = 0;
  return {
    responses: {
      create: async () => {
        calls += 1;
        if (calls === 1) {
          return behavior.firstCallsTool
            ? {
                output: [
                  {
                    type: "function_call",
                    call_id: "call_1",
                    name: "searchCareerEvidence",
                    arguments: JSON.stringify({
                      query: "ChatGPT Enterprise pilot impact",
                    }),
                  },
                ],
              }
            : {
                output_text: JSON.stringify({
                  answer: behavior.answerText ?? "Page-grounded answer.",
                }),
              };
        }

        if (calls === 2 && behavior.secondCallThrows) {
          throw new Error("synthesis call failed");
        }

        return {
          output_text: JSON.stringify({
            answer: behavior.answerText ?? "Page-grounded answer.",
          }),
        };
      },
    },
  } as unknown as OpenAI;
}

function jsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

async function withFetch<T>(
  fetchImpl: typeof global.fetch,
  fn: () => Promise<T>,
): Promise<T> {
  const original = global.fetch;
  global.fetch = fetchImpl;
  try {
    return await fn();
  } finally {
    global.fetch = original;
  }
}

// ── 1. Page-only answer works ──────────────────────────────────────────────────

test("page-only answer works when evidence layer is not configured", async () => {
  const result = await generatePortfolioGuideResponse(createRequest(), {
    apiKey: "openai-key",
    model: "gpt-test",
    client: makeFakeClient({ firstCallsTool: false }),
    // No evidenceConfig — deeper evidence is disabled.
  });

  assert.equal(result.response.answer.length > 0, true);
  assert.equal(result.response.evidenceMeta?.pageContextUsed, true);
  assert.equal(result.response.evidenceMeta?.resumeCustomizerEvidenceUsed, false);
  assert.equal(
    result.response.evidenceMeta?.evidenceUnavailableReason,
    "not_configured",
  );
});

test("page-only answer works when the model does not call the evidence tool", async () => {
  const result = await generatePortfolioGuideResponse(createRequest(), {
    apiKey: "openai-key",
    model: "gpt-test",
    client: makeFakeClient({ firstCallsTool: false }),
    evidenceConfig: EVIDENCE_CONFIG,
  });

  assert.equal(result.response.answer.length > 0, true);
  assert.equal(result.response.evidenceMeta?.pageContextUsed, true);
  assert.equal(result.response.evidenceMeta?.resumeCustomizerEvidenceUsed, false);
  // The model chose not to request deeper evidence — not an error.
  assert.equal(
    result.response.evidenceMeta?.evidenceUnavailableReason,
    undefined,
  );
});

// ── 2. Evidence answer works when mock evidence is returned ─────────────────────

test("evidence answer is used when ResumeCustomizer returns mock evidence", async () => {
  const result = await withFetch(
    async () => jsonResponse(SAMPLE_EVIDENCE),
    () =>
      generatePortfolioGuideResponse(createRequest(), {
        apiKey: "openai-key",
        model: "gpt-test",
        client: makeFakeClient({ firstCallsTool: true }),
        evidenceConfig: EVIDENCE_CONFIG,
      }),
  );

  assert.equal(result.response.evidenceMeta?.resumeCustomizerEvidenceUsed, true);
  assert.equal(result.response.evidenceMeta?.evidenceUnavailableReason, undefined);
  assert.equal(result.response.evidenceUsed?.[0]?.project, "ChatGPT Enterprise");
  assert.equal(result.response.evidenceUsed?.[0]?.hasMetrics, true);
});

// ── 3. API unavailable returns a graceful fallback, not a crash ─────────────────

test("ResumeCustomizer network failure degrades to page context, never throws", async () => {
  const result = await withFetch(
    async () => {
      throw new Error("ECONNREFUSED");
    },
    () =>
      generatePortfolioGuideResponse(createRequest(), {
        apiKey: "openai-key",
        model: "gpt-test",
        client: makeFakeClient({ firstCallsTool: true }),
        evidenceConfig: EVIDENCE_CONFIG,
      }),
  );

  assert.equal(result.response.answer.length > 0, true);
  assert.equal(result.response.evidenceMeta?.resumeCustomizerEvidenceUsed, false);
  assert.equal(
    result.response.evidenceMeta?.evidenceUnavailableReason,
    "network_error",
  );
  assert.ok(
    result.response.evidenceMeta?.warnings?.some((w) =>
      w.includes("network_error"),
    ),
  );
});

// ── 4. Malformed / unexpected evidence responses still return a safe answer ─────

test("malformed JSON body from ResumeCustomizer returns a safe answer", async () => {
  const result = await withFetch(
    async () =>
      new Response("definitely not json {", {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    () =>
      generatePortfolioGuideResponse(createRequest(), {
        apiKey: "openai-key",
        model: "gpt-test",
        client: makeFakeClient({ firstCallsTool: true }),
        evidenceConfig: EVIDENCE_CONFIG,
      }),
  );

  assert.equal(result.response.answer.length > 0, true);
  assert.equal(
    result.response.evidenceMeta?.evidenceUnavailableReason,
    "invalid_json",
  );
});

test("unexpected response shape (the original crash) returns a safe answer", async () => {
  // Valid JSON, wrong contract: no `evidence` array. Previously this crashed
  // the route via `safeResult.evidence.length` on undefined.
  const result = await withFetch(
    async () => jsonResponse({ results: [], status: "ok" }),
    () =>
      generatePortfolioGuideResponse(createRequest(), {
        apiKey: "openai-key",
        model: "gpt-test",
        client: makeFakeClient({ firstCallsTool: true }),
        evidenceConfig: EVIDENCE_CONFIG,
      }),
  );

  assert.equal(result.response.answer.length > 0, true);
  assert.equal(result.response.evidenceMeta?.resumeCustomizerEvidenceUsed, false);
  assert.equal(
    result.response.evidenceMeta?.evidenceUnavailableReason,
    "invalid_shape",
  );
});

test("synthesis call failure recovers with a page-context answer", async () => {
  const result = await withFetch(
    async () => jsonResponse(SAMPLE_EVIDENCE),
    () =>
      generatePortfolioGuideResponse(createRequest(), {
        apiKey: "openai-key",
        model: "gpt-test",
        client: makeFakeClient({ firstCallsTool: true, secondCallThrows: true }),
        evidenceConfig: EVIDENCE_CONFIG,
      }),
  );

  assert.equal(result.response.answer.length > 0, true);
  assert.equal(result.response.evidenceMeta?.resumeCustomizerEvidenceUsed, false);
  assert.equal(
    result.response.evidenceMeta?.evidenceUnavailableReason,
    "evidence_layer_error",
  );
});

// ── Reasoning-model contract: replay reasoning items in the synthesis call ──────

test("synthesis call replays the model's reasoning items alongside the tool call", async () => {
  // Reasoning models (gpt-5 + reasoning.effort) emit a `reasoning` item next to
  // the `function_call`. The Responses API rejects a replayed function_call that
  // is missing its sibling reasoning item, so the second call must echo the full
  // first-turn output, not just the function_call items.
  const capturedInputs: Array<Array<{ type?: string }>> = [];
  let calls = 0;
  const client = {
    responses: {
      create: async (params: { input: Array<{ type?: string }> }) => {
        calls += 1;
        capturedInputs.push(params.input);
        if (calls === 1) {
          return {
            output: [
              { type: "reasoning", id: "rs_1", summary: [] },
              {
                type: "function_call",
                id: "fc_1",
                call_id: "call_1",
                name: "searchCareerEvidence",
                arguments: JSON.stringify({ query: "pilot impact" }),
              },
            ],
          };
        }
        return { output_text: JSON.stringify({ answer: "Synthesized." }) };
      },
    },
  } as unknown as OpenAI;

  const result = await withFetch(
    async () => jsonResponse(SAMPLE_EVIDENCE),
    () =>
      generatePortfolioGuideResponse(createRequest(), {
        apiKey: "openai-key",
        model: "gpt-test",
        client,
        evidenceConfig: EVIDENCE_CONFIG,
      }),
  );

  assert.equal(result.response.evidenceMeta?.resumeCustomizerEvidenceUsed, true);
  const secondInput = capturedInputs[1] ?? [];
  assert.ok(
    secondInput.some((item) => item?.type === "reasoning"),
    "reasoning item must be replayed in the synthesis call",
  );
  assert.ok(
    secondInput.some((item) => item?.type === "function_call"),
    "function_call must be replayed in the synthesis call",
  );
  assert.ok(
    secondInput.some((item) => item?.type === "function_call_output"),
    "tool output must be appended to the synthesis call",
  );
});

// ── 5. No relevant evidence found ───────────────────────────────────────────────

test("empty evidence yields a clear not-found-in-evidence note", async () => {
  const result = await withFetch(
    async () => jsonResponse(EMPTY_EVIDENCE),
    () =>
      generatePortfolioGuideResponse(createRequest(), {
        apiKey: "openai-key",
        model: "gpt-test",
        client: makeFakeClient({ firstCallsTool: true }),
        evidenceConfig: EVIDENCE_CONFIG,
      }),
  );

  assert.equal(result.response.answer.length > 0, true);
  assert.equal(result.response.evidenceMeta?.resumeCustomizerEvidenceUsed, false);
  assert.equal(
    result.response.evidenceMeta?.evidenceUnavailableReason,
    "no_evidence_found",
  );
});

// ── 6. The exact reported prompt does not crash ─────────────────────────────────

test("the exact ChatGPT Enterprise prompt never crashes the response path", async () => {
  // Drive the worst case: tool is called and ResumeCustomizer returns garbage.
  await assert.doesNotReject(() =>
    withFetch(
      async () => jsonResponse({ unexpected: true }),
      () =>
        generatePortfolioGuideResponse(
          createRequest(CHATGPT_ENTERPRISE_PROMPT),
          {
            apiKey: "openai-key",
            model: "gpt-test",
            client: makeFakeClient({ firstCallsTool: true }),
            evidenceConfig: EVIDENCE_CONFIG,
          },
        ),
    ),
  );
});
