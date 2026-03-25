export type NavItem = {
  href: string;
  label: string;
};

export type ActionLink = {
  href: string;
  label: string;
  external?: boolean;
};

export type Metric = {
  label: string;
  value: string;
  detail?: string;
};

export type TestimonialEntry = {
  id: string;
  quote: string;
  name: string;
  title: string;
  company: string;
  relationship?: string;
  context?: string;
  source: "LinkedIn" | "Direct" | "Placeholder";
  featured?: boolean;
  isPlaceholder?: boolean;
  todo?: string;
};

export type VisualAsset = {
  title: string;
  description: string;
  image?: string;
  alt?: string;
  todo?: string;
};

export type TradeoffOption = {
  option: string;
  tradeoff: string;
  selected?: boolean;
};

export type WorkEntry = {
  slug: string;
  href: string;
  title: string;
  eyebrow: string;
  summary: string;
  description: string;
  role: string;
  company: string;
  timeframe: string;
  heroImage: string;
  heroImageAlt: string;
  tags: string[];
  featuredMetrics: Metric[];
  context: string[];
  problem: string[];
  strategicInsight: string[];
  optionsAndTradeoffs: TradeoffOption[];
  execution: string[];
  impact: Metric[];
  reflection: string[];
  visuals: VisualAsset[];
  testimonialIds: string[];
  featured?: boolean;
};

export type ProductEntry = {
  slug: string;
  href: string;
  title: string;
  eyebrow: string;
  status: string;
  summary: string;
  description: string;
  heroImage: string;
  heroImageAlt: string;
  tags: string[];
  featuredMetrics: Metric[];
  problem: string[];
  solution: string[];
  productExperience: Array<{
    title: string;
    description: string;
  }>;
  learnings: string[];
  visuals: VisualAsset[];
  actions?: ActionLink[];
  featured?: boolean;
  embeddedExperience?: "sound-seeker";
};

export type ThinkingEntry = {
  slug: string;
  href: string;
  title: string;
  eyebrow: string;
  summary: string;
  description: string;
  readTime: string;
  tags: string[];
  keyIdeas: string[];
  sections: Array<{
    title: string;
    body: string[];
  }>;
  featured?: boolean;
};

export type CreativeEntry = {
  slug: string;
  href: string;
  title: string;
  eyebrow: string;
  summary: string;
  description: string;
  tags: string[];
  heroImage?: string;
  heroImageAlt?: string;
  sections: Array<{
    title: string;
    body: string[];
  }>;
  embeds?: Array<{
    title: string;
    type: "spotify" | "youtube";
    src: string;
    description: string;
  }>;
  visuals?: VisualAsset[];
  featured?: boolean;
};

export type ResumeVariant = {
  id: string;
  title: string;
  audience: string;
  filename: string;
  note: string;
};

export const siteConfig = {
  name: "Daniel Nash",
  title: "AI Systems Product Leader / Senior Product Manager",
  location: "Los Angeles, California",
  email: "hello@danielnash.com",
  linkedinUrl: "https://www.linkedin.com/in/daniel-a-nash/",
  recommendationsUrl:
    "https://www.linkedin.com/in/daniel-a-nash/details/recommendations/?detailScreenTabIndex=0",
  githubUrl: "https://github.com/DanielNash1611",
  spotifyUrl: "https://open.spotify.com/artist/7AQPw7ZDSwdnCW9ciNW3U5",
  nav: [
    { href: "/work", label: "Work" },
    { href: "/products", label: "Products" },
    { href: "/thinking", label: "Thinking" },
    { href: "/creative", label: "Creative" },
    { href: "/about", label: "About" },
    { href: "/resume", label: "Resume" },
  ] satisfies NavItem[],
};

export const homeContent = {
  hero: {
    eyebrow: "AI Product Leadership",
    title: "I turn emerging AI into product systems people actually adopt.",
    description:
      "I work where product strategy, systems design, and hands-on building meet, turning new AI capability into workflows, platform patterns, and operating models teams can trust at scale.",
    primaryAction: {
      href: "/work",
      label: "Explore selected work",
    },
    secondaryAction: {
      href: "/resume",
      label: "View resume",
    },
  },
  metrics: [
    {
      label: "ChatGPT Enterprise scale",
      value: "~1,000 users",
      detail: "~800 daily active users",
    },
    {
      label: "Commerce impact",
      value: "~$16M",
      detail: "annualized checkout upside",
    },
    {
      label: "Systems simplified",
      value: "16 -> 9",
      detail: "~2,000 hours saved annually",
    },
    {
      label: "AI lift",
      value: "~$2.7M",
      detail: "projected annual impact",
    },
  ] satisfies Metric[],
  positioning: {
    eyebrow: "Portfolio structure",
    title: "Organized around proof, not PM archetypes",
    description:
      "The homepage is built to answer the most useful hiring questions quickly.",
    categories: [
      {
        title: "Enterprise AI adoption",
        description:
          "Pilots, rollout systems, and guardrails that turn new capability into real usage.",
      },
      {
        title: "Systems simplification",
        description:
          "Commerce and operations work tied to measurable business outcomes, not just cleaner workflows.",
      },
      {
        title: "AI-native execution",
        description:
          "Live products and grounded concepts that make promising workflow ideas tangible fast.",
      },
    ],
  },
  featuredWork: ["chatgpt-enterprise", "ai-platform-mcp", "oms-transformation"],
  featuredProducts: ["launchmuse", "immunology-scout", "ai-agents-lab"],
  featuredThinking: ["ai-strategy", "product-philosophy"],
  featuredTestimonials: [
    "zac-bogart",
    "sumanth-cherukuri",
    "christopher-pruneau",
    "daniel-das",
  ],
  creativeHighlight: {
    title: "Creative edge, strategically applied",
    description:
      "My background in composition sharpens systems thinking, narrative craft, and taste. It shows up in how I frame ambiguity, prototype fast, and design product experiences that feel coherent instead of stitched together.",
    href: "/creative",
  },
  finalCta: {
    title:
      "Looking for a product leader who can understand the system, not just the roadmap?",
    description:
      "I do my best work in environments that value both building and thinking. Review the work, then reach out if that matches the kind of product leadership you need.",
    primaryAction: {
      href: siteConfig.linkedinUrl,
      label: "Connect on LinkedIn",
      external: true,
    },
    secondaryAction: {
      href: `mailto:${siteConfig.email}`,
      label: "Email me",
      external: true,
    },
  },
};

