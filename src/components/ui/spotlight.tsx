"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import type { PointerEvent, ReactNode } from "react";

const SPRING = { stiffness: 150, damping: 22, mass: 0.6 };

/**
 * A container with a soft orange glow that follows the pointer inside it.
 * The glow is a fixed-size disc moved with transforms, so nothing repaints
 * its background on every move.
 */
export function Spotlight({
  children,
  className = "",
  size = 520,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  /** Glow diameter in pixels. */
  size?: number;
  as?: "div" | "section" | "article" | "li";
}) {
  const x = useMotionValue(-size);
  const y = useMotionValue(-size);
  const opacity = useMotionValue(0);
  const smoothX = useSpring(x, SPRING);
  const smoothY = useSpring(y, SPRING);
  const smoothOpacity = useSpring(opacity, { stiffness: 120, damping: 20 });

  function handleMove(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - size / 2);
    y.set(event.clientY - rect.top - size / 2);
    opacity.set(1);
  }

  return (
    <Tag
      onPointerMove={handleMove}
      onPointerLeave={() => opacity.set(0)}
      className={`relative isolate overflow-hidden ${className}`}
    >
      <motion.span
        aria-hidden
        style={{ x: smoothX, y: smoothY, opacity: smoothOpacity, width: size, height: size }}
        className="pointer-events-none absolute top-0 left-0 -z-10 rounded-full bg-[radial-gradient(circle,rgb(255_79_0/0.14),transparent_65%)]"
      />
      {children}
    </Tag>
  );
}
