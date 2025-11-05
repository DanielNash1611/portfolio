"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

type MainContainerProps = {
  children: ReactNode;
};

const HEADER_SELECTOR = '[data-site-header="true"]';

const MainContainer = ({ children }: MainContainerProps): JSX.Element => {
  const [headerHeight, setHeaderHeight] = useState<number | null>(null);

  useEffect(() => {
    const header = document.querySelector<HTMLElement>(HEADER_SELECTOR);
    if (!header) {
      return;
    }

    const updateHeight = () => {
      const currentHeader = document.querySelector<HTMLElement>(HEADER_SELECTOR);
      if (currentHeader) {
        setHeaderHeight(currentHeader.getBoundingClientRect().height);
      }
    };

    updateHeight();

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => updateHeight())
        : null;

    if (resizeObserver) {
      resizeObserver.observe(header);
    }

    window.addEventListener("resize", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
      resizeObserver?.disconnect();
    };
  }, []);

  return (
    <main
      id="main"
      style={headerHeight !== null ? { paddingTop: `${headerHeight}px` } : undefined}
      className="min-h-[60vh] scroll-mt-24 transition-all duration-300"
    >
      {children}
    </main>
  );
};

export default MainContainer;
