"use client";

import clsx from "clsx";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/content/portfolio";
import Container from "@/components/site/Container";

export default function SiteHeader(): JSX.Element {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };

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
        "fixed inset-x-0 top-0 z-50 transition duration-300",
        scrolled
          ? "border-b border-black/6 bg-[color:var(--color-background)]/82 shadow-[0_8px_24px_rgba(58,61,64,0.05)] backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <Container>
        <div className="flex min-w-0 items-center justify-between gap-3 py-4 md:gap-4 md:py-5">
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <Link
            href="/"
            className="shrink-0 whitespace-nowrap text-base font-semibold tracking-tight text-[color:var(--color-slate)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-cream)] sm:text-lg"
          >
            Daniel Nash
          </Link>

          <nav
            aria-label="Primary navigation"
            className="hidden min-w-0 flex-1 items-center justify-center gap-1.5 lg:flex xl:gap-2"
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
                    "whitespace-nowrap rounded-full px-3 py-2 text-[13px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-cream)] xl:px-4 xl:text-sm",
                    active
                      ? "bg-[color:var(--color-teal)] text-[color:var(--color-cream)]"
                      : "text-[color:var(--color-slate)]/74 hover:bg-white/72 hover:text-[color:var(--color-slate)]",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden xl:block">
            <a
              href={siteConfig.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center whitespace-nowrap rounded-full border border-[color:var(--color-teal)] bg-[color:var(--color-teal)] px-4 py-2 text-sm font-semibold text-[color:var(--color-cream)] transition hover:bg-[color:var(--color-slate)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-cream)]"
            >
              Contact
            </a>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--color-teal)]/14 bg-white/72 text-[color:var(--color-slate)] lg:hidden"
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
        <div className="border-t border-black/6 bg-[color:var(--color-background)]/96 lg:hidden">
          <Container className="py-4">
            <nav aria-label="Mobile navigation" className="flex flex-col gap-2">
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
                      "rounded-[1rem] px-4 py-3 text-sm font-medium transition",
                      active
                        ? "bg-[color:var(--color-teal)] text-[color:var(--color-cream)]"
                        : "bg-white/72 text-[color:var(--color-slate)]/74 hover:bg-white",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <a
                href={siteConfig.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center justify-center rounded-[1rem] border border-[color:var(--color-teal)] bg-[color:var(--color-teal)] px-4 py-3 text-sm font-semibold text-[color:var(--color-cream)]"
              >
                Contact
              </a>
            </nav>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
