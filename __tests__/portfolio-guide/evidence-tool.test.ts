/**
 * Tests for the Claim-to-Evidence tool integration.
 *
 * Tests callEvidenceTool HTTP behavior and the chatbot's evidence-aware
 * response path via the handlePortfolioGuideRequest DI pattern.
 */

import assert from "node:assert/strict";
import test from "node:test";
import { callEvidenceTool } from "@/lib/portfolio-guide/tools/evidence";
import { handlePortfolioGuideRequest } from "@/lib/portfolio-guide/http";
import type { CopilotRequest } from "@/lib/portfolio-guide/types";
import type { EvidenceSearchResponse } from "@/lib/portfolio-guide/tools/evidence";

function createRequest(message = "Does Daniel have experience with agentic AI?"): CopilotRequest {
  return {
    message,
    pageContext: {
      slug: "ai-platform-mcp",
      href: "/work/ai-platform-mcp",
      title: "From AI experiments to platform foundations",
    },
    portfolioContext: {},
    sessionContext: {
      visitedPages: ["ai-platform-mcp"],
      clickedPrompts: [],
      askedQuestions: [message],
      inferredInterestTags: ["ai-builder"],
    },
    interactionMeta: {
      source: "input",
      visitorId: "visitor_123",
      sessionId: "session_123",
      turnIndex: 1,
    },
  };
}

const SAMPLE_EVIDENCE_RESPONSE: EvidenceSearchResponse = {
  query: "agentic AI experience",
  answerability: "high",
  confidence: "high",
  evidence: [
    {
      id: "ai-product-leadership-prototype-scale",
      claim: "Daniel has principal pm-level experience at Guitar Center AI product leadership.",
      supportingDetails: ["Capabilities: applied ai, agentic ai."],
      project: "Guitar Center AI product leadership",
      capabilityTags: ["applied_ai", "agentic_ai"],
      metricTags: ["AI products"],
      metrics: [{ label: "177 weekly users", value: "177", context: "Contact Center pilot" }],
      sourceAudit: { status: "verified", sourceType: "internal_record", lastReviewedAt: "2026-06-11" },
      visibility: "public_safe",
      recommendedUse: "Use as evidence for applied ai, agentic ai.",
    },
  ],
  relatedCapabilities: ["applied ai", "agentic ai"],
  suggestedPortfolioAngle: "Emphasize grounded AI execution with concrete proof points.",
};

const EMPTY_EVIDENCE_RESPONSE: EvidenceSearchResponse = {
  query: "real estate property management",
  answerability: "none",
  confidence: "low",
  evidence: [],
  safeFallback: "I do not have enough source-audited public evidence to answer that confidently.",
};

// ── callEvidenceTool ──────────────────────────────────────────────────────────

test("callEvidenceTool sends Authorization header with API key", async () => {
  let capturedHeaders: Record<string, string> = {};

  const originalFetch = global.fetch;
  global.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    capturedHeaders = Object.fromEntries(
      new Headers(init?.headers as HeadersInit).entries(),
    );
    return new Response(JSON.stringify(SAMPLE_EVIDENCE_RESPONSE), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };

  try {
    await callEvidenceTool(
      { query: "agentic AI", currentPortfolioPage: "ai-platform-mcp" },
      { apiUrl: "http://localhost:3001", apiKey: "test-secret-key" },
    );
  } finally {
    global.fetch = originalFetch;
  }

  assert.equal(
    capturedHeaders["authorization"],
    "Bearer test-secret-key",
    "Should include Bearer token in Authorization header",
  );
});

test("callEvidenceTool calls the correct endpoint URL", async () => {
  let capturedUrl = "";

  const originalFetch = global.fetch;
  global.fetch = async (input: RequestInfo | URL) => {
    capturedUrl = input.toString();
    return new Response(JSON.stringify(SAMPLE_EVIDENCE_RESPONSE), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };

  try {
    await callEvidenceTool(
      { query: "AI evals" },
      { apiUrl: "https://resume-customizer.example.com", apiKey: "key" },
    );
  } finally {
    global.fetch = originalFetch;
  }

  assert.equal(
    capturedUrl,
    "https://resume-customizer.example.com/api/evidence/search",
  );
});

test("callEvidenceTool reports network_error on fetch failure", async () => {
  const originalFetch = global.fetch;
  global.fetch = async () => {
    throw new Error("Network error");
  };

  try {
    const result = await callEvidenceTool(
      { query: "AI product experience" },
      { apiUrl: "http://localhost:3001", apiKey: "key" },
    );
    assert.deepEqual(result, { ok: false, reason: "network_error" });
  } finally {
    global.fetch = originalFetch;
  }
});

test("callEvidenceTool reports http_error on non-200 response", async () => {
  const originalFetch = global.fetch;
  global.fetch = async () => {
    return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 });
  };

  try {
    const result = await callEvidenceTool(
      { query: "AI product experience" },
      { apiUrl: "http://localhost:3001", apiKey: "bad-key" },
    );
    assert.equal(result.ok, false);
    assert.equal(result.ok === false && result.reason, "http_error");
    assert.equal(result.ok === false && result.status, 401);
  } finally {
    global.fetch = originalFetch;
  }
});

