import MediaFrame from "@/components/site/MediaFrame";

const steps = [
  {
    label: "Question",
    title: "Portfolio Guide tool call",
    detail:
      "A deeper hiring-manager question triggers source-audited career evidence retrieval.",
  },
  {
    label: "Governance",
    title: "Conservative filters",
    detail:
      "publicSafeOnly and sourceAuditedOnly default to true before evidence can be returned.",
  },
  {
    label: "Response",
    title: "Structured evidence or safe fallback",
    detail:
      "The API returns claims, metrics, source status, and answerability without exposing raw resume bullets.",
  },
];

export default function EvidenceBridge(): JSX.Element {
  return (
    <section
      className="space-y-8 rounded-[2rem] border border-black/6 bg-white/84 px-6 py-8 shadow-[0_24px_60px_rgba(58,61,64,0.08)] md:px-8 md:py-10"
      aria-labelledby="evidence-bridge-heading"
    >
      <div className="max-w-3xl space-y-4">
        <h2
          id="evidence-bridge-heading"
          className="text-balance text-3xl font-semibold tracking-tight text-[color:var(--color-slate)] md:text-4xl"
        >
          Claim-to-Evidence Engine
        </h2>
        <p className="text-pretty text-base leading-7 text-[color:var(--color-slate)]/72 md:text-lg">
          This is the core governed-product mechanism: it lets the Portfolio
          Guide answer deeper hiring-manager questions without inventing claims
          or exposing unsafe or private details. Retrieval reuses the existing
          bearer-authenticated server boundary rather than adding a browser
          credential.
        </p>
      </div>

      <MediaFrame
        src="/images/products/ai-career-operating-system/claim-to-evidence-engine.png"
        alt="Diagram of the Claim-to-Evidence Engine showing a Portfolio Guide question, authenticated API call, public-safe and source-audited filters, structured evidence response, and safe fallback."
        fallbackTitle="Claim-to-Evidence Engine"
        sizes="(min-width: 1280px) 1100px, 94vw"
        className="aspect-[3/2] rounded-[1.5rem] border border-black/6 bg-white"
        imageClassName="object-contain"
        expandable
        expandLabel="Expand Claim-to-Evidence Engine diagram"
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {steps.map((step, index) => (
          <article
            key={step.title}
            className="relative rounded-[1.45rem] border border-[color:var(--color-teal)]/10 bg-[color:var(--color-background)]/82 p-5"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-orange)]">
              0{index + 1} / {step.label}
            </p>
            <h3 className="mt-4 text-xl font-semibold text-[color:var(--color-slate)]">
              {step.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-[color:var(--color-slate)]/68">
              {step.detail}
            </p>
          </article>
        ))}
      </div>

      <div className="grid gap-5 border-t border-[color:var(--color-teal)]/10 pt-7 md:grid-cols-2">
        <div>
          <h3 className="text-lg font-semibold text-[color:var(--color-slate)]">
            What it is
          </h3>
          <p className="mt-2 text-sm leading-6 text-[color:var(--color-slate)]/68">
            An implemented public-safe evidence search contract with structured
            claims, metrics, source status, answerability, and graceful
            degradation. Raw resume bullets remain private.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[color:var(--color-slate)]">
            What it is not
          </h3>
          <p className="mt-2 text-sm leading-6 text-[color:var(--color-slate)]/68">
            A complete shared evidence graph. Durable page-to-evidence
            identifiers and unified publishing remain future work.
          </p>
        </div>
      </div>

      <p className="rounded-[1.2rem] border border-[color:var(--color-orange)]/15 bg-[color:var(--color-orange)]/7 px-4 py-3 text-sm leading-6 text-[color:var(--color-slate)]/68">
        Launch condition: the Portfolio tool and ResumeCustomizer evidence
        endpoint must be merged and deployed together.
      </p>
    </section>
  );
}
