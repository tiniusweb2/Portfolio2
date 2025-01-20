import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PS2Loading } from "@/components/custom/ps2-loading";
import { BlogGallery } from "@/components/custom/blog-gallery";
import { ThemeToggle } from "@/components/custom/theme-toggle";
import { ProfessionalProfile } from "@/components/custom/professional-profile";
import { HeroBanner } from "@/components/custom/hero-banner";
import { ConsultantAssessment } from "@/components/custom/consultant-assessment";
import { SkillsTimeline } from "@/components/custom/skills-timeline";
import { SocialWidget } from "@/components/custom/social-widget";
import { SkillEndorsementCarousel } from "@/components/custom/skill-endorsement-carousel";
import { Footer } from "@/components/custom/footer";

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
    <div className="ps2-container ps2-cursor min-h-screen flex flex-col">
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

      <main className="container mx-auto px-4 pt-8 sm:pt-12 flex-grow">
        <section className="mb-8 sm:mb-12">
          <SocialWidget />
        </section>

        <section className="mb-8 sm:mb-12">
          <ProfessionalProfile />
        </section>

        <section className="mb-8 sm:mb-12">
          <SkillsTimeline />
        </section>

        <section className="mb-8 sm:mb-12">
          <SkillEndorsementCarousel />
        </section>

        <section className="mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-700 dark:text-blue-300 mb-4 sm:mb-6">
            Work With Me
          </h2>
          <div className="max-w-[95%] sm:max-w-2xl mx-auto">
            <ConsultantAssessment />
          </div>
        </section>

        <section className="mb-8 sm:mb-12">
          <BlogGallery />
        </section>
      </main>

      <Footer />
    </div>
  );
}