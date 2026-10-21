# Portfolio Guide Evals

The default development loop is deterministic checks, targeted generation when behavior changes, then source-grounded review in the active Codex chat. A local model score is not a product-quality score.

## Routine checks: no inference

```bash
npm run eval:portfolio-guide
npm run eval:search
npm run eval:portfolio-guide:replay -- --from artifacts/portfolio-guide-evals/RUN
```

The first command runs the guide unit tests, including historical replay, source boundaries, citation handling, routing and service behavior with stubbed model responses. `eval:search` uses existing query embeddings; missing/stale embeddings fail with an explicit refresh instruction. Neither command silently refreshes embeddings or launches a judge. Recorded-answer replay applies current assertions to captured displayed answers; it does not exercise changed prompts, retrieval or guardrail implementation.

## Targeted generation

```bash
npm run eval:portfolio-guide:local
npm run eval:portfolio-guide:local -- --filter ai-platform-ownership --retrieval
npm run eval:portfolio-guide:local -- --changed-files lib/portfolio-guide/prompt.ts
npm run eval:portfolio-guide:local -- --smoke
npm run eval:portfolio-guide:local -- --full
npm run eval:portfolio-guide:local -- --filter ai-platform-ownership --fresh
```

Without a selector, the runner inspects changed working files (including untracked files). Shared AI behavior selects the 14-case smoke set; page changes select matching cases, falling back to smoke for broad/unmapped page changes. Documentation, tests and assertion-only edits select zero model cases. `--changed-files` restricts selection to this task when a working tree already contains other work. `--filter` and `--smoke` select explicit cases; `--full` is the only implicit-free way to run the entire inventory.

The local assistant remains `gpt-oss:20b` through Ollama. Local generation uses the frozen approved public career projection in `evals/integration/career-public.json`, independent of configured evidence credentials. `--retrieval` exercises the shared retrieval and relevance path with lexical search and frozen career evidence. Cached hybrid search quality is covered separately by `eval:search`; local lexical generation does not establish production hybrid behavior.

Generation caching requires a discoverable Ollama weight digest. Keys include the request, effective prompt, model identity, relevant working-code/content fingerprints, retrieval mode and frozen public evidence. Assertion and rubric edits rescore the same answers without invalidating generation. Missing model identity, live dependencies, corrupt entries and unusable outputs disable reuse. `--fresh` bypasses reads and records a new sample; earlier run artifacts remain unchanged. Caches live under ignored `artifacts/eval-cache/`.

## Review directly in Codex

```bash
npm run eval:portfolio-guide:review -- --from artifacts/portfolio-guide-evals/RUN
npm run eval:portfolio-guide:review -- --from artifacts/portfolio-guide-evals/RUN --validate-review artifacts/portfolio-guide-reviews/REVIEW/review.json
```

The prepare command writes `review-packet.json` and `review-prompt.md`. Codex reads these in the active chat and writes a review; no CLI, SDK, API judge or subagent is launched. Packets contain captured source context, prior conversation labeled as untrusted, raw/displayed answers, current deterministic findings, expectations and provenance. Every case needs a pass/fail/uncertain judgment with rationale. Findings need exact answer spans, source IDs and source excerpts.

The validator binds findings to the exact packet and rubric hashes, checks complete coverage and excerpt references, and rejects stale reviews. It validates structure and traceability, not semantic entailment. Record unavailable model/usage as null. Active-chat review is author-assisted model judgment, not independent review or human calibration. Review representative clear successes, trust failures and borderline cases; local judge agreement alone does not establish quality.

## Optional model judges and live checks

```bash
npm run eval:portfolio-guide:local-judge -- --filter ai-platform-seniority
npm run eval:portfolio-guide:generate -- --provider-mode openai --no-judge --live --max-cases 1 --assistant-timeout-ms 90000 --filter ai-platform-ownership
npm run eval:portfolio-guide:generate -- --provider-mode openai --no-judge --live --max-cases 1 --assistant-timeout-ms 90000 --filter ai-platform-ownership --retrieval --live-evidence --decisions
npx tsx scripts/eval-portfolio-guide-routing.ts --live
npm run eval:search -- --live --refresh
```

