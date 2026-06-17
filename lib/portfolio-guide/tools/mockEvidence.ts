/**
 * In-process mock for the ResumeCustomizer Claim-to-Evidence API.
 *
 * Lets the portfolio chatbot's evidence path be exercised end-to-end on
 * localhost without the real ResumeCustomizer service running. This is NOT a
 * production component: it is only reachable when
 * PORTFOLIO_GUIDE_EVIDENCE_ENABLE_MOCK=true in a non-production environment,
 * mirroring RESUME_GENERATOR_ENABLE_MOCK / lib/resume-generator/mockEngine.ts.
 *
 * Scenario selection (so every fallback branch is testable from one running
 * server) mirrors the mock engine's FORCE_FAIL convention. Drop a token into the
 * chatbot question, or set PORTFOLIO_GUIDE_EVIDENCE_MOCK_SCENARIO:
 *   (default)                → returns source-audited evidence (happy path)
 *   FORCE_EVIDENCE_EMPTY     → answerable=none, empty evidence (no_evidence_found)
 *   FORCE_EVIDENCE_MALFORMED → unreadable response shape  (invalid_shape)
 *   FORCE_EVIDENCE_HTTP      → upstream 503                (http_error)
 *   FORCE_EVIDENCE_NETWORK   → connection failure          (network_error)
 *   FORCE_EVIDENCE_TIMEOUT   → request timed out           (timeout)
 *
 * The canned evidence mirrors Daniel's real, public claims on the ChatGPT
 * Enterprise page; it is realistic so the rendered UX matches production, but it
 * is fabricated-for-testing and never served outside non-prod mock mode.
 */

import type {
  EvidenceFetchResult,
  EvidenceItem,
  EvidenceSearchResponse,
} from "@/lib/portfolio-guide/tools/evidence";

export type EvidenceMockScenario =
  | "evidence"
  | "empty"
  | "invalid_shape"
  | "http_error"
  | "network_error"
  | "timeout";

const SCENARIO_TOKENS: Array<{ token: RegExp; scenario: EvidenceMockScenario }> = [
  { token: /FORCE_EVIDENCE_EMPTY/i, scenario: "empty" },
  { token: /FORCE_EVIDENCE_MALFORMED/i, scenario: "invalid_shape" },
  { token: /FORCE_EVIDENCE_HTTP/i, scenario: "http_error" },
  { token: /FORCE_EVIDENCE_NETWORK/i, scenario: "network_error" },
  { token: /FORCE_EVIDENCE_TIMEOUT/i, scenario: "timeout" },
];

const ENV_SCENARIOS: Record<string, EvidenceMockScenario> = {
  evidence: "evidence",
  empty: "empty",
  invalid_shape: "invalid_shape",
  malformed: "invalid_shape",
  http_error: "http_error",
  http: "http_error",
  network_error: "network_error",
  network: "network_error",
  timeout: "timeout",
};

/** True only when explicit non-production mock mode is enabled. */
export function isEvidenceMockEnabled(): boolean {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.PORTFOLIO_GUIDE_EVIDENCE_ENABLE_MOCK?.trim().toLowerCase() ===
      "true"
  );
}

/**
 * Resolve which scenario to play: a token in the visitor's message wins (lets a
 * single running server hit every branch), otherwise the env default, otherwise
 * the happy path.
 */
export function resolveEvidenceMockScenario(
  userMessage?: string,
): EvidenceMockScenario {
  if (userMessage) {
    for (const { token, scenario } of SCENARIO_TOKENS) {
      if (token.test(userMessage)) {
        return scenario;
      }
    }
  }

  const envScenario = process.env.PORTFOLIO_GUIDE_EVIDENCE_MOCK_SCENARIO?.trim().toLowerCase();
  if (envScenario && ENV_SCENARIOS[envScenario]) {
    return ENV_SCENARIOS[envScenario];
  }

  return "evidence";
}

