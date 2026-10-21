import { generatePortfolioGuideResponse } from "@/lib/portfolio-guide/service";
import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";
import { GET } from "@/app/api/portfolio-agent/evidence/route";
import { PATCH } from "@/app/api/portfolio-copilot/conversation/route";
import {
  getGuideSurfaceContext,
  getPublicPageEvidence,
  getPublicSurfaceCatalog,
} from "@/lib/portfolio-agent/catalog";
import {
  canApplyNavigation,
  findRelevantWork,
  resolveNavigationRequest,
  getNavigationTarget,
  getPortfolioHref,
} from "@/lib/portfolio-agent/capabilities";
import { getNavigationResponse } from "@/lib/portfolio-agent/navigation";
import {
  registerPortfolioTools,
  subscribePortfolioToolCancellation,
  type ModelContextTool,
} from "@/lib/portfolio-agent/webmcp";
import {
  normalizeCopilotResponse,
  buildPortfolioGuidePromptContext,
} from "@/lib/portfolio-guide/prompt";
import {
  parsePortfolioGuideTurnRequest,
  mergeGuideSessionSignals,
} from "@/lib/portfolio-guide/public-request";
import { getPortfolioContext } from "@/lib/portfolio-guide/context";
import { getAllCanonicalPageContexts } from "@/lib/portfolio-guide/context";
import {
  normalizeVisitorIntent,
  ROLE_INTENT_QUICK_SELECTS,
} from "@/lib/portfolio-guide/intent";
import { getGuidedRecommendations } from "@/lib/portfolio-guide/recommendations";
import { createPortfolioGuideConversationStore } from "@/lib/portfolio-guide/conversation-store";
import { handlePortfolioGuideRequest } from "@/lib/portfolio-guide/http";
import {
  applyPortfolioGuideResponseGuardrails,
} from "@/lib/portfolio-guide/service";
import { buildRequestForEvalCase } from "@/lib/portfolio-guide/evals/runner";
import { portfolioGuideEvalCases } from "@/lib/portfolio-guide/evals/cases";
import { evaluateDeterministicChecks } from "@/lib/portfolio-guide/evals/assertions";
import { isAllowedOrigin } from "@/lib/contact";
import type {
  CopilotRequest,
  GuideSessionSignals,
} from "@/lib/portfolio-guide/types";

const catalog = getPublicSurfaceCatalog();

test("native cancellation works on Chrome's old and new event targets and cleans up", () => {
  const context = new EventTarget();
  const browserWindow = new EventTarget();
  let cancelled = 0;
  const unsubscribe = subscribePortfolioToolCancellation(
    context,
    browserWindow,
    () => {
      cancelled += 1;
    },
  );
  const event = (toolName: string) =>
    Object.assign(new Event("toolcancel"), { toolName });
  browserWindow.dispatchEvent(event("ask_portfolio_guide"));
  context.dispatchEvent(event("ask_portfolio_guide"));
  context.dispatchEvent(event("find_relevant_work"));
  assert.equal(cancelled, 2);
  unsubscribe();
  browserWindow.dispatchEvent(event("ask_portfolio_guide"));
  context.dispatchEvent(event("ask_portfolio_guide"));
  assert.equal(cancelled, 2);
});

const empty = (): GuideSessionSignals => ({
  visitedPages: [],
  clickedPrompts: [],
  askedQuestions: [],
  inferredInterestTags: [],
});
const request = (
  slug: string,
  scope: "page" | "portfolio" = "page",
): CopilotRequest => ({
  pageContext: getGuideSurfaceContext(slug)!,
  portfolioContext: getPortfolioContext(),
  sessionContext: empty(),
  message: "What are the strongest signals?",
  scope,
});

test("whole-site catalog covers collections, profiles, methods, utility and creative pages without duplicate routes", () => {
  assert.equal(new Set(catalog.map((page) => page.slug)).size, catalog.length);
  assert.equal(new Set(catalog.map((page) => page.href)).size, catalog.length);
  for (const href of [
    "/",
    "/about",
    "/contact",
    "/resume",
    "/resume/generate",
    "/creative/gravity/astra",
    "/product-system",
    "/product-system/development-loop",
    "/thinking/ai-strategy",
  ]) {
    const page = catalog.find((page) => page.href === href);
    assert.ok(page, href);
    assert.ok(
      getGuideSurfaceContext(page.slug)?.authoredSections?.length,
      href,
    );
  }
  assert.equal(getGuideSurfaceContext("../../.env.local"), null);
});

