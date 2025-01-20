import { useState, Suspense } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ErrorBoundary } from "./error-boundary";
import { Loader2 } from "lucide-react";

interface DemoContent {
  React: () => JSX.Element;
  TypeScript: () => JSX.Element;
  "Node.js": () => JSX.Element;
  "CSS/SCSS": () => JSX.Element;
  GraphQL: () => JSX.Element;
  Git: () => JSX.Element;
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center p-8">
      <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
    </div>
  );
}

const demos: DemoContent = {
  React: () => (
    <ErrorBoundary>
      <div className="space-y-4">
        <div className="flex space-x-2">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-8 h-8 bg-blue-500 rounded-full"
            />
          ))}
        </div>
        <p className="text-sm">Interactive React animation demo using Framer Motion</p>
      </div>
    </ErrorBoundary>
  ),
  TypeScript: () => (
    <ErrorBoundary>
      <Card className="p-4">
        <pre className="text-sm">
          <code>
            {`interface Skill {
  name: string;
  level: number;
  yearsOfExperience: number;
}

const typescript: Skill = {
  name: "TypeScript",
  level: 85,
  yearsOfExperience: 3
};`}
          </code>
        </pre>
      </Card>
    </ErrorBoundary>
  ),
  "Node.js": () => (
    <ErrorBoundary>
      <div className="space-y-4">
        <div className="animate-pulse flex space-x-4">
          <div className="h-4 bg-blue-400 rounded w-3/4"></div>
          <div className="h-4 bg-blue-400 rounded w-1/2"></div>
        </div>
        <p className="text-sm">Node.js async operation simulation</p>
      </div>
    </ErrorBoundary>
  ),
  "CSS/SCSS": () => (
    <ErrorBoundary>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.1 }}
              className="h-12 rounded"
              style={{
                background: `hsl(${i * 40}, 70%, 60%)`,
              }}
            />
          ))}
        </div>
        <p className="text-sm">Interactive CSS Grid & Flexbox demo</p>
      </div>
    </ErrorBoundary>
  ),
  GraphQL: () => (
    <ErrorBoundary>
      <Card className="p-4">
        <pre className="text-sm">
          <code>
            {`query GetSkill {
  skill(name: "GraphQL") {
    level
    experience
    projects
  }
}`}
          </code>
        </pre>
      </Card>
    </ErrorBoundary>
  ),
  Git: () => (
    <ErrorBoundary>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
            }}
            className="w-4 h-4 rounded-full bg-green-500"
          />
          <div className="h-1 w-20 bg-blue-400"></div>
          <div className="w-4 h-4 rounded-full bg-blue-500"></div>
        </div>
        <p className="text-sm">Git branch visualization</p>
      </div>
    </ErrorBoundary>
  ),
};

interface SkillDemoModalProps {
  skill: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SkillDemoModal({ skill, isOpen, onClose }: SkillDemoModalProps) {
  if (!skill || !demos[skill as keyof DemoContent]) return null;

  const Demo = demos[skill as keyof DemoContent];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {skill} Demo
          </DialogTitle>
        </DialogHeader>
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
          <Suspense fallback={<LoadingSpinner />}>
            <ErrorBoundary>
              <Demo />
            </ErrorBoundary>
          </Suspense>
        </div>
      </DialogContent>
    </Dialog>
  );
}