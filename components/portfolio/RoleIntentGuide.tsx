import type { PageContext } from "@/lib/portfolio-guide/types";
import PortfolioAssistantEntry from "./PortfolioAssistantEntry";
import LegacyRoleIntentGuide from "./LegacyRoleIntentGuide";

export default function RoleIntentGuide(props: {
  pageCatalog: PageContext[];
  featuredProjectSlugs: string[];
}) {
  return process.env.NEXT_PUBLIC_PORTFOLIO_ASSISTANT_ENABLED !== "true" ? (
    <LegacyRoleIntentGuide {...props} />
  ) : (
    <PortfolioAssistantEntry lens />
  );
}
