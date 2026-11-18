import test from "node:test";
import assert from "node:assert/strict";
import {
  ensemblePlayers,
  scoreLeafFrame,
  scoreNoteFrame,
  scoreOvertureTravel,
  scoreSequenceFrame,
} from "../../lib/experience/score-sequence";

test("the visible orchestra gathers before center, left and right pages physically unfold", () => {
  assert.equal(scoreSequenceFrame(0).gather, 0);
  assert.equal(scoreSequenceFrame(0.3).gather, 1);
  for (const index of [0, 1, 2])
    assert.equal(scoreLeafFrame(0.3, index).amount, 0);
  assert.ok(scoreLeafFrame(0.5, 1).amount > 0);
  assert.equal(scoreLeafFrame(0.5, 0).amount, 0);
  assert.equal(scoreLeafFrame(0.5, 2).amount, 0);
  assert.equal(scoreLeafFrame(0.68, 1).amount, 1);
  assert.ok(scoreLeafFrame(0.68, 0).amount > 0);
  assert.equal(scoreLeafFrame(0.68, 2).amount, 0);
  // Both outer edges must rotate toward the reader, above the backing plane.
  assert.ok(scoreLeafFrame(0.65, 0).rotateY > 0);
  assert.ok(scoreLeafFrame(0.83, 2).rotateY < 0);
  assert.ok(!scoreSequenceFrame(0.94).ready);
  for (const index of [0, 1, 2]) {
    const leaf = scoreLeafFrame(1, index);
    assert.equal(leaf.amount, 1);
    assert.equal(leaf.rotateX, 0);
    assert.equal(leaf.rotateY, 0);
  }
  assert.ok(scoreSequenceFrame(1).ready);
});

test("all 52 orchestra notes land inside the real score on desktop and phone before engraved ink takes over", () => {
  assert.equal(ensemblePlayers.length, 52);
  assert.equal(
    new Set(ensemblePlayers.map((p) => `${p.part}/${p.note}`)).size,
    52,
  );
  for (const mobile of [false, true]) {
    const orchestra = {
      x: mobile ? 24 : 540,
      y: mobile ? 310 : 150,
      width: mobile ? 300 : 500,
      height: mobile ? 154 : 256,
    };
    const folio = {
      x: 30,
      y: 240,
      width: mobile ? 330 : 1080,
      height: mobile ? 440 : 455,
    };
    for (const player of ensemblePlayers) {
      const start = scoreNoteFrame(0, player, orchestra, folio, mobile);
      assert.equal(start.settle, 0);
      assert.equal(start.opacity, 1);
      const end = scoreNoteFrame(1, player, orchestra, folio, mobile);
      assert.equal(end.settle, 1);
      assert.equal(end.opacity, 0);
      assert.ok(end.x > folio.x && end.x < folio.x + folio.width);
      assert.ok(
        end.y > folio.y + folio.height * 0.5 &&
          end.y < folio.y + folio.height * 0.87,
      );
      assert.ok(end.scale > 0);
      assert.equal(end.rotate, 0);
    }
    assert.equal(scoreSequenceFrame(1).engraving, 1);
  }
});

test("page and note travel are continuous, deterministic and reversible under fast scrubbing", () => {
  const orchestra = { x: 540, y: 160, width: 500, height: 256 },
    folio = { x: 50, y: 260, width: 1080, height: 455 };
  const values = Array.from({ length: 1001 }, (_, i) => i / 1000);
  const sample = (p: number) => ({
    frame: scoreSequenceFrame(p),
    leaves: [0, 1, 2].map((i) => scoreLeafFrame(p, i)),
    notes: ensemblePlayers.map((n) =>
      scoreNoteFrame(p, n, orchestra, folio, false),
    ),
  });
  const forward = values.map(sample),
    backward = [...values].reverse().map(sample).reverse();
  assert.deepEqual(forward, backward);
  for (let i = 1; i < forward.length; i++) {
    for (let n = 0; n < 52; n++)
      assert.ok(
        Math.hypot(
          forward[i].notes[n].x - forward[i - 1].notes[n].x,
          forward[i].notes[n].y - forward[i - 1].notes[n].y,
        ) < 15,
      );
    for (let leaf = 0; leaf < 3; leaf++)
      assert.ok(
        forward[i].leaves[leaf].amount >= forward[i - 1].leaves[leaf].amount,
      );
  }
});

test("invalid and out-of-range progress stays finite and scroll budgets include a visible unfolding beat", () => {
  assert.deepEqual(scoreSequenceFrame(NaN), scoreSequenceFrame(0));
  assert.deepEqual(scoreSequenceFrame(-1), scoreSequenceFrame(0));
  assert.deepEqual(scoreSequenceFrame(2), scoreSequenceFrame(1));
  for (const p of [NaN, -1, 0, 0.5, 1, 2])
    for (const index of [0, 1, 2]) {
      const frame = scoreLeafFrame(p, index);
      assert.ok(
        [frame.amount, frame.opacity, frame.rotateX, frame.rotateY].every(
          Number.isFinite,
        ),
      );
    }
  assert.ok(scoreOvertureTravel(687) > 687);
  assert.ok(scoreOvertureTravel(569) > 569);
  assert.ok(Number.isFinite(scoreOvertureTravel(NaN)));
});
