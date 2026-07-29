import { createHash, createHmac, randomBytes, randomUUID } from "node:crypto";
import { getDatabaseClient, isDatabaseConfigured } from "@/lib/db";
import type {
  CopilotRequest,
  CopilotResponse,
  GuideConversationMessage,
  GuideSessionSignals,
} from "@/lib/portfolio-guide/types";

export const GUIDE_CONVERSATION_COOKIE = "portfolio-guide-conversation";
export const GUIDE_CONVERSATION_RETENTION_DAYS = 90;
export const GUIDE_MESSAGE_MAX_LENGTH = 4000;

const STALE_PENDING_MINUTES = 2;
const PER_CONVERSATION_TEN_MINUTES = 12;
const PER_IP_HOUR = 30;
const GLOBAL_HOUR = 200;

type SqlQueryRunner = {
  query: (query: string, params?: unknown[]) => Promise<unknown>;
};

export type DurableConversation = {
  id: string;
  sessionMemory: GuideSessionSignals;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
};

export type BegunConversationTurn = {
  kind: "started";
  interactionId: string;
  requestId: string;
  turnIndex: number;
};

export type ExistingConversationTurn = {
  kind: "existing";
  interactionId: string;
  turnIndex: number;
  response: CopilotResponse;
};

export type RejectedConversationTurn = {
  kind: "in_progress" | "rate_limited";
  retryAfterSeconds: number;
};

export type BeginConversationTurnResult =
  | BegunConversationTurn
  | ExistingConversationTurn
  | RejectedConversationTurn;

type ConversationRow = {
  id: string;
  session_memory: GuideSessionSignals | null;
  created_at: string;
  updated_at: string;
  expires_at: string;
};

type InteractionRow = {
  id: string;
  request_id: string;
  response_status: string;
  response_payload: CopilotResponse | null;
  turn_index: number;
  prompt_text?: string;
  page_slug?: string;
  created_at?: string;
  error_code?: string | null;
};

type SnapshotRow = {
  id: string;
  prompt_text: string;
  assistant_text: string;
  created_at: string;
  completed_at: string | null;
  page_slug: string;
  page_title: string | null;
  suggested_follow_ups: string[] | null;
  related_pages: GuideConversationMessage["relatedPages"] | null;
};

function rows<T>(result: unknown): T[] {
  return Array.isArray(result) ? (result as T[]) : [];
}

function first<T>(result: unknown): T | undefined {
  return rows<T>(result)[0];
}

function parseBoolean(value: string | undefined): boolean {
  return value?.trim().toLowerCase() === "true";
}

export function isDurablePortfolioGuideEnabled(): boolean {
  return (
    parseBoolean(process.env.PORTFOLIO_GUIDE_DURABLE_CONVERSATIONS) &&
    isDatabaseConfigured("pooled")
  );
}

export function generateConversationAccessToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashConversationAccessToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function hashPortfolioGuideIp(ip: string): string {
  const salt = process.env.PORTFOLIO_GUIDE_PRIVACY_SALT?.trim();
  if (!salt) {
    throw new Error("PORTFOLIO_GUIDE_PRIVACY_SALT is required for durable conversations.");
  }
  return createHmac("sha256", salt).update(ip).digest("hex");
}

function normalizeMemory(value: GuideSessionSignals | null): GuideSessionSignals {
  return {
    visitedPages: value?.visitedPages ?? [],
    clickedPrompts: value?.clickedPrompts ?? [],
    askedQuestions: value?.askedQuestions ?? [],
    inferredInterestTags: value?.inferredInterestTags ?? [],
    ...(value?.visitorIntent ? { visitorIntent: value.visitorIntent } : {}),
    ...(value?.recommendedPath ? { recommendedPath: value.recommendedPath } : {}),
    ...(value?.lastVisitedAt ? { lastVisitedAt: value.lastVisitedAt } : {}),
  };
}

function toConversation(row: ConversationRow): DurableConversation {
  return {
    id: row.id,
    sessionMemory: normalizeMemory(row.session_memory),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    expiresAt: row.expires_at,
  };
}

function isUniqueViolation(error: unknown): boolean {
  return (
    error !== null &&
    error !== undefined &&
    typeof error === "object" &&
    "code" in error &&
    (error as { code?: unknown }).code === "23505"
  );
}

