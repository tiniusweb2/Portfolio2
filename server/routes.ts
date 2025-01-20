import type { Express } from "express";
import { createServer, type Server } from "http";
import fetch from "node-fetch";
import { db } from "@db";
import { blogPosts, knowledgeBaseFolders, knowledgeBaseFiles } from "@db/schema";
import { eq } from "drizzle-orm";

interface GitHubStats {
  repos: number;
  followers: number;
  stars: number;
}

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    }
  };
  html_url: string;
}

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  preferredContact: 'email' | 'phone' | 'meet';
  message?: string;
  meetingDate?: string;
  meetingTime?: string;
  answers: Record<string, string>;
  recommendation: string;
}

interface ContactResponse {
  message: string;
  submissionId: string;
  meetingDetails?: {
    dateTime: string;
    message: string;
  };
}

const submissions = new Map<string, ContactFormData>();

const RATE_LIMIT_WINDOW = 30 * 1000; // 30 seconds
const rateLimitStore = new Map<string, { count: number; timestamp: number }>();

setInterval(() => {
  const now = Date.now();
  // Convert Map.entries() to Array before iterating
  Array.from(rateLimitStore.entries()).forEach(([ip, data]) => {
    if (now - data.timestamp > RATE_LIMIT_WINDOW) {
      rateLimitStore.delete(ip);
    }
  });
}, 5 * 60 * 1000);

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const data = rateLimitStore.get(ip) || { count: 0, timestamp: now };

  if (now - data.timestamp > RATE_LIMIT_WINDOW) {
    data.count = 1;
    data.timestamp = now;
    rateLimitStore.set(ip, data);
    return false;
  }

  data.count++;
  rateLimitStore.set(ip, data);
  return data.count > 3; // Allow 3 requests per window
}

