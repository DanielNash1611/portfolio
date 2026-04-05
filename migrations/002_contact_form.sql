CREATE TABLE IF NOT EXISTS contact_submissions (
  id bigserial PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  ip text,
  fingerprint text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_rate_limits (
  id bigserial PRIMARY KEY,
  ip text NOT NULL,
  fingerprint text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS contact_rate_limits_ip_created_at_idx
  ON contact_rate_limits (ip, created_at DESC);
