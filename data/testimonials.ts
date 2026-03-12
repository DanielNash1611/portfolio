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
  roleLabel: string;
  date?: string;
  short: string;
  medium: string;
  source: "LinkedIn" | "Direct";
  profileUrl?: string;
  avatarUrl?: string;
  featured?: boolean;
  narrativeTags: NarrativeId[];
  pageTargets?: TestimonialPageTarget[];
};

const linkedinRecommendationsUrl =
  "https://www.linkedin.com/in/daniel-a-nash/details/recommendations/?detailScreenTabIndex=0";

export const testimonials: Testimonial[] = [
  {
    id: "zac-bogart",
    name: "Zac Bogart",
    title:
      "C-suite leader overseeing ecommerce, digital marketing, and contact center",
    relationship:
      "C-suite partner for 2 years across contact center modernization and new brand/site work",
    roleLabel: "C-suite Partner",
    short: "“A true business partner, not just a glorified project manager.”",
    medium:
      "Zac describes Dan as the partner who drove technology and process roadmaps, connected data and analytics to the real customer and gear-advisor experience, and led meaningful change tied directly to business outcomes. He also called Dan the tip of the spear for AI adoption while making sure the broader organization came along.",
    source: "LinkedIn",
    profileUrl: linkedinRecommendationsUrl,
    featured: true,
    narrativeTags: ["senior-product-manager", "builder-pm"],
    pageTargets: ["home", "about", "contact-center", "chatgpt-org-scale"],
  },
  {
    id: "sumanth-cherukuri",
    name: "Sumanth Cherukuri",
    title: "VP of Technology and AI leader",
    relationship:
      "Former manager; partnered on roadmap, automation, ChatGPT rollout, and AI operating model work",
    roleLabel: "Former Manager",
    short:
      "“Rare combination of strategic foresight and executional excellence.”",
    medium:
      "Sumanth credits Dan with reusable GPT-powered tools, the first ChatGPT Enterprise pilot with huge ROI, the first 3-year roadmap for the Contact Center, and strong technical depth in AI and platform architecture. He also highlights Dan's ability to articulate a big-picture vision, secure executive buy-in, and scale adoption through training and super-user enablement.",
    source: "LinkedIn",
    profileUrl: linkedinRecommendationsUrl,
    featured: true,
    narrativeTags: ["builder-pm", "product-leader"],
    pageTargets: ["home", "about", "contact-center", "chatgpt-org-scale"],
  },
  {
    id: "christopher-pruneau",
    name: "Christopher Pruneau",
    title: "Senior Front-End Developer",
    relationship: "Engineering partner on ecommerce delivery",
    roleLabel: "Engineering Partner",
    date: "Aug 20, 2025",
    short:
      "Kept UX, engineering, and business aligned from definition through rollout.",
    medium:
      "Daniel kept UX, engineering, and business aligned to ship the PLP React redesign before peak season. His stories are detailed and digestible, communication top-notch, and delivery reliable. Professional, kind, and a joy to work with - one of the best PMs I have partnered with.",
    source: "LinkedIn",
    profileUrl: linkedinRecommendationsUrl,
    featured: true,
    narrativeTags: ["senior-product-manager"],
    pageTargets: ["home"],
  },
  {
    id: "daniel-das",
    name: "Daniel Das",
    title: "Senior Software Engineer",
    relationship: "Technical partner on AI platform and guardrails work",
    roleLabel: "Technical Partner",
    date: "Sep 29, 2025",
    short:
      "Turned scalable ChatGPT integrations and enterprise guardrails into clear product strategy.",
    medium:
      "Dan embodies what you hope for in a PM - visionary leadership, technical curiosity, and relentless focus on real business and user value. He turned explorations around scalable ChatGPT integrations, multi-agent architectures, and enterprise guardrails into clear product strategies that aligned teams and won executive buy-in. Under his guidance, we shipped AI solutions that raised the bar for efficiency and user experience.",
    source: "Direct",
    featured: true,
    narrativeTags: ["builder-pm", "product-leader"],
    pageTargets: ["home"],
  },
  {
    id: "david-lawrence",
    name: "David Lawrence",
    title: "Retail Executive & Operator",
    relationship: "Senior cross-functional stakeholder",
    roleLabel: "Executive Partner",
    date: "Aug 25, 2025",
    short:
      "Trusted with complex problems, fast ramps, and executive-facing roadmap work.",
    medium:
      "Daniel jumped into Contact Center with limited background and quickly mapped priorities, closed knowledge gaps, and built a comprehensive roadmap within weeks - well received by the Management Committee. He is a resourceful athlete who learns fast, executes, and raises the bar across the org.",
    source: "LinkedIn",
    profileUrl: linkedinRecommendationsUrl,
    narrativeTags: ["senior-product-manager", "product-leader"],
  },
  {
    id: "colleen-ashmore",
    name: "Colleen Ashmore",
    title: "Digital Insight Manager",
    relationship: "Data and experimentation partner",
    roleLabel: "Cross-functional Partner",
    date: "Aug 10, 2025",
    short: "Strategy, technical depth, and execution in the same package.",
    medium:
      "Daniel drove a record-fast Monetate implementation across two enterprise sites and led a custom GPT solution from hackathon prototype to business impact. He is now a thought leader in AI adoption - turning ambitious ideas into production systems that empower teams and deliver results.",
    source: "LinkedIn",
    profileUrl: linkedinRecommendationsUrl,
    narrativeTags: ["senior-product-manager", "builder-pm"],
  },
  {
    id: "matt-winick",
    name: "Matt Winick",
    title: "Product Design & User Experience",
    relationship: "Design partner on product and process improvements",
    roleLabel: "Design Partner",
    date: "Aug 25, 2025",
    short:
      "Open, collaborative, and transformative in how he improves both product and process.",
    medium:
      "Working with Daniel is one of those rare career experiences. He blends rigor and imagination, pushes the envelope, and improves both product and process. Open, collaborative, and energizing - he set a high bar while making the work deeply rewarding. Any team would be fortunate to have him.",
    source: "LinkedIn",
    profileUrl: linkedinRecommendationsUrl,
    narrativeTags: ["product-leader", "builder-pm"],
  },
];

export const featuredTestimonials = testimonials.filter(
  (testimonial) => testimonial.featured,
);
