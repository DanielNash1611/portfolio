-- Only HMAC client identifiers and admission times are stored; never draft notes.
CREATE TABLE IF NOT EXISTS product_workspace_suggestion_limits (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  client_hash text NOT NULL CHECK (client_hash ~ '^[a-f0-9]{64}$'),
  created_at timestamptz NOT NULL DEFAULT clock_timestamp()
);

CREATE INDEX IF NOT EXISTS product_workspace_suggestion_limits_created_idx
  ON product_workspace_suggestion_limits (created_at);
