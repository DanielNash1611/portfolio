import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

const manifest = JSON.parse(await readFile("docs/deployment-media.json", "utf8"));
for (const asset of manifest.assets) {
  const original = await readFile(asset.source);
  const sha = bytes => createHash("sha256").update(bytes).digest("hex");
  if (original.length !== asset.bytes || sha(original) !== asset.sha256) throw new Error("Source checksum mismatch: " + asset.source);
  if (process.argv.includes("--remote") && asset.url) {
    const url = new URL(asset.url);
    if (url.protocol !== "https:" || !url.hostname.endsWith(".public.blob.vercel-storage.com")) throw new Error("Unexpected media host");
    const response = await fetch(url, { signal: AbortSignal.timeout(120000), headers: { Origin: "https://www.danielnash.co" } });
    if (!response.ok) throw new Error("Media download failed: " + response.status + " " + asset.localPath);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length !== asset.bytes || sha(bytes) !== asset.sha256) throw new Error("Blob checksum mismatch: " + asset.localPath);
    if (response.headers.get("access-control-allow-origin") !== "*") throw new Error("Missing CORS header: " + asset.localPath);
  }
}
console.log("Verified " + manifest.assets.length + " preserved sources" + (process.argv.includes("--remote") ? " and their Blob copies." : ". Pass --remote to verify Blob copies."));
