# Isolated Decisions candidate

This candidate extracts Decisions routing and required answer-finalization fixes from the preserved October 8 local prototype. It builds on current main plus the approved October 16 media case-study content. Daniel directed the product behavior, evidence rules and evaluation design; implementation was AI-assisted.

## Behavior

- Ambiguous career and cross-portfolio questions can use the dedicated Decisions endpoint with gpt-6-luna (routing version 2026-10-08.v1). Direct page and resume-generator questions bypass it. Routing hints select sources and presentation; they never establish facts.
- Canonical supporting pages retain claim boundaries. Career evidence is prefetched before answer generation when requested, remains public-safe and source-audited, and is attributed only when displayed. Missing configuration, timeout, malformed output or unavailable evidence falls back safely.
- Answer processing retains qualifiers, scope and source attribution within the sentence budget. Request cancellation propagates through the durable request path.
- Daniel selected gpt-5.6-terra on October 17 at 05:05:12 UTC. HTTP and direct generation now share the Terra default with PORTFOLIO_GUIDE_MODEL taking precedence over shared OPENAI_MODEL. Set PORTFOLIO_GUIDE_MODEL=gpt-5.6-terra explicitly at deployment; an existing shared override can otherwise select another model. Actual deployed metadata remains unverified: Vercel rejected the project environment-metadata read with HTTP 403. No credentials were decrypted or printed.

## Evaluation boundaries

The source-aware judge receives the supporting pages and approved career records actually present in the answer prompt. Hidden response evidence summaries are excluded from the text being graded. Routing hints are not supplied as facts. No semantic result is implied by deterministic tests.

The evaluation-only budget guard requires explicit approval, matching frozen scope, verified pricing and a ceiling of at most $10. The selected Terra plan allows 12 gpt-5.6-terra answer calls (one per workflow), six gpt-6.1-sol paired judgments and at most 36 gpt-6-luna Decisions calls. It preserves the same six scenarios and frozen evidence; no extra source data or paid bake-off is added.

Responses input is bounded conservatively by complete UTF-8 request bytes plus 1,024 framing allowance, at most 100,000 possible input tokens; output is at most 1,200 total tokens. Routing retains an 8,000-input-token byte bound. This admits the existing 70–79 KB packets without trimming evidence or calling an additional token-count API. The earlier 24,000-token byte bound was unnecessarily restrictive; verified Terra pricing permits this larger conservative admission bound while reducing answer-call count.

Reserve every complete role maximum before transport, without refunds: Terra input/output $3.25/$16 per million gives 12 × $0.3442 = $4.1304. Sol input/output $6.50/$19.50 covers documented long-context, cache-write and processing margins and gives six × $0.6734 = $4.0404. Decisions input allowance $0.20 gives 36 × $0.0016 = $0.0576. Full reservation is $8.2284, below $10. Official Terra short-context rates are $2 input/$12 output, cache writes 1.25x input; its long-context threshold is above 272K, beyond this bound. Sol standard short/long rates and cache-write costs, and Decisions input-only pricing, are separately verified. No discounts are assumed. Ledger usage-derived costs are conservative upper bounds at these allowances, not invoice reconciliation.

The guard rejects retries, duplicate payloads, concurrency, model/tier changes, unsupported tools and unbounded output; uncertain transport/usage or journal failure stops the run. It persists reservations before transport. This is application admission control, not a provider billing cap. No new credentials or account changes are permitted.

## Scope exclusions

Hybrid/embedding search, site-wide assistant changes, conversation-store changes, private-profile additions from draft PR #9, dependencies, unrelated UI remain separate. The source's hybrid-specific test remains untouched in the original checkout; this candidate replaces that out-of-scope integration test with a router-before-evidence/answer ordering regression. ResumeCustomizer draft PR #10 remains separate.

## Verification

The first full run failed only because the sandbox denied a localhost listener in an unchanged eval-preflight test. With loopback permitted, the unchanged baseline preflight and the complete isolated suite passed. No assertion was relaxed for that failure. Semantic/model-dependent evaluation, service compatibility and production verification are separate release gates.

## Guarded canary adapter

Run offline first with `node --import tsx scripts/run-guarded-canary.ts --packet <frozen-packet.json> --out-dir <new-run-directory> --dry-run`. This uses transport fixtures, reads no API key, and permits no semantic quality claim. It exercises six scenarios in alternating enabled/disabled order, six blinded source-aware paired judgments and 32 routing fixtures. Shared context is deduplicated structurally without dropping differing source fields.

Live execution additionally requires a reviewed approval JSON matching the exact packet SHA-256, confirmed target model, verified generation prices, and existing `OPENAI_API_KEY` access. The adapter does not load local env files or change model defaults. It uses single-attempt REST calls, output limits, timeouts, no external discovery/live career-service tools, atomic run claiming, persisted budget reservations and immutable original result files. A second invocation into the same directory is refused. The guard now pins the user-selected gpt-5.6-terra plan. Official standard short-context prices are $2 input/$12 output per million tokens; cache writes are 1.25x input. The existing account returned 200 for read-only Terra model metadata. Conservative reservations remain $10/$50 for answer tokens and $7.776 for the complete run. Production configuration is still unverified.

The initial byte-only input bound safely rejected 70–79 KB frozen requests. No context was truncated. The verified-price policy above now bounds the complete unchanged packet conservatively with bytes and framing. No token-count endpoint, extra billable preflight or new tokenizer dependency is used.

## Historical model bake-off

Daniel requested the existing bake-off in the portfolio story on October 17. The public aggregate section is sourced from the preserved October 8 comparison report and artifacts/gpt6-improvements/{summary,luna-terra-results,gpt5-after-results,sol-results,final-judges,recommendation-rechecks,ownership-final-results}.json. It reports the actual four models, 12-question/72-trial design, unequal repeats, blinded source-aware gpt-5-mini grading, original main failures, separate ownership repairs, workflow latency/timeouts, recorded token use and missing reconciled dollar costs. It distinguishes this study from routing off/on and current release validation. No new expanded paid bake-off is authorized or performed. Source hashes and exact dataset membership are in the local review evidence.

## Resume-instruction repair

The fresh local final run exposed a real output-processing regression: the guardrail added the required job-description instruction, then four-sentence bounding could discard it. A failing regression test reproduced this and now passes after prioritizing that required action instruction for resume questions. A full deterministic replay of all 43 saved raw outputs verified byte-identical requests and prompt inputs; only ai-career-direct-resume-request changed, moving those checks from 37/43 to 38/43. This is a deterministic replay, not a new model run or deployed-quality claim. Original runs and the uninterrupted common judge remain preserved.
