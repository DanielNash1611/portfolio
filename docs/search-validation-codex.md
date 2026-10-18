# Revised search validation plan — October 17, 2026

Historical planning snapshot: the separately approved 10-call canary and final
three-text embedding request have completed once. Those approvals are consumed;
these earlier proposals do not authorize another run. Current index/readiness
status is in [hybrid search preparation](portfolio-guide-hybrid-search.md).

The scoped cache reconciliation and native adapter fake verification are complete.
The final [executable proposal](search-production-execution-proposal.md) follows
the deployed one-call claim-selection architecture: two embedding requests, two
Luna routing requests and six Terra requests, under a new proposed $1 external
API ceiling. The earlier 16-call/$2 proposal counted an uncommitted two-stage
pipeline and is superseded. Active-chat Codex review replaces Sol API judging.

Status: preparation only; no evaluation execution authorized. This supersedes the
pending 21-call/$2 API proposal, which was never approved or executed live. Do not
reuse its approval templates, request counts, prices or fixed embedding batches.
The earlier isolated runner remains historical preparation; do not develop a
parallel evaluator around it.

## Observed source baseline

Read-only inspection used Daniel's current original working files, including
uncommitted and untracked pipeline changes. Original Portfolio HEAD is
`ce408e07f5bd67cb5ed95c286a72b563629a1b7a`; ResumeCustomizer HEAD is
`45b0ba2d619d09342a78ad75ba0b38a3e116e822`. These commit IDs alone do not describe
the inspected implementation. File hashes and working status are recorded in
`review-evidence/semantic-search-preparation-20261017/codex-pipeline-revision/source-inspection.json`
in the parent preparation workspace. New career-core/Codex documentation and
review entry points are currently untracked; the Portfolio eval guide is modified.

The isolated preparation branches remain on earlier application baselines. Their
old instructions and 27/63-document snapshot must not override the current career
record authority or public-source policy. No original files, dependencies,
credentials, draft PRs, canonical claims or generated projections were changed
during this inspection. Future execution needs a fresh isolated snapshot of the
relevant public code, instructions and reviewed evidence; do not copy private
profiles, application packets, secrets or unrelated dirty outputs.

## What the updated workflow actually runs

| Layer | Existing interface | Execution and limits of evidence |
| --- | --- | --- |
| Portfolio deterministic checks | `eval:portfolio-guide`, `eval:search`, `eval:portfolio-guide:replay -- --from RUN` | Tests/stubs, cached vector ranking, or current assertions on frozen displayed answers. No new model inference. Replay does not exercise changed prompts/retrieval/guardrails. |
| Portfolio targeted generation | `eval:portfolio-guide:local -- --filter CASE --retrieval` | Ollama `gpt-oss:20b`, loopback `/v1`, placeholder `ollama`; default `local-answer-no-judge`. Uses lexical retrieval and frozen public career data. It does not establish Terra or production hybrid behavior. |
| Portfolio active-chat review | `eval:portfolio-guide:review -- --from RUN`, then the same input plus `--validate-review REVIEW.json` | Writes a frozen packet/prompt, then the already active Codex chat authors a cited review. The command itself launches no CLI, SDK, API judge or subagent. |
| Resume personal workflow | `codex:prepare`, `validate:codex-resume`, renderer/QA, `eval:career:review -- --run-folder RUN` | Codex is the primary author/editor. Repository code supplies frozen claims/passages, provenance, validation and rendering. Personal review packets stay under ignored `.local/`; do not use personal packets as public search fixtures. |
| Career captured replay/review | `eval:career:replay` or `eval:career:review -- --from CAPTURED --prepared PACKETS` | Verifies exact input/prompt/output hashes before applying current checks or creating a review packet. Captured SDK reviewer outputs need their original draft and are rejected by this replay interface. |
| Optional career SDK experiment | `eval:career:run -- --live --max-cases N --timeout-ms N ...` | Separate charged runner. Configured draft/review candidate is `gpt-6.1-sol` high; extract/classify is `gpt-6-luna` medium. It is not the default active-chat reviewer or the hosted portfolio answer model. |
| Production fidelity | Explicit bounded `eval:portfolio-guide:generate` live run | Runtime default remains `gpt-5.6-terra`; optional Decisions routing remains `gpt-6-luna`. Live routing, evidence and embeddings require their explicit scopes. A Codex judgment cannot establish how Terra answered. |

Use explicit case selection; a dirty checkout can otherwise select unrelated
cases. Shared behavior defaults to a 14-case local smoke set, while full generation
is explicit. Local cache keys include request, prompt, code/content fingerprints,
retrieval mode, frozen evidence and Ollama weight digest. Unknown identity disables
reuse; `--fresh` deliberately creates a new sample. No inference is authorized by
the documentation change itself.

