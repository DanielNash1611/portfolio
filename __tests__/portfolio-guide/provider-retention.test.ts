import assert from "node:assert/strict";
import test from "node:test";
import type OpenAI from "openai";
import { deleteStoredOpenAIResponses } from "@/lib/portfolio-guide/provider-retention";

test("stored response deletion deduplicates ids and treats missing responses as deleted", async () => {
  const deletedCalls: string[] = [];
  const client = {
    responses: {
      del: async (responseId: string) => {
        deletedCalls.push(responseId);
        if (responseId === "missing") {
          throw { status: 404 };
        }
        if (responseId === "failed") {
          throw { status: 500 };
        }
      },
    },
  } as unknown as OpenAI;
  const result = await deleteStoredOpenAIResponses(
    ["ok", "ok", "missing", "failed"],
    { client },
  );
  assert.deepEqual(deletedCalls, ["ok", "missing", "failed"]);
  assert.deepEqual(result.deleted, ["ok", "missing"]);
  assert.deepEqual(result.failed, ["failed"]);
});
