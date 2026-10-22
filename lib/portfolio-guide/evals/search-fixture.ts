import { buildDecisionsRequest } from "../decisions";
import { claimSelectionPolicy } from "../factual-answers";
import {
  requestForSearchCase,
  type PublicSearchBundle,
} from "./search-adaptive";
import type { SearchTransport } from "./search-budget";
import { hashText } from "../../search/hybrid";

/** Structural fake only. Zero vectors deliberately do not claim semantic quality. */
export function createSearchFixtureTransport(
  bundle: PublicSearchBundle,
  nativeQueries?: Array<{ hash: string; vector: number[] }>,
): SearchTransport {
  return async ({ body }) => {
    const request = JSON.parse(body);
    let result: Record<string, unknown>;
    if (request.model === "text-embedding-3-small") {
      result = {
        model: request.model,
        data: request.input.map((_: string, index: number) => ({
          index,
          embedding: Array(1536).fill(0),
        })),
        usage: { prompt_tokens: 20, total_tokens: 20 },
      };
      // Oracle-derived synthetic career vectors keep this structural fixture
      // consistent with the fourteen real query vectors being reused. This is
      // fake transport data, never semantic-quality evidence or a live fallback.
      if (nativeQueries && request.input.length === 17) {
        const missing = bundle.career.documents.filter(
          (d) => !bundle.career.cache.records.some((r) => r.id === d.id),
        );
        missing.forEach((doc, index) => {
          const matching = bundle.retrievalCases.career
            .filter((c) => c.expectedIds.includes(doc.id))
            .flatMap((c) =>
              nativeQueries.filter((q) => q.hash === hashText(c.query)),
            );
          if (!matching.length) return;
          const vector = Array.from(
            { length: 1536 },
            (_, i) =>
              matching.reduce((sum, q) => sum + q.vector[i], 0) /
              matching.length,
          );
          const length = Math.hypot(...vector);
          (result.data as Array<{ embedding: number[] }>)[index].embedding =
            vector.map((v) => v / length);
        });
      }
    } else if (request.model === "gpt-6-luna") {
      const question = JSON.parse(request.input).question;
      const c = bundle.questions.find((c) => c.question === question)!;
      const template = buildDecisionsRequest(
        requestForSearchCase(bundle, c.id),
      );
      result = {
        model: request.model,
        answers: template.questions.map((q) =>
          q.type === "predicate"
            ? { type: "predicate", name: q.name, probability: 0.9 }
            : {
                type: "choice",
                name: q.name,
                choice: q.name === "depth" ? "synthesis" : "balanced",
                confidence: 0.9,
              },
        ),
        usage: { input_tokens: 20, total_tokens: 20 },
      };
    } else if (request.model === "gpt-5.6-terra") {
      const packet = JSON.parse(request.input[1].content);
      const c = bundle.questions.find(
        (c) => c.question === packet.currentQuestion,
      )!;
      const input = requestForSearchCase(bundle, c.id);
      input.pageContext = {
        ...input.pageContext,
        slug: packet.currentPage.identity.slug,
      };
      input.scope =
        packet.retrievalScope?.kind === "broad" ? "portfolio" : "page";
      let ids = claimSelectionPolicy(input, packet.approvedBlocks).fallbackIds;
      const match = (pattern: RegExp) =>
        packet.approvedBlocks.find((b: { claims: string[] }) =>
          pattern.test(b.claims.join(" ")),
        )?.id;
      if (c.id === "patent-measurement")
        ids = [match(/100%.*0%/s)].filter(Boolean);
      if (c.id === "onboarding") ids = [match(/eight.week/i)].filter(Boolean);
      if (c.id === "oms-context")
        ids = [
          ...new Set(
            [match(/demo|simulat/i), match(/production/i)].filter(Boolean),
          ),
        ];
      result = response(request.model, JSON.stringify({ blockIds: ids }));
    } else if (request.model === "gpt-6.1-sol") {
      result = response(
        request.model,
        JSON.stringify({
          verdict: "pass",
          summary: "Fixture only",
          scores: {
            groundedness: 5,
            uncertaintyHandling: 5,
            sourceSeparation: 5,
            helpfulness: 5,
            concision: 5,
          },
          strengths: [],
          issues: [],
        }),
      );
    } else throw new Error("fixture_unapproved_model");
    return { status: 200, body: JSON.stringify(result) };
  };
}
function response(model: string, text: string) {
  return {
    model,
    status: "completed",
    service_tier: "default",
    output: [
      {
        type: "message",
        role: "assistant",
        content: [{ type: "output_text", text }],
      },
    ],
    usage: { input_tokens: 20, output_tokens: 20, total_tokens: 40 },
  };
}
