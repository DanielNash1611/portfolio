"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, Copy, RotateCcw } from "lucide-react";
import { useJourneyPosition } from "./SystemExperience";
import { WorkspaceContextMap } from "./WorkspaceContextMap";
import {
  emptyProjectDraft,
  parseProjectDraft,
  projectAgentContext,
  projectBrief,
  projectPrompt,
  projectSteps,
  PROJECT_MAX_TEXT,
  PROJECT_STORAGE_KEY,
  type ProjectDraft,
  type ProjectField,
  type ProjectPrompt,
  type ProjectView,
} from "@/lib/product-workspace/project";

const views = [
  { id: "brief", label: "Brief" },
  { id: "context", label: "Agent context" },
  { id: "prompt", label: "Prompt" },
] as const;
const fileUrl = (value: string) =>
  `data:text/markdown;charset=utf-8,${encodeURIComponent(value)}`;

function DraftValue({ value }: { value: string }) {
  return (
    <p className={value.trim() ? "" : "project-open"}>
      {value.trim() || "Open"}
    </p>
  );
}

export function ProjectWorkspace() {
  const [draft, setDraft] = useState<ProjectDraft>(emptyProjectDraft);
  const [ready, setReady] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [storage, setStorage] = useState("Opening your project draft…");
  const [undo, setUndo] = useState<ProjectDraft | null>(null);
  const [notice, setNotice] = useState("");
  const position = useJourneyPosition();
  const [step, setStep] = useState(position.read().projectWorkspace.step);
  const [view, setView] = useState<ProjectView>(
    position.read().projectWorkspace.view,
  );
  const [promptKind, setPromptKind] = useState<ProjectPrompt>("brainstorm");
  const [copyStatus, setCopyStatus] = useState("");
  const output = useRef<HTMLDivElement>(null);
  const editor = useRef<HTMLHeadingElement>(null);
  const pendingNotesFocus = useRef(false);
  useEffect(() => {
    if (!pendingNotesFocus.current) return;
    pendingNotesFocus.current = false;
    editor.current?.focus();
    editor.current?.scrollIntoView({ block: "start" });
  }, [step]);
  const promptText = useRef<HTMLTextAreaElement>(null);
  const group = projectSteps[step];
  const f = draft.fields;
  const prompt = projectPrompt(draft, promptKind);

  useEffect(() => {
    position.update({ projectWorkspace: { step, view } });
  }, [position, step, view]);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(PROJECT_STORAGE_KEY);
      if (saved) {
        const restored = parseProjectDraft(JSON.parse(saved));
        if (!restored) throw new Error("Invalid saved project");
        setDraft(restored);
      }
    } catch {
      setBlocked(true);
      setStorage(
        "This project could not be restored. Edits stay in this tab; download them before leaving.",
      );
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready || blocked) return;
    try {
      localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(draft));
      setStorage("Project saved in this browser · this device only");
    } catch {
      setBlocked(true);
      setStorage(
        "Your browser couldn’t save this project. Download it before leaving this tab.",
      );
    }
  }, [draft, ready, blocked]);
  useEffect(() => setCopyStatus(""), [prompt]);

  function editField(key: ProjectField, value: string) {
    setDraft((current) => ({
      ...current,
      fields: { ...current.fields, [key]: value },
    }));
    setUndo(null);
    setNotice("");
  }
  function changeStep(index: number) {
    pendingNotesFocus.current = index !== step;
    setStep(index);
    setView(projectSteps[index].view);
    if (index === step) focusNotes();
  }
  function focusNotes() {
    editor.current?.focus();
    editor.current?.scrollIntoView({ block: "start" });
  }
  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopyStatus("Prompt copied. Paste it into your AI conversation.");
    } catch {
      promptText.current?.focus();
      promptText.current?.select();
      setCopyStatus(
        "Automatic copy isn’t available here. The prompt is selected so you can copy it, or download it below.",
      );
    }
  }
  function preview(nextView = view) {
    setView(nextView);
    output.current?.focus();
    output.current?.scrollIntoView({ block: "start" });
  }

  return (
    <section
      className="system-lab workspace project-workspace"
      aria-labelledby="project-workspace-choice"
      id="project-workspace"
    >
      <div className="workspace-intro">
        <p>
          <strong>All fields are optional.</strong> Start anywhere. Leave
          unknowns blank.
        </p>
        <p className="workspace-storage" role="status">
          {storage}
        </p>
      </div>
      <div
        className="workspace-steps"
        role="group"
        aria-label="Project setup workflow"
      >
        {projectSteps.map((item, index) => (
          <button
            key={item.step}
            type="button"
            aria-pressed={step === index}
            aria-controls="project-fields"
            onClick={() => changeStep(index)}
          >
            <span>{index + 1}</span>
            {item.step}
          </button>
        ))}
      </div>
      <div className="workspace-body">
        <div className="workspace-editor" id="project-fields">
          <div className="workspace-editor-heading">
            <h3 ref={editor} tabIndex={-1}>
              {group.title}
            </h3>
            <button
              type="button"
              className="workspace-preview-link"
              onClick={() => preview()}
            >
              Preview <ArrowRight size={14} />
            </button>
          </div>
          <p className="workspace-help">{group.description}</p>
          <fieldset disabled={!ready}>
            <legend className="workspace-sr-only">
              {group.step} — all project fields optional
            </legend>
            {group.fields.map((field) => (
              <div className="workspace-field" key={field.key}>
                <label htmlFor={`project-${field.key}`}>{field.label}</label>
                <textarea
                  id={`project-${field.key}`}
                  value={f[field.key]}
                  placeholder={field.placeholder}
                  rows={"rows" in field ? field.rows : 2}
                  maxLength={PROJECT_MAX_TEXT}
                  onChange={(event) => editField(field.key, event.target.value)}
                />
              </div>
            ))}
          </fieldset>
          <div className="workspace-step-actions">
            {step > 0 && (
              <button type="button" onClick={() => changeStep(step - 1)}>
                Back
              </button>
            )}
            <button
              type="button"
              className="workspace-primary"
              onClick={() =>
                step < 3 ? changeStep(step + 1) : preview("prompt")
              }
            >
              {step < 3 ? "Continue" : "View prompt"}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
        <div className="workspace-live project-live">
          <div
            ref={output}
            tabIndex={-1}
            className="workspace-view-switch"
            role="group"
            aria-label="Project output view"
          >
            {views.map((item) => (
              <button
                type="button"
                key={item.id}
                aria-pressed={view === item.id}
                onClick={() => setView(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="workspace-preview-link workspace-return-link"
            onClick={focusNotes}
          >
            Back to notes
          </button>
          {view === "brief" && (
            <div className="project-brief" aria-label="Your live project brief">
              <div className="project-brief-heading">
                <span>Working draft</span>
                <h4>{f.name.trim() || "Your next project"}</h4>
                <DraftValue value={f.problem} />
              </div>
              <dl className="project-brief-facts">
                <div>
                  <dt>For whom</dt>
                  <dd>
                    <DraftValue value={f.audience} />
                  </dd>
                </div>
                <div>
                  <dt>Desired outcome</dt>
                  <dd>
                    <DraftValue value={f.outcome} />
                  </dd>
                </div>
              </dl>
              <div className="project-brief-flow">
                <span className="system-eyebrow">The whole experience</span>
                <DraftValue value={f.flow} />
              </div>
              <dl className="project-brief-scope">
                <div>
                  <dt>First MVP</dt>
                  <dd>
                    <DraftValue value={f.mvp} />
                  </dd>
                </div>
                <div>
                  <dt>Must stay true</dt>
                  <dd>
                    <DraftValue value={f.mustPreserve} />
                  </dd>
                </div>
                <div>
                  <dt>Leave out</dt>
                  <dd>
                    <DraftValue value={f.nonGoals} />
                  </dd>
                </div>
              </dl>
              <p className="workspace-help">
                Review the PRD before authorizing a build.
              </p>
            </div>
          )}
          {view === "context" && (
            <WorkspaceContextMap
              location={f.location}
              owner={f.owner}
              revision={f.reviewed}
              design={f.design}
              technical={f.technical}
              instructions={projectAgentContext(draft)}
            />
          )}
          {view === "prompt" && (
            <div className="project-prompt">
              <p className="workspace-help">
                Copy into your AI conversation. This workspace prepares prompts;
                it doesn’t run builds.
              </p>
              <label htmlFor="project-prompt-kind">Prompt for</label>
              <select
                id="project-prompt-kind"
                value={promptKind}
                onChange={(event) =>
                  setPromptKind(event.target.value as ProjectPrompt)
                }
              >
                <option value="brainstorm">1. Brainstorm</option>
                <option value="prd">2. Draft the PRD</option>
                <option value="build">3. Build the MVP after approval</option>
              </select>
              {promptKind === "build" && (
                <p className="project-review-note">
                  Use only after you’ve reviewed and approved the PRD.
                </p>
              )}
              <textarea
                ref={promptText}
                readOnly
                value={prompt}
                aria-label="Your project conversation prompt"
                className="project-prompt-text"
              />
              <button
                type="button"
                className="workspace-primary project-copy"
                disabled={!ready}
                onClick={copyPrompt}
              >
                <Copy size={15} />
                Copy prompt
              </button>
              <p className="project-copy-status" role="status">
                {copyStatus || "Includes your notes. Unknowns stay open."}
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="workspace-footer">
        <p role="status">
          {notice ||
            "Project draft · separate from your idea draft. No model requests."}
        </p>
        <div>
          {undo && (
            <button
              type="button"
              onClick={() => {
                setDraft(undo);
                setUndo(null);
                setNotice("Previous project draft restored.");
              }}
            >
              <RotateCcw size={14} />
              Undo
            </button>
          )}
          <button
            type="button"
            disabled={!ready}
            onClick={() => {
              setUndo(draft);
              setDraft(emptyProjectDraft());
              setNotice(
                "Project cleared. You can undo until your next edit. Your idea draft is unchanged.",
              );
            }}
          >
            Clear draft
          </button>
        </div>
      </div>
      <details className="workspace-downloads">
        <summary>Download project setup</summary>
        <div>
          <a href={fileUrl(projectBrief(draft))} download="project-brief.md">
            <ArrowDown size={14} />
            Project brief
          </a>
          <a
            href={fileUrl(projectAgentContext(draft))}
            download="project-agent-context.md"
          >
            <ArrowDown size={14} />
            Agent context setup
          </a>
          <a href={fileUrl(prompt)} download="project-conversation-prompt.md">
            <ArrowDown size={14} />
            Conversation prompt
          </a>
        </div>
      </details>
    </section>
  );
}
