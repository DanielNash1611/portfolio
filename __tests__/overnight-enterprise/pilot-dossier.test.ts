import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  pilotMetrics,
  pilotBeats,
  pilotBeatAt,
  pilotTarget,
  pilotBarPercent,
  formatPilotValue,
} from "../../components/overnight-enterprise/pilot-evidence";

test("pilot endpoint transcription preserves both groups from primary slide 12", () => {
  assert.deepEqual(
    pilotMetrics.map((m) => [
      m.id,
      m.test.before,
      m.test.after,
      m.control.before,
      m.control.after,
    ]),
    [
      ["aov", 804, 867, 851, 782],
      ["conversion", 3.27, 7.73, 3.76, 7.14],
      ["rpc", 26, 67, 32, 56],
    ],
  );
  assert.equal(pilotMetrics[1].control.change, "+90%");
  assert.equal(pilotMetrics[2].control.change, "+75%");
});
test("comparison graphics use a shared zero-based scale within each metric", () => {
  for (const metric of pilotMetrics)
    for (const value of [
      metric.test.before,
      metric.test.after,
      metric.control.before,
      metric.control.after,
    ]) {
      const width = pilotBarPercent(metric, value);
      assert.ok(width >= 0 && width <= 100);
    }
  assert.equal(pilotBarPercent(pilotMetrics[2], 26), 32.5);
  assert.equal(pilotBarPercent(pilotMetrics[2], 32), 40);
  assert.equal(pilotBarPercent(pilotMetrics[2], 67), 83.75);
  assert.equal(formatPilotValue(pilotMetrics[1], 3.27), "3.27%");
  assert.equal(formatPilotValue(pilotMetrics[2], 26), "$26");
});
test("study, observed endpoints, annualized estimate and expansion decision stay separate", () => {
  assert.deepEqual(
    pilotBeats.map((b) => b.kind),
    ["study", "metric", "metric", "metric", "estimate", "decision"],
  );
  assert.equal(pilotBeats.filter((b) => b.kind === "metric").length, 3);
  for (let i = 0; i < pilotBeats.length; i++)
    assert.equal(pilotBeatAt(pilotTarget(i)), i);
  for (const [p, index] of [
    [0, 0],
    [0.1665, 0],
    [0.167, 1],
    [0.3334, 2],
    [0.5, 3],
    [0.6667, 4],
    [0.8334, 5],
    [1, 5],
    [-1, 0],
  ])
    assert.equal(pilotBeatAt(p), index);
});
test("exact adjusted-control label and reusable canonical integration are present", () => {
  const source = readFileSync(
    "components/overnight-enterprise/PilotDossier.tsx",
    "utf8",
  ).replace(/\s+/g, " ");
  assert.match(source, /Per Week, Adjusted/);
  assert.match(source, /export function PilotEvidenceDossier/);
  assert.match(source, /embedded forceReading=\{forceReading\}/);
  assert.match(source, /Not realized annual revenue/);
  assert.doesNotMatch(source, /onWheel|onTouchMove/);
});
test("the source artifact is the inspected 1280 by 720 slide render", () => {
  const png = readFileSync(
    "components/overnight-enterprise/pilot-source-slide12.png",
  );
  assert.equal(png.readUInt32BE(16), 1280);
  assert.equal(png.readUInt32BE(20), 720);
  const page = readFileSync(
    "app/products/chatgpt-contact-center/page.tsx",
    "utf8",
  );
  assert.match(page, /longer customer conversations/);
  assert.doesNotMatch(
    page,
    /consistently outperformed control across each vector/,
  );
});
