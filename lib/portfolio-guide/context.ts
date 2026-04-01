import {
  aboutContent,
  homeContent,
  productEntries,
  siteConfig,
  thinkingEntries,
  workEntries,
  type ProductEntry,
  type ThinkingEntry,
  type WorkEntry,
} from "@/content/portfolio";
import { portfolioGuideMetadata } from "@/content/projects/portfolio-guide";
import { CASE_STUDIES } from "@/data/caseStudies";
import { cases } from "@/data/cases";
import { NARRATIVES } from "@/data/positioning";
import type {
  PageArtifact,
  PageAuthoredSection,
  PageContext,
  PageEvidenceHighlight,
  PortfolioContext,
} from "@/lib/portfolio-guide/types";

type CanonicalSource = "work" | "product" | "legacy-case" | "thinking";

type CanonicalProject = {
  slug: string;
  href: string;
  title: string;
  source: CanonicalSource;
};

const CANONICAL_PROJECTS: CanonicalProject[] = [
  {
    slug: "chatgpt-enterprise",
    href: "/work/chatgpt-enterprise",
    title: "ChatGPT Enterprise from pilot to operating model",
    source: "work",
  },
  {
    slug: "ai-platform-mcp",
    href: "/work/ai-platform-mcp",
    title: "From AI experiments to platform foundations",
    source: "work",
  },
  {
    slug: "checkout-redesign",
    href: "/work/checkout-redesign",
    title: "Better execution, faster checkout, measurable growth",
    source: "work",
  },
  {
    slug: "launchmuse",
    href: "/products/launchmuse",
    title: "LaunchMuse",
    source: "product",
  },
  {
    slug: "immunology-scout",
    href: "/products/immunology-scout",
    title: "Immunology Scout",
    source: "product",
  },
  {
    slug: "oms-chatgpt-app",
    href: "/products/oms-chatgpt-app",
    title: "OMS ChatGPT App",
    source: "product",
  },
  {
    slug: "jira-product-discovery",
    href: "/case-studies/jira-product-discovery",
    title: "Jira Product Discovery (JPD) Adoption & Product Org Enablement",
    source: "legacy-case",
  },
  {
    slug: "ai-strategy",
    href: "/thinking/ai-strategy",
    title: "AI doesn't fail because of the model. It fails in the workflow.",
    source: "thinking",
  },
  {
    slug: "product-philosophy",
    href: "/thinking/product-philosophy",
    title: "Product leadership is systems design",
    source: "thinking",
  },
];

