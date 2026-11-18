"use client";

import { useState } from "react";
import Image from "next/image";
import "./cases.css";

const screens = [
  {
    label: "Before",
    image: "checkout-before.png",
    description:
      "The legacy multi-step flow: a denser layout with more competing information.",
  },
  {
    label: "After",
    image: "checkout-after.png",
    description:
      "The redesigned delivery step: clearer hierarchy and a flow that is easier to scan.",
  },
];

export default function CheckoutComparison() {
  const [selected, setSelected] = useState(1);
  const screen = screens[selected];
  return (
    <figure className="oc-comparison">
      <div
        className="oc-selector"
        role="group"
        aria-label="Checkout screen comparison"
      >
        <span>Actual checkout screens</span>
        <div>
          {screens.map((item, index) => (
            <button
              key={item.label}
              type="button"
              aria-pressed={selected === index}
              onClick={() => setSelected(index)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="oc-screen" key={screen.image}>
        <Image
          src={`/images/checkout-redesign/${screen.image}`}
          alt={`${screen.label} checkout. ${screen.description}`}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority
          className="object-contain object-top"
        />
      </div>
      <figcaption aria-live="polite">
        <strong>{screen.label}.</strong> {screen.description}{" "}
        <a href="#checkout-artifacts">Inspect both screens ↓</a>
      </figcaption>
    </figure>
  );
}
