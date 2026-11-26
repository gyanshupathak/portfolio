"use client";

import { ArrowUpRight } from "lucide-react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef, useState, type ReactNode } from "react";
import { Tag } from "@/components/ui/media";
import { projects, type ProjectId } from "@/content/work";
import { useMediaQuery, usePrefersReducedMotion } from "@/hooks/use-media-query";
import { openCase } from "@/lib/ui-state";
import { LucidlyArt, MovieDaoArt, OasisArt } from "./project-art";

/** Degrees between neighbouring cards on the drum. */
const STEP = 42;
/** Card size and drum radius, in viewport units so the curve holds at any width. */
const CARD_WIDTH_VW = 56;
const RADIUS_VW = CARD_WIDTH_VW / 2 / Math.tan(((STEP / 2) * Math.PI) / 180) + 4;

const count = projects.length;

/** Scroll progress to drum angle, resting on each card for a moment. */
const stops = projects.flatMap((_, index) => {
  const span = 1 / count;
  return [span * index + span * 0.22, span * (index + 1) - span * 0.22];
});
const angles = projects.flatMap((_, index) => [index * STEP, index * STEP]);

function ProjectCard({
  project,
  art,
  className = "",
}: {
  project: (typeof projects)[number];
  art: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      data-cursor="Open"
      onClick={() => openCase.set(project.id)}
      aria-label={`Open the ${project.name} case`}
      className={`group relative block overflow-hidden rounded-[2rem] border border-hairline bg-card text-left ${className}`}
    >
      {art}
      {/* Keeps the title readable over any artwork. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-card via-card/90 to-transparent"
      />

      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[2rem] opacity-0 shadow-[inset_0_0_0_2px_var(--color-signal)] transition-opacity duration-500 group-hover:opacity-100"
      />

      <span className="label absolute top-6 left-6 text-ink sm:top-8 sm:left-8">
        {project.index} / {String(count).padStart(2, "0")}
      </span>
      <span className="absolute top-5 right-5 flex size-12 items-center justify-center rounded-full border border-hairline-strong bg-paper text-ink transition-[rotate,background-color,color] duration-500 ease-out-expo group-hover:rotate-45 group-hover:bg-signal group-hover:text-on-signal sm:top-7 sm:right-7">
        <ArrowUpRight className="size-5" strokeWidth={2} />
      </span>

      <span className="absolute inset-x-6 bottom-6 block sm:inset-x-8 sm:bottom-8">
        <span className="label block text-signal">{project.kicker}</span>
        <span className="display mt-3 block text-[clamp(3rem,6.4vw,6.5rem)] text-ink transition-transform duration-700 ease-out-expo group-hover:translate-x-2 [@media(max-height:760px)]:text-[clamp(2.5rem,4.8vw,4.5rem)]">
          {project.name}
        </span>
        <span className="mt-3 hidden max-w-[36rem] text-base leading-relaxed font-medium text-ink-muted sm:block lg:text-lg [@media(min-width:1024px)_and_(max-height:760px)]:hidden">
          {project.summary}
        </span>
        <span className="mt-4 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </span>
      </span>
    </button>
  );
}

/**
 * One card on the drum, dimming as it turns away from the front. Only the
 * front card takes clicks; the others sit at an angle and would otherwise
 * catch clicks meant for it.
 */
function DrumCard({
  index,
  angle,
  active,
  children,
}: {
  index: number;
  angle: MotionValue<number>;
  active: boolean;
  children: ReactNode;
}) {
  const shade = useTransform(angle, (value) =>
    Math.min(0.75, (Math.abs(value - index * STEP) / STEP) * 0.6),
  );
  return (
    <div
      aria-hidden={!active}
      className={`absolute inset-y-0 left-1/2 transform-3d backface-hidden ${active ? "pointer-events-auto" : ""}`}
      style={{
        width: `${CARD_WIDTH_VW}vw`,
        marginLeft: `${-CARD_WIDTH_VW / 2}vw`,
        transform: `rotateY(${-index * STEP}deg) translateZ(${-RADIUS_VW}vw)`,
      }}
    >
      {children}
      <motion.span
        aria-hidden
        style={{ opacity: shade }}
        className="pointer-events-none absolute inset-0 rounded-[2rem] bg-paper"
      />
    </div>
  );
}

function Intro({ compact }: { compact: boolean }) {
  return (
    <div className={compact ? "flex items-end justify-between gap-8" : ""}>
      <div>
        <p className="label text-signal">Selected work</p>
        <h2
          className={`display mt-4 text-ink ${compact ? "text-[clamp(3rem,5vw,5rem)]" : "text-[clamp(4rem,14vw,7rem)]"}`}
        >
          Three <span className="text-signal">builds.</span>
        </h2>
      </div>
      <p
        className={`max-w-[26rem] leading-relaxed font-medium text-ink-muted ${compact ? "pb-2 text-base" : "mt-5 text-lg"}`}
      >
        A video studio, a DeFi platform and a solo-built AI film studio. Open any of them for the
        full case.
      </p>
    </div>
  );
}

/**
 * Selected work. On desktop the cards stand on the inside of a drum that
 * turns as the page scrolls, pausing on each project; on smaller screens and
 * for reduced motion it is a plain stack. Each card opens its case sheet.
 */
export function WorkRail({
  reels,
  movieShots,
}: {
  reels: readonly boolean[];
  movieShots: readonly boolean[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const desktop = useMediaQuery("(min-width: 1024px)");
  const reducedMotion = usePrefersReducedMotion();
  const drum = desktop && !reducedMotion;
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const angle = useTransform(scrollYProgress, stops, angles);
  const rotation = useTransform(
    angle,
    (value) => `translateZ(${RADIUS_VW}vw) rotateY(${value}deg)`,
  );
  const bar = useTransform(scrollYProgress, [stops[0], stops[stops.length - 1]], [0, 1]);

  useMotionValueEvent(angle, "change", (value) => {
    setActive(Math.min(count - 1, Math.max(0, Math.round(value / STEP))));
  });

  const art: Record<ProjectId, ReactNode> = {
    oasis: <OasisArt available={reels} />,
    lucidly: <LucidlyArt />,
    moviedao: <MovieDaoArt available={movieShots} />,
  };

  if (!drum) {
    return (
      <section
        ref={sectionRef}
        id="work"
        aria-label="Selected work"
        className="relative px-5 py-32 sm:px-8 sm:py-44"
      >
        <Intro compact={false} />
        <div className="mt-12 flex flex-col gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              art={art[project.id]}
              className="aspect-[4/5] w-full sm:aspect-[16/11]"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="work"
      aria-label="Selected work"
      className="relative"
      style={{ height: `${100 + count * 85}svh` }}
    >
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden pt-28 pb-20">
        <div className="px-[4vw]">
          <Intro compact />
        </div>

        <div className="relative mt-10 min-h-0 flex-1 perspective-[140vw]">
          <motion.div
            style={{ transform: rotation }}
            className="pointer-events-none absolute inset-0 transform-3d"
          >
            {projects.map((project, index) => (
              <DrumCard key={project.id} index={index} angle={angle} active={index === active}>
                <ProjectCard project={project} art={art[project.id]} className="size-full" />
              </DrumCard>
            ))}
          </motion.div>
        </div>

        <div className="pointer-events-none absolute inset-x-[4vw] bottom-8 flex items-center gap-6">
          <span className="label text-ink tabular-nums">
            {String(active + 1).padStart(2, "0")}
            <span className="text-ink-faint"> / {String(count).padStart(2, "0")}</span>
          </span>
          <span className="relative h-[2px] flex-1 bg-hairline">
            <motion.span style={{ scaleX: bar }} className="absolute inset-0 origin-left bg-signal" />
          </span>
          <span className="label text-ink">{projects[active].name}</span>
        </div>
      </div>
    </section>
  );
}
