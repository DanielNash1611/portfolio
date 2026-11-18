import styles from "./scroll-story.module.css";

export type StoryKind =
  | "gravity"
  | "astra"
  | "coals"
  | "tabletop"
  | "signals"
  | "seeker";

export default function StoryGraphic({
  kind,
  stage,
  count,
}: {
  kind: StoryKind;
  stage: number;
  count: number;
}) {
  const progress = (stage + 1) / count;
  return (
    <svg
      viewBox="0 0 400 310"
      aria-hidden="true"
      focusable="false"
      className={styles.svg}
      data-stage={stage}
    >
      {kind === "gravity" && (
        <>
          <text x="200" y="25" textAnchor="middle">
            A fixed center. Independent paths.
          </text>
          {[65, 95, 120].map((radius, index) => (
            <g
              key={radius}
              className={styles.orbit}
              style={{
                animationDuration: `${19 + index * 13}s`,
                opacity: stage >= index ? 1 : 0.2,
              }}
            >
              <ellipse
                cx="200"
                cy="150"
                rx={radius}
                ry={radius * 0.58}
                fill="none"
                stroke="currentColor"
                opacity=".3"
                transform={`rotate(${index * 38} 200 150)`}
              />
              <circle
                cx={200 + radius}
                cy="150"
                r={5 + index}
                fill="currentColor"
              />
            </g>
          ))}
          <path
            d="M198 110 C174 122 186 145 180 158 C163 184 178 210 200 210 C224 210 237 184 220 158 C214 145 226 122 202 110 M200 82 V234 M193 82 H207"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <text x="200" y="270" textAnchor="middle">
            CELLO / GRAVITATIONAL CENTER
          </text>
        </>
      )}
      {kind === "astra" && (
        <>
          <text x="200" y="25" textAnchor="middle">
            Make the interaction visible.
          </text>
          <path
            className={styles.draw}
            key={stage}
            d="M65 150 H150 Q175 150 175 175 T225 175 Q225 150 250 150 H335"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          {[70, 200, 330].map((x, i) => (
            <g key={x} opacity={i <= Math.min(stage, 2) ? 1 : 0.28}>
              <circle
                cx={x}
                cy="150"
                r="30"
                fill="var(--story-surface)"
                stroke="currentColor"
              />
              <circle
                cx={x}
                cy="150"
                r="20"
                fill="none"
                stroke="currentColor"
                strokeDasharray={i === 0 ? "4 5" : undefined}
              />
              <text x={x} y="222" textAnchor="middle">
                {["TARGET", "HOLD", "RELEASE"][i]}
              </text>
            </g>
          ))}
          <path
            d="M200 95 V64 M188 77 L200 64 L212 77"
            fill="none"
            stroke="currentColor"
          />
          <text x="200" y="275" textAnchor="middle">
            VISIBLE FEEDBACK / DIRECT CONTROL
          </text>
        </>
      )}
      {kind === "coals" && (
        <>
          <text x="200" y="25" textAnchor="middle">
            An album shaped as a cycle.
          </text>
          <path
            d="M15 125 H155 M285 125 H385"
            fill="none"
            stroke="currentColor"
            opacity=".4"
          />
          <path
            d="M155 125 V252 H285 V125"
            fill="none"
            stroke="currentColor"
            opacity=".4"
          />
          <path
            d="M33 126 L53 65 L73 126 M43 95 H64 M53 65 V110"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            className={styles.coalGlow}
            d="M96 123 l8 -10 8 10 8 -10 8 10 8 -10 8 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            d="M55 115 C85 80 110 95 133 117 S170 180 190 225 S240 260 260 205 S285 108 325 102 S375 120 361 155"
            fill="none"
            stroke="currentColor"
            opacity=".2"
            strokeWidth="3"
          />
          <path
            className={styles.chapterPath}
            pathLength="1"
            strokeDasharray={`${progress} 1`}
            d="M55 115 C85 80 110 95 133 117 S170 180 190 225 S240 260 260 205 S285 108 325 102 S375 120 361 155"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
          {[
            [55, 115],
            [110, 100],
            [140, 125],
            [175, 185],
            [216, 246],
            [268, 182],
            [326, 103],
            [361, 155],
          ].map(([x, y], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={i === stage ? 8 : 3}
              fill="currentColor"
              opacity={i === stage ? 1 : 0.3}
            />
          ))}
          <text x="200" y="291" textAnchor="middle">
            REPETITION → RISK → RECOVERY → CHOICE
          </text>
        </>
      )}
      {kind === "tabletop" && (
        <>
          <text x="200" y="25" textAnchor="middle">
            The storyteller keeps the final say.
          </text>
          {[90, 140, 190].map((y, i) => (
            <g key={y} opacity={stage === 0 || stage > i ? 1 : 0.25}>
              <path d={`M35 ${y} H365`} stroke="currentColor" opacity=".3" />
              <path
                className={styles.draw}
                key={`${stage}-${i}`}
                d={`M35 ${y} C85 ${y - 26 - i * 7} 115 ${y + 26} 160 ${y} S240 ${y - 20} 280 ${y} S335 ${y + 16} 365 ${y}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </g>
          ))}
          <path
            d="M200 57 V221"
            stroke="currentColor"
            strokeDasharray="3 5"
            opacity=".5"
          />
          <circle cx="200" cy="140" r="8" fill="currentColor" />
          <text x="75" y="251" textAnchor="middle">
            CALM
          </text>
          <text x="200" y="251" textAnchor="middle">
            DRAMATIC
          </text>
          <text x="325" y="251" textAnchor="middle">
            INTENSE
          </text>
          <text x="200" y="287" textAnchor="middle">
            AUTHORED MUSIC / GM CONTROL
          </text>
        </>
      )}
      {kind === "signals" && (
        <>
          <text x="200" y="25" textAnchor="middle">
            Different systems coexist.
          </text>
          {[
            [80, "CHINESE TUNING"],
            [150, "JUST INTONATION"],
            [220, "BLINK / EXPRESSION"],
          ].map(([y, label], i) => (
            <g key={label} opacity={stage === i ? 1 : 0.35}>
              <text x="20" y={Number(y) - 22}>
                {label}
              </text>
              <path
                className={styles.draw}
                key={`${stage}-${i}`}
                d={`M20 ${y} l22 -10 22 16 22 -25 22 13 22 -4 22 10 22 -17 22 13 H280`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d={`M280 ${y} L340 150`}
                fill="none"
                stroke="currentColor"
                opacity=".4"
              />
            </g>
          ))}
          <circle
            cx="340"
            cy="150"
            r="21"
            fill="var(--story-surface)"
            stroke="currentColor"
          />
          <text x="200" y="287" textAnchor="middle">
            PURE DATA → MUSICAL BEHAVIOR
          </text>
        </>
      )}
      {kind === "seeker" && (
        <>
          <text x="200" y="25" textAnchor="middle">
            From a reference to an experiment.
          </text>
          <path
            className={styles.draw}
            key={stage}
            d="M65 90 H200 V155 H335 V220 H65"
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
          />
          {[
            [65, 90, "REFERENCE"],
            [200, 155, "CONTEXT"],
            [335, 220, "STARTING POINT"],
          ].map(([x, y, label], i) => (
            <g key={label} opacity={i <= stage ? 1 : 0.25}>
              <circle
                cx={x}
                cy={y}
                r="18"
                fill="var(--story-surface)"
                stroke="currentColor"
              />
              <text
                x={x === 335 ? 310 : x}
                y={Number(y) + 37}
                textAnchor="middle"
              >
                {label}
              </text>
            </g>
          ))}
          <text x="200" y="292" textAnchor="middle">
            LISTEN / ADJUST / VERIFY
          </text>
        </>
      )}
    </svg>
  );
}
