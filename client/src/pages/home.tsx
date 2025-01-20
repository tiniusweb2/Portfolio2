import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PS2Loading } from "@/components/custom/ps2-loading";
import { SkillsGrid } from "@/components/custom/skills-grid";
import { MediaLibrary } from "@/components/custom/media-library";
import { MediaPlayer } from "@/components/custom/media-player";

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

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-blue-600 ps2-text-glow">
          Developer Portfolio
        </h1>
        <p className="mt-4 text-blue-800">
          Welcome to my PlayStation 2 inspired portfolio
        </p>
      </motion.header>

      <main className="container mx-auto px-4">
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-blue-700 mb-6 ps2-text-glow">
            Skills & Expertise
          </h2>
          <SkillsGrid />
        </section>

        <section className="mb-12">
          <MediaLibrary />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-blue-700 mb-6 ps2-text-glow">
            Media Player
          </h2>
          <MediaPlayer />
        </section>
      </main>

      <footer className="text-center p-8 text-blue-700">
        <p>© 2024 Developer Portfolio. PlayStation 2 Inspired.</p>
      </footer>
    </div>
  );
}