import type { WorkEntry } from "@/content/portfolio";
import { getTestimonialsByIds } from "@/content/portfolio";
import ContentSection from "@/components/site/ContentSection";
import CTASection from "@/components/site/CTASection";
import MetricStrip from "@/components/site/MetricStrip";
import PageHero from "@/components/site/PageHero";
import TestimonialsSection from "@/components/site/TestimonialsSection";
import VisualPlaceholder from "@/components/site/VisualPlaceholder";

type CaseStudyTemplateProps = {
  entry: WorkEntry;
};

export default function CaseStudyTemplate({
  entry,
}: CaseStudyTemplateProps): JSX.Element {
  const relatedTestimonials = getTestimonialsByIds(entry.testimonialIds);
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
    <div className="space-y-8">
      <PageHero
        eyebrow={entry.eyebrow}
        title={entry.title}
        description={entry.summary}
        tags={entry.tags}
        metrics={heroMetrics}
        image={entry.heroImage}
        imageAlt={entry.heroImageAlt}
      />

      {entry.heroDetails?.length || entry.heroQuestions?.length ? (
        <ContentSection tone="plain" className="space-y-5">
          {entry.heroDetails?.[0] ? (
            <p className="max-w-4xl text-base leading-7 text-[color:var(--color-slate)]/72 md:text-lg">
              {entry.heroDetails[0]}
            </p>
          ) : null}
          {entry.heroQuestions?.length ? (
            <ol className="space-y-3 pl-5 text-base leading-7 text-[color:var(--color-slate)]/76 marker:font-semibold marker:text-[color:var(--color-teal)]">
              {entry.heroQuestions.map((question) => (
                <li key={question}>{question}</li>
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
      ) : null}

      {snapshotMetrics.length ? (
        <ContentSection
          title="Snapshot metrics"
          description="The headline proof points from pilot validation and rollout scale."
          tone="plain"
          className="space-y-6"
        >
          <MetricStrip metrics={snapshotMetrics} />
        </ContentSection>
      ) : null}

      <div
        className={
          hasSidebarArtifacts
            ? "grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]"
            : "space-y-8"
        }
      >
        <div className="space-y-8">
          {entry.overview?.length ? (
            <ContentSection
              title="Overview"
              description="The shape of the opportunity and why this was the right proving ground."
            >
              {entry.overview.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-base leading-7 text-[color:var(--color-slate)]/72"
                >
                  {paragraph}
                </p>
              ))}
            </ContentSection>
          ) : null}

          <ContentSection
            title={entry.overview?.length ? "Business context" : "Context"}
            description={
              entry.overview?.length
                ? "The operating environment, constraints, and credibility bar behind the pilot."
                : "The environment this work stepped into."
            }
          >
            {entry.context.map((paragraph) => (
              <p
                key={paragraph}
                className="text-base leading-7 text-[color:var(--color-slate)]/72"
              >
                {paragraph}
              </p>
            ))}
          </ContentSection>

          <ContentSection
            title="Core problem"
            description="The core friction that made this worth solving."
          >
            <ul className="space-y-4">
              {entry.problem.map((item) => (
                <li
                  key={item}
                  className="rounded-[1.25rem] bg-[color:var(--color-cream)]/72 px-5 py-4 text-base leading-7 text-[color:var(--color-slate)]/74"
                >
                  {item}
                </li>
              ))}
            </ul>
          </ContentSection>

          <ContentSection
            title="Strategic Insight"
            description="The framing that changed what the right solution looked like."
            tone="muted"
          >
            {entry.strategicInsight.map((item) => (
              <p
                key={item}
                className="text-base leading-7 text-[color:var(--color-slate)]/74"
              >
                {item}
              </p>
            ))}
          </ContentSection>

          <ContentSection
            title="Decision and tradeoffs"
            description="The alternatives considered before the path was chosen."
          >
            <div className="grid gap-4">
              {entry.optionsAndTradeoffs.map((option) => (
                <article
                  key={option.option}
                  className="rounded-[1.35rem] border border-[color:var(--color-teal)]/10 bg-white/78 px-5 py-5"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-semibold text-[color:var(--color-slate)]">
                      {option.option}
                    </h3>
                    {option.selected ? (
                      <span className="inline-flex rounded-full bg-[color:var(--color-orange)]/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-orange)]/90">
                        Chosen path
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[color:var(--color-slate)]/68">
                    {option.tradeoff}
                  </p>
                </article>
              ))}
            </div>
          </ContentSection>

          <ContentSection
            title="Execution"
            description="How the work moved from strategy into action."
          >
            <ol className="grid gap-4">
              {entry.execution.map((item, index) => (
                <li
                  key={typeof item === "string" ? item : item.title}
                  className="grid grid-cols-[40px_minmax(0,1fr)] items-start gap-4 rounded-[1.35rem] border border-black/6 bg-white/78 px-5 py-5"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--color-teal)] text-sm font-semibold text-[color:var(--color-cream)]">
                    {index + 1}
                  </span>
                  <div className="space-y-2 pt-0.5">
                    {typeof item === "string" ? (
                      <p className="text-base leading-7 text-[color:var(--color-slate)]/72">
                        {item}
                      </p>
                    ) : (
                      <>
                        <h3 className="text-lg font-semibold text-[color:var(--color-slate)]">
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
              <div className="space-y-5 border-t border-black/6 pt-6">
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--color-teal)]/68">
                    {entry.artifactSectionTitle ?? "Selected artifacts"}
                  </p>
                  <p className="max-w-3xl text-sm leading-6 text-[color:var(--color-slate)]/66">
                    Workflow discovery exhibit from the early stage of the pilot.
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

          {entry.results?.length ? (
            <ContentSection
              title="Results"
              description="What the pilot proved and what that unlocked."
              tone="muted"
            >
              {entry.results.map((item) => (
                <p
                  key={item}
                  className="text-base leading-7 text-[color:var(--color-slate)]/74"
                >
                  {item}
                </p>
              ))}
            </ContentSection>
          ) : (
            <ContentSection
              title="Impact"
              description="The outcomes this work created."
              tone="muted"
            >
              <MetricStrip metrics={entry.impact} />
            </ContentSection>
          )}

          {entry.scaledBeyondPilot?.length ? (
            <ContentSection
              title="What scaled beyond the pilot"
              description="The system that made the initial proof point durable."
            >
              {entry.scaledBeyondPilot.map((item) => (
                <p
                  key={item}
                  className="text-base leading-7 text-[color:var(--color-slate)]/72"
                >
                  {item}
                </p>
              ))}
              {scaleArtifacts.length ? (
                <div className="space-y-5 border-t border-black/6 pt-6">
                  <p className="max-w-3xl text-sm leading-6 text-[color:var(--color-slate)]/66">
                    The operating model and champions layer below show how the
                    rollout scaled through governance, enablement, community,
                    and executive backing rather than broad access alone.
                  </p>
                  <div className="grid gap-5">
                    {scaleArtifacts.map((asset) => (
                      <VisualPlaceholder key={asset.title} asset={asset} />
                    ))}
                  </div>
                </div>
              ) : null}
            </ContentSection>
          ) : null}

          <ContentSection
            title="Reflection"
            description="What this work reinforced about how I lead products."
          >
            {entry.reflection.map((item) => (
              <p
                key={item}
                className="text-base leading-7 text-[color:var(--color-slate)]/72"
              >
                {item}
              </p>
            ))}
          </ContentSection>
        </div>

        {hasSidebarArtifacts ? (
          <div className="space-y-8">
            <ContentSection
              title={entry.artifactSectionTitle ?? "Selected visuals"}
              description={
                entry.artifactSectionDescription ??
                "Current public artifacts and placeholders for future public-safe assets."
              }
            >
              <div className="grid gap-4">
                {sidebarArtifacts.map((asset) => (
                  <VisualPlaceholder key={asset.title} asset={asset} />
                ))}
              </div>
            </ContentSection>
          </div>
        ) : null}
      </div>

      <TestimonialsSection
        eyebrow="Recommendations"
        title={entry.recommendationsTitle ?? "How collaborators described this work"}
        description={
          entry.recommendationsDescription ??
          "A restrained selection of recommendation excerpts that reinforce the same story from adjacent perspectives."
        }
        testimonials={relatedTestimonials}
      />

      <CTASection
        title={entry.ctaTitle ?? "Want the deeper walkthrough?"}
        description={
          entry.ctaDescription ??
          "I’m happy to share the operating model, the metrics logic, or how the org alignment actually worked behind the scenes."
        }
        primaryAction={{
          href: "https://www.linkedin.com/in/daniel-a-nash/",
          label: "Connect on LinkedIn",
          external: true,
        }}
        secondaryAction={{
          href: "mailto:hello@danielnash.com",
          label: "Email me",
          external: true,
        }}
      />
    </div>
  );
}
