"use client";

import {
  motion,
  useInView,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";
import { useFormationProgress } from "./useFormationProgress";

const marks = Array.from({ length: 144 }, (_, i) => {
  const lane = i % 3;
  const step = Math.floor(i / 3) / 47;
  const x = 60 + step * 430;
  const y = 210 + (lane - 1) * 100 * Math.pow(1 - step, 2);
  return { x, y, sx: 35 + ((i * 137) % 530), sy: 35 + ((i * 83) % 340), lane };
});

function Signal({
  mark,
  progress,
  index,
}: {
  mark: (typeof marks)[number];
  progress: MotionValue<number>;
  index: number;
}) {
  const cx = useTransform(progress, [0, 1], [mark.sx, mark.x]);
  const cy = useTransform(progress, [0, 1], [mark.sy, mark.y]);
  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={index % 8 === 0 ? 2.5 : 1.4}
      className={`clarity-mark clarity-mark-${mark.lane}`}
    />
  );
}

export default function ClarityField({
  quiet,
  paused,
}: {
  quiet: boolean;
  paused: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true });
  const { progress, replay } = useFormationProgress(visible, quiet, paused);
  const lineOpacity = useTransform(progress, [0.35, 1], [0, 0.65]);
  return (
    <div className="experience-clarity-field" ref={ref}>
      <svg viewBox="0 0 600 420" fill="none" aria-hidden="true">
        <circle cx="300" cy="210" r="176" className="clarity-guide" />
        <circle
          cx="300"
          cy="210"
          r="125"
          className="clarity-guide"
          strokeDasharray="2 12"
        />
        <motion.path
          d="M60 110 Q240 208 490 210 M60 210H490 M60 310 Q240 212 490 210 L470 196 M490 210L470 224"
          className="clarity-route"
          style={{ opacity: lineOpacity }}
        />
        {marks.map((mark, i) => (
          <Signal key={i} mark={mark} index={i} progress={progress} />
        ))}
      </svg>
      {!quiet && (
        <button disabled={paused} onClick={replay}>
          Find a direction <span aria-hidden="true">↗</span>
        </button>
      )}
    </div>
  );
}
