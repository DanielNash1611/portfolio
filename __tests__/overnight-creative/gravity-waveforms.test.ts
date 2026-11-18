import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import recordings from "../../components/overnight-creative/gravity-waveforms.json";

test("displayed source waveforms remain bound to the exact original recordings", () => {
  assert.equal(recordings.length, 3);
  for (const track of recordings) {
    const source = readFileSync(join(process.cwd(), "public", track.src));
    assert.equal(
      createHash("sha256").update(source).digest("hex"),
      track.sha256,
      `${track.title} waveform needs regeneration after source change`,
    );
    assert.equal(track.peaks.length, 128);
    assert.ok(
      track.peaks.every(
        (peak) => Number.isFinite(peak) && peak >= 0 && peak <= 1,
      ),
    );
    assert.equal(
      Math.max(...track.peaks),
      1,
      "each source uses its own normalized amplitude",
    );
    assert.ok(track.duration > 0);
  }
});

test("short-pattern duration labels agree with their WAV container metadata", () => {
  for (const track of recordings.filter((track) =>
    track.src.endsWith(".wav"),
  )) {
    const source = readFileSync(join(process.cwd(), "public", track.src));
    let byteRate = 0,
      dataBytes = 0;
    for (let offset = 12; offset + 8 <= source.length; ) {
      const type = source.toString("ascii", offset, offset + 4),
        size = source.readUInt32LE(offset + 4);
      if (type === "fmt ") byteRate = source.readUInt32LE(offset + 16);
      if (type === "data") {
        dataBytes = size;
        break;
      }
      offset += 8 + size + (size % 2);
    }
    assert.ok(byteRate > 0 && dataBytes > 0);
    assert.ok(
      Math.abs(dataBytes / byteRate - track.duration) < 0.00001,
      track.title,
    );
  }
});
