import { createHash } from "node:crypto";

const ROLES = {
  answer: {
    model: "gpt-5.4",
    calls: 24,
    input: 24_000,
    output: 1_200,
    inputNano: 10_000,
    outputNano: 50_000,
  },
  judge: {
    model: "gpt-6.1-sol",
    calls: 6,
    input: 24_000,
    output: 1_200,
    inputNano: 2_000,
    outputNano: 10_000,
  },
  routing: {
    model: "gpt-6-luna",
    calls: 36,
    input: 8_000,
    output: 0,
    inputNano: 100,
    outputNano: 0,
  },
} as const;
type Role = keyof typeof ROLES;
export type EvaluationApproval = {
  approved: boolean;
  ceilingUsd: number;
  scopeSha256: string;
  pricingVerified: boolean;
};
type LedgerEntry = {
  role: Role;
  model: string;
  requestSha256: string;
  reservedNano: number;
  inputTokenUpperBound: number;
  status: "reserved" | "complete" | "unknown";
  inputTokens?: number;
  outputTokens?: number;
  actualNano?: number;
};

/** Offline until explicitly approved. A conservative admission guard, not a provider billing cap. */
export function createEvaluationBudgetGuard(options: {
  approval: EvaluationApproval;
  scopeSha256: string;
  fetch: typeof fetch;
}) {
  const { approval } = options;
  const ledger: LedgerEntry[] = [];
  let busy = false;
  let stopped = false;
  const counts = { answer: 0, judge: 0, routing: 0 };
  const ceilingNano = Math.floor(approval.ceilingUsd * 1e9);
  const reserved = () =>
    ledger.reduce((sum, item) => sum + item.reservedNano, 0);
  const guardedFetch: typeof fetch = async (input, init) => {
    if (
      !approval.approved ||
      !approval.pricingVerified ||
      approval.scopeSha256 !== options.scopeSha256 ||
      !/^[a-f0-9]{64}$/.test(options.scopeSha256)
    )
      throw new Error(
        "Evaluation approval, verified pricing and matching frozen scope are required.",
      );
    if (!Number.isFinite(ceilingNano) || ceilingNano <= 0 || ceilingNano > 10e9)
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
        !Number.isInteger(body.max_output_tokens) ||
        body.max_output_tokens <= 0 ||
        body.max_output_tokens > rule.output)
    )
      throw new Error(
        "Responses require store:false and at most 1200 total output tokens.",
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
    const inputBound = Buffer.byteLength(init.body, "utf8") + 1_024;
    if (inputBound > rule.input)
      throw new Error(
        "Conservative input bound exceeds the frozen token limit; revise the packet before calling.",
      );
    if (counts[role] >= rule.calls)
      throw new Error("Approved role-specific call limit exhausted.");
    const requestSha256 = createHash("sha256").update(init.body).digest("hex");
    if (ledger.some((item) => item.requestSha256 === requestSha256))
      throw new Error("Duplicate request/retry requires separate review.");
    // Reserve each role's complete maximum, never refund reservations during this run.
    const reservedNano =
      rule.input * rule.inputNano + rule.output * rule.outputNano;
    if (reserved() + reservedNano > ceilingNano)
      throw new Error(
        "Insufficient approved budget to reserve this complete request.",
      );
    const entry: LedgerEntry = {
      role,
      model: rule.model,
      requestSha256,
      reservedNano,
      inputTokenUpperBound: inputBound,
      status: "reserved",
    };
    ledger.push(entry);
    counts[role]++;
    busy = true;
    try {
      const result = await options.fetch(input, init); // One raw transport attempt; no SDK retries.
      if (!result.ok)
        throw new Error(
          `Evaluation HTTP ${result.status}; result retained as failed/unknown.`,
        );
      const data = await result.clone().json();
      const usage = data.usage;
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
        actualNano:
          inputTokens * rule.inputNano + outputTokens * rule.outputNano,
      });
      return result;
    } catch (error) {
      entry.status = "unknown";
      stopped = true;
      throw error;
    } finally {
      busy = false;
    }
  };
  return {
    fetch: guardedFetch,
    snapshot: () => ({
      ceilingUsd: approval.ceilingUsd,
      reservedUsd: reserved() / 1e9,
      stopped,
      counts: { ...counts },
      ledger: ledger.map((item) => ({ ...item })),
    }),
  };
}
