import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  getPageContextBySlug,
  getPortfolioContext,
} from "@/lib/portfolio-guide/context";
import { resolveEvalRunnerConfig } from "@/lib/portfolio-guide/evals/config";
import { loadPortfolioGuideEvalEnv } from "@/lib/portfolio-guide/evals/env";
import { verifyOpenAiCompatibleProvider } from "@/lib/portfolio-guide/evals/preflight";
import { applyPortfolioGuideResponseGuardrails } from "@/lib/portfolio-guide/service";
import type { CopilotResponse } from "@/lib/portfolio-guide/types";
import { evaluateDeterministicChecks } from "@/lib/portfolio-guide/evals/assertions";
import { portfolioGuideEvalCases } from "@/lib/portfolio-guide/evals/cases";
import {
  runPortfolioGuideEvalSuite,
  snapshotGeneration,
} from "@/lib/portfolio-guide/evals/runner";
import type {
  PortfolioGuideEvalAssistant,
  PortfolioGuideEvalJudge,
} from "@/lib/portfolio-guide/evals/types";

test("deterministic eval checks catch contaminated-history reuse", () => {
  const evalCase = portfolioGuideEvalCases.find(
    (candidate) => candidate.id === "ai-platform-contaminated-history",
  );
  assert.ok(evalCase, "expected contaminated-history eval case");

  const failingResponse: CopilotResponse = {
    answer:
      "The page says the CRM connector was reused most across CRM, OMS, and support tooling.",
    relatedPages: [],
  };
  const results = evaluateDeterministicChecks(evalCase, failingResponse);

  assert.ok(results.some((result) => !result.passed));
  assert.ok(
    results.some(
      (result) =>
        !result.passed && result.label.includes('Answer excludes "crm"'),
    ),
  );
});

test("semantic ownership variants satisfy hard checks", () => {
  const evalCase = portfolioGuideEvalCases.find(
    (candidate) => candidate.id === "ai-platform-ownership",
  );
  assert.ok(evalCase, "expected ai-platform-ownership eval case");

  const response: CopilotResponse = {
    answer:
      "On this page, Daniel mapped recurring AI workflow patterns, translated MCP and orchestration concepts, and built system patterns directly. The page does not provide a formal ownership matrix or team boundary details.",
    relatedPages: [],
  };
  const results = evaluateDeterministicChecks(evalCase, response);

  assert.equal(
    results.filter((result) => result.severity === "hard" && !result.passed).length,
    0,
  );
});

test("jira evidence semantic variants satisfy hard checks", () => {
  const evalCase = portfolioGuideEvalCases.find(
    (candidate) => candidate.id === "jira-evidence",
  );
  assert.ok(evalCase, "expected jira-evidence eval case");

  const response: CopilotResponse = {
    answer:
      "The page shows nine product managers fully adopted the tool, includes an 8-week onboarding program, and highlights improved visibility into initiatives, dependencies, and progress against OKRs.",
    relatedPages: [],
  };
  const results = evaluateDeterministicChecks(evalCase, response);

  assert.equal(
    results.filter((result) => result.severity === "hard" && !result.passed).length,
    0,
  );
});

test("seniority semantic variants satisfy hard checks", () => {
  const evalCase = portfolioGuideEvalCases.find(
    (candidate) => candidate.id === "ai-platform-seniority",
  );
  assert.ok(evalCase, "expected ai-platform-seniority eval case");

  const response: CopilotResponse = {
    answer:
      "Signals on the page: Daniel led a team on the original prototype and translated that work into reusable platform principles. Not proven here: the page doesn't specify team size, org structure, or production rollout scale.",
    relatedPages: [],
  };
  const results = evaluateDeterministicChecks(evalCase, response);

  assert.equal(
    results.filter((result) => result.severity === "hard" && !result.passed).length,
    0,
  );
});

test("strongest-signals semantic variants satisfy hard checks", () => {
  const evalCase = portfolioGuideEvalCases.find(
    (candidate) => candidate.id === "checkout-strongest-signals",
  );
  assert.ok(evalCase, "expected checkout-strongest-signals eval case");

  const response: CopilotResponse = {
    answer:
      "The strongest signals are the roughly ~$16M annualized impact, the 30% faster checkout with about ~3% conversion lift, and the context-rich Jira ticket that shows how execution quality was managed during delivery.",
    relatedPages: [],
  };
  const results = evaluateDeterministicChecks(evalCase, response);

  assert.equal(
    results.filter((result) => result.severity === "hard" && !result.passed).length,
    0,
  );
});

