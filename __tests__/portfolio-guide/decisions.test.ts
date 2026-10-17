import assert from "node:assert/strict";
import test from "node:test";
import type OpenAI from "openai";
import { INTEREST_TAGS } from "@/lib/portfolio-guide/constants";
import {
  getPageContextBySlug,
  getPortfolioContext,
} from "@/lib/portfolio-guide/context";
import {
  buildDecisionsRequest,
  parseRoutingPlan,
  routePortfolioQuestion,
  selectRoutedPages,
  retrieveSupportingPages,
} from "@/lib/portfolio-guide/decisions";
import { generatePortfolioGuideResponse } from "@/lib/portfolio-guide/service";
import type { CopilotRequest } from "@/lib/portfolio-guide/types";
import { routingEvalCases } from "@/lib/portfolio-guide/evals/routing-cases";
import { shouldRouteQuestion } from "@/lib/portfolio-guide/decisions";

function request(
  message = "How does Daniel's creative background connect to his AI product experience?",
): CopilotRequest {
  return {
    message,
    pageContext: getPageContextBySlug("ai-platform-mcp")!,
    portfolioContext: getPortfolioContext(),
    sessionContext: {
      visitedPages: ["ai-platform-mcp"],
      clickedPrompts: [],
      askedQuestions: [],
      inferredInterestTags: [],
    },
    conversation: [
      {
        role: "assistant",
        content: "Invented ownership and metrics must not reach the router.",
      },
      { role: "user", content: "I'm comparing creative and AI experience." },
    ],
  };
}

function response(topics = ["ai-builder", "creative-technology"]) {
  return {
    answers: [
      ...INTEREST_TAGS.map((topic) => ({
        type: "predicate",
        name: `topic:${topic}`,
        probability: topics.includes(topic) ? 0.95 : 0.05,
      })),
      { type: "choice", name: "depth", choice: "deep", confidence: 0.95 },
      { type: "choice", name: "emphasis", choice: "creative", confidence: 0.9 },
      { type: "predicate", name: "career_evidence", probability: 0.9 },
    ],
    usage: { input_tokens: 180, output_tokens: 0, total_tokens: 180 },
  };
}

const config = { enabled: true, apiKey: "test-secret" };
const json = (data: unknown) =>
  new Response(JSON.stringify(data), { status: 200 });

test("routing uses the dedicated endpoint, bounded input, and excludes assistant history", async () => {
  let url = "";
  let init: RequestInit | undefined;
  const result = await routePortfolioQuestion(request(), {
    ...config,
    fetch: async (input, options) => {
      url = String(input);
      init = options;
      return json(response());
    },
  });
  assert.equal(url, "https://api.openai.com/v1/decisions");
  assert.equal(
    new Headers(init?.headers).get("authorization"),
    "Bearer test-secret",
  );
  assert.equal(JSON.parse(init?.body as string).model, "gpt-6-luna");
  assert.equal(result.status, "routed");
  assert.deepEqual(result.plan?.topics, ["creative-technology", "ai-builder"]);
  assert.equal(
    JSON.stringify(buildDecisionsRequest(request())).includes(
      "Invented ownership",
    ),
    false,
  );
  assert.equal(JSON.stringify(result).includes("test-secret"), false);
});

test("direct page questions and disabled routing make no network call", async () => {
  const neverFetch = async () => {
    throw new Error("unexpected fetch");
  };
  for (const question of [
    "What is Gravity?",
    "Tell me about this work",
    "What particularly was Daniel responsible for?",
    "How senior is this work?",
    "What are the strongest signals on this page?",
    "What's implied but not proven here?",
    "What should I view next?",
    "Does this page mention MCP?",
  ]) {
    const result = await routePortfolioQuestion(request(question), {
      ...config,
      fetch: neverFetch,
    });
    assert.equal(result.status, "bypassed", question);
    assert.equal(result.reason, "direct_question");
  }
  assert.equal(
    (
      await routePortfolioQuestion(request(), {
        ...config,
        enabled: false,
        fetch: neverFetch,
      })
    ).reason,
    "disabled",
  );
});

test("the 32 labeled routing cases preserve deterministic bypass boundaries", () => {
  for (const item of routingEvalCases)
    assert.equal(
      shouldRouteQuestion(request(item.question)),
      item.route,
      item.question,
    );
});

