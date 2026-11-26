"use client";

import { Film, ImageIcon, type LucideIcon } from "lucide-react";
import Image from "next/image";
import { useState, type ReactNode } from "react";

/**
 * Stand-in for a missing image or video. Fills its positioned parent with a
 * hatched sand panel and names the file that belongs there, so it is obvious
 * what to drop in.
 */
export function MediaFallback({
  label,
  path,
  kind = "image",
}: {
  label: string;
  path?: string;
  kind?: "image" | "video";
}) {
  const Icon: LucideIcon = kind === "video" ? Film : ImageIcon;

  return (
    <div className="hatch absolute inset-0 flex flex-col items-center justify-center gap-3 overflow-hidden bg-sand px-6 text-center">
      <span className="flex size-11 items-center justify-center rounded-full border border-hairline bg-card text-signal">
        <Icon className="size-4" strokeWidth={1.75} />
      </span>
      <p className="rounded-full border border-hairline bg-card px-3.5 py-1.5 font-mono text-[10px] tracking-[0.2em] text-ink uppercase">
        {label}
      </p>
      {path ? <p className="font-mono text-[10px] tracking-wide text-ink-muted">{path}</p> : null}
    </div>
  );
}

/**
 * Image that fills its positioned parent, with the styled fallback when the
 * file is absent (`available` is resolved on the server) or fails to load.
 */
export function MediaImage({
  src,
  alt,
  available,
  sizes,
  fallbackLabel,
  className = "object-cover object-top",
}: {
  src: string;
  alt: string;
  available: boolean;
  sizes: string;
  fallbackLabel: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!available || failed) {
    return <MediaFallback label={fallbackLabel} path={src} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

/**
 * A quiet browser window. Children fill a viewport of the given aspect
 * ratio (width / height).
 */
export function BrowserFrame({
  label,
  aspect,
  children,
}: {
  label: string;
  aspect: number;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-2xl border border-hairline bg-card shadow-[0_28px_70px_-40px_rgb(28_22_18/0.55)]">
        <div className="flex h-10 items-center gap-3 border-b border-hairline bg-sand/70 px-4">
          <div aria-hidden className="flex w-12 gap-1.5">
            <span className="size-2 rounded-full bg-signal" />
            <span className="size-2 rounded-full bg-ink/15" />
            <span className="size-2 rounded-full bg-ink/15" />
          </div>
          <p className="mx-auto truncate font-mono text-[10px] tracking-[0.14em] text-ink-muted">
            {label}
          </p>
          <div aria-hidden className="w-12" />
        </div>
        <div style={{ aspectRatio: aspect }} className="relative bg-black">
          {children}
        </div>
      </div>
    </div>
  );
}

/** Small mono tag used for tech names. */
export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-hairline-strong px-2 py-1 font-mono text-[10px] tracking-wide text-ink">
      {children}
    </span>
  );
}
