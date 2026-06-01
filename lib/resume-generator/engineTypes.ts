// Internal engine API shapes (ResumeCustomizer side, contract §2).
//
// These are server-only and never reach the browser. The public route handlers
// translate them into the public envelope (types.ts) — notably rewriting the
// internal `pdfPath` into a same-origin public `downloadUrl`.

import type {
  ResumeJobError,
  ResumeJobProgress,
  ResumeJobStatus,
} from "./types";

export type InternalCreateRequest = {
  jobDescription: {
    text: string;
    sourceUrl?: string;
    company?: string;
    roleTitle?: string;
  };
  variantHint?: string;
  clientRequestId: string;
};

export type InternalCreateResponse = {
  jobId: string;
  status: ResumeJobStatus;
  createdAt: string;
  expiresAt: string;
  estimatedSeconds: number;
};

export type InternalJobResult = {
  pdfAvailable: boolean;
  filename: string;
  byteSize?: number;
  company?: string;
  roleTitle?: string;
  fitSummary?: string;
  /** Internal download path, e.g. /api/v1/resume-jobs/{id}/pdf. */
  pdfPath: string;
  /**
   * True when the engine that produced this result was a non-production mock/
   * stub. Derived server-side by ResumeCustomizer (or the portfolio mock
   * engine); never client-controllable. Used to label mock/test output.
   */
  mock?: boolean;
};

export type InternalJobEnvelope = {
  jobId: string;
  status: ResumeJobStatus;
  progress?: ResumeJobProgress | null;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  result: InternalJobResult | null;
  error: ResumeJobError | null;
};

/** Result of a PDF fetch from the engine. */
export type InternalPdfResult =
  | { ok: true; bytes: Uint8Array; filename: string }
  | { ok: false; status: "not_found" | "not_ready" | "expired" };
