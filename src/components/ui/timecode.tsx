"use client";

import { useEffect, useRef } from "react";

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * A running SMPTE-style timecode (hh:mm:ss:ff at 24 fps) counted from when
 * the page opened. The server renders zeros; the client takes over after
 * hydration by writing the text directly, so React never re-renders it.
 */
export function Timecode({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    let shown = "";
    function tick(now: number) {
      const total = (now - start) / 1000;
      const text = `${pad(Math.floor(total / 3600))}:${pad(Math.floor(total / 60) % 60)}:${pad(
        Math.floor(total) % 60,
      )}:${pad(Math.floor((total % 1) * 24))}`;
      if (text !== shown && ref.current) {
        ref.current.textContent = text;
        shown = text;
      }
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      00:00:00:00
    </span>
  );
}
