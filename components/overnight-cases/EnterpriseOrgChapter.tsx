import orgSource from "@/components/overnight-enterprise/org-source-slide23.png";
import Link from "next/link";
import OrgPlaybook from "@/components/overnight-enterprise/OrgPlaybook";
import MediaFrame from "@/components/site/MediaFrame";
import SocialProofSnippet from "@/components/SocialProofSnippet";
import { caseStudySocialProof } from "@/data/socialProof";
const snapshotItems = [
  {
    label: "Role",
    value: "Senior Product Manager - AI Platform & Strategy",
  },
  {
    label: "Company",
    value: "The Guitar Center Company",
  },
  {
    label: "Timeframe",
    value: "2024-2025",
  },
  {
    label: "Scope",
    value:
      "Scaled to roughly 1,000 licensed users with about 800 active users, plus full contact center rollout (~350 agents).",
  },
  {
    label: "Focus",
    value:
      "Turn a successful pilot into a responsible AI capability the whole organization can use productively.",
  },
];

const approachThemes = [
  {
    title: "Turn pilot results into a scalable story",
    body: [
      "Used the measured contact-center pilot, its governance boundaries, and agent advocacy to inform expansion.",
      'Framed a roadmap from "one team tool" to "company-wide capability" with milestones for access, enablement, and governance.',
      "Paired every expansion ask with the reported pilot results, keeping the annualized estimate qualified.",
    ],
  },
  {
    title: "Training & enablement at scale",
    body: [
      "Produced self-serve training videos covering how ChatGPT works, prompt craft fundamentals, and responsible use.",
      "Delivered starter prompt libraries tailored to core teams (Product, Marketing, Merchandising, Operations).",
      "Packaged enablement kits so each new cohort could ramp quickly without bespoke workshops.",
    ],
  },
  {
    title: "ChatGPT Champions program",
    body: [
      "Recruited champions across departments to run their own experiments following the pilot playbook.",
      "Facilitated regular share-outs where champions demoed workflows, swapped prompts, and surfaced new guardrail needs.",
      "Scaled adoption by letting power users model experimentation best practices inside their home teams.",
    ],
  },
  {
    title: "AI COE groundwork",
    body: [
      "Partnered with Product, Data, Security, and Operations leaders to define ownership across platform, use case intake, and enablement layers.",
      "Outlined governance processes so AI efforts tied back to company goals instead of scattered experiments.",
      "Established a common language for risk, value, and maturity to guide future investment decisions.",
    ],
  },
];

const outcomes = [
  {
    heading: "Scaled ChatGPT access across HQ",
    detail:
      "Reported roughly 1,000 licensed users and about 800 active users organization-wide. The contact-center rollout covered ~350 agents; these scopes should not be added together.",
  },
  {
    heading: "ChatGPT Champions community",
    detail:
      "Champions across departments shared workflows, experiments, and lessons through a responsible pattern.",
  },
  {
    heading: "Training & self-serve enablement",
    detail:
      "Video primers and starter prompts gave teams reusable foundations for prompt quality and responsible use.",
  },
  {
    heading: "Structured AI platform strategy",
    detail:
      "Clarified platform ownership, governance flow, and enablement responsibilities as part of the platform strategy.",
  },
];

const nextSteps = [
  "Formalize a lightweight AI intake process with clear evaluation criteria for impact, risk, and complexity.",
  "Build a centralized library of reusable prompts, workflows, and automation patterns maintained by the AI COE.",
  "Introduce agentic workflows that connect ChatGPT to internal systems with robust safeguards and approval flows.",
];

export default function EnterpriseOrgChapter(): React.JSX.Element {
  return (
    <section
      className="eef-org-host"
      aria-label="Organization enablement and adoption"
    >
      <div className="eef-chapter-source">
        <p>
          Organization-wide enablement / Original training plan, slide 23.
          <br />A learning design, not a completion report.
        </p>
        <a href={orgSource.src} target="_blank" rel="noreferrer">
          Inspect the complete original training plan ↗
        </a>
      </div>
      <OrgPlaybook
        socialProof={caseStudySocialProof["chatgpt-org-scale"].map((item) => (
          <SocialProofSnippet
            key={`${item.author}-${item.quote}`}
            item={item}
            className="org-recommendation"
            showSourceLink
          />
        ))}
      >
        <details open>
          <summary>My role and the boundaries of this work</summary>
          <div>
            <p>
              I served as the de facto AI product lead for ChatGPT across the
              company, defining expansion strategy and adoption patterns across
              business units.
            </p>
            <p>
              I created and ran the Champions program, connected AI investments
              to business objectives, and partnered with leadership on the first
              iteration of an AI Center of Excellence.
            </p>
            <dl>
              {snapshotItems.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
            <p>
              The reported figures describe historical access and active users,
              not present-day adoption. The activity window is not established
              in the supporting case account. Contact-center and
              organization-wide scopes should not be added together.
            </p>
            <Link className="org-text-link" href="#pilot-study">
              Inspect the controlled pilot ↗
            </Link>
          </div>
        </details>
        <details>
          <summary>Expansion, enablement, and COE groundwork</summary>
          <div>
            {approachThemes.map((theme) => (
              <section key={theme.title}>
                <h3>{theme.title}</h3>
                <ul>
                  {theme.body.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </section>
            ))}
            <p>
              The original training plan is a design for blended learning. The
              artifact itself does not establish course completion or
              performance impact.
            </p>
          </div>
        </details>
        <details>
          <summary>Published models and what they represent</summary>
          <div>
            <p>
              These published exhibits summarize the operating approach. They
              are not production architecture or audited organization charts.
            </p>
            <figure>
              <MediaFrame
                src="/images/chatgpt-enterprise/enterprise-ai-operating-model.webp"
                alt="Published enterprise AI operating-model exhibit."
                fallbackTitle="Enterprise AI operating model"
                sizes="80vw"
                className="aspect-[16/9] bg-white"
                imageClassName="object-contain"
                expandable
              />
              <figcaption>
                Operating-model exhibit: discovery, governance, measurement,
                scale, and feedback.
              </figcaption>
            </figure>
            <figure>
              <MediaFrame
                src="/images/chatgpt-enterprise/grassroots-champions-model.webp"
                alt="Published Champions model summarizing cross-department workflow sharing and sponsorship."
                fallbackTitle="ChatGPT Champions model"
                sizes="80vw"
                className="aspect-[16/9] bg-white"
                imageClassName="object-contain"
                expandable
              />
              <figcaption>
                Champions exhibit: distributed learning, not reporting lines.
              </figcaption>
            </figure>
          </div>
        </details>
        <details>
          <summary>Reported outcomes and the next questions</summary>
          <div>
            {outcomes.map((o) => (
              <section key={o.heading}>
                <h3>{o.heading}</h3>
                <p>{o.detail}</p>
              </section>
            ))}
            <p>
              The pilot’s estimated annualized impact is separate from
              organization-wide usage; these do not establish company-wide
              realized ROI.
            </p>
            <h3>Proposed next steps</h3>
            <ul>
              {nextSteps.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>
              These are proposed next steps. COE groundwork does not mean a
              fully established COE or implemented agentic workflow.
            </p>
          </div>
        </details>
      </OrgPlaybook>
    </section>
  );
}
