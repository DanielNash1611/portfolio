import { parseArgs } from "node:util";
import { createDatabaseClient, getDatabaseUrl } from "@/lib/db";
import { loadAppEnv } from "@/scripts/load-app-env";

function parseSince(input: string): Date {
  const match = input.trim().match(/^(\d+)([hd])$/i);
  if (!match) {
    throw new Error(`Invalid --since value "${input}". Use 12h or 30d.`);
  }
  const amount = Number(match[1]);
  const multiplier = match[2].toLowerCase() === "h" ? 3600000 : 86400000;
  return new Date(Date.now() - amount * multiplier);
}

async function main() {
  loadAppEnv();
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      since: { type: "string" },
      conversation: { type: "string" },
      limit: { type: "string" },
      json: { type: "boolean" },
    },
    allowPositionals: false,
  });
  const databaseUrl = getDatabaseUrl("unpooled");
  if (!databaseUrl) {
    throw new Error("DATABASE_URL_UNPOOLED or DATABASE_URL is required.");
  }
  const sql = createDatabaseClient(databaseUrl);
  const limit = Math.max(1, Math.min(Number.parseInt(values.limit ?? "20", 10), 100));
  const since = parseSince(values.since ?? "30d");

  if (!values.conversation) {
    const conversations = await sql.query(
      `
        SELECT
          c.id,
          c.status,
          c.created_at,
          c.updated_at,
          c.expires_at,
          COUNT(DISTINCT i.id)::int AS turns,
          COUNT(DISTINCT i.id) FILTER (WHERE i.response_status = 'errored')::int AS errors,
          COALESCE(ARRAY_AGG(DISTINCT i.page_slug) FILTER (WHERE i.page_slug IS NOT NULL), ARRAY[]::text[]) AS pages,
          COUNT(t.id) FILTER (WHERE t.event_type = 'tool')::int AS tool_events
        FROM portfolio_guide_conversations c
        LEFT JOIN portfolio_guide_interactions i ON i.conversation_id = c.id
        LEFT JOIN portfolio_guide_trace_events t ON t.interaction_id = i.id
        WHERE c.updated_at >= $1
        GROUP BY c.id
        ORDER BY c.updated_at DESC
        LIMIT $2
      `,
      [since.toISOString(), limit],
    );
    if (values.json) {
      console.info(JSON.stringify(conversations, null, 2));
      return;
    }
    console.info(`Portfolio Guide conversations since ${since.toISOString()}`);
    for (const row of conversations as Array<Record<string, unknown>>) {
      console.info(
        `- ${String(row.id).slice(0, 8)} status=${row.status} turns=${row.turns} errors=${row.errors} tools=${row.tool_events} pages=${(row.pages as string[]).join(",") || "none"} updated=${row.updated_at}`,
      );
    }
    return;
  }

  const conversationRows = (await sql.query(
    `
      SELECT id, status, created_at, updated_at, expires_at, session_memory
      FROM portfolio_guide_conversations
      WHERE id::text = $1 OR id::text LIKE $1 || '%'
      ORDER BY updated_at DESC
      LIMIT 2
    `,
    [values.conversation],
  )) as Array<Record<string, unknown>>;
  if (conversationRows.length !== 1) {
    throw new Error(
      conversationRows.length === 0
        ? "Conversation not found."
        : "Conversation prefix is ambiguous; provide more characters.",
    );
  }
  const conversation = conversationRows[0];
  const turns = (await sql.query(
    `
      SELECT
        id, request_id, turn_index, page_slug, source, prompt_text, assistant_text,
        response_status, model, prompt_version, openai_response_ids, usage_json,
        prompt_snapshot, normalization_status, evidence_metadata, response_latency_ms, error_code,
        created_at, completed_at
      FROM portfolio_guide_interactions
      WHERE conversation_id = $1
      ORDER BY turn_index ASC
    `,
    [conversation.id],
  )) as Array<Record<string, unknown>>;
  const traces = (await sql.query(
    `
      SELECT interaction_id, sequence, event_type, event_name, payload, duration_ms, created_at
      FROM portfolio_guide_trace_events
      WHERE interaction_id = ANY($1::uuid[])
      ORDER BY created_at ASC, sequence ASC
    `,
    [turns.map((turn) => turn.id)],
  )) as Array<Record<string, unknown>>;

  if (values.json) {
    console.info(JSON.stringify({ conversation, turns, traces }, null, 2));
    return;
  }

  console.info(`Conversation ${conversation.id}`);
  console.info(
    `status=${conversation.status} created=${conversation.created_at} updated=${conversation.updated_at} expires=${conversation.expires_at}`,
  );
  console.info(`memory=${JSON.stringify(conversation.session_memory)}`);
  for (const turn of turns) {
    console.info(`\n[${turn.turn_index}] ${turn.page_slug} status=${turn.response_status}`);
    console.info(
      `model=${turn.model ?? "unknown"} prompt=${turn.prompt_version ?? "unknown"} latency=${turn.response_latency_ms ?? "n/a"}ms normalization=${turn.normalization_status ?? "n/a"}`,
    );
    console.info(`USER: ${turn.prompt_text}`);
    console.info(`ASSISTANT: ${turn.assistant_text ?? `(no answer: ${turn.error_code ?? "pending"})`}`);
    console.info(`responses=${(turn.openai_response_ids as string[]).join(",") || "none"}`);
    const turnTraces = traces.filter((trace) => trace.interaction_id === turn.id);
    for (const trace of turnTraces) {
      console.info(
        `  trace#${trace.sequence} ${trace.event_type}:${trace.event_name} duration=${trace.duration_ms ?? "n/a"}ms`,
      );
    }
  }
}

main().catch((error) => {
  console.error("Portfolio Guide conversation report failed:", error);
  process.exitCode = 1;
});
