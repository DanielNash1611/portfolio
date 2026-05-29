import { loadAppEnv } from "./load-app-env";

loadAppEnv();

import { getPageContextBySlug, getPortfolioContext } from "@/lib/portfolio-guide/context";
import { generatePortfolioGuideResponse } from "@/lib/portfolio-guide/service";
import type { CopilotRequest } from "@/lib/portfolio-guide/types";

type Scenario = {
  label: string;
  pageSlug: string;
  message: string;
};

const scenarios: Scenario[] = [
  {
    label: "ChatGPT Enterprise — director-level signal (user's headline case)",
    pageSlug: "chatgpt-enterprise",
    message: "How senior is the signal on this page? Can Daniel handle director-level work?",
  },
  {
    label: "ChatGPT Enterprise — stakeholder evidence",
    pageSlug: "chatgpt-enterprise",
    message: "What did stakeholders think of this work?",
  },
  {
    label: "AI Platform MCP — supporting evidence question",
    pageSlug: "ai-platform-mcp",
    message: "What evidence supports this work?",
  },
  {
    label: "ChatGPT Enterprise — non-rec control",
    pageSlug: "chatgpt-enterprise",
    message: "What were the specific metrics from the pilot?",
  },
  {
    label: "Checkout redesign — design/engineering perspective",
    pageSlug: "checkout-redesign",
    message: "What do designers and engineers say about working with Daniel?",
  },
];

function buildRequest(pageSlug: string, message: string): CopilotRequest | null {
  const pageContext = getPageContextBySlug(pageSlug);
  if (!pageContext) {
    return null;
  }
  return {
    message,
    pageContext,
    portfolioContext: getPortfolioContext(),
    sessionContext: {
      visitedPages: [pageSlug],
      clickedPrompts: [],
      askedQuestions: [],
      inferredInterestTags: [],
    },
  };
}

async function run(): Promise<void> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("OPENAI_API_KEY is not set. Aborting.");
    process.exit(1);
  }

  for (const scenario of scenarios) {
    console.log(`\n=== ${scenario.label} ===`);
    console.log(`Page: ${scenario.pageSlug}`);
    console.log(`Q: ${scenario.message}`);

    const request = buildRequest(scenario.pageSlug, scenario.message);
    if (!request) {
      console.error(`  ! No page context for slug ${scenario.pageSlug}`);
      continue;
    }

    const startedAt = Date.now();
    try {
      const result = await generatePortfolioGuideResponse(request, {
        apiKey,
        model: process.env.OPENAI_MODEL || "gpt-5",
        reasoningEffort: "low",
      });
      const ms = Date.now() - startedAt;
      console.log(`A (${ms}ms):\n${result.response.answer}\n`);
      if (result.response.suggestedFollowUps?.length) {
        console.log(`Follow-ups: ${JSON.stringify(result.response.suggestedFollowUps)}`);
      }
      const recs = request.portfolioContext.recommendations;
      const summary = recs
        ? `current=${recs.currentPage.length} linked=${recs.projectLinked.length} broader=${recs.broader.length}`
        : "n/a (filtered in service)";
      console.log(`Recs injected: ${summary}`);
    } catch (error) {
      console.error(`  ! Error after ${Date.now() - startedAt}ms:`, error);
    }
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
