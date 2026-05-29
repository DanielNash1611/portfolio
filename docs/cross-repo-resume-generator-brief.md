# Cross-Repo Resume Generator — Implementation Brief

**Status:** Authoritative narrative. Maintained byte-identical in both repos:

- `DanielNash1611/portfolio` → `docs/cross-repo-resume-generator-brief.md`
- `DanielNash1611/ResumeCustomizer` → `docs/cross-repo-resume-generator-brief.md`

This brief explains the *why*, the *division of labor*, and the *order of work*
so two separate agents — one per repo — can implement their side without
guessing or making conflicting assumptions. The exact wire contract (endpoints,
JSON, status codes, error model, security, deployment) lives in the companion
file `docs/role-specific-resume-generator-contract.md`. **Read the contract
alongside this brief.** Where they overlap, the contract is the source of truth
for shapes and the brief is the source of truth for intent.

---

## 1. What we're building

A hosted, recruiter-facing **role-specific resume generator**. A recruiter (or a
bot acting for one) pastes a job description on Daniel's portfolio site, and gets
back a resume tailored to that role as a downloadable PDF — optionally emailed.

The generation intelligence already exists in **ResumeCustomizer** (JD parsing,
fit mapping, draft, OpenAI review agents, PDF rendering). The recruiter-facing
surface and all outbound email already exist in **portfolio** (the site, the
contact path, the Resend integration). This effort wires them together behind a
clean API boundary so neither repo absorbs the other's responsibilities.

---

## 2. The decisions that shape everything (read first)

These are settled. Implement to them; do not relitigate them in code.

1. **Not Codex-first in production.** The hosted runtime must run the
   **non-Codex / API workflow** — ResumeCustomizer's programmatic engine calling
   the OpenAI API server-side. The interactive Codex / Google-Docs path is a
   local authoring convenience and must never sit in a live recruiter request.
2. **Codex is a coding assistant only.** Use it to *write* this software if you
   like. It is not part of the deployed product's request path.
3. **Portfolio owns the human-facing layer:** recruiter UX, delivery options,
   bot integration, contact path, and **all email**.
4. **ResumeCustomizer owns the engine:** JD parsing / fit mapping, OpenAI review
   agents, PDF output, and job status/results.
5. **Email reuses the existing portfolio Resend/contact integration.** No new
   email service inside ResumeCustomizer.
6. **Email is optional.** Recruiters can download the PDF without giving an
   email address. The direct-download path is first-class, not a fallback.
7. **CC'ing Daniel is opt-in.** Default off. The recruiter chooses to loop Daniel
   in.
8. **If Daniel isn't CC'd, the email still carries easy contact links** — the
   portfolio contact page and a direct `mailto:` — so the recruiter can reach
   him in one click.

If any code or design choice conflicts with one of these, the code is wrong.

---

## 3. Who builds what

### Portfolio agent builds
- A recruiter-facing page/flow to submit a JD and watch progress.
- Public API under `/api/resume-generator/*` that proxies to ResumeCustomizer's
  internal API, injecting the bearer token **server-side only**.
- Polling UI driven by the nine status values, ending in a download button
  (no-email path) and an optional "email me this" form.
- The email endpoint, built on the existing Resend/contact integration
  (`lib/contact.ts`, `contactNotification`, `contactRateLimit`): validate the
  recipient, attach the PDF, honor the opt-in `ccDaniel`, and always include
  contact links when Daniel isn't CC'd.
- Rate limiting, origin checks, and input caps on the public layer.
- Bot integration / contact path entry points that funnel into the same public
  API.

### ResumeCustomizer agent builds
- An internal HTTP API (`/api/v1/resume-jobs`) that wraps the existing
  generation pipeline: create job, poll status, download PDF.
- A job model with the nine canonical statuses, progress detail, expiry, and an
  idempotency key.
- Bearer-token auth on every internal route; input caps re-enforced here.
- Temporary retention + cleanup of PDFs and job records.
- The non-Codex / API runtime: the engine drives the OpenAI review agents
  server-side with `OPENAI_API_KEY`.

