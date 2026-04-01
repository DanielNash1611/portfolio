import { loadEnvConfig } from "@next/env";

export type PortfolioGuideEvalEnvLoadResult = {
  loaded: boolean;
  nodeEnv: string;
};

export function loadPortfolioGuideEvalEnv(options?: {
  cwd?: string;
  nodeEnv?: string;
}): PortfolioGuideEvalEnvLoadResult {
  const cwd = options?.cwd ?? process.cwd();
  const nodeEnv = options?.nodeEnv ?? process.env.NODE_ENV ?? "development";

  if (nodeEnv === "production") {
    return {
      loaded: false,
      nodeEnv,
    };
  }

  loadEnvConfig(cwd, nodeEnv !== "production");

  return {
    loaded: true,
    nodeEnv,
  };
}
