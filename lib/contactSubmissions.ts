import { getDatabaseClient } from "@/lib/db";

export type ContactSubmissionInput = {
  email: string;
  fingerprint?: string | null;
  ip: string;
  message: string;
  name: string;
  subject?: string | null;
  userAgent?: string | null;
};

export type SavedContactSubmission = {
  createdAt: string;
  email: string;
  id: number;
  ip: string;
  message: string;
  name: string;
  subject: string | null;
  userAgent: string | null;
};

type ContactSubmissionSaver = (
  input: ContactSubmissionInput,
) => Promise<SavedContactSubmission>;

let contactSubmissionSaverOverride: ContactSubmissionSaver | null = null;

async function defaultContactSubmissionSaver({
  email,
  fingerprint,
  ip,
  message,
  name,
  subject,
  userAgent,
}: ContactSubmissionInput): Promise<SavedContactSubmission> {
  const sql = getDatabaseClient();
  const [row] = (await sql.query(
    `
      INSERT INTO contact_submissions (
        name,
        email,
        subject,
        message,
        ip,
        fingerprint,
        user_agent
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING
        id,
        name,
        email,
        subject,
        message,
        ip,
        user_agent,
        created_at
    `,
    [
      name,
      email,
      subject ?? null,
      message,
      ip,
      fingerprint ?? null,
      userAgent ?? null,
    ],
  )) as Array<{
    created_at: string;
    email: string;
    id: number;
    ip: string;
    message: string;
    name: string;
    subject: string | null;
    user_agent: string | null;
  }>;

  if (!row) {
    throw new Error("Failed to store contact submission.");
  }

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    subject: row.subject,
    message: row.message,
    ip: row.ip,
    userAgent: row.user_agent,
    createdAt: row.created_at,
  };
}

export async function saveContactSubmission(
  input: ContactSubmissionInput,
): Promise<SavedContactSubmission> {
  if (contactSubmissionSaverOverride) {
    return contactSubmissionSaverOverride(input);
  }

  return defaultContactSubmissionSaver(input);
}

export function setContactSubmissionSaverForTests(
  saver: ContactSubmissionSaver | null,
) {
  contactSubmissionSaverOverride = saver;
}
