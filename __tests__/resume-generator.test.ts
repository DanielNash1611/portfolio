import assert from "node:assert/strict";
import test, { afterEach, beforeEach } from "node:test";
import { NextRequest } from "next/server";
import * as createRoute from "@/app/api/resume-generator/jobs/route";
import * as statusRoute from "@/app/api/resume-generator/jobs/[jobId]/route";
import * as pdfRoute from "@/app/api/resume-generator/jobs/[jobId]/pdf/route";
import * as emailRoute from "@/app/api/resume-generator/jobs/[jobId]/email/route";
import { RESUME_MOCK_LABEL } from "@/lib/resume-generator/types";

const originalEnv = { ...process.env };
const originalFetch = global.fetch;
let requestCounter = 0;

const pdfBytes = new Uint8Array([37, 80, 68, 70, 45, 10]);

function restoreEnv(): void {
  Object.assign(process.env, originalEnv);
  for (const key of Object.keys(process.env)) {
    if (!(key in originalEnv)) {
      delete process.env[key];
    }
  }
}

function nextIp(): string {
  requestCounter += 1;
  return `203.0.113.${requestCounter}`;
}

function request(
  path: string,
  {
    method = "GET",
    body,
  }: {
    method?: string;
    body?: unknown;
  } = {},
): NextRequest {
  return new NextRequest(`http://localhost:3000${path}`, {
    method,
    headers: {
      origin: "http://localhost:3000",
      "content-type": "application/json",
      "x-forwarded-for": nextIp(),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

function readyEnvelope(jobId = "rsj_ready", { mock = false }: { mock?: boolean } = {}) {
  return {
    jobId,
    status: "ready",
    progress: { phase: "ready", percent: 100 },
    createdAt: "2026-05-29T17:00:00.000Z",
    updatedAt: "2026-05-29T17:02:00.000Z",
    expiresAt: "2026-05-29T18:00:00.000Z",
    result: {
      pdfAvailable: true,
      filename: "DanielNash_Resume_SeniorPM_Acme.pdf",
      byteSize: pdfBytes.byteLength,
      company: "Acme",
      roleTitle: "Senior Product Manager",
      fitSummary: "Directly evidenced product-platform leadership.",
      pdfPath: `/api/v1/resume-jobs/${jobId}/pdf`,
      ...(mock ? { mock: true } : {}),
    },
    error: null,
  };
}

function installFetch(
  handler: (url: string, init?: RequestInit) => Response | Promise<Response>,
): void {
  global.fetch = (async (input: URL | RequestInfo, init?: RequestInit) => {
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;
    return handler(url, init);
  }) as typeof fetch;
}

beforeEach(() => {
  Object.assign(process.env, {
    NODE_ENV: "test",
    SITE_BASE_URL: "http://localhost:3000",
    RESUME_CUSTOMIZER_API_BASE_URL: "http://resume-customizer.test",
    RESUME_CUSTOMIZER_API_TOKEN: "shared-token",
    RESEND_API_KEY: "resend_test_key",
    CONTACT_TO_EMAIL: "daniel@example.com",
    CONTACT_FROM_EMAIL: "Portfolio <portfolio@example.com>",
  });
});

afterEach(() => {
  restoreEnv();
  global.fetch = originalFetch;
});

test("download-only flow creates, polls, and downloads without emailing", async () => {
  const calls: string[] = [];
  let createBody: {
    jobDescription?: { text?: string };
    clientRequestId?: string;
  } | null = null;

  installFetch(async (url, init) => {
    calls.push(url);
    if (url === "http://resume-customizer.test/api/v1/resume-jobs") {
      assert.equal(init?.method, "POST");
      assert.match(JSON.stringify(init?.headers), /Bearer shared-token/);
      assert.match(String(init?.body), /confidential JD body/);
      createBody = JSON.parse(String(init?.body));
      assert.equal(createBody?.jobDescription?.text, "confidential JD body");
      assert.ok(createBody?.clientRequestId);
      return Response.json(
        {
          jobId: "rsj_ready",
          status: "queued",
          createdAt: "2026-05-29T17:00:00.000Z",
          expiresAt: "2026-05-29T18:00:00.000Z",
          estimatedSeconds: 120,
        },
        { status: 201 },
      );
    }
    if (url === "http://resume-customizer.test/api/v1/resume-jobs/rsj_ready") {
      return Response.json(readyEnvelope());
    }
    if (url === "http://resume-customizer.test/api/v1/resume-jobs/rsj_ready/pdf") {
      return new Response(pdfBytes, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition":
            'attachment; filename="DanielNash_Resume_SeniorPM_Acme.pdf"',
        },
      });
    }
    throw new Error(`Unexpected fetch: ${url}`);
  });

  const created = await createRoute.POST(
    request("/api/resume-generator/jobs", {
      method: "POST",
      body: {
        jobDescription: {
          text: "confidential JD body",
          company: "Acme",
          roleTitle: "Senior Product Manager",
        },
      },
    }),
  );
  assert.equal(created.status, 202);
  assert.deepEqual(await created.json(), {
    jobId: "rsj_ready",
    status: "queued",
    expiresAt: "2026-05-29T18:00:00.000Z",
    pollUrl: "/api/resume-generator/jobs/rsj_ready",
    estimatedSeconds: 120,
  });

  const status = await statusRoute.GET(
    request("/api/resume-generator/jobs/rsj_ready"),
    { params: { jobId: "rsj_ready" } },
  );
  const statusBody = await status.json();
  assert.equal(status.status, 200);
  assert.equal(statusBody.result.downloadUrl, "/api/resume-generator/jobs/rsj_ready/pdf");
  assert.equal(statusBody.result.pdfPath, undefined);

  const pdf = await pdfRoute.GET(
    request("/api/resume-generator/jobs/rsj_ready/pdf"),
    { params: { jobId: "rsj_ready" } },
  );
  assert.equal(pdf.status, 200);
  assert.equal(pdf.headers.get("content-type"), "application/pdf");
  assert.equal(calls.includes("https://api.resend.com/emails"), false);
});

test("email delivery sends without Daniel CC and includes contact links", async () => {
  let resendBody: Record<string, unknown> | null = null;

  installFetch(async (url, init) => {
    if (url.endsWith("/api/v1/resume-jobs/rsj_ready")) {
      return Response.json(readyEnvelope());
    }
    if (url.endsWith("/api/v1/resume-jobs/rsj_ready/pdf")) {
      return new Response(pdfBytes, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'attachment; filename="resume.pdf"',
        },
      });
    }
    if (url === "https://api.resend.com/emails") {
      resendBody = JSON.parse(String(init?.body));
      return Response.json({ id: "email_123" });
    }
    throw new Error(`Unexpected fetch: ${url}`);
  });

  const response = await emailRoute.POST(
    request("/api/resume-generator/jobs/rsj_ready/email", {
      method: "POST",
      body: { recipientEmail: "recruiter@acme.com", ccDaniel: false },
    }),
    { params: { jobId: "rsj_ready" } },
  );

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    ok: true,
    emailed: true,
    ccDaniel: false,
    message: "Sent. Check your inbox.",
  });
  assert.ok(resendBody);
  const sent = resendBody as Record<string, unknown>;
  assert.deepEqual(sent.to, ["recruiter@acme.com"]);
  assert.equal(sent.cc, undefined);
  assert.match(String(sent.text), /Daniel is not CC'd/);
  assert.match(String(sent.text), /http:\/\/localhost:3000\/contact/);
  assert.match(String(sent.text), /mailto:daniel@example.com/);
  assert.equal(
    (sent.attachments as Array<{ filename: string }>)?.[0]?.filename,
    "resume.pdf",
  );
});

