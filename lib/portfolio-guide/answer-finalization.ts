import type { CopilotRequest } from "./types";
import type { EvidenceItem, EvidenceSearchResponse } from "./tools/evidence";

const limitSignal =
  /\b(?:boundary|limit|not established|not proven|does not|doesn't|do not|unknown|unspecified|cannot|couldn't|could not|no (?:evidence|published|product-wide|supporting)|measured set|in progress|private alpha)\b/i;

function sentences(text: string): string[] {
  return text
    .replace(/(^|\n)\s*\d+[.)]\s+/g, "$1")
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function punctuate(text: string): string {
  return /[.!?]$/.test(text.trim()) ? text.trim() : `${text.trim()}.`;
}

function normalizeComparisonLabels(text: string): string {
  return text.replace(/\bvs\.(?=\s)/gi, "versus");
}

function classificationText(text: string): string {
  return text
    .normalize("NFKC")
    .replace(/[\u2010-\u2015]/g, "-")
    .replace(/[\u2018\u2019]/g, "'");
}

/** Keep qualifiers with their proof; do not cut a long answer at an arbitrary character. */
export function boundGuideAnswer(
  answer: string,
  question: string,
  maxSentences = 4,
  sourceEvidence: string[] = [],
): string {
  const normalizedAnswer = normalizeComparisonLabels(answer);
  const parts = sentences(normalizedAnswer);
  if (parts.length <= maxSentences) return normalizedAnswer.trim();
  const words = new Set(question.toLowerCase().match(/[a-z]{4,}/g) ?? []);
  const evidenceWords = sourceEvidence.map(
    (detail) =>
      new Set(
        (detail.toLowerCase().match(/[a-z]{6,}/g) ?? []).filter(
          (word) =>
            !/^(?:claims?|explicit|provides?|supports?|describes?|current|states|source|evidence|portfolio)$/.test(
              word,
            ),
        ),
      ),
  );
  const directResumeQuestion = /\b(?:resume|cv)\b/i.test(question);
  const responsibilityOrStatusQuestion =
    /\b(?:own(?:ership|ed)?|responsib\w*|direct|assist\w*|prototype|implemented)\b/i.test(
      question,
    );
  const groups: Array<{ parts: string[]; start: number; priority: number }> =
    [];
  parts.forEach((part, index) => {
    // A following qualifier is inseparable from the claim it limits.
    if (
      limitSignal.test(part) &&
      groups.length &&
      // A different project's self-qualified proof is a complete block, not
      // a limitation attached to the preceding project's claim.
      !/^(?:The|This|That)\s+[^.!?]{1,80}\s+(?:case|project|page|record|study)\s+(?:also\s+)?(?:supports|shows|describes|documents|demonstrates|provides)\b/i.test(
        part,
      ) &&
      !/^(?:Boundary|Limit|Not established|Missing support):/i.test(
        groups.at(-1)!.parts[0],
      )
    ) {
      const previous = groups.at(-1)!;
      previous.parts.push(part);
      previous.priority += 20;
      return;
    }
    const overlap = [...words].filter((word) =>
      part.toLowerCase().includes(word),
    ).length;
    // Match a concrete source finding, rather than rewarding a generic
    // paragraph for accumulating keywords from several unrelated findings.
    const evidenceOverlap = Math.max(
      0,
      ...evidenceWords.map((tokens) =>
        tokens.size
          ? [...tokens].filter((word) => part.toLowerCase().includes(word))
              .length / tokens.size
          : 0,
      ),
    );
    const qualifiedEvidence =
      /\b(?:majority|minority)\b/i.test(part) &&
      evidenceWords.some((tokens) =>
        [...tokens].some(
          (word) =>
            /^(?:majority|minority)$/.test(word) &&
            part.toLowerCase().includes(word),
        ),
      );
    groups.push({
      parts: [part],
      start: index,
      priority:
        (responsibilityOrStatusQuestion &&
        /^(?:Directed|Direct ownership|AI-assisted|Implemented(?: versus local prototype)?|Local prototype):/i.test(
          part,
        )
          ? 100
          : 0) +
        (limitSignal.test(part) ? 20 : 0) +
        // Keep concrete, source-matched proof (including qualified survey
        // findings without numeric percentages) alongside its limitations.
        Math.round(evidenceOverlap * 32) +
        (qualifiedEvidence ? 8 : 0) +
        (/\/resume\/generate|couldn't reach|isn't connected/i.test(part)
          ? 30
          : 0) +
        (directResumeQuestion &&
        /\bpaste\b[^.!?]*\bjob description\b|\bgenerator flow\b/i.test(part)
          ? 50
          : 0) +
        (/\d/.test(part) ? 6 : 0) +
        // Preserve measured proof before generic framing when shortening.
        (/\$\d|\d\s*%|\d[\d.,]*\s*(?:million|billion)\b/i.test(part) ? 8 : 0) +
        (/^(?:From ResumeCustomizer evidence|Elsewhere in the portfolio|Thematic comparison)/i.test(
          part,
        )
          ? 4
          : 0) +
        (index === 0 ? 5 : 0) +
        overlap,
    });
  });
  const contrastsExperienceAndConviction =
    /\b(?:personal|convictions?|aspirations?)\b/i.test(question) &&
    /\b(?:grounded|experience|professional|evidence|proof)\b/i.test(question);
  const perspectiveGroups = new Set(
    contrastsExperienceAndConviction
      ? groups.filter((group) =>
          /\b(?:personal|convictions?|aspirations?)\b/i.test(
            group.parts.join(" "),
          ),
        )
      : [],
  );
  for (const group of perspectiveGroups) group.priority += 50;
  const selected: typeof groups = [];
  let available = maxSentences;
  let perspectiveSelected = false;
  for (const group of [...groups].sort(
    (a, b) => b.priority - a.priority || a.start - b.start,
  )) {
    // A proof-versus-conviction question needs both facets. Repeated belief
    // summaries must not displace the concrete professional evidence.
    if (perspectiveGroups.has(group) && perspectiveSelected) continue;
    if (group.parts.length <= available) {
      selected.push(group);
      available -= group.parts.length;
      perspectiveSelected ||= perspectiveGroups.has(group);
    }
  }
  // Source limitations take precedence if a single qualified block is longer
  // than the budget. Keep its first proof and the explicit qualifiers.
  if (!selected.length) {
    const group = groups.sort((a, b) => b.priority - a.priority)[0];
    return [
      group.parts[0],
      ...group.parts.slice(1).filter((part) => limitSignal.test(part)),
    ]
      .slice(0, maxSentences)
      .join(" ");
  }
  return selected
    .sort((a, b) => a.start - b.start)
    .flatMap((group) => group.parts)
    .join(" ");
}

