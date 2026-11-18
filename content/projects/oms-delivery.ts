/** Approved internal delivery record; public captures remain simulated examples. */
export const omsDeliveryMilestones = [
  { when: "~ April 2025", detail: "ChatGPT Canvas prototype." },
  { when: "~ December 2025", detail: "Working prototype." },
  {
    when: "March 2026",
    detail: "Production connection using OpenAI APIs and custom OMS APIs.",
  },
  { when: "April 2026", detail: "Small-group production testing." },
] as const;

export const omsLeadershipSummary =
  "I piloted order lookup and human-reviewed cancellation from prototype through production connection and small-group testing.";

export const omsDeliveryBoundary =
  "This internal delivery record is separate from the public simulated prototype. The milestones do not establish broad adoption, production usage metrics, revenue, or measured business impact. Recorded screenshots do not prove backend enforcement or tool-call ordering.";
