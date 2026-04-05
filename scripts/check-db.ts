import {
  createDatabaseClient,
  getAppEnv,
  getDatabaseBranchName,
  getDatabaseUrl,
} from "@/lib/db";
import { loadAppEnv } from "@/scripts/load-app-env";

async function main() {
  loadAppEnv();

  const databaseUrl = getDatabaseUrl("unpooled");
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL_UNPOOLED or DATABASE_URL must be configured before checking the database.",
    );
  }

  const sql = createDatabaseClient(databaseUrl);
  const [databaseInfo] = (await sql.query(
    "SELECT current_database() AS database_name, now() AS checked_at",
  )) as Array<{ database_name: string; checked_at: string }>;
  const [tableStatus] = (await sql.query(
    `
      SELECT TO_REGCLASS('public.portfolio_guide_interactions') AS table_name
    `,
  )) as Array<{ table_name: string | null }>;
  const [contactTableStatus] = (await sql.query(
    `
      SELECT
        TO_REGCLASS('public.contact_submissions') AS contact_submissions,
        TO_REGCLASS('public.contact_rate_limits') AS contact_rate_limits
    `,
  )) as Array<{
    contact_rate_limits: string | null;
    contact_submissions: string | null;
  }>;
  const tableExists = Boolean(tableStatus?.table_name);
  const contactSubmissionsExists = Boolean(
    contactTableStatus?.contact_submissions,
  );
  const contactRateLimitsExists = Boolean(
    contactTableStatus?.contact_rate_limits,
  );
  const [rowCounts] = tableExists
    ? ((await sql.query(
        `
          SELECT
            COUNT(*)::int AS total_rows,
            COUNT(*) FILTER (WHERE response_status = 'answered')::int AS answered_rows,
            COUNT(*) FILTER (WHERE response_status = 'errored')::int AS errored_rows
          FROM portfolio_guide_interactions
        `,
      )) as Array<{
        total_rows: number;
        answered_rows: number;
        errored_rows: number;
      }>)
    : [{ total_rows: 0, answered_rows: 0, errored_rows: 0 }];

  console.info(`APP_ENV=${getAppEnv()}`);
  console.info(`DATABASE_BRANCH_NAME=${getDatabaseBranchName()}`);
  console.info(`Database=${databaseInfo?.database_name ?? "unknown"}`);
  console.info(`Checked at=${databaseInfo?.checked_at ?? "unknown"}`);
  console.info(
    `portfolio_guide_interactions=${tableExists ? "present" : "missing"}`,
  );
  console.info(
    `contact_submissions=${contactSubmissionsExists ? "present" : "missing"}`,
  );
  console.info(
    `contact_rate_limits=${contactRateLimitsExists ? "present" : "missing"}`,
  );

  if (tableExists) {
    console.info(`Rows=${rowCounts?.total_rows ?? 0}`);
    console.info(`Answered=${rowCounts?.answered_rows ?? 0}`);
    console.info(`Errored=${rowCounts?.errored_rows ?? 0}`);
  }

  if (!contactSubmissionsExists || !contactRateLimitsExists) {
    console.info(
      "Contact form tables are missing. Run `npm run db:migrate` or apply `migrations/002_contact_form.sql` in Neon.",
    );
  }
}

main().catch((error) => {
  console.error("Database check failed:", error);
  process.exitCode = 1;
});
