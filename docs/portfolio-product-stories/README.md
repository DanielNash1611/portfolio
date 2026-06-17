# AI Career Operating System: Portfolio Product Stories

## Purpose

This package turns DanielNash.co and ResumeCustomizer into one source-safe
portfolio narrative. It uses the product-story drafts as direction, but limits
claims to behavior, artifacts, and metrics found in the two repositories.

The recommended portfolio information architecture remains one parent case
study:

**AI Career Operating System**

> I treated my job search as a product operating context: recruiter-facing
> proof, role-aware resume generation, authenticated service boundaries,
> evaluation workflows, and human review. The result is a production-shaped AI
> system that demonstrates product judgment and AI development fluency without
> claiming enterprise scale or external adoption.

Use anchored sections for:

1. Portfolio Site / Proof Engine
2. ResumeCustomizer / Tailoring Engine
3. Shared Platform, Integrations, and Evals
4. Learning Loops
5. Limits and Next Investments

## Reading Order

1. [Portfolio Site / Proof Engine](./story_01_portfolio_site_proof_engine.md)
2. [ResumeCustomizer / Tailoring Engine](./story_02_resume_customizer_tailoring_engine.md)
3. [Shared Platform, Integrations, and Evals](./story_03_shared_platform_integrations_and_evals.md)
4. [Challenge Memo](./CHALLENGE_MEMO_JOB_SEARCH_RISKS.md)

## Truth Labels

The stories use two explicit labels:

- **Needs implementation:** the repository does not currently provide the
  described capability or enforcement behavior.
- **Needs metric instrumentation:** the capability may exist, but the
  repositories do not currently provide trustworthy aggregate measurement.

An unlabeled statement should be supported by current code, configuration,
tests, or saved artifacts.

## Evidence Snapshot

The following metrics are defensible as a repository snapshot, not as customer
or production-usage claims:

- 25 authored Portfolio Guide evaluation cases.
- 6 specialized ResumeCustomizer review agents.
- 3 active resume template/positioning lanes.
- 407 saved deterministic role-evaluation artifacts.
- 26 of 29 archived top-level render reports passing current validation.
- A comparable stored 12-case Portfolio Guide run improved from 5/12 to 11/12
  after grounding and source-separation changes.
- Portfolio verification on June 11, 2026: 87/87 tests passed.
- ResumeCustomizer verification on June 11, 2026: 573/578 tests passed. Three
  failures reflected stale fixtures or expectations; two reflected duplicate
  application-tracker data.

These metrics require qualification on the public page. In particular, the
render-report ratio is not a generation success rate, and saved run directories
are not evidence of external usage.

## Core Evidence Locations

Portfolio repository:

- `content/portfolio.ts`
- `content/projects/portfolio-guide.ts`
- `lib/portfolio-guide/context.ts`
- `lib/portfolio-guide/prompt.ts`
- `lib/portfolio-guide/interaction-log.ts`
- `lib/portfolio-guide/evals/cases.ts`
- `lib/resume-generator/engineClient.ts`
- `lib/resume-generator/types.ts`
- `app/api/resume-generator/`
- `app/resume/generate/`
- `docs/role-specific-resume-generator-contract.md`
- `public/llms.txt`

ResumeCustomizer repository:

- `README.md`
- `DATA_CONTRACT.md`
- `sources/facts-bank.md`
- `config/templates.json`
- `config/resume-review-agents.json`
- `scripts/prepare-tailoring.ts`
- `scripts/local-orchestrator.ts`
- `scripts/lib/keyword-coverage.ts`
- `scripts/lib/claim-calibration.ts`
- `scripts/lib/role-relevance.ts`
- `scripts/lib/final-judge.ts`
- `scripts/lib/resume-renderer/`
- `lib/hosted/`
- `docs/hosted-workflow.md`
- `docs/resume-quality-gate-and-finetuning-review.md`
- `outputs/role-evals/`
- `outputs/tailoring-runs/`

## Recommended Public Page Structure

1. **The product problem:** hiring teams need faster access to credible,
   role-relevant proof; AI-generated career materials introduce accuracy risks.
2. **System at a glance:** show the recruiter-facing site, server-side proxy,
   tailoring engine, reviews, renderer, and artifact return path.
3. **Proof Engine:** explain page-grounded guidance, claim boundaries, and
   conversion paths.
4. **Tailoring Engine:** explain deterministic role analysis, evidence mapping,
   model-assisted drafting, review disciplines, and rendering.
5. **Shared platform:** explain the authenticated API boundary and asynchronous
   job lifecycle.
6. **Evals and trust:** show one sanitized guide-eval improvement and one
   resume-review tradeoff.
7. **Learning loops:** distinguish saved diagnostic artifacts from the
   analytics system that still needs to be built.
8. **Limits:** state process-local queueing, incomplete metrics, advisory quality
   verdicts, and personal/internal operating scale.
9. **Actions:** link to the Portfolio Guide and role-specific resume generator
   while making clear that actions are not evidence.

## Implementation Status

The public case-study route and its code-native visual components are now
implemented at `/products/ai-career-operating-system`.

The current working trees also implement the Claim-to-Evidence API and Portfolio
Guide tool path. They must be merged and deployed together before that
cross-repo capability is considered publicly launched.

Durable queueing, joined funnel analytics, shared page-to-evidence identifiers,
and quality-gate enforcement for final-judge rejection remain future work.
