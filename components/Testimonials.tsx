"use client";

import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import TestimonialCard from "@/components/TestimonialCard";
import type { Testimonial } from "@/data/testimonials";

type TestimonialsProps = {
  items: Testimonial[];
  max?: number;
  className?: string;
};

const Testimonials = ({ items, max, className }: TestimonialsProps): JSX.Element => {
  const displayItems = useMemo(
    () => items.slice(0, max ?? items.length),
    [items, max]
  );
  const total = displayItems.length;
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(1);
  const sliderId = useId();

  const updateCurrentIndex = useCallback(() => {
    const el = containerRef.current;
    if (!el || el.children.length === 0) {
      setCurrentIndex(1);
      return;
    }

    const center = el.scrollLeft + el.clientWidth / 2;
    let closest = 0;
    let minDistance = Number.POSITIVE_INFINITY;

    Array.from(el.children).forEach((child, index) => {
      const element = child as HTMLElement;
      const childCenter = element.offsetLeft + element.offsetWidth / 2;
      const distance = Math.abs(center - childCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closest = index;
      }
    });

    setCurrentIndex(closest + 1);
  }, []);

  useEffect(() => {
    updateCurrentIndex();
  }, [displayItems.length, updateCurrentIndex]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const handleScroll = () => updateCurrentIndex();
    const handleResize = () => updateCurrentIndex();

    el.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    updateCurrentIndex();

    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [updateCurrentIndex, displayItems.length]);

  const scrollByPage = (direction: number) => () => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollBy({
      left: el.clientWidth * 0.9 * direction,
      behavior: "smooth"
    });
  };

  const disablePrev = currentIndex <= 1;
  const disableNext = currentIndex >= total;

  return (
    <div className={clsx("relative", className)}>
      <div className="sr-only" aria-live="polite">
        {`Showing testimonial ${currentIndex} of ${total}`}
      </div>
      <div
        id={sliderId}
        ref={containerRef}
        className="testimonial-scroll flex gap-4 overflow-x-auto scroll-px-4 pb-4 snap-x snap-mandatory"
        style={{ scrollbarGutter: "stable both-edges" }}
        role="group"
        aria-label="Testimonials slider"
      >
        {displayItems.map((item, index) => (
          <TestimonialCard
            key={`${item.name}-${item.date}`}
            item={item}
            index={index}
            className="snap-start"
          />
        ))}
      </div>

      {total > 1 ? (
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between">
          <button
            type="button"
            onClick={scrollByPage(-1)}
            aria-controls={sliderId}
            aria-label="Previous testimonial"
            className="pointer-events-auto ml-2 rounded-full bg-white/85 p-2 shadow-md ring-1 ring-slate-200 transition hover:bg-white hover:shadow-lg focus-visible:outline-none focus-visible:ring focus-visible:ring-[#D17A5F] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            disabled={disablePrev}
          >
            <ChevronLeft
              className={clsx(
                "h-5 w-5",
                disablePrev ? "text-slate-300" : "text-[#2C4F52]"
              )}
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            onClick={scrollByPage(1)}
            aria-controls={sliderId}
            aria-label="Next testimonial"
            className="pointer-events-auto mr-2 rounded-full bg-white/85 p-2 shadow-md ring-1 ring-slate-200 transition hover:bg-white hover:shadow-lg focus-visible:outline-none focus-visible:ring focus-visible:ring-[#D17A5F] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            disabled={disableNext}
          >
            <ChevronRight
              className={clsx(
                "h-5 w-5",
                disableNext ? "text-slate-300" : "text-[#2C4F52]"
              )}
              aria-hidden="true"
            />
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default Testimonials;
