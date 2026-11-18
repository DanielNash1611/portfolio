"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValueEvent, useTransform } from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type MouseEvent,
} from "react";
import useStudyProgress, {
  omsHeaderOffset as headerOffset,
} from "./useOmsScrollProgress";
import {
  pilotBeats,
  pilotMetrics,
  pilotBeatAt,
  pilotTarget,
  pilotBarPercent,
  formatPilotValue,
  type PilotBeat,
  type PilotMetric,
} from "./pilot-evidence";
import sourceSlide from "./pilot-source-slide12.png";
import "./pilot-dossier.css";

function SourceTable({ decorative = false }: { decorative?: boolean }) {
  return (
    <div className="pilot-source-table" aria-hidden={decorative || undefined}>
      <Image
        src={sourceSlide}
        alt={
          decorative
            ? ""
            : "Original measurement table from roadmap slide 12, reporting test and adjusted-control before/after AOV, conversion, and revenue per call."
        }
        priority
        unoptimized
      />
    </div>
  );
}
function MetricPanel({ metric }: { metric: PilotMetric }) {
  return (
    <figure className="pilot-metric-panel">
      <p className="pilot-paper-eyebrow">
        Source-transcribed comparison / Slide 12
      </p>
      <h3>{metric.name}</h3>
      <div className="pilot-bar-legend" aria-hidden="true">
        <span>
          <i />
          Before
        </span>
        <span>
          <i />
          After
        </span>
      </div>
      {(
        [
          ["Test group", metric.test],
          ["Control group", metric.control],
        ] as const
      ).map(([label, row]) => (
        <div className="pilot-cohort-result" key={label}>
          <div className="pilot-cohort-heading">
            <h4>
              {label}
              <small className="pilot-period">
                {label.startsWith("Control")
                  ? "Per Week, Adjusted"
                  : "Per Week"}
              </small>
            </h4>
            <span>
              {row.change} <small>as reported</small>
            </span>
          </div>
          <p className="pilot-paired-values">
            <span>
              <small>Before</small>
              {formatPilotValue(metric, row.before)}
            </span>
            <span aria-hidden="true">→</span>
            <span>
              <small>After</small>
              {formatPilotValue(metric, row.after)}
            </span>
          </p>
          <div className="pilot-paired-bars" aria-hidden="true">
            <i
              className="pilot-bar-before"
              style={{ width: `${pilotBarPercent(metric, row.before)}%` }}
            />
            <i
              className="pilot-bar-after"
              style={{ width: `${pilotBarPercent(metric, row.after)}%` }}
            />
          </div>
        </div>
      ))}
      <div className="pilot-axis" aria-hidden="true">
        <span>{metric.unit === "percent" ? "0%" : "$0"}</span>
        <span>
          {metric.unit === "percent"
            ? `${metric.axisMax / 2}%`
            : `$${metric.axisMax / 2}`}
        </span>
        <span>
          {metric.unit === "percent"
            ? `${metric.axisMax}%`
            : `$${metric.axisMax}`}
        </span>
      </div>
      <figcaption>
        {metric.unit === "percent"
          ? "Relative changes as reported, not percentage-point lift."
          : "Source slide 12 · Reported before → after."}
      </figcaption>
    </figure>
  );
}
function DossierPiece({ beat }: { beat: PilotBeat }) {
  switch (beat.kind) {
    case "study":
      return (
        <div className="pilot-study-brief">
          <p className="pilot-paper-eyebrow">
            Authored study brief / Existing case account
          </p>
          <h3>A bounded experiment.</h3>
          <dl>
            <div>
              <dt>Test cohort</dt>
              <dd>
                <strong>15</strong> agents
              </dd>
            </div>
            <div>
              <dt>Comparison</dt>
              <dd>
                Matched control<span>Group size not published</span>
              </dd>
            </div>
          </dl>
          <div className="pilot-study-rule">
            <span>Six-month pilot</span>
            <span>Similar tenure, skill, and call mix</span>
          </div>
          <p>
            Compare changes between groups. Keep the workflow, data boundaries,
            and human review part of the study design.
          </p>
        </div>
      );
    case "metric":
      return <MetricPanel metric={pilotMetrics[beat.metricIndex]} />;
    case "estimate":
      return (
        <div className="pilot-estimate-piece">
          <p className="pilot-paper-eyebrow">Separate business-case estimate</p>
          <h3>Estimated annualized impact</h3>
          <strong>~$2.7M</strong>
          <p>Reported in the case account.</p>
          <div className="pilot-estimate-limit">
            Not realized annual revenue. The comparison table does not reproduce
            the annualization model or its inputs.
          </div>
        </div>
      );
    case "decision":
      return (
        <div className="pilot-decision-piece">
          <p className="pilot-paper-eyebrow">Decision supported by the pilot</p>
          <h3>Expand the contact-center rollout.</h3>
          <p className="pilot-expansion-scope">
            <strong>~350</strong> agents
          </p>
          <ul>
            <li>No PCI or PII pasted into prompts.</li>
            <li>Generated communications reviewed by the agent.</li>
            <li>Governance reviewed with EIS and Legal.</li>
          </ul>
          <p className="pilot-decision-limit">
            Historical contact-center rollout scope. This is separate from
            company-wide licenses and active users.
          </p>
        </div>
      );
  }
}
function StageLimit({ beat }: { beat: PilotBeat }) {
  return (
    <p>
      {beat.kind === "metric"
        ? "Source slide 12: reported weekly figures, with adjusted control. Observation dates and the adjustment method are not supplied."
        : beat.kind === "study"
          ? "Study design from the case account. No control-group size or randomized assignment is inferred."
          : beat.kind === "estimate"
            ? "Observed comparison, annualized estimate, and expansion decision are separate evidence."
            : "Contact-center scope only. Organization-wide adoption is a different chapter."}
    </p>
  );
}
export default function PilotDossier({
  children,
  socialProof,
  embedded = false,
  forceReading = false,
}: {
  children?: ReactNode;
  socialProof?: ReactNode;
  embedded?: boolean;
  forceReading?: boolean;
}) {
  const root = useRef<HTMLElement>(null),
    activeRef = useRef(0);
  const [canPin, setCanPin] = useState(true);
  const [ready, setReady] = useState(false),
    [reduced, setReduced] = useState(true),
    [fits, setFits] = useState(false),
    [reading, setReading] = useState(false),
    [active, setActive] = useState(0);
  useEffect(() => {
    const motionQuery = matchMedia("(prefers-reduced-motion: reduce)"),
      sizeQuery = matchMedia(
        "(min-width:900px) and (min-height:650px), (min-width:375px) and (max-width:899px) and (min-height:840px)",
      );
    const updateMotion = () => setReduced(motionQuery.matches),
      updateSize = () => {
        setFits(sizeQuery.matches);
        let parent = root.current?.parentElement;
        let clear = true;
        while (
          parent &&
          parent !== document.body &&
          parent !== document.documentElement
        ) {
          if (
            ["hidden", "auto", "scroll"].includes(
              getComputedStyle(parent).overflowY,
            )
          ) {
            clear = false;
            break;
          }
          parent = parent.parentElement;
        }
        setCanPin(clear);
      };
    updateMotion();
    updateSize();
    setReady(true);
    motionQuery.addEventListener("change", updateMotion);
    sizeQuery.addEventListener("change", updateSize);
    return () => {
      motionQuery.removeEventListener("change", updateMotion);
      sizeQuery.removeEventListener("change", updateSize);
    };
  }, []);
  const animated =
    ready && !reduced && fits && canPin && !reading && !forceReading;
  const progress = useStudyProgress(root, animated);
  useMotionValueEvent(progress, "change", (value) => {
    const next = pilotBeatAt(value);
    if (next !== activeRef.current) {
      activeRef.current = next;
      setActive(next);
    }
  });
  const sourceY = useTransform(
    progress,
    [0, 0.15, 0.67, 0.83, 1],
    [24, 0, 0, -12, -12],
  );
  const sourceRotate = useTransform(
    progress,
    [0, 0.15, 0.67, 0.83, 1],
    [-4, -1, -1, 2, 2],
  );
  const rail = useTransform(progress, [0, 1], [0, 1]);
  const beat = pilotBeats[active];
  function select(index: number) {
    if (!root.current) return;
    const offset = headerOffset();
    const top = root.current.getBoundingClientRect().top + scrollY - offset;
    const distance = root.current.offsetHeight - innerHeight + offset;
    window.scrollTo({
      top: top + pilotTarget(index) * distance,
      behavior: "instant",
    });
    activeRef.current = index;
    setActive(index);
  }
  function toggleReading() {
    setReading((value) => !value);
    requestAnimationFrame(() => {
      if (root.current)
        window.scrollTo({
          top:
            root.current.getBoundingClientRect().top + scrollY - headerOffset(),
          behavior: "instant",
        });
    });
  }
  function follow(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (!reduced && !reading && !forceReading) return;
    event.preventDefault();
    history.pushState(null, "", `#${id}`);
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "instant", block: "start" });
  }
  return (
    <div
      className="pilot-dossier"
      data-reading={reading || reduced || forceReading}
    >
      {!embedded ? (
        <header className="pilot-hero">
          <div>
            <Link href="/work" className="pilot-back">
              ← Portfolio
            </Link>
            <p className="pilot-eyebrow">
              Guitar Center / ChatGPT Enterprise / Six-month pilot
            </p>
            <h1>
              A pilot needs
              <br />
              <em>a comparison.</em>
            </h1>
            <p className="pilot-hero-intro">
              I paired frontline workflows with a matched control group to make
              the business case for AI more credible.
            </p>
            <a
              className="pilot-hero-link"
              href="#pilot-study"
              onClick={(event) => follow(event, "pilot-study")}
            >
              Open the study dossier ↓
            </a>
            <p className="pilot-hero-note">
              The control improved too. Reported cohort results and an
              annualized estimate are different evidence.
            </p>
          </div>
          <figure className="pilot-hero-source">
            <div className="pilot-source-surface">
              <p className="pilot-paper-eyebrow">
                Original measurement artifact / Table crop
              </p>
              <SourceTable />
            </div>
            <figcaption>
              Roadmap review, slide 12 · Locally rendered from the original
              deck. The control column is explicitly labeled adjusted.
            </figcaption>
            <a href={sourceSlide.src} target="_blank" rel="noreferrer">
              Inspect the full source slide ↗
            </a>
          </figure>
        </header>
      ) : null}
      <section
        ref={root}
        className="pilot-study-story"
        id="pilot-study"
        data-animated={animated}
        aria-labelledby="pilot-study-title"
      >
        <div className="pilot-study-theater">
          <header className="pilot-theater-header">
            <div>
              <p className="pilot-eyebrow">Comparison / Estimate / Decision</p>
              <h2 id="pilot-study-title">Inspect the pilot dossier.</h2>
            </div>
            {ready && (reduced || !fits || !canPin || forceReading) ? (
              <p className="pilot-mode-note">
                {reduced
                  ? "Reduced motion · Complete dossier"
                  : forceReading || !canPin
                    ? "Reading view · Complete dossier"
                    : "Reading view · Short viewport"}
              </p>
            ) : (
              <button
                type="button"
                disabled={!ready}
                className="pilot-reading-toggle"
                aria-pressed={reading}
                onClick={toggleReading}
              >
                {reading
                  ? "Return to the scroll dossier"
                  : "Read the dossier without motion"}
              </button>
            )}
          </header>
          {animated ? (
            <>
              <nav className="pilot-stage-nav" aria-label="Pilot study stages">
                {pilotBeats.map((item, index) => (
                  <button
                    type="button"
                    key={item.label}
                    aria-current={active === index ? "step" : undefined}
                    onClick={() => select(index)}
                  >
                    <span>0{index + 1}</span>
                    {item.label}
                  </button>
                ))}
                <motion.span
                  className="pilot-stage-rail"
                  style={{ scaleX: rail }}
                  aria-hidden="true"
                />
              </nav>
              <div className="pilot-study-composition">
                <div
                  className="pilot-beat-copy"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <p className="pilot-eyebrow">
                    0{active + 1} / {beat.label}
                  </p>
                  <h3>{beat.title}</h3>
                  <p>{beat.detail}</p>
                </div>
                <div className="pilot-evidence-dossier">
                  <motion.div
                    className="pilot-source-underlay"
                    aria-hidden="true"
                    style={{ y: sourceY, rotate: sourceRotate }}
                  >
                    <SourceTable decorative />
                  </motion.div>
                  <article
                    className="pilot-active-paper"
                    data-pilot-piece={beat.kind}
                  >
                    <DossierPiece beat={beat} />
                  </article>
                </div>
              </div>
              <footer className="pilot-study-footer">
                <StageLimit beat={beat} />
                <a href={sourceSlide.src} target="_blank" rel="noreferrer">
                  Inspect the source ↗
                </a>
              </footer>
            </>
          ) : (
            <div className="pilot-static-dossier">
              {pilotBeats.map((item, index) => (
                <article className="pilot-static-stage" key={item.label}>
                  <div>
                    <p className="pilot-eyebrow">
                      0{index + 1} / {item.label}
                    </p>
                    <h3>{item.title}</h3>
                    <p>{item.detail}</p>
                  </div>
                  <div className="pilot-static-paper">
                    <DossierPiece beat={item} />
                  </div>
                  <div className="pilot-static-limit">
                    <StageLimit beat={item} />
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
      {!embedded ? (
        <>
          <section id="pilot-detail" className="pilot-details">
            <header>
              <p className="pilot-eyebrow">
                Daniel’s role / Full method / Limits
              </p>
              <h2>
                The product work
                <br />
                <em>behind the pilot.</em>
              </h2>
            </header>
            <div className="pilot-detail-body">{children}</div>
          </section>
          <section className="pilot-proof">
            <p className="pilot-eyebrow">Collaborators’ accounts</p>
            <h2>Partners on the work.</h2>
            <div>{socialProof}</div>
          </section>
          <footer className="pilot-close">
            <p className="pilot-eyebrow">Continue the conversation</p>
            <h2>
              Make the next AI investment
              <br />
              with evidence in view.
            </h2>
            <Link href="/contact">Get in touch ↗</Link>
          </footer>
        </>
      ) : null}
    </div>
  );
}

/** Standalone integration: no page hero, details, testimonials, or closing CTA. */
export function PilotEvidenceDossier({
  forceReading = false,
}: {
  forceReading?: boolean;
}) {
  return <PilotDossier embedded forceReading={forceReading} />;
}
