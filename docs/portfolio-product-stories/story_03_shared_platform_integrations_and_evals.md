# Product Story: Shared Platform, Integrations, and Evals

## Working Title

**A production-shaped integration between recruiter UX and resume generation**

## One-Line Summary

Connected DanielNash.co and ResumeCustomizer through an authenticated
server-to-server API so the portfolio can own recruiter experience while the
tailoring service owns generation, review, rendering, and temporary artifacts.

## Product Problem

A recruiter-facing website and a resume engine have different product and
operational responsibilities. Combining them in one browser-facing application
would expose credentials, couple the user experience to long-running generation,
and make deployment constraints harder to manage.

The integration needed a clear boundary that could support:

- Public recruiter interaction without exposing internal tokens.
- Long-running generation with visible progress.
- Direct download and optional email delivery.
- Temporary handling of sensitive job-description and resume data.
- Independent evolution of the portfolio UX and tailoring engine.

## Implemented Architecture

```text
Recruiter or hiring manager
          |
          v
DanielNash.co browser experience
          |
          v
Portfolio same-origin API routes
  - validation and request caps
  - rate limiting
  - public status translation
  - PDF streaming
  - optional Resend email
          |
          | authenticated server-to-server request
          v
ResumeCustomizer internal API
  - create, status, and PDF endpoints
  - role and evidence workflow
  - OpenAI review runtime
  - Playwright/Chromium rendering
  - temporary job and PDF retention
```

The browser calls only Portfolio routes. Portfolio injects the bearer token on
the server and rewrites the internal PDF path to a same-origin public download
URL. Job-description content is sent in request bodies rather than URLs.

## Implemented Product Decisions

### 1. Clear service ownership

Portfolio owns recruiter-facing validation, status UX, direct download, email,
and contact behavior. ResumeCustomizer owns generation, reviews, rendering, and
internal job state.

ResumeCustomizer does not hold the email provider key. Portfolio does not run
the tailoring pipeline or render the PDF.

### 2. Asynchronous jobs instead of one long request

The internal API creates a job and returns immediately. The public UI polls a
forward-only status model and can present meaningful phases before the PDF is
ready.

This supports a better recruiter experience and isolates the browser from the
long-running process, but the current queue itself remains in-process.

### 3. Security and privacy boundaries

Internal endpoints fail closed when no token is configured and use timing-safe
token comparison. Both layers enforce request caps. Internal errors are mapped
to safe public messages.

PDFs and job inputs have a temporary retention window. Opaque job identifiers
are the shared handle across the boundary.

### 4. Contract-driven integration

Both repositories document the public and internal request shapes, status
values, error model, ownership split, and polling behavior. The code mirrors
those contracts with typed request and response models.

The high-level cross-repo brief is aligned. The detailed contract copies contain
minor wording drift, which is a maintenance risk rather than evidence of an
observed runtime incompatibility.

### 5. Separate evaluation systems

The Portfolio Guide and ResumeCustomizer both use evaluation practices, but
they do not currently share one eval service or score model.

Portfolio evaluates page grounding, ownership boundaries, source separation,
and recruiter-facing answer behavior. ResumeCustomizer evaluates role fit,
keyword coverage, source safety, positioning, readability, and rendered output.

This separation is appropriate because the products have different failure
modes. A shared reporting layer could aggregate them without forcing one rubric.

## What Is Shared Now

The current working trees implement two authenticated server-to-server paths:

- Role-specific resume job creation, status, and final artifact retrieval.
- Public-safe, source-audited career evidence retrieval for deeper Portfolio
  Guide questions.

The evidence endpoint defaults to `publicSafeOnly` and `sourceAuditedOnly`,
returns structured evidence rather than raw resume bullets, and provides a safe
fallback when evidence is insufficient.

This does not make Portfolio content the authoritative source used by
ResumeCustomizer, and it is not yet a complete evidence graph.

- **Needs implementation:** canonical shared page-to-evidence identifiers or a
  synchronized publishing pipeline.
- **Needs implementation:** contract generation from a canonical schema rather
  than maintaining hand-copied documentation and mirrored types.
