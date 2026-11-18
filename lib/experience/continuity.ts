/** Ordered content handoffs. All motion is scoped to these HTML sections. */
export const relaySections = [
  {
    id: "outcomes",
    selector: ".experience-outcomes",
    from: "#f3eee4",
    to: "#f3eee4",
  },
  {
    id: "products",
    selector: ".experience-products",
    from: "#f3eee4",
    to: "#173f3d",
  },
  {
    id: "ai",
    selector: ".experience-ai-proof",
    from: "#173f3d",
    to: "#142f33",
  },
  { id: "work", selector: ".experience-work", from: "#142f33", to: "#f3eee4" },
  {
    id: "impact",
    selector: ".experience-impact",
    from: "#f3eee4",
    to: "#f3eee4",
  },
  {
    id: "toolkit",
    selector: ".experience-toolkit",
    from: "#f3eee4",
    to: "#e7dfcc",
  },
  {
    id: "recommendation",
    selector: ".experience-recommendation",
    from: "#f3eee4",
    to: "#dfc495",
  },
  {
    id: "contact",
    selector: ".experience-contact",
    from: "#f3eee4",
    to: "#142733",
  },
  {
    id: "creative",
    selector: ".experience-creative",
    from: "#142733",
    to: "#dfc495",
  },
  {
    id: "gravity",
    selector: ".experience-gravity-story",
    from: "#dfc495",
    to: "#041018",
  },
  {
    id: "direction",
    selector: ".experience-direction",
    from: "#f3eee4",
    to: "#e7dfcc",
  },
  { id: "film", selector: ".experience-film", from: "#e7dfcc", to: "#142f33" },
  {
    id: "thinking",
    selector: ".experience-thinking",
    from: "#e5e8e1",
    to: "#e5e8e1",
  },
  {
    id: "compass",
    selector: ".experience-compass",
    from: "#e5e8e1",
    to: "#e7dfcc",
  },
] as const;
export type ContinuitySignal = {
  position: number;
  transition: number;
  section: string;
};
export type RelayAnchor = { id: string; y: number };

export function sampleContinuity(
  anchors: readonly RelayAnchor[],
  scrollY: number,
): ContinuitySignal {
  if (anchors.length < 2)
    return { position: 0, transition: 0, section: "opening" };
  const y = Math.max(
    anchors[0].y,
    Math.min(anchors[anchors.length - 1].y, scrollY),
  );
  let i = 0;
  while (i < anchors.length - 2 && y > anchors[i + 1].y) i++;
  const amount = Math.max(
    0,
    Math.min(
      1,
      (y - anchors[i].y) / Math.max(1, anchors[i + 1].y - anchors[i].y),
    ),
  );
  const eased = amount * amount * (3 - 2 * amount);
  return {
    position: i + eased,
    transition: amount,
    section: amount < 0.5 ? anchors[i].id : anchors[i + 1].id,
  };
}

export function renderBudget(width: number, reducedMotion: boolean) {
  return reducedMotion
    ? { particles: 0, fps: 0, dpr: 1 }
    : width < 760
      ? { particles: 720, fps: 30, dpr: 1.25 }
      : { particles: 1700, fps: 60, dpr: 1.5 };
}
