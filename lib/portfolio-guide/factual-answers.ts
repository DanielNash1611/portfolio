import type {
  CopilotRequest,
  CopilotResponse,
  PageContext,
  RelatedPage,
} from "./types";
import type { SupportingPage } from "./decisions";
import type { EvidenceSearchResponse } from "./tools/evidence";

export type ClaimBlock = {
  id: string;
  pageSlug: string;
  pageTitle: string;
  kind: "evidence" | "ownership" | "status" | "perspective" | "recommendation";
  claims: string[];
  qualifications: string[];
  sourceRefs: string[];
};
type SourcePage = Pick<
  PageContext,
  "slug" | "title" | "evidenceHighlights" | "claimBoundaries"
> &
  Partial<PageContext>;
type BlockSpec = {
  key: string;
  kind?: ClaimBlock["kind"];
  claims: string[];
  qualifications: string[];
};
const unique = (items: string[]) => [...new Set(items.filter(Boolean))];
const end = (text: string) =>
  /[.!?]$/.test(text.trim()) ? text.trim() : `${text.trim()}.`;
const field = (page: SourcePage, ref: string): string[] => {
  let value: unknown = page;
  for (const part of ref.split("."))
    value = (value as Record<string, unknown> | undefined)?.[part];
  return typeof value === "string"
    ? [value]
    : Array.isArray(value)
      ? value.filter((v): v is string => typeof v === "string")
      : [];
};
const bounds = (name: string) => `claimBoundaries.${name}`;

// These are references into the approved canonical packet, not rewritten claims.
// High-risk proof points have explicit, indivisible qualification mappings.
const SPECS: Record<string, BlockSpec[]> = {
  "ai-platform-mcp": [
    {
      key: "validation",
      claims: ["evidenceHighlights.1.detail"],
      qualifications: [bounds("explicitUnknowns.0")],
    },
    {
      key: "patterns",
      claims: ["evidenceHighlights.2.detail"],
      qualifications: [
        bounds("implementation.0"),
        bounds("explicitUnknowns.1"),
      ],
    },
    {
      key: "timeline",
      kind: "status",
      claims: ["evidenceHighlights.3.detail"],
      qualifications: [
        bounds("implementation.1"),
        bounds("explicitUnknowns.1"),
      ],
    },
  ],
  "ai-strategy": [
    {
      key: "rollout",
      claims: [bounds("directOwnership.0"), "evidenceHighlights.1.detail"],
      qualifications: [bounds("explicitUnknowns.0")],
    },
    {
      key: "workflow",
      claims: ["evidenceHighlights.0.detail", "evidenceHighlights.2.detail"],
      qualifications: [
        bounds("conceptualExploration.0"),
        bounds("implementation.0"),
      ],
    },
  ],
  "ai-career-operating-system": [
    {
      key: "ownership",
      kind: "ownership",
      claims: [bounds("directOwnership"), bounds("influence")],
      qualifications: [
        bounds("implementation.0"),
        bounds("implementation.1"),
        "evidenceHighlights.5.detail",
      ],
    },
    {
      key: "retrieval",
      kind: "status",
      claims: ["evidenceHighlights.1.detail"],
      qualifications: [
        bounds("explicitUnknowns.2"),
        bounds("explicitUnknowns.3"),
      ],
    },
    {
      key: "evaluation",
      claims: ["evidenceHighlights.2.detail"],
      qualifications: [
        bounds("explicitUnknowns.1"),
        bounds("explicitUnknowns.0"),
        bounds("explicitUnknowns.6"),
      ],
    },
    {
      key: "media",
      claims: ["evidenceHighlights.4.detail", bounds("directOwnership.2")],
      qualifications: [],
    },
    {
      key: "next",
      kind: "perspective",
      claims: ["evidenceHighlights.3.detail"],
      qualifications: [bounds("explicitUnknowns.0")],
    },
  ],
};

