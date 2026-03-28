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
    testimonialIds: ["sumanth-cherukuri", "daniel-das"],
    featured: true,
  },
  {
    slug: "checkout-redesign",
    href: "/work/oms-transformation",
    title: "Better execution, faster checkout, measurable growth",
    eyebrow: "Selected Work",
    summary:
      "Reduced checkout time by roughly 30%, delivered in 12 weeks, and contributed to an estimated ~$16M in annualized revenue impact through a post-launch A/B test.",
    description:
      "A high-stakes checkout redesign that succeeded not just because of the experience changes, but because better product, UX, and engineering collaboration led to stronger decisions during build, a cleaner launch, and measurable lift.",
    role: "Senior Product Manager, Commerce",
    company: "The Guitar Center Company",
    timeframe: "2023",
    heroImage: "/images/checkout-redesign/checkout-after.png",
    heroImageAlt:
      "Redesigned checkout experience showing a cleaner delivery step and simplified order summary.",
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
