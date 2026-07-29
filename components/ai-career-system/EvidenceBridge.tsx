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
      className="space-y-10 border-y border-[color:var(--color-slate)]/16 py-10 md:py-14"
      aria-labelledby="evidence-bridge-heading"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(260px,0.74fr)_minmax(0,1.26fr)] lg:gap-16">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[color:var(--color-orange)]">
            Governed retrieval
          </p>
          <h2
            id="evidence-bridge-heading"
            className="mt-5 max-w-[11ch] text-balance font-serif text-4xl font-medium leading-[0.96] tracking-[-0.045em] text-[color:var(--color-slate)] md:text-6xl"
          >
            Claim-to-Evidence Engine
          </h2>
        </div>
        <p className="max-w-2xl self-end text-pretty text-base leading-7 text-[color:var(--color-slate)]/68 md:text-lg md:leading-8">
          This is the core governed-product mechanism: it lets the Portfolio
          Guide answer deeper hiring-manager questions without inventing claims
          or exposing unsafe or private details. Retrieval reuses the existing
          bearer-authenticated server boundary rather than adding a browser
          credential.
        </p>
      </div>

      <div className="relative pb-5 pl-4 sm:pb-7 sm:pl-7">
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 top-10 w-[36%] bg-[color:var(--color-tan)]"
        />
        <MediaFrame
          src="/images/products/ai-career-operating-system/claim-to-evidence-engine.png"
          alt="Diagram of the Claim-to-Evidence Engine showing a Portfolio Guide question, authenticated API call, public-safe and source-audited filters, structured evidence response, and safe fallback."
          fallbackTitle="Claim-to-Evidence Engine"
          sizes="(min-width: 1280px) 1100px, 94vw"
          className="aspect-[3/2] border border-[color:var(--color-slate)]/14 bg-white"
          imageClassName="object-contain transition-transform duration-700 hover:scale-[1.012]"
          expandable
          expandLabel="Expand Claim-to-Evidence Engine diagram"
        />
      </div>

      <div className="grid border-y border-[color:var(--color-slate)]/16 lg:grid-cols-3 lg:divide-x lg:divide-[color:var(--color-slate)]/16">
        {steps.map((step, index) => (
          <article
            key={step.title}
            className="border-b border-[color:var(--color-slate)]/16 py-6 last:border-b-0 lg:border-b-0 lg:px-7 lg:first:pl-0 lg:last:pr-0"
          >
            <p className="font-mono text-xs text-[color:var(--color-orange)]">
              0{index + 1} / {step.label}
            </p>
            <h3 className="mt-4 font-serif text-xl font-medium tracking-[-0.02em] text-[color:var(--color-slate)]">
              {step.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-[color:var(--color-slate)]/68">
              {step.detail}
            </p>
          </article>
        ))}
      </div>

      <div className="grid border-t border-[color:var(--color-slate)]/16 md:grid-cols-2 md:divide-x md:divide-[color:var(--color-slate)]/16">
        <div className="py-7 md:pr-8">
          <h3 className="font-serif text-xl font-medium text-[color:var(--color-slate)]">
            What it is
          </h3>
          <p className="mt-2 text-sm leading-6 text-[color:var(--color-slate)]/68">
            An implemented public-safe evidence search contract with structured
            claims, metrics, source status, answerability, and graceful
            degradation. Raw resume bullets remain private.
          </p>
        </div>
        <div className="border-t border-[color:var(--color-slate)]/16 py-7 md:border-t-0 md:pl-8">
          <h3 className="font-serif text-xl font-medium text-[color:var(--color-slate)]">
            What it is not
          </h3>
          <p className="mt-2 text-sm leading-6 text-[color:var(--color-slate)]/68">
            A complete shared evidence graph. Durable page-to-evidence
            identifiers and unified publishing remain future work.
          </p>
        </div>
      </div>

      <p className="border-l-2 border-[color:var(--color-orange)] bg-[color:var(--color-orange)]/6 px-5 py-4 text-sm leading-6 text-[color:var(--color-slate)]/68">
        Launch condition: the Portfolio tool and ResumeCustomizer evidence
        endpoint must be merged and deployed together.
      </p>
    </section>
  );
}
