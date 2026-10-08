"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { GitBranch, FolderPlus } from "lucide-react";
import { PlaybookWorkspace } from "./PlaybookWorkspace";
import { ProjectWorkspace } from "./ProjectWorkspace";

export function WorkspaceHub() {
  const params = useSearchParams();
  const router = useRouter();
  const mode = params.get("workspace") === "project" ? "project" : "idea";
  function choose(value: "idea" | "project") {
    if (value === mode) return;
    const query = new URLSearchParams(params.toString());
    if (value === "project") query.set("workspace", "project");
    else query.delete("workspace");
    const search = query.toString();
    router.push(`/product-system/playbook${search ? `?${search}` : ""}`, {
      scroll: false,
    });
  }
  return (
    <>
      <div
        className="workspace-choices"
        role="group"
        aria-label="Choose your workspace"
      >
        <button
          id="idea-workspace-choice"
          type="button"
          aria-pressed={mode === "idea"}
          aria-controls="idea-workspace-panel"
          onClick={() => choose("idea")}
        >
          <GitBranch size={21} aria-hidden="true" />
          <span>
            <strong>Develop an idea</strong>
            <small>Shape and test a thought</small>
          </span>
        </button>
        <button
          id="project-workspace-choice"
          type="button"
          aria-pressed={mode === "project"}
          aria-controls="project-workspace-panel"
          onClick={() => choose("project")}
        >
          <FolderPlus size={21} aria-hidden="true" />
          <span>
            <strong>Start a project</strong>
            <small>Prepare your first build</small>
          </span>
        </button>
      </div>
      {/* Keep both mounted so drafts also survive switching if browser storage is blocked. */}
      <div id="idea-workspace-panel" hidden={mode !== "idea"}>
        <PlaybookWorkspace labelledBy="idea-workspace-choice" />
      </div>
      <div id="project-workspace-panel" hidden={mode !== "project"}>
        <ProjectWorkspace />
      </div>
    </>
  );
}
