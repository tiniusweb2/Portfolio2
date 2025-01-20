import { useState } from "react";
import { motion } from "framer-motion";
import useEmblaCarousel from 'embla-carousel-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ThumbsUp } from "lucide-react";
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

export function SkillEndorsementCarousel() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [endorsements, setEndorsements] = useState<Record<string, boolean>>({});
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'center',
    slidesToScroll: 1
  });

  const handleEndorse = (skillId: string) => {
    if (!endorsements[skillId]) {
      setEndorsements(prev => ({ ...prev, [skillId]: true }));
      const skill = skills.find(s => s.id === skillId);
      if (skill) {
        skill.endorsements += 1;
      }
    }
  };

  return (
    <div className="relative py-8">
      <h2 className="text-2xl font-bold text-center mb-8 text-blue-600 dark:text-blue-400">
        Skills & Endorsements
      </h2>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {skills.map((skill) => (
            <div 
              key={skill.id}
              className="flex-[0_0_100%] min-w-0 md:flex-[0_0_33.33%] px-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="h-full"
              >
                <Card className="p-6 h-full bg-white dark:bg-gray-800 shadow-lg">
                  <h3 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400">
                    {skill.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {skill.description}
                  </p>
                  <div className="flex justify-between items-center mt-auto">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedSkill(skill.name)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      View Demo
                    </Button>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 dark:text-gray-300">
                        {skill.endorsements}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEndorse(skill.id)}
                        disabled={endorsements[skill.id]}
                        className={`transition-colors ${
                          endorsements[skill.id]
                            ? 'text-blue-500'
                            : 'text-gray-400 hover:text-blue-500'
                        }`}
                      >
                        <ThumbsUp className="h-5 w-5" />
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
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 shadow-lg"
            onClick={() => emblaApi.scrollNext()}
          >
            <ChevronRight className="h-6 w-6" />
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
