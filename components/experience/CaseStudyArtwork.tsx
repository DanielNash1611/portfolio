"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { useRef, useState } from "react";
import "./case-study-artwork.css";

type Artifact = {
  tab: string;
  title: string;
  image: string;
  alt: string;
  provenance: string;
};

const artifactSets: Record<string, { label: string; artifacts: Artifact[] }> = {
  "chatgpt-enterprise": {
    label: "Inside the adoption case study",
    artifacts: [
      {
        tab: "Discovery",
        title: "Find the workflows worth changing.",
        image: "frontline-discovery.webp",
        alt: "Sanitized frontline ideation exhibit showing brainstorming, idea expansion, and the Gear Companion workflow concept.",
        provenance: "Sanitized discovery exhibit",
      },
      {
        tab: "Operating model",
        title: "Build the conditions for safe scale.",
        image: "adoption-operating-model.webp",
        alt: "Published enterprise AI operating-model exhibit connecting use-case discovery, governance, a measured pilot, scale, and feedback.",
        provenance: "Sanitized operating-model exhibit",
      },
      {
        tab: "Champions",
        title: "Give adoption a human network.",
        image: "champions.webp",
        alt: "Sanitized champions-model exhibit showing functional champions, working sessions, cross-functional alignment, and executive sponsorship.",
        provenance: "Sanitized champions exhibit",
      },
    ],
  },
  "ai-platform-mcp": {
    label: "Inside the platform case study",
    artifacts: [
      {
        tab: "Prototype",
        title: "Start with a product people can try.",
        image: "sound-synthesist.webp",
        alt: "Sound Synthesist custom GPT product visual from the platform case study, showing musical discovery prompts and its conversational interface.",
        provenance: "Published functional-prototype visual",
      },
      {
        tab: "Validation",
        title: "Follow the signal from musicians.",
        image: "prototype-validation.webp",
        alt: "Sound Synthesist UX validation exhibit showing user sentiment, participant quotes, and the reported 87 percent would-use-again result.",
        provenance: "Published UX validation exhibit",
      },
      {
        tab: "Channels",
        title: "Explore where the capability could go.",
        image: "omnichannel-concepts.webp",
        alt: "Published conceptual ecommerce, in-store, and contact-center extensions of the Sound Synthesist experience.",
        provenance: "Conceptual extensions · not production screens",
      },
    ],
  },
  "ai-career-operating-system": {
    label: "Inside the AI Career Operating System",
    artifacts: [
      {
        tab: "Product",
        title: "A real role-specific resume workflow.",
        image: "resume-generator.webp",
        alt: "Actual public resume-generation form from Daniel’s portfolio, with a job-description field and generation action.",
        provenance: "Public resume generator",
      },
      {
        tab: "Output",
        title: "The artifact a recruiter receives.",
        image: "public-resume-output.webp",
        alt: "First page of Daniel’s published AI Product Leader PDF resume, rendered from the existing public download.",
        provenance: "Published ResumeCustomizer output",
      },
      {
        tab: "System",
        title: "Inspect how the evidence travels.",
        image: "governed-career-workflow.webp",
        alt: "Published governed career workflow showing approved evidence, portfolio proof, retrieval, role tailoring, specialized reviews, and human approval.",
        provenance: "Published workflow diagram · human approval retained",
      },
    ],
  },
};

/** Show the artifacts the destination actually contains, rather than a new metaphor. */
export default function CaseStudyArtwork({
  slug,
  progress,
  quiet,
}: {
  slug: string;
  progress: MotionValue<number>;
  quiet: boolean;
}) {
  const [active, setActive] = useState(0);
  const scrollSelection = useRef(0);
  useMotionValueEvent(progress, "change", (value) => {
    if (quiet) return;
    const career = slug === "ai-career-operating-system";
    const next =
      value < (career ? 0.33 : 0.43)
        ? 0
        : value < (career ? 0.72 : 0.6)
          ? 1
          : 2;
    // A manual choice persists until the visitor scrolls into another beat.
    if (next !== scrollSelection.current) {
      scrollSelection.current = next;
      setActive(next);
    }
  });
  const set = artifactSets[slug];
  if (!set) return null;
  const artifact = set.artifacts[active];
  const destination =
    slug === "ai-career-operating-system"
      ? "/products/ai-career-operating-system"
      : `/work/${slug}`;
  return (
    <figure
      className="experience-case-artwork"
      data-artifact-project={slug}
      data-quiet={quiet}
    >
      <p className="experience-case-artwork-label">{set.label}</p>
      <Link
        className="experience-case-artifact-window"
        href={destination}
        aria-label={`Explore ${set.label.toLowerCase()}: ${artifact.title}`}
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={artifact.image}
            className="experience-case-artifact-sheet"
            initial={quiet ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={quiet ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: quiet ? 0 : 0.65 }}
          >
            <Image
              src={`/images/experience/case-study-artwork/${artifact.image}`}
              alt={artifact.alt}
              fill
              sizes="(min-width:900px) 52vw, 94vw"
            />
          </motion.div>
        </AnimatePresence>
      </Link>
      <figcaption>
        <strong>{artifact.title}</strong>
        <span>{artifact.provenance}</span>
      </figcaption>
      <div
        className="experience-case-artifact-tabs"
        role="group"
        aria-label={`${set.label}: choose an artifact`}
      >
        {set.artifacts.map((item, index) => (
          <button
            key={item.tab}
            aria-pressed={active === index}
            onClick={() => setActive(index)}
          >
            <span aria-hidden="true">0{index + 1}</span> {item.tab}
          </button>
        ))}
      </div>
    </figure>
  );
}