export const testimonials: TestimonialEntry[] = [
  {
    id: "zac-bogart",
    quote: "A true business partner, not just a glorified project manager.",
    name: "Zac Bogart",
    title:
      "C-suite leader overseeing ecommerce, digital marketing, and contact center",
    company: "The Guitar Center Company",
    relationship:
      "Executive partner across contact center modernization and new digital initiatives",
    context:
      "Executive partner across contact center modernization, roadmap ownership, and AI adoption.",
    source: "LinkedIn",
    featured: true,
  },
  {
    id: "sumanth-cherukuri",
    quote: "Rare combination of strategic foresight and execution.",
    name: "Sumanth Cherukuri",
    title: "VP of Technology and AI leader",
    company: "The Guitar Center Company",
    relationship:
      "Former manager across roadmap strategy, automation, ChatGPT rollout, and AI operating model work",
    context:
      "Connected Daniel's work to reusable GPT workflows, ChatGPT Enterprise rollout, and executive trust.",
    source: "LinkedIn",
    featured: true,
  },
  {
    id: "christopher-pruneau",
    quote:
      "Kept UX, engineering, and business aligned from definition through rollout.",
    name: "Christopher Pruneau",
    title: "Senior Front-End Developer",
    company: "The Guitar Center Company",
    relationship: "Engineering partner on ecommerce delivery",
    context:
      "Engineering partner who highlighted strong story definition, reliable execution, and calm partnership.",
    source: "LinkedIn",
    featured: true,
  },
  {
    id: "daniel-das",
    quote:
      "Turned ChatGPT integrations and guardrails into clear product strategy.",
    name: "Daniel Das",
    title: "Senior Software Engineer",
    company: "AI Platform / Enterprise Systems",
    relationship: "Technical partner on AI platform and guardrails work",
    context:
      "Technical partner who called out executive alignment and translation of complex AI ideas into practical direction.",
    source: "Direct",
    featured: true,
  },
  {
    id: "david-lawrence",
    quote:
      "Trusted with complex problems, fast ramps, and executive-facing roadmap work.",
    name: "David Lawrence",
    title: "Retail Executive & Operator",
    company: "The Guitar Center Company",
    relationship: "Senior cross-functional stakeholder",
    context:
      "Noted Daniel's speed ramping into contact center and order-management work, along with strong management committee communication.",
    source: "LinkedIn",
  },
  {
    id: "colleen-ashmore",
    quote: "Strategy, technical depth, and execution in the same package.",
    name: "Colleen Ashmore",
    title: "Digital Insight Manager",
    company: "The Guitar Center Company",
    relationship: "Data and experimentation partner",
    context:
      "Highlighted rapid delivery across enterprise experimentation and custom GPT work that moved from prototype to business value.",
    source: "LinkedIn",
  },
  {
    id: "matt-winick",
    quote:
      "Open, collaborative, and transformative in how he improves both product and process.",
    name: "Matt Winick",
    title: "Product Design & User Experience",
    company: "The Guitar Center Company",
    relationship: "Design partner on product and process improvements",
    context:
      "Described Daniel as rigorous and imaginative, with a strong ability to raise the bar while making collaboration energizing.",
    source: "LinkedIn",
  },
  {
    id: "todo-linkedin-product-leader",
    quote:
      "TODO: Paste a strong LinkedIn recommendation here that reinforces executive credibility or people leadership.",
    name: "TODO Recommender Name",
    title: "TODO Recommender Title",
    company: "TODO Company",
    relationship:
      "Paste the exact relationship/context from LinkedIn so the testimonial feels grounded.",
    source: "Placeholder",
    isPlaceholder: true,
    todo: "Replace this placeholder in content/portfolio.ts once another LinkedIn recommendation is ready to publish.",
  },
];

