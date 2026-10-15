# Portfolio media migration

Completed October 14, 2026. The three large recordings now use public URLs in the `portfolio-media` Vercel Blob store (`store_KM9upGlcTuGaMTW6`, IAD1). The upload was performed through the authenticated dashboard; no Blob token is needed by the site or its builds.

All three downloads matched the original SHA-256 hashes and byte lengths. Public CORS headers were verified. See `deployment-media.json` for source paths, URLs, byte counts and hashes, and `blob-media-urls.json` for the old-to-new URL map.

The unchanged source recordings remain in Git under `source-assets/`, outside Next.js public assets and excluded from CLI uploads by `.vercelignore`. This removes 66.07 MiB of media from every future Portfolio deployment. Posters and transcripts remain local.

Run `npm run verify:media` to compare the preserved originals and remote Blob copies. The postbuild audit rejects reintroduced local copies or a static asset total above 85 MiB. See [deployment storage notes](deployment-storage.md) for maintenance guidance.
