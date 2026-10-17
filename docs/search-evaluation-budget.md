# Search evaluation budget guard — local preparation only

The October 17 proposed search evaluation has a dedicated, embedding-aware
guard in `lib/portfolio-guide/evals/search-budget.ts`. It is separate from the
historical evaluation guard and does not authorize any provider call. The
proposal remains pending Daniel's approval. No live execution entrypoint,
credential discovery, default fetch, deployment, or activation is included.

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
  exact embedding texts and model packet hashes. Files/heads are checked before
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
  The eventual reviewed harness must pin one shared registry for all invocations;
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

## Remaining execution blocker

The exact-packet guard is reviewed and tested with fake transports. It is **not
ready to run the complete adaptive paid evaluation**: real-vector retrieval
changes selection packets, and fresh answers change judge packets. Those bytes
cannot honestly be frozen before the embedding and answer results exist.

Before any live run, implement and independently review a statically imported,
deterministic packet builder bound to the frozen public corpus, questions,
application routing/retrieval/rendering code and immutable prior receipts. The
guard must construct those adaptive packets itself, without accepting arbitrary
caller bodies. Keep the same six cases and maximum 21-call/$2 scope. Do not use
placeholder packet hashes or relax the current check to execute the proposal.

The complete manifest also needs a reviewed inventory of all transitive source,
public cache, builder/harness and guard files. A corpus-hash label by itself is
not proof that an arbitrary caller supplied the complete source inventory. The
injected transport and journal are trusted reviewed adapters: this component
cannot prevent hidden retries inside a replacement transport, forged approval
objects, or an operator changing the shared registry. There is no such live
adapter or approved execution manifest in this change.

## Offline verification

`node --import tsx --test __tests__/portfolio-guide/search-budget.test.ts`
uses fake responses and temporary local Git/journal fixtures. It covers the
complete maximum plan, every stage's limits, reservations, uncertainty, no
retries, cache misses, frozen hashes, routing bypasses, critical case gates and
durable journal behavior. No model-quality score is inferred from these tests.

The query fixture is byte-identical to the original proposed query file:
`90dd9aae3586e56ad3a764d976ec0f57d5de6399227216301e98a725881478ce`.
Candidate public corpora and original retrieval grades are unchanged.

Schema reference: [official Decisions guide](https://developers.openai.com/api/docs/guides/decisions).
