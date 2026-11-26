import type { ReactNode } from "react";
import { TitleReveal } from "./title-reveal";

/** Page section with the shared container width and vertical rhythm. */
export function Section({
  id,
  label,
  children,
  className = "",
}: {
  id?: string;
  /** Accessible name for sections that have no visible heading. */
  label?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} aria-label={label} className={`relative ${className}`}>
      <div className="mx-auto w-full max-w-[1240px] px-5 py-32 sm:px-8 sm:py-44 lg:py-56">{children}</div>
    </section>
  );
}

/** Small mono label such as `OASIS AI`, led by a short orange rule. */
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-3 font-mono text-[11px] tracking-[0.22em] text-ink-muted uppercase">
      <span aria-hidden className="h-[2px] w-6 bg-signal" />
      {children}
    </p>
  );
}

/**
 * Section heading laid out like a magazine opener: a heavy rule, the index
 * as a large italic numeral in the margin, and the title beside it with any
 * actions.
 */
export function SectionHeader({
  index,
  label,
  title,
  actions,
}: {
  index: string;
  label: string;
  title: string;
  actions?: ReactNode;
}) {
  return (
    <header className="grid gap-x-8 gap-y-6 border-t border-hairline pt-8 lg:grid-cols-12">
      <div className="flex items-end justify-between gap-6 lg:col-span-3 lg:block">
        <p aria-hidden className="accent text-[3.25rem] leading-[0.8] text-signal sm:text-[4.25rem]">
          {index}
        </p>
        <div className="lg:mt-6">
          <SectionLabel>{label}</SectionLabel>
        </div>
      </div>
      <div className="flex flex-col gap-8 lg:col-span-9 xl:flex-row xl:items-end xl:justify-between">
        <TitleReveal
          text={title}
          className="display max-w-[15ch] text-[clamp(2.6rem,6.2vw,5rem)] text-balance text-ink"
        />
        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-5 pb-2">{actions}</div>
        ) : null}
      </div>
    </header>
  );
}
