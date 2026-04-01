import type { NarrativeId } from "@/data/positioning";

export type Case = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  heroImage: string;
  roleLens: NarrativeId[];
  bestFor: string;
  cardType: "Case Study" | "Capability Teaser" | "Emerging Work";
  kpis?: { label: string; value: string; description?: string }[];
  chips?: string[];
  href?: string;
};

export const cases: Case[] = [
  {
    slug: "checkout-redesign",
    title: "Better execution, faster checkout, measurable growth",
    summary:
      "A high-stakes checkout redesign that succeeded not just because of the experience changes, but because better product, UX, and engineering collaboration led to stronger decisions during build, a cleaner launch, and measurable lift.",
    tags: ["Commerce", "Experimentation", "Customer Experience"],
    heroImage: "/images/checkout-redesign/checkout-header.png",
    roleLens: ["senior-product-manager"],
    bestFor: "Senior Product Manager",
    cardType: "Case Study",
    kpis: [
      { label: "Annualized Impact", value: "~$16M" },
      { label: "Checkout Speed", value: "30% faster" },
      { label: "Delivery Outcome", value: "12-week launch" },
    ],
    chips: [
      "~$16M annualized impact",
      "30% faster checkout",
      "12-week launch, minimal disruption",
    ],
    href: "/work/checkout-redesign",
  },
  {
    slug: "returns-modernization",
    title: "Returns workflow modernization",
    summary:
      "Modernized service operations by consolidating fragmented returns tooling and redesigning the workflow for speed, clarity, and lower operating overhead.",
    tags: ["Operations", "Workflow Design", "Service Systems"],
    heroImage: "/images/checkout-after.svg",
    roleLens: ["senior-product-manager", "product-leader"],
    bestFor: "Senior Product Manager and Product Leader",
    cardType: "Capability Teaser",
    kpis: [
      { label: "Systems Simplified", value: "16 to 9" },
      { label: "Annual Hours Saved", value: "~2,000" },
    ],
    chips: ["16 systems reduced to 9", "~2,000 annual hours saved"],
  },
  {
    slug: "chatgpt-contact-center",
    title: "Contact Center ChatGPT pilot",
    summary:
      "Designed and shipped a controlled ChatGPT Enterprise pilot for the contact center, creating a measurable business case for broader AI rollout.",
    tags: ["AI Workflow", "Contact Center", "Experimentation"],
    heroImage: "/images/chatgpt-contact-hero.svg",
    roleLens: ["senior-product-manager", "builder-pm"],
    bestFor: "Senior Product Manager and Builder PM",
    cardType: "Case Study",
    kpis: [
      { label: "Estimated Annual Lift", value: "~$2.7M" },
      { label: "Pilot Cohort", value: "15 agents" },
      { label: "Duration", value: "6 months" },
    ],
    chips: [
      "~$2.7M estimated annual lift",
      "Controlled pilot design",
      "Custom GPT workflows",
    ],
    href: "/products/chatgpt-contact-center",
  },
  {
    slug: "chatgpt-org-scale",
    title: "Scaling ChatGPT across the organization",
    summary:
      "Scaled ChatGPT Enterprise with enablement, champions, and governance so the organization could move from isolated experiments to repeatable adoption.",
    tags: ["AI Rollout", "Enablement", "Governance"],
    heroImage: "/images/chatgpt-org-hero.svg",
    roleLens: ["senior-product-manager", "product-leader"],
    bestFor: "Senior Product Manager and Product Leader",
    cardType: "Case Study",
    kpis: [
      { label: "Licensed Users", value: "~1,000" },
      { label: "Daily Active Users", value: "~800" },
      { label: "Program", value: "Champions + AI COE" },
    ],
    chips: [
      "~1,000 licensed users",
      "~800 daily active users",
      "AI COE groundwork",
    ],
    href: "/products/chatgpt-org-scale",
  },
  {
    slug: "jira-product-discovery",
    title: "Jira Product Discovery adoption",
    summary:
      "Established a shared operating model for prioritization, planning, and PM onboarding with Jira Product Discovery as the strategy layer.",
    tags: ["Product Ops", "Operating Model", "Enablement"],
    heroImage: "/images/jpd-hero.svg",
    roleLens: ["product-leader"],
    bestFor: "Product Leader",
    cardType: "Case Study",
    kpis: [
      { label: "Core PM Adoption", value: "9 PMs" },
      { label: "Onboarding Program", value: "8 weeks" },
    ],
    chips: [
      "Jira Product Discovery adoption",
      "8-week PM onboarding",
      "Shared prioritization model",
    ],
    href: "/case-studies/jira-product-discovery",
  },
  {
    slug: "ai-middle-layer",
    title: "AI middle layer for workflows and connectors",
    summary:
      "A builder story about creating the connective tissue between models, tools, retrieval, and human review so AI workflows can become real operating systems instead of isolated prompts.",
    tags: ["AI Platform", "MCP", "RAG"],
    heroImage: "/images/chatgpt-contact-hero.svg",
    roleLens: ["builder-pm"],
    bestFor: "Builder PM",
    cardType: "Capability Teaser",
    kpis: [
      { label: "Focus", value: "MCP + connectors + retrieval" },
      { label: "Stage", value: "Capability story" },
    ],
    chips: [
      "MCP patterns",
      "Connector orchestration",
      "Human-in-the-loop workflow design",
    ],
  },
  {
    slug: "sound-seeker",
    title: "Sound Seeker live demo",
    summary:
      "A public-facing rebuild of the hackathon concept, now positioned as a supporting artifact inside the platform foundations case study.",
    tags: ["Prototype", "AI Product", "Music"],
    heroImage: "/images/synth-hero.svg",
    roleLens: ["builder-pm"],
    bestFor: "Builder PM",
    cardType: "Case Study",
    chips: [
      "Hackathon-winning concept",
      "Rapid PM-led prototype",
      "Embedded supporting artifact",
    ],
    href: "/work/ai-platform-mcp#sound-seeker-live-demo",
  },
  {
    slug: "launchmuse",
    title: "LaunchMuse",
    summary:
      "An AI-native MVP for release planning that demonstrates product incubation, prompt system design, and workflow prototyping in a creator context.",
    tags: ["Prototype", "AI Workflow", "Product Incubation"],
    heroImage: "/images/launchmuse-screenshot.png",
    roleLens: ["builder-pm"],
    bestFor: "Builder PM",
    cardType: "Case Study",
    kpis: [
      { label: "Status", value: "Early access" },
      { label: "Focus", value: "Release planning workflow" },
    ],
    chips: ["AI-native MVP", "Workflow design", "Emerging product incubation"],
    href: "/products/launchmuse",
  },
  {
    slug: "ai-coe-governance",
    title: "AI COE and governance operating model",
    summary:
      "A leadership story about defining ownership, intake, guardrails, and operating rhythm so AI efforts scale with better decision quality instead of more chaos.",
    tags: ["Governance", "Enablement", "Operating Model"],
    heroImage: "/images/chatgpt-org-hero.svg",
    roleLens: ["product-leader"],
    bestFor: "Product Leader",
    cardType: "Capability Teaser",
    kpis: [
      { label: "Focus", value: "Governance + enablement" },
      { label: "Stage", value: "Capability story" },
    ],
    chips: [
      "AI COE blueprint",
      "Train-the-trainer model",
      "Portfolio-level prioritization",
    ],
  },
  {
    slug: "immiatrics",
    title: "Immiatrics",
    summary:
      "Emerging AI + science work exploring how product systems and AI can support scientific discovery in immunology research.",
    tags: ["Emerging Work", "AI + Science", "Frontier AI"],
    heroImage: "/images/immunology-scout-screenshot.png",
    roleLens: ["builder-pm"],
    bestFor: "Builder PM",
    cardType: "Emerging Work",
    kpis: [
      { label: "Stage", value: "Emerging work" },
      { label: "Focus", value: "AI + science" },
    ],
    chips: [
      "Frontier applied AI",
      "Immunology research context",
      "Modest, early-stage exploration",
    ],
  },
];
