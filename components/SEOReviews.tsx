import { siteConfig } from "@/content/portfolio";
import { testimonials } from "@/data/testimonials";

const itemReviewed = {
  "@type": "Person",
  "@id": "https://www.danielnash.co/#person",
  name: siteConfig.name,
  jobTitle: siteConfig.title,
  url: "https://www.danielnash.co",
};

const personSchema = {
  ...itemReviewed,
  jobTitle: "Senior AI Product Manager / AI Product Leader",
  sameAs: [siteConfig.linkedinUrl, siteConfig.githubUrl],
  knowsAbout: [
    "AI product management",
    "AI product strategy",
    "Enterprise AI adoption",
    "Product leadership",
    "Workflow automation",
    "0-to-1 product development",
  ],
};

const resumeGeneratorSchema = {
  "@type": "WebApplication",
  "@id": "https://www.danielnash.co/resume/generate#webapplication",
  name: "Daniel Nash Role-Specific Resume Generator",
  url: "https://www.danielnash.co/resume/generate",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Recruiter-facing tool for generating a role-specific PDF resume from a pasted job description.",
  creator: {
    "@id": "https://www.danielnash.co/#person",
  },
};

const reviews = testimonials.map((testimonial) => ({
  "@type": "Review",
  name: testimonial.short,
  reviewBody: testimonial.full,
  author: {
    "@type": "Person",
    name: testimonial.name,
    jobTitle: testimonial.title,
  },
  ...(testimonial.date ? { datePublished: testimonial.date } : {}),
  publisher: {
    "@type": "Organization",
    name:
      testimonial.source === "LinkedIn"
        ? "LinkedIn"
        : "Personal site (direct testimonial)",
  },
  itemReviewed,
}));

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [personSchema, resumeGeneratorSchema, ...reviews],
};

export default function SEOReviews(): JSX.Element {
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
