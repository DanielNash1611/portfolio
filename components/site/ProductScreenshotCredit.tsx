import { privateProductScreenshotCredits } from "@/content/projects/private-product-examples";

export default function ProductScreenshotCredit({ slug }: { slug: string }) {
  const credit = privateProductScreenshotCredits[slug];
  if (!credit) return null;
  return (
    <p className="mt-2 text-xs leading-5 text-[color:var(--color-slate)]/70">
      Photo © {credit.creator},{" "}
      <a
        href={credit.sourceUrl}
        className="underline"
        target="_blank"
        rel="noreferrer"
      >
        {credit.title}
      </a>
      , via Wikimedia Commons. Licensed under{" "}
      <a
        href={credit.licenseUrl}
        className="underline"
        target="_blank"
        rel="noreferrer"
      >
        {credit.license}
      </a>
      . {credit.changes}
    </p>
  );
}
