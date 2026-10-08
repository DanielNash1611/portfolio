import { ArrowLeft, ArrowRight } from "lucide-react";
import { systemChapters } from "@/content/product-system";
import { SystemLink } from "./SystemExperience";

export function FieldGuideNext({ slug }: { slug: string }) {
  const chapters = systemChapters.filter(
    (chapter) => chapter.slug !== "playbook",
  );
  const index = chapters.findIndex((chapter) => chapter.slug === slug);
  if (index === -1) return null;
  const previous = chapters[index - 1];
  const next = chapters[index + 1];

  return (
    <nav className="system-guide-next" aria-label="Continue the field guide">
      <div className="system-wrap">
        <p className="system-guide-progress">
          Field guide{" "}
          <span>
            Chapter {index + 1} of {chapters.length}
          </span>
        </p>
        <SystemLink
          chapter={next?.slug ?? "playbook"}
          className="system-guide-next-link"
        >
          <div>
            <span className="system-eyebrow">
              {next ? "Next chapter" : "Field guide complete"}
            </span>
            <h2>{next?.title ?? "Open your workspace"}</h2>
            <p>{next?.question ?? "Develop an idea or start a project."}</p>
          </div>
          <ArrowRight size={38} aria-hidden="true" />
        </SystemLink>
        {previous && (
          <SystemLink chapter={previous.slug} className="system-guide-previous">
            <ArrowLeft size={16} aria-hidden="true" />
            Previous: {previous.title}
          </SystemLink>
        )}
      </div>
    </nav>
  );
}
