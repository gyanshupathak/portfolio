"use client";

import { motion } from "motion/react";
import type { KeyboardEvent } from "react";

type Option<T extends string> = {
  id: T;
  label: string;
  /** Optional mono prefix such as "01". */
  prefix?: string;
};

/**
 * Segmented tab switcher. The highlight slides between options with a shared
 * layout animation (transform only). Arrow keys move between tabs.
 */
export function Segmented<T extends string>({
  name,
  label,
  options,
  value,
  onChange,
  panelId,
}: {
  /** Unique name; used for element ids and the shared layout id. */
  name: string;
  /** Accessible name of the tab list. */
  label: string;
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Id of the element the tabs control. */
  panelId: string;
}) {
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (step === 0) return;
    event.preventDefault();
    const current = options.findIndex((option) => option.id === value);
    const next = options[(current + step + options.length) % options.length];
    onChange(next.id);
    document.getElementById(`${name}-tab-${next.id}`)?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className="inline-flex max-w-full overflow-x-auto rounded-full border border-hairline bg-card p-1 [scrollbar-width:none]"
    >
      {options.map((option) => {
        const active = option.id === value;
        return (
          <button
            key={option.id}
            id={`${name}-tab-${option.id}`}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={panelId}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(option.id)}
            className={`relative flex h-10 items-center gap-2 rounded-full px-5 text-[13px] font-semibold whitespace-nowrap transition-colors duration-300 ${
              active ? "text-paper" : "text-ink-muted hover:text-ink"
            }`}
          >
            {active ? (
              <motion.span
                layoutId={`${name}-highlight`}
                transition={{ type: "spring", stiffness: 420, damping: 36 }}
                className="absolute inset-0 rounded-full bg-ink"
              />
            ) : null}
            {option.prefix ? (
              <span className={`relative font-mono text-[10px] ${active ? "text-signal" : "text-ink-faint"}`}>
                {option.prefix}
              </span>
            ) : null}
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
