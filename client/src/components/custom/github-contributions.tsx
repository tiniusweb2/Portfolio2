import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { ErrorBoundary } from "./error-boundary";

interface Commit {
  repo: string;
  message: string;
  date: string;
  author: string;
  url: string;
  sha: string;
}

interface DayActivity {
  date: string;
  count: number;
}

export function GitHubContributions() {
  const { data: commits, isLoading, error } = useQuery<Commit[]>({
    queryKey: ["/api/github/commits"],
  });

  // Process commits into daily activity
  const processCommits = (commits: Commit[]): DayActivity[] => {
    const activityMap = new Map<string, number>();
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    // Initialize all dates in the last year with 0 commits
    for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
      activityMap.set(d.toISOString().split('T')[0], 0);
    }

    // Count commits per day
    commits.forEach(commit => {
      const date = commit.date.split('T')[0];
      if (activityMap.has(date)) {
        activityMap.set(date, (activityMap.get(date) || 0) + 1);
      }
    });

    return Array.from(activityMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  if (isLoading) {
    return (
      <div className="w-full p-4">
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-6">
          Coding Activity
        </h2>
        <Card className="p-6">
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 52 * 7 }).map((_, i) => (
              <Skeleton key={i} className="w-3 h-3" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (error || !commits) {
    return (
      <div className="w-full p-4">
        <Card className="p-6 text-center text-red-500">
          Failed to load coding activity.
        </Card>
      </div>
    );
  }

  const activities = processCommits(commits);
  const maxCommits = Math.max(...activities.map(d => d.count));

  const getIntensity = (count: number) => {
    if (count === 0) return 0;
    return Math.ceil((count / maxCommits) * 4);
  };

  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-6">
        Coding Activity
      </h2>
      <Card className="p-6">
        <ErrorBoundary>
          <div className="grid grid-cols-7 gap-1">
            {activities.map((day, index) => (
              <motion.div
                key={day.date}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.001 }}
                className={`w-3 h-3 rounded-sm contribution-level-${getIntensity(day.count)}`}
                title={`${day.count} commits on ${day.date}`}
              />
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 flex justify-end gap-2">
            {[0, 1, 2, 3, 4].map((level) => (
              <div key={level} className="flex items-center gap-1">
                <div className={`w-3 h-3 rounded-sm contribution-level-${level}`} />
                {level === 0 ? 'No activity' : `${level} commit${level > 1 ? 's' : ''}`}
              </div>
            ))}
          </div>
        </ErrorBoundary>
      </Card>
    </div>
  );
}