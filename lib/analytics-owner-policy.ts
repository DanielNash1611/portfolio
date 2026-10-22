export function ownerTrafficEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.ANALYTICS_OWNER_TRAFFIC_ENABLED === "true";
}

/** The rollout-off path does not reference the additive registry at all. */
export function ownerEventStatement(query: string, params: unknown[], isOwner: boolean, enabled = ownerTrafficEnabled()) {
  if (!enabled) return { query, params };
  return {
    query: `WITH owner_registration AS (
      INSERT INTO analytics_owner_identities (app,app_env,visitor_id)
      SELECT $4,$5,$7 WHERE $${params.length + 1}::boolean
      ON CONFLICT DO NOTHING
    ) ${query}`,
    params: [...params, isOwner],
  };
}

/** This is aggregate classification, never an authentication predicate. */
export function ownerExclusionClause(includeOwner: boolean, enabled = ownerTrafficEnabled()): string {
  if (includeOwner || !enabled) return "";
  return `AND NOT EXISTS (
    SELECT 1 FROM analytics_owner_identities owner_identity
    WHERE owner_identity.app = analytics_events.app
      AND owner_identity.app_env = analytics_events.app_env
      AND owner_identity.visitor_id = analytics_events.visitor_id
  )`;
}