test("advisory recommendation checks do not gate hard pass", () => {
  const evalCase = portfolioGuideEvalCases.find(
    (candidate) => candidate.id === "checkout-cross-page-dau",
  );
  assert.ok(evalCase, "expected checkout-cross-page-dau eval case");

  const response: CopilotResponse = {
    answer: "The page does not provide a daily active users figure.",
    relatedPages: [],
  };
  const results = evaluateDeterministicChecks(evalCase, response);

  assert.equal(
    results.filter((result) => result.severity === "hard" && !result.passed).length,
    0,
  );
  assert.ok(
    results.some(
      (result) =>
        result.severity === "advisory" &&
        !result.passed &&
        result.label.includes('Related pages include "chatgpt-enterprise"'),
    ),
  );
});

test("follow-up leakage for absent terms remains a hard failure", () => {
  const evalCase = portfolioGuideEvalCases.find(
    (candidate) => candidate.id === "checkout-mentions-mcp",
  );
  assert.ok(evalCase, "expected checkout-mentions-mcp eval case");

  const response: CopilotResponse = {
    answer: "No. This checkout redesign page does not mention MCP.",
    suggestedFollowUps: ["Show me the AI platform (MCP) page."],
    relatedPages: [],
  };
  const results = evaluateDeterministicChecks(evalCase, response);

  assert.ok(
    results.some(
      (result) =>
        result.severity === "hard" &&
        !result.passed &&
        result.label.includes("Suggested follow-ups exclude"),
    ),
  );
});

test("response guardrails scrub absent terms from follow-ups and related-page reasons", () => {
  const pageContext = getPageContextBySlug("checkout-redesign");
  assert.ok(pageContext, "expected checkout page context");

  const guarded = applyPortfolioGuideResponseGuardrails({
    request: {
      message: "Did this page mention MCP?",
      pageContext,
      portfolioContext: getPortfolioContext(),
      sessionContext: {
        visitedPages: ["checkout-redesign"],
        clickedPrompts: [],
        askedQuestions: ["Did this page mention MCP?"],
        inferredInterestTags: ["pm-leadership"],
      },
    },
    response: {
      answer: "No. This checkout redesign page does not mention MCP.",
      suggestedFollowUps: ["Show me the AI platform (MCP) page."],
      relatedPages: [
        {
          slug: "chatgpt-enterprise",
          title: "ChatGPT Enterprise from pilot to operating model",
          href: "/work/chatgpt-enterprise",
          reason: "Useful if you want to compare this work to MCP projects.",
        },
      ],
    },
    fallbackRelatedPages: [
      {
        slug: "chatgpt-enterprise",
        title: "ChatGPT Enterprise from pilot to operating model",
        href: "/work/chatgpt-enterprise",
        reason: "Explicitly related from this page’s portfolio metadata.",
      },
    ],
  });

  assert.deepEqual(guarded.suggestedFollowUps ?? [], []);
  assert.equal(
    guarded.relatedPages?.[0]?.reason,
    "Explicitly related from this page’s portfolio metadata.",
  );
});

test("response guardrails strip speculative ranking tails after explicit limits", () => {
  const pageContext = getPageContextBySlug("ai-platform-mcp");
  assert.ok(pageContext, "expected ai platform page context");

  const guarded = applyPortfolioGuideResponseGuardrails({
    request: {
      message: "Which patterns were reused most?",
      pageContext,
      portfolioContext: getPortfolioContext(),
      sessionContext: {
        visitedPages: ["ai-platform-mcp"],
        clickedPrompts: [],
        askedQuestions: ["Which patterns were reused most?"],
        inferredInterestTags: ["platform"],
      },
    },
    response: {
      answer:
        "This page does not specify which patterns were reused the most. It names recurring workflow and connector patterns. Inference: retrieval and review routing were likely reused most often.",
      relatedPages: [],
    },
    fallbackRelatedPages: [],
  });

  assert.equal(
    guarded.answer,
    "This page does not specify which patterns were reused the most. It names recurring workflow and connector patterns.",
  );
});

