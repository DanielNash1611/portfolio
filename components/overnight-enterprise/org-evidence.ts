/** Primary roadmap slide 23. Coordinates refer to the inspected 1280×720 local render. */
export const orgChapters = [
  {
    label: "Learn",
    title: "Give people a place to start.",
    detail:
      "Self-paced foundations, videos, and a SharePoint home for tools. Learning has to fit around the work.",
    source: "Online E-Learning",
    crop: [60, 298, 556, 248],
    takeaway: "A reusable foundation",
    note: "The plan specifies accessible learning and completion tracking; the slide does not report completion rates.",
  },
  {
    label: "Practice",
    title: "Bring it into the real workflow.",
    detail:
      "Live sessions pair hands-on application with peer feedback and Gear Advisor demonstrations.",
    source: "In-Person Learning Sessions",
    crop: [696, 291, 526, 250],
    takeaway: "Practice with context",
    note: "Workshops and demonstrations are part of the training design, not a measured claim of performance improvement.",
  },
  {
    label: "Share",
    title: "Let the learning travel.",
    detail:
      "ChatGPT Champions connect departments through shared knowledge, feedback, and experiments.",
    source: "Collaboration / ChatGPT Champions",
    crop: [53, 586, 1172, 90],
    takeaway: "A distributed teaching practice",
    note: "The source describes collaboration across departments. It does not establish reporting lines or a formal organization chart.",
  },
  {
    label: "Sustain",
    title: "Make responsibility part of scale.",
    detail:
      "I partnered with leaders on platform ownership, use-case intake, and enablement responsibilities for an AI Center of Excellence.",
    source: "Authored governance brief / Case account",
    crop: null,
    takeaway: "COE groundwork",
    note: "This is groundwork and proposed next steps, not a claim that every process or agentic workflow was implemented.",
  },
] as const;
export function orgChapterAt(progress: number) {
  return Number.isFinite(progress)
    ? Math.max(0, Math.min(3, Math.floor(progress * 4)))
    : 0;
}
export const orgTargets = [0.04, 0.375, 0.625, 0.92] as const;
export const orgAdoption = {
  earlier: { licensed: 150, active: 40 },
  later: { licensed: 1000, active: 800 },
} as const;