export function registerRoutes(app: Express): Server {
  // Knowledge Base endpoints
  app.get('/api/knowledge-base/folders', async (req, res) => {
    try {
      const folders = await db.query.knowledgeBaseFolders.findMany({
        orderBy: (folders, { asc }) => [asc(folders.path)],
      });
      res.json(folders);
    } catch (error) {
      console.error('Failed to fetch folders:', error);
      res.status(500).json({ message: 'Failed to fetch folders' });
    }
  });

  app.get('/api/knowledge-base/files', async (req, res) => {
    try {
      const folderId = req.query.folderId ? parseInt(req.query.folderId as string) : null;

      const files = await db.query.knowledgeBaseFiles.findMany({
        where: folderId ? eq(knowledgeBaseFiles.folderId, folderId) : undefined,
      });

      res.json(files);
    } catch (error) {
      console.error('Failed to fetch files:', error);
      res.status(500).json({ message: 'Failed to fetch files' });
    }
  });

  app.post('/api/contact', async (req, res) => {
    console.log('Received contact form submission:', req.body);

    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';

    if (isRateLimited(clientIp)) {
      console.log('Rate limit exceeded for IP:', clientIp);
      return res.status(429).json({
        message: 'Too many requests',
        error: 'Please wait a moment before submitting again',
        retryAfter: Math.ceil(RATE_LIMIT_WINDOW / 1000)
      });
    }

    try {
      const formData: ContactFormData = req.body;

      const submissionId = Date.now().toString();
      submissions.set(submissionId, formData);

      const responseData: ContactResponse = {
        message: 'Message sent successfully',
        submissionId,
      };

      if (formData.preferredContact === 'meet' && formData.meetingDate && formData.meetingTime) {
        responseData.meetingDetails = {
          dateTime: `${formData.meetingDate} ${formData.meetingTime}`,
          message: "Your meeting request has been received. You'll receive a confirmation email with meeting details shortly."
        };
      }

      console.log('Successfully stored submission:', submissionId);
      res.json(responseData);
    } catch (error) {
      console.error('Contact form submission error:', error);
      res.status(500).json({
        message: 'Failed to send message',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.get('/api/github/commits', async (req, res) => {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      return res.status(500).json({ message: 'GitHub token not configured' });
    }

    try {
      const response = await fetch(
        'https://api.github.com/user/repos',
        {
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch GitHub data');
      }

      const repos = await response.json() as any[];
      const recentRepos = repos.slice(0, 5);

      const commitsPromises = recentRepos.map(async (repo: any) => {
        const commitsResponse = await fetch(
          `https://api.github.com/repos/${repo.full_name}/commits`,
          {
            headers: {
              'Authorization': `token ${token}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          }
        );

        if (!commitsResponse.ok) {
          return [];
        }

        const commits = await commitsResponse.json() as GitHubCommit[];
        return commits.slice(0, 5).map(commit => ({
          repo: repo.name,
          message: commit.commit.message,
          author: commit.commit.author.name,
          date: commit.commit.author.date,
          url: commit.html_url,
          sha: commit.sha.substring(0, 7)
        }));
      });

      const allCommits = await Promise.all(commitsPromises);
      res.json(allCommits.flat().sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));
    } catch (error) {
      console.error('GitHub API Error:', error);
      res.status(500).json({ message: 'Failed to fetch GitHub data' });
    }
  });

  app.get('/api/github/stats', async (req, res) => {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      return res.status(500).json({ message: 'GitHub token not configured' });
    }

    try {
      const userResponse = await fetch(
        'https://api.github.com/user',
        {
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      if (!userResponse.ok) {
        throw new Error('Failed to fetch GitHub user data');
      }

      const userData = await userResponse.json() as any;

      const reposResponse = await fetch(
        'https://api.github.com/user/repos',
        {
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      if (!reposResponse.ok) {
        throw new Error('Failed to fetch GitHub repositories');
      }

      const repos = await reposResponse.json() as any[];
      const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);

      const stats: GitHubStats = {
        repos: repos.length,
        followers: userData.followers,
        stars: totalStars
      };

      res.json(stats);
    } catch (error) {
      console.error('GitHub API Error:', error);
      res.status(500).json({ message: 'Failed to fetch GitHub stats' });
    }
  });

  app.get('/api/github/contributions', async (req, res) => {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      return res.status(500).json({ message: 'GitHub token not configured' });
    }

    try {
      const response = await fetch(
        'https://api.github.com/users/TiniusTheDev/events',
        {
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch GitHub events');
      }

      const events = await response.json() as any[];

      const contributions = new Map<string, number>();
      const today = new Date();
      const oneYearAgo = new Date(today);
      oneYearAgo.setFullYear(today.getFullYear() - 1);

      for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
        contributions.set(d.toISOString().split('T')[0], 0);
      }

      events.forEach(event => {
        const date = event.created_at.split('T')[0];
        if (contributions.has(date)) {
          contributions.set(date, (contributions.get(date) || 0) + 1);
        }
      });

      const contributionsArray = Array.from(contributions.entries()).map(([date, count]) => ({
        date,
        count
      }));

      res.json(contributionsArray);
    } catch (error) {
      console.error('GitHub API Error:', error);
      res.status(500).json({ message: 'Failed to fetch GitHub contributions' });
    }
  });


  app.get('/api/blog/posts', async (req, res) => {
    try {
      const posts = await db.query.blogPosts.findMany({
        orderBy: (posts, { desc }) => [desc(posts.publishedAt)],
      });
      res.json(posts);
    } catch (error) {
      console.error('Failed to fetch blog posts:', error);
      res.status(500).json({ message: 'Failed to fetch blog posts' });
    }
  });

  app.get('/api/blog/posts/:slug', async (req, res) => {
    try {
      const post = await db.query.blogPosts.findFirst({
        where: eq(blogPosts.slug, req.params.slug),
      });

      if (!post) {
        return res.status(404).json({ message: 'Blog post not found' });
      }

      res.json(post);
    } catch (error) {
      console.error('Failed to fetch blog post:', error);
      res.status(500).json({ message: 'Failed to fetch blog post' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}