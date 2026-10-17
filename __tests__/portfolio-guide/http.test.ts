import assert from "node:assert/strict";
import test from "node:test";
import { handlePortfolioGuideRequest } from "@/lib/portfolio-guide/http";
import type { CopilotRequest } from "@/lib/portfolio-guide/types";
import type OpenAI from "openai";
import { isRemoteCareerEvidenceEnabled } from "@/lib/portfolio-guide/evidence-config";
import { getResumeEngineConfig } from "@/lib/resume-generator/config";
import { generatePortfolioGuideResponse } from "@/lib/portfolio-guide/service";

test("remote career evidence requires explicit opt-in independently of resume configuration", () => {
  for (const value of [undefined, "", "false", "1", "yes"]) {
    assert.equal(
      isRemoteCareerEvidenceEnabled({
        NODE_ENV: "test",
        PORTFOLIO_GUIDE_CAREER_EVIDENCE_ENABLED: value,
        RESUME_CUSTOMIZER_API_BASE_URL: "https://resume.test",
        RESUME_CUSTOMIZER_API_TOKEN: "synthetic-token",
      }),
      false,
    );
  }
  assert.equal(
    isRemoteCareerEvidenceEnabled({
      NODE_ENV: "test",
      PORTFOLIO_GUIDE_CAREER_EVIDENCE_ENABLED: " TRUE ",
    }),
    true,
  );
});

test("page-only guide never calls optional evidence search while resume jobs retain their connection", async () => {
  const keys = [
    "RESUME_CUSTOMIZER_API_BASE_URL",
    "RESUME_CUSTOMIZER_API_TOKEN",
    "PORTFOLIO_GUIDE_CAREER_EVIDENCE_ENABLED",
  ];
  const original = keys.map((key) => process.env[key]);
  const originalFetch = global.fetch;
  try {
    process.env.RESUME_CUSTOMIZER_API_BASE_URL = "https://resume.test";
    process.env.RESUME_CUSTOMIZER_API_TOKEN = "synthetic-token";
    delete process.env.PORTFOLIO_GUIDE_CAREER_EVIDENCE_ENABLED;
    global.fetch = async () => {
      throw new Error("No remote endpoint may be called");
    };
    const result = await handlePortfolioGuideRequest(createRequest(), {
      logger: { start: async () => undefined, finish: async () => undefined },
      getApiKey: () => "synthetic-key",
      getModel: () => "gpt-5.6-terra",
      getDecisionsEnabled: () => false,
      getEvidenceMockEnabled: () => false,
      generateResponse: async (request, config) => {
        assert.equal(config.evidenceConfig, undefined);
        return generatePortfolioGuideResponse(request, {
          ...config,
          client: {
            responses: {
              create: async (params: { tools?: unknown[] }) => {
                assert.equal(
                  Boolean(
                    params.tools?.some(
                      (tool) =>
                        (tool as { name?: string }).name ===
                        "searchCareerEvidence",
                    ),
                  ),
                  false,
                );
                return {
                  output_text: JSON.stringify({
                    answer: "The page describes Daniel's prototype leadership.",
                    relatedPages: [],
                  }),
                };
              },
            },
          } as unknown as OpenAI,
        });
      },
    });
    assert.equal(result.status, 200);
    assert.match(
      (result.body as { answer: string }).answer,
      /prototype leadership/,
    );
    assert.equal(
      (result.body as { evidenceUsed?: unknown }).evidenceUsed,
      undefined,
    );
    assert.deepEqual(getResumeEngineConfig(), {
      baseUrl: "https://resume.test",
      token: "synthetic-token",
      configured: true,
      mockMode: false,
    });
  } finally {
    keys.forEach((key, index) => {
      if (original[index] === undefined) delete process.env[key];
      else process.env[key] = original[index];
    });
    global.fetch = originalFetch;
  }
});

