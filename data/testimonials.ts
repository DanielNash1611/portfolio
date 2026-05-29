import type { NarrativeId } from "@/data/positioning";

export type TestimonialPageTarget =
  | "home"
  | "about"
  | "contact-center"
  | "chatgpt-org-scale";

export type Testimonial = {
  id: string;
  name: string;
  title: string;
  relationship: string;
  relationshipCapacity: string;
  roleLabel: string;
  date?: string;
  short: string;
  full: string;
  source: "LinkedIn" | "Direct";
  profileUrl?: string;
  avatarUrl?: string;
  featured?: boolean;
  narrativeTags: NarrativeId[];
  pageTargets?: TestimonialPageTarget[];
  /**
   * Project slugs (matching WorkEntry.slug) this recommendation is directly
   * relevant to, even when not rendered on that project's page. Used by the
   * chatbot to surface them as direct project evidence rather than as
   * generic broader portfolio context.
   */
  projectIds?: string[];
  /**
   * Optional short note explaining why this recommendation maps to those
   * project IDs (e.g., "tip-of-the-spear AI adoption phrasing"). Used as
   * supporting context in the chatbot prompt when present.
   */
  projectRelevance?: string;
};

const linkedinRecommendationsUrl =
  "https://www.linkedin.com/in/daniel-a-nash/details/recommendations/?detailScreenTabIndex=0";

