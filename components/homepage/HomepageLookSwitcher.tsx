import Link from "next/link";
import clsx from "clsx";
import { HOMEPAGE_LOOK_FLAGS, type HomepageLook } from "@/lib/homepage-look";

type HomepageLookSwitcherProps = {
  activeLook: HomepageLook;
};

const looks: Array<{
  value: HomepageLook;
  href: string;
  label: string;
  swatch: string;
}> = [
  {
    value: "classic",
    href: "/",
    label: "Original",
    swatch: "bg-[#2c4f52]",
  },
  {
    value: "studio",
    href: `/?look=${HOMEPAGE_LOOK_FLAGS.studio.queryValue}`,
    label: HOMEPAGE_LOOK_FLAGS.studio.label,
    swatch: "bg-[#db6048]",
  },
  {
    value: "score",
    href: `/?look=${HOMEPAGE_LOOK_FLAGS.score.queryValue}`,
    label: HOMEPAGE_LOOK_FLAGS.score.label,
    swatch: "bg-[#1948a8]",
  },
];

export default function HomepageLookSwitcher({
  activeLook,
}: HomepageLookSwitcherProps): JSX.Element {
  return (
    <details className="group fixed bottom-4 right-4 z-[70]">
      <summary
        aria-label="Change homepage style"
        title="Change homepage style"
        className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-full border border-black/10 bg-white/88 shadow-[0_8px_30px_rgba(20,30,35,0.13)] backdrop-blur-md transition hover:scale-105 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d17a5f] [&::-webkit-details-marker]:hidden"
      >
        <span className="flex items-end gap-[3px]" aria-hidden="true">
          <span className="h-2.5 w-[3px] rounded-full bg-[#2c4f52]" />
          <span className="h-4 w-[3px] rounded-full bg-[#db6048]" />
          <span className="h-3 w-[3px] rounded-full bg-[#1948a8]" />
        </span>
      </summary>

      <div className="absolute bottom-12 right-0 w-40 overflow-hidden rounded-2xl border border-black/8 bg-white/96 p-2 shadow-[0_18px_60px_rgba(20,30,35,0.16)] backdrop-blur-xl">
        <p className="px-2 pb-1.5 pt-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          Homepage
        </p>
        <nav aria-label="Homepage styles" className="space-y-0.5">
          {looks.map((look) => {
            const isActive = look.value === activeLook;

            return (
              <Link
                key={look.value}
                href={look.href}
                aria-current={isActive ? "page" : undefined}
                className={clsx(
                  "flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-semibold transition",
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                )}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={clsx("h-2 w-2 rounded-full", look.swatch)}
                    aria-hidden="true"
                  />
                  {look.label}
                </span>
                {isActive ? (
                  <span className="text-[9px] uppercase tracking-[0.16em] text-white/58">
                    On
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>
    </details>
  );
}
