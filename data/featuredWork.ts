export type FeaturedWorkItem = {
  slug: string;
  title: string;
  description: string;
  href: string;
  tags: string[];
  media: {
    src: string;
    width: number;
    height: number;
    alt: string;
  };
  status?: string;
  chips?: string[];
};

export const featuredWork: FeaturedWorkItem[] = [
  {
    slug: "launchmuse",
    title: "LaunchMuse - AI fan engagement assistant",
    description:
      "Incubated an AI copilot for independent artists that orchestrates release calendars, campaign ideas, and audience targeting.",
    href: "/products/launchmuse",
    tags: ["AI Assistant", "Music Tech", "Product Incubation"],
    media: {
      src: "/images/launchmuse-hero.svg",
      width: 1200,
      height: 675,
      alt: "LaunchMuse dashboard showing AI-generated release strategy cards."
    },
    status: "Early access"
  },
  {
    slug: "chatgpt-org-scale",
    title: "Scaling ChatGPT across the organization",
    description:
      "Scaled ChatGPT Enterprise from a pilot to hundreds of HQ users, launched ChatGPT Champions, and laid the groundwork for an AI Center of Excellence.",
    href: "/products/chatgpt-org-scale",
    tags: ["AI Platform", "Enablement", "Change Management"],
    media: {
      src: "/images/chatgpt-org-hero.svg",
      width: 1200,
      height: 675,
      alt: "Organizational AI enablement dashboard with training, champions, and governance callouts."
    },
    chips: [
      "ChatGPT Champions program",
      "AI COE blueprint",
      "We need more Daniels."
    ]
  },
  {
    slug: "chatgpt-contact-center",
    title: "Contact Center ChatGPT pilot",
    description:
      "Launched a six-month ChatGPT Enterprise pilot for contact center agents that delivered a $2.7M annualized impact and unlocked full-scale rollout.",
    href: "/products/chatgpt-contact-center",
    tags: ["AI Copilot", "Contact Center", "Experimentation"],
    media: {
      src: "/images/chatgpt-contact-hero.svg",
      width: 1200,
      height: 675,
      alt: "Contact center workspace with AI copilot summaries and revenue metrics."
    },
    chips: ["Matched-control experiment", "Safely used CRM context"]
  },
  {
    slug: "sound-seeker",
    title: "Sound Seeker – AI gear recommendation assistant",
    description:
      "Built an AI-powered copilot that helps musicians discover the right instruments and recording gear through conversational questions, curated recommendations, and explainable suggestions.",
    href: "/work/sound-seeker",
    tags: ["PROTOTYPE", "AI COPILOT", "GEAR DISCOVERY"],
    media: {
      src: "/images/synth-hero.svg",
      width: 1200,
      height: 675,
      alt: "Generative audio interface with colorful dials and waveform plots."
    },
    chips: ["Conversational gear discovery"]
  },
  {
    slug: "jira-product-discovery",
    title: "Jira Product Discovery adoption",
    description:
      "Unified prioritization and portfolio planning in Jira Product Discovery, turning quarterly wishlists into an ongoing partnership across product, business, and technology.",
    href: "/case-studies/jira-product-discovery",
    tags: ["Product Operations", "Strategic Alignment", "Jira Product Discovery"],
    media: {
      src: "/images/jpd-hero.svg",
      width: 1200,
      height: 675,
      alt: "Jira Product Discovery boards highlighting prioritization and alignment workflows."
    },
    chips: ["RICE scoring at scale", "8-week onboarding program"]
  },
  {
    slug: "checkout-redesign",
    title: "Checkout transformation for a multi-brand retailer",
    description:
      "Led a cross-functional program to redesign checkout across a multi-brand retailer, cutting checkout time in half and improving conversion through experimentation and UX improvements.",
    href: "/work/checkout-redesign",
    tags: ["E-COMMERCE", "CHECKOUT", "CONVERSION"],
    media: {
      src: "/images/checkout-hero.svg",
      width: 1200,
      height: 675,
      alt: "Mockups of a streamlined checkout interface with highlighted funnel metrics."
    },
    chips: [
      "50% faster checkout flow",
      "3% lift in conversion (~$16M/yr)",
      "Multi-brand rollout"
    ]
  }
];