test("callEvidenceTool reports invalid_json on unreadable body", async () => {
  const originalFetch = global.fetch;
  global.fetch = async () =>
    new Response("not json at all {", {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  try {
    const result = await callEvidenceTool(
      { query: "AI product experience" },
      { apiUrl: "http://localhost:3001", apiKey: "key" },
    );
    assert.deepEqual(result, { ok: false, reason: "invalid_json" });
  } finally {
    global.fetch = originalFetch;
  }
});

test("callEvidenceTool reports invalid_shape when evidence array is missing", async () => {
  const originalFetch = global.fetch;
  // Valid JSON, but not the expected contract (no `evidence` array).
  global.fetch = async () =>
    new Response(JSON.stringify({ results: [], status: "ok" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  try {
    const result = await callEvidenceTool(
      { query: "AI product experience" },
      { apiUrl: "http://localhost:3001", apiKey: "key" },
    );
    assert.deepEqual(result, { ok: false, reason: "invalid_shape" });
  } finally {
    global.fetch = originalFetch;
  }
});

test("callEvidenceTool returns normalized data on a valid response", async () => {
  const originalFetch = global.fetch;
  global.fetch = async () =>
    new Response(JSON.stringify(SAMPLE_EVIDENCE_RESPONSE), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  try {
    const result = await callEvidenceTool(
      { query: "agentic AI" },
      { apiUrl: "http://localhost:3001", apiKey: "key" },
    );
    assert.equal(result.ok, true);
    assert.equal(
      result.ok === true && result.data.evidence[0]?.project,
      "Guitar Center AI product leadership",
    );
  } finally {
    global.fetch = originalFetch;
  }
});

test("callEvidenceTool defensively normalizes a partial evidence item", async () => {
  const originalFetch = global.fetch;
  // 200 with the expected `evidence` array but items missing metrics/tags.
  global.fetch = async () =>
    new Response(
      JSON.stringify({
        query: "x",
        evidence: [{ id: "partial", claim: "A claim with no metrics." }],
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );

  try {
    const result = await callEvidenceTool(
      { query: "x" },
      { apiUrl: "http://localhost:3001", apiKey: "key" },
    );
    assert.equal(result.ok, true);
    const item = result.ok === true ? result.data.evidence[0] : undefined;
    // Missing fields are filled with safe defaults so downstream `.length`
    // reads can never throw.
    assert.deepEqual(item?.metrics, []);
    assert.deepEqual(item?.capabilityTags, []);
    assert.equal(item?.sourceAudit.status, "unverified");
  } finally {
    global.fetch = originalFetch;
  }
});

test("callEvidenceTool applies conservative filters by default", async () => {
  let capturedBody: Record<string, unknown> = {};

  const originalFetch = global.fetch;
  global.fetch = async (_input: RequestInfo | URL, init?: RequestInit) => {
    capturedBody = JSON.parse(init?.body as string) as Record<string, unknown>;
    return new Response(JSON.stringify(SAMPLE_EVIDENCE_RESPONSE), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };

  try {
    await callEvidenceTool(
      { query: "AI evals" },
      { apiUrl: "http://localhost:3001", apiKey: "key" },
    );
  } finally {
    global.fetch = originalFetch;
  }

  const filters = capturedBody.filters as Record<string, unknown>;
  assert.equal(filters.publicSafeOnly, true, "Should default to publicSafeOnly: true");
  assert.equal(filters.sourceAuditedOnly, true, "Should default to sourceAuditedOnly: true");
});

// ── API key never reaches client ──────────────────────────────────────────────

test("evidence API key is not present in handlePortfolioGuideRequest response body", async () => {
  const result = await handlePortfolioGuideRequest(createRequest(), {
    logger: { start: async () => undefined, finish: async () => undefined },
    getApiKey: () => "openai-key",
    getModel: () => "gpt-5",
    createRequestId: () => "req_evidence_1",
    now: () => 100,
    logWarning: () => undefined,
    logError: () => undefined,
    getEvidenceApiUrl: () => "http://localhost:3001",
    getEvidenceApiKey: () => "super-secret-evidence-key",
    generateResponse: async () => ({
      promptInput: "{}",
      rawText: '{"answer":"Daniel has strong AI experience."}',
      relatedPages: [],
      response: { answer: "Daniel has strong AI experience." },
      normalizationStatus: "normalized-json",
      provider: { label: "openai", model: "gpt-5" },
    }),
    buildPromptContext: () => ({}) as never,
  });

  assert.equal(result.status, 200);
  const bodyStr = JSON.stringify(result.body);
  assert.equal(
    bodyStr.includes("super-secret-evidence-key"),
    false,
    "Evidence API key must never appear in the response body",
  );
});

// ── Graceful degradation ──────────────────────────────────────────────────────

test("handler degrades gracefully when evidence config is absent", async () => {
  const result = await handlePortfolioGuideRequest(createRequest(), {
    logger: { start: async () => undefined, finish: async () => undefined },
    getApiKey: () => "openai-key",
    getModel: () => "gpt-5",
    createRequestId: () => "req_no_evidence",
    now: () => 100,
    logWarning: () => undefined,
    logError: () => undefined,
    // No getEvidenceApiUrl / getEvidenceApiKey — evidence tool disabled
    generateResponse: async () => ({
      promptInput: "{}",
      rawText: '{"answer":"Portfolio content answer"}',
      relatedPages: [],
      response: { answer: "Portfolio content answer" },
      normalizationStatus: "normalized-json",
      provider: { label: "openai", model: "gpt-5" },
    }),
    buildPromptContext: () => ({}) as never,
  });

  assert.equal(result.status, 200);
  assert.equal((result.body as { answer: string }).answer, "Portfolio content answer");
});

test("handler passes evidence config to generateResponse when both vars are set", async () => {
  let capturedEvidenceConfig: unknown;

  await handlePortfolioGuideRequest(createRequest(), {
    logger: { start: async () => undefined, finish: async () => undefined },
    getApiKey: () => "openai-key",
    getModel: () => "gpt-5",
    createRequestId: () => "req_with_evidence",
    now: () => 100,
    logWarning: () => undefined,
    logError: () => undefined,
    getEvidenceApiUrl: () => "https://resume-customizer.example.com",
    getEvidenceApiKey: () => "test-evidence-key",
    generateResponse: async (_request, config) => {
      capturedEvidenceConfig = config.evidenceConfig;
      return {
        promptInput: "{}",
        rawText: '{"answer":"Evidence-backed answer"}',
        relatedPages: [],
        response: { answer: "Evidence-backed answer" },
        normalizationStatus: "normalized-json",
        provider: { label: "openai", model: "gpt-5" },
      };
    },
    buildPromptContext: () => ({}) as never,
  });

  assert.deepEqual(capturedEvidenceConfig, {
    apiUrl: "https://resume-customizer.example.com",
    apiKey: "test-evidence-key",
  });
});

test("handler does not pass evidence config when only URL is set", async () => {
  let capturedEvidenceConfig: unknown = "not-set";

  await handlePortfolioGuideRequest(createRequest(), {
    logger: { start: async () => undefined, finish: async () => undefined },
    getApiKey: () => "openai-key",
    getModel: () => "gpt-5",
    createRequestId: () => "req_url_only",
    now: () => 100,
    logWarning: () => undefined,
    logError: () => undefined,
    getEvidenceApiUrl: () => "https://resume-customizer.example.com",
    getEvidenceApiKey: () => undefined, // Key missing
    generateResponse: async (_request, config) => {
      capturedEvidenceConfig = config.evidenceConfig;
      return {
        promptInput: "{}",
        rawText: '{"answer":"No evidence config"}',
        relatedPages: [],
        response: { answer: "No evidence config" },
        normalizationStatus: "normalized-json",
        provider: { label: "openai", model: "gpt-5" },
      };
    },
    buildPromptContext: () => ({}) as never,
  });

  assert.equal(
    capturedEvidenceConfig,
    undefined,
    "Should not pass evidence config when key is missing",
  );
});

// ── Evidence items in response ────────────────────────────────────────────────

test("evidenceUsed in generateResponse result is passed through to response body", async () => {
  const result = await handlePortfolioGuideRequest(createRequest(), {
    logger: { start: async () => undefined, finish: async () => undefined },
    getApiKey: () => "openai-key",
    getModel: () => "gpt-5",
    createRequestId: () => "req_evidence_body",
    now: () => 100,
    logWarning: () => undefined,
    logError: () => undefined,
    generateResponse: async () => ({
      promptInput: "{}",
      rawText: '{"answer":"Evidence-based answer"}',
      relatedPages: [],
      response: {
        answer: "Evidence-based answer",
        evidenceUsed: [
          {
            project: "Guitar Center AI product leadership",
            claim: "Daniel has principal pm-level experience.",
            capabilityTags: ["applied_ai"],
            hasMetrics: true,
          },
        ],
      },
      normalizationStatus: "normalized-json",
      provider: { label: "openai", model: "gpt-5" },
    }),
    buildPromptContext: () => ({}) as never,
  });

  assert.equal(result.status, 200);
  const body = result.body as {
    answer: string;
    evidenceUsed?: Array<{ project: string }>;
  };
  assert.ok(Array.isArray(body.evidenceUsed), "evidenceUsed should be in response body");
  assert.equal(body.evidenceUsed?.[0]?.project, "Guitar Center AI product leadership");
});
