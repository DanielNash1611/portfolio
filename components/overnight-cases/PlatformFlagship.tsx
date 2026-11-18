"use client";
import useCaseHashDetails from "./useCaseHashDetails";
import Image from "next/image";
import Link from "next/link";
import { memo, useEffect, useRef, useState, type ReactNode } from "react";
import prototype from "./platform-evidence/original-prototype.png";
import nextSteps from "./platform-evidence/original-next-steps.png";
import storeConcept from "./platform-evidence/original-store-concept.png";
import "./platform-flagship.css";

const spreads = [
  {
    id: "platform-prototype-evidence",
    label: "Prototype",
    title: "Make the interaction tangible.",
    body: "I led a hackathon team to design and build a functional custom GPT for musicians discovering gear through a song, artist, or genre.",
    src: prototype,
    alt: "Original pitch page 4 showing Sound Synthesist's question and generated answer about the Tron soundtrack.",
    source: "Original finalist pitch / Page 4",
    kind: "Functional prototype",
    note: "Original generated output is shown as an interaction artifact, not verified music credits or a current gear recommendation.",
  },
  {
    id: "platform-research-evidence",
    label: "Research",
    title: "Listen for a reason to return.",
    body: "A follow-up UX study reported that 87% of participants would use the experience again. That is a signal of reuse intent.",
    src: "/images/sound-synthesist/ux-validation.png",
    alt: "Published research summary reporting 87 percent would use again and participant quotes.",
    source: "Published UX validation summary",
    kind: "Reported research signal",
    note: "The supplied summary does not give the sample size, question wording, or study dates. Reuse intent is not observed retention or production adoption.",
  },
  {
    id: "platform-api-evidence",
    label: "Next steps",
    title: "The prototype exposed the next product questions.",
    body: "The original pitch identified API connections and a larger Buyer Assistant architecture as improvements still to make.",
    src: nextSteps,
    alt: "Original pitch page 20 calls the product a functional MVP and proposes API work for links, wishlists and a larger Buyer Assistant architecture.",
    source: "Original finalist pitch / Page 20",
    kind: "Proposed improvements",
    note: "These are the pitch's proposed next steps. This source does not establish that an API layer, wishlist integration, or MCP platform was delivered.",
  },
  {
    id: "platform-channel-evidence",
    label: "Concepts",
    title: "Explore where the experience could fit.",
    body: "I explored how the same interaction could support ecommerce, store associates, and contact-center agents. Those extensions remained product direction.",
    src: storeConcept,
    alt: "Original pitch page 14 exploring in-store use, including pedal testing and a generated store-availability statement.",
    source: "Original finalist pitch / Page 14",
    kind: "Channel concept",
    note: "The generated availability line is part of the pitch concept. It is not evidence of live inventory integration or current stock.",
  },
];
function SpreadBody({ index }: { index: number }) {
  const item = spreads[index];
  const href = typeof item.src === "string" ? item.src : item.src.src;
  return (
    <div className="pff-spread">
      <figure>
        <div className="pff-image-window">
          <Image
            src={item.src}
            alt={item.alt}
            width={1600}
            height={900}
            sizes="(min-width:1000px) 58vw,95vw"
          />
        </div>
        <figcaption>
          {item.source}
          <a href={href} target="_blank" rel="noreferrer">
            Open complete original ↗
          </a>
        </figcaption>
      </figure>
      <div className="pff-spread-copy">
        <p className="pff-micro">
          0{index + 1} / {item.kind}
        </p>
        <h2>{item.title}</h2>
        <p className="pff-body">{item.body}</p>
        {index === 0 ? (
          <blockquote>
            “Find gear based on song, artist, or genre.”
            <cite>Original pitch subtitle</cite>
          </blockquote>
        ) : index === 1 ? (
          <div className="pff-research">
            <strong>87%</strong>
            <span>would use again</span>
          </div>
        ) : index === 2 ? (
          <dl className="pff-next-steps">
            <div>
              <dt>Links</dt>
              <dd>API connection proposed</dd>
            </div>
            <div>
              <dt>Wishlists</dt>
              <dd>API generation proposed</dd>
            </div>
            <div>
              <dt>Architecture</dt>
              <dd>Larger Buyer Assistant suggested</dd>
            </div>
          </dl>
        ) : (
          <ul className="pff-channel-list">
            <li>Ecommerce</li>
            <li>In-store</li>
            <li>Contact center</li>
          </ul>
        )}
        <p className="pff-evidence-note">{item.note}</p>
      </div>
    </div>
  );
}
const Spread = memo(SpreadBody);