function normalizePathname(pathname: string): string {
  const [pathOnly] = pathname.split(/[?#]/);
  if (!pathOnly) {
    return "/";
  }

  const normalized =
    pathOnly !== "/" && pathOnly.endsWith("/") ? pathOnly.slice(0, -1) : pathOnly;

  return normalized || "/";
}

function uniqueStrings(items: Array<string | undefined>): string[] {
  const seen = new Set<string>();
  const results: string[] = [];

  for (const item of items) {
    const value = item?.trim();
    if (!value || seen.has(value)) {
      continue;
    }
    seen.add(value);
    results.push(value);
  }

  return results;
}

function metricToString(metric: { label: string; value: string; detail?: string }): string {
  return metric.detail
    ? `${metric.label}: ${metric.value} (${metric.detail})`
    : `${metric.label}: ${metric.value}`;
}

function visualToArtifact(visual: {
  title: string;
  description: string;
  expandable?: boolean;
}): PageArtifact {
  return {
    label: visual.title,
    type: visual.expandable ? "image" : "case-study",
    description: visual.description,
  };
}

function createAuthoredSection(
  label: string,
  snippets: Array<string | undefined>,
): PageAuthoredSection | null {
  const normalizedSnippets = uniqueStrings(snippets);
  if (normalizedSnippets.length === 0) {
    return null;
  }

  return {
    label,
    snippets: normalizedSnippets,
  };
}

function formatTradeoff(option: {
  option: string;
  tradeoff: string;
  selected?: boolean;
}): string {
  return option.selected
    ? `${option.option} (chosen path): ${option.tradeoff}`
    : `${option.option}: ${option.tradeoff}`;
}

function formatExecutionItem(item: string | { title: string; body: string }): string {
  return typeof item === "string" ? item : `${item.title}: ${item.body}`;
}

function buildFallbackEvidenceHighlights(input: {
  metrics?: string[];
  outcomes?: string[];
  actions?: string[];
  artifacts?: PageArtifact[];
}): PageEvidenceHighlight[] {
  const evidence: PageEvidenceHighlight[] = [];

  for (const metric of input.metrics?.slice(0, 2) ?? []) {
    evidence.push({
      label: "Metric",
      detail: metric,
      type: "metric",
    });
  }

  for (const outcome of input.outcomes?.slice(0, 2) ?? []) {
    evidence.push({
      label: "Outcome",
      detail: outcome,
      type: "outcome",
    });
  }

  for (const action of input.actions?.slice(0, 1) ?? []) {
    evidence.push({
      label: "Execution",
      detail: action,
      type: "workflow",
    });
  }

  for (const artifact of input.artifacts?.slice(0, 1) ?? []) {
    evidence.push({
      label: artifact.label,
      detail: artifact.description ?? artifact.label,
      type: "artifact",
    });
  }

  return evidence.slice(0, 4);
}

function buildWorkAuthoredSections(entry: WorkEntry): PageAuthoredSection[] {
  // These sections become the guide's primary grounding source, so we keep them tied
  // to authored portfolio content instead of UI-rendered chat output or DOM scraping.
  return [
    createAuthoredSection("Page summary", [
      entry.summary,
      entry.description,
      ...(entry.heroDetails ?? []),
      ...(entry.heroQuestions ?? []).map((question) => `Key question: ${question}`),
    ]),
    createAuthoredSection("Featured metrics", entry.featuredMetrics.map(metricToString)),
    createAuthoredSection("Overview", entry.overview ?? []),
    createAuthoredSection("Context", entry.context),
    createAuthoredSection("Core problem", entry.problem),
    createAuthoredSection("Strategic insight", entry.strategicInsight),
    createAuthoredSection(
      "Decision and tradeoffs",
      entry.optionsAndTradeoffs.map(formatTradeoff),
    ),
    createAuthoredSection(
      "Execution",
      entry.execution.map(formatExecutionItem),
    ),
    createAuthoredSection("Impact", entry.impact.map(metricToString)),
    createAuthoredSection("Results", entry.results ?? []),
    createAuthoredSection("Scaled beyond pilot", entry.scaledBeyondPilot ?? []),
    createAuthoredSection("Reflection", entry.reflection),
    createAuthoredSection(
      "Artifacts described on page",
      entry.visuals.map((asset) =>
        asset.description ? `${asset.title}: ${asset.description}` : asset.title,
      ),
    ),
  ].filter((section): section is PageAuthoredSection => section !== null);
}

function buildProductAuthoredSections(entry: ProductEntry): PageAuthoredSection[] {
  return [
    createAuthoredSection("Page summary", [entry.summary, entry.description]),
    createAuthoredSection("Featured metrics", entry.featuredMetrics.map(metricToString)),
    createAuthoredSection("Problem", entry.problem),
    createAuthoredSection("Solution", entry.solution),
    createAuthoredSection(
      "Product experience",
      entry.productExperience.map(
        (step) => `${step.title}: ${step.description}`,
      ),
    ),
    createAuthoredSection("Learnings", entry.learnings),
    createAuthoredSection(
      "Artifacts described on page",
      entry.visuals.map((asset) =>
        asset.description ? `${asset.title}: ${asset.description}` : asset.title,
      ),
    ),
  ].filter((section): section is PageAuthoredSection => section !== null);
}

function buildThinkingAuthoredSections(entry: ThinkingEntry): PageAuthoredSection[] {
  return [
    createAuthoredSection("Page summary", [entry.summary, entry.description]),
    createAuthoredSection("Key ideas", entry.keyIdeas),
    ...entry.sections.map((section) =>
      createAuthoredSection(section.title, section.body),
    ),
  ].filter((section): section is PageAuthoredSection => section !== null);
}

function buildLegacyCaseAuthoredSections(slug: string): PageAuthoredSection[] {
  const caseEntry = cases.find((candidate) => candidate.slug === slug);
  const measuredEntry = CASE_STUDIES.find((candidate) => candidate.slug === slug);
  const overlay = portfolioGuideMetadata[slug];

  return [
    createAuthoredSection("Page summary", [
      caseEntry?.summary,
      measuredEntry?.summary,
      overlay?.oneLiner,
    ]),
    createAuthoredSection(
      "Measured results",
      uniqueStrings([
        ...(caseEntry?.kpis?.map((metric) =>
          metric.description
            ? `${metric.label}: ${metric.value} (${metric.description})`
            : `${metric.label}: ${metric.value}`,
        ) ?? []),
        ...(measuredEntry?.headlineMetrics?.map(
          (metric) => `${metric.label}: ${metric.value}`,
        ) ?? []),
        ...(measuredEntry?.measuredMetrics?.map((metric) =>
          metric.context
            ? `${metric.label}: ${metric.value} (${metric.context})`
            : `${metric.label}: ${metric.value}`,
        ) ?? []),
        ...(overlay?.metrics ?? []),
      ]),
    ),
    createAuthoredSection("Problem framing", [overlay?.problem]),
    createAuthoredSection("Actions", overlay?.actions ?? []),
    createAuthoredSection("Outcomes", overlay?.outcomes ?? []),
    createAuthoredSection("Leadership signals", overlay?.leadershipSignals ?? []),
    createAuthoredSection(
      "Artifacts described on page",
      (overlay?.artifacts ?? []).map((artifact) =>
        artifact.description
          ? `${artifact.label}: ${artifact.description}`
          : artifact.label,
      ),
    ),
  ].filter((section): section is PageAuthoredSection => section !== null);
}

function workEntryToPageContext(slug: string): PageContext | null {
  const entry = workEntries.find((candidate) => candidate.slug === slug);
  if (!entry) {
    return null;
  }

  const overlay = portfolioGuideMetadata[slug] ?? {};

  const actions = overlay.actions ?? entry.execution.map((item) =>
    typeof item === "string" ? item : `${item.title}: ${item.body}`,
  );

  const outcomes = overlay.outcomes ??
    uniqueStrings([
      ...(entry.results ?? []),
      ...(entry.scaledBeyondPilot ?? []),
      ...entry.impact.map(metricToString),
    ]).slice(0, 8);

  const metrics = overlay.metrics ??
    uniqueStrings([
      ...entry.featuredMetrics.map(metricToString),
      ...entry.impact.map(metricToString),
    ]);
  const artifacts = overlay.artifacts ?? entry.visuals.map(visualToArtifact).slice(0, 3);

  return {
    slug: entry.slug,
    href: entry.href,
    title: entry.title,
    category: overlay.category,
    oneLiner: overlay.oneLiner ?? entry.summary,
    role: overlay.role ?? entry.role,
    companyOrProject: overlay.companyOrProject ?? entry.company,
    timeframe: overlay.timeframe ?? entry.timeframe,
    problem: overlay.problem ?? entry.problem.join(" "),
    actions,
    outcomes,
    metrics,
    tools: overlay.tools,
    leadershipSignals: overlay.leadershipSignals,
    artifacts,
    relatedProjectSlugs: overlay.relatedProjectSlugs,
    tags: overlay.tags ?? entry.tags,
    interestTags: overlay.interestTags,
    roleLens: overlay.roleLens,
    domains: overlay.domains,
    strengths: overlay.strengths,
    senioritySignals: overlay.senioritySignals,
    projectType: overlay.projectType ?? "case-study",
    evidenceHighlights:
      overlay.evidenceHighlights ??
      buildFallbackEvidenceHighlights({
        metrics,
        outcomes,
        actions,
        artifacts,
      }),
    claimBoundaries: overlay.claimBoundaries,
    recruiterPrompts: overlay.recruiterPrompts,
    crossPageLinks: overlay.crossPageLinks,
    authoredSections: overlay.authoredSections ?? buildWorkAuthoredSections(entry),
  };
}

function productEntryToPageContext(slug: string): PageContext | null {
  const entry = productEntries.find((candidate) => candidate.slug === slug);
  if (!entry) {
    return null;
  }

  const overlay = portfolioGuideMetadata[slug] ?? {};

  const outcomes = overlay.outcomes ??
    uniqueStrings([
      ...entry.featuredMetrics.map(metricToString),
      ...entry.learnings,
    ]).slice(0, 6);
  const actions =
    overlay.actions ??
    entry.productExperience.map(
      (step) => `${step.title}: ${step.description}`,
    );
  const metrics = overlay.metrics ?? entry.featuredMetrics.map(metricToString);
  const artifacts = overlay.artifacts ?? entry.visuals.map(visualToArtifact).slice(0, 3);

  return {
    slug: entry.slug,
    href: entry.href,
    title: entry.title,
    category: overlay.category,
    oneLiner: overlay.oneLiner ?? entry.summary,
    role: overlay.role,
    companyOrProject: overlay.companyOrProject ?? entry.title,
    timeframe: overlay.timeframe ?? entry.status,
    problem: overlay.problem ?? entry.problem.join(" "),
    actions,
    outcomes,
    metrics,
    tools: overlay.tools,
    leadershipSignals: overlay.leadershipSignals,
    artifacts,
    relatedProjectSlugs: overlay.relatedProjectSlugs,
    tags: overlay.tags ?? entry.tags,
    interestTags: overlay.interestTags,
    roleLens: overlay.roleLens,
    domains: overlay.domains,
    strengths: overlay.strengths,
    senioritySignals: overlay.senioritySignals,
    projectType: overlay.projectType ?? "product",
    evidenceHighlights:
      overlay.evidenceHighlights ??
      buildFallbackEvidenceHighlights({
        metrics,
        outcomes,
        actions,
        artifacts,
      }),
    claimBoundaries: overlay.claimBoundaries,
    recruiterPrompts: overlay.recruiterPrompts,
    crossPageLinks: overlay.crossPageLinks,
    authoredSections:
      overlay.authoredSections ?? buildProductAuthoredSections(entry),
  };
}

function legacyCaseToPageContext(slug: string): PageContext | null {
  const caseEntry = cases.find((candidate) => candidate.slug === slug);
  const measuredEntry = CASE_STUDIES.find((candidate) => candidate.slug === slug);
  const overlay = portfolioGuideMetadata[slug];

  if (!caseEntry && !measuredEntry && !overlay) {
    return null;
  }

  const metrics =
    overlay?.metrics ??
    uniqueStrings([
      ...(caseEntry?.kpis?.map(metricToString) ?? []),
      ...(measuredEntry?.headlineMetrics?.map(metricToString) ?? []),
      ...(measuredEntry?.measuredMetrics?.map(metricToString) ?? []),
    ]);

  return {
    slug,
    href: caseEntry?.href ?? measuredEntry?.href ?? `/case-studies/${slug}`,
    title:
      caseEntry?.title ??
      measuredEntry?.title ??
      overlay?.oneLiner ??
      "Project detail",
    category: overlay?.category,
    oneLiner: overlay?.oneLiner ?? caseEntry?.summary ?? measuredEntry?.summary,
    role: overlay?.role,
    companyOrProject: overlay?.companyOrProject,
    timeframe: overlay?.timeframe,
    problem: overlay?.problem,
    actions: overlay?.actions,
    outcomes: overlay?.outcomes,
    metrics,
    tools: overlay?.tools,
    leadershipSignals: overlay?.leadershipSignals,
    artifacts: overlay?.artifacts,
    relatedProjectSlugs: overlay?.relatedProjectSlugs,
    tags: overlay?.tags ?? caseEntry?.tags,
    interestTags: overlay?.interestTags,
    roleLens: overlay?.roleLens ?? caseEntry?.roleLens,
    domains: overlay?.domains,
    strengths: overlay?.strengths,
    senioritySignals: overlay?.senioritySignals,
    projectType: overlay?.projectType ?? "enablement",
    evidenceHighlights:
      overlay?.evidenceHighlights ??
      buildFallbackEvidenceHighlights({
        metrics,
        outcomes: overlay?.outcomes,
        actions: overlay?.actions,
        artifacts: overlay?.artifacts,
      }),
    claimBoundaries: overlay?.claimBoundaries,
    recruiterPrompts: overlay?.recruiterPrompts,
    crossPageLinks: overlay?.crossPageLinks,
    authoredSections:
      overlay?.authoredSections ?? buildLegacyCaseAuthoredSections(slug),
  };
}

function thinkingEntryToPageContext(slug: string): PageContext | null {
  const entry = thinkingEntries.find((candidate) => candidate.slug === slug);
  if (!entry) {
    return null;
  }

  const overlay = portfolioGuideMetadata[slug] ?? {};
  const actions = overlay.actions;
  const outcomes = overlay.outcomes;
  const metrics = overlay.metrics;
  const artifacts = overlay.artifacts;

  return {
    slug: entry.slug,
    href: entry.href,
    title: entry.title,
    category: overlay.category,
    oneLiner: overlay.oneLiner ?? entry.summary,
    role: overlay.role,
    companyOrProject: overlay.companyOrProject ?? entry.title,
    timeframe: overlay.timeframe ?? entry.readTime,
    problem: overlay.problem ?? entry.description,
    actions,
    outcomes,
    metrics,
    tools: overlay.tools,
    leadershipSignals: overlay.leadershipSignals,
    artifacts,
    relatedProjectSlugs: overlay.relatedProjectSlugs,
    tags: overlay.tags ?? entry.tags,
    interestTags: overlay.interestTags,
    roleLens: overlay.roleLens,
    domains: overlay.domains,
    strengths: overlay.strengths,
    senioritySignals: overlay.senioritySignals,
    projectType: overlay.projectType ?? "essay",
    evidenceHighlights:
      overlay.evidenceHighlights ??
      buildFallbackEvidenceHighlights({
        metrics,
        outcomes,
        actions,
        artifacts,
      }),
    claimBoundaries: overlay.claimBoundaries,
    recruiterPrompts: overlay.recruiterPrompts,
    crossPageLinks: overlay.crossPageLinks,
    authoredSections:
      overlay.authoredSections ?? buildThinkingAuthoredSections(entry),
  };
}

export function getCanonicalProjects(): CanonicalProject[] {
  return [...CANONICAL_PROJECTS];
}

export function getCanonicalProjectBySlug(slug: string): CanonicalProject | null {
  return CANONICAL_PROJECTS.find((project) => project.slug === slug) ?? null;
}

export function getPageContextBySlug(slug: string): PageContext | null {
  const project = getCanonicalProjectBySlug(slug);
  if (!project) {
    return null;
  }

  switch (project.source) {
    case "work":
      return workEntryToPageContext(slug);
    case "product":
      return productEntryToPageContext(slug);
    case "legacy-case":
      return legacyCaseToPageContext(slug);
    case "thinking":
      return thinkingEntryToPageContext(slug);
    default:
      return null;
  }
}

export function getPageContextByPath(pathname: string): PageContext | null {
  const normalizedPathname = normalizePathname(pathname);
  const project =
    CANONICAL_PROJECTS.find((candidate) => candidate.href === normalizedPathname) ??
    null;

  if (!project) {
    return null;
  }

  return getPageContextBySlug(project.slug);
}

export function getAllCanonicalPageContexts(): PageContext[] {
  return CANONICAL_PROJECTS.map((project) => getPageContextBySlug(project.slug)).filter(
    (pageContext): pageContext is PageContext => Boolean(pageContext),
  );
}

export function getPortfolioContext(): PortfolioContext {
  const featuredSlugs = uniqueStrings([
    ...homeContent.featuredWork,
    ...homeContent.featuredProducts,
    ...homeContent.featuredThinking,
  ]).filter((slug) => Boolean(getCanonicalProjectBySlug(slug)));

  return {
    portfolioSubject: {
      name: siteConfig.name,
      shortName: siteConfig.name.split(" ")[0] ?? siteConfig.name,
      authoredInFirstPerson: true,
    },
    bioSummary: aboutContent.summary,
    positioning: NARRATIVES.map((narrative) => narrative.positioning),
    strengths: aboutContent.principles,
    careerThemes: homeContent.positioning.categories.map(
      (category) => `${category.title}: ${category.description}`,
    ),
    skillMap: {
      [homeContent.positioning.categories[0].title]: [
        "chatgpt-enterprise",
        "ai-platform-mcp",
      ],
      [homeContent.positioning.categories[1].title]: [
        "checkout-redesign",
        "jira-product-discovery",
      ],
      [homeContent.positioning.categories[2].title]: [
        "launchmuse",
        "immunology-scout",
        "oms-chatgpt-app",
      ],
    },
    featuredProjects: featuredSlugs
      .map((slug) => getPageContextBySlug(slug))
      .filter((pageContext): pageContext is PageContext => Boolean(pageContext))
      .map((pageContext) => ({
        slug: pageContext.slug,
        title: pageContext.title,
        href: pageContext.href,
        whyItMatters: pageContext.oneLiner,
      })),
    pageDirectory: getAllCanonicalPageContexts().map((pageContext) => ({
      slug: pageContext.slug,
      title: pageContext.title,
      href: pageContext.href,
      category: pageContext.category,
      oneLiner: pageContext.oneLiner,
      evidenceHighlights: pageContext.evidenceHighlights?.map(
        (highlight) => `${highlight.label}: ${highlight.detail}`,
      ),
      interestTags: pageContext.interestTags,
    })),
  };
}
