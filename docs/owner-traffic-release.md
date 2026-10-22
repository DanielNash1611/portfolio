# Owner-traffic analytics release

Owner status is explicit, self-declared aggregate classification, scoped by app, environment and stable visitor ID. Events remain stored. Identity is not inferred from IP, email, role, another app or a shared session. Origin/body/property validation and DNT/GPC controls remain in effect; queries, contact text and résumé/profile contents are excluded.

`ANALYTICS_OWNER_TRAFFIC_ENABLED` (server) and `NEXT_PUBLIC_ANALYTICS_OWNER_TRAFFIC_ENABLED` (build-time client) default off. The off path preserves the original event INSERT and report totals without referencing the additive registry. After activation, reports exclude matching registered owners; `--include-owner` returns comparison totals.

## Verified migration and integration

On October 22, the dedicated test passed on disposable PostgreSQL 17.10 through the production `@neondatabase/serverless` HTTP client and a loopback adapter backed by the official `pg` client. It applied fixture baseline 004, applied migration 007 twice, and verified real constraint-failure rollback, duplicate ingestion, included/excluded report totals, app/environment scoping, arbitrary-property dropping and DNT. The run created four synthetic events and six synthetic registry entries; the intentionally failed event left no event or owner registration. The owned server was stopped. A prior PostgreSQL 18.4 exploratory run also passed; the PostgreSQL 17 run is the matching-major gate for production 17.11. This tests PostgreSQL SQL and driver/HTTP result behavior, not Neon-hosted network availability, throughput or latency.

Fixtures were fetched to a separate temporary workspace, with no application dependency change, system installation, lifecycle-script execution, hosted test resource or new credential. Sources: `@embedded-postgres/darwin-arm64@17.10.0-beta.17` (upstream embedded-postgres/zonky binaries) and official `pg@8.23.1`. Native tarball SHA-256: `41fa2aa47ec3ae7c8692719881c6bdb8376365dd417673b37ffe8281f28f7064`; registry integrity was checked before extraction. Only inspected package-local library symlinks were restored.

After that disposable test, the exact approved production target was verified through the existing Neon connector: Portfolio project `shiny-wave-60047815`, branch `production` / `br-quiet-cake-anhg9lwc`, database `neondb`. Only the repository's additive migration 007 and its `app_migrations` entry were applied in one transaction, with local lock/statement timeouts. Post-application schema/history checks verified the four expected columns, three CHECK constraints and primary key `(app, app_env, visitor_id)`. Migration SHA-256: `675acb38995e7d33087fed4f1f91d366e2157b97ebbaa30b78fc2ecf154d3d29`. Older unapplied migrations were not run. No production test records, owner enrollment or flag change were made by this migration step.

## Reproduce the disposable test

With existing PostgreSQL 17 binaries and the official pg client in a separate fixture directory:

```sh
node scripts/test-owner-analytics-local.cjs --postgres-bin=/absolute/path/to/bin --pg-module=/absolute/path/to/pg
```

The harness installs nothing, loads no application env files, creates a fresh synthetic-only cluster, binds PostgreSQL and HTTP to loopback, restricts child fetches to the fixture endpoint, and uses the real Neon driver and analytics routes. It records a receipt under a new temporary folder and stops its owned database process. No live URL or password is accepted. The HTTP adapter is for this local test only; it is not a production service.

Alternatively, run only `__tests__/analytics-owner-integration.test.ts` against explicitly disposable localhost PostgreSQL and a compatible HTTP proxy with the documented test environment in the harness. Hosted/shared hosts are rejected. Mock or skipped tests do not establish this integration passed.

## Activation, enrollment and rollback

Both owner-traffic flags must be set to exact `true` in Production, and the public flag needs a rebuild. The assistant's Production flag write was rejected with Vercel API HTTP 403; that operation remains stopped. Owner flag writes have not been attempted through an alternate route. Code deployment, flag activation and production behavior must be reported separately.

Each browser owner explicitly chooses `?analytics_owner=1`. The marker is removed from the address; the browser may keep a one-year Secure/SameSite=Lax domain cookie and local preference. DNT/GPC and analytics-disabled preferences still prevent event collection. `?analytics_owner=0` clears owner marking and starts a new local visitor identity; it does not delete historical registrations or events. No real browser is automatically enrolled, and external product clients must send their own explicit owner metadata.

Rollback sets both flags false and rebuilds the public flag. Previous ingestion/reporting resumes while the additive table and event history remain. Code rollback likewise preserves history. No paid model service is involved.