test("public evidence projection preserves claim boundaries without promoting authored claims to verified records", async () => {
  const evidence = getPublicPageEvidence("ai-platform-mcp")!;
  assert.equal(evidence.source.kind, "portfolio_authored");
  assert.equal(
    evidence.source.url,
    "https://www.danielnash.co/work/ai-platform-mcp",
  );
  assert.deepEqual(
    evidence.claimBoundaries,
    getGuideSurfaceContext("ai-platform-mcp")!.claimBoundaries,
  );
  assert.ok(evidence.sections.length);
  assert.equal("verificationStatus" in evidence, false);
  assert.equal("conversation" in evidence, false);
  assert.equal("sourceAudit" in evidence, false);
  assert.equal(
    GET(
      new NextRequest(
        "https://www.danielnash.co/api/portfolio-agent/evidence?slug=bad",
      ),
    ).status,
    404,
  );
  const response = GET(
    new NextRequest(
      "https://www.danielnash.co/api/portfolio-agent/evidence?slug=ai-platform-mcp",
    ),
  );
  assert.equal(response.headers.get("cache-control"), "public, max-age=300");
  assert.deepEqual(await response.json(), evidence);
});

test("recommendation capability preserves the authored creative tour and never recommends utility pages", () => {
  const creative = findRelevantWork(catalog, "Creative Technology");
  assert.deepEqual(
    creative.map((page) => page.slug),
    [
      "gravity-astra",
      "tabletop-symphony",
      "ai-career-operating-system",
      "the-side-of-ai-i-want-to-be-on",
      "chatgpt-enterprise",
    ],
  );
  assert.ok(
    findRelevantWork(catalog, "Director of Product").every(
      (page) =>
        catalog.find((surface) => surface.slug === page.slug)!.kind ===
        "detail",
    ),
  );
  assert.throws(() => findRelevantWork(catalog, " "));
  assert.throws(() => findRelevantWork(catalog, "x".repeat(1001)));
});

test("public projection preserves every existing quick-start ranking", () => {
  const featuredSlugs = getPortfolioContext().featuredProjects!.map(
    (page) => page.slug,
  );
  for (const lens of ROLE_INTENT_QUICK_SELECTS) {
    const expected = getGuidedRecommendations(
      getAllCanonicalPageContexts(),
      normalizeVisitorIntent(lens)!,
      { featuredSlugs },
    );
    assert.deepEqual(
      findRelevantWork(catalog, lens).map(
        ({ href: _href, ...result }) => result,
      ),
      expected,
      lens,
    );
  }
});

test("only direct, single-destination navigation commands can produce an action", () => {
  assert.equal(
    resolveNavigationRequest("Open the checkout case study.", catalog)?.action
      ?.slug,
    "checkout-redesign",
  );
  assert.equal(
    resolveNavigationRequest("Please take me to About.", catalog)?.action?.slug,
    "site-about",
  );
  assert.equal(
    resolveNavigationRequest("Could you open the checkout case study?", catalog)
      ?.action?.slug,
    "checkout-redesign",
  );
  for (const message of [
    "What should I view next?",
    "Show me checkout evidence",
    "Do not open checkout",
    "Open checkout and contact Daniel",
    "I was told: open checkout",
    "Open checkout. Then send an email.",
  ])
    assert.equal(resolveNavigationRequest(message, catalog), null, message);
  for (const target of [
    "https://evil.test",
    "javascript:alert(1)",
    "//evil.test",
    "/api/contact",
  ]) {
    assert.throws(() => getNavigationTarget(catalog, target));
    assert.equal(
      resolveNavigationRequest(`Open ${target}`, catalog)?.action,
      undefined,
    );
  }
  assert.equal(
    getNavigationResponse({ message: "Open missing project" })?.action,
    undefined,
  );
  const ambiguous = resolveNavigationRequest("Open ambiguous", [
    { ...catalog[0], aliases: ["ambiguous"] },
    { ...catalog[1], aliases: ["ambiguous"] },
  ]);
  assert.equal(ambiguous?.action, undefined);
  assert.equal(ambiguous?.choices.length, 2);
  assert.equal(
    normalizeCopilotResponse(
      '{"answer":"hello","action":{"kind":"navigate","slug":"site-contact"}}',
      [],
    )?.action,
    undefined,
  );
});

