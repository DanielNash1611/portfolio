import { getAllCanonicalPageContexts } from "./context";

const PROJECT_ALIASES: Record<string, string[]> = {
  "oms-chatgpt-app": ["OMS", "order management"],
  "immunology-scout": ["Immunology Scout", "Immiatrics"],
  "chatgpt-enterprise": [
    "ChatGPT Enterprise",
    "Champions",
    "chatgpt-contact-center",
  ],
  "ai-platform-mcp": [
    "AI Platform",
    "Sound Seeker",
    "Sound Synthesist",
    "sound-seeker",
    "sound-synthesist",
    "chatgpt-org-scale",
  ],
  "ai-career-operating-system": ["Career OS"],
  "jira-product-discovery": ["Jira Product Discovery", "JPD"],
  "checkout-redesign": ["checkout"],
  "zimmer-biomet": ["Zimmer", "Biomet"],
  launchmuse: ["LaunchMuse"],
  "eeg-music": ["EEG"],
};

/** Canonical references in the visitor's question only; never role/profile or assistant text. */
export function getNamedProjectIds(question: string): string[] {
  const projects = new Set<string>();
  for (const [id, aliases] of Object.entries(PROJECT_ALIASES)) {
    if (
      aliases.some((alias) => {
        const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        return new RegExp(`\\b${escaped}\\b`, "i").test(question);
      })
    )
      projects.add(id);
  }
  for (const page of getAllCanonicalPageContexts()) {
    if (
      question.toLowerCase().includes(page.title.toLowerCase()) ||
      question.toLowerCase().includes(page.slug)
    )
      projects.add(page.slug);
  }
  return [...projects];
}
