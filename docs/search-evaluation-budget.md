# Search evaluation budget guard — local preparation only

> **Superseded October 17, 2026.** Daniel changed the evaluation workflow to
> active-chat Codex review. The 21-call/$2 proposal below was never approved or
> executed against a live provider. Its commands, prices, fixed corpus sizes and
> approval templates are historical preparation, not the current execution plan.
> Use [the revised Codex validation plan](search-validation-codex.md). Existing
> proposal, ledger, manifest and fake-run artifacts remain unchanged for audit.

The October 17 proposed search evaluation has a dedicated, embedding-aware
guard in `lib/portfolio-guide/evals/search-budget.ts`. It is separate from the
historical evaluation guard and does not authorize any provider call. The
proposal remains pending Daniel's approval. The adaptive CLI is prepared for
review. Its fake mode never accesses credentials; live transport is unreachable
without matching approval, pricing attestation, frozen source validation and a
durable reservation. Nothing is deployed or activated.

## Fixed maximums

| Stage                  | Model                  |          Calls | Input tokens per call | Total output tokens per call |
| ---------------------- | ---------------------- | -------------: | --------------------: | ---------------------------: |
| Career embedding       | text-embedding-3-small |    1 (2 texts) |                 4,000 |                            0 |
| Portfolio embedding    | text-embedding-3-small |   1 (63 texts) |                40,000 |                            0 |
| Query embedding        | text-embedding-3-small | 1 (29 queries) |                20,000 |                            0 |
| Routing                | gpt-6-luna             |        up to 6 |                 8,000 |                    0 charged |
| Relevance ID selection | gpt-5.6-terra          |        up to 6 |                48,000 |      600 including reasoning |
| Source-aware judge     | gpt-6.1-sol            |        up to 6 |                48,000 |    1,200 including reasoning |

The maximum is **21 calls** with **$1.56128** in full reservations, within a
**$2 incremental ceiling**. The known reconciled 59-call history is bounded
at **$1.7328368**: prior usage plus full new reservations is **$3.2941168**;
prior usage plus the entire proposed $2 ceiling is **$3.7328368**, within the
original $10 ceiling. This accounts for the reviewed history only, not unrelated
account activity. Routing bypasses reduce actual calls; they never permit
replacement cases or reallocate unused slots.

Embedding input is reserved at 20 nanoUSD/token, routing at 100, Terra input at
2,500 and output at 12,000, Sol input at 2,500 and output at 10,000. Responses
input includes the proposed 25% cache-write allowance, without discounts.
Pricing still requires verification immediately before an approved execution.

## Enforcement and audit trail

- Every run requires explicit hash-bound approval, verified pricing, a new
  execution ID, the known history pin, frozen commit heads and file hashes, and
  exact embedding texts and a pinned static adaptive builder (or exact packet
  hashes for isolated guard unit tests). Files/heads are checked before
  admission and after a reply; exact-query cache reads also recheck them.
- Limits and case identities are frozen at runtime. Exact batch sizes are
  2/63/29, dimensions 1,536, encoding float. Embedding requests use one canonical
  JSON form, preventing hidden duplicate input keys.
- The byte count of the complete request plus 1,024 framing tokens must fit the
  input cap. Each call reserves its stage's full maximum before transport.
  Reservations are never refunded during the execution.
- `search-budget-journal.ts` uses atomic exclusive execution directories,
  exclusive files and fsync. Claims contain the complete manifest and supplied
  approval. Raw HTTP status/body are saved before interpretation, including
  denied requests and replies arriving after timeout. Raw files and all ledger
  events remain immutable. A crash leaves the execution consumed.
- The journal registry must already exist and have been durably provisioned.
  The reviewed manifest pins one shared registry for all live invocations;
  changing registries or deleting claims is not a retry mechanism.
- Only one raw transport attempt is allowed at a time. No SDK retry, resume,
  replacement case, tools, streaming, background requests, alternate endpoint,
  or output modality is admitted. Responses require `store:false`, default tier
  and bounded output. Decisions uses `questions`, without Responses-only fields.
- Missing/unexpected model, usage, Responses tier, unfinished Responses status,
  inconsistent token totals, unsafe token integers, cap overruns, malformed or
  nonfinite vectors, transport/HTTP failures, journal failures and timeouts stop
  the execution. The full reservation remains unknown. Late replies do not
  settle unknown charges or reopen the run.
- Cases follow the frozen order. Routing policy may record a frozen bypass;
  otherwise routing precedes selection and judging. The reviewed harness must
  explicitly pass judge/source/citation/qualification checks before the next
  case. Those assertions and bypasses are persisted. The budget guard does not
  independently evaluate factual answer quality.
