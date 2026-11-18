import assert from "node:assert/strict";
import test from "node:test";
import { scrollGravityPose } from "@/lib/experience/world";
import {
  gravityCelloCamera,
  gravityCelloSound,
  normalizeGravityPoint,
} from "@/lib/experience/gravity-camera";

test("the scroll excerpt restores identical force-integrated poses and trails in either direction", () => {
  const entrance = scrollGravityPose(0.2);
  const middle = scrollGravityPose(0.45);
  const exit = scrollGravityPose(0.8);
  assert.notDeepEqual(entrance.sources, middle.sources);
  assert.notDeepEqual(middle.sources, exit.sources);
  assert.deepEqual(scrollGravityPose(0.45), middle);
  assert.deepEqual(scrollGravityPose(0.2), entrance);
  assert.deepEqual(scrollGravityPose(0.8), exit);
  assert.deepEqual(scrollGravityPose(0.45), middle);
  assert.deepEqual(middle.sources[0], [0, 0, 0]);
  assert.notDeepEqual(middle.sources[1], middle.sources[2]);
  for (let performer = 0; performer < 2; performer++) {
    assert.equal(middle.trails[performer].length, 70);
    assert.deepEqual(
      middle.trails[performer][0],
      middle.sources[performer + 1],
    );
    assert.notDeepEqual(
      middle.trails[performer][69],
      middle.sources[performer + 1],
    );
  }
  assert.deepEqual(scrollGravityPose(-1), scrollGravityPose(0));
  assert.deepEqual(scrollGravityPose(NaN), scrollGravityPose(0));
  assert.deepEqual(scrollGravityPose(2), scrollGravityPose(1));
});

test("asset normalization preserves Gravity's actual low string-level camera and sound pose", () => {
  assert.deepEqual(gravityCelloCamera.position, [0, -0.23, 0.905]);
  assert.deepEqual(gravityCelloCamera.target, [0, 1.47, 0.02]);
  assert.equal(gravityCelloCamera.fov, 33);
  const center = [0.02, 1.1, -0.03] as const;
  const scale = 1.2;
  const eye = normalizeGravityPoint(gravityCelloCamera.position, center, scale);
  const target = normalizeGravityPoint(
    gravityCelloCamera.target,
    center,
    scale,
  );
  const sound = normalizeGravityPoint(gravityCelloSound, center, scale);
  for (let axis = 0; axis < 3; axis++) {
    assert.ok(
      Math.abs(
        (target[axis] - eye[axis]) / scale -
          (gravityCelloCamera.target[axis] - gravityCelloCamera.position[axis]),
      ) < 1e-12,
    );
    assert.ok(
      Math.abs(
        (sound[axis] - eye[axis]) / scale -
          (gravityCelloSound[axis] - gravityCelloCamera.position[axis]),
      ) < 1e-12,
    );
  }
  assert.ok(target[1] > eye[1], "The cello pose looks up along the strings");
});
