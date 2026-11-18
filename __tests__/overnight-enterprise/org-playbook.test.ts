import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  orgAdoption,
  orgChapterAt,
  orgTargets,
} from "../../components/overnight-enterprise/org-evidence";

test("organization snapshots preserve licenses and active users without a daily window", () => {
  assert.deepEqual(orgAdoption, {
    earlier: { licensed: 150, active: 40 },
    later: { licensed: 1000, active: 800 },
  });
  const page = readFileSync("app/products/chatgpt-org-scale/page.tsx", "utf8");
  assert.doesNotMatch(page, /daily active users|800 DAU/);
  assert.match(page, /COE groundwork/);
  assert.match(page, /scopes should not be added together/);
});
test("chapter selection remains bounded at native-scroll transitions", () => {
  for (const [value, expected] of [
    [-1, 0],
    [0, 0],
    [0.2499, 0],
    [0.25, 1],
    [0.4999, 1],
    [0.5, 2],
    [0.7499, 2],
    [0.75, 3],
    [1, 3],
    [NaN, 0],
  ])
    assert.equal(orgChapterAt(value), expected);
  orgTargets.forEach((target, index) =>
    assert.equal(orgChapterAt(target), index),
  );
});
test("the training-plan source is the inspected slide render", () => {
  const png = readFileSync(
    "components/overnight-enterprise/org-source-slide23.png",
  );
  assert.equal(png.readUInt32BE(16), 1280);
  assert.equal(png.readUInt32BE(20), 720);
});
