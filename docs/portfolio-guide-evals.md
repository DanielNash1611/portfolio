# Portfolio Guide Evals

This eval suite measures the portfolio assistant as a page-grounded product feature, not as a generic chatbot. The goal is to catch trust failures such as hallucination, over-inference, source contamination from prior assistant turns, and cross-page blending, while still rewarding useful answers.

## What The Runner Evaluates

- Groundedness: Does the answer stay inside page-supported facts?
- Uncertainty handling: Does it say when the page does not explicitly state something?
- Source separation: Does it avoid treating prior assistant turns, related pages, or broader site context as current-page truth?
- Helpfulness: Is the answer still useful and not overly rigid?
- Concision: Is the answer tight enough to review quickly?

The runner uses a hybrid approach:

- Deterministic checks for required signals, forbidden claims, response-package leakage, recommendation slugs, and sentence limits.
- An LLM judge that scores groundedness, uncertainty handling, source separation, helpfulness, and concision.

Deterministic checks now support two severities:

- Hard checks gate case pass/fail and are used for trust failures such as hallucination, cross-page leakage, and forbidden claims.
- Advisory checks are reported in transcripts and summaries but do not fail the case. Use these for optional recommendation behavior or helpfulness nudges.

For portfolio-site coding loops, the preferred default is now the local OpenAI-compatible GPT path first, then an optional judged pass once the deterministic loop looks good.

Recommended operating model:

- Use `gpt-oss:20b` for the fast local eval loop.
- Use `local-answer-no-judge` during day-to-day coding iteration.
- Add a judged run after the local loop is clean for recruiter-mode or grounding-sensitive changes.
- Use the OpenAI/API path for the live guide and for full validation runs.

## File Layout

- `lib/portfolio-guide/service.ts`
  Shared answer-generation path used by both the API route and the eval runner.
- `lib/portfolio-guide/evals/cases.ts`
  Seeded eval cases. This is the main file to extend when you want more coverage.
- `lib/portfolio-guide/evals/assertions.ts`
  Deterministic check helpers.
- `lib/portfolio-guide/evals/concepts.ts`
  Reusable, named answer concepts (see "Structured concepts" below).
- `lib/portfolio-guide/evals/__fixtures__/`
  Committed historical runs behind the public 5/12 → 11/12 claim (see "Historical replay").
- `lib/portfolio-guide/evals/judge.ts`
  LLM judge prompt and response normalization.
- `lib/portfolio-guide/evals/runner.ts`
  Eval orchestration and suite summarization.
- `scripts/run-portfolio-guide-evals.ts`
  CLI entrypoint.

## Seeded Cases

- `ai-platform-summary`
  Summary stays anchored to the prototype, 87% reuse signal, and platform takeaway.
- `ai-platform-impact`
  Impact answer uses current-page evidence instead of borrowing revenue or adoption numbers from other pages.
- `ai-platform-ownership`
  Ownership answer stays conservative and admits the page is not a full ownership matrix.
- `ai-platform-most-reused-patterns`
  Refuses to invent a ranking of which reusable pattern was used most.
- `ai-platform-contaminated-history`
  Ignores a hallucinated prior assistant turn instead of laundering it into current-page truth.
- `checkout-mentions-mcp`
  Says the checkout page does not mention MCP.
- `checkout-impact`
  Uses explicit checkout metrics and measurement evidence.
- `checkout-ownership`
  Answers ownership conservatively from role/action language on the page.
- `checkout-cross-page-dau`
  Does not borrow DAU metrics from ChatGPT Enterprise when the current page is checkout.
- `jira-evidence`
  Answers an evidence question with explicit adoption, onboarding, and visibility signals.
- `jira-next-read`
  Tests that the assistant still gives useful next-read guidance.
- `chatgpt-enterprise-next-read-platform-role`
  Tests role-aware recommendations without blurring current-page facts.

## Run It

1. For the default hybrid mode, make sure `OPENAI_API_KEY` is set for the judge.
2. Run:

```bash
npm run eval:portfolio-guide
```

When you run the CLI outside production, it loads `.env.local` before resolving eval config. When `NODE_ENV=production`, it skips local env files and uses the real runtime environment instead.

Optional flags:

```bash
npm run eval:portfolio-guide -- --provider-mode openai
npm run eval:portfolio-guide -- --provider-mode local-answer-no-judge --no-judge
npm run eval:portfolio-guide -- --provider-mode local-answer-local-judge
npm run eval:portfolio-guide -- --assistant-base-url http://127.0.0.1:11434/v1 --assistant-model gpt-oss
npm run eval:portfolio-guide -- --assistant-base-url http://127.0.0.1:11434/v1 --assistant-model llama3.1
npm run eval:portfolio-guide -- --assistant-timeout-ms 120000 --judge-timeout-ms 90000
npm run eval:portfolio-guide -- --filter checkout
npm run eval:portfolio-guide -- --assistant-model gpt-5 --judge-model gpt-5-mini
npm run eval:portfolio-guide -- --prompt-file ./tmp/portfolio-guide-prompt.txt --label candidate-prompt
npm run eval:portfolio-guide -- --output-dir ./artifacts/portfolio-guide-evals/manual-run
npm run eval:portfolio-guide -- --smoke --assistant-model gpt-oss:20b --no-judge
```

