import { loadEnvConfig } from "@next/env";

export function loadAppEnv(options?: {
  cwd?: string;
  nodeEnv?: string;
}): {
  loaded: boolean;
  nodeEnv: string;
} {
  const cwd = options?.cwd ?? process.cwd();
  const nodeEnv = options?.nodeEnv ?? process.env.NODE_ENV ?? "development";
  const dev = nodeEnv !== "production";

  loadEnvConfig(cwd, dev);

  return {
    loaded: true,
    nodeEnv,
  };
}

