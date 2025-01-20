import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const cubeVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: (i: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      delay: i * 0.2,
      duration: 0.8,
      ease: [0.43, 0.13, 0.23, 0.96]
    }
  })
};

const textVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      delay: 1.5,
      duration: 0.8
    }
  }
};

const ctaVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      delay: 2,
      duration: 0.5
    }
  },
  hover: { 
    scale: 1.05,
    transition: { duration: 0.2 }
  }
};

export function HeroBanner() {
  const cubes = Array.from({ length: 4 }, (_, i) => i);

  return (
    <div className="relative min-h-[70vh] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-black to-blue-950">
      {/* PS2-style cube grid */}
      <div className="grid grid-cols-2 gap-4 mb-12">
        {cubes.map((i) => (
          <motion.div
            key={i}
            custom={i}
            variants={cubeVariants}
            initial="initial"
            animate="animate"
            className="w-16 h-16 md:w-24 md:h-24 bg-blue-500 rounded-sm transform rotate-45"
            style={{
              background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
            }}
          />
        ))}
      </div>

      {/* Hero Text */}
      <motion.div
        variants={textVariants}
        initial="initial"
        animate="animate"
        className="text-center z-10 mb-8"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 ps2-text-glow">
          Full-Stack Developer
        </h1>
        <p className="text-xl md:text-2xl text-blue-200">
          Building immersive digital experiences
        </p>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        variants={ctaVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
      >
        <Button 
          size="lg"
          className="bg-blue-600 hover:bg-blue-500 text-white group"
        >
          View Projects
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </motion.div>

      {/* Background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              '--direction-x': Math.random() * 2 - 1,
              '--direction-y': Math.random() * 2 - 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`
            } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}
