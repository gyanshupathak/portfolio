import type { OasisTabId, ProjectId } from "@/content/work";
import { createStore } from "./create-store";

/** Portrait shader frozen by the visitor (command palette toggle). */
export const shaderPaused = createStore(false);

/** Global command palette visibility. */
export const paletteOpen = createStore(false);

/** Active tab of the Oasis case sheet. */
export const oasisTab = createStore<OasisTabId>("showreel");

/** Set once the preloader has lifted, so the hero can play its entrance. */
export const introDone = createStore(false);

/** Project whose case sheet is open, or `null`. */
export const openCase = createStore<ProjectId | null>(null);
