"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useTransitionLinkProps, type TransitionTone } from "@/context/PageTransitionContext";

/**
 * The site's secondary/editorial navigation pattern — restrained text
 * over a conventional button. The label stays put; only the arrow
 * moves on hover, per the brand's "physical, not decorative" motion
 * rule.
 */
export function ArrowLink({
  href,
  children,
  tone = "dark",
  className = "",
}: {
  href: string;
  children: ReactNode;
  tone?: TransitionTone;
  className?: string;
}) {
  const transitionProps = useTransitionLinkProps(href, tone);
  return (
    <Link
      href={href}
      className={`eyebrow group inline-flex items-center gap-1.5 ${className}`}
      {...transitionProps}
    >
      <span className="underline underline-offset-4">{children}</span>
      <span
        aria-hidden
        className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1.5"
      >
        →
      </span>
    </Link>
  );
}
