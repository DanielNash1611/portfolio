import { testimonials } from "@/data/testimonials";

const itemReviewed = {
  "@type": "Person",
  name: "Daniel Nash",
  jobTitle: "Senior AI Product Manager & Composer",
  url: "https://danielnash.com"
};

const toIsoDate = (date: string): string => {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }
  return parsed.toISOString().split("T")[0];
};

const reviews = testimonials.map((testimonial) => {
  const avatar =
    testimonial.avatarUrl ??
    (testimonial.profileUrl && testimonial.profileUrl.includes("linkedin")
      ? `https://unavatar.io/${encodeURIComponent(testimonial.profileUrl)}`
      : undefined);

  return {
    "@type": "Review",
    name: testimonial.short,
    reviewBody: testimonial.medium,
    datePublished: toIsoDate(testimonial.date),
    author: {
      "@type": "Person",
      name: testimonial.name,
      jobTitle: testimonial.title,
      ...(testimonial.profileUrl ? { sameAs: [testimonial.profileUrl] } : {})
    },
    publisher: {
      "@type": "Organization",
      name:
        testimonial.source === "LinkedIn"
          ? "LinkedIn"
          : "Personal site (direct testimonial)"
    },
    itemReviewed,
    ...(avatar ? { image: avatar } : {})
  };
});

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": reviews
};

const SEOReviews = (): JSX.Element => {
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default SEOReviews;
