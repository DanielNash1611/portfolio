import type { Metadata } from "next";
import Link from "next/link";
import PilotDossier from "@/components/overnight-enterprise/PilotDossier";
import {
  pilotMetrics,
  formatPilotValue,
} from "@/components/overnight-enterprise/pilot-evidence";
import SocialProofSnippet from "@/components/SocialProofSnippet";
import { caseStudySocialProof } from "@/data/socialProof";

export const metadata: Metadata = {
  title: "Contact Center ChatGPT Pilot - AI Copilot for Agents",
  description:
    "Designed and launched a 6-month ChatGPT Enterprise pilot for Guitar Center's contact center, with an estimated ~$2.7M annualized impact and informing the business case for scaling AI.",
};

const snapshotItems = [
  {
    label: "Role",
    value: "Senior Product Manager - Contact Center & Order Management",
  },
  {
    label: "Company",
    value: "The Guitar Center Company",
  },
  {
    label: "Timeframe",
    value: "June 2024 - November 2024",
  },
  {
    label: "Scope",
    value: "15 agents in pilot cohort with a matched control group",
  },
  {
    label: "Objective",
    value:
      "Validate whether AI copilots improve revenue per call, efficiency, and experience without sacrificing brand voice or data security.",
  },
];

const approachSections = [
  {
    title: "Brainstorming sessions -> focused customGPTs",
    body: [
      "Partnered with supervisors and frontline agents to surface their highest-friction jobs-to-be-done.",
      "Converted the insights into purpose-built customGPTs, including a call-prep assistant and brand-safe email helpers.",
      "One of the pilot customGPTs became one of the most-used workflows in the company, as described in the case account.",
    ],
  },
  {
    title: "Safe use of CRM data & security review",
    body: [
      "Collaborated with EIS to review ChatGPT Enterprise security and privacy posture.",
      "Agreed on guardrails for pasting basic CRM context (no PCI or PII) and double-checking generated copy before sending.",
      "Documented do/don't guidance so agents understood exactly how to work safely.",
    ],
  },
  {
    title: "Agent workflow design: call scripts and emails",
    body: [
      "Defined repeatable workflows for pre-call prep and follow-up emails using structured prompts.",
      "Enabled agents to turn CRM snippets into concise call plans that emphasized solution paths and relevant product tie-ins.",
      "Accelerated outbound communications without automating call summaries - keeping humans in the loop where it mattered most.",
    ],
  },
];

const measurementBullets = [
  "Formed a 15-agent ChatGPT test group and a matched control group with similar tenure, skill, and call mix.",
  "Measured growth deltas between groups to control for seasonality instead of relying on simple before/after comparisons.",
  "The case account identifies Revenue Per Call, Items Per Transaction (IPT), and Average Order Value (AOV). Source slide 12 reports AOV, conversion rate, and revenue per call.",
  "Efficiency was also reviewed. Source slide 13 reports longer customer conversations for test agents; survey time savings are separate from objective handle-time measurement.",
];

const outcomes = [
  {
    heading: "Estimated ~$2.7M annualized impact",
    detail:
      "The comparison supported the business case. The estimated annualized figure is reported in the case account; it is not realized annual revenue.",
  },
  {
    heading: "Reviewed data boundaries with EIS and Legal",
    detail:
      "EIS and Legal signed off on using basic CRM data within ChatGPT Enterprise under the guardrails defined in the pilot.",
  },
  {
    heading: "CustomGPT adoption",
    detail:
      "The case account describes strong use of a pilot workflow. The broader program’s discovery exhibit identifies Gear Companion as one of the most-used GPT workflows.",
  },
  {
    heading: "Foundation for scaling",
    detail:
      "Results unlocked a decision to roll ChatGPT Enterprise out to the entire contact center (~350 agents) and set the stage for org-wide expansion.",
  },
];

