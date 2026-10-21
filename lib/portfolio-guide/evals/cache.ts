import type { PortfolioGuideGenerationResult } from "../service";

/** Reuse successful captured generations, never fallback/error output. */
export function isCacheableGeneration(value: unknown): value is PortfolioGuideGenerationResult {
  if (!value || typeof value !== "object") return false;
  const generation = value as PortfolioGuideGenerationResult;
  return typeof generation.rawText === "string" &&
    ["normalized-json", "selected-blocks"].includes(generation.normalizationStatus) &&
    typeof generation.response?.answer === "string" && generation.response.answer.trim().length > 0;
}
