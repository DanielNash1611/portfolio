# October 21 assistant draft validation and release gates

The independent assistant draft includes reviewed qualification and evaluation controls. Its bounded claim-ID selector renders complete authored claims and qualifications; no alternate free-prose architecture or additional relevance call is introduced. Both assistant/WebMCP public flags default off. No production deployment/activation, credentials/access change, paid call or shared migration occurred during preparation.

## Verified scope

The independent assistant source passed typecheck, lint, 284 deterministic tests (four existing database skips), default-off and opt-in local builds. GitHub Actions and the exact-head preview passed before this documentation-only update; CI remains authoritative for each later head. Local 1440px/390px QA used mocked answers/conversations and blocked external traffic, checking navigation/draft preservation, modal inertness, visible-only form annotations, public evidence and layout.

The combined search/assistant/analytics source is prepared on an unpublished local review branch. After source-link reconciliation, it passed typecheck and 477 tests (five database skips); all nine focused source/scope regressions passed. Installed Chrome 156 was also checked in a separate clean automation context on localhost. The combined human interface passed the desktop/mobile checks. This was development-source UI validation, not a successful combined production build or model/backend validation.

`document.modelContext` and the native testing API were absent in the installed Chrome 156 context, despite a secure localhost context. Packaged Chromium also lacks that capability. Native registration/execution remains unverified; synthetic lifecycle/cancellation tests and real visible DOM annotations passed. No settings, permissions, token or software were changed. An already-enabled supporting browser/origin is the next native test gate.

The standard combined build stops at the unchanged stale-index guard: 64 Portfolio blocks, 62 reusable vectors and two pending qualified texts. Backend search independently needs one OMS text. The frozen three-text embedding proposal is not approved or executed. READY previews do not establish semantic activation, runtime flags or authenticated backend operation. Daniel's earlier manual check covers only former PR13 heads and the narrow visible checklist.

## Supported input lengths

A deterministic regression confirmed that a supported 4000-character question plus 1000-character lens could exceed the ranking helper's 1000-character input bound and fail before answer selection. The adapter now trims/caps only its ranking query; the full submitted question remains in the bounded selector prompt. The test failed before the change and passed afterward with exactly one mocked selector call. No provider request was made; this regression does not establish answer relevance or semantic quality for long inputs.

## Review and release sequence

1. Review evaluation controls (Portfolio #14/Resume #15), then approved qualifications (Portfolio #9/Resume #10). Reuse those drafts; preserve the unrelated Resume maintenance #14.
2. Obtain fresh approval of the exact frozen three-text embedding manifest, request hash, one-attempt limit and hard cap. Complete offline token verification first. Rebuild only the missing vectors, validate complete indexes, replay captured query vectors and run deterministic/type/build gates on the semantic PR #13 pair. No new answer/judge/query-embedding call is included.
3. Reconcile the prepared local overlap resolutions into assistant #15 after semantic prerequisites clear. Preserve cited legacy fallback, explicit scope, atomic lens updates, source excerpts/links, bounded qualifications and all off switches. Rerun current-head combined checks and authenticated preview/backend validation; native acceptance remains separate if the browser lacks the API.
4. Owner analytics #16 can be reviewed independently. Before enabling it, execute migration 007 and ingestion/report/idempotency tests only in explicitly disposable local PostgreSQL infrastructure. This infrastructure is unavailable in the preparation environment. Default-off paths do not require the new table; no shared/live substitute was used.
5. Resume local recovery #16 follows its qualification/evaluation dependencies and does not add hosted durability. Keep the optional personal Codex-first workflow outside these releases.
6. Only after applicable gates clear, request separate production merge/deployment/migration/activation authorization. Runtime configuration was not verified through the previously denied environment-variable read; that read was not retried or bypassed.

The source conflicts are resolved locally, not represented as an already-merged release. A later release must recheck current baselines, preserve unrelated work and maintenance changes, compose the resolved source, and verify the resulting commit. Existing approval of draft preparation grants no production or paid authority.
