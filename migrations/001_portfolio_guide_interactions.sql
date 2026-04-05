CREATE TABLE IF NOT EXISTS portfolio_guide_interactions (
  id uuid PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  request_id text NOT NULL UNIQUE,
  app_env text NOT NULL,
  database_branch_name text NOT NULL,
  visitor_id text NOT NULL,
  session_id text NOT NULL,
  page_slug text NOT NULL,
  page_href text NOT NULL,
  source text NOT NULL,
  prompt_text text NOT NULL,
  prompt_length integer NOT NULL CHECK (prompt_length >= 0),
  turn_index integer NOT NULL CHECK (turn_index > 0),
  role_raw_input text,
  role_normalized_title text,
  role_seniority text,
  focus_areas text[] NOT NULL DEFAULT ARRAY[]::text[],
  interest_tags text[] NOT NULL DEFAULT ARRAY[]::text[],
  visited_pages text[] NOT NULL DEFAULT ARRAY[]::text[],
  recommended_path_slugs text[] NOT NULL DEFAULT ARRAY[]::text[],
  model text,
  response_status text NOT NULL,
  response_latency_ms integer,
  answer_length integer,
  error_code text
);

CREATE INDEX IF NOT EXISTS portfolio_guide_interactions_created_at_idx
  ON portfolio_guide_interactions (created_at DESC);

CREATE INDEX IF NOT EXISTS portfolio_guide_interactions_app_env_created_at_idx
  ON portfolio_guide_interactions (app_env, created_at DESC);

CREATE INDEX IF NOT EXISTS portfolio_guide_interactions_page_slug_created_at_idx
  ON portfolio_guide_interactions (page_slug, created_at DESC);

CREATE INDEX IF NOT EXISTS portfolio_guide_interactions_role_created_at_idx
  ON portfolio_guide_interactions (role_normalized_title, created_at DESC);

CREATE INDEX IF NOT EXISTS portfolio_guide_interactions_status_created_at_idx
  ON portfolio_guide_interactions (response_status, created_at DESC);

