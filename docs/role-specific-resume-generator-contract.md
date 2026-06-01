# Role-Specific Resume Generator — Cross-Repo API Contract

**Status:** Authoritative. This file is maintained byte-identical in both repos:

- `DanielNash1611/portfolio` → `docs/role-specific-resume-generator-contract.md`
- `DanielNash1611/ResumeCustomizer` → `docs/role-specific-resume-generator-contract.md`

If you change one copy, change the other in the same PR. When the two copies
disagree, neither is trustworthy and implementation must stop until they are
reconciled.

This document is the machine-facing contract: endpoints, JSON shapes, status
values, error states, expiry, ownership boundaries, security requirements, and
deployment assumptions. The companion narrative
(`docs/cross-repo-resume-generator-brief.md`) explains *why* and *who builds
what*. Read both before implementing either side.

---

## 0. Non-negotiable product decisions

These constrain every design choice below. Do not relax them without updating
this section in both repos.

1. **The hosted recruiter-facing generator must NOT use the Codex-first
   workflow as its production runtime.** Codex is a coding assistant only.
2. **The hosted product runs the non-Codex / API workflow** (programmatic
   ResumeCustomizer engine calling the OpenAI API server-side). No interactive
   Codex/Google-Docs path is in the request path of a live recruiter job.
3. **Portfolio owns** the recruiter-facing UX, delivery options, bot
   integration, contact path, and **all email delivery**.
4. **ResumeCustomizer owns** the resume generation engine, JD parsing / fit
   mapping, OpenAI review agents, PDF output, and job status/results.
5. **Email uses the existing portfolio Resend / contact-email integration.** Do
   not add an email service inside ResumeCustomizer.
6. **Email is optional.** A recruiter can download the PDF directly without
   entering an email address.
7. **If email is used, CC'ing Daniel on the thread is opt-in** (off by default).
8. **If Daniel is not CC'd, the email body must still include easy contact
   links** (portfolio contact page + direct mailto).

---

## 1. Topology

There are two API layers. The browser never talks to ResumeCustomizer directly.

```
 Recruiter browser / bot
        │   (public, unauthenticated, rate-limited, same-origin)
        ▼
 Portfolio Next.js server  ──────────────►  ResumeCustomizer engine API
   • public proxy endpoints     (internal,    • create / status / pdf
   • Resend email delivery      bearer token) • OpenAI review agents
   • rate limiting / caps                      • PDF render + temp retention
   • CC / contact-link logic
```

- **Public layer (browser ↔ portfolio):** `/api/resume-generator/*` on the
  portfolio origin. No secrets reach the browser. Portfolio is the only thing
  the public ever calls.
- **Internal layer (portfolio server ↔ ResumeCustomizer):** `/api/v1/*` on
  ResumeCustomizer, protected by a shared bearer token. Server-to-server only;
  must not be exposed to the public or called from a browser.

Job IDs are opaque, unguessable (≥128 bits of entropy, URL-safe). They are the
only handle shared across the boundary.

---

## 2. Internal API (ResumeCustomizer owns)

Base URL configured in portfolio as `RESUME_CUSTOMIZER_API_BASE_URL`.
All requests carry `Authorization: Bearer <RESUME_CUSTOMIZER_API_TOKEN>` and
`Content-Type: application/json`. ResumeCustomizer rejects any request without a
valid token with `401`.

### 2.1 Create job — `POST /api/v1/resume-jobs`

Request:

```json
{
  "jobDescription": {
    "text": "full JD text, plain text or markdown",
    "sourceUrl": "https://example.com/careers/123",
    "company": "Acme",
    "roleTitle": "Senior Product Manager"
  },
  "variantHint": "builder-pm",
  "clientRequestId": "uuid-from-portfolio-for-idempotency"
}
```

- `jobDescription.text` is **required**. `sourceUrl`, `company`, `roleTitle`,
  `variantHint` are optional; the engine infers company/role from the text when
  omitted.
- `clientRequestId` is an idempotency key. A repeat create with the same
  `clientRequestId` within the retention window returns the **existing** job,
  not a new one.
- Length/size caps (see §6) are enforced by both layers; ResumeCustomizer
  rejects oversized payloads with `413`.

Response `201`:

```json
{
  "jobId": "rsj_8f2c1a9b7d6e4f30",
  "status": "queued",
  "createdAt": "2026-05-29T17:00:00.000Z",
  "expiresAt": "2026-05-29T18:00:00.000Z",
  "estimatedSeconds": 120
}
```

### 2.2 Poll job status — `GET /api/v1/resume-jobs/{jobId}`

Response `200`:

