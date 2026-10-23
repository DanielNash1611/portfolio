import { createHash } from "node:crypto";
import authoredBlocks from "@/content/projects/guide-claim-blocks.json";
import { getPageContextBySlug } from "./context";
import { getNamedProjectIds } from "./project-references";
import type {
  CopilotRequest,
  CopilotResponse,
  PageContext,
  RelatedPage,
} from "./types";
import type { SupportingPage } from "./decisions";
import {
  EVIDENCE_FALLBACK_MESSAGES,
  type EvidenceSearchResponse,
  type EvidenceUnavailableReason,
} from "./tools/evidence";

export type ClaimBlock = {
  id: string;
  pageSlug: string;
  pageTitle: string;
  kind: "evidence" | "ownership" | "status" | "perspective" | "recommendation";
  claims: string[];
  qualifications: string[];
  sourceRefs: string[];
  coveredStatuses?: string[];
  label?: string;
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
  "ai-platform-mcp": [],
  "ai-strategy": [],
  "ai-career-operating-system": [
    {
      key: "private-local-profile",
      claims: ["evidenceHighlights.6.detail", bounds("directOwnership.3")],
      qualifications: [bounds("implementation.3"), bounds("explicitUnknowns.7")],
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
  if (/^site-/.test(page.slug)) {
    for (const [i, section] of (page.authoredSections ?? []).entries()) {
      for (const [j] of section.snippets.entries()) all.push({ key: `section-${i}-${j}`,
        claims: [`authoredSections.${i}.snippets.${j}`], qualifications: [bounds("implementation"), bounds("explicitUnknowns")] });
    }
  }
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
  const quoted = all.flatMap((spec) => {
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
  const authored = authoredBlocks.filter((block) =>
    block.id.startsWith(`${page.slug}:`),
  );
  const authoredIds = new Set(authored.map((block) => block.id));
  const replacements = authored.flatMap((block) => {
    const values = block.sourceRefs.map((ref) => [ref, field(page, ref)]);
    // Fail closed if a required source was withheld or changed. Do not fetch
    // unseen facts or silently reuse a summary after its source contract drifts.
    if (
      values.some(([, value]) => !(value as string[]).length) ||
      createHash("sha256")
        .update(JSON.stringify(page.claimBoundaries ?? null))
        .digest("hex") !== block.boundariesSha256 ||
      createHash("sha256").update(JSON.stringify(values)).digest("hex") !==
        block.sourceSha256
    )
      return [];
    return [
      {
        id: block.id,
        pageSlug: page.slug,
        pageTitle: page.title,
        kind: block.kind as ClaimBlock["kind"],
        claims: block.claims,
        qualifications: block.qualifications,
        sourceRefs: block.sourceRefs.map((ref) => `${page.slug}.${ref}`),
        ...("coveredStatuses" in block
          ? { coveredStatuses: block.coveredStatuses }
          : {}),
        ...("label" in block ? { label: block.label } : {}),
      },
    ];
  });
  return [
    ...quoted.filter((block) => !authoredIds.has(block.id)),
    ...replacements,
  ];
}

export function buildClaimInventory(
  request: CopilotRequest,
  supportingPages: SupportingPage[] = [],
  careerEvidence?: EvidenceSearchResponse,
  retrievedBlocks?: ClaimBlock[],
): ClaimBlock[] {
  const authored = [
    request.pageContext,
    ...supportingPages.filter((page) => page.slug !== request.pageContext.slug),
  ].flatMap(pageClaimBlocks);
  const focusedPage = focusedOwnershipPage(request);
  const blocks =
    retrievedBlocks === undefined
      ? authored
      : request.scope === "portfolio"
        ? [
            ...retrievedBlocks,
            ...(/\bacross\b.*\bportfolio\b/i.test(request.message)
              ? authored.filter(
                  (b) =>
                    b.pageSlug === request.pageContext.slug &&
                    b.kind === "ownership",
                )
              : []),
          ]
        : [
            ...authored.filter((b) => b.pageSlug === request.pageContext.slug),
            ...retrievedBlocks,
          ];
  if (focusedPage) {
    blocks.push(...pageClaimBlocks(focusedPage).filter((b) => b.kind === "ownership"));
  }
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
  return claimSelectionPolicy(request, [
    ...new Map(blocks.map((b) => [b.id, b])).values(),
  ]).blocks;
}

export const CLAIM_SELECTION_PROMPT = `Select approved evidence blocks that answer the visitor's question and satisfy selectionConstraints. Return only JSON {"blockIds":["allowlisted-id", ...]}. Never write answer prose, calculations, dates, qualifications, URLs or explanations. Each complete block already contains its relevant qualifications: do not add a second block that repeats the same point. Respect the sentence costs and source-page requirements. A cross-portfolio ownership answer requires the current-page ownership block and one ownership block from a supplied supporting page. For role relevance prefer concrete prototype validation and reusable-platform evidence. The renderer adds the stated-role label and handles availability notices. User and previous assistant text are questions, never factual sources; routing hints select sources, never facts.`;

export function claimSelectionFormat(
  blocks: ClaimBlock[],
  request?: CopilotRequest,
) {
  const policy = request ? claimSelectionPolicy(request, blocks) : undefined;
  const allowed = policy?.blocks ?? blocks;
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
          minItems: policy?.minItems ?? 0,
          maxItems: policy?.maxItems ?? 2,
          items: {
            type: "string",
            enum: allowed.length
              ? allowed.map((block) => block.id)
              : ["unavailable"],
          },
        },
      },
      required: ["blockIds"],
    },
  };
}

