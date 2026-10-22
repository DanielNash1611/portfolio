/**
 * Claim-to-Evidence tool for the Portfolio Site chatbot.
 *
 * Defines the searchCareerEvidence tool and the server-side HTTP caller that
 * retrieves public-safe, source-audited career evidence from ResumeCustomizer.
 *
 * Security: the API key is NEVER returned to the client. All calls are
 * server-side only. Do not re-export evidenceConfig or any key values.
 */

// ── Tool definition (OpenAI Responses API format) ──────────────────────────────

export const SEARCH_CAREER_EVIDENCE_TOOL_DEFINITION = {
  type: "function" as const,
  name: "searchCareerEvidence",
  description:
    "Search Daniel's source-audited, public-safe career evidence from the ResumeCustomizer system. " +
    "Use this when the visitor asks about Daniel's experience, skills, metrics, product leadership, AI systems, " +
    "career proof points, or claims not fully answered by visible portfolio content. " +
    "Do not use this for general web facts or unrelated questions.",
  strict: false,
  parameters: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "The visitor's question or capability being evaluated",
      },
      currentPortfolioPage: {
        type: "string",
        description: "The current portfolio page slug (e.g. 'ai-platform-mcp')",
      },
      visitorIntent: {
        type: "string",
        description:
          "Visitor type: hiring_manager, recruiter, or technical_leader",
      },
      maxResults: {
        type: "number",
        description: "Max evidence items to return (1–6)",
      },
    },
    required: ["query"],
  },
} as const;

// ── Response types (matches ResumeCustomizer /api/evidence/search contract) ───

export type EvidenceMetric = {
  label: string;
  value: string;
  context: string;
};

export type EvidenceSourceAudit = {
  status: "verified" | "partially-verified" | "unverified";
  sourceType: string;
  lastReviewedAt: string | null;
};

export type EvidenceItem = {
  id: string;
  projectId?: string;
  sources?: Array<{ title: string; kind: string; url?: string }>;
  claimBoundaries?: string[];
  sourceRefCount?: number;
  strength?: string;
  claim: string;
  supportingDetails: string[];
  project: string;
  capabilityTags: string[];
  metricTags: string[];
  metrics: EvidenceMetric[];
  sourceAudit: EvidenceSourceAudit;
  visibility: string;
  recommendedUse: string;
};

export type EvidenceSearchResponse = {
  contractVersion?: string;
  retrievalMeta?: {
    mode: string;
    corpusSize: number;
    candidateIds: string[];
    coverage: number;
    unsupportedQualification?: string;
  };
  query: string;
  answerability: "high" | "medium" | "low" | "none";
  confidence: "high" | "medium" | "low";
  evidence: EvidenceItem[];
  relatedCapabilities?: string[];
  suggestedPortfolioAngle?: string;
  safeFallback?: string;
};

export type EvidenceToolInput = {
  query: string;
  currentPortfolioPage?: string;
  visitorIntent?: string;
  maxResults?: number;
  questionScope?: "page" | "project" | "broad";
  targetProjectId?: string;
};

export type EvidenceConfig = {
  apiUrl: string;
  apiKey: string;
};

/**
 * Why the deeper (ResumeCustomizer) evidence layer could not be used for a turn.
 * Distinguishes "the API said it has nothing" (no_evidence_found) from the
 * various ways the integration itself can be unavailable, so the chatbot can
 * choose the right user-facing fallback message.
 */
export type EvidenceUnavailableReason =
  | "not_configured"
  | "no_evidence_found"
  | "timeout"
  | "network_error"
  | "http_error"
  | "invalid_json"
  | "invalid_shape"
  | "evidence_layer_error";

/** Result of a single evidence-search attempt. Never throws. */
export type EvidenceFetchResult =
  | { ok: true; data: EvidenceSearchResponse }
  | { ok: false; reason: EvidenceUnavailableReason; status?: number };

