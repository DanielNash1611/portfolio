import type { ThinkingEntry } from "@/content/portfolio";
import PortfolioGuide from "@/components/portfolio/PortfolioGuide";
import EditorialEssayLayout, {
  type EditorialEssaySection,
} from "@/components/site/EditorialEssayLayout";
import {
  getPageContextByPath,
  getPortfolioContext,
} from "@/lib/portfolio-guide/context";

type EssayTemplateProps = {
  entry: ThinkingEntry;
};

export default function EssayTemplate({
  entry,
}: EssayTemplateProps): JSX.Element {
  const pageContext = getPageContextByPath(entry.href);
  const portfolioContext = getPortfolioContext();
  const sections: EditorialEssaySection[] = entry.sections.map((section) => ({
    title: section.title,
    blocks: section.body.map((paragraph) => ({
      type: "paragraph" as const,
      text: paragraph,
    })),
  }));

  return (
    <EditorialEssayLayout
      eyebrow={entry.eyebrow}
      title={entry.title}
      readTime={entry.readTime}
      introParagraphs={[entry.summary]}
      tags={entry.tags}
      sections={sections}
      afterHero={
        pageContext ? (
          <PortfolioGuide
            pageContext={pageContext}
            portfolioContext={portfolioContext}
          />
        ) : null
      }
    />
  );
}
