import type {
  InterestTag,
  PageArtifact,
  PageContext,
} from "@/lib/portfolio-guide/types";

type GuideOverlay = Partial<
  Pick<
    PageContext,
    | "category"
    | "oneLiner"
    | "role"
    | "companyOrProject"
    | "timeframe"
    | "problem"
    | "actions"
    | "outcomes"
    | "metrics"
    | "tools"
    | "leadershipSignals"
    | "relatedProjectSlugs"
    | "tags"
    | "roleLens"
    | "domains"
    | "strengths"
    | "senioritySignals"
    | "projectType"
    | "evidenceHighlights"
    | "claimBoundaries"
    | "recruiterPrompts"
    | "crossPageLinks"
    | "authoredSections"
  >
> & {
  artifacts?: PageArtifact[];
  interestTags?: InterestTag[];
};

export const portfolioGuideMetadata: Record<string, GuideOverlay> = {
  "chatgpt-enterprise": {
    category: "Enterprise AI adoption",
    oneLiner:
      "Scaled ChatGPT Enterprise from a controlled pilot into a broader operating model for measurable, trusted adoption.",
    tools: [
      "ChatGPT Enterprise",
      "Custom GPT workflows",
      "Matched-control pilot design",
      "Enablement and champions program",
    ],
    leadershipSignals: [
      "Designed practical governance with Legal, Security, Engineering, and Operations.",
      "Built the enablement, champions, and rollout pattern that scaled beyond the initial pilot.",
    ],
    evidenceHighlights: [
      {
        label: "Measured adoption",
        detail:
          "~1,000 users with ~800 daily active users after scaling beyond the initial pilot.",
        type: "metric",
      },
      {
        label: "Credible business signal",
        detail:
          "A matched-control pilot in the contact center showed about ~$2.7M in projected annual impact.",
        type: "metric",
      },
      {
        label: "Operating model artifact",
        detail:
          "The page includes sanitized operating-model and champions-program diagrams, not just summary copy.",
        type: "artifact",
      },
    ],
    claimBoundaries: {
      directOwnership: [
        "Led the pilot framing, rollout approach, enablement system, and champions model described on the page.",
        "Defined practical governance in partnership with Legal, Security, Engineering, and Operations.",
      ],
      influence: [
        "Worked across multiple functions to make adoption safe and scalable rather than treating it as a single-team rollout.",
      ],
      conceptualExploration: [
        "The page focuses on operating-model design, guardrails, and workflow enablement more than deep implementation detail.",
      ],
      implementation: [
        "It supports workflow and rollout ownership, but it does not claim sole implementation ownership for every GPT workflow or system change.",
      ],
      explicitUnknowns: [
        "The page does not specify team size, org structure, or an exact ownership split across Product, Engineering, Operations, and Security.",
      ],
    },
    recruiterPrompts: [
      "For the role I entered, what's most relevant here?",
      "What particularly was Daniel responsible for?",
      "What are the strongest signals on this page?",
      "What should I view next for AI leadership?",
    ],
    roleLens: ["senior-product-manager", "product-leader"],
    domains: ["enterprise-ai", "contact-center"],
    strengths: [
      "ai-product",
      "leadership",
      "scale",
      "governance",
      "experimentation",
      "workflow-design",
    ],
    senioritySignals: ["senior", "group", "director", "exec"],
    projectType: "case-study",
    relatedProjectSlugs: [
      "ai-platform-mcp",
      "oms-chatgpt-app",
      "checkout-redesign",
      "ai-strategy",
    ],
    artifacts: [
      {
        label: "Enterprise AI operating model",
        type: "diagram",
        description:
          "Sanitized operating model showing how discovery, governance, pilots, and feedback loops fit together.",
      },
      {
        label: "Grassroots champions model",
        type: "diagram",
        description:
          "Sanitized adoption model showing how local workflows and peer enablement supported scale.",
      },
    ],
    crossPageLinks: [
      {
        slug: "ai-platform-mcp",
        bridge:
          "This case pairs with AI Platform MCP because that page shows the reusable systems thinking behind broader AI adoption.",
      },
      {
        slug: "jira-product-discovery",
        bridge:
          "This connects to Jira Product Discovery because both pages show operating-model design, enablement, and cross-functional adoption work.",
      },
      {
        slug: "checkout-redesign",
        bridge:
          "This connects to Checkout Redesign as another example of execution leadership translating into measurable business outcomes.",
      },
      {
        slug: "ai-strategy",
        bridge:
          "This connects to AI Strategy because the essay makes the workflow-fit, trust, and governance logic behind this rollout explicit in portfolio-thinking form.",
      },
    ],
    interestTags: ["pm-leadership", "platform", "technical-depth"],
  },
  "ai-platform-mcp": {
    category: "AI platform strategy",
    oneLiner:
      "Turned early AI validation into a broader point of view on reusable systems, workflow fit, and platform foundations.",
    tools: [
      "Agent-based workflows",
      "Retrieval across structured and unstructured data",
      "MCP-style connector patterns",
      "Workflow orchestration",
    ],
    leadershipSignals: [
      "Translated prototype learnings into reusable platform principles instead of one-off solutions.",
      "Connected emerging orchestration and connector concepts to product decisions executives could act on.",
    ],
    evidenceHighlights: [
      {
        label: "Prototype proof",
        detail:
          "The work started with a hackathon-winning AI concept built for Guitar Center customers.",
        type: "workflow",
      },
      {
        label: "Customer validation",
        detail:
          "A follow-up UX study showed 87% of participants would use it again.",
        type: "metric",
      },
      {
        label: "Reusable systems signal",
        detail:
          "The page explicitly says the work mapped recurring AI workflow patterns across pilots to shape reusable platform foundations.",
        type: "outcome",
      },
    ],
    claimBoundaries: {
      directOwnership: [
        "Led a team to design and build the original functional AI prototype described on the page.",
        "Mapped recurring AI workflow patterns and translated them into reusable platform principles.",
      ],
      influence: [
        "Connected prototype learnings to broader product and platform direction leaders could act on.",
      ],
      conceptualExploration: [
        "The page moves from concrete prototype evidence into a conceptual point of view on orchestration, connectors, retrieval, and workflow fit.",
      ],
      implementation: [
        "It supports prototype-building and platform framing, but it does not describe end-to-end production implementation ownership.",
      ],
      explicitUnknowns: [
        "The page does not define team size, org structure, production rollout scale, or which reusable pattern shipped most.",
      ],
    },
    recruiterPrompts: [
      "How senior is this work?",
      "What particularly was Daniel responsible for?",
      "What's implied but not proven here?",
      "How does this connect to the rest of the portfolio?",
    ],
    roleLens: ["builder-pm", "senior-product-manager"],
    domains: ["platform", "enterprise-ai"],
    strengths: [
      "ai-product",
      "platform",
      "0-to-1",
      "technical-depth",
      "workflow-design",
    ],
    senioritySignals: ["senior"],
    projectType: "case-study",
    relatedProjectSlugs: [
      "chatgpt-enterprise",
      "oms-chatgpt-app",
      "immunology-scout",
      "ai-strategy",
    ],
    artifacts: [
      {
        label: "Hackathon-winning prototype",
        type: "prototype",
        description:
          "The original concept that created the customer signal behind the platform story.",
      },
      {
        label: "UX validation results",
        type: "diagram",
        description:
          "Follow-up validation showing strong would-use-again signal and positive sentiment.",
      },
    ],
    crossPageLinks: [
      {
        slug: "chatgpt-enterprise",
        bridge:
          "This case pairs with ChatGPT Enterprise because it shows the platform and workflow thinking that later supports broader AI operating-model work.",
      },
      {
        slug: "oms-chatgpt-app",
        bridge:
          "This connects to OMS ChatGPT App because both pages show PM-led AI prototyping, but this page is the more strategy-and-systems-heavy version.",
      },
      {
        slug: "immunology-scout",
        bridge:
          "This connects to Immunology Scout because both pages emphasize trustworthy AI workflows, retrieval, and traceable evidence instead of generic chat UX.",
      },
      {
        slug: "ai-strategy",
        bridge:
          "This connects to AI Strategy because the essay distills the workflow-first and middle-layer thinking this case helped shape.",
      },
    ],
    interestTags: ["ai-builder", "platform", "0-to-1", "technical-depth"],
  },
  "checkout-redesign": {
    category: "Commerce execution",
    oneLiner:
      "Improved a high-stakes checkout flow by raising decision quality during execution, not just redesigning the interface.",
    tools: [
      "A/B testing",
      "Usability testing",
      "Context-rich Jira implementation tickets",
    ],
    leadershipSignals: [
      "Kept UX and engineering tightly engaged during the build so feasibility tradeoffs stayed intentional.",
      "Improved implementation quality by giving developers enough context to make stronger in-flight decisions.",
    ],
    evidenceHighlights: [
      {
        label: "Business impact",
        detail: "The page cites about ~$16M in estimated annualized revenue impact.",
        type: "metric",
      },
      {
        label: "Execution speed",
        detail:
          "It also cites a 30% faster checkout flow, about ~3% conversion lift, and a 12-week delivery timeline.",
        type: "metric",
      },
      {
        label: "Implementation artifact",
        detail:
          "The page includes a context-rich Jira ticket showing user need, expected behavior, and business rationale in one place.",
        type: "artifact",
      },
    ],
    claimBoundaries: {
      directOwnership: [
        "Helped drive the effort across product, UX, and engineering from problem definition through rollout.",
        "Improved decision quality during execution by creating stronger context for implementation and QA.",
      ],
      influence: [
        "Kept UX actively involved during development so feasibility issues became live product and design decisions rather than isolated engineering compromises.",
      ],
      conceptualExploration: [
        "This page is not primarily a conceptual strategy piece; it is a delivery and execution case grounded in a shipped flow.",
      ],
      implementation: [
        "The page supports execution leadership and implementation guidance, but it does not claim sole design authorship or sole engineering ownership.",
      ],
      explicitUnknowns: [
        "It does not provide a formal ownership matrix, team size, or a function-by-function implementation split.",
      ],
    },
    recruiterPrompts: [
      "What particularly was Daniel responsible for?",
      "What are the strongest signals on this page?",
      "What's implied but not proven here?",
      "What should I view next for execution leadership?",
    ],
    roleLens: ["senior-product-manager"],
    domains: ["commerce"],
    strengths: ["commerce", "experimentation", "ux", "leadership"],
    senioritySignals: ["pm", "senior"],
    projectType: "case-study",
    relatedProjectSlugs: [
      "chatgpt-enterprise",
      "jira-product-discovery",
      "product-philosophy",
    ],
    artifacts: [
      {
        label: "Before and after checkout flow",
        type: "image",
        description:
          "Public screenshots showing how the redesigned flow became easier to scan and complete.",
      },
      {
        label: "Context-rich implementation ticket",
        type: "diagram",
        description:
          "Representative Jira story showing user need, expected behavior, and business rationale in one place.",
      },
    ],
    crossPageLinks: [
      {
        slug: "jira-product-discovery",
        bridge:
          "This case pairs with Jira Product Discovery because both pages show Daniel improving operating quality through clearer decision frameworks and shared execution context.",
      },
      {
        slug: "chatgpt-enterprise",
        bridge:
          "This connects to ChatGPT Enterprise as another example of cross-functional rollout leadership tied to measurable outcomes.",
      },
      {
        slug: "product-philosophy",
        bridge:
          "This connects to Product Philosophy because the essay makes the decision-quality and operating-model logic behind this execution style explicit.",
      },
    ],
    interestTags: ["pm-leadership"],
  },
  launchmuse: {
    category: "AI-native product",
    oneLiner:
      "A focused AI-native release-planning MVP that turns a launch date into a structured campaign plan.",
    role: "PM-led builder",
    tools: [
      "AI-assisted coding",
      "Prompt-driven workflow design",
      "Structured campaign planning",
    ],
    outcomes: [
      "A working live alpha is available for real-world exploration.",
      "The MVP was built quickly to validate workflow value before broader expansion.",
    ],
    leadershipSignals: [
      "Cut scope aggressively to focus on one painful job before expanding the product surface.",
      "Used product framing and fast prototyping to turn an idea into a public workflow quickly.",
    ],
    evidenceHighlights: [
      {
        label: "Live product signal",
        detail:
          "The page makes a working alpha available rather than describing the product only conceptually.",
        type: "artifact",
      },
      {
        label: "Scope discipline",
        detail:
          "It explicitly frames the MVP as a narrow release-planning workflow built to validate value before expanding the surface area.",
        type: "workflow",
      },
    ],
    claimBoundaries: {
      directOwnership: [
        "The page supports PM-led builder ownership of the MVP scope, workflow design, and prototype direction.",
      ],
      influence: [
        "It shows product framing and prototyping choices more than organizational influence across a large team.",
      ],
      conceptualExploration: [
        "This is a concrete 0-to-1 product experiment, not a mature scaled business case.",
      ],
      implementation: [
        "The page supports rapid prototyping and product-building, but it does not break down exact engineering implementation ownership.",
      ],
      explicitUnknowns: [
        "It does not claim production scale, team size, or mature growth metrics.",
      ],
    },
    recruiterPrompts: [
      "What are the strongest signals on this page?",
      "How senior is this work?",
      "What's implied but not proven here?",
    ],
    roleLens: ["builder-pm"],
    domains: ["ai-product"],
    strengths: ["0-to-1", "ai-product", "workflow-design"],
    senioritySignals: ["pm", "senior"],
    projectType: "product",
    relatedProjectSlugs: ["oms-chatgpt-app", "ai-platform-mcp", "immunology-scout"],
    artifacts: [
      {
        label: "LaunchMuse campaign wizard",
        type: "prototype",
        description:
          "The live workflow that moves from release context into a generated six-week campaign plan.",
      },
    ],
    crossPageLinks: [
      {
        slug: "oms-chatgpt-app",
        bridge:
          "This case pairs with OMS ChatGPT App because both pages show PM-led prototyping, but LaunchMuse is the tighter consumer-facing productization example.",
      },
      {
        slug: "ai-platform-mcp",
        bridge:
          "This connects to AI Platform MCP because both pages show workflow-based AI product thinking from different altitudes: one product-first, one systems-first.",
      },
    ],
    interestTags: ["ai-builder", "0-to-1"],
  },
  "immunology-scout": {
    category: "AI + science",
    oneLiner:
      "An early-stage AI workflow concept focused on literature scouting, evidence clustering, and hypothesis support in immunology research.",
    tools: [
      "Research workflow design",
      "Evidence clustering",
      "Citation-oriented product framing",
    ],
    outcomes: [
      "The concept is intentionally early and described with restraint rather than inflated claims.",
      "The strongest signal on the page is product framing around traceability, trust, and next-step clarity.",
    ],
    leadershipSignals: [
      "Framed the opportunity as a trustworthy workflow product rather than a generic answer engine.",
      "Kept the public narrative modest while making the scientific use case concrete enough to discuss.",
    ],
    evidenceHighlights: [
      {
        label: "Traceability focus",
        detail:
          "The page emphasizes literature scouting, evidence clustering, and citation-oriented product framing.",
        type: "workflow",
      },
      {
        label: "Intentional restraint",
        detail:
          "It explicitly describes the concept as early and avoids inflated claims about traction or scale.",
        type: "outcome",
      },
    ],
    claimBoundaries: {
      directOwnership: [
        "The page supports product framing ownership around trustworthy scientific evidence workflows.",
      ],
      influence: [
        "It shows how Daniel frames an AI research workflow opportunity, not a large cross-functional rollout.",
      ],
      conceptualExploration: [
        "This page is intentionally early-stage concept work with concrete workflow thinking but limited market proof.",
      ],
      implementation: [
        "It does not claim a full production implementation or large-scale deployment.",
      ],
      explicitUnknowns: [
        "The page does not provide adoption metrics, team size, or proof that the concept became a shipped product.",
      ],
    },
    recruiterPrompts: [
      "What are the strongest signals on this page?",
      "What's implied but not proven here?",
      "How does this connect to other AI workflow work here?",
    ],
    roleLens: ["builder-pm"],
    domains: ["healthtech", "research"],
    strengths: ["healthtech", "technical-depth", "0-to-1", "ai-product"],
    senioritySignals: ["pm", "senior"],
    projectType: "product",
    relatedProjectSlugs: ["ai-platform-mcp", "oms-chatgpt-app", "launchmuse"],
    artifacts: [
      {
        label: "Immunology Scout retrieval workflow",
        type: "prototype",
        description:
          "A workbench-style concept visual showing retrieval, synthesis, and scoped query inputs.",
      },
    ],
    crossPageLinks: [
      {
        slug: "ai-platform-mcp",
        bridge:
          "This case pairs with AI Platform MCP because both pages emphasize trustworthy AI workflows, retrieval, and evidence-backed reasoning.",
      },
      {
        slug: "oms-chatgpt-app",
        bridge:
          "This connects to OMS ChatGPT App because both pages show exploratory AI building, but this one is the more domain-specific and evidence-oriented example.",
      },
    ],
    interestTags: ["healthtech", "technical-depth", "0-to-1"],
  },
  "oms-chatgpt-app": {
    category: "Enterprise AI workflow",
    oneLiner:
      "A conversational AI interface for Order Management workflows, designed to make common support and operations tasks faster, clearer, and safer to execute.",
    role: "PM-led builder",
    tools: [
      "Conversational workflow design",
      "Guardrail-oriented interaction design",
      "Mock-data prototyping",
      "Internal system orchestration patterns",
    ],
    outcomes: [
      "The page shows a focused prototype artifact instead of a vague AI concept statement.",
      "It connects hands-on prototype work to follow-on system design around SSO, PII-safe interactions, MCP support, and production architecture exploration.",
    ],
    leadershipSignals: [
      "Uses a working prototype to make an enterprise workflow concept tangible and easier to align around.",
      "Frames trust, user control, and safe execution as product requirements rather than implementation details.",
    ],
    evidenceHighlights: [
      {
        label: "Workflow artifact",
        detail:
          "The page centers a conversational OMS prototype focused on order lookup and guarded cancellation workflows.",
        type: "artifact",
      },
      {
        label: "Trust design",
        detail:
          "It explicitly emphasizes confirmation, visible reasoning, simulated data, and user control.",
        type: "workflow",
      },
      {
        label: "Production bridge",
        detail:
          "The page cites follow-on work around SSO, PII-safe interaction patterns, an internal MCP server, and production-oriented architecture exploration.",
        type: "outcome",
      },
    ],
    claimBoundaries: {
      directOwnership: [
        "The page supports PM-led ownership of the prototype framing, workflow design, and the follow-on system-direction exploration it created.",
      ],
      influence: [
        "It shows how a focused prototype created alignment and shaped production viability discussions.",
      ],
      conceptualExploration: [
        "This is a concrete product artifact, but it remains a prototype focused on validating interaction patterns rather than proving scaled deployment.",
      ],
      implementation: [
        "The page supports hands-on build credibility and architectural exploration, but it does not claim a full production launch or end-to-end implementation ownership.",
      ],
      explicitUnknowns: [
        "It does not provide production usage metrics, org scope, or a detailed ownership split across engineering and platform teams.",
      ],
    },
    recruiterPrompts: [
      "What are the strongest signals on this page?",
      "What particularly was Daniel responsible for?",
      "What's implied but not proven here?",
      "What should I view next for enterprise AI workflow work?",
    ],
    roleLens: ["builder-pm"],
    domains: ["enterprise-ai"],
    strengths: ["0-to-1", "workflow-design", "ai-product"],
    senioritySignals: ["pm", "senior"],
    projectType: "product",
    relatedProjectSlugs: ["ai-platform-mcp", "chatgpt-enterprise", "launchmuse"],
    artifacts: [
      {
        label: "OMS workflow prototype",
        type: "prototype",
        description:
          "A conversational order-management prototype showing order lookup, cancellation guardrails, and explicit user control.",
      },
    ],
    crossPageLinks: [
      {
        slug: "ai-platform-mcp",
        bridge:
          "This case pairs with AI Platform MCP because both pages show hands-on AI experimentation maturing into systems thinking, with the platform page carrying the broader strategic arc.",
      },
      {
        slug: "chatgpt-enterprise",
        bridge:
          "This connects to ChatGPT Enterprise because both pages focus on safe AI adoption inside real workflows, but this one makes the product artifact more concrete.",
      },
      {
        slug: "launchmuse",
        bridge:
          "This connects to LaunchMuse as another PM-led build, but OMS ChatGPT App is the more enterprise workflow-oriented example.",
      },
    ],
    interestTags: ["ai-builder", "technical-depth", "0-to-1"],
  },
  "jira-product-discovery": {
    category: "Product ops and enablement",
    oneLiner:
      "Used Jira Product Discovery to turn quarterly wishlist planning into a shared, transparent operating rhythm.",
    role: "Product operations and enablement lead",
    companyOrProject: "The Guitar Center Company",
    problem:
      "Quarterly planning reset too often, lacked shared prioritization criteria, and created weak visibility across product, business, and technology.",
    actions: [
      "Established a unified Jira Product Discovery workspace connected to delivery work.",
      "Standardized prioritization with a RICE model so initiatives could be compared on common criteria.",
      "Built dashboards for themes, impact-versus-effort views, dependencies, and ownership.",
      "Created an 8-week onboarding and enablement program for PMs and cross-functional partners.",
      "Led live training, coaching, and working sessions so JPD became part of how teams planned together.",
    ],
    outcomes: [
      "Shifted the organization from quarterly rebuilds to rolling prioritization.",
      "Achieved full adoption across all nine product managers in the core product organization.",
      "Improved visibility into initiatives, dependencies, and progress against OKRs.",
      "Reduced time-to-align on quarterly roadmaps and made approvals faster and more confident.",
    ],
    metrics: [
      "Core PM adoption: 9 PMs",
      "Onboarding program: 8 weeks",
    ],
    tools: [
      "Jira Product Discovery",
      "RICE scoring",
      "Cross-team dashboards",
      "Onboarding curriculum",
    ],
    leadershipSignals: [
      "Defined how the tool should support the operating model instead of treating rollout as a simple tool migration.",
      "Combined rollout, training, and coaching so product, business, and technology partners used the same prioritization language.",
    ],
    evidenceHighlights: [
      {
        label: "Adoption signal",
        detail:
          "The page cites full adoption across all nine PMs in the core product organization.",
        type: "metric",
      },
      {
        label: "Enablement depth",
        detail: "It also cites an 8-week onboarding and enablement program.",
        type: "metric",
      },
      {
        label: "Operational proof",
        detail:
          "Artifacts and outcomes focus on rolling prioritization, OKR visibility, dependencies, and faster roadmap approvals.",
        type: "artifact",
      },
    ],
    claimBoundaries: {
      directOwnership: [
        "Led the JPD rollout, operating-model setup, dashboards, and onboarding program described on the page.",
      ],
      influence: [
        "Worked across PMs and cross-functional partners so the shared prioritization model became part of how teams planned together.",
      ],
      conceptualExploration: [
        "The work is concrete operational enablement, not just a tooling opinion piece.",
      ],
      implementation: [
        "It supports operating-model and enablement ownership, but it does not imply sole ownership of every roadmap decision or team process change.",
      ],
      explicitUnknowns: [
        "The page does not provide a detailed org chart or exact ownership split across Product, Technology, and Business stakeholders.",
      ],
    },
    recruiterPrompts: [
      "What are the strongest signals on this page?",
      "What particularly was Daniel responsible for?",
      "What should I view next for product leadership?",
    ],
    roleLens: ["product-leader"],
    domains: ["operations"],
    strengths: ["leadership", "enablement", "governance", "scale"],
    senioritySignals: ["group", "director", "exec"],
    projectType: "enablement",
    relatedProjectSlugs: [
      "chatgpt-enterprise",
      "checkout-redesign",
      "product-philosophy",
    ],
    artifacts: [
      {
        label: "JPD workspace overview",
        type: "diagram",
        description:
          "A shared planning workspace showing ideas, prioritization, and delivery context in one place.",
      },
      {
        label: "8-week onboarding curriculum",
        type: "case-study",
        description:
          "The enablement program used to teach PMs and cross-functional partners how to work inside the new planning system.",
      },
    ],
    crossPageLinks: [
      {
        slug: "chatgpt-enterprise",
        bridge:
          "This case pairs with ChatGPT Enterprise because both pages show Daniel designing operating rhythms, enablement, and cross-functional adoption systems.",
      },
      {
        slug: "checkout-redesign",
        bridge:
          "This connects to Checkout Redesign because both pages focus on improving decision quality, one through planning systems and one through execution systems.",
      },
      {
        slug: "product-philosophy",
        bridge:
          "This connects to Product Philosophy because the essay turns this operating-model and prioritization work into a broader leadership point of view.",
      },
    ],
    tags: ["Product Operations", "Strategic Alignment", "Jira Product Discovery"],
    interestTags: ["pm-leadership"],
  },
  "ai-strategy": {
    category: "AI strategy and workflow judgment",
    oneLiner:
      "A grounded AI strategy essay arguing that workflow fit, trust, enablement, and the system around the model matter more than model theater.",
    role: "AI product leadership point of view",
    companyOrProject: "Enterprise AI strategy essay",
    timeframe: "4 min read",
    problem:
      "Many AI strategies start with model comparisons before teams understand the workflow, trust requirements, governance boundaries, or operating layer that make adoption durable.",
    actions: [
      "Start with the business outcome and the actual workflow before debating the model.",
      "Treat champions, prompting patterns, examples, feedback loops, and training as part of the product.",
      "Design governance, permissions, context handling, and review paths into the workflow instead of layering them on later.",
    ],
    outcomes: [
      "Makes workflow fit, trust, governance, and the middle layer the center of the AI strategy argument.",
      "Connects the point of view back to concrete contact-center jobs such as pre-call preparation, drafting, and other context-heavy tasks.",
      "Frames adoption and enablement as product design work rather than launch support.",
    ],
    tools: [
      "Workflow mapping",
      "AI enablement and champions",
      "Governance design",
      "Middle-layer systems thinking",
    ],
    leadershipSignals: [
      "Uses real rollout experience to generalize into a practical product strategy point of view rather than an abstract AI hot take.",
      "Frames adoption systems, trust, and governance as product leadership responsibilities.",
    ],
    evidenceHighlights: [
      {
        label: "Workflow-first argument",
        detail:
          "The essay explicitly says enterprise AI succeeds or fails based on workflow fit, trust, and the operating layer around the model.",
        type: "workflow",
      },
      {
        label: "Grounded enterprise example",
        detail:
          "It ties the argument back to leading early ChatGPT rollout work in the contact center, including pre-call preparation and drafting workflows.",
        type: "outcome",
      },
      {
        label: "Adoption system signal",
        detail:
          "The page treats champions, training, prompting patterns, and feedback loops as part of the product rather than after-the-fact support.",
        type: "ownership",
      },
    ],
    claimBoundaries: {
      directOwnership: [
        "The page explicitly says Daniel helped lead early ChatGPT rollout work in the contact center and treated enablement as part of the product.",
      ],
      influence: [
        "Uses that experience to shape a broader point of view on how enterprise AI adoption should be designed.",
      ],
      conceptualExploration: [
        "This is primarily a point-of-view essay translating rollout experience into workflow, governance, and product principles.",
      ],
      implementation: [
        "The page discusses the middle layer, tooling, integrations, permissions, and review paths conceptually rather than documenting a specific implementation stack.",
      ],
      explicitUnknowns: [
        "This page does not quantify rollout scale, define exact ownership splits, or describe a single production architecture in detail.",
      ],
    },
    recruiterPrompts: [
      "What does this essay prove about Daniel's AI judgment?",
      "For the role I entered, what's most relevant here?",
      "What's explicit here versus broader portfolio context?",
      "What should I view next for concrete AI proof?",
    ],
    roleLens: ["senior-product-manager", "product-leader"],
    domains: ["enterprise-ai", "platform"],
    strengths: ["ai-product", "workflow-design", "governance", "leadership"],
    senioritySignals: ["senior", "group", "director"],
    projectType: "essay",
    relatedProjectSlugs: ["chatgpt-enterprise", "ai-platform-mcp"],
    crossPageLinks: [
      {
        slug: "chatgpt-enterprise",
        bridge:
          "This essay pairs with ChatGPT Enterprise because that case provides the concrete pilot, rollout, and operating-model proof behind the workflow-first argument.",
      },
      {
        slug: "ai-platform-mcp",
        bridge:
          "This connects to AI Platform MCP because that case shows how the same workflow-first thinking extended into reusable systems and platform foundations.",
      },
    ],
    interestTags: ["pm-leadership", "platform"],
  },
  "product-philosophy": {
    category: "Product leadership and operating model",
    oneLiner:
      "An essay-backed product leadership point of view grounded in operating-model artifacts, decision frameworks, and explicit limits on what actually gained adoption.",
    role: "Product leadership and operating model design",
    companyOrProject: "Operating-model essay with artifact evidence",
    timeframe: "7 min read",
    problem:
      "Without a shared operating model, prioritization becomes subjective, planning disconnects from execution, and product quality depends too heavily on individual PM skill.",
    actions: [
      "Standardized lifecycle, prioritization, review cadence, sprint rhythm, and roadmap language across the team.",
      "Embedded AI-assisted workflows for idea generation, opportunity framing, ROI estimation, and PRD creation.",
      "Introduced a product-types framework to clarify different metrics, time horizons, and dependencies across kinds of product work.",
    ],
    outcomes: [
      "Made the operating model visible so prioritization, planning, and review could be improved intentionally.",
      "Gave teams a shared language for comparing work, aligning across functions, and connecting delivery to impact.",
      "The product-types framework resonated with product teams, but the page explicitly says it did not ultimately gain executive adoption.",
    ],
    tools: [
      "Product lifecycle design",
      "RICE scoring",
      "Review cadence design",
      "AI-assisted planning workflows",
      "Now / Next / Later roadmapping",
    ],
    leadershipSignals: [
      "Turns product leadership into decision-system design instead of generic roadmap judgment.",
      "Supports the point of view with artifacts that show lifecycle, prioritization, review cadence, sprinting, and roadmap language.",
    ],
    evidenceHighlights: [
      {
        label: "Operating-model artifacts",
        detail:
          "The page includes a product lifecycle, RICE worksheet, review cadence, sprint planning flow, roadmap language, and product-types visuals.",
        type: "artifact",
      },
      {
        label: "AI-assisted workflow detail",
        detail:
          "It explicitly says Custom GPTs supported idea generation, opportunity framing, ROI estimation, and PRD creation.",
        type: "workflow",
      },
      {
        label: "Clear limit on adoption",
        detail:
          "The page says the product-types framework resonated with product teams but did not ultimately gain executive adoption.",
        type: "outcome",
      },
    ],
    claimBoundaries: {
      directOwnership: [
        "The page supports direct ownership of the operating-model design, including lifecycle, prioritization, review cadence, sprint rhythm, roadmap language, and AI-assisted planning workflows.",
      ],
      influence: [
        "It also supports cross-functional influence through shared language for prioritization, alignment, and impact.",
      ],
      conceptualExploration: [
        "This is an editorial case for product leadership as systems design, backed by artifacts rather than a narrow feature-delivery story.",
      ],
      implementation: [
        "The page shows frameworks, cadences, and AI-assisted workflows, but it does not claim org-wide adoption of every artifact or a permanent executive mandate.",
      ],
      explicitUnknowns: [
        "The page does not provide business impact metrics, an org chart, or proof that the product-types framework achieved executive adoption.",
      ],
    },
    recruiterPrompts: [
      "What does this page prove about Daniel's product leadership?",
      "How senior is the signal on this page?",
      "What's implied but not proven here?",
      "What should I view next for concrete operating-model proof?",
    ],
    roleLens: ["product-leader", "senior-product-manager"],
    domains: ["operations", "platform"],
    strengths: ["leadership", "enablement", "governance", "scale"],
    senioritySignals: ["senior", "group", "director"],
    projectType: "essay",
    relatedProjectSlugs: [
      "jira-product-discovery",
      "checkout-redesign",
      "chatgpt-enterprise",
    ],
    artifacts: [
      {
        label: "Product lifecycle diagram",
        type: "diagram",
        description:
          "Shows how work moved from early signals through delivery and impact measurement.",
      },
      {
        label: "RICE scoring worksheet",
        type: "diagram",
        description:
          "Makes prioritization criteria comparable across teams and opportunities.",
      },
      {
        label: "Product review cadence",
        type: "diagram",
        description:
          "Connects strategy, execution, and impact in a repeatable review structure.",
      },
      {
        label: "Sprint planning flow",
        type: "diagram",
        description:
          "Shows how team-level execution rhythm aligned with the broader operating model.",
      },
      {
        label: "Now / Next / Later roadmap language",
        type: "diagram",
        description:
          "Makes certainty, sequencing, and tradeoffs legible across time horizons.",
      },
      {
        label: "Product types framework",
        type: "diagram",
        description:
          "Clarifies that consumer, platform, data, AI, and operational work need different evaluation lenses.",
      },
    ],
    crossPageLinks: [
      {
        slug: "jira-product-discovery",
        bridge:
          "This essay pairs with Jira Product Discovery because that page shows the operating-model, prioritization, and onboarding work in a concrete organizational rollout.",
      },
      {
        slug: "checkout-redesign",
        bridge:
          "This connects to Checkout Redesign because that case shows how stronger decision systems improved execution quality in a shipped customer flow.",
      },
      {
        slug: "chatgpt-enterprise",
        bridge:
          "This connects to ChatGPT Enterprise because both pages show Daniel building operating rhythms and adoption systems, one through essay-backed principles and one through measured rollout proof.",
      },
    ],
    interestTags: ["pm-leadership", "platform"],
    authoredSections: [
      {
        label: "Page summary",
        snippets: [
          "Product leadership is not primarily about roadmap judgment.",
          "It is about designing how decisions get made, how tradeoffs are evaluated, and how work connects to outcomes.",
          "The essay is positioned as evidence-backed thinking rather than generic philosophy.",
        ],
      },
      {
        label: "When the system is missing",
        snippets: [
          "Without a shared operating model, prioritization becomes subjective, planning disconnects from execution reality, and product quality depends too much on individual PM skill.",
          "These are not just execution issues; the page explicitly frames them as product problems.",
        ],
      },
      {
        label: "Operating model stance",
        snippets: [
          "The team's operating model is part of the product outcome.",
          "Strong product teams build systems that make good decisions repeatable.",
        ],
      },
      {
        label: "Lifecycle and prioritization",
        snippets: [
          "The page describes a consistent lifecycle from early signals and problem definition through discovery, delivery, and impact measurement.",
          "It also says prioritization was standardized with RICE plus napkin-math estimates grounded in available data.",
        ],
      },
      {
        label: "Review and execution rhythm",
        snippets: [
          "A consistent product review cadence connected strategy, execution, and outcomes.",
          "Clear work-in-progress constraints and sprint structure helped teams focus on delivering outcomes rather than managing backlog volume.",
          "Roadmap communication was standardized through a Now / Next / Later framework.",
        ],
      },
      {
        label: "AI-assisted workflows",
        snippets: [
          "The page explicitly says AI-assisted workflows were embedded across the lifecycle to reduce friction and improve consistency.",
          "Custom GPTs supported idea generation, opportunity framing, ROI estimation, and PRD creation.",
          "This let teams spend less time formatting work and more time evaluating and executing it.",
        ],
      },
      {
        label: "Product types limit",
        snippets: [
          "The page says platform, data, and operational products were being evaluated as if they were consumer product work.",
          "A framework was introduced to clarify different product types, metrics, time horizons, and dependencies.",
          "It also explicitly says the framework resonated with product teams but did not ultimately gain executive adoption.",
        ],
      },
      {
        label: "What changed",
        snippets: [
          "Teams were able to prioritize work on a shared, comparable scale, align more effectively across product, engineering, and stakeholders, and connect delivery to measurable impact.",
          "The closing claim is that the operating model became visible enough to improve intentionally rather than emerging by accident.",
        ],
      },
    ],
  },
};
