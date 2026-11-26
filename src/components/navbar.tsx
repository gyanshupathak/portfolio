"use client";

import { ArrowUpRight, Moon, Search, Sun } from "lucide-react";
import { motion, useScroll, useSpring } from "motion/react";
import type { MouseEvent } from "react";
import { KeyCap, keyClass } from "@/components/ui/key";
import { site } from "@/content/site";
import { useActiveSection } from "@/hooks/use-active-section";
import { useScrollTo } from "@/hooks/use-scroll-to";
import { useShortcutLabel } from "@/hooks/use-shortcut-label";
import { useStore } from "@/lib/create-store";
import { toggleTheme, useTheme } from "@/lib/theme";
import { introDone, paletteOpen } from "@/lib/ui-state";

/** Sections watched for the active nav link, in page order. */
const WATCHED_SECTIONS = ["work", "numbers", "experience", "lab", "contact"] as const;

/** Which nav link a section lights up. The numbers strip belongs to "Work". */
const NAV_TARGET_OF: Record<string, string> = {
  work: "work",
  numbers: "work",
  experience: "experience",
  lab: "lab",
  contact: "contact",
};

/** Switches between the light and dark theme; the two icons swap by turning. */
function ThemeToggle() {
  const theme = useTheme();
  const dark = theme === "dark";
  const icon =
    "absolute size-4 transition-[rotate,scale,opacity] duration-500 ease-out-expo";
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative mt-1 flex size-9 items-center justify-center rounded-full border border-hairline text-ink transition-colors duration-300 after:absolute after:-inset-1 after:content-[''] hover:border-signal hover:text-signal"
    >
      <Sun
        aria-hidden
        strokeWidth={2}
        className={`${icon} ${dark ? "scale-100 rotate-0 opacity-100" : "scale-50 -rotate-90 opacity-0"}`}
      />
      <Moon
        aria-hidden
        strokeWidth={2}
        className={`${icon} ${dark ? "scale-50 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"}`}
      />
    </button>
  );
}

/**
 * Floating navigation bar: monogram, section links with an ink pill that
 * slides to the current one, the theme switch, the command palette trigger
 * and the resume key.
 * Its bottom edge fills with orange as the page scrolls.
 */
export function Navbar({ resumeAvailable }: { resumeAvailable: boolean }) {
  const scrollTo = useScrollTo();
  const shortcut = useShortcutLabel();
  const activeSection = useActiveSection(WATCHED_SECTIONS);
  const activeTarget = activeSection ? NAV_TARGET_OF[activeSection] : null;
  const started = useStore(introDone);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 30, mass: 0.4 });

  function handleAnchor(event: MouseEvent<HTMLAnchorElement>, target: string) {
    // Let modified clicks (new tab, etc.) behave natively.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    scrollTo(target);
  }

  return (
    <motion.header
      // The header is fixed, so layout animations inside it must ignore page scroll.
      layoutRoot
      initial={{ opacity: 0, y: -20 }}
      animate={started ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
    >
      <nav
        aria-label="Primary"
        className="relative grid h-14 w-full max-w-[1176px] grid-cols-[1fr_auto_1fr] items-center overflow-hidden rounded-full border border-hairline bg-paper/60 pr-2.5 pl-5 shadow-[0_16px_50px_-28px_rgb(0_0_0/0.35)] backdrop-blur-xl"
      >
        <a
          href="#top"
          onClick={(event) => handleAnchor(event, "top")}
          aria-label={`${site.name}, back to top`}
          className="accent -ml-2 flex h-10 items-center justify-self-start rounded-full px-2 text-[1.9rem] leading-none text-ink"
        >
          {site.monogram}
          <span aria-hidden className="text-signal">
            .
          </span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {site.nav.map(({ label, target }) => {
            const active = target === activeTarget;
            return (
              <li key={target}>
                <a
                  href={`#${target}`}
                  onClick={(event) => handleAnchor(event, target)}
                  aria-current={active ? "true" : undefined}
                  className={`relative block rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-300 ${
                    active ? "text-paper" : "text-ink-muted hover:text-ink"
                  }`}
                >
                  {active ? (
                    <motion.span
                      layoutId="nav-active"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-ink"
                    />
                  ) : null}
                  <span className="relative">{label}</span>
                </a>
              </li>
            );
          })}
        </ul>

        <div className="col-start-3 flex items-center gap-2 justify-self-end pb-1 sm:gap-3">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => paletteOpen.set(true)}
            aria-label="Open command palette"
            aria-keyshortcuts="Meta+K Control+K"
            className="relative mt-1 flex h-9 min-w-9 items-center justify-center rounded-full border border-hairline px-3 font-mono text-[11px] tracking-wide text-ink-muted transition-colors duration-300 after:absolute after:-inset-1 after:content-[''] hover:border-signal/40 hover:text-ink"
          >
            {/* A keyboard hint is meaningless on touch-sized screens; show an icon there. */}
            <Search aria-hidden className="size-3.5 md:hidden" strokeWidth={2} />
            <kbd className="hidden font-mono md:inline">{shortcut}</kbd>
          </button>

          {resumeAvailable ? (
            <a
              href={site.resumePath}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open resume in a new tab"
              className={keyClass}
            >
              <KeyCap variant="signal" size="sm">
                Resume
                <ArrowUpRight className="size-3.5" strokeWidth={2.5} />
              </KeyCap>
            </a>
          ) : (
            // Shown until public/media/resume.pdf exists, so the link is never dead.
            <span
              aria-disabled="true"
              title="Resume PDF has not been added yet"
              className={`${keyClass} mt-1 cursor-not-allowed`}
            >
              <KeyCap variant="disabled" size="sm">
                Resume
              </KeyCap>
            </span>
          )}
        </div>

        {/* Scroll progress along the bottom edge. */}
        <motion.span
          aria-hidden
          style={{ scaleX: progress }}
          className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-signal"
        />
      </nav>
    </motion.header>
  );
}