test("response guardrails add an ownership limit and soften risky ownership wording", () => {
  const pageContext = getPageContextBySlug("checkout-redesign");
  assert.ok(pageContext, "expected checkout page context");

  const guarded = applyPortfolioGuideResponseGuardrails({
    request: {
      message: "What did Daniel own?",
      pageContext,
      portfolioContext: getPortfolioContext(),
      sessionContext: {
        visitedPages: ["checkout-redesign"],
        clickedPrompts: [],
        askedQuestions: ["What did Daniel own?"],
        inferredInterestTags: ["pm-leadership"],
      },
    },
    response: {
      answer:
        "Daniel owned the checkout redesign initiative and oversaw the launch.",
      relatedPages: [],
    },
    fallbackRelatedPages: [],
  });

  assert.match(guarded.answer, /The page shows Daniel leading/i);
  assert.match(
    guarded.answer,
    /does not define a full ownership matrix or exact team-by-team split/i,
  );
});

test("response guardrails rebuild seniority answers with explicit limits when needed", () => {
  const pageContext = getPageContextBySlug("ai-platform-mcp");
  assert.ok(pageContext, "expected ai platform page context");

  const guarded = applyPortfolioGuideResponseGuardrails({
    request: {
      message: "How senior is this work?",
      pageContext,
      portfolioContext: getPortfolioContext(),
      sessionContext: {
        visitedPages: ["ai-platform-mcp"],
        clickedPrompts: [],
        askedQuestions: ["How senior is this work?"],
        inferredInterestTags: ["platform"],
      },
    },
    response: {
      answer:
        "This looks like strong work with direct ownership and leadership influence.",
      relatedPages: [],
    },
    fallbackRelatedPages: [],
  });

  assert.match(guarded.answer, /Signals on the page:/);
  assert.match(guarded.answer, /Not proven here:/);
  assert.match(guarded.answer, /does not define team size, org structure, production rollout scale/i);
});

test("response guardrails rebuild next-read answers from safe related-page metadata", () => {
  const pageContext = getPageContextBySlug("jira-product-discovery");
  assert.ok(pageContext, "expected jira page context");

  const guarded = applyPortfolioGuideResponseGuardrails({
    request: {
      message: "What should I read next?",
      pageContext,
      portfolioContext: getPortfolioContext(),
      sessionContext: {
        visitedPages: ["jira-product-discovery"],
        clickedPrompts: [],
        askedQuestions: ["What should I read next?"],
        inferredInterestTags: ["pm-leadership"],
      },
    },
    response: {
      answer:
        "Read ChatGPT Enterprise next because it shows org-scale rollout and operating-model design in detail.",
      relatedPages: [
        {
          slug: "chatgpt-enterprise",
          title: "ChatGPT Enterprise from pilot to operating model",
          href: "/work/chatgpt-enterprise",
          reason: "Shows org-scale rollout and operating-model design in detail.",
        },
      ],
    },
    fallbackRelatedPages: [
      {
        slug: "chatgpt-enterprise",
        title: "ChatGPT Enterprise from pilot to operating model",
        href: "/work/chatgpt-enterprise",
        reason: "Strong match for leadership and operating model work.",
      },
    ],
  });

  assert.match(guarded.answer, /As a next read, start with ChatGPT Enterprise from pilot to operating model\./);
  assert.match(
    guarded.answer,
    /Strong match for leadership and operating model work\./i,
  );
  assert.equal(
    guarded.relatedPages?.[0]?.reason,
    "Strong match for leadership and operating model work.",
  );
});

