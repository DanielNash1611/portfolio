"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowDown, ArrowUpRight, X } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { ExperienceHomeContent } from "@/content/experience-home";
import { evidenceExample, workflowStages } from "@/content/experience";
import {
  omsDeliveryBoundary,
  omsDeliveryMilestones,
} from "@/content/projects/oms-delivery";
import {
  productProofFrame,
  productProofLocal,
  productProofTarget,
  orderProofProducts,
  proofEase,
} from "@/lib/experience/product-proof";
import { useProductProof } from "./useProductProof";
import { Products } from "./ExperienceStories";
import "./product-proof.css";

type Product = ExperienceHomeContent["products"][number];
const stories = [
  {
    short: "OMS ChatGPT",
    qualification: "Working prototype · Simulated OMS data",
    views: ["Order context", "Explicit confirmation"],
    titles: ["Review the order.", "Confirm the consequence."],
    sentences: [
      "Bring the order and its items into the conversation.",
      "The confirmation names the action and warns it cannot be undone.",
    ],
    limit:
      "These recorded prototype states use simulated OMS data. They demonstrate lookup and cancellation design, not a production rollout or measured time saving. This preview does not execute an action.",
    captures: [
      ["Order and items", "/images/oms-chatgpt-app/order-items-chatgpt.png"],
      [
        "Cancellation confirmation",
        "/images/oms-chatgpt-app/cancellation-guardrails-chatgpt.png",
      ],
    ],
  },
  {
    short: "Career workflow",
    qualification: "Public artifacts · Personal operating workflow",
    views: ["Published artifacts", "Source and responsibility"],
    titles: ["Tailor from approved evidence.", "Keep approval with a person."],
    sentences: [
      "A role-specific brief gives the draft its emphasis.",
      "Source checks and AI-assisted critique support Daniel’s final review.",
    ],
    limit:
      "The public form and published PDF are separate recorded artifacts, not a live generation in this walkthrough. The broader system is Daniel’s personal operating environment; these artifacts do not establish external adoption. AI-assisted checks support review; final approval remains human.",
    captures: [
      [
        "Public generator form",
        "/images/experience/case-study-artwork/resume-generator.webp",
      ],
      [
        "Published résumé",
        "/images/experience/case-study-artwork/public-resume-output.webp",
      ],
    ],
  },
  {
    short: "Immunology Scout",
    qualification: "Concept in progress · Fictional Aster data",
    views: ["Graph overview", "Selected relationship", "Read its source"],
    titles: [
      "Separate support from inference.",
      "Inspect the relationship.",
      "Open the source behind it.",
    ],
    sentences: [
      "The real interface exposes distinct evidence states.",
      "Selection highlights the relationship and its connected nodes.",
      "The source note carries its document ID and extraction method.",
    ],
    limit:
      "These are real Mechanisms workspace captures populated with invented Aster study fixtures. All entities, relationships, confidence values, and source notes are fictional. They demonstrate interface behavior, not scientific findings, expert validation, or a product launch.",
    captures: [
      ["Mechanism graph", "/images/experience/scout/aster-map-close.webp"],
      [
        "Selected relationship",
        "/images/experience/scout/aster-relationship-close.webp",
      ],
      [
        "Fictional source note",
        "/images/experience/scout/aster-source-detail.webp",
      ],
    ],
  },
] as const;
const scoutViewLabels = ["Map", "Relationship", "Source"] as const;

/** Crops the authentic capture in the browser; no screenshot content is redrawn. */
function CaptureCrop({
  src,
  alt,
  width,
  height,
  crop,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  crop: readonly [number, number, number, number];
}) {
  const [x, y, w, h] = crop;
  return (
    <span className="proof-capture-crop" style={{ aspectRatio: `${w}/${h}` }}>
      <Image
        src={src}
        alt={alt}
        unoptimized
        width={width}
        height={height}
        sizes="(min-width:900px) 150vw, 180vw"
        style={{
          width: `${(width / w) * 100}%`,
          height: `${(height / h) * 100}%`,
          left: `${(-x / w) * 100}%`,
          top: `${(-y / h) * 100}%`,
        }}
      />
    </span>
  );
}

