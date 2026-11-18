"use client";

import { animate, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/** One finite reveal; replay and pause share the same cancellable animation. */
export function useFormationProgress(
  visible: boolean,
  quiet: boolean,
  paused = false,
) {
  const progress = useMotionValue(1);
  const [revision, setRevision] = useState(0);
  const played = useRef(-1);
  useEffect(() => {
    if (quiet) {
      progress.set(1);
      return;
    }
    if (!visible || paused) return;
    if (played.current !== revision) {
      progress.set(0);
      played.current = revision;
    }
    const control = animate(progress, 1, {
      duration: 2.2,
      delay: 0.2,
      ease: [0.22, 0.7, 0.2, 1],
    });
    return () => control.stop();
  }, [visible, quiet, paused, revision, progress]);
  return { progress, replay: () => setRevision((value) => value + 1) };
}