test("email delivery CCs Daniel only when opted in", async () => {
  let resendBody: Record<string, unknown> | null = null;

  installFetch(async (url, init) => {
    if (url.endsWith("/api/v1/resume-jobs/rsj_ready")) {
      return Response.json(readyEnvelope());
    }
    if (url.endsWith("/api/v1/resume-jobs/rsj_ready/pdf")) {
      return new Response(pdfBytes, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'attachment; filename="resume.pdf"',
        },
      });
    }
    if (url === "https://api.resend.com/emails") {
      resendBody = JSON.parse(String(init?.body));
      return Response.json({ id: "email_456" });
    }
    throw new Error(`Unexpected fetch: ${url}`);
  });

  const response = await emailRoute.POST(
    request("/api/resume-generator/jobs/rsj_ready/email", {
      method: "POST",
      body: { recipientEmail: "recruiter@acme.com", ccDaniel: true },
    }),
    { params: { jobId: "rsj_ready" } },
  );

  assert.equal(response.status, 200);
  assert.equal((await response.json()).ccDaniel, true);
  assert.ok(resendBody);
  const sent = resendBody as Record<string, unknown>;
  assert.deepEqual(sent.cc, ["daniel@example.com"]);
  assert.doesNotMatch(String(sent.text), /Daniel is not CC'd/);
});

