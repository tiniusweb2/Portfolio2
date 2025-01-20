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

async function getMs365Token() {
  const tokenEndpoint = `https://login.microsoftonline.com/${process.env.MS365_TENANT_ID}/oauth2/v2.0/token`;

  console.log('Getting MS365 token...');

  try {
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
      const errorText = await response.text();
      console.error('Token request failed:', response.status, errorText);
      throw new Error(`Failed to get access token: ${response.status} ${errorText}`);
    }

    const data = await response.json() as { access_token: string };
    console.log('Successfully obtained MS365 token');
    return data.access_token;
  } catch (error) {
    console.error('Error getting MS365 token:', error);
    throw error;
  }
}

async function createCalendarEvent(token: string, formData: ContactFormData) {
  if (formData.preferredContact === 'meet' && formData.meetingDate && formData.meetingTime) {
    console.log('Creating calendar event...');

    const startTime = new Date(`${formData.meetingDate}T${formData.meetingTime}`);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour meeting

    const event = {
      subject: `Consultation with ${formData.name}`,
      body: {
        contentType: 'text',
        content: `Consultation Request\n\nName: ${formData.name}\nEmail: ${formData.email}\n${formData.message ? `Message: ${formData.message}\n` : ''}\n\nAssessment Results:\nBusiness Stage: ${formData.answers.business_stage}\nPain Points: ${formData.answers.pain_points}\nTimeline: ${formData.answers.timeline}\n\nRecommended Solution: ${formData.recommendation}`,
      },
      start: {
        dateTime: startTime.toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: 'UTC',
      },
      attendees: [
        {
          emailAddress: {
            address: formData.email,
            name: formData.name,
          },
          type: 'required',
        },
      ],
      isOnlineMeeting: true,
      onlineMeetingProvider: 'teamsForBusiness',
    };

    try {
      const response = await fetch(
        `https://graph.microsoft.com/v1.0/users/${process.env.MS365_EMAIL}/calendar/events`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Calendar event creation failed:', response.status, errorData);
        throw new Error(`Failed to create calendar event: ${response.status} ${errorData}`);
      }

      const eventData = await response.json();
      console.log('Successfully created calendar event');
      return eventData;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
  }
  return null;
}

async function sendEmail(formData: ContactFormData, meetingDetails?: any) {
  console.log('Sending email notification...');
  const token = await getMs365Token();

  let meetingInfo = '';
  if (formData.preferredContact === 'meet' && meetingDetails) {
    meetingInfo = `
Meeting Details:
Date: ${formData.meetingDate}
Time: ${formData.meetingTime}
Teams Link: ${meetingDetails.onlineMeeting?.joinUrl}
    `;
  }

  const emailContent = `
New Consultation Request

Name: ${formData.name}
Email: ${formData.email}
${formData.phone ? `Phone: ${formData.phone}\n` : ''}
Preferred Contact Method: ${formData.preferredContact}
${formData.message ? `Message: ${formData.message}\n` : ''}

Assessment Results:
Business Stage: ${formData.answers.business_stage}
Pain Points: ${formData.answers.pain_points}
Timeline: ${formData.answers.timeline}

Recommended Solution: ${formData.recommendation}

${meetingInfo}
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

  try {
    const response = await fetch(
      'https://graph.microsoft.com/v1.0/users/' + process.env.MS365_EMAIL + '/sendMail',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Send email failed:', response.status, errorData);
      throw new Error(`Failed to send email: ${response.status} ${errorData}`);
    }

    console.log('Successfully sent email notification');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

export function registerRoutes(app: Express): Server {
  app.post('/api/contact', async (req, res) => {
    console.log('Received contact form submission:', req.body);

    try {
      const formData: ContactFormData = req.body;
      const token = await getMs365Token();

      let meetingDetails;
      if (formData.preferredContact === 'meet') {
        meetingDetails = await createCalendarEvent(token, formData);
      }

      await sendEmail(formData, meetingDetails);

      res.json({ 
        message: 'Message sent successfully',
        meetingDetails: meetingDetails ? {
          joinUrl: meetingDetails.onlineMeeting?.joinUrl,
          dateTime: `${formData.meetingDate} ${formData.meetingTime}`
        } : undefined
      });
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


  const httpServer = createServer(app);
  return httpServer;
}