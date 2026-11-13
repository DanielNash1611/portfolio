import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync } from "node:fs";
import { privateProductExamples } from "../../content/projects/private-product-examples";
import { productEntries } from "../../content/portfolio";
import { getPageContextByPath } from "../../lib/portfolio-guide/context";
import { getNamedProjectIds } from "../../lib/portfolio-guide/project-references";
import { getPortfolioSearchDocuments } from "../../lib/portfolio-guide/search";
import sitemap from "../../app/sitemap";

test("private product examples stay discoverable without exposing deployments or adding assets", () => {
  for (const entry of privateProductExamples) {
    assert.ok(productEntries.includes(entry));
    assert.ok(existsSync(`app${entry.href}/page.tsx`));
    assert.ok(sitemap().some((item) => item.url.endsWith(entry.href)));
    assert.equal(entry.status, "Privately deployed");
    assert.equal(entry.heroImage, "");
    assert.deepEqual(entry.visuals, []);
    assert.deepEqual(entry.featuredMetrics, []);
    assert.equal(entry.actions, undefined);
    assert.doesNotMatch(JSON.stringify(entry), /https?:\/\//);
    assert.deepEqual(getNamedProjectIds(entry.title), [entry.slug]);
  }
});

test("each new retrieval claim keeps its private deployment and outcome boundaries", () => {
  const docs = getPortfolioSearchDocuments().filter((doc) =>
    privateProductExamples.some((entry) => entry.slug === doc.projectId),
  );
  assert.equal(docs.length, 5);
  for (const doc of docs) {
    assert.match(doc.text, /Privately deployed/);
    assert.match(doc.text, /not a public launch/);
    assert.match(
      doc.text,
      /Public adoption and measured outcomes are not established/,
    );
    assert.doesNotMatch(doc.text, /https?:\/\//);
  }
  for (const entry of privateProductExamples) {
    const page = getPageContextByPath(entry.href);
    assert.ok(page);
    assert.deepEqual(page.metrics, []);
    assert.deepEqual(page.outcomes, []);
  }
});

test("interaction evidence preserves the distinct scope of each example", () => {
  const original = privateProductExamples[0];
  const temple = privateProductExamples[1];
  assert.match(JSON.stringify(original), /Passage-preserving/);
  assert.match(
    JSON.stringify(original),
    /substantive wording changes and major punctuation/,
  );
  assert.match(
    JSON.stringify(temple),
    /Horizontal swipes switch temples; vertical swipes/,
  );
  assert.match(
    JSON.stringify(temple),
    /not a public launch, measured adoption, or equal depth/,
  );
  const template = readFileSync(
    "components/site/PrivateProductExample.tsx",
    "utf8",
  );
  assert.match(template, /entry.evaluationAndTrust/);
  assert.match(template, /PortfolioGuide/);
});
