"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Fragment, useRef } from "react";
import { Section, SectionLabel } from "@/components/ui/section";
import { site } from "@/content/site";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

const { title, statements } = site.identity;

/** Every word of the identity statement, tagged with the sentence it belongs to. */
const words = statements.flatMap((sentence, sentenceIndex) =>
  sentence.split(" ").map((text) => ({ text, sentenceIndex })),
);

/** How many words are mid-fade at once; larger is a softer leading edge. */
const SPREAD = 5;

function Word({
  progress,
  index,
  children,
  className,
}: {
  progress: MotionValue<number>;
  index: number;
  children: string;
  className: string;
}) {
  const start = index / (words.length + SPREAD);
  const end = (index + SPREAD) / (words.length + SPREAD);
  const opacity = useTransform(progress, [start, end], [0.14, 1]);

  return (
    <motion.span style={{ opacity }} className={className}>
      {children}
    </motion.span>
  );
}

/**
 * The identity statement set large in the condensed display face: the first
 * sentence in ink, the second in orange. It inks in word by word as it is scrolled
 * through, and is fully inked for reduced-motion visitors.
 */
export function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.88", "end 0.52"] });

  return (
    <Section id="manifesto" label={title}>
      <div className="grid gap-x-8 gap-y-8 border-t border-hairline pt-8 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <SectionLabel>{title}</SectionLabel>
        </div>
        <p
          ref={ref}
          className="text-[clamp(2.1rem,5.3vw,4.5rem)] leading-[1.02] text-balance lg:col-span-9"
        >
          {words.map(({ text, sentenceIndex }, index) => {
            const className =
              sentenceIndex === 0
                ? "display text-ink"
                : "display text-signal";
            return (
              <Fragment key={`${text}-${index}`}>
                {reducedMotion ? (
                  <span className={className}>{text}</span>
                ) : (
                  <Word progress={scrollYProgress} index={index} className={className}>
                    {text}
                  </Word>
                )}
                {index < words.length - 1 ? " " : null}
              </Fragment>
            );
          })}
        </p>
      </div>
    </Section>
  );
}
