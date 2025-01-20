import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from 'embla-carousel-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ThumbsUp, Loader2 } from "lucide-react";
import { SkillDemoModal } from "./skill-demo-modal";

interface Skill {
  id: string;
  name: string;
  description: string;
  endorsements: number;
}

const skills: Skill[] = [
  {
    id: "react",
    name: "React",
    description: "Expert in React ecosystem, including Hooks, Context, and Redux",
    endorsements: 42
  },
  {
    id: "typescript",
    name: "TypeScript",
    description: "Strong typing, interfaces, and advanced TypeScript patterns",
    endorsements: 35
  },
  {
    id: "nodejs",
    name: "Node.js",
    description: "Server-side JavaScript, Express.js, and API development",
    endorsements: 38
  },
  {
    id: "css",
    name: "CSS/SCSS",
    description: "Modern CSS, animations, responsive design, and CSS-in-JS",
    endorsements: 40
  },
  {
    id: "graphql",
    name: "GraphQL",
    description: "API design, schema definition, and query optimization",
    endorsements: 28
  },
  {
    id: "git",
    name: "Git",
    description: "Version control, branching strategies, and collaborative development",
    endorsements: 45
  }
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5
    }
  },
  hover: {
    scale: 1.05,
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1
    }
  }
};

export function SkillEndorsementCarousel() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [endorsements, setEndorsements] = useState<Record<string, boolean>>({});
  const [endorsingSkill, setEndorsingSkill] = useState<string | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'center',
    slidesToScroll: 1
  });

  const handleEndorse = async (skillId: string) => {
    if (!endorsements[skillId]) {
      setEndorsingSkill(skillId);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setEndorsements(prev => ({ ...prev, [skillId]: true }));
      const skill = skills.find(s => s.id === skillId);
      if (skill) {
        skill.endorsements += 1;
      }
      setEndorsingSkill(null);
    }
  };

  return (
    <div className="relative py-8">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-center mb-8 text-blue-600 dark:text-blue-400"
      >
        Skills & Endorsements
      </motion.h2>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {skills.map((skill) => (
            <div 
              key={skill.id}
              className="flex-[0_0_100%] min-w-0 md:flex-[0_0_33.33%] px-4"
            >
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                whileTap="tap"
                className="h-full"
              >
                <Card className="p-6 h-full bg-white dark:bg-gray-800 shadow-lg transform transition-all duration-200">
                  <motion.h3 
                    className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400"
                    whileHover={{ scale: 1.02 }}
                  >
                    {skill.name}
                  </motion.h3>
                  <motion.p 
                    className="text-gray-600 dark:text-gray-300 mb-4"
                    whileHover={{ scale: 1.01 }}
                  >
                    {skill.description}
                  </motion.p>
                  <div className="flex justify-between items-center mt-auto">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedSkill(skill.name)}
                      className="text-blue-500 hover:text-blue-600 relative overflow-hidden"
                    >
                      <motion.span 
                        className="absolute inset-0 bg-blue-100 dark:bg-blue-900"
                        initial={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                      <span className="relative">View Demo</span>
                    </Button>
                    <div className="flex items-center gap-2">
                      <motion.span 
                        className="text-gray-600 dark:text-gray-300"
                        animate={{ 
                          scale: endorsements[skill.id] ? [1, 1.2, 1] : 1 
                        }}
                      >
                        {skill.endorsements}
                      </motion.span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEndorse(skill.id)}
                        disabled={endorsements[skill.id] || endorsingSkill === skill.id}
                        className={`transition-colors relative ${
                          endorsements[skill.id]
                            ? 'text-blue-500'
                            : 'text-gray-400 hover:text-blue-500'
                        }`}
                      >
                        <AnimatePresence>
                          {endorsingSkill === skill.id ? (
                            <motion.span
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                            >
                              <Loader2 className="h-5 w-5 animate-spin" />
                            </motion.span>
                          ) : (
                            <motion.span
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <ThumbsUp className="h-5 w-5" />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {emblaApi && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 shadow-lg"
            onClick={() => emblaApi.scrollPrev()}
          >
            <motion.span
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="h-6 w-6" />
            </motion.span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 shadow-lg"
            onClick={() => emblaApi.scrollNext()}
          >
            <motion.span
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="h-6 w-6" />
            </motion.span>
          </Button>
        </>
      )}

      <SkillDemoModal
        skill={selectedSkill}
        isOpen={!!selectedSkill}
        onClose={() => setSelectedSkill(null)}
      />
    </div>
  );
}