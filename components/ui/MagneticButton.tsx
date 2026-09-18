"use client";

import Link from "next/link";
import { useRef, type MouseEvent as ReactMouseEvent, type ReactNode } from "react";

/**
 * A small, controlled cursor-lean for primary CTAs — the button and its
 * label nudge toward the cursor within their own bounds, then spring
 * back on leave. This is an ORIGINAL AFTER SIN interaction, not a port
 * of any reference site: a live inspection of Shihiko's actual CSS/JS
 * (its black CTA button specifically) found a corner-bracket + color
 * fill-sweep reveal, not cursor-position tracking — no magnetic
 * translate exists on the button that inspired this request. This
 * component instead builds the "premium/physical/restrained" quality
 * the brief asked for as AFTER SIN's own thing.
 *
 * Desktop fine-pointer only (checked live via matchMedia, not just
 * screen width — a touch laptop still shouldn't get this). Reduced
 * motion and touch both fall through to the button's own normal
 * hover/active/focus-visible styling untouched.
 *
 * The ref/handler logic is duplicated between the two exported
 * components rather than shared via a custom hook: a hook returning
 * `{ ref, onMouseMove, ... }` as one object defeats the
 * react-hooks/refs lint rule's ability to verify each ref usage is
 * safe, flagging every property access on it as a render-time ref
 * read even though nothing here actually reads `.current` outside an
 * event handler.
 */
const OUTER_RANGE = 8; // px, outer container's max lean
const INNER_RANGE = 4; // px, label's max lean — slightly less, for depth
const RETURN_TRANSITION = "transform 560ms cubic-bezier(0.16, 1, 0.3, 1)";

function canLean() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

interface SharedProps {
  className?: string;
  children: ReactNode;
}

export function MagneticButton({
  href,
  className = "",
  children,
  ...rest
}: SharedProps & { href: string } & Omit<React.ComponentPropsWithoutRef<typeof Link>, "href" | "className" | "children">) {
  const outerRef = useRef<HTMLAnchorElement | null>(null);
  const innerRef = useRef<HTMLSpanElement | null>(null);
  const frame = useRef<number | null>(null);
  const tracking = useRef(false);

  function onMouseEnter() {
    if (!canLean()) return;
    tracking.current = true;
    if (outerRef.current) outerRef.current.style.transition = "none";
    if (innerRef.current) innerRef.current.style.transition = "none";
  }

  function onMouseMove(e: ReactMouseEvent) {
    if (!tracking.current || !outerRef.current) return;
    const rect = outerRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      if (outerRef.current) {
        outerRef.current.style.transform = `translate3d(${relX * OUTER_RANGE * 2}px, ${relY * OUTER_RANGE * 2}px, 0)`;
      }
      if (innerRef.current) {
        innerRef.current.style.transform = `translate3d(${relX * INNER_RANGE * 2}px, ${relY * INNER_RANGE * 2}px, 0)`;
      }
    });
  }

  function onMouseLeave() {
    tracking.current = false;
    if (frame.current) cancelAnimationFrame(frame.current);
    if (outerRef.current) {
      outerRef.current.style.transition = RETURN_TRANSITION;
      outerRef.current.style.transform = "translate3d(0, 0, 0)";
    }
    if (innerRef.current) {
      innerRef.current.style.transition = RETURN_TRANSITION;
      innerRef.current.style.transform = "translate3d(0, 0, 0)";
    }
  }

  return (
    <Link
      ref={outerRef}
      href={href}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`will-change-transform ${className}`}
      {...rest}
    >
      <span ref={innerRef} className="inline-block will-change-transform">
        {children}
      </span>
    </Link>
  );
}

export function MagneticSubmitButton({
  className = "",
  children,
  ...rest
}: SharedProps & Omit<React.ComponentPropsWithoutRef<"button">, "className" | "children">) {
  const outerRef = useRef<HTMLButtonElement | null>(null);
  const innerRef = useRef<HTMLSpanElement | null>(null);
  const frame = useRef<number | null>(null);
  const tracking = useRef(false);

  function onMouseEnter() {
    if (!canLean()) return;
    tracking.current = true;
    if (outerRef.current) outerRef.current.style.transition = "none";
    if (innerRef.current) innerRef.current.style.transition = "none";
  }

  function onMouseMove(e: ReactMouseEvent) {
    if (!tracking.current || !outerRef.current) return;
    const rect = outerRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      if (outerRef.current) {
        outerRef.current.style.transform = `translate3d(${relX * OUTER_RANGE * 2}px, ${relY * OUTER_RANGE * 2}px, 0)`;
      }
      if (innerRef.current) {
        innerRef.current.style.transform = `translate3d(${relX * INNER_RANGE * 2}px, ${relY * INNER_RANGE * 2}px, 0)`;
      }
    });
  }

  function onMouseLeave() {
    tracking.current = false;
    if (frame.current) cancelAnimationFrame(frame.current);
    if (outerRef.current) {
      outerRef.current.style.transition = RETURN_TRANSITION;
      outerRef.current.style.transform = "translate3d(0, 0, 0)";
    }
    if (innerRef.current) {
      innerRef.current.style.transition = RETURN_TRANSITION;
      innerRef.current.style.transform = "translate3d(0, 0, 0)";
    }
  }

  return (
    <button
      ref={outerRef}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`will-change-transform ${className}`}
      {...rest}
    >
      <span ref={innerRef} className="inline-block will-change-transform">
        {children}
      </span>
    </button>
  );
}
