// Server-side configuration for the resume generator engine boundary.
//
// When the ResumeCustomizer engine is deployed as a separate service, set:
//   RESUME_CUSTOMIZER_API_BASE_URL  – internal engine base URL (server-only)
//   RESUME_CUSTOMIZER_API_TOKEN     – shared bearer token (server-only)
//
// Neither value is ever exposed to the browser. The in-memory mock engine is
// only available in non-production when RESUME_GENERATOR_ENABLE_MOCK=true.

export type ResumeEngineConfig = {
  baseUrl: string | null;
  token: string | null;
  configured: boolean;
  /** True only for explicit non-production mock mode. */
  mockMode: boolean;
};

export function isMockResumeEngineEnabled(): boolean {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.RESUME_GENERATOR_ENABLE_MOCK?.trim().toLowerCase() === "true"
  );
}

export function getResumeEngineConfig(): ResumeEngineConfig {
  const baseUrl = process.env.RESUME_CUSTOMIZER_API_BASE_URL?.trim() || null;
  const token = process.env.RESUME_CUSTOMIZER_API_TOKEN?.trim() || null;
  const configured = Boolean(baseUrl && token);

  return {
    baseUrl,
    token,
    configured,
    mockMode: !configured && isMockResumeEngineEnabled(),
  };
}
