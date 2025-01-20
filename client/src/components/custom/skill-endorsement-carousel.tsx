import { useState } from "react";
import { motion } from "framer-motion";
import useEmblaCarousel from 'embla-carousel-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatarUrl?: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "CTO",
    company: "TechVision Inc",
    content: "Tinius delivered exceptional results for our web application project. His expertise in React and TypeScript significantly improved our development workflow.",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
  },
  {
    id: "2",
    name: "Michael Chen",
    role: "Product Manager",
    company: "InnovateLab",
    content: "Working with Tinius was a game-changer for our team. His technical leadership and communication skills made complex projects feel manageable.",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
  },
  {
    id: "3",
    name: "Emma Wilson",
    role: "Engineering Director",
    company: "CloudScale Solutions",
    content: "The quality of work and attention to detail exceeded our expectations. Tinius brings both technical excellence and strategic thinking to every project.",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
  }
];

export function SkillEndorsementCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'center',
    slidesToScroll: 1
  });

  return (
    <div className="relative py-8">
      <h2 className="text-2xl font-bold text-center mb-8 text-blue-600 dark:text-blue-400">
        Client Testimonials
      </h2>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="flex-[0_0_100%] min-w-0 md:flex-[0_0_33.33%] px-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="h-full"
              >
                <Card className="p-6 h-full bg-white dark:bg-gray-800 shadow-lg">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={testimonial.avatarUrl}
                        alt={testimonial.name}
                      />
                      <AvatarFallback>
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                        {testimonial.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 italic">
                    "{testimonial.content}"
                  </p>
                </Card>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {emblaApi && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 shadow-lg"
            onClick={() => emblaApi.scrollPrev()}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 shadow-lg"
            onClick={() => emblaApi.scrollNext()}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}
    </div>
  );
}