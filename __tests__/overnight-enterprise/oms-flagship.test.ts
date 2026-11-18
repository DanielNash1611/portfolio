import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  omsBeats,
  omsCrops,
  omsBeatAt,
  omsBeatTarget,
  omsLookupPan,
  omsScrollProgress,
  omsFocusForProgress,
  omsFocusTargets,
} from "../../components/overnight-enterprise/oms-evidence";

test("each native stage target lands inside its intended scroll beat", () => {
  for (let index = 0; index < omsBeats.length; index++)
    assert.equal(omsBeatAt(omsBeatTarget(index)), index);
  for (const [value, expected] of [
    [-1, 0],
    [0, 0],
    [0.199, 0],
    [0.2, 1],
    [0.4, 2],
    [0.6, 3],
    [0.8, 4],
    [1, 4],
    [4, 4],
    [NaN, 0],
  ])
    assert.equal(omsBeatAt(value), expected);
});
test("five decisions stay tied to three authentic screenshot states", () => {
  assert.deepEqual(
    omsBeats.map((beat) => beat.screen),
    [0, 1, 1, 1, 2],
  );
  assert.match(omsBeats[2].detail, /CANCEL 1002/);
  assert.match(omsBeats[3].detail, /No, keep order/);
  assert.match(omsBeats[3].detail, /Yes, cancel this order/);
  assert.match(omsBeats[4].detail, /recorded result/);
});
test("presentation crops stay inside the actual source image bounds", () => {
  const files = [
    "order-items-chatgpt.png",
    "cancellation-guardrails-chatgpt.png",
    "cancelled-state-chatgpt.png",
  ];
  omsCrops.forEach((crop, index) => {
    const png = readFileSync(`public/images/oms-chatgpt-app/${files[index]}`);
    assert.equal(png.readUInt32BE(16), crop.sourceWidth);
    assert.equal(png.readUInt32BE(20), crop.sourceHeight);
    assert.ok(
      crop.x >= 0 &&
        crop.y >= 0 &&
        crop.x + crop.width <= crop.sourceWidth &&
        crop.y + crop.height <= crop.sourceHeight,
    );
  });
});
test("order-summary pan reaches the last pixels without panning beyond the artifact", () => {
  assert.equal(omsLookupPan(342, 420), 0);
  assert.ok(omsLookupPan(610, 330) < 0);
  assert.equal(omsLookupPan(1000, 330), omsLookupPan(610, 330));
  for (const [width, height] of [
    [610, 330],
    [542, 340],
    [342, 300],
  ]) {
    const croppedHeight = (Math.min(width, 610) * 568) / 572;
    assert.ok(
      Math.abs(croppedHeight + omsLookupPan(width, height) - height) < 0.001,
    );
  }
});
test("reading fallback exposes all original states and scope limits without a wheel handler", () => {
  const component = readFileSync(
    "components/overnight-enterprise/OmsFlagship.tsx",
    "utf8",
  ).replace(/\s+/g, " ");
  assert.match(component, /function StaticSequence/);
  assert.match(component, /screens\.map/);
  assert.match(component, /prefers-reduced-motion: reduce/);
  assert.match(component, /motionQuery.addEventListener/);
  assert.match(component, /motionQuery.removeEventListener/);
  assert.match(component, /useOmsScrollProgress/);
  assert.match(component, /do not prove backend enforcement/);
  assert.doesNotMatch(
    component,
    /onWheel|onTouchMove|addEventListener\(["']wheel/,
  );
});

test("native scroll progress respects the header and clamps outside the sequence", () => {
  assert.equal(omsScrollProgress(61, 2864, 682), 0);
  assert.equal(omsScrollProgress(61 - (2864 - 682 + 61) / 2, 2864, 682), 0.5);
  assert.equal(omsScrollProgress(61 - (2864 - 682 + 61), 2864, 682), 1);
  assert.equal(omsScrollProgress(1200, 2864, 682), 0);
  assert.equal(omsScrollProgress(-4000, 2864, 682), 1);
  assert.equal(omsScrollProgress(80, 2864, 682, 80), 0);
});
test("continuous progress observer is passive, coalesced and cleaned up", () => {
  const hook = readFileSync(
    "components/overnight-enterprise/useOmsScrollProgress.ts",
    "utf8",
  ).replace(/\s+/g, " ");
  assert.match(hook, /passive: true/);
  assert.match(hook, /requestAnimationFrame/);
  assert.match(hook, /cancelAnimationFrame/);
  assert.match(hook, /removeEventListener/);
  assert.match(hook, /observer\?\.disconnect/);
  assert.doesNotMatch(
    hook,
    /preventDefault|addEventListener\(["']wheel|touchmove/,
  );
});

test("intermediate scroll positions never associate the warning label with another control", () => {
  for (const p of [0.2, 0.28, 0.37, 0.38, 0.39, 0.3999])
    assert.equal(omsFocusForProgress(p), "warning");
  for (const p of [0.4, 0.4001, 0.41, 0.42, 0.48, 0.57, 0.5999])
    assert.equal(omsFocusForProgress(p), "phrase");
  for (const p of [0.6, 0.61, 0.68, 0.77, 0.7999])
    assert.equal(omsFocusForProgress(p), "choice");
  for (const p of [0, 0.19, 0.8, 0.92, 1])
    assert.equal(omsFocusForProgress(p), undefined);
  for (const target of omsFocusTargets) {
    assert.ok(target.top + target.height <= 100);
    assert.ok(target.left + target.width <= 100);
  }
});
