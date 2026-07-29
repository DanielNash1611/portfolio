import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/site/SectionHeader";
import TestimonialCard from "@/components/TestimonialCard";
import type { Testimonial } from "@/data/testimonials";

type FooterLink = {
  href: string;
  label: string;
};

type TestimonialsSectionProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  testimonials: Testimonial[];
  id?: string;
  footerLink?: FooterLink;
};

export default function TestimonialsSection({
  eyebrow,
  title,
  description,
  testimonials,
  id,
  footerLink,
}: TestimonialsSectionProps): JSX.Element | null {
  if (!testimonials.length) {
    return null;
  }

  return (
    <section id={id} className="space-y-8 scroll-mt-24">
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
      />
      <div className="grid gap-x-8 gap-y-6 lg:grid-cols-2">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} item={testimonial} />
        ))}
      </div>
      {footerLink ? (
        <div className="flex justify-end pt-2">
          <Link
            href={footerLink.href}
            className="inline-flex items-center gap-2 border-b border-[color:var(--color-teal)] pb-1 text-sm font-bold text-[color:var(--color-teal)] transition hover:border-[color:var(--color-orange)] hover:text-[color:var(--color-orange)]"
          >
            {footerLink.label}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      ) : null}
    </section>
  );
}
