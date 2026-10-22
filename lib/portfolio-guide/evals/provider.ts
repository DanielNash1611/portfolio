import { getResumeEngineConfig } from "@/lib/resume-generator/config";
import { searchFrozenEvidence } from "./frozen-evidence";
import { retrieveGuideSources } from "../retrieval";
import OpenAI from "openai";
import { generatePortfolioGuideResponse } from "@/lib/portfolio-guide/service";
import { createOpenAiPortfolioGuideJudge } from "@/lib/portfolio-guide/evals/judge";
import type { DecisionsConfig } from "../decisions";
import type {
  PortfolioGuideEvalAssistant,
  PortfolioGuideEvalJudge,
} from "@/lib/portfolio-guide/evals/types";

export type EvalProviderMode =
  | "openai"
  | "local-answer-remote-judge"
  | "local-answer-no-judge"
  | "local-answer-local-judge";

export type EvalProviderConfig = {
  label: string;
  model: string;
  apiKey: string;
  baseURL?: string;
};

export function createPortfolioGuideAssistant(
  config: EvalProviderConfig & {
    systemPrompt?: string;
    retrievalEnabled?: boolean;
    live?: boolean;
    liveEvidence?: boolean;
    decisions?: DecisionsConfig;
  },
): PortfolioGuideEvalAssistant {
  const client = new OpenAI({
    apiKey: config.apiKey,
    maxRetries: 0,
    fetch: (input, init) => globalThis.fetch(input, init),
    ...(config.baseURL ? { baseURL: config.baseURL } : {}),
  });

  return async ({ request, signal }) =>
    generatePortfolioGuideResponse(request, {
      apiKey: config.apiKey,
      model: config.model,
      baseURL: config.baseURL,
      providerLabel: config.label,
      systemPrompt: config.systemPrompt,
      client,
      signal,
      decisions: config.decisions ?? { enabled: false, apiKey: "disabled-not-used" },
      hybridSearch: config.retrievalEnabled ?? false,
      semanticSearch: config.live === true,
      ...(config.retrievalEnabled && !config.liveEvidence ? {
        retrieveSources: (request) => retrieveGuideSources(request, { semantic: false, careerSearch: searchFrozenEvidence }),
      } : {}),
      ...(config.liveEvidence && getResumeEngineConfig().configured ? { evidenceConfig: {
        apiUrl: getResumeEngineConfig().baseUrl!, apiKey: getResumeEngineConfig().token!,
      }} : {}),
    });
}

export function createPortfolioGuideJudge(
  config: EvalProviderConfig,
): PortfolioGuideEvalJudge {
  const client = new OpenAI({
    apiKey: config.apiKey,
    maxRetries: 0,
    fetch: (input, init) => globalThis.fetch(input, init),
    ...(config.baseURL ? { baseURL: config.baseURL } : {}),
  });

  return createOpenAiPortfolioGuideJudge({
    apiKey: config.apiKey,
    model: config.model,
    providerLabel: config.label,
    baseURL: config.baseURL,
    client,
  });
}
