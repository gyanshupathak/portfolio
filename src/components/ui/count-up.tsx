"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

/**
 * Counts the number inside `value` up from zero the first time it scrolls
 * into view, keeping any prefix and suffix (so "250+" counts 0+ … 250+).
 * The final value is what is rendered on the server and for reduced motion.
 */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const node = ref.current;
    const match = /^(\D*)(\d+)(.*)$/.exec(value);
    if (!inView || reducedMotion || !node || !match) return;

    const [, prefix, digits, suffix] = match;
    const controls = animate(0, Number(digits), {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (current) => {
        node.textContent = `${prefix}${Math.round(current)}${suffix}`;
      },
    });
    return () => {
      controls.stop();
      node.textContent = value;
    };
  }, [inView, reducedMotion, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
    </span>
  );
}
