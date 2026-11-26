import type { ReactNode } from "react";

/**
 * A quiet card. The face lifts a little on hover and a short orange rule
 * draws in along the top. The outer element is the hover target and never
 * moves, so the face cannot slide out from under the pointer.
 */
export function Plate({
  children,
  className = "",
  faceClassName = "bg-card",
  lift = true,
}: {
  children: ReactNode;
  className?: string;
  faceClassName?: string;
  /** Kept so older call sites still type-check. Colour now comes from the face. */
  depth?: "ink" | "signal";
  lift?: boolean;
}) {
  return (
    <div className={`group/plate relative ${className}`}>
      <div
        className={`relative h-full overflow-hidden rounded-3xl border border-hairline bg-card shadow-[0_24px_60px_-40px_rgb(28_22_18/0.55)] ${faceClassName} ${
          lift
            ? "transition-[translate,border-color] duration-500 ease-out-expo group-hover/plate:-translate-y-1 group-hover/plate:border-signal/35"
            : ""
        }`}
      >
        <span
          aria-hidden
          className="absolute inset-x-8 top-0 h-px origin-left scale-x-0 bg-signal transition-transform duration-500 ease-out-expo group-hover/plate:scale-x-100"
        />
        {children}
      </div>
    </div>
  );
}
