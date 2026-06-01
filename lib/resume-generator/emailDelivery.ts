import { RESUME_MOCK_LABEL } from "./types";

type GeneratedResumeEmailInput = {
  recipientEmail: string;
  ccDaniel: boolean;
  note?: string;
  /**
   * True when the attached PDF was produced by a non-production mock/stub
   * engine. Derived from server result metadata only. When true the subject and
   * body are clearly labeled so a recruiter can never mistake it for a real
   * resume (see RESUME_MOCK_LABEL).
   */
  mock?: boolean;
  pdf: {
    bytes: Uint8Array;
    filename: string;
  };
  job: {
    jobId: string;
    company?: string;
    roleTitle?: string;
    fitSummary?: string;
  };
  contactUrl: string;
};

export class ResumeEmailConfigurationError extends Error {
  constructor(message = "Missing resume email configuration.") {
    super(message);
    this.name = "ResumeEmailConfigurationError";
  }
}

export class ResumeEmailSendError extends Error {
  constructor(message = "Unable to send generated resume email.") {
    super(message);
    this.name = "ResumeEmailSendError";
  }
}

function requireEmailConfig(): {
  resendApiKey: string;
  contactToEmail: string;
  contactFromEmail: string;
} {
  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  const contactToEmail = process.env.CONTACT_TO_EMAIL?.trim();
  const contactFromEmail = process.env.CONTACT_FROM_EMAIL?.trim();

  if (!resendApiKey || !contactToEmail || !contactFromEmail) {
    throw new ResumeEmailConfigurationError();
  }

  return { resendApiKey, contactToEmail, contactFromEmail };
}

function base64(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("base64");
}

function safeSubjectPart(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function buildTextBody(input: GeneratedResumeEmailInput, contactEmail: string): string {
  const role = safeSubjectPart(input.job.roleTitle);
  const company = safeSubjectPart(input.job.company);
  const target = [role, company].filter(Boolean).join(" at ");
  const lines: string[] = [];

  if (input.mock) {
    lines.push(
      `*** ${RESUME_MOCK_LABEL} ***`,
      "",
      "This is mock/test output from a non-production engine. It is NOT a real",
      "tailored resume and must not be used externally.",
      "",
    );
  }

  lines.push(
    "Hi,",
    "",
    `Daniel Nash's tailored resume${target ? ` for ${target}` : ""} is attached.`,
  );

  if (input.job.fitSummary) {
    lines.push("", "Fit summary:", input.job.fitSummary);
  }

  if (input.note?.trim()) {
    lines.push("", "Your note:", input.note.trim());
  }

  if (!input.ccDaniel) {
    lines.push(
      "",
      "Daniel is not CC'd on this email.",
      `You can contact him at ${input.contactUrl} or mailto:${contactEmail}.`,
    );
  }

  lines.push(
    "",
    "This resume was generated from Daniel's verified experience and the job description you provided.",
  );

  return lines.join("\n");
}

export async function sendGeneratedResumeEmail(
  input: GeneratedResumeEmailInput,
): Promise<void> {
  const { resendApiKey, contactToEmail, contactFromEmail } = requireEmailConfig();
  const role = safeSubjectPart(input.job.roleTitle);
  const company = safeSubjectPart(input.job.company);
  const subjectTarget = [role, company].filter(Boolean).join(" at ");
  const text = buildTextBody(input, contactToEmail);
  const baseSubject = subjectTarget
    ? `Daniel Nash tailored resume: ${subjectTarget}`
    : "Daniel Nash tailored resume";
  const subject = input.mock ? `[${RESUME_MOCK_LABEL}] ${baseSubject}` : baseSubject;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: contactFromEmail,
      to: [input.recipientEmail],
      ...(input.ccDaniel ? { cc: [contactToEmail] } : {}),
      reply_to: contactToEmail,
      subject,
      text,
      attachments: [
        {
          filename: input.pdf.filename,
          content: base64(input.pdf.bytes),
        },
      ],
      headers: {
        "X-Resume-Job-Id": input.job.jobId,
      },
    }),
  });

  if (response.ok) {
    return;
  }

  throw new ResumeEmailSendError();
}
