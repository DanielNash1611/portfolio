import assert from "node:assert/strict";
import test from "node:test";
import OpenAI from "openai";
import { generatePortfolioGuideResponse } from "@/lib/portfolio-guide/service";

test("a provider failure makes one attempt even when the injected SDK permits retries", async () => {
  let attempts = 0;
  const client = new OpenAI({
    apiKey: "synthetic-only",
    maxRetries: 2,
    fetch: async (_url, init) => {
      attempts++;
      const request = JSON.parse(String(init?.body));
      assert.equal(request.max_output_tokens, 600);
      return new Response(JSON.stringify({ error: { message: "synthetic provider failure" } }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    },
  });
  await assert.rejects(
    generatePortfolioGuideResponse({
      message: "What did Daniel own here?",
      pageContext: { slug: "synthetic", href: "/work/synthetic", title: "Synthetic public page" },
      portfolioContext: {},
      sessionContext: { visitedPages: [], clickedPrompts: [], askedQuestions: [], inferredInterestTags: [] },
    }, { apiKey: "synthetic-only", client, decisions: { enabled: false, apiKey: "synthetic-only" } }),
    /synthetic provider failure/,
  );
  assert.equal(attempts, 1);
});
