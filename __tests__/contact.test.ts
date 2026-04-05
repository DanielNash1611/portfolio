import assert from "node:assert/strict";
import test, { afterEach, beforeEach } from "node:test";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/contact/route";
import { setContactRateLimitCheckerForTests } from "@/lib/contactRateLimit";
import { setContactSubmissionSaverForTests } from "@/lib/contactSubmissions";

const originalEnv = { ...process.env };
const originalFetch = global.fetch;

const basePayload = {
  name: "Taylor Recruiter",
  email: "taylor@example.com",
  subject: "Intro",
  message: "I'd love to talk about a product leadership role.",
  startedAt: `${Date.now() - 5000}`,
};

function createRequest(
  payload: Record<string, string>,
  {
    ip = "203.0.113.10",
    origin = "http://localhost:3000",
    userAgent = "Portfolio Test Browser",
  }: {
    ip?: string;
    origin?: string;
    userAgent?: string;
  } = {},
) {
  return new NextRequest("http://localhost:3000/api/contact", {
    method: "POST",
    headers: {
      origin,
      "content-type": "application/json",
      "user-agent": userAgent,
      "x-forwarded-for": ip,
    },
    body: JSON.stringify(payload),
  });
}

beforeEach(() => {
  Object.assign(process.env, {
    NODE_ENV: "test",
    SITE_BASE_URL: "https://www.danielnash.co",
    RESEND_API_KEY: "resend_test_key",
    CONTACT_TO_EMAIL: "private@example.com",
    CONTACT_FROM_EMAIL: "Portfolio Contact <contact@yourdomain.com>",
  });

  setContactRateLimitCheckerForTests(async () => ({
    limited: false,
    attemptCount: 1,
  }));
  setContactSubmissionSaverForTests(
    async ({ email, ip, message, name, subject, userAgent }) => ({
      id: 123,
      name,
      email,
      subject: subject ?? null,
      message,
      ip,
      userAgent: userAgent ?? null,
      createdAt: "2026-04-04T18:00:00.000Z",
    }),
  );
});

afterEach(() => {
  Object.assign(process.env, originalEnv);
  for (const key of Object.keys(process.env)) {
    if (!(key in originalEnv)) {
      delete process.env[key];
    }
  }

  global.fetch = originalFetch;
  setContactRateLimitCheckerForTests(null);
  setContactSubmissionSaverForTests(null);
});

test("valid submissions are stored and emailed", async () => {
  const savedSubmissions: Array<Record<string, string | null>> = [];
  const fetchCalls: string[] = [];

  setContactSubmissionSaverForTests(
    async ({ email, ip, message, name, subject, userAgent }) => {
      savedSubmissions.push({
        name,
        email,
        subject: subject ?? null,
        message,
        ip,
        userAgent: userAgent ?? null,
      });

      return {
        id: 123,
        name,
        email,
        subject: subject ?? null,
        message,
        ip,
        userAgent: userAgent ?? null,
        createdAt: "2026-04-04T18:00:00.000Z",
      };
    },
  );

  global.fetch = (async (input: URL | RequestInfo, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input.toString();
    fetchCalls.push(url);
    assert.equal(url, "https://api.resend.com/emails");
    assert.equal(init?.method, "POST");
    return Response.json({ id: "email_123" });
  }) as typeof fetch;

  const response = await POST(createRequest(basePayload));
  const body = (await response.json()) as { ok?: boolean };

  assert.equal(response.status, 200);
  assert.equal(body.ok, true);
  assert.equal(savedSubmissions.length, 1);
  assert.equal(savedSubmissions[0]?.ip, "203.0.113.10");
  assert.equal(savedSubmissions[0]?.subject, "Intro");
  assert.deepEqual(fetchCalls, ["https://api.resend.com/emails"]);
});

test("honeypot submissions exit early without saving or emailing", async () => {
  let saved = false;
  let emailed = false;

  setContactSubmissionSaverForTests(async () => {
    saved = true;
    throw new Error("save should not be called");
  });
  global.fetch = (async () => {
    emailed = true;
    throw new Error("fetch should not be called");
  }) as typeof fetch;

  const response = await POST(
    createRequest({
      ...basePayload,
      website: "https://spam.example",
    }),
  );
  const body = (await response.json()) as { ok?: boolean };

  assert.equal(response.status, 200);
  assert.equal(body.ok, true);
  assert.equal(saved, false);
  assert.equal(emailed, false);
});