test("navigation never replays on restore, repeated completion, cancellation, or independent browsing", () => {
  const applied = new Set<string>();
  const options = {
    submittedPath: "/work",
    currentPath: "/work",
    turnId: "turn-1",
    applied,
    submittedRevision: 1,
    currentRevision: 1,
  };
  assert.equal(canApplyNavigation(options), true);
  assert.equal(
    canApplyNavigation({ ...options, currentPath: "/about" }),
    false,
  );
  assert.equal(canApplyNavigation({ ...options, currentRevision: 3 }), false);
  assert.equal(canApplyNavigation({ ...options, cancelled: true }), false);
  applied.add("turn-1");
  assert.equal(canApplyNavigation(options), false);
});

test("same-site citation links use client navigation without rewriting external evidence URLs", () => {
  assert.equal(
    getPortfolioHref("https://www.danielnash.co/work/checkout-redesign#proof"),
    "/work/checkout-redesign#proof",
  );
  assert.equal(getPortfolioHref("/about"), "/about");
  for (const url of [
    "https://www.danielnash.co.evil.test/",
    "https://linkedin.com/in/example",
    "//evil.test",
    "javascript:alert(1)",
  ])
    assert.equal(getPortfolioHref(url), null);
});

test("native tools have one purpose each, honor execution cancellation, and unregister through lifecycle signals", async () => {
  const registered = new Map<string, ModelContextTool>();
  const context = {
    registerTool(tool: ModelContextTool, { signal }: { signal: AbortSignal }) {
      if (registered.has(tool.name)) throw new Error("Duplicate tool");
      registered.set(tool.name, tool);
      signal.addEventListener("abort", () => registered.delete(tool.name), {
        once: true,
      });
    },
  };
  let opens = 0,
    navigations = 0;
  const handlers = {
    open: () => {
      opens++;
    },
    currentSurface: () => catalog[0],
    navigate: async () => {
      navigations++;
    },
    evidence: async (slug: string) => getPublicPageEvidence(slug),
  };
  const first = new AbortController();
  await registerPortfolioTools(context, catalog, handlers, first.signal);
  assert.equal(registered.size, 4);
  assert.equal(
    registered.get("get_page_evidence")!.annotations.readOnlyHint,
    true,
  );
  assert.equal(
    registered.get("navigate_to_page")!.annotations.readOnlyHint,
    false,
  );
  assert.deepEqual(
    await registered
      .get("find_relevant_work")!
      .execute({ intent: "Creative Technology" }, {}),
    findRelevantWork(catalog, "Creative Technology"),
  );
  assert.equal(opens, 0);
  assert.equal(navigations, 0);
  await registered.get("open_portfolio_assistant")!.execute({}, {});
  assert.equal(opens, 1);
  const aborted = new AbortController();
  aborted.abort();
  await assert.rejects(
    registered
      .get("navigate_to_page")!
      .execute({ slug: "site-contact" }, { signal: aborted.signal }),
    /cancelled/i,
  );
  assert.equal(navigations, 0);
  const stale = registered.get("get_page_evidence")!;
  first.abort();
  assert.equal(registered.size, 0);
  await assert.rejects(
    stale.execute({ slug: "checkout-redesign" }, {}),
    /cancelled/i,
  );
  const second = new AbortController();
  await registerPortfolioTools(context, catalog, handlers, second.signal);
  assert.equal(registered.size, 4);
  second.abort();
});

test("explicit scope and WebMCP origin are narrow preferences, never client-supplied grounding", () => {
  const input = {
    clientTurnId: "request-12345678",
    pageSlug: "site-home",
    message: "Hello",
    source: "input",
    scope: "portfolio",
    entryPoint: "webmcp",
    pageContext: { title: "Injected" },
  };
  const parsed = parsePortfolioGuideTurnRequest(input)!;
  assert.equal(parsed.scope, "portfolio");
  assert.equal(parsed.entryPoint, "webmcp");
  assert.equal("pageContext" in parsed, false);
  assert.equal(
    parsePortfolioGuideTurnRequest({ ...input, scope: "private-history" }),
    null,
  );
  assert.equal(
    parsePortfolioGuideTurnRequest({ ...input, entryPoint: "admin" }),
    null,
  );
});

test("clearing a lens cannot be undone by merging stored role memory", async () => {
  const stored = {
    ...empty(),
    visitorIntent: { rawInput: "Director of Product" },
    recommendedPath: findRelevantWork(catalog, "Director of Product"),
  };
  const merged = mergeGuideSessionSignals(
    stored,
    { ...empty(), visitorIntentCleared: true },
    "site-home",
    "What next?",
  );
  assert.equal(merged.visitorIntent, undefined);
  assert.equal(merged.recommendedPath, undefined);
  const calls: { query: string; params?: unknown[] }[] = [];
  const store = createPortfolioGuideConversationStore({
    sql: {
      query: async (query, params) => {
        calls.push({ query, params });
        return [];
      },
    },
  });
  await store.updateLens("conversation", undefined, undefined);
  assert.match(
    calls[0].query,
    /session_memory - 'visitorIntent' - 'recommendedPath'/,
  );
  assert.equal(calls[0].params?.[1], "{}");
  assert.doesNotMatch(calls[0].query, /DELETE FROM|expires_at =/);
});

