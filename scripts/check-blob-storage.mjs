// Read-only Blob capacity probe. Never log credentials or individual blob URLs.
const token = process.env.BLOB_READ_WRITE_TOKEN;
const oidc = process.env.VERCEL_OIDC_TOKEN;
const storeId = process.env.BLOB_STORE_ID?.replace(/^store_/, "") || (token?.startsWith("vercel_blob_rw_") ? token.split("_")[3] : undefined);
console.log("\n=== VERCEL BLOB CAPACITY CHECK ===");
if (!storeId || !(token || oidc)) {
  console.log("STATUS: no connected Blob credentials for this preview environment");
  console.log("=== END BLOB CAPACITY CHECK ===\n");
  process.exit(0);
}
try {
  let cursor, size=0, count=0, pages=0;
  do {
    const url = new URL("https://vercel.com/api/blob");
    url.searchParams.set("limit", "1000");
    if (cursor) url.searchParams.set("cursor", cursor);
    const response = await fetch(url, { headers: {
      authorization: "Bearer " + (oidc && process.env.BLOB_STORE_ID ? oidc : token),
      "x-vercel-blob-store-id": storeId,
      "x-api-version": "13",
    }, signal: AbortSignal.timeout(15000) });
    if (!response.ok) {
      console.log("STATUS: Blob list unavailable (HTTP " + response.status + ")");
      break;
    }
    const page = await response.json();
    size += page.blobs.reduce((sum, blob) => sum + blob.size, 0);
    count += page.blobs.length;
    cursor = page.hasMore ? page.cursor : undefined;
    pages++;
  } while (cursor && pages < 100);
  if (!cursor) {
    const gb = (v) => (v / 1024 / 1024).toFixed(2);
    const intended = 66.1 * 1024 * 1024;
    console.log("STATUS: existing store accessible");
    console.log("Stored objects: " + count);
    console.log("Stored size: " + gb(size) + " MiB");
    console.log("Remaining within 1 GiB store-size benchmark: " + gb(Math.max(0, 1024 ** 3 - size)) + " MiB");
    console.log("Can fit proposed Portfolio media with 100 MiB buffer: " + (size + intended + 100 * 1024 ** 2 < 1024 ** 3));
    console.log("NOTE: This checks one linked store, not account-wide transfers or usage in other stores.");
  } else console.log("STATUS: more than 100 pages; cannot assess store size");
} catch {
  console.log("STATUS: unable to list the existing Blob store from this build");
}
console.log("=== END BLOB CAPACITY CHECK ===\n");
