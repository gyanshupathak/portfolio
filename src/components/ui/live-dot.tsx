/** "Live" indicator: a solid orange dot with a slow expanding pulse behind it. */
export function LiveDot({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`relative inline-flex size-2 shrink-0 ${className}`}>
      <span className="absolute inset-0 animate-live-ping rounded-full bg-signal motion-reduce:animate-none" />
      <span className="relative size-2 rounded-full bg-signal" />
    </span>
  );
}
