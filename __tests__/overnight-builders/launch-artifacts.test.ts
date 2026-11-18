import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";
import {
  launchCampaignArtifacts,
  launchBriefFocus,
} from "../../components/overnight-builders/launch-campaign-content";

test("campaign evidence retains public original captures and bounded focus regions", async () => {
  assert.equal(launchCampaignArtifacts.length, 2);
  for (const item of launchCampaignArtifacts) {
    await access(`public${item.image}`);
    assert.match(item.alt, /generated planning output/);
    assert.match(item.alt, /not (?:campaign results|evidence of publication)/);
  }
  assert.deepEqual(
    launchCampaignArtifacts.map((item) => item.image),
    [
      "/images/launchmuse/week-2-grid.png",
      "/images/launchmuse/tuning-systems-card.png",
    ],
  );
  for (const crop of launchBriefFocus) {
    assert.ok(crop.top >= 0 && crop.height > 0);
    assert.ok(crop.top + crop.height <= launchCampaignArtifacts[1].height);
  }
});