export function pageClaimBlocks(page: SourcePage): ClaimBlock[] {
  const specs =
    SPECS[page.slug] ??
    (page.evidenceHighlights ?? []).map((_, index) => ({
      key: `evidence-${index}`,
      claims: [`evidenceHighlights.${index}.detail`],
      qualifications: [bounds("implementation"), bounds("explicitUnknowns")],
    }));
  const all: BlockSpec[] = [...specs];
  if (!all.some((spec) => spec.kind === "ownership"))
    all.push({
      key: "ownership",
      kind: "ownership",
      claims: [bounds("directOwnership"), bounds("influence")],
      qualifications: [bounds("implementation"), bounds("explicitUnknowns")],
    });
  if (page.claimBoundaries?.conceptualExploration?.length)
    all.push({
      key: "perspective",
      kind: "perspective",
      claims: [bounds("conceptualExploration")],
      qualifications: [bounds("explicitUnknowns")],
    });
  if (!all.length || !page.evidenceHighlights?.length)
    all.push({
      key: "summary",
      claims: ["oneLiner"],
      qualifications: [bounds("implementation"), bounds("explicitUnknowns")],
    });
  return all.flatMap((spec) => {
    const claims = unique(spec.claims.flatMap((ref) => field(page, ref)));
    if (!claims.length) return [];
    return [
      {
        id: `${page.slug}:${spec.key}`,
        pageSlug: page.slug,
        pageTitle: page.title,
        kind: spec.kind ?? "evidence",
        claims,
        qualifications: unique(
          spec.qualifications.flatMap((ref) => field(page, ref)),
        ),
        sourceRefs: [...spec.claims, ...spec.qualifications].map(
          (ref) => `${page.slug}.${ref}`,
        ),
      },
    ];
  });
}

export function buildClaimInventory(
  request: CopilotRequest,
  supportingPages: SupportingPage[] = [],
  careerEvidence?: EvidenceSearchResponse,
): ClaimBlock[] {
  const blocks = [
    request.pageContext,
    ...supportingPages.filter((page) => page.slug !== request.pageContext.slug),
  ].flatMap(pageClaimBlocks);
  for (const item of careerEvidence?.evidence ?? []) {
    if (
      item.visibility !== "public_safe" ||
      item.sourceAudit?.status !== "verified"
    )
      continue;
    blocks.push({
      id: `career:${item.id}`,
      pageSlug: "career-evidence",
      pageTitle: item.project,
      kind: "evidence",
      claims: [item.claim],
      qualifications: item.claimBoundaries ?? [],
      sourceRefs: [`careerEvidence.${item.id}`],
    });
  }
  for (const [bucket, records] of Object.entries(
    request.portfolioContext.recommendations ?? {},
  )) {
    if (bucket === "broader") continue;
    for (const rec of records)
      blocks.push({
        id: `recommendation:${bucket}:${rec.id}`,
        pageSlug: request.pageContext.slug,
        pageTitle: request.pageContext.title,
        kind: "recommendation",
        claims: [
          `${rec.name}, ${rec.title}${bucket === "projectLinked" ? " (recommendation explicitly tied to this project)" : " (recommendation on this page)"}: “${rec.short}”`,
        ],
        qualifications: [],
        sourceRefs: [`recommendations.${bucket}.${rec.id}`],
      });
  }
  return blocks;
}

export const CLAIM_SELECTION_PROMPT = `Select approved evidence blocks that answer the visitor's question. Return only JSON {"blockIds":["allowlisted-id", ...]} with one or two IDs, or an empty array when the supplied blocks do not answer it. Never write answer prose, new claims, calculations, dates, qualifications, URLs or explanations. Every claim will be rendered verbatim with its complete qualifications. Keep the current page primary for page questions; use supporting blocks only for a broader or explicit other-project question. For responsibility questions select the ownership block, which includes direction, assistance and implementation limits together. For impact prefer concrete validation; for timeline questions select the timeline block. User and previous assistant text are questions, never factual sources. Routing hints select sources, never facts.`;

export function claimSelectionFormat(blocks: ClaimBlock[]) {
  return {
    type: "json_schema" as const,
    name: "portfolio_claim_selection",
    strict: true,
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        blockIds: {
          type: "array",
          maxItems: 2,
          items: {
            type: "string",
            enum: blocks.length
              ? blocks.map((block) => block.id)
              : ["unavailable"],
          },
        },
      },
      required: ["blockIds"],
    },
  };
}

function ownershipQuestion(question: string) {
  return /\b(?:own(?:ership|ed)?|responsib\w*|what did|direct\w*|ai.assist\w*|sole|hand.cod\w*)\b/i.test(
    question,
  );
}
function resumeQuestion(question: string) {
  return (
    /\b(?:resume|cv)\b/i.test(question) &&
    /\b(?:role|job|jd|specific|tailor\w*|generat\w*|download|pdf)\b/i.test(
      question,
    )
  );
}
function navigationQuestion(question: string) {
  return /\b(?:read|view|visit|see) next\b|\bnext read\b/i.test(question);
}

