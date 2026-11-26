"use client";

import { Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MediaFallback } from "@/components/ui/media";

export type Reel = {
  id: string;
  /** Path under `public/`, written as on disk (spaces allowed). */
  src: string;
  title: string;
  /** Running time as shown to visitors, e.g. "1:31". */
  duration: string;
  orientation: "landscape" | "portrait";
  /** Second whose frame is used as the still. */
  previewAt: number;
};

/** File paths may contain spaces, so they are encoded before use as a URL. */
export const reelUrl = (reel: Reel) => encodeURI(reel.src);

/**
 * One reel in the showreel grid. Plays muted while hovered or focused, lifts
 * off its block of ink, and opens the full player on click.
 */
export function ReelCard({
  reel,
  index,
  available,
  active,
  dimmed,
  onActiveChange,
  onOpen,
  className = "",
}: {
  reel: Reel;
  index: number;
  /** Whether the video file exists (resolved on the server). */
  available: boolean;
  active: boolean;
  dimmed: boolean;
  onActiveChange: (active: boolean) => void;
  onOpen: () => void;
  /** Sets the card's shape. */
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const showVideo = available && !failed;
  const number = String(index + 1).padStart(2, "0");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (active) {
      // Autoplay can be refused (e.g. data saver); the still frame stays.
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [active, showVideo]);

  return (
    <div
      className={`relative transition-opacity duration-500 ease-out ${
        dimmed ? "opacity-45" : "opacity-100"
      } ${className}`}
    >
      <button
        type="button"
        onClick={onOpen}
        onPointerEnter={() => onActiveChange(true)}
        onPointerLeave={() => onActiveChange(false)}
        onFocus={() => onActiveChange(true)}
        onBlur={() => onActiveChange(false)}
        aria-label={`Play ${reel.title}, ${reel.duration}`}
        className={`group relative block size-full overflow-hidden rounded-2xl bg-sand text-left shadow-[0_22px_50px_-32px_rgb(28_22_18/0.6)] transition-[translate] duration-500 ease-out-expo ${
          active ? "-translate-y-1.5" : ""
        }`}
      >
        {showVideo ? (
          <video
            ref={videoRef}
            // The time fragment makes browsers paint that frame as the still.
            src={`${reelUrl(reel)}#t=${reel.previewAt}`}
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setFailed(true)}
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <MediaFallback kind="video" label={`Reel ${number} · missing`} path={reel.src} />
        )}

        {showVideo ? (
          <span
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-b from-transparent to-black/80"
          />
        ) : null}

        <span className="absolute top-3 left-3 rounded-full bg-paper/90 px-2.5 py-1 font-mono text-[10px] tracking-[0.18em] text-ink backdrop-blur-sm">
          R/{number}
        </span>

        <span
          aria-hidden
          className="absolute top-3 right-3 flex size-10 items-center justify-center rounded-full bg-signal text-on-signal transition-[scale] duration-300 ease-out-expo group-hover:scale-110 group-focus-visible:scale-110"
        >
          <Play className="size-3.5 translate-x-px fill-current" strokeWidth={0} />
        </span>

        <span
          className={`absolute inset-x-4 bottom-3.5 flex items-end justify-between gap-3 ${
            showVideo ? "text-white" : "text-ink"
          }`}
        >
          <span className="display text-[1.55rem] sm:text-[1.8rem]">{reel.title}</span>
          <span className="pb-0.5 font-mono text-[11px] tracking-[0.1em]">{reel.duration}</span>
        </span>
      </button>
    </div>
  );
}
