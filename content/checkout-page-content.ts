// Published checkout copy and measurements shared by the page and search.

export const checkoutRoleChanges = [
  "Developers had enough context to make stronger product decisions during implementation.",
  "UX stayed actively involved during development instead of handing off designs and stepping away.",
];

export const checkoutBuildParagraphs = [
  "One of the biggest lessons from this work was that developers build better when they are given enough context to think, not just enough detail to comply.",
  "Previously, design was treated more like a handoff. On this project, I made sure the UX designer remained available throughout development. That meant that when feasibility issues came up, they turned into live product and design conversations rather than isolated engineering compromises.",
  "That mattered because the designer did not just have one solution in mind. He had multiple directions he could take. So instead of drifting into a weaker fallback path, the team could quickly choose another option that was still intentional, still user-centered, and more feasible to build.",
  "That reduced rework, improved implementation decisions, and helped the team move faster with more confidence.",
];

export const checkoutDeliveryParagraphs = [
  "We delivered the redesign in 12 weeks, which was fast for a journey this sensitive.",
  "More importantly, the launch was unusually clean. We saw almost no interruption to services after release, even though checkout was a high-risk area where problems would have shown up immediately.",
  "Part of that came from turning extreme scenario complexity into a practical QA plan. I mapped roughly 400 billion theoretical checkout combinations, then focused the team on 20-30 scenarios that covered the highest-risk paths before launch.",
  "That outcome came from the execution model as much as the redesign itself: stronger shared context, tighter UX-engineering collaboration, and better in-flight decisions.",
];

export const checkoutResultBullets = [
  "30% faster checkout",
  "~3% conversion lift",
  "~$16M estimated annualized revenue impact",
  "12-week delivery timeline",
  "Minimal service disruption after launch",
  "Immediate positive signal through post-launch A/B testing",
];

export const checkoutJiraNotes = [
  "User-centered framing",
  "Clear implementation guidance",
  "Enough context for better engineering decisions",
];

export type CheckoutComparisonRow = {
  label: string;
  before?: string;
  after: string;
  beforePrefix?: string;
};

export type CheckoutEvidenceCard = {
  title: string;
  speedLabel?: string;
  interpretation: string;
  rows: CheckoutComparisonRow[];
  tone?: "default" | "nuanced";
};

export const checkoutUsabilityCards: CheckoutEvidenceCard[] = [
  {
    title: "Full checkout flow",
    speedLabel: "32% faster",
    interpretation: "Faster overall flow with stronger perceived usability",
    rows: [
      { label: "Time", before: "3:00", after: "2:03" },
      { label: "Difficulty", before: "3.8", after: "5.0" },
      { label: "Success", before: "6/6", after: "6/6" },
    ],
  },
  {
    title: "Entering a discount code",
    speedLabel: "37% faster",
    interpretation: "Eliminated a previous failure point",
    rows: [
      { label: "Time", before: "0:46", after: "0:29" },
      { label: "Difficulty", before: "3.8", after: "4.6" },
      { label: "Success", before: "5/6", after: "6/6" },
    ],
  },
  {
    title: "Changing item quantity",
    speedLabel: "Slower, but clearer",
    interpretation: "More deliberate interaction, higher clarity",
    tone: "nuanced",
    rows: [
      { label: "Time", before: "0:57", after: "1:10" },
      { label: "Difficulty", before: "3.5", after: "5.0" },
      { label: "Success", before: "6/6", after: "6/6" },
    ],
  },
  {
    title: "Changing shipping method/location",
    interpretation: "Higher confidence with fewer user errors",
    rows: [
      { label: "Difficulty", before: "3.6", after: "5.0" },
      {
        label: "Success",
        after: "6/6",
        beforePrefix: "Improved to",
      },
    ],
  },
];

export const checkoutUsabilityQuotes = [
  "Very easy to use",
  "Everything I needed was right there",
  "Not confusing at all",
];
