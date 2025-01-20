import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function PS2Loading() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black flex flex-col items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-blue-400 ps2-text-glow">
          PORTFOLIO
        </h1>
      </motion.div>
      
      <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.2 }}
          className="h-full bg-blue-500"
        />
      </div>
      
      <p className="mt-4 text-blue-300 text-sm">
        Loading... {progress}%
      </p>
    </motion.div>
  );
}
