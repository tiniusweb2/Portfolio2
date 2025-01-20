import { 
  Brain, 
  Rocket, 
  Users, 
  FileText, 
  Lightbulb, 
  Target, 
  Scale,
  GraduationCap,
  MessageSquare
} from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export function ProfessionalProfile() {
  const sections = [
    {
      icon: <Brain className="w-8 h-8 text-blue-500" />,
      title: "Strategic Leadership",
      content: "Self-motivated professional with proven ability to lead projects and teams. Expert at delegating responsibilities while maintaining clear oversight and direction."
    },
    {
      icon: <Users className="w-8 h-8 text-blue-500" />,
      title: "Collaborative Excellence",
      content: "Outstanding communicator who builds strong relationships with stakeholders at all levels. Created and maintained comprehensive wikis for organizational knowledge management."
    },
    {
      icon: <Rocket className="w-8 h-8 text-blue-500" />,
      title: "Value-Driven Approach",
      content: "Focus on maximizing client value through efficient, effective solutions. Prioritize speed and impact while maintaining high quality standards."
    },
    {
      icon: <FileText className="w-8 h-8 text-blue-500" />,
      title: "Information Management",
      content: "Experienced in creating and maintaining internal knowledge bases and documentation systems that enhance team productivity and communication."
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-blue-500" />,
      title: "Growth Mindset",
      content: "Continuous learner with a passion for acquiring new skills and knowledge. Adapt quickly to new technologies and methodologies."
    },
    {
      icon: <Target className="w-8 h-8 text-blue-500" />,
      title: "Business Impact",
      content: "Help businesses and individuals achieve their goals through strategic consulting and implementation. Proven track record of delivering successful projects."
    },
    {
      icon: <Scale className="w-8 h-8 text-blue-500" />,
      title: "Professional Ethics",
      content: "Fair and transparent in all business dealings. Take pride in delivering high-quality work while maintaining professional integrity."
    },
    {
      icon: <GraduationCap className="w-8 h-8 text-blue-500" />,
      title: "Continuous Improvement",
      content: "Acknowledge perfectionism as a driving force for excellence, while maintaining practical balance through effective delegation and prioritization."
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-blue-500" />,
      title: "Communication Expert",
      content: "Excel in both written and verbal communication. Skilled at translating complex technical concepts into clear, actionable insights."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4 ps2-text-glow">
          Professional Excellence
        </h2>
        <p className="text-xl text-blue-800 dark:text-blue-300 max-w-3xl mx-auto">
          Independent consultant delivering strategic value through technical expertise and leadership
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="ps2-card h-full p-6">
              <div className="flex items-start space-x-4">
                {section.icon}
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
                    {section.title}
                  </h3>
                  <p className="text-blue-800 dark:text-blue-300">
                    {section.content}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
