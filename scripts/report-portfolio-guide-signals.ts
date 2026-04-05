import { parseArgs } from "node:util";
import { createDatabaseClient, getDatabaseUrl } from "@/lib/db";
import { loadAppEnv } from "@/scripts/load-app-env";

type SinceUnit = "h" | "d";

function parseSinceArgument(input: string): Date {
  const match = input.trim().match(/^(\d+)([hd])$/i);
  if (!match) {
    throw new Error(
      `Invalid --since value "${input}". Use formats like 12h or 30d.`,
    );
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase() as SinceUnit;
  const multiplier = unit === "h" ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

  return new Date(Date.now() - amount * multiplier);
}

function renderTable(title: string, rows: string[]) {
  console.info(`\n${title}`);
  if (rows.length === 0) {
    console.info("- none");
    return;
  }

  for (const row of rows) {
    console.info(`- ${row}`);
  }
}

async function main() {
  loadAppEnv();

  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      since: { type: "string" },
      env: { type: "string" },
      limit: { type: "string" },
    },
    allowPositionals: false,
  });

  const databaseUrl = getDatabaseUrl("unpooled");
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL_UNPOOLED or DATABASE_URL must be configured before reporting.",
    );
  }

  const since = parseSinceArgument(values.since ?? "30d");
  const limit = Number.parseInt(values.limit ?? "10", 10);
  const appEnv = values.env ?? "production";
  const sql = createDatabaseClient(databaseUrl);

  const [summary] = (await sql.query(
    `
      SELECT
        COUNT(*)::int AS total_rows,
        COUNT(*) FILTER (WHERE response_status = 'answered')::int AS answered_rows,
        COUNT(*) FILTER (WHERE response_status = 'errored')::int AS errored_rows,
        COUNT(*) FILTER (WHERE response_status = 'unavailable')::int AS unavailable_rows
      FROM portfolio_guide_interactions
      WHERE created_at >= $1
        AND app_env = $2
    `,
    [since.toISOString(), appEnv],
  )) as Array<{
    total_rows: number;
    answered_rows: number;
    errored_rows: number;
    unavailable_rows: number;
  }>;

  const topPrompts = (await sql.query(
    `
      SELECT prompt_text, COUNT(*)::int AS prompt_count
      FROM portfolio_guide_interactions
      WHERE created_at >= $1
        AND app_env = $2
      GROUP BY prompt_text
      ORDER BY prompt_count DESC, MAX(created_at) DESC
      LIMIT $3
    `,
    [since.toISOString(), appEnv, limit],
  )) as Array<{ prompt_text: string; prompt_count: number }>;

  const topPages = (await sql.query(
    `
      SELECT page_slug, COUNT(*)::int AS prompt_count
      FROM portfolio_guide_interactions
      WHERE created_at >= $1
        AND app_env = $2
      GROUP BY page_slug
      ORDER BY prompt_count DESC, MAX(created_at) DESC
      LIMIT $3
    `,
    [since.toISOString(), appEnv, limit],
  )) as Array<{ page_slug: string; prompt_count: number }>;

  const topRoles = (await sql.query(
    `
      SELECT
        COALESCE(NULLIF(role_normalized_title, ''), '(unspecified)') AS role_label,
        COUNT(*)::int AS prompt_count
      FROM portfolio_guide_interactions
      WHERE created_at >= $1
        AND app_env = $2
      GROUP BY role_label
      ORDER BY prompt_count DESC, MAX(created_at) DESC
      LIMIT $3
    `,
    [since.toISOString(), appEnv, limit],
  )) as Array<{ role_label: string; prompt_count: number }>;

  const sourceMix = (await sql.query(
    `
      SELECT source, COUNT(*)::int AS prompt_count
      FROM portfolio_guide_interactions
      WHERE created_at >= $1
        AND app_env = $2
      GROUP BY source
      ORDER BY prompt_count DESC, source ASC
    `,
    [since.toISOString(), appEnv],
  )) as Array<{ source: string; prompt_count: number }>;

  const promptThemes = (await sql.query(
    `
      SELECT
        COALESCE(NULLIF(role_normalized_title, ''), '(unspecified)') AS role_label,
        ARRAY_TO_STRING(interest_tags, ', ') AS interest_label,
        COUNT(*)::int AS prompt_count
      FROM portfolio_guide_interactions
      WHERE created_at >= $1
        AND app_env = $2
      GROUP BY role_label, interest_label
      ORDER BY prompt_count DESC, role_label ASC
      LIMIT $3
    `,
    [since.toISOString(), appEnv, limit],
  )) as Array<{
    role_label: string;
    interest_label: string | null;
    prompt_count: number;
  }>;

  console.info(`Portfolio Guide signals since ${since.toISOString()} for env=${appEnv}`);
  console.info(`Rows=${summary?.total_rows ?? 0}`);
  console.info(`Answered=${summary?.answered_rows ?? 0}`);
  console.info(`Errored=${summary?.errored_rows ?? 0}`);
  console.info(`Unavailable=${summary?.unavailable_rows ?? 0}`);

  renderTable(
    "Top prompts",
    topPrompts.map(
      (row) => `${row.prompt_count}x ${row.prompt_text}`,
    ),
  );
  renderTable(
    "Top pages",
    topPages.map((row) => `${row.prompt_count}x ${row.page_slug}`),
  );
  renderTable(
    "Top normalized roles",
    topRoles.map((row) => `${row.prompt_count}x ${row.role_label}`),
  );
  renderTable(
    "Source mix",
    sourceMix.map((row) => `${row.prompt_count}x ${row.source}`),
  );
  renderTable(
    "Role and tag themes",
    promptThemes.map(
      (row) =>
        `${row.prompt_count}x ${row.role_label} / ${row.interest_label || "(no tags)"}`,
    ),
  );
}

main().catch((error) => {
  console.error("Portfolio Guide reporting failed:", error);
  process.exitCode = 1;
});
