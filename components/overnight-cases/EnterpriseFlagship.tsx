"use client";
import useCaseHashDetails from "./useCaseHashDetails";
import Image from "next/image";
import Link from "next/link";
import { memo, useEffect, useRef, useState, type ReactNode } from "react";
import sourceSlide from "@/components/overnight-enterprise/pilot-source-slide12.png";
import "./enterprise-flagship.css";

const chapters = [
  {
    id: "enterprise-workflow",
    label: "Workflow",
    title: "Start with the work agents already do.",
    body: "I partnered with supervisors and frontline agents to find useful moments for AI: preparation, product context, and on-brand follow-up. I created Gear Companion to suggest complementary products alongside a primary purchase.",
  },
  {
    id: "enterprise-trust",
    label: "Trust",
    title: "Make the boundaries usable.",
    body: "I worked with EIS, Legal, Engineering, enterprise systems, and Operations on practical data and review boundaries. Agents retained judgment over customer-facing output.",
  },
  {
    id: "enterprise-enablement",
    label: "Enablement",
    title: "Give useful practice a way to spread.",
    body: "I created training assets and reusable prompting patterns, and started ChatGPT Champions as a grassroots effort. The practice later gained cross-functional support, OpenAI GTM partnership, and executive sponsorship.",
  },
];
function EvidenceBody({ index }: { index: number }) {
  if (index === 0)
    return (
      <div className="eef-workflow-exhibit">
        <p className="eef-micro">Documented workflow example</p>
        <h3>Gear Companion</h3>
        <Image
          className="eef-published-exhibit"
          src="/images/chatgpt-enterprise/frontline-ideation.webp"
          alt="Published sanitized explanatory exhibit of frontline ideation and the Gear Companion concept."
          width={1536}
          height={1024}
          sizes="(min-width:1000px) 45vw,90vw"
        />
        <div className="eef-workflow-answer">
          <span>Complementary product context</span>
          <strong>A sustain pedal for a digital keyboard.</strong>
          <p>
            An example from the published case; this is explanatory text, not a
            live generated recommendation.
          </p>
        </div>
        <p className="eef-source-note">
          Daniel created the GPT; supervisors and agents helped identify the
          workflow opportunities.
        </p>
      </div>
    );
  if (index === 1)
    return (
      <div className="eef-trust-exhibit">
        <p className="eef-micro">Pilot usage boundaries / case account</p>
        <div>
          <span>01 / Data</span>
          <h3>
            No PCI or PII
            <br />
            pasted by agents.
          </h3>
        </div>
        <div>
          <span>02 / Judgment</span>
          <h3>
            Review generated copy
            <br />
            before sending.
          </h3>
        </div>
        <p className="eef-source-note">
          Defined with EIS and Legal. These practical boundaries do not imply
          certification or a broader automated enforcement system.
        </p>
      </div>
    );
  if (index === 2)
    return (
      <div className="eef-enablement-exhibit">
        <p className="eef-micro">Published champions model / selected terms</p>
        <h3>
          From a useful workflow
          <br />
          <em>to shared practice.</em>
        </h3>
        <Image
          className="eef-published-exhibit"
          src="/images/chatgpt-enterprise/grassroots-champions-model.webp"
          alt="Published sanitized Champions model showing local use cases, peer enablement, cross-functional support and sponsorship."
          width={1536}
          height={1024}
          sizes="(min-width:1000px) 45vw,90vw"
        />
        <ol>
          <li>
            <span>01</span>
            <strong>Local use cases</strong>
          </li>
          <li>
            <span>02</span>
            <strong>Peer enablement</strong>
          </li>
          <li>
            <span>03</span>
            <strong>Cross-functional support</strong>
          </li>
        </ol>
        <p className="eef-source-note">
          A summary of the published adoption account. This is collaboration,
          not an organizational chart or a sequence of dated milestones.
        </p>
      </div>
    );
  return null;
}

const Evidence = memo(EvidenceBody);

