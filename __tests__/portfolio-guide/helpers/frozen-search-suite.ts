import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve, relative } from "node:path";
import { gunzipSync } from "node:zlib";
import { hashText } from "../../../lib/search/hybrid";

type Case = {
  name: string;
  passed: boolean;
  skip?: string | boolean;
  todo?: string | boolean;
  details?: unknown;
};

/** Current runner/guard code, immutable historical public corpus, fake transport only.
 * No dependency on paired checkouts, original home paths, or untracked evidence.
 * A changed/missing fixture or failed child case fails the enclosing suite.
 */
export function runFrozenSearchSuite(suite: "adaptive" | "native") {
  const repo = process.cwd();
  const fixtureRoot = resolve(repo, "__tests__/portfolio-guide/fixtures");
  const archiveBytes = readFileSync(
    resolve(fixtureRoot, "frozen-search-20261017.json.gz"),
  );
  const manifest = JSON.parse(
    readFileSync(
      resolve(fixtureRoot, "frozen-search-20261017.manifest.json"),
      "utf8",
    ),
  );
  const digest = (bytes: Uint8Array) =>
    // hashText and the recorded file hashes both hash UTF-8 bytes for source files.
    createHash("sha256").update(bytes).digest("hex") as string;
  assert.equal(digest(archiveBytes), manifest.archiveSha256);
  const raw = gunzipSync(archiveBytes);
  assert.equal(digest(raw), manifest.uncompressedSha256);
  const snapshot = JSON.parse(raw.toString("utf8"));
  assert.equal(
    snapshot.portfolioCorpusHash,
    "1b9efb69391740d0b314fd5f3d58984af6bdc4b8bb2ab21456b97b8b96d92e8d",
  );
  assert.equal(Object.keys(snapshot.files).length, manifest.files.length);
  const root = mkdtempSync(resolve(tmpdir(), "frozen-search-corpus-"));
  const portfolio = resolve(root, "portfolio-search");
  const career = resolve(root, "resumecustomizer-search");
  const evidence = resolve(
    root,
    "review-evidence/semantic-search-preparation-20261017",
  );
  const output = resolve(repo, "artifacts/frozen-search-tests");
  mkdirSync(output, { recursive: true });
  const env: NodeJS.ProcessEnv = {
    NODE_ENV: "test",
    ...Object.fromEntries(
      ["PATH", "TMPDIR", "LANG", "NODE_OPTIONS"].flatMap((k) =>
        process.env[k] ? [[k, process.env[k]!]] : [],
      ),
    ),
  };
  try {
    mkdirSync(portfolio, { recursive: true });
    // Copy current executable and canonical source files. Only the two explicit
    // portfolio corpus backings below are replaced by the historical bytes.
    for (const name of [
      "lib",
      "content",
      "data",
      "scripts",
      "evals",
      "__tests__",
      "package.json",
      "package-lock.json",
      "tsconfig.json",
      "AGENTS.md",
    ])
      cpSync(resolve(repo, name), resolve(portfolio, name), {
        recursive: true,
      });
    for (const [name, text] of Object.entries(snapshot.files) as Array<
      [string, string]
    >) {
      const prefix = name.split("/")[0];
      const targetRoot =
        prefix === "career"
          ? career
          : prefix === "portfolio"
            ? portfolio
            : prefix === "evidence"
              ? evidence
              : undefined;
      assert.ok(targetRoot, `Unexpected fixture prefix ${prefix}`);
      const destination = resolve(targetRoot, name.slice(prefix.length + 1));
      assert.ok(!relative(targetRoot, destination).startsWith(".."));
      assert.equal(
        hashText(text),
        manifest.files.find((f: { path: string }) => f.path === name)?.sha256,
      );
      assert.doesNotMatch(
        name,
        /(?:^|\/)(?:private|\.application-profile|outputs|credentials)(?:\/|$)|application-profile\.private|\.env/,
      );
      mkdirSync(dirname(destination), { recursive: true });
      writeFileSync(destination, text);
    }
    const modules = realpathSync(resolve(repo, "node_modules"));
    for (const checkout of [portfolio, career]) {
      symlinkSync(modules, resolve(checkout, "node_modules"), "dir");
      execFileSync("git", ["init", "-q", checkout], { env });
      execFileSync(
        "git",
        [
          "-C",
          checkout,
          "-c",
          "user.name=Frozen public fixture",
          "-c",
          "user.email=fixture@example.invalid",
          "commit",
          "-q",
          "--allow-empty",
          "-m",
          "Synthetic source pin",
        ],
        { env },
      );
    }
    const reporter = resolve(
      repo,
      "__tests__/portfolio-guide/helpers/frozen-search-reporter.mjs",
    );
    const offline = resolve(root, "deny-real-provider.mjs");
    writeFileSync(
      offline,
      'globalThis.fetch = async () => { throw Error("Real network forbidden in frozen synthetic fixtures"); };\n',
    );
    const child = spawnSync(
      process.execPath,
      [
        "--import",
        "tsx",
        "--test",
        "--test-reporter",
        reporter,
        `__tests__/portfolio-guide/search-${suite}.cases.ts`,
      ],
      {
        cwd: portfolio,
        env: {
          ...env,
          NODE_ENV: "test",
          NODE_OPTIONS: `${env.NODE_OPTIONS ?? ""} --import=${offline}`.trim(),
        },
        encoding: "utf8",
        maxBuffer: 16 * 1024 * 1024,
        timeout: 60_000,
      },
    );
    writeFileSync(resolve(output, `${suite}.events.jsonl`), child.stdout ?? "");
    writeFileSync(resolve(output, `${suite}.stderr.log`), child.stderr ?? "");
    const events = (child.stdout ?? "")
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line));
    const cases: Case[] = events
      .filter(
        (e) =>
          ["test:pass", "test:fail"].includes(e.type) && e.data.nesting === 0,
      )
      .map((e) => ({ ...e.data, passed: e.type === "test:pass" }));
    const result = {
      suite,
      cases,
      exitCode: child.status,
      signal: child.signal,
      error: child.error?.message,
      archiveSha256: manifest.archiveSha256,
      currentRunnerBytesCopied: true,
      frozenCorpusHash: snapshot.portfolioCorpusHash,
      externalEvidenceRequired: false,
    };
    writeFileSync(
      resolve(output, `${suite}.result.json`),
      JSON.stringify(result, null, 2) + "\n",
    );
    return result;
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}
