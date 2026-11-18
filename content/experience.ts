export const experienceContent = {
  intro: {
    eyebrow: "AI product leader · builder · composer",
    title: "Technology.\nWith a human pulse.",
    description:
      "I build technology that expands what people can create and accomplish.",
  },
  gravity: {
    eyebrow: "01 / A composition you can enter",
    title: "Gravity",
    description:
      "An original composition becomes a space you can move through. Independent performers. One gravitational center. A different piece from every perspective.",
    image: "/images/gravity/astra/celestial-orbits.webp",
  },
  ai: {
    eyebrow: "02 / From possibility to proof",
    title: "AI, with\naccountability.",
    description:
      "The same curiosity, applied to work: turn approved evidence into useful outputs, with the source and the human decision still in view.",
    image:
      "/images/products/ai-career-operating-system/governed-ai-workflow-career-evidence.png",
  },
};

export const workflowStages = [
  {
    id: "evidence",
    label: "Approved evidence",
    title: "Start with what is supported.",
    detail:
      "Public, authored proof supplies the claims. A source remains attached to the statement it supports.",
  },
  {
    id: "tailoring",
    label: "Role tailoring",
    title: "Make the relevant work legible.",
    detail:
      "For an AI product leadership role, emphasize architecture, evidence boundaries, workflow design, and evaluation. Tailoring changes emphasis; it does not create experience.",
  },
  {
    id: "checks",
    label: "AI-assisted checks",
    title: "Keep the claims inspectable.",
    detail:
      "Source checks, evaluation criteria, and AI-assisted critique help identify gaps. These checks support review; they do not establish independent verification or human approval.",
  },
  {
    id: "review",
    label: "Human review",
    title: "A person owns the final decision.",
    detail:
      "Daniel remains accountable for approving the artifact and what it represents. This walkthrough does not generate or approve a new résumé.",
  },
] as const;

export const evidenceExample = {
  statement:
    "Defined the product architecture, evidence boundaries, workflow stages, and evaluation criteria for a governed AI career workflow.",
  quote:
    "Daniel defined the product architecture, evidence boundaries, claim-safety rules, workflow stages, evaluation criteria, and portfolio positioning.",
  source: "/products/ai-career-operating-system#why-this-matters-heading",
  limitation:
    "Built and iterated with AI-assisted development; final approval remains human.",
};
