"use client";

import { ArrowDown } from "lucide-react";
import { motion, useScroll, type Variants } from "motion/react";
import { useRef } from "react";
import { SculptureCanvas, SculptureStill } from "@/components/sculpture/sculpture";
import { CopyEmailButton } from "@/components/ui/copy-email-button";
import { KeyCap, keyClass } from "@/components/ui/key";
import { LiveDot } from "@/components/ui/live-dot";
import { SocialLinks } from "@/components/ui/social-links";
import { site } from "@/content/site";
import { useScrollLinked } from "@/hooks/use-scroll-linked";
import { useScrollTo } from "@/hooks/use-scroll-to";
import { useStore } from "@/lib/create-store";
import { introDone } from "@/lib/ui-state";

const { hero } = site;
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const letters: Variants = {
  hidden: {},
  show: (delay: number = 0) => ({ transition: { staggerChildren: 0.04, delayChildren: delay } }),
};

const letter: Variants = {
  hidden: { y: "108%" },
  show: { y: 0, transition: { duration: 1.1, ease: EASE_OUT_EXPO } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: EASE_OUT_EXPO, delay },
  }),
};

/** A word whose letters rise out of a mask one after another. */
function SplitWord({ text, delay, className }: { text: string; delay: number; className: string }) {
  return (
    <motion.span variants={letters} custom={delay} aria-hidden className={`flex ${className}`}>
      {[...text].map((char, index) => (
        <span key={index} className="-mb-[0.08em] inline-block overflow-hidden pb-[0.08em]">
          <motion.span variants={letter} className="inline-block">
            {char}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/**
 * First screen: the name set huge in condensed black on the left, and a live
 * 3D scene on the right where the portrait card leans toward the pointer
 * while orange blobs orbit it. Everything is in normal flow, so the copy
 * below the name can never be overlapped by it.
 */
export function Hero({ portraitAvailable }: { portraitAvailable: boolean }) {
  const scrollTo = useScrollTo();
  const sectionRef = useRef<HTMLElement>(null);
  const started = useStore(introDone);
  const state = started ? "show" : "hidden";

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const textY = useScrollLinked(scrollYProgress, [0, 1], [0, -90], 0);
  const slotRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={sectionRef} id="top" className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="guides absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(ellipse_at_70%_45%,black,transparent_72%)]"
      />
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: started ? 1 : 0 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="absolute inset-0"
      >
        <SculptureCanvas
          available={portraitAvailable}
          anchorRef={slotRef}
          scrollProgress={scrollYProgress}
        />
      </motion.div>

      <div className="mx-auto grid w-full max-w-[1480px] gap-y-10 px-5 pt-32 pb-16 sm:px-8 lg:min-h-svh lg:grid-cols-2 lg:gap-x-10 lg:pt-32 lg:pb-14">
        <motion.div
          style={{ y: textY }}
          className="relative z-10 flex flex-col justify-between gap-12"
        >
          <motion.h1
            aria-label={site.name}
            initial="hidden"
            animate={state}
            className="display text-[clamp(5.2rem,27vw,9rem)] leading-[0.84] text-ink sm:text-[clamp(7rem,20vw,11rem)] lg:text-[min(10.4vw,17svh)]"
          >
            <SplitWord text={hero.firstName} delay={0} className="" />
            <SplitWord text={hero.lastName} delay={0.18} className="text-signal" />
          </motion.h1>

          <div>
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate={state}
              custom={0.5}
              className="flex items-center gap-2.5 text-sm font-medium text-ink-muted sm:text-[15px]"
            >
              <LiveDot />
              {hero.status}
            </motion.p>
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate={state}
              custom={0.6}
              className="mt-4 max-w-[34rem] text-lg leading-relaxed font-medium text-ink sm:text-xl"
            >
              {hero.subheadline}
            </motion.p>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={state}
              custom={0.7}
              className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-5 pb-1.5"
            >
              <button
                type="button"
                onClick={() => scrollTo(hero.primaryCta.target)}
                className={keyClass}
              >
                <KeyCap variant="signal">
                  {hero.primaryCta.label}
                  <ArrowDown
                    className="size-4 transition-transform duration-300 ease-out-expo group-hover/key:translate-y-0.5"
                    strokeWidth={2.5}
                  />
                </KeyCap>
              </button>
              <CopyEmailButton />
              <SocialLinks />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          ref={slotRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: started ? 1 : 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="relative aspect-[4/5] w-full lg:aspect-auto lg:min-h-[28rem]"
        >
          <SculptureStill available={portraitAvailable} />
          <div className="label pointer-events-none absolute inset-x-0 -bottom-7 flex justify-between text-ink-faint">
            <span>{hero.portrait.caption}</span>
            <span className="hidden sm:inline">{hero.hud.hint}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
