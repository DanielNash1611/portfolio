import type { PortfolioGuideEvalCase } from "./types";

export const PORTFOLIO_GUIDE_SMOKE_CASE_IDS = new Set([
  "ai-platform-role-fit-suggests-generator", "ai-platform-direct-resume-request",
  "checkout-evidence-does-not-overpromote-generator", "checkout-mentions-mcp",
  "ai-platform-most-reused-patterns", "ai-platform-contaminated-history",
  "ai-platform-referential-follow-up", "checkout-multiturn-current-page-primary",
  "ai-platform-seniority", "ai-platform-implied-not-proven", "ai-platform-connections",
  "checkout-cross-page-dau", "jira-evidence", "jira-next-read",
]);

export function selectEvalCases(cases: PortfolioGuideEvalCase[], options: {
  filter?: string; smoke?: boolean; full?: boolean; changedPaths?: string[];
}) {
  if (options.full && (options.smoke || options.filter)) throw new Error("Use --full or a targeted selector, not both.");
  if (options.full) return { cases, reason: "explicit full suite" };
  if (options.filter?.trim()) {
    const terms = options.filter.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
    const selected = cases.filter((c) => (!options.smoke || PORTFOLIO_GUIDE_SMOKE_CASE_IDS.has(c.id)) &&
      terms.some((term) => `${c.id} ${c.title} ${c.summary}`.toLowerCase().includes(term)));
    if (!selected.length) throw new Error("No eval cases matched the requested filter.");
    return { cases: selected, reason: `explicit filter: ${options.filter}` };
  }
  const smoke = () => cases.filter((c) => PORTFOLIO_GUIDE_SMOKE_CASE_IDS.has(c.id));
  if (options.smoke) return { cases: smoke(), reason: "explicit smoke suite" };
  const paths = options.changedPaths ?? [];
  // Eval expectations change scoring, not generation. Unit tests/replay cover those edits.
  const behaviorPaths = paths.filter((p) => !/\.(?:css|scss|sass|svg|png|jpe?g|webp)$/.test(p) &&
    (/^(?:lib\/portfolio-(?:guide|agent)\/|lib\/search\/|content\/|components\/portfolio\/)/.test(p) ||
      /^app\/api\/portfolio-/.test(p) || (p.endsWith("/page.tsx") && (p === "app/page.tsx" ||
        cases.some((c) => p.includes(c.pageSlug.replace(/^site-/, "")))))) &&
    !p.startsWith("lib/portfolio-guide/evals/") && !p.includes("/api/product-workspace/"));
  if (!behaviorPaths.length) return { cases: [], reason: "no changed AI behavior; deterministic checks only" };
  const broad = behaviorPaths.some((p) => /^lib\//.test(p) || /(?:portfolio\.ts|portfolio-guide\.ts|PortfolioGuide|PortfolioAssistant|RoleIntent)/.test(p));
  if (broad) return { cases: smoke(), reason: "shared AI behavior changed; bounded smoke coverage" };
  const selected = cases.filter((c) => behaviorPaths.some((p) =>
    p.includes(c.pageSlug.replace(/^site-/, "")) || (p === "app/page.tsx" && c.pageSlug === "site-home") ||
    (p.includes("checkout") && c.pageSlug.includes("checkout")) ||
    (p.includes("creative") && /creative|gravity|tabletop|eeg/.test(c.id))));
  return selected.length && selected.length <= 14
    ? { cases: selected, reason: "cases for changed pages" }
    : { cases: smoke(), reason: "broad or unmapped page change; bounded smoke coverage" };
}

export function requireExplicitLive(options: {
  live?: boolean; decisions?: boolean; liveEvidence?: boolean; providerMode?: string;
  assistantBaseUrl?: string; judgeBaseUrl?: string; maxCases?: number; timeoutMs?: number;
}) {
  const loopback = (url: string) => {
    try { return ["127.0.0.1", "localhost", "[::1]"].includes(new URL(url).hostname); } catch { return false; }
  };
  const remote = options.live || options.decisions || options.liveEvidence ||
    ["openai", "local-answer-remote-judge"].includes(options.providerMode ?? "") ||
    [options.assistantBaseUrl, options.judgeBaseUrl].some((url) => url && !loopback(url));
  if (remote && (!options.live || !Number.isInteger(options.maxCases) || options.maxCases! < 1 ||
      !Number.isInteger(options.timeoutMs) || options.timeoutMs! < 1)) {
    throw new Error("Remote eval dependencies require explicit --live, --max-cases N and --assistant-timeout-ms N. No requests were started.");
  }
}