test("generation failure status is passed through safely", async () => {
  installFetch(async (url) => {
    assert.equal(url, "http://resume-customizer.test/api/v1/resume-jobs/rsj_failed");
    return Response.json({
      jobId: "rsj_failed",
      status: "failed",
      progress: { phase: "failed", percent: 100, detail: "Generation failed." },
      createdAt: "2026-05-29T17:00:00.000Z",
      updatedAt: "2026-05-29T17:02:00.000Z",
      expiresAt: "2026-05-29T18:00:00.000Z",
      result: null,
      error: {
        code: "engine_failed",
        message: "Resume generation failed. Please try again.",
        retryable: true,
      },
    });
  });

  const response = await statusRoute.GET(
    request("/api/resume-generator/jobs/rsj_failed"),
    { params: { jobId: "rsj_failed" } },
  );
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.status, "failed");
  assert.equal(body.error.code, "engine_failed");
});

test("email failure returns 502 while PDF download remains available", async () => {
  installFetch(async (url) => {
    if (url.endsWith("/api/v1/resume-jobs/rsj_ready")) {
      return Response.json(readyEnvelope());
    }
    if (url.endsWith("/api/v1/resume-jobs/rsj_ready/pdf")) {
      return new Response(pdfBytes, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'attachment; filename="resume.pdf"',
        },
      });
    }
    if (url === "https://api.resend.com/emails") {
      return Response.json({ message: "provider failed" }, { status: 500 });
    }
    throw new Error(`Unexpected fetch: ${url}`);
  });

  const email = await emailRoute.POST(
    request("/api/resume-generator/jobs/rsj_ready/email", {
      method: "POST",
      body: { recipientEmail: "recruiter@acme.com", ccDaniel: false },
    }),
    { params: { jobId: "rsj_ready" } },
  );
  assert.equal(email.status, 502);
  assert.deepEqual(await email.json(), {
    ok: false,
    emailed: false,
    ccDaniel: false,
    error: "email_send_failed",
  });

  const pdf = await pdfRoute.GET(
    request("/api/resume-generator/jobs/rsj_ready/pdf"),
    { params: { jobId: "rsj_ready" } },
  );
  assert.equal(pdf.status, 200);
});

test("expired PDF maps to the public 410 response", async () => {
  installFetch(async (url) => {
    assert.equal(url, "http://resume-customizer.test/api/v1/resume-jobs/rsj_expired/pdf");
    return Response.json(
      { error: { code: "expired", message: "Expired.", retryable: false } },
      { status: 410 },
    );
  });

  const response = await pdfRoute.GET(
    request("/api/resume-generator/jobs/rsj_expired/pdf"),
    { params: { jobId: "rsj_expired" } },
  );
  const body = await response.json();
  assert.equal(response.status, 410);
  assert.equal(body.error.code, "expired");
});

test("ResumeCustomizer unavailable returns a retryable 503", async () => {
  installFetch(async () => {
    throw new Error("connect ECONNREFUSED");
  });

  const response = await createRoute.POST(
    request("/api/resume-generator/jobs", {
      method: "POST",
      body: { jobDescription: { text: "Senior PM job description" } },
    }),
  );
  const body = await response.json();
  assert.equal(response.status, 503);
  assert.equal(body.error.code, "unavailable");
  assert.equal(body.error.retryable, true);
});

test("missing real engine config fails safely instead of using the mock", async () => {
  delete process.env.RESUME_CUSTOMIZER_API_BASE_URL;
  delete process.env.RESUME_CUSTOMIZER_API_TOKEN;
  delete process.env.RESUME_GENERATOR_ENABLE_MOCK;

  let fetched = false;
  installFetch(async () => {
    fetched = true;
    throw new Error("fetch should not be called");
  });

  const response = await createRoute.POST(
    request("/api/resume-generator/jobs", {
      method: "POST",
      body: { jobDescription: { text: "Senior PM job description" } },
    }),
  );
  const body = await response.json();
  assert.equal(response.status, 503);
  assert.equal(body.error.code, "unavailable");
  assert.match(body.error.message, /real resume engine is not configured/);
  assert.equal(fetched, false);
});

test("explicit non-production mock flag enables local mock generation", async () => {
  delete process.env.RESUME_CUSTOMIZER_API_BASE_URL;
  delete process.env.RESUME_CUSTOMIZER_API_TOKEN;
  process.env.RESUME_GENERATOR_ENABLE_MOCK = "true";

  const response = await createRoute.POST(
    request("/api/resume-generator/jobs", {
      method: "POST",
      body: { jobDescription: { text: "Senior PM job description" } },
    }),
  );
  const body = await response.json();
  assert.equal(response.status, 202);
  assert.match(body.jobId, /^rsj_[0-9a-f]{32}$/);
});

