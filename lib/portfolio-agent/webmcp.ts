import { findRelevantWork, getNavigationTarget } from "./capabilities";
import type { PublicSurface } from "./types";

export type ModelContextTool = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations: {
    readOnlyHint: boolean;
    consequentialHint: boolean;
    untrustedContentHint: boolean;
  };
  execute: (
    input: Record<string, unknown>,
    context: { signal?: AbortSignal },
  ) => Promise<unknown>;
};
export type ModelContext = EventTarget & {
  registerTool: (
    tool: ModelContextTool,
    options: { signal: AbortSignal },
  ) => Promise<void> | void;
};

/** Chrome 155 emits on window; Chrome 156+ emits on modelContext. */
export function subscribePortfolioToolCancellation(
  context: EventTarget,
  browserWindow: EventTarget,
  cancel: () => void,
): () => void {
  const listener = (event: Event) => {
    if (
      (event as Event & { toolName?: string }).toolName ===
      "ask_portfolio_guide"
    )
      cancel();
  };
  context.addEventListener("toolcancel", listener);
  browserWindow.addEventListener("toolcancel", listener);
  return () => {
    context.removeEventListener("toolcancel", listener);
    browserWindow.removeEventListener("toolcancel", listener);
  };
}

export async function registerPortfolioTools(
  context: Pick<ModelContext, "registerTool">,
  catalog: PublicSurface[],
  handlers: {
    open: () => unknown;
    currentSurface: () => PublicSurface;
    navigate: (slug: string, signal?: AbortSignal) => Promise<unknown>;
    evidence: (slug: string, signal?: AbortSignal) => Promise<unknown>;
  },
  signal: AbortSignal,
) {
  const empty = { type: "object", properties: {}, additionalProperties: false };
  const slugInput = {
    type: "object",
    properties: {
      slug: {
        type: "string",
        enum: catalog.map((page) => page.slug),
        description: "Canonical portfolio surface slug.",
      },
    },
    required: ["slug"],
    additionalProperties: false,
  };
  const tools: ModelContextTool[] = [
    {
      name: "find_relevant_work",
      description:
        "Find up to five published portfolio projects for a role or interest. Returns canonical slugs, links, evidence cues and qualified reasons. Does not set the visitor's lens or call an AI model.",
      inputSchema: {
        type: "object",
        properties: {
          intent: {
            type: "string",
            minLength: 1,
            maxLength: 1000,
            description:
              "Role, job brief, or area of interest, such as creative technology.",
          },
        },
        required: ["intent"],
        additionalProperties: false,
      },
      annotations: {
        readOnlyHint: true,
        consequentialHint: false,
        untrustedContentHint: false,
      },
      execute: async (input) => findRelevantWork(catalog, input.intent),
    },
    {
      name: "get_page_evidence",
      description:
        "Read public authored evidence, source links, and ownership limitations for a portfolio page. Published claims are not independently verified. Does not expose private career records or conversation history.",
      inputSchema: slugInput,
      annotations: {
        readOnlyHint: true,
        consequentialHint: false,
        untrustedContentHint: false,
      },
      execute: async (input, { signal: executionSignal } = {}) => {
        const page = getNavigationTarget(catalog, input.slug);
        return handlers.evidence(page.slug, executionSignal);
      },
    },
    {
      name: "navigate_to_page",
      description:
        "Open a canonical portfolio page when the visitor explicitly requests navigation. For recommendations, use find_relevant_work and present links first. Does not submit forms or operate demos.",
      inputSchema: slugInput,
      annotations: {
        readOnlyHint: false,
        consequentialHint: false,
        untrustedContentHint: false,
      },
      execute: async (input, { signal: executionSignal } = {}) => {
        const page = getNavigationTarget(catalog, input.slug);
        return handlers.navigate(page.slug, executionSignal);
      },
    },
    {
      name: "open_portfolio_assistant",
      description:
        "Open the visible site-wide assistant. Its guide_portfolio_tour form sets an optional lens, and ask_portfolio_guide asks a grounded question. Questions use OpenAI and may be saved for 90 days. Opening alone does not create a conversation or return its history.",
      inputSchema: empty,
      annotations: {
        readOnlyHint: false,
        consequentialHint: false,
        untrustedContentHint: false,
      },
      execute: async () => {
        handlers.open();
        const { slug, href, title } = handlers.currentSurface();
        return { slug, href, title, status: "assistant_opened" };
      },
    },
  ];
  for (const tool of tools) {
    if (signal.aborted) return;
    await context.registerTool(
      {
        ...tool,
        execute: async (input, execution = {}) => {
          if (signal.aborted || execution.signal?.aborted)
            throw new DOMException("Cancelled", "AbortError");
          return tool.execute(input, execution);
        },
      },
      { signal },
    );
  }
}
