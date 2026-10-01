CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY,
  client_event_id uuid NOT NULL UNIQUE,
  occurred_at timestamptz NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now(),
  app text NOT NULL,
  app_env text NOT NULL,
  database_branch_name text NOT NULL,
  visitor_id text NOT NULL,
  session_id text NOT NULL,
  event_name text NOT NULL,
  page_path text,
  referrer_host text,
  device_class text,
  properties jsonb NOT NULL DEFAULT '{}'::jsonb,
  CHECK (char_length(app) BETWEEN 1 AND 80),
  CHECK (char_length(event_name) BETWEEN 1 AND 80),
  CHECK (char_length(visitor_id) BETWEEN 1 AND 120),
  CHECK (char_length(session_id) BETWEEN 1 AND 120),
  CHECK (page_path IS NULL OR char_length(page_path) <= 500),
  CHECK (referrer_host IS NULL OR char_length(referrer_host) <= 255),
  CHECK (device_class IS NULL OR device_class IN ('mobile', 'tablet', 'desktop')),
  CHECK (jsonb_typeof(properties) = 'object')
);

CREATE INDEX IF NOT EXISTS analytics_events_app_occurred_at_idx
  ON analytics_events (app, occurred_at DESC);

CREATE INDEX IF NOT EXISTS analytics_events_app_event_occurred_at_idx
  ON analytics_events (app, event_name, occurred_at DESC);

CREATE INDEX IF NOT EXISTS analytics_events_app_session_occurred_at_idx
  ON analytics_events (app, session_id, occurred_at ASC);

CREATE INDEX IF NOT EXISTS analytics_events_app_visitor_occurred_at_idx
  ON analytics_events (app, visitor_id, occurred_at DESC);

CREATE INDEX IF NOT EXISTS analytics_events_page_occurred_at_idx
  ON analytics_events (page_path, occurred_at DESC);

CREATE TABLE IF NOT EXISTS analytics_insights (
  id uuid PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  app text NOT NULL,
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  insight_type text NOT NULL,
  title text NOT NULL,
  summary text NOT NULL,
  evidence jsonb NOT NULL DEFAULT '{}'::jsonb,
  source text NOT NULL DEFAULT 'agent',
  status text NOT NULL DEFAULT 'new',
  CHECK (period_end > period_start),
  CHECK (status IN ('new', 'reviewed', 'dismissed', 'acted_on')),
  CHECK (jsonb_typeof(evidence) = 'object')
);

CREATE INDEX IF NOT EXISTS analytics_insights_app_created_at_idx
  ON analytics_insights (app, created_at DESC);

CREATE INDEX IF NOT EXISTS analytics_insights_status_created_at_idx
  ON analytics_insights (status, created_at DESC);
