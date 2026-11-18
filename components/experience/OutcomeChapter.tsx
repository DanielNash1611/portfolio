"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ExperienceHomeContent } from "@/content/experience-home";
import CardCollection from "./CardCollection";

type Outcome = ExperienceHomeContent["outcomes"][number];

function MetricFace({
  item,
  index,
  expanded = false,
  titleId,
}: {
  item: Outcome;
  index: number;
  expanded?: boolean;
  titleId?: string;
}) {
  return (
    <div className="outcome-paper-face">
      <p className="outcome-paper-category">
        <span>0{index + 1}</span>
        {item.category}
      </p>
      <h3 id={expanded ? titleId : undefined}>{item.title}</h3>
      <div className="outcome-paper-proof">
        <p className="outcome-paper-value">{item.value}</p>
        <p className="outcome-paper-measure">{item.measure}</p>
        <p className="outcome-paper-qualification">{item.qualification}</p>
      </div>
    </div>
  );
}

function PaperDetails({ item }: { item: Outcome }) {
  return (
    <>
      <div className="outcome-paper-details">
        <div className="outcome-paper-reasoning">
          <p className="outcome-paper-eyebrow">The leadership work</p>
          <h4>{item.heading}</h4>
          <dl>
            <div>
              <dt>My leadership role</dt>
              <dd>{item.role}</dd>
            </div>
            <div>
              <dt>Leadership decision</dt>
              <dd>{item.decision}</dd>
            </div>
          </dl>
          <p className="outcome-paper-evidence">{item.evidence}</p>
          <Link href={item.href} className="outcome-paper-source">
            {item.action}
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <figure className="outcome-paper-artifact">
          {item.image ? (
            <div className="outcome-paper-image">
              <Image
                src={item.image}
                alt={item.alt ?? ""}
                fill
                sizes="(min-width: 900px) 32vw, 90vw"
              />
            </div>
          ) : (
            <div className="outcome-paper-quote">
              <blockquote>“{item.quote}”</blockquote>
              <p>{item.attribution}</p>
            </div>
          )}
          <figcaption>{item.caption}</figcaption>
        </figure>
      </div>
      {item.practice ? (
        <aside
          className="outcome-leadership-practice"
          aria-label="Building product practice"
        >
          <div>
            <p className="outcome-paper-eyebrow">Beyond a single roadmap</p>
            <h4>{item.practice.title}</h4>
            <p>{item.practice.description}</p>
          </div>
          <Link href={item.practice.href} className="outcome-paper-source">
            {item.practice.action}
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </aside>
      ) : null}
    </>
  );
}

export default function OutcomeChapter({
  items,
  reading,
  paused,
}: {
  items: ExperienceHomeContent["outcomes"];
  reading: boolean;
  paused: boolean;
}) {
  return (
    <CardCollection
      items={items}
      reading={reading}
      paused={paused}
      id="experience-outcomes"
      className="experience-outcomes"
      eyebrow="Leadership in practice / Guitar Center"
      heading={
        <>
          How I lead.
          <br />
          <em>What it makes possible.</em>
        </>
      }
      instructions={
        <>
          Scroll to unfold the map.
          <br />
          Choose a leaf to open its story.
        </>
      }
      collectionLabel="Leadership in practice"
      container="navigation-case"
      next={{ href: "#experience-products", label: "See working products" }}
      getKey={(item) => item.id}
      getLabel={(item) =>
        `Open ${item.title}: ${item.value}. ${item.measure}. ${item.qualification}`
      }
      renderFace={(item, index, expanded, titleId) => (
        <MetricFace
          item={item}
          index={index}
          expanded={expanded}
          titleId={titleId}
        />
      )}
      renderDetails={(item) => <PaperDetails item={item} />}
    />
  );
}
