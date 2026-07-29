"use client";

import clsx from "clsx";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/content/portfolio";
import Container from "@/components/site/Container";

export default function SiteHeader(): JSX.Element {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      data-site-header="true"
      className={clsx(
        "fixed inset-x-0 top-0 z-50 border-b border-[color:var(--color-slate)]/14 transition duration-300",
        scrolled
          ? "bg-[rgba(247,245,242,0.94)] backdrop-blur-md"
          : "bg-[color:var(--color-background)]",
      )}
    >
      <Container>
        <div className="flex min-w-0 items-stretch justify-between">
          <a href="#main" className="skip-link">
            Skip to content
          </a>

          <Link
            href="/"
            className="flex shrink-0 items-center border-r border-[color:var(--color-slate)]/14 py-4 pr-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[color:var(--color-orange)] md:pr-8"
          >
            <span className="font-serif text-xl font-medium tracking-[-0.035em] text-[color:var(--color-slate)]">
              Daniel Nash
            </span>
            <span className="ml-3 hidden text-[9px] font-bold uppercase tracking-[0.2em] text-[color:var(--color-teal)]/62 sm:inline">
              AI Product Leader
            </span>
          </Link>

          <nav
            aria-label="Primary navigation"
            className="hidden min-w-0 flex-1 items-stretch justify-end lg:flex"
          >
            {siteConfig.nav.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "relative inline-flex items-center border-l border-[color:var(--color-slate)]/10 px-3 text-[11px] font-bold uppercase tracking-[0.14em] transition xl:px-4",
                    active
                      ? "text-[color:var(--color-slate)] after:absolute after:inset-x-3 after:bottom-0 after:h-[3px] after:bg-[color:var(--color-orange)]"
                      : "text-[color:var(--color-slate)]/62 hover:bg-white/35 hover:text-[color:var(--color-slate)]",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <a
            href={siteConfig.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 bg-[color:var(--color-teal)] px-5 text-[11px] font-bold uppercase tracking-[0.15em] text-[color:var(--color-cream)] transition hover:bg-[color:var(--color-orange)] xl:flex"
          >
            Contact
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>

          <button
            type="button"
            className="inline-flex h-14 w-14 items-center justify-center border-l border-[color:var(--color-slate)]/14 text-[color:var(--color-slate)] lg:hidden"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </Container>

      {mobileOpen ? (
        <div className="border-t border-[color:var(--color-slate)]/14 bg-[color:var(--color-background)] lg:hidden">
          <Container className="py-4">
            <nav
              aria-label="Mobile navigation"
              className="border-t border-[color:var(--color-slate)]/16"
            >
              {siteConfig.nav.map((item, index) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname?.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={clsx(
                      "flex items-center justify-between border-b border-[color:var(--color-slate)]/14 py-3.5 text-sm font-semibold",
                      active
                        ? "text-[color:var(--color-orange)]"
                        : "text-[color:var(--color-slate)]/74",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    <span>{item.label}</span>
                    <span className="font-mono text-[10px] opacity-50">
                      0{index + 1}
                    </span>
                  </Link>
                );
              })}
              <a
                href={siteConfig.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 bg-[color:var(--color-teal)] px-4 py-3 text-sm font-bold text-[color:var(--color-cream)]"
              >
                Contact Daniel
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </nav>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
