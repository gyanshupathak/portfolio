"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { MediaFallback } from "@/components/ui/media";
import { Portal } from "@/components/ui/portal";
import { useDialog } from "@/hooks/use-dialog";
import { reelUrl, type Reel } from "./reel-card";

/** The player surface for one reel: native controls with sound, or the fallback. */
function Player({ reel, available, number }: { reel: Reel; available: boolean; number: string }) {
  const [failed, setFailed] = useState(false);

  if (!available || failed) {
    return (
      <div className="relative aspect-video w-full">
        <MediaFallback kind="video" label={`Reel ${number} · missing`} path={reel.src} />
      </div>
    );
  }

  return (
    <video
      src={reelUrl(reel)}
      controls
      autoPlay
      playsInline
      onError={() => setFailed(true)}
      className="block max-h-[70svh] w-full bg-black"
    />
  );
}

/**
 * Full-screen player on a sheet of ink. Closes on Escape, on the backdrop,
 * or with the close button; the left and right arrow keys step between reels.
 */
export function ReelModal({
  reels,
  available,
  openIndex,
  onChange,
}: {
  reels: readonly Reel[];
  available: readonly boolean[];
  /** Index of the reel being played, or `null` when closed. */
  openIndex: number | null;
  onChange: (index: number | null) => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = openIndex !== null;

  useDialog({
    open,
    onClose: () => onChange(null),
    containerRef: dialogRef,
    initialFocusRef: closeRef,
  });

  useEffect(() => {
    if (openIndex === null) return;
    function onKeyDown(event: KeyboardEvent) {
      // Leave the arrows to the video's own seek controls when it has focus.
      if (event.target instanceof HTMLVideoElement || openIndex === null) return;
      if (event.key === "ArrowRight") onChange((openIndex + 1) % reels.length);
      if (event.key === "ArrowLeft") onChange((openIndex - 1 + reels.length) % reels.length);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openIndex, reels.length, onChange]);

  const reel = openIndex !== null ? reels[openIndex] : null;
  const number = openIndex !== null ? String(openIndex + 1).padStart(2, "0") : "";
  const stepClass =
    "flex size-10 items-center justify-center rounded-full border border-white/30 text-white transition-colors duration-300 hover:bg-white hover:text-black focus-visible:outline-white";

  return (
    <Portal>
      <AnimatePresence>
        {reel && openIndex !== null ? (
          <motion.div
            key="reel-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-8"
          >
            <div
              aria-hidden
              onClick={() => onChange(null)}
              className="absolute inset-0 bg-black/90"
            />

            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label={`${reel.title} player`}
              tabIndex={-1}
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              // Vertical reels get a narrow stage so the player is not a wide black bar.
              className={`relative w-full outline-none ${
                reel.orientation === "portrait"
                  ? "max-w-[max(280px,min(440px,calc(70svh*9/16)))]"
                  : "max-w-[1120px]"
              }`}
            >
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.2em] text-white/60 uppercase">
                    <span className="text-white">R/{number}</span>
                    <span className="mx-2">/</span>
                    {reel.duration}
                  </p>
                  <p className="display mt-2 text-3xl text-white sm:text-4xl">{reel.title}</p>
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => onChange(null)}
                  aria-label="Close player"
                  className={stepClass}
                >
                  <X className="size-4" strokeWidth={2} />
                </button>
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/20 bg-black">
                <Player key={reel.id} reel={reel} available={available[openIndex]} number={number} />
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onChange((openIndex - 1 + reels.length) % reels.length)}
                    aria-label="Previous reel"
                    className={stepClass}
                  >
                    <ChevronLeft className="size-4" strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange((openIndex + 1) % reels.length)}
                    aria-label="Next reel"
                    className={stepClass}
                  >
                    <ChevronRight className="size-4" strokeWidth={2} />
                  </button>
                  <span className="ml-2 font-mono text-[10px] tracking-[0.14em] text-white/60">
                    {number} / {String(reels.length).padStart(2, "0")}
                  </span>
                </div>
                <p className="hidden items-center gap-2 font-mono text-[10px] tracking-[0.14em] text-white/60 uppercase sm:flex">
                  <kbd className="rounded border border-white/30 px-1.5 py-0.5 font-mono">Esc</kbd>
                  to close
                </p>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Portal>
  );
}
