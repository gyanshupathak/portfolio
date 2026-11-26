"use client";

import { useState } from "react";
import { oasis } from "@/content/work";
import { ReelCard, type Reel } from "./reel-card";
import { ReelModal } from "./reel-modal";

const reels: readonly Reel[] = oasis.reels;

/**
 * The showreel: landscape reels stacked on the left, vertical reels standing
 * beside them, with a full-screen player on click. The column widths are set
 * so that two 16:9 frames stack to the height of one 9:16 frame.
 */
export function Showreel({ available }: { available: readonly boolean[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const card = (index: number, className: string) => (
    <ReelCard
      key={reels[index].id}
      reel={reels[index]}
      index={index}
      available={available[index]}
      // Hover playback pauses while the full player is open.
      active={activeIndex === index && openIndex === null}
      dimmed={activeIndex !== null && activeIndex !== index}
      onActiveChange={(active) =>
        setActiveIndex((current) => (active ? index : current === index ? null : current))
      }
      onOpen={() => setOpenIndex(index)}
      className={className}
    />
  );

  const indexes = reels.map((_, index) => index);
  const landscape = indexes.filter((index) => reels[index].orientation === "landscape");
  const portrait = indexes.filter((index) => reels[index].orientation === "portrait");

  return (
    <>
      <div className="grid gap-x-6 gap-y-7 lg:grid-cols-[1.45fr_2fr]">
        <div className="grid gap-x-6 gap-y-7 sm:grid-cols-2 lg:grid-cols-1 lg:grid-rows-2">
          {landscape.map((index) => card(index, "aspect-video lg:aspect-auto"))}
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-7">
          {portrait.map((index) => card(index, "aspect-[9/16]"))}
        </div>
      </div>

      <ReelModal reels={reels} available={available} openIndex={openIndex} onChange={setOpenIndex} />
    </>
  );
}
