/**
 * Single source of truth for owner details, links and positioning copy.
 * Every string a visitor reads about the owner lives here so it can be
 * edited without touching components.
 */
export const site = {
  name: "Gyanshu Pathak",
  monogram: "GP",
  role: "AI-Native Product Builder",
  email: "gyanshupathak77@gmail.com",
  resumePath: "/media/resume.pdf",
  resumeFileName: "Gyanshu-Pathak-Resume.pdf",
  copyrightYear: 2026,

  meta: {
    title: "Gyanshu Pathak — AI-Native Product Builder",
    description:
      "AI-native product builder — taking ideas from blank canvas to live interfaces, generative media products, and interactive web experiences.",
  },

  socials: [
    { id: "github", label: "GitHub", href: "https://github.com/gyanshupathak" },
    { id: "x", label: "X", href: "https://x.com/gyanshu_pathak" },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/gyanshu-pathak/",
    },
  ],

  nav: [
    { label: "Work", target: "work" },
    { label: "Experience", target: "experience" },
    { label: "Lab", target: "lab" },
    { label: "Contact", target: "contact" },
  ],

  hero: {
    status: "Open to Product Builder, Product Engineer & FDE roles",
    /** Set on two lines, the last name in orange. */
    firstName: "Gyanshu",
    lastName: "Pathak",
    subheadline:
      "AI-native product builder — taking ideas from blank canvas to live interfaces, generative media products, and interactive web experiences.",
    primaryCta: { label: "Explore Work", target: "work" },
    hud: {
      hint: "Move your cursor",
    },
    portrait: {
      src: "/media/me.jpeg",
      /** Pixel size of the file, so the browser can reserve its space. */
      width: 777,
      height: 1280,
      alt: "Portrait of Gyanshu Pathak",
      caption: "IIT Roorkee",
      /**
       * Which part of the photo the 4:5 frame shows, as fractions of the full
       * image: the left and top edge of the crop and its width. Nudge these to
       * reframe without editing the file.
       */
      crop: { x: 0.36, y: 0.4, width: 0.58 },
    },
  },

  identity: {
    title: "Identity Spec",
    statements: [
      "AI-native product builder turning raw ideas into live, polished software—fast.",
      "Started in design, learned to ship full products, now obsessed with generative media and interactive web experiences.",
    ],
  },
} as const;

export type SocialId = (typeof site.socials)[number]["id"];