test("eval runner combines deterministic and judge results into a failing suite", async () => {
  const evalCase = portfolioGuideEvalCases.find(
    (candidate) => candidate.id === "checkout-mentions-mcp",
  );
  assert.ok(evalCase, "expected checkout MCP eval case");

  const assistant: PortfolioGuideEvalAssistant = async () => ({
    promptInput: "{}",
    rawText: '{"answer":"Yes, it mentions MCP.","relatedPages":[]}',
    relatedPages: [],
    response: {
      answer: "Yes, it mentions MCP.",
      relatedPages: [],
    },
    normalizationStatus: "normalized-json",
    provider: {
      label: "openai",
      model: "gpt-5",
    },
  });

  const judge: PortfolioGuideEvalJudge = async () => ({
    passed: false,
    verdict: "fail",
    summary: "The answer invents a page mention.",
    scores: {
      groundedness: 1,
      uncertaintyHandling: 1,
      sourceSeparation: 1,
      helpfulness: 2,
      concision: 4,
    },
    strengths: [],
    issues: ["Claims MCP appears on the page when it does not."],
    rawText: "{}",
  });

  const suite = await runPortfolioGuideEvalSuite({
    label: "test",
    cases: [evalCase],
    providerConfig: resolveEvalRunnerConfig(
      {
        providerMode: "openai",
        assistantApiKey: "test-openai-key",
        assistantModel: "gpt-5",
        judgeApiKey: "test-openai-key",
        judgeModel: "gpt-5-mini",
      },
      {} as NodeJS.ProcessEnv,
    ),
    runAssistant: assistant,
    runJudge: judge,
  });

  assert.equal(suite.summary.total, 1);
  assert.equal(suite.summary.failed, 1);
  assert.equal(suite.cases[0]?.passed, false);
  assert.ok(
    suite.cases[0]?.deterministicChecks.some((result) => !result.passed),
    "expected deterministic failure",
  );
});

test("provider config prefers flags over env and defaults to hybrid local mode", () => {
  const config = resolveEvalRunnerConfig(
    {
      providerMode: "local-answer-remote-judge",
      assistantModel: "cli-local-model",
      assistantBaseUrl: "http://localhost:11434/v1",
      assistantApiKey: "ollama",
    },
    {
      PORTFOLIO_GUIDE_EVAL_PROVIDER_MODE: "openai",
      PORTFOLIO_GUIDE_EVAL_ASSISTANT_MODEL: "env-model",
      OPENAI_API_KEY: "remote-key",
    } as unknown as NodeJS.ProcessEnv,
  );

  assert.equal(config.providerMode, "local-answer-remote-judge");
  assert.equal(config.assistant.model, "cli-local-model");
  assert.equal(config.assistant.baseURL, "http://localhost:11434/v1");
  assert.equal(config.judge?.label, "openai");
  assert.equal(config.judge?.apiKey, "remote-key");
});

test("provider config disables judge in local deterministic-only mode", () => {
  const config = resolveEvalRunnerConfig(
    {
      providerMode: "local-answer-no-judge",
      assistantModel: "gpt-oss",
      assistantApiKey: "ollama",
    },
    {} as NodeJS.ProcessEnv,
  );

  assert.equal(config.providerMode, "local-answer-no-judge");
  assert.equal(config.judge, undefined);
  assert.equal(config.assistant.label, "local-openai-compatible");
  assert.equal(config.timeouts.assistantMs, 90000);
  assert.equal(config.timeouts.judgeMs, 60000);
});

test("provider config accepts timeout overrides", () => {
  const config = resolveEvalRunnerConfig(
    {
      providerMode: "openai",
      assistantApiKey: "test-openai-key",
      assistantModel: "gpt-5",
      assistantTimeoutMs: 1234,
      judgeApiKey: "test-openai-key",
      judgeModel: "gpt-5-mini",
      judgeTimeoutMs: 2345,
    },
    {} as NodeJS.ProcessEnv,
  );

  assert.equal(config.timeouts.assistantMs, 1234);
  assert.equal(config.timeouts.judgeMs, 2345);
});

test("assistant failure becomes a case failure with a clear reason", async () => {
  const evalCase = portfolioGuideEvalCases.find(
    (candidate) => candidate.id === "ai-platform-summary",
  );
  assert.ok(evalCase, "expected ai platform summary eval case");

  const assistant: PortfolioGuideEvalAssistant = async () => {
    throw new Error("connect ECONNREFUSED 127.0.0.1:11434");
  };

  const suite = await runPortfolioGuideEvalSuite({
    label: "local-failure",
    cases: [evalCase],
    providerConfig: resolveEvalRunnerConfig(
      {
        providerMode: "local-answer-no-judge",
        assistantModel: "gpt-oss",
        assistantApiKey: "ollama",
      },
      {} as NodeJS.ProcessEnv,
    ),
    runAssistant: assistant,
  });

  assert.equal(suite.summary.failed, 1);
  assert.equal(suite.summary.assistantFailures, 1);
  assert.equal(suite.cases[0]?.passed, false);
  assert.match(
    suite.cases[0]?.failures[0]?.message ?? "",
    /ECONNREFUSED/,
  );
});