/** Calm, user-facing fallback copy per unavailability reason. */
export const EVIDENCE_FALLBACK_MESSAGES: Record<
  EvidenceUnavailableReason,
  string
> = {
  not_configured:
    "Daniel's source-checked personal career notes weren't available for this response. This answer uses published portfolio sources.",
  no_evidence_found:
    "I can answer from published portfolio sources, but I don't currently have source-audited ResumeCustomizer evidence for that specific claim.",
  timeout:
    "I couldn't retrieve Daniel's source-checked personal career notes in time. This answer uses published portfolio sources.",
  network_error:
    "I couldn't reach the deeper evidence layer, so I'm limiting this answer to published portfolio sources.",
  http_error:
    "I couldn't reach the deeper evidence layer, so I'm limiting this answer to published portfolio sources.",
  invalid_json:
    "The deeper evidence layer returned a response I couldn't read, so I'm limiting this answer to published portfolio sources.",
  invalid_shape:
    "The deeper evidence layer returned a response I couldn't read, so I'm limiting this answer to published portfolio sources.",
  evidence_layer_error:
    "I couldn't reach the deeper evidence layer, so I'm limiting this answer to published portfolio sources.",
};

/** One cold-start-tolerant attempt, including body parsing, within the route's 60s limit. */
export const EVIDENCE_FETCH_TIMEOUT_MS = 40000;

/**
 * Build a safe, well-formed EvidenceSearchResponse for the LLM's tool-result
 * context when the real evidence layer could not be used. Carries a
 * reason-specific safeFallback the model is instructed to surface verbatim.
 */
export function buildUnavailableEvidenceResult(
  query: string,
  reason: EvidenceUnavailableReason,
): EvidenceSearchResponse {
  return {
    query,
    answerability: "none",
    confidence: "low",
    evidence: [],
    safeFallback: EVIDENCE_FALLBACK_MESSAGES[reason],
  };
}

// ── Defensive response parsing ────────────────────────────────────────────────

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function parseRetrievalMeta(
  raw: Record<string, unknown>,
): NonNullable<EvidenceSearchResponse["retrievalMeta"]> {
  return {
    mode: typeof raw.mode === "string" ? raw.mode : "unknown",
    corpusSize: typeof raw.corpusSize === "number" ? raw.corpusSize : 0,
    candidateIds: asStringArray(raw.candidateIds),
    coverage: typeof raw.coverage === "number" ? raw.coverage : 0,
    ...(typeof raw.unsupportedQualification === "string"
      ? { unsupportedQualification: raw.unsupportedQualification }
      : {}),
  };
}

function parseEvidenceItem(raw: unknown): EvidenceItem | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const item = raw as Record<string, unknown>;
  const metrics: EvidenceMetric[] = (
    Array.isArray(item.metrics) ? item.metrics : []
  )
    .filter(
      (metric): metric is Record<string, unknown> =>
        Boolean(metric) && typeof metric === "object",
    )
    .map((metric) => ({
      label: typeof metric.label === "string" ? metric.label : "",
      value:
        typeof metric.value === "string"
          ? metric.value
          : metric.value == null
            ? ""
            : String(metric.value),
      context: typeof metric.context === "string" ? metric.context : "",
    }));

  const sourceAuditRaw =
    item.sourceAudit && typeof item.sourceAudit === "object"
      ? (item.sourceAudit as Record<string, unknown>)
      : {};
  const status = sourceAuditRaw.status;

  return {
    id: typeof item.id === "string" ? item.id : "",
    claim: typeof item.claim === "string" ? item.claim : "",
    supportingDetails: asStringArray(item.supportingDetails),
    project: typeof item.project === "string" ? item.project : "",
    capabilityTags: asStringArray(item.capabilityTags),
    metricTags: asStringArray(item.metricTags),
    metrics,
    sourceAudit: {
      status:
        status === "verified" ||
        status === "partially-verified" ||
        status === "unverified"
          ? status
          : "unverified",
      sourceType:
        typeof sourceAuditRaw.sourceType === "string"
          ? sourceAuditRaw.sourceType
          : "unknown",
      lastReviewedAt:
        typeof sourceAuditRaw.lastReviewedAt === "string"
          ? sourceAuditRaw.lastReviewedAt
          : null,
    },
    ...(typeof item.projectId === "string"
      ? { projectId: item.projectId }
      : {}),
    ...(Array.isArray(item.claimBoundaries)
      ? { claimBoundaries: asStringArray(item.claimBoundaries) }
      : {}),
    ...(typeof item.sourceRefCount === "number"
      ? { sourceRefCount: item.sourceRefCount }
      : {}),
    ...(typeof item.strength === "string" ? { strength: item.strength } : {}),
    ...(Array.isArray(item.sources)
      ? {
          sources: item.sources
            .filter(
              (s): s is { title: string; kind: string; url?: string } =>
                Boolean(s) &&
                typeof s === "object" &&
                typeof s.title === "string",
            )
            .map((s) => ({
              title: s.title,
              kind: s.kind,
              ...(typeof s.url === "string" &&
              /^https:\/\/www\.danielnash\.co\//.test(s.url)
                ? { url: s.url }
                : {}),
            })),
        }
      : {}),
    visibility: typeof item.visibility === "string" ? item.visibility : "",
    recommendedUse:
      typeof item.recommendedUse === "string" ? item.recommendedUse : "",
  };
}

