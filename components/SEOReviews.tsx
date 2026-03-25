import { getRenderableTestimonials, siteConfig } from "@/content/portfolio";

const itemReviewed = {
  "@type": "Person",
  name: siteConfig.name,
  jobTitle: siteConfig.title,
  url: "https://danielnash.com",
};

const reviews = getRenderableTestimonials().map((testimonial) => ({
  "@type": "Review",
  name: testimonial.quote,
  reviewBody: testimonial.context ?? testimonial.quote,
  author: {
    "@type": "Person",
    name: testimonial.name,
    jobTitle: testimonial.title,
  },
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
  "@graph": reviews,
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
