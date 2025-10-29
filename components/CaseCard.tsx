import Image from "next/image";
import Link from "next/link";
import Badge from "@/components/Badge";
import Button from "@/components/Button";

export interface CaseCardProps {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  heroImage: string;
  href?: string;
  ctaLabel?: string;
  status?: string;
  ariaLabel?: string;
}

const CaseCard = ({
  slug,
  title,
  summary,
  tags,
  heroImage,
  href,
  ctaLabel = "Read case study",
  status,
  ariaLabel
}: CaseCardProps): JSX.Element => {
  const destination = href ?? `/work/${slug}`;
  const titleAria = ariaLabel ?? `Open ${title}`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-brand-slate/10 bg-white/80 shadow-soft transition hover:-translate-y-1 focus-within:-translate-y-1">
      <Link href={destination} className="relative block aspect-[4/3]" aria-label={titleAria}>
        <Image
          src={heroImage}
          alt={`${title} hero illustration`}
          fill
          className="object-cover transition duration-700 group-hover:scale-[1.02]"
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
          {status ? <Badge variant="outline">{status}</Badge> : null}
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-brand-teal">
            <Link href={destination} aria-label={titleAria} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-brand-cream">
              {title}
            </Link>
          </h3>
          <p className="text-sm text-brand-slate/80">{summary}</p>
        </div>
        <div className="mt-auto">
          <Link href={destination} aria-label={titleAria}>
            <Button variant="ghost" className="w-full md:w-auto">
              {ctaLabel}
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default CaseCard;
