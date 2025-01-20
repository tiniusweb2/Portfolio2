import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PS2Loading } from "@/components/custom/ps2-loading";
import { SkillsGrid } from "@/components/custom/skills-grid";
import { MediaLibrary } from "@/components/custom/media-library";
import { MediaPlayer } from "@/components/custom/media-player";
import { ThemeToggle } from "@/components/custom/theme-toggle";
import { ProfessionalProfile } from "@/components/custom/professional-profile";
import { HeroBanner } from "@/components/custom/hero-banner";
import { BackgroundAnimation } from "@/components/custom/background-animation";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    // Set up intersection observer for scroll reveal animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    // Observe all scroll-reveal elements
    document.querySelectorAll('.scroll-reveal').forEach((el) => observer.observe(el));

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  if (isLoading) {
    return <PS2Loading />;
  }

  return (
    <div className="ps2-container ps2-cursor">
      <BackgroundAnimation />

      <header className="relative z-10">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <HeroBanner />
      </header>

      <main className="container mx-auto px-4">
        <section className="mb-12 scroll-reveal parallax-section">
          <ProfessionalProfile />
        </section>

        <section className="mb-12 scroll-reveal parallax-section">
          <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-6 ps2-text-glow">
            Skills & Expertise
          </h2>
          <SkillsGrid />
        </section>

        <section className="mb-12 scroll-reveal parallax-section">
          <MediaLibrary />
        </section>

        <section className="mb-12 scroll-reveal parallax-section">
          <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-6 ps2-text-glow">
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