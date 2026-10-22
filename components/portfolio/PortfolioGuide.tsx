import type {
  GuideTone,
  PageContext,
  PortfolioContext,
} from "@/lib/portfolio-guide/types";
import PortfolioAssistantEntry from "./PortfolioAssistantEntry";
import LegacyPortfolioGuide from "./LegacyPortfolioGuide";

export default function PortfolioGuide(props: {
  pageContext: PageContext;
  portfolioContext: PortfolioContext;
  tone?: GuideTone;
}) {
  return process.env.NEXT_PUBLIC_PORTFOLIO_ASSISTANT_ENABLED !== "true" ? (
    <LegacyPortfolioGuide {...props} />
  ) : (
    <PortfolioAssistantEntry
      id={`portfolio-guide-${props.pageContext.slug}`}
      title={props.pageContext.title}
    />
  );
}
