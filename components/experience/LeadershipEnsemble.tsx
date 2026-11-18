"use client";

import {
  motion,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState, type RefObject } from "react";
import { ArrowDown, RotateCcw } from "lucide-react";
import {
  ensembleParts,
  ensemblePlayers,
  scoreNoteFrame,
  scoreSequenceFrame,
  type ScoreBox,
} from "@/lib/experience/score-sequence";

const initialGeometry = {
  width: 1000,
  height: 680,
  mobile: false,
  orchestra: { x: 480, y: 180, width: 480, height: 246 },
  folio: { x: 40, y: 200, width: 920, height: 388 },
};
const colors = [
  [223, 196, 149],
  [237, 153, 131],
  [243, 238, 228],
  [156, 191, 180],
];
const inks = [
  [124, 96, 64],
  [161, 72, 53],
  [23, 63, 61],
  [23, 63, 61],
];
function ink(part: number, settle: number) {
  const t = Math.max(0, Math.min(1, settle * 2));
  return `rgb(${colors[part].map((v, i) => Math.round(v + (inks[part][i] - v) * t)).join(",")})`;
}

/** One screen and one set of notes, from independent parts to the real pages. */
export default function LeadershipEnsemble({
  progress,
  enabled,
  paused,
  stage,
  folio,
  seek,
}: {
  progress: MotionValue<number>;
  enabled: boolean;
  paused: boolean;
  stage: RefObject<HTMLDivElement | null>;
  folio: RefObject<HTMLDivElement | null>;
  seek: (value: number) => void;
}) {
  const placement = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(progress.get());
  const [geometry, setGeometry] = useState(initialGeometry);
  useMotionValueEvent(progress, "change", (value) => setPosition(value));
  const backdrop = useTransform(progress, [0.29, 0.54], ["#173f3d", "#f3eee4"]);
  const captionInk = useTransform(
    progress,
    [0.29, 0.54],
    ["#dfc495", "#6d5837"],
  );
  const opacity = useTransform(
    progress,
    (p) => scoreSequenceFrame(p).orchestra,
  );
  useEffect(() => {
    const host = stage.current,
      field = placement.current,
      target = folio.current;
    if (!enabled || !host || !field || !target) return;
    const measure = () => {
      const r = host.getBoundingClientRect();
      const box = (element: HTMLElement): ScoreBox => {
        const b = element.getBoundingClientRect();
        return {
          x: b.left - r.left,
          y: b.top - r.top,
          width: b.width,
          height: b.height,
        };
      };
      setGeometry({
        width: host.clientWidth,
        height: host.clientHeight,
        mobile: innerWidth < 760,
        orchestra: box(field),
        folio: box(target),
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(host);
    observer.observe(field);
    observer.observe(target);
    measure();
    return () => observer.disconnect();
  }, [enabled, folio, stage]);
  const frame = scoreSequenceFrame(position);
  if (!enabled)
    return (
      <div className="score-reading-intro">
        <p className="experience-home-eyebrow">A composer’s instinct</p>
        <h2 id="experience-ensemble-heading">
          Different parts. <em>Shared direction.</em>
        </h2>
        <p>
          I bring people around a shared purpose, with room for what each
          discipline contributes.
        </p>
      </div>
    );
  const active = frame.orchestra > 0.05;
  return (
    <>
      <motion.div
        className="score-stage-backdrop"
        style={{ backgroundColor: backdrop }}
        aria-hidden="true"
      />
      <motion.div
        className="score-orchestra-intro"
        style={{ opacity, pointerEvents: active ? "auto" : "none" }}
        aria-hidden={!active}
      >
        <div className="experience-ensemble">
          <div className="experience-ensemble-copy">
            <p className="experience-home-eyebrow">A composer’s instinct</p>
            <h2 id="experience-ensemble-heading">
              Different parts.
              <br />
              <em>Shared direction.</em>
            </h2>
            <p>
              I bring people around a shared purpose, with room for what each
              discipline contributes.
            </p>
            <a href="#experience-work" tabIndex={active ? 0 : -1}>
              Open the score <ArrowDown size={16} aria-hidden="true" />
            </a>
          </div>
          <div className="experience-ensemble-instrument">
            <div ref={placement} className="score-orchestra-space" />
            <div
              className="ensemble-parts"
              aria-label="Four distinct disciplines"
            >
              {ensembleParts.map((part, i) => (
                <span className={`ensemble-part-${i}`} key={part}>
                  <i aria-hidden="true" />
                  {part}
                </span>
              ))}
            </div>
            <div className="ensemble-controls">
              <label htmlFor="ensemble-alignment">Scroll to compose</label>
              <input
                id="ensemble-alignment"
                aria-label="Orchestra scroll progress"
                aria-valuetext={
                  frame.progress < 0.3
                    ? "Bringing the parts together"
                    : frame.progress < 0.94
                      ? "Unfolding the score"
                      : "Score ready"
                }
                type="range"
                min="0"
                max="100"
                value={Math.round(position * 100)}
                disabled={paused || !active}
                tabIndex={active ? 0 : -1}
                onChange={(e) => seek(Number(e.target.value) / 100)}
              />
              <button
                disabled={paused || !active}
                tabIndex={active ? 0 : -1}
                aria-label="Replay the orchestra by scrolling to its start"
                onClick={() => seek(0)}
              >
                <RotateCcw size={15} aria-hidden="true" />
                Replay
              </button>
            </div>
          </div>
        </div>
      </motion.div>
      <svg
        className="score-flying-notes"
        viewBox={`0 0 ${geometry.width} ${geometry.height}`}
        aria-hidden="true"
        fill="none"
      >
        <g
          transform={`translate(${geometry.orchestra.x} ${geometry.orchestra.y}) scale(${geometry.orchestra.width / 800} ${geometry.orchestra.height / 410})`}
          opacity={frame.orchestra}
        >
          <g className="ensemble-score">
            {[140, 186, 232, 278].map((r) => (
              <path
                key={r}
                d={`M${400 - r} 360 A${r} ${r} 0 0 1 ${400 + r} 360`}
              />
            ))}
            <path d="M400 50V320" strokeDasharray="2 9" />
          </g>
          <g
            className="ensemble-baton"
            transform={`rotate(${-35 * frame.gather} 400 365)`}
          >
            <path d="M400 365L433 315" />
            <circle cx="400" cy="365" r="11" />
          </g>
        </g>
        {ensemblePlayers.map((player, i) => {
          const note = scoreNoteFrame(
            position,
            player,
            geometry.orchestra,
            geometry.folio,
            geometry.mobile,
          );
          return (
            <g
              key={i}
              className="score-transfer-note"
              transform={`translate(${note.x} ${note.y}) rotate(${note.rotate}) scale(${note.scale})`}
              opacity={note.opacity}
              style={{ color: ink(player.part, note.settle) }}
            >
              <circle r="7" />
              <path d="M6 0V-22Q15-22 15-12" />
            </g>
          );
        })}
      </svg>
      {!frame.ready && (
        <motion.p
          className="score-overture-caption"
          style={{ color: captionInk }}
        >
          {position < 0.3
            ? "Scroll to bring the parts together."
            : position < 0.55
              ? "One shared direction. Keep scrolling to open the score."
              : position < 0.9
                ? "The pages unfold. Each part finds its place."
                : "A score the team can carry forward."}
        </motion.p>
      )}
    </>
  );
}
