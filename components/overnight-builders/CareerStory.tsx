import Image from "next/image";
import Link from "next/link";
import CareerFolio from "./CareerFolio";
import CaseStudyOverview from "@/components/ai-career-system/CaseStudyOverview";
import ProductEngines from "@/components/ai-career-system/ProductEngines";
import EvidenceBridge from "@/components/ai-career-system/EvidenceBridge";
import EvalEvidence from "@/components/ai-career-system/EvalEvidence";
import ImplementedNext from "@/components/ai-career-system/ImplementedNext";
import WhatThisProves from "@/components/ai-career-system/WhatThisProves";
import PortfolioGuide from "@/components/portfolio/PortfolioGuide";
import PortfolioAssistantTrigger from "@/components/portfolio/PortfolioAssistantTrigger";
import {
  getPageContextByPath,
  getPortfolioContext,
} from "@/lib/portfolio-guide/context";
import "./career-story.css";

const pageContext = getPageContextByPath(
  "/products/ai-career-operating-system",
);
export default function CareerStory() {
  return (
    <div className="career-story">
      <header className="career-opening">
        <div className="career-topline">
          <Link href="/products">← Products</Link>
          <p>
            AI Career Operating System <span>/ Production-shaped</span>
          </p>
        </div>
        <div className="career-opening-grid">
          <div className="career-opening-copy">
            <p className="career-kicker">Governed AI / Career evidence</p>
            <h1>
              A stronger résumé.
              <br />
              <em>The same evidence.</em>
            </h1>
            <p className="career-deck">
              Help a hiring team see the relevant work. Keep every claim
              accountable to its source.
            </p>
            <a className="career-text-link" href="#career-folio">
              Open the evidence folio <span>↓</span>
            </a>
            <p className="career-opening-boundary">
              A personal operating context with source-audited retrieval,
              AI-assisted development and human review. No external-adoption
              claim.
            </p>
          </div>
          <figure className="career-cover-art">
            <div className="career-cover-index">
              <span>01 / The artifact</span>
              <span>ResumeCustomizer</span>
            </div>
            <div className="career-cover-crop">
              <Image
                unoptimized
                priority
                src="/images/experience/case-study-artwork/public-resume-output.webp"
                alt="Existing public AI Product Leader résumé produced through ResumeCustomizer. This is a published default, not a newly tailored résumé."
                width={773}
                height={1000}
                sizes="(min-width:1100px) 460px, 86vw"
              />
            </div>
            <figcaption>
              Published résumé · Upper-page crop{" "}
              <span>Human approval remains the final layer</span>
            </figcaption>
          </figure>
        </div>
      </header>
      <CareerFolio />
      <section
        className="career-role-section"
        id="career-role-input"
        aria-labelledby="career-role-title"
      >
        <div className="career-role-intro">
          <p className="career-kicker">02 / The input</p>
          <h2 id="career-role-title">
            The role changes.
            <br />
            <em>The evidence holds.</em>
          </h2>
          <p>
            A job description supplies context for mapping, emphasis and
            supported keywords. The generator is an action surface, not evidence
            of role fit.
          </p>
          <Link className="career-text-link" href="/resume/generate">
            View the generator <span>↗</span>
          </Link>
        </div>
        <figure className="career-input-art">
          <Image
            unoptimized
            src="/images/experience/case-study-artwork/resume-generator.webp"
            alt="Actual public résumé generator form with a job-description field, optional role and company fields, and download or email options. The captured form is empty; no generation was submitted."
            width={1216}
            height={798}
            sizes="(min-width:1100px) 760px,94vw"
          />
          <figcaption>
            Actual public form capture · No generation submitted
          </figcaption>
        </figure>
        <div className="career-input-principles">
          <p>
            <strong>Supported evidence</strong>Approved experience informs the
            draft. Unsupported requirements stay visible as gaps.
          </p>
          <p>
            <strong>Separate responsibilities</strong>The portfolio supports
            discovery; ResumeCustomizer handles mapping, reviews and rendering.
          </p>
          <p>
            <strong>Human judgment</strong>Review findings are advisory.
            Structural checks can block output; Daniel retains final approval.
          </p>
        </div>
      </section>
      <section
        className="career-responsibility"
        id="career-responsibility"
        aria-labelledby="career-owner-title"
      >
        <p className="career-kicker">03 / The product decision</p>
        <h2 id="career-owner-title">
          Design the conditions
          <br />
          <em>for a credible answer.</em>
        </h2>
        <div>
          <p>
            Daniel defined the product architecture, evidence boundaries,
            claim-safety rules, workflow stages, evaluation criteria and
            portfolio positioning.
          </p>
          <p>
            He used AI-assisted development across the Portfolio Guide and
            ResumeCustomizer. The authenticated evidence-search contract is
            implemented; a complete shared evidence graph, durable identifiers
            and unified publishing remain future work.
          </p>
          <p className="career-contract-note">
            Launch condition: the Portfolio tool and ResumeCustomizer evidence
            endpoint must be merged and deployed together.
          </p>
          <details>
            <summary>Read the complete problem and responsibility</summary>
            <CaseStudyOverview />
          </details>
        </div>
      </section>
      <section
        className="career-review-section"
        aria-labelledby="career-review-title"
      >
        <header>
          <p className="career-kicker">04 / The approval boundary</p>
          <h2 id="career-review-title">
            Six perspectives.
            <br />
            <em>One accountable human.</em>
          </h2>
          <p>
            Four strategic reviewers inform the baseline before drafting. All
            six review the final résumé against completed content and rendering
            evidence. These are configured advisory roles, not six independent
            approvals.
          </p>
        </header>
        <ol className="career-review-roles">
          {[
            [
              "Recruiter Screen",
              "Supported keywords and skim-read clarity",
              "Baseline + final",
            ],
            [
              "Hiring Manager",
              "Role-specific proof and seniority",
              "Baseline + final",
            ],
            [
              "Career Coach",
              "Positioning and story coherence",
              "Baseline + final",
            ],
            ["Source Auditor", "Claim verification and overclaims", "Final"],
            ["ATS Readability", "Parseability and document hygiene", "Final"],
            [
              "Positioning & Bridge Strategist",
              "Safe bridges and true gaps",
              "Baseline + final",
            ],
          ].map(([name, detail, pass], i) => (
            <li key={name}>
              <span>0{i + 1}</span>
              <div>
                <h3>{name}</h3>
                <p>{detail}</p>
              </div>
              <small>{pass}</small>
            </li>
          ))}
        </ol>
        <div className="career-human-boundary">
          <p className="career-kicker">Final accountability</p>
          <p>
            Daniel approves what is represented publicly and submitted to a
            hiring team. Review artifacts expose tradeoffs and gaps; they do not
            establish universal uplift.
          </p>
        </div>
      </section>
      <section
        className="career-eval-section"
        aria-labelledby="career-measurement-title"
      >
        <div>
          <p className="career-kicker">A bounded measurement</p>
          <h2 id="career-measurement-title">
            Better grounding.
            <br />
            <em>A specific comparison.</em>
          </h2>
        </div>
        <div>
          <div className="career-eval-numbers">
            <span>
              5<small>/12</small>
            </span>
            <span aria-label="improved to">→</span>
            <span>
              11<small>/12</small>
            </span>
          </div>
          <p>
            Acceptable responses in a stored 12-case Portfolio Guide evaluation
            set, after grounding and source-separation changes.
          </p>
          <p className="career-eval-qualification">
            Historical comparable runs. This is not a current full-suite quality
            claim or evidence of résumé efficacy.
          </p>
        </div>
      </section>
      <section
        className="career-case-record"
        aria-labelledby="career-record-title"
      >
        <header>
          <p className="career-kicker">The complete case record</p>
          <h2 id="career-record-title">Inspect the machinery.</h2>
          <p>
            The architecture, review specification and implementation limits
            remain available in full.
          </p>
        </header>
        <details id="career-system-details">
          <summary>01 / Product engines and workflow</summary>
          <ProductEngines />
          <dl className="career-product-boundaries">
            <div>
              <dt>Portfolio</dt>
              <dd>
                Recruiter UX, authored page grounding, Portfolio Guide
                interactions, download, and optional email delivery.
              </dd>
            </div>
            <div>
              <dt>ResumeCustomizer</dt>
              <dd>
                Public-safe evidence retrieval, role mapping, generation,
                specialized reviews, rendering, and temporary artifacts.
              </dd>
            </div>
            <div>
              <dt>Human review</dt>
              <dd>
                Final accountability for what is approved, represented publicly,
                and submitted to a hiring team.
              </dd>
            </div>
          </dl>
          <figure className="career-system-art">
            <Image
              unoptimized
              src="/images/experience/case-study-artwork/governed-career-workflow.webp"
              alt="Published system illustration of the governed career workflow. This diagram describes the architecture and does not establish a complete live deployment."
              width={1300}
              height={713}
              sizes="94vw"
            />
            <figcaption>
              Published system illustration · Architecture, not a live execution
              record
            </figcaption>
          </figure>
        </details>
        <details id="career-evidence-details">
          <summary>
            02 / Claim-to-Evidence contract and launch condition
          </summary>
          <EvidenceBridge />
        </details>
        <details id="career-eval-details">
          <summary>
            03 / Full evaluation evidence and six reviewer specifications
          </summary>
          <EvalEvidence />
        </details>
        <details id="career-delivery-details">
          <summary>04 / Implemented capabilities and next investments</summary>
          <ImplementedNext />
        </details>
        <details>
          <summary>05 / Transferable product judgment</summary>
          <WhatThisProves />
        </details>
      </section>
      <div className="career-guide">
        {pageContext && (
          <PortfolioGuide
            pageContext={pageContext}
            portfolioContext={getPortfolioContext()}
          />
        )}
      </div>
      <footer className="career-closing">
        <p className="career-kicker">Explore the evidence. Then act.</p>
        <h2>
          Make the relevant work
          <br />
          <em>easier to see.</em>
        </h2>
        <div>
          <PortfolioAssistantTrigger>
            Ask about this workflow ↗
          </PortfolioAssistantTrigger>
          <Link href="/resume/generate">
            Generate a role-specific résumé ↗
          </Link>
          <Link href="/products/immunology-scout">
            Explore research grounding ↗
          </Link>
        </div>
        <p>
          Generation is a separate action. The artifact and annotations above
          are existing public material.
        </p>
      </footer>
    </div>
  );
}