test("assistant timeout becomes a case failure with a clear reason", async () => {
  const evalCase = portfolioGuideEvalCases.find(
    (candidate) => candidate.id === "ai-platform-summary",
  );
  assert.ok(evalCase, "expected ai platform summary eval case");

  const assistant: PortfolioGuideEvalAssistant = async ({ signal }) =>
    new Promise((resolve, reject) => {
      signal?.addEventListener("abort", () => {
        reject(new Error("aborted"));
      });
      void resolve;
    });

  const suite = await runPortfolioGuideEvalSuite({
    label: "assistant-timeout",
    cases: [evalCase],
    providerConfig: resolveEvalRunnerConfig(
      {
        providerMode: "local-answer-no-judge",
        assistantModel: "gpt-oss",
        assistantApiKey: "ollama",
        assistantTimeoutMs: 5,
      },
      {} as NodeJS.ProcessEnv,
    ),
    runAssistant: assistant,
  });

  assert.equal(suite.summary.failed, 1);
  assert.equal(suite.summary.assistantFailures, 1);
  assert.match(
    suite.cases[0]?.failures[0]?.message ?? "",
    /timed out/i,
  );
});

test("snapshot output carries provider metadata and failure details", () => {
  const snapshot = snapshotGeneration("case-1", {
    request: {
      message: "Did this page mention MCP?",
      pageContext: {
        slug: "checkout-redesign",
        href: "/work/checkout-redesign",
        title: "Checkout Redesign",
      },
      portfolioContext: {},
      sessionContext: {
        visitedPages: ["checkout-redesign"],
        clickedPrompts: [],
        askedQuestions: [],
        inferredInterestTags: [],
      },
    },
    generation: undefined,
    providers: {
      mode: "local-answer-remote-judge",
      assistant: {
        label: "local-openai-compatible",
        model: "gpt-oss",
        baseURL: "http://127.0.0.1:11434/v1",
      },
      judge: {
        label: "openai",
        model: "gpt-5-mini",
      },
    },
    failures: [
      {
        stage: "assistant",
        message: "No portfolio guide response was returned.",
      },
    ],
  });

  assert.equal(snapshot.providers.assistant.label, "local-openai-compatible");
  assert.equal(snapshot.failures[0]?.stage, "assistant");
});

test("eval env loader reads .env.local outside production only", async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "portfolio-guide-env-"));
  const envKey = "PORTFOLIO_GUIDE_EVAL_ENV_TEST";
  const previousValue = process.env[envKey];

  try {
    await writeFile(path.join(tempDir, ".env.local"), `${envKey}=loaded\n`, "utf8");
    delete process.env[envKey];

    const developmentLoad = loadPortfolioGuideEvalEnv({
      cwd: tempDir,
      nodeEnv: "development",
    });
    assert.equal(developmentLoad.loaded, true);
    assert.equal(process.env[envKey], "loaded");

    delete process.env[envKey];

    const productionLoad = loadPortfolioGuideEvalEnv({
      cwd: tempDir,
      nodeEnv: "production",
    });
    assert.equal(productionLoad.loaded, false);
    assert.equal(process.env[envKey], undefined);
  } finally {
    if (previousValue === undefined) {
      delete process.env[envKey];
    } else {
      process.env[envKey] = previousValue;
    }
    await rm(tempDir, { recursive: true, force: true });
  }
});

test("local provider preflight fails clearly when the model is missing", async () => {
  await assert.rejects(
    () =>
      verifyOpenAiCompatibleProvider({
        label: "local-openai-compatible",
        model: "missing-model",
        apiKey: "ollama",
        baseURL: "http://127.0.0.1:11434/v1",
      }),
    /Available models:/,
  );
});
