"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { CountUp } from "@/components/ui/count-up";
import { BrowserFrame, MediaImage, Tag } from "@/components/ui/media";
import { Segmented } from "@/components/ui/segmented";
import { oasis } from "@/content/work";

const { platform } = oasis;
const STAGE_ID = "oasis-shot";

const shotOptions = platform.shots.map((shot, index) => ({
  id: String(index),
  label: shot.label,
  prefix: String(index + 1).padStart(2, "0"),
}));

/** Split showcase: the product screenshots and numbers beside the technical highlights. */
export function Platform({ shotsAvailable }: { shotsAvailable: readonly boolean[] }) {
  const [shotIndex, setShotIndex] = useState(0);
  const shot = platform.shots[shotIndex];

  return (
    <div className="grid items-start gap-x-14 gap-y-14 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <div>
        <div
          id={STAGE_ID}
          role="tabpanel"
          aria-labelledby={`oasis-shots-tab-${shotIndex}`}
        >
          <BrowserFrame
            label={`oasisstudio.in / ${shot.label.toLowerCase()}`}
            aspect={platform.shotSize.width / platform.shotSize.height}
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
                  available={shotsAvailable[shotIndex]}
                  sizes="(min-width: 1024px) 660px, 92vw"
                  fallbackLabel={`${shot.label} screenshot missing`}
                />
              </motion.div>
            </AnimatePresence>
          </BrowserFrame>
        </div>

        <div className="mt-8">
          <Segmented
            name="oasis-shots"
            label="Oasis screenshots"
            options={shotOptions}
            value={String(shotIndex)}
            onChange={(id) => setShotIndex(Number(id))}
            panelId={STAGE_ID}
          />
        </div>

        <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-hairline pt-8">
          {platform.metrics.map((metric) => (
            <div key={metric.label}>
              <dd className="display w-fit text-[clamp(3.2rem,8vw,5.25rem)] text-signal">
                <CountUp value={metric.value} />
              </dd>
              <dt className="mt-4 font-mono text-[11px] tracking-[0.16em] text-ink-muted uppercase">
                {metric.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>

      <ol className="border-t border-hairline">
        {platform.highlights.map((highlight, index) => (
          <li
            key={highlight.title}
            className="group relative grid grid-cols-[3.25rem_minmax(0,1fr)] border-b border-hairline-strong py-7"
          >
            {/* Orange rule that draws across the row on hover. */}
            <span
              aria-hidden
              className="absolute inset-x-0 -bottom-px h-[2px] origin-left scale-x-0 bg-signal transition-[scale] duration-700 ease-out-expo group-hover:scale-x-100"
            />
            <span className="accent text-3xl leading-none text-signal">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="text-xl font-bold tracking-tight text-ink">{highlight.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{highlight.detail}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {highlight.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
