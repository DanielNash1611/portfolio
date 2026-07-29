import { randomUUID } from "node:crypto";
import { getAppEnv, getDatabaseBranchName, getDatabaseClient, isDatabaseConfigured } from "@/lib/db";
import type { CopilotRequest, GuideInteractionSource } from "@/lib/portfolio-guide/types";
import type { CopilotResponse, EvidenceMetadata } from "@/lib/portfolio-guide/types";
import type { PortfolioGuideTraceEvent } from "@/lib/portfolio-guide/trace";
import { redactTracePayload } from "@/lib/portfolio-guide/trace";

export type PortfolioGuideInteractionStatus =
  | "pending"
  | "answered"
  | "errored"
  | "unavailable";

export type PortfolioGuideInteractionLogger = {
  start: (input: {
    requestId: string;
    request: CopilotRequest;
    model: string;
  }) => Promise<void>;
  finish: (input: {
    requestId: string;
    status: Exclude<PortfolioGuideInteractionStatus, "pending">;
    model?: string;
    latencyMs?: number;
    answerLength?: number;
    errorCode?: string;
    answer?: string;
    promptSnapshot?: Record<string, unknown>;
    responsePayload?: CopilotResponse;
    responseIds?: string[];
    usage?: Record<string, unknown>;
    normalizationStatus?: string;
    evidenceMetadata?: EvidenceMetadata;
    traceEvents?: PortfolioGuideTraceEvent[];
  }) => Promise<void>;
};

type SqlQueryRunner = {
  query: (query: string, params?: unknown[]) => Promise<unknown>;
};

function normalizeString(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function resolveInteractionSource(
  request: CopilotRequest,
): GuideInteractionSource {
  return request.interactionMeta?.source ?? "input";
}

function resolveTurnIndex(request: CopilotRequest): number {
  const turnIndex = request.interactionMeta?.turnIndex;

  if (typeof turnIndex === "number" && Number.isFinite(turnIndex) && turnIndex > 0) {
    return Math.floor(turnIndex);
  }

  return 1;
}

function resolveVisitorId(
  request: CopilotRequest,
  requestId: string,
): string {
  return (
    normalizeString(request.interactionMeta?.visitorId) ??
    `visitor_${requestId}`
  );
}

function resolveSessionId(
  request: CopilotRequest,
  requestId: string,
): string {
  return (
    normalizeString(request.interactionMeta?.sessionId) ??
    `session_${requestId}`
  );
}

function resolveRecommendedPathSlugs(request: CopilotRequest): string[] {
  return request.sessionContext.recommendedPath?.map((page) => page.slug) ?? [];
}

export function createPortfolioGuideInteractionLogger(options?: {
  sql?: SqlQueryRunner;
  appEnv?: string;
  databaseBranchName?: string;
}): PortfolioGuideInteractionLogger {
  const sql =
    options?.sql ??
    (isDatabaseConfigured("pooled")
      ? {
          query: (query: string, params?: unknown[]) =>
            getDatabaseClient().query(query, params),
        }
      : null);
  const appEnv = options?.appEnv ?? getAppEnv();
  const databaseBranchName =
    options?.databaseBranchName ?? getDatabaseBranchName();

  return {
    async start({ requestId, request, model }) {
      if (!sql) {
        return;
      }

      await sql.query(
        `
          INSERT INTO portfolio_guide_interactions (
            id,
            request_id,
            app_env,
            database_branch_name,
            visitor_id,
            session_id,
            page_slug,
            page_href,
            source,
            prompt_text,
            prompt_length,
            turn_index,
            role_raw_input,
            role_normalized_title,
            role_seniority,
            focus_areas,
            interest_tags,
            visited_pages,
            recommended_path_slugs,
            model,
            response_status
          )
          VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
            $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21
          )
          ON CONFLICT (request_id) DO NOTHING
        `,
        [
          randomUUID(),
          requestId,
          appEnv,
          databaseBranchName,
          resolveVisitorId(request, requestId),
          resolveSessionId(request, requestId),
          request.pageContext.slug,
          request.pageContext.href,
          resolveInteractionSource(request),
          request.message.trim(),
          request.message.trim().length,
          resolveTurnIndex(request),
          request.sessionContext.visitorIntent?.rawInput ?? null,
          request.sessionContext.visitorIntent?.normalizedTitle ?? null,
          request.sessionContext.visitorIntent?.seniority ?? null,
          request.sessionContext.visitorIntent?.focusAreas ?? [],
          request.sessionContext.inferredInterestTags,
          request.sessionContext.visitedPages,
          resolveRecommendedPathSlugs(request),
          model,
          "pending",
        ],
      );
    },

    async finish({
      requestId,
      status,
      model,
      latencyMs,
      answerLength,
      errorCode,
      answer,
      promptSnapshot,
      responsePayload,
      responseIds,
      usage,
      normalizationStatus,
      evidenceMetadata,
      traceEvents,
    }) {
      if (!sql) {
        return;
      }

      const updated = (await sql.query(
        `
          UPDATE portfolio_guide_interactions
          SET
            model = COALESCE($2, model),
            response_status = $3,
            response_latency_ms = $4,
            answer_length = $5,
            error_code = $6,
            assistant_text = $7,
            prompt_snapshot = $8::jsonb,
            response_payload = $9::jsonb,
            openai_response_ids = $10,
            usage_json = $11::jsonb,
            normalization_status = $12,
            evidence_metadata = $13::jsonb,
            completed_at = now()
          WHERE request_id = $1
          RETURNING id
        `,
        [
          requestId,
          model ?? null,
          status,
          latencyMs ?? null,
          answerLength ?? null,
          errorCode ?? null,
          answer ?? null,
          promptSnapshot ? JSON.stringify(redactTracePayload(promptSnapshot)) : null,
          responsePayload ? JSON.stringify(responsePayload) : null,
          responseIds ?? [],
          usage ? JSON.stringify(usage) : null,
          normalizationStatus ?? null,
          evidenceMetadata ? JSON.stringify(evidenceMetadata) : null,
        ],
      )) as Array<{ id: string }>;

      const interactionId = updated[0]?.id;
      if (!interactionId || !traceEvents?.length) {
        return;
      }

      const sequenceRows = (await sql.query(
        `SELECT COALESCE(MAX(sequence), -1)::int + 1 AS next_sequence
         FROM portfolio_guide_trace_events WHERE interaction_id = $1`,
        [interactionId],
      )) as Array<{ next_sequence: number }>;
      const sequenceOffset = sequenceRows[0]?.next_sequence ?? 0;

      for (const event of traceEvents) {
        await sql.query(
          `
            INSERT INTO portfolio_guide_trace_events (
              id, interaction_id, sequence, event_type, event_name, payload, duration_ms
            )
            VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7)
            ON CONFLICT (interaction_id, sequence) DO NOTHING
          `,
          [
            randomUUID(),
            interactionId,
            sequenceOffset + event.sequence,
            event.eventType,
            event.eventName,
            JSON.stringify(redactTracePayload(event.payload)),
            event.durationMs ?? null,
          ],
        );
      }
    },
  };
}
