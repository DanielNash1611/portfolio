import assert from "node:assert/strict";
import test from "node:test";
import {
  getPortfolioGuideModel,
  PORTFOLIO_GUIDE_DEFAULT_MODEL,
} from "@/lib/portfolio-guide/model";

test("Terra is the approved guide default, with a guide-specific override ahead of the shared model", () => {
  assert.equal(PORTFOLIO_GUIDE_DEFAULT_MODEL, "gpt-5.6-terra");
  assert.equal(getPortfolioGuideModel({ NODE_ENV: "test" }), "gpt-5.6-terra");
  assert.equal(
    getPortfolioGuideModel({ NODE_ENV: "test", OPENAI_MODEL: "shared-model" }),
    "shared-model",
  );
  assert.equal(
    getPortfolioGuideModel({
      NODE_ENV: "test",
      PORTFOLIO_GUIDE_MODEL: "guide-model",
      OPENAI_MODEL: "shared-model",
    }),
    "guide-model",
  );
});
