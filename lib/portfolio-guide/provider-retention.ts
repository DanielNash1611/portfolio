import OpenAI from "openai";

function isAlreadyDeleted(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }
  const status = "status" in error ? (error as { status?: unknown }).status : undefined;
  return status === 404;
}

export async function deleteStoredOpenAIResponses(
  responseIds: string[],
  options?: { client?: OpenAI },
): Promise<{ deleted: string[]; failed: string[] }> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey && !options?.client) {
    return { deleted: [], failed: responseIds };
  }
  const client = options?.client ?? new OpenAI({ apiKey });
  const deleted: string[] = [];
  const failed: string[] = [];
  for (const responseId of [...new Set(responseIds)].filter(Boolean)) {
    try {
      await client.responses.del(responseId);
      deleted.push(responseId);
    } catch (error) {
      if (isAlreadyDeleted(error)) {
        deleted.push(responseId);
      } else {
        failed.push(responseId);
      }
    }
  }
  return { deleted, failed };
}
