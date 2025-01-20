import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { User, GitBranch, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

interface GitHubStats {
  repos: number;
  followers: number;
  stars: number;
}

export function SocialWidget() {
  const { data: githubStats, isLoading } = useQuery({
    queryKey: ['/api/github/stats'],
    queryFn: async () => {
      const response = await fetch('/api/github/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch GitHub stats');
      }
      return response.json() as Promise<GitHubStats>;
    },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* GitHub Card */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <a
          href="https://github.com/tiniusweb2"
          target="_blank"
          rel="noopener noreferrer"
          className="block h-full"
        >
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white h-full">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <SiGithub className="w-8 h-8 mr-3" />
                <h3 className="text-xl font-bold">GitHub</h3>
              </div>

              {isLoading ? (
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded animate-pulse" />
                  <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4" />
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <GitBranch className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-lg font-semibold">{githubStats?.repos || 0}</div>
                    <div className="text-sm text-gray-300">Repos</div>
                  </div>
                  <div>
                    <User className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-lg font-semibold">{githubStats?.followers || 0}</div>
                    <div className="text-sm text-gray-300">Followers</div>
                  </div>
                  <div>
                    <Star className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-lg font-semibold">{githubStats?.stars || 0}</div>
                    <div className="text-sm text-gray-300">Stars</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </a>
      </motion.div>

      {/* LinkedIn Card */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <a
          href="https://www.linkedin.com/in/tinius-troldmyr-l-536269237"
          target="_blank"
          rel="noopener noreferrer"
          className="block h-full"
        >
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white h-full">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <SiLinkedin className="w-8 h-8 mr-3" />
                <h3 className="text-xl font-bold">LinkedIn</h3>
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  <span>Tinius Troldmyr</span>
                </div>
                <p className="text-sm text-blue-100">
                  Connect with me on LinkedIn to learn more about my professional journey
                </p>
              </div>
            </CardContent>
          </Card>
        </a>
      </motion.div>
    </div>
  );
}