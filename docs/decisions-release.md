# Isolated Decisions candidate

This candidate extracts Decisions routing and required answer-finalization fixes from the preserved October 8 local prototype. It builds on current main plus the approved October 16 media case-study content. Daniel directed the product behavior, evidence rules and evaluation design; implementation was AI-assisted.

## Behavior

- Ambiguous career and cross-portfolio questions can use the dedicated Decisions endpoint with gpt-6-luna (routing version 2026-10-08.v1). Direct page and resume-generator questions bypass it. Routing hints select sources and presentation; they never establish facts.
- Canonical supporting pages retain claim boundaries. Career evidence is prefetched before answer generation when requested, remains public-safe and source-audited, and is attributed only when displayed. Missing configuration, timeout, malformed output or unavailable evidence falls back safely.
- Answer processing retains qualifiers, scope and source attribution within the sentence budget. Request cancellation propagates through the durable request path.
- The production answer-model getter remains main's OPENAI_MODEL override or gpt-5.4 fallback. The dirty prototype's separate Terra default-model change is excluded. Actual deployed model metadata remains unverified: Vercel rejected the project environment-metadata read with HTTP 403. No credentials were decrypted or printed.

## Evaluation boundaries

The source-aware judge receives the supporting pages and approved career records actually present in the answer prompt. Hidden response evidence summaries are excluded from the text being graded. Routing hints are not supplied as facts. No semantic result is implied by deterministic tests.

The evaluation-only budget guard requires explicit approval, matching frozen scope, verified pricing and a ceiling of at most $10. It allows at most 24 gpt-5.4 Responses calls, six gpt-6.1-sol judgments and 36 gpt-6-luna Decisions calls. Each call reserves its full role maximum, totaling at most $7.776 under the conservative rate allowances (answer $10/$50 per million input/output tokens; judge $3/$12 including cache-write and processing margin; Decisions $0.20 input-only). Usage-derived ledger costs are upper bounds at those allowances, not an invoice reconciliation. It does not refund reservations. It rejects retries, duplicate payloads, concurrency, unsupported tools and unbounded output; uncertain transport/usage stops the run. Byte-length-plus-framing input bounds deliberately overcount tokens and stop oversized packets without truncating them. This is application admission control, not a provider billing cap. A future canary adapter must use this transport with SDK maxRetries:0 and freeze/verify its public-safe input packet before execution. No paid run is authorized by this document.

## Scope exclusions

Hybrid/embedding search, site-wide assistant changes, conversation-store changes, private-profile additions from draft PR #9, dependencies, unrelated UI and the Terra default-model change remain separate. The source's hybrid-specific test remains untouched in the original checkout; this candidate replaces that out-of-scope integration test with a router-before-evidence/answer ordering regression. ResumeCustomizer draft PR #10 remains separate.

## Verification

The first full run failed only because the sandbox denied a localhost listener in an unchanged eval-preflight test. With loopback permitted, the unchanged baseline preflight and the complete isolated suite passed. No assertion was relaxed for that failure. Semantic/model-dependent evaluation, service compatibility and production verification are separate release gates.
