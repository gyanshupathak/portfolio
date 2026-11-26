import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { KeyCap, keyClass, type KeyVariant } from "./key";

/**
 * Key-styled external link that opens in a new tab. When `href` is `null`
 * (the real URL has not been supplied yet) it is drawn as a flat, hatched
 * key and is not a link, so nothing dead or guessed is ever shipped.
 */
export function LinkButton({
  href,
  children,
  variant = "paper",
}: {
  href: string | null;
  children: ReactNode;
  variant?: Exclude<KeyVariant, "disabled">;
}) {
  const arrow = (
    <ArrowUpRight
      aria-hidden
      className="size-4 transition-transform duration-300 ease-out-expo group-hover/key:translate-x-0.5 group-hover/key:-translate-y-0.5"
      strokeWidth={2.25}
    />
  );

  if (!href) {
    return (
      <span
        aria-disabled="true"
        title="Link will be added soon"
        className={`${keyClass} cursor-not-allowed`}
      >
        <KeyCap variant="disabled">
          {children}
          <span className="font-mono text-[10px] font-normal tracking-[0.14em] uppercase">soon</span>
        </KeyCap>
      </span>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={keyClass}>
      <KeyCap variant={variant}>
        {children}
        {arrow}
      </KeyCap>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