```json
{
  "jobId": "rsj_8f2c1a9b7d6e4f30",
  "status": "reviewing",
  "progress": {
    "phase": "reviewing",
    "percent": 70,
    "detail": "OpenAI review agents pass 2 of 2"
  },
  "createdAt": "2026-05-29T17:00:00.000Z",
  "updatedAt": "2026-05-29T17:01:30.000Z",
  "expiresAt": "2026-05-29T18:00:00.000Z",
  "result": null,
  "error": null
}
```

When `status` is `ready`, `result` is populated:

```json
{
  "result": {
    "pdfAvailable": true,
    "filename": "DanielNash_Resume_SeniorPM_Acme.pdf",
    "byteSize": 184213,
    "company": "Acme",
    "roleTitle": "Senior Product Manager",
    "fitSummary": "3 of 4 must-haves directly evidenced; 1 bridged.",
    "pdfPath": "/api/v1/resume-jobs/rsj_8f2c1a9b7d6e4f30/pdf",
    "mock": false
  }
}
```

`mock` (optional, default treated as `false`) is `true` only when the job was
fulfilled by a non-production mock/stub engine. It is derived **server-side**
from the engine that ran the job and is never client-controllable. The portfolio
must surface it on the public envelope and use it to label mock/test output in
the UI, PDF, and email with the literal:
`Mock / Test Output — Not for External Use`. A production `ready` result is
always `mock: false`, because the stub is disabled in production.

When `status` is `failed`, `error` is populated (see §5). When `expired`,
`result` and `error` are both `null` and the PDF is gone.

Polling guidance: portfolio polls every **2s** for the first 30s, then backs off
to **5s**, capped at the `expiresAt` horizon. ResumeCustomizer should set
`Cache-Control: no-store` on status responses.

### 2.3 Download PDF — `GET /api/v1/resume-jobs/{jobId}/pdf`

- `200` with `Content-Type: application/pdf` and
  `Content-Disposition: attachment; filename="<friendly>.pdf"` when ready.
- `409 { "error": { "code": "not_ready", ... } }` when the job exists but is not
  yet `ready`.
- `404` when the job never existed or `410` when it has `expired`.
- The body is the rendered PDF bytes. No JSON wrapper.

---

## 3. Public API (Portfolio owns)

Same-origin, unauthenticated, rate-limited. Portfolio proxies to the internal
API, injecting the bearer token server-side. **JD text is always sent in the
request body, never in a URL/query string** (see §6).

### 3.1 Create job — `POST /api/resume-generator/jobs`

Request body mirrors the internal create payload minus the idempotency key
(portfolio generates `clientRequestId` itself):

```json
{
  "jobDescription": {
    "text": "...",
    "sourceUrl": "https://example.com/careers/123",
    "company": "Acme",
    "roleTitle": "Senior Product Manager"
  },
  "variantHint": "builder-pm"
}
```

Response `202`:

```json
{
  "jobId": "rsj_8f2c1a9b7d6e4f30",
  "status": "queued",
  "expiresAt": "2026-05-29T18:00:00.000Z",
  "pollUrl": "/api/resume-generator/jobs/rsj_8f2c1a9b7d6e4f30",
  "estimatedSeconds": 120
}
```

### 3.2 Poll status — `GET /api/resume-generator/jobs/{jobId}`

Returns the same status envelope as §2.2, except `result.pdfPath` is rewritten
to the **public** download path:

```json
{
  "result": {
    "pdfAvailable": true,
    "filename": "DanielNash_Resume_SeniorPM_Acme.pdf",
    "downloadUrl": "/api/resume-generator/jobs/rsj_8f2c1a9b7d6e4f30/pdf",
    "fitSummary": "3 of 4 must-haves directly evidenced; 1 bridged."
  }
}
```

Portfolio must not leak the internal base URL or token to the client.

### 3.3 Download PDF — `GET /api/resume-generator/jobs/{jobId}/pdf`

