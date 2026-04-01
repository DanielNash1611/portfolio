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
  placement?: "execution" | "scale" | "sidebar";
  imageFit?: "cover" | "contain";
  expandable?: boolean;
};

export type ExecutionStep = {
  title: string;
  body: string;
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
  heroMetricsPlacement?: "hero" | "snapshot";
  heroDetails?: string[];
  heroQuestions?: string[];
  featuredMetrics: Metric[];
  overview?: string[];
  context: string[];
  problem: string[];
  strategicInsight: string[];
  optionsAndTradeoffs: TradeoffOption[];
  execution: Array<string | ExecutionStep>;
  impact: Metric[];
  results?: string[];
  scaledBeyondPilot?: string[];
  reflection: string[];
  artifactSectionTitle?: string;
  artifactSectionDescription?: string;
  visuals: VisualAsset[];
  testimonialIds: string[];
  recommendationsTitle?: string;
  recommendationsDescription?: string;
  ctaTitle?: string;
  ctaDescription?: string;
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
  heroImageClassName?: string;
  heroImageExpandable?: boolean;
  tags: string[];
  featuredMetrics: Metric[];
  problem: string[];
  solution: string[];
  whyThisMatters?: string[];
  productExperience: Array<{
    title: string;
    description: string;
  }>;
  evaluationAndTrust?: string[];
  learnings: string[];
  buildStory?: string[];
  visuals: VisualAsset[];
  actions?: ActionLink[];
  featured?: boolean;
};

