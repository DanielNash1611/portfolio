import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  ClipboardList,
  Headphones,
  ListFilter,
  MessagesSquare,
} from "lucide-react";
import {
  contactCenterRoadmap,
  roadmapDiscoveryActivities,
  roadmapStory,
} from "@/content/projects/contact-center-roadmap";
import { testimonials } from "@/data/testimonials";
import CaseMotion from "@/components/overnight-cases/CaseMotion";
import StoryGraphic from "@/components/overnight-cases/StoryGraphic";
import FeatureTimeline from "./FeatureTimeline";
import RoadmapExhibit from "./RoadmapExhibit";
import styles from "./roadmap.module.css";

export const metadata: Metadata = {
  title: roadmapStory.title,
  description: contactCenterRoadmap.description,
  alternates: { canonical: contactCenterRoadmap.href },
  openGraph: {
    type: "article",
    title: roadmapStory.title,
    description: contactCenterRoadmap.description,
    url: contactCenterRoadmap.href,
  },
};

const recommendation = testimonials.find(
  (person) => person.id === "david-lawrence",
)!;
const discoveryIcons = {
  interviews: MessagesSquare,
  shadowing: Headphones,
  survey: ClipboardList,
  intake: ListFilter,
};

export default function ContactCenterRoadmapPage() {
  return (
    <article className={styles.roadmap}>
      <CaseMotion>
        <header className={styles.hero}>
          <div className={styles.shell} data-case-reveal>
            <Link href="/work" className={styles.back}>
              ← Selected work
            </Link>
            <p className={styles.eyebrow}>{contactCenterRoadmap.eyebrow}</p>
            <h1>{roadmapStory.title}</h1>
            <p className={styles.opening}>{roadmapStory.opening}</p>
            <a className={styles.heroLink} href="#discovery">
              Follow the discovery <ArrowDown aria-hidden="true" size={16} />
            </a>
          </div>
        </header>

        <div className={styles.shell}>
          <nav className={styles.readingNav} aria-label="In this case study">
            <a href="#discovery">Discovery</a>
            <a href="#alignment">Alignment</a>
            <a href="#sequencing">Sequencing</a>
            <a href="#one-year-review">One-year review</a>
            <a href="#handoff">Handoff</a>
          </nav>

          <section
            id="discovery"
            className={styles.section}
            aria-labelledby="discovery-heading"
          >
            <div className={styles.sectionIntro}>
              <h2 id="discovery-heading">
                Find out what agents were actually using
              </h2>
              <p>{roadmapStory.discovery}</p>
            </div>
            <ul
              className={styles.discoveries}
              aria-label="Discovery activities"
              role="list"
              data-case-reveal
            >
              {roadmapDiscoveryActivities.map(({ id, title, detail }) => {
                const Icon = discoveryIcons[id];
                return (
                  <li key={id}>
                    <Icon aria-hidden="true" size={22} strokeWidth={1.65} />
                    <div>
                      <h3>{title}</h3>
                      <p>{detail}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <dl className={styles.evidence} data-case-reveal>
              <div>
                <dt>Systems leadership expected</dt>
                <dd>About 5</dd>
              </div>
              <div>
                <dt>Systems found in discovery</dt>
                <dd>16</dd>
              </div>
            </dl>
            <div
              id="ready-for-roadmap"
              className={styles.turningPoint}
              data-case-reveal
            >
              <h3>I was ready when leadership asked</h3>
              <p>{roadmapStory.request}</p>
              <blockquote>“{roadmapStory.reply}”</blockquote>
            </div>
          </section>

          <section
            id="alignment"
            className={styles.section}
            aria-labelledby="alignment-heading"
          >
            <div className={styles.sectionIntro}>
              <h2 id="alignment-heading">
                My sponsor couldn’t see the strategy
              </h2>
              <p>{roadmapStory.featurePitch}</p>
            </div>
            <FeatureTimeline />

            <section
              className={styles.reframe}
              aria-labelledby="reframe-heading"
            >
              <div className={styles.sectionIntro} data-case-reveal>
                <h3 id="reframe-heading">Start with the agent’s day</h3>
                <p>{roadmapStory.reframing}</p>
              </div>
              <StoryGraphic kind="roadmap" />
              <RoadmapExhibit />
            </section>
            <section
              className={styles.sequencing}
              id="sequencing"
              aria-labelledby="sequencing-heading"
            >
              <div className={styles.sectionIntro} data-case-reveal>
                <h3 id="sequencing-heading">
                  I changed leadership’s mind about what to do first
                </h3>
                <p>{roadmapStory.sequencing}</p>
              </div>
              <div className={styles.decisions}>
                <div>
                  <h4>First, move returns into OMS</h4>
                  <p>{roadmapStory.nearTerm}</p>
                </div>
                <div>
                  <h4>Later, phase the OMS–Salesforce integration</h4>
                  <p>{roadmapStory.longerTerm}</p>
                </div>
              </div>
            </section>
            <div className={styles.turningPoint} data-case-reveal>
              <h3>Present a direction we could all back</h3>
              <p>{roadmapStory.alignment}</p>
            </div>
            <figure className={styles.recommendation}>
              <blockquote>
                “He built a comprehensive roadmap for the Contact Center tech
                stack within weeks of jumping into the new role and presented it
                to the Management Committee where it was very well received.”
              </blockquote>
              <figcaption>
                <a href={recommendation.profileUrl}>
                  {recommendation.name}{" "}
                  <ArrowUpRight aria-hidden="true" size={14} />
                </a>
                <span>{recommendation.roleLabel}</span>
              </figcaption>
            </figure>
          </section>

          <section
            id="one-year-review"
            className={styles.section}
            aria-labelledby="review-heading"
          >
            <div className={styles.sectionIntro}>
              <h2 id="review-heading">
                Revisit the roadmap against what shipped
              </h2>
              <p>{roadmapStory.practice}</p>
            </div>
            <dl className={styles.evidence} data-case-reveal>
              <div>
                <dt>Systems in the frontline workflow after one year</dt>
                <dd>16 → 9</dd>
              </div>
              <div>
                <dt>
                  Fewer annual customer hold-time hours from in-system returns
                </dt>
                <dd>~2,000</dd>
              </div>
            </dl>
            <div className={styles.sectionIntro}>
              <p>{roadmapStory.results}</p>
              <p className={styles.caption}>
                Source · Contact Center Roadmap Progress, end of 2024 (slides
                5–8)
              </p>
              <Link
                className={styles.textLink}
                href="/experience/cases/cresta-coaching"
              >
                Explore the related Cresta rollout{" "}
                <ArrowUpRight aria-hidden="true" size={16} />
              </Link>
            </div>
          </section>

          <section
            id="handoff"
            className={styles.section}
            aria-labelledby="handoff-heading"
          >
            <div className={styles.sectionIntro}>
              <h2 id="handoff-heading">Hand the practice to the next PM</h2>
              <p>{roadmapStory.handoff}</p>
              <h3>What I’d do differently</h3>
              <p>{roadmapStory.reflection}</p>
            </div>
          </section>

          <nav className={styles.related} aria-label="Related case studies">
            <Link href="/case-studies/jira-product-discovery">
              Building a product practice across teams{" "}
              <ArrowUpRight aria-hidden="true" size={18} />
            </Link>
            <Link href="/work/chatgpt-enterprise">
              The ChatGPT Enterprise pilot{" "}
              <ArrowUpRight aria-hidden="true" size={18} />
            </Link>
          </nav>
        </div>
      </CaseMotion>
    </article>
  );
}