function relevantBoundary(
  item: EvidenceItem,
  question: string,
): string | undefined {
  const boundaries = item.claimBoundaries?.filter(Boolean) ?? [];
  const query = `${question} ${item.claim}`;
  const words = new Set(question.toLowerCase().match(/[a-z]{4,}/g) ?? []);
  return boundaries
    .map((text, index) => ({
      text,
      index,
      score:
        [...words].filter((word) => text.toLowerCase().includes(word)).length +
        (/\d|hallucinat|measur|evaluat|benchmark/i.test(query) &&
        /measur|hallucinat|every possible|set\b/i.test(text)
          ? 6
          : 0) +
        (/research|scientific|life science/i.test(question) &&
        /scientific|validat|research/i.test(text)
          ? 6
          : 0) +
        (/production|ship|launch|complete/i.test(question) &&
        /production|launch|complet|progress|prototype/i.test(text)
          ? 6
          : 0) +
        (/owner|responsib|lead|team/i.test(question) &&
        /owner|responsib|team|sole|implementation/i.test(text)
          ? 6
          : 0),
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index)[0]?.text;
}

/** Exact, source-qualified career proof, capped at two distinct projects. */
export function careerProofBlocks(
  evidence: EvidenceSearchResponse,
  question: string,
  maxProjects = 2,
): Array<{ id: string; text: string }> {
  const seen = new Set<string>();
  return evidence.evidence.flatMap((item) => {
    if (seen.has(item.project) || seen.size >= maxProjects) return [];
    seen.add(item.project);
    const boundary = relevantBoundary(item, question);
    return [
      {
        id: item.id,
        text: [
          punctuate(
            `From ResumeCustomizer evidence: ${item.project}: ${item.claim}`,
          ),
          ...(boundary
            ? [punctuate(`Limit for ${item.project}: ${boundary}`)]
            : []),
        ].join(" "),
      },
    ];
  });
}

export function finalizeRoutedAnswer(input: {
  request: CopilotRequest;
  answer: string;
  careerEvidence?: EvidenceSearchResponse;
  includeCareerEvidence: boolean;
  broaderQuestion: boolean;
}): { answer: string; careerEvidenceIds?: string[] } {
  const { request, careerEvidence } = input;
  // The guide renders plain text. Keep labels readable when a model adds
  // Markdown emphasis, and remove it before counting sentence punctuation.
  const suppliedAnswer = normalizeComparisonLabels(
    input.answer.replace(/\*\*([^*]+)\*\*/g, "$1"),
  );
  let answer = suppliedAnswer;
  let blocks: ReturnType<typeof careerProofBlocks> = [];
  const fallback = careerEvidence?.safeFallback;
  const budget = Math.max(1, 4 - (fallback ? sentences(fallback).length : 0));
  const sourceEvidence =
    request.pageContext.evidenceHighlights?.map((item) => item.detail) ?? [];
  if (input.includeCareerEvidence && careerEvidence?.evidence.length) {
    const pageFocused =
      /\b(?:this page|this work|here|this connect|role|fit|director|job description)\b/i.test(
        request.message,
      );
    blocks = careerProofBlocks(
      careerEvidence,
      request.message,
      pageFocused ? 1 : 2,
    );
    let prefix = "";
    if (input.broaderQuestion && !pageFocused) {
      // A career question is answered from the requested career evidence, rather
      // than inheriting a generic current-page role-fit introduction.
      answer = "";
    } else {
      const pageParts = sentences(answer);
      const boundary = pageParts
        .slice(1)
        .find((part) => limitSignal.test(part));
      prefix = [pageParts[0], boundary].filter(Boolean).join(" ");
    }
    let remaining = budget - sentences(prefix).length;
    blocks = blocks.filter((block) => {
      const size = sentences(block.text).length;
      if (size > remaining) return false;
      remaining -= size;
      return true;
    });
    answer = blocks.length
      ? [prefix, ...blocks.map((block) => block.text)].filter(Boolean).join(" ")
      : suppliedAnswer;
  }
  const releaseBoundary = sourceEvidence
    .flatMap(sentences)
    .find((part) => /\bRemote career retrieval is disabled\b/i.test(part));
  const careerRetrievalClaim =
    /\b(?:ResumeCustomizer[^.!?]{0,120}(?:retriev\w*|evidence engine)|source-audited[^.!?]{0,60}(?:retriev\w*|evidence)|career[^.!?]{0,30}retriev\w*|evidence engine)\b/i;
  const describesCareerRetrieval = careerRetrievalClaim.test(
    classificationText(answer),
  );
  const includesAvailability =
    /\bretriev\w*\b[^.!?]{0,100}\b(?:disabled|not connected|isn't connected|not active)\b|\bdisabled\b[^.!?]{0,100}\bretriev\w*\b/i.test(
      classificationText(answer),
    );
  if (
    !fallback &&
    !careerEvidence?.evidence.length &&
    releaseBoundary &&
    describesCareerRetrieval &&
    !includesAvailability
  ) {
    const parts = sentences(answer);
    const index = parts.findIndex((part) =>
      careerRetrievalClaim.test(classificationText(part)),
    );
    parts[index] =
      `${parts[index].replace(/[.!?]+$/, "")}; release boundary: ${releaseBoundary}`;
    answer = parts.join(" ");
  }
  if (fallback) {
    answer = answer.replace(fallback, "").trim();
    answer = `${punctuate(boundGuideAnswer(answer, request.message, budget, sourceEvidence))} ${fallback}`;
  } else {
    answer = boundGuideAnswer(answer, request.message, 4, sourceEvidence);
  }
  return {
    answer,
    ...(blocks.length
      ? {
          careerEvidenceIds: blocks
            .filter((block) => answer.includes(block.text))
            .map((block) => block.id),
        }
      : {}),
  };
}
