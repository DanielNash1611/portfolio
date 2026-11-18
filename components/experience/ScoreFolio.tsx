"use client";

import Image from "next/image";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { scoreSequenceFrame } from "@/lib/experience/score-sequence";

function FolioImage({
  blank = false,
  backing = false,
}: {
  blank?: boolean;
  backing?: boolean;
}) {
  const name = backing ? "folio-backing" : blank ? "folio-blank" : "folio";
  return (
    <picture style={{ position: "absolute", inset: 0 }}>
      <source
        media="(max-width: 759px)"
        srcSet={`/images/experience/score-folio/${name}-mobile.webp`}
      />
      <Image
        src={`/images/experience/score-folio/${name}-desktop.webp`}
        alt=""
        fill
        sizes="(max-width:759px) 95vw,90vw"
        unoptimized
      />
    </picture>
  );
}

/** Empty backing stays still while real paper panels unfold above it. */
export default function ScoreFolio({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, (p) => scoreSequenceFrame(p).surface);
  return (
    <motion.div
      className="score-folio-art"
      style={{ opacity }}
      aria-hidden="true"
    >
      <FolioImage backing />
    </motion.div>
  );
}

export function ScorePageArtwork({
  index,
  progress,
}: {
  index: number;
  progress: MotionValue<number>;
}) {
  const ink = useTransform(progress, (p) => scoreSequenceFrame(p).engraving);
  return (
    <span className="score-page-art" data-leaf={index} aria-hidden="true">
      <FolioImage blank />
      <motion.span className="score-page-engraving" style={{ opacity: ink }}>
        <FolioImage />
      </motion.span>
    </span>
  );
}