export default function EnterpriseFlagship({
  children,
  pilot,
  organization,
}: {
  children: ReactNode;
  pilot: ReactNode;
  organization: ReactNode;
}) {
  const caseRoot = useCaseHashDetails();
  const track = useRef<HTMLDivElement>(null),
    pending = useRef<number | null>(null),
    currentRef = useRef(0);
  const [ready, setReady] = useState(false),
    [reduced, setReduced] = useState(false),
    [reading, setReading] = useState(false),
    [manual, setManual] = useState<number | null>(null),
    [progress, setProgress] = useState(0);
  const quiet = !ready || reduced || reading,
    current = manual ?? Math.round(progress);
  currentRef.current = current;
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      pending.current = currentRef.current;
      setReduced(media.matches);
    };
    setReduced(media.matches);
    setReady(true);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (pending.current === null) return;
    const n = pending.current;
    pending.current = null;
    const id = requestAnimationFrame(() =>
      document
        .getElementById(chapters[n].id)
        ?.scrollIntoView({ block: "start", behavior: "instant" }),
    );
    return () => cancelAnimationFrame(id);
  }, [quiet]);
  useEffect(() => {
    if (quiet || !track.current) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const nodes = [...track.current!.querySelectorAll(".eef-step")];
      const centers = nodes.map((node) => {
        const r = node.getBoundingClientRect();
        return r.top + r.height / 2;
      });
      const y = innerHeight * 0.55;
      let p = 0;
      if (y >= centers[chapters.length - 1]) p = chapters.length - 1;
      else
        for (let i = 0; i < chapters.length - 1; i++)
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
      { rootMargin: "100px" },
    );
    observer.observe(track.current);
    addEventListener("resize", schedule);
    measure();
    return () => {
      observer.disconnect();
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [quiet]);
  return (
    <div
      className="enterprise-flagship"
      ref={caseRoot}
      data-mode={quiet ? "reading" : "motion"}
      data-progress={progress.toFixed(2)}
    >
      <header className="eef-hero">
        <div className="eef-top">
          <Link href="/work">← Selected work</Link>
          <span>
            Guitar Center / 2024–2026
            <br />
            <small>
              Senior Product Manager · Contact Center &amp; AI Strategy
            </small>
          </span>
        </div>
        <div className="eef-hero-grid">
          <div>
            <p className="eef-micro">ChatGPT Enterprise / Product leadership</p>
            <h1>
              Make useful AI
              <br />
              <em>a shared practice.</em>
            </h1>
            <p className="eef-lead">
              I led a contact-center pilot, designed workflows and practical
              guardrails with partners, and helped build the enablement system
              for broader adoption.
            </p>
            <a className="eef-start" href="#enterprise-story">
              Open the adoption brief <span aria-hidden="true">↓</span>
            </a>
          </div>
          <figure className="eef-hero-document">
            <div className="eef-document-top">
              <span>01 / Evidence before expansion</span>
              <span>Source review</span>
            </div>
            <Image
              src={sourceSlide}
              alt="Original roadmap slide 12 reporting the test and adjusted-control pilot results, with before/after average order value, conversion rate, and revenue per call."
              priority
              unoptimized
            />
            <figcaption>
              Original roadmap review, slide 12. Both cohorts remain visible.
            </figcaption>
            <p className="eef-document-callout">
              A comparison.
              <span>
                Reported cohort measures,
                <br />
                read in context.
              </span>
            </p>
          </figure>
        </div>
      </header>
      <div className="eef-brief-boundary">
        <div className="eef-toolbar">
          <nav aria-label="Enterprise case chapters">
            <a href="#enterprise-story">The product work</a>
            <a href="#pilot-study">Pilot dossier</a>
            <a href="#org-field-guide">Scale &amp; enablement</a>
            <a href="#enterprise-record">Complete evidence</a>
          </nav>
          <label>
            <span>Inspect</span>
            <select
              aria-label="Inspect enterprise evidence"
              value={manual ?? "auto"}
              onChange={(e) =>
                setManual(
                  e.target.value === "auto" ? null : Number(e.target.value),
                )
              }
            >
              <option value="auto">Follow scroll</option>
              {chapters.map((c, i) => (
                <option key={c.id} value={i}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <a
            className="eef-inspect-source"
            href={
              current === 0
                ? "/images/chatgpt-enterprise/frontline-ideation.webp"
                : current === 1
                  ? "#enterprise-record"
                  : "/images/chatgpt-enterprise/grassroots-champions-model.webp"
            }
          >
            Open source ↗
          </a>
          <button
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
                ? "Return to scroll brief"
                : "Read brief without motion"}
          </button>
        </div>
        <section
          className="eef-story"
          id="enterprise-story"
          aria-label="The product work behind adoption"
        >
          <div className="eef-stage" aria-hidden="true">
            <div className="eef-stage-header">
              <p className="eef-micro">
                {manual === null
                  ? `0${current + 1} / Adoption brief`
                  : "Manual evidence view"}
              </p>
              <h2>{chapters[current].title}</h2>
              <p>{chapters[current].body}</p>
            </div>
            <div className="eef-stage-paper">
              {chapters.map((chapter, index) => (
                <div
                  key={chapter.id}
                  className="eef-moving-sheet"
                  style={{
                    transform: `translateY(${(index - (manual ?? progress)) * 110}%)`,
                  }}
                >
                  <Evidence index={index} />
                </div>
              ))}
            </div>
            <div className="eef-progress" aria-hidden="true">
              {chapters.map((c, i) => (
                <span key={c.id} data-active={i === current}>
                  {c.label}
                </span>
              ))}
            </div>
          </div>
          <div ref={track} className="eef-track">
            {chapters.map((c, i) => (
              <article className="eef-step" id={c.id} key={c.id}>
                <div className="eef-step-copy">
                  <p className="eef-micro">0{i + 1} / Adoption brief</p>
                  <h2>{c.title}</h2>
                  <p>{c.body}</p>
                </div>
                <div className="eef-inline-evidence">
                  <Evidence index={i} />
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
      {pilot}
      {organization}
      <section className="eef-record" id="enterprise-record">
        <p className="eef-micro">The complete record</p>
        <h2>
          Inspect the evidence.
          <br />
          <em>Read the decisions.</em>
        </h2>
        {children}
      </section>
      <footer className="eef-close">
        <p className="eef-micro">Keep exploring</p>
        <Link href="/case-studies/jira-product-discovery">
          The planning practice behind shared priorities ↗
        </Link>
        <Link href="/work/ai-platform-mcp">
          The platform direction beyond the pilot ↗
        </Link>
      </footer>
    </div>
  );
}
