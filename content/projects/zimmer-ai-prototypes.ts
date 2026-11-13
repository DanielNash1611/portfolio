import type { WorkEntry } from "@/content/portfolio";
import type { PageContext } from "@/lib/portfolio-guide/types";

export const zimmerAiPrototypes: WorkEntry = {
  slug: "zimmer-ai-prototypes",
  href: "/work/zimmer-ai-prototypes",
  title: "From discovery to credible AI prototypes",
  eyebrow: "Zimmer Biomet · Ongoing AI product work",
  summary:
    "I built three credible AI prototypes at Zimmer Biomet, each within about a week of joining its project after initial discovery. The work connects a complex enterprise workflow, stakeholder agreement, and close collaboration with engineering to continuing product development.",
  description:
    "Rapid prototypes, focused discovery, and shared architecture work at Zimmer Biomet. Ongoing development, with qualified measurements from individual tasks.",
  role: "AI Catalyst & Product Manager",
  company: "Zimmer Biomet",
  timeframe: "2026–Present · Prototypes and ongoing development",
  heroImage: "/images/zimmer-ai-prototypes/discovery-loop.svg",
  heroImageAlt:
    "Illustrative discovery loop connecting workflow mapping, a mock-data prototype, two initial use cases, and engineering collaboration. Not a product screenshot.",
  tags: ["AI Product Management", "Product Discovery", "Rapid Prototyping"],
  featuredMetrics: [
    {
      label: "Prototype pace",
      value: "3 credible prototypes",
      detail: "Each within about a week of joining its project, after initial discovery.",
    },
    {
      label: "Initial scope",
      value: "2 agreed use cases",
      detail: "Stakeholder-defined scope for the complex enterprise workflow example.",
    },
    {
      label: "Current boundary",
      value: "Ongoing development",
      detail: "Prototype evidence and task measurements, without a production-launch claim.",
    },
  ],
  context: [
    "At Zimmer Biomet, I have been turning early discovery into working prototypes that make product direction concrete. Across three projects, credible prototypes appeared within about a week of my joining each project.",
    "In one complex enterprise workflow, I began mapping the work while building a first-week prototype with mock data. Discovery continued as stakeholders reacted to the experience.",
  ],
  problem: [
    "The complex enterprise workflow was still being mapped. Rather than treating a complete map as a prerequisite, I used a prototype to make the intended experience discussable while continuing discovery.",
  ],
  strategicInsight: [
    "A prototype can be part of discovery. In this case, it made the longer-term vision concrete while we narrowed the initial scope to two use cases defined by stakeholders.",
  ],
  optionsAndTradeoffs: [
    {
      option: "Complete the workflow map before prototyping",
      tradeoff: "That would defer the concrete experience stakeholders could react to while discovery continued.",
    },
    {
      option: "Map and prototype together, focused on two initial use cases",
      tradeoff: "This made the experience visible early while leaving the broader workflow map in progress.",
      selected: true,
    },
  ],
  execution: [
    {
      title: "Make the direction concrete",
      body: "I built a first-week mock-data prototype as discovery began. Stakeholder feedback helped establish a shared view of the intended experience.",
    },
    {
      title: "Agree on the initial scope",
      body: "I aligned stakeholders on two initial use cases in their terms, focused workflow mapping on that scope, and identified an interaction suited to AI. We built incrementally while discovery continued.",
    },
    {
      title: "Develop with engineering",
      body: "I supplied the initial prototype and product vision and collaborated with engineering on the AI architecture. Engineers also developed UI, data definitions, and prompts. I contributed AI-generated feature code, evals, and PRD context in repository documentation.",
    },
  ],
  impact: [],
  resultsDescription:
    "Single-task measurements, a future projection, and ongoing product development.",
  results: [
    "Rebate formula: I used AI to build a complex Excel formula with about three hours of effort. About 70% time saved was measured on a single task; it is not an average or a sustained workflow saving.",
    "Reconciliation: the app's initial matching step took about two minutes versus at least an hour on a single task. That measures initial matching, not the entire reconciliation, and was observed about three weeks after kickoff.",
    "Future projection: the accrual app is projected to reduce time by 95% when complete. This is not an achieved result.",
    "The three prototypes informed continuing product development. Workflow mapping and implementation remain in progress; these observations do not establish production launch or sustained business impact.",
  ],
  reflectionDescription:
    "What the ongoing discovery and prototyping work is teaching me.",
  reflection: [
    "Making an experience tangible early can help stakeholders define a useful starting scope before every part of a workflow has been mapped.",
    "Product direction and engineering contributions reinforce each other. My prototype and initial architecture helped establish direction, while engineers expanded the implementation and shaped the experience.",
  ],
  artifactSectionTitle: "Discovery approach",
  artifactSectionDescription:
    "An illustrative process diagram, not a product screenshot or implementation diagram.",
  visuals: [
    {
      title: "Discovery and prototyping together",
      description:
        "A public-safe illustration of workflow mapping, a mock-data prototype, stakeholder scope, and engineering collaboration. The underlying work remains in progress.",
      image: "/images/zimmer-ai-prototypes/discovery-loop.svg",
      alt: "Workflow mapping and mock-data prototyping inform two initial use cases and engineering collaboration, with discovery continuing throughout.",
      imageFit: "contain",
      expandable: true,
    },
  ],
  testimonialIds: [],
  ctaTitle: "Explore more AI product work",
  ctaDescription:
    "See how discovery, prototypes, and collaboration connect to the rest of my product practice.",
};

export const zimmerGuide: Partial<PageContext> = {
  category: "Ongoing enterprise AI product work",
  oneLiner: zimmerAiPrototypes.summary,
  companyOrProject: "Zimmer Biomet",
  role: "AI Catalyst & Product Manager (contract through Spectraforce)",
  projectType: "case-study",
  tools: ["AI-assisted prototyping", "Excel workflow tools", "AI-generated eval code"],
  outcomes: zimmerAiPrototypes.results,
  metrics: [
    "Three prototypes, each within about a week of joining its project after initial discovery; ongoing development.",
    "Two initial stakeholder-defined use cases for the complex enterprise workflow example.",
    "Rebate formula: about 70% time saved on a single task; about three hours of effort to build.",
    "Initial reconciliation matching: about two minutes versus at least an hour on a single task; not the full reconciliation.",
  ],
  claimBoundaries: {
    directOwnership: [
      "Daniel built the initial prototypes, led focused discovery, aligned stakeholders on two initial use cases, and supplied product vision.",
    ],
    influence: [
      "AI architecture was designed collaboratively with engineering. Engineers also developed UI, data definitions, and prompts.",
    ],
    implementation: [
      "Daniel contributed AI-generated feature code, evals, and PRD context. This is shared implementation work, not sole engineering ownership.",
    ],
    explicitUnknowns: [
      "Workflow mapping and product development remain in progress. No production launch, direct people management, or sustained-impact claim is established.",
      "Eval contributions do not establish measured model-quality improvement.",
      "The two financial-task timings are single-task observations, not averages or broader workflow savings. Initial matching is not the entire reconciliation.",
      "The 95% accrual-app time reduction is a future projection, not achieved.",
      "Use only the public description ‘complex enterprise workflow’; additional implementation or operational details are not established by this public evidence.",
    ],
  },
  recruiterPrompts: [
    "How did Daniel use prototypes during discovery?",
    "What did Daniel contribute alongside engineering?",
    "What do the single-task measurements establish?",
  ],
  relatedProjectSlugs: ["oms-chatgpt-app", "ai-platform-mcp"],
};
