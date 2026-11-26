"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, type ReactNode } from "react";
import { Platform } from "@/components/oasis/platform";
import { Showreel } from "@/components/oasis/showreel";
import { CountUp } from "@/components/ui/count-up";
import { LinkButton } from "@/components/ui/link-button";
import { Tag } from "@/components/ui/media";
import { Portal } from "@/components/ui/portal";
import { Segmented } from "@/components/ui/segmented";
import { lucidly, movieDao, oasis, projects, type ProjectId } from "@/content/work";
import { MovieDaoDemo, MovieDaoGallery } from "./movie-dao-media";
import { useDialog } from "@/hooks/use-dialog";
import { useStore } from "@/lib/create-store";
import { oasisTab, openCase } from "@/lib/ui-state";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
const EASE_IN_OUT_EXPO = [0.87, 0, 0.13, 1] as const;
const OASIS_PANEL_ID = "oasis-panel";

/** A numbered list of what was built, used by the Lucidly and Movie DAO cases. */
function BuildList({
  items,
}: {
  items: readonly { title: string; detail: string; tags: readonly string[] }[];
}) {
  return (
    <ol className="border-t border-hairline">
      {items.map((item, index) => (
        <motion.li
          key={item.title}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.35 + index * 0.06 }}
          className="group grid gap-x-8 gap-y-3 border-b border-hairline py-7 sm:grid-cols-[4rem_minmax(0,1fr)] lg:grid-cols-[4rem_minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-baseline"
        >
          <span className="accent text-4xl leading-none text-signal">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="text-2xl font-semibold tracking-tight text-ink transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5 sm:text-3xl">
            {item.title}
          </h3>
          <div className="sm:col-start-2 lg:col-start-3">
            <p className="text-lg leading-relaxed text-ink-muted">{item.detail}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          </div>
        </motion.li>
      ))}
    </ol>
  );
}

