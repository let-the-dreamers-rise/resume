export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  created_at: string;
  homepage: string | null;
  archived: boolean;
  disabled: boolean;
  private: boolean;
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
}

export class GitHubApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'GitHubApiError';
  }
}

class GitHubApiClient {
  private baseUrl = 'https://api.github.com';
  private token?: string;

  constructor() {
    this.token = process.env.GITHUB_TOKEN;
  }

  private async request<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Portfolio-Website/1.0',
    };

    if (this.token) {
      headers['Authorization'] = `token ${this.token}`;
    }

    try {
      const response = await fetch(url, { 
        headers,
        next: { revalidate: 3600 } // Cache for 1 hour
      });

      if (!response.ok) {
        throw new GitHubApiError(`GitHub API error: ${response.statusText}`, response.status);
      }

      return response.json();
    } catch (error) {
      if (error instanceof GitHubApiError) {
        throw error;
      }
      throw new GitHubApiError(`Network error: ${error}`, 500);
    }
  }

  async getUser(username: string): Promise<GitHubUser> {
    return this.request<GitHubUser>(`/users/${username}`);
  }

  async getUserRepos(username: string, options: {
    sort?: 'created' | 'updated' | 'pushed' | 'full_name';
    direction?: 'asc' | 'desc';
    per_page?: number;
    page?: number;
  } = {}): Promise<GitHubRepo[]> {
    const params = new URLSearchParams();
    
    if (options.sort) params.append('sort', options.sort);
    if (options.direction) params.append('direction', options.direction);
    if (options.per_page) params.append('per_page', options.per_page.toString());
    if (options.page) params.append('page', options.page.toString());

    const queryString = params.toString();
    const endpoint = `/users/${username}/repos${queryString ? `?${queryString}` : ''}`;
    
    return this.request<GitHubRepo[]>(endpoint);
  }

  async getFeaturedRepos(username: string, maxRepos: number = 6): Promise<GitHubRepo[]> {
    try {
      const repos = await this.getUserRepos(username, {
        sort: 'updated',
        direction: 'desc',
        per_page: 50
      });

      // Filter out forks, archived repos, and private repos
      const publicRepos = repos.filter(repo => 
        !repo.archived && 
        !repo.disabled && 
        !repo.private &&
        repo.description // Only include repos with descriptions
      );

      // Sort by stars and recent activity
      const sortedRepos = publicRepos.sort((a, b) => {
        const aScore = a.stargazers_count * 2 + new Date(a.updated_at).getTime() / 1000000000;
        const bScore = b.stargazers_count * 2 + new Date(b.updated_at).getTime() / 1000000000;
        return bScore - aScore;
      });

      return sortedRepos.slice(0, maxRepos);
    } catch (error) {
      console.error('Error fetching featured repos:', error);
      return [];
    }
  }
}

// Singleton instance
export const githubApi = new GitHubApiClient();

// Convenience functions
export async function getFeaturedRepos(username: string = 'let-the-dreamers-rise', maxRepos: number = 6): Promise<GitHubRepo[]> {
  return githubApi.getFeaturedRepos(username, maxRepos);
}

export async function getGitHubProfile(username: string = 'let-the-dreamers-rise'): Promise<GitHubUser | null> {
  try {
    return await githubApi.getUser(username);
  } catch (error) {
    console.error('Error fetching GitHub profile:', error);
    return null;
  }
}

// Fallback data for when API fails
export const fallbackRepos: GitHubRepo[] = [
  {
    id: 1,
    name: 'ai-portfolio-chatbot',
    full_name: 'let-the-dreamers-rise/ai-portfolio-chatbot',
    description: 'An intelligent chatbot for portfolio websites using OpenAI and vector search',
    html_url: 'https://github.com/let-the-dreamers-rise/ai-portfolio-chatbot',
    stargazers_count: 45,
    forks_count: 12,
    language: 'TypeScript',
    topics: ['ai', 'chatbot', 'openai', 'nextjs'],
    updated_at: '2024-01-15T10:30:00Z',
    created_at: '2023-11-01T14:20:00Z',
    homepage: 'https://ai-chatbot-demo.vercel.app',
    archived: false,
    disabled: false,
    private: false
  },
  {
    id: 2,
    name: 'react-3d-portfolio',
    full_name: 'let-the-dreamers-rise/react-3d-portfolio',
    description: 'A stunning 3D portfolio website built with React Three Fiber and WebGL',
    html_url: 'https://github.com/let-the-dreamers-rise/react-3d-portfolio',
    stargazers_count: 78,
    forks_count: 23,
    language: 'JavaScript',
    topics: ['react', 'threejs', 'webgl', 'portfolio'],
    updated_at: '2024-01-10T16:45:00Z',
    created_at: '2023-09-15T09:30:00Z',
    homepage: 'https://3d-portfolio-demo.vercel.app',
    archived: false,
    disabled: false,
    private: false
  },
  {
    id: 3,
    name: 'ml-recommendation-engine',
    full_name: 'let-the-dreamers-rise/ml-recommendation-engine',
    description: 'A machine learning recommendation system using collaborative filtering and deep learning',
    html_url: 'https://github.com/let-the-dreamers-rise/ml-recommendation-engine',
    stargazers_count: 34,
    forks_count: 8,
    language: 'Python',
    topics: ['machine-learning', 'recommendation-system', 'tensorflow'],
    updated_at: '2024-01-05T12:20:00Z',
    created_at: '2023-08-20T11:15:00Z',
    homepage: null,
    archived: false,
    disabled: false,
    private: false
  }
];

export const fallbackProfile: GitHubUser = {
  login: 'let-the-dreamers-rise',
  id: 12345,
  avatar_url: 'https://github.com/let-the-dreamers-rise.png',
  html_url: 'https://github.com/let-the-dreamers-rise',
  name: 'Ashwin Goyal',
  company: '@VIT Bhopal',
  blog: 'https://ashwingoyal.dev',
  location: 'India',
  email: null,
  bio: 'Full-stack developer passionate about AI and modern web technologies',
  public_repos: 42,
  followers: 156,
  following: 89
};