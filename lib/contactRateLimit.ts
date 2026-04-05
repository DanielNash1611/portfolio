import { getDatabaseClient } from "@/lib/db";

const contactRateLimitWindowMinutes = 60;
const maxContactAttemptsPerWindow = 5;

type ContactRateLimitInput = {
  fingerprint?: string | null;
  ip: string;
};

type ContactRateLimitResult = {
  attemptCount: number;
  limited: boolean;
};

type ContactRateLimitChecker = (
  input: ContactRateLimitInput,
) => Promise<ContactRateLimitResult>;

let contactRateLimitCheckerOverride: ContactRateLimitChecker | null = null;

async function defaultContactRateLimitChecker({
  ip,
  fingerprint,
}: ContactRateLimitInput): Promise<ContactRateLimitResult> {
  const sql = getDatabaseClient();
  const [countRow] = (await sql.query(
    `
      SELECT COUNT(*)::int AS attempt_count
      FROM contact_rate_limits
      WHERE ip = $1
        AND created_at >= now() - interval '${contactRateLimitWindowMinutes} minutes'
    `,
    [ip],
  )) as Array<{ attempt_count: number }>;

  const attemptCount = countRow?.attempt_count ?? 0;

  if (attemptCount >= maxContactAttemptsPerWindow) {
    return { limited: true, attemptCount };
  }

  await sql.query(
    `
      INSERT INTO contact_rate_limits (ip, fingerprint)
      VALUES ($1, $2)
    `,
    [ip, fingerprint ?? null],
  );

  return { limited: false, attemptCount: attemptCount + 1 };
}

export async function checkAndRecordContactRateLimit(
  input: ContactRateLimitInput,
): Promise<ContactRateLimitResult> {
  if (contactRateLimitCheckerOverride) {
    return contactRateLimitCheckerOverride(input);
  }

  return defaultContactRateLimitChecker(input);
}

export function setContactRateLimitCheckerForTests(
  checker: ContactRateLimitChecker | null,
) {
  contactRateLimitCheckerOverride = checker;
}
