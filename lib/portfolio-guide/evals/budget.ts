import { createHash } from "node:crypto";

const ROLES = {
  answer: {
    model: "gpt-5.6-terra",
    calls: 12,
    input: 100_000,
    output: 1_200,
    inputNano: 3_250,
    outputNano: 16_000,
  },
  judge: {
    model: "gpt-6.1-sol",
    calls: 6,
    input: 100_000,
    output: 1_200,
    inputNano: 6_500,
    outputNano: 19_500,
  },
  routing: {
    model: "gpt-6-luna",
    calls: 36,
    input: 8_000,
    output: 0,
    inputNano: 200,
    outputNano: 0,
  },
} as const;
type Role = keyof typeof ROLES;
export type EvaluationApproval = {
  approved: boolean;
  ceilingUsd: number;
  scopeSha256: string;
  pricingVerified: boolean;
  historyManifestSha256?: string;
  executionId?: string;
  executionLimits?: {
    calls: Record<Role, number>;
    maximumReservedNano: number;
    maximumTotalAdmissionNano: number;
  };
};
type LedgerEntry = {
  role: Role;
  model: string;
  requestSha256: string;
  reservedNano: number;
  inputTokenUpperBound: number;
  inputTokenSource: "byte-upper-bound";
  status: "reserved" | "complete" | "unknown";
  inputTokens?: number;
  outputTokens?: number;
  usageCostUpperBoundNano?: number;
  usage?: Record<string, unknown>;
};
export type EvaluationBudgetSnapshot = {
  ceilingUsd: number;
  reservedUsd: number;
  stopped: boolean;
  counts: Record<Role, number>;
  ledger: LedgerEntry[];
  priorUsageCostUpperBoundUsd?: number;
  totalAdmittedUpperBoundUsd?: number;
  executionId?: string;
  scopeSha256?: string;
  historyManifestSha256?: string;
};

export type CapturedEvaluationExecution = {
  runClaimJson: string;
  approvalJson: string;
  ledgerJson: string;
};
export type ApprovedEvaluationHistory = {
  approved: boolean;
  executions: Array<{
    executionId: string;
    scopeSha256: string;
    runClaimSha256: string;
    approvalSha256: string;
    ledgerSha256: string;
  }>;
  expectedCallCount: number;
  expectedUsageCostUpperBoundNano: number;
};
const sha256 = (text: string) =>
  createHash("sha256").update(text).digest("hex");
const isSha256 = (text: unknown): text is string =>
  typeof text === "string" && /^[a-f0-9]{64}$/.test(text);

/** Legacy execution identity is stable across harmless JSON formatting changes. */
export function evaluationExecutionIdentity(runClaimJson: string): string {
  const claim = JSON.parse(runClaimJson);
  const scope = claim.scopeSha256 ?? claim.scope;
  if (
    !isSha256(scope) ||
    typeof claim.startedAt !== "string" ||
    !Number.isFinite(Date.parse(claim.startedAt))
  )
    throw new Error("Invalid execution claim identity.");
  if (claim.executionId !== undefined && !isSha256(claim.executionId))
    throw new Error("Invalid approved execution ID.");
  return (
    claim.executionId ??
    sha256(
      JSON.stringify({
        scopeSha256: scope,
        startedAt: new Date(claim.startedAt).toISOString(),
      }),
    )
  );
}

export const evaluationHistoryManifestHash = (
  manifest: ApprovedEvaluationHistory,
) => sha256(JSON.stringify(manifest));

/** Only a reviewed, hash-bound list of separately approved executions permits
 * equal historical payloads. Every charge and reservation remains in its ledger. */
