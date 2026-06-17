import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import sitemap from "@/app/sitemap";
import { homeContent, productEntries } from "@/content/portfolio";

test("AI Career Operating System keeps its governed product framing", () => {
  const entry = productEntries[0];
  assert.equal(entry.slug, "ai-career-operating-system");
  assert.equal(entry.status, "Production-shaped");
  assert.equal(
    entry.description,
    "Governed AI workflow with source-audited retrieval, role-aware generation, evals, and human review.",
  );
  assert.deepEqual(
    entry.featuredMetrics.map((metric) => metric.value),
    ["31 cases", "6 agents", "Authenticated API"],
  );
  assert.deepEqual(
    entry.featuredMetrics[2],
    {
      label: "Service boundary",
      value: "Authenticated API",
      detail:
        "Server-to-server authentication keeps internal credentials outside the browser.",
    },
  );
  assert.equal(
    entry.actions?.[0]?.href,
    "/products/ai-career-operating-system#portfolio-guide-ai-career-operating-system",
  );
  assert.equal(entry.actions?.[1]?.href, "/resume/generate");
});

test("homepage features the strongest three product proof lanes", () => {
  assert.deepEqual(homeContent.featuredProducts, [
    "oms-chatgpt-app",
    "ai-career-operating-system",
    "immunology-scout",
  ]);
  assert.ok(!homeContent.featuredProducts.includes("launchmuse"));
  assert.ok(productEntries.some((entry) => entry.slug === "launchmuse"));
});

test("AI Career Operating System is included in sitemap and llms.txt", async () => {
  const urls = sitemap().map((entry) => entry.url);
  assert.ok(
    urls.includes(
      "https://www.danielnash.co/products/ai-career-operating-system",
    ),
  );

  const llmsText = await readFile(
    new URL("../public/llms.txt", import.meta.url),
    "utf8",
  );
  assert.match(
    llmsText,
    /https:\/\/www\.danielnash\.co\/products\/ai-career-operating-system/,
  );
  assert.match(llmsText, /governed integration/i);
});

test("AI Career Operating System final visual assets are present", async () => {
  const assetDirectory = new URL(
    "../public/images/products/ai-career-operating-system/",
    import.meta.url,
  );
  const assetNames = [
    "governed-ai-workflow-career-evidence.png",
    "claim-to-evidence-engine.png",
    "portfolio-guide-grounding-improvement.png",
    "six-advisory-review-agents.png",
  ];

  await Promise.all(
    assetNames.map((assetName) => access(new URL(assetName, assetDirectory))),
  );
});