const nextSteps = [
  "Turn the most successful customGPTs into task-specific mini-agents embedded directly in the agent desktop.",
  "Expand the measurement framework to capture customer sentiment and first-contact resolution alongside revenue metrics.",
  "Integrate with OMS and knowledge-base systems in a human-in-the-loop pattern that keeps agents accountable for final outputs.",
];

export default function ContactCenterChatGPTPage(): React.JSX.Element {
  const socialProof = caseStudySocialProof["chatgpt-contact-center"];
  return (
    <PilotDossier
      socialProof={socialProof.map((item) => (
        <SocialProofSnippet
          key={`${item.author}-${item.quote}`}
          item={item}
          showSourceLink
          className="pilot-recommendation"
        />
      ))}
    >
      <details open>
        <summary>My role and the scope of the pilot</summary>
        <div>
          <p>
            I framed the opportunity, success metrics, and business case;
            co-designed workflows with supervisors and agents; iterated
            customGPT instructions; and designed the matched-control comparison.
          </p>
          <p>
            I partnered with EIS and Legal on data boundaries and brought the
            pilot results and expansion recommendation to senior leadership.
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
            The June–November 2024 timeframe is from the existing case account.
            The comparison table itself does not publish observation dates.
          </p>
        </div>
      </details>
      <details>
        <summary>Read the comparison as a table</summary>
        <div>
          <p>
            Transcribed from roadmap review slide 12. The source labels the test
            figures “Per Week” and the control figures “Per Week, Adjusted.”
          </p>
          <table>
            <thead>
              <tr>
                <th>Metric / cohort</th>
                <th>Before</th>
                <th>After</th>
                <th>Relative change</th>
              </tr>
            </thead>
            <tbody>
              {pilotMetrics.flatMap((metric) =>
                (
                  [
                    ["Test", metric.test],
                    ["Control · adjusted", metric.control],
                  ] as const
                ).map(([label, row]) => (
                  <tr key={`${metric.id}-${label}`}>
                    <th scope="row">
                      {metric.name}
                      <br />
                      {label}
                    </th>
                    <td>{formatPilotValue(metric, row.before)}</td>
                    <td>{formatPilotValue(metric, row.after)}</td>
                    <td>{row.change}</td>
                  </tr>
                )),
              )}
            </tbody>
          </table>
          <p>
            The control also improved on conversion and revenue per call. These
            comparisons support the business case; they do not establish a
            causal effect size. The adjustment method, observation dates, and
            sampling variability are not supplied in this exhibit.
          </p>
        </div>
      </details>
      <details>
        <summary>Experiment design and measurement limits</summary>
        <div>
          <ul>
            {measurementBullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>
            The source deck says test agents had longer phone conversations,
            interpreted there as more productive conversations. A separate
            pilot-group survey estimated time saved; this page does not convert
            that survey into an objective handle-time result.
          </p>
          <p>
            The ~$2.7M estimate is annualized business-case impact, not realized
            annual revenue. Its model inputs are not reconstructed from the
            comparison table.
          </p>
        </div>
      </details>
      <details>
        <summary>Workflow design and guardrails</summary>
        <div>
          {approachSections.map((section) => (
            <div key={section.title}>
              <h3>{section.title}</h3>
              <ul>
                {section.body.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </details>
      <details>
        <summary>Reported outcomes and what I would explore next</summary>
        <div>
          {outcomes.map((outcome) => (
            <div key={outcome.heading}>
              <h3>{outcome.heading}</h3>
              <p>{outcome.detail}</p>
            </div>
          ))}
          <h3>Follow-on directions</h3>
          <ul>
            {nextSteps.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>
            These are proposed next steps, not claims that the pilot shipped
            each integration. The ~350-agent contact-center rollout is a
            separate scope from organization-wide access.
          </p>
          <Link href="/products/chatgpt-org-scale">
            Read the organization-wide adoption chapter ↗
          </Link>
        </div>
      </details>
    </PilotDossier>
  );
}
