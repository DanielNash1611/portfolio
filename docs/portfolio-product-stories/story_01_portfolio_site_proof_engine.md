# Product Story: DanielNash.co Portfolio Site / Proof Engine

## Working Title

**Proof Engine: a recruiter-facing portfolio organized around evidence**

## One-Line Summary

Designed a portfolio product that helps recruiters and hiring managers evaluate
Daniel through authored case-study evidence, explicit claim boundaries, and
role-relevant navigation rather than relying on a static biography or
unconstrained AI summary.

## Product Problem

Hiring teams often scan a portfolio quickly, while the evidence needed to judge
product leadership is distributed across case studies, metrics, recommendations,
technical artifacts, and a resume. An AI guide can make that evidence easier to
find, but it can also weaken trust if it invents ownership, repeats unsupported
claims, or treats its own prior answers as source material.

The product challenge was therefore not simply to publish projects. It was to
create a recruiter-facing surface that could:

1. Keep the current page and its authored evidence primary.
2. Distinguish direct ownership, influence, conceptual work, and implementation.
3. Help visitors connect evidence to their role without inflating fit.
4. Offer clear resume and contact actions without treating those actions as
   proof.

## Users

- Recruiters performing a fast credibility and role-fit scan.
- Hiring managers looking for product decisions, outcomes, ownership boundaries,
  and technical fluency.
- AI-assisted research tools that need structured, agent-readable context.
- Daniel as the operator maintaining portfolio content, evaluation cases, and
  conversion paths.

## Product Insight

The strongest version of the portfolio is not a collection of identity labels.
It is a proof-navigation product. Authored pages establish what is known; claim
boundaries establish what is not proven; the Portfolio Guide helps visitors
interrogate that evidence without becoming a new source of truth.

## Implemented Product Decisions

### 1. Structured content before generated interpretation

The site stores work, product, thinking, metric, artifact, and recommendation
data in typed content models. The Portfolio Guide builds page context from this
authored content instead of scraping generated chat output.

The prompt's source priority keeps current-page authored sections ahead of
broader portfolio context. Prior assistant answers are deliberately excluded
from future grounding.

### 2. Claim boundaries as part of the user experience

The guide is instructed not to invent metrics, ownership, causality,
technologies, team size, org structure, or implementation responsibility. It
must distinguish direct responsibility from influence and state when a page
does not prove something.

This turns overclaim prevention into product behavior rather than relying only
on careful marketing copy.

### 3. Role-aware discovery without changing the evidence

The guide can use declared visitor intent, recent user questions, visited pages,
and interest tags to recommend a useful path through the site. The evidence
itself remains page-authored and role-independent.

This is an important design boundary: role context changes navigation and
explanation, not the underlying facts.

### 4. Action is separated from evidence

The site provides a role-specific resume generator at `/resume/generate`, but
the Portfolio Guide explicitly treats it as an action surface, not as proof of
Daniel's experience or fit.

The generator uses same-origin public routes. Server code injects the
ResumeCustomizer bearer token, so internal service credentials and URLs do not
reach the browser.

### 5. Trustworthy recruiter conversion

The public flow supports job creation, forward-only progress states, direct PDF
download, and optional email delivery. Mock output is labeled so it cannot be
mistaken for recruiter-ready material.

The resume experience sets an explicit time expectation and exposes failure and
expiration states instead of pretending generation is instantaneous.

### 6. Evaluation and interaction signals

The repository includes 25 authored Portfolio Guide evaluation cases and a
hybrid evaluation runner with deterministic checks and optional model judging.
The site also includes Neon-backed interaction logging for prompts, pages,
visitor roles, response latency, answer length, and errors.

The reporting script can summarize prompt themes, pages, roles, source mix, and
errors when a database connection is available.

## Evidence-Backed Metrics

- **25 guide eval cases:** current authored evaluation inventory.
- **87/87 tests passed:** Portfolio test verification on June 11, 2026.
- **5/12 to 11/12:** comparable stored OpenAI evaluation artifacts improved
  from 41.7% to 91.7% after grounding and source-separation work. This is a
  historical 12-case comparison, not a claim that every current eval passes.
- **Nine generation states:** queued, analyzing, mapping, drafting, reviewing,
  rendering, ready, failed, and expired.

## What Is Not Yet Proven

- The current working trees implement a public-safe, source-audited evidence
  retrieval API from ResumeCustomizer to the Portfolio Guide. This is a
  governed search path, not a complete shared evidence graph.
  - **Needs implementation:** durable shared page-to-evidence identifiers or a
    synchronized publishing model.
- The repositories do not provide a trustworthy end-to-end recruiter funnel
  covering page view, guide use, generation start, successful completion,
  download, email, and follow-up.
  - **Needs metric instrumentation.**
- Current database exports were not available during the audit, so no claim
  should be made about guide usage, recruiter adoption, or conversion.
  - **Needs metric instrumentation.**
- The current public upload experience accepts text and Markdown files; PDF and
  DOCX job-description extraction are not implemented.
  - **Needs implementation.**

## Portfolio-Ready Copy

> I designed DanielNash.co as a proof-navigation product rather than a static
> portfolio. Authored case studies remain the source of truth, while a
> page-grounded AI guide helps recruiters and hiring managers find relevant
> evidence, understand ownership boundaries, and connect the work to their role.
> The system separates evidence from action: visitors can explore case studies,
> ask grounded questions, or start a role-specific resume flow without treating
> generated output as proof.

## Recommended Visuals

- Architecture diagram showing authored content, Portfolio Guide context,
  deterministic guardrails, and visitor response.
- Screenshot of a recruiter question with "signals on the page" and "not proven
  here" separated.
- Screenshot of the role-specific resume progress flow.
- Historical 12-case eval comparison labeled with provider, date, and scope.

## Claims To Avoid

- "The portfolio is the shared source of truth for every career asset."
- "Recruiters use the guide at scale."
- "The AI determines Daniel's fit."
- "The guide cannot hallucinate."
- "All guide evals pass."
- "The portfolio measurably improved hiring conversion."
