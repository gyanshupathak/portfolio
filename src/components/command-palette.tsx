"use client";

import {
  Briefcase,
  Clapperboard,
  ArrowUpRight,
  Copy,
  CornerDownLeft,
  Film,
  FlaskConical,
  Layers,
  Moon,
  Pause,
  Play,
  ScanFace,
  Search,
  Sun,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type KeyboardEvent,
  type RefObject,
} from "react";
import { brandIcons } from "@/components/icons/brand";
import { Portal } from "@/components/ui/portal";
import { site } from "@/content/site";
import { useCopy } from "@/hooks/use-copy";
import { useDialog } from "@/hooks/use-dialog";
import { useScrollTo } from "@/hooks/use-scroll-to";
import { useStore } from "@/lib/create-store";
import { toggleTheme, useTheme } from "@/lib/theme";
import { oasisTab, openCase, paletteOpen, shaderPaused } from "@/lib/ui-state";

type Command = {
  id: string;
  group: "Navigate" | "Actions" | "Links";
  label: string;
  /** Short mono text on the right of the row. */
  hint?: string;
  /** Extra words the search matches besides the label. */
  keywords?: string;
  icon: ComponentType<{ className?: string }>;
  disabled?: boolean;
  /**
   * When the command runs relative to the palette closing:
   * - "now": run inside the key press or click, then close (needed for
   *   anything the browser ties to a user gesture, such as opening a tab).
   * - "afterClose": close first, then run once page scrolling is unlocked.
   * - "stay": run and leave the palette open.
   */
  mode: "now" | "afterClose" | "stay";
  run: () => void;
};

const OPTION_ID = (id: string) => `command-${id}`;

