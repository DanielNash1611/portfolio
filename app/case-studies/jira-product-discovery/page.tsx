import type { Metadata } from "next";
import JpdFlagship from "@/components/overnight-cases/JpdFlagship";
import PortfolioGuide from "@/components/portfolio/PortfolioGuide";
import MediaFrame from "@/components/site/MediaFrame";
import TestimonialsSection from "@/components/site/TestimonialsSection";
import { getSelectedRecommendation } from "@/content/recommendations";
import { getCaseMdx } from "@/lib/mdx";
import {
  getPageContextByPath,
  getPortfolioContext,
} from "@/lib/portfolio-guide/context";

const slug = "jira-product-discovery";
const colin = getSelectedRecommendation("colin-greene");
const pageContext = getPageContextByPath(
  "/case-studies/jira-product-discovery",
);
const portfolioContext = getPortfolioContext();
export async function generateMetadata(): Promise<Metadata> {
  const { frontmatter } = await getCaseMdx(slug);
  return {
    title: frontmatter.title,
    description:
      frontmatter.summary ||
      "Standardized prioritization and planning in Jira Product Discovery, turning quarterly wishlists into a continuous partnership between product, business, and technology.",
  };
}
export default async function JiraProductDiscoveryPage(): Promise<React.JSX.Element> {
  const { content } = await getCaseMdx(slug);
  return (
    <JpdFlagship
      guide={
        pageContext ? (
          <PortfolioGuide
            pageContext={pageContext}
            portfolioContext={portfolioContext}
            tone="legacy"
          />
        ) : null
      }
    >
      {/* Native heading fragments may open this uncontrolled detail before hydration. */}
      <details className="jpf-record" suppressHydrationWarning>
        <summary>The original JPD case, in full</summary>
        <div className="jpf-record-body">
          <p>
            The original artifact list names project materials. Internal JPD
            workspace captures and populated initiative examples are not
            included in this public case; the published practice references
            below are separate evidence.
          </p>
          <article className="prose prose-lg max-w-none text-brand-slate prose-headings:font-serif prose-headings:text-brand-teal">
            {content}
          </article>
        </div>
      </details>
      <details className="jpf-record">
        <summary>The published worksheet and practice references</summary>
        <div className="jpf-record-body">
          <p>
            The original RICE worksheet and review-format artifact below are
            published in the related product-leadership essay. They are broader
            practice evidence, not screenshots of the internal JPD workspace.
          </p>
          <table>
            <caption className="sr-only">
              The original RICE worksheet definitions, transcribed without
              populated initiative rows
            </caption>
            <thead>
              <tr>
                <th scope="col">Column</th>
                <th scope="col">Original definition</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Opportunity", "Quick Description"],
                ["Reach", "Score made by weighted customer segments"],
                ["Impact", "Scale of 1–5, justified in the description"],
                ["Confidence", "Scale 1–100"],
                ["Effort", "Scale 1–5"],
                ["RICE Score", "Sort by RICE to identify top priorities"],
              ].map(([field, definition]) => (
                <tr key={field}>
                  <th scope="row">{field}</th>
                  <td>{definition}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <figure className="jpf-reference-art">
            <h3>The complete RICE reference</h3>
            <MediaFrame
              src="/images/thinking/product-leadership-systems-design/rice-definition.png"
              alt="Original RICE worksheet with opportunity, reach, impact, confidence, effort, and RICE score definitions. The initiative rows are blank."
              className="aspect-[1086/596] bg-white"
              imageClassName="object-contain"
              sizes="90vw"
              expandable
              expandLabel="Expand the original RICE reference"
            />
            <figcaption>
              <a href="/images/thinking/product-leadership-systems-design/rice-definition.png">
                Open original worksheet ↗
              </a>
            </figcaption>
          </figure>
          <figure className="jpf-reference-art">
            <h3>Published product-review reference</h3>
            <MediaFrame
              src="/images/thinking/product-leadership-systems-design/product-review-format.png"
              alt="Original product-review reference showing a biweekly product-team review of work happening now, coming soon, impact, and opportunity prioritization."
              className="aspect-[1680/712] bg-white"
              imageClassName="object-contain"
              sizes="90vw"
              expandable
              expandLabel="Expand the published product-review reference"
            />
            <figcaption>
              This reference documents the broader product practice. The JPD
              case itself describes views and check-ins; it does not specify
              this review cadence for every adopting team.{" "}
              <a href="/thinking/product-philosophy">
                Read the source essay ↗
              </a>
            </figcaption>
          </figure>
        </div>
      </details>
      <details className="jpf-record">
        <summary>A product peer’s full recommendation</summary>
        <div className="jpf-record-body">
          <TestimonialsSection
            eyebrow="Peer evidence"
            title="Colin Greene on teaching and shared practices"
            description="A peer in the same Guitar Center product group specifically names Daniel's work teaching Jira Product Discovery and spreading stakeholder practices."
            testimonials={[colin.testimonial]}
            footerLink={{
              href: colin.href,
              label: "View Colin’s recommendation",
            }}
          />
        </div>
      </details>
    </JpdFlagship>
  );
}
