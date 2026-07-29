import assert from "node:assert/strict";
import test from "node:test";
import { redactTracePayload } from "@/lib/portfolio-guide/trace";

test("trace payload redaction removes credentials recursively", () => {
  const redacted = redactTracePayload({
    authorization: "Bearer secret",
    nested: {
      apiKey: "sk-test",
      safe: "visible",
      headers: { cookie: "session=value" },
    },
  });

  assert.equal(redacted.authorization, "[redacted]");
  assert.deepEqual(redacted.nested, {
    apiKey: "[redacted]",
    safe: "visible",
    headers: { cookie: "[redacted]" },
  });
});
