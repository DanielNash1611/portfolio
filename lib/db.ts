import { neon } from "@neondatabase/serverless";

export type DatabaseClient = ReturnType<typeof neon>;

let cachedDatabaseClient: DatabaseClient | null = null;

function normalizeEnvValue(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

export function getAppEnv(): string {
  return (
    normalizeEnvValue(process.env.APP_ENV) ??
    (process.env.NODE_ENV === "production" ? "production" : "local")
  );
}

export function getDatabaseBranchName(): string {
  return (
    normalizeEnvValue(process.env.DATABASE_BRANCH_NAME) ??
    (getAppEnv() === "production" ? "production" : "development")
  );
}

export function getDatabaseUrl(
  kind: "pooled" | "unpooled" = "pooled",
): string | undefined {
  const pooledUrl = normalizeEnvValue(process.env.DATABASE_URL);
  const unpooledUrl = normalizeEnvValue(process.env.DATABASE_URL_UNPOOLED);

  if (kind === "unpooled") {
    return unpooledUrl ?? pooledUrl;
  }

  return pooledUrl;
}

export function isDatabaseConfigured(
  kind: "pooled" | "unpooled" = "pooled",
): boolean {
  return Boolean(getDatabaseUrl(kind));
}

export function createDatabaseClient(databaseUrl: string): DatabaseClient {
  return neon(databaseUrl);
}

export function getDatabaseClient(): DatabaseClient {
  if (cachedDatabaseClient) {
    return cachedDatabaseClient;
  }

  const databaseUrl = getDatabaseUrl("pooled");
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }

  cachedDatabaseClient = createDatabaseClient(databaseUrl);
  return cachedDatabaseClient;
}