export function reconcileApprovedEvaluationHistory(input: {
  manifest: ApprovedEvaluationHistory;
  records: CapturedEvaluationExecution[];
}) {
  const { manifest, records } = input;
  if (
    manifest.approved !== true ||
    !records.length ||
    records.length !== manifest.executions.length ||
    !Number.isSafeInteger(manifest.expectedCallCount) ||
    manifest.expectedCallCount <= 0 ||
    !Number.isSafeInteger(manifest.expectedUsageCostUpperBoundNano) ||
    manifest.expectedUsageCostUpperBoundNano < 0 ||
    manifest.expectedUsageCostUpperBoundNano > 10e9
  )
    throw new Error(
      "Reviewed execution history and complete expected totals are required.",
    );
  const seenExecutions = new Set<string>();
  const seenApprovals = new Set<string>();
  const seenLedgers = new Set<string>();
  const ledgers = records.map((record, index) => {
    const expected = manifest.executions[index];
    const claim = JSON.parse(record.runClaimJson);
    const approval = JSON.parse(record.approvalJson);
    const ledger = JSON.parse(record.ledgerJson) as EvaluationBudgetSnapshot;
    const executionId = evaluationExecutionIdentity(record.runClaimJson);
    if (
      expected.executionId !== executionId ||
      !isSha256(expected.scopeSha256) ||
      expected.scopeSha256 !== (claim.scopeSha256 ?? claim.scope) ||
      expected.runClaimSha256 !== sha256(record.runClaimJson) ||
      expected.approvalSha256 !== sha256(record.approvalJson) ||
      expected.ledgerSha256 !== sha256(record.ledgerJson) ||
      approval.approved !== true ||
      approval.pricingVerified !== true ||
      approval.scopeSha256 !== expected.scopeSha256 ||
      !Number.isFinite(approval.ceilingUsd) ||
      approval.ceilingUsd <= 0 ||
      approval.ceilingUsd > 10 ||
      ledger.ceilingUsd > approval.ceilingUsd ||
      (claim.executionId !== undefined &&
        approval.executionId !== executionId) ||
      !(
        (claim.mode === "live" && claim.dry !== true) ||
        (claim.dry === false && claim.mode !== "dry-run")
      ) ||
      !(
        claim.resumeOrRetryAllowed === false || claim.retriesAllowed === false
      ) ||
      seenExecutions.has(executionId) ||
      seenApprovals.has(expected.approvalSha256) ||
      seenLedgers.has(expected.ledgerSha256) ||
      (ledger.executionId !== undefined &&
        ledger.executionId !== executionId) ||
      (ledger.scopeSha256 !== undefined &&
        ledger.scopeSha256 !== expected.scopeSha256)
    )
      throw new Error(
        "Unapproved, duplicate or mismatched historical execution; stop.",
      );
    seenExecutions.add(executionId);
    seenApprovals.add(expected.approvalSha256);
    seenLedgers.add(expected.ledgerSha256);
    return ledger;
  });
  const usageCostUpperBoundNano = reconcileLedgerSequence(
    ledgers,
    manifest.executions.map((item) => item.executionId),
  );
  const callCount = ledgers.reduce(
    (sum, ledger) => sum + ledger.ledger.length,
    0,
  );
  if (
    callCount !== manifest.expectedCallCount ||
    usageCostUpperBoundNano !== manifest.expectedUsageCostUpperBoundNano
  )
    throw new Error(
      "Historical charge totals differ from the reviewed manifest.",
    );
  return {
    usageCostUpperBoundNano,
    callCount,
    manifestSha256: evaluationHistoryManifestHash(manifest),
    executionIds: [...seenExecutions],
  };
}

/** Completed runs settle to a conservative usage bound; unknown runs never settle. */
export function reconcileCompletedEvaluationLedgers(
  prior: EvaluationBudgetSnapshot[],
): number {
  return reconcileLedgerSequence(prior);
}

