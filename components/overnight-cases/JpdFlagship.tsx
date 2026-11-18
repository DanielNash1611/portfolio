"use client";
import useCaseHashDetails from "./useCaseHashDetails";

import Image from "next/image";
import Link from "next/link";
import { memo, useEffect, useRef, useState, type ReactNode } from "react";
import "./jpd-flagship.css";

const worksheet =
  "/images/thinking/product-leadership-systems-design/rice-definition.png";
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const scenes = [
  {
    id: "jpd-agree",
    label: "Agree",
    title: "Agree on the values first.",
    body: "Quarterly planning kept rebuilding the list. I introduced common criteria so product, business, and technology could compare opportunities on the same basis.",
    source: "Whole published worksheet",
    note: "The instruction on the original: “Product Team should agree on values.”",
  },
  {
    id: "jpd-reach-impact",
    label: "Reach & Impact",
    title: "Make value comparable.",
    body: "The published reference weights customer segments for Reach. Impact uses a 1–5 scale, justified in the description.",
    source: "Reach and Impact / Original column definitions",
    note: "This is the published reference, not a populated JPD project or a scored initiative.",
  },
  {
    id: "jpd-confidence-effort",
    label: "Confidence & Effort",
    title: "Keep the assumptions visible.",
    body: "The reference specifies 1–100 for Confidence and 1–5 for Effort. The JPD case describes teaching teams to apply the shared criteria consistently.",
    source: "Confidence and Effort / Original column definitions",
    note: "The source does not provide scoring weights, a formula, or an example initiative to reconstruct.",
  },
  {
    id: "jpd-compare",
    label: "Compare",
    title: "Compare, then prioritize.",
    body: "The worksheet says to sort by RICE to identify top priorities. The case describes a shared workspace that connects ideas to delivery work.",
    source: "Effort and RICE Score / Original column definitions",
    note: "The original rows are blank. No invented opportunities or scores have been added.",
  },
];
const topics = [
  {
    title: "Capture ideas and opportunities",
    body: "How to capture ideas and opportunities in Jira Product Discovery.",
  },
  {
    title: "Apply RICE consistently",
    body: "How to use the shared scoring criteria consistently across initiatives.",
  },
  {
    title: "Use the views in real planning",
    body: "How to use JPD views in quarterly planning and ongoing check-ins.",
  },
  {
    title: "Connect work to outcomes",
    body: "How to tie initiatives back to OKRs and measurable outcomes.",
  },
];
const criteria = [
  ["Reach", "Score made by weighted customer segments"],
  ["Impact", "Scale of 1–5, justified in the description"],
  ["Confidence", "Scale 1–100"],
  ["Effort", "Scale 1–5"],
  ["RICE Score", "Sort by RICE to identify top priorities"],
];
function CriteriaView({ index }: { index: number }) {
  const fields = criteria.slice(
    index === 1 ? 0 : index === 2 ? 2 : 3,
    index === 1 ? 2 : index === 2 ? 4 : 5,
  );
  return (
    <div className="jpf-transcription">
      <p className="jpf-label">Original definitions / text transcription</p>
      <table>
        <thead>
          <tr>
            {fields.map(([name]) => (
              <th scope="col" key={name}>
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {fields.map(([name, text]) => (
              <td key={name}>{text}</td>
            ))}
          </tr>
          <tr aria-hidden="true">
            {fields.map(([name]) => (
              <td key={name}>&nbsp;</td>
            ))}
          </tr>
        </tbody>
      </table>
      <p className="jpf-blank-note">The original initiative rows are blank.</p>
    </div>
  );
}

function WorksheetBody({ fold = 1 }: { fold?: number }) {
  return (
    <div
      className="jpf-camera"
      style={{
        transform: `translate(-50%,-50%) translateX(${(1 - fold) * 25}%)`,
      }}
    >
      <div className="jpf-sheet">
        <div className="jpf-wing jpf-wing-left">
          <Image
            src={worksheet}
            alt=""
            width={1086}
            height={596}
            sizes="90vw"
          />
        </div>
        <div
          className="jpf-wing jpf-wing-right"
          style={{
            transform: `perspective(1200px) rotateY(${(1 - fold) * -86}deg)`,
            boxShadow: fold > 0.99 ? "none" : undefined,
          }}
        >
          <Image
            src={worksheet}
            alt=""
            width={1086}
            height={596}
            sizes="90vw"
          />
        </div>
        <span className="jpf-fold-edge" style={{ opacity: (1 - fold) * 0.5 }} />
      </div>
    </div>
  );
}
const Worksheet = memo(WorksheetBody);

export default function JpdFlagship({
  children,
  guide,
}: {
  children: ReactNode;
  guide: ReactNode;
}) {
  const caseRoot = useCaseHashDetails();
  const track = useRef<HTMLDivElement>(null);
  const pending = useRef<number | null>(null);
  const currentRef = useRef(0);
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [reading, setReading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [manual, setManual] = useState<number | null>(null);
  const quiet = !ready || reading || reduced;
  const current = manual ?? Math.round(progress);
  currentRef.current = current;
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = (e?: MediaQueryListEvent) => {
      if (e) pending.current = currentRef.current;
      setReduced(media.matches);
    };
    update();
    setReady(true);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (pending.current === null) return;
    const i = pending.current;
    pending.current = null;
    const frame = requestAnimationFrame(() =>
      document
        .getElementById(scenes[i].id)
        ?.scrollIntoView({ block: "start", behavior: "auto" }),
    );
    return () => cancelAnimationFrame(frame);
  }, [quiet]);
  useEffect(() => {
    if (quiet || !("IntersectionObserver" in window)) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      if (!track.current) return;
      const centers = [
        ...track.current.querySelectorAll<HTMLElement>(".jpf-step"),
      ].map((node) => {
        const r = node.getBoundingClientRect();
        return r.top + r.height / 2;
      });
      const y = innerHeight * 0.54;
      let p = 0;
      if (y >= centers[centers.length - 1]) p = centers.length - 1;
      else
        for (let i = 0; i < centers.length - 1; i++)
          if (y >= centers[i] && y < centers[i + 1]) {
            p = i + (y - centers[i]) / (centers[i + 1] - centers[i]);
            break;
          }
      setProgress(p);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          addEventListener("scroll", schedule, { passive: true });
          schedule();
        } else removeEventListener("scroll", schedule);
      },
      { rootMargin: "100px 0px" },
    );
    if (track.current) observer.observe(track.current);
    addEventListener("resize", schedule);
    measure();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
    };
  }, [quiet]);
  const fold = manual !== null ? 1 : clamp((progress + 0.15) / 0.75);
  return (
    <div
      className="jpd-flagship"
      ref={caseRoot}
      data-mode={quiet ? "reading" : "motion"}
      data-progress={progress.toFixed(2)}
    >
      <header className="jpf-hero">
        <div className="jpf-top">
          <Link href="/work">← Selected work</Link>
          <span>Guitar Center / Product operations</span>
        </div>
        <div className="jpf-hero-grid">
          <div>
            <p className="jpf-label">
              Shared priorities · Planning · Enablement
            </p>
            <h1>
              Jira Product
              <br />
              <em>Discovery.</em>
            </h1>
            <p className="jpf-lead">
              I created a shared prioritization workspace and taught PMs and
              partners how to use it in real planning conversations.
            </p>
            <p className="jpf-hero-proof">
              <strong>9 PMs</strong>
              <span>
                adopted in the core
                <br />
                product organization
              </span>
            </p>
            <a className="jpf-start" href="#jpd-story">
              Open the working sheet <span aria-hidden="true">↓</span>
            </a>
          </div>
          <figure className="jpf-hero-paper">
            <Image
              src={worksheet}
              alt="Daniel's published RICE worksheet, headed Product Team should agree on values, with original criteria and blank initiative rows."
              width={1086}
              height={596}
              priority
              sizes="(min-width:900px) 64vw,100vw"
            />
            <figcaption>
              Published product-practice reference
              <br />
              Original blank worksheet / not a live JPD capture
            </figcaption>
          </figure>
        </div>
      </header>
      <div className="jpf-toolbar">
        <nav aria-label="JPD case chapters">
          <a href="#jpd-story">The criteria</a>
          <a href="#jpd-enablement">Teach the practice</a>
          <a href="#jpd-adoption">Adoption</a>
          <a href="#jpd-full-case">Full case</a>
        </nav>
        <div className="jpf-inspector">
          <label>
            <span>Inspect</span>
            <select
              aria-label="Inspect the RICE worksheet"
              value={manual ?? "auto"}
              onChange={(e) =>
                setManual(
                  e.target.value === "auto" ? null : Number(e.target.value),
                )
              }
            >
              <option value="auto">Follow scroll</option>
              {scenes.map((scene, i) => (
                <option key={scene.id} value={i}>
                  {i === 0 ? "Whole worksheet" : scene.label}
                </option>
              ))}
            </select>
          </label>
          <a href={worksheet}>Open original ↗</a>
        </div>
        <button
          type="button"
          disabled={reduced}
          aria-pressed={quiet}
          onClick={() => {
            pending.current = current;
            setManual(null);
            setReading((v) => !v);
          }}
        >
          {reduced
            ? "Reduced motion on"
            : reading
              ? "Return to scroll story"
              : "Read without motion"}
        </button>
      </div>
      <section
        id="jpd-story"
        className="jpf-scroll"
        aria-label="A shared basis for prioritization"
      >
        <div className="jpf-stage" aria-hidden="true">
          <div className="jpf-stage-caption">
            <div>
              <p className="jpf-label">
                {manual !== null
                  ? "Manual worksheet view"
                  : `0${current + 1} / Shared criteria`}
              </p>
              <h2>{scenes[current].title}</h2>
            </div>
            <p>{scenes[current].body}</p>
          </div>
          <div className="jpf-sheet-window" data-focused={current > 0}>
            <div className="jpf-source-context">
              <Worksheet fold={fold} />
            </div>
            {current > 0 && <CriteriaView index={current} />}
          </div>
          <div className="jpf-source-line">
            <p>{scenes[current].source}</p>
            <p>{scenes[current].note}</p>
          </div>
        </div>
        <div ref={track} className="jpf-step-track">
          {scenes.map((scene, i) => (
            <article id={scene.id} key={scene.id} className="jpf-step">
              <div className="jpf-step-copy">
                <p className="jpf-label">0{i + 1} / Shared criteria</p>
                <h2>{scene.title}</h2>
                <p>{scene.body}</p>
              </div>
              <figure className="jpf-static-art">
                {i === 0 ? (
                  <div
                    className="jpf-static-window"
                    role="img"
                    aria-label="The complete original published RICE worksheet, with blank initiative rows."
                  >
                    <Worksheet fold={1} />
                  </div>
                ) : (
                  <CriteriaView index={i} />
                )}
                <figcaption>
                  <span>{scene.source}</span>
                  <p>{scene.note}</p>
                  <a href={worksheet}>Inspect the complete original ↗</a>
                </figcaption>
              </figure>
            </article>
          ))}
        </div>
      </section>
      <aside className="jpf-provenance" id="jpd-boundaries">
        <p className="jpf-label">What you are looking at</p>
        <p>
          The worksheet is an original published reference from{" "}
          <Link href="/thinking/product-philosophy">
            Product leadership is systems design
          </Link>
          . It supports the broader prioritization practice. It is not a
          screenshot of the internal JPD workspace. The rollout claims below
          come from the JPD case itself.
        </p>
      </aside>
      <section className="jpf-enablement" id="jpd-enablement">
        <div>
          <p className="jpf-label">Enablement / Documented curriculum</p>
          <h2>
            A shared framework
            <br />
            <em>needs a shared practice.</em>
          </h2>
          <div className="jpf-program">
            <strong>8 weeks</strong>
            <p>
              The onboarding curriculum.
              <br />
              Separate from the nine-PM adoption count.
            </p>
          </div>
          <p className="jpf-enablement-role">
            I led live training, one-to-one coaching, and working sessions using
            JPD in real planning conversations.
          </p>
        </div>
        <div className="jpf-syllabus">
          <p className="jpf-label">Topics covered</p>
          {topics.map((topic) => (
            <details key={topic.title}>
              <summary>
                {topic.title}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{topic.body}</p>
            </details>
          ))}
          <p className="jpf-syllabus-note">
            These are the documented curriculum topics; the source does not
            assign them to individual weeks.
          </p>
        </div>
      </section>
      <section className="jpf-adoption" id="jpd-adoption">
        <p className="jpf-label">
          Reported outcome / Core product organization
        </p>
        <h2>
          9 PMs.
          <br />
          <em>A common way to plan.</em>
        </h2>
        <div className="jpf-adoption-copy">
          <p>
            The case reports full adoption across all nine product managers in
            the core product organization, plus organic uptake from teams
            without an official PM.
          </p>
          <p>
            Rolling prioritization replaced quarterly list rebuilds. Faster
            alignment and stronger collaboration are reported outcomes; this
            case provides no measured percentage for either.
          </p>
        </div>
        <blockquote>
          <p>
            “was the primary teacher for the team in new tools like
            Atlassian&apos;s Jira Product Discovery tool”
          </p>
          <footer>
            Colin Greene / Product peer in the same Guitar Center group
          </footer>
        </blockquote>
      </section>
      <section className="jpf-full-case" id="jpd-full-case">
        <p className="jpf-label">The complete record</p>
        <h2>
          Read the practice.
          <br />
          <em>Inspect the evidence.</em>
        </h2>
        <div className="jpf-guide">{guide}</div>
        {children}
      </section>
      <footer className="jpf-close">
        <p>Keep exploring</p>
        <Link href="/work/checkout-redesign">
          How shared context carried into checkout delivery ↗
        </Link>
        <Link href="/work">All selected work ↗</Link>
      </footer>
    </div>
  );
}
