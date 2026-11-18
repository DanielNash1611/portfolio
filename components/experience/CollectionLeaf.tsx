"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import type { ReactNode } from "react";
import { mapLeafFrame } from "@/lib/experience/map-unfold";
import { scoreLeafFrame } from "@/lib/experience/score-sequence";

export default function CollectionLeaf({
  children,
  index,
  progress,
  kind,
}: {
  children: ReactNode;
  index: number;
  progress: MotionValue<number>;
  kind?: "score" | "map";
}) {
  const frame = kind === "map" ? mapLeafFrame : scoreLeafFrame;
  const rotateX = useTransform(progress, (p) => frame(p, index).rotateX);
  const rotateY = useTransform(progress, (p) => frame(p, index).rotateY);
  const opacity = useTransform(progress, (p) => frame(p, index).opacity);
  if (!kind) return <>{children}</>;
  return (
    <motion.div
      className={kind === "map" ? "navigation-leaf-cell" : "score-leaf-cell"}
      data-leaf={index}
      style={{
        rotateX,
        rotateY,
        opacity,
        transformOrigin: frame(1, index).origin,
      }}
    >
      {children}
    </motion.div>
  );
}
