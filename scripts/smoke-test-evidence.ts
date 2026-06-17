/**
 * Smoke test for the chatbot's evidence path against the local mock.
 *
 * Exercises every branch the evidence layer can take — happy path plus each
 * graceful-fallback reason — without running the real ResumeCustomizer service.
 * Calls the real generatePortfolioGuideResponse (so it makes real OpenAI calls;
 * OPENAI_API_KEY must be set) and prints the answer + evidenceMeta per scenario.
 *
 * Run: npx tsx scripts/smoke-test-evidence.ts
 */

import { loadAppEnv } from "./load-app-env";

loadAppEnv();

// Force the local mock on for this run regardless of .env, so the script is
// self-contained and never depends on ResumeCustomizer being up.
process.env.PORTFOLIO_GUIDE_EVIDENCE_ENABLE_MOCK = "true";

import { getPageContextBySlug, getPortfolioContext } from "@/lib/portfolio-guide/context";
import { generatePortfolioGuideResponse } from "@/lib/portfolio-guide/service";
import type { CopilotRequest } from "@/lib/portfolio-guide/types";

const BASE_QUESTION =
  "Use ResumeCustomizer evidence if available: what source-audited bullets support the ChatGPT Enterprise pilot impact claim?";

const scenarios: Array<{ label: string; message: string; expectReason?: string }> = [
  { label: "happy path — evidence woven in", message: BASE_QUESTION },
  {
    label: "no evidence found",
    message: `${BASE_QUESTION} FORCE_EVIDENCE_EMPTY`,
    expectReason: "no_evidence_found",
  },
  {
    label: "unreadable response shape",
    message: `${BASE_QUESTION} FORCE_EVIDENCE_MALFORMED`,
    expectReason: "invalid_shape",
  },
  {
    label: "upstream http error",
    message: `${BASE_QUESTION} FORCE_EVIDENCE_HTTP`,
    expectReason: "http_error",
  },
  {
    label: "network failure",
    message: `${BASE_QUESTION} FORCE_EVIDENCE_NETWORK`,
    expectReason: "network_error",
  },
  {
    label: "timeout",
    message: `${BASE_QUESTION} FORCE_EVIDENCE_TIMEOUT`,
    expectReason: "timeout",
  },
];

function buildRequest(message: string): CopilotRequest {
  const pageContext = getPageContextBySlug("chatgpt-enterprise");
  if (!pageContext) {
    throw new Error("chatgpt-enterprise page context not found");
  }
  return {
    message,
    pageContext,
    portfolioContext: getPortfolioContext(),
    sessionContext: {
      visitedPages: ["chatgpt-enterprise"],
      clickedPrompts: [],
      askedQuestions: [message],
      inferredInterestTags: [],
    },
  };
}

async function main(): Promise<void> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("OPENAI_API_KEY is required to run this smoke test.");
    process.exit(1);
  }
  const model = process.env.OPENAI_MODEL || "gpt-5";

  let failures = 0;

  for (const scenario of scenarios) {
    console.log("\n".padEnd(80, "="));
    console.log(`SCENARIO: ${scenario.label}`);
    console.log("=".repeat(79));

    try {
      const { response } = await generatePortfolioGuideResponse(
        buildRequest(scenario.message),
        { apiKey, model, evidenceMock: true },
      );

      const meta = response.evidenceMeta;
      const reason = meta?.evidenceUnavailableReason;
      const reasonOk =
        scenario.expectReason === undefined
          ? reason === undefined
          : reason === scenario.expectReason;

      console.log(`evidenceUsed:                 ${meta?.resumeCustomizerEvidenceUsed}`);
      console.log(`evidenceUnavailableReason:    ${reason ?? "(none)"}`);
      console.log(`warnings:                     ${JSON.stringify(meta?.warnings ?? [])}`);
      console.log(`reason matches expectation:   ${reasonOk ? "PASS" : "FAIL"}`);
      console.log(`\nANSWER:\n${response.answer}`);
      if (response.evidenceUsed?.length) {
        console.log(
          `\nevidenceUsed projects: ${response.evidenceUsed.map((e) => e.project).join(", ")}`,
        );
      }

      if (!reasonOk) {
        failures += 1;
      }
    } catch (error) {
      failures += 1;
      console.error(`THREW (this should never happen): ${String(error)}`);
    }
  }

  console.log("\n".padEnd(80, "="));
  console.log(failures === 0 ? "ALL SCENARIOS OK" : `${failures} SCENARIO(S) FAILED`);
  process.exit(failures === 0 ? 0 : 1);
}

void main();
