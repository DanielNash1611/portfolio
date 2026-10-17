# Isolated Decisions candidate

This candidate extracts Decisions routing and required answer-finalization fixes from the preserved October 8 local prototype. It builds on current main plus the approved October 16 media case-study content. Daniel directed the product behavior, evidence rules and evaluation design; implementation was AI-assisted.

## Behavior

- Ambiguous career and cross-portfolio questions can use the dedicated Decisions endpoint with gpt-6-luna (routing version 2026-10-08.v1). Direct page and resume-generator questions bypass it. Routing hints select sources and presentation; they never establish facts.
- Canonical supporting pages retain claim boundaries. Optional remote career evidence stays disabled by default (PORTFOLIO_GUIDE_CAREER_EVIDENCE_ENABLED=false), independently of the resume engine connection. The selected Resume branch supports /api/v1/resume-jobs but has no /api/evidence/search; that endpoint exists only in the preserved dirty checkout and was not imported. Canonical page routing and resume generation use their existing supported contracts. The local retrieval prototype is explicitly qualified in the story. After separate endpoint review, an explicit true flag enables the existing authenticated evidence contract; requested evidence is prefetched, public-safe/source-audited, and attributed only when displayed. Missing configuration or unavailable evidence falls back safely.
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

Live execution additionally requires a reviewed approval JSON matching the exact packet SHA-256, confirmed target model, verified generation prices, and existing `OPENAI_API_KEY` access. The adapter does not load local env files or change model defaults. It uses single-attempt REST calls, output limits, timeouts, no external discovery/live career-service tools, atomic run claiming, persisted budget reservations and immutable original result files. A second invocation into the same directory is refused. The guard now pins the user-selected gpt-5.6-terra plan. Official standard short-context prices are $2 input/$12 output per million tokens; cache writes are 1.25x input. The existing account returned 200 for read-only Terra model metadata. The complete conservative reservation is $8.2284 under the verified-price byte-bound policy above. Production configuration is still unverified.

The initial byte-only input bound safely rejected 70–79 KB frozen requests. No context was truncated. The verified-price policy above now bounds the complete unchanged packet conservatively with bytes and framing. No token-count endpoint, extra billable preflight or new tokenizer dependency is used.

## Historical model bake-off

Daniel requested the existing bake-off in the portfolio story on October 17. The public aggregate section is sourced from the preserved October 8 comparison report and artifacts/gpt6-improvements/{summary,luna-terra-results,gpt5-after-results,sol-results,final-judges,recommendation-rechecks,ownership-final-results}.json. It reports the actual four models, 12-question/72-trial design, unequal repeats, blinded source-aware gpt-5-mini grading, original main failures, separate ownership repairs, workflow latency/timeouts, recorded token use and missing reconciled dollar costs. It distinguishes this study from routing off/on and current release validation. No new expanded paid bake-off is authorized or performed. Source hashes and exact dataset membership are in the local review evidence.

## Resume-instruction repair

The fresh local final run exposed a real output-processing regression: the guardrail added the required job-description instruction, then four-sentence bounding could discard it. A failing regression test reproduced this and now passes after prioritizing that required action instruction for resume questions. A full deterministic replay of all 43 saved raw outputs verified byte-identical requests and prompt inputs; only ai-career-direct-resume-request changed, moving those checks from 37/43 to 38/43. This is a deterministic replay, not a new model run or deployed-quality claim. Original runs and the uninterrupted common judge remain preserved.

## Bounded Terra canary result and follow-up repair

The authorized run at 7371d60 completed 12 Terra answer calls, six Sol paired judgments and 23 Luna Decisions calls, with no retries or unknown usage. All 32 routing cases passed. Original answer judgments were 6/6 routing-disabled and 5/6 routing-enabled; four preferences favored disabled, two tied, none favored enabled. Mean helpfulness was 4.333 disabled and 3.667 enabled. This is a small one-repeat canary, not a production-quality benchmark or overall routing win.

Provider-reported token/cache usage computes to $0.5672675 at verified published standard short-context rates, including cache writes; invoice taxes/adjustments were not independently reconciled. The guard's more conservative usage-cost upper bound is $1.1103225, and its $8.2076 held reservation was an admission safeguard, not a charge. The approved ceiling remains $10. No new paid model bake-off was performed.

