import type { ProductEntry } from "@/content/portfolio";

export const privateProductExamples: ProductEntry[] = [
  {
    slug: "original-reader",
    href: "/products/original-reader",
    title: "Original Reader",
    eyebrow: "AI-assisted product & experience",
    status: "Privately deployed",
    summary:
      "A mobile-first historical text reader shaped around keeping your place and choosing which textual changes deserve attention.",
    description:
      "Privately deployed reading experience with passage-preserving navigation, touch interactions, and selective annotations.",
    heroImage: "",
    heroImageAlt: "",
    tags: ["Interaction design", "AI-assisted building", "Reading experience"],
    featuredMetrics: [],
    problem: [
      "Reading historical text on a phone should not mean losing your passage when you navigate or being overwhelmed by minor textual edits.",
    ],
    solution: [
      "I defined a mobile-first reading experience and used AI-assisted building to make the interaction concrete enough to use and refine.",
    ],
    productExperience: [
      {
        title: "Keep the passage in view",
        description:
          "Passage-preserving navigation and touch interactions keep the reading position central to the experience.",
      },
      {
        title: "Choose the annotations that matter",
        description:
          "Feedback led me to refine the filters around substantive wording changes and major punctuation, rather than treating every minor edit as equally useful.",
      },
    ],
    learnings: [
      "The product decision was about attention: preserve the reading flow while letting readers choose when textual differences are worth exploring.",
    ],
    evaluationAndTrust: [
      "Privately deployed. This is an AI-assisted product and experience example, not a public launch or a claim of measured adoption.",
    ],
    visuals: [],
  },
  {
    slug: "temple-stories",
    href: "/products/temple-stories",
    title: "Temple Stories",
    eyebrow: "AI-assisted product & experience",
    status: "Privately deployed",
    summary:
      "A swipe-led browsing experience for exploring temples through educational visual stories.",
    description:
      "Privately deployed experience using horizontal swipes to switch temples and vertical swipes to explore their stories.",
    heroImage: "",
    heroImageAlt: "",
    tags: [
      "Interaction design",
      "AI-assisted building",
      "Educational storytelling",
    ],
    featuredMetrics: [],
    problem: [
      "Exploring temples needed a browsing pattern that made it easy to move between places and then explore the stories within one.",
    ],
    solution: [
      "I defined a two-direction interaction and used AI-assisted building to turn the browsing concept into a privately deployed experience.",
    ],
    productExperience: [
      {
        title: "Browse across, explore down",
        description:
          "Horizontal swipes switch temples; vertical swipes move through educational visual stories within a temple.",
      },
    ],
    learnings: [
      "Separating the two navigation directions gives browsing between temples and exploring a story distinct interaction roles.",
    ],
    evaluationAndTrust: [
      "Privately deployed. This example demonstrates an interaction concept, not a public launch, measured adoption, or equal depth of content across temple profiles.",
    ],
    visuals: [],
  },
];

export const privateProductGuide = Object.fromEntries(
  privateProductExamples.map((entry) => [
    entry.slug,
    {
      category: "AI-assisted product & experience",
      role: "Product framing, interaction definition, and AI-assisted refinement",
      outcomes: [],
      metrics: [],
      evidenceHighlights: entry.productExperience.map((step) => ({
        label: step.title,
        detail: step.description,
      })),
      claimBoundaries: {
        directOwnership: entry.solution,
        implementation: entry.evaluationAndTrust,
        explicitUnknowns: [
          "Public adoption and measured outcomes are not established.",
        ],
      },
    },
  ]),
);
