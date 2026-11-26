import { useTransform, type MotionValue } from "motion/react";
import { usePrefersReducedMotion } from "./use-media-query";

/**
 * Maps scroll progress onto a style value, like `useTransform`, but holds
 * the value at `rest` for visitors who prefer reduced motion. The value
 * settles to `rest` as soon as the preference is known, so nothing is left
 * part-way through a scroll effect.
 */
export function useScrollLinked<T extends number | string>(
  progress: MotionValue<number>,
  input: number[],
  output: T[],
  rest: T,
): MotionValue<T> {
  const reducedMotion = usePrefersReducedMotion();
  return useTransform(progress, input, reducedMotion ? input.map(() => rest) : output);
}
