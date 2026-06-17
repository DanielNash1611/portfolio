import type { CopilotResponse } from "@/lib/portfolio-guide/types";
import type {
  EvalMatcher,
  PortfolioGuideDeterministicCheckResult,
  PortfolioGuideEvalCase,
  PortfolioGuideDeterministicChecks,
  PortfolioGuideDeterministicTextTarget,
} from "@/lib/portfolio-guide/evals/types";

function matcherLabel(matcher: EvalMatcher): string {
  return matcher.type === "regex"
    ? `/${matcher.value}/${matcher.flags ?? "i"}`
    : `"${matcher.value}"`;
}

function normalizeForMatching(text: string): string {
  return text
    .normalize("NFKC")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2010-\u2015]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function matches(text: string, matcher: EvalMatcher): boolean {
  if (matcher.type === "regex") {
    const flags = matcher.flags ?? "i";
    const pattern = new RegExp(matcher.value, flags);

    return pattern.test(text) || pattern.test(normalizeForMatching(text));
  }

  return normalizeForMatching(text).includes(
    normalizeForMatching(matcher.value),
  );
}

/**
 * Count prose sentences for the concision check.
 *
 * The naive `split(/(?<=[.!?])\s+/)` over-counts well-structured answers: an
 * ordered-list marker like `1. ` is split into its own "sentence", and the same
 * for `2.`, bullet markers, and keycap-emoji numbering. That penalized answers
 * that were concise but formatted as short lists (a real failure mode observed
 * in stored smoke runs for jira-evidence and ai-platform-seniority). We strip
 * list scaffolding first and then drop any fragment with no alphabetic content,
 * so the count reflects actual sentences rather than formatting. The limit
 * itself is unchanged — a genuinely rambling prose answer still fails.
 */
function countSentences(text: string): number {
  const withoutListScaffolding = text
    // Ordered-list markers at line/segment start: "1. ", "2) ".
    .replace(/(^|\n)\s*\d+[.)]\s+/g, "$1")
    // Bullet markers: "- ", "* ", "• ".
    .replace(/(^|\n)\s*[-*•]\s+/g, "$1")
    // Keycap-emoji numbering: 1️⃣, 2️⃣, …
    .replace(/\d+️?⃣/g, " ");

  return (
    withoutListScaffolding
      .split(/(?<=[.!?])\s+/)
      .map((segment) => segment.trim())
      // A real sentence has at least one letter; this drops stray "1." or numeric
      // fragments left by inline list markers.
      .filter((segment) => /[a-z]/i.test(segment)).length
  );
}

function targetLabel(target: PortfolioGuideDeterministicTextTarget): string {
  switch (target) {
    case "suggestedFollowUps":
      return "Suggested follow-ups";
    case "relatedPageReasons":
      return "Related page reasons";
    case "answer":
    default:
      return "Answer";
  }
}

function responseTextForTarget(
  response: CopilotResponse,
  target: PortfolioGuideDeterministicTextTarget,
): string {
  switch (target) {
    case "suggestedFollowUps":
      return response.suggestedFollowUps?.join("\n") ?? "";
    case "relatedPageReasons":
      return (
        response.relatedPages
          ?.map((page) => page.reason?.trim())
          .filter(Boolean)
          .join("\n") ?? ""
      );
    case "answer":
    default:
      return response.answer;
  }
}

function evaluateIncludeAll(
  answer: string,
  matchers: EvalMatcher[],
  options: {
    severity: PortfolioGuideDeterministicCheckResult["severity"];
    target: PortfolioGuideDeterministicTextTarget;
  },
): PortfolioGuideDeterministicCheckResult[] {
  return matchers.map((matcher) => {
    const matched = matches(answer, matcher);

    return {
      passed: matched,
      label: `${targetLabel(options.target)} includes ${matcherLabel(matcher)}`,
      details: matched
        ? undefined
        : `Missing expected signal ${matcherLabel(matcher)}.`,
      severity: options.severity,
      target: options.target,
    };
  });
}

function evaluateIncludeAny(
  answer: string,
  matchers: EvalMatcher[],
  label: string,
  options: {
    severity: PortfolioGuideDeterministicCheckResult["severity"];
    target: PortfolioGuideDeterministicTextTarget;
  },
): PortfolioGuideDeterministicCheckResult {
  const matched = matchers.find((matcher) => matches(answer, matcher));

  return {
    passed: Boolean(matched),
    label,
    details: matched
      ? undefined
      : `Expected one of: ${matchers.map(matcherLabel).join(", ")}.`,
    severity: options.severity,
    target: options.target,
  };
}

