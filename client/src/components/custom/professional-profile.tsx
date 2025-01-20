import { 
  FolderOpen,
  FileText,
  ChevronRight,
  Brain, 
  Rocket, 
  Users, 
  Scale,
  GraduationCap,
  MessageSquare
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface ProfileItem {
  id: string;
  title: string;
  content: string;
  icon: JSX.Element;
}

interface ProfileCategory {
  id: string;
  name: string;
  items: ProfileItem[];
}

const profileData: ProfileCategory[] = [
  {
    id: "leadership",
    name: "Leadership & Management",
    items: [
      {
        id: "strategic",
        title: "Strategic Leadership",
        content: "Self-motivated professional leading projects and teams with proven success",
        icon: <Brain className="w-5 h-5" />
      },
      {
        id: "delegation",
        title: "Delegation Excellence",
        content: "Expert at delegating responsibilities while maintaining clear oversight",
        icon: <Users className="w-5 h-5" />
      }
    ]
  },
  {
    id: "communication",
    name: "Communication & Documentation",
    items: [
      {
        id: "wiki",
        title: "Knowledge Management",
        content: "Created and maintained comprehensive wikis for organizational knowledge",
        icon: <FileText className="w-5 h-5" />
      },
      {
        id: "communication",
        title: "Clear Communication",
        content: "Outstanding communicator building strong relationships at all levels",
        icon: <MessageSquare className="w-5 h-5" />
      }
    ]
  },
  {
    id: "values",
    name: "Professional Values",
    items: [
      {
        id: "effectiveness",
        title: "Value-Driven Approach",
        content: "Focus on maximizing client value through efficient, effective solutions",
        icon: <Rocket className="w-5 h-5" />
      },
      {
        id: "ethics",
        title: "Professional Ethics",
        content: "Fair and transparent in all dealings, delivering high-quality work with integrity",
        icon: <Scale className="w-5 h-5" />
      },
      {
        id: "growth",
        title: "Continuous Learning",
        content: "Passionate about acquiring new skills and adapting to new technologies",
        icon: <GraduationCap className="w-5 h-5" />
      }
    ]
  }
];

export function ProfessionalProfile() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-6 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 sm:mb-12"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2 sm:mb-4 ps2-text-glow">
          Professional Excellence
        </h2>
        <p className="text-base sm:text-xl text-blue-800 dark:text-blue-300 px-4">
          Independent consultant delivering strategic value through technical expertise and leadership
        </p>
      </motion.div>

      <div className="space-y-2 sm:space-y-4">
        {profileData.map((category) => (
          <Card 
            key={category.id} 
            className="ps2-card overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            <motion.button
              className="w-full p-3 sm:p-4 cursor-pointer"
              onClick={() => setExpandedCategory(
                expandedCategory === category.id ? null : category.id
              )}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <FolderOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 flex-shrink-0" />
                <span className="text-sm sm:text-lg font-semibold text-blue-600 dark:text-blue-400 text-left">
                  {category.name}
                </span>
                <ChevronRight 
                  className={`ml-auto w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${
                    expandedCategory === category.id ? 'rotate-90' : ''
                  }`} 
                />
              </div>
            </motion.button>

            {expandedCategory === category.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-blue-100 dark:border-blue-900"
              >
                <div className="p-2 sm:p-4 space-y-3 sm:space-y-4">
                  {category.items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="flex items-start gap-2 sm:gap-3 pl-3 sm:pl-6"
                    >
                      <div className="mt-1 flex-shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-medium text-blue-600 dark:text-blue-400">
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-300 mt-0.5">
                          {item.content}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}