Local judges are explicit advisory diagnostics. Their disagreements and uncertain judgments do not fail a deterministic pass. Malformed JSON, missing scores and provider failures are evaluator errors, not fabricated low scores. The optional remote judge retains its explicit judged-run behavior; it is not the default quality reviewer. Paid runs require explicit opt-in and case/time bounds before any provider request; selected cases exceeding the bound fail without inference. There is no automatic remote fallback. Local preflight has a five-second timeout; model calls have per-case timeouts and SDK retries disabled.

Live evidence must be requested separately; an API key in `.env.local` is never authorization to use a remote dependency. A source review does not establish how a deployed model will answer. Preserve production answer-model defaults and run bounded production-model checks only when explicitly requested.

## Artifacts and interpretation

Each generation run writes immutable results, transcripts and `run-manifest.json`. The manifest records selection/reason, working dependency fingerprint, model digest, retrieval mode, fresh/cache classification, elapsed time, actual model request count, retries and available usage. Unknown usage remains null; cached generation usage in the original capture is historical, not new consumption. Local relevance calls and model judges count as model requests too.

Product/deterministic failures, advisory quality judgments and evaluator errors are reported separately. Exit 1 means the case/run failed; exit 2 signals a local evaluator error after otherwise passing cases. Never combine latest passing cases from multiple follow-ups into an uninterrupted full-suite score. Reused answers and replay are not fresh samples. Do not rerun whole suites until a favorable score appears or weaken checks to fit a model's phrasing.

The committed historical 5/12 → 11/12 comparison remains unchanged and independently auditable below.

## Structured Concepts

Prefer `requiredConcepts` (in `concepts.ts`) over `answerMustIncludeAnyGroups`
for trust signals. A concept is one idea with several accepted surface forms:

```ts
export const REFUSES_TO_RANK_REUSE: EvalConcept = {
  id: "refuses-to-rank-reuse",
  description: "States the page does not rank which pattern was reused most …",
  anyOf: [
    /* regex + literal variants of the SAME idea */
  ],
};
```

Why: failures read `conveys concept "refuses-to-rank-reuse"` with the accepted
variants, instead of `Missing expected signal "led a team"`. De-brittling means
adding genuinely-equivalent variants in one shared place.

Rule: a concept only broadens _positive_ signals. Forbidden claims stay in
`answerMustExclude`, so widening a concept can never let an overclaim through.
Each variant you add must still be a correct-answer phrasing — verify against
stored answers (`artifacts/portfolio-guide-evals/*`) rather than guessing.

The concision check (`maxSentences`) ignores ordered-list markers, bullets, and
keycap emoji so a short list answer is not miscounted as many sentences. It still
fails genuinely rambling prose.

## Historical Replay

The public "5/12 → 11/12" claim is backed by two real runs committed verbatim in
`lib/portfolio-guide/evals/__fixtures__/`. `historical-eval-replay.test.ts`
asserts their preserved provenance (5/12 and 11/12, judged), that every case
still exists in the suite, and that re-scoring the frozen answers is
deterministic. Note the headline number is _judge-gated_: on the deterministic
layer alone those same answers score higher (11/12 → 12/12), so most of 5 → 11
was groundedness/source-separation scored by the judge. Do not edit fixture
answers; regenerate from a fresh run if the claim changes.

## Adding More Cases

Add a new object to `lib/portfolio-guide/evals/cases.ts` with:

- `pageSlug`
- `question`
- Optional `priorConversation`
- Optional `sessionContext` overrides
- `summary`
- `judgeExpectations`
- Deterministic checks for any must-have or must-not-have behavior

Prefer cases that encode real trust risks:

- unsupported ranking or ownership claims
- term-mention false positives
- contaminated-history reuse
- cross-page leakage
- over-defensive answers that stop being useful

## Release boundary (October 21)

This PR extracts evaluation controls onto current main without changing production answering. Search-specific frozen adapters are reconciled in PR #13; `--retrieval` and `--live-evidence` fail explicitly here. Site-wide cases land with the assistant release. No original 35-record private-pipeline snapshot is imported. Historical replay does not prove changed code or live quality.
