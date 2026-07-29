import type { ReactNode } from "react";
import clsx from "clsx";

type MotionRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
};

export default function MotionReveal({
  children,
  className,
  delay = 0,
}: MotionRevealProps): JSX.Element {
  return (
    <div
      className={clsx("motion-reveal", className)}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}
