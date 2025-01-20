import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ErrorBoundary } from "./error-boundary";
import {
  FolderOpen,
  FileCode,
  ChevronRight,
  Brain,
  Cog,
  Users,
  Database,
  Globe,
  Laptop,
  Terminal,
  Bot
} from "lucide-react";

interface Skill {
  id: string;
  name: string;
  proficiency: number;
  description: string;
  icon: JSX.Element;
}

interface SkillCategory {
  id: string;
  name: string;
  icon: JSX.Element;
  skills: Skill[];
}

const skillsData: SkillCategory[] = [
  {
    id: "frontend",
    name: "Frontend Development",
    icon: <Globe className="w-6 h-6" />,
    skills: [
      {
        id: "react",
        name: "React.js",
        proficiency: 90,
        description: "Expert in React ecosystem, including Hooks, Context, and Redux",
        icon: <FileCode className="w-5 h-5" />
      },
      {
        id: "typescript",
        name: "TypeScript",
        proficiency: 85,
        description: "Strong typing, interfaces, and advanced TypeScript patterns",
        icon: <FileCode className="w-5 h-5" />
      },
      {
        id: "css",
        name: "CSS/SCSS",
        proficiency: 85,
        description: "Modern CSS, animations, responsive design, and CSS-in-JS",
        icon: <FileCode className="w-5 h-5" />
      }
    ]
  },
  {
    id: "backend",
    name: "Backend Development",
    icon: <Database className="w-6 h-6" />,
    skills: [
      {
        id: "nodejs",
        name: "Node.js",
        proficiency: 80,
        description: "Server-side JavaScript, Express.js, and API development",
        icon: <FileCode className="w-5 h-5" />
      },
      {
        id: "apis",
        name: "API Design",
        proficiency: 85,
        description: "RESTful APIs, GraphQL, and API security best practices",
        icon: <FileCode className="w-5 h-5" />
      }
    ]
  },
  {
    id: "ai-ml",
    name: "AI & Machine Learning",
    icon: <Brain className="w-6 h-6" />,
    skills: [
      {
        id: "llm",
        name: "LLM Integration",
        proficiency: 80,
        description: "OpenAI API, prompt engineering, and LLM application development",
        icon: <Bot className="w-5 h-5" />
      },
      {
        id: "ml-frameworks",
        name: "ML Frameworks",
        proficiency: 75,
        description: "TensorFlow, PyTorch, and machine learning pipelines",
        icon: <FileCode className="w-5 h-5" />
      }
    ]
  },
  {
    id: "automation",
    name: "Automation & DevOps",
    icon: <Cog className="w-6 h-6" />,
    skills: [
      {
        id: "ci-cd",
        name: "CI/CD",
        proficiency: 85,
        description: "GitHub Actions, Jenkins, and automated deployment pipelines",
        icon: <Terminal className="w-5 h-5" />
      },
      {
        id: "testing",
        name: "Testing Automation",
        proficiency: 80,
        description: "Jest, Cypress, and test automation frameworks",
        icon: <FileCode className="w-5 h-5" />
      }
    ]
  },
  {
    id: "crm",
    name: "CRM & Business Tools",
    icon: <Users className="w-6 h-6" />,
    skills: [
      {
        id: "salesforce",
        name: "Salesforce",
        proficiency: 75,
        description: "Salesforce development, customization, and integration",
        icon: <Laptop className="w-5 h-5" />
      },
      {
        id: "integrations",
        name: "CRM Integrations",
        proficiency: 80,
        description: "API integrations with various CRM platforms",
        icon: <FileCode className="w-5 h-5" />
      }
    ]
  }
];

function SkillBar({ proficiency }: { proficiency: number }) {
  return (
    <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full mt-2">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${proficiency}%` }}
        transition={{ duration: 1, delay: 0.2 }}
        className="h-full bg-blue-500 rounded-full"
      />
    </div>
  );
}

export function SkillsGrid() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  return (
    <ErrorBoundary>
      <div className="space-y-4">
        {skillsData.map((category) => (
          <Card key={category.id} className="ps2-card overflow-hidden">
            <motion.div
              className="p-4 cursor-pointer"
              onClick={() => setExpandedCategory(
                expandedCategory === category.id ? null : category.id
              )}
            >
              <div className="flex items-center gap-3">
                <FolderOpen className="w-6 h-6 text-blue-500" />
                <div className="flex items-center gap-2">
                  {category.icon}
                  <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                    {category.name}
                  </span>
                </div>
                <ChevronRight 
                  className={`ml-auto transition-transform ${
                    expandedCategory === category.id ? 'rotate-90' : ''
                  }`}
                />
              </div>
            </motion.div>

            {expandedCategory === category.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-blue-100 dark:border-blue-900"
              >
                <div className="p-4 space-y-4">
                  {category.skills.map((skill) => (
                    <motion.div
                      key={skill.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="flex items-start gap-3 pl-6"
                    >
                      {skill.icon}
                      <div className="flex-1">
                        <h3 className="font-medium text-blue-600 dark:text-blue-400">
                          {skill.name}
                        </h3>
                        <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
                          {skill.description}
                        </p>
                        <SkillBar proficiency={skill.proficiency} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </Card>
        ))}
      </div>
    </ErrorBoundary>
  );
}