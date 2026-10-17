/** Sanitized aggregates; raw traces and personal records stay local. */
export const decisionsEvaluation = {
  title: "Better routing was only the first hypothesis",
  introduction:
    "I used evaluations to separate a working routing mechanism from a useful answer. More relevant evidence could make an answer more helpful while making it too long or losing a source limitation. That mixed result shaped the next product decisions.",
  status:
    "Local candidate with saved evaluations; current validation exposed output-processing limits, and release review is pending.",
  stages: [
    {
      id: "baseline",
      label: "Baseline",
      date: "October 8, 2026 · Pacific",
      result: "37/43 local checks",
      method:
        "The saved gpt-oss:20b baseline had six failures: four sentence-limit failures and two missing expected signals. Seven routing-eligible questions passed 7/7 before routing.",
      limit:
        "These are preserved baseline failures from one local answer run, not a production benchmark or semantic-quality percentage.",
      snapshot: "Saved 43-case run; uncommitted local snapshot.",
    },
    {
      id: "router",
      label: "Routing mechanism",
      date: "October 8, 2026 · Pacific",
      result: "32/32 routing fixtures",
      method:
        "An OpenAI Decisions API layer using gpt-6-luna selected topics, depth and evidence needs before Responses API answer generation. Fixtures covered routed questions and direct-question bypasses.",
      limit:
        "Routing behavior does not establish answer quality or production readiness. This remained a locally tested prototype.",
      snapshot:
        "Routing version 2026-10-08.v1; saved result October 9 at 03:50 UTC.",
    },
    {
      id: "comparison",
      label: "Controlled answer comparison",
      date: "October 8, 2026 · Pacific",
      result: "33/36 → 27/36 combined passes",
      method:
        "Twelve questions ran three times per arm: 72 answers using gpt-5, gpt-6-luna routing and a source-aware gpt-5-mini judge. Helpfulness averaged 3.97/5 off and 4.28/5 on, while combined check-and-judge passes fell.",
      limit:
        "Routing alone was not an overall quality win. Concision and source-limit flags remained. Both arms used matched loaded code and sources; later edits are a different snapshot.",
      snapshot:
        "Stored routing-file fingerprint d0457ca5c44a; complete file fingerprints retained locally.",
    },
    {
      id: "fixes",
      label: "Fixes and targeted follow-up",
      date: "October 8–9, 2026",
      result: "12/14 → 14/14 matched smoke",
      method:
        "Answer processing kept qualifiers with proof, bounded sentence counts and preserved question scope. A separate ownership follow-up passed 8/8 trials across four models, twice each.",
      limit:
        "The 14-case smoke and eight ownership trials are different datasets. Targeted repair checks do not replace a complete regression after the final change.",
      snapshot:
        "Saved local smoke and ownership artifacts; not a committed release snapshot.",
    },
    {
      id: "skills",
      label: "The same evidence rule in resumes",
      date: "October 16 Pacific / October 17 UTC, 2026",
      result: "564/564 deterministic tests",
      method:
        "A linked skills bank registered 31 skill and tool labels, with supported labels connected to approved bullet variants and four mappings explicitly unresolved. Drafting and rendering checked proof visible in the resume. A synthetic PDF retained the Decisions API local-prototype skill and its qualifier.",
      limit:
        "Four mappings remained explicitly unresolved. Structural/provenance and rendering tests do not measure resume persuasiveness or establish deployment.",
      snapshot:
        "Local ResumeCustomizer commit 25892de; no model evaluation is included in this test count.",
    },
    {
      id: "final",
      label: "Bounded paid validation",
      date: "October 17, 2026 · UTC",
      result: "32/32 routing; 5/6 enabled vs 6/6 disabled",
      method:
        "Six synthetic, public-safe scenarios ran once per routing arm using gpt-5.6-terra, Luna routing and a source-aware gpt-6.1-sol paired judge. The enabled ownership answer lost its AI-assisted implementation distinction during sentence bounding, even though the raw answer contained it. The 41 API requests price to about $0.57 from reported token/cache usage at published standard rates; the invoice was not independently reconciled.",
      limit:
        "Routing worked on this small authored set, but enabled answer quality was not a win. A deterministic repair replayed all 12 unchanged raw answers with byte-identical prompts and changed only that ownership answer. The original failed grade is retained; the repair has no new paid quality score. Complete current local validation, service compatibility and deployed configuration remain separate gates.",
      snapshot:
        "Canary snapshot 7371d60; original answers, grades, usage and the separate repair replay are retained locally.",
    },
    {
      id: "complete-local-review",
      label: "A passing judge still needed review",
      date: "October 17, 2026 · UTC",
      result: "41/43 hard checks; 43/43 local judge",
      method:
        "A complete original 43-case pass at e2a72a4 used installed gpt-oss:20b answers and the same source-aware qwen2.5:14b judge. Two hard failures were wording or typography mismatches, but manual review still found a lost checkout estimate qualifier and AI Career measurement and release-status limits. Three deterministic probes exposed related output-processing gaps.",
      limit:
        "The two hard failures remain in the recorded 41/43 result. Judge passes did not override the manual findings, and the local models did not establish Terra or production quality. This snapshot remains part of the record after repairs.",
      snapshot:
        "Frozen e2a72a4 answers, original rubrics, grades and file hashes retained separately from later repairs.",
    },
    {
      id: "source-contract-repairs",
      label: "Repair the claim boundary, then rerun",
      date: "October 17, 2026 · UTC",
      result: "276 deterministic passes",
      method:
        "Captured raw answers and supplied canonical evidence drove bounded repairs for estimate qualifiers, unspecified time units, exact static-inventory figures, unlaunched integration scope, empty assistance credit, adjacent media-outcome claims and retrieval typography. Focused tests covered missing evidence, already-qualified answers and unrelated measured runtime facts; four existing tests stayed skipped.",
      limit:
        "These are regression checks, not a semantic-quality score. The complete 43-case local answer and same-judge rerun is separate evidence and retains its original rubric. All prior comparisons, including the model bake-off and the paid enabled failure, remain preserved; no additional paid model score or production verification is claimed.",
      snapshot:
        "Repair and full-run manifests identify their own code and source snapshots; release remains held for review and owner configuration verification.",
    },
    {
      id: "source-scope-followup",
      label: "Keep the answer inside its source",
      date: "October 17, 2026 · UTC",
      result: "42/43 hard checks; 42/43 local judge",
      method:
        "A complete follow-up at bcf571e retained all 43 original questions and rubrics. Manual review still found generic retrieval wording without its disabled-release limit, stronger survey agency and broader platform-delivery claims. The one judge failure alleged metrics absent from the displayed answer; separate source review found a real helped-lead qualifier to retain.",
      limit:
        "That combined result remains 41/43. A further source-gated repair passed 285 deterministic tests with four existing skips, including absent-source and already-qualified negatives. Its complete local rerun and actual-answer review are separate evidence; no old answer, grade, paid result or bake-off comparison is replaced.",
      snapshot:
        "Frozen bcf571e outputs and grades are retained. The later repair and full-run manifests identify their own snapshot; Production configuration remains unverified after the denied metadata read.",
    },
    {
      id: "approved-source-alignment",
      label: "Align the evidence before strengthening the answer",
      date: "October 17, 2026 · UTC",
      result: "42/43 hard checks; 43/43 local judge",
      method:
        "The complete 3cec994 run preserved one literal professional-grounding mismatch and one recommendation advisory. Source review found that approved career evidence already confirmed February 2026 platform production, while the Guide packet emphasized prototype framing. A conservative follow-up carried the timeline and original-vision caveat into the packet and retained helped-lead and worked-on agency.",
      limit:
        "The recorded combined result remains 42/43. Recommendation coverage alone is not a factual release blocker, and the source cross-check does not establish sole engineering ownership, preservation of the full original vision or stronger performance outcomes. The new snapshot receives its own complete local run; original scores, rubrics and the model bake-off remain unchanged.",
      snapshot:
        "Frozen 3cec994 answers and grades remain separate from the source-alignment revision and its later validation; Production configuration is still a separate gate.",
    },
    {
      id: "source-alignment-full-review",
      label: "Paraphrase repairs reached their limit",
      date: "October 17, 2026 · UTC",
      result: "39/43 hard checks; 41/43 local judge",
      method:
        "The frozen a611b35 run completed all 43 original questions with gpt-oss:20b answers and qwen2.5:14b judging. Actual-answer review still found an incorrect 16-month timeline, unsupported measurable-business-outcome language and a missing helped-lead qualifier. Each claim originated in raw local generation and survived processing; the combined recorded result remains 38/43.",
      limit:
        "Four literal or coverage failures and one recommendation advisory remain separately recorded. These local failures are not evidence that Terra made the same claims. The earlier paid Terra canary retained its own 6/6 disabled and 5/6 enabled grades; the enabled ownership failure was a demonstrated processing loss of credit.",
      snapshot:
        "Original a611b35 questions, raw answers, displayed text, rubrics and grades remain immutable alongside every prior comparison and bake-off.",
    },
    {
      id: "evidence-block-simplification",
      label: "Select evidence before rendering the answer",
      date: "October 17, 2026 · UTC",
      result: "Approved simplification; validation separate",
      method:
        "Daniel approved replacing expanding prose repairs with selection of approved claim-block IDs. The renderer keeps each source claim and its qualifications together, rejects invented IDs and free-form answer text, and uses a canonical fallback. The existing budget guard reconciles completed prior usage before admitting a small Terra/Luna regression comparison.",
      limit:
        "Deterministic contracts do not establish Terra answer quality or Production readiness. The comparison uses synthetic questions and public-safe approved evidence, with remote career retrieval disabled and no automatic paid retries. Its actual outcomes are recorded separately after completion.",
      snapshot:
        "All historical stages and the separate 72-trial model bake-off are retained. Owner Production configuration confirmation remains pending.",
    },
    {
      id: "terra-claim-selection-result",
      label: "Constrained facts still needed a useful answer",
      date: "October 17, 2026 · UTC",
      result: "Terra: 2/4 candidate vs 3/4 baseline",
      method:
        "A new four-question comparison at 09db575 used eight Terra answer calls, four blinded Sol paired judgments and one Luna routing request shared across identical comparison inputs. It covered the three latest local claim failures and the original ownership-credit question. Terra selected valid approved block IDs in all four candidate answers, retaining their qualifications and implementation credit.",
      limit:
        "The candidate still failed relevance and concision: the judge preferred the baseline in three cases and the candidate in one. All three original page cases exceeded the unchanged four-sentence limit, and the impact answer missed one requested proof signal. Both ownership answers stayed on the current project despite the broader question. The small run established no universal quality gain or Production readiness; no automatic paid retry or regrade followed.",
      snapshot:
        "The a611b35 baseline code and 09db575 candidate used the same scoped public request per pair, with no remote career retrieval. Original rubrics, raw outputs, original paid 6/6-versus-5/6 grades and all historical bake-off evidence remain unchanged. Quality and owner Production configuration gates remain open.",
    },
  ],
  judgeDisclosure:
    "Judge results also needed scrutiny. Later checks corrected four unchanged answers' source-aware grades, and a persisted Terra check regraded a malformed judge response against the unchanged answer. These are grading corrections, not newly improved answers; original outcomes remain part of the record.",
  methodology:
    "Each stage keeps its own questions, models, dates, snapshot and denominator. The historical 12-case OpenAI comparison elsewhere on this page is a separate experiment. These small authored sets share source material and do not establish independent scientific validation, hiring outcomes, cost savings or generalized AI-quality gains.",
} as const;

