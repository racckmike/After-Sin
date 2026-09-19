"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Fades + rises content into view once as it scrolls into the viewport.
 * Never wrap above-the-fold / LCP content in this (e.g. the hero image) —
 * it starts invisible until the observer fires, which is the wrong trade
 * for anything that should paint immediately. `prefers-reduced-motion` is
 * handled globally in globals.css (zeroes transition-duration), so no
 * extra check is needed here.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
