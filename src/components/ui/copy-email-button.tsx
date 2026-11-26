"use client";

import { Check, Copy } from "lucide-react";
import { site } from "@/content/site";
import { useCopy } from "@/hooks/use-copy";
import { KeyCap, keyClass } from "./key";

/**
 * Copies the contact email and swaps its label to "Copied ✓" for two
 * seconds. Both labels share one grid cell, so the key never changes width
 * and the swap is a pure opacity/transform transition.
 */
export function CopyEmailButton() {
  const { copied, copy } = useCopy(site.email);

  const label =
    "col-start-1 row-start-1 flex items-center justify-center gap-2 transition-[opacity,translate] duration-300 ease-out-expo";

  return (
    <button type="button" onClick={copy} title={site.email} className={keyClass}>
      <KeyCap variant="paper">
        <span className="grid">
          <span
            aria-hidden={copied}
            className={`${label} ${copied ? "-translate-y-1.5 opacity-0" : "opacity-100"}`}
          >
            <Copy className="size-3.5" strokeWidth={2} />
            Copy Email
          </span>
          <span
            aria-hidden={!copied}
            className={`${label} ${copied ? "opacity-100" : "translate-y-1.5 opacity-0"}`}
          >
            Copied
            <Check className="size-3.5 text-signal" strokeWidth={3} />
          </span>
        </span>
      </KeyCap>
      <span role="status" className="sr-only">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </button>
  );
}