test("too-fast submissions are rejected before saving", async () => {
  let saved = false;

  setContactSubmissionSaverForTests(async () => {
    saved = true;
    throw new Error("save should not be called");
  });

  const response = await POST(
    createRequest({
      ...basePayload,
      startedAt: `${Date.now() - 200}`,
    }),
  );
  const body = (await response.json()) as { error?: string };

  assert.equal(response.status, 400);
  assert.equal(body.error, "Please take a moment and try again.");
  assert.equal(saved, false);
});

test("rate-limited submissions are rejected cleanly", async () => {
  let saved = false;

  setContactRateLimitCheckerForTests(async () => ({
    limited: true,
    attemptCount: 5,
  }));
  setContactSubmissionSaverForTests(async () => {
    saved = true;
    throw new Error("save should not be called");
  });

  const response = await POST(createRequest(basePayload));
  const body = (await response.json()) as { error?: string };

  assert.equal(response.status, 429);
  assert.equal(body.error, "Too many messages sent. Please try again shortly.");
  assert.equal(saved, false);
});

test("resend failures are logged but still return success after persistence", async () => {
  global.fetch = (async () =>
    Response.json(
      { message: "provider exploded" },
      { status: 500 },
    )) as typeof fetch;

  const response = await POST(createRequest(basePayload));
  const body = (await response.json()) as { ok?: boolean; error?: string };

  assert.equal(response.status, 200);
  assert.equal(body.ok, true);
  assert.equal(body.error, undefined);
});

test("database persistence failures return a safe error", async () => {
  setContactSubmissionSaverForTests(async () => {
    throw new Error("DATABASE_URL is not configured.");
  });

  let emailed = false;
  global.fetch = (async () => {
    emailed = true;
    throw new Error("fetch should not be called");
  }) as typeof fetch;

  const response = await POST(createRequest(basePayload));
  const body = (await response.json()) as { ok?: boolean; error?: string };

  assert.equal(response.status, 500);
  assert.equal(body.ok, false);
  assert.equal(body.error, "Unable to send your message right now.");
  assert.equal(emailed, false);
});

test("missing rate-limit tables log a clear setup hint", async () => {
  const originalConsoleError = console.error;
  const loggedErrors: unknown[][] = [];

  console.error = (...args: unknown[]) => {
    loggedErrors.push(args);
  };

  setContactRateLimitCheckerForTests(async () => {
    throw {
      code: "42P01",
      message: 'relation "contact_rate_limits" does not exist',
    };
  });

  try {
    const response = await POST(createRequest(basePayload));
    const body = (await response.json()) as { ok?: boolean; error?: string };

    assert.equal(response.status, 500);
    assert.equal(body.ok, false);
    assert.equal(body.error, "Unable to send your message right now.");
    assert.ok(
      loggedErrors.some(
        ([message]) =>
          typeof message === "string" &&
          message.includes("missing contact form database tables"),
      ),
    );
  } finally {
    console.error = originalConsoleError;
  }
});

test("missing submission tables log a clear setup hint", async () => {
  const originalConsoleError = console.error;
  const loggedErrors: unknown[][] = [];

  console.error = (...args: unknown[]) => {
    loggedErrors.push(args);
  };

  setContactSubmissionSaverForTests(async () => {
    throw {
      code: "42P01",
      message: 'relation "contact_submissions" does not exist',
    };
  });

  try {
    const response = await POST(createRequest(basePayload));
    const body = (await response.json()) as { ok?: boolean; error?: string };

    assert.equal(response.status, 500);
    assert.equal(body.ok, false);
    assert.equal(body.error, "Unable to send your message right now.");
    assert.ok(
      loggedErrors.some(
        ([message]) =>
          typeof message === "string" &&
          message.includes("missing contact form database tables"),
      ),
    );
  } finally {
    console.error = originalConsoleError;
  }
});

test("rate limit lookup failures return a safe error", async () => {
  let saved = false;

  setContactRateLimitCheckerForTests(async () => {
    throw new Error("DATABASE_URL is not configured.");
  });
  setContactSubmissionSaverForTests(async () => {
    saved = true;
    throw new Error("save should not be called");
  });

  const response = await POST(createRequest(basePayload));
  const body = (await response.json()) as { ok?: boolean; error?: string };

  assert.equal(response.status, 500);
  assert.equal(body.ok, false);
  assert.equal(body.error, "Unable to send your message right now.");
  assert.equal(saved, false);
});
