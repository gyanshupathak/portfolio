import { CommandPalette } from "@/components/command-palette";
import { Cursor } from "@/components/cursor";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero/hero";
import { Navbar } from "@/components/navbar";
import { Preloader } from "@/components/preloader";
import { ExperienceSection } from "@/components/sections/experience-section";
import { LabSection } from "@/components/sections/lab-section";
import { Manifesto } from "@/components/sections/manifesto";
import { NumbersStrip } from "@/components/sections/numbers-strip";
import { CaseSheet } from "@/components/work/case-sheet";
import { WorkRail } from "@/components/work/work-rail";
import { site } from "@/content/site";
import { movieDao, oasis } from "@/content/work";
import { mediaExists } from "@/lib/media";

export default function Home() {
  // Resolved on the server so missing files render their fallback directly
  // instead of requesting a file that is not there.
  const media = {
    portrait: mediaExists(site.hero.portrait.src),
    resume: mediaExists(site.resumePath),
    oasis: {
      reels: oasis.reels.map((reel) => mediaExists(reel.src)),
      shots: oasis.platform.shots.map((shot) => mediaExists(shot.src)),
    },
    movieDao: {
      shots: movieDao.shots.map((shot) => mediaExists(shot.src)),
      video: mediaExists(movieDao.video.src),
    },
  };

  return (
    <>
      <Preloader />
      <Navbar resumeAvailable={media.resume} />
      {/* Clipped so the 3D work drum never adds sideways scroll. */}
      <main className="overflow-x-clip">
        <Hero portraitAvailable={media.portrait} />
        <Manifesto />
        <WorkRail reels={media.oasis.reels} movieShots={media.movieDao.shots} />
        <NumbersStrip />
        <ExperienceSection />
        <LabSection />
      </main>
      <Footer />
      <CaseSheet oasisMedia={media.oasis} movieDaoMedia={media.movieDao} />
      <CommandPalette resumeAvailable={media.resume} />
      <Cursor />
    </>
  );
}
