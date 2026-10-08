import { NextRequest, NextResponse } from "next/server";
import { getClientIp, isAllowedOrigin } from "@/lib/contact";
import {
  emptySuggestions,
  hasSuggestionSource,
  parseSuggestionInput,
} from "@/lib/product-workspace/suggestions";
import { generateSuggestions } from "@/lib/product-workspace/suggestion-service";
import {
  checkSuggestionLimit,
  matchesRequestHost,
  readBoundedJson,
} from "@/lib/product-workspace/suggestion-limits";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const json = (
  body: unknown,
  status = 200,
  headers: Record<string, string> = {},
) =>
  NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });

export async function POST(request: NextRequest) {
  if (
    !request.headers.get("origin") ||
    (!isAllowedOrigin(request) && !matchesRequestHost(request))
  )
    return json({ error: "This request must come from the playbook." }, 403);
  if (!request.headers.get("content-type")?.includes("application/json"))
    return json({ error: "Expected a JSON draft." }, 415);
  let input;
  try {
    input = parseSuggestionInput(await readBoundedJson(request));
  } catch {
    return json(
      {
        error:
          "Couldn’t read these notes. Keep the shared context under 6,000 characters.",
      },
      400,
    );
  }
  if (!input)
    return json(
      {
        error:
          "Keep the idea, shared context, and tree titles under 6,000 characters in total.",
      },
      400,
    );
  if (!hasSuggestionSource(input))
    return json({ suggestions: emptySuggestions() });
  if (!process.env.OPENAI_API_KEY)
    return json(
      {
        error:
          "AI suggestions are unavailable. Your local draft is still editable.",
      },
      503,
    );
  let retryAfter;
  try {
    retryAfter = await checkSuggestionLimit(getClientIp(request));
  } catch {
    // Production never falls back to an instance-local paid-call quota.
    return json(
      {
        error:
          "AI suggestions are temporarily unavailable. Your local draft is still editable.",
      },
      503,
    );
  }
  if (retryAfter)
    return json(
      {
        error:
          "You’ve reached the suggestion limit. Try again in a few minutes; your draft is unchanged.",
      },
      429,
      { "Retry-After": String(retryAfter) },
    );
  try {
    const suggestions = await generateSuggestions(
      input,
      process.env.OPENAI_API_KEY,
      request.signal,
    );
    return json({ suggestions });
  } catch {
    // Do not log notes, provider payloads, or credentials.
    return json(
      {
        error:
          "Suggestions couldn’t be completed. Nothing changed in your draft. You can try again.",
      },
      502,
    );
  }
}
