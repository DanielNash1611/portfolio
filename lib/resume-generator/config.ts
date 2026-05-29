// Server-side configuration for the resume generator engine boundary.
//
// When the ResumeCustomizer engine is deployed as a separate service, set:
//   RESUME_CUSTOMIZER_API_BASE_URL  – internal engine base URL (server-only)
//   RESUME_CUSTOMIZER_API_TOKEN     – shared bearer token (server-only)
//
// Neither value is ever exposed to the browser. Until both are present the
// public API runs against an in-memory mock engine so the recruiter-facing UX
// can be developed and demoed end-to-end (see ./mockEngine.ts).

export type ResumeEngineConfig = {
  baseUrl: string | null;
  token: string | null;
  /** True when the real engine isn't configured and the mock should be used. */
  mockMode: boolean;
};

export function getResumeEngineConfig(): ResumeEngineConfig {
  const baseUrl = process.env.RESUME_CUSTOMIZER_API_BASE_URL?.trim() || null;
  const token = process.env.RESUME_CUSTOMIZER_API_TOKEN?.trim() || null;

  return {
    baseUrl,
    token,
    mockMode: !baseUrl || !token,
  };
}
