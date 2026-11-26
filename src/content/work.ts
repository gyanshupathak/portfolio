/**
 * Copy and media paths for the two flagship project sections.
 *
 * A `null` href renders its button in a non-clickable state so the page
 * never ships a dead or guessed link.
 */

export type ProjectLink = {
  label: string;
  href: string | null;
};

export const oasis = {
  id: "oasis",
  index: "01",
  label: "OASIS AI",
  title: "AI-Native Video Creation Platform & Client Production",
  links: [
    { label: "Visit Website", href: "https://oasisstudio.in" },
    { label: "Open Live App", href: "https://app.oasisstudio.in" },
  ] satisfies ProjectLink[],

  tabs: [
    { id: "showreel", label: "Showreel" },
    { id: "platform", label: "Platform & Engine" },
  ],

  /**
   * Shown as two landscape reels beside two vertical ones. `previewAt` is the
   * second whose frame stands in as the still, for videos that open on black.
   */
  reels: [
    {
      id: "ziptier",
      src: "/media/ziptier 2.mp4",
      title: "Zip Tier",
      duration: "1:31",
      orientation: "landscape",
      previewAt: 3,
    },
    {
      id: "flair",
      src: "/media/flair.mp4",
      title: "Flare",
      duration: "0:54",
      orientation: "landscape",
      previewAt: 3,
    },
    {
      id: "vingo",
      src: "/media/vingo.mp4",
      title: "Vingo",
      duration: "0:35",
      orientation: "portrait",
      previewAt: 3,
    },
    {
      id: "oasis-logo",
      src: "/media/Oasis-Logo-Reveal (1).mp4",
      title: "Oasis Logo Reveal",
      duration: "0:30",
      orientation: "portrait",
      previewAt: 3,
    },
  ],

  platform: {
    shots: [
      {
        src: "/media/oasis1.png",
        label: "Sign in",
        alt: "Oasis sign-in screen with the line “Turn Expertise Into Reels.”",
      },
      {
        src: "/media/oasis2.png",
        label: "Studio",
        alt: "Oasis studio: a content box on the left and the reel preview on the right",
      },
    ],
    /** Pixel size shared by the screenshots. */
    shotSize: { width: 1917, height: 905 },
    highlights: [
      {
        title: "Studio UI",
        detail: "The creation studio interface, built on Next.js 16 and React 19.",
        tags: ["Next.js 16", "React 19"],
      },
      {
        title: "Motion-reel pipeline",
        detail: "A Remotion pipeline that renders motion reels.",
        tags: ["Remotion"],
      },
      {
        title: "Multi-provider AI orchestration",
        detail: "Routes generation across providers with automatic fallbacks.",
        tags: ["OpenAI", "Claude", "Gemini", "AWS Bedrock"],
      },
      {
        title: "Scene-level diff editing",
        detail: "Describe a change in natural language and edit a single scene.",
        tags: ["Natural language"],
      },
    ],
    metrics: [
      { value: "250+", label: "videos generated" },
      { value: "100+", label: "onboarded users" },
    ],
  },
} as const;

export const lucidly = {
  id: "lucidly",
  index: "02",
  label: "LUCIDLY LABS",
  title: "Full-Stack Web3 & DeFi Platform",

  /** The headline number, set very large. */
  growth: { from: "$0", to: "$600K", label: "Platform TVL" },
  facts: ["Intern → Full-Time", "Jun 2025 – Dec 2025", "Remote / London"],

  modulesTitle: "Modules shipped at Lucidly Labs.",
  modules: [
    {
      title: "Vault, swap & strategy UI",
      detail: "Smart-contract interfaces for vaults, swaps and strategies.",
      tags: ["Next.js", "wagmi", "viem"],
    },
    {
      title: "Portfolio & activity dashboards",
      detail: "Dashboards for portfolio and activity, with TanStack Query caching.",
      tags: ["TanStack Query"],
    },
    {
      title: "Indexing & analytics",
      detail: "Ponder and PostgreSQL indexing with PnL and APY analytics.",
      tags: ["Ponder", "PostgreSQL"],
    },
    {
      title: "Product analytics",
      detail: "GA4 instrumentation with 50+ custom events.",
      tags: ["GA4"],
    },
    {
      title: "Rain debit-card architecture",
      detail: "Architecture research for a Rain debit-card integration.",
      tags: ["Research"],
    },
  ],
} as const;

