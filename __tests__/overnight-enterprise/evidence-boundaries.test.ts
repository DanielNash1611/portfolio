import test from "node:test";
import { nearestVisibleStage } from "../../components/overnight-enterprise/useNarrativeStages";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
const read = (file: string) =>
  readFileSync(path.join(process.cwd(), file), "utf8").replace(/\s+/g, " ");

test("pilot keeps experimental scope, estimated impact and human/data safeguards together", () => {
  const page = read("app/products/chatgpt-contact-center/page.tsx");
  for (const evidence of [
    /15.agent/i,
    /matched control/i,
    /estimated ~\$2\.7M annualized impact/,
    /no PCI or PII/,
    /double-checking generated copy/,
    /not realized annual revenue/,
  ])
    assert.match(page, evidence);
  assert.doesNotMatch(page, /validating product-market fit/);
});
test("organization scope is not added to the pilot or contact-center cohort", () => {
  const page = read("app/products/chatgpt-org-scale/page.tsx");
  assert.match(page, /1,000 licensed users/);
  assert.match(page, /800 active users/);
  assert.match(page, /scopes should not be added together/);
  assert.match(page, /COE groundwork/);
  assert.match(page, /not present-day adoption/);
});
test("OMS preserves public simulation, internal milestones, and the boundary on business impact", () => {
  const page = read("app/products/oms-chatgpt-app/page.tsx");
  assert.match(page, /public prototype \+ internal production work/i);
  assert.match(page, /March 2026/);
  assert.match(page, /April 2026/);
  assert.match(
    page,
    /do not establish organization-wide adoption or measured business impact/,
  );
  assert.match(page, /human-in-the-loop cancellation/);
  assert.doesNotMatch(
    page,
    /Represents a functional concept rather than a production deployment/,
  );
  for (const image of [
    ...page.matchAll(/src: "(\/images\/oms-chatgpt-app\/[^"\n]+)"/g),
  ])
    assert.ok(existsSync(path.join(process.cwd(), "public", image[1])));
});
test("interactive views preserve keyboard-native controls, state announcements and reduced motion", () => {
  for (const file of ["DecisionExplorer.tsx", "OmsWorkflow.tsx"]) {
    const component = read(`components/overnight-enterprise/${file}`);
    assert.match(component, /<button/);
    assert.match(component, /aria-pressed/);
    assert.match(component, /aria-live="polite"/);
  }
  assert.match(
    read("components/overnight-enterprise/enterprise.css"),
    /prefers-reduced-motion: reduce/,
  );
});

test("scroll narratives preserve every stage and provide a local reading mode", () => {
  for (const file of ["DecisionExplorer.tsx", "OmsWorkflow.tsx"]) {
    const source = read(`components/overnight-enterprise/${file}`);
    assert.match(source, /\.map\(/);
    assert.match(source, /data-enterprise-stage/);
    assert.match(source, /data-reading=\{reading\}/);
    assert.match(source, /Read this sequence without motion/);
    assert.doesNotMatch(
      source,
      /display:\s*none|preventDefault|onWheel|onTouchMove/,
    );
  }
  const hook = read("components/overnight-enterprise/useNarrativeStages.ts");
  assert.match(hook, /IntersectionObserver/);
  assert.match(hook, /observer\.disconnect/);
  assert.doesNotMatch(hook, /preventDefault|addEventListener\("wheel"/);
});

test("authored motion graphics explain the evidence without fabricated chart or org claims", () => {
  const source = read("components/overnight-enterprise/NarrativeGraphic.tsx");
  assert.match(source, /not a performance chart/);
  assert.match(source, /not reporting lines/);
  assert.match(source, /does not execute order actions/);
  assert.match(source, /aria-hidden="true"/);
  const styles = read("components/overnight-enterprise/enterprise.css");
  assert.match(styles, /prefers-reduced-motion: reduce/);
  assert.match(styles, /data-reading="true"/);
});

test("scroll selection uses current geometry after a stage jump", () => {
  assert.equal(
    nearestVisibleStage(
      [
        { index: 0, top: -420, bottom: 166 },
        { index: 1, top: 166, bottom: 800 },
        { index: 2, top: 800, bottom: 1400 },
      ],
      682,
    ),
    1,
  );
  assert.equal(
    nearestVisibleStage(
      [
        { index: 0, top: -1000, bottom: -500 },
        { index: 1, top: -500, bottom: 105 },
        { index: 2, top: 105, bottom: 700 },
      ],
      682,
    ),
    2,
  );
  assert.equal(
    nearestVisibleStage([{ index: 0, top: 900, bottom: 1400 }], 682),
    undefined,
  );
});
