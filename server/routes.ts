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
  message?: string;
  answers: Record<string, string>;
  recommendation: string;
}

async function getMs365Token() {
  const tokenEndpoint = `https://login.microsoftonline.com/${process.env.MS365_TENANT_ID}/oauth2/v2.0/token`;
  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: process.env.MS365_CLIENT_ID!,
      client_secret: process.env.MS365_CLIENT_SECRET!,
      scope: 'https://graph.microsoft.com/.default',
      grant_type: 'client_credentials',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get access token');
  }

  const data = await response.json();
  return data.access_token;
}

async function sendEmail(formData: ContactFormData) {
  const token = await getMs365Token();

  const emailContent = `
New Consultation Request

Name: ${formData.name}
Email: ${formData.email}
${formData.message ? `Message: ${formData.message}\n` : ''}

Assessment Results:
Business Stage: ${formData.answers.business_stage}
Pain Points: ${formData.answers.pain_points}
Timeline: ${formData.answers.timeline}

Recommended Solution: ${formData.recommendation}
`;

  const message = {
    message: {
      subject: `Consultation Request from ${formData.name}`,
      body: {
        contentType: 'text',
        content: emailContent,
      },
      toRecipients: [
        {
          emailAddress: {
            address: process.env.MS365_EMAIL,
          },
        },
      ],
    },
  };

  const response = await fetch('https://graph.microsoft.com/v1.0/users/' + process.env.MS365_EMAIL + '/sendMail', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });

  if (!response.ok) {
    throw new Error('Failed to send email');
  }
}

export function registerRoutes(app: Express): Server {
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

      const repos = await response.json();
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

  // Contact form endpoint
  app.post('/api/contact', async (req, res) => {
    try {
      const formData: ContactFormData = req.body;
      await sendEmail(formData);
      res.json({ message: 'Message sent successfully' });
    } catch (error) {
      console.error('Email Error:', error);
      res.status(500).json({ message: 'Failed to send message' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}