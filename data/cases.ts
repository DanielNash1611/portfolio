export type Case = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  heroImage: string;
  kpis?: { label: string; value: string }[];
  href?: string;
};

export const cases: Case[] = [
  {
    slug: "checkout-redesign",
    title: "Checkout Redesign for Multi-Brand Retailer",
    summary:
      "Reimagined the omnichannel checkout experience across web and retail POS, delivering speed, clarity, and revenue lift through AI-led personalization.",
    tags: ["AI Product", "Experimentation", "Growth"],
    heroImage: "/images/checkout-hero.svg",
    kpis: [
      { label: "Checkout Time", value: "-50%" },
      { label: "Conversion", value: "+3%" },
      { label: "Annual Revenue Impact", value: "$16M" }
    ]
  },
  {
    slug: "sound-synthesist",
    title: "Sound Synthesist — AI Gear Recommender for Musicians",
    summary:
      "An AI assistant that helps musicians uncover the gear, signal chains, and production techniques behind the sounds they love.",
    tags: ["Product Leadership", "AI Strategy", "Rapid Prototyping", "Experimentation"],
    heroImage: "/images/synth-hero.svg",
    kpis: [
      {
        label: "Prototype Velocity",
        value: "4 hours — from concept to first working hackathon demo"
      },
      {
        label: "Portfolio Demo Build",
        value: "1 hour — rebuilt as a text-based web demo via Codex + ChatGPT"
      }
    ]
  },
  {
    slug: "launchmuse",
    title: "LaunchMuse — AI Fan Engagement Assistant",
    summary:
      "Real product: AI-assisted release planning, campaign generation, and audience insights.",
    tags: ["AI", "Music Tech", "Product"],
    heroImage: "/images/launchmuse-hero.svg",
    kpis: [
      { label: "Status", value: "Early Access" },
      { label: "Focus", value: "Campaigns • Insights • Timeline" }
    ],
    href: "/products/launchmuse"
  },
  {
    slug: "jira-product-discovery",
    title: "Jira Product Discovery (JPD) Adoption & Product Org Enablement",
    summary:
      "Standardized prioritization and planning in Jira Product Discovery, turning quarterly wishlists into a continuous partnership between product, business, and technology.",
    tags: ["Product Operations", "Strategic Alignment", "Jira Product Discovery"],
    heroImage: "/images/jpd-hero.svg",
    kpis: [
      { label: "Org Adoption", value: "9 PMs" },
      { label: "Planning Cadence", value: "Rolling" },
      { label: "Onboarding", value: "8 weeks" }
    ],
    href: "/case-studies/jira-product-discovery"
  },
  {
    slug: "chatgpt-contact-center",
    title: "Contact Center ChatGPT Pilot - AI Copilot for Agents",
    summary:
      "Designed and shipped a 6-month ChatGPT Enterprise pilot for Guitar Center's contact center, proving a $2.7M annualized impact.",
    tags: ["AI Product Management", "ChatGPT Enterprise", "Contact Center"],
    heroImage: "/images/chatgpt-contact-hero.svg",
    kpis: [
      { label: "Annualized Impact", value: "$2.7M+" },
      { label: "Pilot Cohort", value: "15 agents" },
      { label: "Duration", value: "6 months" }
    ],
    href: "/products/chatgpt-contact-center"
  },
  {
    slug: "chatgpt-org-scale",
    title: "Scaling ChatGPT Across the Organization",
    summary:
      "Scaled ChatGPT Enterprise from a focused pilot to hundreds of HQ users, launched ChatGPT Champions, and set the foundation for an AI COE.",
    tags: ["AI Platform & Strategy", "Enablement", "Change Management"],
    heroImage: "/images/chatgpt-org-hero.svg",
    kpis: [
      { label: "HQ Licenses", value: "Hundreds+" },
      { label: "Contact Center", value: "~350 agents" }
    ],
    href: "/products/chatgpt-org-scale"
  }
];
