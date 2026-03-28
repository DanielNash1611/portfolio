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
        "space-y-6 rounded-[2rem] border border-black/6 bg-white/84 px-6 py-7 shadow-[0_24px_60px_rgba(58,61,64,0.08)] md:px-8 md:py-8",
        className,
      )}
    >
      <div className="max-w-3xl space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[color:var(--color-teal)]/68">
          Artifact
        </p>
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-[color:var(--color-slate)] md:text-4xl">
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
          <aside className="rounded-[1.5rem] border border-[color:var(--color-teal)]/10 bg-[color:var(--color-background)]/86 px-5 py-5">
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
