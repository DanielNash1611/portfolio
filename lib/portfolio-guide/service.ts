import OpenAI from "openai";
import { getPortfolioGuideModel } from "@/lib/portfolio-guide/model";
import { selectRecommendationsForPage } from "@/lib/portfolio-guide/context";
import { getRelatedPages } from "@/lib/portfolio-guide/related";
import { extractResponseText } from "@/lib/portfolio-guide/prompt";
import type {
  CopilotRequest,
  CopilotResponse,
  EvidenceSummary,
  RelatedPage,
} from "@/lib/portfolio-guide/types";
import {
  buildUnavailableEvidenceResult,
  callEvidenceTool,
  EVIDENCE_FALLBACK_MESSAGES,
  SEARCH_CAREER_EVIDENCE_TOOL_DEFINITION,
  type EvidenceConfig,
  type EvidenceItem,
  type EvidenceSearchResponse,
  type EvidenceUnavailableReason,
} from "@/lib/portfolio-guide/tools/evidence";
import { runMockEvidence } from "@/lib/portfolio-guide/tools/mockEvidence";
import type { EvidenceMetadata } from "@/lib/portfolio-guide/types";
import {
  SEARCH_CONVERSATION_HISTORY_TOOL_DEFINITION,
  type ConversationHistorySearchResult,
} from "@/lib/portfolio-guide/tools/conversation-history";
import type { PortfolioGuideTraceEvent } from "@/lib/portfolio-guide/trace";
import {
  buildClaimInventory,
  CLAIM_SELECTION_PROMPT,
  claimSelectionFormat,
  renderClaimSelection,
} from "./factual-answers";
import {
  routePortfolioQuestion,
  selectRoutedPages,
  retrieveSupportingPages,
  DECISIONS_MODEL,
  ROUTING_VERSION,
  type DecisionsConfig,
  type SupportingPage,
} from "./decisions";

export type PortfolioGuideServiceConfig = {
  apiKey: string;
  model?: string;
  baseURL?: string;
  providerLabel?: string;
  systemPrompt?: string;
  reasoningEffort?: "low" | "medium" | "high";
  client?: OpenAI;
  signal?: AbortSignal;
  decisions?: DecisionsConfig;
  /** When provided, enables the searchCareerEvidence tool (server-side call to ResumeCustomizer). */
  evidenceConfig?: EvidenceConfig;
  /**
   * When true, the evidence tool is served by the in-process local mock instead
   * of a real ResumeCustomizer call. Non-production only; lets the whole
   * evidence path be exercised on localhost. Takes precedence over evidenceConfig.
   */
  evidenceMock?: boolean;
  conversationHistorySearch?: (
    query: string,
    maxResults: number,
  ) => Promise<ConversationHistorySearchResult["messages"]>;
};

export type PortfolioGuideProviderInfo = {
  label: string;
  model: string;
  baseURL?: string;
};

export type PortfolioGuideGenerationResult = {
  promptInput: string;
  rawText: string;
  relatedPages: RelatedPage[];
  response: CopilotResponse;
  normalizationStatus:
    | "normalized-json"
    | "raw-fallback"
    | "selected-blocks"
    | "canonical-fallback";
  provider: PortfolioGuideProviderInfo;
  responseIds?: string[];
  usage?: Record<string, unknown>;
  traceEvents?: PortfolioGuideTraceEvent[];
};

type FunctionCallItem = {
  type: "function_call";
  call_id: string;
  name: string;
  arguments: string;
};

function getResponseOutput(response: unknown): unknown[] {
  const typed = response as { output?: unknown[] };
  return Array.isArray(typed.output) ? typed.output : [];
}

function extractFunctionCalls(response: unknown): FunctionCallItem[] {
  return getResponseOutput(response).filter(
    (item): item is FunctionCallItem =>
      Boolean(item) &&
      typeof item === "object" &&
      (item as Record<string, unknown>).type === "function_call",
  );
}

function buildEvidenceSummaries(
  evidenceItems: EvidenceItem[],
): EvidenceSummary[] {
  return evidenceItems.map((e) => ({
    project: e.project,
    claim: e.claim,
    capabilityTags: e.capabilityTags,
    hasMetrics: e.metrics.length > 0,
  }));
}

function getResponseDiagnostics(response: unknown): {
  id?: string;
  usage?: Record<string, unknown>;
} {
  if (!response || typeof response !== "object") {
    return {};
  }
  const typed = response as { id?: unknown; usage?: unknown };
  return {
    ...(typeof typed.id === "string" ? { id: typed.id } : {}),
    ...(typed.usage && typeof typed.usage === "object"
      ? { usage: typed.usage as Record<string, unknown> }
      : {}),
  };
}