function OrderEvidence({ progress }: { progress: MotionValue<number> }) {
  const turn = useTransform(progress, (p) => proofEase(p, 0.24, 0.84));
  const x = useTransform(turn, [0, 1], [0, -92]);
  const scale = useTransform(turn, [0, 1], [1, 0.79]);
  const opacity = useTransform(turn, [0, 1], [1, 0.42]);
  const y = useTransform(turn, [0, 1], ["122%", "0%"]);
  const rotate = useTransform(turn, [0, 1], [-5, 0]);
  return (
    <div className="proof-order-canvas">
      <motion.div className="proof-order-context" style={{ x, scale, opacity }}>
        <CaptureCrop
          src={stories[0].captures[0][1]}
          width={1887}
          height={850}
          crop={[763, 113, 566, 564]}
          alt="Actual OMS ChatGPT prototype order summary and expanded items, using a simulated order."
        />
      </motion.div>
      <motion.div className="proof-order-confirmation" style={{ y, rotate }}>
        <span className="proof-artifact-label">
          The decision in the actual UI
        </span>
        <CaptureCrop
          src={stories[0].captures[1][1]}
          width={1883}
          height={919}
          crop={[762, 417, 568, 312]}
          alt="Actual cancellation confirmation: an irreversible-action warning, required confirmation phrase, keep-order button, and final cancellation button."
        />
      </motion.div>
      <p className="proof-canvas-caption">
        Recorded prototype states · No action is being executed
      </p>
    </div>
  );
}

function CareerEvidence({ progress }: { progress: MotionValue<number> }) {
  const turn = useTransform(progress, (p) => proofEase(p, 0.18, 0.82));
  const formX = useTransform(turn, [0, 1], [0, -70]);
  const formScale = useTransform(turn, [0, 1], [1, 0.87]);
  const formOpacity = useTransform(turn, [0, 1], [1, 0.28]);
  const paperY = useTransform(turn, [0, 1], ["66%", "-6%"]);
  const paperRotate = useTransform(turn, [0, 1], [5, -2]);
  const noteY = useTransform(turn, [0, 1], ["150%", "0%"]);
  return (
    <div className="proof-career-canvas">
      <motion.div
        className="proof-career-form"
        style={{ x: formX, scale: formScale, opacity: formOpacity }}
      >
        <Image
          src={stories[1].captures[0][1]}
          unoptimized
          alt="Actual public résumé generator form with a role-description field and delivery choices."
          width={1216}
          height={798}
          sizes="(min-width:900px) 60vw, 90vw"
        />
      </motion.div>
      <motion.div
        className="proof-career-paper"
        style={{ y: paperY, rotate: paperRotate }}
      >
        <span className="proof-artifact-label">
          Published résumé · Recorded artifact
        </span>
        <Image
          src={stories[1].captures[1][1]}
          unoptimized
          alt="Daniel’s published AI Product Leader résumé, a real public PDF artifact."
          width={773}
          height={1000}
          sizes="(min-width:900px) 36vw, 70vw"
        />
      </motion.div>
      <motion.aside className="proof-source-note" style={{ y: noteY }}>
        <span>Role summary / From the published product story</span>
        <p>
          Defined the architecture, evidence boundaries, workflow stages, and
          evaluation criteria.
        </p>
        <small>Built with AI assistance. Final approval remains human.</small>
      </motion.aside>
      <p className="proof-canvas-caption">
        Two published artifacts · No résumé is being generated
      </p>
    </div>
  );
}

function ScoutEvidence({ progress }: { progress: MotionValue<number> }) {
  const turn = useTransform(progress, (p) => proofEase(p, 0.53, 0.9));
  const x = useTransform(turn, [0, 1], ["0%", "-16%"]);
  const scale = useTransform(turn, [0, 1], [1, 1.1]);
  const select = useTransform(
    progress,
    (p) => `inset(0 ${100 - proofEase(p, 0.1, 0.32) * 100}% 0 0)`,
  );
  const panelX = useTransform(turn, [0, 1], ["115%", "0%"]);
  return (
    <div className="proof-scout-canvas">
      <motion.div className="proof-scout-graph" style={{ x, scale }}>
        <Image
          src={stories[2].captures[0][1]}
          unoptimized
          alt="Real Mechanisms workspace graph with fictional Aster entities and evidence statuses."
          width={720}
          height={380}
          sizes="(min-width:900px) 64vw, 100vw"
        />
        <motion.div
          className="proof-scout-selected"
          style={{ clipPath: select }}
        >
          <Image
            src={stories[2].captures[1][1]}
            unoptimized
            alt="The same real graph with a fictional relationship and its connected nodes selected."
            width={720}
            height={380}
            sizes="(min-width:900px) 64vw, 100vw"
          />
        </motion.div>
      </motion.div>
      <motion.div className="proof-scout-source" style={{ x: panelX }}>
        <span className="proof-artifact-label">
          The source panel in the real app
        </span>
        <Image
          src={stories[2].captures[2][1]}
          unoptimized
          alt="Actual source panel stating that illustrative study note B is fictional and contains no scientific finding, with its demo document ID and source trail."
          width={350}
          height={350}
          sizes="(min-width:900px) 350px, 78vw"
        />
      </motion.div>
      <p className="proof-canvas-caption">
        Actual app · Fictional study, relationships, and source notes
      </p>
    </div>
  );
}