test("explicit endpoint opt-in passes the existing connection configuration", async () => {
  let received = false;
  const result = await handlePortfolioGuideRequest(createRequest(), {
    logger: { start: async () => undefined, finish: async () => undefined },
    getApiKey: () => "synthetic-key",
    getEvidenceEnabled: () => true,
    getEvidenceApiUrl: () => "https://resume.test",
    getEvidenceApiKey: () => "synthetic-token",
    generateResponse: async (_request, config) => {
      assert.deepEqual(config.evidenceConfig, {
        apiUrl: "https://resume.test",
        apiKey: "synthetic-token",
      });
      received = true;
      return {
        promptInput: "{}",
        rawText: "Page answer",
        relatedPages: [],
        response: { answer: "Page answer", relatedPages: [] },
        normalizationStatus: "raw-fallback",
        provider: { label: "openai", model: config.model ?? "gpt-5.6-terra" },
      };
    },
  });
  assert.equal(result.status, 200);
  assert.equal(received, true);
});

function createRequest(): CopilotRequest {
  return {
    message: "What did Daniel own here?",
    pageContext: {
      slug: "ai-platform-mcp",
      href: "/work/ai-platform-mcp",
      title: "From AI experiments to platform foundations",
    },
    portfolioContext: {},
    sessionContext: {
      visitedPages: ["ai-platform-mcp"],
      clickedPrompts: [],
      askedQuestions: ["What did Daniel own here?"],
      inferredInterestTags: ["platform"],
    },
    interactionMeta: {
      source: "input",
      visitorId: "visitor_123",
      sessionId: "session_123",
      turnIndex: 1,
    },
  };
}

test("portfolio guide handler returns a grounded answer and logs completion", async () => {
  const loggerCalls = {
    start: [] as unknown[],
    finish: [] as unknown[],
  };
  const logWarnings: unknown[][] = [];

  const result = await handlePortfolioGuideRequest(createRequest(), {
    logger: {
      start: async (input) => {
        loggerCalls.start.push(input);
      },
      finish: async (input) => {
        loggerCalls.finish.push(input);
      },
    },
    getApiKey: () => "test-key",
    getModel: () => "gpt-5",
    createRequestId: () => "req_1",
    now: (() => {
      let callCount = 0;
      return () => {
        callCount += 1;
        return callCount === 1 ? 100 : 275;
      };
    })(),
    logWarning: (...args: unknown[]) => {
      logWarnings.push(args);
    },
    logError: () => {
      throw new Error("logError should not be called");
    },
    generateResponse: async () => ({
      promptInput: "{}",
      rawText: '{"answer":"Grounded answer"}',
      relatedPages: [],
      response: {
        answer: "Grounded answer",
        relatedPages: [],
      },
      normalizationStatus: "normalized-json",
      provider: {
        label: "openai",
        model: "gpt-5",
      },
    }),
    buildPromptContext: () =>
      ({ currentQuestion: "What did Daniel own here?" }) as never,
  });

  assert.equal(result.status, 200);
  assert.equal((result.body as { answer: string }).answer, "Grounded answer");
  assert.equal(loggerCalls.start.length, 1);
  assert.deepEqual(loggerCalls.finish, [
    {
      requestId: "req_1",
      model: "gpt-5",
      status: "answered",
      latencyMs: 175,
      answerLength: 15,
      answer: "Grounded answer",
      promptSnapshot: {
        pageTitle: "From AI experiments to platform foundations",
        context: {},
      },
      responsePayload: {
        answer: "Grounded answer",
        relatedPages: [],
      },
      responseIds: undefined,
      usage: undefined,
      normalizationStatus: "normalized-json",
      evidenceMetadata: undefined,
      traceEvents: undefined,
    },
  ]);
  assert.equal(logWarnings.length, 0);
});

