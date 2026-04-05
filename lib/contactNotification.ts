import type { SavedContactSubmission } from "@/lib/contactSubmissions";

export async function sendContactNotification(
  submission: SavedContactSubmission,
): Promise<void> {
  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  const contactToEmail = process.env.CONTACT_TO_EMAIL?.trim();
  const contactFromEmail = process.env.CONTACT_FROM_EMAIL?.trim();

  if (!resendApiKey || !contactToEmail || !contactFromEmail) {
    throw new Error("Missing contact email configuration.");
  }

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: contactFromEmail,
      to: [contactToEmail],
      reply_to: submission.email,
      subject: submission.subject
        ? `Portfolio contact: ${submission.subject}`
        : `Portfolio contact from ${submission.name}`,
      text: [
        "New portfolio contact submission",
        "",
        `Name: ${submission.name}`,
        `Email: ${submission.email}`,
        ...(submission.subject ? [`Subject: ${submission.subject}`] : []),
        `Submitted at: ${submission.createdAt}`,
        `IP: ${submission.ip}`,
        ...(submission.userAgent
          ? [`User-Agent: ${submission.userAgent}`]
          : []),
        "",
        "Message:",
        submission.message,
      ].join("\n"),
    }),
  });

  if (resendResponse.ok) {
    return;
  }

  let errorMessage = "Unable to deliver contact notification.";

  try {
    const data = await resendResponse.json();
    errorMessage =
      data?.message ?? data?.error?.message ?? data?.error ?? errorMessage;
  } catch {
    // Ignore parse failures and use the generic message.
  }

  throw new Error(errorMessage);
}
