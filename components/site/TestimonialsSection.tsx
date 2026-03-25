import SectionHeader from "@/components/site/SectionHeader";
import TestimonialCard from "@/components/site/TestimonialCard";
import type { TestimonialEntry } from "@/content/portfolio";

type TestimonialsSectionProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  testimonials: TestimonialEntry[];
};

export default function TestimonialsSection({
  eyebrow,
  title,
  description,
  testimonials,
}: TestimonialsSectionProps): JSX.Element | null {
  if (!testimonials.length) {
    return null;
  }

  return (
    <section className="space-y-8">
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
      />
      <div className="grid gap-5 lg:grid-cols-2">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </div>
    </section>
  );
}
