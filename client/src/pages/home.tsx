import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PS2Loading } from "@/components/custom/ps2-loading";
import { SkillsGrid } from "@/components/custom/skills-grid";
import { MediaLibrary } from "@/components/custom/media-library";
import { MediaPlayer } from "@/components/custom/media-player";
import { ThemeToggle } from "@/components/custom/theme-toggle";
import { ProfessionalProfile } from "@/components/custom/professional-profile";
import { HeroBanner } from "@/components/custom/hero-banner";
import { GitHubCommits } from "@/components/custom/github-commits";
import { ConsultantAssessment } from "@/components/custom/consultant-assessment";
import { SkillsTimeline } from "@/components/custom/skills-timeline";

const createParticle = () => ({
  id: Math.random(),
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  directionX: Math.random() * 2 - 1,
  directionY: Math.random() * 2 - 1,
});

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [particles] = useState(() =>
    Array.from({ length: 50 }, createParticle)
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <PS2Loading />;
  }

  return (
    <div className="ps2-container ps2-cursor">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            '--direction-x': particle.directionX,
            '--direction-y': particle.directionY,
          } as React.CSSProperties}
        />
      ))}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-4 right-4 z-50"
      >
        <ThemeToggle />
      </motion.div>

      <HeroBanner />

      <main className="container mx-auto px-4 pt-12">
        <section className="mb-12">
          <GitHubCommits />
        </section>

        <section className="mb-12">
          <SkillsTimeline />
        </section>

        <section className="mb-12">
          <ProfessionalProfile />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-6">
            Work With Me
          </h2>
          <ConsultantAssessment />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-6">
            Skills & Expertise
          </h2>
          <SkillsGrid />
        </section>

        <section className="mb-12">
          <MediaLibrary />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-6">
            Media Player
          </h2>
          <MediaPlayer />
        </section>
      </main>

      <footer className="text-center p-8 text-blue-700 dark:text-blue-300">
        <p>© 2024 Developer Portfolio. PlayStation 2 Inspired.</p>
      </footer>
    </div>
  );
}