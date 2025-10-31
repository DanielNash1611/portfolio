"use client";

import * as React from "react";
import {
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  shift,
  useDismiss,
  useFocus,
  useFloating,
  useHover,
  useInteractions,
  useRole,
  arrow as floatingArrow
} from "@floating-ui/react";
import type { Placement } from "@floating-ui/react";

type TooltipProps = {
  children: React.ReactElement;
  content: React.ReactNode;
  placement?: Placement;
  delay?: number;
  className?: string;
};

export default function Tooltip({
  children,
  content,
  placement = "top",
  delay = 150,
  className = ""
}: TooltipProps): JSX.Element {
  const [open, setOpen] = React.useState(false);
  const arrowRef = React.useRef<HTMLDivElement | null>(null);
  const tooltipId = React.useId();

  const { refs, floatingStyles, context, middlewareData, update } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    middleware: [
      offset(8),
      flip({ fallbackAxisSideDirection: "start" }),
      shift({ padding: 6 }),
      floatingArrow({ element: arrowRef })
    ],
    whileElementsMounted: autoUpdate
  });

  const hover = useHover(context, { move: false, delay });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role
  ]);

  React.useEffect(() => {
    if (open) {
      update();
    }
  }, [open, update]);

  const prefersReducedMotion = React.useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const trigger = React.cloneElement(children, {
    ref: refs.setReference,
    ...getReferenceProps(children.props),
    "aria-describedby": open ? tooltipId : undefined
  });

  const staticSide = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right"
  }[context.placement.split("-")[0]] as "top" | "right" | "bottom" | "left";

  const arrowX = middlewareData.arrow?.x ?? 0;
  const arrowY = middlewareData.arrow?.y ?? 0;

  return (
    <>
      {trigger}
      <FloatingPortal>
        {open ? (
          <div
            id={tooltipId}
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className={`z-[9999] max-w-xs select-none rounded-lg bg-slate-900 px-3 py-2 text-sm text-white shadow-lg ring-1 ring-black/10 ${className}`}
          >
            <div
              ref={arrowRef}
              className="absolute h-2 w-2 rotate-45 bg-slate-900"
              style={{
                left: arrowX != null ? `${arrowX}px` : "",
                top: arrowY != null ? `${arrowY}px` : "",
                [staticSide]: "-4px"
              }}
              aria-hidden="true"
            />
            <div className={prefersReducedMotion ? undefined : "animate-tooltip-fade"}>
              {content}
            </div>
          </div>
        ) : null}
      </FloatingPortal>
    </>
  );
}
