"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { MotionValue } from "framer-motion";
import { createPortraitScrubber } from "@/lib/experience/portrait-scroll";

const poster = "/videos/experience/personality/daniel-intro-still.webp";
const footage = "/videos/experience/personality/daniel-intro-enter-exit.mp4";

export default function PersonalityPortrait({
  motionEnabled,
  progress,
  onUnavailable,
}: {
  motionEnabled: boolean;
  progress: MotionValue<number>;
  onUnavailable: () => void;
}) {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const scrubber = useRef<ReturnType<typeof createPortraitScrubber> | null>(
    null,
  );
  const [visible, setVisible] = useState(false);
  const [foreground, setForeground] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [hasFrame, setHasFrame] = useState(false);
  const [failed, setFailed] = useState(false);
  const active = motionEnabled && visible && foreground && !failed;
  const unavailable = useCallback(() => {
    setFailed(true);
    onUnavailable();
  }, [onUnavailable]);

  useEffect(() => {
    const updateVisibility = () => setForeground(!document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.15 },
    );
    if (root.current) observer.observe(root.current);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  // Reduced motion and reading mode never request the video on initial load.
  useEffect(() => {
    if (active) setLoaded(true);
  }, [active]);

  useEffect(() => {
    const element = video.current;
    if (!element || failed) return;
    const controller = createPortraitScrubber(
      element,
      {
        request: (callback) => requestAnimationFrame(callback),
        cancel: (handle) => cancelAnimationFrame(handle),
      },
      unavailable,
    );
    scrubber.current = controller;
    controller.setProgress(progress.get());
    const unsubscribe = progress.on("change", controller.setProgress);
    return () => {
      unsubscribe();
      controller.dispose();
      scrubber.current = null;
    };
  }, [loaded, failed, progress, unavailable]);

  useEffect(() => {
    scrubber.current?.setActive(active);
  }, [active, loaded]);

  useEffect(() => {
    const element = video.current;
    return () => {
      element?.pause();
      element?.removeAttribute("src");
      element?.load();
    };
  }, [loaded, failed]);

  return (
    <figure
      ref={root}
      className="experience-personality-media"
      data-video-visible={motionEnabled && hasFrame && !failed}
      data-video-state={failed ? "unavailable" : active ? "scroll" : "still"}
    >
      <Image
        src={poster}
        alt="Daniel Nash in a full-body portrait."
        width={400}
        height={520}
        unoptimized
        priority
        sizes="(max-width: 759px) 30vw, (max-width: 1100px) 34vw, 380px"
      />
      {loaded && !failed ? (
        <video
          ref={video}
          src={footage}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          aria-hidden="true"
          tabIndex={-1}
          onSeeked={() => {
            if (!hasFrame) setHasFrame(true);
          }}
          onError={unavailable}
        />
      ) : null}
      <figcaption>
        {motionEnabled
          ? "Scroll to move"
          : "Direction. Working products. Lasting capability."}
      </figcaption>
    </figure>
  );
}
