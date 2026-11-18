"use client";
import Image from "next/image";
import { useState, type CSSProperties } from "react";
import "./annotation-artwork.css";
export default function CheckoutArtwork() {
  const [reveal, setReveal] = useState(65);
  return (
    <figure className="experience-artwork experience-checkout-comparison">
      <p className="experience-artwork-kicker">
        Commerce / Original checkout screens
      </p>
      <div
        className="experience-checkout-controls"
        role="group"
        aria-label="Choose checkout version"
      >
        <button aria-pressed={reveal === 0} onClick={() => setReveal(0)}>
          Before
        </button>
        <span>Drag to compare</span>
        <button aria-pressed={reveal === 100} onClick={() => setReveal(100)}>
          After
        </button>
      </div>
      <div
        className="experience-checkout-image"
        style={{ "--checkout-reveal": `${reveal}%` } as CSSProperties}
      >
        <Image
          src="/images/checkout-redesign/checkout-before.png"
          alt="Original Guitar Center checkout."
          fill
          sizes="(min-width:900px) 48vw, 90vw"
        />
        <div
          className="experience-checkout-after"
          style={{ clipPath: `inset(0 ${100 - reveal}% 0 0)` }}
        >
          <Image
            src="/images/checkout-redesign/checkout-after.png"
            alt="Redesigned checkout with delivery choices, contact information, and order summary."
            fill
            sizes="(min-width:900px) 48vw, 90vw"
          />
        </div>
        {reveal > 0 && reveal < 100 ? (
          <div className="experience-checkout-divider" aria-hidden="true">
            <span>↔</span>
          </div>
        ) : null}
      </div>
      <label className="experience-checkout-range">
        <span className="sr-only">Reveal redesigned checkout</span>
        <input
          aria-label="Reveal redesigned checkout"
          type="range"
          min="0"
          max="100"
          step="1"
          value={reveal}
          onChange={(event) => setReveal(Number(event.target.value))}
        />
      </label>
      <figcaption>
        Original screens. Slide between the old and redesigned checkout.
      </figcaption>
    </figure>
  );
}
