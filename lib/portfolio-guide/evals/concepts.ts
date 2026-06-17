/**
 * Reusable answer concepts for deterministic eval checks.
 *
 * Each concept is a single idea expressed as several accepted surface forms.
 * Cases reference these instead of inlining literal phrases, so:
 *   1. De-brittling happens in one place and is shared across cases.
 *   2. Failure output names the *concept* that was missing, not a raw regex.
 *
 * The accepted variants here were widened to cover genuinely-equivalent
 * phrasings observed in stored model runs (e.g. "A/B test" vs "a/b testing",
 * "does not identify which … reused most" vs "doesn't rank them",
 * "used the most" vs "reused most"). Forbidden-claim excludes are deliberately
 * NOT part of any concept — they stay as separate `answerMustExclude` checks so
 * that broadening a positive concept can never let an overclaim through.
 */
import type {
  EvalConcept,
  EvalMatcher,
} from "@/lib/portfolio-guide/evals/types";

const rx = (value: string): EvalMatcher => ({ type: "regex", value });

/**
 * The page does not say / rank which reusable pattern was used or reused most,
 * and the answer does not invent a ranking. Matches negated ranking verbs
 * (identify / specify / rank / name / quantify / …) tied to which/most/reused,
 * plus "without naming or ranking", plus the original literals.
 */
export const REFUSES_TO_RANK_REUSE: EvalConcept = {
  id: "refuses-to-rank-reuse",
  description:
    "States the page does not identify/rank which pattern was reused or used most, without inventing a ranking.",
  anyOf: [
    rx(
      "(?:does(?:n't| not)|did(?:n't| not)|do(?:n't| not))\\s+(?:\\w+\\s+){0,5}(?:rank|identif\\w+|specif\\w+|name|quantif\\w+|say|state|indicate|provide|distinguish|single out|call out|break down|clarif\\w+)\\b[^.?!]{0,70}\\b(?:which|what|most|reused|used|ranking|priorit)",
    ),
    rx(
      "\\bwithout\\s+(?:naming|ranking|specifying|identifying|quantifying|distinguishing|prioriti[sz]ing)\\b",
    ),
    rx(
      "\\bnot\\s+(?:explicit|specified|clear|stated|ranked|quantified)\\b[^.?!]{0,70}\\b(?:which|most|reused|used)\\b",
    ),
    { value: "doesn't say which was reused most" },
    { value: "doesn't quantify which pattern" },
    { value: "doesn't rank them" },
    { value: "not explicit which was reused most" },
  ],
};

/** Names the reusable AI workflow / system patterns the AI-platform page supports. */
export const REUSABLE_PATTERN_NAMES: EvalConcept = {
  id: "reusable-pattern-names",
  description:
    "Names the reusable AI workflow/system patterns on the page (agentic/agent-based workflows, retrieval, connectors, orchestration, prompt consistency).",
  anyOf: [
    { value: "agent-based workflows" },
    { value: "agentic workflows" },
    { value: "agent-based" },
    { value: "retrieval" },
    { value: "connector" },
    { value: "prompt consistency" },
    { value: "workflow patterns" },
    { value: "workflow orchestration" },
  ],
};

/**
 * Cites a measured checkout business/UX outcome: ~$16M annualized impact,
 * 30% faster checkout (3:00 → 2:03), or ~3% conversion lift.
 */
export const CHECKOUT_BUSINESS_IMPACT: EvalConcept = {
  id: "checkout-business-impact",
  description:
    "Cites a measured checkout outcome: ~$16M annualized impact, 30% faster checkout, or ~3% conversion lift.",
  anyOf: [
    rx("~?\\$?16\\s*m|16\\s*million|annualized impact"),
    { value: "30% faster" },
    rx("30\\s*%\\s*faster"),
    { value: "~3% conversion" },
    rx("~?\\s*3\\s*%[^.?!]{0,25}conversion"),
    { value: "3:00 to 2:03" },
  ],
};

/**
 * Cites a concrete execution/delivery artifact rather than generic praise:
 * 12-week delivery, a context-rich Jira ticket, A/B testing, usability
 * testing, post-launch measurement, or minimal service disruption.
 */
export const CHECKOUT_EXECUTION_ARTIFACT: EvalConcept = {
  id: "checkout-execution-artifact",
  description:
    "Cites a concrete execution/delivery artifact: 12-week delivery, a context-rich Jira ticket, A/B or usability testing, post-launch measurement, or minimal service disruption.",
  anyOf: [
    { value: "12-week" },
    { value: "12 week" },
    rx("jira[^.?!]{0,30}ticket"),
    rx("a\\s*/?\\s*b[ -]?test(?:ing|ed|s)?"),
    { value: "usability testing" },
    { value: "post-launch" },
    { value: "minimal service disruption" },
  ],
};

/**
 * States plainly that MCP is not mentioned/referenced on the current page.
 * Tolerant of punctuation/quoting around the term ("does not mention “MCP.”")
 * and of mention/reference synonyms, which broke the original literal matcher.
 */
export const MCP_NOT_MENTIONED: EvalConcept = {
  id: "mcp-not-mentioned",
  description:
    "Says plainly that MCP is not mentioned or referenced on the current page.",
  anyOf: [
    rx(
      "(?:does(?:n't| not)|do(?:n't| not)|did(?:n't| not))\\s+(?:\\w+\\s+){0,4}(?:mention|reference|include|name|discuss|cite|use|contain)[^.?!]{0,30}mcp",
    ),
    rx(
      "mcp[^.?!]{0,40}(?:is|are|isn't|aren't)?\\s*(?:not|n['’]?t)\\s+(?:mentioned|referenced|present|here|on this page|on the page)",
    ),
    { value: "doesn't mention mcp" },
    { value: "does not mention mcp" },
    { value: "i don't see mcp" },
    { value: "no, not on this page" },
  ],
};