function EvidenceSurface({
  project,
  progress,
}: {
  project: number;
  progress: MotionValue<number>;
}) {
  return project === 0 ? (
    <OrderEvidence progress={progress} />
  ) : project === 1 ? (
    <CareerEvidence progress={progress} />
  ) : (
    <ScoutEvidence progress={progress} />
  );
}

function ProjectNotes({ item, project }: { item: Product; project: number }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const story = stories[project];
  useEffect(() => {
    if (!open || !dialog.current) return;
    const element = dialog.current;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    element.showModal();
    return () => {
      element.close();
      document.body.style.overflow = previous;
    };
  }, [open]);
  return (
    <>
      <button
        className="proof-notes-button"
        onClick={() => setOpen(true)}
        type="button"
        aria-haspopup="dialog"
        aria-controls={`proof-notes-dialog-${project}`}
      >
        Role & evidence <ArrowUpRight size={14} aria-hidden="true" />
      </button>
      <dialog
        ref={dialog}
        id={`proof-notes-dialog-${project}`}
        className="proof-notes-dialog"
        aria-labelledby={`proof-notes-${project}`}
        onClose={() => setOpen(false)}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const controls = Array.from(
            event.currentTarget.querySelectorAll<HTMLElement>(
              "button:not(:disabled),a[href],summary",
            ),
          ).filter((element) => element.getClientRects().length > 0);
          const first = controls[0],
            last = controls.at(-1);
          if (
            event.shiftKey &&
            (document.activeElement === first ||
              document.activeElement === event.currentTarget)
          ) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
      >
        <button
          className="proof-notes-close"
          onClick={() => setOpen(false)}
          aria-label="Close product notes"
        >
          <X size={20} />
        </button>
        <p className="proof-eyebrow">Responsibility & evidence</p>
        <h3 id={`proof-notes-${project}`}>{item.title}</h3>
        <h4>My role</h4>
        <p>{item.description}</p>
        <h4>What these artifacts establish</h4>
        <p>{story.limit}</p>
        {project === 0 ? (
          <details className="proof-review-details">
            <summary>Later internal delivery</summary>
            {omsDeliveryMilestones.map(({ when, detail }) => (
              <p key={when}>
                <strong>{when}</strong> · {detail}
              </p>
            ))}
            <p>{omsDeliveryBoundary}</p>
          </details>
        ) : null}
        {project === 1 ? (
          <details className="proof-review-details">
            <summary>How the review workflow works</summary>
            <ol>
              {workflowStages.map((stage) => (
                <li key={stage.id}>
                  <strong>
                    {stage.label} · {stage.title}
                  </strong>
                  <p>{stage.detail}</p>
                </li>
              ))}
            </ol>
            <p>{evidenceExample.statement}</p>
            <Link href={evidenceExample.source}>
              Read the responsibility statement <ArrowUpRight size={14} />
            </Link>
          </details>
        ) : null}
        <h4>Original captures</h4>
        <ul>
          {story.captures.map(([label, href]) => (
            <li key={href}>
              <a href={href} target="_blank" rel="noreferrer">
                {label} <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
        <Link href={item.href}>
          Read the product story <ArrowUpRight size={16} />
        </Link>
      </dialog>
    </>
  );
}

function MovingSurface({
  project,
  progress,
  active,
}: {
  project: number;
  progress: MotionValue<number>;
  active: boolean;
}) {
  const local = useTransform(progress, (p) => productProofLocal(p, project));
  return (
    <div
      className="proof-moving-surface"
      data-active={active}
      aria-hidden={!active}
    >
      <EvidenceSurface project={project} progress={local} />
    </div>
  );
}

function StaticProject({ item, project }: { item: Product; project: number }) {
  const initial = project === 2 ? 2 : 1;
  const [step, setStep] = useState(initial);
  const progress = useMotionValue(
    productProofLocal(productProofTarget(project, initial), project),
  );
  const story = stories[project];
  const choose = (next: number) => {
    setStep(next);
    progress.set(productProofLocal(productProofTarget(project, next), project));
  };
  return (
    <article className="proof-static-project">
      <p className="proof-eyebrow">
        0{project + 1} / {story.qualification}
      </p>
      <h3>{item.title}</h3>
      <div className="proof-static-layout">
        <div className="proof-static-copy">
          <h4>{story.titles[step]}</h4>
          <p>{story.sentences[step]}</p>
          <nav aria-label={`${item.title} recorded views`}>
            {story.views.map((view, index) => (
              <button
                key={view}
                aria-pressed={step === index}
                aria-label={view}
                onClick={() => choose(index)}
              >
                {project === 2 ? scoutViewLabels[index] : view}
              </button>
            ))}
          </nav>
          <ProjectNotes item={item} project={project} />
          <Link href={item.href}>
            Explore the product <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="proof-static-surface">
          <EvidenceSurface project={project} progress={progress} />
        </div>
      </div>
    </article>
  );
}

export default function ProductProofChapter({
  items,
  reading,
  paused,
}: {
  items: ExperienceHomeContent["products"];
  reading: boolean;
  paused: boolean;
}) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const sequence = useProductProof(root, stage, reading, paused);
  const [frame, setFrame] = useState(productProofFrame(0));
  useMotionValueEvent(sequence.progress, "change", (p) => {
    const next = productProofFrame(p);
    if (next.project !== frame.project || next.step !== frame.step)
      setFrame(next);
  });
  const lineScale = useTransform(sequence.progress, [0, 1], [0, 1]);
  const ordered = orderProofProducts(items);
  if (!ordered) return <Products items={items} paused={paused} />;
  const item = ordered[frame.project];
  const story = stories[frame.project];
  return (
    <section
      ref={root}
      className="experience-product-proof"
      id="experience-products"
      aria-labelledby="experience-products-heading"
      data-sequence={sequence.enabled}
      data-project={frame.project}
      style={{ "--proof-travel": `${sequence.travel}px` } as CSSProperties}
    >
      {sequence.enabled ? (
        <div ref={stage} className="proof-stage">
          <header className="proof-header">
            <div>
              <p className="proof-eyebrow">Hands-on product judgment</p>
              <h2 id="experience-products-heading">
                Lead through <em>the build.</em>
              </h2>
            </div>
            <nav aria-label="Choose a working product">
              {ordered.map((product, index) => (
                <button
                  key={product.slug}
                  aria-pressed={frame.project === index}
                  onClick={() => sequence.select(index, 0)}
                >
                  <span>0{index + 1}</span>
                  {stories[index].short}
                </button>
              ))}
            </nav>
          </header>
          <div className="proof-layout">
            <div className="proof-decision" aria-live="off">
              <p className="proof-eyebrow">{story.qualification}</p>
              <h3>{item.title}</h3>
              <div className="proof-decision-words">
                <span>0{frame.step + 1} / The product decision</span>
                <h4>{story.titles[frame.step]}</h4>
                <p>{story.sentences[frame.step]}</p>
              </div>
              <nav
                className="proof-view-nav"
                aria-label={`${item.title} recorded views`}
              >
                {story.views.map((view, index) => (
                  <button
                    key={view}
                    aria-pressed={frame.step === index}
                    aria-label={view}
                    onClick={() => sequence.select(frame.project, index)}
                  >
                    {frame.project === 2 ? scoutViewLabels[index] : view}
                  </button>
                ))}
              </nav>
              <div className="proof-actions">
                <ProjectNotes
                  key={item.slug}
                  item={item}
                  project={frame.project}
                />
                <Link href={item.href}>
                  Explore the product{" "}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </div>
            <div className="proof-evidence-window">
              {stories.map((_, index) => (
                <MovingSurface
                  key={index}
                  project={index}
                  progress={sequence.progress}
                  active={frame.project === index}
                />
              ))}
            </div>
          </div>
          <footer className="proof-footer">
            <span>
              Scroll to follow the decision{" "}
              <ArrowDown size={14} aria-hidden="true" />
            </span>
            <Link className="proof-mobile-product" href={item.href}>
              Explore the product <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
            <a href="#experience-work">
              Continue to leadership cases{" "}
              <ArrowDown size={14} aria-hidden="true" />
            </a>
          </footer>
          <motion.div
            className="proof-travel-line"
            style={{ scaleX: lineScale }}
            aria-hidden="true"
          />
        </div>
      ) : (
        <div className="proof-static">
          <header className="proof-header">
            <div>
              <p className="proof-eyebrow">Hands-on product judgment</p>
              <h2 id="experience-products-heading">
                Lead through <em>the build.</em>
              </h2>
            </div>
          </header>
          {ordered.map((item, index) => (
            <StaticProject key={item.slug} item={item} project={index} />
          ))}
        </div>
      )}
    </section>
  );
}
