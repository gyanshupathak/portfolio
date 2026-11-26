"use client";

import { motion, type Variants } from "motion/react";
import { Fragment } from "react";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055 } },
};

const word: Variants = {
  hidden: { y: "112%" },
  show: { y: 0, transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1] } },
};

/**
 * Section title whose words rise out of a mask, one after another, the first
 * time it scrolls into view. The last word is set in orange.
 * The words stay real text in reading order.
 */
export function TitleReveal({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(" ");

  return (
    <motion.h2
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      className={className}
    >
      {words.map((item, index) => {
        const isLast = index === words.length - 1;
        return (
          <Fragment key={`${item}-${index}`}>
            {/* The padding keeps descenders inside the mask. */}
            <span className="-mx-[0.06em] -mb-[0.2em] inline-block overflow-hidden px-[0.06em] pb-[0.2em] align-bottom">
              <motion.span
                variants={word}
                className={`inline-block ${isLast && words.length > 1 ? "text-signal" : ""}`}
              >
                {item}
              </motion.span>
            </span>
            {isLast ? null : " "}
          </Fragment>
        );
      })}
    </motion.h2>
  );
}
