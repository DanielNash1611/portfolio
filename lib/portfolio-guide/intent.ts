import type { NarrativeId } from "@/data/positioning";
import type { VisitorIntent } from "@/lib/portfolio-guide/types";

export const ROLE_INTENT_QUICK_SELECTS = [
  "AI Product Manager",
  "Group PM",
  "Director of Product",
  "Platform PM",
  "0-to-1 AI Builder",
] as const;

export type RoleIntentQuickSelect =
  (typeof ROLE_INTENT_QUICK_SELECTS)[number];

type QuickSelectConfig = Omit<VisitorIntent, "rawInput">;

const QUICK_SELECT_MAP: Record<RoleIntentQuickSelect, QuickSelectConfig> = {
  "AI Product Manager": {
    normalizedTitle: "AI Product Manager",
    seniority: "pm",
    roleLenses: ["senior-product-manager", "builder-pm"],
    focusAreas: ["ai-product"],
    emphasis: ["technical-depth", "scale"],
  },
  "Group PM": {
    normalizedTitle: "Group Product Manager",
    seniority: "group",
    roleLenses: ["senior-product-manager", "product-leader"],
    focusAreas: ["ai-product"],
    emphasis: ["leadership", "scale"],
  },
  "Director of Product": {
    normalizedTitle: "Director of Product",
    seniority: "director",
    roleLenses: ["product-leader"],
    emphasis: ["leadership", "scale"],
  },
  "Platform PM": {
    normalizedTitle: "Platform Product Manager",
    seniority: "pm",
    roleLenses: ["builder-pm", "senior-product-manager"],
    focusAreas: ["platform"],
    emphasis: ["technical-depth", "scale"],
  },
  "0-to-1 AI Builder": {
    normalizedTitle: "0-to-1 AI Builder",
    seniority: "pm",
    roleLenses: ["builder-pm"],
    focusAreas: ["ai-product"],
    emphasis: ["0-to-1", "technical-depth"],
  },
};

const TITLE_MATCHES: Array<{
  title: string;
  keywords: string[];
}> = [
  {
    title: "Director of Product",
    keywords: ["director of product", "product director"],
  },
  {
    title: "Group Product Manager",
    keywords: ["group product manager", "group pm", "manager of managers"],
  },
  {
    title: "Platform Product Manager",
    keywords: ["platform pm", "platform product manager"],
  },
  {
    title: "AI Product Manager",
    keywords: ["ai product manager", "product manager, ai", "ai pm"],
  },
  {
    title: "0-to-1 AI Builder",
    keywords: ["0-to-1 ai builder", "zero to one ai builder", "ai builder"],
  },
];

const FOCUS_KEYWORDS: Record<string, string[]> = {
  "ai-product": [
    "ai product",
    "ai-native",
    "chatgpt",
    "gpt",
    "llm",
    "agent",
    "agents",
  ],
  platform: [
    "platform",
    "mcp",
    "connector",
    "connectors",
    "retrieval",
    "rag",
    "infrastructure",
    "system",
    "systems",
  ],
  commerce: [
    "commerce",
    "checkout",
    "conversion",
    "ecommerce",
    "retail",
    "growth",
  ],
  healthtech: [
    "healthtech",
    "immunology",
    "biotech",
    "science",
    "scientific",
    "research",
  ],
};

const EMPHASIS_KEYWORDS: Record<string, string[]> = {
  leadership: [
    "leadership",
    "leader",
    "director",
    "head of product",
    "vp product",
    "vice president",
    "chief product officer",
    "cpo",
    "operating model",
    "enablement",
    "governance",
  ],
  "0-to-1": [
    "0-to-1",
    "zero to one",
    "prototype",
    "mvp",
    "greenfield",
    "incubation",
    "builder",
    "new product",
  ],
  "technical-depth": [
    "technical",
    "architecture",
    "engineering",
    "retrieval",
    "connector",
    "integration",
    "orchestration",
    "agent",
  ],
  experimentation: [
    "experiment",
    "experimentation",
    "a/b",
    "ab test",
    "pilot",
    "validation",
    "hypothesis",
  ],
  scale: [
    "scale",
    "scaled",
    "scaling",
    "rollout",
    "adoption",
    "enterprise",
    "operating model",
  ],
  ux: [
    "ux",
    "user experience",
    "design",
    "journey",
    "usability",
    "interface",
  ],
};

const ROLE_LENS_KEYWORDS: Record<NarrativeId, string[]> = {
  "senior-product-manager": [
    "product manager",
    "growth",
    "commerce",
    "checkout",
    "customer journey",
    "experimentation",
    "cross-functional",
    "execution",
  ],
  "builder-pm": [
    "builder",
    "platform",
    "prototype",
    "mvp",
    "0-to-1",
    "zero to one",
    "ai",
    "technical",
    "agent",
    "connector",
  ],
  "product-leader": [
    "director",
    "vp",
    "head",
    "chief",
    "group",
    "operating model",
    "governance",
    "enablement",
    "planning rhythm",
  ],
};

