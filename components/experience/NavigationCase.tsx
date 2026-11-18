"use client";

import Image from "next/image";
import { motion, useTransform, type MotionValue } from "framer-motion";

function CaseImage({ backing = false }: { backing?: boolean }) {
  return (
    <picture style={{ position: "absolute", inset: 0 }}>
      <source
        media="(max-width:759px)"
        srcSet={`/images/experience/navigation-case/${backing ? "case-backing-mobile" : "case-mobile"}.webp`}
      />
      <Image
        src={`/images/experience/navigation-case/${backing ? "case-backing-desktop" : "case-base"}.webp`}
        alt=""
        fill
        sizes="(max-width:759px) 95vw,90vw"
        className="navigation-case-art"
        unoptimized
      />
    </picture>
  );
}

function Route({
  progress,
  lid = false,
}: {
  progress: MotionValue<number>;
  lid?: boolean;
}) {
  const reveal = useTransform(
    progress,
    [0.06, 0.94],
    ["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
  );
  return (
    <motion.div
      className={`navigation-route ${lid ? "navigation-lid-route" : "navigation-chart-route"}`}
      style={{ clipPath: reveal }}
    >
      <Image
        src="/images/experience/navigation-case/route-overlay.webp"
        alt=""
        width={2172}
        height={724}
        unoptimized
      />
    </motion.div>
  );
}

/** The case stays fixed; its original map leaves hinge independently above it. */
export default function NavigationCase({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const bearing = useTransform(progress, [0, 0.18], [-100, 0]);
  return (
    <div className="navigation-case-shell" aria-hidden="true">
      <CaseImage backing />
      <div className="navigation-compass-position">
        <motion.div
          className="navigation-compass-needle"
          style={{ rotate: bearing }}
        >
          <Image
            src="/images/experience/navigation-case/compass-needle.webp"
            alt=""
            fill
            sizes="(max-width:759px) 90px,180px"
            unoptimized
          />
        </motion.div>
      </div>
      <Route progress={progress} lid />
    </div>
  );
}

export function MapPageArtwork({
  index,
  progress,
}: {
  index: number;
  progress: MotionValue<number>;
}) {
  return (
    <span className="navigation-page-art" data-leaf={index} aria-hidden="true">
      <span className="navigation-page-canvas">
        <CaseImage />
        <Route progress={progress} />
      </span>
    </span>
  );
}
