# Scoped search execution proposal — October 17, 2026

Status: proposed, not approved or executed. Cache reconciliation is complete as
authorized local preparation. No further decision was needed to inspect caches.
This is a new proposal; the superseded 21-call/$2 approval was never granted and
does not transfer to this run.

## Exact corpus and vector reconciliation

| Frozen input | Total | Reusable vectors | New embedding texts |
| --- | ---: | ---: | ---: |
| Approved public career records | 27 | 25 | 2 |
| Complete qualified portfolio blocks | 63 | 0 | 63 |
| Exact frozen queries | 29 | 14 | 15 |
| Total | 119 | 39 | 80 |

The current isolated catalog builders reproduce the frozen career and qualified
portfolio documents exactly, including qualifications, source references and
revision hashes. Their corpus hashes remain
`4adfeda571d38965d06be767a1549c6d7f426e8f5bf17a8e52d1b53ccababa94`
and `1b9efb69391740d0b314fd5f3d58984af6bdc4b8bb2ab21456b97b8b96d92e8d`.
The 29-query file remains SHA-256
`90dd9aae3586e56ad3a764d976ec0f57d5de6399227216301e98a725881478ce`.

Reuse requires exact UTF-8 text SHA-256, `text-embedding-3-small`, 1,536 finite
numeric dimensions and source-file/record provenance. Stable IDs alone never
justify reuse. Both approved career texts that lack vectors remain missing:
`chatgpt-champions-train-trainer` and
`product-operating-model-institutionalized`. Their same-ID entries in the
original 35-record cache have different text hashes and were rejected.

None of the original 261 portfolio passage vectors match the 63 qualified blocks.
No older passage or excluded career record was imported. Only vector values are
reused; current approved IDs, qualifiers and source metadata remain authoritative.
Cache provenance is repository asserted, verified against files and backing text;
provider origin and billing receipts were not independently reverified.

The 15 missing query IDs are `c-onboarding-current`, `p-ownership`, `p-validation`,
`p-impact`, `p-media`, `p-immunology`, `p-oms`, `p-strategy`, `p-evaluation`, and
the six `live-*` case queries below. Effective queries retain Immunology Scout
alias resolution and the exact declared-role suffix. No normalization-based or
approximate cache reuse is proposed.

All 80 missing texts are unique and total 31,625 UTF-8 bytes. Use the existing
index builder's batches of 64 and 16, retaining an explicit namespace/ID map;
then reconstruct separate career, portfolio and query indexes from receipts plus
the 39 reusable vectors. Validate full corpus hashes before using them. These two
batches replace the old three batches; no runtime query embedding is allowed.

## Smallest complete fresh fidelity sample

Run each of the six original risks once, with the exact frozen question, page and
role. No extra sampling, model ensemble or favorable-result retries are proposed.

| Case | Page | Exact question | Luna routing |
| --- | --- | --- | --- |
| patent-measurement | immunology-scout | Has Immiatrics reduced patent-search hallucinations, and what was measured? | Bypass |
| ownership | ai-platform-mcp | What did Daniel own versus AI-assisted implementation across the portfolio? | One call |
| onboarding | ai-platform-mcp | What evidence supports Daniel's eight-week onboarding for product managers and stakeholders? | Bypass |
| oms-context | oms-chatgpt-app | For OMS, distinguish the public demo from later production milestones. | Bypass |
| qualification | immunology-scout | Is Daniel HIPAA certified for clinical research? | Bypass |
| role-fit | ai-platform-mcp | Across the portfolio, what supports my role requirements? | One call |

The role-fit case declares exactly: “AI product leader requiring retrieval
evaluation and HIPAA qualification”. Source/claim checks retain measured-set
limits, AI-assisted implementation credit, Guitar Center onboarding duration
without adoption/completion/impact claims, OMS demonstration versus production
scope, and unsupported qualification gaps.

Use the current original native eval pipeline's prompts, relevance stage, answer
stage, normalization and guardrails in an isolated snapshot, restricted to the
approved 27/63 source set and frozen query map. Its relevance and final-answer
stages each use `gpt-5.6-terra`; its two routed cases use `gpt-6-luna` Decisions.
This tests fresh production-model behavior on the staged corpus. It does not
verify the deployed service or authorize activation.