function reconcileLedgerSequence(
  prior: EvaluationBudgetSnapshot[],
  approvedExecutions?: string[],
): number {
  const legacySeen = new Set<string>();
  let costNano = 0;
  for (const run of prior) {
    const seen = approvedExecutions ? new Set<string>() : legacySeen;
    if (
      run.priorUsageCostUpperBoundUsd !== undefined &&
      Math.round(run.priorUsageCostUpperBoundUsd * 1e9) !== costNano
    )
      throw new Error(
        "Missing or duplicate prior ledger chain; no further paid calls.",
      );
    if (
      run.stopped !== false ||
      !Array.isArray(run.ledger) ||
      !run.ledger.length ||
      !Number.isFinite(run.ceilingUsd) ||
      run.ceilingUsd <= 0 ||
      run.ceilingUsd > 10 ||
      Object.keys(ROLES).some(
        (role) =>
          !Number.isSafeInteger(run.counts[role as Role]) ||
          run.counts[role as Role] < 0 ||
          run.counts[role as Role] > ROLES[role as Role].calls ||
          run.counts[role as Role] !==
            run.ledger.filter((entry) => entry.role === role).length,
      )
    )
      throw new Error(
        "Prior evaluation ledger is incomplete; stop for budget reconciliation.",
      );
    let reservations = 0;
    for (const entry of run.ledger) {
      const rule = ROLES[entry.role];
      if (
        !rule ||
        entry.status !== "complete" ||
        entry.model !== rule.model ||
        !/^[a-f0-9]{64}$/.test(entry.requestSha256) ||
        seen.has(entry.requestSha256) ||
        !Number.isSafeInteger(entry.inputTokens) ||
        entry.inputTokens! < 0 ||
        entry.inputTokens! > entry.inputTokenUpperBound ||
        !Number.isSafeInteger(entry.inputTokenUpperBound) ||
        entry.inputTokenUpperBound > rule.input ||
        !Number.isSafeInteger(entry.outputTokens) ||
        entry.outputTokens! < 0 ||
        entry.outputTokens! > rule.output ||
        entry.reservedNano !==
          rule.input * rule.inputNano + rule.output * rule.outputNano ||
        !entry.usage ||
        entry.usage.input_tokens !== entry.inputTokens ||
        (entry.usage.output_tokens ??
          (entry.role === "routing" ? 0 : undefined)) !== entry.outputTokens
      )
        throw new Error(
          "Unknown, duplicate or invalid prior usage; no further paid calls.",
        );
      seen.add(entry.requestSha256);
      const upper =
        entry.inputTokens! * rule.inputNano +
        entry.outputTokens! * rule.outputNano;
      if (entry.usageCostUpperBoundNano !== upper || upper > entry.reservedNano)
        throw new Error("Prior usage bound cannot be established; stop.");
      costNano += upper;
      reservations += entry.reservedNano;
    }
    if (
      Math.round(run.reservedUsd * 1e9) !== reservations ||
      reservations > Math.round(run.ceilingUsd * 1e9) ||
      (run.totalAdmittedUpperBoundUsd !== undefined &&
        Math.round(run.totalAdmittedUpperBoundUsd * 1e9) !==
          Math.round((run.priorUsageCostUpperBoundUsd ?? 0) * 1e9) +
            reservations)
    )
      throw new Error("Prior reservations do not reconcile; stop.");
  }
  return costNano;
}