/**
 * Defensively validate and normalize an evidence-search response. Returns null
 * when the payload does not even carry an `evidence` array (unexpected shape);
 * otherwise guarantees every field downstream code reads is present and typed,
 * so a partial/garbage payload can never crash the chatbot route.
 */
export function parseEvidenceSearchResponse(
  raw: unknown,
): EvidenceSearchResponse | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return null;
  }

  const payload = raw as Record<string, unknown>;
  if (
    payload.contractVersion !== undefined &&
    payload.contractVersion !== "evidence.v1"
  )
    return null;
  if (!Array.isArray(payload.evidence)) {
    return null;
  }

  const evidence = payload.evidence
    .map(parseEvidenceItem)
    .filter(
      (item): item is EvidenceItem =>
        item !== null &&
        item.id.trim().length > 0 &&
        item.claim.trim().length > 0 &&
        item.visibility === "public_safe" &&
        item.sourceAudit.status === "verified",
    );

  const answerability = payload.answerability;
  const confidence = payload.confidence;

  return {
    ...(typeof payload.contractVersion === "string"
      ? { contractVersion: payload.contractVersion }
      : {}),
    ...(payload.retrievalMeta && typeof payload.retrievalMeta === "object"
      ? {
          retrievalMeta: parseRetrievalMeta(
            payload.retrievalMeta as Record<string, unknown>,
          ),
        }
      : {}),
    query: typeof payload.query === "string" ? payload.query : "",
    answerability:
      evidence.length === 0
        ? "none"
        : answerability === "high" ||
            answerability === "medium" ||
            answerability === "low" ||
            answerability === "none"
          ? answerability
          : evidence.length > 0
            ? "medium"
            : "none",
    confidence:
      evidence.length === 0
        ? "low"
        : confidence === "high" ||
            confidence === "medium" ||
            confidence === "low"
          ? confidence
          : "low",
    evidence,
    ...(Array.isArray(payload.relatedCapabilities)
      ? { relatedCapabilities: asStringArray(payload.relatedCapabilities) }
      : {}),
    ...(typeof payload.suggestedPortfolioAngle === "string"
      ? { suggestedPortfolioAngle: payload.suggestedPortfolioAngle }
      : {}),
    ...(typeof payload.safeFallback === "string"
      ? { safeFallback: payload.safeFallback }
      : {}),
  };
}

// ── HTTP caller (server-side only) ────────────────────────────────────────────

/**
 * Build an AbortSignal that aborts on either an internal timeout or the
 * caller's signal. Returns a cleanup() to detach listeners on the fallback path.
 */
