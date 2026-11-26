import { Trophy } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Spotlight } from "@/components/ui/spotlight";
import { TitleReveal } from "@/components/ui/title-reveal";
import { automations, recognition } from "@/content/profile";

const card = "h-full rounded-[1.75rem] border border-hairline bg-card/60 p-7 sm:p-9";

/** The steps of an automation as chips joined by a line with a pulse travelling along it. */
function Pipeline({ steps }: { steps: readonly string[] }) {
  return (
    <ol className="mt-10 flex flex-wrap items-center gap-y-3">
      {steps.map((step, index) => (
        <li key={step} className="flex items-center">
          <span
            className={`rounded-full border px-4 py-2 font-mono text-xs tracking-wide ${
              index === 1 ? "border-signal/60 bg-signal/10 text-signal" : "border-hairline-strong text-ink"
            }`}
          >
            {step}
          </span>
          {index < steps.length - 1 ? (
            <span aria-hidden className="relative mx-2 h-px w-10 overflow-hidden bg-hairline-strong sm:w-14">
              <span
                className="absolute inset-y-0 left-0 w-1/3 animate-flow bg-signal"
                style={{ animationDelay: `${index * -0.6}s` }}
              />
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

/**
 * Side builds and recognition as one bento: the two automations side by
 * side, then the awards beside the degree. Every card carries its own
 * pointer spotlight.
 */
export function LabSection() {
  const awards = recognition.items.filter((item) => item.id !== "iitr");
  const degree = recognition.items.find((item) => item.id === "iitr");

  return (
    <section id="lab" className="relative">
      <div className="mx-auto w-full max-w-[1400px] px-5 py-32 sm:px-8 sm:py-44 lg:py-56">
        <p className="label text-signal">The lab</p>
        <TitleReveal
          text="Side builds & recognition."
          className="display mt-5 max-w-[14ch] text-[clamp(3.5rem,8vw,7.5rem)] text-ink"
        />

        <div className="mt-16 grid gap-5 lg:grid-cols-6">
          {automations.items.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.06} className="lg:col-span-3">
              <Spotlight className={card}>
                <p className="label text-ink-faint">
                  Automation {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="display mt-5 text-[clamp(2rem,3.4vw,3rem)] leading-[1] text-ink">
                  {item.title}
                </h3>
                <p className="mt-5 max-w-[34rem] text-lg leading-relaxed text-ink-muted">
                  {item.summary}
                </p>
                <Pipeline steps={item.flow} />
              </Spotlight>
            </Reveal>
          ))}

          <Reveal delay={0.1} className="lg:col-span-4">
            <Spotlight className={card}>
              <p className="label flex items-center gap-2 text-ink-faint">
                <Trophy className="size-3.5 text-signal" strokeWidth={2} />
                {recognition.label}
              </p>
              <ul className="mt-6">
                {awards.map((item) => (
                  <li
                    key={item.id}
                    className="group flex flex-col gap-1 border-b border-hairline py-6 last:border-b-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                  >
                    <span className="display text-[clamp(1.9rem,3vw,2.75rem)] leading-[1] text-ink transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5">
                      {item.title}
                    </span>
                    <span className="text-base text-ink-muted sm:text-right sm:text-lg">
                      {item.kicker}
                      {item.detail ? <span className="text-ink-faint"> · {item.detail}</span> : null}
                    </span>
                  </li>
                ))}
              </ul>
            </Spotlight>
          </Reveal>

          {degree ? (
            <Reveal delay={0.16} className="lg:col-span-2">
              <Spotlight className="h-full rounded-[1.75rem] bg-signal p-7 sm:p-9 flex flex-col justify-between">
                <p className="label text-on-signal/80">Education</p>
                <div className="mt-10">
                  <p className="display text-[clamp(3.5rem,6vw,5.5rem)] text-on-signal">
                    IIT Roorkee
                  </p>
                  <p className="mt-5 text-lg leading-snug font-semibold text-on-signal">{degree.title}</p>
                  <p className="mt-2 text-base text-on-signal/80">{degree.detail}</p>
                </div>
              </Spotlight>
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}
