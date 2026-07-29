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
        "space-y-4 border-b pb-6",
        align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-[760px]",
        invert
          ? "border-[color:var(--color-cream)]/18"
          : "border-[color:var(--color-slate)]/18",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={clsx(
            "text-[10px] font-bold uppercase tracking-[0.3em]",
            invert ? "text-[#e6a286]" : "text-[color:var(--color-orange)]",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={clsx(
          "max-w-[18ch] text-balance font-serif text-3xl font-medium leading-[1.02] tracking-[-0.04em] md:text-5xl",
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
            "max-w-[680px] text-pretty text-base leading-7",
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
