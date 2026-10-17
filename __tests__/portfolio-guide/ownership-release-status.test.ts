import test from "node:test";
import assert from "node:assert/strict";
import fixture from "./fixtures/ownership-release-status.json";
import {
  getPageContextBySlug,
  getPortfolioContext,
} from "../../lib/portfolio-guide/context";
import {
  renderClaimSelection,
  blockExcerpt,
  pageClaimBlocks,
  type ClaimBlock,
} from "../../lib/portfolio-guide/factual-answers";
import {
  getPortfolioSearchCatalog,
  getPortfolioSearchDocuments,
} from "../../lib/portfolio-guide/search";
import { hashText } from "../../lib/search/hybrid";
import type { CopilotRequest } from "../../lib/portfolio-guide/types";

const request: CopilotRequest = {
  message: fixture.question,
  scope: "portfolio",
  pageContext: getPageContextBySlug(fixture.pageSlug)!,
  portfolioContext: {
    ...getPortfolioContext(),
    recommendations: { currentPage: [], projectLinked: [], broader: [] },
  },
  sessionContext: {
    visitedPages: [],
    clickedPrompts: [],
    askedQuestions: [],
    inferredInterestTags: [],
  },
};

test("saved ownership selection repairs only the dated release qualifier, preserving credit and limits", (t) => {
  let calls = 0;
  t.mock.method(globalThis, "fetch", async () => {
    calls++;
    throw Error("No inference for a saved-capture regression");
  });
  const render = (blocks: ClaimBlock[]) =>
    renderClaimSelection({
      request,
      blocks,
      rawText: fixture.rawText,
      relatedPages: fixture.relatedPages,
    });
  const original = render(fixture.originalBlocks as ClaimBlock[]);
  assert.equal(original.response.answer, fixture.originalAnswer);
  const current = getPortfolioSearchCatalog();
  const blocks = fixture.originalBlocks.map(
    (old) => current.find((b) => b.id === old.id)!,
  );
  assert.ok(blocks.every(Boolean));
  const revised = render(blocks);
  const oldQualifier = fixture.originalBlocks.find(
    (b) => b.id === "ai-career-operating-system:ownership",
  )!.qualifications[0];
  const newQualifier = blocks.find(
    (b) => b.id === "ai-career-operating-system:ownership",
  )!.qualifications[0];
  assert.equal(
    revised.response.answer,
    fixture.originalAnswer.replace(oldQualifier, newQualifier),
  );
  assert.equal(revised.status, "selected-blocks");
  assert.deepEqual(revised.selectedIds, JSON.parse(fixture.rawText).blockIds);
  for (const b of blocks)
    assert.ok(revised.response.answer.includes(blockExcerpt(b)));
  assert.match(
    revised.response.answer,
    /AI development agents assisted implementation/,
  );
  assert.match(revised.response.answer, /no claim of sole hand-coding/);
  assert.match(revised.response.answer, /deployed portfolio source \(PR #12\)/);
  assert.match(
    revised.response.answer,
    /career retrieval remains a local candidate/,
  );
  assert.match(
    revised.response.answer,
    /remote retrieval is disabled by default/,
  );
  assert.match(
    revised.response.answer,
    /final combined-release validation is pending/,
  );
  assert.doesNotMatch(
    revised.response.answer,
    /Decisions routing and career retrieval remain local or unshipped/,
  );
  assert.equal(calls, 0);
});

test("release-status source contracts retain both authored blocks after boundary hash refresh", () => {
  const blocks = pageClaimBlocks(
    getPageContextBySlug("ai-career-operating-system")!,
  );
  assert.ok(
    blocks.some((b) => b.id === "ai-career-operating-system:ownership"),
  );
  assert.ok(
    blocks.some((b) => b.id === "ai-career-operating-system:retrieval"),
  );
});

test("only three qualified portfolio texts invalidate their old embeddings", () => {
  const documents = getPortfolioSearchDocuments();
  assert.equal(documents.length, 63);
  const old = fixture.originalPortfolioDocumentHashes as Record<string, string>;
  const changed = documents
    .filter((d) => old[d.id] !== hashText(d.text))
    .map((d) => d.id)
    .sort();
  assert.deepEqual(changed, [
    "ai-career-operating-system:evaluation",
    "ai-career-operating-system:ownership",
    "ai-career-operating-system:perspective",
  ]);
  assert.equal(documents.length - changed.length, 60);
});
