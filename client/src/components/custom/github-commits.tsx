import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitBranch, Calendar, User, ChevronDown, ChevronUp } from "lucide-react";
import { ErrorBoundary } from "./error-boundary";
import { useState } from "react";

interface Commit {
  repo: string;
  message: string;
  author: string;
  date: string;
  url: string;
  sha: string;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

function CommitCard({ commit }: { commit: Commit }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      className="mb-4"
    >
      <Card className="ps2-card p-4">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <GitBranch className="h-4 w-4 text-blue-500" />
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {commit.repo}
              </span>
            </div>
            <a
              href={commit.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
            >
              {commit.sha}
            </a>
          </div>

          <p className="text-sm text-blue-800 dark:text-blue-200 line-clamp-2">
            {commit.message}
          </p>

          <div className="flex items-center justify-between text-xs text-blue-600 dark:text-blue-400">
            <div className="flex items-center space-x-2">
              <User className="h-3 w-3" />
              <span>{commit.author}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(commit.date)}</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function CommitsContent() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: commits, isLoading, error } = useQuery<Commit[]>({
    queryKey: ['/api/github/commits'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="inline-block w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-blue-400">
        Unable to load GitHub activity. Please try again later.
      </div>
    );
  }

  const displayedCommits = isExpanded ? commits : commits?.slice(0, 3);

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {displayedCommits?.map((commit, index) => (
            <CommitCard key={commit.sha + index} commit={commit} />
          ))}
        </div>
      </AnimatePresence>

      {commits && commits.length > 3 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center mt-6"
        >
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-blue-600 hover:bg-blue-500 text-white group"
          >
            {isExpanded ? (
              <>
                Show Less
                <ChevronUp className="ml-2 h-4 w-4 transition-transform group-hover:-translate-y-1" />
              </>
            ) : (
              <>
                Show More
                <ChevronDown className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
              </>
            )}
          </Button>
        </motion.div>
      )}
    </div>
  );
}

export function GitHubCommits() {
  return (
    <div className="py-12" id="projects">
      <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-8 ps2-text-glow">
        Recent GitHub Activity
      </h2>

      <ErrorBoundary>
        <CommitsContent />
      </ErrorBoundary>
    </div>
  );
}