import { CountUp } from "@/components/ui/count-up";
import { Reveal } from "@/components/ui/reveal";
import { Spotlight } from "@/components/ui/spotlight";
import { numbers } from "@/content/work";

/** The headline numbers, set as large as the screen allows, each counting up into place. */
export function NumbersStrip() {
  return (
    <Spotlight as="section" size={700} className="border-y border-hairline">
      <div id="numbers" aria-label="In numbers" className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <ul className="grid sm:grid-cols-2 xl:grid-cols-4">
          {numbers.map((item, index) => (
            <li
              key={item.label}
              className="group border-b border-hairline py-14 last:border-b-0 sm:py-24 sm:max-xl:nth-3:border-b-0 sm:max-xl:even:pl-8 xl:border-r xl:border-b-0 xl:px-10 xl:first:pl-0 xl:last:border-r-0"
            >
              <Reveal delay={index * 0.08}>
                <p className="label text-ink-faint">{item.source}</p>
                <p className="display mt-5 text-[clamp(4.5rem,8vw,7.5rem)] text-ink transition-transform duration-700 ease-out-expo group-hover:-translate-y-1">
                  <span className="text-signal">
                    <CountUp value={item.value} />
                  </span>
                </p>
                <p className="mt-4 text-lg text-ink-muted sm:text-xl">{item.label}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </Spotlight>
  );
}
