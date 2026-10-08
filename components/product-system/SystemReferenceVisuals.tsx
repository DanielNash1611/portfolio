import { ArrowDown, RotateCcw } from "lucide-react";
import { loopSteps } from "@/content/product-system";

export function LoopReference() {
  return (
    <section
      className="system-loop-reference"
      aria-label="The five activities in a development cycle"
    >
      <ol>
        {loopSteps.map((step, index) => (
          <li key={step.title}>
            <span className="system-eyebrow">0{index + 1}</span>
            <h2>{step.title}</h2>
            <p>{step.question}</p>
            <strong>{step.output}</strong>
          </li>
        ))}
      </ol>
      <p className="system-loop-return">
        <RotateCcw size={16} /> Bring what you learned into the next cycle.
      </p>
    </section>
  );
}

export function RepoContextReference() {
  return (
    <section
      className="system-repo-reference"
      aria-labelledby="repo-reference-title"
    >
      <div>
        <p className="system-eyebrow">Persistent agent context</p>
        <h2 id="repo-reference-title">
          A new session. The same product intent.
        </h2>
        <p>
          Store the definition with the work. Tell the agent where it is and
          when to read it. Keep it current as the product changes.
        </p>
        <ol
          className="system-context-loop"
          aria-label="When to consult product context"
        >
          <li>
            <span>01 / Before planning</span>
            <strong>Read & explain the intent</strong>
          </li>
          <li>
            <span>02 / During implementation</span>
            <strong>Revisit at product decisions</strong>
          </li>
          <li>
            <span>03 / Before completion</span>
            <strong>Check the whole experience</strong>
          </li>
          <li>
            <span>04 / After agreed changes</span>
            <strong>
              Update context for the next session{" "}
              <RotateCcw size={14} aria-hidden="true" />
            </strong>
          </li>
        </ol>
      </div>
      <div className="system-repo-map">
        <p className="system-repo-entry">
          <code>AGENTS.md</code>
          <span>Where to read + when</span>
        </p>
        <ArrowDown size={18} aria-hidden="true" />
        <dl>
          <div>
            <dt>Product definition</dt>
            <dd>Who & why → whole user journey → what must stay true</dd>
          </div>
          <div>
            <dt>Design & architecture</dt>
            <dd>Interaction rules, design system, technical boundaries</dd>
          </div>
          <div>
            <dt>Decisions</dt>
            <dd>What changed, why, who owns it & when it was reviewed</dd>
          </div>
          <div>
            <dt>Experience checks</dt>
            <dd>
              Walk the whole flow; check behavior as well as individual tasks
            </dd>
          </div>
        </dl>
        <p className="system-repo-note">
          Example entry point; configure it for your agent. A pointer is not
          proof that the source was read.
        </p>
        <div className="system-context-example">
          <span className="system-eyebrow">
            Gravity / illustrative decision
          </span>
          <p>
            <strong>A new “start all” control could work perfectly…</strong>
          </p>
          <p>…yet violate the product if it synchronized every performer.</p>
          <p className="system-context-invariant">
            Preserve: independent entrances and timelines.
          </p>
        </div>
      </div>
    </section>
  );
}
