import { readFileSync } from "node:fs";
import {
  hashText,
  corpusHash,
  validIndex,
  type EmbeddingIndex,
} from "../../search/hybrid";
import { adaptiveIndexes, type PublicSearchBundle } from "./search-adaptive";
import type { FrozenSearchManifest } from "./search-budget";

type Row = { id: string; hash: string; vector: number[] };
/** Reuse exact query vectors only, with their original cache bytes frozen too. */
export function nativeQueryCache(
  manifest: FrozenSearchManifest,
  bundle: PublicSearchBundle,
): Row[] {
  const ref = manifest.nativeReuse;
  if (
    !ref ||
    !manifest.files.some(
      (f) => f.path === ref.path && f.sha256 === ref.sha256,
    ) ||
    hashText(readFileSync(ref.path, "utf8")) !== ref.sha256
  )
    throw new Error("native_query_cache_not_frozen");
  const reuse = JSON.parse(readFileSync(ref.path, "utf8"));
  if (
    reuse.model !== "text-embedding-3-small" ||
    reuse.dimensions !== 1536 ||
    reuse.vectors.queries.length !== 14
  )
    throw new Error("native_query_cache_scope");
  const rows = reuse.vectors.queries as Array<
    Row & { provenance: { fileSha256: string; recordId: string } }
  >;
  if (
    new Set(rows.map((r) => r.id)).size !== 14 ||
    rows.some(
      (r) =>
        !bundle.queries.some(
          (q) => q.id === r.id && hashText(q.query) === r.hash,
        ) ||
        r.vector.length !== 1536 ||
        !r.vector.every((v) => typeof v === "number" && Number.isFinite(v)),
    )
  )
    throw new Error("native_query_cache_invalid");
  for (const row of rows) {
    const file = manifest.files.find(
      (f) => f.sha256 === row.provenance.fileSha256,
    );
    if (!file || hashText(readFileSync(file.path, "utf8")) !== file.sha256)
      throw new Error("native_cache_origin_not_frozen");
    const original = JSON.parse(readFileSync(file.path, "utf8"));
    if (
      original.model !== "text-embedding-3-small" ||
      !original.records.some(
        (r: Row) =>
          r.id === row.provenance.recordId &&
          r.hash === row.hash &&
          JSON.stringify(r.vector) === JSON.stringify(row.vector),
      )
    )
      throw new Error("native_cache_origin_mismatch");
  }
  return structuredClone(rows);
}

/** Split the one 17-text receipt into two career and 15 query vectors. */
export function nativeIndexes(
  bundle: PublicSearchBundle,
  receipts: Record<string, Record<string, unknown>>,
  reused: Row[],
) {
  const rows = receipts["career-index"].data as Array<{
    index: number;
    embedding: number[];
  }>;
  const values = [...rows]
    .sort((a, b) => a.index - b.index)
    .map((r) => r.embedding);
  const missingCareer = bundle.career.documents.filter(
    (d) => !bundle.career.cache.records.some((r) => r.id === d.id),
  );
  if (missingCareer.length !== 2 || values.length !== 17)
    throw new Error("native_embedding_partition");
  const missingQueries = bundle.queries.filter(
    (q) => !reused.some((r) => r.hash === hashText(q.query)),
  );
  const all = [
    ...reused,
    ...missingQueries.map((q, i) => ({
      id: q.id,
      hash: hashText(q.query),
      vector: values[i + 2],
    })),
  ];
  const queries = bundle.queries.map((q) => {
    const row = all.find((r) => r.id === q.id && r.hash === hashText(q.query));
    if (!row) throw new Error("native_query_receipt_missing");
    return row;
  });
  const queryDocuments = bundle.queries.map((q) => ({
    id: q.id,
    projectId: "eval",
    text: q.query,
  }));
  const queryIndex: EmbeddingIndex = {
    version: 1,
    model: "text-embedding-3-small",
    corpusHash: corpusHash(queryDocuments),
    records: queries,
  };
  if (!validIndex(queryIndex, queryDocuments))
    throw new Error("native_query_index_invalid");
  const receipt = (vectors: number[][]) => ({
    data: vectors.map((embedding, index) => ({ index, embedding })),
  });
  return {
    ...adaptiveIndexes(bundle, {
      "career-index": receipt(values.slice(0, 2)),
      "portfolio-index": receipts["portfolio-index"],
    }),
    queries,
    queryIndex,
  };
}
