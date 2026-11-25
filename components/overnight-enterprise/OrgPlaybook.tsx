"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValueEvent, useTransform } from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import useProgress, {
  omsHeaderOffset as headerOffset,
} from "./useOmsScrollProgress";
import {
  orgChapters,
  orgChapterAt,
  orgTargets,
  orgAdoption,
} from "./org-evidence";
import sourceSlide from "./org-source-slide23.png";
import "./org-playbook.css";

function SourceCrop({ index }: { index: number }) {
  const chapter = orgChapters[index];
  if (!chapter.crop)
    return (
      <div className="org-governance-brief">
        <p className="org-source-kicker">Authored brief / Case account</p>
        <h3>
          Define the work.
          <br />
          Keep the status clear.
        </h3>
        <dl>
          <div>
            <dt>Platform</dt>
            <dd>
              Clarify ownership and the connection to business objectives.
            </dd>
          </div>
          <div>
            <dt>Use cases</dt>
            <dd>
              Frame value, risk, and maturity before expanding investment.
            </dd>
          </div>
          <div>
            <dt>Enablement</dt>
            <dd>Give teams reusable learning and a way to share experience.</dd>
          </div>
        </dl>
        <p className="org-status-mark">AI Center of Excellence / Groundwork</p>
      </div>
    );
  const [x, y, w, h] = chapter.crop;
  return (
    <figure className={`org-source-excerpt org-source-excerpt-${index}`}>
      <p className="org-source-kicker">Original roadmap / Slide 23</p>
      {index === 2 ? (
        <>
          <h3>ChatGPT Champions</h3>
          <blockquote>
            “Uniting Departments to Share Knowledge, Exchange Feedback, and
            Drive Innovation”
          </blockquote>
          <p className="org-transcription-note">
            Transcription of the collaboration statement below.
          </p>
        </>
      ) : null}
      <div
        className="org-crop"
        style={{ aspectRatio: `${w}/${h}` } as CSSProperties}
      >
        <Image
          src={sourceSlide}
          alt={`${chapter.source}: original training-plan excerpt.`}
          priority
          unoptimized
          style={{
            width: `${(1280 / w) * 100}%`,
            left: `${(-x / w) * 100}%`,
            top: `${(-y / h) * 100}%`,
          }}
        />
      </div>
      <figcaption>{chapter.source} · Original slide excerpt</figcaption>
    </figure>
  );
}
export default function OrgPlaybook({
  children,
  recommendationsHref,
  socialProof,
}: {
  children: ReactNode;
  recommendationsHref?: string;
  socialProof: ReactNode;
}) {
  const root = useRef<HTMLElement>(null),
    activeRef = useRef(0);
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
    const motion = () => setReduced(motionQuery.matches),
      size = () => setFits(sizeQuery.matches);
    motion();
    size();
    setReady(true);
    motionQuery.addEventListener("change", motion);
    sizeQuery.addEventListener("change", size);
    return () => {
      motionQuery.removeEventListener("change", motion);
      sizeQuery.removeEventListener("change", size);
    };
  }, []);
  const animated = ready && !reduced && fits && !reading;
  const progress = useProgress(root, animated);
  useMotionValueEvent(progress, "change", (value) => {
    const next = orgChapterAt(value);
    if (next !== activeRef.current) {
      activeRef.current = next;
      setActive(next);
    }
  });
  const pageTurn = useTransform(
    progress,
    [0, 0.24, 0.49, 0.74, 1],
    [-2, 0, 1, -1, 0],
  );
  const pageY = useTransform(progress, [0, 1], [10, -10]);
  const spine = useTransform(progress, [0, 1], [0, 1]);
  const chapter = orgChapters[active];
  function select(index: number) {
    if (!root.current) return;
    const offset = headerOffset();
    window.scrollTo({
      top:
        root.current.getBoundingClientRect().top +
        scrollY -
        offset +
        orgTargets[index] * (root.current.offsetHeight - innerHeight + offset),
      behavior: "instant",
    });
    activeRef.current = index;
    setActive(index);
  }
  function toggle() {
    setReading((x) => !x);
    requestAnimationFrame(() => {
      if (root.current)
        window.scrollTo({
          top:
            root.current.getBoundingClientRect().top + scrollY - headerOffset(),
          behavior: "instant",
        });
    });
  }
  return (
    <div className="org-playbook" data-reading={reduced || reading}>
      <header className="org-hero">
        <div className="org-hero-copy">
          <Link className="org-back" href="/work">
            ← Portfolio
          </Link>
          <p className="org-eyebrow">
            Guitar Center / ChatGPT Enterprise / 2024–2025
          </p>
          <h1>
            Make the
            <br />
            <em>learning travel.</em>
          </h1>
          <p className="org-intro">
            I turned a frontline pilot into a broader adoption practice:
            reusable training, ChatGPT Champions, and shared responsibility.
          </p>
          <a
            className="org-text-link"
            href="#org-field-guide"
            onClick={(e) => {
              if (reduced || reading) {
                e.preventDefault();
                document
                  .getElementById("org-field-guide")
                  ?.scrollIntoView({ behavior: "instant" });
              }
            }}
          >
            Open the enablement field guide ↓
          </a>
        </div>
        <figure className="org-hero-artifact">
          <div className="org-plan-label">
            The working material / A training plan
          </div>
          <Image
            src={sourceSlide}
            alt="Original ChatGPT Training Plan: online e-learning, in-person learning sessions, and collaboration through ChatGPT Champions."
            priority
            unoptimized
          />
          <figcaption>
            Original roadmap review, slide 23. Locally rendered from the deck; a
            learning plan, not a completion report.
          </figcaption>
          <a href={sourceSlide.src} target="_blank" rel="noreferrer">
            Inspect the original slide ↗
          </a>
        </figure>
      </header>
      <section
        id="org-field-guide"
        ref={root}
        className="org-guide"
        data-animated={animated}
        aria-labelledby="org-guide-title"
      >
        <div className="org-guide-stage">
          <header className="org-guide-header">
            <div>
              <p className="org-eyebrow">Enablement / From the original plan</p>
              <h2 id="org-guide-title">Scale the practice.</h2>
            </div>
            {ready && (reduced || !fits) ? (
              <p className="org-mode-note">
                {reduced
                  ? "Reduced motion · Full field guide"
                  : "Reading view · Short viewport"}
              </p>
            ) : (
              <button
                className="org-mode-button"
                disabled={!ready}
                aria-pressed={reading}
                onClick={toggle}
              >
                {reading ? "Return to the scroll guide" : "Read without motion"}
              </button>
            )}
          </header>
          {animated ? (
            <>
              <nav className="org-chapter-nav" aria-label="Enablement chapters">
                {orgChapters.map((c, i) => (
                  <button
                    key={c.label}
                    aria-current={i === active ? "step" : undefined}
                    onClick={() => select(i)}
                  >
                    <span>0{i + 1}</span>
                    {c.label}
                  </button>
                ))}
                <motion.i aria-hidden="true" style={{ scaleX: spine }} />
              </nav>
              <div className="org-spread">
                <div
                  className="org-chapter-copy"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <p className="org-page-number">0{active + 1}</p>
                  <h3>{chapter.title}</h3>
                  <p>{chapter.detail}</p>
                </div>
                <motion.div
                  className="org-evidence-page"
                  style={{ rotate: pageTurn, y: pageY }}
                  data-org-source={active}
                >
                  <SourceCrop index={active} />
                </motion.div>
              </div>
              <footer className="org-guide-footer">
                <p>{chapter.note}</p>
                <a href={sourceSlide.src} target="_blank" rel="noreferrer">
                  Full training plan ↗
                </a>
              </footer>
            </>
          ) : (
            <div className="org-reading-guide">
              {orgChapters.map((c, i) => (
                <article className="org-reading-chapter" key={c.label}>
                  <div>
                    <p className="org-eyebrow">
                      0{i + 1} / {c.label}
                    </p>
                    <h3>{c.title}</h3>
                    <p>{c.detail}</p>
                    <p className="org-reading-limit">{c.note}</p>
                  </div>
                  <SourceCrop index={i} />
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
      <section className="org-adoption" aria-labelledby="org-adoption-title">
        <div>
          <p className="org-eyebrow">
            Separate adoption snapshot / Case account
          </p>
          <h2 id="org-adoption-title">
            Access and use
            <br />
            <em>are different signals.</em>
          </h2>
          <p>
            Reported organization-wide figures. The source does not establish a
            daily activity window or the exact snapshot dates.
          </p>
        </div>
        <div className="org-adoption-ledger">
          <div className="org-ledger-header">
            <span>Reported scope</span>
            <span>Earlier</span>
            <span>Later</span>
          </div>
          <div>
            <h3>Licensed users</h3>
            <span>~{orgAdoption.earlier.licensed}</span>
            <strong>
              ~{orgAdoption.later.licensed.toLocaleString("en-US")}
            </strong>
          </div>
          <div>
            <h3>Active users</h3>
            <span>~{orgAdoption.earlier.active}</span>
            <strong>~{orgAdoption.later.active}</strong>
          </div>
          <p>
            Historical figures, not present-day adoption. Contact-center rollout
            (~350 agents) is a separate scope; do not add the counts together.
            The pilot’s estimated annualized impact is separate from
            company-wide usage.
          </p>
        </div>
      </section>
      <section className="org-details">
        <p className="org-eyebrow">Role / Decisions / Limits</p>
        <h2>
          The work behind
          <br />
          <em>the adoption practice.</em>
        </h2>
        {children}
      </section>
      <section className="org-collaborators">
        <p className="org-eyebrow">Collaborators’ accounts</p>
        <h2>Partners in the work.</h2>
        <div>{socialProof}</div>
        {recommendationsHref ? (
          <Link
            href={recommendationsHref}
            className="mt-8 inline-flex text-sm font-bold underline underline-offset-4"
          >
            Browse professional recommendations
          </Link>
        ) : null}
      </section>
      <footer className="org-continuation">
        <p className="org-eyebrow">From enablement to a specific workflow</p>
        <h2>
          Inspect the human decision
          <br />
          <em>inside an OMS action.</em>
        </h2>
        <Link className="org-text-link" href="/products/oms-chatgpt-app">
          View the OMS work ↗
        </Link>
      </footer>
    </div>
  );
}
