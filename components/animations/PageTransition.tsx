"use client";

import { HTMLMotionProps, motion } from "framer-motion";
import { ReactNode } from "react";

export default function PageTransition({ children, ...props }: HTMLMotionProps<"main"> & { children: ReactNode }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.main>
  );
}
