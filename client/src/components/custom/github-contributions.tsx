import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { ErrorBoundary } from "./error-boundary";

interface ContributionDay {
  date: string;
  count: number;
}

export function GitHubContributions() {
  const { data: contributions, isLoading, error } = useQuery<ContributionDay[]>({
    queryKey: ["/api/github/contributions"],
  });

  if (isLoading) {
    return (
      <div className="w-full p-4">
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-6">
          GitHub Contributions
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

  if (error) {
    return (
      <div className="w-full p-4">
        <Card className="p-6 text-center text-red-500">
          Failed to load GitHub contributions.
        </Card>
      </div>
    );
  }

  if (!contributions?.length) {
    return (
      <div className="w-full p-4">
        <Card className="p-6 text-center">
          No contribution data available.
        </Card>
      </div>
    );
  }

  const maxContributions = Math.max(...contributions.map(c => c.count));
  const getIntensity = (count: number) => {
    if (count === 0) return 0;
    return Math.ceil((count / maxContributions) * 4);
  };

  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-6">
        GitHub Contributions
      </h2>
      <Card className="p-6">
        <ErrorBoundary>
          <div className="grid grid-cols-7 gap-1">
            {contributions.map((day, index) => (
              <motion.div
                key={day.date}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.001 }}
                className={`w-3 h-3 rounded-sm contribution-level-${getIntensity(day.count)}`}
                title={`${day.count} contributions on ${day.date}`}
              />
            ))}
          </div>
        </ErrorBoundary>
      </Card>
    </div>
  );
}
