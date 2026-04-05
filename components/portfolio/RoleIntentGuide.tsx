"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PortfolioGuideChips from "@/components/portfolio/PortfolioGuideChips";
import {
  normalizeVisitorIntent,
  ROLE_INTENT_QUICK_SELECTS,
  type RoleIntentQuickSelect,
} from "@/lib/portfolio-guide/intent";
import { getGuidedRecommendations } from "@/lib/portfolio-guide/recommendations";
import {
  clearVisitorIntent,
  readGuideSessionState,
  setVisitorIntent,
  writeGuideSessionState,
} from "@/lib/portfolio-guide/session";
import type {
  GuidedRecommendation,
  PageContext,
  VisitorIntent,
} from "@/lib/portfolio-guide/types";

type RoleIntentGuideProps = {
  pageCatalog: PageContext[];
  featuredProjectSlugs: string[];
};

function getPageDetails(
  pageCatalog: PageContext[],
  recommendation: GuidedRecommendation,
): Pick<PageContext, "href" | "projectType"> {
  const page =
    pageCatalog.find((candidate) => candidate.slug === recommendation.slug) ?? null;

  return {
    href: page?.href ?? "/work",
    projectType: page?.projectType,
  };
}

function getCtaLabel(projectType?: PageContext["projectType"]): string {
  if (projectType === "product" || projectType === "prototype-lab") {
    return "View product";
  }

  return "View work";
}

