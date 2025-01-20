import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const audioContext = new AudioContext();

// Create PS2 startup sound using Web Audio API
const createPS2StartupSound = async () => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
  oscillator.frequency.linearRampToValueAtTime(880, audioContext.currentTime + 1);

  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.1);
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 1);
};

export function PS2BootSequence({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<'initial' | 'cubes' | 'logo' | 'complete'>('initial');

  useEffect(() => {
    // Start the boot sequence
    const startSequence = async () => {
      // Initial black screen
      await new Promise(resolve => setTimeout(resolve, 1000));
      await createPS2StartupSound();
      setStage('cubes');

      // Show cubes animation
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStage('logo');

      // Show PS2-style logo
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

        {stage === 'logo' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-white space-y-4"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="text-4xl font-bold tracking-wider"
            >
              Tinius Troldmyr
            </motion.div>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-gray-400"
            >
              Portfolio
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}