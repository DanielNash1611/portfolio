-- Classification metadata only; events remain available for aggregate comparisons.
CREATE TABLE IF NOT EXISTS analytics_owner_identities (
  app text NOT NULL CHECK (char_length(app) BETWEEN 1 AND 80),
  app_env text NOT NULL CHECK (char_length(app_env) BETWEEN 1 AND 80),
  visitor_id text NOT NULL CHECK (visitor_id ~ '^visitor_[a-zA-Z0-9_-]{1,100}$'),
  registered_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (app, app_env, visitor_id)
);
