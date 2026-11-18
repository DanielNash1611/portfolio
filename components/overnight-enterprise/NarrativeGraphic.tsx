"use client";

export type GraphicKind = "pilot" | "organization" | "oms";

/** Authored explanatory diagrams: no fabricated product UI or quantitative charts. */
export default function NarrativeGraphic({
  kind,
  active,
}: {
  kind: GraphicKind;
  active: number;
}) {
  const position = [65, 220, 375][active] ?? 65;
  return (
    <figure className={`enterprise-motion-figure enterprise-motion-${kind}`}>
      <svg viewBox="0 0 440 300" aria-hidden="true" focusable="false">
        {kind === "pilot" ? (
          <>
            <text x="24" y="30">
              A matched comparison
            </text>
            <path
              className="enterprise-diagram-track"
              d="M65 100 H375 M65 210 H375"
            />
            <path
              className="enterprise-diagram-link"
              d="M375 100 V210"
              style={{ strokeDashoffset: active === 2 ? 0 : 1 }}
              pathLength="1"
            />
            <text x="24" y="76">
              15-agent pilot
            </text>
            <text x="24" y="186">
              Matched control
            </text>
            {[65, 220, 375].map((x, i) => (
              <g key={x}>
                <circle
                  cx={x}
                  cy="100"
                  r="7"
                  className={
                    active >= i ? "enterprise-node-complete" : "enterprise-node"
                  }
                />
                <circle
                  cx={x}
                  cy="210"
                  r="7"
                  className={
                    active >= i ? "enterprise-node-complete" : "enterprise-node"
                  }
                />
              </g>
            ))}
            <circle
              className="enterprise-traveler"
              cx={position}
              cy="100"
              r="13"
            />
            <circle
              className="enterprise-traveler enterprise-traveler-control"
              cx={position}
              cy="210"
              r="13"
            />
            <text x="24" y="264">
              Design
            </text>
            <text x="179" y="264">
              Measure
            </text>
            <text x="332" y="264">
              Decide
            </text>
          </>
        ) : kind === "organization" ? (
          <>
            <circle
              className="enterprise-diagram-orbit"
              cx="220"
              cy="146"
              r={active === 0 ? 54 : active === 1 ? 89 : 119}
            />
            <path
              className="enterprise-diagram-link"
              pathLength="1"
              d="M220 111 V48 M156 146 H57 M284 146 H382 M220 181 V248"
              style={{ strokeDashoffset: active >= 1 ? 0 : 1 }}
            />
            <path
              className="enterprise-diagram-link enterprise-diagram-outer"
              pathLength="1"
              d="M57 146 Q57 48 220 48 Q382 48 382 146 Q382 248 220 248 Q57 248 57 146"
              style={{ strokeDashoffset: active === 2 ? 0 : 1 }}
            />
            <rect
              x="156"
              y="111"
              width="128"
              height="70"
              rx="35"
              className="enterprise-node-complete"
            />
            <text
              x="220"
              y="151"
              textAnchor="middle"
              className="enterprise-diagram-core"
            >
              ChatGPT
            </text>
            {[
              [220, 48, "Product"],
              [57, 146, "Marketing"],
              [382, 146, "Merch."],
              [220, 248, "Operations"],
            ].map(([x, y, label]) => (
              <g key={String(label)}>
                <circle
                  cx={Number(x)}
                  cy={Number(y)}
                  r="7"
                  className={
                    active === 2 ? "enterprise-node-live" : "enterprise-node"
                  }
                />
                <text
                  x={Number(x)}
                  y={Number(y) + (label === "Product" ? -20 : 32)}
                  textAnchor="middle"
                >
                  {label}
                </text>
              </g>
            ))}
          </>
        ) : (
          <>
            <text x="24" y="32">
              The approval boundary
            </text>
            <path className="enterprise-diagram-track" d="M65 145 H375" />
            <path
              className="enterprise-diagram-link"
              pathLength="1"
              d="M65 145 H375"
              style={{
                strokeDashoffset: active / 2 === 0 ? 1 : 1 - active / 2,
              }}
            />
            {[65, 220, 375].map((x, i) => (
              <g key={x}>
                <circle
                  cx={x}
                  cy="145"
                  r={i === 1 ? 35 : 23}
                  className={
                    active >= i ? "enterprise-node-complete" : "enterprise-node"
                  }
                />
                <text
                  x={x}
                  y="151"
                  textAnchor="middle"
                  className={active >= i ? "enterprise-diagram-core" : ""}
                >
                  {i === 1 ? "✓" : String(i + 1)}
                </text>
              </g>
            ))}
            <circle
              className="enterprise-traveler"
              cx={position}
              cy="92"
              r="7"
            />
            <text x="65" y="218" textAnchor="middle">
              Lookup
            </text>
            <text x="220" y="218" textAnchor="middle">
              Confirm
            </text>
            <text x="375" y="218" textAnchor="middle">
              Result
            </text>
            <text x="220" y="269" textAnchor="middle">
              {active === 1
                ? "Human approval before action"
                : active === 2
                  ? "A visible updated state"
                  : "Read before making a change"}
            </text>
          </>
        )}
      </svg>
      <figcaption>
        {kind === "pilot"
          ? "Comparison structure—not a performance chart. Both groups inform the scale decision."
          : kind === "organization"
            ? "Capability model: access → enablement → shared learning. Connections describe collaboration, not reporting lines."
            : "Interaction model from the public mock-data prototype. This page does not execute order actions."}
      </figcaption>
    </figure>
  );
}