export const workEntries: WorkEntry[] = [
  {
    slug: "chatgpt-enterprise",
    href: "/work/chatgpt-enterprise",
    title: "ChatGPT Enterprise from pilot to operating model",
    eyebrow: "Selected Work",
    summary:
      "Led enterprise AI from pilot to scale at Guitar Center, growing ChatGPT Enterprise from roughly ~150 users / ~40 DAU to ~1,000 users / ~800 DAU while building reusable workflows, governance, and cross-functional trust for production adoption.",
    description:
      "A recruiter-friendly story about taking AI from early promise into real production environments with measurable impact.",
    role: "Senior Product Manager, Contact Center & AI Strategy",
    company: "The Guitar Center Company",
    timeframe: "2024-2025",
    heroImage: "/images/chatgpt-contact-hero.svg",
    heroImageAlt:
      "Illustration of an AI-assisted contact-center workflow with summary panels and pilot metrics.",
    tags: [
      "ChatGPT Enterprise",
      "AI Strategy",
      "Experimentation",
      "Workflow Design",
      "Change Leadership",
    ],
    featuredMetrics: [
      {
        label: "Annualized pilot impact",
        value: "~$2.7M",
        detail:
          "Validated through a six-month pilot with a matched control group.",
      },
      {
        label: "Licensed users scaled",
        value: "~150 -> ~1,000",
        detail:
          "Expanded ChatGPT Enterprise from an early pilot footprint into broad company adoption.",
      },
      {
        label: "Daily active users",
        value: "~40 -> ~800",
        detail:
          "Daily usage grew because the rollout emphasized reusable workflows, training, and governance.",
      },
    ],
    context: [
      "The contact center had clear workflow friction: agents spent time on pre-call preparation, email drafting, and context switching across systems.",
      "Generative AI interest was growing, but leadership needed more than enthusiasm. The bar was a safe pilot with real business outcomes, not a novelty demo.",
      "This work started inside a high-leverage operational environment, then became the proving ground for broader enterprise AI adoption.",
    ],
    problem: [
      "Without a controlled pilot, AI adoption risked becoming a mix of anecdotes, isolated power users, and unclear security practices.",
      "Agents needed faster access to relevant context and on-brand communication support, but any workflow had to respect governance constraints and preserve human judgment.",
      "Leadership needed evidence that AI could improve revenue and efficiency at the same time.",
    ],
    strategicInsight: [
      "The winning move was not 'roll out ChatGPT everywhere.' It was to pick a workflow-rich environment where value could be measured, then design the pilot like a product experiment with guardrails.",
      "That meant pairing frontline co-design with clear business metrics, a matched control group, and a practical operating model for safe usage.",
      "Once the business case existed, scale became a product management problem: enablement, champions, rollout sequencing, and decision-quality guardrails.",
    ],
    optionsAndTradeoffs: [
      {
        option: "Open broad access immediately",
        tradeoff:
          "Fast adoption, but weak governance and low confidence in actual business impact.",
      },
      {
        option: "Treat AI as a long, centralized research effort",
        tradeoff:
          "Safe on paper, but too slow to build momentum or show value to operating teams.",
      },
      {
        option:
          "Run a controlled pilot with measured outcomes, then scale with enablement and governance",
        tradeoff:
          "More upfront design work, but the clearest path to trust, executive buy-in, and durable expansion.",
        selected: true,
      },
    ],
    execution: [
      "Partnered with supervisors and agents to identify the highest-friction jobs-to-be-done and translate them into purpose-built GPT workflows.",
      "Worked across Legal, Security, Engineering, enterprise systems, and Operations to define acceptable data handling, review steps, and usage boundaries.",
      "Designed measurement using a pilot cohort and matched control group with metrics centered on Revenue Per Call, Items Per Transaction, Average Order Value, and efficiency signals.",
      "Created training assets, reusable prompting patterns, and a champions-style expansion model so the organization could scale from one team to many.",
      "Socialized results in executive language: concrete business value, repeatable rollout patterns, and a clear case for broader ChatGPT Enterprise investment.",
    ],
    impact: [
      {
        label: "Business impact",
        value: "~$2.7M annualized lift",
        detail:
          "Pilot agents outperformed control across revenue and efficiency measures.",
      },
      {
        label: "Adoption at scale",
        value: "~150 -> ~1,000 users / ~40 -> ~800 DAU",
        detail:
          "The initial proof point became the foundation for enterprise rollout.",
      },
      {
        label: "Operating model",
        value: "Champions + guardrails",
        detail:
          "The rollout became credible because usage patterns and governance were designed together.",
      },
    ],
    reflection: [
      "Enterprise AI programs succeed when product leaders design for adoption, trust, and workflow fit, not just model access.",
      "This case reinforced a pattern I keep returning to: the fastest way to scale AI is to make one operating environment measurably better first.",
      "TODO: Add a sanitized artifact showing the pilot scorecard or training flow once one is cleared for public use.",
    ],
    visuals: [
      {
        title: "Pilot workflow snapshot",
        description:
          "Current public visual uses existing portfolio art as a stand-in for the AI-assisted contact-center workflow.",
        image: "/images/chatgpt-contact-hero.svg",
        alt: "Stylized workflow panels representing an AI copilot for contact-center agents.",
        todo: "Replace with a sanitized screenshot or diagram of the pilot flow when available.",
      },
      {
        title: "Rollout system",
        description:
          "A second visual would ideally show the champion model, training system, and governance handoffs.",
        todo: "TODO: Add a public-safe operating model diagram for the enterprise rollout.",
      },
    ],
    testimonialIds: ["zac-bogart", "sumanth-cherukuri"],
    featured: true,
  },
  {
    slug: "ai-platform-mcp",
    href: "/work/ai-platform-mcp",
    title: "From AI experiments to platform foundations",
    eyebrow: "Selected Work",
    summary:
      "Designed the system layer behind production AI: agent workflows, retrieval across structured and unstructured data, integration patterns, governance, and an MCP-shaped approach to product infrastructure.",
    description:
      "A platform strategy story about turning scattered AI experiments into production-ready systems that improve over time.",
    role: "Senior Product Manager, AI Platform Strategy",
    company: "Enterprise AI / Emerging Platform Work",
    timeframe: "2024-2026",
    heroImage: "/images/chatgpt-org-hero.svg",
    heroImageAlt:
      "Illustration of an enterprise AI enablement and governance system with adoption and workflow callouts.",
    tags: ["AI Platform", "MCP", "Connectors", "Governance", "System Design"],
    featuredMetrics: [
      {
        label: "Platform focus",
        value: "Reusable AI systems",
        detail:
          "The core design problem was orchestration, not just prompting.",
      },
      {
        label: "Adoption pattern",
        value: "Workflow-based adoption",
        detail:
          "Patterns were designed so multiple teams could adopt them without starting from zero.",
      },
      {
        label: "Execution style",
        value: "Platform-led iteration",
        detail:
          "Quality and reliability improve when workflows include retrieval, feedback, and explicit evaluation loops.",
      },
    ],
    context: [
      "After ChatGPT Enterprise pilots proved value, the next challenge was architectural: how do you connect models to real systems without creating brittle one-off hacks?",
      "Some teams needed lightweight GPT workflows. Others needed deeper integration with retrieval, approvals, and system context.",
      "The emerging design pattern looked less like 'one assistant' and more like a platform layer that mediates tools, models, context, and humans.",
    ],
    problem: [
      "Standalone prompts and isolated custom GPTs can move quickly, but they do not create a durable operating system for enterprise work.",
      "Purely bespoke app development for every AI use case is too slow and expensive when the shape of the opportunity is still evolving.",
      "Teams needed a shared architecture language for connectors, retrieval, permissions, and review steps before AI workflows could scale responsibly.",
    ],
    strategicInsight: [
      "The real product opportunity was the middle layer: the structure that helps models reach the right tools and context while keeping humans in control of consequential actions.",
      "That middle layer is where MCP-style thinking becomes useful. It creates a cleaner abstraction for tools, permissions, and workflow orchestration instead of baking integrations into every single use case.",
      "From a product standpoint, this is as much operating model design as technical architecture. Teams need patterns they can understand, trust, and extend.",
    ],
    optionsAndTradeoffs: [
      {
        option: "Let every team build its own prompts and integrations",
        tradeoff:
          "Encourages experimentation, but creates duplication, inconsistent guardrails, and little portfolio visibility.",
      },
      {
        option: "Build fully custom apps for each domain workflow",
        tradeoff:
          "Can be powerful, but usually too slow for early-stage learning and portfolio-wide enablement.",
      },
      {
        option:
          "Create shared connector and workflow patterns with explicit guardrails",
        tradeoff:
          "Requires cross-functional alignment and architectural discipline, but compounds learnings across teams.",
        selected: true,
      },
    ],
    execution: [
      "Mapped recurring AI workflow patterns across pilots: retrieve context, generate draft output, route through review, and hand back to the human owner.",
      "Worked from platform principles rather than isolated features, with emphasis on connector reuse, retrieval quality, permissions, and prompt consistency.",
      "Built and shipped system patterns directly, including agent-based workflows, retrieval across structured and unstructured data, and eval-informed iteration to improve output quality over time.",
      "Translated emerging MCP and orchestration concepts into product language executives and cross-functional partners could reason about.",
      "Combined enablement with governance so teams had a path from experimentation to more durable agentic workflows.",
      "Used prototype work, including builder-led experiments, to make architecture decisions tangible instead of abstract.",
    ],
    impact: [
      {
        label: "Decision quality",
        value: "Shared platform language",
        detail:
          "Leaders could discuss AI investments in terms of reusable capabilities rather than random point solutions.",
      },
      {
        label: "Team leverage",
        value: "Faster repeatability",
        detail:
          "Teams had a clearer path to reuse prompts, patterns, and governance decisions.",
      },
      {
        label: "Future readiness",
        value: "Agentic foundation",
        detail:
          "This work set up cleaner thinking for AI agents, connectors, and human approvals.",
      },
    ],
    reflection: [
      "The strongest AI product leaders need to translate between architecture and business operating models. That translation layer is often the difference between momentum and chaos.",
      "I intentionally describe some of this work as a capability story because the architecture is real, but not every artifact can be shown publicly yet.",
      "TODO: Add a public-safe MCP or connector diagram, plus one or two concrete workflow screenshots, when available.",
    ],
    visuals: [
      {
        title: "Platform concept visual",
        description:
          "The current public visual stands in for a broader AI platform architecture that connects adoption, governance, and workflows.",
        image: "/images/chatgpt-org-hero.svg",
        alt: "Abstract enterprise AI rollout visual representing platform and governance layers.",
        todo: "Replace with a sanitized architecture diagram showing models, tools, retrieval, and approvals.",
      },
      {
        title: "Workflow demo placeholder",
        description:
          "This page is ready for a Loom, screenshot, or sanitized storyboard that demonstrates an MCP-informed workflow end to end.",
        todo: "TODO: Add a real workflow artifact when public-safe assets exist.",
      },
    ],
    testimonialIds: ["sumanth-cherukuri", "daniel-das"],
    featured: true,
  },
  {
    slug: "oms-transformation",
    href: "/work/oms-transformation",
    title: "OMS transformation across checkout and returns",
    eyebrow: "Selected Work",
    summary:
      "Modernized the order journey across customer-facing checkout and service-facing returns operations, improving conversion, reducing friction, and simplifying the system landscape behind the scenes.",
    description:
      "A systems-thinking case study that combines UX, experimentation, and operational modernization into one business outcome story.",
    role: "Product Manager, Commerce & Service Operations",
    company: "The Guitar Center Company",
    timeframe: "2023-2024",
    heroImage: "/images/checkout-hero.svg",
    heroImageAlt:
      "Mockups of a streamlined ecommerce checkout with supporting outcome metrics.",
    tags: [
      "Order Management",
      "Commerce",
      "Operations",
      "Experimentation",
      "Cross-functional Leadership",
    ],
    featuredMetrics: [
      {
        label: "Annualized impact",
        value: "~$16M",
        detail: "Driven by a statistically significant conversion lift.",
      },
      {
        label: "Checkout speed",
        value: "50% faster",
        detail: "Median checkout completion time was cut in half.",
      },
      {
        label: "Systems simplified",
        value: "16 -> 9",
        detail:
          "Returns and order workflows were consolidated to reduce operational drag.",
      },
    ],
    context: [
      "The customer order journey and the service order journey were both carrying legacy complexity.",
      "Checkout had grown cluttered over years of patching, while returns and service workflows required teams to bounce across too many systems to complete basic work.",
      "Viewed separately, these looked like different problems. Viewed as one order-management story, they represented a broader opportunity to remove friction across the whole lifecycle.",
    ],
    problem: [
      "Customers experienced slow, unclear checkout steps that increased drop-off and lowered completion confidence.",
      "Operators dealt with fragmented returns tooling that created wasted time, inconsistent workflows, and avoidable context switching.",
      "The business needed both top-line and operational improvements without waiting for a full replatform.",
    ],
    strategicInsight: [
      "Treating checkout and returns as isolated projects would have solved symptoms, not the system.",
      "The better move was to focus on the highest-friction order-management moments across customer experience and service operations, then modernize them with the same principles: simplify, validate, and remove unnecessary steps.",
      "That framing made it easier to align stakeholders who cared about revenue, service efficiency, engineering complexity, and customer experience all at once.",
    ],
    optionsAndTradeoffs: [
      {
        option: "Patch the existing experiences incrementally",
        tradeoff:
          "Low immediate cost, but keeps the system architecture and workflow burden intact.",
      },
      {
        option: "Wait for a full end-to-end replatform",
        tradeoff:
          "Potentially cleaner in theory, but too slow and risky for the business outcomes needed now.",
      },
      {
        option:
          "Target the highest-friction journeys with focused transformation work",
        tradeoff:
          "Requires strong prioritization and cross-functional orchestration, but unlocks measurable value sooner.",
        selected: true,
      },
    ],
    execution: [
      "Led a checkout redesign that simplified flow structure, removed confusing steps, improved performance, and validated changes through experimentation.",
      "Partnered with UX, engineering, analytics, marketing, and operations to align on the most consequential improvements and rollout decisions.",
      "Used A/B testing and measurable outcome tracking to keep the work grounded in business value rather than subjective preference.",
      "Extended the systems-thinking lens into returns modernization, consolidating fragmented tooling and redesigning workflows for speed and clarity.",
      "Kept stakeholder communication tight so the work remained credible both as a customer-experience improvement and as an operational simplification effort.",
    ],
    impact: [
      {
        label: "Revenue impact",
        value: "~$16M annualized",
        detail: "Based on roughly ~3.5% conversion lift after redesign.",
      },
      {
        label: "Customer experience",
        value: "50% faster checkout",
        detail:
          "Completion times improved materially while the journey became easier to understand.",
      },
      {
        label: "Operational efficiency",
        value: "~2,000 annual hours saved",
        detail:
          "Returns modernization reduced tool sprawl and unnecessary workflow switching.",
      },
    ],
    reflection: [
      "This is one of the clearest examples of how product management can connect experience quality with operating leverage.",
      "Recruiters often see checkout redesigns and operational systems work as separate categories. In practice, both require the same muscles: prioritization, systems thinking, and cross-functional execution.",
      "TODO: Add a public-safe OMS architecture slide or returns workflow artifact if one becomes available.",
    ],
    visuals: [
      {
        title: "Checkout before / after",
        description:
          "Existing portfolio assets already show a strong visual shorthand for the checkout transformation.",
        image: "/images/checkout-after.svg",
        alt: "Illustration of a cleaner checkout experience after redesign.",
      },
      {
        title: "Returns workflow placeholder",
        description:
          "The case is ready for a second visual showing systems consolidation or the redesigned service workflow.",
        todo: "TODO: Add sanitized returns modernization screenshots or workflow diagram.",
      },
    ],
    testimonialIds: ["christopher-pruneau", "david-lawrence"],
    featured: true,
  },
];

