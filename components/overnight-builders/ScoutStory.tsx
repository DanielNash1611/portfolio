import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import type { ProductEntry } from "@/content/portfolio";
import MediaFrame from "@/components/site/MediaFrame";
import PortfolioGuide from "@/components/portfolio/PortfolioGuide";
import {
  getPageContextByPath,
  getPortfolioContext,
} from "@/lib/portfolio-guide/context";
import ScoutEvidenceNarrative from "./ScoutEvidenceNarrative";
import "./scout-flagship.css";

export default function ScoutStory({ entry }: { entry: ProductEntry }) {
  const context = getPageContextByPath(entry.href);
  return (
    <div className="scout-flagship">
      <header className="scout-opening">
        <div className="scout-topline">
          <Link href="/products">← Products</Link>
          <p>
            AI + Science <span>/ {entry.status}</span>
          </p>
        </div>
        <div className="scout-title-row">
          <h1>
            Immunology <em>Scout.</em>
          </h1>
          <div>
            <p>
              Before trusting a conclusion,
              <br /> follow its evidence.
            </p>
            <a href="#scout-evidence">
              Enter the evidence trail <ArrowDown size={17} />
            </a>
          </div>
        </div>
        <div className="scout-opening-note">
          <p>
            Daniel’s role{" "}
            <span>Early product build · Expert-informed evaluation</span>
          </p>
          <p>
            Research grounding concept <span>Paper + patent exploration</span>
          </p>
        </div>
      </header>
      <ScoutEvidenceNarrative />
      <section
        className="scout-boundary"
        aria-labelledby="scout-boundary-title"
      >
        <div>
          <p className="scout-kicker">What the artifact establishes</p>
          <h2 id="scout-boundary-title">
            An inspectable interface.
            <br />
            <em>A visible limit.</em>
          </h2>
        </div>
        <div>
          <p>
            These are captures of the actual mechanism workspace, populated with
            invented Aster demonstration data.
          </p>
          <p>
            They show how a relationship can lead back to a source record. They
            do not establish scientific validity, a working patent result,
            launch or expert approval.
          </p>
          <details>
            <summary>Read the capture provenance</summary>
            <p>
              Captured November 13, 2026 from Daniel’s actual
              MechanismsWorkspace interface in an isolated preview. Study names,
              entities, relationships, evidence states, confidence values and
              source notes are invented fixtures. No real research thread,
              external retrieval or AI request was used for these captures.
            </p>
            <p>
              The source-panel note is explicitly fictional. No fabricated PMID,
              DOI, patent or external source link is presented.
            </p>
          </details>
        </div>
      </section>
      <section
        className="scout-evaluation"
        id="scout-trust"
        aria-labelledby="scout-trust-title"
      >
        <div className="scout-evaluation-intro">
          <p className="scout-kicker">
            The evaluation lesson / Daniel’s account
          </p>
          <h2 id="scout-trust-title">
            A fluent answer
            <br />
            can still have
            <br />
            <em>a broken source.</em>
          </h2>
          <p>
            Expert-informed evaluation exposed hallucinated patent references
            early in the build.
          </p>
        </div>
        <div className="scout-evaluation-decisions">
          <article>
            <span>01 / Define the standard</span>
            <h3>Start with scientific expertise.</h3>
            <p>
              A scientific collaborator helped define what a useful, trustworthy
              output should contain.
            </p>
          </article>
          <article>
            <span>02 / Expose the failure</span>
            <h3>Measure the source problem.</h3>
            <p>
              Structured feedback became a lightweight evaluation set. It
              surfaced hallucinated patent references.
            </p>
          </article>
          <article>
            <span>03 / Keep the boundary</span>
            <h3>Support the researcher’s judgment.</h3>
            <p>
              Iteration connected domain expertise, evaluation and traceability.
              The public story remains an emerging product.
            </p>
          </article>
          <details>
            <summary>Read the full evaluation account</summary>
            {entry.evaluationAndTrust?.map((text) => (
              <p key={text}>{text}</p>
            ))}
            <p>
              No evaluation scores, case outputs or expert sign-off are supplied
              on this page.
            </p>
          </details>
        </div>
      </section>
      <section
        className="scout-case-notes"
        id="scout-case-notes"
        aria-labelledby="scout-notes-title"
      >
        <header>
          <p className="scout-kicker">The complete product context</p>
          <h2 id="scout-notes-title">
            A focused research
            <br />
            <em>grounding layer.</em>
          </h2>
          <p>
            Scientific teams need more than compressed text: they need cited
            evidence, patent awareness and a clear boundary between signals and
            judgment.
          </p>
        </header>
        <div className="scout-notes-list">
          <details>
            <summary>
              <span>01</span> The problem and product decision
            </summary>
            {entry.problem.map((text) => (
              <p key={text}>{text}</p>
            ))}
            {entry.solution.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </details>
          <details>
            <summary>
              <span>02</span> The intended research workflow
            </summary>
            <ol>
              {entry.productExperience.map((item) => (
                <li key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </li>
              ))}
            </ol>
          </details>
          <details>
            <summary>
              <span>03</span> The product and leadership lessons
            </summary>
            {entry.learnings.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </details>
          <details>
            <summary>
              <span>04</span> The earlier retrieval workbench
            </summary>
            <p>
              The earlier search-and-synthesis interface frames retrieval,
              synthesis and scoped query inputs as a research workbench. It is a
              separate artifact from the mechanism captures above.
            </p>
            <MediaFrame
              src={entry.heroImage}
              alt={entry.heroImageAlt}
              fallbackTitle="Earlier Scout retrieval workbench"
              className="scout-original-workbench"
              imageClassName="object-contain"
              sizes="(min-width:960px) 62vw, 94vw"
              expandable
              expandLabel="Expand earlier Scout retrieval workbench"
            />
          </details>
        </div>
      </section>
      {context && (
        <section className="scout-guide">
          <PortfolioGuide
            pageContext={context}
            portfolioContext={getPortfolioContext()}
          />
        </section>
      )}
      <footer className="scout-closing">
        <p className="scout-kicker">Continue the conversation</p>
        <h2>
          Useful AI starts
          <br />
          <em>with better questions.</em>
        </h2>
        <div>
          {entry.actions?.map((action) => (
            <a
              key={action.href}
              href={action.href}
              target={action.external ? "_blank" : undefined}
              rel={action.external ? "noopener noreferrer" : undefined}
            >
              {action.label}
              <ArrowUpRight size={17} />
            </a>
          ))}
          <Link href="/products/ai-career-operating-system">
            Another evidence-led workflow
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </footer>
    </div>
  );
}
