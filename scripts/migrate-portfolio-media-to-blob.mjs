/**
 * One-time, explicit Vercel Blob migration for the three largest Portfolio media assets.
 * DRY RUN: node scripts/migrate-portfolio-media-to-blob.mjs
 * UPLOAD:  node scripts/migrate-portfolio-media-to-blob.mjs --apply
 *
 * Requires BLOB_READ_WRITE_TOKEN from an existing *public* Blob store.
 * Never logs the token, removes local originals, or alters page references.
 */
import { createHash } from "node:crypto";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { stat } from "node:fs/promises";
import { join } from "node:path";

const assets = [
  { file: "public/videos/gravity/gravity-reach-into-the-music.mp4", contentType: "video/mp4" },
  { file: "public/videos/farraginous/home-demo.mp4", contentType: "video/mp4" },
  { file: "public/audio/jumping-on-coals-full-explanation.mp3", contentType: "audio/mpeg" },
];
const destinationPrefix = "portfolio/media/v1/";
const manifestPath = "docs/blob-media-urls.json";
const apply = process.argv.includes("--apply");
const mib = (size) => (size / 1024 / 1024).toFixed(2) + " MiB";
const getSha = (body) => createHash("sha256").update(body).digest("hex");

async function main() {
  const planned = await Promise.all(assets.map(async (asset) => ({
    ...asset,
    size: (await stat(asset.file)).size,
    pathname: destinationPrefix + asset.file.replace(/^public\//, ""),
  })));
  const addedSize = planned.reduce((sum, asset) => sum + asset.size, 0);
  console.log("Planned Vercel Blob migration (source originals remain in Git):");
  for (const asset of planned) console.log("  " + mib(asset.size) + " " + asset.pathname);
  console.log("Total: " + mib(addedSize));
  if (!apply) {
    console.log("DRY RUN ONLY. Connect a public Blob store and rerun with --apply.");
    return;
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token?.startsWith("vercel_blob_rw_")) {
    throw new Error("No valid BLOB_READ_WRITE_TOKEN. Connect an existing public Blob store to Portfolio first.");
  }
  const storeId = token.split("_")[3];
  if (!storeId) throw new Error("Cannot resolve Blob store ID from token.");
  const headers = {
    authorization: "Bearer " + token,
    "x-vercel-blob-store-id": storeId,
    "x-api-version": "13",
  };
  const api = async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: { ...headers, ...options.headers },
      signal: AbortSignal.timeout(120000),
    });
    if (!response.ok) {
      // Do not echo response bodies; they could include sensitive diagnostic details.
      throw new Error("Vercel Blob request failed with HTTP " + response.status);
    }
    return response.json();
  };

  const existing = new Map();
  let cursor;
  let usedBytes = 0;
  let pages = 0;
  do {
    const url = new URL("https://vercel.com/api/blob");
    url.searchParams.set("limit", "1000");
    if (cursor) url.searchParams.set("cursor", cursor);
    const page = await api(url);
    for (const blob of page.blobs ?? []) {
      existing.set(blob.pathname, blob);
      usedBytes += blob.size;
    }
    cursor = page.hasMore ? page.cursor : undefined;
    if (page.hasMore && !cursor) throw new Error("Blob list did not return a continuation cursor.");
    if (++pages > 100) throw new Error("Too many Blob pages to determine available capacity safely.");
  } while (cursor);

  const filesToUpload = planned.filter((f) => !existing.has(f.pathname));
  for (const f of planned) {
    const present = existing.get(f.pathname);
    if (present && present.size !== f.size) {
      throw new Error("Existing blob has a different size: " + f.pathname + ". Manual review required.");
    }
  }
  const uploadBytes = filesToUpload.reduce((sum, f) => sum + f.size, 0);
  const hobbyLimit = 1024 ** 3;
  const reserve = 100 * 1024 ** 2;
  console.log("Existing connected-store objects: " + existing.size);
  console.log("Existing connected-store size: " + mib(usedBytes));
  if (usedBytes + uploadBytes + reserve > hobbyLimit) {
    throw new Error("Not enough connected-store capacity with 100 MiB safety buffer.");
  }
  console.log("Capacity check passed for this store (not an account-wide usage guarantee).");

  const output = {};
  for (const asset of planned) {
    const body = await readFile(asset.file);
    let blob = existing.get(asset.pathname);
    if (!blob) {
      const url = new URL("https://vercel.com/api/blob/");
      url.searchParams.set("pathname", asset.pathname);
      blob = await api(url, {
        method: "PUT",
        body,
        headers: {
          "x-vercel-blob-access": "public",
          "x-add-random-suffix": "0",
          "x-allow-overwrite": "0",
          "x-content-type": asset.contentType,
        },
      });
    }

    const host = new URL(blob.url);
    if (!host.hostname.endsWith(".public.blob.vercel-storage.com")) {
      throw new Error("Blob response did not contain a public Blob URL.");
    }
    const verification = await fetch(blob.url, { signal: AbortSignal.timeout(120000) });
    if (!verification.ok) throw new Error("Blob download verification failed: HTTP " + verification.status);
    const copy = Buffer.from(await verification.arrayBuffer());
    if (copy.byteLength !== body.byteLength || getSha(copy) !== getSha(body)) {
      throw new Error("Uploaded Blob checksum verification failed for " + asset.pathname);
    }
    output["/" + asset.file.replace(/^public\//, "")] = blob.url;
    console.log("Verified byte-for-byte: " + asset.pathname);
  }

  await mkdir("docs", { recursive: true });
  await writeFile(manifestPath, JSON.stringify(output, null, 2) + "\n");
  console.log("Wrote public URL manifest: " + manifestPath);
  console.log("Local media and page references were intentionally left unchanged.");
}

main().catch((error) => {
  console.error("Migration halted safely:", error.message);
  process.exitCode = 1;
});
