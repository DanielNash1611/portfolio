// In-memory mock of the ResumeCustomizer internal engine (contract §2).
//
// This exists so the recruiter-facing UX (Thread that owns /resume/generate)
// can be built and demoed before the real engine is deployed. It is NOT a
// production component: state lives in a module-level Map, so it does not
// survive cold starts or span multiple serverless instances. When the real
// engine is configured (RESUME_CUSTOMIZER_API_BASE_URL + _TOKEN), the proxy in
// engineClient.ts bypasses this entirely.
//
// Behavior:
//  - Jobs advance forward-only through the nine statuses on a wall-clock
//    timeline compressed to RESUME_MOCK_DURATION_MS (default ~36s) so the
//    status UI is observable. Recruiter-facing copy still says "~10 minutes".
//  - A JD containing the token "FORCE_FAIL" produces a `failed` job, and
//    "FORCE_UNAVAILABLE" is handled upstream — both make error states testable.
//  - Jobs expire after 60 minutes (contract §7).

import { randomBytes } from "crypto";
import type { ResumeJobStatus } from "./types";
import type {
  InternalCreateRequest,
  InternalCreateResponse,
  InternalJobEnvelope,
  InternalPdfResult,
} from "./engineTypes";

const RETENTION_MS = 60 * 60 * 1000; // 60 minutes
const MOCK_DURATION_MS = Number(process.env.RESUME_MOCK_DURATION_MS) || 36_000;

type MockJob = {
  jobId: string;
  clientRequestId: string;
  createdAt: number;
  jd: InternalCreateRequest["jobDescription"];
  variantHint?: string;
  shouldFail: boolean;
};

// Module-level stores (dev/demo only).
const jobs = new Map<string, MockJob>();
const byClientRequestId = new Map<string, string>();

const STAGES: { status: ResumeJobStatus; until: number; detail: string }[] = [
  { status: "queued", until: 0.04, detail: "Accepted, waiting to start." },
  {
    status: "analyzing_jd",
    until: 0.2,
    detail: "Parsing the job description.",
  },
  {
    status: "mapping_experience",
    until: 0.42,
    detail: "Mapping verified experience to the role's requirements.",
  },
  {
    status: "drafting_resume",
    until: 0.66,
    detail: "Generating the tailored resume draft.",
  },
  {
    status: "reviewing",
    until: 0.86,
    detail: "Review agents checking accuracy and fit.",
  },
  {
    status: "rendering_pdf",
    until: 1,
    detail: "Rendering the final PDF.",
  },
];

function newJobId(): string {
  return `rsj_${randomBytes(16).toString("hex")}`;
}

function safeSegment(value: string | undefined, fallback: string): string {
  const cleaned = (value ?? "")
    .replace(/[^a-zA-Z0-9]+/g, "")
    .slice(0, 40);
  return cleaned || fallback;
}

function filenameFor(job: MockJob): string {
  const role = safeSegment(job.jd.roleTitle, "Role");
  const company = safeSegment(job.jd.company, "Company");
  return `DanielNash_Resume_${role}_${company}.pdf`;
}

function elapsedFraction(job: MockJob, now: number): number {
  return Math.min(1, Math.max(0, (now - job.createdAt) / MOCK_DURATION_MS));
}

function computeEnvelope(job: MockJob, now: number): InternalJobEnvelope {
  const createdAt = new Date(job.createdAt).toISOString();
  const expiresAt = new Date(job.createdAt + RETENTION_MS).toISOString();
  const updatedAt = new Date(now).toISOString();

  const base = {
    jobId: job.jobId,
    createdAt,
    updatedAt,
    expiresAt,
  };

  if (now - job.createdAt >= RETENTION_MS) {
    return { ...base, status: "expired", progress: null, result: null, error: null };
  }

  const fraction = elapsedFraction(job, now);

  // Failures surface once the pipeline would have reached the review stage.
  if (job.shouldFail && fraction >= 0.86) {
    return {
      ...base,
      status: "failed",
      progress: null,
      result: null,
      error: {
        code: "engine_failed",
        message:
          "The generation pipeline could not complete this resume. Please try again.",
        retryable: true,
      },
    };
  }

  if (fraction >= 1 && !job.shouldFail) {
    const filename = filenameFor(job);
    return {
      ...base,
      status: "ready",
      progress: { phase: "ready", percent: 100 },
      error: null,
      result: {
        pdfAvailable: true,
        filename,
        byteSize: 0,
        company: job.jd.company,
        roleTitle: job.jd.roleTitle,
        fitSummary:
          "Tailored from Daniel's verified experience. No employers, titles, dates, or outcomes were invented.",
        // Internal path; the public proxy rewrites this to a same-origin URL.
        pdfPath: `/api/v1/resume-jobs/${job.jobId}/pdf`,
      },
    };
  }

  const stage =
    STAGES.find((s) => fraction <= s.until) ?? STAGES[STAGES.length - 1];
  return {
    ...base,
    status: stage.status,
    progress: {
      phase: stage.status,
      percent: Math.round(fraction * 100),
      detail: stage.detail,
    },
    result: null,
    error: null,
  };
}

