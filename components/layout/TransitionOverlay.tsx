"use client";

import { usePageTransition } from "@/context/PageTransitionContext";
import { SignatureMark } from "@/components/ui/SignatureMark";

/**
 * A full-screen layer that sweeps up to cover the viewport, holds
 * briefly while the destination route mounts, then continues the same
 * upward sweep off through the top — a single continuous pass, not a
 * cut-and-fade. Purely transform-driven (translateY), so it never
 * triggers layout, and it's `pointer-events-none` at every phase so a
 * stuck state (however unlikely) can never trap the user.
 */
export function TransitionOverlay() {
  const { phase, tone } = usePageTransition();

  const stateClass =
    phase === "covering"
      ? "translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.7,0,0.2,1)]"
      : phase === "waiting"
        ? "translate-y-0 transition-none"
        : phase === "revealing"
          ? "-translate-y-full transition-transform duration-[480ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          : "translate-y-full transition-none";

  const markVisible = phase === "covering" || phase === "waiting";
  const isLight = tone === "light";

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-[90] flex items-center justify-center ${isLight ? "bg-bone" : "bg-off-black"} ${stateClass}`}
    >
      <div className={`transition-opacity duration-300 ${markVisible ? "opacity-100 delay-150" : "opacity-0"}`}>
        <SignatureMark tone={isLight ? "light" : "dark"} size={28} />
      </div>
    </div>
  );
}
