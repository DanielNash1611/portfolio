# Product Story: ResumeCustomizer / Tailoring Engine

## Working Title

**ResumeCustomizer: source-grounded tailoring with specialized reviews**

## One-Line Summary

Designed a local-first, role-aware resume workflow that combines deterministic
evidence selection, model-assisted drafting, specialized review disciplines,
structural validation, and ATS-safe PDF rendering.

## Product Problem

Resume tailoring is not only a speed problem. A fast generator can damage
credibility by selecting the wrong narrative, missing role-critical language,
inventing scope, overstating adjacent experience, or producing a document that
fails basic rendering and ATS checks.

The product therefore treats tailoring as a controlled workflow rather than a
one-shot writing prompt.

## Users

- Daniel as the primary operator and final decision-maker.
- Recruiters and hiring managers who receive the generated artifact.
- Future users are possible, but the repositories do not demonstrate external
  customer adoption.

## Product Insight

The valuable system is not "AI writes a resume." It is a sequence of product
decisions:

1. Determine whether a role is worth pursuing.
2. Select the most credible positioning lane.
3. Map job requirements to approved evidence.
4. Identify direct fit, safe bridges, and true gaps.
5. Draft role-specific language.
6. Review the result from several hiring and trust perspectives.
7. Validate and render a usable artifact.
8. Preserve enough diagnostic context for human review and future improvement.

## Implemented Workflow

### 1. Deterministic triage and template selection

ResumeCustomizer includes deterministic role evaluation and three current
template lanes:

- AI Product Builder-Leader
- AI Transformation Product Leader
- Senior Product Manager as an explicit fallback

The configuration favors product accountability, AI workflows, platform
strategy, transformation, governance, and business outcomes. It does not treat
every Senior PM role as an equal target.

### 2. Approved evidence and provenance

The repository separates user evidence from system logic through a documented
data contract. The facts bank, source files, bullet bank, custom run notes, and
selected source references constrain what the system may claim.

Keyword coverage classifies exact, partial, missing, supported, and unsupported
terms. Missing job-description language is not automatically inserted; a term
without candidate support is treated as a true gap.

### 3. Positioning bridges without invented experience

The workflow creates a bridge map that distinguishes direct fit,
adjacent-domain evidence, perception gaps, seniority framing, and unsupported
requirements.

This is a product strategy layer, not an authorization layer. The bridge may
translate approved proof into role-native language, but it cannot create new
facts.

### 4. Specialized review perspectives

Six configured agents review different quality dimensions:

- Recruiter Screen
- Hiring Manager
- Career Coach
- Source Auditor
- ATS Readability
- Positioning and Bridge Strategist

The local workflow can use Ollama models. The hosted workflow uses an OpenAI
runtime. Review artifacts include structured outputs, context and prompt hashes,
timings, retries, validation status, and saved failures.

### 5. Canonical output and structural validation

The final-judge step writes canonical resume JSON when schema and repair checks
succeed. The Playwright/Chromium renderer produces HTML, JSON, PDF, and a render
report.

Renderer validation checks required modules, marker leakage, unresolved
placeholders, page limits, nonempty PDF output, and selectable text.

### 6. Hosted job interface

ResumeCustomizer also exposes an authenticated internal API for job creation,
status polling, and PDF retrieval. Jobs move through nine forward-only states
and return safe, generic error messages rather than leaking internal details.

The hosted engine invokes the existing preparation, review, final-judge, and
rendering scripts. The browser is not part of this internal boundary.

## Important Quality-Gate Boundary

Structural failures can prevent canonical output or PDF rendering. However, the
repository's own quality-gate review documents that a final-judge `reject`
verdict and low reviewer scores are currently advisory. A rejected but
structurally valid resume can still render.

- **Needs implementation:** block rendering or require an explicit human
  override when the final judge returns `reject`.
- **Needs implementation:** surface the gate state clearly in Mission Control
  and the hosted result.
- **Needs implementation:** define which reviewer findings are release-blocking
  versus advisory.

Public copy should therefore say "specialized review and structural quality
gates," not "every resume must pass a complete quality gate."

## Evidence-Backed Metrics

- **3 template lanes** configured for current role positioning.
- **6 specialized review agents** with distinct hiring and trust perspectives.
- **407 saved role-evaluation artifacts:** repository snapshot, not external
  usage.
- **26 of 29 archived top-level render reports passed current validation:**
  artifact-level render validation, not a generation success rate.
- **573 of 578 tests passed** on June 11, 2026. The five failures represent
  current fixture/data drift and should remain visible until corrected.

Saved reviewer-score deltas show mixed outcomes. Across historical artifacts,
top-third clarity trends modestly positive, while other dimensions are flat or
negative. The honest product conclusion is that the review system exposes
tradeoffs; it does not yet prove a universal quality uplift.

## What Needs Metric Instrumentation

- Unique completed generations separated from tests, retries, and versioned
  artifacts.
- Completion and failure rate by engine and release version.
- Median and p90 phase duration.
- Retry frequency and cold-start impact.
- Unsupported claims caught, removed, or approved after evidence intake.
- Keyword coverage before and after tailoring.
- Human edits after generation.
- Final-judge override rate.
- Cost and token usage by successful resume.
- Download, email, and application outcomes.

## Operational Constraints

The default hosted queue and job store are process-local. Jobs and PDF bytes are
temporarily held in one Node process, and work is started with `setImmediate`.
This fits a single long-lived service but does not provide durable recovery or
horizontal scaling.

- **Needs implementation:** durable job state and queueing before reliability or
  scale claims.
- **Needs implementation:** shared rate limiting and worker-safe idempotency for
  multi-instance deployment.
- **Needs metric instrumentation:** restart loss, queue wait, timeout, and retry
  behavior.

## Portfolio-Ready Copy

> ResumeCustomizer began as a speed problem, but the product challenge became
> trust. I designed the workflow to classify the role, choose a credible
> positioning lane, map requirements to approved evidence, identify safe bridges
> and true gaps, draft role-specific content, review it from six perspectives,
> and render an ATS-safe PDF. The repository demonstrates an eval-driven,
> production-shaped workflow while preserving human judgment for a high-stakes
> artifact.

## Recommended Visuals

- Workflow diagram from job description through triage, evidence mapping,
  reviews, final judge, and renderer.
- Sanitized keyword-coverage matrix showing supported, partial, and true-gap
  terms.
- Sanitized reviewer comparison showing a quality improvement and a surfaced
  tradeoff.
- Renderer report excerpt showing structural checks.
- Hosted status stepper with failure and expiration states.

## Claims To Avoid

- "Production SaaS."
- "Enterprise-scale resume generation."
- "The final judge blocks every weak resume."
- "Six agents independently decide what to publish."
- "89.7% generation success."
- "407 resumes generated."
- "The system has proven hiring or recruiter-conversion impact."
- "The workflow eliminates hallucinations."
