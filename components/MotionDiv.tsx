"use client";

import { motion, type MotionProps } from "framer-motion";
import type { ReactNode } from "react";

type MotionDivProps = MotionProps & {
  children: ReactNode;
  className?: string;
};

export function MotionDiv({ children, className, ...rest }: MotionDivProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export default MotionDiv;