export function mockCreateJob(
  req: InternalCreateRequest,
): InternalCreateResponse {
  const existingId = byClientRequestId.get(req.clientRequestId);
  if (existingId) {
    const existing = jobs.get(existingId);
    if (existing && Date.now() - existing.createdAt < RETENTION_MS) {
      return {
        jobId: existing.jobId,
        status: "queued",
        createdAt: new Date(existing.createdAt).toISOString(),
        expiresAt: new Date(existing.createdAt + RETENTION_MS).toISOString(),
        estimatedSeconds: 600,
      };
    }
  }

  const jobId = newJobId();
  const job: MockJob = {
    jobId,
    clientRequestId: req.clientRequestId,
    createdAt: Date.now(),
    jd: req.jobDescription,
    variantHint: req.variantHint,
    shouldFail: /FORCE_FAIL/i.test(req.jobDescription.text),
  };
  jobs.set(jobId, job);
  byClientRequestId.set(req.clientRequestId, jobId);

  return {
    jobId,
    status: "queued",
    createdAt: new Date(job.createdAt).toISOString(),
    expiresAt: new Date(job.createdAt + RETENTION_MS).toISOString(),
    estimatedSeconds: 600,
  };
}

export function mockGetJob(jobId: string): InternalJobEnvelope | null {
  const job = jobs.get(jobId);
  if (!job) {
    return null;
  }
  return computeEnvelope(job, Date.now());
}

export function mockGetPdf(jobId: string): InternalPdfResult {
  const job = jobs.get(jobId);
  if (!job) {
    return { ok: false, status: "not_found" };
  }
  const now = Date.now();
  if (now - job.createdAt >= RETENTION_MS) {
    return { ok: false, status: "expired" };
  }
  const envelope = computeEnvelope(job, now);
  if (envelope.status !== "ready" || !envelope.result) {
    return { ok: false, status: "not_ready" };
  }

  const filename = envelope.result.filename;
  const bytes = buildMockPdf(`Daniel Nash — Tailored Resume (Preview)`, [
    `Role: ${job.jd.roleTitle ?? "(inferred from JD)"}`,
    `Company: ${job.jd.company ?? "(inferred from JD)"}`,
    "",
    "This is a placeholder PDF produced by the in-memory mock engine.",
    "The production ResumeCustomizer engine renders the real tailored resume",
    "from Daniel's verified experience. No employers, titles, dates, or",
    "outcomes are invented.",
  ]);
  return { ok: true, bytes, filename };
}

// --- Minimal single-page PDF writer (valid xref, Helvetica text) -----------

function escapePdfText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function buildMockPdf(title: string, lines: string[]): Uint8Array {
  const content = [
    "BT",
    "/F1 16 Tf",
    "72 720 Td",
    `(${escapePdfText(title)}) Tj`,
    "/F1 11 Tf",
    "0 -28 TD",
    ...lines.flatMap((line) => [
      `(${escapePdfText(line)}) Tj`,
      "0 -16 TD",
    ]),
    "ET",
  ].join("\n");
  const contentLength = Buffer.byteLength(content, "latin1");

  const objects = [
    "<</Type/Catalog/Pages 2 0 R>>",
    "<</Type/Pages/Kids[3 0 R]/Count 1>>",
    "<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Resources<</Font<</F1 5 0 R>>>>/Contents 4 0 R>>",
    `<</Length ${contentLength}>>\nstream\n${content}\nendstream`,
    "<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  objects.forEach((obj, index) => {
    offsets.push(Buffer.byteLength(pdf, "latin1"));
    pdf += `${index + 1} 0 obj\n${obj}\nendobj\n`;
  });

  const xrefStart = Buffer.byteLength(pdf, "latin1");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (const offset of offsets) {
    pdf += `${offset.toString().padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<</Size ${objects.length + 1}/Root 1 0 R>>\nstartxref\n${xrefStart}\n%%EOF`;

  return new Uint8Array(Buffer.from(pdf, "latin1"));
}
