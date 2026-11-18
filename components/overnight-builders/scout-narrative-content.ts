export const scoutScenes = [
  {
    id: "scout-map",
    label: "The question",
    title: "Start with a question.",
    detail:
      "The invented Aster hypothesis connects to support, inference, conflict and gaps. The map keeps those relationships distinct.",
    image: "/images/experience/scout/aster-map-close.webp",
    alt: "Actual Immunology Scout mechanism map with explicitly fictional Aster study entities and distinct relationship types.",
  },
  {
    id: "scout-relationship",
    label: "The relationship",
    title: "Follow one relationship.",
    detail:
      "The captured selection highlights the connected nodes, keeping one relationship in the context of the wider map.",
    image: "/images/experience/scout/aster-relationship-close.webp",
    alt: "Actual mechanism workspace after selection of a fictional relationship, highlighting its connected nodes.",
  },
  {
    id: "scout-source",
    label: "The source",
    title: "Keep the source in view.",
    detail:
      "The source panel exposes a document identifier, access level and extraction method. The study note shown here is fictional.",
    image: "/images/experience/scout/aster-source-detail.webp",
    alt: "Actual source inspection panel with an explicitly fictional study note, document identifier, access level and extraction method.",
  },
  {
    id: "scout-claim-boundary",
    label: "The boundary",
    title: "Read the boundary, too.",
    detail:
      "“It contains no scientific finding.” The note states its own limit. This capture demonstrates traceability, not validated research.",
    image: "/images/experience/scout/aster-source-detail.webp",
    alt: "Focused crop of the actual source panel’s fictional study note, explicitly stating that it contains no scientific finding.",
  },
] as const;

/** Authored presentation timing only; values encode no research measurement. */
export function scoutSceneAt(progress: number): 0 | 1 | 2 | 3 {
  return progress < 0.34 ? 0 : progress < 0.6 ? 1 : progress < 0.82 ? 2 : 3;
}
