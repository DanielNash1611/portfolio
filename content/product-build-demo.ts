/**
 * Condensed reenactment, not a verbatim ChatGPT transcript.
 * Grounding: app/creative/gravity/page.tsx and Gravity/docs/PRD.md.
 * Build/check events and context checkpoints illustrate the method;
 * they are not a historical tool log or live tool results.
 */
export const buildStages = [
  {
    title: "Brainstorm",
    activity: "Imagine",
    takeaway: "Explore the experience before deciding what to build.",
    context: "Capture the why, the listener’s journey, and the open questions.",
  },
  {
    title: "Draft PRD",
    activity: "Define",
    takeaway: "Ask AI to turn the conversation into a document you can review.",
    context: "Record the whole experience and what must stay true.",
  },
  {
    title: "Review",
    activity: "Define",
    takeaway:
      "Correct the requirements. Approve the direction before the build.",
    context: "Agree on the definition. Point the agent to where it lives.",
  },
  {
    title: "Build MVP",
    activity: "Build",
    takeaway:
      "With the PRD approved, let the coding agent implement the first usable version.",
    context:
      "Read before planning. Revisit during changes. Check the whole flow.",
  },
  {
    title: "Try it",
    activity: "Test",
    takeaway:
      "A working MVP gives you something concrete to experience and evaluate.",
    context: "Compare what you experience with the intent in the PRD.",
  },
  {
    title: "Refine",
    activity: "Refine ↻",
    takeaway:
      "Give specific feedback, update the shared context, and run another cycle.",
    context: "Update the definition. The next session reads it again.",
  },
] as const;

export type BuildDemoMessage = {
  author: "Daniel" | "AI collaborator" | "AI builder";
  stage: number;
  text: string;
  duration: number;
  artifact:
    | "idea"
    | "scope"
    | "prd"
    | "review"
    | "approved"
    | "build"
    | "mvp"
    | "test"
    | "refine";
  buildProgress?: number;
};

export const buildMessages: BuildDemoMessage[] = [
  {
    author: "Daniel",
    stage: 0,
    duration: 4200,
    artifact: "idea",
    text: "I wrote a piece with a cello at the center and musicians moving around it. What if you could move inside the music?",
  },
  {
    author: "AI collaborator",
    stage: 0,
    duration: 4200,
    artifact: "idea",
    text: "Let’s explore that. Is the listener conducting the piece, or discovering how it sounds from different places?",
  },
  {
    author: "Daniel",
    stage: 0,
    duration: 4200,
    artifact: "scope",
    text: "Discovering. You could listen from the audience, the cello, or an orbiting performer. Each musician must keep an independent timeline.",
  },
  {
    author: "AI collaborator",
    stage: 0,
    duration: 4200,
    artifact: "scope",
    text: "A browser experience could test that: introduce performers, hear them move, and change where you listen. How much belongs in the first version?",
  },
  {
    author: "Daniel",
    stage: 0,
    duration: 3600,
    artifact: "scope",
    text: "One complete composition. Cello, independent performers, spatial audio, and two visual interpretations: Atomic and Celestial.",
  },
  {
    author: "Daniel",
    stage: 1,
    duration: 3000,
    artifact: "scope",
    text: "Now create a PRD for me to review. Include the whole listener journey, MVP scope, what must stay true, and acceptance criteria.",
  },
  {
    author: "AI collaborator",
    stage: 1,
    duration: 5000,
    artifact: "prd",
    text: "Here’s the draft: begin with cello, introduce performers, explore different listening positions, then return to cello alone. The requirements support that whole experience.",
  },
  {
    author: "Daniel",
    stage: 2,
    duration: 4300,
    artifact: "review",
    text: "Make musical independence explicit: no shared tempo, quantization, or synchronized entrances. The sound must also match each performer’s visible position.",
  },
  {
    author: "AI collaborator",
    stage: 2,
    duration: 4000,
    artifact: "review",
    text: "Updated: those behaviors must stay true through later changes. Keep docs/PRD.md current, and use the repo’s agent instructions to say when to read it—before planning, when scope changes, and before calling the work done.",
  },
  {
    author: "Daniel",
    stage: 3,
    duration: 3600,
    artifact: "approved",
    text: "I’m happy with the PRD. Go ahead and build the first MVP from it. Run the checks and bring back something I can try.",
  },
  {
    author: "AI builder",
    stage: 3,
    duration: 3400,
    artifact: "build",
    buildProgress: 0,
    text: "First I read docs/PRD.md and the relevant design and architecture notes. The intent is discovery inside the music; independent timelines and matching sound and motion must survive every implementation choice.",
  },
  {
    author: "AI builder",
    stage: 3,
    duration: 3400,
    artifact: "build",
    buildProgress: 1,
    text: "Building the performer, audio, and listener controls. As I connect them, I’m returning to the listener journey in the PRD. A control can work on its own while the overall experience is still wrong.",
  },
  {
    author: "AI builder",
    stage: 3,
    duration: 3400,
    artifact: "build",
    buildProgress: 2,
    text: "Now checking the whole journey against the current PRD: cello → performers → changing perspective → cello alone. Also checking independent timelines and matching sound and motion.",
  },
  {
    author: "AI builder",
    stage: 3,
    duration: 4400,
    artifact: "mvp",
    buildProgress: 3,
    text: "The first usable version is ready to try. You can introduce performers, switch perspectives, and hear the field change around you.",
  },
  {
    author: "Daniel",
    stage: 4,
    duration: 4300,
    artifact: "test",
    text: "Now I have something to experience. I can listen from the center and the edge, watch the performers, and compare it with what I intended.",
  },
  {
    author: "AI collaborator",
    stage: 4,
    duration: 4200,
    artifact: "test",
    text: "Try it with headphones. Does changing perspective change the mix? Do the performers stay independent? What feels different from the original idea?",
  },
  {
    author: "Daniel",
    stage: 5,
    duration: 4300,
    artifact: "refine",
    text: "The MVP works. Now bring the visual atmosphere closer to the concept: richer depth, clearer trails, and a more dimensional cello. Keep the musical behavior intact.",
  },
  {
    author: "AI builder",
    stage: 5,
    duration: 4200,
    artifact: "refine",
    text: "Even in a new session, I start by reading the current PRD and design references. I’ll refine the visuals, preserve musical independence, and check the whole journey again. We’ll record the agreed changes and why for the next session.",
  },
  {
    author: "AI collaborator",
    stage: 5,
    duration: 4000,
    artifact: "refine",
    text: "Back to trying it. The cycle continues with a real product in front of you: experience it, decide what matters, refine, and test again.",
  },
];

export const buildTasks = [
  "Read current intent, flow & constraints",
  "Build; revisit context at decisions",
  "Check the whole experience",
  "Return a testable MVP",
] as const;
