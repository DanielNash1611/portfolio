export const SYSTEM_PATH = "/product-system";

export const systemRoles = [
  {
    id: "everyone",
    label: "Everyone",
    why: "A shared language for deciding what to explore, what to build, and what to change.",
    contribution:
      "Bring an idea, ask what it would improve, and help choose the next useful piece of evidence.",
    start: "development-loop",
    next: "ideas-strategy",
  },
  {
    id: "product",
    label: "Product Manager",
    why: "Keep intent clear as the product changes. A living definition helps people and AI build toward the same outcome.",
    contribution:
      "Maintain the whole user journey and what must stay true. Review changes with design and engineering, then update the definition and the reasons behind it.",
    start: "development-loop",
    next: "playbook",
  },
  {
    id: "engineering",
    label: "Developer",
    why: "Understand the reason behind a request, surface technical constraints early, and stop rebuilding context from scattered tickets.",
    contribution:
      "Read the current definition before planning, revisit it at product decisions, and check the whole flow. Bring conflicts and implementation discoveries back to the team.",
    start: "ai-native-building",
    next: "development-loop",
  },
  {
    id: "ai-engineering",
    label: "AI Engineer",
    why: "Give agents durable context and judge model behavior against explicit expectations, including the ways it can fail.",
    contribution:
      "Make context accessible, specify when agents must consult it, and test a fresh session. Evaluate whether this reduces product drift and rework.",
    start: "ai-native-building",
    next: "testing-evidence",
  },
  {
    id: "design",
    label: "Designer",
    why: "Make possibilities tangible early, while there is still room to change the problem framing and the experience.",
    contribution:
      "Keep the end-to-end flow, interaction reasons, and design-system references aligned. Check that individually correct features still make a coherent experience.",
    start: "development-loop",
    next: "testing-evidence",
  },
  {
    id: "business",
    label: "Business Partner",
    why: "Give an idea a visible place and connect it to an outcome before committing to a large delivery effort.",
    contribution:
      "Bring the workflow, the people affected, and the cost of the problem. Help the pod reach the people who can test it.",
    start: "ideas-strategy",
    next: "idea-lifecycle",
  },
  {
    id: "leadership",
    label: "Executive / Stakeholder",
    why: "See where investment is going, what the team knows, and what evidence would justify the next commitment.",
    contribution:
      "Clarify the outcome and constraints, ask what changed in the evidence, and support a change of direction when assumptions break.",
    start: "idea-lifecycle",
    next: "testing-evidence",
  },
] as const;
export type SystemRole = (typeof systemRoles)[number]["id"];
export function isSystemRole(value: string | null): value is SystemRole {
  return systemRoles.some((role) => role.id === value);
}
export function systemHref(chapter = "", role: SystemRole = "everyone") {
  return `${SYSTEM_PATH}${chapter ? `/${chapter}` : ""}${role === "everyone" ? "" : `?role=${role}`}`;
}

export type SystemSection = { title: string; body: string; items?: string[] };
export type SystemChapter = {
  slug: string;
  number: string;
  title: string;
  headline: string;
  question: string;
  summary: string;
  principle: string;
  minutes: number;
  sections: SystemSection[];
  exercise: { title: string; body: string };
};