test("portfolio guide handler logs unavailable requests when the API key is missing", async () => {
  const loggerCalls = {
    start: [] as unknown[],
    finish: [] as unknown[],
  };

  const result = await handlePortfolioGuideRequest(createRequest(), {
    logger: {
      start: async (input) => {
        loggerCalls.start.push(input);
      },
      finish: async (input) => {
        loggerCalls.finish.push(input);
      },
    },
    getApiKey: () => undefined,
    getModel: () => "gpt-5",
    createRequestId: () => "req_2",
    now: () => 100,
    logWarning: () => undefined,
    logError: () => undefined,
    generateResponse: async () => {
      throw new Error("generateResponse should not be called");
    },
    buildPromptContext: () => ({}) as never,
  });

  assert.equal(result.status, 503);
  assert.deepEqual(loggerCalls.finish, [
    {
      requestId: "req_2",
      model: "gpt-5",
      status: "unavailable",
      errorCode: "missing_api_key",
    },
  ]);
});

test("portfolio guide handler stays available when logging fails", async () => {
  const warnings: unknown[][] = [];

  const result = await handlePortfolioGuideRequest(createRequest(), {
    logger: {
      start: async () => {
        throw new Error("db offline");
      },
      finish: async () => undefined,
    },
    getApiKey: () => "test-key",
    getModel: () => "gpt-5",
    createRequestId: () => "req_3",
    now: (() => {
      let callCount = 0;
      return () => {
        callCount += 1;
        return callCount === 1 ? 10 : 40;
      };
    })(),
    logWarning: (...args: unknown[]) => {
      warnings.push(args);
    },
    logError: () => undefined,
    generateResponse: async () => ({
      promptInput: "{}",
      rawText: '{"answer":"Still answered"}',
      relatedPages: [],
      response: {
        answer: "Still answered",
        relatedPages: [],
      },
      normalizationStatus: "normalized-json",
      provider: {
        label: "openai",
        model: "gpt-5",
      },
    }),
    buildPromptContext: () => ({}) as never,
  });

  assert.equal(result.status, 200);
  assert.equal((result.body as { answer: string }).answer, "Still answered");
  assert.equal(warnings.length, 1);
});

test("portfolio guide handler records errored responses without crashing logging", async () => {
  const finishCalls: unknown[] = [];
  const errors: unknown[][] = [];

  const result = await handlePortfolioGuideRequest(createRequest(), {
    logger: {
      start: async () => undefined,
      finish: async (input) => {
        finishCalls.push(input);
      },
    },
    getApiKey: () => "test-key",
    getModel: () => "gpt-5",
    createRequestId: () => "req_4",
    now: (() => {
      let callCount = 0;
      return () => {
        callCount += 1;
        return callCount === 1 ? 50 : 95;
      };
    })(),
    logWarning: () => undefined,
    logError: (...args: unknown[]) => {
      errors.push(args);
    },
    generateResponse: async () => {
      const error = new Error("model exploded") as Error & { code: string };
      error.code = "model_failed";
      throw error;
    },
    buildPromptContext: () => ({}) as never,
  });

  assert.equal(result.status, 500);
  assert.deepEqual(finishCalls, [
    {
      requestId: "req_4",
      model: "gpt-5",
      status: "errored",
      latencyMs: 45,
      errorCode: "model_failed",
    },
  ]);
  assert.equal(errors.length, 1);
});

test("portfolio guide handler rejects malformed payloads", async () => {
  const result = await handlePortfolioGuideRequest(
    {
      message: "",
    },
    {
      logger: {
        start: async () => undefined,
        finish: async () => undefined,
      },
      getApiKey: () => "test-key",
      getModel: () => "gpt-5",
      createRequestId: () => "req_5",
      now: () => 0,
      logWarning: () => undefined,
      logError: () => undefined,
      generateResponse: async () => {
        throw new Error("generateResponse should not be called");
      },
      buildPromptContext: () => ({}) as never,
    },
  );

  assert.equal(result.status, 400);
  assert.equal(
    (result.body as { error: string }).error,
    "Missing or invalid Portfolio Guide request.",
  );
});
