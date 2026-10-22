# Executable native search proposal — October 17, 2026

Historical planning snapshot: the separately approved 10-call canary and final
three-text embedding request have completed once. Those approvals are consumed;
these earlier proposals do not authorize another run. Current index/readiness
status is in [hybrid search preparation](portfolio-guide-hybrid-search.md).

Status: prepared and fake verified; paid execution awaits Daniel's approval.
This replaces the earlier 16-call/$2 proposal. Its extra six Terra calls came
from the wrong application baseline.

## Production baseline and correction

Read-only Vercel metadata identifies production deployment
`dpl_CFzJP2kMWe7F57a684s8VFfSxuTc`, serving `www.danielnash.co`, at commit
`ef02e7e819205d606e9a4fbae6c0281aa1396e0b` (PR #12). That source makes one
bounded claim-ID selection request, then renders qualified source blocks
deterministically. The generation path defaults to `gpt-5.6-terra`; environment
model overrides remain possible and were not read. No live model request was
made to establish the deployed override.

The original checkout's uncommitted `retrieval.ts` introduces a separate Terra
relevance request before a free-form answer request. That is an uncommitted
hybrid-search design, not the deployed architecture and not a requirement of
Codex review. The earlier six-call Terra plan already used one selection request
per case for relevance and displayed evidence. This adapter preserves that
published one-call contract and uses the staged qualified retrieval corpus.
It adds no separate answer call.

## Frozen input and exact calls

| Input | Total | Reused vectors | New texts |
| --- | ---: | ---: | ---: |
| Approved public career records | 27 | 25 | 2 |
| Complete qualified portfolio blocks | 63 | 0 | 63 |
| Exact frozen queries | 29 | 14 | 15 |

The 80 new texts total 31,625 UTF-8 bytes. Two embedding requests contain
17 texts (the two career records plus 15 queries) and 63 portfolio blocks.
They have explicit 1,536 dimensions and float encoding. All original queries,
qualifications, revision hashes and provenance remain unchanged. No old
unqualified portfolio passage or any of the eight excluded career records enters
an index or provider packet. Runtime cache misses stop instead of embedding.

Run each original case once:

| Case | Question | Page | Luna |
| --- | --- | --- | --- |
| patent-measurement | Has Immiatrics reduced patent-search hallucinations, and what was measured? | immunology-scout | Bypass |
| ownership | What did Daniel own versus AI-assisted implementation across the portfolio? | ai-platform-mcp | One call |
| onboarding | What evidence supports Daniel's eight-week onboarding for product managers and stakeholders? | ai-platform-mcp | Bypass |
| oms-context | For OMS, distinguish the public demo from later production milestones. | oms-chatgpt-app | Bypass |
| qualification | Is Daniel HIPAA certified for clinical research? | immunology-scout | Bypass |
| role-fit | Across the portfolio, what supports my role requirements? | ai-platform-mcp | One call |

Role-fit declares exactly “AI product leader requiring retrieval evaluation and
HIPAA qualification”. Alias resolution and the declared-role suffix use the same
29 frozen query bytes. Each case makes one `gpt-5.6-terra` selection request,
including its ordinary normalization, source validation and qualified rendering.
The ownership and role-fit cases each make one `gpt-6-luna` Decisions request.

## Verified prices and budget

Official documentation was opened read-only at **2026-10-17 22:58:14 UTC**:
[Terra](https://developers.openai.com/api/docs/models/gpt-5.6-terra) is $2/M input,
$12/M output, with cache writes at 1.25 times input;
[embeddings](https://developers.openai.com/api/docs/models/text-embedding-3-small)
are $0.02/M input; [Luna Decisions](https://developers.openai.com/api/docs/guides/decisions)
are $0.10/M input with no charged output/cache tokens. All requests use the global
endpoint and default service tier, below long-context thresholds. The guard uses
$2.50/M for all Terra input and assumes no cache discounts.

| Stage | Maximum calls | Input token caps | Total output per call | Full reservation |
| --- | ---: | --- | ---: | ---: |
| Embedding batches | 2 | 8,000; 40,000 | 0 | $0.000960 |
| Luna routing | 2 | 8,000 each | 0 charged | $0.001600 |
| Terra ID selection | 6 | 48,000 each | 600 including reasoning | $0.763200 |
| Total | 10 | | | $0.765760 |

The new proposed external API ceiling is **$1.00**. No old approval transfers.
There are zero Sol API judges and zero Codex SDK calls. Native active-chat Codex
review uses the existing session's usage/cost, which is unknown and separate;
it is not assumed free. Price attestations older than 24 hours fail before
credential access or transport.

## Executable controls and native review

`run-search-evaluation.ts --mode prepare-native` freezes the current source,
commit heads, 27/63 corpus, all 29 queries, 39 reused vectors and exact new inputs.
The existing budget adapter now has `native-review-v2` mode. It admits only the
two embedding requests, two fixed routing slots and six selection slots.
A supplied approval must match the exact manifest hash and $1 ceiling.

Every request receives its full durable reservation before the sole transport
attempt. Claims, requests, raw replies and ledger events are exclusive and
immutable. A failed or unknown execution cannot resume or retry. Full unknown
reservations stay consumed. Requests are serial, time out after 60 seconds, and
forbid tools, alternate models/tiers, chaining, background calls and live career
or database services. Responses use `store:false`, default tier and the existing
600-token output bound. Global fetch is disabled outside the private guarded
transport; credentials are consulted only inside that admitted live transport.

Stop on any file/head/provenance/query drift, cache miss, invalid vector/model,
missing or excessive usage, cap overrun, timeout/HTTP error, malformed routing or
selection, unknown source ID, invalid citation, missing qualification or unsafe
claim. Score all 23 retrieval cases and stop on a regression among the 22
previously passing cases. Keep the known context-free ownership-label 7/8 result
visible; the fresh scoped ownership case still must pass. No unused slot can be
reassigned.

After all six mechanical case checks, the same native helper used in Daniel's
updated pipeline writes `artifact-review-packet.json`, with packet/rubric hashes,
raw and displayed answers, complete qualified sources and generation provenance.
Quality remains `awaiting-active-codex-chat-review`. No model judge launches.
Synthetic packets are explicitly labeled `synthetic-fake`; they are not quality
evidence. The review command prints the native prompt or validates a saved cited
pass/fail/uncertain review, with zero inference. Validation checks traceability,
not semantic entailment or independent/human calibration.

## Commands after approval

The final manifest and false approval template are in
`review-evidence/semantic-search-preparation-20261017/native-final/execution/`
in the parent preparation workspace. After Daniel authorizes this exact scope,
create the matching `approval-approved.json` from that template; preserve every
bound field. The reviewed execution command, from the isolated Portfolio root:

```sh
npm run eval:portfolio-guide:native-search -- --mode live \
  --manifest ../review-evidence/semantic-search-preparation-20261017/native-final/execution/manifest.json \
  --approval ../review-evidence/semantic-search-preparation-20261017/native-final/execution/approval-approved.json \
  --allow-paid
```

`approval-approved.json` does not exist before authorization. The pending false
approval is rejected without provider access. Fake mode uses a separate registry
and cannot consume or unlock the live execution ID.

For captured results, using the actual journal directory printed by the runner:

```sh
npm run eval:portfolio-guide:review -- --from JOURNAL_EXECUTION_DIRECTORY
npm run eval:portfolio-guide:review -- --from JOURNAL_EXECUTION_DIRECTORY --validate-review REVIEW.json
```

Reviewing a prior capture assesses saved answers, not fresh Terra/Luna behavior.
This proposed paid run would produce fresh model selections on the qualified
staged corpus. It would not verify deployed configuration, endpoint availability,
production latency or deployment. No push, merge, publication or activation is
included. Exact source paths, hashes, fake receipts and verification logs accompany
the final report.
