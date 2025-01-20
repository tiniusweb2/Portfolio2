import { 
  Brain, 
  Rocket, 
  Users, 
  FileText, 
  Lightbulb, 
  Target, 
  Scale,
  GraduationCap,
  MessageSquare,
  ChevronDown
} from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

const sections = [
  {
    icon: <Brain className="w-8 h-8 text-blue-500" />,
    title: "Strategic Leadership",
    summary: "Self-motivated professional leading projects and teams.",
    content: `Proven track record in leading complex projects and teams to successful outcomes. 
    Expert at delegating responsibilities while maintaining clear oversight and direction. 
    Focus on empowering team members while ensuring project goals are met.`
  },
  {
    icon: <Users className="w-8 h-8 text-blue-500" />,
    title: "Collaborative Excellence",
    summary: "Outstanding communicator building strong relationships.",
    content: `Outstanding communicator who builds strong relationships with stakeholders at all levels. 
    Created and maintained comprehensive wikis for organizational knowledge management. 
    Established effective communication channels and documentation practices.`
  },
  {
    icon: <Rocket className="w-8 h-8 text-blue-500" />,
    title: "Value-Driven Approach",
    summary: "Maximizing client value through efficient solutions.",
    content: `Focus on maximizing client value through efficient, effective solutions. 
    Prioritize speed and impact while maintaining high quality standards. 
    Track record of delivering projects ahead of schedule and under budget.`
  },
  {
    icon: <FileText className="w-8 h-8 text-blue-500" />,
    title: "Information Management",
    summary: "Expert in knowledge base creation and maintenance.",
    content: `Experienced in creating and maintaining internal knowledge bases and documentation systems. 
    Implemented standardized documentation practices that enhanced team productivity by 40%. 
    Developed training materials and onboarding guides for new team members.`
  },
  {
    icon: <Lightbulb className="w-8 h-8 text-blue-500" />,
    title: "Growth Mindset",
    summary: "Continuous learner adapting to new technologies.",
    content: `Continuous learner with a passion for acquiring new skills and knowledge. 
    Adapt quickly to new technologies and methodologies. 
    Regular participant in professional development workshops and conferences.`
  },
  {
    icon: <Target className="w-8 h-8 text-blue-500" />,
    title: "Business Impact",
    summary: "Driving success through strategic consulting.",
    content: `Help businesses and individuals achieve their goals through strategic consulting and implementation. 
    Proven track record of delivering successful projects that increased client revenue by 25%. 
    Expertise in optimizing processes and reducing operational costs.`
  },
  {
    icon: <Scale className="w-8 h-8 text-blue-500" />,
    title: "Professional Ethics",
    summary: "Fair and transparent in all dealings.",
    content: `Fair and transparent in all business dealings. 
    Take pride in delivering high-quality work while maintaining professional integrity. 
    Strong advocate for ethical business practices and sustainable development.`
  },
  {
    icon: <GraduationCap className="w-8 h-8 text-blue-500" />,
    title: "Continuous Improvement",
    summary: "Balancing perfectionism with practical execution.",
    content: `Acknowledge perfectionism as a driving force for excellence, while maintaining practical balance. 
    Effective delegation and prioritization skills. 
    Focus on iterative improvements and measurable outcomes.`
  },
  {
    icon: <MessageSquare className="w-8 h-8 text-blue-500" />,
    title: "Communication Expert",
    summary: "Translating complex concepts into actionable insights.",
    content: `Excel in both written and verbal communication. 
    Skilled at translating complex technical concepts into clear, actionable insights. 
    Experience in creating engaging presentations and technical documentation.`
  }
];

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export function ProfessionalProfile() {
  const [isContactOpen, setIsContactOpen] = useState(false);

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
            <Dialog>
              <DialogTrigger asChild>
                <Card className="ps2-card h-full p-6 cursor-pointer hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4">
                    {section.icon}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
                        {section.title}
                      </h3>
                      <p className="text-blue-800 dark:text-blue-300 text-sm">
                        {section.summary}
                      </p>
                      <ChevronDown className="w-4 h-4 text-blue-500 mt-2" />
                    </div>
                  </div>
                </Card>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {section.icon}
                    <span>{section.title}</span>
                  </DialogTitle>
                </DialogHeader>
                <div className="mt-4 space-y-4">
                  <p className="text-blue-800 dark:text-blue-300 whitespace-pre-line">
                    {section.content}
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-12 text-center"
      >
        <Button
          onClick={() => setIsContactOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          Let's Work Together
        </Button>
      </motion.div>

      <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Get In Touch</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent"
                rows={4}
                placeholder="How can I help you?"
              />
            </div>
            <Button type="submit" className="w-full">
              Send Message
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}