The older hosted ResumeCustomizer orchestration/API contracts remain a separate
compatibility lane. The new personal Codex workflow does not migrate that hosted
engine or activate hybrid search.

## Authentication, billing and bounds

Active-chat review uses the current user-owned Codex session; the review scripts
neither choose its model nor authenticate it. Model, authentication mode, account
plan, available usage and per-review cost were not inspected. Record unavailable
model/usage as null, and do not describe this path as free. Official documentation
distinguishes subscription/credit usage from API-key usage charged at API rates:
[Codex pricing](https://learn.chatgpt.com/docs/pricing).

The optional career SDK path is explicit in code: `scripts/lib/env.ts` loads the
usual existing environment files; `run-career-evals.ts` obtains the existing
`OPENAI_API_KEY` and passes it as the SDK `apiKey`. The installed SDK passes that
as `CODEX_API_KEY` to its subprocess. Each turn uses a fresh temporary Codex home,
an allowlisted environment, read-only packet directory, disabled web/network/tool
permissions and no inherited personal Codex configuration. This is an API-key
billing path, not assumed subscription usage. No key or auth-state contents were
read during this inspection.

SDK runs allow 1–6 cases, one turn at a time, with 1–600-second timeouts. Review
uses three independent fresh threads per case and at most two cases/six turns.
Unexpected tool use, failed turns or missing usage stop later turns. The code
contains no application retry loop or automatic model substitution; underlying
runtime transport retries were not independently established. Observed total
tokens are checked between turns, so `--max-total-tokens` is not a hard within-turn
spend cap. Do not transfer the old $2 API budget to this runner.

Portfolio's OpenAI eval client disables SDK retries, but its case/time bounds are
also not a dollar or total-request cap. A case may involve routing, embeddings,
Terra relevance selection and Terra final answering. Runtime query embedding uses
an in-process 15-minute cache, not the benchmark JSON cache. Live evidence may
also embed on the career server. Exact live request/spend scope must be reviewed
before approval; six cases do not imply six paid requests.

## What replaces the former proposed calls

| Superseded stage | Revised treatment |
| --- | --- |
| Up to six Luna Decisions calls | Deterministic routing tests and recorded routing are the first checks. Active-chat review can assess recorded routing, but cannot stand in for Luna inference. Fresh production routing remains optional, separately bounded and approved. |
| Six Terra relevance-selection calls | Use cached/local native generation for development and inspect selected IDs/support/gaps separately from final answers. Local Ollama or Codex output is not a fresh Terra result. Live Terra relevance and final answering remain a distinct fidelity test. |
| Six Sol API judge calls | Replace the default judge stage with frozen packet review in the active Codex chat, followed by the existing native validator. Do not substitute the paid career SDK reviewer ensemble; it evaluates different frozen resume tasks. |
| Three fixed embedding batches, 2/63/29 texts | Reconcile current source/index/query hashes first. Reuse valid existing vectors. Request only identified missing or changed texts after separate approval. Codex review does not generate compatible embeddings. |

The earlier prepared Terra stage selected relevance IDs and produced a controlled
proof rendering; it was not a complete fresh production-answer test. Preserve that
distinction when interpreting its fake results.

## Revised execution sequence, after authorization

1. Freeze the current relevant working implementation into an isolated review
   snapshot, with code/content/instruction hashes and career/public revision.
   Reconcile the approved October 16 wording through the current canonical
   career-record/projection workflow. Preserve stable IDs and provenance; do not
   approve new facts or duplicate Zimmer/OMS/private-profile work. Agents cannot
   run career `approve`, `restore` or `approve-target` on Daniel's behalf.
2. Run the native deterministic/offline checks and cached retrieval benchmarks
   against that snapshot, using network-denied execution. Verify current canonical
   documents against index hashes before reporting freshness. Compare lexical and
   hybrid ranking, held-out/tuning splits, aliases, scope, valid IDs, public filters,
   exact citations and qualification/measurement/status limits. Keep the original
   7/8 ownership-label result visible; any relabeled case is a new suite version.
3. Prefer already captured answers and replay when their exact inputs and source
   hashes are available. After meaningful AI behavior changes, authorize targeted
   local generation only, without a local judge by default. Start with the six
   original risks: patent measurement, implementation ownership, eight-week
   onboarding, OMS demo/production scope, unsupported HIPAA qualification and
   role-fit gaps. Native cases `search-hallucinations`, `search-ownership`,
   `search-oms-status`, `search-compliance` and `search-role-context` cover related
   risks but are not identical to the original questions/role. Add only uncovered
   cases to the existing inventory, preserving exact page, query and role context;
   do not silently substitute or combine scores across suites.
4. Use `eval:portfolio-guide:review` to freeze those captured answers and sources.
   Review raw and displayed answers separately, including successful guardrail
   replacements, source conflicts, unsupported requirements and failures. Have the
   active Codex chat write the native review, then validate the exact packet/rubric
   hashes and cited spans. Report clear successes, trust failures and borderline
   cases; never rerun an entire suite until a favorable score appears. Daniel
   calibration and independent review remain separate.
5. Only if fresh production fidelity is required, authorize a narrow native live
   run against the actual configured Terra model/prompt/retrieval path, with
   explicitly named Luna routing, career endpoint and embedding dependencies.
   Review its captured output via the same Codex packet interface. Report the
   local, replay, cached hybrid, Codex judgment and fresh production results in
   separate rows. Do not launch live DB telemetry, deployment checks or flag
   activation as part of this validation.

## Existing embeddings and remaining work

The inspected current originals contain 261 Portfolio vectors, 35 career vectors
and 20 cached query vectors per repository, all labeled `text-embedding-3-small`
with 1,536-dimensional finite vectors in the tested caches. Both public career
fixtures are byte-identical, revision 3, with 35 documents. The career index
matches that frozen fixture and both query caches match their current labeled
query bytes in deterministic checks. This does not independently verify the
fixture against the current canonical career record, or the 261 passages against
the current Portfolio document builder.

Fourteen of the old 29 query texts match exact hashes in the existing query
caches; 15 do not. These are reuse candidates. If the revised suite uses only
the existing 40 labeled retrieval cases, those query caches need no refresh
unless their bytes change. If the original 29 queries are retained, confirm model,
dimension, IDs and effective resolved query bytes before reusing the 14 matches;
the 15 remaining texts need embeddings or an explicitly labeled lexical-only run.
New role/follow-up/context-derived queries can add further misses. No blanket
2/63/29 refresh is justified. `search:index` without `--check` can call the API;
query refresh requires explicit `--live --refresh`. Do not run either here.

## Native grading and artifacts

Portfolio generation records `results.json`, per-case transcripts, `report.md`
and `run-manifest.json` with selection, dependency fingerprint, model identity,
retrieval mode, cache/fresh status, latency, model-request counts and available
usage. Choose a fresh directory and preserve original captures. Replay records
zero new requests and only applies current deterministic assertions.

Review packets use `schemaVersion:1`, `reviewMode:"active-codex-chat"`, a stable
JSON SHA-256 `packetHash`, and `rubricHash`. Each case contains question, raw and
displayed answer, evidence source IDs/text, untrusted context, deterministic
findings and generation provenance. The JSON review supplies both hashes,
`reviewer:"active-codex-chat"`, model/usage or null, and exactly one
`pass|fail|uncertain` verdict with rationale per case. Findings require
`blocker|improvement`, an exact `answerQuote`, source `{id,quote}` excerpts and
rationale. A failing verdict needs a cited blocker; a passing verdict cannot
contain one. The validator checks structure, hashes and excerpt existence, not
semantic entailment or the correctness of a passing judgment.

Career SDK captures, if separately authorized, include immutable packet/prompt
hashes, `events.jsonl`, `final-response.json`, `result.json`, model/reasoning,
latency and observed input/cache/output usage in a run manifest. Personal resumes
also need pinned claim provenance, rendered PDF/text and every-page QA. Never
export private career packets to the public search corpus.

Report fresh inference, reused captures, replay, advisory judgments, product/source
failures and evaluator infrastructure errors separately. Retain historical
5/12 → 11/12 fixtures and prior source-audit limits unchanged. Active-chat review
is author-assisted model review, not independent evaluation or human calibration.

## Verification performed and precise next approval

This inspection ran 20 deterministic tests against byte-copied native packet
helpers and public cache data: valid/uncertain/cited fake reviews, stale hashes,
missing/duplicate coverage, invented excerpts, contradictory verdicts, altered
packets, career fixture/index and query cache consistency. All 20 passed with
zero network attempts and no application environment loading. These synthetic
checks provide interface/control evidence only. No Codex eval, Ollama generation,
paid API, live evidence request, deployment, activation or credential change ran.

No further approval was needed to inspect or revise this plan. To execute a
review, Daniel must authorize the named captured run(s), exact case set and
active-chat Codex review under his existing session's usage; unknown usage/cost
stays unknown. Fresh Ollama generation needs its own named cases/time scope.
Any embeddings or Terra/Luna live run needs a separate exact public input set,
model/auth path, request/token/time bounds, verified price/spend ceiling and stop
conditions. An SDK experiment additionally needs explicit API-key billing and
per-turn overshoot acceptance; it is unnecessary for the proposed native search
review. No approval to push, merge, publish or activate is requested or inferred.
