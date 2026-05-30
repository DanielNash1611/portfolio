// Shared types for the role-specific resume generator.
//
// These mirror the public API surface defined in
// docs/role-specific-resume-generator-contract.md (§3 public API, §4 status
// values, §5 error model, §6 caps). They are intentionally framework-agnostic
// so they can be imported by both the browser client service and the
// server-side route handlers.

/** Hard cap on pasted/extracted JD text. Contract §6. */
export const RESUME_JD_MAX_CHARS = 50_000;

/** Hard cap on uploaded files. Contract §6 (2 MB). */
export const RESUME_FILE_MAX_BYTES = 2 * 1024 * 1024;

/**
 * Recruiter-facing time expectation. The contract's engine reports its own
 * `estimatedSeconds`, but the product copy always communicates "about 10
 * minutes" so expectations are set regardless of queue depth.
 */
export const RESUME_ESTIMATED_SECONDS = 600;

/** The nine canonical job statuses. Contract §4. */
export type ResumeJobStatus =
  | "queued"
  | "analyzing_jd"
  | "mapping_experience"
  | "drafting_resume"
  | "reviewing"
  | "rendering_pdf"
  | "ready"
  | "failed"
  | "expired";

export const TERMINAL_STATUSES: readonly ResumeJobStatus[] = [
  "ready",
  "failed",
  "expired",
];

/**
 * The ordered, non-terminal progression a healthy job moves through, plus the
 * terminal `ready` state. Used by the UI to render a forward-only stepper.
 */
export const RESUME_PROGRESS_ORDER: readonly ResumeJobStatus[] = [
  "queued",
  "analyzing_jd",
  "mapping_experience",
  "drafting_resume",
  "reviewing",
  "rendering_pdf",
  "ready",
];

export const RESUME_STATUS_LABELS: Record<ResumeJobStatus, string> = {
  queued: "Queued",
  analyzing_jd: "Analyzing the job description",
  mapping_experience: "Mapping Daniel's experience to the role",
  drafting_resume: "Drafting the tailored resume",
  reviewing: "Reviewing for accuracy",
  rendering_pdf: "Rendering the PDF",
  ready: "Ready to download",
  failed: "Generation failed",
  expired: "Download expired",
};

export function isTerminalStatus(status: string): boolean {
  return (TERMINAL_STATUSES as readonly string[]).includes(status);
}

/** Canonical error codes. Contract §5. */
export type ResumeErrorCode =
  | "invalid_request"
  | "invalid_jd"
  | "not_found"
  | "not_ready"
  | "expired"
  | "payload_too_large"
  | "rate_limited"
  | "engine_failed"
  | "email_send_failed"
  | "unavailable";

export type ResumeJobError = {
  code: ResumeErrorCode;
  message: string;
  retryable: boolean;
};

export type JobDescriptionInput = {
  /** Required. Plain text or markdown JD content. */
  text: string;
  /** Optional source URL of the posting. Never placed in our own URLs. */
  sourceUrl?: string;
  company?: string;
  roleTitle?: string;
};

export type CreateJobRequest = {
  jobDescription: JobDescriptionInput;
  variantHint?: string;
};

/** Response from the public create endpoint. Contract §3.1. */
export type CreateJobResponse = {
  jobId: string;
  status: ResumeJobStatus;
  expiresAt: string;
  pollUrl: string;
  estimatedSeconds: number;
};

export type ResumeJobProgress = {
  phase: ResumeJobStatus;
  percent: number;
  detail?: string;
};

/**
 * Public-facing result. Note `downloadUrl` is the same-origin portfolio path,
 * NOT the internal engine `pdfPath` — the proxy rewrites it (contract §3.2).
 */
export type ResumeJobResult = {
  pdfAvailable: boolean;
  filename: string;
  downloadUrl: string;
  fitSummary?: string;
  company?: string;
  roleTitle?: string;
};

/** Public status envelope. Contract §3.2 / §2.2. */
export type JobStatusResponse = {
  jobId: string;
  status: ResumeJobStatus;
  progress?: ResumeJobProgress | null;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  result: ResumeJobResult | null;
  error: ResumeJobError | null;
};

export type EmailDeliveryRequest = {
  recipientEmail: string;
  /** Opt-in only; defaults to false (contract decision #7). */
  ccDaniel?: boolean;
  note?: string;
};

export type EmailDeliveryResponse = {
  ok: boolean;
  emailed: boolean;
  ccDaniel: boolean;
  /**
   * True when the request was accepted but actual delivery is owned by a
   * separate workstream (Thread E) and not yet wired up.
   */
  pending?: boolean;
  message?: string;
  error?: string;
};