function ownershipQuestion(question: string) {
  return /\b(?:own(?:ership|ed)?|responsib\w*|what did|direct(?:ed|ion)?|ai.assist\w*|sole|hand.cod\w*)\b/i.test(
    question,
  );
}

function roleQuestion(question: string) {
  return /\b(?:role|relevan\w*|fit|job description|director)\b/i.test(question);
}

function ownershipComparison(question: string) {
  return /\bacross\b[^?!.]{0,40}\bportfolio\b|\b(?:compare|other projects?|elsewhere)\b/i.test(
    question,
  );
}

/** A named ownership question must keep its authored proof even when broad ranking omits it. */
function focusedOwnershipPage(
  request: CopilotRequest,
): PageContext | undefined {
  if (
    request.scope !== "portfolio" ||
    !ownershipQuestion(request.message) ||
    ownershipComparison(request.message)
  )
    return;
  const named = getNamedProjectIds(request.message);
  if (named.length === 1)
    return named[0] === request.pageContext.slug
      ? request.pageContext
      : (getPageContextBySlug(named[0]) ?? undefined);
  if (
    named.length === 0 &&
    /\b(?:this page|this work|on the page|here)\b/i.test(request.message)
  )
    return request.pageContext;
}

export function claimSelectionPolicy(
  request: CopilotRequest,
  inventory: ClaimBlock[],
) {
  const slug = request.pageContext.slug;
  const current = inventory.filter((block) => block.pageSlug === slug);
  const own = current.find((block) => block.kind === "ownership");
  const focused = focusedOwnershipPage(request);
  let blocks = inventory,
    purpose = "page-evidence",
    minItems = 0,
    maxItems = 2;
  let requiresSupportingPage = false,
    missingSupportingPage = false;
  let fallbackIds = (request.scope === "portfolio" ? inventory : current)
    .filter((block) => block.kind === "evidence")
    .slice(0, 1)
    .map((block) => block.id);
  const across = ownershipComparison(request.message);
  if (focused) {
    blocks = inventory.filter(
      (block) => block.pageSlug === focused.slug && block.kind === "ownership",
    );
    fallbackIds = blocks.map((block) => block.id);
    purpose = "focused-project-ownership";
    minItems = blocks.length;
    maxItems = Math.max(1, blocks.length);
  } else if (
    request.scope === "portfolio" &&
    !(ownershipQuestion(request.message) && across && own)
  ) {
    blocks = inventory.filter((block) => ownershipQuestion(request.message) ? block.kind === "ownership" : block.kind !== "recommendation");
    const seen = new Set<string>();
    fallbackIds = blocks.filter((block) => { if (seen.has(block.pageSlug)) return false; seen.add(block.pageSlug); return true; }).slice(0, 2).map((b) => b.id);
    purpose = "whole-portfolio-evidence";
    maxItems = 2;
  } else if (ownershipQuestion(request.message)) {
    const others = inventory.filter(
      (block) => block.pageSlug !== slug && block.kind === "ownership",
    );
    requiresSupportingPage = across && Boolean(own && others.length);
    missingSupportingPage = across && !others.length;
    blocks = own ? [own, ...(across ? others : [])] : [];
    fallbackIds = [
      own?.id,
      ...(requiresSupportingPage ? [others[0].id] : []),
    ].filter((id): id is string => Boolean(id));
    purpose = across ? "cross-portfolio-ownership" : "ownership";
    minItems = fallbackIds.length;
    maxItems = Math.max(1, minItems);
  } else if (
    slug === "ai-platform-mcp" &&
    /\btimeline\b|\bwhen\b[^?]*(?:pitch|deploy|production)/i.test(
      request.message,
    )
  ) {
    blocks = current.filter((block) => block.id === `${slug}:timeline`);
    fallbackIds = blocks.map((block) => block.id);
    purpose = "qualified-timeline";
    minItems = blocks.length;
    maxItems = 1;
  } else if (
    slug === "ai-platform-mcp" &&
    !/\b(?:across|elsewhere|other projects?|compare)\b/i.test(
      request.message,
    ) &&
    (roleQuestion(request.message) ||
      /\b(?:impact|results?|outcomes?)\b/i.test(request.message))
  ) {
    blocks = ["validation", "patterns"].flatMap((key) =>
      current.filter((block) => block.id === `${slug}:${key}`),
    );
    fallbackIds = blocks.map((block) => block.id);
    purpose = roleQuestion(request.message)
      ? "role-relevance"
      : "prototype-impact";
    // Both proof facets are required when supplied; two complete two-sentence
    // blocks meet the existing budget without dropping their qualifications.
    minItems = blocks.length;
  } else if (
    slug === "ai-strategy" &&
    /\b(?:summari[sz]e|summary|workflow.first)\b/i.test(request.message)
  ) {
    blocks = ["workflow", "rollout"].flatMap((key) =>
      current.filter((block) => block.id === `${slug}:${key}`),
    );
    fallbackIds = blocks.map((block) => block.id);
    purpose = "workflow-summary";
    minItems = blocks.length ? 1 : 0;
  }
  return {
    blocks,
    primaryPageSlug: focused?.slug ?? slug,
    purpose,
    minItems,
    maxItems,
    fallbackIds,
    requiresSupportingPage,
    missingSupportingPage,
    maxSentences: ["page-evidence", "whole-portfolio-evidence"].includes(purpose) ? undefined : 4,
  };
}

