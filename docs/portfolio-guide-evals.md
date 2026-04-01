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

The built-in smoke subset is:

- `checkout-mentions-mcp`
- `ai-platform-most-reused-patterns`
- `ai-platform-contaminated-history`
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
