import clsx from "clsx";
import type { VisualAsset } from "@/content/portfolio";
import MediaFrame from "@/components/site/MediaFrame";

type VisualPlaceholderProps = {
  asset: VisualAsset;
  className?: string;
};

export default function VisualPlaceholder({
  asset,
  className,
}: VisualPlaceholderProps): JSX.Element {
  return (
    <article
      className={clsx(
        "overflow-hidden rounded-[1.5rem] border border-black/6 bg-white/82",
        className,
      )}
    >
      {asset.image ? (
        <MediaFrame
          src={asset.image}
          alt={asset.alt ?? asset.title}
          fallbackTitle={asset.title}
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="aspect-[16/10] border-b border-black/6 bg-[color:var(--color-cream)]/70"
        />
      ) : (
        <div className="flex min-h-[220px] items-center justify-center border-b border-dashed border-[color:var(--color-teal)]/18 bg-[color:var(--color-cream)]/72 px-6 text-center text-sm font-medium text-[color:var(--color-teal)]/76">
          Placeholder for future visual or embed
        </div>
      )}

      <div className="space-y-3 p-5">
        <h3 className="text-lg font-semibold text-[color:var(--color-slate)]">
          {asset.title}
        </h3>
        <p className="text-sm leading-6 text-[color:var(--color-slate)]/68">
          {asset.description}
        </p>
        {asset.todo ? (
          <p className="rounded-[1rem] bg-[color:var(--color-cream)] px-4 py-3 text-sm leading-6 text-[color:var(--color-slate)]/72">
            {asset.todo}
          </p>
        ) : null}
      </div>
    </article>
  );
}
