import type { SystemNode } from "@/lib/experience/scroll-stories";

/** Diagram positions and labels adapted from Daniel's original hand-drawn
 * Contact Center Roadmap slide 13 and progress-review slides 5–6.
 * The after state is after one year. Slide 7's six-system vision is not shown.
 * No merge edges are inferred: removed tools fade, retained tools reposition. */
export const contactCenterSystems: readonly SystemNode[] = [
  { id: "salesforce", label: "Salesforce", before: [37, 47], after: [39, 45] },
  { id: "oms", label: "OMS", before: [64, 47], after: [64, 45] },
  { id: "websites", label: "GC.com / MF.com", before: [37, 61] },
  { id: "outlook", label: "Outlook", before: [64, 61] },
  { id: "sharepoint", label: "SharePoint", before: [50, 17] },
  { id: "mfdax", label: "MFDAX", before: [34, 27], after: [28, 16] },
  { id: "finance", label: "Finance Center", before: [72, 28], after: [75, 16] },
  { id: "excel", label: "Excel", before: [25, 37] },
  { id: "ups", label: "UPS.com", before: [80, 37] },
  { id: "ccc", label: "CCC", before: [50, 79], after: [50, 79] },
  { id: "connect", label: "AWS Connect", before: [12, 26] },
  { id: "texting", label: "Texting", before: [10, 46] },
  { id: "chatgpt", label: "ChatGPT", before: [13, 67], after: [39, 59] },
  { id: "google", label: "Google", before: [18, 79] },
  {
    id: "fulfilment",
    label: "Store fulfilment",
    before: [28, 88],
    after: [24, 86],
  },
  { id: "dropbox", label: "Dropbox", before: [54, 94], after: [54, 94] },
  { id: "cresta", label: "Cresta Coaching", after: [79, 57] },
];
export const systemsSource = {
  deck: "Contact Center Roadmap Progress End of 2024 (1).pptx",
  slides: [5, 6],
  before: 16,
  after: 9,
  period: "After one year",
} as const;

/** The original deck records intentions by quarter, not audited completion dates.
 * Only the review's final nine-system state is a reported outcome. */
export const systemsMilestones = [
  {
    id: "baseline",
    label: "Starting point",
    kind: "Original sketch",
    title: "Sixteen places to look.",
    detail:
      "The roadmap began with the daily and occasional tools Gear Advisors used to help customers.",
    targets: [] as string[],
    edges: [] as [string, string][],
    slide: 13,
  },
  {
    id: "q2",
    label: "Q2 2024",
    kind: "Roadmap target",
    title: "Connect email and returns.",
    detail:
      "Bring Outlook communication into Salesforce and the UPS returns flow into OMS.",
    targets: ["outlook", "ups"],
    edges: [
      ["outlook", "salesforce"],
      ["ups", "oms"],
    ] as [string, string][],
    slide: 14,
  },
  {
    id: "q3",
    label: "Q3 2024",
    kind: "Roadmap target",
    title: "Bring the answers closer.",
    detail:
      "Make routine MFDAX use cases easier in OMS or Salesforce, and integrate an AI assistant for Gear Advisors.",
    targets: ["mfdax", "chatgpt"],
    edges: [
      ["mfdax", "salesforce"],
      ["mfdax", "oms"],
      ["chatgpt", "salesforce"],
    ] as [string, string][],
    slide: 15,
  },
  {
    id: "q4",
    label: "Q4 2024",
    kind: "Roadmap target",
    title: "Consolidate the everyday work.",
    detail:
      "Bring texting, analytics, finance applications, and product lookup closer to the core agent workflow.",
    targets: ["texting", "excel", "finance", "websites"],
    edges: [
      ["texting", "salesforce"],
      ["excel", "salesforce"],
      ["websites", "salesforce"],
    ] as [string, string][],
    slide: 16,
  },
  {
    id: "review",
    label: "One-year review",
    kind: "Reported result",
    title: "Nine systems. A simpler day.",
    detail:
      "The progress review reports nine systems, including retained MFDAX and ChatGPT access and the addition of Cresta Coaching. Delivery differed from the original plan.",
    targets: ["salesforce", "oms", "chatgpt", "cresta"],
    edges: [] as [string, string][],
    slide: 6,
  },
] as const;
