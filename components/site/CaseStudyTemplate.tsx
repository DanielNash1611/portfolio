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

  return (
    <div className="space-y-8">
      <PageHero
        eyebrow={entry.eyebrow}
        title={entry.title}
        description={entry.summary}
        tags={entry.tags}
        metrics={entry.featuredMetrics}
        image={entry.heroImage}
        imageAlt={entry.heroImageAlt}
      />

      <MetricStrip metrics={entry.impact} />

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-8">
          <ContentSection
            title="Context"
            description="The environment this work stepped into."
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
            title="Problem"
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
            title="Options & Tradeoffs"
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
                  key={item}
                  className="grid gap-3 rounded-[1.35rem] border border-black/6 bg-white/78 px-5 py-5 md:grid-cols-[40px_minmax(0,1fr)]"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--color-teal)] text-sm font-semibold text-[color:var(--color-cream)]">
                    {index + 1}
                  </span>
                  <p className="text-base leading-7 text-[color:var(--color-slate)]/72">
                    {item}
                  </p>
                </li>
              ))}
            </ol>
          </ContentSection>

          <ContentSection
            title="Impact"
            description="The outcomes this work created."
            tone="muted"
          >
            <MetricStrip metrics={entry.impact} />
          </ContentSection>

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

        <div className="space-y-8">
          <ContentSection
            title="Selected visuals"
            description="Current public artifacts and placeholders for future public-safe assets."
          >
            <div className="grid gap-4">
              {entry.visuals.map((asset) => (
                <VisualPlaceholder key={asset.title} asset={asset} />
              ))}
            </div>
          </ContentSection>
        </div>
      </div>

      <TestimonialsSection
        eyebrow="Recommendations"
        title="How collaborators described this work"
        description="A restrained selection of recommendation excerpts that reinforce the same story from adjacent perspectives."
        testimonials={relatedTestimonials}
      />

      <CTASection
        title="Want the deeper walkthrough?"
        description="I’m happy to share the operating model, the metrics logic, or how the org alignment actually worked behind the scenes."
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