export const productEntries: ProductEntry[] = [
  {
    slug: "launchmuse",
    href: "/products/launchmuse",
    title: "LaunchMuse",
    eyebrow: "Live Product",
    status: "Open alpha",
    summary:
      "An AI-native product for release planning that helps artists turn a launch date into a structured six-week campaign.",
    description:
      "A live product story that demonstrates problem framing, AI-native workflow design, and rapid execution from product manager to shipped prototype.",
    heroImage: "/images/launchmuse-screenshot.png",
    heroImageAlt:
      "LaunchMuse campaign wizard screenshot showing the product's release planning flow.",
    tags: ["AI-native MVP", "Creator Tools", "Workflow Design", "Music Tech"],
    featuredMetrics: [
      {
        label: "Prototype velocity",
        value: "Built in ~10 hours",
        detail:
          "Time from blank repo to a working MVP built with AI-assisted coding.",
      },
      {
        label: "Product stance",
        value: "Focused MVP",
        detail: "The product solves one painful job before expanding scope.",
      },
      {
        label: "Current status",
        value: "Live alpha",
        detail: "A working version is available for real-world exploration.",
      },
    ],
    problem: [
      "Independent artists and small teams often treat release planning like a second job built out of spreadsheets, reminders, and last-minute scrambling.",
      "The hard part is not only creating content. It is sequencing a coherent story across channels and milestones over several weeks.",
      "That planning overhead steals time and energy from the actual creative work.",
    ],
    solution: [
      "LaunchMuse focuses on a narrow but high-leverage problem: generate a practical six-week campaign around a release date.",
      "The product takes release context and returns a structured plan with milestone timing, content themes, and channel-aware suggestions.",
      "Instead of pretending to be a full-suite marketing platform, it acts like a planning copilot that helps artists get unstuck quickly.",
    ],
    productExperience: [
      {
        title: "Input the release context",
        description:
          "Artists describe the release type, timing, and story they want to tell.",
      },
      {
        title: "Generate a structured campaign",
        description:
          "LaunchMuse returns a practical six-week plan spanning pre-release, launch week, and follow-through.",
      },
      {
        title: "Refine with iteration",
        description:
          "The output is designed to be adapted, regenerated, or narrowed based on genre, platform, or audience fit.",
      },
    ],
    learnings: [
      "AI-native product design works best when the workflow is narrow, real, and frequent enough to matter.",
      "Being close to the user problem as a creator made it easier to cut scope aggressively without losing the emotional core of the product.",
      "PM-led prototyping with AI is a credible way to validate whether a product deserves more investment.",
    ],
    visuals: [
      {
        title: "LaunchMuse campaign wizard",
        description:
          "The live product flow shows how artists move from release context into a guided campaign planning workflow.",
        image: "/images/launchmuse-screenshot.png",
        alt: "LaunchMuse screenshot showing the campaign wizard description step.",
      },
    ],
    actions: [
      {
        href: "https://launchmuse.musicofdanielnash.com/",
        label: "Open live alpha",
        external: true,
      },
      {
        href: `mailto:${siteConfig.email}`,
        label: "Ask about the build",
        external: true,
      },
    ],
    featured: true,
  },
  {
    slug: "immunology-scout",
    href: "/products/immunology-scout",
    title: "Immunology Scout",
    eyebrow: "Emerging Product",
    status: "Concept in progress",
    summary:
      "An emerging AI product concept exploring how research teams can move faster from literature overload to useful hypotheses and next-step questions.",
    description:
      "A high-signal early-stage concept that shows how product thinking can translate frontier AI into scientific discovery workflows.",
    heroImage: "/images/immunology-scout-screenshot.png",
    heroImageAlt:
      "Immunology Scout screenshot showing a literature scouting workflow for immunology research.",
    tags: ["AI + Science", "Research Workflow", "Emerging Product"],
    featuredMetrics: [
      {
        label: "Product stage",
        value: "Early-stage concept",
        detail:
          "The opportunity is real, but still early and intentionally described with restraint.",
      },
      {
        label: "Core job",
        value: "Research signal finding",
        detail:
          "Help researchers move through literature, evidence, and next-step framing faster.",
      },
      {
        label: "Trust requirement",
        value: "High-confidence use case",
        detail:
          "Citations, transparency, and human review are non-negotiable in scientific workflows.",
      },
    ],
    problem: [
      "Scientific teams face an overwhelming volume of papers, pathways, and weak signals that are difficult to synthesize quickly.",
      "The bottleneck is rarely just information access. It is turning scattered evidence into a useful map of what matters next.",
      "General-purpose AI tools can summarize text, but that alone does not create a trustworthy research workflow.",
    ],
    solution: [
      "Immunology Scout is framed as a workflow product, not a magic answer engine.",
      "The concept focuses on literature scouting, evidence clustering, hypothesis framing, and handoff into human scientific judgment.",
      "The design bias is toward clarity, citations, and traceability so the product can be useful without pretending to replace expertise.",
    ],
    productExperience: [
      {
        title: "Start with a research question",
        description:
          "The user anchors the workflow around a specific immune pathway, marker, therapy area, or scientific uncertainty.",
      },
      {
        title: "Review evidence clusters",
        description:
          "The system surfaces related themes, conflicting signals, and promising directions to investigate further.",
      },
      {
        title: "Shape the next step",
        description:
          "Outputs are designed to support hypothesis refinement, literature triage, and team discussion rather than replace scientific reasoning.",
      },
    ],
    learnings: [
      "High-stakes AI products earn trust through traceability and humility, not just fluency.",
      "The product opportunity in science often lives in workflow compression and signal clarity rather than full automation.",
      "Keeping the public narrative modest matters when the work is promising but still emerging.",
    ],
    visuals: [
      {
        title: "Immunology Scout retrieval workflow",
        description:
          "The interface frames retrieval, synthesis, and scoped query inputs as a research workbench instead of a generic chatbot.",
        image: "/images/immunology-scout-screenshot.png",
        alt: "Immunology Scout interface showing a search-and-synthesis workflow.",
      },
    ],
    actions: [
      {
        href: siteConfig.linkedinUrl,
        label: "Discuss frontier AI products",
        external: true,
      },
    ],
    featured: true,
  },
  {
    slug: "ai-agents-lab",
    href: "/products/ai-agents-lab",
    title: "AI Agents Lab",
    eyebrow: "Prototype Lab",
    status: "Live experiments",
    summary:
      "A product lab for rapid AI experiments, including Sound Seeker and other agent-oriented workflows that make ideas tangible before full productization.",
    description:
      "This page packages builder energy without turning the portfolio into a toybox: real prototypes, clear framing, and explicit lessons for product leadership.",
    heroImage: "/images/synth-hero.svg",
    heroImageAlt:
      "Generative audio and interface illustration representing experimental AI products.",
    tags: ["Rapid Prototyping", "AI Agents", "Builder PM", "Live Demo"],
    featuredMetrics: [
      {
        label: "Prototype style",
        value: "PM-led prototyping",
        detail:
          "Built quickly to validate workflows and user value before full engineering investment.",
      },
      {
        label: "Anchor demo",
        value: "SoundSeeker demo",
        detail:
          "A hackathon-winning concept rebuilt as a public prototype using OpenAI APIs.",
      },
      {
        label: "Role in portfolio",
        value: "Builder proof point",
        detail:
          "Shows speed, range, and the ability to make abstract ideas concrete.",
      },
    ],
    problem: [
      "Many AI ideas stall because they stay in slides or strategy docs for too long.",
      "Teams need a faster way to pressure-test whether an experience is compelling before it becomes a roadmap commitment.",
      "Recruiters also need proof that the 'builder' identity is real, not just aspirational.",
    ],
    solution: [
      "AI Agents Lab turns promising workflow ideas into working artifacts quickly enough to learn from them.",
      "The flagship example is Sound Seeker: an AI assistant that helps musicians move from a tonal reference to a concrete rig and signal chain.",
      "The lab approach is intentionally pragmatic: prototype the workflow, learn what creates trust, then decide what deserves to harden into a product.",
    ],
    productExperience: [
      {
        title: "Explore the live Sound Seeker demo",
        description:
          "Users describe a song, artist, or sonic target and receive a rig recommendation with follow-up reasoning.",
      },
      {
        title: "See the product pattern",
        description:
          "Each experiment emphasizes workflow design, trust, and user control rather than shallow AI theatrics.",
      },
      {
        title: "Translate experiments into strategy",
        description:
          "The point of the lab is not novelty. It is de-risking concepts and generating evidence for where product investment should go next.",
      },
    ],
    learnings: [
      "Prototypes are most useful when they reveal product questions, not just technical possibility.",
      "AI pair-programming meaningfully expands what product leaders can make tangible on their own.",
      "Users trust AI experiences more when the system explains itself and asks clarifying questions instead of over-claiming certainty.",
    ],
    visuals: [
      {
        title: "Sound Seeker prototype",
        description:
          "Existing hero art is paired with a live widget to demonstrate the prototype directly on the page.",
        image: "/images/synth-hero.svg",
        alt: "Experimental product visual for an AI-powered music recommendation interface.",
      },
      {
        title: "Future lab demos",
        description:
          "This area is reserved for additional prototypes, screenshots, or Looms as the lab expands.",
        todo: "TODO: Add one or two more public experiments to deepen the builder signal.",
      },
    ],
    actions: [
      {
        href: "/work/ai-platform-mcp",
        label: "See the platform strategy behind the lab",
      },
      {
        href: siteConfig.linkedinUrl,
        label: "Talk about builder PM roles",
        external: true,
      },
    ],
    featured: true,
    embeddedExperience: "sound-seeker",
  },
];

