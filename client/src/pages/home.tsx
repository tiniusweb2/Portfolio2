import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PS2Loading } from "@/components/custom/ps2-loading";
import { SkillsGrid } from "@/components/custom/skills-grid";
import { MediaLibrary } from "@/components/custom/media-library";
import { MediaPlayer } from "@/components/custom/media-player";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

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
      <div className="ps2-scan-line fixed inset-0 pointer-events-none" />
      
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-blue-400 ps2-text-glow">
          Developer Portfolio
        </h1>
        <p className="mt-4 text-blue-300">
          Welcome to my PlayStation 2 inspired portfolio
        </p>
      </motion.header>

      <main className="container mx-auto px-4">
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-blue-300 mb-6 ps2-text-glow">
            Skills & Expertise
          </h2>
          <SkillsGrid />
        </section>

        <section className="mb-12">
          <MediaLibrary />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-blue-300 mb-6 ps2-text-glow">
            Media Player
          </h2>
          <MediaPlayer />
        </section>
      </main>

      <footer className="text-center p-8 text-blue-300">
        <p>© 2024 Developer Portfolio. PlayStation 2 Inspired.</p>
      </footer>
    </div>
  );
}