test("answers are matched by name and invalid or uncertain answers fail closed", () => {
  const valid = response();
  assert.ok(parseRoutingPlan({ answers: [...valid.answers].reverse() }));
  for (const patch of [
    { type: "refusal" },
    { choice: "invented" },
    { confidence: NaN },
  ]) {
    const data = response();
    Object.assign(data.answers[7], patch);
    assert.equal(parseRoutingPlan(data), undefined);
  }
  const invalid = response();
  Object.assign(invalid.answers[0], { probability: 2 });
  assert.equal(parseRoutingPlan(invalid), undefined);
  assert.equal(
    parseRoutingPlan({ answers: valid.answers.slice(1) }),
    undefined,
  );
  assert.equal(
    parseRoutingPlan({ answers: [...valid.answers, valid.answers[0]] }),
    undefined,
  );
  const uncertain = response();
  Object.assign(uncertain.answers[7], { confidence: 0.5 });
  Object.assign(uncertain.answers[8], { confidence: 0.5 });
  assert.equal(parseRoutingPlan(uncertain)?.depth, "synthesis");
  assert.equal(parseRoutingPlan(uncertain)?.emphasis, "balanced");
  assert.ok(parseRoutingPlan(response([]))?.searchCareerEvidence);
});

test("HTTP, malformed JSON, and network failures fall back without exposing error bodies", async () => {
  for (const fakeFetch of [
    async () => new Response("sensitive provider error", { status: 429 }),
    async () => new Response("not JSON"),
    async () => {
      throw new Error("sensitive provider error");
    },
    async () => json({ answers: [] }),
  ]) {
    const result = await routePortfolioQuestion(request(), {
      ...config,
      fetch: fakeFetch,
    });
    assert.equal(result.status, "fallback");
    assert.equal(JSON.stringify(result).includes("sensitive"), false);
  }
});

test("routing timeouts fall back while parent cancellation propagates", async () => {
  const pending: typeof fetch = async (_input, options) =>
    new Promise((_resolve, reject) =>
      options?.signal?.addEventListener("abort", () =>
        reject(new Error("aborted")),
      ),
    );
  const result = await routePortfolioQuestion(request(), {
    ...config,
    timeoutMs: 5,
    fetch: pending,
  });
  assert.equal(result.reason, "timeout");
  const controller = new AbortController();
  const running = routePortfolioQuestion(
    request(),
    { ...config, fetch: pending },
    controller.signal,
  );
  controller.abort(new Error("parent canceled"));
  await assert.rejects(running, /parent canceled/);
});

test("retrieval returns canonical supporting sources with claim boundaries and preserves creative tour order", () => {
  const input = request();
  const plan = parseRoutingPlan(response())!;
  const selected = selectRoutedPages(input, plan, []);
  assert.equal(selected.length, 2);
  assert.equal(
    selected.some((page) => page.slug === input.pageContext.slug),
    false,
  );
  const retrieved = retrieveSupportingPages(selected, plan);
  assert.equal(retrieved.length, 2);
  assert.ok(
    retrieved.every(
      (page) => page.claimBoundaries && page.authoredSections?.length,
    ),
  );
  assert.deepEqual(
    retrieveSupportingPages(selected, { ...plan, depth: "simple" }),
    [],
  );
  input.sessionContext.visitorIntent = {
    rawInput: "creative technology",
    focusAreas: ["creative-technology"],
  };
  const tour = [
    {
      slug: "gravity-astra",
      title: "Gravity",
      href: "/creative/gravity-astra",
    },
  ];
  assert.deepEqual(selectRoutedPages(input, plan, tour), tour);
});

