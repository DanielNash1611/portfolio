/**
 * Tests for the local mock evidence provider and its production-safe gating.
 */

import assert from "node:assert/strict";
import test from "node:test";
import type OpenAI from "openai";
import {
  isEvidenceMockEnabled,
  resolveEvidenceMockScenario,
  runMockEvidence,
} from "@/lib/portfolio-guide/tools/mockEvidence";
import { generatePortfolioGuideResponse } from "@/lib/portfolio-guide/service";
import type { CopilotRequest } from "@/lib/portfolio-guide/types";

function withEnv<T>(
  vars: Record<string, string | undefined>,
  fn: () => T,
): T {
  const previous: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(vars)) {
    previous[key] = process.env[key];
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
  try {
    return fn();
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  }
}

// ── Gating ──────────────────────────────────────────────────────────────────

test("mock is disabled by default", () => {
  withEnv(
    { NODE_ENV: "development", PORTFOLIO_GUIDE_EVIDENCE_ENABLE_MOCK: undefined },
    () => assert.equal(isEvidenceMockEnabled(), false),
  );
});

test("mock can be enabled in non-production", () => {
  withEnv(
    { NODE_ENV: "development", PORTFOLIO_GUIDE_EVIDENCE_ENABLE_MOCK: "true" },
    () => assert.equal(isEvidenceMockEnabled(), true),
  );
});

test("mock is force-disabled in production even with the flag set", () => {
  withEnv(
    { NODE_ENV: "production", PORTFOLIO_GUIDE_EVIDENCE_ENABLE_MOCK: "true" },
    () => assert.equal(isEvidenceMockEnabled(), false),
  );
});

// ── Scenario resolution ───────────────────────────────────────────────────────

test("scenario tokens in the message select a fallback branch", () => {
  assert.equal(resolveEvidenceMockScenario("tell me X FORCE_EVIDENCE_EMPTY"), "empty");
  assert.equal(
    resolveEvidenceMockScenario("FORCE_EVIDENCE_TIMEOUT please"),
    "timeout",
  );
  assert.equal(
    resolveEvidenceMockScenario("FORCE_EVIDENCE_MALFORMED"),
    "invalid_shape",
  );
});

test("scenario falls back to env then to the happy path", () => {
  withEnv({ PORTFOLIO_GUIDE_EVIDENCE_MOCK_SCENARIO: "http_error" }, () => {
    assert.equal(resolveEvidenceMockScenario("no token here"), "http_error");
  });
  withEnv({ PORTFOLIO_GUIDE_EVIDENCE_MOCK_SCENARIO: undefined }, () => {
    assert.equal(resolveEvidenceMockScenario("no token here"), "evidence");
  });
});

// ── runMockEvidence result mapping ─────────────────────────────────────────────

test("default mock scenario returns source-audited evidence", async () => {
  const result = await runMockEvidence({ query: "pilot impact" });
  assert.equal(result.ok, true);
  assert.equal(result.ok === true && result.data.evidence.length > 0, true);
});

test("each scenario maps to the right fetch result", async () => {
  assert.deepEqual(
    await runMockEvidence({ query: "q", scenario: "invalid_shape" }),
    { ok: false, reason: "invalid_shape" },
  );
  assert.deepEqual(await runMockEvidence({ query: "q", scenario: "http_error" }), {
    ok: false,
    reason: "http_error",
    status: 503,
  });
  assert.deepEqual(
    await runMockEvidence({ query: "q", scenario: "network_error" }),
    { ok: false, reason: "network_error" },
  );
  assert.deepEqual(await runMockEvidence({ query: "q", scenario: "timeout" }), {
    ok: false,
    reason: "timeout",
  });
  const empty = await runMockEvidence({ query: "q", scenario: "empty" });
  assert.equal(empty.ok === true && empty.data.evidence.length, 0);
});

// ── Service path with evidenceMock (no real config needed) ──────────────────────

function createRequest(message: string): CopilotRequest {
  return {
    message,
    pageContext: {
      slug: "chatgpt-enterprise",
      href: "/work/chatgpt-enterprise",
      title: "Scaling ChatGPT Enterprise across the org",
    },
    portfolioContext: {},
    sessionContext: {
      visitedPages: ["chatgpt-enterprise"],
      clickedPrompts: [],
      askedQuestions: [message],
      inferredInterestTags: [],
    },
  };
}

function makeToolCallingClient(): OpenAI {
  let calls = 0;
  return {
    responses: {
      create: async () => {
        calls += 1;
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
        return { output_text: JSON.stringify({ answer: "Synthesized answer." }) };
      },
    },
  } as unknown as OpenAI;
}

test("evidenceMock enables the tool without any real ResumeCustomizer config", async () => {
  const result = await generatePortfolioGuideResponse(
    createRequest("what supports the pilot impact claim?"),
    {
      apiKey: "openai-key",
      model: "gpt-test",
      client: makeToolCallingClient(),
      evidenceMock: true,
      // no evidenceConfig
    },
  );

  assert.equal(result.response.evidenceMeta?.resumeCustomizerEvidenceUsed, true);
  assert.equal(result.response.evidenceUsed?.[0]?.project, "ChatGPT Enterprise pilot");
});

test("evidenceMock honors a FORCE_EVIDENCE token for fallback testing", async () => {
  const result = await generatePortfolioGuideResponse(
    createRequest("what supports the pilot impact claim? FORCE_EVIDENCE_TIMEOUT"),
    {
      apiKey: "openai-key",
      model: "gpt-test",
      client: makeToolCallingClient(),
      evidenceMock: true,
    },
  );

  assert.equal(result.response.evidenceMeta?.resumeCustomizerEvidenceUsed, false);
  assert.equal(result.response.evidenceMeta?.evidenceUnavailableReason, "timeout");
});
