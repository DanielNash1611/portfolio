import type { ReactNode } from "react";
import Link from "next/link";
import "./enterprise.css";
import ScrollReveal from "./ScrollReveal";

export function EnterpriseStory({
  eyebrow,
  title,
  summary,
  children,
  visual,
}: {
  eyebrow: string;
  title: string;
  summary: string;
  children: ReactNode;
  visual: ReactNode;
}) {
  return (
    <ScrollReveal>
      <div className="enterprise-story">
        <header className="enterprise-hero">
          <div className="enterprise-wrap">
            <Link href="/work" className="enterprise-back">
              ← Portfolio
            </Link>
            <p className="enterprise-eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p className="enterprise-summary">{summary}</p>
            <a className="enterprise-read" href="#decisions">
              Explore the decisions ↓
            </a>
          </div>
          {visual}
        </header>
        <div className="enterprise-wrap enterprise-body">{children}</div>
        <footer className="enterprise-close enterprise-wrap">
          <p className="enterprise-eyebrow">Continue the conversation</p>
          <h2>
            Build the product.
            <br />
            Build the capability.
          </h2>
          <Link href="/contact">Get in touch ↗</Link>
        </footer>
      </div>
    </ScrollReveal>
  );
}
export function Chapter({
  id,
  number,
  title,
  children,
}: {
  id?: string;
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="enterprise-chapter">
      <div>
        <p className="enterprise-eyebrow">{number}</p>
        <h2>{title}</h2>
      </div>
      <div className="enterprise-prose">{children}</div>
    </section>
  );
}
