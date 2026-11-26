"use client";

import { ArrowUp, Check, Copy } from "lucide-react";
import { motion, useScroll } from "motion/react";
import { useRef } from "react";
import { KeyCap, keyClass } from "@/components/ui/key";
import { SocialLinks } from "@/components/ui/social-links";
import { TitleReveal } from "@/components/ui/title-reveal";
import { site } from "@/content/site";
import { useCopy } from "@/hooks/use-copy";
import { useScrollLinked } from "@/hooks/use-scroll-linked";
import { useScrollTo } from "@/hooks/use-scroll-to";

/**
 * Closing section: one-click email copy, social links, a way back to the
 * top, and the name as oversized type that rises into place as the page
 * ends.
 */
export function Footer() {
  const { copied, copy } = useCopy(site.email);
  const scrollTo = useScrollTo();

  const footerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: footerRef, offset: ["start end", "end end"] });
  const wordmarkY = useScrollLinked(scrollYProgress, [0, 1], ["42%", "0%"], "0%");

  return (
    <footer
      ref={footerRef}
      id="contact"
      className="relative isolate overflow-hidden border-t border-hairline bg-paper text-ink"
    >
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="guides absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_40%,transparent)]" />
      </div>

      <div className="relative mx-auto w-full max-w-[1400px] px-5 pt-32 sm:px-8 sm:pt-48 lg:pt-56">
        <p className="label text-signal">Contact</p>
        <TitleReveal
          text="Let's ship your next idea."
          className="display mt-6 max-w-[12ch] text-[clamp(3.75rem,10vw,10rem)] text-ink"
        />

        <button
          type="button"
          onClick={copy}
          data-cursor={copied ? "Copied" : "Copy"}
          aria-label={`Copy email address ${site.email}`}
          className="group mt-14 block max-w-full text-left focus-visible:outline-ink"
        >
          <span className="display relative block pb-[0.12em] text-[clamp(1.35rem,4.6vw,4.2rem)] break-all text-ink transition-colors duration-500 group-hover:text-signal">
            {site.email}
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-current transition-[scale] duration-700 ease-out-expo group-hover:scale-x-100"
            />
          </span>
          <span className="mt-5 grid w-fit font-mono text-[11px] tracking-[0.14em] uppercase">
            <span
              aria-hidden={copied}
              className={`col-start-1 row-start-1 flex items-center gap-2 transition-[opacity,translate] duration-300 ease-out-expo ${
                copied ? "-translate-y-1.5 opacity-0" : "opacity-100"
              }`}
            >
              <Copy className="size-3.5" strokeWidth={2} />
              Click to copy email
            </span>
            <span
              aria-hidden={!copied}
              className={`col-start-1 row-start-1 flex items-center gap-2 transition-[opacity,translate] duration-300 ease-out-expo ${
                copied ? "opacity-100" : "translate-y-1.5 opacity-0"
              }`}
            >
              Copied
              <Check className="size-3.5" strokeWidth={3} />
            </span>
          </span>
          <span role="status" className="sr-only">
            {copied ? "Email address copied to clipboard" : ""}
          </span>
        </button>

        <div className="mt-16 flex flex-col gap-6 border-t border-hairline pt-6 text-ink-muted sm:mt-20 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] tracking-wide">
            © {site.copyrightYear} {site.name}
            <span className="mx-2">·</span>
            {site.role}
          </p>
          <div className="flex items-center gap-4 pb-1.5">
            <SocialLinks />
            <button
              type="button"
              onClick={() => scrollTo("top")}
              aria-label="Back to top"
              className={keyClass}
            >
              <KeyCap variant="paper" className="!px-3.5">
                <ArrowUp
                  className="size-4 transition-transform duration-300 ease-out-expo group-hover/key:-translate-y-0.5"
                  strokeWidth={2.5}
                />
              </KeyCap>
            </button>
          </div>
        </div>
      </div>

      {/* Oversized wordmark; the bottom padding keeps descenders and the extrusion inside the mask. */}
      <div aria-hidden className="relative mt-8 overflow-hidden sm:mt-10">
        <motion.p
          style={{ y: wordmarkY }}
          className="display pb-[0.16em] text-center text-[13.2vw] leading-[0.86] whitespace-nowrap text-ink select-none"
        >
          {site.hero.firstName}{" "}
          <span className="text-signal">{site.hero.lastName}</span>
        </motion.p>
      </div>
    </footer>
  );
}