function OasisCase({ media }: { media: { reels: readonly boolean[]; shots: readonly boolean[] } }) {
  const tab = useStore(oasisTab);
  return (
    <>
      <Segmented
        name="oasis"
        label="Oasis AI showcase"
        options={oasis.tabs}
        value={tab}
        onChange={oasisTab.set}
        panelId={OASIS_PANEL_ID}
      />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tab}
          id={OASIS_PANEL_ID}
          role="tabpanel"
          aria-labelledby={`oasis-tab-${tab}`}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
          className="mt-9"
        >
          {tab === "showreel" ? (
            <Showreel available={media.reels} />
          ) : (
            <Platform shotsAvailable={media.shots} />
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

function LucidlyCase() {
  const { growth } = lucidly;
  return (
    <>
      <div className="relative overflow-hidden rounded-[1.75rem] border border-hairline bg-card px-7 py-10 sm:px-10">
        <p className="label relative text-ink-faint">{growth.label}</p>
        <p
          aria-label={`${growth.from} to ${growth.to}`}
          className="display relative mt-4 flex flex-wrap items-baseline gap-x-[0.18em] text-[clamp(4rem,11vw,10rem)] text-ink"
        >
          <span aria-hidden>{growth.from}</span>
          <span aria-hidden className="accent text-[0.5em] text-ink-faint">
            to
          </span>
          <span aria-hidden className="text-signal">
            <CountUp value={growth.to} />
          </span>
        </p>
      </div>
      <p className="label mt-14 mb-6 text-ink-faint">{lucidly.modulesTitle}</p>
      <BuildList items={lucidly.modules} />
    </>
  );
}

type MovieDaoMedia = { shots: readonly boolean[]; video: boolean };

function MovieDaoCase({ media }: { media: MovieDaoMedia }) {
  return (
    <>
      <MovieDaoDemo available={media.video} />
      <p className="label mt-16 mb-6 text-ink-faint">Inside the app</p>
      <MovieDaoGallery available={media.shots} />
      <p className="label mt-16 mb-6 text-ink-faint">How it works</p>
      <BuildList items={movieDao.points} />
    </>
  );
}

const details: Record<
  ProjectId,
  { title: string; links: readonly { label: string; href: string | null }[]; facts: readonly string[] }
> = {
  oasis: { title: oasis.title, links: oasis.links, facts: ["Solo Founder", "Feb – Sep 2026", "Remote"] },
  lucidly: { title: lucidly.title, links: [], facts: lucidly.facts },
  moviedao: {
    title: movieDao.title,
    links: [movieDao.link],
    facts: ["Solo build", "ETHGlobal Agentic Ethereum"],
  },
};

/** Thin strip at the sheet's edge that shows a neighbouring project and opens it. */
function Sliver({ side, id }: { side: "left" | "right"; id: ProjectId }) {
  const project = projects.find((item) => item.id === id)!;
  return (
    <button
      type="button"
      data-cursor={side === "left" ? "Prev" : "Next"}
      onClick={() => openCase.set(id)}
      aria-label={`Open the ${project.name} case`}
      className={`group absolute top-[10svh] bottom-[4svh] hidden w-[3.25vw] items-center justify-center overflow-hidden rounded-[1.25rem] border border-hairline bg-card/80 backdrop-blur-sm transition-colors hover:border-signal/60 lg:flex ${
        side === "left" ? "left-[0.75vw]" : "right-[0.75vw]"
      }`}
    >
      <span className="label rotate-180 whitespace-nowrap text-ink-muted transition-colors [writing-mode:vertical-rl] group-hover:text-signal">
        {project.index} · {project.name}
      </span>
    </button>
  );
}

/**
 * Full-screen case study. It rises over the page as a sheet, with thin
 * slivers of the neighbouring projects at its edges so the visitor can move
 * between cases without going back to the rail.
 */
export function CaseSheet({
  oasisMedia,
  movieDaoMedia,
}: {
  oasisMedia: { reels: readonly boolean[]; shots: readonly boolean[] };
  movieDaoMedia: MovieDaoMedia;
}) {
  const id = useStore(openCase);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useDialog({
    open: id !== null,
    onClose: () => openCase.set(null),
    containerRef,
    initialFocusRef: closeRef,
  });

  const index = id ? projects.findIndex((project) => project.id === id) : -1;
  const project = index >= 0 ? projects[index] : null;
  const prev = projects[(index - 1 + projects.length) % projects.length]?.id;
  const next = projects[(index + 1) % projects.length]?.id;

  const bodies: Record<ProjectId, ReactNode> = {
    oasis: <OasisCase media={oasisMedia} />,
    lucidly: <LucidlyCase />,
    moviedao: <MovieDaoCase media={movieDaoMedia} />,
  };

  return (
    <Portal>
      <AnimatePresence>
        {project ? (
          <div
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-title"
            className="fixed inset-0 z-[60]"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              onClick={() => openCase.set(null)}
              className="absolute inset-0 bg-paper/75 backdrop-blur-md"
            />

            {prev && prev !== project.id ? <Sliver side="left" id={prev} /> : null}
            {next && next !== project.id ? <Sliver side="right" id={next} /> : null}

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.9, ease: EASE_IN_OUT_EXPO }}
              className="absolute inset-x-0 top-[4svh] bottom-0 overflow-hidden rounded-t-[2rem] border border-b-0 border-hairline bg-paper shadow-[0_-40px_120px_-30px_rgb(0_0_0/0.35)] lg:inset-x-[5vw] lg:top-[10svh] lg:bottom-[4svh] lg:rounded-[2rem] lg:border-b"
            >
              <div data-lenis-prevent className="h-full overflow-y-auto overscroll-contain">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                    className="px-6 pt-8 pb-20 sm:px-10 lg:px-14 lg:pt-12"
                  >
                    <header className="grid gap-8 border-b border-hairline pb-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                      <div>
                        <p className="label text-signal">
                          {project.index} — {project.kicker}
                        </p>
                        <h2 id="case-title" className="display mt-4 text-[clamp(3.5rem,8vw,7.5rem)] text-ink">
                          {project.name}
                        </h2>
                        <p className="accent mt-4 text-2xl text-ink-muted sm:text-3xl">
                          {details[project.id].title}
                        </p>
                        <p className="mt-6 max-w-[44rem] text-lg leading-relaxed text-ink-muted sm:text-xl">
                          {project.summary}
                        </p>
                      </div>
                      <div className="flex flex-col gap-5 lg:items-end">
                        <p className="label text-ink-faint">{details[project.id].facts.join("  ·  ")}</p>
                        {details[project.id].links.length > 0 ? (
                          <div className="flex flex-wrap gap-3 pb-1.5">
                            {details[project.id].links.map((link, linkIndex) => (
                              <LinkButton
                                key={link.label}
                                href={link.href}
                                variant={linkIndex === 0 ? "signal" : "paper"}
                              >
                                {link.label}
                              </LinkButton>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </header>
                    <div className="mt-12">{bodies[project.id]}</div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <button
                ref={closeRef}
                type="button"
                data-cursor="Close"
                onClick={() => openCase.set(null)}
                aria-label="Close case"
                className="absolute top-5 right-5 flex size-12 items-center justify-center rounded-full border border-hairline-strong bg-paper/80 text-ink backdrop-blur-md transition-[rotate,background-color,color] duration-500 ease-out-expo hover:rotate-90 hover:bg-signal hover:text-on-signal sm:top-7 sm:right-7"
              >
                <X className="size-5" strokeWidth={1.75} />
              </button>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </Portal>
  );
}
