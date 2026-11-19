const clamp = (value: number) =>
  Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
const ease = (value: number, from: number, to: number) => {
  const t = clamp((value - from) / (to - from));
  return t * t * (3 - 2 * t);
};

/** Fully gathered, still visible, before the score transfer starts. */
export const orchestraFormationProgress = 0.28;

/** The folio cannot unfold until the orchestra has arrived and gathered. */
export function scoreSequenceFrame(progress: number) {
  const p = clamp(progress);
  return {
    progress: p,
    gather: ease(p, 0.03, orchestraFormationProgress),
    orchestra: 1 - ease(p, 0.3, 0.46),
    surface: ease(p, 0.32, 0.45),
    heading: ease(p, 0.44, 0.6),
    engraving: ease(p, 0.9, 0.995),
    ready: p >= 0.995,
  };
}

export function scoreLeafFrame(progress: number, index: number) {
  const p = clamp(progress);
  const timing = [
    [0.56, 0.77],
    [0.4, 0.61],
    [0.73, 0.94],
  ][index] ?? [0.73, 0.94];
  const amount = ease(p, timing[0], timing[1]);
  return {
    amount,
    opacity: ease(amount, 0, 0.12),
    rotateX: (index === 1 ? -84 * (1 - amount) : 0) || 0,
    rotateY: (index === 1 ? 0 : (index === 0 ? 84 : -84) * (1 - amount)) || 0,
    origin: index === 0 ? "100% 50%" : index === 1 ? "50% 100%" : "0% 50%",
  };
}

export const ensembleParts = ["Product", "Design", "Engineering", "Operations"];
export const ensemblePlayers = ensembleParts.flatMap((_, part) =>
  Array.from({ length: 13 }, (_, i) => {
    const angle = Math.PI * (1.08 + (i / 12) * 0.84);
    const radius = 140 + part * 46;
    return {
      part,
      note: i,
      x: 400 + Math.cos(angle) * radius,
      y: 360 + Math.sin(angle) * radius,
      sx: 95 + ((i * 173 + part * 61) % 610),
      sy: 50 + ((i * 97 + part * 83) % 265),
      seed: (i * 0.37 + part * 0.63) % 2,
    };
  }),
);

export type ScoreBox = { x: number; y: number; width: number; height: number };

/** One conserved note moves from its independent part to its printed staff. */
export function scoreNoteFrame(
  progress: number,
  player: (typeof ensemblePlayers)[number],
  orchestra: ScoreBox,
  folio: ScoreBox,
  mobile: boolean,
) {
  const frame = scoreSequenceFrame(progress);
  const x = player.sx + (player.x - player.sx) * frame.gather;
  const y = player.sy + (player.y - player.sy) * frame.gather;
  const fraction = 0.095 + (player.note / 12) * 0.8;
  const leaf = fraction < 0.352 ? 0 : fraction < 0.64 ? 1 : 2;
  const from = [0.7, 0.55, 0.84][leaf];
  const settle = ease(frame.progress, from, Math.min(0.985, from + 0.145));
  const sourceX = orchestra.x + (x / 800) * orchestra.width;
  const originalY = orchestra.y + (y / 410) * orchestra.height;
  const bandY =
    folio.y +
    folio.height *
      (mobile ? 0.746 + player.part * 0.029 : 0.574 + player.part * 0.065);
  const sourceY =
    originalY + (bandY - originalY) * ease(frame.progress, 0.35, 0.52);
  const targetX = folio.x + folio.width * fraction;
  const targetY =
    folio.y +
    folio.height *
      (mobile ? 0.746 + player.part * 0.029 : 0.574 + player.part * 0.065);
  return {
    x: sourceX + (targetX - sourceX) * settle,
    y:
      sourceY +
      (targetY - sourceY) * settle -
      Math.sin(settle * Math.PI) * Math.min(18, folio.height * 0.04),
    scale:
      (orchestra.width / 800) * (1 - settle) +
      (folio.width / (mobile ? 1600 : 2400)) * settle,
    rotate: (1 - frame.gather) * (player.seed * 60 - 30) * (1 - settle) || 0,
    settle,
    opacity: 1 - frame.engraving,
  };
}

export function scoreOvertureTravel(stageHeight: number) {
  return Number.isFinite(stageHeight)
    ? Math.max(860, Math.min(1300, stageHeight * 1.7))
    : 1000;
}
