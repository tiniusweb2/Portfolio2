import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Mail, Phone, Video, Loader2, XCircle, Calendar } from "lucide-react";
import { ErrorBoundary } from "./error-boundary";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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

const contactMethods = [
  { value: "email", label: "Email", icon: Mail },
  { value: "phone", label: "Phone", icon: Phone },
  { value: "meet", label: "Google Meet", icon: Video },
] as const;

const availableTimeSlots = Array.from({ length: 8 }, (_, i) => {
  const hour = i + 9; // 9 AM to 4 PM
  return {
    value: `${hour}:00`,
    label: `${hour}:00 ${hour < 12 ? 'AM' : 'PM'}`
  };
});

const emailSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  preferredContact: z.enum(["email", "phone", "meet"] as const),
  message: z.string().optional(),
  meetingDate: z.date().optional(),
  meetingTime: z.string().optional(),
});

type EmailFormData = z.infer<typeof emailSchema>;

// Success sound effect
const successSound = new Audio("/success.mp3");

// Add getRecommendation function implementation
const getRecommendation = (answers: Record<string, string>) => {
  const key = `${answers.business_stage}-${answers.pain_points}-${answers.timeline}`;
  return recommendations[key as keyof typeof recommendations] || {
    title: "Custom Digital Consultation",
    description: "Based on your unique needs, let's schedule a call to discuss a tailored solution.",
    services: ["Strategic planning", "Custom solution design", "Technical leadership", "Ongoing support"]
  };
};

export function ConsultantAssessment() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const { toast } = useToast();

  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      name: localStorage.getItem('consultant_form_name') || "",
      email: localStorage.getItem('consultant_form_email') || "",
      message: localStorage.getItem('consultant_form_message') || "",
      preferredContact: "email",
    },
  });

  // Watch form fields for changes and persist data
  const formValues = form.watch();
  useEffect(() => {
    if (formValues.name) localStorage.setItem('consultant_form_name', formValues.name);
    if (formValues.email) localStorage.setItem('consultant_form_email', formValues.email);
    if (formValues.message) localStorage.setItem('consultant_form_message', formValues.message);
  }, [formValues]);

  const handleAnswer = (value: string) => {
    setAnswers({
      ...answers,
      [questions[currentStep].id]: value
    });

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const contactMutation = useMutation({
    mutationFn: async (data: EmailFormData) => {
      // Rate limiting check
      const now = Date.now();
      if (now - lastSubmissionTime < SUBMISSION_TIMEOUT) {
        throw new Error("Please wait a moment before submitting again");
      }
      lastSubmissionTime = now;

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          answers,
          recommendation: getRecommendation(answers).title,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || "Failed to send message");
      }

      return response.json();
    },
    onSuccess: (data) => {
      setShowSuccess(true);
      setShowError(false);

      successSound.play().catch(console.error);

      const meetingDetails = formValues.preferredContact === 'meet'
        ? "Your meeting request has been received. You'll receive a confirmation email with meeting details shortly."
        : formValues.preferredContact === 'phone'
          ? "I'll call you shortly at your provided number"
          : "I'll email you within 24-48 hours";

      toast({
        title: "Request sent successfully! 🎉",
        description: `Thank you for your interest. ${meetingDetails}`,
      });

      setTimeout(() => {
        setShowSuccess(false);
        form.reset();
        setShowForm(false);
        setCurrentStep(0);
        setAnswers({});
        // Clear stored form data
        localStorage.removeItem('consultant_form_name');
        localStorage.removeItem('consultant_form_email');
        localStorage.removeItem('consultant_form_message');
      }, 2000);
    },
    onError: (error: Error) => {
      setShowError(true);
      toast({
        title: "Error sending message",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EmailFormData) => {
    contactMutation.mutate(data);
  };

  const isComplete = Object.keys(answers).length === questions.length;

  return (
    <ErrorBoundary>
      <Card className="ps2-card w-full max-w-2xl mx-auto relative overflow-hidden">
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center bg-blue-500/90 rounded-lg z-10"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
              >
                <CheckCircle className="w-16 h-16 text-white" />
              </motion.div>
            </motion.div>
          )}

          {showError && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-0 left-0 right-0 bg-red-500 text-white p-4 flex items-center justify-center gap-2"
            >
              <XCircle className="w-5 h-5" />
              <span>Failed to send message. Please try again.</span>
            </motion.div>
          )}
        </AnimatePresence>

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
                    whileTap={{ scale: 0.98 }}
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
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Your Name"
                            className="bg-blue-50 dark:bg-blue-900/50"
                            disabled={contactMutation.isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Your Email"
                            type="email"
                            className="bg-blue-50 dark:bg-blue-900/50"
                            disabled={contactMutation.isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="preferredContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Contact Method</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={contactMutation.isPending}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select contact method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {contactMethods.map(({ value, label, icon: Icon }) => (
                              <SelectItem key={value} value={value}>
                                <div className="flex items-center gap-2">
                                  <Icon className="h-4 w-4" />
                                  <span>{label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch("preferredContact") === "phone" && (
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Your Phone Number"
                              type="tel"
                              className="bg-blue-50 dark:bg-blue-900/50"
                              disabled={contactMutation.isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {form.watch("preferredContact") === "meet" && (
                    <>
                      <FormField
                        control={form.control}
                        name="meetingDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Meeting Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                    disabled={contactMutation.isPending}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date < new Date() || date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="meetingTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meeting Time</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={contactMutation.isPending}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a time" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {availableTimeSlots.map(({ value, label }) => (
                                  <SelectItem key={value} value={value}>
                                    {label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Additional details or questions"
                            className="bg-blue-50 dark:bg-blue-900/50 min-h-[100px]"
                            disabled={contactMutation.isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowForm(false)}
                      disabled={contactMutation.isPending}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-500 text-white"
                      disabled={contactMutation.isPending}
                    >
                      {contactMutation.isPending ? (
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
              </Form>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {getRecommendation(answers).title}
              </h2>
              <p className="text-blue-800 dark:text-blue-200">
                {getRecommendation(answers).description}
              </p>
              <div className="space-y-2">
                {getRecommendation(answers).services.map((service, index) => (
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

let lastSubmissionTime = 0;
const SUBMISSION_TIMEOUT = 3000; // 3 seconds