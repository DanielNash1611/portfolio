# Portfolio hybrid search preparation

Prepared from merged main `ef02e7e819205d606e9a4fbae6c0281aa1396e0b`.
Production settings and deployments are unchanged.

The prototype's search engine and scope resolution are integrated into the current
claim-block service. The old free-prose service was not copied. The existing
Decisions router still runs first; the existing answer-model ID selection supplies
relevance selection. Factual prose and qualifications remain deterministic and
indivisible. This adds no separate relevance-model call in production.

The search corpus is 63 complete approved claim blocks across 13 canonical pages,
not the old 261 arbitrary passages. Generic site/about/method content and detailed
authored sections outside those approved blocks are not searchable in this release.
This deliberately limits coverage while preserving the current factual contract.
No private application-profile content or separate draft PR #9 is imported.

Page, named-project and broader questions select a scope. Aliases include
OMS/order management and Immiatrics/Immunology Scout. Follow-ups resolve from
user-authored history only. Named projects use their canonical page as primary;
broader ownership answers retain current-page and supporting-page distinctions.
Role requirements can inform retrieval but never authorize claims.

BM25 lexical retrieval works without a provider. Semantic retrieval adds cosine
similarity using a fresh `text-embedding-3-small` index and a query embedding,
then reciprocal rank fusion. The 63 complete-block texts require a new index;
old passage vectors are not compatible. The separately approved October 17
10-call canary completed; its captures, costs and original grades are preserved
in the parent workspace's `native-final` evidence folder.
Embedding failures, absent keys and stale/missing indexes retain lexical results.
Check `retrievalMode`; HTTP 200 does not establish semantic retrieval.

`PORTFOLIO_GUIDE_HYBRID_SEARCH_ENABLED` remains false unless explicitly set to
`true`. The separate `PORTFOLIO_GUIDE_CAREER_EVIDENCE_ENABLED` gate is preserved.
Only that opt-in supplies the shared ResumeCustomizer base URL and bearer to
career search. Resume-job configuration alone never enables career retrieval.
The backend requires its own `EVIDENCE_SEMANTIC_ENABLED=true` for embeddings.

The optional career caller enforces public/audited filters, a six-record cap,
timeouts, compatible contract versions and defensive parsing. Model-generated
URLs are never used. Citations identify selected blocks and exact rendered
qualified excerpts; retrieved candidates and actually cited evidence remain
distinct. Career URLs are related project context, not proof that later approved
career facts appear on that public page. Citations persist through the existing
response JSON and local conversation storage; no database migration is needed.

```sh
npm run search:index:check
npm run search:index:prepare
npm run eval:search:lexical
npm run search:index:require
```

These checks do not load env files or call a provider. The semantic requirement
currently fails: the ownership release-status correction changed three texts
(`ai-career-operating-system:evaluation`, `:perspective`, and `:ownership`).
The preparation cache retains 60 exact-text vectors; the three changed vectors
were removed. Only one embedding request for those three texts (2,939 UTF-8 bytes)
remains necessary. The earlier approval is consumed; no refresh ran for this
correction. Paid preparation is separately
gated: `npm run search:index:build -- --allow-paid-embeddings --max-requests=1`.
Do not execute it under either consumed prior approval, including the 10-call canary.

Deployment does not copy indexes from the parent review-evidence folder.
The complete, current runtime index must be saved and committed at
`content/search-index/portfolio.json`. The Next.js tracing include adds that
server file to the Portfolio copilot endpoint; it does not belong under `public`.
The latest local lexical build passes, but has no runtime portfolio index in its
endpoint trace. The partial `portfolio-cache.json` is preparation data only.

The corrected status distinguishes bounded Decisions routing/claim selection in
the deployed PR #12 source from the local career-search candidate. Deployment
metadata was already verified before this correction; runtime flags and production
quality were not probed. The saved ownership selection reproduces its original
answer exactly, then renders only the corrected qualifier with the same IDs.
The original paid review remains five pass / one uncertain. This deterministic
repair is separate evidence, not a replacement grade or new model answer.

The small lexical regression set returned 7/8 expected targets. The broad ownership
case retrieves other relevant ownership blocks ahead of its single labeled AI
Platform target. Its first result and labels remain visible for review; this is
not a held-out semantic quality claim. Career lexical retrieval returned 15/15,
including 14 retained historical cases and the current onboarding regression.
Six historical career cases with absent target records remain held out of the
active suite. Existing historical reports were not rewritten.

Review of that ownership case found an inappropriate unique expected target for
the context-free ranker: the question names no AI Platform project, and the
ranker receives no current-page context. Career OS ownership explicitly separates
Daniel's direction from AI-assisted implementation; product-philosophy ownership
also answers the broad question. The original query, target and 7/8 result remain
unchanged. They are not relabeled into a pass. A separate deterministic service
regression tests the actual current-page contract: AI Platform ownership plus a
different project's ownership, complete qualifications and exact citations. It
also injects an invalid media-block selection and requires the canonical renderer
to recover both mandatory ownership sources. No retrieval algorithm or threshold
was changed for this review.

Before activation, prepare both complete indexes, compare lexical and semantic
retrieval on frozen cases, run source-aware relevance/citation checks, verify the
deployed authenticated backend, and validate Portfolio in preview. Publication,
production flag changes and deployment remain separately authorized actions.

Local Ollama (`gpt-oss:20b`) completed six lexical-retrieval/ID-selection checks
for patent measurement scope, ownership, onboarding, OMS source separation,
unsupported HIPAA qualification and role fit. All six selected allowlisted blocks
or no blocks, preserving the asserted limits. These are local smoke assertions,
not paid embedding tests, independent semantic judging or production verification.
