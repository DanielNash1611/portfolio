import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { getDatabaseClient } from "../lib/db";
import {
  normalizeFeedback,
  networkKey,
  saveFeedback,
  pruneFeedback,
} from "../lib/feedback";

test(
  "isolated feedback writes: idempotency, conflicts, concurrent rate limit, and retention",
  { skip: !process.env.ANALYTICS_TEST_HOST },
  async () => {
    assert.equal(
      new URL(process.env.DATABASE_URL!).hostname,
      process.env.ANALYTICS_TEST_HOST,
    );
    assert.equal(process.env.DATABASE_BRANCH_NAME, "feedback-validation");
    assert.equal(process.env.APP_ENV, "validation");
    try {
      const sql = getDatabaseClient();
      const payload = () =>
        normalizeFeedback({
          clientSubmissionId: randomUUID(),
          category: "problem",
          message: "Synthetic isolated integration feedback.",
          pagePath: "/resume",
        })!;
      const initial = payload(),
        key = networkKey(randomUUID(), "synthetic-test-secret");
      assert.equal(await saveFeedback(initial, key), "stored");
      assert.equal(await saveFeedback(initial, key), "stored");
      assert.equal(
        await saveFeedback(
          { ...initial, message: "A different synthetic message." },
          key,
        ),
        "conflict",
      );
      const limitKey = networkKey(randomUUID(), "synthetic-test-secret");
      const writes = await Promise.all(
        Array.from({ length: 8 }, () => saveFeedback(payload(), limitKey)),
      );
      assert.equal(writes.filter((r) => r === "stored").length, 5);
      assert.equal(writes.filter((r) => r === "limited").length, 3);
      assert.equal(
        (
          await sql.query<false, false>(
            "SELECT submissions FROM analytics_feedback_rate_limits WHERE network_key=$1",
            [limitKey],
          )
        )[0].submissions,
        5,
      );
      const expired = randomUUID(),
        kept = randomUUID(),
        oldKey = networkKey(randomUUID(), "synthetic-test-secret");
      await sql.query(
        `INSERT INTO analytics_feedback (id,client_submission_id,received_at,app,app_env,database_branch_name,category,message,page_path,visitor_id,session_id)
      VALUES ($1,$2,now()-interval '91 days','portfolio','validation','feedback-validation','general','Synthetic expired feedback.','/','visitor_expired','session_expired'),
      ($3,$4,now()-interval '89 days','portfolio','validation','feedback-validation','general','Synthetic retained feedback.','/',NULL,NULL)`,
        [expired, randomUUID(), kept, randomUUID()],
      );
      await sql.query(
        "INSERT INTO analytics_feedback_rate_limits (network_key,window_start,submissions) VALUES ($1,now()-interval '25 hours',1)",
        [oldKey],
      );
      await pruneFeedback();
      assert.equal(
        (
          await sql.query<false, false>(
            "SELECT id FROM analytics_feedback WHERE id=$1",
            [expired],
          )
        ).length,
        0,
      );
      assert.equal(
        (
          await sql.query<false, false>(
            "SELECT id FROM analytics_feedback WHERE id=$1",
            [kept],
          )
        ).length,
        1,
      );
      assert.equal(
        (
          await sql.query<false, false>(
            "SELECT network_key FROM analytics_feedback_rate_limits WHERE network_key=$1",
            [oldKey],
          )
        ).length,
        0,
      );
    } catch (error) {
      if (error instanceof Error && error.name === "AssertionError")
        throw error;
      throw new Error(
        "Isolated feedback write/retention validation failed; no driver details displayed.",
      );
    }
  },
);
