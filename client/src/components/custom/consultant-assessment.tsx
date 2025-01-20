import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Mail, Loader2 } from "lucide-react";
import { ErrorBoundary } from "./error-boundary";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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

const emailSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().optional(),
});

type EmailFormData = z.infer<typeof emailSchema>;

// Create success sound
const successSound = new Audio("data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA//uQZAUAB1WI0PZugAAAAAoQwAAAEk3nRd2qAAAAACiDgAAAAAAABCqEEQRLCgwpBGMlJkIz8jKhGvj4k6jzRnqasNKIeoh5gI7BJaC1A1AoNBjJgbyApVS4IDlZgDU5WUAxEKDNmmALHzZp0Fkz1FMTmGFl1FMEyodIavcCAUHDWrKAIA4aa2oCgILEBupZgHvAhEBcZ6joQBxS76AgccrFlczBvKLC0QI2cBoCFvfTDAo7eoOQInqDPBtvrDEZBNYN5xwNwxQRfw8ZQ5wQVLvO8OYU+mHvFLlDh05Mdg7BT6YrRPpCBznMB2r//xKJjyyOh+cImr2/4doscwD6neZjuZR4AgAABYAAAABy1xcdQtxYBYYZdifkUDgzzXaXn98Z0oi9ILU5mBjFANmRwlVJ3/6jYDAmxaiDG3/6xjQQCCKkRb/6kg/wW+kSJ5//rLobkLSiKmqP/0ikJuDaSaSf/6JiLYLEYnW/+kXg1WRVJL/9EmQ1YZIsv/6Qzwy5qk7/+tEU0nkls3/zIUMPKNX/6yZLf+kFgAfgGyLFAUwY//uQZAUABcd5UiNPVXAAAApAAAAAE0VZQKw9ISAAACgAAAAAVQIygIElVrFkBS+Jhi+EAuu+lKAkYUEIsmEAEoMeDmCETMvfSHTGkF5RWH7kz/ESHWPAq/kcCRhqBtMdokPdM7vil7RG98A2sc7zO6ZvTdM7pmOUAZTnJW+NXxqmd41dqJ6mLTXxrPpnV8avaIf5SvL7pndPvPpndJR9Kuu8fePvuiuhorgWjp7Mf/PRjxcFCPDkW31srioCExivv9lcwKEaHsf/7ow2Fl1T/9RkXgEhYElAoCLFtMArxwivDJJ+bR1HTKJdlEoTELCIqgEwVGSQ+hIm0NbK8WXcTEI0UPoa2NbG4y2K00JEWbZavJXkYaqo9CRHS55FcZTjKEk3NKoCYUnSQ0rWxrZbFKbKIhOKPZe1cJKzZSaQrIyULHDZmV5K4xySsDRKWOruanGtjLJXFEmwaIbDLX0hIPBUQPVFVkQkDoUNfSoDgQGKPekoxeGzA4DUvnn4bxzcZrtJyipKfPNy5+9lnXwgqsiyHNeSVpemw4bWb9psYeq//uQZBoABQt4yMVxYAIAAAkQoAAAHvYpL5m6AAgAACXDAAAAD59jblTirQe9upFsmZbpMudy7Lz1X1DYsxOOSWpfPqNX2WqktK0DMvuGwlbNj44TleLPQ+Gsfb+GOWOKJoIrWb3cIMeeON6lz2umTqMXV8Mj30yWPpjoSa9ujK8SyeJP5y5mOW1D6hvLepeveEAEDo0mgCRClOEgANv3B9a6fikgUSu/DmAMATrGx7nng5p5iimPNZsfQLYB2sDLIkzRKZOHGAaUyDcpFBSLG9MCQALgAIgQs2YunOszLSAyQYPVC2YdGGeHD2dTdJk1pAHGAWDjnkcLKFymS3RQZTInzySoBwMG0QueC3gMsCEYxUqlrcxK6k1LQQcsmyYeQPdC2YfuGPASCBkcVMQQqpVJshui1tkXQJQV0OXGAZMXSOEEBRirXbVRQW7ugq7IM7rPWSZyDlM3IuNEkxzCOJ0ny2ThNkyRai1b6ev//3dzNGzNb//4uAvHT5sURcZCFcuKLhOFs8mLAAEAt4UWAAIABAAAAAB4qbHo0tIjVkUU//uQZAwABfSFz3ZqQAAAAAngwAAAE1HjMp2qAAAAACZDgAAAD5UkTE1UgZEUExqYynN1qZvqIOREEFmBcJQkwdxiFtw0qEOkGYfRDifBui9MQg4QAHAqWtAWHoCxu1Yf4VfWLPIM2mHDFsbQEVGwyqQoQcwnfHeIkNt9YnkiaS1oizycqJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");

export function ConsultantAssessment() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

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

  const onSubmit = async (data: EmailFormData) => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          answers,
          recommendation: getRecommendation().title,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      // Play success sound
      successSound.play();

      toast({
        title: "Message sent successfully! 🎉",
        description: "Thank you for your interest. I'll review your consultation request and get back to you within 24-48 hours.",
      });

      // Reset everything
      form.reset();
      setShowForm(false);
      setCurrentStep(0);
      setAnswers({});
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isComplete = currentStep === questions.length;

  return (
    <ErrorBoundary>
      <Card className="ps2-card w-full max-w-2xl mx-auto">
        <CardHeader className="text-xl font-bold text-blue-600 dark:text-blue-400 ps2-text-glow">
          {!isComplete 
            ? "Digital Consultation Assessment" 
            : showForm 
              ? "Complete Your Consultation Request"
              : "Your Recommended Solution"
          }
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
          ) : showForm ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    {...form.register("name")}
                    placeholder="Your Name"
                    className="bg-blue-50 dark:bg-blue-900/50"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Input
                    {...form.register("email")}
                    placeholder="Your Email"
                    type="email"
                    className="bg-blue-50 dark:bg-blue-900/50"
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Textarea
                    {...form.register("message")}
                    placeholder="Additional details or questions (Optional)"
                    className="bg-blue-50 dark:bg-blue-900/50 min-h-[100px]"
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowForm(false)}
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Submit Request
                      </>
                    )}
                  </Button>
                </div>
              </form>
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

              <Button
                onClick={() => setShowForm(true)}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white mt-6"
              >
                <ArrowRight className="mr-2 h-4 w-4" />
                Continue to Request Form
              </Button>
            </motion.div>
          )}
        </CardContent>

        <CardFooter className="justify-between">
          {currentStep > 0 && !isComplete && !showForm && (
            <Button
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800"
            >
              Back
            </Button>
          )}
        </CardFooter>
      </Card>
    </ErrorBoundary>
  );
}