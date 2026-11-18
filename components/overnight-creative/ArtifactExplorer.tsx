"use client";

import { useId, useState } from "react";
import Image from "next/image";
import styles from "./creative.module.css";

export type Artifact = {
  title: string;
  description: string;
  src: string;
  alt: string;
};

/** Recorded artifacts only: changing the selection never runs the product. */
export default function ArtifactExplorer({
  items,
  label,
  note,
}: {
  items: readonly Artifact[];
  label: string;
  note: string;
}) {
  const [selected, setSelected] = useState(0);
  const id = useId();
  const artifact = items[selected];
  return (
    <div className={styles.explorer}>
      <div role="group" aria-label={label} className={styles.choices}>
        {items.map((item, index) => (
          <button
            key={item.src}
            type="button"
            aria-pressed={selected === index}
            aria-controls={id}
            onClick={() => setSelected(index)}
          >
            <span className={styles.number}>
              {String(index + 1).padStart(2, "0")}
            </span>
            {item.title}
          </button>
        ))}
      </div>
      <figure id={id}>
        <div className={styles.artifact}>
          <Image
            key={artifact.src}
            src={artifact.src}
            alt={artifact.alt}
            fill
            sizes="(min-width: 1280px) 1200px, 100vw"
            className="object-contain"
          />
        </div>
        <figcaption
          aria-live="polite"
          aria-atomic="true"
          className={styles.caption}
        >
          <strong>{artifact.title}</strong>
          <div>
            <p>{artifact.description}</p>
            <a
              href={artifact.src}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.fullSize}
            >
              Open full-size artifact ↗
            </a>
          </div>
        </figcaption>
      </figure>
      <p className={styles.note}>{note}</p>
    </div>
  );
}