The failed enabled ownership answer contained all requested distinctions in the raw model response. Sentence processing split the abbreviation in "Implemented vs. local prototype" and dropped the AI-assisted implementation section to fit the budget. A failing unit test reproduced the loss. The repair normalizes that comparison label, prioritizes requested responsibility/status sections and treats a different project's self-qualified proof as a complete block. A deterministic replay of all 12 original paid raw answers verified byte-identical prompts and changed only the failed ownership answer, preserving direction, AI assistance, implementation/prototype status and the fallback in four sentences. The original failed paid grade remains unchanged. No automatic additional paid answer or regrade is authorized by this repair.

## Source-preserving follow-up

The completed local review exposed separate gaps that the labeled ownership repair did not cover. Responsibility questions now use the existing current-page ownership fields, including documented AI assistance and sole-code/implementation limits when those fields support them. Each source category stays in one sentence so a multi-sentence limitation cannot crowd out direction or credit. No AI-assistance claim is inserted on a page without that evidence.

Shortening ranks individual source findings, including qualified survey findings without numeric percentages. Questions contrasting experience with personal conviction retain both facets instead of spending the entire budget on repeated belief summaries. This selects supplied text rather than inventing a survey percentage, sample size or result.

A media-inventory sentence cannot conclude broader quality or performance gains from the file-size figures. The case study explicitly separates documented static inventory from runtime, billing, historical-storage and semantic-quality outcomes; the corresponding guard uses those authored measurement boundaries. The same pure postprocessing function serves production and saved-output replay, keeping original prompts, raw outputs, rubrics and grades intact. Local remediation checks do not replace the original paid 5/6 enabled result or establish deployment quality.

Fresh local validation also exposed a future-tense claim that Portfolio pages feed resume generation, a summary omitting the documented disabled-retrieval status, and a false page-only refusal despite captured supporting sources. The source-claim rule now covers that tense without asserting which unstated sources feed the generator. Retrieval descriptions retain the authored release boundary alongside the claim. A responsibility-map refusal can use explicitly attributed ownership, assistance and local-status facts only from the current page and canonical pages actually included in the prompt. It never looks up unseen project facts, invents missing AI credit, or replaces a substantive broader answer with that fallback. Original grades and alias/negation-only hard-check misses remain separately diagnosed.

# Source alignment revision r2 — October 17, 2026

The Guide's AI Platform packet now includes existing approved evidence: the
platform was pitched in February 2025, proofs of concept were built through
October 2025, and a production version deployed in February 2026. The timeline
does not establish that the final implementation preserved the full original
vision or that Daniel owned end-to-end production engineering. It does not add
platform adoption, scaling-speed or reliability outcomes.

Provenance is the approved ResumeCustomizer source at commit
`24133fd012313bbac6c91a188546e69ebccb2352`:

- `sources/facts-bank.md`, AI project evidence, line 123.
- `sources/portfolio-sources.md`, AI Platform section, lines 111–114.

The conservative agency corrections preserve the current-page sources:
`ai-strategy.claimBoundaries.directOwnership[0]` says helped lead early ChatGPT
rollout work; the human-flourishing essay's direct-ownership field says helped
run surveys and worked on the specified enterprise AI, agentic-workflow and
productivity-tool activities. This does not downgrade separately approved broader
enterprise-AI leadership.

The original `3cec994` full result remains 42/43 hard, 43/43 local judge and
42/43 combined. Its alias failure and recommendation advisory remain recorded;
recommendation coverage alone is not a factual release blocker. Original raw
outputs, grades, rubrics, earlier comparisons and bake-off evidence are preserved.
The source-alignment revision receives one fresh complete original 43-case local
generation and same-judge run at its own frozen snapshot.

The new review-status revision corrects the old stale nested review note without
overwriting it: all 43 displayed answers at `3cec994` were reviewed. Conditional
shipment together after validation was already authorized; duplicate shipment
approval is not required. Validation and Production configuration/runtime
verification are the current gates. No publication or deployment proceeds until
the parent resolves the configuration gate with the owner. The metadata 403 is
not bypassed and no secret or account setting is changed by this revision.


## Evidence-block simplification — October 17 approval

