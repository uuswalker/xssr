"use client";

import { ReactNode } from "react";

export default function ScrollReveal({
  children,
}: {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}) {
  return <>{children}</>;
}
