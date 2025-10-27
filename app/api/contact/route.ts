import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { name, email, message } = payload ?? {};

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields." },
        { status: 400 }
      );
    }

    console.info("[contact]", { name, email, message });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact:error]", error);
    return NextResponse.json(
      { ok: false, error: "Unable to process request." },
      { status: 500 }
    );
  }
}