export const systemChapters: SystemChapter[] = [
  {
    slug: "ideas-strategy",
    number: "01",
    title: "Ideas & Strategy",
    headline: "Let ideas enter messy.",
    question: "What is worth working on?",
    minutes: 4,
    summary:
      "Ideas can come from anywhere. Discovery gives them enough definition to become opportunities or possible solutions.",
    principle:
      "An idea is an unclassified opportunity or solution. It does not need a hierarchy at intake.",
    sections: [
      {
        title: "Start with what someone noticed",
        body: "Ideas can come from anyone. Preserve the original observation and its source before asking people to classify it.",
        items: [
          "Capture the idea in the contributor’s own words.",
          "Ask who it affects and what could improve.",
          "Separate the observation from the proposed explanation.",
        ],
      },
      {
        title: "Give the idea structure",
        body: "An opportunity names what could improve. A solution names a possible response. These are types of ideas, not mandatory steps in a pipeline.",
      },
      {
        title: "Connect possibilities to an outcome",
        body: "Connect the desired outcome to opportunities and possible solutions. Several solutions can serve one opportunity; a failed solution need not invalidate the need.",
        items: [
          "Outcome: the change we want to see.",
          "Opportunity: what could be better, and for whom.",
          "Solution: a possible response that still needs evidence.",
        ],
      },
      {
        title: "Welcome a solution, then investigate it",
        body: "“Can we add an AI assistant?” opens a question: what would it improve? Better search or clearer guidance might address the same need.",
      },
    ],
    exercise: {
      title: "Try it with one incoming request",
      body: "Write down the request unchanged. Under it, name the person affected, the possible opportunity, and two alternative solutions. Mark anything you are assuming. You now have a discovery starting point.",
    },
  },
  {
    slug: "idea-lifecycle",
    number: "02",
    title: "Idea Lifecycle",
    headline: "Make the investment visible.",
    question: "Where does this work stand?",
    minutes: 5,
    summary:
      "Lifecycle states show how much we know and where we are investing. New evidence can move work back into discovery at any time.",
    principle:
      "Build is an activity. Delivery is a state. The two do not map one-to-one.",
    sections: [
      {
        title: "Track the idea, not the whole product",
        body: "One product can contain an opportunity in Discovery, a solution in Delivery, and another in Impact. Each item has its own investment state.",
      },
      {
        title: "Let the type guide the language",
        body: "Opportunities track confidence in a need and whether it is being addressed. Solutions track the maturity of a response. Shipping a solution does not automatically close its opportunity.",
        items: [
          "Opportunities: Parking Lot → Discovery → Validated → Prioritized → Addressed → Monitor.",
          "Solutions: Parking Lot → Discovery → Ready for Delivery → Delivery → Impact → Done.",
          "New evidence can return either type to Discovery. Each node keeps its own state.",
        ],
      },
      {
        title: "Choose the artifact for the question",
        body: "A POC answers a bounded question. An MVP creates and tests real value. A prototype’s purpose determines where it belongs.",
        items: [
          "POC: usually Discovery; sometimes Ready for Delivery to resolve a remaining question.",
          "MVP: built during Delivery; evaluated in Impact once people use it.",
          "Prototype: a learning artifact whose purpose determines its place.",
        ],
      },
      {
        title: "Change state when understanding changes",
        body: "Broken assumptions can send Delivery back to Discovery. New needs can send Impact back, too. Record the evidence and next question. Done means no active investment right now.",
      },
    ],
    exercise: {
      title: "Make one status useful",
      body: "Choose an item labeled “in progress.” Name its actual lifecycle state, its biggest unanswered question, and the evidence needed for the next investment decision.",
    },
  },
  {
    slug: "development-loop",
    number: "03",
    title: "Development Loop",
    headline: "Products are progressively understood.",
    question: "How do we move an idea forward?",
    minutes: 5,
    summary:
      "Imagine → Define → Build → Test → Refine. Repeat at the scale of a concept, a feature, or an established product.",
    principle:
      "The PRD is the team’s best current model of the product. Update it as that understanding changes.",
    sections: [
      {
        title: "Make the loop as small as the question",
        body: "A cycle might produce a sketch, a POC, or a production increment. Build only enough to answer the next useful question.",
      },
      {
        title: "Keep a living definition",
        body: "Keep users, opportunity, experience, scope, constraints, and learning criteria together. Record assumptions and open questions alongside requirements.",
        items: [
          "Name the problem and the people experiencing it.",
          "Make the smallest useful scope and non-goals explicit.",
          "Write acceptance criteria people can observe or verify.",
          "Link decisions, design artifacts, and the evaluation approach.",
        ],
      },
      {
        title: "Build from the same understanding",
        body: "Keep product context in or alongside the repo. Developers and coding assistants should find the intent, constraints, and acceptance criteria before changing code.",
      },
      {
        title: "Close the learning loop",
        body: "Turn observations into a decision, then update the product and its definition. A passing test answers its specific question; it does not establish customer value.",
      },
    ],
    exercise: {
      title: "Run a small cycle",
      body: "Pick one uncertainty. Imagine two approaches, define the question, build the smallest artifact, test it with the relevant person or system, and record one change to your current understanding.",
    },
  },
  {
    slug: "ai-native-building",
    number: "04",
    title: "AI-Native Building",
    headline: "Keep product intent in every build.",
    question: "How do humans and AI build from the same intent?",
    minutes: 6,
    summary:
      "A living definition carries the why, the whole experience, and what must stay true into implementation—and into the next agent session.",
    principle:
      "Keep context accessible, require it at decision points, and verify the experience. A saved document alone does not establish that an agent used it.",
    sections: [
      {
        title: "Describe the experience, not just its parts",
        body: "A set of working features can still produce the wrong experience. Define the user’s journey, why the interactions exist, and the behaviors that must remain true through later changes. Link the design system and technical constraints alongside it.",
      },
      {
        title: "Give each artifact one job",
        body: "My default is to keep product context in or alongside the repo. A product workspace or Jira can also hold it if the agent can access the current source. The important part is an explicit reading path and checkpoints.",
        items: [
          "Product definition / PRD: enduring intent, flow, constraints, and checks.",
          "Tickets: bounded work, acceptance criteria, and status; link to the definition.",
          "Skills / commands: repeatable procedures for doing the work.",
          "Agent instructions: short pointers plus when to read, revisit, verify, and update. Adapt AGENTS.md or CLAUDE.md to the tool you use.",
        ],
      },
      {
        title: "Share a small common standard",
        body: "Teams can use different authoring formats while agreeing on current source links, shared terms, an owner, review date or revision, the user flow, and what must stay true. Keep one authoritative version of each artifact; avoid copying the entire product model into every ticket or instruction file.",
      },
      {
        title: "Keep it current together",
        body: "PMs maintain intent; designers maintain the experience; developers surface constraints and conflicts. Review material changes together, record the decision and why, then update the source. If a link is inaccessible or sources disagree, resolve that before a dependent product decision. Do not silently treat stale context as current.",
      },
      {
        title: "Test whether the method helps",
        body: "Proposed comparison: give the same bounded change to separate sessions, one with initial-only context and one with explicit reading checkpoints. Review product drift, missed requirements, clarification, rework, time, and documentation overhead. This is a method to evaluate, not proof of improved outcomes or a guarantee against mistakes.",
      },
    ],
    exercise: {
      title: "Try the fresh-session test",
      body: "Open a new agent session without the earlier conversation. Have it read the entry point, identify the source and revision it actually consulted, and explain the user journey, what must stay true, and how it will check the change. Compare its answer with the source, then observe the result. A convincing summary alone is not evidence of a correct build.",
    },
  },
  {
    slug: "testing-evidence",
    number: "05",
    title: "Testing & Evidence",
    headline: "Choose evidence for the decision.",
    question: "How do we know whether we are right?",
    minutes: 5,
    summary:
      "Observation, technical tests, model evals, and real-world outcomes answer different questions. Use the strongest evidence available for the decision at hand.",
    principle:
      "Not everything worth learning is immediately measurable. Be precise about what your evidence does and does not establish.",
    sections: [
      {
        title: "Write the question before the test",
        body: "Name the uncertainty and the observation that would change your mind. “Can someone complete this task?” is more useful than “Does it work?”",
      },
      {
        title: "Learn before there is a dashboard",
        body: "One observed failure may justify changing a design. It does not establish how common the problem is across the audience.",
      },
      {
        title: "Separate correctness, usability, and value",
        body: "Technical checks, human observation, and real-world outcomes answer different questions. Choose the evidence for the claim you need to make.",
        items: [
          "Technical evidence: correctness, reliability, performance, security, model evals.",
          "Experience evidence: comprehension, task completion, accessibility, responsiveness.",
          "Outcome evidence: behavior change, quality, productivity, cost, or business results.",
        ],
      },
      {
        title: "Match the strength of the claim",
        body: "Record limitations with the conclusion. Before-and-after results can have other explanations; controlled comparisons can help test causality where appropriate.",
      },
    ],
    exercise: {
      title: "Write an evidence note",
      body: "Capture the question, method, observation, limits, and decision. End with what changes now and what remains unknown. Keep the note linked to the PRD or decision log.",
    },
  },
  {
    slug: "working-together",
    number: "06",
    title: "Working Together",
    headline: "Different roles. Shared understanding.",
    question: "Why should I care?",
    minutes: 4,
    summary:
      "A useful operating model makes each person’s contribution clearer. Choose your role to see what you gain, what you bring, and where to begin.",
    principle:
      "Anyone can contribute an idea. The pod turns it into a shared question, a concrete artifact, and a decision informed by evidence.",
    sections: [
      {
        title: "Begin with the outcome",
        body: "Agree on whose situation should improve, which constraints matter, and the first uncertainty to resolve together.",
      },
      {
        title: "Make challenges welcome",
        body: "A technical constraint, a usability problem, or a corrected assumption improves the definition. Record the discovery where the whole pod can use it.",
      },
      {
        title: "Review the artifact and the evidence",
        body: "Walk through a real scenario together. Compare the experience with the intent. Decide what to keep, change, or investigate.",
      },
      {
        title: "Onboard through a real piece of work",
        body: "Trace one opportunity from its current PRD to a recent decision and its evidence. Then run a small cycle together.",
      },
    ],
    exercise: {
      title: "Bring this to your first pod conversation",
      body: "Share the role-specific link. Ask each person to bring one assumption, one useful artifact, and one question they need the group to answer. Agree on the next smallest learning step.",
    },
  },
  {
    slug: "playbook",
    number: "07",
    title: "The Playbook",
    headline: "Develop an idea. Start a project.",
    question: "How do I use this tomorrow?",
    minutes: 4,
    summary:
      "Two local workspaces: develop an idea through the opportunity–solution flow, or start a project with a brief, shared context, and prompts for the first build cycle. Every field is optional.",
    principle:
      "Use only the structure that helps the next decision. Grow the documentation with the product.",
    sections: [
      {
        title: "Start small, keep it current",
        body: "Begin with the idea, user, outcome, and next question. Expand the definition as understanding grows. Keep the document current.",
      },
      {
        title: "Before committing to delivery",
        body: "Review evidence, scope, experience, feasibility, dependencies, acceptance criteria, and the eval plan. Make unresolved risks visible. Readiness does not rule out future learning.",
      },
      {
        title: "After a test or release",
        body: "Decide whether to continue, refine, return to discovery, or stop investing. Update the PRD and lifecycle state for the next person or agent.",
      },
    ],
    exercise: {
      title: "Bring one open question to your pod",
      body: "Use your draft to discuss what you know and what is still open. Choose the smallest useful next step together. When you’re ready, download the definition and keep it with the work in your repo.",
    },
  },
  {
    slug: "case-studies",
    number: "08",
    title: "The System in Practice",
    headline: "Follow the decisions into the work.",
    question: "What does this look like in practice?",
    minutes: 3,
    summary:
      "Read the existing project stories through the method: the intent, what was made, the evidence gathered, and what changed.",
    principle:
      "The method is a way to examine the work. Each project’s own evidence establishes what was actually built or learned.",
    sections: [
      {
        title: "Read for a change in understanding",
        body: "Find the uncertainty, the artifact that explored it, and the decision that followed. The project’s own evidence establishes what was learned.",
      },
      {
        title: "Keep maturity and claims visible",
        body: "Follow each story for its stated status and ownership. These links do not imply that every project used every part of this method.",
      },
    ],
    exercise: {
      title: "Discuss one decision",
      body: "Choose a story below. Identify the uncertainty, the artifact that helped explore it, and the resulting decision. Then name what the public story leaves unknown.",
    },
  },
];