function matches(command: Command, query: string): boolean {
  const haystack = `${command.label} ${command.keywords ?? ""} ${command.group}`.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

/** Search field and result list. Mounted only while the palette is open, so its state resets. */
function PaletteBody({
  commands,
  inputRef,
  onRun,
}: {
  commands: Command[];
  inputRef: RefObject<HTMLInputElement | null>;
  onRun: (command: Command) => void;
}) {
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  const results = commands.filter((command) => matches(command, query));
  const selectable = results.filter((command) => !command.disabled);
  // Fall back to the first selectable row when nothing, or a filtered-out row, is active.
  const active = selectable.find((command) => command.id === activeId) ?? selectable[0];

  useEffect(() => {
    if (!active) return;
    document.getElementById(OPTION_ID(active.id))?.scrollIntoView({ block: "nearest" });
  }, [active]);

  function move(step: number) {
    if (selectable.length === 0) return;
    const index = active ? selectable.indexOf(active) : -1;
    const next = selectable[(index + step + selectable.length) % selectable.length];
    setActiveId(next.id);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        move(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        move(-1);
        break;
      case "Home":
        if (selectable.length > 0) {
          event.preventDefault();
          setActiveId(selectable[0].id);
        }
        break;
      case "End":
        if (selectable.length > 0) {
          event.preventDefault();
          setActiveId(selectable[selectable.length - 1].id);
        }
        break;
      case "Enter":
        event.preventDefault();
        if (active) onRun(active);
        break;
    }
  }

  return (
    <div onKeyDown={handleKeyDown}>
      <div className="flex h-14 items-center gap-3 border-b border-hairline px-5">
        <Search aria-hidden className="size-4 shrink-0 text-signal" strokeWidth={2.25} />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded="true"
          aria-controls="command-list"
          aria-activedescendant={active ? OPTION_ID(active.id) : undefined}
          aria-label="Search commands"
          placeholder="Type a command or search…"
          autoComplete="off"
          spellCheck={false}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveId(null);
          }}
          className="h-full min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-faint"
        />
        <kbd className="rounded border border-hairline px-1.5 py-0.5 font-mono text-[10px] text-ink-faint">
          Esc
        </kbd>
      </div>

      <ul
        id="command-list"
        role="listbox"
        aria-label="Commands"
        data-lenis-prevent
        className="max-h-[min(52svh,420px)] overflow-y-auto overscroll-contain p-2"
      >
        {results.length === 0 ? (
          <li role="presentation" className="px-3 py-10 text-center text-sm text-ink-muted">
            No commands match “{query}”.
          </li>
        ) : null}

        {results.map((command, index) => {
          const Icon = command.icon;
          const isActive = command === active;
          const startsGroup = index === 0 || results[index - 1].group !== command.group;

          return (
            <li key={command.id} role="presentation">
              {startsGroup ? (
                <p className="px-3 pt-3 pb-1.5 font-mono text-[10px] tracking-[0.18em] text-ink-faint uppercase">
                  {command.group}
                </p>
              ) : null}
              <div
                id={OPTION_ID(command.id)}
                role="option"
                aria-selected={isActive}
                aria-disabled={command.disabled || undefined}
                onPointerMove={() => {
                  if (!command.disabled && !isActive) setActiveId(command.id);
                }}
                onClick={() => {
                  if (!command.disabled) onRun(command);
                }}
                className={`flex h-11 items-center gap-3 rounded-lg px-3 text-sm ${
                  command.disabled
                    ? "cursor-not-allowed text-ink-faint"
                    : isActive
                      ? "cursor-pointer bg-ink text-paper"
                      : "cursor-pointer text-ink"
                }`}
              >
                <Icon className="size-4 shrink-0" />
                <span className="min-w-0 flex-1 truncate">{command.label}</span>
                {command.hint ? (
                  <span className="shrink-0 font-mono text-[10px] tracking-wide text-ink-faint">
                    {command.hint}
                  </span>
                ) : null}
                {isActive ? (
                  <CornerDownLeft
                    aria-hidden
                    className="size-3.5 shrink-0 text-ink-faint"
                    strokeWidth={1.75}
                  />
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="flex items-center gap-4 border-t border-hairline px-5 py-3 font-mono text-[10px] tracking-wide text-ink-faint">
        <span className="flex items-center gap-1.5">
          <kbd className="rounded border border-hairline px-1 py-0.5 font-mono">↑</kbd>
          <kbd className="rounded border border-hairline px-1 py-0.5 font-mono">↓</kbd>
          navigate
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="rounded border border-hairline px-1 py-0.5 font-mono">↵</kbd>
          select
        </span>
        <span className="ml-auto">{site.monogram}</span>
      </div>
    </div>
  );
}

/**
 * Global command palette. Opens with ⌘K / Ctrl+K or the navbar pill and is
 * driven fully from the keyboard: type to filter, arrows to move, Enter to
 * run, Escape to close.
 */
export function CommandPalette({ resumeAvailable }: { resumeAvailable: boolean }) {
  const open = useStore(paletteOpen);
  const paused = useStore(shaderPaused);
  const theme = useTheme();
  const scrollTo = useScrollTo();
  const { copied, copy } = useCopy(site.email);

  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  /** Command waiting for the palette to close and release the scroll lock. */
  const pendingRef = useRef<(() => void) | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useDialog({
    open,
    onClose: () => paletteOpen.set(false),
    containerRef: dialogRef,
    initialFocusRef: inputRef,
  });

  // Declared after useDialog so the scroll lock is already released when this runs.
  useEffect(() => {
    if (open) return;
    const pending = pendingRef.current;
    pendingRef.current = null;
    pending?.();
  }, [open]);

  useEffect(() => {
    function onKeyDown(event: globalThis.KeyboardEvent) {
      const isShortcut =
        (event.metaKey || event.ctrlKey) &&
        !event.altKey &&
        !event.shiftKey &&
        event.key.toLowerCase() === "k";
      if (!isShortcut) return;
      event.preventDefault();
      paletteOpen.set((value) => !value);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const commands: Command[] = [
    {
      id: "hero",
      group: "Navigate",
      label: "Jump to Hero / Identity",
      keywords: "top home portrait about",
      icon: ScanFace,
      mode: "afterClose",
      run: () => scrollTo("top"),
    },
    {
      id: "reels",
      group: "Navigate",
      label: "Watch Oasis Reels",
      keywords: "work video showreel oasis ai case",
      icon: Clapperboard,
      mode: "afterClose",
      run: () => {
        oasisTab.set("showreel");
        openCase.set("oasis");
      },
    },
    {
      id: "lucidly",
      group: "Navigate",
      label: "Open Lucidly Labs Case",
      keywords: "work modules web3 defi lucidly labs tvl",
      icon: Layers,
      mode: "afterClose",
      run: () => openCase.set("lucidly"),
    },
    {
      id: "moviedao",
      group: "Navigate",
      label: "Open AI Movie DAO Case",
      keywords: "work ethglobal hackathon agentic ethereum film studio the oasis",
      icon: Film,
      mode: "afterClose",
      run: () => openCase.set("moviedao"),
    },
    {
      id: "lab",
      group: "Navigate",
      label: "View Lab & Recognition",
      keywords: "automations telegram awards education",
      icon: FlaskConical,
      mode: "afterClose",
      run: () => scrollTo("lab"),
    },
    {
      id: "experience",
      group: "Navigate",
      label: "View Experience",
      keywords: "timeline jobs roles career",
      icon: Briefcase,
      mode: "afterClose",
      run: () => scrollTo("experience"),
    },
    {
      id: "resume",
      group: "Actions",
      label: "Open Resume",
      keywords: "cv pdf download",
      hint: resumeAvailable ? "PDF" : "Not added yet",
      icon: ArrowUpRight,
      disabled: !resumeAvailable,
      mode: "now",
      run: () => window.open(site.resumePath, "_blank", "noopener,noreferrer"),
    },
    {
      id: "email",
      group: "Actions",
      label: "Copy Email",
      keywords: "contact mail",
      hint: copied ? "Copied ✓" : site.email,
      icon: Copy,
      mode: "stay",
      run: () => {
        void copy().then((ok) => {
          if (!ok) return;
          // Leave the confirmation visible for a moment, then close.
          if (closeTimer.current) clearTimeout(closeTimer.current);
          closeTimer.current = setTimeout(() => paletteOpen.set(false), 900);
        });
      },
    },
    {
      id: "theme",
      group: "Actions",
      label: theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode",
      keywords: "theme dark light mode colour color",
      icon: theme === "dark" ? Sun : Moon,
      mode: "stay",
      run: toggleTheme,
    },
    {
      id: "sculpture",
      group: "Actions",
      label: paused ? "Resume 3D Scene" : "Pause 3D Scene",
      keywords: "shader animation motion webgl 3d portrait",
      icon: paused ? Play : Pause,
      mode: "stay",
      run: () => shaderPaused.set((value) => !value),
    },
    ...site.socials.map(
      (social): Command => ({
        id: social.id,
        group: "Links",
        label: `Open ${social.label}`,
        keywords: "social profile",
        hint: "↗",
        icon: brandIcons[social.id],
        mode: "now",
        run: () => window.open(social.href, "_blank", "noopener,noreferrer"),
      }),
    ),
  ];

  function handleRun(command: Command) {
    if (command.disabled) return;
    if (command.mode === "stay") {
      command.run();
      return;
    }
    if (command.mode === "now") {
      command.run();
    } else {
      pendingRef.current = command.run;
    }
    paletteOpen.set(false);
  }

  return (
    <Portal>
      <AnimatePresence>
        {open ? (
          <motion.div
            key="command-palette"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[16svh]"
          >
            <div
              aria-hidden
              onClick={() => paletteOpen.set(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-[3px]"
            />
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
              className="relative w-full max-w-[580px] overflow-hidden rounded-3xl border border-hairline bg-paper shadow-[0_30px_100px_-28px_rgb(255_91_35/0.25)]"
            >
              <PaletteBody commands={commands} inputRef={inputRef} onRun={handleRun} />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Portal>
  );
}
