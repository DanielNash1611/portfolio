import assert from "node:assert/strict";
import test from "node:test";
import {
  getPageContextBySlug,
  selectRecommendationsForPage,
} from "@/lib/portfolio-guide/context";

test("ChatGPT Enterprise page classifies its rendered testimonials as direct evidence", () => {
  const pageContext = getPageContextBySlug("chatgpt-enterprise");
  assert.ok(pageContext, "expected canonical page context");

  const buckets = selectRecommendationsForPage(pageContext);
  const currentIds = buckets.currentPage.map((rec) => rec.id);

  assert.deepEqual(
    currentIds.sort(),
    ["sumanth-cherukuri", "zac-bogart"],
    "Zac and Sumanth render on the ChatGPT Enterprise case study, so they must be in the currentPage bucket",
  );
  for (const rec of buckets.currentPage) {
    assert.equal(rec.evidenceLevel, "current_page");
  }

  assert.ok(
    buckets.projectLinked.length > 0,
    "project-linked recommendations should populate for chatgpt-enterprise",
  );
  for (const rec of buckets.projectLinked) {
    assert.equal(rec.evidenceLevel, "project_linked");
    assert.ok(
      (rec.linkedProjectIds ?? []).includes("chatgpt-enterprise"),
      `${rec.id} should report chatgpt-enterprise in linkedProjectIds`,
    );
  }
});

test("project-linked recommendations never duplicate current-page ones", () => {
  const pageContext = getPageContextBySlug("chatgpt-enterprise");
  assert.ok(pageContext);

  const buckets = selectRecommendationsForPage(pageContext);
  const currentIds = new Set(buckets.currentPage.map((rec) => rec.id));

  for (const rec of buckets.projectLinked) {
    assert.ok(
      !currentIds.has(rec.id),
      `${rec.id} appears in both currentPage and projectLinked`,
    );
  }
  for (const rec of buckets.broader) {
    assert.ok(
      !currentIds.has(rec.id),
      `${rec.id} appears in both currentPage and broader`,
    );
    assert.ok(
      !buckets.projectLinked.some((linked) => linked.id === rec.id),
      `${rec.id} appears in both projectLinked and broader`,
    );
  }
});

test("AI Platform MCP page picks up Domnic Nadar's MCP-tagged recommendation as project-linked", () => {
  const pageContext = getPageContextBySlug("ai-platform-mcp");
  assert.ok(pageContext);

  const buckets = selectRecommendationsForPage(pageContext);
  const linkedIds = buckets.projectLinked.map((rec) => rec.id);

  assert.ok(
    linkedIds.includes("domnic-nadar"),
    "Domnic Nadar's OMS MCP recommendation should be tied to ai-platform-mcp via projectIds",
  );
});

test("Non-project pages have no currentPage or projectLinked recs and rely on broader bucket", () => {
  const pageContext = getPageContextBySlug("product-philosophy");
  assert.ok(pageContext);

  const buckets = selectRecommendationsForPage(pageContext);
  assert.equal(buckets.currentPage.length, 0);
  assert.equal(buckets.projectLinked.length, 0);
  assert.ok(buckets.broader.length > 0, "broader bucket should still surface tag-matched recs");
});
