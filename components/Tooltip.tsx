"use client";

import clsx from "clsx";
import type { HTMLAttributes, ReactElement } from "react";
import { cloneElement, useId, useState } from "react";

type TooltipProps = {
  content: string;
  children: ReactElement<HTMLAttributes<HTMLElement>>;
  placement?: "top" | "bottom";
};

const Tooltip = ({
  content,
  children,
  placement = "top"
}: TooltipProps): JSX.Element => {
  const [open, setOpen] = useState(false);
  const tooltipId = useId();

  const handleShow = () => setOpen(true);
  const handleHide = () => setOpen(false);

  const trigger = cloneElement(children, {
    ...children.props,
    "aria-describedby": tooltipId,
    onFocus: (event) => {
      children.props.onFocus?.(event);
      handleShow();
    },
    onBlur: (event) => {
      children.props.onBlur?.(event);
      handleHide();
    },
    onMouseEnter: (event) => {
      children.props.onMouseEnter?.(event);
      handleShow();
    },
    onMouseLeave: (event) => {
      children.props.onMouseLeave?.(event);
      handleHide();
    }
  });

  return (
    <span className="relative inline-flex">
      {trigger}
      <span
        role="tooltip"
        id={tooltipId}
        className={clsx(
          "pointer-events-none absolute z-50 min-w-[12rem] rounded-lg border border-[#2C4F52]/15 bg-[#F2E3D5] px-3 py-2 text-xs text-[#2C4F52] shadow-soft transition",
          placement === "top" ? "bottom-full mb-2" : "top-full mt-2",
          open
            ? "translate-y-0 opacity-100"
            : placement === "top"
              ? "translate-y-1 opacity-0"
              : "-translate-y-1 opacity-0"
        )}
        aria-hidden={!open}
      >
        {content}
      </span>
    </span>
  );
};

export default Tooltip;
