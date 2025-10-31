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
    slug: "checkout-redesign",
    title: "Checkout transformation for a multi-brand retailer",
    description:
      "Led a cross-functional program to rebuild checkout with AI-driven personalization, experimentation at scale, and deep funnel telemetry.",
    href: "/work/checkout-redesign",
    tags: ["AI Personalization", "Experimentation", "Conversion"],
    media: {
      src: "/images/checkout-hero.svg",
      width: 1200,
      height: 675,
      alt: "Mockups of a streamlined checkout interface with highlighted funnel metrics."
    },
    chips: ["Reduced friction for 20M+ shoppers"]
  },
  {
    slug: "launchmuse",
    title: "LaunchMuse — AI fan engagement assistant",
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
    slug: "sound-synthesist",
    title: "Sound Synthesist — generative audio playground",
    description:
      "Prototyped a modular system that blends GPT prompt orchestration with real-time synthesis to spark new musical ideas.",
    href: "/work/sound-synthesist",
    tags: ["Prototype", "Generative AI", "Audio R&D"],
    media: {
      src: "/images/synth-hero.svg",
      width: 1200,
      height: 675,
      alt: "Generative audio interface with colorful dials and waveform plots."
    },
    chips: ["Multi-agent creative workflow"]
  }
];
