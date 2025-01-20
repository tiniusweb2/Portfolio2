import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface AnimatedParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

const generateParticle = (): AnimatedParticle => ({
  id: Math.random(),
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 1,
  duration: Math.random() * 20 + 10,
  delay: Math.random() * 5,
});

export function BackgroundAnimation() {
  const [particles, setParticles] = useState<AnimatedParticle[]>([]);

  useEffect(() => {
    setParticles(Array.from({ length: 30 }, generateParticle));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            width: particle.size,
            height: particle.size,
            filter: `blur(${particle.size * 2}px)`,
            background: 'linear-gradient(45deg, rgba(96, 165, 250, 0.3), rgba(59, 130, 246, 0.3))',
            borderRadius: '50%',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            x: [
              0,
              Math.sin(particle.id) * 100,
              -Math.cos(particle.id) * 100,
              0,
            ],
            y: [
              0,
              Math.cos(particle.id) * 100,
              Math.sin(particle.id) * 100,
              0,
            ],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
