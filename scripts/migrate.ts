import path from "node:path";
import { readdir, readFile } from "node:fs/promises";
import {
  createDatabaseClient,
  getAppEnv,
  getDatabaseBranchName,
  getDatabaseUrl,
} from "@/lib/db";
import { loadAppEnv } from "@/scripts/load-app-env";

const MIGRATIONS_TABLE = "app_migrations";

function splitSqlStatements(sqlText: string): string[] {
  return sqlText
    .split(/;\s*(?:\r?\n|$)/)
    .map((statement) => statement.trim())
    .filter(Boolean);
}

async function ensureMigrationsTable(
  sql: ReturnType<typeof createDatabaseClient>,
) {
  await sql.query(`
    CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
      filename text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `);
}

async function main() {
  const args = process.argv.slice(2);
  const only =
    args.length === 1 && /^--only=[0-9]{3}_[a-z0-9_]+\.sql$/.test(args[0])
      ? args[0].slice(7)
      : undefined;
  if (args.length && !only)
    throw new Error("Invalid migration arguments; use --only=filename.sql.");
  loadAppEnv();

  const databaseUrl = getDatabaseUrl("unpooled");
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL_UNPOOLED or DATABASE_URL must be configured before running migrations.",
    );
  }

  const sql = createDatabaseClient(databaseUrl);
  await ensureMigrationsTable(sql);

  const migrationsDir = path.join(process.cwd(), "migrations");
  const migrationFiles = (await readdir(migrationsDir))
    .filter(
      (filename) => filename.endsWith(".sql") && (!only || filename === only),
    )
    .sort();
  if (only && !migrationFiles.length)
    throw new Error("Requested migration file does not exist.");

  const appliedRows = (await sql.query(
    `SELECT filename FROM ${MIGRATIONS_TABLE} ORDER BY filename ASC`,
  )) as Array<{ filename: string }>;
  const appliedSet = new Set(appliedRows.map((row) => row.filename));

  console.info(
    `Running migrations for APP_ENV=${getAppEnv()} on branch=${getDatabaseBranchName()}`,
  );

  for (const filename of migrationFiles) {
    if (appliedSet.has(filename)) {
      console.info(`Skipping ${filename} (already applied)`);
      continue;
    }

    const sqlText = await readFile(path.join(migrationsDir, filename), "utf8");
    const statements = splitSqlStatements(sqlText);

    if (statements.length === 0) {
      console.info(`Skipping ${filename} (empty file)`);
      continue;
    }

    await sql.transaction((txn) => [
      ...statements.map((statement) => txn.query(statement)),
      txn.query(
        `INSERT INTO ${MIGRATIONS_TABLE} (filename) VALUES ($1) ON CONFLICT (filename) DO NOTHING`,
        [filename],
      ),
    ]);

    console.info(`Applied ${filename}`);
  }

  console.info("Migrations complete.");
}

main().catch((error) => {
  console.error(
    error instanceof Error &&
      /^(Invalid migration|Requested migration|DATABASE_URL_UNPOOLED)/.test(
        error.message,
      )
      ? error.message
      : "Database migration failed. Check configuration and the validated schema state.",
  );
  process.exitCode = 1;
});
