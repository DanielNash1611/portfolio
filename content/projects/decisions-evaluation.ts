/** Sanitized aggregates; raw traces and personal records stay local. */
export const decisionsEvaluation = {
  title: "Better routing was only the first hypothesis",
  introduction:
    "I used evaluations to separate a working routing mechanism from a useful answer. More relevant evidence could make an answer more helpful while making it too long or losing a source limitation. That mixed result shaped the next product decisions.",
  status:
    "Local implementation and saved evaluations; combined release validation is pending.",
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
      label: "Final combined release",
      date: "Pending",
      result: "No final quality claim yet",
      method:
        "The isolated candidate must pass its complete frozen evaluation inventory after the last change. Production-model checks and rollout verification remain separate from historical results.",
      limit:
        "No incomplete run is reported as passed, and no earlier result establishes the final deployment's behavior.",
      snapshot:
        "Release revision and final evaluation record will be added after validation.",
    },
  ],
  judgeDisclosure:
    "Judge results also needed scrutiny. Later checks corrected four unchanged answers' source-aware grades, and a persisted Terra check regraded a malformed judge response against the unchanged answer. These are grading corrections, not newly improved answers; original outcomes remain part of the record.",
  methodology:
    "Each stage keeps its own questions, models, dates, snapshot and denominator. The historical 12-case OpenAI comparison elsewhere on this page is a separate experiment. These small authored sets share source material and do not establish independent scientific validation, hiring outcomes, cost savings or generalized AI-quality gains.",
} as const;
