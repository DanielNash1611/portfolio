import type { GuideScope, PublicSurface } from "./types";

/** Human visitors can open the shared assistant on every site page. */
export function portfolioAssistantAvailable(pathname: string) {
  return pathname.startsWith("/");
}

/** The unindexed preview does not register native agent tools. */
export function portfolioWebMCPAvailable(pathname: string) {
  return (
    portfolioAssistantAvailable(pathname) &&
    pathname.replace(/\/$/, "") !== "/experience" &&
    !pathname.startsWith("/experience/")
  );
}

export function resolveAssistantSurface(
  pathname: string,
  catalog: PublicSurface[],
) {
  const path = pathname.replace(/\/$/, "") || "/";
  const current = catalog.find((page) => page.href === path);
  const surface = current ?? catalog.find((page) => page.slug === "site-home")!;
  return {
    surface,
    pageKnown: Boolean(current),
    viewTitle: path === "/experience" ? "Portfolio in motion" : surface.title,
    defaultScope: (surface.kind === "collection" || !current
      ? "portfolio"
      : "page") as GuideScope,
  };
}
