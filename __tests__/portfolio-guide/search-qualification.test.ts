import assert from "node:assert/strict";
import test from "node:test";
import type OpenAI from "openai";
import { getPageContextBySlug, getPortfolioContext } from "@/lib/portfolio-guide/context";
import { generatePortfolioGuideResponse } from "@/lib/portfolio-guide/service";

test("unsupported requested qualification is explicit without inventing a global career gap", async () => {
  const client = { responses: { create: async () => ({ output_text: '{"blockIds":[]}' }) } } as unknown as OpenAI;
  const result = await generatePortfolioGuideResponse({
    message: "Is Daniel HIPAA certified for clinical research?",
    pageContext: getPageContextBySlug("immunology-scout")!,
    portfolioContext: getPortfolioContext(),
    sessionContext: { visitedPages: [], clickedPrompts: [], askedQuestions: [], inferredInterestTags: [] },
  }, { apiKey: "fixture", client, hybridSearch: true, semanticSearch: false });
  assert.match(result.response.answer, /retrieved public evidence does not establish the requested HIPAA qualification/);
  assert.doesNotMatch(result.response.answer, /Daniel lacks|Daniel has no/);
  assert.deepEqual(result.response.citations, []);
});
