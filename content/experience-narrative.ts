/** Authored positioning for the isolated preview. Project facts and delivery
 * qualifications continue to come from the public portfolio projection. */
export const careerNarrative = {
  eyebrow: "AI product leader. Hands-on builder.",
  title: "I build clarity where there isn’t any.",
  description:
    "I turn ambiguous opportunities into product direction, align people around what matters, and help teams deliver measurable change.",
  chapters: [
    { id: "products", label: "Working products" },
    { id: "work", label: "Leadership cases" },
    { id: "toolkit", label: "Method & practice" },
    { id: "recommendations", label: "Working together" },
    { id: "contact", label: "Let’s talk" },
  ],
  decisions: [
    {
      label: "Find the opportunity",
      question: "Where is the friction?",
      title: "Start with the work people need to do.",
      detail:
        "Understand the workflow, the constraints, and the decision worth improving before choosing the technology.",
      source: "/work/checkout-redesign",
      sourceLabel: "See the checkout decisions",
    },
    {
      label: "Establish direction",
      question: "What is worth testing?",
      title: "Give the opportunity a direction.",
      detail:
        "Make the intended outcome, priorities, and next test clear enough for people to act together.",
      source: "/work/ai-platform-mcp",
      sourceLabel: "Explore the platform strategy",
    },
    {
      label: "Build a learning loop",
      question: "What evidence changes the decision?",
      title: "Create a way to learn and move forward.",
      detail:
        "Use working prototypes, explicit checks, and feedback to connect the next decision to evidence.",
      source: "/work/chatgpt-enterprise",
      sourceLabel: "Follow the pilot into adoption",
    },
  ],
  method: ["Opportunity", "Direction", "Prototype", "Evidence", "Adoption"],
} as const;
