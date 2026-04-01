import type { EvalProviderMode, EvalProviderConfig } from "@/lib/portfolio-guide/evals/provider";

export type EvalCliOptions = {
  providerMode?: string;
  assistantBaseUrl?: string;
  assistantApiKey?: string;
  assistantModel?: string;
  assistantTimeoutMs?: number;
  judgeBaseUrl?: string;
  judgeApiKey?: string;
  judgeModel?: string;
  judgeTimeoutMs?: number;
  noJudge?: boolean;
};

export type EvalResolvedConfig = {
  providerMode: EvalProviderMode;
  assistant: EvalProviderConfig;
  judge?: EvalProviderConfig;
  timeouts: {
    assistantMs: number;
    judgeMs: number;
  };
};

type EnvMap = NodeJS.ProcessEnv;

export const DEFAULT_LOCAL_OPENAI_BASE_URL = "http://127.0.0.1:11434/v1";
export const DEFAULT_LOCAL_API_KEY = "ollama";
export const DEFAULT_ASSISTANT_TIMEOUT_MS = 90_000;
export const DEFAULT_JUDGE_TIMEOUT_MS = 60_000;

function getOption(
  cliValue: string | undefined,
  envValue: string | undefined,
  fallback?: string,
): string | undefined {
  return cliValue ?? envValue ?? fallback;
}

function requireValue(value: string | undefined, message: string): string {
  if (!value || !value.trim()) {
    throw new Error(message);
  }

  return value;
}

function parseTimeoutValue(
  value: number | string | undefined,
  fallback: number,
  label: string,
): number {
  if (value === undefined || value === "") {
    return fallback;
  }

  const parsed =
    typeof value === "number" ? value : Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`${label} must be a positive integer.`);
  }

  return parsed;
}

function isProviderMode(value: string): value is EvalProviderMode {
  return [
    "openai",
    "local-answer-remote-judge",
    "local-answer-no-judge",
    "local-answer-local-judge",
  ].includes(value);
}

export function resolveEvalRunnerConfig(
  cliOptions: EvalCliOptions,
  env: EnvMap = process.env,
): EvalResolvedConfig {
  const providerModeRaw = getOption(
    cliOptions.providerMode,
    env.PORTFOLIO_GUIDE_EVAL_PROVIDER_MODE,
    "local-answer-remote-judge",
  );
  if (!providerModeRaw || !isProviderMode(providerModeRaw)) {
    throw new Error(
      `Unsupported provider mode "${providerModeRaw}".`,
    );
  }

  const localAssistantByDefault = providerModeRaw !== "openai";
  const assistantBaseUrl = getOption(
    cliOptions.assistantBaseUrl,
    env.PORTFOLIO_GUIDE_EVAL_ASSISTANT_BASE_URL,
    localAssistantByDefault ? DEFAULT_LOCAL_OPENAI_BASE_URL : undefined,
  );
  const assistantApiKey = getOption(
    cliOptions.assistantApiKey,
    env.PORTFOLIO_GUIDE_EVAL_ASSISTANT_API_KEY,
    localAssistantByDefault ? DEFAULT_LOCAL_API_KEY : env.OPENAI_API_KEY,
  );
  const assistantModel = getOption(
    cliOptions.assistantModel,
    env.PORTFOLIO_GUIDE_EVAL_ASSISTANT_MODEL,
    localAssistantByDefault
      ? env.OLLAMA_MODEL ?? env.PORTFOLIO_GUIDE_LOCAL_MODEL ?? "gpt-oss"
      : env.OPENAI_MODEL ?? "gpt-5.4",
  );

  const assistant: EvalProviderConfig = {
    label: localAssistantByDefault ? "local-openai-compatible" : "openai",
    model: requireValue(
      assistantModel,
      "An assistant model is required for portfolio guide evals.",
    ),
    apiKey: requireValue(
      assistantApiKey,
      localAssistantByDefault
        ? "A local assistant API key placeholder is required."
        : "OPENAI_API_KEY is required for remote assistant evals.",
    ),
    ...(assistantBaseUrl ? { baseURL: assistantBaseUrl } : {}),
  };
  const timeouts = {
    assistantMs: parseTimeoutValue(
      cliOptions.assistantTimeoutMs,
      parseTimeoutValue(
        env.PORTFOLIO_GUIDE_EVAL_ASSISTANT_TIMEOUT_MS,
        DEFAULT_ASSISTANT_TIMEOUT_MS,
        "PORTFOLIO_GUIDE_EVAL_ASSISTANT_TIMEOUT_MS",
      ),
      "assistant timeout",
    ),
    judgeMs: parseTimeoutValue(
      cliOptions.judgeTimeoutMs,
      parseTimeoutValue(
        env.PORTFOLIO_GUIDE_EVAL_JUDGE_TIMEOUT_MS,
        DEFAULT_JUDGE_TIMEOUT_MS,
        "PORTFOLIO_GUIDE_EVAL_JUDGE_TIMEOUT_MS",
      ),
      "judge timeout",
    ),
  };

  const noJudge =
    cliOptions.noJudge === true ||
    providerModeRaw === "local-answer-no-judge";
  if (noJudge) {
    return {
      providerMode: providerModeRaw,
      assistant,
      timeouts,
    };
  }

  const judgeIsLocal = providerModeRaw === "local-answer-local-judge";
  const judgeBaseUrl = getOption(
    cliOptions.judgeBaseUrl,
    env.PORTFOLIO_GUIDE_EVAL_JUDGE_BASE_URL,
    judgeIsLocal ? DEFAULT_LOCAL_OPENAI_BASE_URL : undefined,
  );
  const judgeApiKey = getOption(
    cliOptions.judgeApiKey,
    env.PORTFOLIO_GUIDE_EVAL_JUDGE_API_KEY,
    judgeIsLocal ? DEFAULT_LOCAL_API_KEY : env.OPENAI_API_KEY,
  );
  const judgeModel = getOption(
    cliOptions.judgeModel,
    env.PORTFOLIO_GUIDE_EVAL_JUDGE_MODEL,
    judgeIsLocal
      ? env.OLLAMA_JUDGE_MODEL ?? env.OLLAMA_MODEL ?? env.PORTFOLIO_GUIDE_LOCAL_MODEL ?? "llama3.1"
      : env.OPENAI_EVAL_JUDGE_MODEL ?? "gpt-5-mini",
  );

  const judge: EvalProviderConfig = {
    label: judgeIsLocal ? "local-openai-compatible" : "openai",
    model: requireValue(
      judgeModel,
      "A judge model is required when judge mode is enabled.",
    ),
    apiKey: requireValue(
      judgeApiKey,
      judgeIsLocal
        ? "A local judge API key placeholder is required."
        : "OPENAI_API_KEY is required for judge evals.",
    ),
    ...(judgeBaseUrl ? { baseURL: judgeBaseUrl } : {}),
  };

  return {
    providerMode: providerModeRaw,
    assistant,
    judge,
    timeouts,
  };
}
