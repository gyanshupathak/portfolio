import { useLenis } from "lenis/react";
import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])';

/** Number of open dialogs holding the page scroll lock. */
let scrollLocks = 0;
/** Open dialogs, most recent last. Only the top one reacts to the keyboard. */
const dialogStack: symbol[] = [];

/** Stops page scrolling while `active`. Nested locks are counted. */
function useScrollLock(active: boolean) {
  const lenis = useLenis();

  useEffect(() => {
    if (!active || !lenis) return;
    scrollLocks += 1;
    if (scrollLocks === 1) lenis.stop();
    return () => {
      scrollLocks -= 1;
      if (scrollLocks === 0) lenis.start();
    };
  }, [active, lenis]);
}

type DialogOptions = {
  open: boolean;
  onClose: () => void;
  /** Element that contains the dialog; focus is kept inside it. */
  containerRef: RefObject<HTMLElement | null>;
  /** Element to focus on open. Defaults to the first focusable element. */
  initialFocusRef?: RefObject<HTMLElement | null>;
};

/**
 * Modal behaviour shared by the reel player, the build drawer and the
 * command palette: locks page scroll, closes on Escape, keeps Tab focus
 * inside the dialog, and returns focus to the trigger on close.
 */
export function useDialog({ open, onClose, containerRef, initialFocusRef }: DialogOptions) {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useScrollLock(open);

  useEffect(() => {
    if (!open) return;

    const id = Symbol("dialog");
    dialogStack.push(id);
    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    function focusDialog(): boolean {
      const container = containerRef.current;
      const target =
        initialFocusRef?.current ?? container?.querySelector<HTMLElement>(FOCUSABLE) ?? container;
      target?.focus({ preventScroll: true });
      return Boolean(target);
    }
    // The dialog normally mounts in the same commit, so focus moves straight
    // away; the frame is only a fallback for content that mounts a tick later.
    const focusFrame = focusDialog() ? 0 : requestAnimationFrame(focusDialog);

    function onKeyDown(event: KeyboardEvent) {
      if (dialogStack[dialogStack.length - 1] !== id) return;

      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;

      const container = containerRef.current;
      if (!container) return;
      const focusable = [...container.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      const outside = !container.contains(active);

      if (event.shiftKey && (active === first || outside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || outside)) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKeyDown);
      const index = dialogStack.indexOf(id);
      if (index !== -1) dialogStack.splice(index, 1);
      if (previouslyFocused?.isConnected) previouslyFocused.focus({ preventScroll: true });
    };
  }, [open, containerRef, initialFocusRef]);
}
