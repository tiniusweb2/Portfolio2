import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<'initial' | 'cubes' | 'complete'>('initial');

  useEffect(() => {
    const startSequence = async () => {
      // Initial black screen
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStage('cubes');

      // Show cubes animation
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStage('complete');

      // Complete the sequence
      await new Promise(resolve => setTimeout(resolve, 500));
      onComplete();
    };

    startSequence();
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-50">
      <AnimatePresence>
        {stage === 'cubes' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 16 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="w-8 h-8 bg-blue-500"
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
