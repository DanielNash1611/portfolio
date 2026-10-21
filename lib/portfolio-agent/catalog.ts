// Server-owned authored content. Import only the public projection into client components.
import {
  aboutContent,
  homeContent,
  resumeVariants,
  workEntries,
  productEntries,
  thinkingEntries,
  creativeEntries,
} from "@/content/portfolio";
import { systemChapters } from "@/content/product-system";
import { CASE_STUDIES } from "@/data/caseStudies";
import {
  getAllCanonicalPageContexts,
  getPageContextBySlug,
  getPortfolioContext,
} from "@/lib/portfolio-guide/context";
import type {
  PageContext,
  PortfolioContext,
} from "@/lib/portfolio-guide/types";
import type { PublicSurface, PublicPageEvidence } from "./types";

const collections = [
  ["home", "/", "Portfolio overview", homeContent.hero.description],
  [
    "work",
    "/work",
    "Work",
    "Enterprise adoption, platform strategy, and customer experience—each tied to concrete decisions and observed outcomes.",
  ],
  [
    "products",
    "/products",
    "Products",
    "Working products make the tradeoffs visible. They create a place to test the workflow, the trust model, and the experience rather than stopping at a strategy deck.",
  ],
  [
    "thinking",
    "/thinking",
    "Thinking",
    "The strongest systems improve the numbers and the experience of doing the work. My essays make the operating principles behind that belief explicit.",
  ],
  [
    "creative",
    "/creative",
    "Creative work",
    "These projects show systems thinking through music, game mechanics, listener perspective, and live human choice.",
  ],
  [
    "case-studies",
    "/case-studies",
    "Case studies",
    "Selected product case studies.",
  ],
] as const;

function sitePage(
  slug: string,
  href: string,
  title: string,
  summary: string,
  sections: PageContext["authoredSections"] = [],
): PageContext {
  return {
    slug: `site-${slug}`,
    href,
    title,
    oneLiner: summary,
    authoredSections: [{ label: "Overview", snippets: [summary] }, ...sections],
    claimBoundaries: {
      explicitUnknowns: [
        "Page descriptions do not establish project outcomes or sole implementation ownership.",
      ],
    },
  };
}

function siteContexts(): PageContext[] {
  return [
    ...collections.map(([slug, href, title, summary]) =>
      sitePage(slug, href, title, summary, [
        {
          label: "Published pages",
          snippets: (slug === "work"
            ? workEntries
            : slug === "products"
              ? productEntries
              : slug === "thinking"
                ? thinkingEntries
                : slug === "creative"
                  ? creativeEntries
                  : slug === "case-studies"
                    ? CASE_STUDIES
                    : [
                        ...workEntries,
                        ...productEntries,
                        ...creativeEntries,
                        ...thinkingEntries,
                      ].filter((entry) =>
                        [
                          ...homeContent.featuredWork,
                          ...homeContent.featuredProducts,
                          ...homeContent.featuredThinking,
                          "jumping-on-coals",
                          "tabletop-symphony",
                          "gravity-astra",
                        ].includes(entry.slug),
                      )
          ).map((entry) => `${entry.title}: ${entry.summary}`),
        },
      ]),
    ),
    sitePage("about", "/about", "About Daniel", aboutContent.summary, [
      { label: "About", snippets: aboutContent.paragraphs },
    ]),
    sitePage(
      "resume",
      "/resume",
      "Resume",
      "Choose a resume for the role you are evaluating.",
      [
        {
          label: "Resume options",
          snippets: resumeVariants.map(
            (variant) =>
              `${variant.title}: ${variant.subtitle}. ${variant.bestFor}`,
          ),
        },
      ],
    ),
    sitePage(
      "resume-generate",
      "/resume/generate",
      "Tailored resume",
      "Generate a resume using a role or job description, then review the result. The portfolio assistant does not generate or email resumes itself.",
    ),
    sitePage(
      "contact",
      "/contact",
      "Contact Daniel",
      "Share a few details about the role, team, or project through the protected contact form. The visitor reviews and submits the form.",
    ),
    sitePage(
      "method",
      "/product-system",
      "Product system",
      "A shared language for deciding what to explore, what to build, and what to change.",
      systemChapters.map((chapter) => ({
        label: chapter.title,
        snippets: [chapter.summary, chapter.principle],
      })),
    ),
    ...systemChapters.map((chapter) =>
      sitePage(
        `method-${chapter.slug}`,
        `/product-system/${chapter.slug}`,
        chapter.title,
        chapter.summary,
        chapter.sections.map((section) => ({
          label: section.title,
          snippets: [section.body, ...(section.items ?? [])],
        })),
      ),
    ),
    sitePage(
      "sound-seeker",
      "/sound-seeker",
      "Sound Seeker",
      "A live instrument-discovery demo. The assistant can explain its public portfolio context, but cannot operate the demo.",
    ),
  ];
}

