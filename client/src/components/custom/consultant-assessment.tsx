import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import { ErrorBoundary } from "./error-boundary";

const questions = [
  {
    id: "business_stage",
    text: "What best describes your current business situation?",
    options: [
      { value: "startup", label: "Starting a new digital venture or startup" },
      { value: "growth", label: "Established business looking to grow online" },
      { value: "optimization", label: "Need to improve existing digital systems" },
      { value: "transformation", label: "Looking for complete digital transformation" }
    ]
  },
  {
    id: "pain_points",
    text: "What's your biggest challenge right now?",
    options: [
      { value: "technical", label: "Technical infrastructure & development" },
      { value: "marketing", label: "Digital marketing & customer acquisition" },
      { value: "ux", label: "User experience & conversion optimization" },
      { value: "strategy", label: "Overall digital strategy & direction" }
    ]
  },
  {
    id: "timeline",
    text: "What's your desired timeline for seeing results?",
    options: [
      { value: "urgent", label: "ASAP - Critical business need" },
      { value: "quarter", label: "Within this quarter" },
      { value: "sixmonths", label: "Within 6 months" },
      { value: "longterm", label: "Long-term partnership" }
    ]
  }
];

const recommendations = {
  // Startup paths
  "startup-technical-urgent": {
    title: "MVP Development & Launch Support",
    description: "Fast-track your startup with expert technical leadership. We'll rapidly develop your MVP while establishing scalable architecture.",
    services: ["Technical architecture design", "MVP development", "Cloud infrastructure setup", "Agile project management"]
  },
  "startup-marketing-urgent": {
    title: "Launch Marketing Strategy",
    description: "Get your startup in front of the right audience quickly with our proven digital marketing launch playbook.",
    services: ["Market positioning", "Digital marketing strategy", "Launch campaign planning", "Analytics setup"]
  },
  // Growth paths
  "growth-technical-quarter": {
    title: "Scalable Systems Development",
    description: "Optimize and scale your technical infrastructure to support your growth trajectory.",
    services: ["System architecture optimization", "Performance enhancement", "Integration development", "Technical team leadership"]
  },
  // Add more specific combinations as needed
};

export function ConsultantAssessment() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswer = (value: string) => {
    setAnswers({
      ...answers,
      [questions[currentStep].id]: value
    });
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const getRecommendation = () => {
    const key = `${answers.business_stage}-${answers.pain_points}-${answers.timeline}`;
    return recommendations[key as keyof typeof recommendations] || {
      title: "Custom Digital Consultation",
      description: "Based on your unique needs, let's schedule a call to discuss a tailored solution.",
      services: ["Strategic planning", "Custom solution design", "Technical leadership", "Ongoing support"]
    };
  };

  const isComplete = currentStep === questions.length;

  return (
    <ErrorBoundary>
      <Card className="ps2-card w-full max-w-2xl mx-auto">
        <CardHeader className="text-xl font-bold text-blue-600 dark:text-blue-400 ps2-text-glow">
          {!isComplete ? "Digital Consultation Assessment" : "Your Recommended Solution"}
        </CardHeader>
        
        <CardContent>
          {!isComplete ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-medium mb-4 text-blue-800 dark:text-blue-200">
                {questions[currentStep].text}
              </h3>
              <div className="space-y-3">
                {questions[currentStep].options.map((option) => (
                  <motion.div
                    key={option.value}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Button
                      className="w-full justify-start text-left h-auto py-3 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800"
                      variant="outline"
                      onClick={() => handleAnswer(option.value)}
                    >
                      {option.label}
                      <ArrowRight className="ml-auto h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {getRecommendation().title}
              </h2>
              <p className="text-blue-800 dark:text-blue-200">
                {getRecommendation().description}
              </p>
              <div className="space-y-2">
                {getRecommendation().services.map((service, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-2"
                  >
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-blue-700 dark:text-blue-300">{service}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </CardContent>

        <CardFooter className="justify-between">
          {currentStep > 0 && !isComplete && (
            <Button
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800"
            >
              Back
            </Button>
          )}
          {isComplete && (
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-500 text-white"
              onClick={() => window.location.href = "mailto:your-email@example.com"}
            >
              Schedule a Consultation
            </Button>
          )}
        </CardFooter>
      </Card>
    </ErrorBoundary>
  );
}
