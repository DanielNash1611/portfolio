import type { PageContext } from "@/lib/portfolio-guide/types";

export const creativeGuideMetadata = {
  "gravity-astra": {
    category: "Creative technology",
    role: "Composer, product direction, experience design, and human evaluation",
    projectType: "creative-experience",
    domains: ["creative-technology", "spatial-music"],
    strengths: ["0-to-1", "ux", "technical-depth"],
    interestTags: ["creative-technology", "0-to-1"],
    tools: ["Astra", "Blender", "Spatial audio", "Local webcam hand tracking"],
    evidenceHighlights: [
      {
        label: "Original work",
        detail:
          "An original composition became a navigable spatial music experience with independent performers and listener perspectives.",
        type: "artifact",
      },
      {
        label: "Human testing",
        detail:
          "Watching people struggle with broad gestures led to a smaller, more reliable hand-control vocabulary.",
        type: "workflow",
      },
      {
        label: "Authorship",
        detail:
          "Daniel remained responsible for the composition, product thesis, experience principles, human observation, tradeoffs, and the call on what deserved to ship.",
        type: "ownership",
      },
    ],
    claimBoundaries: {
      directOwnership: [
        "Daniel authored the composition and directed the product thesis, experience principles, observation, tradeoffs, and shipping decisions.",
      ],
      influence: [
        "Observations of real people, including his five-year-old, shaped the simpler interaction model. This is qualitative evidence, not a published usability study.",
      ],
      implementation: [
        "Astra accelerated Blender-to-browser assets, cross-system implementation, and validation. The page does not establish sole hand-coding by Daniel.",
      ],
      conceptualExploration: [
        "Broader hand gestures and swipes remain documented experiments, not all current controls.",
      ],
      explicitUnknowns: [
        "The page does not establish commercial adoption, revenue, enterprise scale, hiring outcomes, formal team management, team size, or quantitative usability gains. Enterprise metrics elsewhere belong to those projects, not Gravity.",
      ],
    },
    recruiterPrompts: [
      "What changed after watching people use Gravity?",
      "What did Daniel direct, and what did Astra help implement?",
      "What's implied but not proven here?",
    ],
    relatedProjectSlugs: [
      "tabletop-symphony",
      "ai-career-operating-system",
      "the-side-of-ai-i-want-to-be-on",
    ],
    crossPageLinks: [
      {
        slug: "tabletop-symphony",
        bridge:
          "Tabletop Symphony explores the same connection between authored music, live human choice, and interaction through a private adaptive-score alpha.",
      },
      {
        slug: "ai-career-operating-system",
        bridge:
          "The AI Career Operating System provides a separate example of Daniel defining an AI workflow, evaluation, and human accountability.",
      },
    ],
  },
  "tabletop-symphony": {
    category: "Creative technology",
    role: "Composer, product concept, experience principles, and alpha design",
    timeframe: "Private working alpha; in development",
    projectType: "creative-experience",
    domains: ["creative-technology", "adaptive-music"],
    strengths: ["0-to-1", "ux"],
    interestTags: ["creative-technology", "0-to-1"],
    evidenceHighlights: [
      {
        label: "Working alpha",
        detail:
          "A tap-first adaptive music companion for live tabletop play, shown as a private working alpha.",
        type: "artifact",
      },
      {
        label: "Human agency",
        detail:
          "The score is composer-built, serves the story, and keeps the Game Master in control.",
        type: "workflow",
      },
      {
        label: "Product process",
        detail:
          "The public process starts with the GM's limited attention, a readable emotional language, replayable scenes, and live conversation.",
        type: "workflow",
      },
    ],
    claimBoundaries: {
      directOwnership: [
        "The page presents Daniel's product premise, authored music, experience principles, process, visual evolution, and working alpha.",
      ],
      implementation: [
        "A working private alpha and public interface are shown. The page does not establish sole hand-coding, a specific AI architecture, or a production launch.",
      ],
      conceptualExploration: [
        "Music following the emotional shape of live tabletop play is the product direction; the public surface establishes a working alpha, not validated performance across different live tables.",
      ],
      explicitUnknowns: [
        "The mechanics, tuning decisions, evaluation data, music structure, and launch strategy are intentionally private. The public page establishes the premise, experience principles, process, and alpha interface only.",
        "The page does not establish commercial adoption, revenue, enterprise scale, team size, formal people management, or quantitative outcomes. Metrics from enterprise pages are not Tabletop outcomes.",
      ],
    },
    recruiterPrompts: [
      "What's working today versus still in development?",
      "How does the experience keep the storyteller in control?",
      "What does the public page establish about Daniel's role?",
    ],
    relatedProjectSlugs: [
      "gravity-astra",
      "ai-career-operating-system",
      "the-side-of-ai-i-want-to-be-on",
    ],
    crossPageLinks: [
      {
        slug: "gravity-astra",
        bridge:
          "Gravity shows a separate original composition becoming a spatial experience shaped by human interaction testing.",
      },
      {
        slug: "ai-career-operating-system",
        bridge:
          "The AI Career Operating System adds a separate concrete AI build with evidence grounding, evaluation, and human review.",
      },
    ],
  },
} satisfies Record<string, Partial<PageContext>>;
