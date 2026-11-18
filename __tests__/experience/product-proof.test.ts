import test from "node:test";
import assert from "node:assert/strict";
import {
  canPinProductProof,
  orderProofProducts,
  productProofFrame,
  productProofLocal,
  productProofTarget,
  productProofTravel,
  proofEase,
} from "../../lib/experience/product-proof";

test("authentic artifacts stay bound to the named product when feature order changes", () => {
  const items = [
    { slug: "immunology-scout", title: "Scout" },
    { slug: "oms-chatgpt-app", title: "OMS" },
    { slug: "ai-career-operating-system", title: "Career" },
  ];
  assert.deepEqual(
    orderProofProducts(items)?.map((item) => item.title),
    ["OMS", "Career", "Scout"],
  );
  assert.equal(orderProofProducts(items.slice(0, 2)), null);
  assert.equal(
    orderProofProducts([
      ...items.slice(0, 2),
      { slug: "another-product", title: "Other" },
    ]),
    null,
  );
});

test("product proof conserves project order and direct controls target both actual decision views", () => {
  for (let project = 0; project < 3; project++) {
    for (let step = 0; step < (project === 2 ? 3 : 2); step++) {
      const target = productProofTarget(project, step);
      const frame = productProofFrame(target);
      assert.equal(frame.project, project);
      assert.equal(frame.step, step);
      assert.ok(frame.local > 0 && frame.local < 1);
    }
  }
  let last = 0;
  for (let i = 0; i <= 1000; i++) {
    const frame = productProofFrame(i / 1000);
    assert.ok(frame.project >= last);
    assert.ok(frame.project <= 2);
    last = frame.project;
  }
});

test("artifact movement is bounded, continuous and reverses along the same native-scroll path", () => {
  const sample = (p: number) =>
    [0, 1, 2].map((project) => {
      const local = productProofLocal(p, project);
      return proofEase(local, 0.24, 0.84);
    });
  const values = Array.from({ length: 1001 }, (_, i) => i / 1000);
  const forward = values.map(sample);
  assert.deepEqual(forward, [...values].reverse().map(sample).reverse());
  for (let i = 1; i < forward.length; i++)
    for (let project = 0; project < 3; project++) {
      assert.ok(forward[i][project] >= forward[i - 1][project]);
      assert.ok(forward[i][project] - forward[i - 1][project] < 0.01);
    }
  assert.deepEqual(productProofFrame(NaN), productProofFrame(0));
  assert.deepEqual(productProofFrame(2), productProofFrame(1));
});

test("small viewports use normal flow and scroll travel remains finite and bounded", () => {
  assert.equal(canPinProductProof(375, 667), false);
  assert.equal(canPinProductProof(626, 762), true);
  assert.equal(canPinProductProof(626, 720), false);
  assert.equal(canPinProductProof(390, 844), true);
  assert.equal(canPinProductProof(1280, 682), true);
  assert.equal(canPinProductProof(900, NaN), false);
  for (const height of [-1, 554, 687, 731, 1400, NaN]) {
    assert.ok(productProofTravel(height) >= 1500);
    assert.ok(productProofTravel(height) <= 2400);
  }
});
