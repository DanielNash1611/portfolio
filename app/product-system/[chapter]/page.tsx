import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import {
  SystemScene,
  chapterScene,
} from "@/components/product-system/SystemVisuals";
import {
  OpportunityTreeLab,
  EvidenceExplorer,
} from "@/components/product-system/SystemLabs";
import { IdeaIntakeExample } from "@/components/product-system/SystemOverview";
import {
  LoopReference,
  RepoContextReference,
} from "@/components/product-system/SystemReferenceVisuals";
import { WorkspaceHub } from "@/components/product-system/WorkspaceHub";
import { FieldGuideNext } from "@/components/product-system/FieldGuideNext";
import {
  getSystemChapter,
  systemChapters,
  systemExamples,
} from "@/content/product-system";

type Props = { params: Promise<{ chapter: string }> };
export function generateStaticParams() {
  return systemChapters.map(({ slug }) => ({ chapter: slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const chapter = getSystemChapter((await params).chapter);
  if (!chapter) return {};
  return {
    title: `${chapter.title} — Product Operating System`,
    description: chapter.summary,
    alternates: { canonical: `/product-system/${chapter.slug}` },
    twitter: {
      card: "summary_large_image",
      title: `${chapter.title} | Daniel Nash`,
      description: chapter.summary,
      images: ["/images/product-system/shared-understanding.webp"],
    },
    openGraph: {
      title: `${chapter.title} | Daniel Nash`,
      description: chapter.summary,
      url: `/product-system/${chapter.slug}`,
      images: [
        {
          url: "/images/product-system/shared-understanding.webp",
          width: 1536,
          height: 1024,
          alt: "A studio study of shared product understanding.",
        },
      ],
    },
  };
}

export default async function SystemChapterPage({ params }: Props) {
  const chapter = getSystemChapter((await params).chapter);
  if (!chapter) notFound();
  const workspace = chapter.slug === "playbook";
  return (
    <div
      className={`system-chapter ${workspace ? "system-workspace-page" : ""}`}
    >
      <div className="system-wrap">
        <header
          className={`system-chapter-hero ${workspace ? "system-playbook-hero" : "system-chapter-hero-illustrated"}`}
        >
          <div className="system-chapter-intro">
            {!workspace && (
              <div className="system-chapter-meta">
                <p className="system-eyebrow">Field guide / {chapter.title}</p>
                <span>{chapter.minutes} min read</span>
              </div>
            )}
            <h1 id="system-page-title">
              {workspace ? "Your workspace." : chapter.headline}
            </h1>
            {!workspace && <p>{chapter.summary}</p>}
          </div>
          {!workspace && <SystemScene scene={chapterScene(chapter.slug)} />}
        </header>
      </div>
      {workspace ? (
        <div className="system-workspace-surface system-wrap">
          <Suspense
            fallback={
              <p className="workspace-loading">Opening your workspaces…</p>
            }
          >
            <WorkspaceHub />
          </Suspense>
        </div>
      ) : (
        <>
          {chapter.slug === "ideas-strategy" && <IdeaIntakeExample />}
          {[
            "idea-lifecycle",
            "development-loop",
            "ai-native-building",
            "testing-evidence",
          ].includes(chapter.slug) && (
            <div className="system-band-lab">
              <div className="system-wrap">
                {chapter.slug === "idea-lifecycle" && <OpportunityTreeLab />}
                {chapter.slug === "development-loop" && <LoopReference />}
                {chapter.slug === "ai-native-building" && (
                  <RepoContextReference />
                )}
                {chapter.slug === "testing-evidence" && <EvidenceExplorer />}
              </div>
            </div>
          )}
          <div className="system-wrap">
            <div className="system-field-notes">
              <aside className="system-principle">
                <p className="system-eyebrow">Keep this in view</p>
                <p>{chapter.principle}</p>
                <span>↳ {chapter.title}</span>
              </aside>
              <article
                className="system-article system-notes-accordion"
                aria-label={`${chapter.title} field notes`}
              >
                <p className="system-eyebrow">Field notes</p>
                {chapter.sections.map((section, sectionIndex) => (
                  <details key={section.title}>
                    <summary>
                      <span>{String(sectionIndex + 1).padStart(2, "0")}</span>
                      <h2>{section.title}</h2>
                      <span className="system-note-toggle" aria-hidden="true">
                        +
                      </span>
                    </summary>
                    <div className="system-note-body">
                      <p>{section.body}</p>
                      {section.items && (
                        <ul>
                          {section.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </details>
                ))}
                <details>
                  <summary>
                    <span>↳</span>
                    <h2>{chapter.exercise.title}</h2>
                    <span className="system-note-toggle" aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <div className="system-note-body">
                    <p>{chapter.exercise.body}</p>
                  </div>
                </details>
              </article>
            </div>
            {chapter.slug === "case-studies" && (
              <div className="system-examples">
                {systemExamples.map((example) => (
                  <Link key={example.href} href={example.href}>
                    <p className="system-eyebrow">{example.label}</p>
                    <h2>{example.title}</h2>
                    <p>{example.body}</p>
                    <span>
                      Read the story <ArrowUpRight size={18} />
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <FieldGuideNext slug={chapter.slug} />
        </>
      )}
    </div>
  );
}
