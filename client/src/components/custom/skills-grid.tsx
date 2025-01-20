import { MotionCard } from "@/lib/animations";
import { gridItem } from "@/lib/animations";
import { Card } from "@/components/ui/card";

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

export function SkillsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {skills.map((skill) => (
        <MotionCard
          key={skill.name}
          variants={gridItem}
          initial="initial"
          animate="animate"
          whileHover="hover"
          className="ps2-card p-4"
        >
          <Card className="h-full bg-transparent border-0">
            <div className="flex items-center space-x-4">
              <span className="text-3xl">{skill.icon}</span>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-300">
                  {skill.name}
                </h3>
                <div className="w-full h-2 bg-gray-800 rounded-full mt-2">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </MotionCard>
      ))}
    </div>
  );
}
