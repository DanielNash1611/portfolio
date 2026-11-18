"use client";
import useCaseHashDetails from "./useCaseHashDetails";

import Image from "next/image";
import Link from "next/link";
import { memo, useEffect, useRef, useState, type ReactNode } from "react";
import "./checkout-flagship.css";

const before = "/images/checkout-redesign/checkout-before.png";
const after = "/images/checkout-redesign/checkout-after.png";
const ticket = "/images/checkout-redesign/jira-ticket.png";
const clamp = (n: number, low = 0, high = 1) =>
  Math.max(low, Math.min(high, n));
const beats = [
  {
    id: "checkout-problem",
    short: "Legacy",
    title: "A critical journey. Too much to scan.",
    body: "The existing checkout brought delivery choices, a long address form, and the order summary into one dense screen.",
    detail:
      "The challenge was to improve a revenue-critical journey without breaking its many valid paths. The source case describes product, fulfillment, customer, payment, and location conditions that changed checkout behavior.",
    source: before,
    sourceLabel: "Open the original checkout screen",
    alt: "Original Guitar Center checkout with delivery radio buttons, a long shipping-address form, and a compact order summary.",
    evidence: "Original product screen · Legacy checkout",
  },
  {
    id: "checkout-screen-detail",
    short: "Friction",
    title: "The next step needed a clearer hierarchy.",
    body: "On the legacy screen, first name, last name, street, city, state, ZIP, and phone competed within a long form.",
    detail:
      "The highlight identifies the shipping-address fields visible in this capture. This is a visual observation of the artifact, not a measurement of where customers abandoned checkout.",
    source: before,
    sourceLabel: "Inspect the legacy address form",
    alt: "Legacy checkout shipping-address fields, shown in their original layout.",
    evidence: "Annotated original screen · Address fields highlighted",
  },
  {
    id: "checkout-artifacts",
    short: "Redesign",
    title: "A clearer delivery step.",
    body: "Shipping and Pickup become prominent. Contact fields sit together, address entry offers lookup or manual input, and the summary remains alongside.",
    detail:
      "The numbered highlights point to visible groups in the published screen. The screenshots show different carts and capture dimensions; they are not a controlled task comparison. The later A/B result applies to the redesigned experience as a whole, not to these individual UI elements.",
    source: after,
    sourceLabel: "Open the redesigned delivery screen",
    alt: "Redesigned Guitar Center delivery screen with Shipping and Pickup choices, grouped email and phone inputs, and a separate order summary.",
    evidence: "Annotated original screen · Redesigned delivery step",
  },
  {
    id: "checkout-role",
    short: "Execution",
    title: "Keep context in the build.",
    body: "I gave engineers the user need and business rationale, and kept the designer involved when feasibility changed the solution.",
    detail:
      "The representative ticket contains a User Story, implementation Details, and Level of Impact. It also says this gift-card change could follow the initial checkout release; it is evidence of the writing approach, not proof this specific change shipped in the initial 12 weeks.",
    source: ticket,
    sourceLabel: "Read the representative implementation ticket",
    alt: "Representative Jira ticket titled Make Gift Card Amount Field Optional, with User Story, Details, Level of Impact, and an explicit note that it can follow the initial release.",
    evidence: "Representative ticket · Change could follow the initial release",
  },
  {
    id: "checkout-qa",
    short: "QA",
    title: "Focus the test plan on risk.",
    body: "I mapped checkout complexity into 20–30 highest-risk scenarios. The redesign launched in 12 weeks with minimal service disruption.",
    detail:
      "The case describes roughly 400 billion theoretical combinations across checkout conditions. That describes modeled complexity, not executed tests. The plan deliberately covered selected highest-risk paths; a test-case inventory is not reproduced here.",
    source: "#checkout-source-delivery",
    sourceLabel: "Read the original delivery and QA account",
    alt: "",
    evidence:
      "Authored summary of the published QA scope · Not exhaustive coverage",
  },
  {
    id: "checkout-results",
    short: "Evidence",
    title: "Faster overall. One slower task.",
    body: "Full checkout time fell from 3:00 to 2:03 in usability testing. Quantity changes took longer: 0:57 → 1:10.",
    detail:
      "The full-flow task recorded success of 6/6 before and 6/6 after. Quantity-change time went from 0:57 to 1:10. These are task-level usability observations. Conversion and annualized revenue estimates came from a separate post-launch A/B test.",
    source: "#checkout-full-evidence",
    sourceLabel: "Read every recorded usability result",
    alt: "",
    evidence: "Recorded usability tasks · Time in seconds, before and after",
  },
];

