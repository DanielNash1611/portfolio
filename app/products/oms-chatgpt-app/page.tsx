import type { Metadata } from "next";
import { notFound } from "next/navigation";
import OmsFlagship from "@/components/overnight-enterprise/OmsFlagship";
import PortfolioGuide from "@/components/portfolio/PortfolioGuide";
import { getProductEntry } from "@/content/portfolio";
import {
  getPageContextByPath,
  getPortfolioContext,
} from "@/lib/portfolio-guide/context";

const entry = getProductEntry("oms-chatgpt-app");
const pageContext = getPageContextByPath("/products/oms-chatgpt-app");
const portfolioContext = getPortfolioContext();

const whatItDoes = [
  "Retrieve order details through natural language",
  "Execute order cancellations with confirmation and safeguards",
  "Make the action and its result clear to the operator",
  "Maintain user control throughout the interaction",
];

const prototypeToSystemWork = [
  "Evaluated SSO integration for secure user access",
  "Defined PII-safe interaction patterns",
  "Built an internal MCP server to support agent workflows",
  "Explored a production-oriented architecture using Java for team alignment and a Python wrapper for the Agents SDK",
];

const proofPoints = [
  "AI can operate within enterprise constraints when designed intentionally",
  "Prototypes can unlock faster alignment than strategy documents alone",
  "Product leaders can de-risk platform investments through hands-on builds",
];

const prototypeNotes = [
  "Uses simulated data to respect the sensitivity of OMS systems",
  "Public demo uses simulated data; later internal work reached production connection and small-group testing",
  "Focused on validating interaction patterns, not replacing existing systems",
];

const prototypeScreens = [
  {
    title: "Order lookup inside ChatGPT",
    description:
      "Natural-language lookup returns a structured order view with status, shipping details, totals, and expandable items.",
    src: "/images/oms-chatgpt-app/order-items-chatgpt.png",
    alt: "OMS ChatGPT App order summary view inside ChatGPT showing order details and expanded line items.",
  },
  {
    title: "Cancellation with guardrails",
    description:
      "The confirmation state makes the risk explicit, requires a deliberate phrase, and keeps the user in control before submission.",
    src: "/images/oms-chatgpt-app/cancellation-guardrails-chatgpt.png",
    alt: "OMS ChatGPT App cancellation confirmation flow inside ChatGPT showing warning text and explicit confirmation controls.",
  },
  {
    title: "Completed state after action",
    description:
      "After confirmation, the assistant shows the updated order state clearly instead of hiding the result behind a generic success message.",
    src: "/images/oms-chatgpt-app/cancelled-state-chatgpt.png",
    alt: "OMS ChatGPT App order summary after cancellation showing the updated cancelled state.",
  },
];

export const metadata: Metadata = {
  title: "OMS ChatGPT App",
  description:
    "Conversational AI interface for Order Management workflows, designed to make common support and operations tasks faster, clearer, and safer to execute.",
};

export default function OmsChatGptAppPage(): React.JSX.Element {
  if (!entry) notFound();
  const primaryAction = entry.actions?.[0];
  return (
    <OmsFlagship
      screens={prototypeScreens}
      prototypeHref={primaryAction?.href ?? "https://omschatgptapp.vercel.app/"}
      assistant={
        pageContext ? (
          <PortfolioGuide
            pageContext={pageContext}
            portfolioContext={portfolioContext}
          />
        ) : undefined
      }
    >
      <details open>
        <summary>My role and the product boundary</summary>
        <div>
          <p>
            I piloted the operational workflow from Canvas prototype through
            production connection and small-group testing, with order lookup,
            human-in-the-loop cancellation, and PII-safe validation as the core
            product requirements.
          </p>
          <p>
            The public artifact uses simulated data. Later internal production
            work is a separate delivery record. The screenshots on this page
            should be read as evidence of the public prototype’s interface.
          </p>
        </div>
      </details>
      <details>
        <summary>Why these workflows, and what I designed for</summary>
        <div>
          <p>
            OMS work was fragmented across tools and difficult to automate
            safely because of PII constraints. I explored whether conversation
            could make common tasks clearer while keeping the operator in
            control.
          </p>
          <ul>
            {whatItDoes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>
            The custom ChatGPT App used mock OMS data. The goal was to make the
            order, the consequence, and the operator’s choice visible together.
            It was designed for an AI environment employees were already using.
          </p>
        </div>
      </details>
      <details>
        <summary>
          Delivery record: public prototype + internal production work
        </summary>
        <div>
          <p>
            Approved delivery notes describe the progression below. These
            milestones do not establish organization-wide adoption or measured
            business impact.
          </p>
          <dl className="oms-delivery-record">
            <dt>~ April 2025</dt>
            <dd>ChatGPT Canvas prototype.</dd>
            <dt>~ Dec 2025</dt>
            <dd>Working prototype.</dd>
            <dt>March 2026</dt>
            <dd>
              Production connection, with OpenAI APIs and custom OMS APIs.
            </dd>
            <dt>April 2026</dt>
            <dd>Small-group production testing.</dd>
          </dl>
          <h3>Follow-on system work</h3>
          <ul>
            {prototypeToSystemWork.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>
            The Java / Python architecture was explored for team alignment and
            Agents SDK integration; it is not presented here as a verified
            diagram of the deployed system.
          </p>
        </div>
      </details>
      <details>
        <summary>Inspect the full, uncropped artifacts</summary>
        <div>
          <p>
            The scroll story focuses on the relevant widget areas. These
            original screenshots preserve the surrounding conversation and
            prototype context. The linked public web prototype is a standalone
            presentation; these screens show the ChatGPT-hosted prototype.
          </p>
          <ul>
            {prototypeScreens.map((screen) => (
              <li key={screen.src}>
                <a href={screen.src} target="_blank" rel="noreferrer">
                  {screen.title} ↗
                </a>
              </li>
            ))}
          </ul>
          <p>
            The confirmation screenshot includes assistant language about
            submitting a request before the visible confirmation form. The image
            alone cannot establish tool-call order or server-side enforcement.
          </p>
        </div>
      </details>
      <details>
        <summary>Design takeaways and limits</summary>
        <div>
          <p>
            These are product-design learnings, not audited outcome
            measurements.
          </p>
          <ul>
            {proofPoints.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h3>Scope of the public artifact</h3>
          <ul>
            {prototypeNotes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>
            The prototype helped create alignment around conversational access
            to internal systems. No production adoption, revenue, or time-saving
            claim is attached to these screens.
          </p>
        </div>
      </details>
    </OmsFlagship>
  );
}
