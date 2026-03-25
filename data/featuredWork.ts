import type { NarrativeId } from "@/data/positioning";

export type FeaturedWorkItem = {
  slug: string;
  featuredFor: NarrativeId[];
  title: string;
  description: string;
  href?: string;
  tags: string[];
  media: {
    src: string;
    width: number;
    height: number;
    alt: string;
  };
  status?: string;
  chips?: string[];
  bestFor: string;
};

export const featuredWork: FeaturedWorkItem[] = [
  {
    slug: "checkout-redesign",
    featuredFor: ["senior-product-manager"],
    title: "Checkout transformation for a multi-brand retailer",
    description:
      "Reworked the checkout experience end to end to improve clarity, reduce completion time, and deliver measurable growth through experimentation.",
    href: "/work/checkout-redesign",
    tags: ["Commerce", "Experimentation", "Customer Experience"],
    media: {
      src: "/images/checkout-hero.svg",
      width: 1200,
      height: 675,
      alt: "Mockups of a streamlined checkout interface with highlighted funnel metrics.",
    },
    chips: [
      "~$16M annualized impact",
      "~3.5% conversion lift",
      "50% faster checkout",
    ],
    bestFor: "Senior Product Manager",
  },
  {
    slug: "chatgpt-contact-center",
    featuredFor: ["senior-product-manager", "builder-pm"],
    title: "Contact Center ChatGPT pilot",
    description:
      "Designed a controlled AI pilot for the contact center, proving business value while shaping repeatable workflows and enterprise guardrails.",
    href: "/products/chatgpt-contact-center",
    tags: ["AI Workflow", "Contact Center", "Experimentation"],
    media: {
      src: "/images/chatgpt-contact-hero.svg",
      width: 1200,
      height: 675,
      alt: "Contact center workspace with AI copilot summaries and pilot metrics.",
    },
    chips: [
      "~$2.7M estimated annual lift",
      "Controlled pilot design",
      "Custom GPT workflows",
    ],
    bestFor: "Senior Product Manager and Builder PM",
  },
  {
    slug: "chatgpt-org-scale",
    featuredFor: ["senior-product-manager", "product-leader"],
    title: "Scaling ChatGPT across the organization",
    description:
      "Scaled ChatGPT Enterprise with champions, enablement, and governance so AI adoption could move from isolated pilots to durable capability.",
    href: "/products/chatgpt-org-scale",
    tags: ["AI Rollout", "Governance", "Enablement"],
    media: {
      src: "/images/chatgpt-org-hero.svg",
      width: 1200,
      height: 675,
      alt: "AI rollout illustration with enablement, governance, and adoption callouts.",
    },
    chips: [
      "~1,000 licensed users",
      "~800 daily active users",
      "AI COE groundwork",
    ],
    bestFor: "Senior Product Manager and Product Leader",
  },
  {
    slug: "jira-product-discovery",
    featuredFor: ["product-leader"],
    title: "Jira Product Discovery adoption",
    description:
      "Built the shared prioritization and onboarding system that gave PMs and partners a clearer operating rhythm.",
    href: "/case-studies/jira-product-discovery",
    tags: ["Product Ops", "Operating Model", "Enablement"],
    media: {
      src: "/images/jpd-hero.svg",
      width: 1200,
      height: 675,
      alt: "Jira Product Discovery boards highlighting prioritization and planning workflows.",
    },
    chips: ["9 PMs adopted", "8-week onboarding", "Shared prioritization"],
    bestFor: "Product Leader",
  },
  {
    slug: "sound-seeker",
    featuredFor: ["builder-pm"],
    title: "Sound Seeker",
    description:
      "A hackathon-winning AI concept rebuilt as an independent prototype to demonstrate PM-led exploration, rapid prototyping, and frontier product instincts.",
    href: "/work/sound-seeker",
    tags: ["Prototype", "AI Product", "Music"],
    media: {
      src: "/images/synth-hero.svg",
      width: 1200,
      height: 675,
      alt: "Generative audio interface with waveform plots and colorful controls.",
    },
    chips: [
      "Hackathon-winning concept",
      "Rapid PM-led prototype",
      "Independent public demo",
    ],
    bestFor: "Builder PM",
  },
  {
    slug: "immiatrics",
    featuredFor: ["builder-pm"],
    title: "Immiatrics",
    description:
      "Emerging AI + science work focused on how product systems and applied AI can support scientific discovery in immunology research.",
    tags: ["Emerging Work", "AI + Science", "Frontier AI"],
    media: {
      src: "/images/immunology-scout-screenshot.png",
      width: 1536,
      height: 1024,
      alt: "Immunology Scout screenshot showing a scientific literature search and synthesis interface.",
    },
    status: "Emerging work",
    chips: [
      "AI + science",
      "Frontier applied AI",
      "Modest, early-stage exploration",
    ],
    bestFor: "Builder PM",
  },
];