type Props = {
  role: string;
  company: string;
  timeframe: string;
  children: ReactNode;
  guide: ReactNode;
};

function TimingGraphicBody({ quantity = false }: { quantity?: boolean }) {
  const a = quantity ? 57 : 180;
  const b = quantity ? 70 : 123;
  const max = quantity ? 70 : 180;
  return (
    <div className="cf-timing">
      <p className="cf-small-label">
        {quantity ? "Changing item quantity" : "Full checkout flow"}
      </p>
      <p className="cf-time-headline">
        {quantity ? "0:57 → 1:10" : "3:00 → 2:03"}
      </p>
      <div className="cf-time-row">
        <span>Before</span>
        <div>
          <i style={{ width: `${(a / max) * 100}%` }} />
        </div>
        <strong>{a}s</strong>
      </div>
      <div className="cf-time-row cf-time-after">
        <span>After</span>
        <div>
          <i style={{ width: `${(b / max) * 100}%` }} />
        </div>
        <strong>{b}s</strong>
      </div>
      <p className="cf-time-note">
        {quantity
          ? "Time increased. Difficulty score (source wording): 3.5 → 5.0."
          : "Recorded task success: 6/6 before → 6/6 after."}
      </p>
      <p className="cf-time-source">
        Source: follow-up usability tasks. Each pair uses its own time scale.
      </p>
    </div>
  );
}

const TimingGraphic = memo(TimingGraphicBody);

function QaGraphicBody() {
  return (
    <div className="cf-qa-stage">
      <p className="cf-small-label">
        Focused QA scope / Published delivery account
      </p>
      <p className="cf-qa-stage-number">20–30</p>
      <p className="cf-qa-stage-label">highest-risk scenarios</p>
      <div className="cf-qa-scope-note">
        <strong>~400 billion theoretical combinations</strong>
        <p>
          A scope estimate across checkout variables. The focused plan selected
          high-risk paths; it did not test every combination.
        </p>
      </div>
    </div>
  );
}

const QaGraphic = memo(QaGraphicBody);

function SourceImageBody({ step, zoom = 0 }: { step: number; zoom?: number }) {
  const [compareBefore, setCompareBefore] = useState(false);
  const [inspecting, setInspecting] = useState(false);
  const beat = beats[step];
  const selectedSource = step === 2 && compareBefore ? before : beat.source;
  if (step === 4) return <QaGraphic />;
  if (step === 5) return <TimingGraphic />;
  return (
    <figure className="cf-inline-art">
      {step === 2 && (
        <div
          className="cf-static-controls"
          role="group"
          aria-label="Compare original checkout screens"
        >
          <button
            type="button"
            aria-pressed={compareBefore}
            onClick={() => {
              setCompareBefore(true);
              setInspecting(true);
            }}
          >
            Before
          </button>
          <button
            type="button"
            aria-pressed={!compareBefore}
            onClick={() => {
              setCompareBefore(false);
              setInspecting(true);
            }}
          >
            After
          </button>
          <span>Different carts / compare layout</span>
        </div>
      )}
      <div className="cf-static-screen">
        <div
          className="cf-static-image"
          style={{
            transform: `scale(${1 + (compareBefore || inspecting ? 0 : zoom)})`,
            transformOrigin:
              step === 2 ? "24% 75%" : step === 1 ? "34% 50%" : "42% 50%",
          }}
        >
          <Image
            src={selectedSource}
            alt={step === 2 && compareBefore ? beats[0].alt : beat.alt}
            width={
              step === 3 ? 1025 : step === 2 && !compareBefore ? 3022 : 2026
            }
            height={
              step === 3 ? 559 : step === 2 && !compareBefore ? 1516 : 1144
            }
            sizes="(min-width: 900px) 60vw, 100vw"
          />
          {step === 1 && (
            <div
              className="cf-static-mark cf-static-legacy"
              aria-hidden="true"
            />
          )}
          {step === 2 && !compareBefore && (
            <div aria-hidden="true">
              <div className="cf-static-mark cf-static-delivery">
                <b>1</b>
              </div>
              <div className="cf-static-mark cf-static-contact">
                <b>2</b>
              </div>
              <div className="cf-static-mark cf-static-summary">
                <b>3</b>
              </div>
            </div>
          )}
        </div>
      </div>
      <figcaption>
        {step === 2 && compareBefore
          ? beats[0].evidence
          : step === 2 && zoom > 0.3 && !inspecting
            ? "Redesigned address entry / Original screen crop"
            : beat.evidence}
        <a href={selectedSource}>Open original image ↗</a>
      </figcaption>
    </figure>
  );
}

const SourceImage = memo(SourceImageBody);

