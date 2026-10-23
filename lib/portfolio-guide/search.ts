import { resolve } from "node:path";
import { getAllCanonicalPageContexts } from "./context";
import { pageClaimBlocks, type ClaimBlock } from "./factual-answers";
import {
  embedQuery,
  readIndex,
  rankHybrid,
  type SearchDocument,
  type EmbeddingIndex,
  validIndex,
} from "../search/hybrid";
import type { CopilotRequest } from "./types";
import { getNamedProjectIds } from "./project-references";
export type QuestionScope = {
  kind: "page" | "project" | "broad";
  projectId?: string;
  query: string;
};
export const PORTFOLIO_INDEX_PATH = resolve(
  process.cwd(),
  "content/search-index/portfolio.json",
);
export function resolveQuestionScope(request: CopilotRequest): QuestionScope {
  let query = request.message;
  if (request.scope === "portfolio") return { kind: "broad", query };
  // Navigation and generator actions use the current page's authored path.
  // A role name or the words "AI platform" are not a request to change scope.
  if (
    /\b(?:what should i (?:read|view) next|read next|view next|next read)\b/i.test(
      query,
    ) ||
    (/\b(?:resume|cv)\b/i.test(query) &&
      /\b(?:generate|get|download|role|job)\b/i.test(query))
  )
    return { kind: "page", projectId: request.pageContext.slug, query };
  if (
    request.conversation?.some((message) => message.role === "user") &&
    !/\b(?:this page|here)\b/i.test(query) &&
    (/^(?:what about|what do you mean|explain that|elaborate|tell me more|why|how so|which one|can you expand|what did he|what was he)\b/i.test(
      query,
    ) ||
      /\b(?:that project|that work|its)\b/i.test(query))
  ) {
    const standalone = resolveQuestionScope({ ...request, conversation: [] });
    if (
      standalone.kind === "project" ||
      /\b(?:across|career|background|compare|job description|broader portfolio)\b/i.test(
        query,
      )
    )
      return standalone;
    const previousUsers = (request.conversation ?? [])
      .filter((m) => m.role === "user")
      .slice(-6)
      .reverse();
    for (const previous of previousUsers) {
      const anchor = resolveQuestionScope({
        ...request,
        message: previous.content,
        conversation: [],
      });
      if (anchor.kind === "project") {
        const title =
          getAllCanonicalPageContexts().find(
            (page) => page.slug === anchor.projectId,
          )?.title ?? anchor.projectId;
        return { ...anchor, query: `${title}\nFollow-up: ${request.message}` };
      }
      if (
        /\b(?:this page|this work|here)\b/i.test(previous.content) ||
        !/^(?:what about|tell me more|why|how so|which one|can you expand|what did he|what was he)\b|\b(?:that project|that work|its)\b/i.test(
          previous.content,
        )
      ) {
        query = `${previous.content}\nFollow-up: ${query}`;
        break;
      }
    }
  }
  if (
    /\b(?:across|compare|rest of the portfolio|broader portfolio)\b/i.test(
      query,
    )
  )
    return { kind: "broad", query };
  if (/\b(?:this page|this work|on the page|here)\b/i.test(query))
    return { kind: "page", projectId: request.pageContext.slug, query };
  const namedProjects = getNamedProjectIds(query);
  if (namedProjects.length > 1) return { kind: "broad", query };
  const projectId = namedProjects[0];
  if (projectId)
    return {
      kind: "project",
      projectId,
      query:
        projectId === "immunology-scout"
          ? query.replace(/\bImmiatrics\b/gi, "Immunology Scout")
          : query,
    };
  // A visible current-page choice also applies to generic essay/creative
  // questions, rather than silently searching the visitor's broader career.
  if (request.scope === "page")
    return { kind: "page", projectId: request.pageContext.slug, query };
  if (/\bis daniel (?:a )?fit for this\b/i.test(query))
    return { kind: "page", projectId: request.pageContext.slug, query };
  if (/\b(?:career|background|job description)\b/i.test(query))
    return { kind: "broad", query };
  if (
    /\b(?:Daniel|he|his|experience|fit|role|production|scientists|hallucinations)\b/i.test(
      query,
    ) &&
    !/\b(?:responsible|ownership|own|how senior|implied|not proven|reused most)\b/i.test(
      query,
    )
  )
    return { kind: "broad", query };
  if (
    /\b(?:responsible|ownership|own|how senior|implied|not proven|strongest signals|view next|read next|reused most)\b/i.test(
      query,
    )
  )
    return { kind: "page", projectId: request.pageContext.slug, query };
  return { kind: "page", projectId: request.pageContext.slug, query };
}

/** Complete approved claims and qualifications stay indivisible in the index. */
export function getPortfolioSearchCatalog(): ClaimBlock[] {
  return getAllCanonicalPageContexts().flatMap(pageClaimBlocks);
}
export function getPortfolioSearchDocuments(): SearchDocument[] {
  return getPortfolioSearchCatalog().map((block) => ({
    id: block.id,
    projectId: block.pageSlug,
    text: [block.pageTitle, ...block.claims, ...block.qualifications].join(
      "\n",
    ),
    revision: block.sourceRefs.join("|"),
  }));
}
export async function searchPortfolio(
  scope: QuestionScope,
  options: {
    apiKey?: string;
    signal?: AbortSignal;
    semantic?: boolean;
  } = {},
) {
  const catalog = getPortfolioSearchCatalog();
  const docs = getPortfolioSearchDocuments();
  const index =
    options.semantic === true
      ? readIndex(PORTFOLIO_INDEX_PATH, docs)
      : undefined;
  const queryVector = index
    ? await embedQuery(scope.query, options.apiKey, options.signal)
    : undefined;
  const hits = rankHybrid(docs, scope.query, {
    index,
    queryVector,
    projectId: scope.kind === "broad" ? undefined : scope.projectId,
    limit: 8,
  });
  return {
    blocks: hits.map((hit) => catalog.find((block) => block.id === hit.id)!),
    mode:
      index && queryVector
        ? "hybrid"
        : index
          ? "embedding_unavailable"
          : options.semantic === true
            ? "index_unavailable"
            : "lexical_disabled_semantic",
  };
}

/** Offline replay uses the same ranker/catalog, with no embedding fallback. */
export function searchPortfolioFromIndex(
  scope: QuestionScope,
  index: EmbeddingIndex,
  queryVector: number[],
) {
  const docs = getPortfolioSearchDocuments();
  if (
    !validIndex(index, docs) ||
    queryVector.length !== 1536 ||
    !queryVector.every(Number.isFinite)
  )
    throw new Error("Invalid replay index/vector");
  const catalog = getPortfolioSearchCatalog();
  const hits = rankHybrid(docs, scope.query, {
    index,
    queryVector,
    projectId: scope.kind === "broad" ? undefined : scope.projectId,
    limit: 8,
  });
  return {
    blocks: hits.map((hit) => catalog.find((block) => block.id === hit.id)!),
    mode: "hybrid",
  };
}