export type ThinkingEntry = {
  slug: string;
  href: string;
  title: string;
  eyebrow: string;
  summary: string;
  description: string;
  cardTitle?: string;
  cardDescription?: string;
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
  contactHref: "/contact",
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
    title: "Building AI products that deliver meaningful impact",
    description:
      "I turn new AI capability into practical products, workflows, and use cases that teams use, trust, and scale.",
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
  featuredWork: ["chatgpt-enterprise", "ai-platform-mcp", "checkout-redesign"],
  featuredProducts: ["launchmuse", "immunology-scout", "oms-chatgpt-app"],
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
      href: siteConfig.contactHref,
      label: "Send a message",
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
    id: "sean-richardson",
    quote:
      "Daniel has been a tremendous partner across the many different initiatives we've worked together on.",
    name: "Sean Richardson",
    title: "Information Security Manager",
    company: "The Guitar Center Company",
    relationship:
      "Security partner across enterprise AI adoption and data protection work",
    context:
      "Sean described Daniel as an insightful, collaborative problem solver who was at the forefront of Guitar Center's early AI efforts while helping craft processes that enabled business efficiency and kept data protected.",
    source: "LinkedIn",
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
    eyebrow: "Senior Product Manager, AI Platform Strategy",
    summary:
      "I led ChatGPT Enterprise from a controlled pilot to scaled operating model at Guitar Center, proving measurable value in the contact center, then expanding adoption from roughly ~150 licensed users / ~40 DAU to ~1,000 users / ~800 DAU through workflow design, governance, enablement, and cross-functional trust.",
    description:
      "A recruiter-friendly story about taking AI from early promise into real production environments with measurable impact.",
    role: "Senior Product Manager, Contact Center & AI Strategy",
    company: "The Guitar Center Company",
    timeframe: "2024-2026",
    heroImage: "/images/chatgpt-enterprise/hero-operating-model.png",
    heroImageAlt:
      "Sanitized ChatGPT Enterprise hero visual showing the path from pilot to operating model with discovery, governance, pilot, scale, champions, OpenAI GTM partnership, and executive support.",
    tags: [
      "ChatGPT Enterprise",
      "AI Strategy",
      "Experimentation",
      "Workflow Design",
      "Change Leadership",
    ],
    heroMetricsPlacement: "snapshot",
    heroDetails: [
      "This was not a broad “roll out AI everywhere” initiative. It was a deliberately scoped product-led experiment inside a revenue-critical environment, designed to answer two questions:",
      "The answer to both was yes.",
    ],
    heroQuestions: [
      "Can AI improve frontline performance in a measurable way?",
      "Can it be introduced in a way leadership will trust enough to scale?",
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
    overview: [
      "At the time, generative AI interest was rising across the company, but leadership needed more than enthusiasm. The bar was not novelty. The bar was a safe, measurable, credible implementation that could demonstrate business value without creating governance risk.",
      "The contact center was the right proving ground. It had clear workflow friction, measurable business outcomes, and high enough operational visibility that results would matter. Agents were spending time on pre-call preparation, drafting, and context switching across systems. If AI could improve that environment in a controlled way, it could become the foundation for a broader operating model.",
    ],
    context: [
      "This work started inside a high-leverage operational environment rather than as a centralized innovation exercise. The contact center had visible friction in day-to-day work: agents needed faster access to context, better support for on-brand communication, and less time lost to repetitive preparation and switching between tools. At the same time, any implementation had to preserve human judgment and respect governance boundaries.",
      "Leadership also needed more than anecdotal success stories. For enterprise AI to become credible, it needed to show measurable improvement in both revenue and efficiency, not just excitement from early adopters. That requirement shaped the pilot from the beginning.",
    ],
    problem: [
      "The real risk was not missing the AI wave. It was adopting it badly.",
      "Without a controlled pilot, AI usage could have fragmented into isolated power users, inconsistent prompting behavior, weak governance practices, and no clear business case.",
      "Meanwhile, agents still needed help with workflow friction that directly affected speed, quality, and commercial outcomes. Leadership needed evidence that AI could improve performance in a meaningful way while remaining safe and manageable to scale.",
    ],
    strategicInsight: [
      "The winning move was not broad access.",
      "The better strategy was to start in an environment where workflow friction was high, outcomes were measurable, and human judgment still mattered. So instead of treating ChatGPT Enterprise like a generic productivity tool, I framed it as a product experiment inside a revenue-critical operating system.",
      "That meant pairing frontline co-design with a matched control group, clearly defined business metrics, practical governance boundaries, and a rollout path that could evolve from pilot to broader adoption. Once the proof point existed, scale became a product management problem: enablement, champions, sequencing, and trust.",
    ],
    optionsAndTradeoffs: [
      {
        option: "Open broad access immediately",
        tradeoff:
          "Fastest path to raw adoption, but weak governance, low measurement confidence, and limited ability to distinguish real value from enthusiasm.",
      },
      {
        option: "Treat AI as a long centralized research effort",
        tradeoff:
          "Safer on paper, but too slow to create operating momentum and too detached from frontline workflow reality.",
      },
      {
        option:
          "Run a controlled pilot with measured outcomes, then scale with enablement and governance",
        tradeoff:
          "This was the chosen path. It required more upfront design work, but it gave the company the clearest route to trust, executive buy-in, and durable expansion.",
        selected: true,
      },
    ],
    execution: [
      {
        title: "Identified the right workflow opportunities",
        body: "I partnered with supervisors and frontline agents to identify the highest-friction jobs to be done, then translated those into purpose-built GPT-supported workflows. The goal was not general AI usage. It was targeted support in moments where time, clarity, and consistency mattered most.",
      },
      {
        title: "Built trust through governance design",
        body: "I worked across Legal, Security, Engineering, enterprise systems, and Operations to define acceptable data handling, review steps, and usage boundaries. This mattered because enterprise AI adoption only becomes real when the guardrails are practical enough for teams to use and credible enough for leadership to support.",
      },
      {
        title: "Structured the pilot around measurable proof",
        body: "The pilot was designed with a cohort and matched control group, using metrics centered on Revenue Per Call, Items Per Transaction, Average Order Value, and supporting efficiency signals. That measurement model turned the initiative from an AI experiment into a business case.",
      },
      {
        title: "Designed the enablement system, not just the workflows",
        body: "I created training assets, reusable prompting patterns, and the early grassroots version of ChatGPT Champions so the organization could scale from one team to many. This piece is strategically important: the value did not come only from model access, but from making the workflows repeatable, the adoption pattern teachable, and the community around it strong enough to spread good practice.",
      },
      {
        title: "Socialized results in executive language",
        body: "I translated the pilot into a leadership-ready narrative: concrete business value, repeatable rollout mechanics, and a credible path to broader investment.",
      },
    ],
    impact: [
      {
        label: "Business impact",
        value: "~$2.7M",
        detail:
          "Annualized pilot impact from the six-month test with a matched control group.",
      },
      {
        label: "Scaled adoption",
        value: "~150 -> ~1,000",
        detail:
          "Licensed users expanded from the initial pilot footprint into broad company adoption.",
      },
      {
        label: "Operating model",
        value: "~40 -> ~800 DAU",
        detail:
          "Daily usage grew because rollout emphasized reusable workflows, training, governance, and trust.",
      },
    ],
    results: [
      "The pilot proved two things at once.",
      "First, AI could create measurable value in a frontline workflow. Second, adoption would scale when enablement and guardrails were designed as part of the product rather than added later.",
      "The initial six-month pilot produced an annualized impact estimate of ~$2.7M, with pilot agents outperforming a matched control group across revenue and efficiency indicators. That proof point became the basis for expanding ChatGPT Enterprise from roughly ~150 licensed users / ~40 DAU to ~1,000 users / ~800 DAU across the company.",
    ],
    scaledBeyondPilot: [
      "The most important outcome was not just the pilot result. It was the operating model that came out of it.",
      "The rollout became scalable because usage patterns and governance were designed together. What emerged was a reusable system for enterprise AI adoption: workflow discovery, governance, measured pilots, enablement, feedback loops, and clear boundaries for use.",
      "What scaled beyond the pilot was not just usage, but the system around it. Alongside workflows and governance, I helped build the human adoption layer through a grassroots ChatGPT Champions model that surfaced strong use cases, spread practical best practices, and created momentum across teams. Over time, that effort gained broader cross-functional structure, partnership with OpenAI GTMs, and C-suite sponsorship, helping turn early momentum into a broader enterprise capability.",
    ],
    reflection: [
      "This case reinforced a pattern I believe in strongly: enterprise AI does not scale because access is available. It scales because one operating environment becomes measurably better first.",
      "Product leaders have an outsized role in that transition. The job is not just picking tools. It is designing the conditions for trust: workflow fit, measurable outcomes, governance that teams can actually work within, and an adoption model that can spread without falling apart.",
      "That is what turned this from a pilot into an operating model.",
    ],
    artifactSectionTitle: "Selected artifacts",
    artifactSectionDescription:
      "Sanitized exhibits from workflow discovery and the operating model that helped ChatGPT Enterprise scale with trust.",
    visuals: [
      {
        title: "Frontline ideation that shaped early GPT workflows",
        description:
          "Sanitized excerpt from a structured ideation session with contact center stakeholders. The team started with free brainstorming, then built on the strongest concepts through collaborative expansion and lightweight voting. The session helped surface several of the early workflow opportunities that shaped the rollout, including Gear Companion, a GPT I created to recommend complementary products customers often needed alongside a primary purchase, such as accessories for a digital keyboard. Gear Companion went on to become one of the most-used GPT workflows after launch.",
        image: "/images/chatgpt-enterprise/frontline-ideation.png",
        alt: "Sanitized ideation board showing brainstorming, idea expansion, team signal, and an early Gear Companion workflow concept.",
        placement: "execution",
        imageFit: "contain",
        expandable: true,
      },
      {
        title: "Enterprise AI operating model",
        description:
          "Sanitized view of the operating model that helped ChatGPT Enterprise move from pilot to scale. The rollout combined use-case discovery, governance, measured pilots, enablement, and feedback loops so adoption could grow without losing trust. This system made it possible to move from an initial proof point in the contact center to broader enterprise usage.",
        image: "/images/chatgpt-enterprise/enterprise-ai-operating-model.png",
        alt: "Sanitized enterprise AI operating model showing discovery, governance, pilot, scale, feedback, and supporting layers for guidance, trusted data, enablement, and adoption.",
        placement: "scale",
        imageFit: "contain",
        expandable: true,
      },
      {
        title: "Grassroots champions model that scaled into enterprise support",
        description:
          "Sanitized view of the adoption model that helped ChatGPT Enterprise scale beyond the initial pilot. I started the ChatGPT Champions program grassroots to share workflows, surface strong use cases, and build trust across teams. As adoption grew, the effort gained cross-functional structure, partnership with OpenAI GTMs, and C-suite sponsorship, helping turn early momentum into a broader enterprise capability.",
        image: "/images/chatgpt-enterprise/grassroots-champions-model.png",
        alt: "Sanitized champions model showing functional champions, local use cases, peer enablement, cross-functional alignment, OpenAI GTM partnership, and executive sponsorship.",
        placement: "scale",
        imageFit: "contain",
        expandable: true,
      },
    ],
    testimonialIds: ["zac-bogart", "sumanth-cherukuri"],
    recommendationsTitle: "How collaborators described this work",
    recommendationsDescription:
      "A few recommendation excerpts that reinforce the same pattern from adjacent perspectives: strong business partnership, reusable workflow design, and the ability to turn AI experimentation into credible organizational change.",
    ctaTitle: "Want the deeper walkthrough?",
    ctaDescription:
      "I’m happy to share more about the pilot structure, the metrics logic, the operating model, or how the cross-functional alignment worked behind the scenes.",
    featured: true,
  },
  {
    slug: "ai-platform-mcp",
    href: "/work/ai-platform-mcp",
    title: "From AI experiments to platform foundations",
    eyebrow: "Senior Product Manager, AI Platform Strategy",
    summary:
      "A strategy story about how an early customer-facing AI prototype and UX validation shaped my thinking around reusable systems, workflow-based adoption, and platform direction.",
    description:
      "A strategy story about how an early customer-facing AI prototype and UX validation shaped my thinking around reusable systems, workflow-based adoption, and platform direction.",
    role: "Senior Product Manager, AI Platform Strategy",
    company: "Enterprise AI / Platform",
    timeframe: "2024-2026",
    heroImage: "/images/sound-synthesist/product-visual.png",
    heroImageAlt:
      "Product visual for the Sound Synthesist custom GPT experience for Guitar Center customers.",
    tags: [
      "AI Platform Strategy",
      "Prototype Validation",
      "Workflow Design",
      "System Thinking",
    ],
    featuredMetrics: [
      {
        label: "ORIGIN POINT",
        value: "Validated AI concept",
        detail:
          "A hackathon-winning prototype showed that the customer problem was real.",
      },
      {
        label: "CUSTOMER SIGNAL",
        value: "87% would use again",
        detail:
          "Follow-up UX research showed strong reuse intent and positive sentiment.",
      },
      {
        label: "STRATEGIC SHIFT",
        value: "From one-off prototypes to repeatable AI systems",
        detail:
          "The strongest lesson was about reusable systems, workflow fit, and durable adoption.",
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
    testimonialIds: ["sean-richardson", "daniel-das"],
    featured: true,
  },
  {
    slug: "checkout-redesign",
    href: "/work/checkout-redesign",
    title: "Better execution, faster checkout, measurable growth",
    eyebrow: "Selected Work",
    summary:
      "Reduced checkout time by roughly 30%, delivered in 12 weeks, and contributed to an estimated ~$16M in annualized revenue impact through a post-launch A/B test.",
    description:
      "A high-stakes checkout redesign that succeeded not just because of the experience changes, but because better product, UX, and engineering collaboration led to stronger decisions during build, a cleaner launch, and measurable lift.",
    role: "Senior Product Manager, Commerce",
    company: "The Guitar Center Company",
    timeframe: "2023",
    heroImage: "/images/checkout-redesign/checkout-header.png",
    heroImageAlt:
      "Checkout redesign header illustration showing delivery, order summary, and payment visuals.",
    tags: [
      "Commerce",
      "Experimentation",
      "Cross-functional Leadership",
      "UX Delivery",
    ],
    featuredMetrics: [
      {
        label: "Annualized impact",
        value: "~$16M",
        detail: "Estimated from the post-launch A/B test.",
      },
      {
        label: "Checkout speed",
        value: "30% faster",
        detail: "Full checkout time dropped from 3:00 to 2:03.",
      },
      {
        label: "Delivery outcome",
        value: "12-week launch",
        detail: "Minimal service disruption after release.",
      },
    ],
    heroDetails: [
      "This was more than a redesign story. It was a product leadership story about improving how the team executed: giving developers enough context to make strong decisions, keeping UX involved during development, and delivering a high-stakes launch with almost no service disruption.",
    ],
    context: [
      "Checkout was one of the highest-stakes parts of the customer journey. Improving it had meaningful upside, but any issues at launch could immediately affect customers, revenue, and operations.",
      "The challenge was not just to redesign the flow. It was to deliver a significantly better experience quickly and safely, while making sure the team could navigate real implementation constraints without degrading the outcome.",
    ],
    problem: [
      "The existing checkout had become dense, dated, and harder to scan, which added friction to one of the most sensitive revenue moments on the site.",
      "The team also needed a delivery model that could handle feasibility tradeoffs without losing the intent of the redesign once development started.",
    ],
    strategicInsight: [
      "Better execution here meant improving the quality of decisions during build, not just shipping a prettier flow.",
      "Developers build better when they are given enough context to think, and design stays stronger when UX remains involved after handoff.",
    ],
    optionsAndTradeoffs: [
      {
        option: "Treat design as a traditional handoff",
        tradeoff:
          "Moves quickly at first, but feasibility issues often turn into weaker implementation compromises.",
      },
      {
        option: "Keep UX and engineering tightly engaged during build",
        tradeoff:
          "Requires more active collaboration, but produces stronger in-flight decisions and less rework.",
        selected: true,
      },
    ],
    execution: [
      "Aligned product, UX, and engineering around the stakes of the redesign so implementation decisions stayed tied to business and user outcomes.",
      "Made sure developers had enough context to make stronger product decisions during implementation rather than relying on literal requirements alone.",
      "Kept UX actively involved during development so feasibility issues could become live tradeoff conversations instead of isolated engineering compromises.",
      "Rolled the redesign out in 12 weeks and kept the release unusually clean for such a sensitive journey.",
    ],
    impact: [
      {
        label: "Checkout speed",
        value: "30% faster",
        detail: "Follow-up usability testing showed a drop from 3:00 to 2:03.",
      },
      {
        label: "Conversion lift",
        value: "~3%",
        detail: "Measured through post-launch A/B testing.",
      },
      {
        label: "Annualized impact",
        value: "~$16M",
        detail: "Estimated from the validated conversion lift.",
      },
    ],
    reflection: [
      "This project reinforced a product principle I still carry forward: better outcomes do not come from trying to control every decision.",
      "They come from creating enough shared context that the right people can make strong decisions at the right moment.",
      "In this case, that led to a better customer experience, a smoother launch, and measurable growth.",
    ],
    visuals: [
      {
        title: "Before & After",
        description:
          "Real checkout screenshots showing how the redesign simplified the experience.",
        image: "/images/checkout-redesign/checkout-after.png",
        alt: "Redesigned checkout screen used in the public case study.",
        expandable: true,
      },
      {
        title: "Context-rich implementation ticket",
        description:
          "Representative Jira ticket showing user need, expected behavior, and business rationale in one place.",
        image: "/images/checkout-redesign/jira-ticket.png",
        alt: "Jira ticket screenshot showing context-rich product writing for implementation.",
        imageFit: "contain",
        expandable: true,
      },
    ],
    testimonialIds: ["christopher-pruneau", "matt-winick"],
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
      "A focused AI-native product that helps artists turn the meaning behind a release into a cohesive six-week narrative.",
    description:
      "A live product case study about narrative-driven release planning, sharp product scoping, and how quickly a PM can now move from concept to working software.",
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
        value: "Narrative-first wedge",
        detail:
          "The product stays narrow and solves one painful job well: shaping a release into a coherent story.",
      },
      {
        label: "Current status",
        value: "Live alpha",
        detail:
          "A working version is available for real-world exploration and iteration.",
      },
    ],
    problem: [
      'Independent artists do not just struggle with promotion. They struggle with telling a coherent story around a release. Most launches end up collapsing into a single post that says some version of "my new song is out," even when the work behind it carries weeks or months of meaning, process, emotion, and intent.',
      "Turning that meaning into a structured campaign across multiple weeks and platforms is hard. The story gets spread across notes, reminders, half-finished captions, and last-minute decisions, which makes the campaign feel fragmented and reactive instead of intentional.",
      "The result is familiar: engagement spikes around release day, then disappears quickly because nothing is holding the narrative together before or after the drop. Planning the story becomes a second job. The more time artists spend figuring out how to talk about their work, the less time they spend actually creating it.",
    ],
    solution: [
      "LaunchMuse is intentionally narrow. It helps artists turn a release into a cohesive six-week story rather than asking them to stitch one together post by post.",
      "The product takes release context, then generates a structured campaign with narrative themes across each phase, timing across channels, and content ideas that reflect what the release is actually about.",
      "This is not trying to be a full marketing suite. It acts more like a storytelling copilot that helps artists express the meaning behind their work without getting buried in planning overhead.",
    ],
    whyThisMatters: [
      "Strong releases are not just announced. They are experienced. When the story around a release unfolds with some cohesion, fans have more ways to connect before the music arrives, not just after it is already out.",
      "That changes the shape of engagement. Anticipation builds earlier, the work feels more meaningful and memorable, and the release stops feeling like an isolated post fighting for attention in a crowded feed.",
      "LaunchMuse helps shift a release from scattered promotion into a connected narrative, while giving artists more time back for the work that matters most: making the music itself.",
    ],
    productExperience: [
      {
        title: "Input the release context",
        description:
          "Artists describe the release timing, type, and story they want to tell.",
      },
      {
        title: "Generate a structured campaign",
        description:
          "LaunchMuse returns a six-week plan with story arcs, content themes, and timing across channels.",
      },
      {
        title: "Refine with iteration",
        description:
          "The artist can adapt, regenerate, or narrow the plan based on platform, tone, audience, or creative direction.",
      },
    ],
    learnings: [
      'AI-native products work best when the workflow is narrow, real, and frequent enough to matter. LaunchMuse became stronger when I treated it less like "AI for music marketing" and more like one focused job: help an artist shape a release story they would otherwise struggle to plan consistently.',
      'Prompt scaffolding is product design. Output quality depended not just on the model, but on how release context, narrative structure, sequencing, and constraints were framed so the campaign felt coherent instead of generically "helpful."',
      "PM-led prototyping with AI is now a real validation advantage. This product moved from idea to working MVP fast enough that the concept could be tested while the product questions were still fresh, which is a meaningful shift from how slowly early validation used to happen.",
    ],
    buildStory: [
      "LaunchMuse was developed as part of the Maven AI Product Management Bootcamp with Marily Nika, where there was also a pitching and contest component among participants. That context helped sharpen the product story early, but the stronger signal was how quickly the idea could be turned into something real.",
      "The product evolved through multiple stages: it was first explored in v0, then iterated in Opal, and then built end to end in Codex. The full MVP came together in about 10 hours, alongside a first-time setup of the surrounding builder stack including GitHub, the Vercel environment, and the deployment workflow.",
      "The significance is not simply that I learned new tools. It is that a PM can now move from concept to working product far faster than traditional workflows allowed, especially when the scope is sharp and the validation question is clear. This project reinforced that product leaders who can scope sharply and prototype quickly can validate ideas far earlier than traditional workflows allow.",
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
        href: siteConfig.contactHref,
        label: "Ask about the build",
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
      "A paper-and-patent scouting product concept for immunology teams, designed to ground questions, surface novelty signals, and support next-step hypotheses.",
    description:
      "An early-stage research grounding product combining literature and patent signals for trustworthy immunology exploration.",
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
        value: "Paper + patent scouting",
        detail:
          "Help teams move from scattered evidence to grounded novelty checks and sharper next-step questions.",
      },
      {
        label: "Trust requirement",
        value: "Traceable workflow",
        detail:
          "Citations, transparency, and human review are non-negotiable in scientific research workflows.",
      },
    ],
    problem: [
      "Scientific teams are overwhelmed by papers, pathways, weak signals, and adjacent prior art across fast-moving therapeutic areas.",
      "The challenge is not just finding information. It is determining what matters, what may already exist, and what is worth pursuing next without losing momentum to manual synthesis and novelty checking.",
      "Generic AI summarization can compress text, but that alone is insufficient for a trustworthy research workflow. Teams still need cited evidence, patent awareness, and a clear boundary between grounded signals and scientific judgment.",
    ],
    solution: [
      'Immunology Scout is intentionally scoped as a research grounding layer rather than a broad "AI for science" platform.',
      "The current wedge is paper + patent exploration: combine scientific literature and prior-art signals so teams can see what is known, what is uncertain, and where genuine opportunity may exist.",
      "Patent-aware exploration helps researchers pressure-test novelty, understand competitive context, and avoid duplicating work that may already be claimed or crowded.",
      "Outputs are structured to support hypothesis refinement, competitive analysis, and future downstream workflows such as simulation and experimental planning systems, while keeping human scientific reasoning in the loop.",
    ],
    productExperience: [
      {
        title: "Start with a focused research question",
        description:
          "The workflow begins with a specific immune pathway, marker, therapy area, or scientific uncertainty so the search stays grounded in a real research question.",
      },
      {
        title: "Review evidence and novelty signals",
        description:
          "The product surfaces literature themes, conflicting signals, related patents, and potential whitespace with citations and traceability visible for review.",
      },
      {
        title: "Shape next-step hypotheses and directions",
        description:
          "Outputs are designed for hypothesis refinement, literature triage, scientific discussion, and downstream planning rather than replacing scientific reasoning.",
      },
    ],
    evaluationAndTrust: [
      "This was the first project where I built formal evals. Because I was not the domain expert, I worked with a scientific collaborator to define what a useful, trustworthy output should actually contain.",
      "Structured expert feedback became the basis for a lightweight evaluation set: what evidence should be cited, where claims needed tighter boundaries, and what would make the product genuinely useful to a researcher instead of merely polished.",
      "That process surfaced a critical issue early: the system could hallucinate patent references, which is unacceptable in a workflow meant to support novelty checking and competitive understanding.",
      "Once those failures were visible and measurable, iteration became much more disciplined. Later versions enabled tighter automated feedback loops, but the larger lesson was product-oriented: in high-stakes domains, trust comes from repeated loops between domain expertise, evaluation, traceability, and system behavior.",
    ],
    learnings: [
      "Trust in high-stakes AI products is earned through traceability, humility, and evaluation, not just fluent answers.",
      "When the builder is not the subject-matter expert, domain-expert-informed evaluation is essential for defining quality and catching failure modes early.",
      "In scientific workflows, compressing synthesis and novelty checking is often more valuable than trying to automate judgment end to end.",
      "Strong science product opportunities can start with grounding and signal clarity before expanding into more ambitious downstream systems.",
      "Modest public framing matters when the product is promising but still emerging.",
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
    slug: "oms-chatgpt-app",
    href: "/products/oms-chatgpt-app",
    title: "OMS ChatGPT App",
    eyebrow: "Product Artifact",
    status: "Live prototype",
    summary:
      "A prototype ChatGPT App that enables users to interact with Order Management Systems through a conversational interface, handling workflows like order lookup and cancellation with built-in guardrails.",
    description:
      "Conversational OMS prototype showing how AI can support order lookup and cancellation inside enterprise workflows with clear safeguards and user control.",
    heroImage: "/images/oms-chatgpt-app/web-prototype-stylized.png",
    heroImageAlt:
      "Stylized presentation of the OMS ChatGPT App web prototype used as a hero asset.",
    heroImageClassName: "object-cover object-top",
    heroImageExpandable: true,
    tags: [
      "Enterprise Workflow",
      "Conversational AI",
      "AI Agents",
      "Prototype",
    ],
    featuredMetrics: [
      {
        label: "Environment",
        value: "Simulated OMS data",
        detail:
          "The prototype uses mock order data so the workflow can be explored without exposing PII.",
      },
      {
        label: "Workflow scope",
        value: "Lookup + cancellation",
        detail:
          "Focused on two concrete OMS jobs where guardrails and user confirmation matter.",
      },
      {
        label: "Design priority",
        value: "Trust and control",
        detail:
          "Reasoning, confirmation, and clear user control were treated as first-class product requirements.",
      },
    ],
    problem: [
      "OMS workflows are often fragmented across multiple tools, slow to execute, and difficult to automate safely because of PII constraints.",
      "Early AI efforts also tended to live either as standalone experiences or as small helpers inside existing workflows, without a clear pattern for AI interacting directly with internal systems through conversation.",
      "This prototype explored whether a conversational interface could make common OMS tasks faster and clearer without making the workflow feel reckless or opaque.",
    ],
    solution: [
      "OMS ChatGPT App is a conversational AI interface for Order Management workflows, designed to make common support and operations tasks faster, clearer, and safer to execute.",
      "The prototype focuses on high-signal tasks like order lookup and cancellation, with confirmation steps, visible reasoning, and built-in guardrails instead of hidden automation.",
      "It was designed to live inside an AI environment employees were already using, making the interaction pattern feel close to real work instead of like a disconnected experiment.",
    ],
    whyThisMatters: [
      "The prototype represented an early example of a more direct pattern for conversational interaction with internal systems.",
      "It helped shift thinking from AI as a standalone tool toward AI as an active participant in real workflows, while staying disciplined about safety, clarity, and human control.",
    ],
    productExperience: [
      {
        title: "Retrieve order details through natural language",
        description:
          "Users can ask for order information conversationally instead of navigating across multiple OMS screens.",
      },
      {
        title: "Execute guarded cancellations",
        description:
          "Cancellation flows require confirmation and make safeguards visible before any action is taken.",
      },
      {
        title: "See reasoning and stay in control",
        description:
          "The interaction is designed to explain what the system is doing and preserve user agency throughout the workflow.",
      },
    ],
    evaluationAndTrust: [
      "The prototype uses simulated data to respect the sensitivity of OMS systems and avoid exposing PII.",
      "It represents a functional concept rather than a production deployment, with the goal of validating interaction patterns instead of replacing existing systems.",
      "Designed to explore how AI agents can safely operate within enterprise workflows.",
    ],
    learnings: [
      "AI can operate within enterprise constraints when designed intentionally.",
      "Prototypes can unlock faster alignment than strategy documents alone.",
      "Product leaders can de-risk platform investments through hands-on builds.",
    ],
    buildStory: [
      "The prototype created enough alignment to move from a promising interaction concept into more serious exploration of production viability.",
      "Follow-on work included evaluating SSO integration for secure access, defining PII-safe interaction patterns, building an internal MCP server to support agent workflows, and exploring a production-oriented architecture that paired Java for team alignment with a Python wrapper around the Agents SDK.",
    ],
    visuals: [
      {
        title: "Order lookup inside ChatGPT",
        description:
          "Natural-language lookup returns a structured order view with order status, shipping details, totals, and expandable items.",
        image: "/images/oms-chatgpt-app/order-items-chatgpt.png",
        alt: "OMS ChatGPT App order summary view inside ChatGPT showing order details and expanded line items.",
        expandable: true,
      },
      {
        title: "Cancellation with guardrails",
        description:
          "The confirmation state makes the risk explicit, requires a deliberate phrase, and keeps the user in control before submission.",
        image: "/images/oms-chatgpt-app/cancellation-guardrails-chatgpt.png",
        alt: "OMS ChatGPT App cancellation confirmation flow inside ChatGPT showing warning text and explicit confirmation controls.",
        expandable: true,
      },
      {
        title: "Completed state after action",
        description:
          "After confirmation, the assistant shows the updated order state clearly instead of hiding the result behind a generic success message.",
        image: "/images/oms-chatgpt-app/cancelled-state-chatgpt.png",
        alt: "OMS ChatGPT App order summary after cancellation showing the updated cancelled state.",
        expandable: true,
      },
    ],
    actions: [
      {
        href: "https://omschatgptapp.vercel.app",
        label: "Live prototype (simulated environment)",
        external: true,
      },
    ],
    featured: true,
  },
];