function chapterInView(track: HTMLDivElement | null, fallback: number) {
  if (!track) return fallback;
  const nodes = [...track.querySelectorAll<HTMLElement>(".cf-beat")];
  let closest = fallback;
  let distance = Infinity;
  nodes.forEach((node, index) => {
    const rect = node.getBoundingClientRect();
    const delta = Math.abs(rect.top + rect.height / 2 - innerHeight * 0.54);
    if (delta < distance) {
      closest = index;
      distance = delta;
    }
  });
  return closest;
}

export default function CheckoutFlagship({
  role,
  company,
  timeframe,
  guide,
  children,
}: Props) {
  const caseRoot = useCaseHashDetails();
  const track = useRef<HTMLDivElement>(null);
  const pendingChapter = useRef<number | null>(null);
  const currentChapter = useRef(0);
  const [ready, setReady] = useState(false);
  const [reading, setReading] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [progress, setProgress] = useState(0);
  const [manual, setManual] = useState<
    "before" | "after" | "ticket" | "qa" | "full" | "quantity" | null
  >(null);
  const quiet = !ready || reading || reduced;
  const current = Math.round(progress);
  currentChapter.current = current;
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = (event?: MediaQueryListEvent) => {
      if (event)
        pendingChapter.current = chapterInView(
          track.current,
          currentChapter.current,
        );
      setReduced(media.matches);
    };
    update();
    setReady(true);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (pendingChapter.current === null) return;
    const index = pendingChapter.current;
    pendingChapter.current = null;
    const frame = requestAnimationFrame(() =>
      document
        .getElementById(beats[index].id)
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
      const targets = [
        ...track.current.querySelectorAll<HTMLElement>(".cf-beat"),
      ];
      const y = innerHeight * 0.54;
      const centers = targets.map((t) => {
        const r = t.getBoundingClientRect();
        return r.top + r.height / 2;
      });
      let value = 0;
      if (y >= centers[centers.length - 1]) value = centers.length - 1;
      else
        for (let i = 0; i < centers.length - 1; i++)
          if (y >= centers[i] && y < centers[i + 1]) {
            value = i + (y - centers[i]) / (centers[i + 1] - centers[i]);
            break;
          }
      setProgress(value);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    let watching = false;
    const observer = new IntersectionObserver(
      (entries) => {
        watching = entries.some((e) => e.isIntersecting);
        if (watching) {
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
  const afterEnter = clamp((progress - 1.3) / 0.4);
  const ticketEnter = clamp((progress - 2.55) / 0.3);
  const qaEnter = clamp((progress - 3.55) / 0.3);
  const resultEnter = clamp((progress - 4.55) / 0.3);
  // Each artifact is an opaque sheet. Scroll changes its position, never blends text.
  const legacyOpacity = manual
    ? Number(manual === "before")
    : Number(afterEnter < 1);
  const afterOpacity = manual
    ? Number(manual === "after")
    : Number(afterEnter > 0 && ticketEnter < 1);
  const ticketOpacity = manual
    ? Number(manual === "ticket")
    : Number(ticketEnter > 0 && qaEnter < 1);
  const qaOpacity = manual
    ? Number(manual === "qa")
    : Number(qaEnter > 0 && resultEnter < 1);
  const resultOpacity = manual
    ? Number(manual === "full" || manual === "quantity")
    : Number(resultEnter > 0);
  const transitionLabel = manual
    ? null
    : afterEnter > 0 && afterEnter < 1
      ? "Separate original captures / Legacy → redesign. Different carts."
      : ticketEnter > 0 && ticketEnter < 1
        ? "Product screen → Representative implementation ticket"
        : qaEnter > 0 && qaEnter < 1
          ? "Implementation evidence → Published QA scope"
          : resultEnter > 0 && resultEnter < 1
            ? "QA scope → Follow-up usability tasks"
            : null;
  const focus = manual ? 0 : clamp((progress - 0.15) / 0.7);
  const addressFocus = manual ? 0 : clamp((progress - 2.05) / 0.3);
  return (
    <div
      className="checkout-flagship"
      ref={caseRoot}
      data-mode={quiet ? "reading" : "motion"}
      data-scene={current}
      data-manual={manual ?? undefined}
      data-progress={progress.toFixed(2)}
    >
      <header className="cf-hero">
        <div className="cf-hero-top">
          <Link href="/work">← Selected work</Link>
          <span>
            {company} / {timeframe}
          </span>
        </div>
        <div className="cf-hero-grid">
          <div className="cf-hero-copy">
            <p className="cf-small-label">Commerce · Product leadership</p>
            <h1>
              Checkout
              <span>
                A clearer flow.
                <br />
                <em>A stronger build.</em>
              </span>
            </h1>
            <p className="cf-hero-summary">
              I helped product, UX, and engineering carry design intent through
              a high-stakes build.
            </p>
            <p className="cf-role">{role}</p>
            <p className="cf-hero-proof">
              <strong>3:00 → 2:03</strong>
              <span>Full-flow usability timing</span>
            </p>
            <a className="cf-start" href="#checkout-problem">
              Follow the redesign <span aria-hidden="true">↓</span>
            </a>
          </div>
          <figure className="cf-hero-art">
            <div className="cf-hero-sheet cf-hero-sheet-back">
              <Image
                src={before}
                alt=""
                width={2026}
                height={1144}
                sizes="60vw"
                priority
              />
            </div>
            <div className="cf-hero-sheet">
              <Image
                src={after}
                alt="Original redesigned Guitar Center checkout delivery screen."
                width={3022}
                height={1516}
                sizes="(min-width: 900px) 65vw, 100vw"
                priority
              />
            </div>
            <figcaption>
              Original product screen / Redesigned delivery step
            </figcaption>
          </figure>
        </div>
      </header>
      <div className="cf-toolbar">
        <nav aria-label="Checkout story chapters">
          {beats.map((beat, i) => (
            <a
              key={beat.id}
              href={`#${beat.id}`}
              aria-current={!quiet && current === i ? "step" : undefined}
            >
              <span>0{i + 1}</span>
              {beat.short}
            </a>
          ))}
        </nav>
        <div className="cf-artifact-controls cf-toolbar-tools">
          <label className="cf-inspector">
            <span>Inspect</span>
            <select
              aria-label="Inspect checkout evidence"
              value={manual ?? "auto"}
              onChange={(event) =>
                setManual(
                  event.target.value === "auto"
                    ? null
                    : (event.target.value as Exclude<typeof manual, null>),
                )
              }
            >
              <option value="auto">Follow scroll</option>
              <option value="before">Before / legacy screen</option>
              <option value="after">After / redesigned screen</option>
              <option value="ticket">Implementation ticket</option>
              <option value="qa">QA scope</option>
              <option value="full">Full checkout task</option>
              <option value="quantity">Quantity-change task</option>
            </select>
          </label>
          <a
            href={
              manual === "before"
                ? before
                : manual === "after"
                  ? after
                  : manual === "ticket"
                    ? ticket
                    : manual === "qa"
                      ? "#checkout-source-delivery"
                      : manual
                        ? "#checkout-full-evidence"
                        : beats[current].source
            }
          >
            Open source ↗
          </a>
        </div>
        <button
          type="button"
          aria-pressed={quiet}
          onClick={() => {
            pendingChapter.current = chapterInView(track.current, current);
            setManual(null);
            setReading((v) => !v);
          }}
          disabled={reduced}
        >
          {reduced
            ? "Reduced motion on"
            : reading
              ? "Return to scroll story"
              : "Read without motion"}
        </button>
      </div>
      <section
        className="cf-scroll"
        aria-label="The checkout redesign, through its evidence"
        id="case-motion"
      >
        <div className="cf-sticky">
          <div className="cf-artifact-area">
            <div className="cf-evidence-top">
              <span>
                {manual
                  ? `Manual inspection / ${{ before: "Legacy screen", after: "Redesigned screen", ticket: "Representative implementation ticket", qa: "Focused QA scope", full: "Full checkout task", quantity: "Quantity-change task" }[manual]}`
                  : (transitionLabel ?? beats[current].evidence)}
              </span>
              <span>0{current + 1} / 06</span>
            </div>
            <div className="cf-evidence-window" aria-hidden="true">
              <div
                className="cf-screen-plane cf-legacy-plane"
                style={{
                  opacity: legacyOpacity,
                  transform: `translate(calc(-50% - ${(manual ? 0 : afterEnter) * 110}%), -50%) scale(${1 + focus * 0.4})`,
                  transformOrigin: "42% 48%",
                }}
              >
                <Image
                  src={before}
                  alt=""
                  width={2026}
                  height={1144}
                  sizes="70vw"
                />
                <div
                  className="cf-highlight cf-legacy-highlight"
                  style={{ opacity: manual ? 0 : clamp(progress) }}
                />
              </div>
              <div
                className="cf-screen-plane cf-after-plane"
                style={{
                  opacity: afterOpacity,
                  transform: `translate(calc(-50% + ${(manual ? 0 : 1 - afterEnter) * 110}%), -50%) scale(${1 + addressFocus * 0.2})`,
                  transformOrigin: "40% 75%",
                }}
              >
                <Image
                  src={after}
                  alt=""
                  width={3022}
                  height={1516}
                  sizes="70vw"
                />
                <div className="cf-highlight cf-delivery-highlight">
                  <b>1</b>
                </div>
                <div className="cf-highlight cf-contact-highlight">
                  <b>2</b>
                </div>
                <div className="cf-highlight cf-summary-highlight">
                  <b>3</b>
                </div>
                <div
                  className="cf-highlight cf-address-highlight"
                  style={{ opacity: addressFocus }}
                />
              </div>
              <div
                className="cf-screen-plane cf-ticket-plane"
                style={{
                  opacity: ticketOpacity,
                  transform: `translate(-50%, calc(-50% + ${(manual ? 0 : 1 - ticketEnter) * 110}cqh)) rotate(${(manual ? 0 : 1 - ticketEnter) * -3}deg)`,
                }}
              >
                <Image
                  src={ticket}
                  alt=""
                  width={1025}
                  height={559}
                  sizes="70vw"
                />
                <span className="cf-ticket-mark cf-ticket-need">User need</span>
                <span className="cf-ticket-mark cf-ticket-behavior">
                  Expected behavior
                </span>
                <span className="cf-ticket-mark cf-ticket-impact">Context</span>
              </div>
              <div
                className="cf-chart-plane"
                style={{
                  opacity: qaOpacity,
                  transform: `translateX(${(manual ? 0 : 1 - qaEnter) * 110}%)`,
                }}
              >
                <QaGraphic />
              </div>
              <div
                className="cf-chart-plane"
                style={{
                  opacity: resultOpacity,
                  transform: `translateX(${(manual ? 0 : 1 - resultEnter) * 110}%)`,
                }}
              >
                <TimingGraphic quantity={manual === "quantity"} />
              </div>
            </div>
          </div>
        </div>
        <div className="cf-beat-track" ref={track}>
          {beats.map((beat, i) => (
            <article
              key={beat.id}
              id={beat.id}
              className="cf-beat"
              data-current={current === i}
            >
              <div className="cf-beat-copy">
                <p className="cf-small-label">
                  0{i + 1} / {beat.short}
                </p>
                <h2>{beat.title}</h2>
                <p>{beat.body}</p>
                {i === 2 && (
                  <ol className="cf-screen-key">
                    <li>Delivery choices</li>
                    <li>Contact information</li>
                    <li>Order summary</li>
                  </ol>
                )}
                <details>
                  <summary>Evidence &amp; qualification</summary>
                  <p>{beat.detail}</p>
                  <a href={beat.source}>{beat.sourceLabel} ↗</a>
                </details>
                {i === 5 && (
                  <a
                    href="#checkout-business-result"
                    className="cf-next-evidence"
                  >
                    Continue to the post-launch A/B result ↓
                  </a>
                )}
              </div>
              <div className="cf-linear-art">
                <SourceImage
                  step={i}
                  zoom={
                    quiet
                      ? 0
                      : i === 1
                        ? clamp((progress - 0.4) / 0.6) * 1.5
                        : i === 2
                          ? clamp((progress - 2.05) / 0.35) * 1
                          : 0
                  }
                />
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="cf-business-result" id="checkout-business-result">
        <p className="cf-small-label">
          A separate measurement / Post-launch A/B test
        </p>
        <h2>
          The live experience
          <br />
          <em>moved the business.</em>
        </h2>
        <div className="cf-business-proof">
          <p>
            <strong>~3%</strong>
            <span>
              conversion lift
              <br />
              in the post-launch A/B test
            </span>
          </p>
          <p>
            <strong>~$16M</strong>
            <span>
              estimated annualized revenue impact
              <br />
              derived from the validated lift
            </span>
          </p>
        </div>
        <p className="cf-business-limit">
          The annualized figure is an estimate from the A/B result. The
          usability tasks above measure interaction time and task success; they
          are separate evidence.
        </p>
      </section>
      <section className="cf-full-evidence" id="checkout-full-evidence">
        <div className="cf-evidence-heading">
          <p className="cf-small-label">The complete record</p>
          <h2>
            Inspect the detail.
            <br />
            <em>Keep the qualifications.</em>
          </h2>
          <p>
            Original narrative, measurements, artifacts, and collaborator
            recommendations remain available below.
          </p>
        </div>
        <div className="cf-guide-entry">{guide}</div>
        {children}
      </section>
      <footer className="cf-close">
        <p>What this work reinforced</p>
        <h2>
          Shared context gives people
          <br />
          room to make better decisions.
        </h2>
        <Link href="/work">Explore the rest of the work ↗</Link>
      </footer>
    </div>
  );
}
