export type Testimonial = {
  name: string;
  title: string;
  relationship: string;
  date: string;
  short: string;
  medium: string;
  source: "LinkedIn" | "Direct";
  profileUrl?: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Matt Winick",
    title: "Product Design & User Experience",
    relationship: "Worked on same team",
    date: "Aug 25, 2025",
    short: "A transformative thinker who elevates everyone around him.",
    medium:
      "Working with Daniel is one of those rare career experiences. He blends rigor and imagination, pushes the envelope, and improves both product and process. Open, collaborative, and energizing—he set a high bar while making the work deeply rewarding. Any team would be fortunate to have him.",
    source: "LinkedIn",
    profileUrl:
      "https://www.linkedin.com/in/daniel-a-nash/details/recommendations/?detailScreenTabIndex=0"
  },
  {
    name: "David Lawrence",
    title: "Retail Executive & Operator",
    relationship: "Senior to Daniel (not direct manager)",
    date: "Aug 25, 2025",
    short: "Curious, versatile, fast—sets the PM standard.",
    medium:
      "Daniel jumped into Contact Center with limited background and quickly mapped priorities, closed knowledge gaps, and built a comprehensive roadmap within weeks—well received by the Management Committee. He’s a resourceful ‘athlete’ who learns fast, executes, and raises the bar across the org.",
    source: "LinkedIn",
    profileUrl:
      "https://www.linkedin.com/in/daniel-a-nash/details/recommendations/?detailScreenTabIndex=0"
  },
  {
    name: "Christopher Pruneau",
    title: "Senior Front-End Developer",
    relationship: "Worked on same team",
    date: "Aug 20, 2025",
    short: "Makes engineers’ lives easier from start to rollout.",
    medium:
      "Daniel kept UX, engineering, and business aligned to ship the PLP React redesign before peak season. His stories are detailed and digestible, communication top-notch, and delivery reliable. Professional, kind, and a joy to work with—one of the best PMs I’ve partnered with.",
    source: "LinkedIn",
    profileUrl:
      "https://www.linkedin.com/in/daniel-a-nash/details/recommendations/?detailScreenTabIndex=0"
  },
  {
    name: "Colleen Ashmore",
    title: "Digital Insight Manager",
    relationship: "Cross-functional partner",
    date: "Aug 10, 2025",
    short: "Strategy + technical depth + flawless execution.",
    medium:
      "Daniel drove a record-fast Monetate implementation across two enterprise sites and led a custom GPT solution from hackathon prototype to business impact. He’s now a thought leader in AI adoption—turning ambitious ideas into production systems that empower teams and deliver results.",
    source: "LinkedIn",
    profileUrl:
      "https://www.linkedin.com/in/daniel-a-nash/details/recommendations/?detailScreenTabIndex=0"
  },
  {
    name: "Derek Peterson",
    title: "VP of Demand Generation",
    relationship: "Studied/worked together",
    date: "Feb 8, 2020",
    short: "Challenges convention, then delivers with focus.",
    medium:
      "From composition and recording to marketing and web design, Daniel brings inventive perspective and determination. Expect him to rethink the problem, align stakeholders, and move forward with crisp execution.",
    source: "LinkedIn",
    profileUrl:
      "https://www.linkedin.com/in/daniel-a-nash/details/recommendations/?detailScreenTabIndex=0"
  },
  {
    name: "Daniel Das",
    title: "Senior Software Engineer",
    relationship: "Worked on same team",
    date: "Sep 29, 2025",
    short: "World-class product manager and collaborator.",
    medium:
      "Dan embodies what you hope for in a PM—visionary leadership, technical curiosity, and relentless focus on real business/user value. He turned complex explorations—scalable ChatGPT integrations, multi-agent architectures, enterprise guardrails—into clear product strategies that aligned teams and won executive buy-in. Under his guidance, we shipped AI solutions that raised the bar for efficiency and user experience.",
    source: "Direct"
  }
];