export function getGuideSurfaceContext(slug: string): PageContext | null {
  const canonical = getPageContextBySlug(slug);
  if (canonical) return canonical;
  const site = siteContexts().find((page) => page.slug === slug);
  if (site) return site;
  const legacy = CASE_STUDIES.find((page) => `case-${page.slug}` === slug);
  return legacy
    ? {
        slug,
        href: `/case-studies/${legacy.slug}`,
        title: legacy.title,
        oneLiner: legacy.summary,
        authoredSections: [
          {
            label: "Published case study",
            snippets: [
              legacy.summary,
              (legacy.body ?? "")
                .replace(/<[^>]*>/g, "")
                .replace(/^#+\s*/gm, ""),
            ],
          },
        ],
      }
    : null;
}

const aliases: Record<string, string[]> = {
  "checkout-redesign": [
    "checkout",
    "checkout redesign",
    "/work/oms-transformation",
  ],
  "chatgpt-enterprise": [
    "chatgpt enterprise",
    "enterprise ai",
    "/products/chatgpt-contact-center",
  ],
  "ai-platform-mcp": [
    "ai platform",
    "platform foundations",
    "/products/chatgpt-org-scale",
  ],
  "gravity-astra": ["gravity astra", "gravity x astra"],
  "site-home": ["home", "homepage"],
  "site-about": ["about"],
  "site-method": ["method", "product system"],
  "site-contact": ["contact"],
  "site-resume": ["resume"],
  "site-resume-generate": ["resume generator", "tailored resume"],
};

export function getPublicSurfaceCatalog(): PublicSurface[] {
  const canonical = getAllCanonicalPageContexts();
  const legacy = CASE_STUDIES.filter(
    (page) =>
      !canonical.some((entry) => entry.href === `/case-studies/${page.slug}`),
  ).flatMap((page) => getGuideSurfaceContext(`case-${page.slug}`) ?? []);
  return [...canonical, ...siteContexts(), ...legacy].map((page) => ({
    slug: page.slug,
    href: page.href,
    title: page.title,
    oneLiner: page.oneLiner,
    category: page.category,
    tags: page.tags,
    featured: [
      ...homeContent.featuredWork,
      ...homeContent.featuredProducts,
      ...homeContent.featuredThinking,
    ].includes(page.slug),
    projectType: page.projectType,
    interestTags: page.interestTags,
    roleLens: page.roleLens,
    domains: page.domains,
    strengths: page.strengths,
    senioritySignals: page.senioritySignals,
    evidenceHighlights: page.evidenceHighlights?.slice(0, 2),
    recruiterPrompts: page.recruiterPrompts,
    kind: (collections.some(([, href]) => href === page.href)
      ? "collection"
      : page.slug === "site-about"
        ? "profile"
        : page.href.startsWith("/product-system")
          ? "method"
          : page.slug.startsWith("site-")
            ? "utility"
            : "detail") as PublicSurface["kind"],
    aliases: aliases[page.slug] ?? [
      page.title,
      page.slug.replace(/^site-/, "").replaceAll("-", " "),
    ],
  }));
}

export function getPublicPageEvidence(slug: string): PublicPageEvidence | null {
  const page = getGuideSurfaceContext(slug);
  if (!page) return null;
  return {
    slug: page.slug,
    title: page.title,
    source: {
      kind: "portfolio_authored",
      url: `https://www.danielnash.co${page.href}`,
    },
    summary: page.oneLiner,
    highlights: (page.evidenceHighlights ?? []).slice(0, 8),
    sections: (page.authoredSections ?? []).slice(0, 12).map((section) => ({
      label: section.label,
      snippets: section.snippets
        .slice(0, 6)
        .map((snippet) => snippet.slice(0, 1600)),
    })),
    claimBoundaries: page.claimBoundaries ?? {},
  };
}

export function getGuidePortfolioContext(): PortfolioContext {
  const base = getPortfolioContext();
  return {
    ...base,
    pageDirectory: getPublicSurfaceCatalog().map((page) => ({
      slug: page.slug,
      href: page.href,
      title: page.title,
      category: page.category,
      oneLiner: page.oneLiner,
      interestTags: page.interestTags,
      evidenceHighlights: page.evidenceHighlights?.map(
        (highlight) => `${highlight.label}: ${highlight.detail}`,
      ),
    })),
  };
}
