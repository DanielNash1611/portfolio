# Deployment storage

October 14, 2026 migration: static assets fall from approximately 147.65 MiB to 81.58 MiB, saving 66.07 MiB per retained deployment (uncompressed file inventory; excludes server bundles).

The existing recordings are hosted once in the public Vercel Blob store `portfolio-media` (`store_KM9upGlcTuGaMTW6`, IAD1). The apps read public URLs directly; no read/write token or media upload runs during a build. Original bytes remain versioned under `source-assets/`, outside `public/` and excluded from Vercel CLI uploads. Camera models and WASM remain local.

`docs/deployment-media.json` records every source, former public path, URL, size and SHA-256 checksum. All remote files were downloaded and matched against the original bytes after upload. Their CORS headers permit browser audio fetching. `npm run verify:media` repeats that check; omit `--remote` when running the script directly to check only local sources.

The postbuild audit rejects any migrated file reappearing at its former published path and enforces a 85 MiB static asset budget. If a new recording is approved, upload it once under a new versioned or content-hashed name, verify complete bytes and browser playback, update its runtime URL and manifest, and keep the authoring copy outside public output. Do not overwrite URLs used by older releases. Update the budget only after reviewing the asset inventory.

Removing assets from new builds does not remove copies from historical deployments. Existing production and rollback deployments are retained. Blob usage and transfer limits are separate from Deployment Storage; check team-wide usage before future uploads. Before this migration, the team dashboard showed 87.49 MB Blob storage and 8.88 GB Deployment Storage.
