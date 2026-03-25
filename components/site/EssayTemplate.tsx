import type { ThinkingEntry } from "@/content/portfolio";
import ContentSection from "@/components/site/ContentSection";
import CTASection from "@/components/site/CTASection";
import PageHero from "@/components/site/PageHero";

type EssayTemplateProps = {
  entry: ThinkingEntry;
};

export default function EssayTemplate({
  entry,
}: EssayTemplateProps): JSX.Element {
  return (
    <div className="space-y-8">
      <PageHero
        eyebrow={entry.eyebrow}
        title={entry.title}
        description={entry.summary}
        tags={entry.tags}
        metrics={entry.keyIdeas.map((idea) => ({
          label: "Key idea",
          value: idea,
        }))}
        compact
      />

      <ContentSection
        title="Core ideas"
        description="The short version before the deeper sections."
      >
        <ul className="space-y-4">
          {entry.keyIdeas.map((idea) => (
            <li
              key={idea}
              className="rounded-[1.25rem] bg-[color:var(--color-cream)]/72 px-5 py-4 text-base leading-7 text-[color:var(--color-slate)]/72"
            >
              {idea}
            </li>
          ))}
        </ul>
      </ContentSection>

      {entry.sections.map((section) => (
        <ContentSection
          key={section.title}
          title={section.title}
          description={entry.readTime}
        >
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

      <CTASection
        title="If this point of view feels aligned, let's talk."
        description="The essays are here to make the operating model visible, not to pad the portfolio. Happy to go deeper in a conversation."
        primaryAction={{
          href: "https://www.linkedin.com/in/daniel-a-nash/",
          label: "Connect on LinkedIn",
          external: true,
        }}
        secondaryAction={{
          href: "/work",
          label: "See the work",
        }}
      />
    </div>
  );
}
