"use client";

import clsx from "clsx";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/work", label: "Work" },
  { href: "/music", label: "Music" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

const desktopLinkClasses =
  "relative inline-flex items-center rounded-full px-4 py-2 text-sm transition focus-visible:outline-none focus-visible:ring focus-visible:ring-[#D17A5F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F2E3D5] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-center after:scale-x-0 after:rounded-full after:bg-[#2C4F52] after:transition-transform after:duration-200 hover:after:scale-x-100";

const mobileLinkClasses =
  "flex w-full justify-between rounded-full px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring focus-visible:ring-[#D17A5F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F2E3D5]";

export const Header = (): JSX.Element => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const closeMobileNav = () => {
    setMobileOpen(false);
  };

  return (
    <header
      data-scrolled={scrolled}
      className="sticky top-0 z-50 bg-transparent transition-all data-[scrolled=true]:backdrop-blur-md data-[scrolled=true]:bg-[rgba(242,227,213,0.7)] data-[scrolled=true]:ring-1 data-[scrolled=true]:ring-slate-200"
    >
      <div className="container flex items-center justify-between gap-4 py-4">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded-full focus:bg-[#2C4F52] focus:px-4 focus:py-2 focus:text-[#F2E3D5]"
        >
          Skip to main content
        </a>
        <Link
          href="/"
          className="text-lg font-semibold text-[#2C4F52] focus-visible:outline-none focus-visible:ring focus-visible:ring-[#D17A5F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F2E3D5]"
          onClick={closeMobileNav}
          aria-label="Go to Daniel Nash home"
        >
          Daniel Nash
        </Link>
        <nav className="hidden items-center gap-3 md:flex" aria-label="Primary navigation">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  desktopLinkClasses,
                  isActive
                    ? "font-semibold text-[#2C4F52] after:scale-x-100"
                    : "font-medium text-[#2C4F52]/90 hover:text-[#2C4F52]"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#3A3D40]/20 text-[#2C4F52] transition hover:text-[#2C4F52]/80 focus-visible:outline-none focus-visible:ring focus-visible:ring-[#D17A5F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F2E3D5] md:hidden"
          onClick={handleToggle}
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-primary-nav"
        >
          {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>
      <nav
        id="mobile-primary-nav"
        aria-label="Mobile primary navigation"
        className={clsx(
          "border-t border-[#3A3D40]/10 bg-[#F2E3D5] px-4 py-4 shadow-sm transition md:hidden",
          mobileOpen ? "block" : "hidden"
        )}
      >
        <ul className="flex flex-col gap-2">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={closeMobileNav}
                  className={clsx(
                    mobileLinkClasses,
                    isActive
                      ? "bg-[#2C4F52] font-semibold text-[#F2E3D5]"
                      : "bg-transparent font-medium text-[#2C4F52] hover:bg-[#2C4F52]/10"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span>{link.label}</span>
                  {isActive ? (
                    <span className="text-xs uppercase tracking-[0.2em] text-[#F2E3D5]">
                      Active
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
