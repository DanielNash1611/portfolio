import clsx from "clsx";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  invert?: boolean;
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  invert = false,
}: SectionHeaderProps): JSX.Element {
  return (
    <div
      className={clsx(
        "space-y-4",
        align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-[760px]",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={clsx(
            "text-xs font-semibold uppercase tracking-[0.32em]",
            invert
              ? "text-[color:var(--color-cream)]/70"
              : "text-[color:var(--color-teal)]/68",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={clsx(
          "text-balance text-3xl font-semibold tracking-tight md:text-4xl",
          invert
            ? "text-[color:var(--color-cream)]"
            : "text-[color:var(--color-slate)]",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={clsx(
            "max-w-[680px] text-pretty text-base leading-7 md:text-lg",
            align === "center" ? "mx-auto" : "",
            invert
              ? "text-[color:var(--color-cream)]/78"
              : "text-[color:var(--color-slate)]/72",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