test("status passes through the mock flag from engine result metadata", async () => {
  installFetch(async (url) => {
    if (url.endsWith("/api/v1/resume-jobs/rsj_ready")) {
      return Response.json(readyEnvelope("rsj_ready", { mock: true }));
    }
    throw new Error(`Unexpected fetch: ${url}`);
  });

  const status = await statusRoute.GET(
    request("/api/resume-generator/jobs/rsj_ready"),
    { params: { jobId: "rsj_ready" } },
  );
  const body = await status.json();
  assert.equal(status.status, 200);
  assert.equal(body.result.mock, true);
});

test("real engine result is reported as not mock", async () => {
  installFetch(async (url) => {
    if (url.endsWith("/api/v1/resume-jobs/rsj_ready")) {
      return Response.json(readyEnvelope("rsj_ready"));
    }
    throw new Error(`Unexpected fetch: ${url}`);
  });

  const status = await statusRoute.GET(
    request("/api/resume-generator/jobs/rsj_ready"),
    { params: { jobId: "rsj_ready" } },
  );
  const body = await status.json();
  assert.equal(body.result.mock, false);
});

test("email in mock mode labels the subject and body as mock/test output", async () => {
  let resendBody: Record<string, unknown> | null = null;

  installFetch(async (url, init) => {
    if (url.endsWith("/api/v1/resume-jobs/rsj_ready")) {
      return Response.json(readyEnvelope("rsj_ready", { mock: true }));
    }
    if (url.endsWith("/api/v1/resume-jobs/rsj_ready/pdf")) {
      return new Response(pdfBytes, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'attachment; filename="resume.pdf"',
        },
      });
    }
    if (url === "https://api.resend.com/emails") {
      resendBody = JSON.parse(String(init?.body));
      return Response.json({ id: "email_mock" });
    }
    throw new Error(`Unexpected fetch: ${url}`);
  });

  const response = await emailRoute.POST(
    request("/api/resume-generator/jobs/rsj_ready/email", {
      method: "POST",
      body: { recipientEmail: "recruiter@acme.com", ccDaniel: false },
    }),
    { params: { jobId: "rsj_ready" } },
  );

  assert.equal(response.status, 200);
  assert.ok(resendBody);
  const sent = resendBody as Record<string, unknown>;
  assert.ok(String(sent.subject).includes(RESUME_MOCK_LABEL));
  assert.ok(String(sent.text).includes(RESUME_MOCK_LABEL));
});

test("email in real mode is not labeled as mock/test output", async () => {
  let resendBody: Record<string, unknown> | null = null;

  installFetch(async (url, init) => {
    if (url.endsWith("/api/v1/resume-jobs/rsj_ready")) {
      return Response.json(readyEnvelope("rsj_ready"));
    }
    if (url.endsWith("/api/v1/resume-jobs/rsj_ready/pdf")) {
      return new Response(pdfBytes, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'attachment; filename="resume.pdf"',
        },
      });
    }
    if (url === "https://api.resend.com/emails") {
      resendBody = JSON.parse(String(init?.body));
      return Response.json({ id: "email_real" });
    }
    throw new Error(`Unexpected fetch: ${url}`);
  });

  await emailRoute.POST(
    request("/api/resume-generator/jobs/rsj_ready/email", {
      method: "POST",
      body: { recipientEmail: "recruiter@acme.com", ccDaniel: false },
    }),
    { params: { jobId: "rsj_ready" } },
  );

  assert.ok(resendBody);
  const sent = resendBody as Record<string, unknown>;
  assert.equal(String(sent.subject).includes(RESUME_MOCK_LABEL), false);
  assert.equal(String(sent.text).includes(RESUME_MOCK_LABEL), false);
});

test("production ignores the mock flag and fails safely when real config is missing", async () => {
  delete process.env.RESUME_CUSTOMIZER_API_BASE_URL;
  delete process.env.RESUME_CUSTOMIZER_API_TOKEN;
  Reflect.set(process.env, "NODE_ENV", "production");
  process.env.RESUME_GENERATOR_ENABLE_MOCK = "true";

  const response = await createRoute.POST(
    request("/api/resume-generator/jobs", {
      method: "POST",
      body: { jobDescription: { text: "Senior PM job description" } },
    }),
  );
  const body = await response.json();
  assert.equal(response.status, 503);
  assert.equal(body.error.code, "unavailable");
  assert.match(body.error.message, /real resume engine is not configured/);
});
