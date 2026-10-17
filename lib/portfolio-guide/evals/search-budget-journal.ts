import {
  closeSync,
  fsyncSync,
  mkdirSync,
  openSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { resolve } from "node:path";
import type {
  SearchJournal,
  FrozenSearchManifest,
  SearchApproval,
  SearchReply,
  SearchSnapshot,
} from "./search-budget";

/** One fixed registry directory must be shared by every invocation of the
 * reviewed harness. Never delete claims to retry a failed/unknown execution. */
export function createFileSearchJournal(
  registryDirectory: string,
): SearchJournal {
  const root = resolve(registryDirectory);
  // Provision this registry durably once, outside an execution. Creating an
  // unsynced recursive parent chain could otherwise forget a consumed claim.
  if (!statSync(root).isDirectory())
    throw new Error("preexisting_journal_registry_required");
  let directory: string | undefined;
  let sequence = 0;
  const syncDirectory = (path: string) => {
    const fd = openSync(path, "r");
    try {
      fsyncSync(fd);
    } finally {
      closeSync(fd);
    }
  };
  const writeExclusive = (name: string, value: unknown) => {
    if (!directory) throw new Error("journal_not_claimed");
    const fd = openSync(resolve(directory, name), "wx", 0o600);
    try {
      writeFileSync(fd, JSON.stringify(value) + "\n");
      fsyncSync(fd);
    } finally {
      closeSync(fd);
    }
    syncDirectory(directory);
  };
  return {
    claim(
      executionId: string,
      scopeSha256: string,
      record: { manifest: FrozenSearchManifest; approval: SearchApproval },
    ) {
      if (
        directory ||
        !/^[a-f0-9]{64}$/.test(executionId) ||
        !/^[a-f0-9]{64}$/.test(scopeSha256)
      )
        throw new Error("invalid_or_reused_journal_claim");
      const candidate = resolve(root, executionId);
      // mkdir (without recursive) is atomic/exclusive across processes. A crash
      // before claim.json still leaves the execution ID permanently consumed.
      mkdirSync(candidate, { mode: 0o700 });
      directory = candidate;
      syncDirectory(root);
      writeExclusive("claim.json", {
        executionId,
        scopeSha256,
        retriesAllowed: false,
        resumeAllowed: false,
        ...record,
      });
    },
    append(snapshot: SearchSnapshot) {
      writeExclusive(
        `event-${String(sequence++).padStart(4, "0")}.json`,
        snapshot,
      );
    },
    raw(slot: string, response: SearchReply) {
      if (!/^[a-zA-Z0-9-]+:[a-zA-Z0-9-]+$/.test(slot))
        throw new Error("invalid_journal_slot");
      writeExclusive(`raw-${slot.replace(":", "--")}.json`, response);
    },
  };
}
