import type { ProductEntry } from "@/content/portfolio";

export const privateProductScreenshotCredits: Record<
  string,
  {
    title: string;
    creator: string;
    sourceUrl: string;
    license: string;
    licenseUrl: string;
    changes: string;
  }
> = {
  "temple-stories": {
    title: "Salt Lake Temple, Utah - Sept 2004.jpg",
    creator: "DAVID ILIFF (Diliff)",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Salt_Lake_Temple,_Utah_-_Sept_2004.jpg",
    license: "CC BY 2.5",
    licenseUrl: "https://creativecommons.org/licenses/by/2.5/",
    changes:
      "Photo cropped and resized within the interface. Screenshot scaled for this page.",
  },
};

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
    heroImage: "/images/products/original-reader/filters.jpg",
    heroImageAlt:
      "Original Reader's footnote category dialog with word changes and major punctuation selected.",
    heroImageClassName: "!object-contain bg-white",
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
    visuals: [
      {
        title: "Historical reading view",
        description:
          "A capture of the private historical-text build showing the 1830 chapter opening and reading layout.",
        image: "/images/products/original-reader/reading.jpg",
        alt: "Original Reader displaying the 1830 First Book of Nephi chapter opening in its reading layout.",
        imageFit: "contain",
      },
      {
        title: "Selective footnote filters",
        description:
          "The category dialog lets readers include substantive word changes and major punctuation while leaving minor edits out of the reading focus.",
        image: "/images/products/original-reader/filters.jpg",
        alt: "Choose your footnotes dialog with word changes and major punctuation selected, while spelling and minor punctuation are unselected.",
        imageFit: "contain",
      },
    ],
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
    heroImage: "/images/products/temple-stories/salt-lake-overview.jpg",
    heroImageAlt:
      "Temple Stories showing the Salt Lake Temple overview with horizontal temple navigation and vertical story navigation.",
    heroImageClassName: "!object-contain bg-white",
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
    visuals: [
      {
        title: "Salt Lake browsing overview",
        description:
          "A capture from a local recording build showing the Salt Lake overview, horizontal temple navigation, and vertical story progression. This selected screen uses an openly licensed photograph.",
        image: "/images/products/temple-stories/salt-lake-overview.jpg",
        alt: "Temple Stories Salt Lake Temple overview, showing its title, broad exterior photo, story progress, temple-switching controls, and visible photo credit.",
        imageFit: "contain",
      },
    ],
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
