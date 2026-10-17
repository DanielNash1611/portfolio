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

/** Keep qualifiers with their proof; do not cut a long answer at an arbitrary character. */
export function boundGuideAnswer(
  answer: string,
  question: string,
  maxSentences = 4,
): string {
  const parts = sentences(answer);
  if (parts.length <= maxSentences) return answer.trim();
  const words = new Set(question.toLowerCase().match(/[a-z]{4,}/g) ?? []);
  const groups: Array<{ parts: string[]; start: number; priority: number }> =
    [];
  parts.forEach((part, index) => {
    // A following qualifier is inseparable from the claim it limits.
    if (
      limitSignal.test(part) &&
      groups.length &&
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
    groups.push({
      parts: [part],
      start: index,
      priority:
        (limitSignal.test(part) ? 20 : 0) +
        (/\/resume\/generate|couldn't reach|isn't connected/i.test(part)
          ? 30
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
  const selected: typeof groups = [];
  let available = maxSentences;
  for (const group of [...groups].sort(
    (a, b) => b.priority - a.priority || a.start - b.start,
  )) {
    if (group.parts.length <= available) {
      selected.push(group);
      available -= group.parts.length;
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
  const suppliedAnswer = input.answer.replace(/\*\*([^*]+)\*\*/g, "$1");
  let answer = suppliedAnswer;
  let blocks: ReturnType<typeof careerProofBlocks> = [];
  const fallback = careerEvidence?.safeFallback;
  const budget = Math.max(1, 4 - (fallback ? sentences(fallback).length : 0));
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
  if (fallback) {
    answer = answer.replace(fallback, "").trim();
    answer = `${punctuate(boundGuideAnswer(answer, request.message, budget))} ${fallback}`;
  } else {
    answer = boundGuideAnswer(answer, request.message);
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
