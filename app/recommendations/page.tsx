import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import Container from "@/components/site/Container";
import MotionReveal from "@/components/site/MotionReveal";
import {
  recommendationsHref,
  selectedRecommendations,
} from "@/content/recommendations";
import styles from "./recommendations.module.css";

const description =
  "Selected professional recommendations from leaders, managers, and colleagues who worked with Daniel Nash on AI enablement, business transformation, and product delivery.";

export const metadata: Metadata = {
  title: "Recommendations",
  description,
  alternates: { canonical: recommendationsHref },
  openGraph: {
    type: "website",
    title: "Recommendations | Daniel Nash",
    description,
    url: recommendationsHref,
    images: ["/og-default.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Recommendations | Daniel Nash",
    description,
    images: ["/og-default.svg"],
  },
};

type Recommendation = (typeof selectedRecommendations)[number];

function RecommendationQuote({
  recommendation,
  featured = false,
}: {
  recommendation: Recommendation;
  featured?: boolean;
}) {
  const { title, topic, testimonial, caseStudy, relationship } = recommendation;
  const { id, name, profileUrl, short } = testimonial;

  return (
    <article
      className={featured ? styles.featured : styles.recommendation}
      id={id}
      aria-labelledby={`${id}-topic`}
    >
      <h2 className={styles.topic} id={`${id}-topic`}>
        {topic}
      </h2>
      <figure>
        <blockquote cite={profileUrl} className={styles.quote}>
          <p>“{short}”</p>
        </blockquote>
        <figcaption className={styles.attribution}>
          <Image
            src={`/images/experience/recommenders/${id}.webp`}
            alt=""
            width={56}
            height={56}
            className={styles.portrait}
          />
          <div>
            <p className={styles.name}>{name}</p>
            <p className={styles.title}>{title}</p>
          </div>
        </figcaption>
      </figure>
      <p className={styles.relationship}>{relationship}</p>
      <div className={styles.links}>
        <Link href={caseStudy.href} className={styles.textLink}>
          {caseStudy.label} <ArrowRight size={15} aria-hidden="true" />
        </Link>
        {profileUrl ? (
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.textLink}
            aria-label={`Find ${name} in Daniel Nash’s LinkedIn recommendations`}
          >
            LinkedIn source <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        ) : null}
      </div>
    </article>
  );
}

export default function RecommendationsPage() {
  const [featured, ...otherRecommendations] = selectedRecommendations;

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <Container className={styles.heroLayout}>
          <MotionReveal className={styles.intro}>
            <h1>Recommendations</h1>
            <p>
              What managers, business partners, and teammates at Guitar Center
              said about working with me.
            </p>
            <a href="#topics" className={styles.textLink}>
              Browse by topic <ArrowDown size={17} aria-hidden="true" />
            </a>
          </MotionReveal>
          <MotionReveal delay={0.08}>
            <RecommendationQuote recommendation={featured} featured />
          </MotionReveal>
        </Container>
      </header>

      <Container className={styles.collection} id="topics">
        <nav className={styles.index} aria-label="Recommendation topics">
          <p className={styles.indexLabel}>On this page</p>
          <ul role="list">
            {selectedRecommendations.map(({ testimonial, topic }) => (
              <li key={testimonial.id}>
                <a href={`#${testimonial.id}`}>{topic}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.recommendations}>
          {otherRecommendations.map((recommendation) => (
            <RecommendationQuote
              key={recommendation.testimonial.id}
              recommendation={recommendation}
            />
          ))}
        </div>
      </Container>
    </div>
  );
}
