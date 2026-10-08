import ReactMarkdown from "react-markdown";

export function WorkspaceDocument({
  children,
  label,
}: {
  children: string;
  label: string;
}) {
  return (
    <div
      className="workspace-rendered-document"
      tabIndex={0}
      role="region"
      aria-label={label}
    >
      <ReactMarkdown
        disallowedElements={["img"]}
        components={{
          h1: ({ children }) => <h4>{children}</h4>,
          h2: ({ children }) => <h5>{children}</h5>,
          h3: ({ children }) => <h6>{children}</h6>,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

export function WorkspaceContextMap({
  location,
  owner,
  revision,
  design,
  technical,
  instructions,
}: {
  location: string;
  owner: string;
  revision: string;
  design?: string;
  technical?: string;
  instructions: string;
}) {
  const references = [
    ...(design !== undefined ? [["Design", design]] : []),
    ...(technical !== undefined ? [["Technical context", technical]] : []),
    ["Context owner", owner],
    ["Reviewed / revision", revision],
  ];
  return (
    <div className="project-context-map" aria-label="Product context map">
      <p className="workspace-help">
        Plan where context lives and when it is read. No files or agent settings
        are changed here.
      </p>
      <div className="project-entry">
        <code>Agent entry instructions</code>
        <span>For example, AGENTS.md · where + when to read</span>
      </div>
      <div className="project-context-source">
        <span aria-hidden="true">↓</span>
        <h4>Current product definition</h4>
        <p className={location.trim() ? "" : "project-open"}>
          {location.trim() || "Open — choose a file path or accessible link"}
        </p>
      </div>
      <ol
        className="project-context-checkpoints"
        aria-label="Context reading checkpoints"
      >
        <li>Read before planning and each new session</li>
        <li>Revisit at product decisions</li>
        <li>Check the whole user flow</li>
        <li>Update for the next session</li>
      </ol>
      <dl className="project-brief-scope">
        {references.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd className={value.trim() ? "" : "project-open"}>
              {value.trim() || "Open"}
            </dd>
          </div>
        ))}
      </dl>
      <details className="workspace-instructions">
        <summary>View full agent instructions</summary>
        <WorkspaceDocument label="Full agent instructions">
          {instructions}
        </WorkspaceDocument>
      </details>
    </div>
  );
}
