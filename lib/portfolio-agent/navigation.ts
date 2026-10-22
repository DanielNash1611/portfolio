import { getPublicSurfaceCatalog } from "./catalog";
import { resolveNavigationRequest } from "./capabilities";
import type {
  CopilotRequest,
  CopilotResponse,
} from "@/lib/portfolio-guide/types";

/** Navigation is authored lookup, never model-generated actuation. */
export function getNavigationResponse(
  request: Pick<CopilotRequest, "message">,
): CopilotResponse | null {
  const navigation = resolveNavigationRequest(
    request.message,
    getPublicSurfaceCatalog(),
  );
  if (!navigation) return null;
  const [page] = navigation.choices;
  return navigation.action && page
    ? {
        answer: `Opening ${page.title}.`,
        action: navigation.action,
        relatedPages: [{ slug: page.slug, title: page.title, href: page.href }],
      }
    : {
        answer:
          "Which portfolio page would you like to open? Choose a published page or use its exact title.",
        relatedPages: navigation.choices
          .slice(0, 2)
          .map(({ slug, href, title }) => ({ slug, href, title })),
      };
}