export const loopSteps = [
  {
    title: "Imagine",
    question: "What could be possible?",
    body: "Explore alternative approaches, challenge the default, and keep the opportunity in view.",
    output: "A few possibilities worth exploring",
  },
  {
    title: "Define",
    question: "What do we currently understand?",
    body: "Write a living PRD with the user, opportunity, intended experience, scope, assumptions, and acceptance criteria.",
    output: "A shared, current product definition",
  },
  {
    title: "Build",
    question: "What can make this tangible?",
    body: "Create the smallest useful artifact: a sketch, POC, prototype, MVP, or production increment. Read the repo context first.",
    output: "Something people can inspect or use",
  },
  {
    title: "Test",
    question: "What can we learn from it?",
    body: "Gather evidence appropriate to the question: observation, usability, technical checks, model evals, or real-world outcomes.",
    output: "Observations with clear limits",
  },
  {
    title: "Refine",
    question: "What should change?",
    body: "Reconcile expectations with evidence. Update the product, PRD, assumptions, architecture, or opportunity, then repeat.",
    output: "A decision and an updated understanding",
  },
];

export const opportunityStates = [
  {
    title: "Parking Lot",
    body: "A possible need worth preserving, but not actively investigating.",
  },
  {
    title: "Discovery",
    body: "Investigating who experiences the need, why it matters, and how well we understand it.",
  },
  {
    title: "Validated",
    body: "Evidence supports that this is a real need worth addressing; priority is still a separate decision.",
  },
  {
    title: "Prioritized",
    body: "Chosen for investment relative to other opportunities, with an outcome and constraints in view.",
  },
  {
    title: "Addressed",
    body: "Evidence indicates that one or more solutions sufficiently address the need. Shipping alone is not enough.",
  },
  {
    title: "Monitor",
    body: "Watching whether the need stays addressed and whether new evidence warrants renewed discovery.",
  },
];

