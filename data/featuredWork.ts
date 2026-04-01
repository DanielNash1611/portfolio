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
    title: "Better execution, faster checkout, measurable growth",
    description:
      "A high-stakes checkout redesign that succeeded not just because of the experience changes, but because better product, UX, and engineering collaboration led to stronger decisions during build, a cleaner launch, and measurable lift.",
    href: "/work/checkout-redesign",
    tags: ["Commerce", "Experimentation", "Customer Experience"],
    media: {
      src: "/images/checkout-redesign/checkout-header.png",
      width: 1536,
      height: 1024,
      alt: "Checkout redesign header illustration showing delivery, order summary, and payment visuals.",
    },
    chips: [
      "~$16M annualized impact",
      "30% faster checkout",
      "12-week launch, minimal disruption",
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
    title: "Sound Seeker live demo",
    description:
      "A public-facing rebuild of the hackathon concept, now embedded as a supporting artifact inside the platform foundations case study.",
    href: "/work/ai-platform-mcp#sound-seeker-live-demo",
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
      "Embedded supporting artifact",
    ],
    bestFor: "Builder PM",
  },
  {
    slug: "immiatrics",
    featuredFor: ["builder-pm"],
    title: "Immiatrics",
    description:
      "Paper-and-patent scouting concept for immunology teams, framed as a trustworthy grounding layer for novelty checks and next-step hypothesis development.",
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