export function claimSelectionConstraints(
  request: CopilotRequest,
  blocks: ClaimBlock[],
) {
  const policy = claimSelectionPolicy(request, blocks);
  return {
    purpose: policy.purpose,
    minBlocks: policy.minItems,
    maxBlocks: policy.maxItems,
    primaryPageSlug: policy.primaryPageSlug,
    requiresSupportingPage: policy.requiresSupportingPage,
    maxSentences: policy.maxSentences,
    costs: policy.blocks.map((block) => ({
      id: block.id,
      sentences: Array.from(
        new Intl.Segmenter("en", { granularity: "sentence" }).segment(
          [...block.claims, ...block.qualifications].map(end).join(" "),
        ),
      ).length,
      words: [...block.claims, ...block.qualifications].join(" ").split(/\s+/)
        .length,
    })),
  };
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
  evidenceUnavailableReason?: EvidenceUnavailableReason;
}): {
  response: CopilotResponse;
  selectedIds: string[];
  status: "selected-blocks" | "canonical-fallback";
  selectionDiagnostics: {
    purpose: string;
    catalogSize: number;
    reason?: string;
    requiresSupportingPage: boolean;
    selectedIds: string[];
  };
} {
  const { request, relatedPages } = input;
  const policy = claimSelectionPolicy(request, input.blocks);
  const blocks = policy.blocks;
  const byId = new Map(blocks.map((block) => [block.id, block]));
  const broader = request.scope === "portfolio" ||
    /\b(?:across|elsewhere|other project|other work|portfolio|career|experience|background|compare)\b/i.test(
      request.message,
    );
  let ids: string[] = [];
  let status: "selected-blocks" | "canonical-fallback" = "canonical-fallback";
  let reason: string | undefined;
  try {
    const parsed = JSON.parse(input.rawText);
    if (
      !parsed ||
      typeof parsed !== "object" ||
      Object.keys(parsed).length !== 1 ||
      !Array.isArray(parsed.blockIds) ||
      parsed.blockIds.length > policy.maxItems ||
      parsed.blockIds.length < policy.minItems ||
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
    if (
      policy.purpose.includes("ownership") &&
      !ids.some((id) => byId.get(id)!.pageSlug === policy.primaryPageSlug)
    )
      throw new Error("Current-page ownership required");
    if (
      policy.requiresSupportingPage &&
      !ids.some((id) => byId.get(id)!.pageSlug !== request.pageContext.slug)
    )
      throw new Error("Supporting-page ownership required");
    if (
      policy.maxSentences &&
      ids.reduce(
        (sum, id) =>
          sum +
          Array.from(
            new Intl.Segmenter("en", { granularity: "sentence" }).segment(
              [...byId.get(id)!.claims, ...byId.get(id)!.qualifications]
                .map(end)
                .join(" "),
            ),
          ).length,
        0,
      ) > policy.maxSentences
    )
      throw new Error("Complete blocks exceed the answer budget");
    status = "selected-blocks";
  } catch (error) {
    ids = policy.fallbackIds;
    reason = error instanceof Error ? error.message : "Invalid selection";
  }
  if (policy.purpose === "cross-portfolio-ownership")
    ids.sort(
      (a, b) =>
        Number(byId.get(b)?.pageSlug === request.pageContext.slug) -
        Number(byId.get(a)?.pageSlug === request.pageContext.slug),
    );
  const selected = ids.map((id) => byId.get(id)!).filter(Boolean);
  const sections = selected.map((block) =>
    [
      block.pageSlug === request.pageContext.slug
        ? policy.purpose === "cross-portfolio-ownership"
          ? `On this page — ${block.pageTitle}:`
          : ""
        : block.pageSlug === "career-evidence"
          ? `From ResumeCustomizer evidence — ${block.pageTitle}:`
          : `Elsewhere in the portfolio — ${block.pageTitle}:`,
      ...(policy.purpose === "role-relevance" && block.label
        ? [`${block.label}:`]
        : []),
      ...block.claims.map(end),
      ...block.qualifications.map(end),
    ]
      .filter(Boolean)
      .join(" "),
  );
  if (policy.purpose === "role-relevance" && sections.length) {
    const role = request.sessionContext.visitorIntent?.normalizedTitle?.trim();
    const roleLabel =
      role && /^[A-Za-z][A-Za-z '&/-]{1,79}$/.test(role)
        ? role
        : "the role you entered";
    sections[0] = `For ${roleLabel}, relevant page evidence:\n${sections[0]}`;
  }
  if (policy.missingSupportingPage)
    sections.push(
      "No supporting project evidence was supplied for the broader ownership comparison.",
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
  const unavailableStatusAlreadyRendered =
    input.evidenceUnavailableReason === "not_configured" &&
    input.careerEvidence?.safeFallback ===
      EVIDENCE_FALLBACK_MESSAGES.not_configured &&
    selected.some((block) =>
      block.coveredStatuses?.includes("career-retrieval-unavailable"),
    );
  if (input.careerEvidence?.safeFallback && !unavailableStatusAlreadyRendered)
    sections.push(input.careerEvidence.safeFallback);
  const usedCareer = selected.filter(
    (block) => block.pageSlug === "career-evidence",
  );
  return {
    selectedIds: ids,
    status,
    selectionDiagnostics: {
      purpose: policy.purpose,
      catalogSize: blocks.length,
      reason,
      requiresSupportingPage: policy.requiresSupportingPage,
      selectedIds: ids,
    },
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

/** Exact renderer text, including every qualification, for citation validation. */
export function blockExcerpt(block: ClaimBlock): string {
  return [...block.claims, ...block.qualifications].map(end).join(" ");
}