Shortcut scripts:

```bash
npm run eval:portfolio-guide:local
npm run eval:portfolio-guide:local -- --smoke
npm run eval:portfolio-guide:local -- --filter ai-platform-seniority
npm run eval:portfolio-guide:local-judge -- --filter ai-platform-seniority
```

The built-in smoke subset (`PORTFOLIO_GUIDE_SMOKE_CASE_IDS` in
`scripts/run-portfolio-guide-evals.ts`) is 12 cases:

- `ai-platform-role-fit-suggests-generator`
- `ai-platform-direct-resume-request`
- `checkout-evidence-does-not-overpromote-generator`
- `checkout-mentions-mcp`
- `ai-platform-most-reused-patterns`
- `ai-platform-contaminated-history`
- `ai-platform-seniority`
- `ai-platform-implied-not-proven`
- `ai-platform-connections`
- `checkout-cross-page-dau`
- `jira-evidence`
- `jira-next-read`

## Local Runs With Ollama

The runner supports local answering through any OpenAI-compatible endpoint. Ollama is the intended first local target.

Default assumptions for local mode:

- provider mode defaults to `local-answer-remote-judge`
- assistant base URL defaults to `http://127.0.0.1:11434/v1`
- assistant API key defaults to `ollama`
- assistant model defaults to `PORTFOLIO_GUIDE_LOCAL_MODEL`, then `OLLAMA_MODEL`, then `gpt-oss`

Before the suite starts, any local OpenAI-compatible provider is preflighted through `/v1/models`. If the configured model is missing, the run stops early and prints the models the endpoint actually exposes.

Recommended Ollama examples:

```bash
OPENAI_API_KEY=... npm run eval:portfolio-guide -- --assistant-model gpt-oss:20b
OPENAI_API_KEY=... npm run eval:portfolio-guide -- --assistant-model llama3.1
OPENAI_API_KEY=... OLLAMA_MODEL=gpt-oss:20b npm run eval:portfolio-guide
```

If you want a fully local experimental run:

```bash
npm run eval:portfolio-guide -- --provider-mode local-answer-local-judge --assistant-model gpt-oss --judge-model llama3.1 --assistant-api-key ollama --judge-api-key ollama
```

If you want deterministic checks only with no judge:

```bash
npm run eval:portfolio-guide -- --provider-mode local-answer-no-judge --no-judge --assistant-model gpt-oss
```

Repo note:

- [`AGENTS.md`](/Users/danielnash/Code/DanielNash/Portfolio/portfolio/AGENTS.md) now captures the expected Codex workflow for portfolio-site AI changes so future coding passes default to the local GPT eval loop.

Behavior notes:

- Local model discovery is optional and not required to run evals. The runner never depends on `ollama list`.
- If the local endpoint is unreachable, times out, or returns unusable output, the case fails strictly. There is no silent fallback to the remote answerer.
- Assistant and judge calls now have per-case timeouts so a single hung provider call cannot block the whole suite.
- Local answer runs are great for faster product iteration.
- Full local judging is supported as an experiment, but judge consistency is expected to be lower than remote judging.

## Outputs

Each run writes to `artifacts/portfolio-guide-evals/<timestamp>-<label>/`:

- `results.json`
  Full machine-readable suite result.
- `report.md`
  Small Markdown summary for quick review, including advisory warning counts.
- `transcripts/<case-id>.md`
  Per-case transcript with provider metadata, request, raw model output, normalized response, deterministic checks, judge summary, and any assistant or judge failure reason.
- `transcripts/<case-id>.json`
  Per-case snapshot with request, provider metadata, model output when available, and failure details.

## Pass/Fail Logic

A case passes only when:

- All hard deterministic checks pass.
- The judge verdict is `pass`.
- The judge meets minimum thresholds:
  `groundedness >= 4`, `sourceSeparation >= 4`, `helpfulness >= 3`, `concision >= 3`, and `uncertaintyHandling >= 4` for partial or unanswerable cases (`>= 3` for fully answerable cases).

## Determinism & Honest Scoring

The deterministic checks are pure functions, but the answer they score comes
from a live model (OpenAI or local Ollama). **The suite score is therefore not
reproducible run-to-run.** Two runs of the same code minutes apart can differ by
several cases purely from model sampling (we have stored runs that swing 7/12 ↔
5/12 with no code change).

Treat the live score as a _range_, not a metric:

- For a real signal, run `--smoke` 3+ times and report the spread, not one number.
- Never present a single live `--smoke` number as a regression without re-running.
- Never equate the live smoke score with the historical 5/12 → 11/12 claim. That
  claim is a specific stored, judge-scored, 12-case OpenAI run (see "Historical
  replay"); the live smoke loop is a different, deterministic-only local check.

When you change `prompt.ts` or `service.ts`, expect the live score to move even
though no eval rule changed — the _wording_ shifted under the matchers. Fix
genuine brittleness in the checks; do not tune limits or variants just to move
the number.

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
