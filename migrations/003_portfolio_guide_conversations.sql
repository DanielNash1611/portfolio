CREATE TABLE IF NOT EXISTS portfolio_guide_conversations (
  id uuid PRIMARY KEY,
  access_token_hash text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'ended', 'deletion_pending')),
  session_memory jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '90 days')
);

ALTER TABLE portfolio_guide_interactions
  ADD COLUMN IF NOT EXISTS conversation_id uuid
    REFERENCES portfolio_guide_conversations(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS client_turn_id text,
  ADD COLUMN IF NOT EXISTS ip_hash text,
  ADD COLUMN IF NOT EXISTS assistant_text text,
  ADD COLUMN IF NOT EXISTS prompt_version text,
  ADD COLUMN IF NOT EXISTS prompt_snapshot jsonb,
  ADD COLUMN IF NOT EXISTS response_payload jsonb,
  ADD COLUMN IF NOT EXISTS openai_response_ids text[] NOT NULL DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS usage_json jsonb,
  ADD COLUMN IF NOT EXISTS normalization_status text,
  ADD COLUMN IF NOT EXISTS evidence_metadata jsonb,
  ADD COLUMN IF NOT EXISTS completed_at timestamptz;

CREATE UNIQUE INDEX IF NOT EXISTS portfolio_guide_interactions_conversation_client_turn_idx
  ON portfolio_guide_interactions (conversation_id, client_turn_id)
  WHERE conversation_id IS NOT NULL AND client_turn_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS portfolio_guide_interactions_conversation_turn_idx
  ON portfolio_guide_interactions (conversation_id, turn_index)
  WHERE conversation_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS portfolio_guide_interactions_one_pending_turn_idx
  ON portfolio_guide_interactions (conversation_id)
  WHERE conversation_id IS NOT NULL AND response_status = 'pending';

CREATE INDEX IF NOT EXISTS portfolio_guide_conversations_expiry_idx
  ON portfolio_guide_conversations (expires_at);

CREATE INDEX IF NOT EXISTS portfolio_guide_interactions_conversation_created_idx
  ON portfolio_guide_interactions (conversation_id, created_at ASC);

CREATE INDEX IF NOT EXISTS portfolio_guide_interactions_ip_created_idx
  ON portfolio_guide_interactions (ip_hash, created_at DESC)
  WHERE ip_hash IS NOT NULL;

CREATE TABLE IF NOT EXISTS portfolio_guide_trace_events (
  id uuid PRIMARY KEY,
  interaction_id uuid NOT NULL
    REFERENCES portfolio_guide_interactions(id) ON DELETE CASCADE,
  sequence integer NOT NULL CHECK (sequence >= 0),
  event_type text NOT NULL,
  event_name text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  duration_ms integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (interaction_id, sequence)
);

CREATE INDEX IF NOT EXISTS portfolio_guide_trace_events_interaction_idx
  ON portfolio_guide_trace_events (interaction_id, sequence ASC);
