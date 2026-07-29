import type { ReactNode } from "react";
import clsx from "clsx";

type ArtifactBlockProps = {
  title: string;
  caption?: string;
  notes?: string[];
  children: ReactNode;
  className?: string;
};

export default function ArtifactBlock({
  title,
  caption,
  notes,
  children,
  className,
}: ArtifactBlockProps): JSX.Element {
  return (
    <section
      className={clsx(
        "space-y-6 border-y border-[color:var(--color-slate)]/18 px-5 py-8 md:px-7 md:py-10",
        className,
      )}
    >
      <div className="max-w-3xl space-y-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[color:var(--color-orange)]">
          Artifact
        </p>
        <h2 className="text-balance font-serif text-3xl font-medium tracking-[-0.04em] text-[color:var(--color-slate)] md:text-5xl">
          {title}
        </h2>
        {caption ? (
          <p className="text-base leading-7 text-[color:var(--color-slate)]/72 md:text-lg">
            {caption}
          </p>
        ) : null}
      </div>

      <div
        className={clsx(
          "grid gap-6",
          notes?.length ? "xl:grid-cols-[minmax(0,1fr)_260px]" : "",
        )}
      >
        <div>{children}</div>
        {notes?.length ? (
          <aside className="border-l-2 border-[color:var(--color-orange)] bg-[color:var(--color-background-soft)]/58 px-5 py-5">
            <ul className="space-y-3">
              {notes.map((note) => (
                <li
                  key={note}
                  className="flex gap-3 text-sm leading-6 text-[color:var(--color-slate)]/72"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 h-2 w-2 rounded-full bg-[color:var(--color-orange)]"
                  />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </aside>
        ) : null}
      </div>
    </section>
  );
}
