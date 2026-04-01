import OpenAI from "openai";
import type { EvalProviderConfig } from "@/lib/portfolio-guide/evals/provider";

export type PortfolioGuideEvalProviderPreflight = {
  availableModels: string[];
};

export async function verifyOpenAiCompatibleProvider(
  config: EvalProviderConfig,
): Promise<PortfolioGuideEvalProviderPreflight> {
  const client = new OpenAI({
    apiKey: config.apiKey,
    ...(config.baseURL ? { baseURL: config.baseURL } : {}),
  });
  const models = await client.models.list();
  const availableModels = models.data.map((model) => model.id);

  if (!availableModels.includes(config.model)) {
    throw new Error(
      [
        `Model "${config.model}" was not found at ${config.baseURL ?? "the configured provider"}.`,
        `Available models: ${availableModels.join(", ") || "none returned"}.`,
      ].join(" "),
    );
  }

  return {
    availableModels,
  };
}
