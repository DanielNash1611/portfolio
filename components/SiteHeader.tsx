"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/products/launchmuse", label: "LaunchMuse", group: "products" },
  { href: "/music", label: "Music" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

const productLinks = [
  { href: "/products/launchmuse", label: "LaunchMuse" }
];

const SiteHeader = (): JSX.Element => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [productMenuOpen, setProductMenuOpen] = useState(false);
  const productMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenuOpen(false);
    setProductMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        productMenuRef.current &&
        !productMenuRef.current.contains(event.target as Node)
      ) {
        setProductMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-brand-slate/10 bg-brand-cream/90 backdrop-blur">
      <div className="container flex items-center justify-between py-4">
        <Link
          href="/"
          className="text-lg font-semibold text-brand-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-brand-cream"
        >
          Daniel Nash
        </Link>
        <nav
          aria-label="Main navigation"
          className="hidden md:flex md:items-center md:gap-6"
        >
          {links
            .filter((link) => link.group !== "products")
            .map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "rounded-xl px-3 py-2 text-sm font-medium transition hover:text-brand-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-brand-cream",
                    isActive
                      ? "bg-brand-teal/10 text-brand-teal"
                      : "text-brand-slate"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          <div className="relative" ref={productMenuRef}>
            <button
              type="button"
              className={clsx(
                "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition hover:text-brand-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-brand-cream",
                pathname?.startsWith("/products")
                  ? "bg-brand-teal/10 text-brand-teal"
                  : "text-brand-slate"
              )}
              onClick={() => setProductMenuOpen((prev) => !prev)}
              aria-haspopup="true"
              aria-expanded={productMenuOpen}
              aria-controls="products-menu"
            >
              Products
            </button>
            {productMenuOpen ? (
              <div
                id="products-menu"
                role="menu"
                className="absolute right-0 z-50 mt-2 w-48 rounded-2xl border border-brand-slate/10 bg-white p-2 shadow-soft"
              >
                {productLinks.map((product) => (
                  <Link
                    key={product.href}
                    role="menuitem"
                    href={product.href}
                    className="block rounded-xl px-3 py-2 text-sm text-brand-slate transition hover:bg-brand-teal/10 hover:text-brand-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                  >
                    {product.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </nav>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl border border-brand-slate/20 p-2 text-brand-slate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-brand-cream md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>
      <div
        id="mobile-menu"
        className={clsx(
          "md:hidden border-t border-brand-slate/10 bg-brand-cream/95 backdrop-blur",
          menuOpen ? "block" : "hidden"
        )}
      >
        <nav
          className="container flex flex-col gap-2 py-4"
          aria-label="Mobile navigation"
        >
          {links
            .filter((link) => link.group !== "products")
            .map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "rounded-xl px-3 py-2 text-base font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-brand-cream",
                  isActive
                    ? "bg-brand-teal/10 text-brand-teal"
                    : "text-brand-slate hover:text-brand-teal"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
            })}
          <div className="pt-2">
            <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand-teal/70">
              Products
            </p>
            {productLinks.map((product) => {
              const isActive = pathname?.startsWith(product.href);
              return (
                <Link
                  key={product.href}
                  href={product.href}
                  className={clsx(
                    "rounded-xl px-3 py-2 text-base font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-brand-cream",
                    isActive
                      ? "bg-brand-teal/10 text-brand-teal"
                      : "text-brand-slate hover:text-brand-teal"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {product.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default SiteHeader;
