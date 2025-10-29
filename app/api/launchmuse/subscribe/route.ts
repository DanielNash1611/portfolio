import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";

const emailPattern =
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const allowedRoles = new Set(["Artist", "Manager", "Label", "Other"]);

export async function POST(request: NextRequest) {
  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
  const formId = process.env.HUBSPOT_FORM_ID;
  const siteBaseUrl = process.env.SITE_BASE_URL;

  if (!token || !formId || !siteBaseUrl) {
    return NextResponse.json(
      { ok: false, error: "Server configuration error." },
      { status: 500 }
    );
  }

  let payload: {
    email?: string;
    name?: string;
    role?: string;
    consent?: boolean;
    company?: string;
  };

  try {
    payload = await request.json();
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  const email = payload.email?.trim();
  const name = payload.name?.trim();
  const role = payload.role?.trim() ?? "";
  const consent = Boolean(payload.consent);
  const company = payload.company?.trim() ?? "";

  if (!email || !emailPattern.test(email)) {
    return NextResponse.json(
      { ok: false, error: "A valid email is required." },
      { status: 400 }
    );
  }

  if (company.length > 0) {
    return NextResponse.json(
      { ok: false, error: "Submission rejected." },
      { status: 400 }
    );
  }

  if (role && !allowedRoles.has(role)) {
    return NextResponse.json(
      { ok: false, error: "Invalid role selection." },
      { status: 400 }
    );
  }

  const hutk = cookies().get("hubspotutk")?.value;
  const forwardedFor = headers()
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();
  const ipAddress = forwardedFor || request.ip || undefined;

  const hubspotPayload: Record<string, unknown> = {
    submittedAt: Date.now(),
    fields: [
      { name: "email", value: email },
      ...(name ? [{ name: "firstname", value: name }] : []),
      ...(role ? [{ name: "lm_role", value: role }] : []),
      {
        name: "consent_to_communicate",
        value: consent ? "true" : "false"
      }
    ],
    context: {
      hutk,
      pageUri: `${siteBaseUrl.replace(/\/$/, "")}/products/launchmuse`,
      pageName: "LaunchMuse – Early Access",
      ipAddress
    }
  };

  try {
    const hubspotResponse = await fetch(
      `https://api.hubapi.com/marketing/v3/forms/${formId}/submissions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(hubspotPayload)
      }
    );

    if (!hubspotResponse.ok) {
      let errorMessage = "HubSpot returned an error.";
      try {
        const data = await hubspotResponse.json();
        errorMessage =
          data?.message || data?.errors?.[0]?.message || errorMessage;
      } catch {
        // ignore parse error
      }
      return NextResponse.json(
        { ok: false, error: errorMessage },
        { status: hubspotResponse.status }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[launchmuse:subscribe]", error);
    return NextResponse.json(
      { ok: false, error: "Unable to submit to HubSpot." },
      { status: 502 }
    );
  }
}