### Neither side
- Neither puts the hosted runtime behind Codex.
- ResumeCustomizer never sends email or holds a Resend key.
- Portfolio never calls OpenAI or holds `OPENAI_API_KEY`.
- The browser never calls ResumeCustomizer directly and never holds any key.

(See the ownership matrix in the contract, §8, for the authoritative table.)

---

## 4. End-to-end flow

1. Recruiter submits a JD on the portfolio page → `POST /api/resume-generator/jobs`.
2. Portfolio validates/caps input, applies rate limit, generates a
   `clientRequestId`, and calls ResumeCustomizer `POST /api/v1/resume-jobs` with
   the bearer token. Gets back a `jobId` + `queued`.
3. Portfolio returns the `jobId` and a `pollUrl` to the browser.
4. Browser polls `GET /api/resume-generator/jobs/{jobId}`; portfolio proxies to
   the internal status endpoint. The engine advances through
   `analyzing_jd → mapping_experience → drafting_resume → reviewing →
   rendering_pdf → ready`.
5. On `ready`, the UI shows a **Download** button
   (`GET /api/resume-generator/jobs/{jobId}/pdf`) — this works with **no email**.
6. Optionally, the recruiter submits the email form →
   `POST /api/resume-generator/jobs/{jobId}/email`. Portfolio pulls the PDF from
   the internal endpoint, sends it via Resend, CC's Daniel only if opted in, and
   always includes contact links if not.
7. After the retention window the job becomes `expired`; the UI offers to
   regenerate.

---

## 5. Sequencing (so the two agents don't block each other)

1. **Land both docs first** (this brief + the contract) in both repos,
   byte-identical. This is the shared source of truth.
2. **ResumeCustomizer agent** implements `/api/v1/*` against the contract,
   returning the exact JSON shapes and statuses. It can be validated standalone
   with the bearer token and a sample JD.
3. **Portfolio agent** implements the public proxy + email + UI against the same
   contract, using a mock or the real internal base URL.
4. **Integrate** via `RESUME_CUSTOMIZER_API_BASE_URL` + shared token. Because
   both built to the contract, integration is configuration, not redesign.

The contract's JSON shapes and status vocabulary are frozen enough that step 2
and step 3 can proceed in parallel.

---

## 6. Environment / deployment

- **Portfolio today:** `RESEND_API_KEY`, `CONTACT_TO_EMAIL`,
  `CONTACT_FROM_EMAIL`. Adds `RESUME_CUSTOMIZER_API_BASE_URL` and
  `RESUME_CUSTOMIZER_API_TOKEN` when the engine is a separate service.
- **ResumeCustomizer:** `OPENAI_API_KEY` (server-side) and
  `RESUME_CUSTOMIZER_API_TOKEN` (matches portfolio's) for internal auth.
- Even in a single deployment, keep the internal `/api/v1/*` namespace + token
  check so the ownership boundary holds.

(Full security and deployment detail: contract §6, §7, §9.)

---

## 7. Definition of done

- Both repos contain this brief and the contract, byte-identical.
- The docs explicitly state: **not Codex-first runtime** (decisions #1–2) and
  **portfolio owns email** (decisions #3, #5).
- A recruiter can generate and **download a tailored PDF with no email**.
- Email is optional; when used, CC-Daniel is opt-in and contact links are
  always present if he isn't CC'd.
- No OpenAI key in the browser; no Resend key outside the portfolio server;
  public requests are rate-limited and capped; PDFs are retained only
  temporarily; JD text never appears in a URL.
- A fresh agent on either repo can implement its side from these two docs alone,
  without consulting the other repo's source.
- The feature is **not complete** until both repos are merged into their
  respective `feature/role-specific-resume-generator` branches, the cross-repo
  contract tests pass, and `main` remains unchanged until final approval.

---

## 8. Branching, staging, and rollback policy

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

The full wire-level restatement of this policy lives in the contract,
`docs/role-specific-resume-generator-contract.md` §11.
