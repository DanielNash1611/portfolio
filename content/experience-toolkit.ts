/** Authored practice summaries and method illustrations, with links to their sources.
 * The outlines explain the method; they are not original source screenshots. */
export const experienceToolkit = [
  {
    id: "prototyping",
    label: "Prototyping",
    capability: "From idea to working product",
    heading: "Think it through. Then make it real.",
    description:
      "Brainstorm the idea, review a living PRD, then build and refine with that product context carried forward. Follow the Gravity example from the product method.",
    artifact: {
      kind: "outline",
      label: "Choose the artifact for the question",
      topics: [
        { title: "Name the uncertainty", detail: "What do we need to learn?" },
        {
          title: "Make it tangible",
          detail: "Build a sketch, POC, or usable increment.",
        },
        {
          title: "Try it",
          detail: "Use the evidence appropriate to the question.",
        },
        {
          title: "Refine",
          detail: "Record the decision and update the definition.",
        },
      ],
    },
    caption:
      "Interactive Gravity reenactment · idea → PRD → build, try, refine",
    href: "/product-system#build-cycle",
    action: "Explore the prototyping method",
  },
  {
    id: "planning",
    label: "Planning",
    capability: "Build shared judgment",
    heading: "Make prioritization a shared judgment.",
    description:
      "I combined common criteria, portfolio views, and live planning with an eight-week curriculum for PMs and cross-functional partners.",
    artifact: {
      kind: "outline",
      label: "From opportunities to shared decisions",
      topics: [
        {
          title: "Frame the opportunity",
          detail: "Start with ideas and needs.",
        },
        {
          title: "Make tradeoffs visible",
          detail: "RICE: reach, impact, confidence, and effort.",
        },
        {
          title: "Plan together",
          detail: "Use shared portfolio views and connect initiatives to OKRs.",
        },
        {
          title: "Build judgment",
          detail: "Practice in live planning and one-to-one coaching.",
        },
      ],
    },
    caption:
      "Authored summary · planning and curriculum documented in the case study",
    href: "/case-studies/jira-product-discovery",
    action: "Explore the planning practice",
  },
  {
    id: "enablement",
    label: "Enablement",
    capability: "Scale through people",
    heading: "Make useful workflows teachable.",
    description:
      "I created reusable prompting patterns, training assets, and a grassroots champions network so teams could share practical workflows.",
    artifact: {
      kind: "image",
      image: "/images/experience/case-study-artwork/champions.webp",
      alt: "Sanitized champions-model exhibit showing functional champions, working sessions, cross-functional alignment, and executive sponsorship.",
    },
    caption: "Sanitized champions-model exhibit",
    href: "/work/chatgpt-enterprise",
    action: "Explore the enablement approach",
  },
] as const;
