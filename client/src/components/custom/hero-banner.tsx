import { motion } from "framer-motion";

export function HeroBanner() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative overflow-hidden py-24 px-6 bg-gradient-to-b from-blue-900/20 to-transparent"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.19, 1.0, 0.22, 1.0] }}
        className="relative max-w-6xl mx-auto text-center z-10"
      >
        <motion.h1 
          className="text-6xl md:text-8xl font-bold text-blue-600 dark:text-blue-400 ps2-text-glow mb-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          John Doe
        </motion.h1>
        
        <motion.p
          className="text-xl md:text-3xl text-blue-800 dark:text-blue-300"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Independent Software Consultant
        </motion.p>

        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <motion.div
              key={index}
              className="absolute w-full h-1 bg-blue-500/20"
              style={{ top: `${index * 33}%` }}
              animate={{
                x: [-100, 100],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3,
                delay: index * 0.2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
