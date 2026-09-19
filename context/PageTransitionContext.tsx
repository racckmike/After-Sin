"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";

/**
 * A solid surface rises from the bottom edge, covers the viewport, and
 * — once the destination page has mounted underneath it — fades away
 * in place rather than continuing to slide off. The surface's color
 * matches the destination page's own background, so it's meant to
 * read as "this panel became the new page," not "a curtain passed
 * over and revealed something else underneath." Reserved for real
 * navigation: product cards, Shop Drop, Shop by World, Read the
 * story; transactional actions (Add to Bag, Checkout, form submits)
 * never touch this.
 *
 * Real Shihiko interactions were live-inspected before building this
 * (network + performance.getEntriesByType('navigation') on actual
 * clicks — product cards, quick-add, gallery, cart drawer, "see it in
 * action" videos — not a screenshot guess): all of it is either a
 * plain full-page reload or an instant swap, no comparable rising
 * surface. This is an original AFTER SIN interaction.
 *
 * Navigation itself is never gated on the animation: router.push()
 * fires immediately when covering starts, and a hard failsafe timer
 * force-resets state if a route change never lands — see `reset`.
 */
export type TransitionPhase = "idle" | "covering" | "waiting" | "revealing";
export type TransitionTone = "dark" | "light";

interface PageTransitionContextValue {
  phase: TransitionPhase;
  tone: TransitionTone;
  navigate: (href: string, tone?: TransitionTone) => void;
}

const PageTransitionContext = createContext<PageTransitionContextValue | null>(null);

const COVER_MS = 500; // matches TransitionOverlay's rise duration
const REVEAL_MS = 300; // matches TransitionOverlay's in-place fade-out duration
const FAILSAFE_MS = 2500;

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const [tone, setTone] = useState<TransitionTone>("dark");

  const targetPathname = useRef<string | null>(null);
  const coverDone = useRef(false);
  const routeReady = useRef(false);
  const failsafeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const coverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pinning = useRef(false);

  // This project's navigations — even a completely plain, un-intercepted
  // <Link> click with none of this transition system involved — land at
  // a nonzero scroll offset instead of the top (confirmed by testing a
  // bare header nav link in isolation: a pre-existing site-wide App
  // Router scroll-restoration issue, not something this feature
  // introduced). A single scrollTo(0,0), or even several fired on a
  // timer, aren't enough to win — whatever sets the wrong offset does
  // so asynchronously and inconsistently. Reacting to the actual
  // `scroll` event and re-correcting instantly, for as long as the
  // overlay is opaque, wins regardless of when or how many times it
  // happens, since it responds to the real event instead of guessing
  // its timing.
  const onScroll = useCallback(() => {
    if (!pinning.current) return;
    if (window.scrollY !== 0 || window.scrollX !== 0) window.scrollTo(0, 0);
  }, []);

  const startPinning = useCallback(() => {
    pinning.current = true;
    window.scrollTo(0, 0);
    window.addEventListener("scroll", onScroll, { passive: true });
  }, [onScroll]);

  const stopPinning = useCallback(() => {
    pinning.current = false;
    window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const clearTimers = useCallback(() => {
    if (failsafeTimer.current) clearTimeout(failsafeTimer.current);
    if (coverTimer.current) clearTimeout(coverTimer.current);
    if (revealTimer.current) clearTimeout(revealTimer.current);
  }, []);

  // The browser's own native scroll restoration ("auto") fights with
  // App Router's history entries here — after a transitioned
  // navigation the destination was landing at the OLD page's scroll
  // offset instead of the top, because something (the browser, not
  // Next) was restoring it after our own reset ran. Taking manual
  // control is the standard fix for SPA-style routing owning its own
  // scroll behavior.
  useEffect(() => {
    const previous = history.scrollRestoration;
    history.scrollRestoration = "manual";
    return () => {
      history.scrollRestoration = previous;
    };
  }, []);

  const reset = useCallback(() => {
    clearTimers();
    stopPinning();
    // Unconditional final safety net regardless of how we got here.
    window.scrollTo(0, 0);
    targetPathname.current = null;
    coverDone.current = false;
    routeReady.current = false;
    document.documentElement.style.overflowAnchor = "";
    setPhase("idle");
  }, [clearTimers, stopPinning]);

  const maybeReveal = useCallback(() => {
    if (!coverDone.current || !routeReady.current) return;
    if (failsafeTimer.current) clearTimeout(failsafeTimer.current);
    stopPinning();
    window.scrollTo(0, 0);
    setPhase("revealing");
    revealTimer.current = setTimeout(reset, REVEAL_MS + 60);
  }, [reset, stopPinning]);

  // The destination route has actually mounted once `pathname` matches
  // what we navigated to — that's the real "ready" signal, independent
  // of how long the fetch/render took.
  useEffect(() => {
    if (targetPathname.current && pathname === targetPathname.current) {
      routeReady.current = true;
      maybeReveal();
    }
  }, [pathname, maybeReveal]);

  const navigate = useCallback(
    (href: string, requestedTone: TransitionTone = "dark") => {
      if (phase !== "idle") return; // a transition is already in flight — ignore re-entrant clicks

      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        router.push(href);
        return;
      }

      let path: string;
      try {
        path = new URL(href, window.location.origin).pathname;
      } catch {
        path = href;
      }
      if (path === pathname) {
        router.push(href);
        return;
      }

      targetPathname.current = path;
      coverDone.current = false;
      routeReady.current = false;
      document.documentElement.style.overflowAnchor = "none";
      setTone(requestedTone);
      startPinning();
      setPhase("covering");
      router.push(href);

      coverTimer.current = setTimeout(() => {
        coverDone.current = true;
        setPhase((p) => (p === "covering" ? "waiting" : p));
        maybeReveal();
      }, COVER_MS);

      failsafeTimer.current = setTimeout(reset, FAILSAFE_MS);
    },
    [phase, pathname, router, maybeReveal, reset, startPinning]
  );

  useEffect(() => {
    return () => {
      clearTimers();
      stopPinning();
    };
  }, [clearTimers, stopPinning]);

  return (
    <PageTransitionContext.Provider value={{ phase, tone, navigate }}>
      {children}
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  const ctx = useContext(PageTransitionContext);
  if (!ctx) throw new Error("usePageTransition must be used within PageTransitionProvider");
  return ctx;
}

/** Spread onto any internal `<Link>` to route its click through the
    transition — preserves modifier-clicks, middle-click, and right-click
    (only a genuine plain left click is intercepted). `tone` picks the
    overlay color: "dark" (default) for CTAs over photography/dark
    sections, "light" for product cards on the bone-background shop grid
    landing on the PDP's own light background. */
export function useTransitionLinkProps(href: string, tone: TransitionTone = "dark") {
  const { navigate } = usePageTransition();
  return {
    onClick: (e: React.MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      navigate(href, tone);
    },
  };
}