/** Legacy callers receive the same canonical fallback as malformed selections. */
export function applyPortfolioGuideResponseGuardrails(input: {
  request: CopilotRequest;
  response: CopilotResponse;
  fallbackRelatedPages: RelatedPage[];
  routedSourcesAvailable?: boolean;
  supportingPages?: SupportingPage[];
}): CopilotResponse {
  return renderClaimSelection({
    request: input.request,
    blocks: buildClaimInventory(input.request, input.supportingPages),
    rawText: "",
    relatedPages: input.fallbackRelatedPages,
  }).response;
}

/** Only allowlisted IDs influence factual text; model prose is never rendered. */
export function processPortfolioGuideAnswer(input: {
  request: CopilotRequest;
  rawText: string;
  relatedPages: RelatedPage[];
  careerEvidence?: EvidenceSearchResponse;
  routingEnabled?: boolean;
  supportingPages?: SupportingPage[];
}) {
  const result = renderClaimSelection({
    ...input,
    blocks: buildClaimInventory(
      input.request,
      input.supportingPages,
      input.careerEvidence,
    ),
  });
  return {
    normalizedResponse: { answer: input.rawText } as CopilotResponse,
    guardedResponse: result.response,
    finalized: {
      answer: result.response.answer,
      careerEvidenceIds: result.selectedIds
        .filter((id) => id.startsWith("career:"))
        .map((id) => id.slice(7)),
    },
    normalizationStatus: result.status,
  };
}

