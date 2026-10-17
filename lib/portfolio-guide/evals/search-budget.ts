import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { isAbsolute, resolve } from "node:path";
import {
  adaptiveIndexes,
  adaptiveSourceInventory,
  compareSearchRankings,
  loadAdaptiveBundle,
  runAdaptiveCase,
} from "./search-adaptive";

/** Dedicated limits for the proposed October 17 search evaluation. No live transport. */
export const SEARCH_RULES = {
  "career-index": {
    model: "text-embedding-3-small",
    endpoint: "embeddings",
    calls: 1,
    inputs: 2,
    input: 4_000,
    output: 0,
    inputNano: 20,
    outputNano: 0,
  },
  "portfolio-index": {
    model: "text-embedding-3-small",
    endpoint: "embeddings",
    calls: 1,
    inputs: 63,
    input: 40_000,
    output: 0,
    inputNano: 20,
    outputNano: 0,
  },
  "query-vectors": {
    model: "text-embedding-3-small",
    endpoint: "embeddings",
    calls: 1,
    inputs: 29,
    input: 20_000,
    output: 0,
    inputNano: 20,
    outputNano: 0,
  },
  routing: {
    model: "gpt-6-luna",
    endpoint: "decisions",
    calls: 6,
    inputs: 0,
    input: 8_000,
    output: 0,
    inputNano: 100,
    outputNano: 0,
  },
  "relevance-ID-selection": {
    model: "gpt-5.6-terra",
    endpoint: "responses",
    calls: 6,
    inputs: 0,
    input: 48_000,
    output: 600,
    inputNano: 2_500,
    outputNano: 12_000,
  },
  "source-aware-judge": {
    model: "gpt-6.1-sol",
    endpoint: "responses",
    calls: 6,
    inputs: 0,
    input: 48_000,
    output: 1_200,
    inputNano: 2_500,
    outputNano: 10_000,
  },
} as const;
for (const rule of Object.values(SEARCH_RULES)) Object.freeze(rule);
Object.freeze(SEARCH_RULES);
export type SearchStage = keyof typeof SEARCH_RULES;
export const SEARCH_CASES = [
  "patent-measurement",
  "ownership",
  "onboarding",
  "oms-context",
  "qualification",
  "role-fit",
] as const;
Object.freeze(SEARCH_CASES);
export type SearchCase = (typeof SEARCH_CASES)[number];
export const SEARCH_LIMITS = Object.freeze({
  calls: 21,
  maximumReservationNano: 1_561_280_000,
  incrementalCeilingNano: 2_000_000_000,
  priorUsageNano: 1_732_836_800,
  overallCeilingNano: 10_000_000_000,
  priorCalls: 59,
  historySha256:
    "fcf7afc84c0bc7ee9e4c2edfa60096c449b2d1ce7d4f5f9285b5788af4a31ef9",
  queriesSha256:
    "90dd9aae3586e56ad3a764d976ec0f57d5de6399227216301e98a725881478ce",
});
type Json = Record<string, unknown>;
type EmbeddingStage = "career-index" | "portfolio-index" | "query-vectors";
export type FrozenSearchManifest = {
  executionId: string;
  proposalSha256: string;
  historySha256: string;
  /** Include all transitive public source, cache, prompt/builder, guard and harness files. */
  files: Array<{ path: string; sha256: string }>;
  repositories: Array<{ path: string; head: string }>;
  corpusHashes: { career: string; portfolio: string };
  embeddingInputs: Record<EmbeddingStage, string[]>;
  routingMode: Record<SearchCase, "call" | "bypass">;
  packetMode?: "adaptive-v1";
  publicBundle?: { path: string; sha256: string };
  journalDirectory?: string;
  /** Exact-packet unit mode only. Adaptive mode requires an empty map and
   * constructs packets through the pinned static builder inside execute(). */
  requestSha256: Record<
    "routing" | "relevance-ID-selection" | "source-aware-judge",
    Record<SearchCase, string>
  >;
};
export type SearchApproval = {
  approved: boolean;
  pricingVerified: boolean;
  scopeSha256: string;
  executionId: string;
  proposalSha256: string;
  historySha256: string;
  incrementalCeilingNano: number;
  overallCeilingNano: number;
};
export type SearchEntry = {
  slot: string;
  stage: SearchStage;
  model: string;
  requestSha256: string;
  reservedNano: number;
  inputTokenUpperBound: number;
  status: "reserved" | "complete" | "unknown";
  usage?: Json;
  usageCostUpperBoundNano?: number;
};
export type SearchSnapshot = {
  executionId: string;
  scopeSha256: string;
  stopped: boolean;
  reason?: string;
  reservedNano: number;
  priorUsageNano: number;
  cumulativeAdmissionNano: number;
  ledger: SearchEntry[];
  bypassedRouting: SearchCase[];
  acceptedCases: Partial<Record<SearchCase, CaseChecks>>;
};
type CaseChecks = {
  judgePassed: boolean;
  sourceSafety: boolean;
  citations: boolean;
  qualifications: boolean;
};
export type SearchJournal = {
  /** Atomically exclusive across processes and guard instances. Never overwrite. */
  claim: (
    executionId: string,
    scopeSha256: string,
    record: { manifest: FrozenSearchManifest; approval: SearchApproval },
  ) => void;
  /** Must be durable before returning. Preserve every event, including reservations. */
  append: (snapshot: SearchSnapshot) => void;
  /** Persist exact HTTP status and body before parsing, including non-2xx replies. */
  raw: (slot: string, response: SearchReply) => void;
  request?: (slot: string, body: string) => void;
  artifact?: (name: string, value: unknown) => void;
};
export type SearchReply = { status: number; body: string };
export type SearchTransport = (request: {
  url: string;
  method: "POST";
  body: string;
  signal: AbortSignal;
}) => Promise<SearchReply>;
export const searchSha256 = (text: string | Buffer) =>
  createHash("sha256").update(text).digest("hex");
