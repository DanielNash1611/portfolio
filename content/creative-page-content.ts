// Public narrative shared by the rendered creative pages and Portfolio Guide.

export const gravityAuthorship = {
  accelerated:
    "Blender-to-browser asset iteration, cross-system implementation, edge-case exploration, and a deeper automated-and-browser validation loop.",
  responsible:
    "The composition, product thesis, experience principles, human observation, tradeoffs, and the call on what deserved to ship.",
};

export const tabletopPublicBoundary = {
  shared:
    "This page intentionally shares the product premise, experience principles, visual evolution, and current alpha surface.",
  private:
    "The mechanics, tuning decisions, evaluation data, music structure, and launch strategy stay private while the product is in development.",
};

export const gravityCapabilities = [
  {
    number: "01",
    title: "A space you can enter",
    body: "Free movement, cello and performer perspectives, and an audible listener position turned the field from a scene into a place.",
  },
  {
    number: "02",
    title: "Orbits with real depth",
    body: "Each performer now moves through its own trajectory-defined orbital plane. The renderer and spatial-audio engine read the same position.",
  },
  {
    number: "03",
    title: "Three-dimensional worlds",
    body: "The static Atomic and Celestial backdrops became complete environments, with four quantum regions and four galaxies staged at different distances.",
  },
  {
    number: "04",
    title: "Blender-built musical bodies",
    body: "Astra made Blender part of the working loop. The cello and six mobile instrument types gained stronger 3D forms, better animation, distinct silhouettes, and a textured cello surface.",
  },
  {
    number: "05",
    title: "An embodied input layer",
    body: "Local webcam processing lets a visitor point, grab, follow, turn, zoom, and launch new sounds while keeping mouse and keyboard controls intact.",
  },
  {
    number: "06",
    title: "A way to study the experience",
    body: "Local session recording pairs Gravity audio and a camera inset with a timestamped event log, making interaction problems observable instead of anecdotal.",
  },
] as const;

export const gravityBlenderEvolution = [
  {
    number: "01",
    label: "Model",
    title: "Recognizable bodies",
    body: "A Blender-authored cello and instrument family replaced flatter geometric approximations with more convincing three-dimensional forms.",
  },
  {
    number: "02",
    label: "Surface + motion",
    title: "Texture that could move",
    body: "The cello gained a material texture, while stronger animation made each instrument feel like a body traveling through space rather than a marker crossing a screen.",
  },
  {
    number: "03",
    label: "World",
    title: "Depth all the way out",
    body: "Once the objects had volume, the static backdrop broke the illusion. Atomic and Celestial became 3D environments with galaxies placed at varying distances.",
  },
] as const;

export const gravityFilmTranscript = [
  {
    time: "00–08",
    text: "Reach into the music. Grab a sound. Pull back. Let go.",
  },
  {
    time: "08–15",
    text: "Every shape carries a sound. Independent musical patterns, pulled into orbit.",
  },
  {
    time: "15–22",
    text: "The cello is the center. The other performers move around it, each in their own time.",
  },
  {
    time: "22–31",
    text: "Move through the music. Two hands change where you listen.",
  },
  {
    time: "31–39",
    text: "Hear it from inside the orbit. Grab a performer to follow its journey.",
  },
  {
    time: "39–47",
    text: "One composition. Two worlds. Point to both sides: Celestial becomes Atomic.",
  },
  {
    time: "47–54",
    text: "Astra opened a new creative door. Music × Blender × hand tracking × spatial audio.",
  },
  {
    time: "54–60",
    text: "Gravity. Reach into the music.",
  },
] as const;

export const gravityDecisionChanges = [
  {
    label: "World switching",
    before: "Wave or use broad two-hand expansion and contraction gestures.",
    after:
      "Point at the two visible side controls together, or choose a world in Explore.",
  },
  {
    label: "Holding and launching",
    before: "Depend on a precise pinch and let finger closure move the cursor.",
    after:
      "Use a relaxed grab, anchor the target before closure, and move with the palm. Pinch remains an alternate input.",
  },
  {
    label: "Feedback",
    before: "Ask the visitor to infer whether the system understood them.",
    after:
      "Show the target, dwell progress, spring tension, release state, and a clear path to cancel.",
  },
  {
    label: "Scope",
    before: "Treat a larger gesture vocabulary as a more magical experience.",
    after:
      "Ship a smaller reliable grammar. Keep swipes and full-hand world gestures as documented experiments.",
  },
] as const;

export const gravityWorkingMethod = [
  {
    number: "01",
    title: "Turn the artistic intent into a contract.",
    body: "I kept the PRD as the center of the work: the cello stays fixed, performers stay autonomous, and every visible position must agree with what the listener hears.",
  },
  {
    number: "02",
    title: "Let the medium change the stack.",
    body: "Astra made it practical to bring Blender into the iteration loop, carry richer assets into the browser, and judge the models, motion, materials, and environment as one experience.",
  },
  {
    number: "03",
    title: "Ask for whole-system changes.",
    body: "With Astra, a product observation could travel through interaction rules, physics, rendering, audio, accessibility, documentation, and tests in one connected loop.",
  },
  {
    number: "04",
    title: "Inspect the experience, not just the code.",
    body: "I used browser captures, full-session recordings, event logs, performance profiles, and repeatable regressions to see where the rendered behavior diverged from the idea.",
  },
  {
    number: "05",
    title: "Let people overrule the prototype.",
    body: "Synthetic tests could prove that a gesture fired once. They could not prove that it felt immediate, comfortable, or worth learning. Human behavior made the final call.",
  },
] as const;

export const tabletopProcessSteps = [
  {
    number: "01",
    title: "Start with attention",
    body: "Running a world, reading the table, and pacing a story already demand a GM’s full attention. I began with a simple product constraint: the score should support that work without becoming another instrument panel to operate.",
  },
  {
    number: "02",
    title: "Make emotion legible",
    body: "I reduced the experience to a small, readable emotional language. Calm, Dramatic, and Intense give the score enough range to feel responsive while staying understandable at a glance.",
  },
  {
    number: "03",
    title: "Prototype the room, not the demo",
    body: "Early iterations used replayable scenes and live tabletop conversation to test pacing, trust, and the moments when a GM needs to guide the experience directly.",
  },
  {
    number: "04",
    title: "Let the system recede",
    body: "The working alpha became a tap-first companion: clear readiness, visible score state, and direct control when it matters. The complexity stays behind the experience.",
  },
] as const;

export const tabletopProductPrinciples = [
  {
    title: "Story first",
    description: "The music serves the scene instead of competing with it.",
  },
  {
    title: "Composer built",
    description: "Authored musical worlds, shaped to adapt with intention.",
  },
  {
    title: "GM controlled",
    description:
      "The storyteller keeps the final say without babysitting audio.",
  },
] as const;
