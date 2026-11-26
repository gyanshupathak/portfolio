/** Copy for the experience timeline, side automations and recognition strip. */

export const experience = {
  id: "experience",
  index: "03",
  label: "EXPERIENCE",
  title: "Experience timeline",
  roles: [
    {
      company: "Oasis AI",
      role: "Solo Founder",
      period: "Feb 2026 – Sep 2026",
      location: "Remote / Bootstrapped",
      summary:
        "Founded Oasis AI solo and shipped the video studio at oasisstudio.in, from customer research through delivery. Built the studio UI, a Remotion motion pipeline and multi-provider generation with fallbacks. 150+ customer conversations, 250+ videos generated and 100+ users onboarded.",
    },
    {
      company: "Lucidly Labs",
      role: "FullStack Web3 Engineer",
      period: "Jun 2025 – Dec 2025",
      location: "Remote / London",
      summary:
        "Converted from intern to full-time. Shipped vault, swap and strategy flows, portfolio dashboards and Ponder indexing as platform TVL grew from $0 to $600K.",
    },
    {
      company: "We Do Good",
      role: "Product Designer & Project Manager",
      period: "Jan 2025 – Apr 2025",
      location: "Remote",
      summary:
        "Led client discovery and designed & shipped production websites using Figma, Framer, and Webflow for startups and enterprises.",
    },
    {
      company: "Zeta Inc. (Aadi)",
      role: "Frontend Web3 Engineer",
      period: "Jun 2024 – Nov 2024",
      location: "Remote / Dubai",
      summary:
        "Shipped Next.js & shadcn/ui Web3 interfaces, wallet flows, OAuth2/JWT auth, and Telegram dApps driving +30% user engagement.",
    },
    {
      company: "Genloop",
      role: "Frontend Engineer",
      period: "Jun 2024 – Sep 2024",
      location: "Remote / Santa Clara",
      summary:
        "Built reusable Next.js + TypeScript UI components and optimized state management for an AI SaaS platform, reducing page load times by 25%.",
    },
  ],
} as const;

export const automations = {
  id: "automations",
  index: "04",
  label: "AUTOMATIONS",
  title: "Side automations",
  items: [
    {
      id: "publisher",
      title: "Telegram → X & LinkedIn Publisher",
      summary:
        "Personal bot capturing daily engineering & product learnings via Telegram and publishing them automatically.",
      flow: ["Telegram", "Bot", "X + LinkedIn"],
    },
    {
      id: "scout",
      title: "Telegram Role-Discovery Scout",
      summary:
        "Automated personal scout surfacing relevant Frontend & Product Engineer startup openings.",
      flow: ["Startup openings", "Scout", "Telegram"],
    },
  ],
} as const;

export const recognition = {
  label: "RECOGNITION",
  items: [
    {
      id: "secgit",
      kicker: "SecGit",
      title: "ETHGlobal New Delhi Winner",
      detail: "3 track wins",
    },
    {
      id: "agentic",
      kicker: "Agentic Ethereum · The Oasis",
      title: "Coinbase Track Winner",
      detail: null,
    },
    {
      id: "blinkx",
      kicker: "BlinkX Brainathon",
      title: "National Finalist",
      detail: null,
    },
    {
      id: "iitr",
      kicker: "Indian Institute of Technology, Roorkee",
      title: "B.Tech Metallurgical & Materials Science Engineering",
      detail: "Graduated · 2022 – 2026",
    },
  ],
} as const;

export type RecognitionId = (typeof recognition.items)[number]["id"];
export type AutomationId = (typeof automations.items)[number]["id"];
