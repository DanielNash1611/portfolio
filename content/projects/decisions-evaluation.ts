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
      label: "Current release validation",
      date: "October 17, 2026 · UTC",
      result: "32/32 routing; 5/6 enabled vs 6/6 disabled",
      method:
        "Six synthetic, public-safe scenarios ran once per routing arm using gpt-5.6-terra, Luna routing and a source-aware gpt-6.1-sol paired judge. The enabled ownership answer lost its AI-assisted implementation distinction during sentence bounding, even though the raw answer contained it. The 41 API requests price to about $0.57 from reported token/cache usage at published standard rates; the invoice was not independently reconciled.",
      limit:
        "Routing worked on this small authored set, but enabled answer quality was not a win. A deterministic repair replayed all 12 unchanged raw answers with byte-identical prompts and changed only that ownership answer. The original failed grade is retained; the repair has no new paid quality score. Complete current local validation, service compatibility and deployed configuration remain separate gates.",
      snapshot:
        "Canary snapshot 7371d60; original answers, grades, usage and the separate repair replay are retained locally.",
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
