import { readFileSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import type OpenAI from "openai";
import { getPageContextBySlug, getPortfolioContext } from "../context";
import {
  buildDecisionsRequest,
  parseRoutingPlan,
  shouldRouteQuestion,
} from "../decisions";
import {
  generatePortfolioGuideResponse,
  type PortfolioGuideGenerationResult,
} from "../service";
import { retrieveGuideSources } from "../retrieval";
import {
  getPortfolioSearchDocuments,
  searchPortfolioFromIndex,
} from "../search";
import { blockExcerpt, type ClaimBlock } from "../factual-answers";
import {
  parseEvidenceSearchResponse,
  type EvidenceItem,
} from "../tools/evidence";
import {
  corpusHash,
  hashText,
  rankHybrid,
  validIndex,
  type SearchDocument,
  type EmbeddingIndex,
} from "../../search/hybrid";
import {
  buildJudgeInput,
  EVAL_JUDGE_SYSTEM_PROMPT,
  normalizeJudgeResult,
} from "./judge";
import { extractResponseText } from "../prompt";
import type { CopilotRequest } from "../types";
import type { PortfolioGuideEvalCase } from "./types";
import type {
  FrozenSearchManifest,
  SearchCase,
  SearchStage,
} from "./search-budget";

export type RetrievalCase = {
  id: string;
  query: string;
  expectedIds: string[];
  projectId?: string;
};
export type PublicSearchBundle = {
  careerRoot: string;
  career: {
    items: EvidenceItem[];
    documents: SearchDocument[];
    cache: EmbeddingIndex;
  };
  portfolioDocuments: SearchDocument[];
  queries: Array<{ id: string; query: string }>;
  questions: Array<{
    id: SearchCase;
    page: string;
    question: string;
    role?: string;
  }>;
  retrievalCases: { career: RetrievalCase[]; portfolio: RetrievalCase[] };
};
/** Conservative closed inventory of executable code and public input backings.
 * Values from the private bullet bank are never copied into provider packets. */
export function adaptiveSourceInventory(
  portfolioRoot: string,
  careerRoot: string,
): string[] {
  const files: string[] = [];
  const walk = (path: string) => {
    for (const entry of readdirSync(path, { withFileTypes: true })) {
      if (entry.isSymbolicLink()) throw new Error("source_symlink_forbidden");
      if (entry.isDirectory()) walk(resolve(path, entry.name));
      else if (
        entry.isFile() &&
        /\.(?:ts|tsx|js|jsx|mjs|cjs|mts|cts|json)$/.test(entry.name)
      )
        files.push(resolve(path, entry.name));
    }
  };
  for (const name of ["lib", "content", "data", "scripts", "evals/search"])
    walk(resolve(portfolioRoot, name));
  for (const name of [
    "lib/evidence",
    "lib/search",
    "scripts/lib",
    "evals/search",
  ])
    walk(resolve(careerRoot, name));
  for (const root of [portfolioRoot, careerRoot])
    for (const name of [
      "package.json",
      "package-lock.json",
      "tsconfig.json",
      "AGENTS.md",
    ])
      files.push(resolve(root, name));
  for (const name of [
    "facts-bank.md",
    "approved-metrics.md",
    "portfolio-sources.md",
    "user-approved-claims.md",
    "resume-viking-sr-pm.md",
    "resume-pennymac-fvp-product-manager.md",
    "contact-center-roadmap-progress-end-2024.md",
  ])
    files.push(resolve(careerRoot, "sources", name));
  for (const name of [
    "data/resume-bullet-bank.json",
    "data/public-career-evidence.json",
    "data/search-index/career-cache.json",
  ])
    files.push(resolve(careerRoot, name));
  return [...new Set(files)].sort();
}
export function requestForSearchCase(
  bundle: PublicSearchBundle,
  id: SearchCase,
): CopilotRequest {
  const c = bundle.questions.find((q) => q.id === id);
  if (!c) throw new Error("unapproved_case");
  const pageContext = getPageContextBySlug(c.page);
  if (!pageContext) throw new Error("missing_canonical_page");
  return {
    message: c.question,
    pageContext,
    portfolioContext: getPortfolioContext(),
    sessionContext: {
      visitedPages: [],
      clickedPrompts: [],
      askedQuestions: [],
      inferredInterestTags: [],
      ...(c.role
        ? {
            visitorIntent: {
              rawInput: c.role,
              normalizedTitle: "AI product leader",
            },
          }
        : {}),
    },
  };
}
export function loadAdaptiveBundle(
  manifest: FrozenSearchManifest,
): PublicSearchBundle {
  if (
    manifest.packetMode !== "adaptive-v1" ||
    !manifest.publicBundle ||
    !manifest.files.some(
      (f) =>
        f.path === manifest.publicBundle!.path &&
        f.sha256 === manifest.publicBundle!.sha256,
    )
  )
    throw new Error("missing_frozen_public_bundle");
  const bundle = JSON.parse(
    readFileSync(manifest.publicBundle.path, "utf8"),
  ) as PublicSearchBundle;
  if (
    manifest.repositories.length !== 2 ||
    manifest.repositories[0].path !== process.cwd() ||
    manifest.repositories[1].path !== bundle.careerRoot
  )
    throw new Error("explicit_candidate_roots_required");
  if (
    adaptiveSourceInventory(
      manifest.repositories[0].path,
      bundle.careerRoot,
    ).some((path) => !manifest.files.some((file) => file.path === path))
  )
    throw new Error("incomplete_adaptive_source_inventory");
  const proposalFile = manifest.files.find(
    (f) => f.sha256 === manifest.proposalSha256,
  );
  if (
    manifest.proposalSha256 !==
      "7bf8e2bfc95fd9e1eeab770c487650c339135a39962521a46481c20e52e1ea5c" ||
    !proposalFile ||
    JSON.stringify(
      JSON.parse(readFileSync(proposalFile.path, "utf8")).data.questions,
    ) !== JSON.stringify(bundle.questions)
  )
    throw new Error("original_questions_changed");
  if (
    hashText(readFileSync(manifest.publicBundle.path, "utf8")) !==
      manifest.publicBundle.sha256 ||
    bundle.career.documents.length !== 27 ||
    bundle.portfolioDocuments.length !== 63 ||
    corpusHash(bundle.career.documents) !== manifest.corpusHashes.career ||
    corpusHash(bundle.portfolioDocuments) !== manifest.corpusHashes.portfolio ||
    corpusHash(getPortfolioSearchDocuments()) !==
      manifest.corpusHashes.portfolio
  )
    throw new Error("public_corpus_changed");
  if (
    !manifest.repositories.some((r) => r.path === bundle.careerRoot) ||
    !manifest.files.some(
      (f) => f.path === resolve(bundle.careerRoot, "lib/evidence/search.ts"),
    )
  )
    throw new Error("career_module_not_frozen");
  const currentCatalog = JSON.parse(
    execFileSync(
      process.execPath,
      [
        "--import",
        "tsx",
        "-e",
        'const {getPublicEvidenceCatalog}=require("./lib/evidence/catalog.ts"); process.stdout.write(JSON.stringify(getPublicEvidenceCatalog()));',
      ],
      {
        cwd: bundle.careerRoot,
        encoding: "utf8",
        maxBuffer: 4 * 1024 * 1024,
        env: { PATH: process.env.PATH, LANG: "en_US.UTF-8", NODE_ENV: "test" },
      },
    ),
  );
  if (
    JSON.stringify(currentCatalog.items) !==
      JSON.stringify(bundle.career.items) ||
    JSON.stringify(currentCatalog.documents) !==
      JSON.stringify(bundle.career.documents) ||
    JSON.stringify(
      JSON.parse(
        readFileSync(
          resolve(bundle.careerRoot, "data/search-index/career-cache.json"),
          "utf8",
        ),
      ),
    ) !== JSON.stringify(bundle.career.cache)
  )
    throw new Error("public_catalog_or_cache_changed");
  for (const [kind, root] of [
    ["career", bundle.careerRoot],
    ["portfolio", manifest.repositories[0].path],
  ] as const)
    if (
      JSON.stringify(
        JSON.parse(
          readFileSync(resolve(root, "evals/search/cases.json"), "utf8"),
        ),
      ) !== JSON.stringify(bundle.retrievalCases[kind])
    )
      throw new Error("original_retrieval_cases_changed");
  const ids = [
    "patent-measurement",
    "ownership",
    "onboarding",
    "oms-context",
    "qualification",
    "role-fit",
  ];
  if (
    JSON.stringify(bundle.questions.map((q) => q.id)) !== JSON.stringify(ids) ||
    bundle.queries.length !== 29 ||
    bundle.retrievalCases.career.length !== 15 ||
    bundle.retrievalCases.portfolio.length !== 8 ||
    bundle.career.items.length !== 27 ||
    bundle.career.items.some(
      (e) =>
        e.visibility !== "public_safe" || e.sourceAudit.status !== "verified",
    )
  )
    throw new Error("public_scope_changed");
  const cache = bundle.career.cache;
  if (
    cache.model !== "text-embedding-3-small" ||
    cache.records.length !== 25 ||
    new Set(cache.records.map((r) => r.id)).size !== 25 ||
    cache.records.some(
      (r) =>
        !bundle.career.documents.some(
          (d) => d.id === r.id && hashText(d.text) === r.hash,
        ) ||
        r.vector.length !== 1536 ||
        !r.vector.every(Number.isFinite),
    )
  )
    throw new Error("invalid_frozen_career_cache");
  const missing = bundle.career.documents.filter(
    (d) => !cache.records.some((r) => r.id === d.id),
  );
  if (
    JSON.stringify(missing.map((d) => d.text)) !==
      JSON.stringify(manifest.embeddingInputs["career-index"]) ||
    JSON.stringify(bundle.portfolioDocuments.map((d) => d.text)) !==
      JSON.stringify(manifest.embeddingInputs["portfolio-index"]) ||
    JSON.stringify(bundle.queries.map((q) => q.query)) !==
      JSON.stringify(manifest.embeddingInputs["query-vectors"])
  )
    throw new Error("embedding_inputs_changed");
  for (const q of bundle.questions)
    if (
      manifest.routingMode[q.id] !==
      (shouldRouteQuestion(requestForSearchCase(bundle, q.id))
        ? "call"
        : "bypass")
    )
      throw new Error("routing_policy_changed");
  return structuredClone(bundle);
}
function vectors(reply: Record<string, unknown>): number[][] {
  return [...(reply.data as Array<{ index: number; embedding: number[] }>)]
    .sort((a, b) => a.index - b.index)
    .map((r) => [...r.embedding]);
}
export function adaptiveIndexes(
  bundle: PublicSearchBundle,
  receipts: Record<string, Record<string, unknown>>,
) {
  const careerNew = vectors(receipts["career-index"]);
  const portfolioNew = vectors(receipts["portfolio-index"]);
  let offset = 0;
  const career: EmbeddingIndex = {
    version: 1,
    model: "text-embedding-3-small",
    corpusHash: corpusHash(bundle.career.documents),
    records: bundle.career.documents.map((d) => ({
      id: d.id,
      hash: hashText(d.text),
      vector:
        bundle.career.cache.records.find((r) => r.id === d.id)?.vector ??
        careerNew[offset++],
    })),
  };
  const portfolio: EmbeddingIndex = {
    version: 1,
    model: "text-embedding-3-small",
    corpusHash: corpusHash(bundle.portfolioDocuments),
    records: bundle.portfolioDocuments.map((d, i) => ({
      id: d.id,
      hash: hashText(d.text),
      vector: portfolioNew[i],
    })),
  };
  if (
    !validIndex(career, bundle.career.documents) ||
    !validIndex(portfolio, bundle.portfolioDocuments)
  )
    throw new Error("fresh_index_invalid");
  return { career, portfolio };
}
export function compareSearchRankings(
  bundle: PublicSearchBundle,
  indexes: ReturnType<typeof adaptiveIndexes>,
  queryVector: (query: string) => number[],
) {
  return (["career", "portfolio"] as const).flatMap((kind) =>
    bundle.retrievalCases[kind].map((c) => {
      const docs =
        kind === "career" ? bundle.career.documents : bundle.portfolioDocuments;
      const options = { projectId: c.projectId, limit: 5 };
      const lexical = rankHybrid(docs, c.query, options).map((h) => h.id);
      const hybrid = rankHybrid(docs, c.query, {
        ...options,
        index: indexes[kind],
        queryVector: queryVector(c.query),
      }).map((h) => h.id);
      return {
        kind,
        id: c.id,
        lexical,
        hybrid,
        lexicalPass: c.expectedIds.some((id) => lexical.includes(id)),
        hybridPass: c.expectedIds.some((id) => hybrid.includes(id)),
      };
    }),
  );
}
export type AdaptiveIO = {
  call: (
    stage: SearchStage,
    id: SearchCase,
    body: string,
  ) => Promise<Record<string, unknown>>;
  queryVector: (query: string) => number[];
  bypassRouting: (id: SearchCase) => void;
  record: (name: string, value: unknown) => void;
};
const critical: Record<SearchCase, RegExp[]> = {
  "patent-measurement": [/100%.*0%/s, /measured set/i],
  ownership: [
    /ownership|owned|directed|defined|prototype/i,
    /AI.assist|not.*sole|implementation/i,
  ],
  onboarding: [/eight.week/i, /No adoption, completion, or business-impact/i],
  "oms-context": [/demo|simulat/i, /production/i],
  qualification: [/does not establish.*HIPAA/i, /qualification/i],
  "role-fit": [
    /evidence|prototype|workflow|evaluation|retrieval/i,
    /does not establish.*HIPAA/i,
  ],
};
export function auditSearchGeneration(
  bundle: PublicSearchBundle,
  id: SearchCase,
  generation: PortfolioGuideGenerationResult,
) {
  const packet = JSON.parse(generation.promptInput) as {
    approvedBlocks: ClaimBlock[];
  };
  const byId = new Map(packet.approvedBlocks.map((b) => [b.id, b]));
  const selected = JSON.parse(generation.rawText) as { blockIds?: string[] };
  if (
    !Array.isArray(selected.blockIds) ||
    selected.blockIds.some((key) => !byId.has(key)) ||
    generation.normalizationStatus !== "selected-blocks"
  )
    throw new Error("invalid_selection_ids_or_fallback");
  const citations = generation.response.citations ?? [];
  if (
    citations.some((c) => {
      const block = byId.get(c.sourceId);
      if (!block) return true;
      const career = c.sourceId.startsWith("career:");
      const expectedUrl = career
        ? bundle.career.items
            .find((item) => `career:${item.id}` === c.sourceId)
            ?.sources?.find((s) => s.url)?.url
        : getPageContextBySlug(block.pageSlug)?.href;
      return (
        c.title !== block.pageTitle ||
        c.kind !== (career ? "approved_career" : "portfolio") ||
        c.url !== expectedUrl
      );
    })
  )
    throw new Error("citation_identity_mismatch");
  if (
    citations.length !== selected.blockIds.length ||
    citations.some(
      (c) =>
        !byId.has(c.sourceId) ||
        c.excerpt !== blockExcerpt(byId.get(c.sourceId)!) ||
        !generation.response.answer.includes(c.excerpt),
    ) ||
    JSON.stringify([...citations.map((c) => c.sourceId)].sort()) !==
      JSON.stringify([...selected.blockIds].sort())
  )
    throw new Error("citation_or_qualification_mismatch");
  if (!critical[id].every((rule) => rule.test(generation.response.answer)))
    throw new Error("critical_source_assertion_failed");
  return { sourceSafety: true, citations: true, qualifications: true };
}
/** Static trusted builder: only frozen requests, validated vectors, existing
 * application retrieval/prompts/rendering, and immutable guard receipts. */
export async function runAdaptiveCase(
  bundle: PublicSearchBundle,
  indexes: ReturnType<typeof adaptiveIndexes>,
  id: SearchCase,
  io: AdaptiveIO,
) {
  const request = requestForSearchCase(bundle, id);
  const careerModule = await import(
    pathToFileURL(resolve(bundle.careerRoot, "lib/evidence/search.ts")).href
  );
  const careerSearch = (careerModule.searchEvidence ??
    careerModule.default?.searchEvidence) as (
    request: unknown,
    options: unknown,
  ) => unknown;
  if (typeof careerSearch !== "function")
    throw new Error("missing_frozen_career_search");
  if (!shouldRouteQuestion(request)) io.bypassRouting(id);
  let routingCalls = 0;
  let selectionCalls = 0;
  let fatalRouting = false;
  const client = {
    responses: {
      create: async (params: Record<string, unknown>) => {
        if (
          fatalRouting ||
          ++selectionCalls !== 1 ||
          params.model !== "gpt-5.6-terra" ||
          params.tools ||
          params.metadata ||
          params.store ||
          params.stream ||
          params.background
        )
          throw new Error("unexpected_application_model_call");
        const data = await io.call(
          "relevance-ID-selection",
          id,
          JSON.stringify({ ...params, store: false, service_tier: "default" }),
        );
        if (
          Array.isArray(data.output) &&
          data.output.some(
            (item: { type?: string }) =>
              item.type !== "message" && item.type !== "reasoning",
          )
        )
          throw new Error("unrequested_model_tool_call");
        return data;
      },
    },
  } as unknown as OpenAI;
  const generation = await generatePortfolioGuideResponse(request, {
    apiKey: "guarded-no-credential",
    model: "gpt-5.6-terra",
    providerLabel: "approved-search-evaluation",
    client,
    hybridSearch: true,
    semanticSearch: true,
    decisions: {
      enabled: true,
      apiKey: "guarded-no-credential",
      timeoutMs: 60_000,
      fetch: async (url, init) => {
        if (
          ++routingCalls !== 1 ||
          String(url) !== "https://api.openai.com/v1/decisions" ||
          init?.body !== JSON.stringify(buildDecisionsRequest(request))
        )
          throw new Error("unexpected_routing_packet");
        try {
          const data = await io.call("routing", id, init.body as string);
          if (!parseRoutingPlan(data)) throw new Error("invalid_routing_plan");
          return new Response(JSON.stringify(data), { status: 200 });
        } catch (error) {
          fatalRouting = true;
          throw error;
        }
      },
    },
    retrieveSources: (r) =>
      retrieveGuideSources(r, {
        portfolioSearch: async (scope) =>
          searchPortfolioFromIndex(
            scope,
            indexes.portfolio,
            io.queryVector(scope.query),
          ),
        careerSearch: async (input) => {
          const result = careerSearch(
            {
              query: input.query,
              filters: { maxResults: input.maxResults },
              context: {
                questionScope: input.questionScope,
                targetProjectId: input.targetProjectId,
              },
            },
            {
              catalog: {
                items: bundle.career.items,
                documents: bundle.career.documents,
              },
              index: indexes.career,
              queryVector: io.queryVector(input.query),
              mode: "hybrid",
            },
          );
          const data = parseEvidenceSearchResponse(result);
          if (
            !data ||
            data.evidence.some(
              (e) =>
                !bundle.career.items.some(
                  (source) =>
                    source.id === e.id &&
                    JSON.stringify(source.claimBoundaries) ===
                      JSON.stringify(e.claimBoundaries),
                ),
            )
          )
            throw new Error("invalid_public_career_replay");
          return { ok: true, data };
        },
      }),
  });
  if (
    selectionCalls !== 1 ||
    routingCalls !== (shouldRouteQuestion(request) ? 1 : 0)
  )
    throw new Error("unexpected_call_count");
  io.record(`generation-${id}`, generation);
  const checks = auditSearchGeneration(bundle, id, generation);
  const evalCase: PortfolioGuideEvalCase = {
    id,
    title: id,
    summary: "Frozen six-case search evaluation",
    category: id === "qualification" ? "unanswerable" : "partial",
    answerability: id === "qualification" ? "unanswerable" : "partial",
    pageSlug: request.pageContext.slug,
    question: request.message,
    judgeExpectations: [
      "Preserve exact source layers, ownership, measurement scope, prototype versus production timing, and unsupported qualifications.",
      "Every displayed factual block and citation must equal its approved qualified source; no invented adoption, completion, business impact or HIPAA certification.",
    ],
  };
  const fullJudge = JSON.parse(buildJudgeInput(evalCase, request, generation));
  const judgeInput = {
    caseId: id,
    currentQuestion: request.message,
    declaredRole: request.sessionContext.visitorIntent,
    pageContext: {
      slug: request.pageContext.slug,
      title: request.pageContext.title,
      claimBoundaries: request.pageContext.claimBoundaries,
    },
    approvedBlocks: fullJudge.approvedBlocks,
    selectionConstraints: fullJudge.selectionConstraints,
    retrievedIds: fullJudge.retrievedIds,
    judgeExpectations: evalCase.judgeExpectations,
    responseToGrade: fullJudge.responseToGrade,
    candidateRelatedPages: fullJudge.candidateRelatedPages,
    sourceRule:
      "Each approved block includes all qualifications. pageSlug identifies its factual source; career-evidence is broader career context. Current-page identity never promotes another source into current-page fact.",
  };
  const judgePacket = {
    model: "gpt-6.1-sol",
    store: false,
    service_tier: "default",
    max_output_tokens: 1200,
    reasoning: { effort: "low" },
    input: [
      { role: "system", content: EVAL_JUDGE_SYSTEM_PROMPT },
      { role: "user", content: JSON.stringify(judgeInput) },
    ],
  };
  io.record(`judge-packet-${id}`, judgePacket);
  const receipt = await io.call(
    "source-aware-judge",
    id,
    JSON.stringify(judgePacket),
  );
  const judgeText = extractResponseText(receipt);
  const rawJudge = JSON.parse(judgeText);
  const scoreKeys = [
    "groundedness",
    "uncertaintyHandling",
    "sourceSeparation",
    "helpfulness",
    "concision",
  ];
  if (
    !["pass", "fail"].includes(rawJudge?.verdict) ||
    typeof rawJudge.summary !== "string" ||
    !rawJudge.summary.trim() ||
    !rawJudge.scores ||
    Object.keys(rawJudge.scores).length !== 5 ||
    scoreKeys.some(
      (key) =>
        !Number.isInteger(rawJudge.scores[key]) ||
        rawJudge.scores[key] < 1 ||
        rawJudge.scores[key] > 5,
    ) ||
    !Array.isArray(rawJudge.issues) ||
    !Array.isArray(rawJudge.strengths) ||
    [...rawJudge.issues, ...rawJudge.strengths].some(
      (s) => typeof s !== "string",
    )
  )
    throw new Error("invalid_judge_schema");
  const judge = normalizeJudgeResult(judgeText);
  const judgePassed =
    judge.passed &&
    rawJudge.issues.length === 0 &&
    judge.scores.groundedness >= 4 &&
    judge.scores.uncertaintyHandling >= 4 &&
    judge.scores.sourceSeparation >= 4 &&
    judge.scores.helpfulness >= 3 &&
    judge.scores.concision >= 3;
  if (!judgePassed) throw new Error("critical_judge_failed");
  return { id, generation, judge, checks: { ...checks, judgePassed } };
}
