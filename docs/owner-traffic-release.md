# Owner-traffic release candidate

This draft extracts the existing October 14 classification feature onto current main. Owner status is self-declared aggregate metadata, not authentication. Events remain stored; reports can exclude registered identities within the same app/environment/visitor key. No identity is inferred from IP, email, role, cross-app visitor history or a shared session.

Both `ANALYTICS_OWNER_TRAFFIC_ENABLED` (server) and `NEXT_PUBLIC_ANALYTICS_OWNER_TRAFFIC_ENABLED` (build-time client) default off. When off, ingestion uses the prior INSERT and has no dependency on migration 007. The report retains original totals. After migration and explicit server opt-in, `report:analytics` excludes registered owners; `--include-owner` gives the comparison totals. No report was run against a database during preparation.

## Approval and rollout

1. Review this diff, origin/body/property validation, consent and privacy tests.
2. Test migration 007 and atomic/idempotent ingestion only in a disposable localhost database/proxy with synthetic rows. Hosted/shared hosts are rejected by the opt-in integration test. The required local infrastructure was unavailable on this Mac; no software was installed. PostgreSQL atomicity/idempotency and actual reporting comparisons remain **unexecuted release gates**.
3. Obtain separate production migration approval, apply additive 007 to the exact approved target, and verify it before separately authorizing flags/redeployment. No production or shared migration is authorized by draft preparation.
4. Daniel explicitly enrolls each browser using `?analytics_owner=1` after reviewing the preference. The marker is cleaned from the address; the browser may retain a one-year Secure/SameSite=Lax domain cookie and local preference. DNT/GPC/analytics-disabled still prevent event collection. `?analytics_owner=0` clears owner marking and starts a new local visitor identity; it does not delete historical registrations or events.

Only matching stable visitor IDs can classify earlier events; unrelated browsers/identities cannot be retrospectively inferred. Existing history is never deleted. External product clients must explicitly send owner metadata; this PR does not claim all external apps are enrolled automatically. Queries, contact text, résumé/profile data and arbitrary properties are not added to analytics payloads.

Rollback turns both flags off (public flag requires rebuild); prior ingestion/reporting resumes while the additive table remains. A code rollback also leaves the table and event history intact. No paid model service is involved. The database integration remains blocked until safely isolated local infrastructure is available; mock/static tests do not establish that it ran.


## October 22 release checkpoint

The end-to-end release is approved, including additive migration 007 after disposable validation. Current main has been reconciled; the remaining hold is infrastructure and verification, not a request for another per-PR production approval. No migration or enrollment has run.

The opt-in integration test now configures an explicit loopback Neon HTTP proxy and applies repository migration 004 as the empty fixture baseline, then migration 007 twice. It exercises real PostgreSQL check-failure rollback, duplicate ingestion, owner exclusion versus included totals, app/environment isolation, property dropping and DNT. It remains **unexecuted** until a disposable PostgreSQL database and compatible HTTP proxy exist locally. Static or mocked tests do not satisfy it. No system software or hosted resource was installed for this checkpoint.

Run only the dedicated integration file in a scrubbed environment, using a disposable database named `owner_traffic_validation_<unique_suffix>`, a loopback `DATABASE_URL`, `ANALYTICS_TEST_HTTP_ENDPOINT=http://127.0.0.1:<proxy_port>/sql`, `ANALYTICS_TEST_HOST` matching the database host, `ANALYTICS_DISPOSABLE_LOCAL_TEST=1`, `ANALYTICS_OWNER_TRAFFIC_ENABLED=true`, `APP_ENV=validation` and `DATABASE_BRANCH_NAME=owner-traffic-validation-20261014`:

```sh
node --import tsx --test __tests__/analytics-owner-integration.test.ts
```

Do not supply a production URL or use a shared/hosted substitute. After this gate passes, identify the exact existing production database target and run only `007_analytics_owner_identities.sql` through the migration runner. Verify its additive schema/history entry before enabling the two owner-traffic flags and rebuilding. Enrollment remains each browser owner's explicit opt-in. A production-environment flag write for the assistant was rejected by Vercel with HTTP 403 during this release; owner flag writes have not been attempted and may need the same existing project access resolved.
