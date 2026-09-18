"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef, MouseEvent, ReactNode } from "react";
import { useTransitionLinkProps } from "@/context/PageTransitionContext";

/**
 * A solid-fill CTA whose fill wipes away on hover to reveal a bordered,
 * transparent state — adapted from Shihiko's real "VIEW ALL" button
 * (live-inspected via its actual CSS, not guessed from a screenshot):
 * a `::before` layer scales from 1 to 0 on one edge, the label text
 * rolls up-and-back-in via two chained keyframes, and four corner
 * marks (drawn here as small bordered spans, not Shihiko's background-
 * gradient technique) grow slightly. All colors/typography are
 * AFTER SIN's own — see .editorial-cta in globals.css for the
 * mechanics, which are pure CSS (:hover/:focus-visible), so touch and
 * prefers-reduced-motion both need no special-casing here.
 */
function CornerMarks() {
  return (
    <>
      <span className="editorial-cta__corner editorial-cta__corner--tl" aria-hidden />
      <span className="editorial-cta__corner editorial-cta__corner--tr" aria-hidden />
      <span className="editorial-cta__corner editorial-cta__corner--bl" aria-hidden />
      <span className="editorial-cta__corner editorial-cta__corner--br" aria-hidden />
    </>
  );
}

interface SharedProps {
  className?: string;
  children: ReactNode;
  /** "dark" = off-black fill / bone text (default). "light" = bone fill / off-black text, for CTAs over dark photography. */
  tone?: "dark" | "light";
}

export function EditorialButton({
  href,
  className = "",
  tone = "dark",
  children,
  onClick,
  ...rest
}: SharedProps & { href: string } & Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "className" | "children">) {
  // Real world/collection navigation — routes through the cover→reveal
  // transition (see context/PageTransitionContext.tsx). Modifier-clicks,
  // middle-click, and right-click all fall through untouched.
  const transitionProps = useTransitionLinkProps(href);
  return (
    <Link
      href={href}
      data-tone={tone}
      className={`editorial-cta ${className}`}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e);
        transitionProps.onClick(e);
      }}
      {...rest}
    >
      <span className="editorial-cta__fill" aria-hidden />
      <CornerMarks />
      <span className="editorial-cta__label flex h-full w-full items-center justify-center px-7">
        <span className="editorial-cta__text text-sm tracking-[0.08em]">{children}</span>
      </span>
    </Link>
  );
}

export function EditorialSubmitButton({
  className = "",
  tone = "dark",
  children,
  ...rest
}: SharedProps & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">) {
  return (
    <button data-tone={tone} className={`editorial-cta ${className}`} {...rest}>
      <span className="editorial-cta__fill" aria-hidden />
      <CornerMarks />
      <span className="editorial-cta__label flex h-full w-full items-center justify-center px-7">
        <span className="editorial-cta__text text-sm tracking-[0.08em]">{children}</span>
      </span>
    </button>
  );
}
