const fps = 24;
const clamp = (progress: number) =>
  Number.isFinite(progress) ? Math.min(1, Math.max(0, progress)) : 0;

export const portraitPhases = {
  look: 0.58,
  exit: 0.66,
  // The last clean look toward the headline, before the montage's pose blend.
  lookFrame: 125,
} as const;

/** Compensate for native section movement only after the look is complete. */
export function portraitHandoffOffset(progress: number, travel: number) {
  if (!Number.isFinite(travel) || travel <= 0) return 0;
  return Math.max(0, clamp(progress) - portraitPhases.look) * travel;
}

/** Enter and look, hold that pose, then take the real walk-out to a clean exit. */
export function portraitTime(progress: number, duration: number) {
  if (!Number.isFinite(duration) || duration <= 0) return 0;
  const last = Math.max(0, Math.round(duration * fps) - 1);
  const look = Math.min(portraitPhases.lookFrame, last);
  const p = clamp(progress);
  const frame =
    p <= portraitPhases.look
      ? (p / portraitPhases.look) * look
      : p <= portraitPhases.exit
        ? look
        : look +
          ((p - portraitPhases.exit) / (1 - portraitPhases.exit)) *
            (last - look);
  return Math.round(frame) / fps;
}

type Media = Pick<
  HTMLVideoElement,
  "currentTime" | "duration" | "readyState" | "seeking" | "pause"
> & {
  addEventListener(type: string, listener: () => void): void;
  removeEventListener(type: string, listener: () => void): void;
};
type Frames = {
  request(callback: () => void): number;
  cancel(handle: number): void;
};

/** Keep only the newest scroll target and let an in-flight seek finish first. */
export function createPortraitScrubber(
  media: Media,
  frames: Frames,
  onFailure: () => void,
) {
  let progress = 0,
    active = false,
    disposed = false,
    hasSought = false,
    pending: number | null = null;
  const flush = () => {
    pending = null;
    if (
      !active ||
      disposed ||
      media.readyState < 1 ||
      media.seeking ||
      !Number.isFinite(media.duration) ||
      media.duration <= 0
    )
      return;
    const target = portraitTime(progress, media.duration);
    if (hasSought && Math.abs(target - media.currentTime) < 0.5 / fps) return;
    try {
      // A tiny initial seek also paints frame zero on paused mobile video.
      media.currentTime = hasSought ? target : Math.max(0.001, target);
      hasSought = true;
    } catch {
      onFailure();
    }
  };
  const schedule = () => {
    if (active && !disposed && pending === null)
      pending = frames.request(flush);
  };
  const events = ["loadedmetadata", "loadeddata", "seeked"] as const;
  for (const event of events) media.addEventListener(event, schedule);
  media.pause();
  return {
    setProgress(value: number) {
      progress = clamp(value);
      schedule();
    },
    setActive(value: boolean) {
      active = value;
      media.pause();
      if (active) schedule();
      else if (pending !== null) {
        frames.cancel(pending);
        pending = null;
      }
    },
    dispose() {
      disposed = true;
      if (pending !== null) frames.cancel(pending);
      for (const event of events) media.removeEventListener(event, schedule);
      media.pause();
    },
  };
}
