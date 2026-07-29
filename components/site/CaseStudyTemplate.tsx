import PortfolioGuide from "@/components/portfolio/PortfolioGuide";
import Container from "@/components/site/Container";
import ContentSection from "@/components/site/ContentSection";
import CTASection from "@/components/site/CTASection";
import MetricStrip from "@/components/site/MetricStrip";
import MotionReveal from "@/components/site/MotionReveal";
import PageHero from "@/components/site/PageHero";
import TestimonialsSection from "@/components/site/TestimonialsSection";
import VisualPlaceholder from "@/components/site/VisualPlaceholder";
import { siteConfig, type WorkEntry } from "@/content/portfolio";
import { getTestimonialsByIds } from "@/data/testimonials";
import {
  getPageContextByPath,
  getPortfolioContext,
} from "@/lib/portfolio-guide/context";

type CaseStudyTemplateProps = {
  entry: WorkEntry;
  hideHero?: boolean;
};

export default function CaseStudyTemplate({
  entry,
  hideHero = false,
}: CaseStudyTemplateProps): JSX.Element {
  const relatedTestimonials = getTestimonialsByIds(entry.testimonialIds);
  const pageContext = getPageContextByPath(entry.href);
  const portfolioContext = getPortfolioContext();
  const heroMetrics =
    entry.heroMetricsPlacement === "hero" || entry.heroMetricsPlacement == null
      ? entry.featuredMetrics
      : undefined;
  const snapshotMetrics =
    entry.heroMetricsPlacement === "snapshot" ? entry.featuredMetrics : [];
  const executionArtifacts = entry.visuals.filter(
    (asset) => asset.placement === "execution",
  );
  const scaleArtifacts = entry.visuals.filter(
    (asset) => asset.placement === "scale",
  );
  const sidebarArtifacts = entry.visuals.filter(
    (asset) => asset.placement == null || asset.placement === "sidebar",
  );
  const hasSidebarArtifacts = sidebarArtifacts.length > 0;

  return (
    <div>
      {!hideHero ? (
        <Container className="py-14 md:py-20">
          <PageHero
            eyebrow={entry.eyebrow}
            title={entry.title}
            description={entry.summary}
            tags={entry.tags}
            metrics={heroMetrics}
            image={entry.heroImage}
            imageAlt={entry.heroImageAlt}
          />
        </Container>
      ) : null}

      <section
        id="case-study"
        className="scroll-mt-24 bg-[color:var(--color-background)] py-14 md:py-20"
      >
        <Container className="space-y-12 md:space-y-16">
          {pageContext ? (
            <PortfolioGuide
              pageContext={pageContext}
              portfolioContext={portfolioContext}
            />
          ) : null}

          {entry.heroDetails?.length || entry.heroQuestions?.length ? (
            <MotionReveal>
              <ContentSection tone="plain" className="space-y-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[color:var(--color-orange)]">
                  The case in one sentence
                </p>
                {entry.heroDetails?.[0] ? (
                  <p className="max-w-5xl text-pretty font-serif text-3xl leading-[1.12] tracking-[-0.03em] text-[color:var(--color-slate)] md:text-5xl">
                    {entry.heroDetails[0]}
                  </p>
                ) : null}
                {entry.heroQuestions?.length ? (
                  <ol className="grid gap-4 border-t border-[color:var(--color-slate)]/16 pt-6 text-base leading-7 text-[color:var(--color-slate)]/76 md:grid-cols-2">
                    {entry.heroQuestions.map((question, index) => (
                      <li
                        key={question}
                        className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3"
                      >
                        <span className="font-mono text-xs text-[color:var(--color-orange)]">
                          0{index + 1}
                        </span>
                        {question}
                      </li>
                    ))}
                  </ol>
                ) : null}
                {entry.heroDetails?.slice(1).map((detail) => (
                  <p
                    key={detail}
                    className="max-w-4xl text-base leading-7 text-[color:var(--color-slate)]/72 md:text-lg"
                  >
                    {detail}
                  </p>
                ))}
              </ContentSection>
            </MotionReveal>
          ) : null}

          {snapshotMetrics.length ? (
            <MotionReveal>
              <ContentSection
                title="Snapshot metrics"
                description="The headline proof points from pilot validation and rollout scale."
                tone="plain"
                className="space-y-6 border-t border-[color:var(--color-slate)]/16 pt-10"
              >
                <MetricStrip metrics={snapshotMetrics} />
              </ContentSection>
            </MotionReveal>
          ) : null}
        </Container>
      </section>

      <section className="bg-[#dce8e3] py-16 md:py-24">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {entry.overview?.length ? (
            <MotionReveal>
              <ContentSection
                eyebrow="01 · Opportunity"
                title="Overview"
                description="The shape of the opportunity and why this was the right proving ground."
                tone="plain"
              >
                {entry.overview.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-base leading-7 text-[color:var(--color-slate)]/74 md:text-lg md:leading-8"
                  >
                    {paragraph}
                  </p>
                ))}
              </ContentSection>
            </MotionReveal>
          ) : null}

          <MotionReveal delay={0.08}>
            <ContentSection
              eyebrow="02 · Environment"
              title={entry.overview?.length ? "Business context" : "Context"}
              description={
                entry.overview?.length
                  ? "The operating environment, constraints, and credibility bar behind the pilot."
                  : "The environment this work stepped into."
              }
              tone="plain"
            >
              {entry.context.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-base leading-7 text-[color:var(--color-slate)]/74 md:text-lg md:leading-8"
                >
                  {paragraph}
                </p>
              ))}
            </ContentSection>
          </MotionReveal>
        </Container>
      </section>

      <section className="bg-[#e8c8bb] py-16 md:py-24">
        <Container className="space-y-16 md:space-y-24">
          <MotionReveal>
            <div className="grid gap-12 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-20">
              <ContentSection
                eyebrow="03 · Friction"
                title="Core problem"
                description="The core friction that made this worth solving."
                tone="plain"
              >
                <ul className="border-t border-[color:var(--color-slate)]/18">
                  {entry.problem.map((item, index) => (
                    <li
                      key={item}
                      className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-4 border-b border-[color:var(--color-slate)]/18 py-5 text-base leading-7 text-[color:var(--color-slate)]/76"
                    >
                      <span className="font-mono text-xs text-[color:var(--color-slate)]/52">
                        0{index + 1}
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </ContentSection>

              <ContentSection
                eyebrow="04 · Reframe"
                title="Strategic insight"
                description="The framing that changed what the right solution looked like."
                tone="plain"
              >
                {entry.strategicInsight.map((item) => (
                  <p
                    key={item}
                    className="border-l-2 border-[color:var(--color-slate)]/28 pl-6 font-serif text-2xl leading-9 tracking-[-0.02em] text-[color:var(--color-slate)] md:text-3xl"
                  >
                    {item}
                  </p>
                ))}
              </ContentSection>
            </div>
          </MotionReveal>

          <MotionReveal>
            <ContentSection
              eyebrow="05 · Choice"
              title="Decision and tradeoffs"
              description="The alternatives considered before the path was chosen."
              tone="plain"
            >
              <div className="grid border-y border-[color:var(--color-slate)]/18 md:grid-cols-2">
                {entry.optionsAndTradeoffs.map((option, index) => (
                  <article
                    key={option.option}
                    className="border-b border-[color:var(--color-slate)]/18 py-6 md:px-7 md:[&:nth-child(odd)]:border-r md:[&:nth-last-child(-n+2)]:border-b-0 md:first:pl-0 md:last:pr-0"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-xs text-[color:var(--color-slate)]/46">
                        0{index + 1}
                      </span>
                      <h3 className="text-lg font-semibold text-[color:var(--color-slate)]">
                        {option.option}
                      </h3>
                      {option.selected ? (
                        <span className="border-l-2 border-[color:var(--color-orange)] pl-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--color-slate)]">
                          Chosen path
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[color:var(--color-slate)]/70">
                      {option.tradeoff}
                    </p>
                  </article>
                ))}
              </div>
            </ContentSection>
          </MotionReveal>
        </Container>
      </section>

      <section className="bg-[color:var(--color-background)] py-16 md:py-24">
        <Container
          className={
            hasSidebarArtifacts
              ? "grid gap-14 xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-20"
              : ""
          }
        >
          <MotionReveal>
            <ContentSection
              eyebrow="06 · Build"
              title="Execution"
              description="How the work moved from strategy into action."
              tone="plain"
            >
              <ol className="border-t border-[color:var(--color-slate)]/16">
                {entry.execution.map((item, index) => (
                  <li
                    key={typeof item === "string" ? item : item.title}
                    className="grid grid-cols-[3rem_minmax(0,1fr)] items-start gap-4 border-b border-[color:var(--color-slate)]/16 py-6"
                  >
                    <span className="font-mono text-xs font-bold text-[color:var(--color-orange)]">
                      0{index + 1}
                    </span>
                    <div className="space-y-2">
                      {typeof item === "string" ? (
                        <p className="text-base leading-7 text-[color:var(--color-slate)]/74">
                          {item}
                        </p>
                      ) : (
                        <>
                          <h3 className="font-serif text-2xl font-medium tracking-[-0.02em] text-[color:var(--color-slate)]">
                            {item.title}
                          </h3>
                          <p className="text-base leading-7 text-[color:var(--color-slate)]/72">
                            {item.body}
                          </p>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
              {executionArtifacts.length ? (
                <div className="space-y-5 border-t border-[color:var(--color-slate)]/16 pt-8">
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--color-teal)]/68">
                      {entry.artifactSectionTitle ?? "Selected artifacts"}
                    </p>
                    <p className="max-w-3xl text-sm leading-6 text-[color:var(--color-slate)]/66">
                      Workflow discovery exhibit from the early stage of the
                      pilot.
                    </p>
                  </div>
                  <div className="grid gap-5">
                    {executionArtifacts.map((asset) => (
                      <VisualPlaceholder key={asset.title} asset={asset} />
                    ))}
                  </div>
                </div>
              ) : null}
            </ContentSection>
          </MotionReveal>

          {hasSidebarArtifacts ? (
            <MotionReveal delay={0.08}>
              <ContentSection
                eyebrow="Artifacts"
                title={entry.artifactSectionTitle ?? "Selected visuals"}
                description={
                  entry.artifactSectionDescription ??
                  "Current public artifacts and placeholders for future public-safe assets."
                }
                tone="plain"
              >
                <div className="grid gap-5">
                  {sidebarArtifacts.map((asset) => (
                    <VisualPlaceholder key={asset.title} asset={asset} />
                  ))}
                </div>
              </ContentSection>
            </MotionReveal>
          ) : null}
        </Container>
      </section>

      <section className="bg-[#dfd1ad] py-16 md:py-24">
        <Container className="space-y-16 md:space-y-24">
          <MotionReveal>
            {entry.results?.length ? (
              <ContentSection
                eyebrow="07 · Proof"
                title="Results"
                description="What the pilot proved and what that unlocked."
                tone="plain"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  {entry.results.map((item) => (
                    <p
                      key={item}
                      className="border-t border-[color:var(--color-slate)]/18 pt-5 text-base leading-7 text-[color:var(--color-slate)]/76"
                    >
                      {item}
                    </p>
                  ))}
                </div>
              </ContentSection>
            ) : (
              <ContentSection
                eyebrow="07 · Proof"
                title="Impact"
                description="The outcomes this work created."
                tone="plain"
              >
                <MetricStrip metrics={entry.impact} />
              </ContentSection>
            )}
          </MotionReveal>

          {entry.scaledBeyondPilot?.length ? (
            <MotionReveal>
              <ContentSection
                eyebrow="08 · Scale"
                title="What scaled beyond the pilot"
                description="The system that made the initial proof point durable."
                tone="plain"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  {entry.scaledBeyondPilot.map((item) => (
                    <p
                      key={item}
                      className="border-t border-[color:var(--color-slate)]/18 pt-5 text-base leading-7 text-[color:var(--color-slate)]/74"
                    >
                      {item}
                    </p>
                  ))}
                </div>
                {scaleArtifacts.length ? (
                  <div className="space-y-6 border-t border-[color:var(--color-slate)]/18 pt-8">
                    <p className="max-w-3xl text-sm leading-6 text-[color:var(--color-slate)]/66">
                      The operating model and champions layer below show how the
                      rollout scaled through governance, enablement, community,
                      and executive backing rather than broad access alone.
                    </p>
                    <div className="grid gap-6">
                      {scaleArtifacts.map((asset) => (
                        <VisualPlaceholder key={asset.title} asset={asset} />
                      ))}
                    </div>
                  </div>
                ) : null}
              </ContentSection>
            </MotionReveal>
          ) : null}
        </Container>
      </section>

      <section className="bg-[#cbdedc] py-16 md:py-24">
        <Container className="space-y-16 md:space-y-24">
          <MotionReveal>
            <ContentSection
              eyebrow="09 · Reflection"
              title="What this work reinforced"
              description="The product leadership lessons that remained after the rollout."
              tone="plain"
            >
              <div className="grid gap-6 md:grid-cols-2">
                {entry.reflection.map((item) => (
                  <p
                    key={item}
                    className="border-t border-[color:var(--color-slate)]/18 pt-5 text-base leading-7 text-[color:var(--color-slate)]/74"
                  >
                    {item}
                  </p>
                ))}
              </div>
            </ContentSection>
          </MotionReveal>

          <MotionReveal>
            <TestimonialsSection
              eyebrow="Recommendations"
              title={
                entry.recommendationsTitle ??
                "How collaborators described this work"
              }
              description={
                entry.recommendationsDescription ??
                "A restrained selection of recommendation excerpts that reinforce the same story from adjacent perspectives."
              }
              testimonials={relatedTestimonials}
            />
          </MotionReveal>
        </Container>
      </section>

      <section className="bg-[color:var(--color-slate)] py-10 md:py-14">
        <Container>
          <CTASection
            title={entry.ctaTitle ?? "Want the deeper walkthrough?"}
            description={
              entry.ctaDescription ??
              "I’m happy to share the operating model, the metrics logic, or how the org alignment actually worked behind the scenes."
            }
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
        </Container>
      </section>
    </div>
  );
}
