import type { CreativeEntry } from "@/content/portfolio";
import ContentSection from "@/components/site/ContentSection";
import CTASection from "@/components/site/CTASection";
import PageHero from "@/components/site/PageHero";
import VisualPlaceholder from "@/components/site/VisualPlaceholder";

type CreativeTemplateProps = {
  entry: CreativeEntry;
};

export default function CreativeTemplate({
  entry,
}: CreativeTemplateProps): JSX.Element {
  return (
    <div className="space-y-8">
      <PageHero
        eyebrow={entry.eyebrow}
        title={entry.title}
        description={entry.summary}
        tags={entry.tags}
        image={entry.heroImage}
        imageAlt={entry.heroImageAlt}
      />

      {entry.sections.map((section) => (
        <ContentSection key={section.title} title={section.title}>
          {section.body.map((paragraph) => (
            <p
              key={paragraph}
              className="text-base leading-7 text-[color:var(--color-slate)]/72"
            >
              {paragraph}
            </p>
          ))}
        </ContentSection>
      ))}

      {entry.embeds?.length ? (
        <ContentSection
          title="Embeds"
          description="Selected pieces and performance artifacts."
        >
          <div className="grid gap-5">
            {entry.embeds.map((embed) => (
              <article
                key={embed.title}
                className="overflow-hidden rounded-[1.5rem] border border-black/6 bg-white/84"
              >
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-[color:var(--color-slate)]">
                    {embed.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--color-slate)]/68">
                    {embed.description}
                  </p>
                </div>
                {embed.type === "spotify" ? (
                  <iframe
                    style={{ borderRadius: "0 0 24px 24px" }}
                    src={embed.src}
                    width="100%"
                    height="152"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    title={embed.title}
                  />
                ) : (
                  <iframe
                    src={embed.src}
                    title={embed.title}
                    width="100%"
                    height="420"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                  />
                )}
              </article>
            ))}
          </div>
        </ContentSection>
      ) : null}

      {entry.visuals?.length ? (
        <ContentSection
          title="Artifacts"
          description="Current placeholders for future media or process captures."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {entry.visuals.map((asset) => (
              <VisualPlaceholder key={asset.title} asset={asset} />
            ))}
          </div>
        </ContentSection>
      ) : null}

      <CTASection
        title="Creative work is part of the product story, not separate from it."
        description="If you're interested in the intersection of creative technology, product systems, and AI, I'd love to compare notes."
        primaryAction={{
          href: "https://www.linkedin.com/in/daniel-a-nash/",
          label: "Connect on LinkedIn",
          external: true,
        }}
        secondaryAction={{
          href: "/about",
          label: "Read the background",
        }}
      />
    </div>
  );
}
