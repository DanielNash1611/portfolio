// Server-side proxy to the ResumeCustomizer internal engine (contract §2).
//
// SERVER-ONLY. This module injects the bearer token and talks to the internal
// `/api/v1/*` API. It must never be imported by client components. When the
// engine isn't configured it transparently falls back to the in-memory mock
// (mockEngine.ts) so the public API and UX work end-to-end during development.
//
// Callers (the public route handlers) receive internal-shaped envelopes and are
// responsible for translating them into the public envelope, including
// rewriting the internal `pdfPath` to a same-origin `downloadUrl`.

import { getResumeEngineConfig } from "./config";
import {
  mockCreateJob,
  mockGetJob,
  mockGetPdf,
} from "./mockEngine";
import type {
  InternalCreateRequest,
  InternalCreateResponse,
  InternalJobEnvelope,
  InternalPdfResult,
} from "./engineTypes";

export class EngineUnavailableError extends Error {
  constructor(message = "Resume engine is temporarily unavailable.") {
    super(message);
    this.name = "EngineUnavailableError";
  }
}

function authHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function createEngineJob(
  req: InternalCreateRequest,
): Promise<InternalCreateResponse> {
  const config = getResumeEngineConfig();

  if (config.mockMode) {
    return mockCreateJob(req);
  }

  let response: Response;
  try {
    response = await fetch(`${config.baseUrl}/api/v1/resume-jobs`, {
      method: "POST",
      headers: authHeaders(config.token as string),
      body: JSON.stringify(req),
      cache: "no-store",
    });
  } catch (error) {
    console.error("[resume-generator:engine] create fetch failed", error);
    throw new EngineUnavailableError();
  }

  if (response.status === 413) {
    // Re-surface the size cap as a structured error for the caller.
    throw new PayloadTooLargeError();
  }
  if (!response.ok) {
    console.error(
      "[resume-generator:engine] create returned",
      response.status,
    );
    throw new EngineUnavailableError();
  }

  return (await response.json()) as InternalCreateResponse;
}

export async function getEngineJob(
  jobId: string,
): Promise<InternalJobEnvelope | null> {
  const config = getResumeEngineConfig();

  if (config.mockMode) {
    return mockGetJob(jobId);
  }

  let response: Response;
  try {
    response = await fetch(
      `${config.baseUrl}/api/v1/resume-jobs/${encodeURIComponent(jobId)}`,
      {
        headers: authHeaders(config.token as string),
        cache: "no-store",
      },
    );
  } catch (error) {
    console.error("[resume-generator:engine] status fetch failed", error);
    throw new EngineUnavailableError();
  }

  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    console.error(
      "[resume-generator:engine] status returned",
      response.status,
    );
    throw new EngineUnavailableError();
  }

  return (await response.json()) as InternalJobEnvelope;
}

export async function getEnginePdf(jobId: string): Promise<InternalPdfResult> {
  const config = getResumeEngineConfig();

  if (config.mockMode) {
    return mockGetPdf(jobId);
  }

  let response: Response;
  try {
    response = await fetch(
      `${config.baseUrl}/api/v1/resume-jobs/${encodeURIComponent(jobId)}/pdf`,
      {
        headers: { Authorization: `Bearer ${config.token as string}` },
        cache: "no-store",
      },
    );
  } catch (error) {
    console.error("[resume-generator:engine] pdf fetch failed", error);
    throw new EngineUnavailableError();
  }

  if (response.status === 404) {
    return { ok: false, status: "not_found" };
  }
  if (response.status === 409) {
    return { ok: false, status: "not_ready" };
  }
  if (response.status === 410) {
    return { ok: false, status: "expired" };
  }
  if (!response.ok) {
    throw new EngineUnavailableError();
  }

  const arrayBuffer = await response.arrayBuffer();
  const disposition = response.headers.get("content-disposition") ?? "";
  const match = disposition.match(/filename="?([^"]+)"?/i);
  return {
    ok: true,
    bytes: new Uint8Array(arrayBuffer),
    filename: match?.[1] ?? `DanielNash_Resume_${jobId}.pdf`,
  };
}

export class PayloadTooLargeError extends Error {
  constructor(message = "Payload exceeds the allowed size.") {
    super(message);
    this.name = "PayloadTooLargeError";
  }
}