export function createPortfolioGuideConversationStore(options?: {
  sql?: SqlQueryRunner;
}) {
  const sql =
    options?.sql ?? {
      query: (query: string, params?: unknown[]) =>
        getDatabaseClient().query(query, params),
    };

  return {
    async create(): Promise<{ conversation: DurableConversation; token: string }> {
      const token = generateConversationAccessToken();
      const row = first<ConversationRow>(
        await sql.query(
          `
            INSERT INTO portfolio_guide_conversations (
              id, access_token_hash, status, session_memory, expires_at
            )
            VALUES ($1, $2, 'active', '{}'::jsonb, now() + interval '90 days')
            RETURNING id, session_memory, created_at, updated_at, expires_at
          `,
          [randomUUID(), hashConversationAccessToken(token)],
        ),
      );
      if (!row) {
        throw new Error("Conversation creation returned no row.");
      }
      return { conversation: toConversation(row), token };
    },

    async resolve(token: string): Promise<DurableConversation | null> {
      const row = first<ConversationRow>(
        await sql.query(
          `
            SELECT id, session_memory, created_at, updated_at, expires_at
            FROM portfolio_guide_conversations
            WHERE access_token_hash = $1
              AND status = 'active'
              AND expires_at > now()
            LIMIT 1
          `,
          [hashConversationAccessToken(token)],
        ),
      );
      return row ? toConversation(row) : null;
    },

    async loadMessages(conversationId: string): Promise<GuideConversationMessage[]> {
      const result = await sql.query(
        `
          SELECT
            id,
            prompt_text,
            assistant_text,
            created_at,
            completed_at,
            page_slug,
            prompt_snapshot->>'pageTitle' AS page_title,
            response_payload->'suggestedFollowUps' AS suggested_follow_ups,
            response_payload->'relatedPages' AS related_pages
          FROM portfolio_guide_interactions
          WHERE conversation_id = $1
            AND response_status = 'answered'
            AND assistant_text IS NOT NULL
          ORDER BY turn_index ASC
        `,
        [conversationId],
      );

      return rows<SnapshotRow>(result).flatMap((row) => [
        {
          id: `${row.id}:user`,
          turnId: row.id,
          role: "user" as const,
          content: row.prompt_text,
          createdAt: row.created_at,
          pageSlug: row.page_slug,
          pageTitle: row.page_title ?? undefined,
        },
        {
          id: `${row.id}:assistant`,
          turnId: row.id,
          role: "assistant" as const,
          content: row.assistant_text,
          createdAt: row.completed_at ?? row.created_at,
          pageSlug: row.page_slug,
          pageTitle: row.page_title ?? undefined,
          suggestedFollowUps: row.suggested_follow_ups ?? undefined,
          relatedPages: row.related_pages ?? undefined,
        },
      ]);
    },

    async searchUserMessages(
      conversationId: string,
      query: string,
      maxResults = 5,
    ): Promise<Array<{ content: string; pageSlug: string; createdAt: string }>> {
      const normalizedQuery = query.trim().slice(0, 300);
      if (!normalizedQuery) {
        return [];
      }
      const result = await sql.query(
        `
          SELECT prompt_text AS content, page_slug, created_at
          FROM portfolio_guide_interactions
          WHERE conversation_id = $1
            AND response_status = 'answered'
            AND prompt_text ILIKE '%' || $2 || '%'
          ORDER BY turn_index DESC
          LIMIT $3
        `,
        [conversationId, normalizedQuery, Math.max(1, Math.min(maxResults, 6))],
      );
      return rows<{
        content: string;
        page_slug: string;
        created_at: string;
      }>(result).map((row) => ({
        content: row.content,
        pageSlug: row.page_slug,
        createdAt: row.created_at,
      }));
    },

    async updateMemory(
      conversationId: string,
      memory: GuideSessionSignals,
    ): Promise<string> {
      const row = first<{ expires_at: string }>(
        await sql.query(
          `
            UPDATE portfolio_guide_conversations
            SET session_memory = $2::jsonb,
                updated_at = now(),
                expires_at = now() + interval '90 days'
            WHERE id = $1 AND status = 'active'
            RETURNING expires_at
          `,
          [conversationId, JSON.stringify(memory)],
        ),
      );
      if (!row) {
        throw new Error("Conversation memory update returned no row.");
      }
      return row.expires_at;
    },

    async beginTurn(input: {
      conversationId: string;
      clientTurnId: string;
      ipHash: string;
      request: CopilotRequest;
      model: string;
      promptVersion: string;
    }): Promise<BeginConversationTurnResult> {
      const existing = first<InteractionRow>(
        await sql.query(
          `
            SELECT id, request_id, response_status, response_payload, turn_index,
                   prompt_text, page_slug, created_at, error_code
            FROM portfolio_guide_interactions
            WHERE conversation_id = $1 AND client_turn_id = $2
            LIMIT 1
          `,
          [input.conversationId, input.clientTurnId],
        ),
      );
      if (existing?.response_status === "answered" && existing.response_payload) {
        return {
          kind: "existing",
          interactionId: existing.id,
          turnIndex: existing.turn_index,
          response: existing.response_payload,
        };
      }
      const existingPendingIsStale =
        existing?.response_status === "pending" &&
        Boolean(existing.created_at) &&
        Date.now() - Date.parse(existing.created_at!) >=
          STALE_PENDING_MINUTES * 60 * 1000;
      if (existing?.response_status === "pending" && !existingPendingIsStale) {
        return { kind: "in_progress", retryAfterSeconds: 2 };
      }

      await sql.query(
        `
          UPDATE portfolio_guide_interactions
          SET response_status = 'errored',
              error_code = 'stale_pending_turn',
              completed_at = now()
          WHERE conversation_id = $1
            AND response_status = 'pending'
            AND created_at < now() - interval '${STALE_PENDING_MINUTES} minutes'
        `,
        [input.conversationId],
      );

      const [conversationRate, ipRate, globalRate] = await Promise.all([
        sql.query(
          `SELECT COUNT(*)::int AS count FROM portfolio_guide_interactions
           WHERE conversation_id = $1 AND created_at >= now() - interval '10 minutes'`,
          [input.conversationId],
        ),
        sql.query(
          `SELECT COUNT(*)::int AS count FROM portfolio_guide_interactions
           WHERE ip_hash = $1 AND created_at >= now() - interval '1 hour'`,
          [input.ipHash],
        ),
        sql.query(
          `SELECT COUNT(*)::int AS count FROM portfolio_guide_interactions
           WHERE created_at >= now() - interval '1 hour'`,
        ),
      ]);

      const conversationCount = first<{ count: number }>(conversationRate)?.count ?? 0;
      const ipCount = first<{ count: number }>(ipRate)?.count ?? 0;
      const globalCount = first<{ count: number }>(globalRate)?.count ?? 0;
      if (
        conversationCount >= PER_CONVERSATION_TEN_MINUTES ||
        ipCount >= PER_IP_HOUR ||
        globalCount >= GLOBAL_HOUR
      ) {
        return { kind: "rate_limited", retryAfterSeconds: 600 };
      }

      const retryableExisting =
        existing &&
        (existing.response_status === "errored" ||
          existing.response_status === "unavailable" ||
          existingPendingIsStale);
      if (retryableExisting) {
        if (
          (existing.prompt_text &&
            existing.prompt_text !== input.request.message.trim()) ||
          (existing.page_slug &&
            existing.page_slug !== input.request.pageContext.slug)
        ) {
          return { kind: "in_progress", retryAfterSeconds: 0 };
        }

        const requestId = randomUUID();
        const retried = first<{ id: string; turn_index: number }>(
          await sql.query(
            `
              UPDATE portfolio_guide_interactions
              SET request_id = $2,
                  response_status = 'pending',
                  response_latency_ms = NULL,
                  answer_length = NULL,
                  error_code = NULL,
                  assistant_text = NULL,
                  prompt_snapshot = NULL,
                  response_payload = NULL,
                  usage_json = NULL,
                  normalization_status = NULL,
                  evidence_metadata = NULL,
                  completed_at = NULL,
                  created_at = now()
              WHERE id = $1 AND response_status IN ('errored', 'unavailable')
              RETURNING id, turn_index
            `,
            [existing.id, requestId],
          ),
        );
        if (!retried) {
          return { kind: "in_progress", retryAfterSeconds: 2 };
        }

        const previousErrorCode =
          existing.error_code ??
          (existingPendingIsStale ? "stale_pending_turn" : "unknown_error");
        try {
          await sql.query(
            `
              INSERT INTO portfolio_guide_trace_events (
                id, interaction_id, sequence, event_type, event_name, payload
              )
              SELECT $1, $2, COALESCE(MAX(sequence), -1) + 1,
                     'lifecycle', 'turn.retry', $3::jsonb
              FROM portfolio_guide_trace_events
              WHERE interaction_id = $2
            `,
            [
              randomUUID(),
              existing.id,
              JSON.stringify({ previousErrorCode }),
            ],
          );
        } catch (error) {
          console.warn("Portfolio Guide retry trace could not be stored:", error);
        }

        return {
          kind: "started",
          interactionId: retried.id,
          requestId,
          turnIndex: retried.turn_index,
        };
      }

      const maxTurn = first<{ turn_index: number }>(
        await sql.query(
          `SELECT COALESCE(MAX(turn_index), 0)::int AS turn_index
           FROM portfolio_guide_interactions WHERE conversation_id = $1`,
          [input.conversationId],
        ),
      );
      const turnIndex = (maxTurn?.turn_index ?? 0) + 1;
      const requestId = randomUUID();
      const interactionId = randomUUID();
      const visitorIntent = input.request.sessionContext.visitorIntent;

      try {
        await sql.query(
          `
            INSERT INTO portfolio_guide_interactions (
              id, request_id, app_env, database_branch_name, visitor_id, session_id,
              page_slug, page_href, source, prompt_text, prompt_length, turn_index,
              role_raw_input, role_normalized_title, role_seniority, focus_areas,
              interest_tags, visited_pages, recommended_path_slugs, model,
              response_status, conversation_id, client_turn_id, ip_hash, prompt_version
            )
            VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,
              $13, $14, $15, $16, $17, $18, $19, $20, 'pending', $21, $22, $23, $24
            )
          `,
          [
            interactionId,
            requestId,
            process.env.APP_ENV?.trim() || (process.env.NODE_ENV === "production" ? "production" : "local"),
            process.env.DATABASE_BRANCH_NAME?.trim() || (process.env.NODE_ENV === "production" ? "production" : "development"),
            `conversation_${input.conversationId}`,
            input.conversationId,
            input.request.pageContext.slug,
            input.request.pageContext.href,
            input.request.interactionMeta?.source ?? "input",
            input.request.message.trim(),
            input.request.message.trim().length,
            turnIndex,
            visitorIntent?.rawInput ?? null,
            visitorIntent?.normalizedTitle ?? null,
            visitorIntent?.seniority ?? null,
            visitorIntent?.focusAreas ?? [],
            input.request.sessionContext.inferredInterestTags,
            input.request.sessionContext.visitedPages,
            input.request.sessionContext.recommendedPath?.map((page) => page.slug) ?? [],
            input.model,
            input.conversationId,
            input.clientTurnId,
            input.ipHash,
            input.promptVersion,
          ],
        );
      } catch (error) {
        if (!isUniqueViolation(error)) {
          throw error;
        }
        const duplicate = first<InteractionRow>(
          await sql.query(
            `SELECT id, request_id, response_status, response_payload, turn_index
             FROM portfolio_guide_interactions
             WHERE conversation_id = $1 AND client_turn_id = $2 LIMIT 1`,
            [input.conversationId, input.clientTurnId],
          ),
        );
        if (duplicate?.response_status === "answered" && duplicate.response_payload) {
          return {
            kind: "existing",
            interactionId: duplicate.id,
            turnIndex: duplicate.turn_index,
            response: duplicate.response_payload,
          };
        }
        return { kind: "in_progress", retryAfterSeconds: 2 };
      }

      return { kind: "started", interactionId, requestId, turnIndex };
    },

    async end(conversationId: string): Promise<void> {
      await sql.query(
        `UPDATE portfolio_guide_conversations
         SET status = 'ended', updated_at = now() WHERE id = $1`,
        [conversationId],
      );
    },

    async markDeletionPending(conversationId: string): Promise<string[]> {
      await sql.query(
        `UPDATE portfolio_guide_conversations
         SET status = 'deletion_pending', updated_at = now() WHERE id = $1`,
        [conversationId],
      );
      const result = await sql.query(
        `SELECT DISTINCT UNNEST(openai_response_ids) AS response_id
         FROM portfolio_guide_interactions WHERE conversation_id = $1`,
        [conversationId],
      );
      return rows<{ response_id: string }>(result)
        .map((row) => row.response_id)
        .filter(Boolean);
    },

    async hardDelete(conversationId: string): Promise<void> {
      await sql.query(`DELETE FROM portfolio_guide_conversations WHERE id = $1`, [conversationId]);
    },

    async listDeletionCandidates(
      limit = 50,
    ): Promise<Array<{ id: string; status: string; responseIds: string[] }>> {
      const result = await sql.query(
        `
          SELECT
            c.id,
            c.status,
            COALESCE(
              ARRAY_AGG(DISTINCT response_id) FILTER (WHERE response_id IS NOT NULL),
              ARRAY[]::text[]
            ) AS response_ids
          FROM portfolio_guide_conversations c
          LEFT JOIN portfolio_guide_interactions i ON i.conversation_id = c.id
          LEFT JOIN LATERAL UNNEST(i.openai_response_ids) response_id ON true
          WHERE c.status = 'deletion_pending' OR c.expires_at <= now()
          GROUP BY c.id, c.status, c.updated_at
          ORDER BY c.updated_at ASC
          LIMIT $1
        `,
        [Math.max(1, Math.min(limit, 200))],
      );
      return rows<{ id: string; status: string; response_ids: string[] }>(result).map(
        (row) => ({ id: row.id, status: row.status, responseIds: row.response_ids }),
      );
    },

    async cleanupExpired(): Promise<{ deleted: number }> {
      const result = await sql.query(
        `DELETE FROM portfolio_guide_conversations
         WHERE expires_at <= now() OR (status = 'ended' AND updated_at < now() - interval '90 days')
         RETURNING id`,
      );
      return { deleted: rows<{ id: string }>(result).length };
    },
  };
}
