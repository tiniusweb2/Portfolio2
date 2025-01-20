import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Briefcase } from "lucide-react";

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  skills: string[];
  duration: string;
}

const timelineData: TimelineEvent[] = [
  {
    year: "2023",
    title: "Senior Full Stack Developer",
    description: "Leading development of enterprise web applications with modern tech stack",
    skills: ["React", "Node.js", "TypeScript", "AWS", "Docker"],
    duration: "Present"
  },
  {
    year: "2022",
    title: "Technical Lead",
    description: "Architecting scalable solutions and mentoring development teams",
    skills: ["System Design", "Team Leadership", "CI/CD", "Cloud Architecture"],
    duration: "1 year"
  },
  {
    year: "2021",
    title: "Full Stack Developer",
    description: "Building responsive web applications and RESTful APIs",
    skills: ["JavaScript", "Python", "SQL", "REST APIs", "React"],
    duration: "1 year"
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
    <div className="relative max-w-6xl mx-auto px-4 py-8 sm:py-12">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-blue-600 dark:text-blue-400"
      >
        Professional Journey
      </motion.h2>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 sm:left-1/2 top-0 h-full w-0.5 bg-gradient-to-b from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700 transform -translate-x-1/2" />

        <div className="space-y-8">
          {timelineData.map((event, index) => (
            <div
              key={event.year}
              ref={el => (timelineRefs.current[index] = el)}
              className={`relative ${
                index % 2 === 0 
                  ? 'sm:ml-[50%] sm:pr-8 pl-8' 
                  : 'sm:mr-[50%] sm:pl-8 pl-8 sm:text-right'
              }`}
            >
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                animate={visibleEvents.has(index) ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="relative p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300">
                  {/* Timeline dot */}
                  <div 
                    className={`absolute w-4 h-4 rounded-full bg-blue-500 border-4 border-white dark:border-gray-900 ${
                      index % 2 === 0
                        ? 'left-[-2rem] sm:left-[-2rem] top-6'
                        : 'left-[-2rem] sm:left-[-2rem] top-6'
                    }`}
                  />

                  {/* Year and Duration */}
                  <div className={`flex items-center gap-2 mb-3 ${
                    index % 2 !== 0 ? 'sm:justify-end' : ''
                  }`}>
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {event.year} • {event.duration}
                    </span>
                  </div>

                  {/* Title and Description */}
                  <div className={`flex items-start gap-2 ${
                    index % 2 !== 0 ? 'sm:flex-row-reverse' : ''
                  }`}>
                    <Briefcase className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <div className={index % 2 !== 0 ? 'sm:text-right' : ''}>
                      <h3 className="text-lg font-semibold">{event.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                    </div>
                  </div>

                  {/* Skills */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={visibleEvents.has(index) ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className={`flex flex-wrap gap-2 mt-3 ${
                      index % 2 !== 0 ? 'sm:justify-end' : ''
                    }`}
                  >
                    {event.skills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill}
                        initial={{ scale: 0 }}
                        animate={visibleEvents.has(index) ? { scale: 1 } : {}}
                        transition={{ duration: 0.3, delay: 0.5 + skillIndex * 0.1 }}
                      >
                        <Badge 
                          variant="secondary"
                          className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200"
                        >
                          {skill}
                        </Badge>
                      </motion.div>
                    ))}
                  </motion.div>
                </Card>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}