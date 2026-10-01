import { createDatabaseClient, getDatabaseUrl } from "@/lib/db";
import { loadAppEnv } from "@/scripts/load-app-env";

type CountRow = { count: number };
type PageRow = { page_path: string; views: number; visitors: number };
type EventRow = { event_name: string; events: number; visitors: number };
type ScrollRow = { threshold: number; visitors: number };

function parseDays(): number {
  const raw = process.argv.find((arg) => arg.startsWith("--days="));
  const value = Number(raw?.split("=")[1] ?? 7);
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 7;
}

async function main() {
  loadAppEnv();

  const databaseUrl = getDatabaseUrl("pooled");
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const days = parseDays();
  const sql = createDatabaseClient(databaseUrl);
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [visitorRow] = (await sql.query(
    `
      SELECT COUNT(DISTINCT visitor_id)::int AS count
      FROM analytics_events
      WHERE app = 'portfolio' AND app_env = 'production' AND occurred_at < now() AND occurred_at >= $1
    `,
    [since.toISOString()],
  )) as CountRow[];

  const [sessionRow] = (await sql.query(
    `
      SELECT COUNT(DISTINCT session_id)::int AS count
      FROM analytics_events
      WHERE app = 'portfolio' AND app_env = 'production' AND occurred_at < now() AND occurred_at >= $1
    `,
    [since.toISOString()],
  )) as CountRow[];

  const pages = (await sql.query(
    `
      SELECT
        page_path,
        COUNT(*)::int AS views,
        COUNT(DISTINCT visitor_id)::int AS visitors
      FROM analytics_events
      WHERE
        app = 'portfolio' AND app_env = 'production' AND occurred_at < now()
        AND event_name = 'page_viewed'
        AND occurred_at >= $1
        AND page_path IS NOT NULL
      GROUP BY page_path
      ORDER BY views DESC, page_path ASC
      LIMIT 20
    `,
    [since.toISOString()],
  )) as PageRow[];

  const events = (await sql.query(
    `
      SELECT
        event_name,
        COUNT(*)::int AS events,
        COUNT(DISTINCT visitor_id)::int AS visitors
      FROM analytics_events
      WHERE app = 'portfolio' AND app_env = 'production' AND occurred_at < now() AND occurred_at >= $1
      GROUP BY event_name
      ORDER BY events DESC, event_name ASC
    `,
    [since.toISOString()],
  )) as EventRow[];

  const scroll = (await sql.query(
    `
      SELECT
        CASE WHEN properties->>'threshold' IN ('25','50','75','100') THEN (properties->>'threshold')::int END AS threshold,
        COUNT(DISTINCT visitor_id)::int AS visitors
      FROM analytics_events
      WHERE
        app = 'portfolio' AND app_env = 'production' AND occurred_at < now()
        AND event_name = 'scroll_depth_reached'
        AND occurred_at >= $1
      GROUP BY threshold
      ORDER BY threshold ASC
    `,
    [since.toISOString()],
  )) as ScrollRow[];

  console.info(`Daniel Analytics · portfolio · last ${days} days`);
  console.info(`Visitors: ${visitorRow?.count ?? 0}`);
  console.info(`Sessions: ${sessionRow?.count ?? 0}`);

  console.info("\nTop pages");
  console.table(pages);

  console.info("\nEvents");
  console.table(events);

  console.info("\nScroll depth");
  console.table(scroll);
}

main().catch((error) => {
  console.error("Analytics report failed:", error);
  process.exitCode = 1;
});