export async function generatePortfolioGuideResponse(
  request: CopilotRequest,
  config: PortfolioGuideServiceConfig,
): Promise<PortfolioGuideGenerationResult> {
  const {
    apiKey,
    model = getPortfolioGuideModel(),
    baseURL,
    providerLabel = "openai",
    systemPrompt = CLAIM_SELECTION_PROMPT,
    reasoningEffort = "low",
    client = new OpenAI({ apiKey, baseURL }),
    signal,
    evidenceConfig,
    evidenceMock = false,
    conversationHistorySearch,
  } = config;

  // The evidence tool is available when either a real ResumeCustomizer
  // connection is configured or the local mock is enabled. The mock takes
  // precedence so localhost testing never hits a (possibly down) real endpoint.
  const evidenceEnabled = Boolean(evidenceConfig) || evidenceMock;

  const routing = await routePortfolioQuestion(
    request,
    config.decisions,
    signal,
  );
  const fallbackPages = getRelatedPages(
    request.pageContext,
    request.portfolioContext,
    request.sessionContext,
  );
  const relatedPages = routing.plan
    ? selectRoutedPages(request, routing.plan, fallbackPages)
    : fallbackPages;
  const recommendations =
    request.portfolioContext.recommendations ??
    selectRecommendationsForPage(request.pageContext);
  const enrichedRequest: CopilotRequest = {
    ...request,
    portfolioContext: {
      ...request.portfolioContext,
      recommendations,
    },
  };
  let evidenceUsed: EvidenceSummary[] | undefined;
  let resumeCustomizerEvidenceUsed = false;
  let evidenceUnavailableReason: EvidenceUnavailableReason | undefined =
    evidenceEnabled ? undefined : "not_configured";
  const warnings: string[] = [];
  let prefetchedEvidence: EvidenceSearchResponse | undefined;
  if (routing.plan?.searchCareerEvidence) {
    const payload = {
      query: request.message,
      currentPortfolioPage: request.pageContext.slug,
      maxResults: routing.plan.depth === "deep" ? 5 : 3,
    };
    const result = evidenceMock
      ? await runMockEvidence(payload)
      : evidenceConfig
        ? await callEvidenceTool(payload, evidenceConfig, signal)
        : { ok: false as const, reason: "not_configured" as const };
    prefetchedEvidence = result.ok
      ? result.data
      : buildUnavailableEvidenceResult(request.message, result.reason);
    if (prefetchedEvidence.evidence.length) {
      evidenceUsed = buildEvidenceSummaries(prefetchedEvidence.evidence);
      resumeCustomizerEvidenceUsed = true;
    } else {
      evidenceUnavailableReason = result.ok
        ? "no_evidence_found"
        : result.reason;
      prefetchedEvidence.safeFallback ??=
        EVIDENCE_FALLBACK_MESSAGES[evidenceUnavailableReason];
      warnings.push(`evidence_unavailable:${evidenceUnavailableReason}`);
    }
  }
  const supportingPages = routing.plan
    ? retrieveSupportingPages(relatedPages, routing.plan)
    : [];
  const selectionInput = () =>
    JSON.stringify({
      currentQuestion: request.message,
      currentPage: {
        identity: {
          slug: request.pageContext.slug,
          title: request.pageContext.title,
        },
      },
      visitorRole: request.sessionContext.visitorIntent?.normalizedTitle,
      approvedBlocks: buildClaimInventory(
        enrichedRequest,
        supportingPages,
        prefetchedEvidence,
      ),
      candidateRelatedPages: relatedPages,
      ...(routing.plan
        ? {
            routingContext: {
              decisionHints: routing.plan,
              supportingPages,
              ...(prefetchedEvidence
                ? { careerEvidence: prefetchedEvidence }
                : {}),
            },
          }
        : {}),
    });
  let promptInput = selectionInput();
  const traceEvents: PortfolioGuideTraceEvent[] = [];
  const responseIds: string[] = [];
  const responseUsage: Array<Record<string, unknown>> = [];
  let traceSequence = 0;

  const addTrace = (
    event: Omit<PortfolioGuideTraceEvent, "sequence">,
  ): void => {
    traceEvents.push({ sequence: traceSequence, ...event });
    traceSequence += 1;
  };

  addTrace({
    eventType: "model",
    eventName: "decisions.routing",
    payload: {
      model: DECISIONS_MODEL,
      version: ROUTING_VERSION,
      ...routing,
      selectedPageSlugs: relatedPages.map((page) => page.slug),
    },
    durationMs: routing.durationMs,
  });

  // Base input shared by both LLM calls
  const baseInput = [
    {
      role: "system" as const,
      content: routing.plan
        ? `${systemPrompt}\nRouting context supplies canonical supporting pages and optionally prefetched career evidence. Follow the sourceRule: hints are not evidence, keep source layers distinct, retain relevant limitations, and append safeFallback if present.`
        : systemPrompt,
    },
    { role: "user" as const, content: promptInput },
  ];

  // First call: include only the allowlisted tools available for this request.
  type ResponsesCreateParams = Parameters<typeof client.responses.create>[0];
  const availableTools: NonNullable<ResponsesCreateParams["tools"]> = [];
  if (evidenceEnabled && !prefetchedEvidence) {
    availableTools.push(SEARCH_CAREER_EVIDENCE_TOOL_DEFINITION);
  }
  if (conversationHistorySearch) {
    availableTools.push(SEARCH_CONVERSATION_HISTORY_TOOL_DEFINITION);
  }

  const providerStorageParams =
    providerLabel === "openai" && !baseURL
      ? {
          store: true as const,
          metadata: {
            portfolio_guide_conversation:
              request.interactionMeta?.conversationId ?? "stateless",
            portfolio_guide_turn:
              request.interactionMeta?.clientTurnId ?? "unknown",
          },
        }
      : {};

  const runModelCall = async (
    stage: string,
    params: ResponsesCreateParams,
  ): Promise<unknown> => {
    const startedAt = Date.now();
    addTrace({
      eventType: "model",
      eventName: `${stage}.request`,
      payload: {
        model,
        stage,
        toolNames:
          params.tools?.map((tool) =>
            "name" in tool ? tool.name : tool.type,
          ) ?? [],
        input: params.input as unknown,
      },
    });
    try {
      const response = await client.responses.create(
        params,
        signal ? { signal } : undefined,
      );
      const diagnostics = getResponseDiagnostics(response);
      if (diagnostics.id) {
        responseIds.push(diagnostics.id);
      }
      if (diagnostics.usage) {
        responseUsage.push({ stage, ...diagnostics.usage });
      }
      addTrace({
        eventType: "model",
        eventName: `${stage}.response`,
        payload: {
          stage,
          responseId: diagnostics.id,
          usage: diagnostics.usage,
          output: getResponseOutput(response),
        },
        durationMs: Date.now() - startedAt,
      });
      return response;
    } catch (error) {
      addTrace({
        eventType: "error",
        eventName: `${stage}.error`,
        payload: {
          stage,
          message:
            error instanceof Error ? error.message : "Unknown model error",
        },
        durationMs: Date.now() - startedAt,
      });
      throw error;
    }
  };

  const firstCallParams: ResponsesCreateParams = {
    model,
    reasoning: { effort: reasoningEffort },
    input: baseInput,
    ...(availableTools.length > 0 ? { tools: availableTools } : {}),
    ...providerStorageParams,
    text: {
      format: claimSelectionFormat(
        buildClaimInventory(
          enrichedRequest,
          supportingPages,
          prefetchedEvidence,
        ),
      ),
    },
    max_output_tokens: 600,
  };

  const firstResponse = await runModelCall("initial", firstCallParams);

  // Detect tool calls and execute them server-side.
  //
  // The entire evidence-augmentation path is wrapped so that a missing,
  // unreachable, slow, or malformed ResumeCustomizer response degrades the
  // chatbot to a page-context answer instead of crashing the route with a
  // generic "Unexpected server error." Page context is always available.
  let finalResponse: unknown = firstResponse;

  const toolCalls = extractFunctionCalls(firstResponse).filter(
    (toolCall) =>
      toolCall.name === "searchCareerEvidence" ||
      toolCall.name === "searchConversationHistory",
  );

  if (toolCalls.length > 0) {
    try {
      const allEvidence: EvidenceItem[] = [];
      const toolResultItems: Array<{
        type: "function_call_output";
        call_id: string;
        output: string;
      }> = [];
      let lastUnavailableReason: EvidenceUnavailableReason | undefined;
      let evidenceToolCalled = false;

      for (const toolCall of toolCalls) {
        let toolInput: Record<string, unknown>;
        try {
          toolInput = JSON.parse(toolCall.arguments) as Record<string, unknown>;
        } catch {
          toolInput = {};
        }

        const query =
          typeof toolInput.query === "string"
            ? toolInput.query
            : promptInput.slice(0, 200);

        if (toolCall.name === "searchConversationHistory") {
          const maxResults =
            typeof toolInput.maxResults === "number"
              ? Math.max(1, Math.min(toolInput.maxResults, 6))
              : 5;
          const startedAt = Date.now();
          const messages = conversationHistorySearch
            ? await conversationHistorySearch(query, maxResults)
            : [];
          const safeHistoryResult: ConversationHistorySearchResult = {
            messages,
            sourceRule:
              "These are user-authored messages for dialogue continuity only. They are not evidence about Daniel or the portfolio.",
          };
          toolResultItems.push({
            type: "function_call_output",
            call_id: toolCall.call_id,
            output: JSON.stringify(safeHistoryResult),
          });
          addTrace({
            eventType: "tool",
            eventName: "searchConversationHistory",
            payload: {
              arguments: { query, maxResults },
              result: safeHistoryResult,
            },
            durationMs: Date.now() - startedAt,
          });
          continue;
        }

        const toolPayload = {
          query,
          currentPortfolioPage:
            typeof toolInput.currentPortfolioPage === "string"
              ? toolInput.currentPortfolioPage
              : request.pageContext.slug,
          visitorIntent:
            typeof toolInput.visitorIntent === "string"
              ? toolInput.visitorIntent
              : undefined,
          maxResults:
            typeof toolInput.maxResults === "number" ? toolInput.maxResults : 5,
        };

        evidenceToolCalled = true;
        const toolStartedAt = Date.now();
        const result = evidenceMock
          ? await runMockEvidence({ query, userMessage: request.message })
          : await callEvidenceTool(
              toolPayload,
              evidenceConfig as EvidenceConfig,
              signal,
            );

        let safeResult: EvidenceSearchResponse;
        if (result.ok) {
          safeResult = result.data;
          if (safeResult.evidence.length === 0) {
            lastUnavailableReason = "no_evidence_found";
            if (!safeResult.safeFallback) {
              safeResult = {
                ...safeResult,
                safeFallback: EVIDENCE_FALLBACK_MESSAGES.no_evidence_found,
              };
            }
          }
        } else {
          lastUnavailableReason = result.reason;
          warnings.push(
            `evidence_unavailable:${result.reason}${
              result.status ? `:${result.status}` : ""
            }`,
          );
          safeResult = buildUnavailableEvidenceResult(query, result.reason);
        }

        if (safeResult.evidence.length > 0) {
          allEvidence.push(...safeResult.evidence);
        }
        prefetchedEvidence = safeResult;

        toolResultItems.push({
          type: "function_call_output",
          call_id: toolCall.call_id,
          output: JSON.stringify(safeResult),
        });
        addTrace({
          eventType: "tool",
          eventName: "searchCareerEvidence",
          payload: { arguments: toolPayload, result: safeResult },
          durationMs: Date.now() - toolStartedAt,
        });
      }

      if (allEvidence.length > 0) {
        prefetchedEvidence = {
          ...prefetchedEvidence,
          evidence: allEvidence,
          answerability: "high",
        } as EvidenceSearchResponse;
        evidenceUsed = buildEvidenceSummaries(allEvidence);
        resumeCustomizerEvidenceUsed = true;
      } else if (evidenceToolCalled) {
        evidenceUnavailableReason =
          lastUnavailableReason ?? "no_evidence_found";
      }

      // Second call: replay the model's full first-turn output (reasoning
      // items + function_call items, in order) followed by our tool results,
      // then ask for the synthesized answer with no tools.
      //
      // Echoing the whole output (not just the function_call items) is
      // required for reasoning models: the Responses API rejects a
      // function_call that is replayed without its sibling reasoning item.
      promptInput = selectionInput();
      const secondCallInput = [
        ...baseInput,
        ...getResponseOutput(firstResponse),
        ...toolResultItems,
        { role: "user", content: promptInput },
      ] as ResponsesCreateParams["input"];

      finalResponse = await runModelCall("synthesis", {
        model,
        reasoning: { effort: reasoningEffort },
        input: secondCallInput,
        ...providerStorageParams,
        text: {
          format: claimSelectionFormat(
            buildClaimInventory(
              enrichedRequest,
              supportingPages,
              prefetchedEvidence,
            ),
          ),
        },
        max_output_tokens: 600,
      });
    } catch (error) {
      // The evidence augmentation or the synthesis call failed. Recover with
      // a single page-context-only completion so the visitor still gets a
      // useful, grounded answer rather than a server error.
      console.warn(
        "[portfolio-guide] evidence augmentation failed; falling back to page context",
        error,
      );
      evidenceUsed = undefined;
      prefetchedEvidence = buildUnavailableEvidenceResult(
        request.message,
        "evidence_layer_error",
      );
      resumeCustomizerEvidenceUsed = false;
      evidenceUnavailableReason = "evidence_layer_error";
      warnings.push("evidence_layer_error");

      finalResponse = await runModelCall("page_context_fallback", {
        model,
        reasoning: { effort: reasoningEffort },
        input: baseInput,
        ...providerStorageParams,
      });
    }
  }
  // toolCalls.length === 0: the model answered from page context without
  // requesting deeper evidence. Not an error.

  const rawText = extractResponseText(finalResponse);
  if (!rawText) {
    throw new Error("No portfolio guide response was returned.");
  }

  const {
    normalizedResponse,
    guardedResponse,
    finalized,
    normalizationStatus,
  } = processPortfolioGuideAnswer({
    request: enrichedRequest,
    rawText,
    relatedPages,
    careerEvidence: prefetchedEvidence,
    routingEnabled: Boolean(routing.plan),
    supportingPages,
  });
  if (prefetchedEvidence) {
    evidenceUsed = buildEvidenceSummaries(
      prefetchedEvidence.evidence.filter(
        (item) =>
          finalized.careerEvidenceIds?.includes(item.id) ||
          finalized.answer.includes(item.claim),
      ),
    );
    if (!evidenceUsed.length) evidenceUsed = undefined;
    resumeCustomizerEvidenceUsed = Boolean(evidenceUsed?.length);
  }
  if (finalized.answer !== guardedResponse.answer)
    addTrace({
      eventType: "guardrail",
      eventName: "routing_evidence_attribution",
      payload: { before: guardedResponse.answer, after: finalized.answer },
    });

  if (
    guardedResponse.answer !== normalizedResponse.answer ||
    JSON.stringify(guardedResponse.suggestedFollowUps) !==
      JSON.stringify(normalizedResponse.suggestedFollowUps) ||
    JSON.stringify(guardedResponse.relatedPages) !==
      JSON.stringify(normalizedResponse.relatedPages)
  ) {
    addTrace({
      eventType: "guardrail",
      eventName: "response_guardrails_applied",
      payload: {
        before: normalizedResponse,
        after: guardedResponse,
      },
    });
  }

  const evidenceMeta: EvidenceMetadata = {
    pageContextUsed: true,
    resumeCustomizerEvidenceUsed,
    ...(evidenceUnavailableReason ? { evidenceUnavailableReason } : {}),
    ...(warnings.length > 0 ? { warnings } : {}),
  };

  const finalCopilotResponse: CopilotResponse = {
    ...guardedResponse,
    answer: finalized.answer,
    ...(evidenceUsed ? { evidenceUsed } : {}),
    evidenceMeta,
  };

  return {
    promptInput,
    rawText,
    relatedPages,
    response: finalCopilotResponse,
    normalizationStatus,
    provider: {
      label: providerLabel,
      model,
      ...(baseURL ? { baseURL } : {}),
    },
    responseIds,
    usage: {
      responses: responseUsage,
      ...(routing.usage ? { decisions: routing.usage } : {}),
    },
    traceEvents,
  };
}
