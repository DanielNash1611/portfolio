# Moving large Portfolio media to Vercel Blob

Status: **prepared but not executed**. The Vercel connector could not create a store (HTTP 403), and the Portfolio preview has no `BLOB_READ_WRITE_TOKEN`.

Three eligible source files (about 66 MiB) are included in `scripts/migrate-portfolio-media-to-blob.mjs`. Only use an **existing public** Blob store with sufficient Hobby storage and data-transfer headroom; Blob usage is separate from Deployment Storage.

1. In the Vercel dashboard, connect a public Blob store to the `portfolio` project (Preview and Production). The token should be injected by Vercel, never committed or shared in chat.
2. On a trusted local checkout, load the project environment privately (for example via Vercel CLI environment pull) and run `node scripts/migrate-portfolio-media-to-blob.mjs` for a dry run.
3. Run `node scripts/migrate-portfolio-media-to-blob.mjs --apply` with `BLOB_READ_WRITE_TOKEN` in the process environment. The script lists stored blobs to check the 1 GiB reference threshold with a 100 MiB reserve, uploads each missing file, downloads it again to verify SHA-256, and writes a JSON map of public Blob URLs to `docs/blob-media-urls.json`.
4. **Only after successful uploads:** review the generated URL manifest, update the two Portfolio pages' video URLs and the Jumping on Coals audio URL, deploy a Preview build, and verify playback including seek and mobile behavior.
5. **Only after the updated preview works:** remove the three original public media files in a separate commit. Keep image posters and transcripts locally and leave historic deployments alone unless separately approved.

Safety: The script does not delete any source files, expose credentials, mutate page code, or change production. It refuses to overwrite an existing Blob with mismatched byte length and verifies complete bytes after upload. Its per-store capacity check does not prove unused capacity elsewhere in the Vercel account.