Portfolio streams the PDF from the internal endpoint to the browser. This is the
**no-email direct download** path (decision #6). Same `404`/`409`/`410`
semantics as §2.3.

### 3.4 Email delivery — `POST /api/resume-generator/jobs/{jobId}/email`

**Portfolio-only. ResumeCustomizer has no email endpoint and no Resend key.**

Request:

```json
{
  "recipientEmail": "recruiter@acme.com",
  "ccDaniel": false,
  "note": "optional short message from the recruiter"
}
```

- `recipientEmail` validated against portfolio's existing `emailPattern` and
  `maxEmailLength` from `lib/contact.ts`.
- `ccDaniel` defaults to `false` (decision #7). When `true`, Daniel
  (`CONTACT_TO_EMAIL`) is added to CC.
- When `ccDaniel` is `false`, the email body **must** include easy contact
  links (decision #8): the portfolio contact page URL and a `mailto:` to
  `CONTACT_TO_EMAIL`.
- Portfolio fetches the PDF from the internal endpoint and attaches it, then
  sends via Resend using `CONTACT_FROM_EMAIL` / existing
  `sendContactNotification`-style integration.

Response `200`:

```json
{ "ok": true, "emailed": true, "ccDaniel": false }
```

Email send failures return `502 { "ok": false, "error": "email_send_failed" }`
without leaking Resend internals. The PDF download path remains available
regardless of email outcome.

---

## 4. Status values

Exactly these nine values. Both repos use the same vocabulary; portfolio passes
them through unchanged.

| Status              | Meaning                                                        | Terminal |
| ------------------- | -------------------------------------------------------------- | -------- |
| `queued`            | Accepted, not yet started.                                     | no       |
| `analyzing_jd`      | Parsing the job description.                                   | no       |
| `mapping_experience`| Mapping candidate experience / fit to JD requirements.         | no       |
| `drafting_resume`   | Generating the tailored resume draft.                          | no       |
| `reviewing`         | OpenAI review agents evaluating/revising the draft.            | no       |
| `rendering_pdf`     | Rendering the final PDF.                                       | no       |
| `ready`             | PDF available for download. `result` populated.                | **yes**  |
| `failed`            | Generation failed. `error` populated.                          | **yes**  |
| `expired`           | Retention window elapsed; PDF deleted. `result`/`error` null.  | **yes**  |

Forward-only progression through the non-terminal states; a job never moves
backward. Clients must treat any unknown status as non-terminal and keep
polling until `expiresAt`.

---

## 5. Error model

All JSON error bodies share this shape:

```json
{
  "error": {
    "code": "invalid_jd",
    "message": "Human-readable, safe to show to the recruiter.",
    "retryable": false
  }
}
```

Canonical codes:

| HTTP | `code`              | When                                                |
| ---- | ------------------- | --------------------------------------------------- |
| 400  | `invalid_request`   | Malformed JSON / missing required field.            |
| 400  | `invalid_jd`        | JD empty or unusable.                               |
| 401  | `unauthorized`      | Missing/invalid internal bearer token (internal).   |
| 404  | `not_found`         | Unknown `jobId`.                                     |
| 409  | `not_ready`         | PDF requested before `status: ready`.               |
| 410  | `expired`           | Job/PDF past retention.                              |
| 413  | `payload_too_large` | JD text or file exceeds caps (§6).                  |
| 429  | `rate_limited`      | Public rate limit hit; includes `Retry-After`.      |
| 502  | `engine_failed`     | Generation pipeline error (the `failed` job state). |
| 502  | `email_send_failed` | Resend send failed (portfolio email endpoint).      |
| 503  | `unavailable`       | Engine/dependency (OpenAI) temporarily unavailable. |

`failed` jobs carry the failure under `error` in the status envelope (§2.2),
using the same shape. Never surface OpenAI keys, Resend keys, stack traces, the
internal base URL, or raw upstream error text to the public layer.

---

## 6. Security requirements

Both repos must enforce these. They are acceptance-blocking.

- **No OpenAI keys in the browser.** `OPENAI_API_KEY` lives only on the
  ResumeCustomizer server. The engine calls OpenAI server-side; the browser
  never sees a key or calls OpenAI directly.
- **No Resend keys outside the portfolio server.** `RESEND_API_KEY` stays in
  portfolio server env. ResumeCustomizer has no Resend key and no email code.
- **Rate-limit public requests.** Portfolio rate-limits
  `/api/resume-generator/*` (reuse the existing `contactRateLimit` approach):
  per-IP create limits and a global ceiling. Internal API additionally trusts
  only the bearer token.
- **Cap JD length and file size.** Reject JD text over **50,000 characters** and
  uploaded files over **2 MB** with `413 payload_too_large`. Enforce at the
  public layer *and* re-enforce at the internal layer (defense in depth).
- **Temporary PDF retention only.** Generated PDFs and job records are retained
  for the expiry window (default **60 minutes**, see §7) then deleted. No
  long-term storage of recruiter JD text or generated PDFs.
- **Never put JD text in URLs.** JD text and recruiter input travel in request
  bodies (POST) only — never query strings, path segments, or redirect URLs, so
  it does not land in logs, history, or referrers. Job IDs in URLs are fine
  because they are opaque and short-lived.
- **Internal endpoint isolation.** `/api/v1/*` requires the bearer token and is
  not reachable from the browser. Validate `Origin` on public POSTs the same way
  `lib/contact.ts#isAllowedOrigin` already does.

---

## 7. Expiry behavior

- Each job has `expiresAt = createdAt + retention` (default **60 min**).
- At expiry: PDF bytes and job metadata are deleted; subsequent status polls
  return `status: expired` (or `410` on the PDF endpoint).
- `ready` does not extend expiry. Recruiters should download/email promptly; the
  UI must show the expiry time and offer regeneration after expiry.
- Idempotency keys (`clientRequestId`) are honored only within the retention
  window. After expiry the same key starts a fresh job.

---

## 8. Ownership matrix

| Concern                                  | Portfolio | ResumeCustomizer |
| ---------------------------------------- | :-------: | :--------------: |
| Recruiter-facing UI / page               |    ✅     |        ❌        |
| Bot integration / contact path           |    ✅     |        ❌        |
| Public API + rate limiting               |    ✅     |        ❌        |
| Email delivery (Resend) + CC/contact links |  ✅     |        ❌        |
| Holding `RESEND_API_KEY`/`CONTACT_*`     |    ✅     |        ❌        |
| JD parsing / fit mapping                 |    ❌     |        ✅        |
| Resume generation engine                 |    ❌     |        ✅        |
| OpenAI review agents                     |    ❌     |        ✅        |
| PDF rendering                            |    ❌     |        ✅        |
| Job status / results / expiry            |    ❌     |        ✅        |
| Holding `OPENAI_API_KEY`                 |    ❌     |        ✅        |

**Must NOT own:**

- ResumeCustomizer must not send email, hold Resend keys, render recruiter UI,
  or be reachable from the browser.
- Portfolio must not call OpenAI, hold `OPENAI_API_KEY`, run the generation
  engine, or render PDFs itself.
- Neither side may put the hosted runtime behind the Codex-first workflow.

---

## 9. Deployment assumptions

**Portfolio (today):**
- Has `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`.
- Adds `RESUME_CUSTOMIZER_API_BASE_URL` (internal engine base URL) and
  `RESUME_CUSTOMIZER_API_TOKEN` (internal bearer token) when the engine is
  deployed as a separate service.

**ResumeCustomizer:**
- Needs `OPENAI_API_KEY` server-side.
- Needs `RESUME_CUSTOMIZER_API_TOKEN` (the same shared token portfolio sends) to
  authenticate the internal API.
- Runs the non-Codex / API workflow as the production runtime.

If the two run as a single deployment, the internal layer is still kept distinct
(separate route namespace + token check) so the boundary above remains true.

---

## 10. Implementation checklist

- [ ] ResumeCustomizer: `POST /api/v1/resume-jobs`, `GET …/{id}`, `GET …/{id}/pdf`.
- [ ] ResumeCustomizer: nine-value status machine, error model, expiry/cleanup.
- [ ] ResumeCustomizer: bearer-token auth, length/size caps, temp retention, no email code.
- [ ] Portfolio: `/api/resume-generator/jobs` (create/poll/pdf) proxy with token injection.
- [ ] Portfolio: `/api/resume-generator/jobs/{id}/email` using Resend; `ccDaniel` opt-in; contact links when not CC'd.
- [ ] Portfolio: rate limiting, origin checks, caps, recruiter UI with direct-download (no-email) path.
- [ ] Both: this contract committed byte-identical; companion brief committed.

---

## 11. Branching, staging, and rollback policy

This work is staged on feature branches and kept off `main` until the full
cross-repo integration is tested. Both repos follow the same scheme.

1. **No direct commits to `main`** for contract or implementation work.
2. **Umbrella branch (same name in both repos):**
   `feature/role-specific-resume-generator`
3. **Child branches** per implementation thread, branched off the umbrella:
   - Portfolio:
     - `portfolio/resume-generator-ui`
     - `portfolio/resume-generator-email`
     - `portfolio/bot-resume-generator-cta`
   - ResumeCustomizer:
     - `resumecustomizer/non-codex-hosted-workflow`
     - `resumecustomizer/openai-review-runtime`
     - `resumecustomizer/job-status-pdf-api`
4. **Contract docs may be committed first** directly to
   `feature/role-specific-resume-generator` in both repos.
5. **Implementation branches PR/merge into the umbrella branch**, not `main`.
6. **`main` stays untouched** until the full cross-repo integration is tested.
7. **Before any implementation work starts**, create and push a rollback tag
   from current `main` in both repos:
   `pre-resume-generator-stable-YYYY-MM-DD`
   (e.g. `pre-resume-generator-stable-2026-05-29`).
8. **If the project fails before merge to `main`:** abandon/delete the feature
   branches.
9. **If a single implementation thread fails:** revert/delete only that child
   branch, or revert its merge into the umbrella branch.
10. **If already merged to `main` and it must be backed out:** prefer reverting
    the merge commit. Use reset-to-tag only as a last resort.

### Definition of Done (staging)

The feature is **not complete** until both repos are merged into their
respective `feature/role-specific-resume-generator` branches, the cross-repo
contract tests pass, and `main` remains unchanged until final approval.
