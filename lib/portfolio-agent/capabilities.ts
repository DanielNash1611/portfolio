import { normalizeVisitorIntent } from "@/lib/portfolio-guide/intent";
import { getGuidedRecommendations } from "@/lib/portfolio-guide/recommendations";
import type {
  PublicSurface,
  NavigationAction,
  AgentSubmitEvent,
} from "./types";

export function findRelevantWork(catalog: PublicSurface[], input: unknown) {
  if (typeof input !== "string" || !input.trim() || input.length > 1000) {
    throw new Error("Enter a role or interest between 1 and 1,000 characters.");
  }
  const intent = normalizeVisitorIntent(input)!;
  return getGuidedRecommendations(
    catalog.filter((page) => page.kind === "detail"),
    intent,
    {
      featuredSlugs: catalog
        .filter((page) => page.featured)
        .map((page) => page.slug),
    },
  )
    .slice(0, 5)
    .map((result) => ({
      ...result,
      href: catalog.find((page) => page.slug === result.slug)!.href,
    }));
}

export function getNavigationTarget(
  catalog: PublicSurface[],
  slug: unknown,
): PublicSurface {
  const page =
    typeof slug === "string"
      ? catalog.find((candidate) => candidate.slug === slug)
      : undefined;
  if (!page || !page.href.startsWith("/") || page.href.startsWith("//")) {
    throw new Error("Choose a page from this portfolio.");
  }
  return page;
}

function normalized(value: string): string {
  return value
    .toLowerCase()
    .replace(/[×]/g, "x")
    .replace(/[^a-z0-9/ -]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Keep same-site citations inside the shared App Router conversation. */
export function getPortfolioHref(value: string): string | null {
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    const url = new URL(value);
    return url.protocol === "https:" &&
      ["danielnash.co", "www.danielnash.co"].includes(url.hostname)
      ? `${url.pathname}${url.search}${url.hash}`
      : null;
  } catch {
    return null;
  }
}

/** Only an entire, positive navigation instruction may cause a route change. */
export function resolveNavigationRequest(
  message: string,
  catalog: PublicSurface[],
): { action?: NavigationAction; choices: PublicSurface[] } | null {
  const match =
    /^(?:please\s+)?(?:(?:can|could|would) you (?:please )?)?(?:open|go to|take me to|navigate to)\s+([^!?\n]+?)[.!?]?$/i.exec(
      message.trim(),
    );
  if (!match) return null;
  const target = normalized(match[1])
    .replace(/^the /, "")
    .replace(/\s+(?:page|case study|essay|project)$/, "");
  if (!target || /\b(?:and|then|but|dont|not)\b/.test(target)) return null;
  const choices = catalog.filter((page) =>
    [page.title, page.slug, page.href, ...page.aliases].some(
      (alias) => normalized(alias) === target,
    ),
  );
  return {
    ...(choices.length === 1
      ? { action: { kind: "navigate" as const, slug: choices[0].slug } }
      : {}),
    choices,
  };
}

export function canApplyNavigation(options: {
  submittedPath: string;
  currentPath: string;
  turnId: string;
  applied: Set<string>;
  cancelled?: boolean;
  submittedRevision?: number;
  currentRevision?: number;
}): boolean {
  return (
    !options.cancelled &&
    options.submittedPath === options.currentPath &&
    options.submittedRevision === options.currentRevision &&
    !options.applied.has(options.turnId)
  );
}

/** Read the DOM, not controlled state: native agents may populate without React events. */
export function submitAnnotatedForm(
  event: {
    preventDefault(): void;
    currentTarget: HTMLFormElement;
    nativeEvent: Event;
  },
  field: string,
  submit: (value: string, entryPoint: "ui" | "webmcp") => Promise<unknown>,
): Promise<unknown> {
  event.preventDefault();
  const value = String(new FormData(event.currentTarget).get(field) ?? "");
  const nativeEvent = event.nativeEvent as AgentSubmitEvent;
  const result = submit(value, nativeEvent.agentInvoked ? "webmcp" : "ui");
  if (nativeEvent.agentInvoked && nativeEvent.respondWith)
    nativeEvent.respondWith(result);
  return result;
}
