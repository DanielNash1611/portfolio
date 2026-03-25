import { Quote } from "lucide-react";
import type { TestimonialEntry } from "@/content/portfolio";

type TestimonialCardProps = {
  testimonial: TestimonialEntry;
};

export default function TestimonialCard({
  testimonial,
}: TestimonialCardProps): JSX.Element {
  return (
    <figure className="flex h-full flex-col rounded-[1.75rem] border border-black/6 bg-white/88 p-5 shadow-[0_20px_50px_rgba(58,61,64,0.08)] md:p-7">
      <div className="flex items-center justify-between gap-3">
        <Quote
          className="h-5 w-5 text-[color:var(--color-orange)]"
          aria-hidden="true"
        />
        <span className="whitespace-nowrap rounded-full border border-[color:var(--color-teal)]/10 bg-[color:var(--color-background)]/88 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-teal)]/72">
          {testimonial.source}
        </span>
      </div>
      <blockquote className="clamp-4 mt-5 text-pretty text-lg leading-8 text-[color:var(--color-slate)] md:text-xl">
        <span aria-hidden="true">&ldquo;</span>
        {testimonial.quote}
        <span aria-hidden="true">&rdquo;</span>
      </blockquote>
      {testimonial.context ? (
        <p className="clamp-3 mt-5 rounded-[1.1rem] bg-[color:var(--color-background)]/84 px-4 py-3 text-sm leading-6 text-[color:var(--color-slate)]/68">
          {testimonial.context}
        </p>
      ) : null}
      <figcaption className="mt-auto border-t border-black/6 pt-5">
        <p className="font-semibold text-[color:var(--color-slate)]">
          {testimonial.name}
        </p>
        <p className="text-safe mt-1 clamp-2 min-h-[2.6rem] text-sm text-[color:var(--color-slate)]/74">
          {testimonial.title}
        </p>
        <p className="text-safe clamp-2 text-sm text-[color:var(--color-teal)]/76">
          {testimonial.company}
        </p>
      </figcaption>
    </figure>
  );
}
