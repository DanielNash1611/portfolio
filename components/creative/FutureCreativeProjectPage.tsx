import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import MotionReveal from "@/components/site/MotionReveal";

type FutureCreativeProjectPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  threads: string[];
};

export default function FutureCreativeProjectPage({
  eyebrow,
  title,
  description,
  threads,
}: FutureCreativeProjectPageProps): JSX.Element {
  return (
    <div className="min-h-[calc(100svh-5rem)] bg-[#f3eee4] px-5 py-10 text-[#142733] sm:px-6 md:px-8 md:py-16">
      <MotionReveal>
        <main className="mx-auto grid max-w-[1400px] gap-12 border-t border-[#142733]/20 pt-8 lg:grid-cols-[minmax(0,0.68fr)_minmax(340px,0.32fr)] lg:gap-20">
          <div>
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-[#db6048]" aria-hidden="true" />
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#254d4b]">
                {eyebrow}
              </p>
            </div>

            <h1 className="mt-8 max-w-[11ch] font-serif text-[clamp(4rem,9vw,8.5rem)] font-medium leading-[0.86] tracking-[-0.06em]">
              {title}
            </h1>

            <p className="mt-8 max-w-2xl text-pretty text-lg leading-8 text-[#142733]/70 md:text-xl">
              {description}
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/creative"
                className="inline-flex items-center gap-2 border border-[#142733]/24 px-5 py-3 text-sm font-bold transition hover:border-[#142733] hover:bg-[#142733]/5"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to creative work
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#173f3d] px-5 py-3 text-sm font-bold text-[#f3eee4] transition hover:bg-[#db6048]"
              >
                Contact Daniel
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <aside className="self-end border-y border-[#142733]/20 py-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#db6048]">
              In development
            </p>
            <p className="mt-4 text-sm leading-6 text-[#142733]/64">
              This page is intentionally reserved for the project story now
              being developed.
            </p>
            <ul className="mt-6 space-y-3">
              {threads.map((thread, index) => (
                <li
                  key={thread}
                  className="flex gap-4 border-t border-[#142733]/12 pt-3 text-sm text-[#142733]/72"
                >
                  <span className="font-mono text-[10px] text-[#db6048]">
                    0{index + 1}
                  </span>
                  <span>{thread}</span>
                </li>
              ))}
            </ul>
          </aside>
        </main>
      </MotionReveal>
    </div>
  );
}