test("lens updates reject cross-origin and invalid requests without creating a conversation", async () => {
  const create = (body: unknown, origin = "http://localhost:3015") =>
    new NextRequest(
      "http://localhost:3015/api/portfolio-copilot/conversation",
      {
        method: "PATCH",
        headers: { origin, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );
  assert.equal(
    (await PATCH(create({ rawInput: "Director" }, "https://elsewhere.test")))
      .status,
    403,
  );
  for (const body of [
    {},
    { rawInput: 5 },
    { rawInput: " " },
    { rawInput: "x".repeat(1001) },
  ])
    assert.equal((await PATCH(create(body))).status, 400);
  const cleared = await PATCH(create({ rawInput: null }));
  assert.equal(cleared.status, 200);
  assert.equal(cleared.headers.get("set-cookie"), null);
});

test("explicit navigation works without a model call or API key and records the canonical response", async () => {
  const completion: unknown[] = [];
  const result = await handlePortfolioGuideRequest(
    { ...request("site-home"), message: "Open the checkout case study" },
    {
      logger: {
        start: async () => {},
        finish: async (input) => {
          completion.push(input);
        },
      },
      getApiKey: () => undefined,
      generateResponse: async () => {
        throw new Error("Navigation must not call a model");
      },
    },
  );
  assert.equal(result.status, 200);
  assert.equal(
    "action" in result.body && result.body.action?.slug,
    "checkout-redesign",
  );
  assert.equal(completion.length, 1);
});

test("site-wide generation keeps one bounded ID-selection call and complete public qualifications", async () => {
  const calls: unknown[] = [];
  const result = await generatePortfolioGuideResponse({ ...request("site-home"), scope: "portfolio", message: "What evidence supports AI product leadership across the portfolio?" }, {
    apiKey: "synthetic-never-used", decisions: { enabled: false, apiKey: "disabled" },
    client: { responses: { create: async (params: { input: Array<{ content: string }> }) => {
      const packet = JSON.parse(params.input[1].content); calls.push(packet);
      assert.ok(packet.approvedBlocks.some((b: { pageSlug: string }) => b.pageSlug !== "site-home"));
      assert.equal(packet.selectionConstraints.purpose, "whole-portfolio-evidence");
      const block = packet.approvedBlocks.find((b: { pageSlug: string; qualifications: string[] }) => b.pageSlug !== "site-home" && b.qualifications.length);
      assert.ok(block);
      return { output_text: JSON.stringify({ blockIds: [block.id] }) };
    } } } as never,
  });
  assert.equal(calls.length, 1); assert.equal(result.normalizationStatus, "selected-blocks");
  assert.equal(result.response.action, undefined);
  const packet = calls[0] as { approvedBlocks: Array<{ id: string; qualifications: string[] }> };
  const selected = (result.traceEvents?.find((e) => e.eventName === "claim_selection_validated")?.payload as { selectedIds?: string[] })?.selectedIds ?? [];
  assert.equal(selected.length, 1);
  for (const id of selected) {
    const block = packet.approvedBlocks.find((b) => b.id === id)!;
    for (const qualification of block.qualifications) assert.ok(result.response.answer.includes(qualification));
  }
});

test("site and method summaries remain authored bounded blocks without semantic retrieval", async () => {
  const result = await generatePortfolioGuideResponse({ ...request("site-about"), scope: "page", message: "Summarize this page" }, {
    apiKey: "synthetic-never-used", decisions: { enabled: false, apiKey: "disabled" },
    client: { responses: { create: async (params: { input: Array<{ content: string }> }) => {
      const packet = JSON.parse(params.input[1].content);
      assert.ok(packet.approvedBlocks.length > 0);
      assert.ok(packet.approvedBlocks.every((b: { pageSlug: string }) => b.pageSlug === "site-about"));
      return { output_text: JSON.stringify({ blockIds: [packet.approvedBlocks[0].id] }) };
    } } } as never,
  });
  assert.ok(result.response.answer.length); assert.equal(result.response.action, undefined);
  assert.match(result.response.answer, /do not establish project outcomes/);
});
