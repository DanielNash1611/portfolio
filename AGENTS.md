# Portfolio Site Agent Notes

These instructions are for Codex or other coding agents working in this repo.

## Portfolio Guide Eval Loop

When changing the portfolio AI chat, grounding, prompt construction, page metadata, related-page logic, or recruiter-facing question UX:

1. Prefer the local OpenAI-compatible GPT model for the default eval loop.
2. Use the portfolio-guide eval runner before and after meaningful prompt or context changes.
3. Treat current-page grounding and overclaim prevention as higher priority than answer flair.

### Default Local Eval Commands

Use these commands first:

```bash
npm run eval:portfolio-guide:local
```

For a quick subset during iteration:

```bash
npm run eval:portfolio-guide:local -- --smoke
```

For a single targeted case:

```bash
npm run eval:portfolio-guide:local -- --filter ai-platform-seniority
```

### Local Model Defaults

- Assistant model: `gpt-oss:20b`
- Provider mode: `local-answer-no-judge`
- Base URL: `http://127.0.0.1:11434/v1`
- API key placeholder: `ollama`

This is the preferred coding-loop setup for portfolio-site work because it is fast, local, and good enough to catch most grounding regressions early.

### When To Add A Judge

After the local deterministic loop is clean, optionally run:

```bash
npm run eval:portfolio-guide:local-judge -- --filter ai-platform-seniority
```

Use judged runs for:

- seniority / recruiter-mode changes
- ownership-boundary changes
- implied-vs-proven behavior
- cross-page recommendation behavior

### Manual Prompt Checks

After implementation, manually probe the updated guide with questions like:

- `For the role I entered, what's most relevant here?`
- `What particularly was Daniel responsible for?`
- `How senior is this work?`
- `What are the strongest signals on this page?`
- `What's implied but not proven here?`
- `What should I view next?`
- `How does this connect to the rest of the portfolio?`

### What Good Looks Like

- Current page stays primary.
- Major claims tie back to concrete evidence on the page.
- No invented team size, org structure, implementation ownership, or metrics.
- Direct ownership, influence, conceptual exploration, and implementation are clearly separated.
- Cross-page references are sparse and phrased as lightweight bridges, not full portfolio summaries.
