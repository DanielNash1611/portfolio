const positive = (value: number) =>
  Number.isFinite(value) ? Math.max(0, value) : 0;

/** Reach the bottom, then hold the full-size card for another scroll beat. */
export function outcomeReadingRange(paperHeight: number, windowHeight: number) {
  const shift = Math.max(0, positive(paperHeight) - positive(windowHeight));
  // The reader is shorter than the browser viewport. Leave enough travel for
  // a page-sized scroll to land on the final actions before returning the card.
  const hold = Math.max(640, positive(windowHeight) * 1.25);
  return { shift, distance: shift + hold };
}

export function outcomeReadingFrame(
  scrollY: number,
  start: number,
  distance: number,
  shift: number,
) {
  const progress = Math.min(
    1,
    Math.max(0, (scrollY - start) / Math.max(1, distance)),
  );
  return {
    progress,
    y: -Math.min(positive(shift), Math.max(0, scrollY - start)) || 0,
    finished: progress >= 1,
  };
}

/** Keep the collection pinned briefly after return without moving the page. */
export function outcomeRestTravel(
  scrollY: number,
  stageStart: number,
  stageHeight: number,
) {
  return (
    Math.max(0, scrollY - stageStart) +
    Math.max(360, positive(stageHeight) * 0.65)
  );
}

/** Browser chrome reduces laptop content height well below the screen height. */
export function canPinCardCollection(viewportHeight: number) {
  return Number.isFinite(viewportHeight) && viewportHeight >= 600;
}
