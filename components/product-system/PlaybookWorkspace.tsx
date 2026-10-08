"use client";

import { useJourneyPosition } from "./SystemExperience";

import { useEffect, useRef, useState } from "react";
import { WorkspaceContextMap, WorkspaceDocument } from "./WorkspaceContextMap";
import { WorkspaceSuggestions } from "./WorkspaceSuggestions";
import { applySuggestions } from "@/lib/product-workspace/suggestions";
import {
  ArrowDown,
  ArrowRight,
  FileText,
  Plus,
  RotateCcw,
  X,
} from "lucide-react";
import {
  lifecycleStates,
  opportunityStates,
  systemDownloads,
} from "@/content/product-system";
import {
  contextMarkdown,
  emptyDraft,
  fieldGroups,
  MAX_NODES,
  MAX_TEXT,
  newNodeId,
  parseDraft,
  productMarkdown,
  STORAGE_KEY,
  type FieldKey,
  type WorkspaceDraft,
  type WorkspaceNode,
  type WorkspaceSolution,
} from "@/lib/product-workspace/model";

function documentUrl(text: string) {
  return `data:text/markdown;charset=utf-8,${encodeURIComponent(text)}`;
}

function NodeEditor({
  node,
  type,
  index,
  opportunities,
  onChange,
  onRemove,
}: {
  node: WorkspaceNode | WorkspaceSolution;
  type: "opportunity" | "solution";
  index: number;
  opportunities: WorkspaceNode[];
  onChange: (update: Partial<WorkspaceSolution>) => void;
  onRemove: () => void;
}) {
  const name = `${type === "opportunity" ? "Opportunity" : "Solution"} ${index + 1}`;
  const states = type === "opportunity" ? opportunityStates : lifecycleStates;
  const empty = !node.title.trim();
  return (
    <div
      className={`workspace-node workspace-${type} ${empty ? "workspace-node-open" : ""}`}
    >
      <div className="workspace-node-label">
        <label htmlFor={`title-${node.id}`}>{name}</label>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${name.toLowerCase()}`}
        >
          <X size={14} />
        </button>
      </div>
      <textarea
        id={`title-${node.id}`}
        value={node.title}
        maxLength={400}
        rows={2}
        onChange={(event) => onChange({ title: event.target.value })}
        placeholder={
          type === "opportunity"
            ? "What need could be addressed? Leave open if unclear."
            : "A possible response, if you have one."
        }
      />
      <label className="workspace-sr-only" htmlFor={`state-${node.id}`}>
        {name} state
      </label>
      <select
        id={`state-${node.id}`}
        value={node.state}
        onChange={(event) => onChange({ state: event.target.value })}
      >
        <option value="">State not set</option>
        {states.map((state) => (
          <option key={state.title}>{state.title}</option>
        ))}
      </select>
      {node.state && (
        <p className="workspace-state-help">
          {states.find((state) => state.title === node.state)?.body}
        </p>
      )}
      {type === "solution" && (
        <>
          <label
            className="workspace-connection-label"
            htmlFor={`parent-${node.id}`}
          >
            Connect to an opportunity
          </label>
          <select
            id={`parent-${node.id}`}
            aria-label={`Connect ${name.toLowerCase()} to`}
            value={(node as WorkspaceSolution).opportunityId ?? ""}
            onChange={(event) =>
              onChange({ opportunityId: event.target.value || null })
            }
          >
            <option value="">Leave connection open</option>
            {opportunities.map((opportunity, i) => (
              <option key={opportunity.id} value={opportunity.id}>
                {opportunity.title.trim() || `Open opportunity ${i + 1}`}
              </option>
            ))}
          </select>
        </>
      )}
    </div>
  );
}

export function PlaybookWorkspace({
  labelledBy,
}: { labelledBy?: string } = {}) {
  const [draft, setDraft] = useState<WorkspaceDraft>(emptyDraft);
  const [ready, setReady] = useState(false);
  const [storageBlocked, setStorageBlocked] = useState(false);
  const [storageMessage, setStorageMessage] = useState(
    "Opening your local draft…",
  );
  const position = useJourneyPosition();
  const [step, setStep] = useState(() => position.read().workspace.step);
  const [view, setView] = useState(() => position.read().workspace.view);
  useEffect(() => {
    position.update({ workspace: { step, view } });
  }, [position, step, view]);
  const [undo, setUndo] = useState<WorkspaceDraft | null>(null);
  const [notice, setNotice] = useState("");
  const editor = useRef<HTMLHeadingElement>(null);
  const output = useRef<HTMLDivElement>(null);
  const pendingNotesFocus = useRef(false);
  useEffect(() => {
    if (!pendingNotesFocus.current) return;
    pendingNotesFocus.current = false;
    editor.current?.focus();
    editor.current?.scrollIntoView({ block: "start" });
  }, [step]);
  function focusNotes() {
    editor.current?.focus();
    editor.current?.scrollIntoView({ block: "start" });
  }
  function preview(nextView = view) {
    setView(nextView);
    output.current?.focus();
    output.current?.scrollIntoView({ block: "start" });
  }
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const restored = parseDraft(JSON.parse(saved));
        if (!restored) throw new Error("Invalid saved draft");
        setDraft(restored);
      }
    } catch {
      setStorageBlocked(true);
      setStorageMessage(
        "Browser storage is unavailable or the saved draft could not be read. Your edits will stay in this tab; download them before leaving.",
      );
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready || storageBlocked) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
      setStorageMessage("Saved in this browser · this device only");
    } catch {
      setStorageBlocked(true);
      setStorageMessage(
        "Your browser couldn’t save this draft. Download it before leaving this tab.",
      );
    }
  }, [draft, ready, storageBlocked]);
  function edit(update: (current: WorkspaceDraft) => WorkspaceDraft) {
    setDraft(update);
    setUndo(null);
    setNotice("");
  }
  function editField(key: FieldKey, value: string) {
    edit((current) => ({
      ...current,
      fields: { ...current.fields, [key]: value },
    }));
  }
  function changeStep(index: number) {
    pendingNotesFocus.current = index !== step;
    setStep(index);
    setView(index === 3 ? "context" : index === 2 ? "definition" : "tree");
    if (index === step) focusNotes();
  }
  function updateNode(
    id: string,
    type: "opportunity" | "solution",
    update: Partial<WorkspaceSolution>,
  ) {
    edit((current) =>
      type === "opportunity"
        ? {
            ...current,
            opportunities: current.opportunities.map((node) =>
              node.id === id
                ? {
                    ...node,
                    title: update.title ?? node.title,
                    state: update.state ?? node.state,
                  }
                : node,
            ),
          }
        : {
            ...current,
            solutions: current.solutions.map((node) =>
              node.id === id ? { ...node, ...update } : node,
            ),
          },
    );
  }
  function removeNode(id: string, type: "opportunity" | "solution") {
    setUndo(draft);
    setDraft((current) =>
      type === "opportunity"
        ? {
            ...current,
            opportunities:
              current.opportunities.length === 1
                ? [{ id, title: "", state: "" }]
                : current.opportunities.filter((node) => node.id !== id),
            solutions: current.solutions.map((node) =>
              node.opportunityId === id
                ? { ...node, opportunityId: null }
                : node,
            ),
          }
        : {
            ...current,
            solutions:
              current.solutions.length === 1
                ? [{ id, title: "", state: "", opportunityId: null }]
                : current.solutions.filter((node) => node.id !== id),
          },
    );
    setNotice(
      type === "opportunity"
        ? "Opportunity removed. Its solutions remain with an open connection."
        : "Solution removed.",
    );
  }
  function addOpportunity() {
    edit((current) =>
      current.opportunities.length >= MAX_NODES
        ? current
        : {
            ...current,
            opportunities: [
              ...current.opportunities,
              { id: newNodeId(), title: "", state: "" },
            ],
          },
    );
  }
  function addSolution(opportunityId: string | null = null) {
    edit((current) =>
      current.solutions.length >= MAX_NODES
        ? current
        : {
            ...current,
            solutions: [
              ...current.solutions,
              { id: newNodeId(), title: "", state: "", opportunityId },
            ],
          },
    );
  }
  function solutionEditor(solution: WorkspaceSolution) {
    return (
      <NodeEditor
        key={solution.id}
        node={solution}
        type="solution"
        index={draft.solutions.findIndex((node) => node.id === solution.id)}
        opportunities={draft.opportunities}
        onChange={(update) => updateNode(solution.id, "solution", update)}
        onRemove={() => removeNode(solution.id, "solution")}
      />
    );
  }
  const group = fieldGroups[step];
  return (
    <section
      id="playbook-workspace"
      className="system-lab workspace"
      aria-labelledby={labelledBy ?? "workspace-title"}
    >
      {!labelledBy && (
        <div className="lab-heading">
          <div>
            <p className="system-eyebrow">Your local workspace</p>
            <h2 id="workspace-title">Bring an idea. Start anywhere.</h2>
          </div>
        </div>
      )}
      <div className="workspace-intro">
        <p>
          <strong>All fields are optional.</strong> Start anywhere. Leave
          unknowns blank.
        </p>
        <p className="workspace-storage" role="status">
          {storageMessage}
        </p>
      </div>
      <div
        className="workspace-steps"
        role="group"
        aria-label="Your product workflow"
      >
        {fieldGroups.map((item, index) => (
          <button
            key={item.step}
            type="button"
            aria-pressed={step === index}
            aria-controls="workspace-fields"
            onClick={() => changeStep(index)}
          >
            <span>{index + 1}</span>
            {item.step}
          </button>
        ))}
      </div>
      <div className="workspace-body">
        <div className="workspace-editor" id="workspace-fields">
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
              {group.step} — all fields optional
            </legend>
            {group.fields.map((field) => (
              <div className="workspace-field" key={field.key}>
                <label htmlFor={`workspace-${field.key}`}>{field.label}</label>
                <textarea
                  id={`workspace-${field.key}`}
                  value={draft.fields[field.key]}
                  placeholder={field.placeholder}
                  maxLength={MAX_TEXT}
                  rows={"rows" in field ? field.rows : 2}
                  onChange={(event) => editField(field.key, event.target.value)}
                />
              </div>
            ))}
          </fieldset>
          <WorkspaceSuggestions
            draft={draft}
            ready={ready}
            onApply={(suggestions, selected, snapshot) => {
              if (JSON.stringify(draft) !== snapshot) return;
              setUndo(draft);
              setDraft((current) =>
                applySuggestions(current, suggestions, selected, snapshot),
              );
              setNotice(
                "Suggestions added to open fields. Lifecycle states haven’t changed. You can undo until your next edit.",
              );
              setView("tree");
            }}
          />
          <div className="workspace-step-actions">
            {step > 0 && (
              <button type="button" onClick={() => changeStep(step - 1)}>
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                className="workspace-primary"
                onClick={() => changeStep(step + 1)}
              >
                Continue
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                className="workspace-primary"
                onClick={() => preview("definition")}
              >
                View definition <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
        <div className="workspace-live">
          <div
            ref={output}
            tabIndex={-1}
            className="workspace-view-switch"
            role="group"
            aria-label="Live workspace view"
          >
            {(
              [
                { id: "tree", label: "Tree" },
                {
                  id: "definition",
                  label: "Definition",
                },
                { id: "context", label: "Agent context" },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
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
          {view === "tree" ? (
            <div
              className="workspace-tree"
              aria-label="Your opportunity–solution tree"
            >
              <p className="workspace-help">
                Edit the tree directly. Unknown needs and solutions stay blank.
              </p>
              {draft.fields.idea.trim() && (
                <div className="workspace-original-idea">
                  <span>Original idea</span>
                  <p>{draft.fields.idea}</p>
                </div>
              )}
              <div className="workspace-outcome">
                <span>Desired outcome</span>
                <p>{draft.fields.outcome.trim() || "Open"}</p>
              </div>
              <fieldset disabled={!ready}>
                <legend className="workspace-sr-only">
                  Optional opportunities and solutions
                </legend>
                {draft.opportunities.map((opportunity, index) => (
                  <div className="workspace-branch" key={opportunity.id}>
                    <NodeEditor
                      node={opportunity}
                      type="opportunity"
                      index={index}
                      opportunities={draft.opportunities}
                      onChange={(update) =>
                        updateNode(opportunity.id, "opportunity", update)
                      }
                      onRemove={() => removeNode(opportunity.id, "opportunity")}
                    />
                    <div className="workspace-solutions">
                      {draft.solutions
                        .filter((node) => node.opportunityId === opportunity.id)
                        .map(solutionEditor)}
                      <button
                        type="button"
                        className="workspace-add"
                        disabled={draft.solutions.length >= MAX_NODES}
                        onClick={() => addSolution(opportunity.id)}
                      >
                        <Plus size={14} />
                        Add solution
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="workspace-add"
                  disabled={draft.opportunities.length >= MAX_NODES}
                  onClick={addOpportunity}
                >
                  <Plus size={14} />
                  Add opportunity
                </button>
                <div className="workspace-unlinked">
                  <p className="system-eyebrow">Opportunity still open</p>
                  <p className="workspace-help">
                    A solution can arrive before the need is clear.
                  </p>
                  {draft.solutions
                    .filter((node) => node.opportunityId === null)
                    .map(solutionEditor)}
                  <button
                    type="button"
                    className="workspace-add"
                    disabled={draft.solutions.length >= MAX_NODES}
                    onClick={() => addSolution()}
                  >
                    <Plus size={14} />
                    Add an unlinked solution
                  </button>
                </div>
              </fieldset>
            </div>
          ) : view === "context" ? (
            <WorkspaceContextMap
              location={draft.fields.repo}
              owner={draft.fields.contextOwner}
              revision={draft.fields.contextReviewed}
              instructions={contextMarkdown(draft)}
            />
          ) : (
            <div className="workspace-document">
              <p className="workspace-help">
                Working draft · updates as you type.
              </p>
              <WorkspaceDocument label="Your product definition">
                {productMarkdown(draft)}
              </WorkspaceDocument>
            </div>
          )}
        </div>
      </div>
      <div className="workspace-footer">
        <p role="status">
          {notice || "Idea draft · separate from your project draft."}
        </p>
        <div>
          {undo && (
            <button
              type="button"
              onClick={() => {
                setDraft(undo);
                setUndo(null);
                setNotice("Previous draft restored.");
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
              setDraft(emptyDraft());
              setNotice("Draft cleared. You can undo until your next edit.");
            }}
          >
            Clear draft
          </button>
        </div>
      </div>
      <details className="workspace-downloads">
        <summary>Download draft or templates</summary>
        <div>
          <a
            href={documentUrl(productMarkdown(draft))}
            download="product-definition.md"
          >
            <ArrowDown size={14} />
            Product definition
          </a>
          <a
            href={documentUrl(contextMarkdown(draft))}
            download="agent-context.md"
          >
            <ArrowDown size={14} />
            Agent context
          </a>
          {systemDownloads.map((template) => (
            <a
              key={template.file}
              href={`/downloads/product-system/${template.file}`}
              download
            >
              <FileText size={14} />
              {template.title} · blank template
            </a>
          ))}
        </div>
      </details>
    </section>
  );
}
