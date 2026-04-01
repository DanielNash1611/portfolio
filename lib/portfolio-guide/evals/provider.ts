import OpenAI from "openai";
import { generatePortfolioGuideResponse } from "@/lib/portfolio-guide/service";
import { createOpenAiPortfolioGuideJudge } from "@/lib/portfolio-guide/evals/judge";
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
  config: EvalProviderConfig & { systemPrompt?: string },
): PortfolioGuideEvalAssistant {
  const client = new OpenAI({
    apiKey: config.apiKey,
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
    });
}

export function createPortfolioGuideJudge(
  config: EvalProviderConfig,
): PortfolioGuideEvalJudge {
  const client = new OpenAI({
    apiKey: config.apiKey,
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
