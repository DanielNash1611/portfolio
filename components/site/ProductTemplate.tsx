import ExampleCampaignOutputSection from "@/components/launchmuse/ExampleCampaignOutputSection";
import PortfolioGuide from "@/components/portfolio/PortfolioGuide";
import ContentSection from "@/components/site/ContentSection";
import CTASection from "@/components/site/CTASection";
import MetricStrip from "@/components/site/MetricStrip";
import PageHero from "@/components/site/PageHero";
import VisualPlaceholder from "@/components/site/VisualPlaceholder";
import { siteConfig, type ProductEntry } from "@/content/portfolio";
import {
  getPageContextByPath,
  getPortfolioContext,
} from "@/lib/portfolio-guide/context";

type ProductTemplateProps = {
  entry: ProductEntry;
};

export default function ProductTemplate({
  entry,
}: ProductTemplateProps): JSX.Element {
  const pageContext = getPageContextByPath(entry.href);
  const portfolioContext = getPortfolioContext();
  const isLaunchMuse = entry.slug === "launchmuse";

  return (
    <div className="space-y-8">
      <PageHero
        eyebrow={entry.eyebrow}
        title={entry.title}
        description={entry.summary}
        tags={entry.tags}
        actions={entry.actions}
        metrics={entry.featuredMetrics}
        image={entry.heroImage}
        imageAlt={entry.heroImageAlt}
        imageClassName={entry.heroImageClassName}
        imageExpandable={entry.heroImageExpandable}
      />

      {pageContext ? (
        <PortfolioGuide
          pageContext={pageContext}
          portfolioContext={portfolioContext}
        />
      ) : null}

      <MetricStrip metrics={entry.featuredMetrics} />

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className={isLaunchMuse ? "space-y-10 md:space-y-12" : "space-y-8"}>
          <ContentSection
            title="Problem"
            description="The user pain or workflow friction this product is designed to address."
          >
            {entry.problem.map((item) => (
              <p
                key={item}
                className="text-base leading-7 text-[color:var(--color-slate)]/74"
              >
                {item}
              </p>
            ))}
          </ContentSection>

          <ContentSection
            title="Solution"
            description="How the product is intentionally scoped and framed."
            tone="muted"
          >
            {entry.solution.map((item) => (
              <p
                key={item}
                className="text-base leading-7 text-[color:var(--color-slate)]/74"
              >
                {item}
              </p>
            ))}
          </ContentSection>

          {entry.whyThisMatters?.length ? (
            <ContentSection
              title="Why this matters"
              description="Why this product wedge matters beyond simple content planning."
            >
              {entry.whyThisMatters.map((item) => (
                <p
                  key={item}
                  className="text-base leading-7 text-[color:var(--color-slate)]/74"
                >
                  {item}
                </p>
              ))}
            </ContentSection>
          ) : null}

          <ContentSection
            title="Product experience"
            description="What the user actually does inside the product."
          >
            <div className="grid gap-4">
              {entry.productExperience.map((step, index) => (
                <article
                  key={step.title}
                  className="grid gap-3 rounded-[1.35rem] border border-black/6 bg-white/78 px-5 py-5 md:grid-cols-[40px_minmax(0,1fr)]"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--color-teal)] text-sm font-semibold text-[color:var(--color-cream)]">
                    {index + 1}
                  </span>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-[color:var(--color-slate)]">
                      {step.title}
                    </h3>
                    <p className="text-base leading-7 text-[color:var(--color-slate)]/72">
                      {step.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </ContentSection>

          {entry.evaluationAndTrust?.length ? (
            <ContentSection
              title="Evaluation & trust"
              description="How quality was defined, tested, and improved in a high-stakes domain."
              tone="muted"
            >
              {entry.evaluationAndTrust.map((item) => (
                <p
                  key={item}
                  className="text-base leading-7 text-[color:var(--color-slate)]/74"
                >
                  {item}
                </p>
              ))}
            </ContentSection>
          ) : null}

          {isLaunchMuse ? <ExampleCampaignOutputSection /> : null}

          <ContentSection
            title="What I learned"
            description="The product and leadership lessons this work reinforced."
          >
            <ul className="space-y-4">
              {entry.learnings.map((item) => (
                <li
                  key={item}
                  className="rounded-[1.25rem] border border-[color:var(--color-teal)]/10 bg-white/76 px-5 py-4 text-base leading-7 text-[color:var(--color-slate)]/72"
                >
                  {item}
                </li>
              ))}
            </ul>
          </ContentSection>

          {entry.buildStory?.length ? (
            <ContentSection
              title="Build story"
              description="How the product moved from concept to working MVP and why that matters."
              tone="muted"
            >
              {entry.buildStory.map((item) => (
                <p
                  key={item}
                  className="text-base leading-7 text-[color:var(--color-slate)]/74"
                >
                  {item}
                </p>
              ))}
            </ContentSection>
          ) : null}
        </div>

        <div className="space-y-8">
          {isLaunchMuse ? null : (
            <ContentSection
              title="Visuals"
              description="Current visuals plus placeholders for screenshots or embeds."
            >
              <div className="grid gap-4">
                {entry.visuals.map((asset) => (
                  <VisualPlaceholder key={asset.title} asset={asset} />
                ))}
              </div>
            </ContentSection>
          )}
        </div>
      </div>

      <CTASection
        title="Interested in the build, prototype process, or product logic?"
        description="These pages are intentionally structured so the product story is easy to discuss with recruiters, founders, or future teammates."
        primaryAction={{
          href: siteConfig.linkedinUrl,
          label: "Connect on LinkedIn",
          external: true,
        }}
        secondaryAction={{
          href: siteConfig.contactHref,
          label: "Send a message",
        }}
      />
    </div>
  );
}
