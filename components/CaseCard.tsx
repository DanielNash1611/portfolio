import clsx from "clsx";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type CaseCardMedia = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type CaseCardProps = {
  title: string;
  description: string;
  href: string;
  tags: string[];
  media: CaseCardMedia;
  status?: string;
  chips?: string[];
  className?: string;
};

const chipClasses =
  "inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-xs text-[#2C4F52] ring-1 ring-[#2C4F52]/10";

const getTagClasses = (tag: string): string => {
  switch (tag) {
    case "AI Personalization":
      return "border-[#2C4F52]/25 bg-[#2C4F52]/10 text-[#2C4F52]";
    case "Prototype":
      return "border-[#D17A5F]/25 bg-[#D17A5F]/10 text-[#D17A5F]";
    default:
      return "border-[#3A3D40]/20 bg-[#3A3D40]/10 text-[#3A3D40]";
  }
};

const CaseCard = ({
  title,
  description,
  href,
  tags,
  media,
  status,
  chips,
  className
}: CaseCardProps): JSX.Element => {
  const cardLabel = `View ${title}`;

  return (
    <article
      className={clsx(
        "group flex h-full flex-col overflow-hidden rounded-3xl bg-white/95 shadow-md ring-1 ring-[#2C4F52]/12 transition-transform duration-200 ease-out hover:-translate-y-[6px] hover:shadow-lg hover:ring-[#2C4F52]/25 focus-within:-translate-y-[6px]",
        className
      )}
    >
      <Link
        href={href}
        aria-label={cardLabel}
        className="relative block aspect-[16/10] overflow-hidden focus-visible:outline-none focus-visible:ring focus-visible:ring-[#D17A5F] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      >
        <Image
          src={media.src}
          alt={media.alt}
          width={media.width}
          height={media.height}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
          sizes="(min-width: 1280px) 380px, (min-width: 768px) 45vw, 90vw"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2C4F52]/20 via-transparent to-transparent opacity-0 transition group-hover:opacity-100"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className={clsx(
                "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
                getTagClasses(tag)
              )}
              title={tag}
            >
              {tag}
            </span>
          ))}
          {status ? (
            <span
              className="inline-flex items-center rounded-full border border-[#2C4F52]/15 bg-[#F2E3D5]/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#2C4F52]"
              aria-label={`Status: ${status}`}
              title={`Status: ${status}`}
            >
              {status}
            </span>
          ) : null}
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-[#2C4F52]">
            <Link
              href={href}
              className="focus-visible:outline-none focus-visible:ring focus-visible:ring-[#D17A5F] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              aria-label={cardLabel}
            >
              {title}
            </Link>
          </h3>
          <p className="text-sm leading-relaxed text-[#3A3D40]/80">
            {description}
          </p>
        </div>

        {chips?.length ? (
          <div className="flex flex-wrap gap-2">
            {chips.map((chip) => (
              <span key={chip} className={chipClasses}>
                {chip}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-auto">
          <Link
            href={href}
            className="inline-flex items-center gap-2 rounded-full bg-[#2C4F52]/90 px-5 py-2 text-sm font-semibold text-[#F2E3D5] transition hover:bg-[#2C4F52] focus-visible:outline-none focus-visible:ring focus-visible:ring-[#D17A5F] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            aria-label={cardLabel}
          >
            View case study
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default CaseCard;
