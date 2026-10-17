import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

export const EMBEDDING_MODEL = "text-embedding-3-small";
export type SearchDocument = {
  id: string;
  text: string;
  projectId: string;
  revision?: string;
};
export type EmbeddingIndex = {
  version: 1;
  model: string;
  corpusHash: string;
  records: Array<{ id: string; hash: string; vector: number[] }>;
};
export type SearchHit = SearchDocument & {
  score: number;
  lexicalCoverage: number;
  similarity?: number;
};
const STOP = new Set(
  "a an the is in on at to for of and or with has have does do can daniel he his him what which how show me evidence experience work done from that this it about as did been you your my i us more any".split(
    " ",
  ),
);
const ALIASES = [
  ["oms", "order management"],
  ["eeg", "brain waves", "neural signals"],
  ["immiatrics", "immunology scout"],
  ["scientist", "scientists", "scientific", "researcher"],
  ["hallucination", "hallucinations", "fabricated"],
  ["roadmap", "prioritization", "prioritise", "prioritize"],
  ["adoption", "adopt", "embrace", "enablement"],
  ["cancellation", "cancel", "cancelling"],
  ["rag", "retrieval"],
  ["mentoring", "mentored", "coached", "coaching"],
];
export function tokens(text: string): string[] {
  const raw =
    text
      .toLowerCase()
      .replace(/[_-]/g, " ")
      .match(/[a-z0-9]+/g) ?? [];
  return raw
    .filter((t) => !STOP.has(t) && t.length > 1)
    .map((t) => (t.length > 4 && t.endsWith("s") ? t.slice(0, -1) : t));
}
export function expandQuery(query: string): string {
  let result = query;
  for (const group of ALIASES) {
    if (group.some((term) => new RegExp(`\\b${term}\\b`, "i").test(query)))
      result += ` ${group.join(" ")}`;
  }
  return result;
}
export function hashText(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}
export function corpusHash(docs: SearchDocument[]): string {
  return hashText(
    JSON.stringify(
      docs
        .map((d) => [d.id, d.projectId, hashText(d.text), d.revision ?? ""])
        .sort((a, b) => a[0].localeCompare(b[0])),
    ),
  );
}
export function validIndex(
  index: unknown,
  docs: SearchDocument[],
): index is EmbeddingIndex {
  const x = index as EmbeddingIndex | undefined;
  if (
    !x ||
    x.version !== 1 ||
    x.model !== EMBEDDING_MODEL ||
    x.corpusHash !== corpusHash(docs) ||
    !Array.isArray(x.records) ||
    x.records.length !== docs.length
  )
    return false;
  if (x.records.some((r) => !r || typeof r.id !== "string")) return false;
  const byId = new Map(x.records.map((r) => [r.id, r]));
  return (
    byId.size === docs.length &&
    docs.every((d) => {
      const r = byId.get(d.id);
      return (
        r?.hash === hashText(d.text) &&
        Array.isArray(r.vector) &&
        r.vector.length === 1536 &&
        r.vector.every(Number.isFinite)
      );
    })
  );
}
export function readIndex(
  file: string,
  docs: SearchDocument[],
): EmbeddingIndex | undefined {
  try {
    const x: unknown = JSON.parse(readFileSync(file, "utf8"));
    return validIndex(x, docs) ? x : undefined;
  } catch {
    return undefined;
  }
}
export function cosine(a: number[], b: number[]): number {
  if (a.length !== b.length || !a.length) return 0;
  let dot = 0,
    aa = 0,
    bb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    aa += a[i] * a[i];
    bb += b[i] * b[i];
  }
  return aa && bb ? dot / Math.sqrt(aa * bb) : 0;
}
export function rankHybrid(
  docs: SearchDocument[],
  query: string,
  options: {
    index?: EmbeddingIndex;
    queryVector?: number[];
    projectId?: string;
    limit?: number;
  } = {},
): SearchHit[] {
  const originalTerms = new Set(tokens(query));
  const q = [...new Set(tokens(expandQuery(query)))];
  if (!q.length) return [];
  const corpus = docs.map((d) => ({ d, words: tokens(d.text) }));
  const avg =
    corpus.reduce((n, d) => n + d.words.length, 0) / Math.max(1, corpus.length);
  const idf = new Map(
    q.map((t) => [
      t,
      Math.log(
        1 +
          (corpus.length -
            corpus.filter((d) => d.words.includes(t)).length +
            0.5) /
            (corpus.filter((d) => d.words.includes(t)).length + 0.5),
      ),
    ]),
  );
  const eligible = corpus.filter(
    (d) => !options.projectId || d.d.projectId === options.projectId,
  );
  const lexical = eligible
    .map(({ d, words }) => {
      let score = 0,
        count = 0;
      for (const t of q) {
        const tf = words.filter((w) => w === t).length;
        if (tf) {
          count++;
          score +=
            ((idf.get(t) ?? 0) * (originalTerms.has(t) ? 2 : 1) * tf * 2.2) /
            (tf + 1.2 * (0.25 + (0.75 * words.length) / Math.max(1, avg)));
        }
      }
      return { ...d, score, lexicalCoverage: count / q.length };
    })
    .filter((d) => d.score > 0)
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
  const semantic =
    options.index && options.queryVector
      ? eligible
          .map(({ d }) => {
            const r = options.index!.records.find((r) => r.id === d.id);
            return {
              ...d,
              similarity: r ? cosine(r.vector, options.queryVector!) : 0,
            };
          })
          .filter((d) => d.similarity >= 0.3)
          .sort((a, b) => b.similarity - a.similarity)
      : [];
  const scores = new Map<string, SearchHit>();
  lexical
    .slice(0, 30)
    .forEach((d, i) => scores.set(d.id, { ...d, score: 1 / (10 + i + 1) }));
  semantic.slice(0, 30).forEach((d, i) =>
    scores.set(d.id, {
      ...d,
      lexicalCoverage: scores.get(d.id)?.lexicalCoverage ?? 0,
      score: (scores.get(d.id)?.score ?? 0) + 1 / (10 + i + 1),
    }),
  );
  const seen = new Set<string>();
  const projectCounts = new Map<string, number>();
  return [...scores.values()]
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    .filter((d) => {
      const key = hashText(d.text.toLowerCase());
      if (
        seen.has(key) ||
        (!options.projectId && (projectCounts.get(d.projectId) ?? 0) >= 2)
      )
        return false;
      seen.add(key);
      projectCounts.set(d.projectId, (projectCounts.get(d.projectId) ?? 0) + 1);
      return true;
    })
    .slice(0, options.limit ?? 12);
}
const cache = new Map<string, { vector: number[]; expires: number }>();
export async function embedQuery(
  query: string,
  apiKey: string | undefined,
  signal?: AbortSignal,
): Promise<number[] | undefined> {
  if (!apiKey) return undefined;
  const key = hashText(
    `${EMBEDDING_MODEL}:${apiKey}:${query.trim().toLowerCase()}`,
  );
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) return cached.vector;
  try {
    const res = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model: EMBEDDING_MODEL, input: query }),
      signal: AbortSignal.any([
        AbortSignal.timeout(3000),
        ...(signal ? [signal] : []),
      ]),
    });
    if (!res.ok) return undefined;
    const json = await res.json();
    const vector = json.data?.[0]?.embedding;
    if (
      !Array.isArray(vector) ||
      vector.length !== 1536 ||
      !vector.every(Number.isFinite)
    )
      return undefined;
    if (cache.size >= 256) cache.delete(cache.keys().next().value!);
    cache.set(key, { vector, expires: Date.now() + 900000 });
    return vector;
  } catch {
    if (signal?.aborted) throw signal.reason;
    return undefined;
  }
}
export async function buildIndex(
  docs: SearchDocument[],
  apiKey: string,
  previous?: EmbeddingIndex,
  maxRequests = 1,
): Promise<EmbeddingIndex> {
  let requests = 0;
  const records: EmbeddingIndex["records"] = [];
  for (let offset = 0; offset < docs.length; offset += 64) {
    const batch = docs.slice(offset, offset + 64);
    const missing = batch.filter(
      (d) =>
        previous?.model !== EMBEDDING_MODEL ||
        !previous.records.some(
          (r) =>
            r.id === d.id &&
            r.hash === hashText(d.text) &&
            Array.isArray(r.vector) &&
            r.vector.length === 1536 &&
            r.vector.every(Number.isFinite),
        ),
    );
    let vectors: number[][] = [];
    if (missing.length) {
      if (++requests > maxRequests)
        throw new Error("Embedding request limit reached");
      const response = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: EMBEDDING_MODEL,
          input: missing.map((d) => d.text),
        }),
        signal: AbortSignal.timeout(60000),
      });
      if (!response.ok)
        throw new Error(`Embedding request failed (${response.status})`);
      const result = await response.json();
      vectors = result.data
        .sort((a: { index: number }, b: { index: number }) => a.index - b.index)
        .map((d: { embedding: number[] }) => d.embedding);
      if (
        vectors.length !== missing.length ||
        vectors.some((v) => v.length !== 1536 || !v.every(Number.isFinite))
      )
        throw new Error("Invalid embeddings");
    }
    for (const d of batch) {
      const old =
        previous?.model === EMBEDDING_MODEL
          ? previous.records.find(
              (r) =>
                r.id === d.id &&
                r.hash === hashText(d.text) &&
                Array.isArray(r.vector) &&
                r.vector.length === 1536 &&
                r.vector.every(Number.isFinite),
            )
          : undefined;
      records.push({
        id: d.id,
        hash: hashText(d.text),
        vector: old?.vector ?? vectors[missing.findIndex((m) => m.id === d.id)],
      });
    }
  }
  return {
    version: 1,
    model: EMBEDDING_MODEL,
    corpusHash: corpusHash(docs),
    records,
  };
}
