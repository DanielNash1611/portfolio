# Historical search controls and current corpus checks

The October 17 paid scope pins its original public corpus. The later release-status
correction changes three portfolio texts. Changing those paid pins or skipping their
control tests would lose useful evidence. The original paid captures, grades, and
request journal remain unchanged.

`search-adaptive.cases.ts` retains all 14 original synthetic cases, including seven
failure/stop conditions, packet/credential isolation, catalog tampering, source
inventory, and CLI single-attempt checks. `search-native.cases.ts` retains its 11
synthetic cases for the native adapter, approval/budget gates, origin-cache binding,
mutation, malformed receipts, and failure/stop behavior.

The two `.test.ts` entry points copy the **current executable runner/guard code**
into temporary repositories and restore only the two historical portfolio content
backings from the hashed fixture archive. The paired career implementation, source
backings, 25-record cache, original proposals/queries, and query-cache origin are
included in the fixture; no other checkout, home-directory cache, Git history, or
untracked review folder is required. The career bullet bank is narrowed to the 27
public catalog-backed IDs; its resulting corpus hash stays identical. Private
application profiles, environment files, credentials, and application outputs are
excluded.

Every child case becomes a parent test. Additional completeness checks require
exactly 14 adaptive and 11 native cases, zero skips, and a successful child exit.
Any missing, modified, skipped, or failing historical case fails the suite. Event
logs and results are written under ignored `artifacts/frozen-search-tests/`.
Real provider fetch is blocked; simulated transports use dummy keys. The native
fixture's oracle-derived synthetic vectors test control flow only, not semantic
quality.

`ownership-release-status.test.ts` separately exercises the current corpus. It
replays the saved selection, checks that only the qualifier changes, retains source
contracts, detects exactly three invalidated vectors, assembles a complete index
from one simulated three-text batch while preserving all 60 cached vectors, and
requires a simulated denial to stop without retry. Synthetic vectors are never
saved as a runtime index or used to report retrieval quality.

Run `npm test` for both historical and current checks. No paid call, local model,
fresh model answer, grade rewrite, runtime activation, or deployment is part of
these tests. A future corpus revision gets its own current-corpus checks; do not
rewrite this archived corpus to improve a historical score.