function evaluateExclude(
  answer: string,
  matchers: EvalMatcher[],
  options: {
    severity: PortfolioGuideDeterministicCheckResult["severity"];
    target: PortfolioGuideDeterministicTextTarget;
  },
): PortfolioGuideDeterministicCheckResult[] {
  return matchers.map((matcher) => {
    const matched = matches(answer, matcher);

    return {
      passed: !matched,
      label: `${targetLabel(options.target)} excludes ${matcherLabel(matcher)}`,
      details: matched
        ? `Found forbidden signal ${matcherLabel(matcher)}.`
        : undefined,
      severity: options.severity,
      target: options.target,
    };
  });
}

function evaluateCheckSet(options: {
  checks: PortfolioGuideDeterministicChecks;
  response: CopilotResponse;
  severity: PortfolioGuideDeterministicCheckResult["severity"];
}): PortfolioGuideDeterministicCheckResult[] {
  const { checks, response, severity } = options;
  const target = checks.target ?? "answer";
  const text = responseTextForTarget(response, target);
  const results: PortfolioGuideDeterministicCheckResult[] = [];

  if (checks.answerMustIncludeAll) {
    results.push(
      ...evaluateIncludeAll(text, checks.answerMustIncludeAll, {
        severity,
        target,
      }),
    );
  }

  if (checks.answerMustIncludeAny) {
    results.push(
      evaluateIncludeAny(
        text,
        checks.answerMustIncludeAny,
        `${targetLabel(target)} includes at least one expected signal`,
        { severity, target },
      ),
    );
  }

  if (checks.answerMustIncludeAnyGroups) {
    checks.answerMustIncludeAnyGroups.forEach((group, index) => {
      results.push(
        evaluateIncludeAny(
          text,
          group,
          `${targetLabel(target)} satisfies required signal group ${index + 1}`,
          { severity, target },
        ),
      );
    });
  }

  if (checks.requiredConcepts) {
    checks.requiredConcepts.forEach((concept) => {
      const matched = concept.anyOf.find((matcher) => matches(text, matcher));
      results.push({
        passed: Boolean(matched),
        label: `${targetLabel(target)} conveys concept "${concept.id}"`,
        details: matched
          ? undefined
          : `${concept.description ? `${concept.description} ` : ""}Accepted variants: ${concept.anyOf
              .map(matcherLabel)
              .join(", ")}.`,
        severity,
        target,
      });
    });
  }

  if (checks.answerMustExclude) {
    results.push(
      ...evaluateExclude(text, checks.answerMustExclude, {
        severity,
        target,
      }),
    );
  }

  if (checks.relatedPageSlugsMustInclude) {
    checks.relatedPageSlugsMustInclude.forEach((slug) => {
      const hasSlug =
        response.relatedPages?.some((page) => page.slug === slug) ?? false;

      results.push({
        passed: hasSlug,
        label: `Related pages include "${slug}"`,
        details: hasSlug
          ? undefined
          : `Expected relatedPages to include "${slug}".`,
        severity,
        target: "relatedPages",
      });
    });
  }

  if (checks.relatedPageSlugsMustExclude) {
    checks.relatedPageSlugsMustExclude.forEach((slug) => {
      const hasSlug =
        response.relatedPages?.some((page) => page.slug === slug) ?? false;

      results.push({
        passed: !hasSlug,
        label: `Related pages exclude "${slug}"`,
        details: hasSlug
          ? `Did not expect relatedPages to include "${slug}".`
          : undefined,
        severity,
        target: "relatedPages",
      });
    });
  }

  if (checks.maxSentences && target === "answer") {
    const sentenceCount = countSentences(text);
    results.push({
      passed: sentenceCount <= checks.maxSentences,
      label: `Answer stays within ${checks.maxSentences} sentences`,
      details:
        sentenceCount <= checks.maxSentences
          ? undefined
          : `Answer used ${sentenceCount} sentences.`,
      severity,
      target,
    });
  }

  return results;
}

function toCheckArray(
  checks:
    | PortfolioGuideDeterministicChecks
    | PortfolioGuideDeterministicChecks[]
    | undefined,
): PortfolioGuideDeterministicChecks[] {
  if (!checks) {
    return [];
  }

  return Array.isArray(checks) ? checks : [checks];
}

export function evaluateDeterministicChecks(
  evalCase: PortfolioGuideEvalCase,
  response: CopilotResponse,
): PortfolioGuideDeterministicCheckResult[] {
  return [
    ...toCheckArray(evalCase.deterministicChecks).flatMap((checks) =>
      evaluateCheckSet({ checks, response, severity: "hard" }),
    ),
    ...(evalCase.advisoryChecks ?? []).flatMap((checks) =>
      evaluateCheckSet({ checks, response, severity: "advisory" }),
    ),
  ];
}