export const thinkingEntries: ThinkingEntry[] = [
  {
    slug: "ai-strategy",
    href: "/thinking/ai-strategy",
    title: "AI strategy is adoption design, not model shopping",
    eyebrow: "Thinking",
    summary:
      "Enterprise AI succeeds when product leaders design for workflow fit, trust, and operating rhythm, not just access to the newest model.",
    description:
      "A concise point of view on what makes AI programs actually stick inside organizations.",
    readTime: "4 min read",
    tags: ["AI Strategy", "Operating Model", "Product Leadership"],
    keyIdeas: [
      "Pilot where the workflow is real and measurable.",
      "Treat enablement and governance as product work, not compliance afterthoughts.",
      "Design the middle layer between models and business systems.",
    ],
    sections: [
      {
        title: "The mistake most teams make",
        body: [
          "Too many AI conversations start with the model. That is usually the least differentiated part of the strategy.",
          "The hard part is adoption design: where the workflow lives, what gets measured, who trusts the output, and how the organization learns what is worth scaling.",
        ],
      },
      {
        title: "What changes the outcome",
        body: [
          "Start with a workflow where value can be observed quickly and safely. Design the rollout like a product experiment, not a software procurement exercise.",
          "Then build the surrounding system: prompt patterns, training, champions, review steps, and a shared language for when a use case should evolve into something more durable.",
        ],
      },
      {
        title: "My operating principle",
        body: [
          "AI strategy is strongest when it connects business outcomes, workflow design, and architecture without over-indexing on any one of them.",
          "That is why I care so much about pilots, connectors, and operating models. They are how AI stops being a deck and starts becoming a capability.",
        ],
      },
    ],
    featured: true,
  },
  {
    slug: "product-philosophy",
    href: "/thinking/product-philosophy",
    title: "Product leadership is systems design with accountability",
    eyebrow: "Thinking",
    summary:
      "Good product leadership is not just roadmap taste. It is the ability to improve how decisions get made, how teams work, and how strategy becomes execution.",
    description:
      "A short philosophy piece on product management as operating-system design.",
    readTime: "5 min read",
    tags: ["Product Philosophy", "Systems Thinking", "Leadership"],
    keyIdeas: [
      "The team's operating model is part of the product outcome.",
      "Clarity is a product capability, not just a communication skill.",
      "Creative practice makes ambiguity easier to structure.",
    ],
    sections: [
      {
        title: "What product leadership really owns",
        body: [
          "Strong product leaders own more than a backlog. They shape the quality of decisions across strategy, delivery, and cross-functional trust.",
          "If planning is chaotic, priorities are opaque, or teams cannot see how work connects to outcomes, that is a product problem too.",
        ],
      },
      {
        title: "Why systems thinking matters",
        body: [
          "The best PMs recognize that customer experience, internal workflow, and org design often sit inside the same system.",
          "That is why my work has stretched across checkout flows, returns tooling, enterprise AI adoption, and PM enablement. The surface changes, but the product muscles are consistent.",
        ],
      },
      {
        title: "The creative edge",
        body: [
          "Composition trained me to hear structure, pacing, tension, and release. Those are product skills too.",
          "In practice, that means I care about coherence: the arc of a meeting, the shape of a roadmap, and the feel of a product experience once it is finally in someone's hands.",
        ],
      },
    ],
    featured: true,
  },
];