export const searchManifestHash = (manifest: FrozenSearchManifest) =>
  searchSha256(JSON.stringify(manifest));
const sha = (x: unknown): x is string =>
  typeof x === "string" && /^[a-f0-9]{64}$/.test(x);
const integer = (x: unknown): x is number =>
  Number.isSafeInteger(x) && (x as number) >= 0;
const reserve = (stage: SearchStage) => {
  const r = SEARCH_RULES[stage];
  return r.input * r.inputNano + r.output * r.outputNano;
};

/** Local-only inspection: no environment, credentials, provider or remote Git. */
export function verifyFrozenSearchFiles(manifest: FrozenSearchManifest): void {
  for (const file of manifest.files)
    if (searchSha256(readFileSync(file.path)) !== file.sha256)
      throw new Error("frozen_file_changed");
  if (
    manifest.packetMode === "adaptive-v1" &&
    adaptiveSourceInventory(
      manifest.repositories[0].path,
      manifest.repositories[1].path,
    ).some((path) => !manifest.files.some((file) => file.path === path))
  )
    throw new Error("frozen_source_inventory_changed");
  for (const repository of manifest.repositories)
    if (
      execFileSync("git", ["-C", repository.path, "rev-parse", "HEAD"], {
        encoding: "utf8",
      }).trim() !== repository.head
    )
      throw new Error("frozen_commit_changed");
}

/** Single execution, full reservations retained for the entire run. Callers must
 * supply a reviewed raw transport that makes exactly one attempt, without SDK
 * retries. This module has no fetch default or credential discovery. */
