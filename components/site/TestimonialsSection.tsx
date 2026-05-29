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
      <div className="grid gap-5 lg:grid-cols-2">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} item={testimonial} />
        ))}
      </div>
      {footerLink ? (
        <div className="flex justify-center pt-2">
          <Link
            href={footerLink.href}
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-teal)]/20 bg-white/82 px-5 py-2.5 text-sm font-semibold text-[color:var(--color-teal)] shadow-sm transition hover:border-[color:var(--color-teal)]/40 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            {footerLink.label}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      ) : null}
    </section>
  );
}