export const testimonials: Testimonial[] = [
  {
    id: "don-worsham",
    name: "Don Worsham",
    title: "Director: Strategic Contracts, Sourcing, and Spend",
    relationship:
      "Senior cross-functional partner across more than five years of strategy, sourcing, and AI initiatives",
    relationshipCapacity:
      "Don was senior to Daniel but didn't manage Daniel directly",
    roleLabel: "Senior Partner",
    date: "May 26, 2026",
    avatarUrl: "https://unavatar.io/linkedin/worshamstrategy",
    short:
      "One of the rare few who can actually execute AI strategy — and knows the difference between a compelling demo and a deployable solution.",
    full:
      "I've worked alongside a lot of people who can talk convincingly about AI strategy. Dan Nash is one of the rare few who can actually execute it.\n\nOver more than five years working together, I watched Dan do something most product leaders can't: take genuinely messy operational problems — the kind with no clean edges, competing stakeholders, and buried technical debt — and translate them into product strategies that actually held up in a boardroom and in a sprint plan. That's a harder skill than it sounds. It requires equal fluency in business logic and engineering reality, and Dan has both.\n\nWhat set Dan apart was his ability to sit in a room with executives who wanted transformation and engineers who were trying to figure out what \"transformation\" even meant — and make both groups feel heard while moving toward something concrete. He's one of the best executive-alignment operators I've seen: not by softening edges or papering over disagreements, but by building shared clarity from the ground up.\n\nOn AI specifically, Dan has a gift that's becoming increasingly rare and valuable: he knows the difference between a compelling demo and a deployable solution. He pushed hard — sometimes against real organizational inertia — to ensure that AI initiatives had a business model behind them, not just a proof of concept. He asked the hard questions about ROI, adoption, and operational fit before they became expensive mistakes.\n\nHe also brought serious budgetary discipline to everything he touched. Dan understood that a strategy without financial architecture isn't a strategy — it's a wish list. He could build a business case, defend it under scrutiny, and manage to it.\n\nI give Dan Nash my highest recommendation without reservation. If you're looking for someone to help your organization move from AI enthusiasm to AI value, he's exactly who you want in the room.",
    source: "LinkedIn",
    profileUrl: linkedinRecommendationsUrl,
    featured: true,
    narrativeTags: ["product-leader", "builder-pm", "senior-product-manager"],
    pageTargets: ["home", "about", "chatgpt-org-scale"],
    projectIds: ["chatgpt-enterprise", "ai-platform-mcp"],
    projectRelevance:
      "Frames Daniel as someone who turns AI strategy into deployable solutions and demands ROI behind every initiative — directly reinforces the ChatGPT Enterprise operating model and the AI Platform/MCP work.",
  },
  {
    id: "zac-bogart",
    name: "Zac Bogart",
    title:
      "SVP of Digital, Digital Marketing Leader, Strategist, & Executionist",
    relationship:
      "C-suite partner for 2 years across contact center modernization and new brand/site work",
    relationshipCapacity:
      "Zac was senior to Daniel but didn't manage Daniel directly",
    roleLabel: "C-suite Partner",
    date: "March 4, 2026",
    avatarUrl: "https://unavatar.io/linkedin/zacbogart",
    short:
      "At the tip-of-the-spear of AI adoption — and made sure the whole company was right there with him.",
    full:
      "I was lucky to get to work with Dan for 2 years - we partnered to build out a brand on site new contact center, while modernizing our legacy remote contact center team. Dan was instrumental in driving our technology & process roadmaps. Dan really grasps the full scope of product management - he was a true business partner - not just a glorified project manager. He connected all the dots from our data & analytics to the real user experience of our customers and gear advisors to drive meaningful change that led directly to business outcomes. Through Dan's diligent leadership we were able to dramatically reduce turnover by empowering our gear advisors with the right tools & processes, while driving efficiency and revenue. Dan is at the tip-of-the-spear of AI adoption and he made sure everyone around him, and our entire company was right there with him!",
    source: "LinkedIn",
    profileUrl: linkedinRecommendationsUrl,
    featured: true,
    narrativeTags: ["product-leader", "senior-product-manager", "builder-pm"],
    pageTargets: ["home", "about", "contact-center", "chatgpt-org-scale"],
    projectIds: ["chatgpt-enterprise"],
    projectRelevance:
      "C-suite partner during the contact center modernization and tip-of-the-spear AI adoption that the ChatGPT Enterprise case study covers.",
  },
  {
    id: "sumanth-cherukuri",
    name: "Sumanth Cherukuri",
    title: "AI Transformation | Digital Transformation | AI Innovation & Enablement",
    relationship:
      "Former manager; partnered on roadmap, automation, ChatGPT rollout, and AI operating model work",
    relationshipCapacity: "Sumanth managed Daniel directly",
    roleLabel: "Former Manager",
    date: "December 29, 2025",
    avatarUrl: "https://unavatar.io/linkedin/sumanth-ai",
    short:
      "Built reusable GPT-powered tools, launched the first ChatGPT Enterprise pilot, and delivered huge ROI.",
    full:
      "I have had the pleasure of managing Dan, and he is, without a doubt, one of the most transformative product leaders I have worked with. Dan possesses a rare combination of strategic foresight and executional excellence, consistently tackling product challenges with ease and positivity.\n\nDan developed a suite of reusable GPT-powered tools that delivered large productivity improvements. His leadership in launching the first ChatGPT Enterprise pilot was a massive success, delivering huge ROI. Dan also led the adoption of AI with creating training videos and leading the super user group.\n\nBeyond his technical prowess in AI and platform architecture, Dan is a master of operational efficiency. He developed our first 3-year roadmap for the Contact Center and successfully reduced our system footprint and automated critical processes that saved over thousands of hours annually.\n\nDan has a unique ability to articulate big-picture vision while securing the executive buy-in necessary to deliver tangible business impact.\n\nAny organization looking for a world-class product leader to drive their AI or platform strategy would be lucky to have him.",
    source: "LinkedIn",
    profileUrl: linkedinRecommendationsUrl,
    featured: true,
    narrativeTags: ["product-leader", "builder-pm"],
    pageTargets: ["home", "about", "contact-center", "chatgpt-org-scale"],
    projectIds: ["chatgpt-enterprise", "ai-platform-mcp"],
    projectRelevance:
      "As Daniel's direct manager, Sumanth specifically calls out reusable GPT tooling, the first ChatGPT Enterprise pilot, and the 3-year Contact Center roadmap behind both projects.",
  },
  {
    id: "daniel-das",
    name: "Daniel Kingston Thiruthuva Das",
    title: "Senior Software Engineer @ The Guitar Center Company",
    relationship: "Engineering partner on AI platform, ChatGPT integrations, and guardrails",
    relationshipCapacity: "Daniel Kingston worked with Daniel on the same team",
    roleLabel: "Engineering Partner",
    date: "September 29, 2025",
    avatarUrl: "https://unavatar.io/linkedin/danielkingston365",
    short:
      "Shaped scalable ChatGPT integrations, multi-agent architectures, and enterprise guardrails into clear product strategies.",
    full:
      "Working with Dan has been one of the most rewarding professional experiences of my career and he's hands down one of the best product managers I've partnered with. Dan embodies everything you'd hope for in a PM—visionary leadership, technical curiosity, and a relentless focus on delivering real value for both the business and end users.\n\nWhat impressed me most was Dan's ability to take highly complex technical explorations—like scalable ChatGPT integrations, multi-agent architectures, and enterprise guardrails—and shape them into clear, actionable product strategies. He asked the right questions, balanced feasibility with ambition, and kept our teams aligned on measurable outcomes.\n\nDaniel was also the glue that brought cross-functional teams together. Whether we were working with engineering, infrastructure, or security, he created an environment where bold ideas could flourish, while providing the clarity and prioritization needed to actually deliver.\n\nHis leadership was instrumental in securing executive buy-in, as he could articulate both the big-picture vision and the tangible business impact. Because of Daniel's guidance, we were able to launch AI-driven solutions that not only improved efficiency but also set a new bar for user experience. He combines strategic foresight with executional excellence in a way that is rare to find.\n\nIn short, Daniel Nash is a world-class product manager and collaborator. Any organization would be lucky to have him leading their AI product strategy.",
    source: "LinkedIn",
    profileUrl: linkedinRecommendationsUrl,
    featured: true,
    narrativeTags: ["builder-pm", "product-leader"],
    pageTargets: ["home", "about", "chatgpt-org-scale"],
    projectIds: ["ai-platform-mcp", "chatgpt-enterprise"],
    projectRelevance:
      "Engineering partner who calls out scalable ChatGPT integrations, multi-agent architectures, and enterprise guardrails — directly the AI Platform/MCP and ChatGPT Enterprise surface area.",
  },
  {
    id: "scott-tesar",
    name: "Scott Tesar",
    title:
      "Strategic Business Partner | Financial/Sales Manager | BizOps improvement | MBA/CPA (inactive)",
    relationship:
      "Cross-functional teammate during a period of business transformation and enterprise AI adoption",
    relationshipCapacity: "Scott worked with Daniel on the same team",
    roleLabel: "Cross-functional Partner",
    date: "April 10, 2026",
    avatarUrl: "https://unavatar.io/linkedin/scotttesar",
    short:
      "Spearheaded enterprise AI adoption and shortened development cycles by giving teams the AI tools and platforms they needed.",
    full:
      "It is with great respect that I would like to recommend Dan's technical chops, extremely strong work ethic and willingness to go above and beyond to achieve business excellence.\n\nWe worked together during a time of transformation and Dan unfailingly worked tirelessly and with a great attitude to address systemic and procedural changes that were underway under tight deadlines and significant business pressures.\n\nDan impressed everyone on the team with the depth of his technical knowledge and active responsiveness, but more importantly, did it with a great attitude and sense of humor and was a great teammate.\n\nDan went on the spearhead Guitar Center Enterprise AI adoption and provided numerous insights that helped accelerate the business' adoption of AI technologies and agents, and we significantly shortened our development cycles and numerous teams were able to harness the power of AI-tools and platforms to provide internal insights and customer-facing applications that significantly improved Guitar Center's resources and capabilities.\n\nDan is a \"keeper\" and I highly recommend Dan as a leader, mentor, team-member and asset to any organization that is fortunate to engage his talent, aptitude and most importantly, GREAT ATTITUDE...\n\nScott Tesar, MBA/CPA (inactive)",
    source: "Direct",
    featured: true,
    narrativeTags: ["product-leader", "builder-pm"],
    pageTargets: ["about", "chatgpt-org-scale"],
    projectIds: ["chatgpt-enterprise"],
    projectRelevance:
      "Names spearheading enterprise AI adoption and shortening development cycles via AI tools — directly the ChatGPT Enterprise operating-model story.",
  },
  {
    id: "domnic-nadar",
    name: "Domnic Nadar",
    title: "Software Engineering Manager - OMS at Guitar Center, Inc",
    relationship:
      "Engineering leadership partner on OMS roadmap, prioritization, and an OMS MCP server for ChatGPT",
    relationshipCapacity: "Domnic worked with Daniel but on different teams",
    roleLabel: "Engineering Leader",
    date: "April 10, 2026",
    avatarUrl: "https://unavatar.io/linkedin/domnic-nadar-7754a84a",
    short:
      "Partnered on AI initiatives including an OMS MCP server connector for ChatGPT — forward-thinking and willing to ship the new.",
    full:
      "I had the pleasure of working closely with Daniel Nash during his time as a Product Manager, where he played a key role in shaping our OMS roadmap, execution strategy, and prioritization.\n\nDaniel brings a strong balance of strategic thinking and practical execution. He was instrumental in driving several revenue-generating initiatives and consistently ensured alignment between business goals and product delivery. His ability to translate complex requirements into clear, actionable plans made a significant impact on our team's efficiency and outcomes.\n\nIn addition to his core product work, Daniel partnered with us on AI initiatives, including the development of an OMS MCP server that serves as a connector for ChatGPT. His forward-thinking approach and curiosity for emerging technologies helped us explore and implement meaningful innovation.\n\nBeyond his technical and product expertise, Daniel is a calm and composed leader with a great sense of humor. He navigates challenges with ease, resolves conflicts effectively, and fosters a collaborative team environment.\n\nDaniel is a valuable asset to any organization, and I highly recommend him for any role that requires strong product leadership and innovative thinking.",
    source: "Direct",
    featured: true,
    narrativeTags: ["builder-pm", "senior-product-manager"],
    pageTargets: ["about"],
    projectIds: ["ai-platform-mcp", "oms-chatgpt-app"],
    projectRelevance:
      "Explicitly references the OMS MCP server connector for ChatGPT — directly the AI Platform/MCP work and the OMS ChatGPT App.",
  },
  {
    id: "sean-richardson",
    name: "Sean Richardson",
    title: "Information Security Leader",
    relationship:
      "Security partner during the early enterprise AI journey at Guitar Center",
    relationshipCapacity: "Sean worked with Daniel but on different teams",
    roleLabel: "Security Partner",
    date: "November 17, 2025",
    avatarUrl: "https://unavatar.io/linkedin/infosecsean",
    short:
      "At the forefront of our AI journey — crafted processes that enabled business efficiency while keeping data protected.",
    full:
      "Daniel has been a tremendous partner across the many different initiatives we've worked together on. He's an insightful and collaborative problem solver that is hungry to take on new challenges.\n\nMost recently, I worked with Daniel as we began our journey in leveraging AI. Daniel was at the forefront of those efforts, and we were able to work together to craft processes that enabled business efficiency while helping to keep our data protected.",
    source: "LinkedIn",
    profileUrl: linkedinRecommendationsUrl,
    narrativeTags: ["builder-pm", "product-leader"],
    pageTargets: ["about", "chatgpt-org-scale"],
  },
  {
    id: "ian-booth",
    name: "Ian Booth",
    title: "Sr. Product Manager @ Guitar Center",
    relationship: "Fellow product manager on the same team",
    relationshipCapacity: "Ian worked with Daniel on the same team",
    roleLabel: "Product Peer",
    date: "November 16, 2025",
    avatarUrl: "https://unavatar.io/linkedin/ian-booth-01296a69",
    short:
      "The level of trust the company places in him to take on the biggest and most complex problems says it all.",
    full:
      "I love working with Dan. He is an open, transparent, and collaborative colleague who brings a strong product lens, a deep understanding of modern product management, and a consistent work ethic to everything he does.\n\nHis impact is clear in the level of trust the company places in him to take on the biggest and most complex problems. Dan is someone you want on your team.",
    source: "LinkedIn",
    profileUrl: linkedinRecommendationsUrl,
    narrativeTags: ["senior-product-manager", "product-leader"],
    pageTargets: ["about"],
  },
  {
    id: "matt-winick",
    name: "Matt Winick",
    title:
      "Senior UX/Product Designer ▪︎ Design Systems ▪︎ eCommerce ▪︎ Research-Driven Product Strategy",
    relationship:
      "Design partner across large redesigns including the ecommerce checkout overhaul",
    relationshipCapacity: "Matt worked with Daniel on the same team",
    roleLabel: "Design Partner",
    date: "August 25, 2025",
    avatarUrl: "https://unavatar.io/linkedin/mattwinick",
    short:
      "Transformative thinker who improves both the product and the process behind it.",
    full:
      "Working with Daniel is one of those rare career experiences that only comes along a handful of times, if you're lucky. Even from my earliest, more casual interactions with him, it was clear he was a transformative thinker, someone who approaches challenges with both rigor and imagination.\n\nWhen I had the privilege of collaborating with him directly on several large redesign projects for GuitarCenter.com, including a complete overhaul of the ecommerce checkout flow, I saw the full impact of his working style. Daniel brought an extraordinary level of organization, sharp eye for detail, and strategic thinking to the table. He pushed the envelope in the best ways, always looking for opportunities to improve not just the product, but the process behind it.\n\nWhat stood out most was his openness and spirit of collaboration. He never guarded ideas, but instead invited discussion, exploration, and iteration. That quality not only made our work stronger, it also made me a better designer. Daniel set a high bar while also making the work fun, energizing, and deeply rewarding.\n\nSimply put, Daniel is the kind of teammate who elevates everyone around him. Any team would be fortunate to have him, and I'm grateful for the chance to have worked alongside him.",
    source: "LinkedIn",
    profileUrl: linkedinRecommendationsUrl,
    narrativeTags: ["senior-product-manager", "product-leader"],
    pageTargets: ["about"],
  },
  {
    id: "david-lawrence",
    name: "David Lawrence",
    title:
      "Resourceful omnichannel retailer who leads teams of 4 to 400 to drive growth and profitability",
    relationship:
      "Senior cross-functional stakeholder during the Contact Center ramp",
    relationshipCapacity:
      "David was senior to Daniel but didn't manage Daniel directly",
    roleLabel: "Executive Partner",
    date: "August 24, 2025",
    avatarUrl: "https://unavatar.io/linkedin/david-b-lawrence",
    short:
      "Built a comprehensive Contact Center tech roadmap in weeks and set the standard for other PMs in the org.",
    full:
      "In a nutshell, Daniel is curious and versatile. These traits make him extremely valuable in a product manager role and a key asset to any organization looking for \"athletes\" that are driven by supporting the business in the most critical way at the time.\n\nDespite having limited background in Contact Centers, Daniel jumped into a new role in a new organization as Product Manager for Guitar Center's Contact Center. His tenacity and speed in digging into the various systems was amazing - he came to me early on with his points of view on our priorities and quickly reacted to feedback. He identified gaps in our team's understanding and usage of our key systems and sought out internal expertise where available and researched externally when necessary.\n\nMost impressively, he built a comprehensive roadmap for the Contact Center tech stack within weeks of jumping into the new role and presented it to the Management Committee where it was very well received, and set the standard for other PM's in the organization.\n\nOn top of that, Daniel is a fascinating and engaging co-worker and an all-around great person. I would jump at the chance to work with him again.",
    source: "LinkedIn",
    profileUrl: linkedinRecommendationsUrl,
    narrativeTags: ["product-leader", "senior-product-manager"],
    pageTargets: ["about", "contact-center"],
    projectIds: ["chatgpt-enterprise"],
    projectRelevance:
      "Senior executive who watched Daniel build the first 3-year Contact Center roadmap that anchors the ChatGPT Enterprise case study.",
  },
  {
    id: "christopher-pruneau",
    name: "Christopher Pruneau",
    title:
      "Senior Software Engineer at Guitar Center | Next.js, React, TypeScript | Analytics & MarTech Specialist",
    relationship: "Engineering partner on ecommerce delivery, including the PLP React redesign",
    relationshipCapacity: "Christopher worked with Daniel on the same team",
    roleLabel: "Engineering Partner",
    date: "August 20, 2025",
    avatarUrl: "https://unavatar.io/linkedin/cpruneau",
    short:
      "Kept UX, engineering, and business aligned through a massive React redesign — shipped before peak holiday.",
    full:
      "During the Guitar Center product listing page React redesign, Daniel demonstrated outstanding project management skills by keeping UX designers, engineers, and business stakeholders synchronized throughout the entire development cycle. He was a huge reason this massive project was successfully deployed in time before peak holiday season.\n\nOn top of that, I have gotten the chance to work with Daniel on many other projects, and I can say without a doubt, he makes the lives of engineers way easier from start to roll out. His communication skills are top notch. Every JIRA Story or Task he creates is always very detailed and broken down in an easy digestible fashion.\n\nIf anyone is looking for a Product Manager, or leader in general, look no further. He is professional, kind, and a wonderful person.",
    source: "LinkedIn",
    profileUrl: linkedinRecommendationsUrl,
    narrativeTags: ["senior-product-manager"],
    pageTargets: ["about"],
  },
  {
    id: "colleen-ashmore",
    name: "Colleen Ashmore",
    title: "Digital Insight Manager at Guitar Center",
    relationship: "Data and experimentation partner on Monetate and the hackathon-winning GPT solution",
    relationshipCapacity: "Colleen worked with Daniel but on different teams",
    roleLabel: "Cross-functional Partner",
    date: "August 10, 2025",
    avatarUrl: "https://unavatar.io/linkedin/marketmecolleen",
    short:
      "Took a custom GPT solution from hackathon prototype to active business tool, then became Guitar Center's AI thought leader.",
    full:
      "It's rare to come across someone who blends strategic vision, deep technical expertise, and flawless execution like Daniel Nash.\n\nDaniel played an instrumental role in one of the most ambitious technical rollouts I've ever been a part of: implementing Monetate across two of our enterprise websites. Together, we completed the full implementation within three months—a feat that Monetate themselves described as the fastest implementation they had ever seen. This wasn't just about speed; it was about doing it right: every stakeholder informed, every system accounted for, and every step executed with precision.\n\nThanks to his persistence, creativity, and technical depth, he drove our team to win the company-wide Hackathon—a major achievement made possible by his commitment to building a custom GPT-based solution that addressed real business pain points. What began as a prototype is now a celebrated and active part of the business, driving productivity and empowering teams across the organization. Daniel's ability to turn an ambitious idea into a business-ready product is the definition of innovation in action. Now he is a thought leader at Guitar Center driving the usage of AI models to better the business.\n\nDaniel doesn't just manage projects—he elevates them. His ability to move effortlessly between high-level strategy and deep technical detail makes him a force multiplier on any team.",
    source: "LinkedIn",
    profileUrl: linkedinRecommendationsUrl,
    narrativeTags: ["builder-pm", "senior-product-manager"],
    pageTargets: ["about", "chatgpt-org-scale"],
    projectIds: ["chatgpt-enterprise", "ai-platform-mcp"],
    projectRelevance:
      "Calls out moving a hackathon GPT prototype into an active business tool and Daniel's AI thought leadership — directly the ChatGPT Enterprise rollout and the AI Platform/MCP work.",
  },
  {
    id: "colin-greene",
    name: "Colin Greene",
    title:
      "Senior Technical Product Manager | SPOC | Team Leader | Strategy & Roadmapping | eCommerce | Fluent Japanese",
    relationship: "Product peer in the same group at Guitar Center",
    relationshipCapacity: "Colin worked with Daniel on the same team",
    roleLabel: "Product Peer",
    date: "August 7, 2025",
    avatarUrl: "https://unavatar.io/linkedin/colin-greene",
    short:
      "One of the most singularly impressive Product Managers I've worked with — at the tip of the spear on AI tools and methodology.",
    full:
      "I had the pleasure of working with Dan in the same Product group at the Guitar Center company. In addition to being excellent in all typical functions expected of a Product Manager, Dan was always incredibly keen on learning. He was always taking a course, reading the latest books on agile methodology, or researching AI tools and how to effectively manage them.\n\nIn addition, he was a pivotal resource for the team in configuring the various tools we used, was the primary teacher for the team in new tools like Atlassian's Jira Product Discovery tool as well as numerous other applications and tools the team eventually chose to use as standard across all members.\n\nBeyond all this, Dan is an amazing person to collaborate with on projects, incredibly proactive in offering assistance, and a fantastic person to help with everything from ideation to strategic roadmapping.\n\nBeyond even these things, Dan set the standard for establishing best practices in setting up regular stakeholder collaboration and feedback practices later adopted by the entire department.\n\nIn short, Dan is one of the most singularly impressive Product Managers I've ever had the pleasure of working with, and I would give him my highest recommendation to anyone looking for an amazing expert in all things Product Management.",
    source: "LinkedIn",
    profileUrl: linkedinRecommendationsUrl,
    narrativeTags: ["product-leader", "senior-product-manager"],
    pageTargets: ["about"],
  },
  {
    id: "cassie-dean",
    name: "Cassie Dean",
    title: "Director of Sales at Guitar Center",
    relationship:
      "Sales leadership partner during Daniel's Product Manager tenure",
    relationshipCapacity:
      "Cassie was senior to Daniel but didn't manage Daniel directly",
    roleLabel: "Senior Partner",
    date: "April 8, 2026",
    avatarUrl: "https://unavatar.io/linkedin/cassie-dean-4abb0933",
    short:
      "A strong operator who leads, collaborates, and elevates the people around him.",
    full:
      "I had the pleasure of working with Daniel during his time as a Product Manager, and I can confidently say he made a lasting impact on our team.\n\nDaniel excelled at leading calls and keeping everyone aligned, even in fast-paced or complex situations. He has a natural ability to bring clarity and structure to discussions, ensuring that projects stayed on track and everyone felt informed and engaged.\n\nBeyond his operational strengths, Daniel brought a great energy to the team. He's fun, witty, and someone people genuinely enjoy working with. Just as importantly, he's incredibly reliable. When Daniel is involved, you know things will get done and done well.\n\nI highly recommend Daniel to any team looking for a strong operator who can lead, collaborate, and elevate the people around him.",
    source: "Direct",
    narrativeTags: ["senior-product-manager", "product-leader"],
    pageTargets: ["about"],
  },
  {
    id: "derek-peterson",
    name: "Derek Peterson",
    title: "VP of Demand Generation",
    relationship:
      "Long-time collaborator across composition, recording, marketing, and web projects",
    relationshipCapacity: "Derek and Daniel studied together",
    roleLabel: "Long-term Collaborator",
    date: "February 7, 2020",
    avatarUrl: "https://unavatar.io/linkedin/derek-peterson-164733106",
    short:
      "Brings innovative perspectives and astounding creativity, then moves forward with focus and determination.",
    full:
      "I worked on several projects with Daniel in varying capacities, ranging from musical composition, recording, and performance to marketing and website design. Daniel brings his ability to view problems through innovative perspectives and astounding creativity to every project he works on. You can expect Daniel to challenge conventional thinking and then move forward with focus and determination.",
    source: "LinkedIn",
    profileUrl: linkedinRecommendationsUrl,
    narrativeTags: ["builder-pm"],
    pageTargets: ["about"],
  },
];

export const featuredTestimonials = testimonials.filter(
  (testimonial) => testimonial.featured,
);

export function getTestimonialById(id: string): Testimonial | undefined {
  return testimonials.find((testimonial) => testimonial.id === id);
}

export function getTestimonialsByIds(ids: string[]): Testimonial[] {
  return ids
    .map((id) => getTestimonialById(id))
    .filter((testimonial): testimonial is Testimonial => Boolean(testimonial));
}

export function getTestimonialsForPageTarget(
  target: TestimonialPageTarget,
): Testimonial[] {
  return testimonials.filter((testimonial) =>
    testimonial.pageTargets?.includes(target),
  );
}
