export type PortfolioGuideTraceEvent = {
  sequence: number;
  eventType: "model" | "tool" | "guardrail" | "persistence" | "error";
  eventName: string;
  payload: Record<string, unknown>;
  durationMs?: number;
};

const REDACTED_KEYS = /(?:api[-_]?key|authorization|token|secret|password|cookie)/i;
const MAX_TRACE_STRING_LENGTH = 12000;
const MAX_TRACE_ARRAY_LENGTH = 100;
const MAX_TRACE_DEPTH = 8;

function sanitizeValue(value: unknown, depth: number): unknown {
  if (depth > MAX_TRACE_DEPTH) {
    return "[depth-limited]";
  }
  if (typeof value === "string") {
    return value.length > MAX_TRACE_STRING_LENGTH
      ? `${value.slice(0, MAX_TRACE_STRING_LENGTH)}...[truncated]`
      : value;
  }
  if (Array.isArray(value)) {
    return value
      .slice(0, MAX_TRACE_ARRAY_LENGTH)
      .map((item) => sanitizeValue(item, depth + 1));
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [
        key,
        REDACTED_KEYS.test(key) ? "[redacted]" : sanitizeValue(item, depth + 1),
      ]),
    );
  }
  return value;
}

export function redactTracePayload(
  payload: Record<string, unknown>,
): Record<string, unknown> {
  return sanitizeValue(payload, 0) as Record<string, unknown>;
}
