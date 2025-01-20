import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ExternalLink, Github, Linkedin, Twitter } from "lucide-react";
import { SiMedium, SiDevdotto } from "react-icons/si";
import { ErrorBoundary } from "./error-boundary";

interface SocialProfile {
  id: number;
  platform: string;
  username: string;
  profileUrl: string;
  displayName: string;
  active: boolean;
}

const platformIcons: Record<string, React.ReactNode> = {
  github: <Github className="h-5 w-5" />,
  linkedin: <Linkedin className="h-5 w-5" />,
  twitter: <Twitter className="h-5 w-5" />,
  medium: <SiMedium className="h-5 w-5" />,
  devto: <SiDevdotto className="h-5 w-5" />,
};

export function SocialDashboard() {
  const { data: profiles, isLoading, error } = useQuery<SocialProfile[]>({
    queryKey: ['/api/social-profiles'],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Failed to load social profiles
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Card className="w-full">
        <CardHeader className="text-xl font-bold text-blue-600 dark:text-blue-400">
          Professional Network
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profiles?.map((profile) => (
              <motion.a
                key={profile.id}
                href={profile.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="text-blue-500">
                        {platformIcons[profile.platform.toLowerCase()] || <ExternalLink className="h-5 w-5" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{profile.displayName}</h3>
                        <p className="text-sm text-muted-foreground">@{profile.username}</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </motion.a>
            ))}
          </div>
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
}
