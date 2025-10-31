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
    title: "Sound Synthesist — AI Composer Playground",
    summary:
      "Built a real-time sound design demo blending OpenAI-powered prompts, vector search, and modular synthesis to spark creative exploration.",
    tags: ["Prototype", "Music Tech", "AI"],
    heroImage: "/images/synth-hero.svg",
    kpis: [
      { label: "Prototype Velocity", value: "6 weeks" },
      { label: "User Satisfaction", value: "4.7/5" }
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
