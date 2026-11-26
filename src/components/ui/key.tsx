import type { ReactNode } from "react";

/**
 * Put this on the clickable element (`<button>`, `<a>`), with a `KeyCap`
 * inside. The element stays put while the cap moves, so the hit area never
 * shifts under the pointer.
 */
export const keyClass = "group/key relative inline-flex rounded-full select-none";

const faces = {
  /** Orange cap, for the main action. */
  signal: "bg-signal text-on-signal",
  /** Paper cap, with orange showing underneath. */
  paper: "bg-card text-ink",
  /** Not pressable: a flat, hatched cap. */
  disabled: "hatch bg-sand text-ink-faint",
} as const;

export type KeyVariant = keyof typeof faces;

const sizes = {
  md: "h-12 gap-2 px-5 text-sm",
  sm: "h-9 gap-1.5 px-3.5 text-[13px]",
} as const;

/**
 * A small physical key. The cap sits on a block of orange and travels down
 * into it on hover and press. Only `translate` is animated.
 */
export function KeyCap({
  variant = "paper",
  size = "md",
  children,
  className = "",
}: {
  variant?: KeyVariant;
  size?: keyof typeof sizes;
  children: ReactNode;
  className?: string;
}) {
  const pressable = variant !== "disabled";
  const depth = size === "md" ? "translate-y-[5px]" : "translate-y-[4px]";
  const travel =
    size === "md"
      ? "group-hover/key:translate-y-[2px] group-active/key:translate-y-[5px]"
      : "group-hover/key:translate-y-[1.5px] group-active/key:translate-y-[4px]";
  const side = variant === "signal" ? "bg-signal-deep" : "bg-signal";

  return (
    <>
      {pressable ? (
        <span aria-hidden className={`absolute inset-0 rounded-full ${side} ${depth}`} />
      ) : null}
      <span
        className={`relative inline-flex w-full items-center justify-center rounded-full border font-medium whitespace-nowrap transition-[translate] duration-150 ease-out ${
          sizes[size]
        } ${faces[variant]} ${pressable ? `border-ink/10 ${travel}` : "border-hairline"} ${className}`}
      >
        {children}
      </span>
    </>
  );
}