function normalizeWhitespace(input: string): string {
  return input.replace(/\s+/g, " ").trim();
}

function containsAny(text: string, keywords: string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword));
}

function uniqueStrings(items: string[]): string[] {
  return [...new Set(items.filter(Boolean))];
}

function inferSeniority(text: string): VisitorIntent["seniority"] {
  if (
    containsAny(text, [
      "vp",
      "vice president",
      "head of product",
      "chief",
      "cpo",
    ])
  ) {
    return "exec";
  }

  if (containsAny(text, ["director", "product director"])) {
    return "director";
  }

  if (containsAny(text, ["group", "manager of managers", "group pm"])) {
    return "group";
  }

  if (containsAny(text, ["senior", "lead", "principal", "staff"])) {
    return "senior";
  }

  return "pm";
}

function inferNormalizedTitle(text: string): string | undefined {
  const match = TITLE_MATCHES.find(({ keywords }) => containsAny(text, keywords));
  return match?.title;
}

function extractSignals(
  text: string,
  keywordMap: Record<string, string[]>,
): string[] {
  return Object.entries(keywordMap)
    .filter(([, keywords]) => containsAny(text, keywords))
    .map(([signal]) => signal);
}

function inferRoleLenses(
  text: string,
  seniority: VisitorIntent["seniority"],
  focusAreas: string[],
  emphasis: string[],
  baseRoleLenses: NarrativeId[],
): NarrativeId[] {
  const scores = new Map<NarrativeId, number>();

  function addScore(roleLens: NarrativeId, amount: number) {
    scores.set(roleLens, (scores.get(roleLens) ?? 0) + amount);
  }

  for (const lens of baseRoleLenses) {
    addScore(lens, 5);
  }

  for (const [lens, keywords] of Object.entries(ROLE_LENS_KEYWORDS) as Array<
    [NarrativeId, string[]]
  >) {
    if (containsAny(text, keywords)) {
      addScore(lens, 3);
    }
  }

  if (focusAreas.includes("platform") || emphasis.includes("technical-depth")) {
    addScore("builder-pm", 2);
  }

  if (focusAreas.includes("commerce") || emphasis.includes("ux")) {
    addScore("senior-product-manager", 2);
  }

  if (
    emphasis.includes("leadership") ||
    seniority === "group" ||
    seniority === "director" ||
    seniority === "exec"
  ) {
    addScore("product-leader", 3);
  }

  if (
    focusAreas.includes("ai-product") ||
    emphasis.includes("0-to-1") ||
    emphasis.includes("technical-depth")
  ) {
    addScore("builder-pm", 2);
  }

  if (emphasis.includes("experimentation") || focusAreas.includes("commerce")) {
    addScore("senior-product-manager", 2);
  }

  const ranked = [...scores.entries()]
    .filter(([, score]) => score > 0)
    .sort((left, right) => right[1] - left[1])
    .map(([lens]) => lens);

  if (ranked.length > 0) {
    return ranked.slice(0, 3);
  }

  if (seniority === "group" || seniority === "director" || seniority === "exec") {
    return ["product-leader"];
  }

  if (
    focusAreas.includes("platform") ||
    emphasis.includes("0-to-1") ||
    emphasis.includes("technical-depth")
  ) {
    return ["builder-pm"];
  }

  return ["senior-product-manager"];
}

export function getQuickSelectIntent(
  label: RoleIntentQuickSelect,
): VisitorIntent {
  return {
    rawInput: label,
    ...QUICK_SELECT_MAP[label],
  };
}

export function normalizeVisitorIntent(
  rawInput: string,
  quickSelect?: RoleIntentQuickSelect,
): VisitorIntent | null {
  const normalizedInput = normalizeWhitespace(rawInput);
  if (!normalizedInput) {
    return null;
  }

  const text = normalizedInput.toLowerCase();
  const matchedQuickSelect =
    quickSelect ??
    ROLE_INTENT_QUICK_SELECTS.find(
      (label) => label.toLowerCase() === normalizedInput.toLowerCase(),
    );
  const quickSelectIntent = matchedQuickSelect
    ? getQuickSelectIntent(matchedQuickSelect)
    : null;
  const focusAreas = uniqueStrings([
    ...(quickSelectIntent?.focusAreas ?? []),
    ...extractSignals(text, FOCUS_KEYWORDS),
  ]);
  const emphasis = uniqueStrings([
    ...(quickSelectIntent?.emphasis ?? []),
    ...extractSignals(text, EMPHASIS_KEYWORDS),
  ]);
  const seniority = quickSelectIntent?.seniority ?? inferSeniority(text);
  const roleLenses = inferRoleLenses(
    text,
    seniority,
    focusAreas,
    emphasis,
    quickSelectIntent?.roleLenses ?? [],
  );

  return {
    rawInput: normalizedInput,
    normalizedTitle:
      quickSelectIntent?.normalizedTitle ?? inferNormalizedTitle(text),
    seniority,
    roleLenses,
    focusAreas: focusAreas.length > 0 ? focusAreas : undefined,
    emphasis: emphasis.length > 0 ? emphasis : undefined,
  };
}
