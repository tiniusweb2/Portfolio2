import type { Express } from "express";
import { createServer, type Server } from "http";
import fetch from "node-fetch";

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

// Store submissions in memory (in a production app, this would be in a database)
const submissions = new Map<string, ContactFormData>();

export function registerRoutes(app: Express): Server {
  app.post('/api/contact', async (req, res) => {
    console.log('Received contact form submission:', req.body);

    try {
      const formData: ContactFormData = req.body;

      // Generate a unique ID for the submission
      const submissionId = Date.now().toString();
      submissions.set(submissionId, formData);

      // Prepare response based on contact preference
      const responseData = {
        message: 'Message sent successfully',
        submissionId,
      };

      if (formData.preferredContact === 'meet') {
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

  // GitHub commits endpoint
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

        const commits: GitHubCommit[] = await commitsResponse.json();
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

  const httpServer = createServer(app);
  return httpServer;
}