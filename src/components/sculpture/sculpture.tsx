"use client";

import { useMotionValueEvent, type MotionValue } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState, type RefObject } from "react";
import { site } from "@/content/site";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { createStore, useStore } from "@/lib/create-store";
import { useTheme } from "@/lib/theme";
import { introDone, shaderPaused } from "@/lib/ui-state";
import { createSculptureEngine, type SculptureEngine } from "./sculpture-engine";

const { portrait } = site.hero;

/** True while the live scene is drawing, so the still version can step aside. */
const liveScene = createStore(false);

/** The card is 4:5; this places the full photo so only the configured crop shows. */
const FRAME_ASPECT = 4 / 5;
const scale = 1 / portrait.crop.width;
const cropStyle = {
  width: `${scale * 100}%`,
  left: `${-portrait.crop.x * scale * 100}%`,
  top: `${-portrait.crop.y * (portrait.height / portrait.width) * scale * FRAME_ASPECT * 100}%`,
};

/**
 * The still version of the scene, filling the card slot: the photo on a
 * tilted card with orange spheres around it. Shown until the 3D scene is
 * drawing, and instead of it for reduced motion or without WebGL2.
 */
export function SculptureStill({ available }: { available: boolean }) {
  const live = useStore(liveScene);
  const sphere =
    "absolute rounded-full bg-[radial-gradient(circle_at_32%_28%,#ffd0b0_0%,#ff4f00_38%,#b83800_100%)] shadow-[0_30px_60px_-20px_rgb(255_79_0/0.55)]";
  return (
    <div
      className={`absolute inset-0 perspective-[1400px] transition-opacity duration-700 ${live ? "opacity-0" : "opacity-100"}`}
    >
      <div className="absolute top-1/2 left-1/2 aspect-[4/5] max-h-[94%] max-w-[94%] -translate-x-1/2 -translate-y-1/2 [height:94%]">
        <div className="relative size-full overflow-hidden rounded-[1.25rem] bg-sand shadow-[0_40px_90px_-30px_rgb(0_0_0/0.45)] [transform:rotateY(-12deg)_rotateX(3deg)]">
          {available ? (
            <Image
              src={portrait.src}
              alt={portrait.alt}
              width={portrait.width}
              height={portrait.height}
              sizes="(min-width: 1024px) 560px, 90vw"
              loading="eager"
              fetchPriority="high"
              style={cropStyle}
              className="absolute h-auto max-w-none"
            />
          ) : (
            <div className="hatch flex size-full items-center justify-center">
              <span className="display text-7xl text-ink">{site.monogram}</span>
            </div>
          )}
        </div>
      </div>
      <span className={`${sphere} top-[4%] left-[2%] size-[16%]`} />
      <span className={`${sphere} right-[2%] bottom-[8%] size-[22%]`} />
      <span className={`${sphere} top-[10%] right-[12%] size-[8%]`} />
    </div>
  );
}

/**
 * The live hero scene, covering its positioned parent: the portrait on a 3D
 * card placed over `anchorRef`, with glossy orange blobs roaming the whole
 * area and melting together around it. Rendered with WebGL2.
 */
export function SculptureCanvas({
  available,
  anchorRef,
  scrollProgress,
}: {
  available: boolean;
  anchorRef: RefObject<HTMLElement | null>;
  scrollProgress: MotionValue<number>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<SculptureEngine | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  const paused = useStore(shaderPaused);
  const started = useStore(introDone);
  const theme = useTheme();
  const reducedMotion = usePrefersReducedMotion();
  const live = started && !reducedMotion && !failed;

  useEffect(() => {
    const canvas = canvasRef.current;
    const anchor = anchorRef.current;
    if (!live || !canvas || !anchor) return;
    const engine = createSculptureEngine(canvas, {
      src: available ? portrait.src : null,
      crop: portrait.crop,
      anchor,
      paused: shaderPaused.get(),
      dark: document.documentElement.dataset.theme === "dark",
      onReady: () => setReady(true),
      onFail: () => setFailed(true),
    });
    if (!engine) {
      const id = requestAnimationFrame(() => setFailed(true));
      return () => cancelAnimationFrame(id);
    }
    engineRef.current = engine;
    engine.setScroll(scrollProgress.get());
    return () => {
      engine.destroy();
      engineRef.current = null;
      setReady(false);
    };
  }, [live, available, anchorRef, scrollProgress]);

  useEffect(() => {
    liveScene.set(live && ready);
  }, [live, ready]);

  useEffect(() => {
    engineRef.current?.setPaused(paused);
  }, [paused]);

  useEffect(() => {
    engineRef.current?.setDark(theme === "dark");
  }, [theme]);

  useMotionValueEvent(scrollProgress, "change", (value) => {
    engineRef.current?.setScroll(value);
  });

  if (!live) return null;
  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={portrait.alt}
      className={`pointer-events-none absolute inset-0 size-full transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
    />
  );
}
