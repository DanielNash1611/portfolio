# Portfolio hybrid search preparation

## October 21 review checkpoint — semantic build blocked

Evaluation controls and the existing approved qualification draft have been reconciled. No paid provider request ran. The packaged runtime index is now stale and is retained unchanged so the release check blocks a misleading semantic-ready build. `search:index:prepare` wrote only reusable-vector preparation data and the pending status.

Current corpus: 64 documents; 62 reusable vectors; 2592 pending UTF-8 bytes. Pending IDs: `ai-career-operating-system:private-local-profile`, `ai-career-operating-system:perspective`. Exact remaining work is recorded in [refresh requirements](search-refresh-required-20261021.json). No old paid approval remains available. Semantic validation and the dependent build stop here; lexical/source/auth checks can run independently. Historical reports and captured answers are unchanged and are not a new grade.

The exported integration fixture contains only the current curated public catalog, with no private canonical record or raw application profile. The updated evaluation provider uses that frozen projection through the bounded qualified-block service and makes no separate relevance/prose call. General captured-output review is `eval:portfolio-guide:review`; search-specific review remains `eval:search:review` / the native-search helper.

## Earlier preparation record (historical)


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
now passes for all 63 current blocks. A separately approved final embedding request
refreshed only `ai-career-operating-system:evaluation`, `:perspective`, and
`:ownership` after the release-status correction. The other 60 vectors are
unchanged. That request completed once with 530 input tokens; its receipt and
once-only journal are preserved in the parent workspace's `single-call-execution`
evidence folder. Both that approval and the earlier 10-call approval are consumed.
No further paid call is authorized. Future paid preparation remains separately
gated: `npm run search:index:build -- --allow-paid-embeddings --max-requests=1`.

Deployment does not copy indexes from the parent review-evidence folder.
The complete, current runtime index is saved at
`content/search-index/portfolio.json`. The Next.js tracing include adds that
server file to the Portfolio copilot endpoint; it does not belong under `public`.
The 60-record `portfolio-cache.json` remains preparation data only. The current
index does not enable runtime flags or deploy the feature.

The corrected status distinguishes bounded Decisions routing/claim selection in
the deployed PR #12 source from the local career-search candidate. Deployment
metadata was already verified before this correction; runtime flags and production
quality were not probed. The saved ownership selection reproduces its original
answer exactly, then renders only the corrected qualifier with the same IDs.
The original paid review remains five pass / one uncertain. This deterministic
repair is separate evidence, not a replacement grade or new model answer.

Cached query replay with the completed index preserves the original 15/15 career
and 7/8 portfolio rankings and labels. Replaying the six original selections and
two routing replies through the current service passes source/citation checks;
only the ownership answer's corrected status changes. This makes no fresh
inference or production-quality claim. Historical controls execute against their
own immutable public corpus; see [fixture coverage](search-historical-fixtures.md).

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

Both complete indexes and offline cached retrieval/source/citation checks are
prepared. Before activation, verify the deployed authenticated backend and its
index plus resume-job/PDF behavior, and validate Portfolio in preview. Publication,
production flag changes and deployment remain separately authorized actions.

Local Ollama (`gpt-oss:20b`) completed six lexical-retrieval/ID-selection checks
for patent measurement scope, ownership, onboarding, OMS source separation,
unsupported HIPAA qualification and role fit. All six selected allowlisted blocks
or no blocks, preserving the asserted limits. These are local smoke assertions,
not paid embedding tests, independent semantic judging or production verification.