test("accepted routing prefetches evidence but only displayed career claims count as used", async () => {
  let modelCalls = 0;
  let prompt = "";
  const client = {
    responses: {
      create: async (params: {
        input: Array<{ content: string }>;
        tools?: unknown[];
      }) => {
        modelCalls++;
        prompt = params.input[1].content;
        assert.equal(params.tools, undefined);
        return {
          output_text: JSON.stringify({
            answer:
              "The page supports AI prototype and platform work. Elsewhere in the portfolio, creative projects show music and experience design.",
          }),
        };
      },
    },
  } as unknown as OpenAI;
  const result = await generatePortfolioGuideResponse(request(), {
    apiKey: "test",
    client,
    decisions: { ...config, fetch: async () => json(response()) },
    evidenceMock: true,
  });
  assert.equal(modelCalls, 1);
  const context = JSON.parse(prompt);
  assert.equal(context.currentPage.identity.slug, "ai-platform-mcp");
  assert.equal(context.routingContext.supportingPages.length, 2);
  assert.ok(context.routingContext.careerEvidence);
  assert.equal(
    result.response.evidenceMeta?.resumeCustomizerEvidenceUsed,
    false,
  );
  assert.equal(result.response.evidenceUsed, undefined);
  assert.ok(
    result.traceEvents?.some(
      (event) => event.eventName === "decisions.routing",
    ),
  );
  assert.deepEqual(result.usage?.decisions, {
    input_tokens: 180,
    output_tokens: 0,
    total_tokens: 180,
  });
});

test("routing and career-evidence prefetch finish before answer generation", async () => {
  const order: string[] = [];
  const client = {
    responses: {
      create: async (params: { input: Array<{ content: string }> }) => {
        order.push("answer");
        const context = JSON.parse(params.input[1].content);
        assert.ok(context.routingContext.decisionHints.searchCareerEvidence);
        assert.ok(context.routingContext.careerEvidence);
        return {
          output_text:
            '{"answer":"The current page describes AI product work."}',
        };
      },
    },
  } as unknown as OpenAI;
  await generatePortfolioGuideResponse(request(), {
    apiKey: "test",
    client,
    decisions: {
      ...config,
      fetch: async () => {
        order.push("route");
        return json(response());
      },
    },
    evidenceMock: true,
  });
  assert.deepEqual(order, ["route", "answer"]);
});

test("failed routing retains existing prompt and evidence tool availability", async () => {
  let captured: unknown;
  const client = {
    responses: {
      create: async (params: unknown) => {
        captured = params;
        return { output_text: '{"answer":"Page-grounded answer."}' };
      },
    },
  } as unknown as OpenAI;
  const result = await generatePortfolioGuideResponse(request(), {
    apiKey: "test",
    client,
    decisions: {
      ...config,
      fetch: async () => new Response("", { status: 503 }),
    },
    evidenceMock: true,
  });
  const params = captured as {
    input: Array<{ content: string }>;
    tools: Array<{ name: string }>;
  };
  assert.equal(JSON.parse(params.input[1].content).routingContext, undefined);
  assert.ok(params.tools.some((tool) => tool.name === "searchCareerEvidence"));
  assert.equal(
    result.response.evidenceMeta?.resumeCustomizerEvidenceUsed,
    false,
  );
});

test("malformed Director-role prose uses canonical role evidence and does not attribute unused career evidence", async () => {
  const client = {
    responses: {
      create: async () => ({
        output_text: JSON.stringify({
          answer:
            "Daniel shipped the production platform and led a team of 50 engineers.",
        }),
      }),
    },
  } as unknown as OpenAI;
  const result = await generatePortfolioGuideResponse(
    request("Would Daniel be a good Director of AI Product?"),
    {
      apiKey: "test",
      client,
      decisions: {
        ...config,
        fetch: async () => json(response(["ai-builder", "pm-leadership"])),
      },
      evidenceMock: true,
    },
  );
  assert.doesNotMatch(
    result.response.answer,
    /team of 50|shipped the production platform/,
  );
  assert.match(
    result.response.answer,
    /not end-to-end production implementation ownership/,
  );
  assert.equal(
    result.response.evidenceMeta?.resumeCustomizerEvidenceUsed,
    false,
  );
  assert.ok(
    result.traceEvents?.some(
      (event) => event.eventName === "response_guardrails_applied",
    ),
  );
});

test("explicit project lookup avoids Decisions and retrieves that project's canonical evidence", async () => {
  const input = request("Tell me about Gravity × Astra.");
  const result = await routePortfolioQuestion(input, {
    ...config,
    fetch: async () => {
      throw new Error("must not call API");
    },
  });
  assert.equal(result.status, "bypassed");
  const pages = selectRoutedPages(input, result.plan!, []);
  assert.equal(pages[0].slug, "gravity-astra");
  assert.equal(
    retrieveSupportingPages(pages, result.plan!)[0].slug,
    "gravity-astra",
  );
});
