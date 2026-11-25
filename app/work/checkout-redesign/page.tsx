import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CheckoutFlagship from "@/components/overnight-cases/CheckoutFlagship";
import PortfolioGuide from "@/components/portfolio/PortfolioGuide";
import MediaFrame from "@/components/site/MediaFrame";
import TestimonialsSection from "@/components/site/TestimonialsSection";
import { getWorkEntry } from "@/content/portfolio";
import { getSelectedRecommendation } from "@/content/recommendations";
import { getTestimonialsByIds } from "@/data/testimonials";
import {
  checkoutRoleChanges,
  checkoutBuildParagraphs,
  checkoutDeliveryParagraphs,
  checkoutResultBullets,
  checkoutJiraNotes,
  checkoutUsabilityCards,
  checkoutUsabilityQuotes,
} from "@/content/checkout-page-content";
import {
  getPageContextByPath,
  getPortfolioContext,
} from "@/lib/portfolio-guide/context";

const entry = getWorkEntry("checkout-redesign");
const matt = getSelectedRecommendation("matt-winick");
const pageContext = getPageContextByPath("/work/checkout-redesign");
const portfolioContext = getPortfolioContext();
export const metadata: Metadata = {
  title: "Checkout Redesign",
  description:
    "How better execution turned a checkout redesign into measurable growth.",
};

export default function CheckoutRedesignPage(): React.JSX.Element {
  if (!entry) notFound();
  return (
    <CheckoutFlagship
      role={entry.role}
      company={entry.company}
      timeframe={entry.timeframe}
      guide={
        pageContext ? (
          <PortfolioGuide
            pageContext={pageContext}
            portfolioContext={portfolioContext}
          />
        ) : null
      }
    >
      <details className="cf-source-detail">
        <summary>
          <span>01</span> Problem, role &amp; decision context{" "}
          <b>Read the source account</b>
        </summary>
        <div className="cf-source-prose">
          {entry.heroDetails?.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <h3>The stakes</h3>
          {entry.context.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <h3>My role</h3>
          <p>
            I helped drive the effort across product, UX, and engineering from
            problem definition through rollout. That included aligning the team
            around the stakes of the redesign, shaping the work clearly enough
            that people could make good decisions during execution, and
            improving how collaboration happened during the build.
          </p>
          <ul>
            {checkoutRoleChanges.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <h3>Better collaboration during build</h3>
          {checkoutBuildParagraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <h3>What this case reinforced</h3>
          {entry.reflection.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <p className="cf-source-tags">{entry.tags.join(" · ")}</p>
        </div>
      </details>
      <details className="cf-source-detail" id="checkout-source-delivery">
        <summary>
          <span>02</span> Delivery, QA scope &amp; reported outcomes{" "}
          <b>Read the source account</b>
        </summary>
        <div className="cf-source-prose">
          <h3>Delivery</h3>
          {checkoutDeliveryParagraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <h3>Reported outcomes</h3>
          <ul>
            {checkoutResultBullets.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p>
            The annualized upside estimate came from the post-launch A/B test,
            which gave us a grounded way to measure business impact rather than
            relying on assumptions.
          </p>
        </div>
      </details>
      <details className="cf-source-detail">
        <summary>
          <span>03</span> Every recorded usability task{" "}
          <b>Compare the full results</b>
        </summary>
        <div className="cf-source-prose">
          <p>
            Follow-up usability testing across real checkout tasks. The source
            labels the rating measure “Difficulty”; its scale is not specified
            here. Time, score, success, and interpretation are reproduced
            separately. The case summary rounds the full-flow improvement to
            roughly 30%; the task exhibit labels it 32%. The original times,
            3:00 to 2:03, are reproduced unchanged.
          </p>
          {checkoutUsabilityCards.map((card) => (
            <section key={card.title} className="cf-task-record">
              <h3>{card.title}</h3>
              {card.speedLabel && <p>{card.speedLabel}</p>}
              <table>
                <caption className="sr-only">
                  {card.title}: before and after results
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Measure</th>
                    <th scope="col">Before</th>
                    <th scope="col">After</th>
                  </tr>
                </thead>
                <tbody>
                  {card.rows.map((row) => (
                    <tr key={row.label}>
                      <th scope="row">{row.label}</th>
                      <td>{row.before ?? "Not recorded here"}</td>
                      <td>
                        {row.beforePrefix ? `${row.beforePrefix} ` : ""}
                        {row.after}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p>Source interpretation: {card.interpretation}.</p>
            </section>
          ))}
          <h3>What users said</h3>
          {checkoutUsabilityQuotes.map((q) => (
            <blockquote key={q}>“{q}”</blockquote>
          ))}
          <p>
            Post-launch A/B testing later validated measurable conversion lift.
          </p>
        </div>
      </details>
      <details className="cf-source-detail">
        <summary>
          <span>04</span> Original screens &amp; implementation ticket{" "}
          <b>Inspect the artifacts</b>
        </summary>
        <div className="cf-originals">
          {[
            {
              src: "/images/checkout-redesign/checkout-before.png",
              title: "Before",
              alt: "Legacy Guitar Center checkout showing a dense multi-step form.",
            },
            {
              src: "/images/checkout-redesign/checkout-after.png",
              title: "After",
              alt: "Redesigned Guitar Center delivery step with improved hierarchy.",
            },
            {
              src: "/images/checkout-redesign/jira-ticket.png",
              title: "Representative implementation ticket",
              alt: "Gift-card ticket documenting user need, implementation guidance and impact; the ticket states that it can follow the initial checkout release.",
            },
          ].map((a) => (
            <figure key={a.src}>
              <h3>{a.title}</h3>
              <MediaFrame
                src={a.src}
                alt={a.alt}
                className="aspect-[16/10] bg-white"
                imageClassName="object-contain"
                sizes="90vw"
                expandable
                expandLabel={`Expand ${a.title.toLowerCase()}`}
              />
              <figcaption>
                <a href={a.src}>Open original image ↗</a>
              </figcaption>
            </figure>
          ))}
          <ul>
            {checkoutJiraNotes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
          <p>
            The ticket is a representative example of context-rich product
            writing. Its stated timing is after the initial release.
          </p>
        </div>
      </details>
      <details className="cf-source-detail">
        <summary>
          <span>05</span> Engineering &amp; design partner perspectives{" "}
          <b>Read the recommendations</b>
        </summary>
        <div className="cf-recommendations">
          <TestimonialsSection
            eyebrow="Collaborator evidence"
            title="How close collaborators described the work"
            description="Partner perspectives on execution quality and cross-functional collaboration."
            testimonials={[
              ...getTestimonialsByIds(["christopher-pruneau"]),
              matt.testimonial,
            ]}
            footerLink={{ href: matt.href, label: "View Matt’s recommendation" }}
          />
        </div>
      </details>
    </CheckoutFlagship>
  );
}
