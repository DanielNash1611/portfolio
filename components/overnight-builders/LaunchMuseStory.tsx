import Image from "next/image";
import Link from "next/link";
import type { ProductEntry } from "@/content/portfolio";
import PortfolioGuide from "@/components/portfolio/PortfolioGuide";
import {
  getPageContextByPath,
  getPortfolioContext,
} from "@/lib/portfolio-guide/context";
import LaunchCampaignSpread from "./LaunchCampaignSpread";
import "./launch-story.css";

export default function LaunchMuseStory({ entry }: { entry: ProductEntry }) {
  const context = getPageContextByPath(entry.href);
  return (
    <div className="launch-story">
      <header className="launch-opening">
        <div className="launch-topline">
          <Link href="/products">← Products</Link>
          <p>
            Creator tools <span>/ {entry.status}</span>
          </p>
        </div>
        <div className="launch-opening-grid">
          <div>
            <p className="launch-kicker">A focused AI-native product</p>
            <h1>
              Launch<em>Muse.</em>
            </h1>
            <p className="launch-opening-promise">
              Give the release
              <br />a story worth following.
            </p>
            <p className="launch-opening-detail">
              Turn the meaning behind the music into a coherent six-week
              campaign.
            </p>
            <a href="#launch-output" className="launch-text-link">
              Open the campaign spread <span>↓</span>
            </a>
            <p className="launch-opening-limit">
              Open alpha · Working MVP
              <br />
              No demonstrated audience-growth claim.
            </p>
          </div>
          <figure className="launch-cover">
            <div className="launch-cover-label">
              <span>One brief from a campaign</span>
              <span>Existing output</span>
            </div>
            <div className="launch-cover-crop">
              <Image
                unoptimized
                priority
                src="/images/launchmuse/tuning-systems-card.png"
                alt="Upper portion of the existing Two Tuning Systems Colliding brief, showing the title and generated post copy about the music’s tuning systems."
                width={610}
                height={736}
              />
            </div>
            <figcaption>
              Focus crop of an existing content brief{" "}
              <a
                href="/images/launchmuse/tuning-systems-card.png"
                target="_blank"
                rel="noreferrer"
              >
                Full capture ↗
              </a>
            </figcaption>
          </figure>
        </div>
      </header>
      <LaunchCampaignSpread />
      <section
        className="launch-wedge"
        id="launch-problem"
        aria-labelledby="launch-wedge-title"
      >
        <p className="launch-kicker">The product decision</p>
        <h2 id="launch-wedge-title">
          Solve the story
          <br />
          <em>around the release.</em>
        </h2>
        <div>
          <p>
            Artists have weeks of meaning, process and emotion behind a release.
            Turning it into a connected campaign can become a second job.
          </p>
          <p>
            Daniel kept the product focused on that planning problem: release
            context becomes a narrative arc, then content themes and execution
            guidance. The artist can adapt, regenerate or narrow the plan.
          </p>
          <details>
            <summary>Read the complete problem and intended value</summary>
            {entry.problem.map((text) => (
              <p key={text}>{text}</p>
            ))}
            <h3>Product rationale</h3>
            {entry.whyThisMatters?.map((text) => (
              <p key={text}>{text}</p>
            ))}
            <p className="launch-detail-boundary">
              These describe the product rationale and intended benefits. They
              are not measured engagement or time-saving results.
            </p>
          </details>
        </div>
      </section>
      <section
        className="launch-context"
        aria-labelledby="launch-context-title"
      >
        <header>
          <p className="launch-kicker">A separate input example</p>
          <h2 id="launch-context-title">
            Begin with
            <br />
            <em>the artist’s meaning.</em>
          </h2>
          <p>
            The published wizard asks for the story behind the release. This
            capture shows “Odd Optimism”; it is a separate example from the
            week-two output above.
          </p>
        </header>
        <figure>
          <Image
            unoptimized
            src="/images/launchmuse-screenshot.webp"
            alt="Existing LaunchMuse campaign wizard capture on the Description step, containing an Odd Optimism release description. This is a separate example, not the recorded input for the campaign shown above."
            width={1536}
            height={1024}
          />
          <figcaption>
            Existing public wizard capture{" "}
            <a
              href="/images/launchmuse-screenshot.webp"
              target="_blank"
              rel="noreferrer"
            >
              Open full capture ↗
            </a>
          </figcaption>
        </figure>
      </section>
      <section
        className="launch-build"
        id="launch-build"
        aria-labelledby="launch-build-title"
      >
        <header>
          <p className="launch-kicker">Daniel’s build account</p>
          <h2 id="launch-build-title">
            A narrow scope.
            <br />
            <em>A working product.</em>
          </h2>
          <p>
            Daniel shaped the product scope and narrative workflow, explored v0
            and Opal, then built the MVP end to end with Codex.
          </p>
        </header>
        <div className="launch-build-journal">
          <p className="launch-build-time">
            ~10<span>hours</span>
          </p>
          <p className="launch-build-qualification">
            Blank repository to working MVP with AI-assisted coding, including
            first-time GitHub, Vercel and deployment setup. This measures
            prototype velocity, not validation speed or post-launch impact.
          </p>
          <ol>
            <li>
              <span>01 / Scope</span>
              <h3>Sharpen the pitch.</h3>
              <p>
                The Maven AI Product Management Bootcamp with Marily Nika
                provided the pitching and contest context for the early product
                story.
              </p>
            </li>
            <li>
              <span>02 / Explore</span>
              <h3>Work through the product shape.</h3>
              <p>
                The path moved through v0 and Opal before the end-to-end Codex
                build.
              </p>
            </li>
            <li>
              <span>03 / Build</span>
              <h3>Make the question testable.</h3>
              <p>
                A focused release-planning workflow became working software for
                exploration and iteration. The build itself does not establish
                market demand.
              </p>
            </li>
          </ol>
          <details>
            <summary>Read Daniel’s full build account</summary>
            {entry.buildStory?.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </details>
        </div>
      </section>
      <section className="launch-record" aria-labelledby="launch-record-title">
        <header>
          <p className="launch-kicker">Scope and learning</p>
          <h2 id="launch-record-title">
            The scaffolding
            <br />
            <em>is part of the product.</em>
          </h2>
          <p>
            Release context, sequencing and constraints shape the output. The
            next useful question is whether that structure helps an artist plan
            their own release.
          </p>
        </header>
        <div>
          <details>
            <summary>01 / Full product scope and workflow</summary>
            {entry.solution.map((text) => (
              <p key={text}>{text}</p>
            ))}
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
            <summary>02 / Product and leadership lessons</summary>
            <ol>
              {entry.learnings.map((text) => (
                <li key={text}>
                  <p>{text}</p>
                </li>
              ))}
            </ol>
            <p className="launch-detail-boundary">
              These are Daniel’s lessons from the build; no adoption or
              campaign-performance measurement is supplied here.
            </p>
          </details>
          <details>
            <summary>03 / Earlier published campaign-story visual</summary>
            <figure>
              <Image
                unoptimized
                src="/images/launchmuse-product-hero.webp"
                alt="Earlier published LaunchMuse campaign-story visual, including narrative, emotional resonance and the start of a weekly release plan."
                width={1536}
                height={1024}
              />
              <figcaption>
                Published product visual · Separate from the campaign captures
                above
              </figcaption>
            </figure>
          </details>
        </div>
      </section>
      {context && (
        <div className="launch-guide">
          <PortfolioGuide
            pageContext={context}
            portfolioContext={getPortfolioContext()}
          />
        </div>
      )}
      <footer className="launch-closing">
        <p className="launch-kicker">Explore the product</p>
        <h2>
          A release carries meaning.
          <br />
          <em>Give it room to unfold.</em>
        </h2>
        <div>
          {entry.actions?.map((action) => (
            <a
              href={action.href}
              key={action.href}
              target={action.external ? "_blank" : undefined}
              rel={action.external ? "noopener noreferrer" : undefined}
            >
              {action.label} ↗
            </a>
          ))}
        </div>
        <p>
          The source labels the product Open alpha. The artifacts establish a
          working planning workflow, with no adoption or engagement-uplift
          claim.
        </p>
      </footer>
    </div>
  );
}