export default function PlatformFlagship({
  children,
  demo,
  guide,
}: {
  children: ReactNode;
  demo: ReactNode;
  guide: ReactNode;
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
    const q = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      pending.current = currentRef.current;
      setReduced(q.matches);
    };
    setReduced(q.matches);
    setReady(true);
    q.addEventListener("change", update);
    return () => q.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (pending.current === null) return;
    const n = pending.current;
    pending.current = null;
    const id = requestAnimationFrame(() =>
      document
        .getElementById(spreads[n].id)
        ?.scrollIntoView({ behavior: "instant", block: "start" }),
    );
    return () => cancelAnimationFrame(id);
  }, [quiet]);
  useEffect(() => {
    if (quiet || !track.current) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const points = [...track.current!.querySelectorAll(".pff-step")].map(
        (n) => {
          const r = n.getBoundingClientRect();
          return r.top + r.height / 2;
        },
      );
      const y = innerHeight * 0.54;
      let p = 0;
      if (y >= points[3]) p = 3;
      else
        for (let i = 0; i < 3; i++)
          if (y >= points[i] && y < points[i + 1]) {
            p = i + (y - points[i]) / (points[i + 1] - points[i]);
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
  const source = spreads[current].src;
  return (
    <div
      className="platform-flagship"
      ref={caseRoot}
      data-mode={quiet ? "reading" : "motion"}
      data-progress={progress.toFixed(2)}
    >
      <header className="pff-hero">
        <div className="pff-hero-photo">
          <Image
            src="/images/sound-synthesist/hackathon-photo.jpg"
            alt="Daniel and teammates at Guitar Center's hackathon holding the winning check dated June 26, 2024."
            fill
            priority
            sizes="(min-width:1000px) 58vw,100vw"
          />
        </div>
        <div className="pff-hero-copy">
          <Link href="/work" className="pff-back">
            ← Selected work
          </Link>
          <p className="pff-micro">AI experiments → platform direction</p>
          <h1>
            Sound
            <br />
            <em>Synthesist.</em>
          </h1>
          <p className="pff-hero-lead">
            A working gear-discovery prototype that shaped my platform thinking.
          </p>
          <a className="pff-start" href="#platform-story">
            Follow the evidence <span aria-hidden="true">↓</span>
          </a>
          <p className="pff-hero-role">
            Daniel Nash / Senior Product Manager
            <br />
            Hackathon team lead · Prototype and platform exploration
          </p>
        </div>
        <p className="pff-photo-caption">
          The original hackathon photograph / Guitar Center, 2024
        </p>
      </header>
      <div className="pff-toolbar">
        <nav aria-label="Platform case chapters">
          <a href="#platform-story">The evidence</a>
          <a href="#platform-ownership">Delivery & role</a>
          <a href="#sound-seeker-live-demo">Public rebuild</a>
          <a href="#platform-full-case">Full case</a>
        </nav>
        <label>
          <span>Inspect</span>
          <select
            aria-label="Inspect platform evidence"
            value={manual ?? "auto"}
            onChange={(e) =>
              setManual(
                e.target.value === "auto" ? null : Number(e.target.value),
              )
            }
          >
            <option value="auto">Follow scroll</option>
            {spreads.map((s, i) => (
              <option key={s.id} value={i}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <a
          className="pff-manual-source"
          href={typeof source === "string" ? source : source.src}
          target="_blank"
          rel="noreferrer"
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
              ? "Return to scroll story"
              : "Read without motion"}
        </button>
      </div>
      <section
        className="pff-story"
        id="platform-story"
        aria-label="From prototype evidence to platform questions"
      >
        <div className="pff-stage" aria-hidden="true">
          <div className="pff-contact-sheet-label">
            <span>Source contact sheet</span>
            <span>
              {manual === null ? "Scroll to inspect" : "Manual source view"} / 0
              {current + 1} of 04
            </span>
          </div>
          <div className="pff-camera">
            <div
              className="pff-filmstrip"
              style={{
                transform: `translateX(${-(manual ?? progress) * 100}%)`,
              }}
            >
              {spreads.map((s, i) => (
                <div className="pff-frame" key={s.id}>
                  <Spread index={i} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="pff-track" ref={track}>
          {spreads.map((s, i) => (
            <article className="pff-step" id={s.id} key={s.id}>
              <Spread index={i} />
            </article>
          ))}
        </div>
      </section>
      <section className="pff-ownership" id="platform-ownership">
        <p className="pff-micro">Delivery status / ownership</p>
        <h2>
          Build, learn,
          <br />
          <em>then define the next step.</em>
        </h2>
        <div className="pff-ownership-grid">
          <div>
            <h3>What I led</h3>
            <p>
              The hackathon team, a functional customer-facing custom-GPT
              prototype, and exploration of how its interaction could extend
              across channels.
            </p>
          </div>
          <div>
            <h3>What the evidence supports</h3>
            <p>
              A working early concept, reported reuse intent, and concrete
              platform questions. I influenced broader thinking; I did not own
              the final implementation path.
            </p>
          </div>
          <div>
            <h3>What remained exploratory</h3>
            <p>
              The larger Buyer Assistant architecture and channel extensions.
              The source pages here do not prove a deployed MCP platform or
              production integrations.
            </p>
          </div>
        </div>
      </section>
      <section className="pff-demo-intro">
        <p className="pff-micro">A later working artifact</p>
        <h2>
          Sound Seeker.
          <br />
          <em>The public rebuild.</em>
        </h2>
        <p>
          A public-safe rebuild of the interaction pattern, separate from the
          original internal implementation.
        </p>
      </section>
      <div className="pff-demo">{demo}</div>
      <section className="pff-full-case" id="platform-full-case">
        <p className="pff-micro">The complete record</p>
        <h2>
          Inspect the origins.
          <br />
          <em>Read the learning.</em>
        </h2>
        <div className="pff-guide">{guide}</div>
        {children}
      </section>
      <footer className="pff-close">
        <p className="pff-micro">Keep exploring</p>
        <Link href="/work/chatgpt-enterprise">
          The leadership work behind enterprise adoption ↗
        </Link>
        <Link href="/work">All selected work ↗</Link>
      </footer>
    </div>
  );
}
