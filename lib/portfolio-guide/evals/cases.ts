import type { PortfolioGuideEvalCase } from "@/lib/portfolio-guide/evals/types";
import {
  CHECKOUT_BUSINESS_IMPACT,
  CHECKOUT_EXECUTION_ARTIFACT,
  MCP_NOT_MENTIONED,
  REFUSES_TO_RANK_REUSE,
  REUSABLE_PATTERN_NAMES,
} from "@/lib/portfolio-guide/evals/concepts";

const REGEX_87_PERCENT = {
  type: "regex" as const,
  value:
    "\\b87\\s*(%|percent)\\b|would(?:[- ]use){1,2}(?:[- ]it)?[- ]again|would[- ]use[- ]again",
};

const REGEX_16M = {
  type: "regex" as const,
  value: "(~?\\$?16\\s*m|16\\s*million|annualized impact)",
};

const REGEX_27M = {
  type: "regex" as const,
  value: "(~?\\$?2\\.7\\s*m|2\\.7\\s*million)",
};

export const portfolioGuideEvalCases: PortfolioGuideEvalCase[] = [
  {
    id: "ai-platform-role-fit-suggests-generator",
    title:
      "Role-fit question suggests resume generator without losing grounding",
    summary:
      "Checks that role-fit answers stay grounded in current-page evidence while offering the resume generator as an action.",
    category: "answerable",
    answerability: "answerable",
    pageSlug: "ai-platform-mcp",
    question: "Is Daniel a fit for this AI Product Manager role?",
    sessionContext: {
      visitorIntent: {
        rawInput: "AI Product Manager",
        normalizedTitle: "AI Product Manager",
        seniority: "pm",
        roleLenses: ["builder-pm", "senior-product-manager"],
        focusAreas: ["ai-product"],
        emphasis: ["technical-depth"],
      },
    },
    deterministicChecks: [
      {
        answerMustIncludeAnyGroups: [
          [
            { value: "hackathon" },
            { value: "prototype" },
            { value: "87%" },
            { value: "would use it again" },
          ],
          [
            { value: "workflow patterns" },
            { value: "platform" },
            { value: "reusable" },
            { value: "MCP" },
          ],
        ],
        answerMustExclude: [
          { value: "generated a resume" },
          { value: "resume is ready" },
          REGEX_16M,
          REGEX_27M,
        ],
        maxSentences: 5,
      },
      {
        target: "suggestedFollowUps",
        answerMustIncludeAll: [{ value: "Generate a resume for my role" }],
      },
    ],
    judgeExpectations: [
      "Use current-page evidence such as the prototype, 87% validation signal, or reusable platform/workflow patterns.",
      "Treat /resume/generate as an action, not evidence.",
      "Do not claim a resume has already been generated.",
    ],
  },
  {
    id: "ai-platform-direct-resume-request",
    title: "Direct role-specific resume request points to generator",
    summary:
      "Checks that the bot directs role-specific resume requests to /resume/generate without putting JD content in URLs.",
    category: "answerable",
    answerability: "answerable",
    pageSlug: "ai-platform-mcp",
    question: "Can I get a resume for this role?",
    deterministicChecks: [
      {
        answerMustIncludeAll: [{ value: "/resume/generate" }],
        answerMustExclude: [
          { value: "generated a resume" },
          { value: "resume is ready" },
          { value: "jobDescription=", type: "regex" },
          { value: "\\?jd=", type: "regex" },
        ],
        maxSentences: 5,
      },
      {
        target: "suggestedFollowUps",
        answerMustIncludeAll: [{ value: "Generate a resume for my role" }],
      },
    ],
    judgeExpectations: [
      "Point to /resume/generate for a role-specific PDF resume.",
      "Say the job description should be pasted in the generator flow, not encoded in a URL.",
      "Do not claim generation happened.",
    ],
  },
  {
    id: "checkout-evidence-does-not-overpromote-generator",
    title: "Evidence question does not over-promote resume generator",
    summary:
      "Checks that a pure evidence question remains evidence-first and does not push the generator CTA.",
    category: "answerable",
    answerability: "answerable",
    pageSlug: "checkout-redesign",
    question: "What are the strongest proof points on this page?",
    deterministicChecks: [
      {
        requiredConcepts: [
          CHECKOUT_BUSINESS_IMPACT,
          CHECKOUT_EXECUTION_ARTIFACT,
        ],
        answerMustExclude: [{ value: "/resume/generate" }, REGEX_87_PERCENT],
        maxSentences: 6,
      },
      {
        target: "suggestedFollowUps",
        answerMustExclude: [
          { value: "Generate a resume" },
          { value: "/resume/generate" },
          { value: "Compare Daniel to this job description" },
        ],
      },
    ],
    judgeExpectations: [
      "Answer with checkout evidence only.",
      "Do not push the generator for a pure proof-point question.",
    ],
  },
  {
    id: "ai-platform-summary",
    title: "AI platform page summary stays grounded",
    summary:
      "Checks that a broad summary captures the prototype, customer signal, and platform takeaway without drifting into other-page claims.",
    category: "answerable",
    answerability: "answerable",
    pageSlug: "ai-platform-mcp",
    question: "Summarize this page",
    deterministicChecks: {
      answerMustIncludeAnyGroups: [
        [{ value: "hackathon" }, { value: "prototype" }],
        [REGEX_87_PERCENT],
        [{ value: "reusable" }, { value: "platform" }],
      ],
      maxSentences: 4,
    },
    judgeExpectations: [
      "Summarize the page as a story that starts with a validated prototype and ends with reusable platform thinking.",
      "Keep the answer concise and recruiter-friendly.",
      "Do not import metrics or implementation specifics from other pages.",
    ],
  },
  {
    id: "ai-platform-impact",
    title: "AI platform impact cites page evidence only",
    summary:
      "Checks that impact is framed through explicit validation and influence on platform thinking, not inflated into unrelated revenue or adoption claims.",
    category: "answerable",
    answerability: "answerable",
    pageSlug: "ai-platform-mcp",
    question: "Show the impact",
    deterministicChecks: {
      answerMustIncludeAnyGroups: [
        [REGEX_87_PERCENT],
        [
          { value: "hackathon" },
          { value: "shared platform language" },
          { value: "faster repeatability" },
          { value: "agentic foundation" },
        ],
      ],
      answerMustExclude: [
        REGEX_27M,
        { value: "\\b1,?000\\b", type: "regex" },
        { value: "\\b800\\b", type: "regex" },
        REGEX_16M,
      ],
      maxSentences: 4,
    },
    judgeExpectations: [
      "Use explicit evidence such as the hackathon-winning concept, 87% would-use-again signal, or the page's stated platform impact.",
      "Avoid overstating this as a production rollout or importing enterprise adoption metrics from other work.",
    ],
  },
  {
    id: "ai-platform-ownership",
    title: "AI platform ownership answer stays conservative",
    summary:
      "Checks that ownership is summarized from explicit role/action language while acknowledging that the page does not define a full ownership matrix.",
    category: "partial",
    answerability: "partial",
    pageSlug: "ai-platform-mcp",
    question: "What did Daniel own?",
    deterministicChecks: {
      answerMustIncludeAnyGroups: [
        [
          { value: "led a team" },
          { value: "design and build a functional ai prototype" },
          { value: "mapped recurring ai workflow patterns" },
          { value: "translated emerging mcp" },
          {
            type: "regex" as const,
            value:
              "led execution to map recurring ai workflow patterns|translated (?:mcp|orchestration) concepts",
          },
        ],
        [
          { value: "doesn't provide a full ownership matrix" },
          { value: "doesn't spell out an exact ownership split" },
          {
            type: "regex" as const,
            value:
              "does(?: not|n't) provide a (?:formal|full) ownership matrix|does(?: not|n't) define a (?:formal|full) ownership matrix",
          },
          { value: "not fully explicit" },
          { value: "team boundary details" },
          { value: "did not own the final implementation path" },
        ],
      ],
      maxSentences: 4,
    },
    judgeExpectations: [
      "State the explicit ownership or contribution signals on the page.",
      "Say clearly that the page does not provide a formal ownership matrix.",
      "Do not invent an exact cross-functional responsibility breakdown.",
    ],
  },
  {
    id: "ai-platform-most-reused-patterns",
    title: "AI platform page avoids invented ranking of reused patterns",
    summary:
      "Checks that the assistant names patterns the page supports while refusing to rank which one was reused most.",
    category: "partial",
    answerability: "partial",
    pageSlug: "ai-platform-mcp",
    question: "Which specific system patterns were shipped and reused most?",
    deterministicChecks: {
      requiredConcepts: [REUSABLE_PATTERN_NAMES, REFUSES_TO_RANK_REUSE],
      maxSentences: 4,
    },
    judgeExpectations: [
      "Acknowledge that the page supports reusable patterns, but does not quantify which was reused most.",
      "Avoid inventing a ranking or frequency claim.",
    ],
  },
  {
    id: "ai-platform-contaminated-history",
    title: "AI platform answer ignores hallucinated prior assistant detail",
    summary:
      "Checks that invented prior assistant content is not reused as if it were source truth.",
    category: "contaminated-history",
    answerability: "partial",
    pageSlug: "ai-platform-mcp",
    question: "Which patterns were reused most?",
    priorConversation: [
      {
        role: "assistant",
        content:
          "Daniel shipped three connector patterns across CRM, OMS, and support tooling, and the CRM connector was reused most.",
      },
      {
        role: "user",
        content: "Which one came up the most?",
      },
    ],
    deterministicChecks: {
      requiredConcepts: [REFUSES_TO_RANK_REUSE],
      answerMustExclude: [
        { value: "crm" },
        { value: "oms" },
        { value: "support tooling" },
        { value: "three connector patterns" },
        { value: "connector was reused most" },
      ],
      maxSentences: 4,
    },
    judgeExpectations: [
      "Treat the prior assistant turn as contaminated and ignore it.",
      "Do not repeat unsupported details from previous assistant output.",
      "Return to current-page evidence and state the limit clearly.",
    ],
  },
  {
    id: "ai-platform-referential-follow-up",
    title: "Referential follow-up uses dialogue context without promoting it to evidence",
    summary:
      "Checks that an immediate follow-up can resolve the prior answer while re-grounding the explanation in the current page.",
    category: "contaminated-history",
    answerability: "answerable",
    pageSlug: "ai-platform-mcp",
    question: "What do you mean by that?",
    priorConversation: [
      {
        role: "user",
        content: "What is the strongest signal on this page?",
      },
      {
        role: "assistant",
        content: "The strongest signal is the move toward reusable AI systems.",
      },
    ],
    deterministicChecks: {
      answerMustIncludeAny: [
        { value: "87%" },
        { value: "prototype" },
        { value: "workflow" },
        { value: "reusable" },
      ],
      answerMustExclude: [REGEX_16M, REGEX_27M],
      maxSentences: 6,
    },
    judgeExpectations: [
      "Resolve what 'that' refers to using the prior answer.",
      "Re-ground the explanation in current-page prototype, validation, or workflow evidence.",
      "Do not treat the prior assistant wording itself as proof.",
    ],
  },
  {
    id: "checkout-multiturn-current-page-primary",
    title: "Cross-page conversation keeps the new current page primary",
    summary:
      "Checks that AI-platform dialogue and role memory do not contaminate a later checkout-page answer.",
    category: "cross-page-memory",
    answerability: "answerable",
    pageSlug: "checkout-redesign",
    question: "For the role I entered, what is strongest on this page?",
    priorConversation: [
      { role: "user", content: "Tell me about the AI platform work." },
      {
        role: "assistant",
        content: "That page discusses MCP-style connectors and reusable AI workflows.",
      },
    ],
    sessionContext: {
      visitedPages: ["ai-platform-mcp", "checkout-redesign"],
      visitorIntent: {
        rawInput: "AI Product Leader",
        normalizedTitle: "AI Product Leader",
        seniority: "director",
        roleLenses: ["product-leader"],
      },
    },
    deterministicChecks: {
      requiredConcepts: [CHECKOUT_BUSINESS_IMPACT],
      answerMustExclude: [
        { value: "MCP" },
        { value: "connector" },
        { value: "87%" },
      ],
      maxSentences: 6,
    },
    judgeExpectations: [
      "Use checkout redesign evidence and measured outcomes from the current page.",
      "The entered role may frame relevance but cannot import AI-platform facts.",
      "Do not repeat the prior assistant's MCP or connector language.",
    ],
  },
  {
    id: "checkout-mentions-mcp",
    title: "Checkout page does not invent MCP mention",
    summary:
      "Checks that the assistant says the checkout page does not mention MCP rather than borrowing the term from elsewhere on the site.",
    category: "unanswerable",
    answerability: "unanswerable",
    pageSlug: "checkout-redesign",
    question: "Did this page mention MCP?",
    deterministicChecks: [
      {
        requiredConcepts: [MCP_NOT_MENTIONED],
        answerMustExclude: [
          { value: "^\\s*yes\\b", type: "regex" },
          { value: "it mentions mcp" },
        ],
        maxSentences: 3,
      },
      {
        target: "suggestedFollowUps",
        answerMustExclude: [{ value: "mcp" }],
      },
      {
        target: "relatedPageReasons",
        answerMustExclude: [{ value: "mcp" }],
      },
    ],
    judgeExpectations: [
      "Say plainly that MCP is not mentioned on this page.",
      "Do not blend in MCP language from AI platform pages or prior session memory.",
    ],
  },
  {
    id: "checkout-impact",
    title: "Checkout page impact answer uses explicit evidence",
    summary:
      "Checks that impact is grounded in the checkout page's measured outcomes and delivery evidence.",
    category: "answerable",
    answerability: "answerable",
    pageSlug: "checkout-redesign",
    question: "What was the impact?",
    deterministicChecks: {
      answerMustIncludeAnyGroups: [
        [REGEX_16M],
        [
          { value: "30% faster" },
          { value: "3:00 to 2:03" },
          { value: "~3% conversion" },
        ],
        [
          { value: "a/b test" },
          { value: "post-launch" },
          { value: "usability testing" },
        ],
      ],
      answerMustExclude: [
        REGEX_27M,
        REGEX_87_PERCENT,
        { value: "\\b1,?000\\b", type: "regex" },
        { value: "\\b800\\b", type: "regex" },
      ],
      maxSentences: 4,
    },
    judgeExpectations: [
      "Cite explicit metrics or evidence from the checkout page such as ~16M annualized impact, 30% faster checkout, ~3% conversion lift, 12-week delivery, or the A/B test.",
      "Do not import AI pilot or platform metrics from other pages.",
    ],
  },
  {
    id: "checkout-ownership",
    title: "Checkout page ownership answer avoids exact ownership matrix",
    summary:
      "Checks that the assistant summarizes Daniel's role conservatively and does not invent an exact product/UX/engineering ownership split.",
    category: "partial",
    answerability: "partial",
    pageSlug: "checkout-redesign",
    question: "What did Daniel own?",
    deterministicChecks: {
      answerMustIncludeAnyGroups: [
        [
          { value: "drove the effort across product, ux, and engineering" },
          { value: "aligned product, ux, and engineering" },
          { value: "gave developers enough context" },
          {
            type: "regex" as const,
            value:
              "developers? had (?:enough )?context|ensuring developers? had (?:the )?context",
          },
          { value: "kept ux actively involved" },
        ],
        [
          { value: "doesn't provide a formal ownership matrix" },
          { value: "doesn't spell out an exact ownership split" },
          {
            type: "regex" as const,
            value:
              "does(?: not|n't) define a (?:formal|full) ownership matrix|does(?: not|n't) provide a (?:formal|full) ownership matrix",
          },
          { value: "not a detailed ownership matrix" },
          { value: "not explicit beyond" },
        ],
      ],
      maxSentences: 4,
    },
    judgeExpectations: [
      "Summarize the role as product leadership through execution, collaboration, and rollout.",
      "Say clearly that the page does not define an exact ownership matrix.",
      "Avoid claiming sole ownership of design, engineering, or every implementation decision.",
    ],
  },
  {
    id: "checkout-cross-page-dau",
    title: "Checkout page does not borrow DAU from another page",
    summary:
      "Checks that current-page questions are answered from the checkout page, even when the session includes pages with DAU metrics.",
    category: "cross-page-memory",
    answerability: "unanswerable",
    pageSlug: "checkout-redesign",
    question: "How many daily active users does this page show?",
    sessionContext: {
      visitedPages: [
        "chatgpt-enterprise",
        "ai-platform-mcp",
        "checkout-redesign",
      ],
      inferredInterestTags: ["platform"],
    },
    deterministicChecks: {
      answerMustIncludeAny: [
        { value: "doesn't mention daily active users" },
        { value: "doesn't give a dau figure" },
        { value: "no dau figure on this page" },
        { value: "this page is about checkout and doesn't list dau" },
        {
          type: "regex" as const,
          value:
            "does(?: not|n't) (?:state|provide|mention).*(?:daily active users?|dau)(?: figure| metric)?",
        },
      ],
      answerMustExclude: [
        { value: "\\b800\\b", type: "regex" },
        { value: "\\b1,?000\\b", type: "regex" },
      ],
      maxSentences: 4,
    },
    advisoryChecks: [
      {
        relatedPageSlugsMustInclude: ["chatgpt-enterprise"],
      },
    ],
    judgeExpectations: [
      "Separate the current page from broader site memory.",
      "If helpful, point to ChatGPT Enterprise as a different page that does include adoption metrics.",
      "Do not present 800 DAU or 1,000 users as facts from the checkout page.",
    ],
  },
  {
    id: "jira-evidence",
    title: "Jira Product Discovery page answers with evidence on-page",
    summary:
      "Checks that an evidence question is answered with explicit adoption, onboarding, visibility, and artifact signals from the JPD page.",
    category: "answerable",
    answerability: "answerable",
    pageSlug: "jira-product-discovery",
    question: "What evidence is on this page?",
    deterministicChecks: {
      answerMustIncludeAnyGroups: [
        [
          { value: "9 pms" },
          { value: "all nine product managers" },
          { value: "core product organization" },
          {
            type: "regex" as const,
            value:
              "\\b(?:9|nine)\\b\\s+(?:core\\s+)?(?:product managers?|pms?)|full adoption across (?:all )?nine product managers",
          },
        ],
        [
          { value: "8-week onboarding" },
          { value: "8 week onboarding" },
          { value: "8-week onboarding program" },
          {
            type: "regex" as const,
            value: "\\b8[ -]?week onboarding(?: program)?\\b",
          },
        ],
        [
          { value: "reduced time-to-align" },
          { value: "faster and more confident approvals" },
          { value: "real-time visibility" },
          { value: "progress against okrs" },
          {
            type: "regex" as const,
            value:
              "improved visibility(?: into)?(?: .*?(?:initiatives|dependencies|okrs))?|faster(?:,? more confident)? .*approvals|visibility into .*progress against okrs",
          },
        ],
      ],
      maxSentences: 4,
    },
    judgeExpectations: [
      "Answer with explicit evidence from the JPD page rather than generic praise.",
      "Use at least one concrete metric or adoption signal and at least one operational outcome or artifact signal.",
    ],
  },
  {
    id: "jira-next-read",
    title:
      "Jira Product Discovery page stays helpful on next-read recommendations",
    summary:
      "Checks that the assistant still gives a useful next-step recommendation instead of becoming rigid after grounding constraints.",
    category: "answerable",
    answerability: "answerable",
    pageSlug: "jira-product-discovery",
    question: "What should I read next?",
    sessionContext: {
      visitorIntent: {
        rawInput: "Director of Product",
        normalizedTitle: "Director of Product",
        seniority: "director",
        roleLenses: ["product-leader"],
        emphasis: ["leadership", "scale"],
      },
    },
    deterministicChecks: {
      relatedPageSlugsMustInclude: ["chatgpt-enterprise"],
      maxSentences: 4,
    },
    judgeExpectations: [
      "Recommend a sensible next page and explain why it complements the current page.",
      "Stay grounded and useful; do not refuse to recommend just because the question is broader than the page.",
    ],
  },
  {
    id: "ai-platform-role-relevance",
    title: "AI platform page answers role relevance with concrete signals",
    summary:
      "Checks that role-fit answers stay grounded in the current page and cite the strongest platform-specific evidence.",
    category: "answerable",
    answerability: "answerable",
    pageSlug: "ai-platform-mcp",
    question: "For the role I entered, what's most relevant here?",
    sessionContext: {
      visitorIntent: {
        rawInput: "Platform Product Manager",
        normalizedTitle: "Platform Product Manager",
        seniority: "pm",
        roleLenses: ["builder-pm", "senior-product-manager"],
        focusAreas: ["platform"],
        emphasis: ["technical-depth"],
      },
    },
    deterministicChecks: {
      answerMustIncludeAnyGroups: [
        [
          { value: "hackathon" },
          { value: "prototype" },
          { value: "87%" },
          { value: "would use it again" },
        ],
        [
          { value: "reusable" },
          { value: "platform foundations" },
          { value: "workflow patterns" },
          { value: "platform thinking" },
        ],
      ],
      answerMustExclude: [REGEX_27M, REGEX_16M],
      maxSentences: 4,
    },
    judgeExpectations: [
      "Tie role relevance to explicit signals such as the validated prototype, 87% would-use-again signal, or reusable platform framing.",
      "Do not drift into generic praise or import enterprise rollout metrics from other pages.",
    ],
  },
  {
    id: "ai-platform-responsibility-specific",
    title: "AI platform responsibility answer separates ownership from limits",
    summary:
      "Checks that the exact recruiter phrasing still produces a conservative, evidence-backed ownership answer.",
    category: "partial",
    answerability: "partial",
    pageSlug: "ai-platform-mcp",
    question: "What particularly was Daniel responsible for?",
    deterministicChecks: {
      answerMustIncludeAnyGroups: [
        [
          { value: "led a team" },
          { value: "design and build" },
          { value: "mapped recurring ai workflow patterns" },
          { value: "translated" },
          { value: "platform principles" },
        ],
        [
          { value: "influence" },
          { value: "implementation" },
          { value: "not explicit" },
          {
            type: "regex" as const,
            value:
              "does(?: not|n't) (?:define|provide).*(?:ownership matrix|team size|org structure|implementation ownership)",
          },
        ],
      ],
      maxSentences: 4,
    },
    judgeExpectations: [
      "Make direct responsibility explicit, but separate it from influence and implementation scope.",
      "State the missing ownership detail clearly rather than guessing.",
    ],
  },
  {
    id: "ai-platform-seniority",
    title: "AI platform seniority answer is credible and bounded",
    summary:
      "Checks that seniority answers cite leadership and platform signals while explicitly naming what is not proven on the page.",
    category: "partial",
    answerability: "partial",
    pageSlug: "ai-platform-mcp",
    question: "How senior is this work?",
    deterministicChecks: {
      answerMustIncludeAnyGroups: [
        [
          { value: "led a team" },
          { value: "translated emerging orchestration" },
          { value: "platform principles" },
          { value: "reusable systems" },
        ],
        [
          { value: "not proven" },
          { value: "doesn't specify team size" },
          { value: "doesn't define org structure" },
          { value: "doesn't show production rollout scale" },
        ],
      ],
      maxSentences: 4,
    },
    judgeExpectations: [
      "Describe the work as strong senior-level signal only to the extent the page supports it.",
      "Avoid upgrading the work into a larger title or org scope than the page proves.",
    ],
  },
  {
    id: "checkout-strongest-signals",
    title: "Checkout page strongest-signals answer stays evidence-first",
    summary:
      "Checks that strongest-signal answers use explicit checkout evidence instead of generic PM praise.",
    category: "answerable",
    answerability: "answerable",
    pageSlug: "checkout-redesign",
    question: "What are the strongest signals on this page?",
    deterministicChecks: {
      requiredConcepts: [CHECKOUT_BUSINESS_IMPACT, CHECKOUT_EXECUTION_ARTIFACT],
      answerMustExclude: [REGEX_27M, REGEX_87_PERCENT],
      maxSentences: 4,
    },
    judgeExpectations: [
      "Lead with the checkout page's strongest proof points: business impact, delivery speed, and execution artifacts.",
      "Do not lapse into generic 'strong PM work' phrasing without evidence.",
    ],
  },
  {
    id: "ai-platform-implied-not-proven",
    title: "AI platform implied-vs-proven answer stays disciplined",
    summary:
      "Checks that the assistant separates explicit proof from modest inference on the AI platform page.",
    category: "partial",
    answerability: "partial",
    pageSlug: "ai-platform-mcp",
    question: "What's implied but not proven here?",
    deterministicChecks: {
      answerMustIncludeAnyGroups: [
        [
          { value: "hackathon" },
          { value: "87%" },
          { value: "would use it again" },
          { value: "prototype" },
        ],
        [
          { value: "implied" },
          { value: "not proven" },
          { value: "production rollout" },
          { value: "team size" },
          { value: "which reusable pattern shipped most" },
        ],
      ],
      answerMustExclude: [REGEX_27M, REGEX_16M],
      maxSentences: 4,
    },
    judgeExpectations: [
      "Make the explicit proof clear first, then note the limited inference about broader platform leadership or production reuse.",
      "Do not turn implication into fact.",
    ],
  },
  {
    id: "ai-platform-next-read-leadership",
    title: "AI platform next-read stays minimal and leadership-aware",
    summary:
      "Checks that next-read guidance for AI platform leadership stays concise and uses the curated cross-page bridge language.",
    category: "answerable",
    answerability: "answerable",
    pageSlug: "ai-platform-mcp",
    question: "What should I view next for AI platform leadership?",
    sessionContext: {
      visitorIntent: {
        rawInput: "AI platform leadership",
        normalizedTitle: "AI Platform Leadership",
        seniority: "director",
        roleLenses: ["builder-pm", "product-leader", "senior-product-manager"],
        focusAreas: ["platform"],
        emphasis: ["leadership", "technical-depth"],
      },
    },
    deterministicChecks: {
      relatedPageSlugsMustInclude: ["chatgpt-enterprise"],
      answerMustIncludeAny: [
        { value: "This case pairs with ChatGPT Enterprise" },
        { value: "As a next read, start with ChatGPT Enterprise" },
      ],
      maxSentences: 4,
    },
    judgeExpectations: [
      "Recommend a tightly related next page, ideally ChatGPT Enterprise, and use bridge language rather than a broad portfolio summary.",
      "Keep the current page dominant and the cross-page reference minimal.",
    ],
  },
  {
    id: "ai-platform-connections",
    title: "AI platform connections answer stays light and cross-page aware",
    summary:
      "Checks that broader portfolio connection answers use only a couple of adjacent pages and preserve current-page primacy.",
    category: "answerable",
    answerability: "answerable",
    pageSlug: "ai-platform-mcp",
    question: "How does this connect to the rest of the portfolio?",
    deterministicChecks: {
      answerMustIncludeAny: [
        { value: "This case pairs with ChatGPT Enterprise" },
        { value: "This connects to OMS ChatGPT App" },
        { value: "This connects to Immunology Scout" },
      ],
      relatedPageSlugsMustInclude: ["chatgpt-enterprise"],
      maxSentences: 4,
    },
    judgeExpectations: [
      "Keep the answer centered on the current page, then mention one or two adjacent pages using bridge language.",
      "Avoid dumping the whole portfolio or inventing details about unrelated pages.",
    ],
  },
  {
    id: "chatgpt-enterprise-next-read-platform-role",
    title: "Role-aware next-read points to platform page",
    summary:
      "Checks that role-aware recommendations still work while keeping the current-page answer grounded.",
    category: "answerable",
    answerability: "answerable",
    pageSlug: "chatgpt-enterprise",
    question: "What should I read next?",
    sessionContext: {
      visitorIntent: {
        rawInput: "Platform PM",
        normalizedTitle: "Platform Product Manager",
        seniority: "pm",
        roleLenses: ["builder-pm", "senior-product-manager"],
        focusAreas: ["platform"],
        emphasis: ["technical-depth"],
      },
      recommendedPath: [
        {
          slug: "ai-platform-mcp",
          title: "From AI experiments to platform foundations",
          reason: "Strong match for platform and systems thinking.",
          priority: 1,
        },
        {
          slug: "oms-chatgpt-app",
          title: "OMS ChatGPT App",
          reason:
            "Good supporting evidence for AI builder work inside enterprise workflows.",
          priority: 2,
        },
      ],
    },
    deterministicChecks: {
      relatedPageSlugsMustInclude: ["ai-platform-mcp"],
      maxSentences: 4,
    },
    judgeExpectations: [
      "Recommend AI platform work as the strongest next step for a Platform PM.",
      "Keep the answer grounded in the current page and clearly label the recommendation as a next read, not current-page evidence.",
    ],
  },
  {
    id: "ai-strategy-summary",
    title: "AI strategy essay summary stays grounded in page logic",
    summary:
      "Checks that the essay is summarized through workflow fit, trust, enablement, and the system around the model without importing rollout metrics from adjacent pages.",
    category: "answerable",
    answerability: "answerable",
    pageSlug: "ai-strategy",
    question: "Summarize this page",
    deterministicChecks: {
      answerMustIncludeAnyGroups: [
        [{ value: "workflow" }, { value: "workflow fit" }],
        [
          { value: "trust" },
          { value: "governance" },
          { value: "champions" },
          { value: "enablement" },
        ],
        [
          { value: "system around the model" },
          { value: "middle layer" },
          { value: "adoption is the product" },
          { value: "adoption is a product" },
          { value: "adoption system" },
        ],
      ],
      answerMustExclude: [
        REGEX_27M,
        REGEX_16M,
        REGEX_87_PERCENT,
        { value: "\\b1,?000\\b", type: "regex" },
        { value: "\\b800\\b", type: "regex" },
      ],
      maxSentences: 4,
    },
    judgeExpectations: [
      "Summarize the page as a workflow-first AI strategy point of view grounded in trust, enablement, and the system around the model.",
      "Do not import pilot metrics, adoption counts, or prototype validation numbers from adjacent pages.",
    ],
  },
  {
    id: "human-flourishing-proof-boundaries",
    title: "Human flourishing essay separates proof from conviction",
    summary:
      "Checks that the essay's qualified creativity signal and professional grounding stay separate from personal explorations and future-facing beliefs.",
    category: "partial",
    answerability: "partial",
    pageSlug: "the-side-of-ai-i-want-to-be-on",
    question:
      "What's grounded in experience here, and what's personal conviction?",
    deterministicChecks: {
      answerMustIncludeAnyGroups: [
        [
          { value: "majority" },
          { value: "increased creativity" },
          { value: "creativity survey" },
        ],
        [
          { value: "enterprise AI adoption" },
          { value: "agentic workflows" },
          { value: "productivity tools" },
          { value: "professional work" },
        ],
        [
          { value: "personal exploration" },
          { value: "future-facing" },
          { value: "conviction" },
          { value: "aspiration" },
        ],
      ],
      answerMustExclude: [
        REGEX_87_PERCENT,
        { value: "\\b\\d{1,3}\\s*(?:%|percent)\\b", type: "regex" },
        { value: "proves AI will" },
      ],
      maxSentences: 5,
    },
    judgeExpectations: [
      "Ground the answer in the page's enterprise AI work and the qualified statement that a majority of survey respondents reported increased creativity.",
      "Do not invent an exact survey percentage, sample size, methodology, or measured outcome for the personal explorations.",
      "Label scripture study, life-sciences discovery, human flourishing, and future-of-work statements as personal exploration, conviction, or aspiration where appropriate.",
    ],
  },
  {
    id: "product-philosophy-implied-not-proven",
    title: "Product philosophy essay separates proof from implication",
    summary:
      "Checks that the essay cites explicit operating-model artifacts and AI-assisted workflow details while being honest about missing business metrics and executive adoption limits.",
    category: "partial",
    answerability: "partial",
    pageSlug: "product-philosophy",
    question: "What's implied but not proven here?",
    deterministicChecks: {
      answerMustIncludeAnyGroups: [
        [
          { value: "product lifecycle" },
          { value: "RICE" },
          { value: "review cadence" },
          { value: "Now / Next / Later" },
          { value: "Custom GPTs" },
        ],
        [
          { value: "did not ultimately gain executive adoption" },
          { value: "doesn't prove executive adoption" },
          { value: "not proven" },
          {
            type: "regex" as const,
            value:
              "does(?: not|n't) prove .*executive adoption|did not ultimately gain executive adoption",
          },
        ],
        [
          { value: "does not provide business impact metrics" },
          { value: "doesn't provide business impact metrics" },
          { value: "doesn't provide an org chart" },
          { value: "doesn't prove org scope" },
        ],
      ],
      maxSentences: 4,
    },
    judgeExpectations: [
      "Make the explicit proof clear through the operating-model artifacts and AI-assisted workflow details on the page.",
      "Say plainly that the page does not prove business impact metrics, org scope, or executive adoption of the product-types framework.",
    ],
  },
  {
    id: "ai-career-summary",
    title: "AI Career Operating System summary stays product- and evidence-led",
    summary:
      "Checks that the page is summarized as a production-shaped product system with clear boundaries and human accountability.",
    category: "answerable",
    answerability: "answerable",
    pageSlug: "ai-career-operating-system",
    question: "Summarize this page",
    deterministicChecks: {
      answerMustIncludeAnyGroups: [
        [
          { value: "recruiter-facing proof" },
          { value: "recruiter-ready artifacts" },
          { value: "approved career evidence" },
          { value: "curated career evidence" },
          { value: "Portfolio" },
          { value: "Proof Engine" },
        ],
        [
          { value: "ResumeCustomizer" },
          { value: "Tailoring Engine" },
          { value: "role-aware resume" },
          { value: "authenticated resume engine" },
        ],
        [
          { value: "source-audited" },
          { value: "evidence retrieval" },
          { value: "evals" },
          { value: "quality criteria" },
          { value: "human review" },
        ],
      ],
      answerMustExclude: [
        { value: "enterprise-scale" },
        { value: "external adoption" },
        { value: "fully autonomous" },
      ],
      maxSentences: 5,
    },
    judgeExpectations: [
      "Describe the page as a production-shaped two-product system connecting proof, evidence retrieval, generation, evaluation, and human review.",
      "Keep Portfolio and ResumeCustomizer responsibilities distinct.",
      "Do not imply enterprise scale, external adoption, or autonomous product decisions.",
    ],
  },
  {
    id: "ai-career-ownership",
    title: "AI Career Operating System ownership stays precise",
    summary:
      "Checks that Daniel's product and quality accountability is separated from sole implementation or hand-coding claims.",
    category: "partial",
    answerability: "partial",
    pageSlug: "ai-career-operating-system",
    question: "What particularly was Daniel responsible for?",
    deterministicChecks: {
      answerMustIncludeAnyGroups: [
        [
          { value: "product direction" },
          { value: "product thesis" },
          { value: "product vision" },
          { value: "system boundaries" },
          { value: "service boundaries" },
        ],
        [
          { value: "quality" },
          { value: "acceptance criteria" },
          { value: "eval" },
          { value: "claim guardrails" },
        ],
        [
          { value: "AI development agents" },
          { value: "does not claim sole" },
          { value: "not sole" },
          { value: "hand-coding" },
          { value: "does not state who wrote the code" },
          { value: "single-handedly coded" },
          { value: "does not state that Daniel alone" },
          { value: "implementation details were shared" },
          { value: "no other ownership claims" },
          {
            value:
              "does not (?:state|specify)[^.]{0,60}(?:coded|wrote the code)",
            type: "regex",
          },
        ],
      ],
      answerMustExclude: [
        { value: "built every component alone" },
        { value: "sole engineer" },
      ],
      maxSentences: 5,
    },
    judgeExpectations: [
      "Credit Daniel with product direction, system boundaries, requirements, eval design, acceptance criteria, and quality control.",
      "State that AI development agents accelerated implementation and that the page does not prove sole hand-coding.",
    ],
  },
  {
    id: "ai-career-seniority",
    title: "AI Career Operating System seniority separates signals from scale",
    summary:
      "Checks that system-level product judgment is recognized without converting a personal operating context into enterprise scale.",
    category: "partial",
    answerability: "partial",
    pageSlug: "ai-career-operating-system",
    question: "How senior is the work shown here?",
    deterministicChecks: {
      answerMustIncludeAnyGroups: [
        [
          { value: "system boundaries" },
          { value: "architecture" },
          { value: "quality definition" },
          { value: "evaluation" },
        ],
        [
          { value: "personal operating context" },
          { value: "does not prove enterprise scale" },
          { value: "external adoption" },
          { value: "not proven" },
        ],
      ],
      answerMustExclude: [
        { value: "enterprise-scale platform" },
        { value: "director-level ownership is proven" },
      ],
      maxSentences: 5,
    },
    judgeExpectations: [
      "Identify senior product signals such as boundary design, quality definition, evaluation strategy, and explicit tradeoffs.",
      "Say plainly that this personal/internal context does not prove enterprise scale, team scope, or external adoption.",
    ],
  },
  {
    id: "ai-career-strongest-evidence",
    title: "AI Career Operating System strongest evidence remains qualified",
    summary:
      "Checks that the answer uses implemented architecture and scoped eval evidence without turning artifact counts into usage.",
    category: "answerable",
    answerability: "answerable",
    pageSlug: "ai-career-operating-system",
    question: "What are the strongest signals on this page?",
    deterministicChecks: {
      answerMustIncludeAnyGroups: [
        [
          { value: "authenticated" },
          { value: "server-to-server" },
          { value: "bearer" },
        ],
        [
          { value: "source-audited" },
          { value: "publicSafeOnly" },
          { value: "sourceAuditedOnly" },
          { value: "product thesis" },
          { value: "quality criteria" },
          { value: "evaluation behavior" },
          { value: "grounding" },
          { value: "source-separation" },
        ],
        [
          { value: "5/12" },
          { value: "11/12" },
          { value: "25" },
          { value: "33" },
          { value: "six" },
          { value: "6" },
        ],
      ],
      answerMustExclude: [
        { value: "407 resumes" },
        { value: "89.7% generation success" },
        { value: "all evals pass" },
      ],
      maxSentences: 8,
    },
    judgeExpectations: [
      "Lead with the authenticated boundary, governed evidence retrieval, specialized reviews, or qualified historical eval comparison.",
      "Do not convert repository artifacts into external usage or generation-success claims.",
    ],
  },
  {
    id: "ai-career-implied-not-proven",
    title: "AI Career Operating System states roadmap limits directly",
    summary:
      "Checks that the Guide distinguishes current architecture from durable reliability, shared identifiers, and outcome measurement.",
    category: "partial",
    answerability: "partial",
    pageSlug: "ai-career-operating-system",
    question: "What's implied but not proven here?",
    deterministicChecks: {
      answerMustIncludeAnyGroups: [
        [
          { value: "durable queue" },
          { value: "job store" },
          { value: "process-local" },
        ],
        [
          { value: "shared evidence identifiers" },
          { value: "shared page-to-evidence identifiers" },
          { value: "complete evidence graph" },
          { value: "joined recruiter funnel" },
        ],
        [
          { value: "hard gate" },
          { value: "hard reject gate" },
          { value: "explicit override" },
          { value: "rejected output" },
          { value: "advisory" },
        ],
        [
          { value: "external adoption" },
          { value: "hiring outcomes" },
          { value: "enterprise scale" },
        ],
      ],
      maxSentences: 6,
    },
    judgeExpectations: [
      "Separate implemented APIs, evidence retrieval, reviews, and structural checks from roadmap capabilities.",
      "Name missing durable queueing, shared identifiers, joined funnel measurement, or hard reject gating.",
      "Do not imply external adoption, hiring outcomes, or enterprise reliability.",
    ],
  },
  {
    id: "ai-career-direct-resume-request",
    title: "AI Career Operating System resume request uses action boundary",
    summary:
      "Checks that direct resume requests go to the generator while preserving the distinction between generated action and portfolio evidence.",
    category: "answerable",
    answerability: "answerable",
    pageSlug: "ai-career-operating-system",
    question: "Can I generate a resume for my role?",
    deterministicChecks: [
      {
        answerMustIncludeAll: [{ value: "/resume/generate" }],
        answerMustIncludeAny: [
          { value: "paste the job description" },
          { value: "paste your job description" },
          { value: "generator flow" },
        ],
        answerMustExclude: [
          { value: "generated a resume" },
          { value: "resume is ready" },
          { value: "pulls evidence from the current page" },
          { value: "portfolio pages directly feed" },
          { value: "jobDescription=", type: "regex" },
          { value: "\\?jd=", type: "regex" },
        ],
        maxSentences: 10,
      },
      {
        target: "suggestedFollowUps",
        answerMustIncludeAll: [{ value: "Generate a resume for my role" }],
      },
    ],
    judgeExpectations: [
      "Point to /resume/generate and tell the visitor to paste the job description in the flow.",
      "Treat the generator as an action rather than evidence of Daniel's fit.",
      "Do not claim generation has already occurred.",
    ],
  },
];