- Query vectors come only from the successful frozen 29-query batch. Lookup is
  by exact query SHA; a miss stops without transport. Returned vectors and
  snapshots are copies.

## Adaptive runner and approval gate

`search-adaptive.ts` is statically imported by the guard. Adaptive mode exposes
`execute()` and rejects caller-supplied packets, case approvals and routing
bypasses. The builder reuses the application's existing service, routing,
rankers, qualified-block renderer and judge prompt. ResumeCustomizer receives an
explicit frozen public catalog in process, so its source loaders never resolve
against the Portfolio working directory. No local server or live career API is
needed. Fresh indexes are journal artifacts and do not activate application flags.

The manifest includes a closed source inventory, both commit heads, the original
proposal/query hashes, complete public source blocks, 25 reusable career vectors
and the exact 2/63/29 new embedding texts. Construction independently compares
the public catalog/cache and original cases against those sources. Every packet
and full reservation is durably recorded before the sole transport attempt.
Real vector receipts construct indexes; those indexes and exact cached queries
construct selection packets; actual rendered answers construct source-aware
judge packets. Complete blocks/qualifications and current-page boundaries are
retained in judge packets within the unchanged 48,000-token byte bound.

All 23 original retrieval cases are replayed locally in lexical and hybrid modes.
A newly failing previously passing retrieval case stops the run. Original
Portfolio ownership labeling and its 7/8 lexical result remain visible. Each fresh
case must pass valid allowlisted IDs, exact citation text/title/kind/URL, complete
qualification and source checks before judging. A malformed routing plan or
judge schema, failed judge, unrequested tool call or cache miss stops before any
later provider call. No fallback can create a replacement call.

Current routing policy bypasses four cases: the complete path uses **17 calls**
(3 embedding, 2 routing, 6 selection, 6 judge) and **$1.55808** in full
reservations. The proposed maximum remains 21 calls/$1.56128 reserved under $2;
unused routing slots cannot be reassigned. Fake zero vectors test structure and
control flow only; they provide no semantic-quality evidence.

Run from the isolated Portfolio candidate. Preparation requires clean checkouts
and a new output directory whose parent exists:

```sh
node --import tsx scripts/run-search-evaluation.ts --mode prepare \
  --career-root ../resumecustomizer-search \
  --proposal ../review-evidence/semantic-search-preparation-20261017/paid-test-proposal.json \
  --queries ../review-evidence/semantic-search-preparation-20261017/paid-test-queries.json \
  --output ../review-evidence/semantic-search-preparation-20261017/adaptive-execution
```

The generated `approval-pending.json` has `approved:false` and
`pricingVerified:false`. It cannot admit transport. After Daniel approves this
same frozen scope and current pricing is verified, save the matching approval
record separately; preserve its execution ID and hashes. Then the runnable live
command is:

```sh
node --import tsx scripts/run-search-evaluation.ts --mode live --allow-paid \
  --manifest ../review-evidence/semantic-search-preparation-20261017/adaptive-execution/manifest.json \
  --approval ../review-evidence/semantic-search-preparation-20261017/adaptive-execution/approval-approved.json
```

Only the private single-attempt live transport reads the existing
`OPENAI_API_KEY`, after approval/reservation. Redirects are errors. Global fetch
is poisoned during execution; injected Responses/routing/retrieval adapters
prevent SDK, tool, live data and lazy embedding fallbacks. No dotenv files are
loaded. Never delete a registry claim to retry or resume.

For a credential-free CLI proof, use `--mode fake --manifest <same manifest>`
and `--output <new fake directory>`. This uses a distinct fake execution ID and
registry without consuming the live identity. Approval remains the only pending
human decision; preparation or fake success never grants it.

## Offline verification

`node --import tsx --test __tests__/portfolio-guide/search-budget.test.ts`
uses fake responses and temporary local Git/journal fixtures. It covers the
complete maximum plan, every stage's limits, reservations, uncertainty, no
retries, cache misses, frozen hashes, routing bypasses, critical case gates and
durable journal behavior. No model-quality score is inferred from these tests.

`node --import tsx --test __tests__/portfolio-guide/search-adaptive.test.ts`
exercises the actual runner with global-fetch and credential traps, all six
cases, adaptive packets, immutable receipts, routing/model failures, malformed
judge responses, cache misses, missing inventory and CLI approval rejection.
These integration fixtures require the isolated ResumeCustomizer candidate and
original local proposal; they explicitly skip when those local fixtures are absent.

The query fixture is byte-identical to the original proposed query file:
`90dd9aae3586e56ad3a764d976ec0f57d5de6399227216301e98a725881478ce`.
Candidate public corpora and original retrieval grades are unchanged.

Schema reference: [official Decisions guide](https://developers.openai.com/api/docs/guides/decisions).
