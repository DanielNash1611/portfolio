export const launchCampaignArtifacts = [
  {
    id: "launch-campaign-week",
    label: "The campaign week",
    title: "Give the week a purpose.",
    detail:
      "Week two takes a specific angle: how the piece works. The published overview turns that theme into an explainer, a DAW walkthrough, a microclip and a thread.",
    image: "/images/launchmuse/week-2-grid.png",
    alt: "Existing LaunchMuse week-two campaign output titled Tech and composition deep-dive, with an explainer, a DAW walkthrough, a microclip and a thread. This is generated planning output, not campaign results.",
    width: 1966,
    height: 1542,
  },
  {
    id: "launch-campaign-brief",
    label: "The content brief",
    title: "Make the next piece actionable.",
    detail:
      "The existing Two Tuning Systems Colliding brief carries the theme into post copy, visual direction, a call to action and platform choices. The artist still decides what to make and publish.",
    image: "/images/launchmuse/tuning-systems-card.png",
    alt: "Existing LaunchMuse content brief titled Explainer: Two Tuning Systems Colliding, with post copy, visual direction, call to action and platforms. This is generated planning output, not evidence of publication or engagement.",
    width: 610,
    height: 736,
  },
] as const;

export const launchBriefFocus = [
  {
    label: "Complete brief",
    top: 0,
    height: 736,
    caption: "Complete existing output capture",
  },
  {
    label: "Post copy",
    top: 32,
    height: 325,
    caption: "Focus crop / existing post copy",
  },
  {
    label: "Execution direction",
    top: 350,
    height: 330,
    caption: "Focus crop / visual direction, call to action and platforms",
  },
] as const;