The earlier isolated candidate uses one Terra claim-ID selection followed by
deterministic qualified rendering. Its six Terra calls would validate that
candidate's behavior. The current original pipeline also has a final-answer
model stage, so this full fidelity proposal reserves up to twelve Terra calls.
Any unused call slot stays unused.

## Calls, reservations and approval boundary

| Stage | Maximum calls | Input token caps | Total output cap per call | Full reservation |
| --- | ---: | --- | ---: | ---: |
| New embeddings | 2 | 40,000; 8,000 | 0 | $0.000960 |
| Luna Decisions routing | 2 | 8,000 each | No charged output | $0.001600 |
| Terra relevance | 6 | 48,000 each | 1,000 | $0.792000 |
| Terra final answer | 6 | 48,000 each | 1,200 | $0.806400 |
| Total | 16 | | | $1.600960 |

Proposed incremental external API ceiling: **$2.00**. Rates come from the existing
local official-documentation attestation at **2026-10-17 22:26:14 UTC**: embeddings
$0.02/M input, routing $0.10/M input, Terra $2.50/M input including a conservative
25% cache-write allowance, and $12/M total output including reasoning. No cache
discounts are assumed. No pricing network request was made for this reconciliation;
reverify prices before an authorized execution and stop if the bound no longer fits.

Codex active-chat review replaces the Sol API judge: **zero Sol API judge calls,
zero Codex SDK calls**. It uses the existing Codex session's usage, whose cost is
unknown and outside the external API ceiling. It is not assumed free. Review is
author-assisted model judgment; independent review and Daniel calibration remain
separate.

## Preparation and stopping rules

The proposal is not yet an executable run. The native adapter needs a frozen
allowlist/vector-map input, serial one-attempt transport, request reservations and
global spend enforcement; its current case/time flags alone do not enforce this
proposal. The current final-answer request has no output cap, so the bounded eval
must explicitly add the 1,200 total-output limit. Preserve prompts and record this
evaluation limit. Responses use the existing API-key path, default service tier,
`store:false` and no tools. Make these changes only in an isolated snapshot and verify them
with fake transport before requesting live execution. Do not restore the old Sol
judge harness or change the dirty original checkouts.

Before transport, require explicit approval of this new scope and price verification.
Pin code, corpus, queries, source provenance and reused vector hashes. Reserve each
call's full cap before sending; uncertain charges retain the full reservation.
Run serially with no retries, model fallback, replacement cases, extra tools,
background calls, live career endpoint, live database or automatic embeddings.
Use at most 60 seconds per embedding/routing request, 90 seconds per Terra request
and 25 minutes total. Abort on timeouts instead of retrying.

Stop on source/code/query drift, missing cache lookup, invalid vectors, unexpected
model/usage, cap overrun, failed/incomplete transport or output, routing fallback,
unknown selected IDs, invalid citations, lost qualifications or unsupported claims.
Score all 23 retrieval cases after index completion; stop on regressions among the
previously passing 22. Retain the known context-free portfolio ownership label's
7/8 result and require the scoped fresh ownership case to pass. Never silently
relabel the historical fixture. Swallowed errors and lexical fallback remain
failures for this run, not evidence of a successful hybrid/model path.

Save requests, raw replies, usage, selected/cited IDs, raw/displayed answers and
one-run results. Export the existing native Codex review packet with exact packet
and rubric hashes, cited pass/fail/uncertain findings, and validate it with the
existing review command. An existing-capture review judges saved outputs; it does
not exercise changed prompts, retrieval, Terra or Luna. A fresh fidelity result
requires this new model run. Keep those evidence types separate.

## Local evidence completed

Both scoped builders match their frozen inputs; all 63 block texts and source
references and all 27 public records were checked. Eight cache guard tests passed.
Lexical replay remains career 15/15 and portfolio 7/8. Exact reusable vector
provenance, rejected same-ID cache entries, all missing texts and batch maps are
in the preparation workspace's
`review-evidence/semantic-search-preparation-20261017/cache-reconciliation/`.
No model/network call, credential change, push, merge, deployment or activation ran.