- **Needs implementation:** a sanitized quality summary in the ready-job
  response.
- **Needs implementation:** shared product-event taxonomy across both services.

## Evals As Product Instrumentation

The strongest portfolio framing is that evals define product quality and expose
tradeoffs. They should not be presented as an objective hiring score.

Recommended public dimensions:

1. Current-page or approved-source grounding
2. Ownership and overclaim safety
3. Role relevance and top-third clarity
4. Keyword coverage with true-gap handling
5. ATS readability and render validity
6. Positioning coherence

Recommended evidence:

- Portfolio Guide: a historical comparable run improved from 5/12 to 11/12
  after grounding and source-separation changes.
- ResumeCustomizer: one sanitized example where top-third clarity improved while
  a source-safety concern was still surfaced.
- Renderer: a checklist of structural validations rather than a broad "quality
  score."

Do not combine unlike evals into one percentage or claim that a model-generated
score predicts recruiter outcomes.

## Learning Loop: Current State

Both repositories preserve useful diagnostic evidence:

- Portfolio prompts, pages, roles, latency, response length, and errors can be
  logged to Neon.
- Portfolio eval runs preserve case-level outcomes.
- ResumeCustomizer saves phase logs, metadata, reviewer outputs, retries,
  failures, final-judge artifacts, keyword coverage, and render reports.

These artifacts support debugging and manual analysis. They are not yet a
unified product analytics system.

## Learning Loop: Recommended Next Step

Create a read-only reporting pipeline with this issue taxonomy:

- Generation failure
- Weak or missing evidence
- Keyword miss
- ATS or rendering failure
- Narrative mismatch
- Role-classifier miss
- Template mismatch
- API timeout or cold start
- Token or cost issue
- Human override or repeated edit

The reporter should:

1. Parse sanitized run metadata and failures.
2. Count recurring categories by version and workflow phase.
3. Link each category to a likely product surface: evidence, classifier,
   template, prompt, runtime, renderer, or UX.
4. Produce Markdown and JSON summaries.
5. Require human approval before changing prompts, sources, templates, or eval
   rubrics.

- **Needs implementation:** taxonomy and report generator.
- **Needs metric instrumentation:** durable API, queue, download, email, and
  feedback events.
- **Needs metric instrumentation:** versioned latency, completion, failure, and
  override rates.

## High-Value Integration Opportunities

### Shared evidence references

Assign durable IDs to approved facts and project evidence. Portfolio pages and
ResumeCustomizer bullets can then reference the same IDs without requiring one
application to own all content.

### Role intent to variant hint

Portfolio already models visitor role intent, and the generator contract already
supports `variantHint`. Passing an explicit, user-confirmed role lane would make
the integration more coherent.

### Sanitized quality summary

Add a small status payload containing checks passed, unresolved true gaps, and
human-review state. Do not expose raw job descriptions or full reviewer prose.

### Durable jobs and telemetry

Move job state and queueing to a durable store before supporting multiple
workers. Record phase duration, retries, and normalized failure codes.

### Privacy-safe feedback

After download or email, ask whether the artifact was useful and whether major
edits were required. Store only opaque job IDs, role categories, and structured
feedback unless the user explicitly approves more.

## Portfolio-Ready Copy

> The integration layer turned two useful tools into one coherent workflow. The
> portfolio owns recruiter experience and public actions; ResumeCustomizer owns
> evidence-aware generation, specialized reviews, and PDF rendering. An
> authenticated server-to-server API keeps tokens out of the browser and gives
> long-running work a visible job lifecycle. The system is intentionally
> production-shaped: its boundaries, contracts, failure states, and evaluations
> are real, while durable queueing and end-to-end product analytics remain the
> next investments.

## Claims To Avoid

- "One shared evidence graph already powers both products."
- "The platform learns automatically from every run."
- "The evals predict hiring success."
- "The API is enterprise-scale or highly available."
- "Cold-start and retry performance improved" without versioned measurements.
- "End-to-end generation reliability is X%" without durable event data.
- "The agents independently prioritize the roadmap."
