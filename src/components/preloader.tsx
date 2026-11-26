"use client";

import { animate, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { introDone } from "@/lib/ui-state";

const EASE_IN_OUT_EXPO = [0.87, 0, 0.13, 1] as const;
const COUNT_SECONDS = 1.7;

/**
 * Opening screen: a timecode counts to 100 while an orange bar fills, then
 * the screen splits into two shutters that open top and bottom.
 *
 * It renders on the server so it covers the page from the first paint. A
 * CSS animation removes it after a few seconds even if scripts never run,
 * and it is skipped outright for visitors who prefer reduced motion.
 */
export function Preloader() {
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [phase, setPhase] = useState<"count" | "open" | "gone">("count");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      introDone.set(true);
      const id = requestAnimationFrame(() => setPhase("gone"));
      return () => cancelAnimationFrame(id);
    }
    const controls = animate(0, 100, {
      duration: COUNT_SECONDS,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (value) => {
        const rounded = Math.round(value);
        if (counterRef.current) counterRef.current.textContent = String(rounded).padStart(3, "0");
        if (barRef.current) barRef.current.style.transform = `scaleX(${value / 100})`;
      },
      onComplete: () => {
        setPhase("open");
        introDone.set(true);
      },
    });
    return () => controls.stop();
  }, []);

  if (phase === "gone") return null;
  const opening = phase === "open";
  const shutter = {
    duration: 1.05,
    ease: EASE_IN_OUT_EXPO,
  };

  return (
    <div aria-hidden className="preloader pointer-events-none fixed inset-0 z-[100]">
      <motion.div
        initial={false}
        animate={{ y: opening ? "-100%" : 0 }}
        transition={shutter}
        onAnimationComplete={() => {
          if (opening) setPhase("gone");
        }}
        className="absolute inset-x-0 top-0 h-1/2 bg-paper"
      />
      <motion.div
        initial={false}
        animate={{ y: opening ? "100%" : 0 }}
        transition={shutter}
        className="absolute inset-x-0 bottom-0 h-1/2 bg-paper"
      />

      <motion.div
        initial={false}
        animate={{ opacity: opening ? 0 : 1, scale: opening ? 0.96 : 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10"
      >
        <div className="label flex justify-between text-ink-faint">
          <span>{site.name}</span>
          <span className="flex items-center gap-2">
            <span className="size-2 animate-blink rounded-full bg-signal" />
            Rec
          </span>
        </div>

        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="label text-ink-faint">Loading the edit</p>
            <p className="mt-3 font-mono text-sm text-ink-muted">TC 00:00:00:00</p>
          </div>
          <span className="display text-[clamp(6rem,22vw,17rem)] leading-[0.78] text-ink tabular-nums">
            <span ref={counterRef}>000</span>
            <span className="text-signal">%</span>
          </span>
        </div>

        <span className="absolute inset-x-0 bottom-0 h-[3px] bg-hairline">
          <span
            ref={barRef}
            className="block h-full origin-left scale-x-0 bg-signal"
          />
        </span>
      </motion.div>
    </div>
  );
}
