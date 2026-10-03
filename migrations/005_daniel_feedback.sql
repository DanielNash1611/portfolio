CREATE TABLE IF NOT EXISTS analytics_feedback (
  id uuid PRIMARY KEY,
  client_submission_id uuid NOT NULL UNIQUE,
  received_at timestamptz NOT NULL DEFAULT now(),
  app text NOT NULL CHECK (char_length(app) BETWEEN 1 AND 80),
  app_env text NOT NULL CHECK (char_length(app_env) BETWEEN 1 AND 80),
  database_branch_name text NOT NULL,
  category text NOT NULL CHECK (category IN ('problem', 'suggestion', 'general')),
  message text NOT NULL CHECK (char_length(message) BETWEEN 1 AND 2000),
  page_path text CHECK (char_length(page_path) <= 500),
  visitor_id text CHECK (visitor_id ~ '^visitor_[a-zA-Z0-9_-]{1,100}$'),
  session_id text CHECK (session_id ~ '^session_[a-zA-Z0-9_-]{1,100}$'),
  reviewed_at timestamptz,
  review_id uuid,
  CHECK ((visitor_id IS NULL) = (session_id IS NULL)),
  CHECK ((reviewed_at IS NULL) = (review_id IS NULL))
);

CREATE INDEX IF NOT EXISTS analytics_feedback_app_env_received_idx
  ON analytics_feedback (app, app_env, received_at, id);
CREATE INDEX IF NOT EXISTS analytics_feedback_pending_idx
  ON analytics_feedback (app, app_env, received_at, id) WHERE reviewed_at IS NULL;
CREATE INDEX IF NOT EXISTS analytics_feedback_expiry_idx ON analytics_feedback (received_at);

CREATE TABLE IF NOT EXISTS analytics_feedback_rate_limits (
  network_key text NOT NULL CHECK (network_key ~ '^[a-f0-9]{64}$'),
  window_start timestamptz NOT NULL,
  submissions integer NOT NULL CHECK (submissions BETWEEN 1 AND 5),
  PRIMARY KEY (network_key, window_start)
);
CREATE INDEX IF NOT EXISTS analytics_feedback_rate_limit_expiry_idx
  ON analytics_feedback_rate_limits (window_start);