export const creativeEntries: CreativeEntry[] = [
  {
    slug: "eeg-music",
    href: "/creative/eeg-music",
    title: "EEG music experiments",
    eyebrow: "Creative Technology",
    summary:
      "An evolving creative-tech exploration into translating biological signals into musical systems, composition rules, and product ideas.",
    description:
      "A forward-looking page that connects experimental music, human signals, and creative technology without pulling focus from the product narrative.",
    tags: ["EEG", "Creative Tech", "Experimental Music"],
    heroImage: "/images/synth-hero.svg",
    heroImageAlt:
      "Abstract waveform illustration suggesting a connection between signals and musical output.",
    sections: [
      {
        title: "Why this exists",
        body: [
          "I am interested in creative systems where human signals shape musical structure instead of acting as a novelty input.",
          "That interest sits at the intersection of composition, experimentation, and product thinking: what kind of interface helps people experience a signal as something expressive and interpretable?",
        ],
      },
      {
        title: "What I am exploring",
        body: [
          "The current direction is intentionally lightweight: signal mapping, compositional constraints, and questions about what kind of interaction feels meaningful instead of gimmicky.",
          "This page is structured to hold future artifacts such as clips, process notes, visualizations, or a public-safe prototype.",
        ],
      },
      {
        title: "Why it belongs in the portfolio",
        body: [
          "The value is not that I built a neuroscience startup on the side. It is that this kind of experiment reveals how I think about systems, interfaces, and translating ambiguity into something people can actually engage with.",
          "TODO: Add an embed, image sequence, or process write-up when the artifact is ready to share publicly.",
        ],
      },
    ],
    visuals: [
      {
        title: "Artifact placeholder",
        description:
          "Reserved for a future video, screenshot, or signal-to-sound visualization.",
        todo: "TODO: Add EEG experiment media when a public-safe artifact exists.",
      },
    ],
    featured: true,
  },
  {
    slug: "compositions",
    href: "/creative/compositions",
    title: "Selected compositions",
    eyebrow: "Creative Practice",
    summary:
      "Selected recordings and performance pieces that show the creative discipline behind my product work.",
    description:
      "A restrained music page that supports the portfolio's differentiation story without overwhelming the hiring narrative.",
    tags: ["Composition", "Performance", "Music"],
    sections: [
      {
        title: "How music informs the work",
        body: [
          "Music matters here because it sharpens pattern recognition, pacing, empathy, and structured creativity.",
          "I do not position it as the headline. I position it as a source of taste and systems-thinking that meaningfully shapes how I build products.",
        ],
      },
      {
        title: "Selected pieces",
        body: [
          "The pieces below span improvisation, electronic texture, and composition for live performance.",
          "They are included as a supporting layer for the story, not as a detour away from product leadership.",
        ],
      },
    ],
    embeds: [
      {
        title: "A Beautiful Mess",
        type: "spotify",
        src: "https://open.spotify.com/embed/track/3p1KWUJ6kp6UXwIhAxU37f?utm_source=generator",
        description:
          "A spontaneous collaboration built from keys, synth bass, hand-played electronic drums, and layered improvisation.",
      },
      {
        title: "Odd Optimism",
        type: "spotify",
        src: "https://open.spotify.com/embed/track/7dla5bFVDI51S69ZsxhN8N?utm_source=generator",
        description:
          "A piece built around asymmetry and persistence, using irregular patterns to create forward motion.",
      },
      {
        title: "Kodama",
        type: "spotify",
        src: "https://open.spotify.com/embed/track/1oYkTFQQXUl0fiGkxD5lSc?utm_source=generator",
        description:
          "A meditation on stillness that moves between acoustic resonance and digital breath.",
      },
      {
        title: "Respite",
        type: "spotify",
        src: "https://open.spotify.com/embed/track/5N2N6PN7we8FO8OO4PePtK?utm_source=generator",
        description:
          "A short pause built from sparse piano lines and ambient textures.",
      },
      {
        title: "Marimba Duet for Soloist (Live + Video)",
        type: "youtube",
        src: "https://www.youtube.com/embed/c5fJgwHkXiY",
        description:
          "A live performance work where the prerecorded track gradually reverses until the performer is effectively playing with a reversed version of themself.",
      },
    ],
    featured: true,
  },
];

