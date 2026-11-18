"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import MotionBoundary from "./MotionBoundary";
import { useEffect, useRef, useState } from "react";
function FilmPoster() {
  return (
    <div className="experience-film-poster">
      <Image
        src="/images/checkout-redesign/checkout-after.png"
        alt="Checkout redesign product interface."
        fill
        sizes="100vw"
      />
      <p>
        Opportunity. Direction.
        <br />
        <em>Build. Learn. Adopt.</em>
      </p>
    </div>
  );
}
const CinematicPlayer = dynamic(() => import("./CinematicPlayer"), {
  ssr: false,
  loading: FilmPoster,
});
export default function CinematicBridge({
  paused,
  reduced,
}: {
  paused: boolean;
  reduced: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "500px" },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <section
      className="experience-film"
      data-reading={reduced}
      id="experience-film"
      ref={ref}
      aria-label="From opportunity to adoption"
    >
      <div className="experience-film-surface">
        <div className="experience-film-caption">
          <span>From opportunity to adoption.</span>
          <a href="#experience-products">Return to working products ↓</a>
        </div>
        {near && !reduced ? (
          <MotionBoundary fallback={<FilmPoster />}>
            <CinematicPlayer paused={paused} reduced={reduced} />
          </MotionBoundary>
        ) : (
          <FilmPoster />
        )}
      </div>
    </section>
  );
}
