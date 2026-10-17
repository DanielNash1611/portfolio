import { execFileSync } from "node:child_process";
import {
  closeSync,
  fsyncSync,
  mkdirSync,
  openSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { getPortfolioSearchDocuments } from "../search";
import { shouldRouteQuestion } from "../decisions";
import { corpusHash, hashText } from "../../search/hybrid";
import {
  requestForSearchCase,
  adaptiveSourceInventory,
  type PublicSearchBundle,
} from "./search-adaptive";
import {
  SEARCH_CASES,
  SEARCH_LIMITS,
  searchManifestHash,
  type FrozenSearchManifest,
  type SearchApproval,
  NATIVE_SEARCH_LIMITS,
} from "./search-budget";

export const PROPOSED_SEARCH_SHA256 =
  "7bf8e2bfc95fd9e1eeab770c487650c339135a39962521a46481c20e52e1ea5c";
const sync = (path: string) => {
  const fd = openSync(path, "r");
  try {
    fsyncSync(fd);
  } finally {
    closeSync(fd);
  }
};
export function durableDirectory(path: string) {
  mkdirSync(path, { mode: 0o700 });
  sync(dirname(path));
  sync(path);
}
function save(path: string, value: unknown) {
  const fd = openSync(path, "wx", 0o600);
  try {
    writeFileSync(fd, JSON.stringify(value, null, 2) + "\n");
    fsyncSync(fd);
  } finally {
    closeSync(fd);
  }
  sync(dirname(path));
}
/** No dotenv or credentials. Export only the already reviewed public API catalog. */
export function prepareSearchScope(options: {
  portfolioRoot: string;
  careerRoot: string;
  proposal: string;
  queries: string;
  output: string;
  requireClean?: boolean;
  native?: { reuse: string; queryCache: string; originalProposal: string };
}) {
  const portfolioRoot = resolve(options.portfolioRoot),
    careerRoot = resolve(options.careerRoot),
    output = resolve(options.output);
  if (process.cwd() !== portfolioRoot)
    throw new Error("run_from_frozen_portfolio_root");
  const git = (root: string, ...args: string[]) =>
    execFileSync("git", ["-C", root, ...args], { encoding: "utf8" }).trim();
  if (
    options.requireClean &&
    [portfolioRoot, careerRoot].some((root) =>
      git(root, "status", "--porcelain"),
    )
  )
    throw new Error("candidate_checkout_must_be_clean");
  const proposalText = readFileSync(options.proposal, "utf8"),
    queryText = readFileSync(options.queries, "utf8");
  if (
    (!options.native && hashText(proposalText) !== PROPOSED_SEARCH_SHA256) ||
    hashText(queryText) !== SEARCH_LIMITS.queriesSha256
  )
    throw new Error("original_proposal_or_queries_changed");
  const proposal = JSON.parse(proposalText);
  const publicCatalog = JSON.parse(
    execFileSync(
      process.execPath,
      [
        "--import",
        "tsx",
        "-e",
        'const {getPublicEvidenceCatalog}=require("./lib/evidence/catalog.ts"); process.stdout.write(JSON.stringify(getPublicEvidenceCatalog()));',
      ],
      {
        cwd: careerRoot,
        encoding: "utf8",
        maxBuffer: 4 * 1024 * 1024,
        env: { PATH: process.env.PATH, LANG: "en_US.UTF-8", NODE_ENV: "test" },
      },
    ),
  );
  const bundle: PublicSearchBundle = {
    careerRoot,
    career: {
      ...publicCatalog,
      cache: JSON.parse(
        readFileSync(
          resolve(careerRoot, "data/search-index/career-cache.json"),
          "utf8",
        ),
      ),
    },
    portfolioDocuments: getPortfolioSearchDocuments(),
    queries: JSON.parse(queryText),
    questions: proposal.data.questions,
    retrievalCases: {
      career: JSON.parse(
        readFileSync(resolve(careerRoot, "evals/search/cases.json"), "utf8"),
      ),
      portfolio: JSON.parse(
        readFileSync(resolve(portfolioRoot, "evals/search/cases.json"), "utf8"),
      ),
    },
  };
  let reuse: { path: string; sha256: string } | undefined;
  let missingQueries: string[] = [];
  if (options.native) {
    const path = resolve(options.native.reuse);
    const reused = JSON.parse(readFileSync(path, "utf8"));
    reuse = { path, sha256: hashText(readFileSync(path, "utf8")) };
    missingQueries = bundle.queries
      .filter(
        (q) =>
          !reused.vectors.queries.some(
            (r: { id: string; hash: string }) =>
              r.id === q.id && r.hash === hashText(q.query),
          ),
      )
      .map((q) => q.query);
    if (
      missingQueries.length !== 15 ||
      hashText(readFileSync(options.native.originalProposal, "utf8")) !==
        PROPOSED_SEARCH_SHA256
    )
      throw new Error("native_reuse_or_original_proposal_changed");
  }
  const missing = bundle.career.documents.filter(
    (d) => !bundle.career.cache.records.some((r) => r.id === d.id),
  );
  if (
    missing.length !== 2 ||
    missing.some(
      (d) =>
        ![
          "chatgpt-champions-train-trainer",
          "product-operating-model-institutionalized",
        ].includes(d.id),
    )
  )
    throw new Error("new_career_inputs_changed");
  durableDirectory(output);
  durableDirectory(resolve(output, "registry"));
  const bundlePath = resolve(output, "public-inputs.json");
  save(bundlePath, bundle);
  const files = [
    ...new Set([
      ...adaptiveSourceInventory(portfolioRoot, careerRoot),
      resolve(options.proposal),
      resolve(options.queries),
      bundlePath,
      ...(options.native
        ? [
            resolve(options.native.reuse),
            resolve(options.native.queryCache),
            resolve(options.native.originalProposal),
          ]
        : []),
    ]),
  ].sort();
  const manifest: FrozenSearchManifest = {
    executionId: hashText(randomUUID()),
    proposalSha256: hashText(proposalText),
    historySha256: SEARCH_LIMITS.historySha256,
    files: files.map((path) => ({
      path,
      sha256: hashText(readFileSync(path, "utf8")),
    })),
    repositories: [portfolioRoot, careerRoot].map((path) => ({
      path,
      head: git(path, "rev-parse", "HEAD"),
    })),
    corpusHashes: {
      career: corpusHash(bundle.career.documents),
      portfolio: corpusHash(bundle.portfolioDocuments),
    },
    embeddingInputs: {
      "career-index": [...missing.map((d) => d.text), ...missingQueries],
      "portfolio-index": bundle.portfolioDocuments.map((d) => d.text),
      "query-vectors": options.native ? [] : bundle.queries.map((q) => q.query),
    },
    routingMode: Object.fromEntries(
      SEARCH_CASES.map((id) => [
        id,
        shouldRouteQuestion(requestForSearchCase(bundle, id))
          ? "call"
          : "bypass",
      ]),
    ) as FrozenSearchManifest["routingMode"],
    packetMode: options.native ? "native-review-v2" : "adaptive-v1",
    ...(reuse ? { nativeReuse: reuse } : {}),
    publicBundle: {
      path: bundlePath,
      sha256: hashText(readFileSync(bundlePath, "utf8")),
    },
    journalDirectory: resolve(output, "registry"),
    requestSha256: {} as FrozenSearchManifest["requestSha256"],
  };
  const approval: SearchApproval = {
    approved: false,
    pricingVerified: false,
    executionId: manifest.executionId,
    scopeSha256: searchManifestHash(manifest),
    proposalSha256: manifest.proposalSha256,
    historySha256: manifest.historySha256,
    incrementalCeilingNano: options.native
      ? NATIVE_SEARCH_LIMITS.incrementalCeilingNano
      : SEARCH_LIMITS.incrementalCeilingNano,
    overallCeilingNano: SEARCH_LIMITS.overallCeilingNano,
  };
  save(resolve(output, "manifest.json"), manifest);
  save(resolve(output, "approval-pending.json"), approval);
  return { manifest, approval };
}
