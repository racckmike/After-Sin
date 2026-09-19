"use client";

import { usePageTransition } from "@/context/PageTransitionContext";
import { SignatureMark } from "@/components/ui/SignatureMark";

/**
 * A solid surface that rises from the bottom edge and covers the
 * viewport — then, once the destination page is ready underneath it,
 * simply fades away in place rather than continuing to slide off
 * through the top. The destination page's own background is the same
 * color as this surface (bone for the light tone, matching the PDP's
 * real background), so the fade reads as "this panel became the new
 * page" rather than "a curtain passed over it and revealed something
 * else" — the two are meant to feel like one continuous surface, not
 * a cover-then-reveal effect.
 *
 * Purely transform/opacity-driven, so it never triggers layout, and
 * it's `pointer-events-none` at every phase so a stuck state (however
 * unlikely) can never trap the user.
 */
export function TransitionOverlay() {
  const { phase, tone } = usePageTransition();

  const positionClass =
    phase === "idle" ? "translate-y-full transition-none" : "translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]";

  const opacityClass =
    phase === "revealing"
      ? "opacity-0 transition-opacity duration-300 ease-out"
      : "opacity-100 transition-none";

  const markVisible = phase === "covering" || phase === "waiting";
  const isLight = tone === "light";

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-[90] flex items-center justify-center ${isLight ? "bg-bone" : "bg-off-black"} ${positionClass} ${opacityClass}`}
    >
      <div className={`transition-opacity duration-300 ${markVisible ? "opacity-100 delay-150" : "opacity-0"}`}>
        <SignatureMark tone={isLight ? "light" : "dark"} size={28} />
      </div>
    </div>
  );
}
