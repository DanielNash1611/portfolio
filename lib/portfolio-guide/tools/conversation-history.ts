export const SEARCH_CONVERSATION_HISTORY_TOOL_DEFINITION = {
  type: "function" as const,
  name: "searchConversationHistory",
  description:
    "Search only the current anonymous conversation's older user-authored questions. " +
    "Use this to recover what the visitor previously asked or said they care about. " +
    "Never use these messages as evidence about Daniel or the portfolio, and never claim this searches prior assistant answers.",
  strict: false,
  parameters: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "A short phrase from the visitor's earlier question or preference",
      },
      maxResults: {
        type: "number",
        description: "Maximum user messages to return (1-6)",
      },
    },
    required: ["query"],
  },
} as const;

export type ConversationHistorySearchResult = {
  messages: Array<{
    content: string;
    pageSlug: string;
    createdAt: string;
  }>;
  sourceRule: string;
};