const CHATGPT_ENTERPRISE_EVIDENCE: EvidenceItem[] = [
  {
    id: "mock-chatgpt-enterprise-pilot-roi",
    claim:
      "Daniel launched Guitar Center's first ChatGPT Enterprise pilot and delivered ~$2.7M annualized impact.",
    supportingDetails: [
      "Ran a six-month matched-control pilot to isolate the pilot's contribution.",
      "Measured impact via Revenue Per Call, Items Per Transaction, and Average Order Value plus supporting efficiency signals.",
    ],
    project: "ChatGPT Enterprise pilot",
    capabilityTags: ["applied_ai", "experimentation", "measurement"],
    metricTags: ["roi", "pilot"],
    metrics: [
      {
        label: "Annualized impact",
        value: "~$2.7M",
        context: "Six-month matched-control pilot",
      },
    ],
    sourceAudit: {
      status: "verified",
      sourceType: "exec_readout",
      lastReviewedAt: "2026-06-11",
    },
    visibility: "public_safe",
    recommendedUse: "ROI evidence for the ChatGPT Enterprise pilot impact claim.",
  },
  {
    id: "mock-chatgpt-enterprise-adoption-scale",
    claim:
      "Daniel scaled ChatGPT Enterprise adoption roughly 7x in licensed users and 20x in daily active users.",
    supportingDetails: [
      "Expanded from ~150 licensed users / ~40 DAU to ~1,000 users / ~800 DAU.",
      "Drove adoption through governance, enablement, a champions network, and a repeatable operating model.",
    ],
    project: "ChatGPT Enterprise expansion",
    capabilityTags: ["enablement", "operating_model", "change_management"],
    metricTags: ["adoption"],
    metrics: [
      {
        label: "Licensed users",
        value: "~150 → ~1,000",
        context: "Pilot to expansion",
      },
      {
        label: "Daily active users",
        value: "~40 → ~800",
        context: "Pilot to expansion",
      },
    ],
    sourceAudit: {
      status: "verified",
      sourceType: "internal_record",
      lastReviewedAt: "2026-06-11",
    },
    visibility: "public_safe",
    recommendedUse:
      "Adoption-scale evidence supporting the pilot's organizational impact.",
  },
  {
    id: "mock-chatgpt-enterprise-reusable-tools",
    claim:
      "Daniel built reusable GPT-powered tools that extended the pilot's value beyond chat.",
    supportingDetails: [
      "Shipped reusable GPT tools that teams adopted into recurring workflows.",
    ],
    project: "ChatGPT Enterprise tooling",
    capabilityTags: ["applied_ai", "product_leadership"],
    metricTags: [],
    metrics: [],
    sourceAudit: {
      status: "partially-verified",
      sourceType: "internal_record",
      lastReviewedAt: "2026-06-11",
    },
    visibility: "public_safe",
    recommendedUse: "Supporting evidence for reusable GPT tooling.",
  },
];

function buildEvidenceResponse(query: string): EvidenceSearchResponse {
  return {
    query,
    answerability: "high",
    confidence: "high",
    evidence: CHATGPT_ENTERPRISE_EVIDENCE,
    relatedCapabilities: [
      "applied ai",
      "enablement",
      "governance",
      "measurement",
    ],
    suggestedPortfolioAngle:
      "Lead with the matched-control rigor, then the ROI and adoption scale.",
  };
}

/**
 * Produce a mock {@link EvidenceFetchResult} for the requested scenario. Same
 * return contract as callEvidenceTool, so the service treats mock and real
 * results identically.
 */
export async function runMockEvidence(input: {
  query: string;
  userMessage?: string;
  scenario?: EvidenceMockScenario;
}): Promise<EvidenceFetchResult> {
  const scenario =
    input.scenario ?? resolveEvidenceMockScenario(input.userMessage);

  switch (scenario) {
    case "empty":
      return {
        ok: true,
        data: {
          query: input.query,
          answerability: "none",
          confidence: "low",
          evidence: [],
        },
      };
    case "invalid_shape":
      return { ok: false, reason: "invalid_shape" };
    case "http_error":
      return { ok: false, reason: "http_error", status: 503 };
    case "network_error":
      return { ok: false, reason: "network_error" };
    case "timeout":
      return { ok: false, reason: "timeout" };
    case "evidence":
    default:
      return { ok: true, data: buildEvidenceResponse(input.query) };
  }
}