Daniel approved the simplification at 15:28 UTC (Sentinel_f443bd27bca88191a87958289bf8f58e). Factual generation now selects at most two IDs from the actual supplied canonical claim inventory. A deterministic renderer emits the source claims and their complete mapped qualifications; it never displays free-form model answer text. Invalid JSON, invented/duplicate IDs or invalid scope receive a canonical fallback. Ownership requests retain direction, AI assistance, no-sole-coding and implementation/status evidence as one block. Resume actions remain actions; recommendations use canonical metadata. The source highlight's helping-lead wording now agrees with its existing authored essay and direct-ownership boundary.

This replaces the prose-repair chain and the sentence-ranking finalizer. The old formatting, phrase and shortening tests are replaced by selection, provenance, scope, exact captured-failure and complete-qualification contracts. Original evaluation questions, rubrics and saved scores are not changed. Security, request cancellation, bounded Decisions routing, supported resume jobs and the independent default-off career-evidence setting remain intact. No remote career search is part of the comparison.

The prior 41-call paid ledger is complete and reconciles to a conservative usage bound of $1.1103225; its $8.2076 original reservation remains unchanged. A separate frozen four-scenario comparison covers the three latest local failures and the ownership-credit question. Eight Terra answer reservations, four existing Sol paired-judge reservations and one shared Luna Decisions reservation total $5.4488; with completed prior usage, the maximum admitted total is $6.5591225, below the original TOTAL $10 ceiling. No new ceiling or credential is introduced. Unknown prior or new usage, changed scope, malformed grades or insufficient conservative allowance stops execution; no automatic retry or regrade is permitted. Actual results are a separate completion record, not a replacement for earlier grades.


## Terminal Terra comparison — frozen 09db575

The four-case comparison completed all eight Terra answers, four Sol paired judgments and one Luna Decisions request, with no unknown usage or retries. The routing response was shared across the two identical comparison inputs; three direct page questions bypassed routing in each arm. This is not a new routing-off/on study. Recommendation buckets were intentionally empty in the fixed public request because none of the four unchanged rubrics required a recommendation quote; both arms received that same scoped request. Earlier prepared packets and offline transport fixtures remain separate, with no semantic claims attached.

Candidate selections were valid in 4/4 answers. Manual source review established no new unsupported claim in those four displayed answers, and direction, AI-assisted credit, no-sole-coding and local-status limits survived the ownership case. The baseline also did not reproduce the three local-model claim failures, so this run does not establish a comparative factuality improvement. Original paid and local failures remain recorded.

The candidate passed 2/4 paired judgments versus 3/4 for the a611b35 baseline; preferences were baseline 3, candidate 1. Mean helpfulness was 3.25 candidate versus 4.0 baseline, and mean concision 2.25 versus 4.25. The three original page cases passed hard checks 0/3 candidate versus 3/3 baseline: the candidate used 5, 10 and 7 sentences, exceeding the original four-sentence checks. The impact answer also omitted one required proof signal. The fourth ownership case had judge expectations but no original hard-check rubric; it is not counted as an automatic deterministic pass. Both arms inadequately covered the requested across-portfolio scope. Source limitations were preserved, but broad blocks and repeated qualifications remain too verbose, and role relevance needs a clearer answer. These are material answer-quality holds, separate from unsupported factual claims or recommendation-only advisories. No further phrase patch or paid iteration was started.

Provider usage computes to $0.2434784 for this run at verified published standard short-context rates, including cache writes; cumulative reported usage cost is $0.8107459. The conservative new usage bound is $0.46351665, cumulative $1.57383915. The full new reservation stays $5.4488 and worst-case cumulative admission $6.5591225 under the TOTAL $10 approval. Reservations are safeguards, not charges; invoice adjustments were not independently reconciled. All 54 prior and current calls have known usage and are counted.

A separate future-admission limitation remains: one explicitly approved new Luna routing request repeated a prior request payload. The conservative reconciler currently rejects repeated hashes across completed ledgers, so chaining both ledgers prevents further automatic paid admission until run identity/replay handling is reviewed. This is not missing usage or an uncounted charge. No further call or bypass was attempted. The current run remained inside its pre-reserved cumulative bound.

The evaluated runtime stayed frozen and clean through terminal verification. Only this completion note and the case-study journal were appended afterward. Original output/grade files are unchanged; no current full 43-case Terra score or Production quality is claimed. Existing conditional shipment authorization remains valid after validation, but answer-quality findings and owner confirmation of Production Terra/default-off career evidence remain open. No push, PR, merge, publication or deployment occurred.
