import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<'initial' | 'cubes' | 'complete'>('initial');

  useEffect(() => {
    const startSequence = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStage('cubes');
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStage('complete');
      await new Promise(resolve => setTimeout(resolve, 500));
      onComplete();
    };

    startSequence();
  }, [onComplete]);

  return (
    <AnimatePresence>
      {stage === 'initial' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-50"
        />
      )}
    </AnimatePresence>
  );
}