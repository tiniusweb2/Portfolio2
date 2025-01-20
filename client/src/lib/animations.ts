import { motion } from "framer-motion";

export const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.5 }
};

export const ps2Boot = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: {
    duration: 1.2,
    ease: [0.43, 0.13, 0.23, 0.96]
  }
};

export const gridItem = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  transition: { duration: 0.4 }
};

export const MotionCard = motion.div;
export const MotionImage = motion.img;
