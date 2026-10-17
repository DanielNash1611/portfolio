export const PORTFOLIO_GUIDE_DEFAULT_MODEL = "gpt-5.6-terra";

export function getPortfolioGuideModel(
  env: NodeJS.ProcessEnv = process.env,
): string {
  return (
    env.PORTFOLIO_GUIDE_MODEL ||
    env.OPENAI_MODEL ||
    PORTFOLIO_GUIDE_DEFAULT_MODEL
  );
}
