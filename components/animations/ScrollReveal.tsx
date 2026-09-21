"use client";

import { ReactNode, useEffect, useRef } from "react";

export default function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
}: {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }

    const offsets: Record<string, string> = {
      up:    "translateY(36px)",
      down:  "translateY(-36px)",
      left:  "translateX(36px)",
      right: "translateX(-36px)",
    };

    el.style.opacity = "0";
    el.style.transform = offsets[direction];
    el.style.transition = `opacity 0.55s ease ${delay}s, transform 0.55s ease ${delay}s`;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "none";
          obs.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "-40px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay, direction]);

  return <div ref={ref}>{children}</div>;
}