export function createSearchBudgetGuard(options: {
  manifest: FrozenSearchManifest;
  approval: SearchApproval;
  journal: SearchJournal;
  transport: SearchTransport;
  timeoutMs?: number;
}) {
  const manifest = structuredClone(options.manifest);
  const approval = structuredClone(options.approval);
  const journal = { ...options.journal };
  const transport = options.transport;
  const scopeSha256 = searchManifestHash(manifest);
  const stages = Object.keys(SEARCH_RULES) as SearchStage[];
  const timeoutMs = options.timeoutMs ?? 60_000;
  const adaptive = manifest.packetMode === "adaptive-v1";
  if (manifest.packetMode !== undefined && !adaptive)
    throw new Error("unknown_packet_mode");
  if (
    adaptive &&
    (typeof journal.request !== "function" ||
      typeof journal.artifact !== "function" ||
      Object.keys(manifest.requestSha256).length !== 0 ||
      !manifest.files.some(
        (f) =>
          f.path ===
          resolve(
            manifest.repositories[0].path,
            "lib/portfolio-guide/evals/search-adaptive.ts",
          ),
      ))
  )
    throw new Error("frozen_adaptive_builder_and_journal_required");
  if (
    approval.approved !== true ||
    approval.pricingVerified !== true ||
    !sha(manifest.executionId) ||
    approval.executionId !== manifest.executionId ||
    approval.scopeSha256 !== scopeSha256 ||
    !sha(manifest.proposalSha256) ||
    approval.proposalSha256 !== manifest.proposalSha256 ||
    manifest.historySha256 !== SEARCH_LIMITS.historySha256 ||
    approval.historySha256 !== manifest.historySha256 ||
    !integer(approval.incrementalCeilingNano) ||
    approval.incrementalCeilingNano > SEARCH_LIMITS.incrementalCeilingNano ||
    approval.incrementalCeilingNano < SEARCH_LIMITS.maximumReservationNano ||
    !integer(approval.overallCeilingNano) ||
    approval.overallCeilingNano > SEARCH_LIMITS.overallCeilingNano ||
    approval.overallCeilingNano <
      SEARCH_LIMITS.priorUsageNano + approval.incrementalCeilingNano ||
    !Number.isSafeInteger(timeoutMs) ||
    timeoutMs < 1 ||
    timeoutMs > 60_000 ||
    typeof journal.claim !== "function" ||
    typeof journal.append !== "function" ||
    typeof journal.raw !== "function" ||
    typeof transport !== "function"
  )
    throw new Error("explicit_frozen_approval_and_durable_journal_required");
  if (
    manifest.corpusHashes.career !==
      "4adfeda571d38965d06be767a1549c6d7f426e8f5bf17a8e52d1b53ccababa94" ||
    manifest.corpusHashes.portfolio !==
      "1b9efb69391740d0b314fd5f3d58984af6bdc4b8bb2ab21456b97b8b96d92e8d" ||
    manifest.repositories.length !== 2 ||
    new Set(manifest.repositories.map((r) => r.path)).size !== 2 ||
    manifest.repositories.some((r) => !/^[a-f0-9]{40}$/.test(r.head)) ||
    manifest.repositories.some((r) => !isAbsolute(r.path)) ||
    !manifest.files.length ||
    manifest.files.some((f) => !sha(f.sha256) || !isAbsolute(f.path)) ||
    new Set(manifest.files.map((f) => f.path)).size !== manifest.files.length ||
    !manifest.files.some((f) => f.sha256 === manifest.proposalSha256) ||
    !manifest.files.some((f) => f.sha256 === SEARCH_LIMITS.queriesSha256)
  )
    throw new Error("incomplete_frozen_sources");
  for (const stage of stages) {
    const rule = SEARCH_RULES[stage];
    if (rule.inputs) {
      const inputs = manifest.embeddingInputs[stage as EmbeddingStage];
      if (
        !Array.isArray(inputs) ||
        inputs.length !== rule.inputs ||
        inputs.some((s) => typeof s !== "string" || !s.trim())
      )
        throw new Error("invalid_frozen_embedding_inputs");
    } else if (
      !adaptive &&
      SEARCH_CASES.some(
        (id) =>
          !sha(
            manifest.requestSha256[
              stage as keyof typeof manifest.requestSha256
            ]?.[id],
          ),
      )
    ) {
      throw new Error("every_case_packet_must_be_frozen");
    }
  }
  if (
    SEARCH_CASES.some(
      (id) => !["call", "bypass"].includes(manifest.routingMode?.[id]),
    )
  )
    throw new Error("frozen_routing_plan_required");
  const queryFile = manifest.files.find(
    (f) => f.sha256 === SEARCH_LIMITS.queriesSha256,
  )!;
  const queries = JSON.parse(readFileSync(queryFile.path, "utf8")) as Array<{
    query: string;
  }>;
  if (
    JSON.stringify(queries.map((q) => q.query)) !==
    JSON.stringify(manifest.embeddingInputs["query-vectors"])
  )
    throw new Error("frozen_queries_mismatch");
  verifyFrozenSearchFiles(manifest);
  const adaptiveBundle = adaptive ? loadAdaptiveBundle(manifest) : undefined;
  const ledger: SearchEntry[] = [];
  const vectors = new Map<string, number[]>();
  const acceptedCases = new Map<SearchCase, CaseChecks>();
  const bypassedRouting = new Set<SearchCase>();
  let busy = false;
  let stopped = false;
  let reason: string | undefined;
  let active: AbortController | undefined;
  const reserved = () => ledger.reduce((sum, e) => sum + e.reservedNano, 0);
  const snapshot = (): SearchSnapshot =>
    structuredClone({
      executionId: manifest.executionId,
      scopeSha256,
      stopped,
      reason,
      reservedNano: reserved(),
      priorUsageNano: SEARCH_LIMITS.priorUsageNano,
      cumulativeAdmissionNano: SEARCH_LIMITS.priorUsageNano + reserved(),
      ledger,
      bypassedRouting: [...bypassedRouting],
      acceptedCases: Object.fromEntries(acceptedCases),
    });
  const stop = (code = "quality_failure") => {
    stopped = true;
    reason ??= code;
    active?.abort();
    try {
      journal.append(snapshot());
    } catch {
      /* Existing durable reservations remain authoritative. */
    }
  };
  // Claim before exposing a usable guard. A crash or a second constructor cannot resume it.
  journal.claim(
    manifest.executionId,
    scopeSha256,
    structuredClone({ manifest, approval }),
  );
  try {
    journal.append(snapshot());
  } catch {
    stop("journal_failure");
    throw new Error("journal_failure");
  }

  async function call(
    stage: SearchStage,
    caseId: SearchCase | undefined,
    body: string,
  ): Promise<Json> {
    if (stopped) throw new Error("search_evaluation_stopped_no_retry");
    if (busy) {
      stop("concurrent_request");
      throw new Error("concurrent_request");
    }
    busy = true; // Before any async boundary, including transport and journal work.
    let entry: SearchEntry | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      verifyFrozenSearchFiles(manifest);
      if (!Object.hasOwn(SEARCH_RULES, stage) || typeof body !== "string")
        throw new Error("invalid_stage_or_body");
      const rule = SEARCH_RULES[stage];
      if (rule.inputs ? caseId !== undefined : !SEARCH_CASES.includes(caseId!))
        throw new Error("unapproved_case_slot");
      if (!rule.inputs) {
        const modelStages = [
          "routing",
          "relevance-ID-selection",
          "source-aware-judge",
        ] as const;
        const expectedCase = SEARCH_CASES[acceptedCases.size];
        const completedForCase =
          ledger.filter(
            (e) => e.slot.endsWith(`:${caseId}`) && e.status === "complete",
          ).length + (bypassedRouting.has(caseId!) ? 1 : 0);
        if (
          caseId !== expectedCase ||
          stage !== modelStages[completedForCase] ||
          (stage === "routing" && manifest.routingMode[caseId] !== "call")
        )
          throw new Error("case_or_stage_order");
      }
      const slot = `${stage}:${caseId ?? "batch"}`;
      if (ledger.some((e) => e.slot === slot))
        throw new Error("duplicate_slot_no_retry");
      if (
        ledger.filter((e) => e.stage === stage).length >= rule.calls ||
        ledger.length >= SEARCH_LIMITS.calls
      )
        throw new Error("call_cap");
      const inputBound = Buffer.byteLength(body, "utf8") + 1_024;
      if (inputBound > rule.input) throw new Error("input_cap");
      const request = JSON.parse(body) as Json;
      if (!request || Array.isArray(request) || request.model !== rule.model)
        throw new Error("model_not_allowed");
      // A strict allowlist prevents hidden tools, chaining, alternate tiers and output modalities.
      const allowed = rule.inputs
        ? ["model", "input", "dimensions", "encoding_format"]
        : rule.endpoint === "decisions"
          ? ["model", "input", "questions"]
          : [
              "model",
              "input",
              "instructions",
              "max_output_tokens",
              "service_tier",
              "store",
              "text",
              "reasoning",
            ];
      if (Object.keys(request).some((key) => !allowed.includes(key)))
        throw new Error("request_field_not_allowed");
      if (rule.inputs) {
        if (
          request.dimensions !== 1536 ||
          request.encoding_format !== "float" ||
          JSON.stringify(request.input) !==
            JSON.stringify(manifest.embeddingInputs[stage as EmbeddingStage]) ||
          body !==
            JSON.stringify({
              model: rule.model,
              input: manifest.embeddingInputs[stage as EmbeddingStage],
              dimensions: 1536,
              encoding_format: "float",
            })
        )
          throw new Error("embedding_packet_mismatch");
      } else {
        if (
          !["career-index", "portfolio-index", "query-vectors"].every((s) =>
            ledger.some((e) => e.stage === s && e.status === "complete"),
          )
        )
          throw new Error("embeddings_not_complete");
        if (
          rule.endpoint === "responses" &&
          (request.service_tier !== "default" || request.store !== false)
        )
          throw new Error("tier_or_storage_not_allowed");
        if (
          rule.endpoint === "responses" &&
          (!integer(request.max_output_tokens) ||
            request.max_output_tokens < 1 ||
            request.max_output_tokens > rule.output)
        )
          throw new Error("output_cap");
        if (
          !adaptive &&
          searchSha256(body) !==
            manifest.requestSha256[
              stage as keyof typeof manifest.requestSha256
            ][caseId!]
        )
          throw new Error("frozen_request_mismatch");
      }
      const reservation = reserve(stage);
      if (
        reserved() + reservation > SEARCH_LIMITS.maximumReservationNano ||
        reserved() + reservation > approval.incrementalCeilingNano ||
        SEARCH_LIMITS.priorUsageNano + reserved() + reservation >
          approval.overallCeilingNano
      )
        throw new Error("reservation_cap");
      entry = {
        slot,
        stage,
        model: rule.model,
        requestSha256: searchSha256(body),
        reservedNano: reservation,
        inputTokenUpperBound: inputBound,
        status: "reserved",
      };
      ledger.push(entry);
      journal.append(snapshot()); // Required durable write before a single transport attempt.
      journal.request?.(slot, body);
      active = new AbortController();
      const controller = active;
      const result = await Promise.race([
        transport({
          url: `https://api.openai.com/v1/${rule.endpoint}`,
          method: "POST",
          body,
          signal: controller.signal,
        }).then((response) => {
          // Capture even a late response from a transport that ignored abort.
          // It never settles an unknown charge or reopens this execution.
          journal.raw(slot, structuredClone(response));
          return response;
        }),
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => {
            controller.abort();
            reject(new Error("transport_timeout"));
          }, timeoutMs);
        }),
      ]);
      if (stopped) throw new Error("stopped_during_transport");
      verifyFrozenSearchFiles(manifest);
      if (
        !integer(result.status) ||
        result.status < 200 ||
        result.status >= 300 ||
        typeof result.body !== "string" ||
        Buffer.byteLength(result.body) > 4 * 1024 * 1024
      )
        throw new Error("http_or_response_bounds");
      const data = JSON.parse(result.body) as Json;
      if (
        !data ||
        Array.isArray(data) ||
        typeof data.model !== "string" ||
        !(
          data.model === rule.model ||
          (data.model.startsWith(`${rule.model}-`) &&
            /^\d{4}-\d{2}-\d{2}$/.test(data.model.slice(rule.model.length + 1)))
        )
      )
        throw new Error("missing_or_unexpected_model");
      if (rule.endpoint === "responses" && data.service_tier !== "default")
        throw new Error("missing_or_unexpected_tier");
      if (
        rule.endpoint !== "responses" &&
        data.service_tier !== undefined &&
        data.service_tier !== "default"
      )
        throw new Error("unexpected_tier");
      if (rule.endpoint === "responses" && data.status !== "completed")
        throw new Error("incomplete_response");
      const usage = data.usage as Json | undefined;
      const input = rule.inputs ? usage?.prompt_tokens : usage?.input_tokens;
      const output =
        rule.inputs || rule.endpoint === "decisions"
          ? (usage?.output_tokens ?? 0)
          : usage?.output_tokens;
      if (
        !integer(input) ||
        input > inputBound ||
        !integer(output) ||
        output > rule.output ||
        (rule.endpoint === "responses" &&
          output > (request.max_output_tokens as number)) ||
        !integer(usage?.total_tokens) ||
        usage.total_tokens !== input + output
      )
        throw new Error("uncertain_usage");
      const cost = input * rule.inputNano + output * rule.outputNano;
      if (cost > reservation) throw new Error("usage_exceeds_reservation");
      let batch: number[][] = [];
      if (rule.inputs) {
        const rows = data.data as Array<{ index: number; embedding: number[] }>;
        if (
          !Array.isArray(rows) ||
          rows.length !== rule.inputs ||
          new Set(rows.map((r) => r?.index)).size !== rule.inputs ||
          rows.some(
            (r) =>
              !r ||
              !integer(r.index) ||
              r.index >= rule.inputs ||
              !Array.isArray(r.embedding) ||
              r.embedding.length !== 1536 ||
              !r.embedding.every(
                (v) => typeof v === "number" && Number.isFinite(v),
              ),
          )
        )
          throw new Error("invalid_embeddings");
        batch = [...rows]
          .sort((a, b) => a.index - b.index)
          .map((r) => [...r.embedding]);
      }
      Object.assign(entry, {
        status: "complete",
        usage,
        usageCostUpperBoundNano: cost,
      });
      journal.append(snapshot());
      if (stage === "query-vectors")
        manifest.embeddingInputs[stage].forEach((q, i) =>
          vectors.set(searchSha256(q), batch[i]),
        );
      return structuredClone(data);
    } catch {
      if (entry) entry.status = "unknown";
      stop("request_failed_or_uncertain");
      // Never relay transport errors that could contain request headers or credentials.
      throw new Error("search_evaluation_failed_no_retry");
    } finally {
      if (timer) clearTimeout(timer);
      active = undefined;
      busy = false;
    }
  }
  const core = {
    call,
    snapshot,
    stop,
    /** Freeze existing routing policy; a recorded bypass consumes no call. */
    bypassRouting(caseId: SearchCase): void {
      try {
        verifyFrozenSearchFiles(manifest);
        if (
          stopped ||
          busy ||
          manifest.routingMode[caseId] !== "bypass" ||
          caseId !== SEARCH_CASES[acceptedCases.size] ||
          bypassedRouting.has(caseId) ||
          ledger.some(
            (e) =>
              !SEARCH_RULES[e.stage].inputs && e.slot.endsWith(`:${caseId}`),
          ) ||
          !["career-index", "portfolio-index", "query-vectors"].every((s) =>
            ledger.some((e) => e.stage === s && e.status === "complete"),
          )
        )
          throw new Error("unapproved_routing_bypass");
        bypassedRouting.add(caseId);
        journal.append(snapshot());
      } catch {
        stop("routing_bypass_failed");
        throw new Error("routing_bypass_failed");
      }
    },
    /** The frozen harness must finish semantic/source assertions before the
     * next case. This guard does not itself judge factual answer quality. */
    acceptCase(caseId: SearchCase, checks: CaseChecks): void {
      const last = ledger.at(-1);
      if (
        stopped ||
        busy ||
        caseId !== SEARCH_CASES[acceptedCases.size] ||
        last?.slot !== `source-aware-judge:${caseId}` ||
        last.status !== "complete" ||
        !checks ||
        checks.judgePassed !== true ||
        checks.sourceSafety !== true ||
        checks.citations !== true ||
        checks.qualifications !== true
      ) {
        stop("critical_case_check_failed");
        throw new Error("critical_case_check_failed");
      }
      acceptedCases.set(caseId, structuredClone(checks));
      try {
        journal.append(snapshot());
      } catch {
        stop("journal_failure");
        throw new Error("journal_failure");
      }
    },
    queryVector(query: string): number[] {
      if (stopped) throw new Error("search_evaluation_stopped_no_retry");
      try {
        verifyFrozenSearchFiles(manifest);
      } catch {
        stop("frozen_sources_changed");
        throw new Error("frozen_sources_changed");
      }
      const vector = vectors.get(searchSha256(query));
      if (!vector) {
        stop("query_cache_miss");
        throw new Error("query_cache_miss_no_transport");
      }
      return [...vector];
    },
  };
  let executed = false;
  return {
    ...core,
    call: adaptive
      ? async () => {
          stop("arbitrary_adaptive_packet");
          throw new Error("adaptive_packets_are_runner_owned");
        }
      : core.call,
    acceptCase: adaptive
      ? () => {
          stop("external_case_gate");
          throw new Error("adaptive_case_gates_are_runner_owned");
        }
      : core.acceptCase,
    bypassRouting: adaptive
      ? () => {
          stop("external_routing_bypass");
          throw new Error("adaptive_bypasses_are_runner_owned");
        }
      : core.bypassRouting,
    async execute() {
      if (!adaptiveBundle || executed || stopped) {
        stop("invalid_adaptive_execution");
        throw new Error("adaptive_execution_not_available_or_already_used");
      }
      executed = true;
      try {
        const receipts: Record<string, Record<string, unknown>> = {};
        for (const stage of [
          "career-index",
          "portfolio-index",
          "query-vectors",
        ] as const)
          receipts[stage] = await core.call(
            stage,
            undefined,
            JSON.stringify({
              model: SEARCH_RULES[stage].model,
              input: manifest.embeddingInputs[stage],
              dimensions: 1536,
              encoding_format: "float",
            }),
          );
        const indexes = adaptiveIndexes(adaptiveBundle, receipts);
        const rankings = compareSearchRankings(
          adaptiveBundle,
          indexes,
          core.queryVector,
        );
        journal.artifact!("indexes", indexes);
        journal.artifact!("rankings", rankings);
        if (rankings.some((r) => r.lexicalPass && !r.hybridPass))
          throw new Error("retrieval_regression");
        const results = [];
        for (const id of SEARCH_CASES) {
          const result = await runAdaptiveCase(adaptiveBundle, indexes, id, {
            call: (stage, caseId, body) => core.call(stage, caseId, body),
            queryVector: core.queryVector,
            bypassRouting: core.bypassRouting,
            record: (name, value) => journal.artifact!(name, value),
          });
          journal.artifact!(`case-${id}`, result);
          core.acceptCase(id, result.checks);
          results.push(result);
        }
        return { rankings, results, snapshot: snapshot() };
      } catch (error) {
        try {
          journal.artifact!("failure", {
            code:
              error instanceof Error && /^[a-z_]+$/.test(error.message)
                ? error.message
                : "adaptive_validation_failed",
            snapshot: snapshot(),
          });
        } catch {
          /* Durable reservations remain authoritative. */
        }
        stop("adaptive_execution_failed");
        throw new Error("adaptive_execution_failed_no_retry");
      }
    },
  };
}
