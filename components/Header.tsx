"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";

const navLinks = [
  { href: "/work", label: "Work" },
  { href: "/music", label: "Music" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

const linkBaseClasses =
  "rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring focus-visible:ring-[#D17A5F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F2E3D5]";

export const Header = (): JSX.Element => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const closeMobileNav = () => {
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#3A3D40]/10 bg-[#F2E3D5]/95 backdrop-blur">
      <div className="container flex items-center justify-between gap-4 py-4">
        <Link
          href="/"
          className="text-lg font-semibold text-[#2C4F52] focus-visible:outline-none focus-visible:ring focus-visible:ring-[#D17A5F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F2E3D5]"
          onClick={closeMobileNav}
          aria-label="Go to Daniel Nash home"
        >
          Daniel Nash
        </Link>
        <nav className="hidden items-center gap-2 md:flex" aria-label="Primary">
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
                  linkBaseClasses,
                  isActive
                    ? "bg-[#2C4F52] text-[#F2E3D5]"
                    : "text-[#2C4F52] hover:bg-[#2C4F52]/10 hover:text-[#2C4F52]"
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
        aria-label="Mobile primary"
        className={clsx(
          "border-t border-[#3A3D40]/10 bg-[#F2E3D5] px-4 py-4 shadow-sm md:hidden",
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
                    linkBaseClasses,
                    "flex w-full justify-between",
                    isActive
                      ? "bg-[#2C4F52] text-[#F2E3D5]"
                      : "bg-transparent text-[#2C4F52] hover:bg-[#2C4F52]/10"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span>{link.label}</span>
                  {isActive ? (
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F2E3D5]">
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
