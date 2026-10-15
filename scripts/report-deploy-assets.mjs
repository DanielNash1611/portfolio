// Read-only asset inventory for Vercel build logs; no files are modified.
import { readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, relative } from "node:path";

const roots = existsSync("dist")
  ? ["dist"]
  : [".next/static", "public"].filter((path) => existsSync(path));
const files = [];

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (entry.isFile()) {
      const { size } = await stat(path);
      files.push({ path: relative(process.cwd(), join(process.cwd(), path)).replaceAll("\\", "/"), size });
    }
  }
}

for (const root of roots) await walk(root);
files.sort((a, b) => b.size - a.size);
const mb = (bytes) => (bytes / (1024 * 1024)).toFixed(2);
const media = /\.(?:mp3|mp4|m4a|wav|ogg|webm|mov|flac|glb|gltf|wasm)$/i;
const mediaFiles = files.filter((f) => media.test(f.path));
console.log("\n=== DEPLOYED STATIC ASSET AUDIT (uncompressed file sizes) ===");
console.log("Directories inspected: " + (roots.join(", ") || "(none)"));
console.log("Files inspected: " + files.length);
console.log("Total scanned: " + mb(files.reduce((sum, f) => sum + f.size, 0)) + " MiB");
console.log("Audio/video/3D/WASM: " + mediaFiles.length + " files, " + mb(mediaFiles.reduce((sum, f) => sum + f.size, 0)) + " MiB");
console.log("Top 25 files:");
for (const f of files.slice(0, 25)) console.log("  " + mb(f.size).padStart(8) + " MiB  " + f.path);
console.log("=== END STATIC ASSET AUDIT ===\n");
