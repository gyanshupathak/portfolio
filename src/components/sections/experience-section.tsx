"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { Reveal } from "@/components/ui/reveal";
import { TitleReveal } from "@/components/ui/title-reveal";
import { experience } from "@/content/profile";

/**
 * Experience as a large-type index. Each row is a company set in the display
 * face; on hover an orange panel rises behind it and the text flips to white.
 * A rail on the left fills as the list scrolls through.
 */
export function ExperienceSection() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 0.78", "end 0.6"],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.5 });

  return (
    <section id={experience.id} className="relative">
      <div className="mx-auto w-full max-w-[1400px] px-5 py-32 sm:px-8 sm:py-44 lg:py-56">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="label text-signal">Experience</p>
            <TitleReveal
              text="Where I've shipped."
              className="display mt-5 text-[clamp(3.5rem,9vw,8.5rem)] text-ink"
            />
          </div>
          <p className="label text-ink-faint">
            {String(experience.roles.length).padStart(2, "0")} roles · 2024 – 2026
          </p>
        </div>

        <ol ref={listRef} className="relative mt-16 border-t border-hairline">
          <span aria-hidden className="absolute top-0 bottom-0 -left-px hidden w-[2px] bg-hairline lg:block" />
          <motion.span
            aria-hidden
            style={{ scaleY: fill }}
            className="absolute top-0 bottom-0 -left-px hidden w-[2px] origin-top bg-signal lg:block"
          />

          {experience.roles.map((role, index) => (
            <li key={`${role.company}-${role.period}`}>
              <Reveal delay={index * 0.04}>
                <article className="group relative grid gap-x-10 gap-y-4 overflow-hidden border-b border-hairline px-1 py-10 lg:grid-cols-[4rem_minmax(0,1.2fr)_12rem_minmax(0,1.1fr)] lg:items-baseline lg:px-8 lg:py-12">
                  <span
                    aria-hidden
                    className="absolute inset-0 origin-bottom scale-y-0 bg-signal transition-[scale] duration-500 ease-out-expo group-hover:scale-y-100"
                  />
                  <span className="label relative text-ink-faint transition-colors duration-300 group-hover:text-on-signal/70">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="relative transition-transform duration-500 ease-out-expo group-hover:translate-x-2">
                    <h3 className="display text-[2.9rem] text-ink transition-colors duration-300 group-hover:text-on-signal sm:text-[3.6rem] xl:text-[4.25rem]">
                      {role.company}
                    </h3>
                    <p className="accent mt-3 text-2xl text-signal transition-colors duration-300 group-hover:text-on-signal sm:text-3xl">
                      {role.role}
                    </p>
                  </div>
                  <div className="relative text-base leading-relaxed sm:text-lg">
                    <p className="text-ink transition-colors duration-300 group-hover:text-on-signal">
                      {role.period}
                    </p>
                    <p className="mt-1 text-ink-muted transition-colors duration-300 group-hover:text-on-signal/75">
                      {role.location}
                    </p>
                  </div>
                  <p className="relative max-w-[48ch] text-lg leading-relaxed text-ink-muted transition-colors duration-300 group-hover:text-on-signal sm:text-xl">
                    {role.summary}
                  </p>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
