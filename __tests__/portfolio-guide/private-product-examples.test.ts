import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import sharp from "sharp";
import {
  privateProductExamples,
  privateProductScreenshotCredits,
} from "../../content/projects/private-product-examples";
import { productEntries } from "../../content/portfolio";
import { getPageContextByPath } from "../../lib/portfolio-guide/context";
import { getNamedProjectIds } from "../../lib/portfolio-guide/project-references";
import { getPortfolioSearchDocuments } from "../../lib/portfolio-guide/search";
import sitemap from "../../app/sitemap";

const reviewedScreenshotHashes: Record<string, string> = {
  "/images/products/original-reader/reading.jpg":
    "75e841c4d6ebd9698295797b9ea36982018f07c6f91a16991893e0e2969b8eef",
  "/images/products/original-reader/filters.jpg":
    "193e55d7a3edfb55b8d973e372029ec98223bb0342e581813985000cd11e8e65",
  "/images/products/temple-stories/salt-lake-overview.jpg":
    "73a6f063e6d6d69e823d6c467225527291980f6601cf443328ca89744a56c358",
};

test("private product examples stay discoverable with approved local screenshots and no deployment links", async () => {
  for (const entry of privateProductExamples) {
    assert.ok(productEntries.includes(entry));
    assert.ok(existsSync(`app${entry.href}/page.tsx`));
    assert.ok(sitemap().some((item) => item.url.endsWith(entry.href)));
    assert.equal(entry.status, "Privately deployed");
    assert.ok(entry.heroImage.startsWith(`/images/products/${entry.slug}/`));
    assert.ok(entry.visuals.length > 0);
    for (const visual of entry.visuals) {
      const imagePath = visual.image;
      assert.ok(imagePath);
      assert.ok(imagePath.startsWith(`/images/products/${entry.slug}/`));
      const image = readFileSync(`public${imagePath}`);
      assert.equal(
        createHash("sha256").update(image).digest("hex"),
        reviewedScreenshotHashes[imagePath],
      );
      assert.ok(imagePath.endsWith(".jpg"));
      assert.equal(image.subarray(0, 3).toString("hex"), "ffd8ff");
      const metadata = await sharp(image).metadata();
      assert.equal(metadata.format, "jpeg");
      assert.ok((metadata.width ?? 0) >= 300);
      assert.ok((metadata.height ?? 0) >= 300);
      assert.ok(visual.alt);
      assert.equal(visual.imageFit, "contain");
    }
    assert.deepEqual(entry.featuredMetrics, []);
    assert.equal(entry.actions, undefined);
    assert.doesNotMatch(JSON.stringify(entry), /https?:\/\//);
    assert.deepEqual(getNamedProjectIds(entry.title), [entry.slug]);
  }
  assert.equal(privateProductExamples[0].visuals.length, 2);
  assert.equal(privateProductExamples[1].visuals.length, 1);
  const credit = privateProductScreenshotCredits["temple-stories"];
  assert.equal(credit.creator, "DAVID ILIFF (Diliff)");
  assert.equal(credit.license, "CC BY 2.5");
  assert.equal(
    credit.licenseUrl,
    "https://creativecommons.org/licenses/by/2.5/",
  );
  assert.match(
    credit.sourceUrl,
    /^https:\/\/commons\.wikimedia\.org\/wiki\/File:Salt_Lake_Temple/,
  );
  assert.match(credit.changes, /cropped and resized/);
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
  assert.match(template, /ProductScreenshotCredit slug=\{entry.slug\}/);
  const creditComponent = readFileSync(
    "components/site/ProductScreenshotCredit.tsx",
    "utf8",
  );
  assert.match(creditComponent, /credit.sourceUrl/);
  assert.match(creditComponent, /credit.licenseUrl/);
  assert.match(
    readFileSync("app/products/page.tsx", "utf8"),
    /imageAttribution: <ProductScreenshotCredit/,
  );
  assert.match(template, /!object-contain/);
});
