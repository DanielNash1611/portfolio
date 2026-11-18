import { Sparkles, FileText, Image as ImageIcon, Code2 } from "lucide-react";

export const jumpingOnCoalsChapters = [
  {
    number: "01",
    title: "Back in the Swing",
    description:
      "Build momentum, collect fireflies, and decide when to jump away from the safety of repetition.",
  },
  {
    number: "02",
    title: "Losing Balance",
    description:
      "Cross a narrow beam by reading the environment instead of relying on a conventional balance meter.",
  },
  {
    number: "03",
    title: "Jumping on Coals",
    description:
      "Manage Heat and Flow across a 26,400-pixel route while a wall of fire closes in behind you.",
  },
  {
    number: "04",
    title: "Digging In",
    description:
      "Keep working as productive effort quietly turns into compulsion, exhaustion, and collapse.",
  },
  {
    number: "05",
    title: "At the Bottom",
    description:
      "Use breath, focus, and memory to recover the ability to stand instead of treating recovery as another score.",
  },
  {
    number: "06",
    title: "Digging Out",
    description:
      "Turn alternating shovel strikes into a difficult ascent through the same earth you once dug into.",
  },
  {
    number: "07",
    title: "By the Shovel",
    description:
      "Rest beneath an opening sky, then choose whether to leave the playground or return to the swing.",
  },
  {
    number: "08",
    title: "Back in the Swing (Again)",
    description:
      "Return to a satisfying familiar motion and decide for yourself when—or whether—to step away.",
  },
] as const;

export const jumpingOnCoalsAudioChapters = [
  {
    time: "0:00",
    title: "The personal origin",
    description: "Work, the first PTO day, and the weekend the album appeared.",
  },
  {
    time: "1:55",
    title: "The swing-and-coals metaphor",
    description: "Safety, momentum, burnout, the hole, recovery, and return.",
  },
  {
    time: "4:26",
    title: "One sound, many states",
    description: "How a single cello pizzicato became the entire sound world.",
  },
  {
    time: "5:56",
    title: "Trying to make it interactive",
    description:
      "The early GDD, prototype, visual experiments, and false starts.",
  },
  {
    time: "9:54",
    title: "Returning during Build Week",
    description:
      "Why the existing foundation was kept and how the full arc emerged.",
  },
  {
    time: "11:52",
    title: "An album-driven game",
    description:
      "Mechanics that sustain attention without turning it into a rhythm game.",
  },
  {
    time: "14:09",
    title: "The ambiguous ending",
    description: "What the work is meant to make players feel and discuss.",
  },
] as const;

export const gravityProcessSteps = [
  {
    number: "01",
    eyebrow: "Brainstorm",
    title: "Begin with the artistic question",
    body: [
      "Gravity began as an interdisciplinary concert work for cello and mobile instrumentalists. I returned to it by asking what the original performance could not do: let a listener move inside the composition and hear the same system from its center, its edge, or alongside a performer.",
      "Before choosing technology, I defined the experience principles. The cello would remain the gravitational center. Performers would enter, orbit, escape, and return. Most importantly, every performer would keep an independent musical timeline—no shared tempo, quantization, or hidden conductor.",
    ],
    icon: Sparkles,
  },
  {
    number: "02",
    eyebrow: "Product requirements",
    title: "Turn the idea into a PRD",
    body: [
      "I wrote the product requirements document as the creative contract: origin, audience, journey, core objects, musical and spatial-audio behavior, interface requirements, accessibility, MVP boundaries, and 28 explicit acceptance criteria.",
      "That document made subjective intent testable. “Make gravity audible” became visible and audible lifecycle agreement. “Preserve musical independence” became a prohibition on shared musical clocks, phase locking, and synchronized entrances.",
    ],
    icon: FileText,
  },
  {
    number: "03",
    eyebrow: "Design document",
    title: "Make the visual system buildable",
    body: [
      "Next came a focused design system rather than a loose mood board. It defined a visual thesis, interaction verbs, color and type tokens, performer shapes, eight trail cadences, listener cues, motion, accessibility, and the DOM/canvas boundary.",
      "I generated four concept images for the entry gate, Atomic field, Celestial field, and cello listening perspective. Then I converted them into named, deterministic acceptance fixtures so the build could be compared against a stable target instead of a vague request to “make it feel better.”",
    ],
    icon: ImageIcon,
  },
  {
    number: "04",
    eyebrow: "MVP",
    title: "Build the smallest complete composition",
    body: [
      "The MVP uses Vite and TypeScript, native Web Audio behind a replaceable engine boundary, and one shared simulation feeding the visual renderer and every spatial source position.",
      "Original cello and violin recordings are decoded in the browser. Each performer receives its own loop source, playback state, spatial graph, lifecycle, trail, and return schedule. The result can accumulate toward a dense field, release naturally, and return to cello alone without turning the work into a sequencer.",
    ],
    icon: Code2,
  },
] as const;

export const eegMusicMetadataItems = [
  { label: "Year", value: "2021" },
  { label: "Context", value: "Center for Latter-day Saint Arts" },
  { label: "Medium", value: "Composition + Video" },
  { label: "Themes", value: "Identity, Tuning, Biometrics" },
] as const;

export const eegMusicOverviewParagraphs = [
  "Farraginous is one of my most personal creative works: an experimental composition and video that translates the feeling of living in-between into sound.",
  "Created for the Center for Latter-day Saint Arts, the piece brings together a melody rooted in Chinese tuning, harmony shaped by Western Just Intonation, and biometric-driven experimentation to explore mixed identity, alienation, and the strange beauty of not fitting neatly into a single category.",
  "It is also a statement about coexistence. The tuning systems are not forced into the same frame. They remain distinct, yet they can still live together and create something harmonically rich without one tradition needing to flatten the other.",
] as const;

export const eegMusicWhyItExistsParagraphs = [
  "I grew up half Taiwanese and half white in the United States, often feeling close to both worlds without being fully claimed by either. Farraginous came from that tension.",
  "I did not want to make a piece that only explained the idea intellectually. I wanted the music itself to carry that feeling. The tuning systems do not fully resolve into a single frame. The sound world stays beautiful, but unstable.",
  "I also wanted the piece to resist a more typical Western move, where another culture's musical language gets absorbed and normalized into a dominant system. Here, the different tuning systems are allowed to stay themselves. The result is a piece about identity, misreading, coexistence, and the middle space.",
] as const;

export const eegMusicHowItWorksItems = [
  {
    title: "Melody",
    body: "The melodic language draws from Chinese tuning, giving the piece a tonal center that feels rooted but not conventionally Western.",
  },
  {
    title: "Harmony",
    body: "The harmonic world is shaped through Western Just Intonation, creating a different kind of stability and tension around the melodic material.",
  },
  {
    title: "Biometrics",
    body: "The piece also incorporates EEG-related and facial-expression-linked input. In particular, blinking influenced the melody, turning small physical gestures into musical events.",
  },
  {
    title: "System adaptation",
    body: "The original concept for Farraginous was to incorporate EEG-derived emotional readings, especially frustration, into the musical behavior. I was working with an Emotiv EPOC+, but by that stage the hardware was beginning to fail, and its emotional-state readings were no longer precise enough to use confidently. I also intended to incorporate live heartbeat, but I was not able to patch live Fitbit data into Pure Data reliably, so the BPM of the final piece oscillates between the highest and lowest heart rates I measured while working on it. Rather than overstate what the system could do, I adapted the piece around the signals that remained dependable, particularly blink-related and expression-linked input.",
  },
] as const;
