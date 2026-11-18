"use client";

import Link from "next/link";
import { evidenceExample, workflowStages } from "@/content/experience";
import ScrollNarrative from "./ScrollNarrative";
import "./builders.css";

export default function CareerWalkthrough() {
  return (
    <section
      className="builders-career builders-section"
      id="career-walkthrough"
      aria-labelledby="career-walkthrough-title"
    >
      <div className="builders-inner">
        <p className="builders-eyebrow">01 / Inspect the decision</p>
        <h2 id="career-walkthrough-title">
          A stronger statement.
          <br />
          <em>The same evidence.</em>
        </h2>
        <p className="builders-intro">
          An authored walkthrough of the workflow. No new résumé is generated
          here.
        </p>
        <ScrollNarrative
          kind="career"
          label="Evidence to artifact"
          beats={workflowStages.map((stage) => ({
            title: stage.title,
            text: stage.detail,
          }))}
        />
        <blockquote className="builders-evidence-statement">
          {evidenceExample.statement}
        </blockquote>
        <details>
          <summary>Inspect the source and boundary</summary>
          <p>“{evidenceExample.quote}”</p>
          <Link href={evidenceExample.source}>
            Read Daniel’s responsibility ↗
          </Link>
          <p>{evidenceExample.limitation}</p>
        </details>
      </div>
    </section>
  );
}