export const aboutContent = {
  title: "AI systems product leader, systems thinker, and hands-on builder",
  summary:
    "I build and scale real-world AI systems, from early prototypes to enterprise adoption. Over the last nine years, my work has moved across ecommerce, contact center, workflow modernization, product enablement, and enterprise AI, but the through-line is consistent: turning emerging capabilities into systems that actually work in production.",
  paragraphs: [
    "At Guitar Center, I have led AI initiatives from pilot to scale, growing ChatGPT Enterprise from roughly ~150 users / ~40 DAU to ~1,000 users / ~800 DAU. That work included reusable AI workflows, enterprise governance, and close partnership across Legal, Security, Engineering, and Operations.",
    "I have also built and shipped systems directly: designing agent-based workflows, integrating retrieval across structured and unstructured data, and using eval-driven iteration to improve quality and reliability over time.",
    "Recently, I have been building multi-agent research workflows in immunology, exploring how AI can accelerate scientific discovery while still respecting domain trust, incentives, and feedback design.",
    "I do my best work in environments that value both building and thinking, where product managers are expected to understand the system, not just the roadmap. Music remains part of the story because it sharpens narrative sense, systems awareness, and craft.",
  ],
  principles: [
    "Start with the workflow, not the demo.",
    "Measure outcomes in business language whenever possible.",
    "Design system layers, retrieval, and governance as part of the product, not after it.",
    "Use evaluation loops, feedback systems, and incentives to improve quality over time.",
    "Prototype when it raises decision quality or helps a system become real faster.",
  ],
};