export const modelBakeoff = {
  title: "Model bake-off: a separate decision",
  date: "October 8, 2026 · America/Los_Angeles",
  introduction:
    "I also compared answer models after the routing experiment. This was a separate 12-question study, with 72 answer trials, rather than another routing-off/on result. It informed the local Terra configuration alongside product judgment; it did not establish a universal model winner.",
  method:
    "Four existing page, role and next-read questions plus eight broader creative, enterprise AI, director-fit, healthcare, scientific-research, comparison, ownership and architecture questions. Luna and Terra each ran twice per question in alternating order; GPT-5 and Sol each had one exploratory repeat. All used Luna Decisions routing, low reasoning effort, hybrid retrieval disabled and a fixed source-aware gpt-5-mini judge blinded to answer-model identity.",
  models: [
    {
      model: "gpt-5",
      trials: 12,
      deterministic: "12/12",
      judged: "11/12",
      medianSeconds: "14.65",
      helpfulness: "4.25",
    },
    {
      model: "gpt-5.6-terra",
      trials: 24,
      deterministic: "24/24",
      judged: "23/24",
      medianSeconds: "4.82",
      helpfulness: "4.54",
    },
    {
      model: "gpt-6-luna",
      trials: 24,
      deterministic: "24/24",
      judged: "23/24",
      medianSeconds: "5.84",
      helpfulness: "4.33",
    },
    {
      model: "gpt-6.1-sol",
      trials: 12,
      deterministic: "12/12",
      judged: "11/12",
      medianSeconds: "7.37",
      helpfulness: "4.33",
    },
  ],
  interpretation:
    "Terra and Luna produced similarly supported answers on this small set. Terra was the faster answer-model candidate; Sol showed no clear quality gain here and took longer. The table retains the original ownership failures before the final guardrail repair. Eight separate ownership follow-ups passed across all four models after that repair; they do not replace failed main trials.",
  latencyLimit:
    "Latency covers the generation workflow, including routing and career retrieval, and excludes judging. Eight of 60 routing-eligible trials hit the 1.5-second router timeout and used the page-grounded fallback. Among 18 paired Terra/Luna trials without either router timing out, medians were 4.55 s and 5.09 s; the median paired difference was 0.69 s. These are local workflow observations, not a general API latency guarantee.",
  costLimit:
    "No reconciled dollar-cost comparison was recorded. Saved answer-call usage for Terra's 24 trials was 378,696 input and 9,744 output tokens; Luna's 24 used 404,482 input and 10,396 output tokens. Cache hits and call counts differed. These totals exclude judge/router token costs and do not establish lower bills or savings.",
  auditLimit:
    "All 72 answers were regraded after the judge received complete captured sources; four unchanged answers then needed recommendation-bucket grading corrections. Original grades and rechecks remain in the local artifacts. Answer-generation file fingerprints stayed stable during the paired Terra/Luna study; the judge file changed during source-packet repair. Unequal repeats, small authored datasets, live career retrieval and later code changes limit generalization and comparison with the earlier routing study.",
  selection:
    "The comparison informed the local Terra configuration. Daniel separately confirmed gpt-5.6-terra as the intended answer model on October 17. Current release validation and production configuration verification remain separate gates; no new paid model bake-off is included here.",
  provenance:
    "Source: the saved October 8 model-comparison report, aggregate results, original grades and follow-up records. Complete file references and fingerprints are retained in the repository review notes.",
} as const;