export const thinkingEntries: ThinkingEntry[] = [
  {
    slug: "ai-strategy",
    href: "/thinking/ai-strategy",
    title: "AI doesn’t fail because of the model. It fails in the workflow.",
    eyebrow: "Thinking",
    summary:
      "Enterprise AI succeeds when product leaders focus less on model debates and more on workflow fit, trust, enablement, and the systems that make adoption real.",
    description:
      "A practical enterprise AI point of view shaped by leading adoption in a real company, where workflow fit, trust, champions, governance, and the middle layer mattered more than model hype.",
    cardTitle: "AI doesn’t fail because of the model",
    cardDescription:
      "Most enterprise AI plans make the model choice feel like the big decision. In practice, the harder work is workflow fit, trust, champions, governance, and the middle layer that makes AI usable inside real systems.",
    readTime: "4 min read",
    tags: ["AI Strategy", "Operating Model", "Product Leadership"],
    keyIdeas: [
      "Start with a workflow, not a model decision.",
      "Adoption needs champions, trust, and an operating rhythm.",
      "The real product is the system around the model.",
    ],
    sections: [
      {
        title: "Most AI strategies fail before they start",
        body: [
          "Most AI strategies fail before they start because they turn a technology choice into the strategy. Teams spend weeks comparing model quality, vendor roadmaps, and benchmark scores before they have identified the actual work that needs to improve.",
          "In enterprise settings, that is backwards. The model matters, but it is rarely the main reason something succeeds or fails. The real questions are where AI fits in the workflow, what people will trust, how risk is handled, and what has to be true for usage to become repeatable instead of theatrical.",
        ],
      },
      {
        title: "What starting with the model actually means",
        body: [
          "Starting with the model is not just arguing about GPT versus Claude. It is the broader habit of making the technology choice the center of the strategy before the workflow, measurement plan, trust requirements, and operating model are clear.",
          "That approach feels concrete, but it usually postpones the harder product decisions. Models can be swapped. Bad workflow fit, weak review design, fuzzy ownership, and missing adoption systems are much harder to repair after people have already formed habits around the wrong setup.",
        ],
      },
      {
        title: "Start with real work",
        body: [
          "When I helped lead early ChatGPT rollout work in the contact center, the starting question was simple: where are agents spending time, where is quality inconsistent, and what could we improve safely inside a real workflow?",
          "That led us toward concrete jobs like pre-call preparation, drafting, and other context-heavy tasks with clear operational value. Starting there made the pilot measurable, grounded, and safe enough to learn from. Small pilots are useful when they reveal something durable: which moments benefit from AI, where human review has to stay, what prompt patterns hold up, and which workflows are actually worth scaling.",
        ],
      },
      {
        title: "Adoption is the product",
        body: [
          "Shipping access is not the same as shipping adoption. Usage grows when people trust the output, understand the boundaries, and can see how AI helps them do real work faster or better.",
          "As ChatGPT Champions Lead, I treated enablement as part of the product, not as launch support. That meant reusable prompting patterns, training, examples, feedback loops, and a champions network that helped strong workflows spread across the organization. Champions were not a side program. They were part of how adoption became real.",
        ],
      },
      {
        title: "Governance belongs in the design",
        body: [
          "In real enterprise AI work, governance is not an afterthought. Legal review, security boundaries, data handling rules, approval paths, and risk tiers all shape what the system can responsibly do.",
          "The goal is not to add control for its own sake. It is to design guardrails that are clear enough for leadership to trust and practical enough for teams to use. If governance lives outside the workflow, people route around it. If it is part of the workflow, scale gets much more realistic.",
        ],
      },
      {
        title: "The real product layer",
        body: [
          "The most important AI product work usually sits in the middle layer between the model and the business system. This is where prompt patterns, tooling, integrations, context handling, permissions, feedback loops, and review processes come together.",
          "The model generates an output. The middle layer determines whether that output has the right context, reaches the right tool, follows the right review path, and lands inside a workflow a business can actually rely on.",
          "That is why enterprise AI work starts to look much closer to systems product work than prompt experimentation. The product is not the model alone. The product is the system around the model. If that layer is weak, even a strong model produces brittle adoption. If that layer is well designed, model improvements become much easier to absorb.",
        ],
      },
      {
        title: "My operating principle",
        body: [
          "I keep coming back to the same sequence: start with the business outcome, map the workflow, then design the system around the model.",
          "The model still matters. It is just not the center of gravity. If the workflow is weak, trust is low, or the operating layer is missing, a better model will not save the rollout.",
        ],
      },
      {
        title: "What actually sticks",
        body: [
          "Enterprise AI becomes real when the work gets better, the boundaries are clear, and people know how to use the system with confidence.",
          "The model can win the demo. The workflow decides whether anything actually sticks.",
        ],
      },
    ],
    featured: true,
  },
  {
    slug: "product-philosophy",
    href: "/thinking/product-philosophy",
    title: "Product leadership is systems design",
    eyebrow: "Thinking",
    summary:
      "A point of view on why product leadership starts with decision systems, and how that belief became a practical operating model.",
    description:
      "An editorial case study on why the operating model is part of the product outcome.",
    cardDescription:
      "An essay on product leadership as systems design, with operating-model artifacts used as proof.",
    readTime: "7 min read",
    tags: ["Product Leadership", "Operating Model", "Systems Design"],
    keyIdeas: [
      "Product leadership is about how decisions get made, not just roadmap taste.",
      "The operating model is part of the product outcome.",
      "Making the system visible is what lets teams improve it intentionally.",
    ],
    sections: [
      {
        title: "Belief",
        body: [
          "Product leadership is not primarily about roadmap judgment. It is about designing how decisions get made, how tradeoffs are evaluated, and how work connects to outcomes.",
          "When those systems stay implicit, product quality becomes inconsistent and overly dependent on individual PM skill.",
        ],
      },
      {
        title: "Practice",
        body: [
          "I believe the operating model is part of the product outcome, so this work focused on making the system visible across lifecycle, prioritization, review cadence, sprint rhythm, and roadmapping.",
          "The goal was not more process. It was clearer, more comparable decision-making that could scale across teams.",
        ],
      },
      {
        title: "Reflection",
        body: [
          "The result was not just cleaner execution. It was better organizational judgment, with shared language for prioritization, alignment, and impact.",
          "That is the core of how I think about product leadership: make the system visible so it can be improved intentionally.",
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