export const resumeVariants: ResumeVariant[] = [
  {
    id: "ai-product-leader",
    title: "AI Product Leader",
    audience:
      "Best for AI platform, enterprise AI, and staff-level PM conversations.",
    filename: "daniel-nash-ai-product-leader-resume.pdf",
    note: "TODO: Add the PDF to public/resumes to activate download and embedding.",
  },
  {
    id: "senior-product-manager",
    title: "Senior Product Manager",
    audience:
      "Best for broad-market product roles spanning growth, commerce, operations, and customer experience.",
    filename: "daniel-nash-senior-product-manager-resume.pdf",
    note: "Existing filename is already documented in public/resumes/README.md.",
  },
  {
    id: "builder-pm",
    title: "Builder / 0-to-1 PM",
    audience:
      "Best for builder-focused roles emphasizing prototypes, AI workflows, and incubation.",
    filename: "daniel-nash-builder-pm-resume.pdf",
    note: "TODO: Add or refresh this version if you want a more explicit builder narrative.",
  },
];

export function getFeaturedTestimonials() {
  return testimonials.filter(
    (testimonial) => testimonial.featured && !testimonial.isPlaceholder,
  );
}

export function getRenderableTestimonials() {
  return testimonials.filter((testimonial) => !testimonial.isPlaceholder);
}

export function getWorkEntry(slug: string) {
  return workEntries.find((entry) => entry.slug === slug);
}

export function getProductEntry(slug: string) {
  return productEntries.find((entry) => entry.slug === slug);
}

export function getThinkingEntry(slug: string) {
  return thinkingEntries.find((entry) => entry.slug === slug);
}

export function getCreativeEntry(slug: string) {
  return creativeEntries.find((entry) => entry.slug === slug);
}

export function getTestimonialsByIds(ids: string[]) {
  return ids
    .map((id) => testimonials.find((testimonial) => testimonial.id === id))
    .filter((testimonial): testimonial is TestimonialEntry =>
      Boolean(testimonial),
    )
    .filter((testimonial) => !testimonial.isPlaceholder);
}
