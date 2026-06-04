// Browser-facing client service for the resume generator.
//
// IMPORTANT: this talks ONLY to same-origin portfolio API routes under
// /api/resume-generator/*. It never references the ResumeCustomizer engine,
// its base URL, or any token — those live strictly on the server (contract §1,
// §6). Keep this file free of any engine/internal imports.

import type {
  CreateJobRequest,
  CreateJobResponse,
  EmailDeliveryRequest,
  EmailDeliveryResponse,
  JobStatusResponse,
  ResumeErrorCode,
} from "./types";
import { isTerminalStatus } from "./types";

const BASE = "/api/resume-generator/jobs";

export class ResumeClientError extends Error {
  code: ResumeErrorCode | "network";
  retryable: boolean;

  constructor(
    message: string,
    code: ResumeErrorCode | "network",
    retryable = false,
  ) {
    super(message);
    this.name = "ResumeClientError";
    this.code = code;
    this.retryable = retryable;
  }
}

async function parseError(
  response: Response,
  fallback: string,
): Promise<ResumeClientError> {
  try {
    const data = (await response.json()) as {
      error?: { code?: ResumeErrorCode; message?: string; retryable?: boolean };
    };
    if (data?.error) {
      return new ResumeClientError(
        data.error.message ?? fallback,
        data.error.code ?? "unavailable",
        Boolean(data.error.retryable),
      );
    }
  } catch {
    // fall through to generic error
  }
  return new ResumeClientError(fallback, "unavailable");
}

export async function createResumeJob(
  request: CreateJobRequest,
): Promise<CreateJobResponse> {
  let response: Response;
  try {
    response = await fetch(BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
  } catch {
    throw new ResumeClientError(
      "We couldn't reach the resume service. Check your connection and try again.",
      "network",
      true,
    );
  }

  if (!response.ok) {
    throw await parseError(
      response,
      "We couldn't start generation right now. Please try again.",
    );
  }

  return (await response.json()) as CreateJobResponse;
}

export async function getResumeJobStatus(
  jobId: string,
): Promise<JobStatusResponse> {
  let response: Response;
  try {
    response = await fetch(`${BASE}/${encodeURIComponent(jobId)}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
  } catch {
    throw new ResumeClientError(
      "We lost connection while checking on your resume.",
      "network",
      true,
    );
  }

  if (!response.ok) {
    throw await parseError(
      response,
      "We couldn't check the status of your resume.",
    );
  }

  return (await response.json()) as JobStatusResponse;
}

/** Same-origin public download URL for a ready job (no email required). */
export function resumeDownloadUrl(jobId: string): string {
  return `${BASE}/${encodeURIComponent(jobId)}/pdf`;
}

export async function requestEmailDelivery(
  jobId: string,
  payload: EmailDeliveryRequest,
): Promise<EmailDeliveryResponse> {
  let response: Response;
  try {
    response = await fetch(`${BASE}/${encodeURIComponent(jobId)}/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new ResumeClientError(
      "We couldn't reach the email service. Your download is still available.",
      "network",
      true,
    );
  }

  const data = (await response.json().catch(() => null)) as
    | EmailDeliveryResponse
    | null;

  if (!response.ok || !data) {
    throw new ResumeClientError(
      data?.error ?? "We couldn't send the email. Your download is still available.",
      "email_send_failed",
      true,
    );
  }

  return data;
}

type PollOptions = {
  onUpdate?: (status: JobStatusResponse) => void;
  signal?: AbortSignal;
};

const sleep = (ms: number, signal?: AbortSignal): Promise<void> =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });

/**
 * Polls a job until it reaches a terminal status. Follows the contract's
 * cadence guidance: every 2s for the first 30s, then 5s (contract §2.2).
 */
export async function pollResumeJob(
  jobId: string,
  { onUpdate, signal }: PollOptions = {},
): Promise<JobStatusResponse> {
  const start = Date.now();

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const status = await getResumeJobStatus(jobId);
    onUpdate?.(status);

    if (isTerminalStatus(status.status)) {
      return status;
    }

    const interval = Date.now() - start < 30_000 ? 2_000 : 5_000;
    await sleep(interval, signal);
  }
}
