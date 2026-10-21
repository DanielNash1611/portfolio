# Portfolio Site Agent Notes

## Portfolio Guide Eval Loop

When changing AI chat, grounding, prompts, page metadata, retrieval, related-page logic or recruiter-facing UX:

1. Start with `npm run eval:portfolio-guide`. This runs deterministic tests and historical replay without model inference.
2. After meaningful AI behavior changes, generate only affected cases with `npm run eval:portfolio-guide:local -- --filter CASE` or `--changed-files PATH`. Shared behavior changes use `--smoke`; complete suites require `--full`. Do not run inference for documentation, visual styling or assertion-only edits.
3. Reuse cached generations and recorded-output replay before generating new samples. `--fresh` is an intentional new sample, not a default retry loop.
4. Prepare `npm run eval:portfolio-guide:review -- --from RUN` and review the frozen packet directly in the active Codex chat. Save cited pass/fail/uncertain findings, then validate them with the same command plus `--validate-review FILE`.
5. Prioritize current-page/requested-scope grounding and overclaim prevention over answer flair. Keep ownership, influence, conceptual exploration and implementation distinct.

Local generation defaults: `gpt-oss:20b`, `local-answer-no-judge`, `http://127.0.0.1:11434/v1`, placeholder key `ollama`. Local evidence is frozen public data; retrieval generation is lexical, with cached hybrid retrieval checked separately. Local judges run only when explicitly requested and remain advisory.

Remote answering, judging, routing, embeddings and live evidence require an explicit bounded live run. Never infer authorization from credentials. Active-chat Codex review is author-assisted model review, not independent evaluation or human calibration. Native subagent reviews remain on demand.

Use `npm run eval:portfolio-guide:replay -- --from RUN` to apply current checks to frozen answers. Replay does not validate changed prompts or production-model behavior. Report one-run results, reused answers, fresh inference, infrastructure errors and combined follow-up coverage separately. Preserve historical fixtures.

## Manual Review Questions

- For the role I entered, what's most relevant here?
- What particularly was Daniel responsible for?
- How senior is this work?
- What are the strongest signals on this page?
- What's implied but not proven here?
- What should I view next?
- How does this connect to the rest of the portfolio?

Claims must tie to the supplied page or explicitly attributed broader evidence. Never invent team size, organizational structure, ownership, launches or metrics. Keep cross-page bridges sparse and retain measurement and delivery-status qualifications.

See `docs/portfolio-guide-evals.md` for commands, cache behavior and review provenance.
