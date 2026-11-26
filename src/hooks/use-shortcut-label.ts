import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

function isApplePlatform(): boolean {
  return /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent);
}

/**
 * Label for the command palette shortcut: "⌘K" on Apple devices, "Ctrl K"
 * elsewhere. Renders "⌘K" on the server and corrects itself after hydration.
 */
export function useShortcutLabel(): string {
  return useSyncExternalStore(
    subscribe,
    () => (isApplePlatform() ? "⌘K" : "Ctrl K"),
    () => "⌘K",
  );
}
