import type { PortfolioGuideEvalCase } from "@/lib/portfolio-guide/evals/types";

const REGEX_87_PERCENT = {
  type: "regex" as const,
  value: "\\b87\\s*(%|percent)\\b|would(?:[- ]use){1,2}(?:[- ]it)?[- ]again|would[- ]use[- ]again",
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
      answerMustIncludeAnyGroups: [
        [
          { value: "agent-based workflows" },
          { value: "retrieval" },
          { value: "connector" },
          { value: "prompt consistency" },
          { value: "workflow patterns" },
        ],
        [
          { value: "doesn't say which was reused most" },
          { value: "doesn't quantify which pattern" },
          { value: "doesn't rank them" },
          { value: "not explicit which was reused most" },
          {
            type: "regex" as const,
            value:
              "does(?: not|n't) (?:provide|rank|specify|say|state|quantify).*(?:reused the most|reused most|most use|used most frequently)|no detail on which pattern saw the most use|explicit ranking or metrics indicating which",
          },
        ],
      ],
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
      answerMustIncludeAnyGroups: [
        [
          { value: "doesn't say which was reused most" },
          { value: "doesn't rank them" },
          { value: "not explicit which was reused most" },
          {
            type: "regex" as const,
            value:
              "does(?: not|n't) (?:provide|rank|specify|say|state|quantify).*(?:reused the most|reused most|most use|used most frequently)|no detail on which pattern saw the most use|does(?: not|n't) rank or specify which",
          },
        ],
      ],
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
        answerMustIncludeAny: [
        { value: "doesn't mention mcp" },
        { value: "does not mention mcp" },
        { value: "i don't see mcp" },
        { value: "no, not on this page" },
        {
          type: "regex" as const,
          value:
            "does(?: not|n't) explicitly mention (?:the term )?mcp|no,? the current page does(?: not|n't) .*mcp",
        },
      ],
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
      answerMustIncludeAnyGroups: [
        [REGEX_16M, { value: "30% faster" }, { value: "~3% conversion" }],
        [
          { value: "12-week" },
          { value: "jira ticket" },
          { value: "a/b testing" },
          { value: "minimal service disruption" },
        ],
      ],
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
          reason: "Good supporting evidence for AI builder work inside enterprise workflows.",
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
        [
          { value: "workflow" },
          { value: "workflow fit" },
        ],
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
];
