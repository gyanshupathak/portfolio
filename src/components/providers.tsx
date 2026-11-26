"use client";

import { ReactLenis } from "lenis/react";
import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

/**
 * App-wide client providers: smooth scrolling and motion preferences.
 *
 * Lenis stays mounted so the tree is stable, but its wheel smoothing is
 * switched off when the visitor prefers reduced motion, which leaves native
 * scrolling untouched. `MotionConfig` makes motion drop transform animations
 * for the same visitors.
 */
export function Providers({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis
        root
        // A small wheel step and a heavy glide, so each notch travels a short,
        // slow distance instead of jumping.
        options={{ lerp: 0.06, wheelMultiplier: 0.55, smoothWheel: !reduced, autoRaf: true }}
      >
        {children}
      </ReactLenis>
    </MotionConfig>
  );
}