export default function RoleIntentGuide({
  pageCatalog,
  featuredProjectSlugs,
}: RoleIntentGuideProps): JSX.Element {
  const [draft, setDraft] = useState("");
  const [visitorIntent, setVisitorIntentState] = useState<VisitorIntent | null>(null);
  const [recommendedPath, setRecommendedPathState] = useState<GuidedRecommendation[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const state = readGuideSessionState();
    setVisitorIntentState(state.visitorIntent ?? null);
    setRecommendedPathState(state.recommendedPath ?? []);
    setDraft(state.visitorIntent?.rawInput ?? "");
  }, []);

  function applyIntent(rawInput: string, quickSelect?: RoleIntentQuickSelect) {
    const nextIntent = normalizeVisitorIntent(rawInput, quickSelect);
    if (!nextIntent) {
      return;
    }

    const nextRecommendedPath = getGuidedRecommendations(pageCatalog, nextIntent, {
      featuredSlugs: featuredProjectSlugs,
    });
    const nextState = writeGuideSessionState(
      setVisitorIntent(readGuideSessionState(), nextIntent, nextRecommendedPath),
    );

    setVisitorIntentState(nextState.visitorIntent ?? nextIntent);
    setRecommendedPathState(nextState.recommendedPath ?? nextRecommendedPath);
    setDraft(nextIntent.rawInput);
    setIsEditing(false);
  }

  function handleQuickSelect(chip: string) {
    applyIntent(chip, chip as RoleIntentQuickSelect);
  }

  function handleClear() {
    const nextState = writeGuideSessionState(
      clearVisitorIntent(readGuideSessionState()),
    );

    setVisitorIntentState(nextState.visitorIntent ?? null);
    setRecommendedPathState(nextState.recommendedPath ?? []);
    setDraft("");
    setIsEditing(false);
  }

  const startHere = recommendedPath[0] ?? null;
  const supportingEvidence = recommendedPath.slice(1, 3);
  const alsoWorthViewing = recommendedPath[3] ?? null;

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-black/6 bg-white/84 px-6 py-6 shadow-[0_20px_60px_rgba(58,61,64,0.08)] md:px-8 md:py-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(44,79,82,0.06),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(209,122,95,0.04),_transparent_34%)]"
      />

      <div className="relative space-y-6">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[color:var(--color-teal)]/68">
            Hiring for a specific role?
          </p>
          <div className="space-y-2">
            <h2 className="text-balance text-2xl font-semibold tracking-tight text-[color:var(--color-slate)] md:text-3xl">
              Tell the site what you&apos;re looking for and I&apos;ll guide you to the most relevant work.
            </h2>
            <p className="max-w-3xl text-sm leading-6 text-[color:var(--color-slate)]/68 md:text-base">
              Enter a title, short brief, or pasted job description. This stays
              optional and is used to tailor what the portfolio guide
              highlights. If you later ask the guide a question, that role
              context may be stored with the prompt to improve the guide.
            </p>
          </div>
        </div>

        {visitorIntent && !isEditing ? (
          <div className="flex flex-wrap items-center gap-3 rounded-[1.5rem] border border-[color:var(--color-teal)]/10 bg-[color:var(--color-background)]/82 px-4 py-4">
            <span className="inline-flex rounded-full border border-[color:var(--color-teal)]/12 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-teal)]/84">
              Guided for
            </span>
            <p className="text-sm leading-6 text-[color:var(--color-slate)]/74 md:text-base">
              {visitorIntent.rawInput}
            </p>
            <div className="ml-auto flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center rounded-full border border-[color:var(--color-teal)]/12 bg-white px-4 py-2 text-sm font-semibold text-[color:var(--color-teal)] transition hover:bg-[color:var(--color-background)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-cream)]"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center rounded-full border border-[color:var(--color-teal)]/12 bg-white px-4 py-2 text-sm font-semibold text-[color:var(--color-teal)] transition hover:bg-[color:var(--color-background)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-cream)]"
              >
                Clear
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.08fr)_minmax(280px,0.92fr)]">
            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                applyIntent(draft);
              }}
            >
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                rows={4}
                placeholder="e.g. Director of Product for AI platform initiatives, or paste a short job description here."
                className="w-full rounded-[1.4rem] border border-[color:var(--color-teal)]/12 bg-[color:var(--color-background)]/72 px-4 py-3 text-sm leading-6 text-[color:var(--color-slate)] placeholder:text-[color:var(--color-slate)]/42 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-cream)]"
              />
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={draft.trim().length === 0}
                  className="inline-flex items-center rounded-full border border-[color:var(--color-teal)] bg-[color:var(--color-teal)] px-5 py-3 text-sm font-semibold text-[color:var(--color-cream)] transition hover:bg-[color:var(--color-slate)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-cream)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Guide my tour
                </button>
                {visitorIntent ? (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="inline-flex items-center rounded-full border border-[color:var(--color-teal)]/12 bg-white px-4 py-3 text-sm font-semibold text-[color:var(--color-teal)] transition hover:bg-[color:var(--color-background)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-cream)]"
                  >
                    Clear
                  </button>
                ) : null}
              </div>
            </form>

            <div className="space-y-3 rounded-[1.5rem] border border-[color:var(--color-teal)]/10 bg-[color:var(--color-background)]/78 px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-teal)]/72">
                Quick starts
              </p>
              <p className="text-sm leading-6 text-[color:var(--color-slate)]/66">
                Choose a common lens and the site will recommend where to start without gating the rest of the portfolio.
              </p>
              <PortfolioGuideChips
                chips={[...ROLE_INTENT_QUICK_SELECTS]}
                onSelect={handleQuickSelect}
              />
            </div>
          </div>
        )}

        {recommendedPath.length > 0 ? (
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.08fr)_minmax(280px,0.92fr)]">
            <div className="space-y-4 rounded-[1.5rem] border border-[color:var(--color-teal)]/10 bg-white/78 px-5 py-5">
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-teal)]/72">
                  Start here
                </p>
                {startHere ? (() => {
                  const pageDetails = getPageDetails(pageCatalog, startHere);

                  return (
                    <article className="space-y-3 rounded-[1.35rem] border border-[color:var(--color-teal)]/10 bg-[color:var(--color-background)]/82 px-4 py-4">
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-[color:var(--color-slate)]">
                          {startHere.title}
                        </h3>
                        <p className="text-sm leading-6 text-[color:var(--color-slate)]/68">
                          {startHere.reason}
                        </p>
                      </div>
                      <Link
                        href={pageDetails.href}
                        className="inline-flex items-center rounded-full border border-[color:var(--color-teal)]/12 bg-white px-4 py-2 text-sm font-semibold text-[color:var(--color-teal)] transition hover:bg-[color:var(--color-background)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-cream)]"
                      >
                        {getCtaLabel(pageDetails.projectType)}
                      </Link>
                    </article>
                  );
                })() : null}
              </div>

              {supportingEvidence.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-teal)]/72">
                    Supporting evidence
                  </p>
                  <div className="grid gap-3">
                    {supportingEvidence.map((recommendation) => {
                      const pageDetails = getPageDetails(pageCatalog, recommendation);

                      return (
                        <article
                          key={recommendation.slug}
                          className="rounded-[1.25rem] border border-black/6 bg-white/82 px-4 py-4"
                        >
                          <div className="space-y-2">
                            <h3 className="text-base font-semibold text-[color:var(--color-slate)]">
                              {recommendation.title}
                            </h3>
                            <p className="text-sm leading-6 text-[color:var(--color-slate)]/68">
                              {recommendation.reason}
                            </p>
                          </div>
                          <Link
                            href={pageDetails.href}
                            className="mt-3 inline-flex items-center rounded-full border border-[color:var(--color-teal)]/12 bg-[color:var(--color-background)]/86 px-4 py-2 text-sm font-semibold text-[color:var(--color-teal)] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-cream)]"
                          >
                            {getCtaLabel(pageDetails.projectType)}
                          </Link>
                        </article>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="space-y-4 rounded-[1.5rem] border border-[color:var(--color-teal)]/10 bg-[color:var(--color-background)]/78 px-5 py-5">
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-teal)]/72">
                  Why this is grounded
                </p>
                <p className="text-sm leading-6 text-[color:var(--color-slate)]/66">
                  Recommendations are based on real portfolio metadata only: role fit, domain overlap, scope, and actual project evidence. If a page is only partly relevant, the reason will say so.
                </p>
              </div>

              {alsoWorthViewing ? (() => {
                const pageDetails = getPageDetails(pageCatalog, alsoWorthViewing);

                return (
                  <div className="space-y-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-teal)]/72">
                      Also worth viewing
                    </p>
                    <article className="rounded-[1.25rem] border border-black/6 bg-white/82 px-4 py-4">
                      <h3 className="text-base font-semibold text-[color:var(--color-slate)]">
                        {alsoWorthViewing.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-[color:var(--color-slate)]/68">
                        {alsoWorthViewing.reason}
                      </p>
                      <Link
                        href={pageDetails.href}
                        className="mt-3 inline-flex items-center rounded-full border border-[color:var(--color-teal)]/12 bg-[color:var(--color-background)]/86 px-4 py-2 text-sm font-semibold text-[color:var(--color-teal)] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-cream)]"
                      >
                        {getCtaLabel(pageDetails.projectType)}
                      </Link>
                    </article>
                  </div>
                );
              })() : null}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