export const lifecycleStates = [
  {
    title: "Parking Lot",
    body: "Worth preserving; no active investment yet.",
    question: "What would make this worth revisiting?",
  },
  {
    title: "Discovery",
    body: "Actively reducing uncertainty about the opportunity or a possible solution.",
    question: "What do we need to learn before committing?",
  },
  {
    title: "Ready for Delivery",
    body: "Enough definition and alignment to prepare a delivery commitment; resolve any remaining bounded proof.",
    question:
      "Are the scope, feasibility, risks, and acceptance criteria clear enough?",
  },
  {
    title: "Delivery",
    body: "Committed to producing a usable capability or MVP.",
    question:
      "Does the increment meet the intended experience and acceptance criteria?",
  },
  {
    title: "Impact",
    body: "In real use; evaluating behavior and outcomes.",
    question:
      "Is this creating the intended value, and what else are we learning?",
  },
  {
    title: "Done",
    body: "No further active investment is warranted right now.",
    question: "What did we learn, and what would reopen the question?",
  },
];

export const systemExamples = [
  {
    title: "Gravity × Astra",
    href: "/creative/gravity/astra",
    label: "Creative product decisions",
    body: "Trace changes in the interaction and spatial experience through the authored build story.",
  },
  {
    title: "Tabletop Symphony",
    href: "/creative/tabletop-symphony",
    label: "Exploration & working alpha",
    body: "Explore the relationship between composition, interaction, and the experience principles of the alpha.",
  },
  {
    title: "Product leadership is systems design",
    href: "/thinking/product-philosophy",
    label: "Operating model in context",
    body: "Read the earlier operating-model story, including its approach to prioritization and the limits of organizational adoption.",
  },
];

export const systemDownloads = [
  {
    file: "idea-intake.md",
    title: "Idea intake",
    description: "Preserve the observation, its source, and the next question.",
  },
  {
    file: "living-prd.md",
    title: "Living PRD",
    description:
      "Connect the opportunity, experience, scope, and acceptance criteria.",
  },
  {
    file: "evidence-review.md",
    title: "Test & impact review",
    description: "Record the method, observation, limits, and next decision.",
  },
  {
    file: "agent-context.md",
    title: "Repo & agent context",
    description: "Give humans and coding assistants a shared starting point.",
  },
];

export function getSystemChapter(slug: string) {
  return systemChapters.find((chapter) => chapter.slug === slug);
}
