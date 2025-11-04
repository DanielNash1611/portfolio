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
  }
];