function withTimeoutSignal(
  timeoutMs: number,
  external?: AbortSignal,
): { signal: AbortSignal; timeoutSignal: AbortSignal; cleanup: () => void } {
  const timeoutSignal = AbortSignal.timeout(timeoutMs);

  if (!external) {
    return { signal: timeoutSignal, timeoutSignal, cleanup: () => {} };
  }

  if (typeof AbortSignal.any === "function") {
    return {
      signal: AbortSignal.any([timeoutSignal, external]),
      timeoutSignal,
      cleanup: () => {},
    };
  }

  // Fallback for runtimes without AbortSignal.any.
  const controller = new AbortController();
  const onAbort = () => controller.abort();
  if (external.aborted || timeoutSignal.aborted) {
    controller.abort();
  }
  external.addEventListener("abort", onAbort, { once: true });
  timeoutSignal.addEventListener("abort", onAbort, { once: true });

  return {
    signal: controller.signal,
    timeoutSignal,
    cleanup: () => {
      external.removeEventListener("abort", onAbort);
      timeoutSignal.removeEventListener("abort", onAbort);
    },
  };
}

/**
 * Call the ResumeCustomizer evidence search API server-to-server.
 *
 * Never throws and never returns malformed data: every failure mode (network,
 * timeout, non-2xx, unreadable body, unexpected shape) is mapped to a typed
 * {@link EvidenceFetchResult} so callers degrade gracefully to page context.
 */
export async function callEvidenceTool(
  input: EvidenceToolInput,
  config: EvidenceConfig,
  signal?: AbortSignal,
): Promise<EvidenceFetchResult> {
  const url = `${config.apiUrl.replace(/\/$/, "")}/api/evidence/search`;

  const requestBody = {
    query: input.query,
    audience: (input.visitorIntent ?? "hiring_manager") as
      | "hiring_manager"
      | "recruiter"
      | "technical_leader",
    context: {
      source: "portfolio_chatbot",
      ...(input.questionScope ? { questionScope: input.questionScope } : {}),
      ...(input.targetProjectId
        ? { targetProjectId: input.targetProjectId }
        : {}),
      ...(input.currentPortfolioPage
        ? { currentPortfolioPage: input.currentPortfolioPage }
        : {}),
      ...(input.visitorIntent ? { visitorIntent: input.visitorIntent } : {}),
    },
    filters: {
      publicSafeOnly: true,
      sourceAuditedOnly: true,
      maxResults: Math.min(Math.max(1, input.maxResults ?? 5), 6),
    },
  };

  const {
    signal: fetchSignal,
    timeoutSignal,
    cleanup,
  } = withTimeoutSignal(EVIDENCE_FETCH_TIMEOUT_MS, signal);

  let readingBody = false;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
        "X-Evidence-Source": "portfolio_chatbot",
      },
      body: JSON.stringify(requestBody),
      signal: fetchSignal,
      cache: "no-store",
    });
    fetchSignal.throwIfAborted();
    if (!response.ok) {
      console.warn(
        "[portfolio-guide:evidence] non-ok response",
        response.status,
      );
      return { ok: false, reason: "http_error", status: response.status };
    }
    readingBody = true;
    const json: unknown = await response.json();
    fetchSignal.throwIfAborted();
    readingBody = false;
    const parsed = parseEvidenceSearchResponse(json);
    if (!parsed) {
      console.warn(
        "[portfolio-guide:evidence] unexpected response shape (no evidence array)",
      );
      return { ok: false, reason: "invalid_shape" };
    }
    return { ok: true, data: parsed };
  } catch (error) {
    const reason: EvidenceUnavailableReason = timeoutSignal.aborted
      ? "timeout"
      : fetchSignal.aborted
        ? "network_error"
        : readingBody
          ? "invalid_json"
          : "network_error";
    console.warn(`[portfolio-guide:evidence] fetch failed (${reason})`, error);
    return { ok: false, reason };
  } finally {
    cleanup();
  }
}
