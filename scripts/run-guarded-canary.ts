import { createHash } from "node:crypto";
import { readFileSync, mkdirSync, writeFileSync, renameSync } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { runGuardedCanary } from "@/lib/portfolio-guide/evals/canary";
import type {
  CanaryApproval,
  CanaryPacket,
} from "@/lib/portfolio-guide/evals/canary";

async function main() {
  const { values } = parseArgs({
    options: {
      packet: { type: "string" },
      approval: { type: "string" },
      "out-dir": { type: "string" },
      "dry-run": { type: "boolean" },
    },
  });
  if (!values.packet || !values["out-dir"])
    throw new Error(
      "Provide --packet and --out-dir; live execution also requires a reviewed --approval file.",
    );
  const packetBytes = readFileSync(path.resolve(values.packet));
  const scopeSha256 = createHash("sha256").update(packetBytes).digest("hex");
  const packet = JSON.parse(packetBytes.toString()) as CanaryPacket;
  const dryRun = values["dry-run"] === true;
  const approval: CanaryApproval = values.approval
    ? JSON.parse(readFileSync(path.resolve(values.approval), "utf8"))
    : {
        approved: false,
        pricingVerified: false,
        ceilingUsd: 10,
        scopeSha256,
        targetModelConfirmed: false,
        tokenCountingPricingVerified: false,
        tokenCountingChargeUsd: -1,
      };
  const out = path.resolve(values["out-dir"]);
  const ledgerPath = path.join(out, "budget-ledger.json");
  const result = await runGuardedCanary({
    packet,
    scopeSha256,
    approval,
    dryRun,
    apiKey: dryRun ? undefined : process.env.OPENAI_API_KEY,
    journal: {
      claim: (scope, mode) => {
        mkdirSync(out, { recursive: true });
        writeFileSync(
          path.join(out, "run-claim.json"),
          JSON.stringify(
            {
              scopeSha256: scope,
              mode,
              startedAt: new Date().toISOString(),
              resumeOrRetryAllowed: false,
            },
            null,
            2,
          ) + "\n",
          { flag: "wx", mode: 0o600 },
        );
      },
      budget: (state) => {
        writeFileSync(
          ledgerPath + ".next",
          JSON.stringify(state, null, 2) + "\n",
          { mode: 0o600 },
        );
        renameSync(ledgerPath + ".next", ledgerPath);
      },
      result: (name, record) => {
        if (!/^[a-zA-Z0-9-]+$/.test(name))
          throw new Error("Invalid result name.");
        writeFileSync(
          path.join(out, name + ".json"),
          JSON.stringify(record, null, 2) + "\n",
          { flag: "wx", mode: 0o600 },
        );
      },
    },
  });
  console.log(
    JSON.stringify({
      mode: dryRun ? "dry-run fixtures only" : "live canary",
      scopeSha256,
      workflows: result.workflows,
      pairedJudgments: result.pairedJudgments,
      routingCases: result.routing.length,
      paidCalls: dryRun ? 0 : result.budget.ledger.length,
      reservedUsd: result.budget.reservedUsd,
      semanticClaimsAllowed: result.semanticClaimsAllowed,
      deploymentVerified: false,
    }),
  );
}
main().catch((error) => {
  console.error(
    error instanceof Error
      ? error.message.replace(/sk-[A-Za-z0-9_-]+/g, "[redacted]")
      : "Canary stopped.",
  );
  process.exitCode = 1;
});
