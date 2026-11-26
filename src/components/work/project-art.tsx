"use client";

import { motion, useInView } from "motion/react";
import { useEffect, useRef } from "react";
import { MediaImage } from "@/components/ui/media";
import { movieDao, oasis } from "@/content/work";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/** A muted looping clip that only plays while it is on screen. */
function LoopVideo({ src, className }: { src: string; className: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { margin: "0px 200px 0px 200px" });
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (inView && !reducedMotion) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [inView, reducedMotion]);

  return (
    <video
      ref={ref}
      src={`${encodeURI(src)}#t=3`}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
      tabIndex={-1}
      className={className}
    />
  );
}

/** Oasis: the Zip Tier reel full-bleed, with a vertical reel standing in a phone frame. */
export function OasisArt({ available }: { available: readonly boolean[] }) {
  const wide = oasis.reels.findIndex((reel) => reel.orientation === "landscape");
  const tall = oasis.reels.findIndex((reel) => reel.orientation === "portrait");

  return (
    <div className="absolute inset-0">
      {available[wide] ? (
        <LoopVideo
          src={oasis.reels[wide].src}
          className="absolute inset-0 size-full object-cover opacity-75 transition-transform duration-[1.4s] ease-out-expo group-hover:scale-105"
        />
      ) : (
        <div className="hatch absolute inset-0" />
      )}
      {/* Tints the reel orange until hover, so the card sits in the palette. */}
      <div className="absolute inset-0 bg-signal mix-blend-color transition-opacity duration-700 group-hover:opacity-0" />
      <div className="absolute inset-0 bg-linear-to-tr from-paper via-paper/80 to-paper/25" />

      {available[tall] ? (
        <div className="absolute top-[9%] right-[6%] hidden aspect-[9/16] h-[64%] rotate-[4deg] overflow-hidden rounded-[1.4rem] border-[5px] border-ink/90 bg-black shadow-[0_40px_80px_-20px_rgb(0_0_0/0.8)] transition-transform duration-[1.2s] ease-out-expo group-hover:rotate-0 group-hover:-translate-y-2 sm:block">
          <LoopVideo src={oasis.reels[tall].src} className="size-full object-cover" />
        </div>
      ) : null}
    </div>
  );
}

/** Lucidly: TVL drawn as a rising curve from $0 to $600K on a ledger grid. */
export function LucidlyArt() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 300px 0px 300px" });
  const curve = "M0 300 C 120 298, 190 290, 260 262 S 400 200, 470 150 S 600 40, 720 18";

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <div className="guides absolute inset-0 opacity-70" />
      <svg
        viewBox="0 0 720 320"
        preserveAspectRatio="none"
        aria-hidden
        className="absolute inset-x-0 bottom-[30%] h-[52%] w-full"
      >
        <defs>
          <linearGradient id="lucidly-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ff4f00" stopOpacity="0.35" />
            <stop offset="1" stopColor="#ff4f00" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${curve} L720 320 L0 320 Z`} fill="url(#lucidly-fill)" />
        <path
          d={curve}
          fill="none"
          stroke="#ff4f00"
          strokeWidth="4"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {/* A cover slides off to the right to draw the curve in. */}
      <motion.div
        initial={{ x: "0%" }}
        animate={{ x: inView ? "101%" : "0%" }}
        transition={{ duration: 2.2, ease: EASE_OUT_EXPO, delay: 0.2 }}
        className="absolute inset-0 bg-card"
      />
      <div className="absolute top-[17%] right-[7%] text-right sm:top-[9%] sm:right-[10%]">
        <p className="display text-[clamp(3rem,7vw,6.5rem)] text-ink [@media(max-height:760px)]:text-[clamp(2.5rem,4.5vw,4rem)]">$600K</p>
        <p className="label mt-2 text-ink-faint">Platform TVL · from $0</p>
      </div>
    </div>
  );
}

/**
 * Movie DAO: three screens of the app standing in 3D like a fanned deck,
 * opening wider on hover.
 */
export function MovieDaoArt({ available }: { available: readonly boolean[] }) {
  const front = 1;
  const deck = [
    { shot: 0, rest: "translate-x-[-34%] translate-z-[-160px] rotate-y-[28deg]", open: "group-hover:translate-x-[-44%]" },
    { shot: 3, rest: "translate-x-[34%] translate-z-[-160px] rotate-y-[-28deg]", open: "group-hover:translate-x-[44%]" },
    { shot: front, rest: "translate-z-0 rotate-y-0", open: "group-hover:translate-z-[60px]" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="guides absolute inset-0 opacity-50" />
      <div className="absolute inset-x-0 top-[13%] h-[38%] transform-3d perspective-[1600px] sm:top-[9%] sm:h-[44%]">
        {deck.map(({ shot, rest, open }) => {
          const { src, alt, label } = movieDao.shots[shot];
          return (
            <div key={src} className="absolute inset-0 flex justify-center transform-3d">
              <div
                className={`relative aspect-[1894/880] h-full overflow-hidden rounded-xl border border-hairline-strong bg-sand shadow-[0_40px_80px_-30px_rgb(0_0_0/0.6)] transition-transform duration-[1.2s] ease-out-expo ${rest} ${open}`}
              >
                <MediaImage
                  src={src}
                  alt={alt}
                  available={available[shot]}
                  sizes="(min-width: 1024px) 40vw, 80vw"
                  fallbackLabel={label}
                />
                {shot === front ? null : <div className="absolute inset-0 bg-paper/35" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
