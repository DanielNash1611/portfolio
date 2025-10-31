import clsx from "clsx";
import TestimonialCard from "@/components/TestimonialCard";
import type { Testimonial } from "@/data/testimonials";

type TestimonialsProps = {
  items: Testimonial[];
  compact?: boolean;
  max?: number;
  className?: string;
};

const Testimonials = ({
  items,
  compact = false,
  max,
  className
}: TestimonialsProps): JSX.Element => {
  const limit = max ?? (compact ? 3 : items.length);
  const displayItems = items.slice(0, limit);

  return (
    <div
      className={clsx(
        "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3",
        className
      )}
    >
      {displayItems.map((item) => (
        <TestimonialCard
          key={`${item.name}-${item.date}`}
          item={item}
          variant={compact ? "compact" : "default"}
        />
      ))}
    </div>
  );
};

export default Testimonials;