export const movieDao = {
  id: "moviedao",
  index: "03",
  label: "THE OASIS",
  title: "AI-Directed, Crowd-Owned Film Studio",
  link: { label: "ETHGlobal showcase", href: "https://ethglobal.com/showcase/the-oasis-j7gxz" },
  /** The launch demo from the ETHGlobal showcase. */
  video: {
    src: "/media/movie-studio/demo.mp4",
    title: "Launch demo",
    duration: "3:43",
    previewAt: 6,
  },
  shots: [
    { src: "/media/movie-studio/01-welcome.jpg", label: "Welcome", alt: "The Oasis landing screen: “Welcome to the Oasis”, a gateway to decentralized movie DAOs" },
    { src: "/media/movie-studio/02-create-dao.jpg", label: "Create a Movie DAO", alt: "Form to create a movie DAO beside the list of existing movies" },
    { src: "/media/movie-studio/03-script-vote.jpg", label: "Script & vote", alt: "Movie DAO members, an AI-generated script proposal and the script voting controls" },
    { src: "/media/movie-studio/04-finalized-movie.jpg", label: "Finalized movie", alt: "The finalized movie generated from the voted script, with vote and release controls" },
    { src: "/media/movie-studio/05-nft-payout.jpg", label: "NFT payout", alt: "Confirmation that NFTs were distributed to the DAO members" },
  ],
  /** Pixel size shared by the screenshots. */
  shotSize: { width: 1894, height: 880 },
  points: [
    {
      title: "A DAO for every movie",
      detail:
        "Each film starts as its own DAO. The creator receives Founder NFTs and contributors join to shape the movie.",
      tags: ["DAO", "Founder NFTs"],
    },
    {
      title: "The crowd votes on script and cut",
      detail:
        "Members vote on AI-generated scripts and videos; whoever finalizes a step is rewarded with tokens.",
      tags: ["On-chain voting", "Tokens"],
    },
    {
      title: "AI-generated films",
      detail: "The AI generation behind each film runs on Gemini.",
      tags: ["Gemini"],
    },
    {
      title: "An agent pays everyone out",
      detail:
        "Coinbase AgentKit sends Script NFTs and tokens to contributors and splits revenue by each member's holdings.",
      tags: ["Coinbase AgentKit", "Base Sepolia"],
    },
    {
      title: "Stored on IPFS",
      detail: "Scripts and media are stored on IPFS through Pinata.",
      tags: ["IPFS", "Pinata"],
    },
  ],
} as const;
/**
 * The three projects on the work rail, in order. Each one opens a full case
 * sheet; the rail card only needs this summary.
 */
export const projects = [
  {
    id: "oasis",
    index: "01",
    name: "Oasis AI",
    kicker: "Solo Founder · 2026",
    summary:
      "An AI-native video studio that turns blogs, LinkedIn posts and scripts into production-ready reels.",
    tags: ["Next.js 16", "Remotion", "Multi-provider AI"],
    cta: "Open case",
  },
  {
    id: "lucidly",
    index: "02",
    name: "Lucidly Labs",
    kicker: "FullStack Web3 Engineer · 2025",
    summary:
      "Vault deposits, swaps and multi-step strategies wired to smart contracts, as platform TVL grew from $0 to $600K.",
    tags: ["wagmi", "viem", "Ponder"],
    cta: "Open case",
  },
  {
    id: "moviedao",
    index: "03",
    name: "AI Movie DAO",
    kicker: "Solo build · Agentic Ethereum · Coinbase AgentKit prize",
    summary:
      "The Oasis: a crowd-owned film studio where a DAO votes on AI-generated scripts and cuts, and an agent pays contributors.",
    tags: ["Coinbase AgentKit", "Gemini", "IPFS"],
    cta: "Open case",
  },
] as const;

export type ProjectId = (typeof projects)[number]["id"];
export type OasisTabId = (typeof oasis.tabs)[number]["id"];

/** Headline numbers, each from the project that produced it. */
export const numbers = [
  { value: "250+", label: "videos generated", source: "Oasis AI" },
  { value: "100+", label: "users onboarded", source: "Oasis AI" },
  { value: "150+", label: "customer conversations", source: "Oasis AI" },
  { value: "$600K", label: "platform TVL, from $0", source: "Lucidly Labs" },
] as const;
