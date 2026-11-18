"use client";

import Link from "next/link";
import { useMotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { ExperienceWorkStory } from "@/content/experience-leadership";
import CardCollection from "./CardCollection";
import ProjectArtwork from "./ProjectArtwork";
import "./leadership-cards.css";

function CaseFace({
  item,
  index,
  expanded,
  titleId,
}: {
  item: ExperienceWorkStory;
  index: number;
  expanded: boolean;
  titleId: string;
}) {
  const card = item.card!;
  return (
    <div className="outcome-paper-face leadership-case-face">
      <p className="outcome-paper-category">
        <span>{["I", "II", "III"][index] ?? index + 1}</span>
        {item.eyebrow}
      </p>
      <h3 id={expanded ? titleId : undefined}>
        {expanded ? item.title : card.title}
      </h3>
      <div className="outcome-paper-proof">
        <p className="outcome-paper-value">{card.value}</p>
        <p className="outcome-paper-measure">{card.measure}</p>
        <p className="outcome-paper-qualification">{card.qualification}</p>
      </div>
    </div>
  );
}

function CaseDetails({ item }: { item: ExperienceWorkStory }) {
  // Artifact choices stay under the reader's control while the paper scrolls.
  const progress = useMotionValue(0);
  return (
    <div className="leadership-card-details">
      <dl className="leadership-card-reasoning">
        <div>
          <dt>My leadership role</dt>
          <dd>{item.description}</dd>
        </div>
        <div>
          <dt>Leadership decision</dt>
          <dd>{item.card!.decision}</dd>
        </div>
      </dl>
      <div className="leadership-card-artifact" data-project={item.slug}>
        <ProjectArtwork slug={item.slug} progress={progress} quiet />
      </div>
      {item.caseStudyStatus === "in-development" && (
        <p className="leadership-case-status">
          Case study in development · The rollout summary and workflow
          comparison are available above.
        </p>
      )}
      <div className="leadership-case-links">
        <Link href={item.href} className="outcome-paper-source">
          {item.action}
          <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
        {item.relatedEvidence && (
          <Link
            href={item.relatedEvidence.href}
            className="outcome-paper-source"
          >
            {item.relatedEvidence.label}
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        )}
      </div>
    </div>
  );
}

export default function LeadershipCaseChapter({
  items,
  reading,
  paused,
}: {
  items: ExperienceWorkStory[];
  reading: boolean;
  paused: boolean;
}) {
  return (
    <CardCollection
      items={items}
      reading={reading}
      paused={paused}
      id="experience-work"
      className="experience-work experience-leadership-cases"
      eyebrow="The conductor’s folio / Leadership in practice"
      heading={
        <>
          Make good work
          <br />
          <em>repeatable.</em>
        </>
      }
      instructions={
        <>
          Three movements in practice.
          <br />
          Choose a score leaf to open its story.
        </>
      }
      collectionLabel="Leadership cases"
      container="score-folio"
      next={{
        href: "#experience-toolkit",
        label: "Explore the product method",
      }}
      getKey={(item) => item.slug}
      getLabel={(item) =>
        `Open ${item.title}: ${item.card!.value}. ${item.card!.measure}. ${item.card!.qualification}`
      }
      renderFace={(item, index, expanded, titleId) => (
        <CaseFace
          item={item}
          index={index}
          expanded={expanded}
          titleId={titleId}
        />
      )}
      renderDetails={(item) => <CaseDetails item={item} />}
    />
  );
}
