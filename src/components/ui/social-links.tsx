import { brandIcons } from "@/components/icons/brand";
import { site } from "@/content/site";

/**
 * Row of icon links to the owner's GitHub, X and LinkedIn profiles.
 * `onColor` is for use on the orange footer, where the hover fill is ink.
 */
export function SocialLinks({
  className = "",
  onColor = false,
}: {
  className?: string;
  onColor?: boolean;
}) {
  return (
    <ul className={`flex items-center gap-1.5 ${className}`}>
      {site.socials.map(({ id, label, href }) => {
        const Icon = brandIcons[id];
        return (
          <li key={id}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${label} profile (opens in a new tab)`}
              className={`flex size-11 items-center justify-center rounded-full border border-hairline text-ink transition-[color,background-color,border-color,translate] duration-300 ease-out-expo hover:-translate-y-0.5 ${
                onColor
                  ? "hover:border-ink hover:bg-ink hover:text-paper"
                  : "hover:border-signal hover:bg-signal hover:text-on-signal"
              }`}
            >
              <Icon className="size-4" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
