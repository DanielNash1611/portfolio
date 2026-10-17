import { readFileSync } from "node:fs";
import { getPortfolioSearchDocuments } from "../lib/portfolio-guide/search";
import { rankHybrid } from "../lib/search/hybrid";
const cases = JSON.parse(
  readFileSync("evals/search/cases.json", "utf8"),
) as Array<{
  id: string;
  split: string;
  query: string;
  expectedIds: string[];
  projectId?: string;
}>;
const docs = getPortfolioSearchDocuments();
const results = cases.map((c) => {
  const ids = rankHybrid(docs, c.query, {
    projectId: c.projectId,
    limit: 5,
  }).map((h) => h.id);
  return {
    id: c.id,
    split: c.split,
    pass: c.expectedIds.some((id) => ids.includes(id)),
    ids,
  };
});
console.log(
  JSON.stringify(
    {
      mode: "lexical",
      cases: results.length,
      passed: results.filter((r) => r.pass).length,
      results,
    },
    null,
    2,
  ),
);
if (results.some((r) => !r.pass)) process.exitCode = 1;