/** Offline until explicitly approved. A conservative admission guard, not a provider billing cap. */
export function createEvaluationBudgetGuard(options: {
  approval: EvaluationApproval;
  scopeSha256: string;
  fetch: typeof fetch;
  onChange?: (snapshot: EvaluationBudgetSnapshot) => void;
  priorCompletedLedgers?: EvaluationBudgetSnapshot[];
  approvedPriorHistory?: {
    manifest: ApprovedEvaluationHistory;
    records: CapturedEvaluationExecution[];
  };
  executionId?: string;
  /** Must durably and atomically refuse a reused execution ID before transport. */
  claimExecution?: (identity: {
    executionId: string;
    scopeSha256: string;
    historyManifestSha256: string;
  }) => void;
}) {
  const approval = structuredClone(options.approval);
  const scopeSha256 = options.scopeSha256;
  const executionId = options.executionId;
  const ledger: LedgerEntry[] = [];
  let busy = false;
  let stopped = false;
  const counts = { answer: 0, judge: 0, routing: 0 };
  const ceilingNano = Math.floor(approval.ceilingUsd * 1e9);
  if (options.approvedPriorHistory && options.priorCompletedLedgers)
    throw new Error("Use one explicit historical accounting contract.");
  const reviewedHistory = options.approvedPriorHistory
    ? reconcileApprovedEvaluationHistory(options.approvedPriorHistory)
    : undefined;
  const priorUsageNano =
    reviewedHistory?.usageCostUpperBoundNano ??
    reconcileCompletedEvaluationLedgers(options.priorCompletedLedgers ?? []);
  const limits = approval.executionLimits;
  if (
    reviewedHistory &&
    (!isSha256(executionId) ||
      approval.executionId !== executionId ||
      approval.historyManifestSha256 !== reviewedHistory.manifestSha256 ||
      !options.claimExecution ||
      !limits ||
      reviewedHistory.executionIds.includes(executionId))
  )
    throw new Error(
      "New execution identity, reviewed history pin, explicit limits and durable claim are required.",
    );
  if (limits) {
    const plannedMaximum = (Object.keys(ROLES) as Role[]).reduce(
      (sum, role) => {
        const count = limits.calls[role];
        if (
          !Number.isSafeInteger(count) ||
          count < 0 ||
          count > ROLES[role].calls
        )
          throw new Error("Invalid approved execution call limits.");
        return (
          sum +
          count *
            (ROLES[role].input * ROLES[role].inputNano +
              ROLES[role].output * ROLES[role].outputNano)
        );
      },
      0,
    );
    if (
      !Number.isSafeInteger(limits.maximumReservedNano) ||
      limits.maximumReservedNano !== plannedMaximum ||
      plannedMaximum <= 0 ||
      !Number.isSafeInteger(limits.maximumTotalAdmissionNano) ||
      priorUsageNano + plannedMaximum > limits.maximumTotalAdmissionNano ||
      limits.maximumTotalAdmissionNano > ceilingNano
    )
      throw new Error(
        "Complete approved execution cannot fit its cumulative reservation bound.",
      );
  }
  let executionClaimed = false;
  const reserved = () =>
    ledger.reduce((sum, item) => sum + item.reservedNano, 0);
  const snapshot = (): EvaluationBudgetSnapshot => ({
    ceilingUsd: approval.ceilingUsd,
    reservedUsd: reserved() / 1e9,
    stopped,
    counts: { ...counts },
    ledger: ledger.map((item) => ({ ...item })),
    priorUsageCostUpperBoundUsd: priorUsageNano / 1e9,
    totalAdmittedUpperBoundUsd: (priorUsageNano + reserved()) / 1e9,
    ...(executionId
      ? {
          executionId,
          scopeSha256,
          historyManifestSha256: reviewedHistory?.manifestSha256,
        }
      : {}),
  });
  const guardedFetch: typeof fetch = async (input, init) => {
    if (
      approval.approved !== true ||
      approval.pricingVerified !== true ||
      approval.scopeSha256 !== scopeSha256 ||
      !/^[a-f0-9]{64}$/.test(scopeSha256)
    )
      throw new Error(
        "Evaluation approval, verified pricing and matching frozen scope are required.",
      );
    if (
      typeof approval.ceilingUsd !== "number" ||
      !Number.isFinite(ceilingNano) ||
      ceilingNano <= 0 ||
      ceilingNano > 10e9
    )
      throw new Error("Approved evaluation ceiling must be at most $10.");
    if (stopped)
      throw new Error(
        "Evaluation stopped after an uncertain or failed request; no automatic retries.",
      );
    if (busy) throw new Error("Evaluation requests must run sequentially.");
    const url = String(input);
    if (
      ![
        "https://api.openai.com/v1/responses",
        "https://api.openai.com/v1/decisions",
      ].includes(url) ||
      init?.method !== "POST" ||
      typeof init.body !== "string"
    )
      throw new Error(
        "Only bounded, nonstreaming OpenAI evaluation POST requests are allowed.",
      );
    const body = JSON.parse(init.body);
    const role = (Object.keys(ROLES) as Role[]).find(
      (key) => ROLES[key].model === body.model,
    );
    if (!role)
      throw new Error("Model is outside the approved evaluation plan.");
    const rule = ROLES[role];
    if (
      (role === "routing") !== url.endsWith("/decisions") ||
      body.stream ||
      body.background ||
      (body.service_tier && body.service_tier !== "default")
    )
      throw new Error(
        "Endpoint, execution mode or service tier is outside the approved plan.",
      );
    if (
      role !== "routing" &&
      (body.store !== false ||
        body.service_tier !== "default" ||
        !Number.isInteger(body.max_output_tokens) ||
        body.max_output_tokens <= 0 ||
        body.max_output_tokens > rule.output)
    )
      throw new Error(
        "Responses require store:false, default service tier and at most 1200 total output tokens.",
      );
    if (
      (body.tools ?? []).some(
        (tool: { type?: string; name?: string }) =>
          tool.type !== "function" || tool.name !== "searchCareerEvidence",
      )
    )
      throw new Error(
        "External discovery tools are outside this evaluation plan.",
      );
    // Byte length deliberately overcounts byte-tokenized input; the additional allowance
    // covers request framing. Oversized context stops the run instead of truncating it.
    const requestSha256 = createHash("sha256").update(init.body).digest("hex");
    if (counts[role] >= rule.calls)
      throw new Error("Approved role-specific call limit exhausted.");
    if (limits && counts[role] >= limits.calls[role])
      throw new Error("Approved execution call limit exhausted.");
    if (ledger.some((item) => item.requestSha256 === requestSha256))
      throw new Error("Duplicate request/retry requires separate review.");
    const inputBound = Buffer.byteLength(init.body, "utf8") + 1_024;
    if (inputBound > rule.input)
      throw new Error(
        "Conservative input bound exceeds the frozen token limit; revise the packet before calling.",
      );
    // Reserve each role's complete maximum, never refund reservations during this run.
    const reservedNano =
      rule.input * rule.inputNano + rule.output * rule.outputNano;
    if (priorUsageNano + reserved() + reservedNano > ceilingNano)
      throw new Error(
        "Insufficient approved budget to reserve this complete request.",
      );
    if (
      limits &&
      (reserved() + reservedNano > limits.maximumReservedNano ||
        priorUsageNano + reserved() + reservedNano >
          limits.maximumTotalAdmissionNano)
    )
      throw new Error("Explicit execution reservation exhausted.");
    if (reviewedHistory && !executionClaimed) {
      try {
        options.claimExecution!({
          executionId: executionId!,
          scopeSha256,
          historyManifestSha256: reviewedHistory.manifestSha256,
        });
        executionClaimed = true;
      } catch (error) {
        stopped = true;
        throw error;
      }
    }
    const entry: LedgerEntry = {
      role,
      model: rule.model,
      requestSha256,
      reservedNano,
      inputTokenUpperBound: inputBound,
      inputTokenSource: "byte-upper-bound",
      status: "reserved",
    };
    ledger.push(entry);
    counts[role]++;
    busy = true;
    try {
      options.onChange?.(snapshot()); // Persist the full reservation before transport.
      const result = await options.fetch(input, init); // One raw transport attempt; no SDK retries.
      if (!result.ok)
        throw new Error(
          `Evaluation HTTP ${result.status}; result retained as failed/unknown.`,
        );
      const data = await result.clone().json();
      const usage = data.usage;
      if (
        role !== "routing" &&
        data.service_tier &&
        data.service_tier !== "default"
      )
        throw new Error("Unexpected processing tier; stop for pricing review.");
      const inputTokens = usage?.input_tokens;
      const outputTokens =
        usage?.output_tokens ?? (role === "routing" ? 0 : undefined);
      if (
        !Number.isInteger(inputTokens) ||
        inputTokens < 0 ||
        inputTokens > inputBound ||
        !Number.isInteger(outputTokens) ||
        outputTokens < 0 ||
        outputTokens > rule.output ||
        (data.model &&
          data.model !== rule.model &&
          !data.model.startsWith(`${rule.model}-`))
      )
        throw new Error(
          "Missing, unexpected or out-of-bounds model/token usage; stop for review.",
        );
      Object.assign(entry, {
        status: "complete",
        inputTokens,
        outputTokens,
        usage,
        usageCostUpperBoundNano:
          inputTokens * rule.inputNano + outputTokens * rule.outputNano,
      });
      options.onChange?.(snapshot());
      return result;
    } catch (error) {
      entry.status = "unknown";
      stopped = true;
      try {
        options.onChange?.(snapshot());
      } catch {
        /* The pre-call reservation remains authoritative. */
      }
      throw error;
    } finally {
      busy = false;
    }
  };
  return {
    fetch: guardedFetch,
    snapshot,
  };
}
