"use client";

import { useEffect, useRef, useState } from "react";

export type NarrativeBeat = { title: string; text: string };

/** Every beat stays in normal document flow; scroll only selects the illustration. */
export default function ScrollNarrative({
  kind,
  label,
  beats,
}: {
  kind: "career" | "scout" | "launch";
  label: string;
  beats: NarrativeBeat[];
}) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const manual = useRef(false);
  useEffect(() => {
    const elements = root.current?.querySelectorAll<HTMLElement>(
      "[data-narrative-beat]",
    );
    if (!elements || !window.IntersectionObserver) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).dataset.seen = "true";
          if (!manual.current)
            setActive(
              Number((entry.target as HTMLElement).dataset.narrativeBeat),
            );
        });
      },
      { rootMargin: "-20% 0px -35% 0px", threshold: 0 },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`builders-scroll-story builders-scroll-${kind}`}
      ref={root}
      onWheel={() => {
        manual.current = false;
      }}
      onTouchStart={() => {
        manual.current = false;
      }}
      onKeyDown={(event) => {
        if (
          [
            "ArrowDown",
            "ArrowUp",
            "PageDown",
            "PageUp",
            "Home",
            "End",
            " ",
          ].includes(event.key)
        )
          manual.current = false;
      }}
    >
      <aside className="builders-scroll-visual">
        <p className="builders-eyebrow">{label}</p>
        <div
          role="group"
          aria-label={`${label} illustration stages`}
          className="builders-motion-controls"
        >
          {beats.map((beat, index) => (
            <button
              key={beat.title}
              aria-label={`Illustrate ${beat.title}`}
              aria-pressed={active === index}
              onClick={() => {
                manual.current = true;
                setActive(index);
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </button>
          ))}
        </div>
        <div
          className="builders-motion-graphic"
          data-active={active}
          aria-hidden="true"
        >
          {kind === "career" && (
            <svg viewBox="0 0 480 260" fill="none">
              <path className="builders-track" d="M48 130H432" />
              {[0, 1, 2, 3].map((i) => (
                <g key={i} className={i <= active ? "is-lit" : ""}>
                  <rect x={28 + i * 110} y={92} width="92" height="76" rx="2" />
                  <path
                    className="builders-glyph"
                    d={`M${48 + i * 110} 115h40m-40 15h30m-30 15h20`}
                  />
                  <text x={74 + i * 110} y="204">
                    {["Source", "Role", "Checks", "Human"][i]}
                  </text>
                </g>
              ))}
              <circle
                className="builders-traveler"
                cx={74 + Math.min(active, 3) * 110}
                cy="52"
                r="7"
              />
              <path
                d={`M${74 + Math.min(active, 3) * 110} 66v15`}
                className="builders-glyph"
              />
            </svg>
          )}
          {kind === "scout" && (
            <svg viewBox="0 0 480 300" fill="none">
              <path
                className="builders-track"
                d="M90 80L240 150L390 80M90 220L240 150L390 220"
              />
              {[
                [90, 80],
                [390, 80],
                [90, 220],
                [390, 220],
              ].map(([x, y], i) => (
                <g key={i} className={i <= active ? "is-lit" : ""}>
                  <rect x={x - 48} y={y - 27} width="96" height="54" rx="2" />
                  <text x={x} y={y + 5}>
                    {["Papers", "Patents", "Citations", "Review"][i]}
                  </text>
                </g>
              ))}
              <g className="is-lit">
                <circle cx="240" cy="150" r={active === 2 ? 40 : 32} />
                <text x="240" y="155">
                  Question
                </text>
              </g>
              <circle
                className="builders-orbit"
                cx={active % 2 === 0 ? 165 : 315}
                cy={active < 2 ? 115 : 185}
                r="7"
              />
            </svg>
          )}
          {kind === "launch" && (
            <svg viewBox="0 0 480 280" fill="none">
              <path className="builders-track" d="M35 218H445" />
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <g
                  key={i}
                  className={i <= Math.min(5, active * 2 + 1) ? "is-lit" : ""}
                >
                  <rect
                    className="builders-week"
                    x={40 + i * 68}
                    y={110}
                    width="48"
                    height={90}
                    rx="2"
                  />
                  <path
                    className="builders-glyph"
                    d={`M${50 + i * 68} 134h28m-28 12h20m-20 12h25`}
                  />
                  <text x={64 + i * 68} y="246">
                    0{i + 1}
                  </text>
                </g>
              ))}
              <path
                className="builders-story-thread"
                style={{ strokeDashoffset: Math.max(0, 440 - active * 220) }}
                d="M64 122Q98 40 132 76T200 102T268 38T336 66T404 112"
              />
            </svg>
          )}
        </div>
        <p className="builders-graphic-caption">
          {kind === "career"
            ? "Approved evidence → human decision"
            : kind === "scout"
              ? "Question → evidence → review"
              : "One narrative across six weeks"}
        </p>
        <p className="builders-caption">
          Workflow illustration · {active + 1} / {beats.length}
        </p>
      </aside>
      <div className="builders-scroll-beats">
        {beats.map((beat, index) => (
          <article
            key={beat.title}
            data-narrative-beat={index}
            className="builders-scroll-beat"
          >
            <p className="builders-eyebrow">0{index + 1}</p>
            <h3>{beat.title}</h3>
            <p>{beat.text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
