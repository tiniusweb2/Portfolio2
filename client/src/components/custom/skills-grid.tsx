import { useState } from "react";
import { motion } from "framer-motion";
import { MotionCard } from "@/lib/animations";
import { gridItem } from "@/lib/animations";
import { Card } from "@/components/ui/card";
import { SkillDemoModal } from "./skill-demo-modal";
import { ErrorBoundary } from "./error-boundary";

interface Skill {
  name: string;
  icon: string;
  level: number;
}

const skills: Skill[] = [
  { name: "React", icon: "⚛️", level: 90 },
  { name: "TypeScript", icon: "📘", level: 85 },
  { name: "Node.js", icon: "🟢", level: 80 },
  { name: "CSS/SCSS", icon: "🎨", level: 85 },
  { name: "GraphQL", icon: "◈", level: 75 },
  { name: "Git", icon: "📦", level: 85 }
];

function SkillCard({ skill, onClick }: { skill: Skill; onClick: () => void }) {
  return (
    <ErrorBoundary>
      <MotionCard
        variants={gridItem}
        initial="initial"
        animate="animate"
        whileHover="hover"
        className="ps2-card p-4 cursor-pointer"
        onClick={onClick}
      >
        <Card className="h-full bg-transparent border-0">
          <div className="flex items-center space-x-4">
            <span className="text-3xl">{skill.icon}</span>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-300">
                {skill.name}
              </h3>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full mt-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-full bg-blue-500 rounded-full"
                />
              </div>
            </div>
          </div>
        </Card>
      </MotionCard>
    </ErrorBoundary>
  );
}

export function SkillsGrid() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSkillClick = (skillName: string) => {
    setSelectedSkill(skillName);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSkill(null);
  };

  return (
    <ErrorBoundary>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {skills.map((skill) => (
          <SkillCard
            key={skill.name}
            skill={skill}
            onClick={() => handleSkillClick(skill.name)}
          />
        ))}
      </div>

      <SkillDemoModal
        skill={selectedSkill}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </ErrorBoundary>
  );
}