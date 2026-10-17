import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import {
  buildIndex,
  corpusHash,
  EMBEDDING_MODEL,
  hashText,
  validIndex,
  type EmbeddingIndex,
  type SearchDocument,
} from "./hybrid";

/** No dotenv, provider calls, or credential reads on the default/check/prepare path. */
export async function manageIndex(file: string, docs: SearchDocument[]) {
  const read = (path: string): EmbeddingIndex | undefined => {
    try {
      return JSON.parse(readFileSync(path, "utf8"));
    } catch {
      return undefined;
    }
  };
  const cacheFile = file.replace(/\.json$/, "-cache.json");
  const current = read(file);
  const old = current ?? read(cacheFile);
  const cached = docs.flatMap((doc) => {
    const record =
      old?.model === EMBEDDING_MODEL
        ? old.records?.find(
            (r) =>
              r.id === doc.id &&
              r.hash === hashText(doc.text) &&
              Array.isArray(r.vector) &&
              r.vector.length === 1536 &&
              r.vector.every(Number.isFinite),
          )
        : undefined;
    return record ? [record] : [];
  });
  const pending = docs.filter((d) => !cached.some((r) => r.id === d.id));
  const requestBatches = Array.from(
    { length: Math.ceil(docs.length / 64) },
    (_, n) =>
      docs
        .slice(n * 64, n * 64 + 64)
        .some((d) => pending.some((p) => p.id === d.id)),
  );
  const status = {
    model: EMBEDDING_MODEL,
    corpusHash: corpusHash(docs),
    documents: docs.length,
    reusable: cached.length,
    pending: pending.map((d) => d.id),
    pendingUtf8Bytes: pending.reduce(
      (sum, d) => sum + Buffer.byteLength(d.text),
      0,
    ),
    maxEmbeddingRequests: requestBatches.filter(Boolean).length,
    current: validIndex(current, docs),
  };
  if (process.argv.includes("--prepare")) {
    mkdirSync(dirname(file), { recursive: true });
    const candidate: EmbeddingIndex = {
      version: 1,
      model: EMBEDDING_MODEL,
      corpusHash: status.corpusHash,
      records: cached,
    };
    writeFileSync(
      pending.length ? cacheFile : file,
      JSON.stringify(candidate) + "\n",
    );
    writeFileSync(
      file.replace(/\.json$/, "-status.json"),
      JSON.stringify(status, null, 2) + "\n",
    );
  }
  if (process.argv.includes("--build")) {
    if (!process.argv.includes("--allow-paid-embeddings"))
      throw new Error(
        "Paid index preparation requires --allow-paid-embeddings and separate approval.",
      );
    const limit = Number(
      process.argv.find((a) => a.startsWith("--max-requests="))?.split("=")[1],
    );
    if (!Number.isInteger(limit) || limit < 1)
      throw new Error("Set --max-requests explicitly.");
    const key = process.env.OPENAI_API_KEY;
    if (!key)
      throw new Error(
        "OPENAI_API_KEY required; no env files are loaded automatically.",
      );
    const index = await buildIndex(
      docs,
      key,
      {
        version: 1,
        model: EMBEDDING_MODEL,
        corpusHash: status.corpusHash,
        records: cached,
      },
      limit,
    );
    if (!validIndex(index, docs)) throw new Error("Index failed validation");
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, JSON.stringify(index) + "\n");
    status.reusable = docs.length;
    status.pending = [];
    status.pendingUtf8Bytes = 0;
    status.maxEmbeddingRequests = 0;
  }
  status.current = validIndex(read(file), docs);
  console.log(JSON.stringify(status, null, 2));
  if (
    process.argv.includes("--require-semantic") &&
    !validIndex(read(file), docs)
  )
    throw new Error(
      "Semantic index missing or stale; lexical fallback remains available.",
    );
  if (existsSync(file) && !validIndex(read(file), docs))
    throw new Error(
      "Stale semantic index must be refreshed or removed before release.",
    );
}
