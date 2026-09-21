"use client";

import { useEffect, useRef, useState } from "react";

export default function NumberCounter({
  value,
  prefix = "",
  suffix = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let startTime: number | null = null;
    const duration = 600; // 0.6 seconds - very fast
    let animationFrame: number;

    const easeOutExpo = (t: number) => {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = easeOutExpo(progress);
      
      const currentVal = Math.round(eased * value);
      setVal(currentVal);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setVal(value);
      }
    };

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animationFrame = requestAnimationFrame(animate);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);

    return () => {
      obs.disconnect();
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [value]);

  return (
    <span ref={ref}>
      {prefix}
      {val === 0 ? "0" : Intl.NumberFormat("id-ID").format(val)}
      {suffix}
    </span>
  );
}
