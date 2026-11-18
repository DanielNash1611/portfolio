import { recommendationFrame } from "./scroll-stories";

const clamp = (n: number) => Math.max(0, Math.min(1, n));
const smooth = (a: number, b: number, n: number) => {
  const t = clamp((n - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const referralPhases = {
  reading: 0.06,
  sorting: 0.62,
  grouped: 0.88,
} as const;
export const referralFeaturedCount = 3;
export function referralRingFrame(progress: number, count: number) {
  const p = clamp(progress);
  // Rotate through the three featured voices, then gather every card. The rest
  // remain directly available in the category browser instead of a long reel.
  const reading = recommendationFrame(
    (p - referralPhases.reading) / 0.53,
    Math.min(referralFeaturedCount, count),
  );
  return {
    ...reading,
    gather: smooth(referralPhases.sorting, referralPhases.grouped, p),
    opening: 1 - smooth(0, referralPhases.reading, p),
    phase:
      p < referralPhases.reading
        ? "overview"
        : p < referralPhases.sorting
          ? "reading"
          : p < referralPhases.grouped
            ? "sorting"
            : "grouped",
  } as const;
}
export type ReferralSlot = { group: number; rank: number };
export type ReferralGroupLayout = { x: number; y: number; width: number };
export type ReferralLayout = {
  width: number;
  height: number;
  compact: boolean;
  cardWidth: number;
  cardHeight: number;
  radius: number;
  rise: number;
  groups: ReferralGroupLayout[];
  groupCardWidth: number;
  groupCardHeight: number;
};

export function referralLayout(
  width: number,
  height: number,
  groupSizes: readonly number[],
): ReferralLayout {
  const compact = width < 900;
  const gap = compact ? 12 : 16;
  const columns = compact ? 2 : Math.max(1, groupSizes.length);
  const groupWidth = (width - gap * (columns - 1)) / columns;
  const rows = Math.ceil(groupSizes.length / columns);
  const rowHeight = height / rows;
  const maxCount = Math.max(1, ...groupSizes);
  return {
    width,
    height,
    compact,
    cardWidth: compact
      ? Math.min(width > 500 ? 420 : 300, width - 24)
      : Math.min(540, width * 0.52),
    cardHeight: compact
      ? Math.min(330, height - 44)
      : Math.min(340, height - 50),
    radius: compact
      ? Math.min(width > 500 ? 270 : 155, width * 0.43)
      : Math.min(390, width * 0.34),
    rise: compact ? 65 : 80,
    groups: groupSizes.map((_, i) => ({
      x: (i % columns) * (groupWidth + gap),
      y: Math.floor(i / columns) * rowHeight,
      width: groupWidth,
    })),
    groupCardWidth: compact ? groupWidth - 16 : groupWidth,
    groupCardHeight: compact
      ? Math.min(62, rowHeight - 70)
      : Math.min(74, (height - 78 - (maxCount - 1) * 8) / maxCount),
  };
}

/** The same physical card moves from the ring into its category. All coordinates
 * are relative to the center of the semantic HTML scene; no renderer is needed. */
export function referralCardPose(
  progress: number,
  index: number,
  count: number,
  slot: ReferralSlot,
  layout: ReferralLayout,
) {
  const frame = referralRingFrame(progress, count);
  const rawAngle =
    (index - frame.position) * (360 / Math.max(1, count)) - frame.opening * 7;
  const angle = ((((rawAngle + 180) % 360) + 360) % 360) - 180;
  const radians = (angle * Math.PI) / 180;
  const radius = layout.radius * (1 + frame.opening * 0.08);
  const group = layout.groups[slot.group] ?? layout.groups[0];
  const cardWidth = mix(layout.cardWidth, layout.groupCardWidth, frame.gather);
  const cardHeight = mix(
    layout.cardHeight,
    layout.groupCardHeight,
    frame.gather,
  );
  const groupX =
    group.x +
    group.width / 2 +
    (layout.compact ? slot.rank * 2 : 0) -
    layout.width / 2;
  const groupY =
    group.y +
    (layout.compact ? 42 : 72) +
    layout.groupCardHeight / 2 +
    slot.rank * (layout.compact ? 8 : layout.groupCardHeight + 8) -
    layout.height / 2;
  const x = mix(Math.sin(radians) * radius, groupX, frame.gather);
  const y = mix(
    -(1 - Math.cos(radians)) * layout.rise + layout.height * 0.06,
    groupY,
    frame.gather,
  );
  const z = mix(
    (Math.cos(radians) - 1) * radius,
    layout.compact ? -slot.rank * 3 : 0,
    frame.gather,
  );
  return {
    x: x - cardWidth / 2,
    y: y - cardHeight / 2,
    z,
    // Turn toward the camera while orbiting, keeping the quote faces readable.
    rotateY: Math.sin(radians) * 38 * (1 - frame.gather),
    rotateZ: Math.sin(radians) * 2 * (1 - frame.gather),
    width: cardWidth,
    height: cardHeight,
    fullOpacity: 1 - smooth(0, 0.48, frame.gather),
    summaryOpacity: smooth(0.32, 0.72, frame.gather),
    bodyOpacity: mix(
      1 - smooth(10, 65, Math.abs(angle)) * 0.85,
      1,
      frame.gather,
    ),
    deckOpacity:
      smooth(65, 115, Math.abs(angle)) * (1 - smooth(0, 0.4, frame.gather)),
  };
}
