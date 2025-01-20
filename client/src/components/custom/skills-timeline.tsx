import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  skills: string[];
}

const timelineData: TimelineEvent[] = [
  {
    year: "2023",
    title: "Senior Full Stack Developer",
    description: "Leading development of enterprise web applications with modern tech stack",
    skills: ["React", "Node.js", "TypeScript", "AWS", "Docker"]
  },
  {
    year: "2022",
    title: "Technical Lead",
    description: "Architecting scalable solutions and mentoring development teams",
    skills: ["System Design", "Team Leadership", "CI/CD", "Cloud Architecture"]
  },
  {
    year: "2021",
    title: "Full Stack Developer",
    description: "Building responsive web applications and RESTful APIs",
    skills: ["JavaScript", "Python", "SQL", "REST APIs", "React"]
  }
];

export function SkillsTimeline() {
  const [visibleEvents, setVisibleEvents] = useState<Set<number>>(new Set());
  const timelineRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = timelineRefs.current.map((ref, index) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleEvents(prev => new Set([...Array.from(prev), index]));
          }
        },
        { threshold: 0.3 }
      );

      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach(observer => observer?.disconnect());
    };
  }, []);

  return (
    <div className="relative container mx-auto px-4 py-8 sm:py-12">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-blue-600 dark:text-blue-400">
        Professional Journey
      </h2>

      <div className="relative">
        {/* Timeline line - hidden on mobile, shown on larger screens */}
        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-blue-200 dark:bg-blue-800" />

        {timelineData.map((event, index) => (
          <div
            key={event.year}
            ref={el => (timelineRefs.current[index] = el)}
            className={`relative mb-8 md:mb-12 w-full md:w-[calc(50%-2rem)] 
              ${index % 2 === 0 ? 'md:ml-auto md:pl-8' : 'md:mr-auto md:pr-8'}`}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={visibleEvents.has(index) ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-4 sm:p-6 relative">
                {/* Year badge - adjusted for mobile */}
                <div className="absolute -top-3 left-4 md:left-auto md:right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                  {event.year}
                </div>

                {/* Content with improved mobile spacing */}
                <div className="mt-4">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">{event.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4">{event.description}</p>

                  {/* Skills with improved wrapping */}
                  <div className="flex flex-wrap gap-2">
                    {event.skills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={visibleEvents.has(index) ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.3, delay: 0.4 + skillIndex * 0.1 }}
                      >
                        <Badge 
                          variant="secondary" 
                          className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 whitespace-nowrap text-xs sm:text-sm"
                        >
                          {skill}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Mobile indicator line */}
                <div className="absolute -left-2 top-1/2 w-4 h-px bg-blue-200 dark:bg-blue-800 md:hidden" />
              </Card>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}