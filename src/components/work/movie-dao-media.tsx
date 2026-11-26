"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { BrowserFrame, MediaFallback, MediaImage } from "@/components/ui/media";
import { Segmented } from "@/components/ui/segmented";
import { movieDao } from "@/content/work";

const STAGE_ID = "moviedao-shot";

const shotOptions = movieDao.shots.map((shot, index) => ({
  id: String(index),
  label: shot.label,
  prefix: String(index + 1).padStart(2, "0"),
}));

/** The launch demo from the ETHGlobal showcase, with native controls. */
export function MovieDaoDemo({ available }: { available: boolean }) {
  const { video } = movieDao;
  return (
    <figure>
      <div className="relative aspect-video overflow-hidden rounded-[1.5rem] border border-hairline bg-black">
        {available ? (
          <video
            src={`${video.src}#t=${video.previewAt}`}
            controls
            playsInline
            preload="metadata"
            aria-label={`${movieDao.label} ${video.title}`}
            className="absolute inset-0 size-full object-contain"
          />
        ) : (
          <MediaFallback label={`${video.title} missing`} path={video.src} kind="video" />
        )}
      </div>
      <figcaption className="label mt-4 flex justify-between text-ink-faint">
        <span>{video.title}</span>
        <span className="tabular-nums">{video.duration}</span>
      </figcaption>
    </figure>
  );
}

/** Walkthrough of the app's screens, one at a time in a browser frame. */
export function MovieDaoGallery({ available }: { available: readonly boolean[] }) {
  const [shotIndex, setShotIndex] = useState(0);
  const shot = movieDao.shots[shotIndex];

  return (
    <div>
      <div id={STAGE_ID} role="tabpanel" aria-labelledby={`moviedao-shots-tab-${shotIndex}`}>
        <BrowserFrame
          label={`the oasis / ${shot.label.toLowerCase()}`}
          aspect={movieDao.shotSize.width / movieDao.shotSize.height}
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={shot.src}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <MediaImage
                src={shot.src}
                alt={shot.alt}
                available={available[shotIndex]}
                sizes="(min-width: 1024px) 80vw, 92vw"
                fallbackLabel={`${shot.label} screenshot missing`}
                className="object-cover object-top"
              />
            </motion.div>
          </AnimatePresence>
        </BrowserFrame>
      </div>
      <div className="mt-8">
        <Segmented
          name="moviedao-shots"
          label="The Oasis screenshots"
          options={shotOptions}
          value={String(shotIndex)}
          onChange={(id) => setShotIndex(Number(id))}
          panelId={STAGE_ID}
        />
      </div>
    </div>
  );
}