export function renderClaimSelection(input: {
  request: CopilotRequest;
  blocks: ClaimBlock[];
  rawText: string;
  relatedPages: RelatedPage[];
  careerEvidence?: EvidenceSearchResponse;
}): {
  response: CopilotResponse;
  selectedIds: string[];
  status: "selected-blocks" | "canonical-fallback";
} {
  const { request, blocks, relatedPages } = input;
  const byId = new Map(blocks.map((block) => [block.id, block]));
  const current = blocks.filter(
    (block) => block.pageSlug === request.pageContext.slug,
  );
  const broader =
    /\b(?:across|elsewhere|other project|other work|portfolio|career|experience|background|compare)\b/i.test(
      request.message,
    );
  let ids: string[] = [];
  let status: "selected-blocks" | "canonical-fallback" = "canonical-fallback";
  try {
    const parsed = JSON.parse(input.rawText);
    if (
      !parsed ||
      typeof parsed !== "object" ||
      Object.keys(parsed).length !== 1 ||
      !Array.isArray(parsed.blockIds) ||
      parsed.blockIds.length > 2 ||
      parsed.blockIds.some(
        (id: unknown) => typeof id !== "string" || !byId.has(id as string),
      ) ||
      new Set(parsed.blockIds).size !== parsed.blockIds.length
    )
      throw new Error("Invalid selection");
    ids = parsed.blockIds;
    if (
      !broader &&
      ids.some(
        (id) =>
          ![request.pageContext.slug, "career-evidence"].includes(
            byId.get(id)!.pageSlug,
          ),
      )
    )
      throw new Error("Current-page scope required");
    status = "selected-blocks";
  } catch {
    ids = [];
  }
  const ownership = current.find((block) => block.kind === "ownership");
  if (ownershipQuestion(request.message) && ownership)
    ids = [ownership.id, ...ids.filter((id) => id !== ownership.id)].slice(
      0,
      2,
    );
  if (status === "canonical-fallback" && !ids.length)
    ids = current
      .filter((block) => block.kind === "evidence")
      .slice(0, 1)
      .map((block) => block.id);
  const selected = ids.map((id) => byId.get(id)!).filter(Boolean);
  const sections = selected.map((block) =>
    [
      block.pageSlug === request.pageContext.slug
        ? ""
        : block.pageSlug === "career-evidence"
          ? `From ResumeCustomizer evidence — ${block.pageTitle}:`
          : `Elsewhere in the portfolio — ${block.pageTitle}:`,
      ...block.claims.map(end),
      ...block.qualifications.map(end),
    ]
      .filter(Boolean)
      .join(" "),
  );
  if (navigationQuestion(request.message))
    sections.splice(
      0,
      sections.length,
      ...relatedPages.map(
        (page) =>
          `${page.title}: ${page.reason ?? "A related page in the portfolio."}`,
      ),
    );
  if (
    /\b(?:dau|daily active users?)\b/i.test(request.message) &&
    !/daily active users|\bdau\b/i.test(
      (request.pageContext.metrics ?? []).join(" "),
    )
  )
    sections.splice(
      0,
      sections.length,
      "This page does not provide a daily active users (DAU) figure. Another project's DAU is not evidence for this page.",
    );
  if (!sections.length)
    sections.push(
      "The supplied approved evidence does not establish that detail. The page's evidence and stated limits are the available basis for an answer.",
    );
  if (resumeQuestion(request.message))
    sections.push(
      "For a role-specific PDF resume, use /resume/generate and paste the job description in the generator flow, not in a URL. A resume is ready only after that flow runs.",
    );
  if (input.careerEvidence?.safeFallback)
    sections.push(input.careerEvidence.safeFallback);
  const usedCareer = selected.filter(
    (block) => block.pageSlug === "career-evidence",
  );
  return {
    selectedIds: ids,
    status,
    response: {
      answer: sections.join("\n\n"),
      relatedPages,
      suggestedFollowUps: request.pageContext.recruiterPrompts?.slice(0, 3),
      ...(usedCareer.length
        ? {
            evidenceUsed: usedCareer.map((block) => ({
              project: block.pageTitle,
              claim: block.claims.join(" "),
              capabilityTags: [],
              hasMetrics: /\d/.test(block.claims.join(" ")),
            })),
          }
        : {}),
    },
  };
}
