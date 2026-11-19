import type { WorkEntry } from "@/content/portfolio";

export const contactCenterRoadmapHref = "/work/contact-center-roadmap";

export const roadmapSequencingSummary =
  "Daniel used concentric circles of agent tool usage to persuade leadership to start with smaller changes like UPS returns and phase the OMS–Salesforce integration they had originally wanted to tackle first, because most of its benefit was expected near the end of an estimated 18 months of work. The sponsor had struggled to follow the earlier feature timeline. Contact Center and Technology backed the new direction, and Daniel recalls the CEO thanking him for pulling together a vision so quickly.";

export const roadmapDiscoveryActivities = [
  {
    id: "interviews",
    title: "Interviewed business and technology leaders",
    detail:
      "I met with the executive sponsor, Contact Center VP and directors, and technology lead to understand what each group needed.",
  },
  {
    id: "shadowing",
    title: "Shadowed Gear Advisors",
    detail:
      "I watched agents help customers in their normal workflow and saw where they had to switch tools.",
  },
  {
    id: "survey",
    title: "Surveyed agents with their leaders",
    detail:
      "We asked which systems agents used and where they ran into problems.",
  },
  {
    id: "intake",
    title: "Consolidated requests for prioritization",
    detail:
      "I brought the different request lists into one place so we could compare them against what agents actually needed.",
  },
] as const;

export const roadmapStory = {
  title: "Establishing product management in the Contact Center",
  opening:
    "Guitar Center’s Contact Center had never had a dedicated product manager. The new CEO visited the floor and saw Gear Advisors jumping between tools to help customers. Leadership believed they were using about five systems. As the Contact Center became a major company OKR priority, I was assigned to lead product for the Contact Center and Order Management.",
  discovery:
    "I started discovery before leadership asked for a roadmap. I wanted to see the work as agents experienced it and understand what each team was asking for.",
  request:
    "About six weeks in, I could see where agents were getting stuck and had enough evidence to decide it was time to build a roadmap. Within days, the Contact Center director called me over to tell me the CEO had asked for one.",
  reply: "I’m ready now. Let’s do this.",
  featurePitch:
    "I walked my executive sponsor through a feature-by-feature timeline. It had rows like Einstein Email and Einstein Case Classification. I knew what those features would do for the team, but my sponsor couldn’t see how the list added up to a strategy.",
  reframing:
    "I went back to what I’d seen agents do. I drew a new map of the tools they used, with the most frequent work at the center and occasional work farther out. It put the tool-switching problem in view and gave us a way to discuss which parts of the workflow to bring together. Most of the sequencing stayed in place.",
  sequencing:
    "Leadership wanted to start by bringing OMS into Salesforce. They were two of the tools agents used every day, so it was an obvious place to start. The technology lead estimated about 18 months, and I expected most of the benefit to reach agents near the end. I made the case for doing smaller, high-impact integrations first, and leadership agreed.",
  nearTerm:
    "Moving UPS returns into the order management system meant Gear Advisors could handle returns without switching to UPS.com. It was a smaller, useful change the team could tackle early.",
  longerTerm:
    "I kept the larger integration on the roadmap in two phases. The plan was to move common post-transaction actions into Salesforce, then retire the agent-facing OMS interface while keeping the order management backend.",
  alignment:
    "At the Management Committee presentation, the Contact Center VP, executive sponsor, and technology lead backed the direction with me. I remember the CEO thanking me for getting into the details so quickly and pulling together a vision for the Contact Center.",
  practice:
    "We translated company objectives into priorities the Contact Center and Technology teams could use. We gathered requests in one place, weighed impact against effort, sequenced the work, and revisited the plan against what the team delivered.",
  results:
    "The one-year review reported a move from 16 systems to nine. MFDAX remained in use and Cresta Coaching was added. The review attributed approximately 2,000 fewer annual customer hold-time hours to the faster in-system returns flow we delivered in partnership with the OMS team.",
  handoff:
    "I trained the incoming PM on the roadmap. They kept using it and were quickly able to join in and contribute to meaningful product decisions.",
  reflection:
    "I would introduce an opportunity tree earlier. I used sprint reviews to explain how individual decisions connected to the outcome. A shared visual would have made that reasoning easier to revisit between reviews.",
} as const;

export const contactCenterRoadmap: WorkEntry = {
  slug: "contact-center-roadmap",
  href: contactCenterRoadmapHref,
  title: roadmapStory.title,
  eyebrow: "Product leadership · Guitar Center",
  summary:
    "Daniel became the Contact Center’s first dedicated PM, built a shared roadmap within weeks, and established a planning practice the next PM could use.",
  description:
    "How I brought Contact Center and Technology leaders together around a three-year roadmap and handed off a product practice that kept working.",
  role: "First dedicated Product Manager for the Contact Center, also assigned to Order Management",
  company: "Guitar Center",
  timeframe: "2024–2025 · First year of a three-year roadmap",
  heroImage: "/images/contact-center-roadmap/roadmap-rings.svg",
  heroImageAlt:
    "Concentric rings adapted from the Contact Center roadmap’s tool-frequency diagrams.",
  tags: [
    "Product Strategy",
    "Roadmapping",
    "Executive Alignment",
    "Product Operations",
  ],
  featuredMetrics: [
    {
      label: "Frontline systems",
      value: "16 → 9",
      detail: "Reported after one year.",
    },
  ],
  context: [roadmapStory.opening],
  problem: [
    "Leadership expected about five systems. Discovery established that Gear Advisors were working across 16 systems to help customers.",
  ],
  strategicInsight: [
    roadmapStory.featurePitch,
    roadmapStory.reframing,
    roadmapStory.sequencing,
  ],
  optionsAndTradeoffs: [
    {
      option: "Bring UPS returns into OMS early",
      tradeoff: roadmapStory.nearTerm,
      selected: true,
    },
    {
      option: "Phase the broader Salesforce and OMS interface integration",
      tradeoff: roadmapStory.longerTerm,
    },
  ],
  execution: [
    { title: "Initiate discovery", body: roadmapStory.discovery },
    ...roadmapDiscoveryActivities.map(({ title, detail }) => ({
      title,
      body: detail,
    })),
    { title: "Prepare the roadmap within weeks", body: roadmapStory.request },
    {
      title: "Build executive and cross-functional support",
      body: roadmapStory.alignment,
    },
    { title: "Establish the planning practice", body: roadmapStory.practice },
    { title: "Train the incoming PM", body: roadmapStory.handoff },
  ],
  impact: [
    {
      label: "Frontline systems",
      value: "16 → 9",
      detail: "Reported after one year.",
    },
    {
      label: "Customer hold time",
      value: "~2,000 fewer hours annually",
      detail:
        "Reported for the in-system returns workflow delivered in partnership with the OMS team.",
    },
  ],
  results: [roadmapStory.results, roadmapStory.handoff],
  reflection: [roadmapStory.reflection],
  visuals: [
    {
      title: "Feature timeline reconstruction",
      description:
        "A standalone reconstruction of the feature-first presentation the sponsor struggled to follow. Selected labels and date windows are adapted from slide 36 and Daniel’s recollection.",
    },
    {
      title: "Tool-frequency circles",
      description:
        "Sanitized redraws of the baseline and quarterly targets from the original roadmap, slides 13–16, and the reported one-year state from the progress review, slides 5–6.",
    },
  ],
  testimonialIds: ["david-lawrence"],
};
