import { useLenis } from "lenis/react";
import { useCallback } from "react";
import { usePrefersReducedMotion } from "./use-media-query";

type ScrollOptions = {
  /** Jump without animating, even while page scrolling is locked by a dialog. */
  immediate?: boolean;
};

/**
 * Returns a function that scrolls to a section by element id, or to the top
 * of the page for `"top"`. Uses Lenis when it is running and falls back to
 * native scrolling. Jumps instantly when the visitor prefers reduced motion.
 * Unknown ids are ignored.
 *
 * Sections land flush with the top of the viewport: their own top padding
 * already clears the floating navbar.
 */
export function useScrollTo() {
  const lenis = useLenis();
  const reduced = usePrefersReducedMotion();

  return useCallback(
    (target: string, options: ScrollOptions = {}) => {
      const element = target === "top" ? null : document.getElementById(target);
      if (target !== "top" && !element) return;
      const immediate = reduced || options.immediate === true;

      // Measured against the live scroll position rather than handing Lenis the
      // element: its own idea of the position can lag behind a scroll it did
      // not drive, which would put the landing point off by that much.
      const top = element ? Math.round(element.getBoundingClientRect().top + window.scrollY) : 0;

      if (lenis) {
        lenis.scrollTo(top, {
          immediate,
          force: immediate,
          duration: 1.2,
        });
        return;
      }

      window.scrollTo({ top, behavior: immediate ? "auto" : "smooth" });
    },
    [lenis, reduced],
  );
}
