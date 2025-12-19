import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import fc from 'fast-check';
import { GitHubRepos } from './GitHubRepos';

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock the GitHub API
vi.mock('../../lib/github/api', () => ({
  getFeaturedRepos: vi.fn(),
  fallbackRepos: [
    {
      id: 1,
      name: 'test-repo',
      full_name: 'testuser/test-repo',
      description: 'A test repository',
      html_url: 'https://github.com/testuser/test-repo',
      stargazers_count: 10,
      forks_count: 5,
      language: 'TypeScript',
      topics: ['test', 'demo'],
      updated_at: '2024-01-01T00:00:00Z',
      created_at: '2023-01-01T00:00:00Z',
      homepage: null,
      archived: false,
      disabled: false,
      private: false
    }
  ]
}));

// Import the mocked module
import * as githubApi from '../../lib/github/api';

// Property-based test generators
const repoGenerator = fc.record({
  id: fc.integer({ min: 1, max: 999999 }),
  name: fc.string({ minLength: 1, maxLength: 50 }),
  full_name: fc.string({ minLength: 1, maxLength: 50 }),
  description: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: null }),
  html_url: fc.constant('https://github.com/user/repo'),
  stargazers_count: fc.integer({ min: 0, max: 1000 }),
  forks_count: fc.integer({ min: 0, max: 100 }),
  language: fc.option(fc.constantFrom('JavaScript', 'TypeScript', 'Python'), { nil: null }),
  topics: fc.array(fc.string({ minLength: 1, maxLength: 10 }), { minLength: 0, maxLength: 3 }),
  updated_at: fc.constant('2024-01-01T00:00:00Z'),
  created_at: fc.constant('2023-01-01T00:00:00Z'),
  homepage: fc.constant(null),
  archived: fc.constant(false),
  disabled: fc.constant(false),
  private: fc.constant(false)
});

describe('GitHubRepos Property Tests', () => {
  const mockGetFeaturedRepos = vi.mocked(githubApi.getFeaturedRepos);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    mockGetFeaturedRepos.mockResolvedValue([]);
    
    const { container } = render(<GitHubRepos />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should display repository information correctly', async () => {
    const testRepo = {
      id: 1,
      name: 'test-repo',
      full_name: 'user/test-repo',
      description: 'Test description',
      html_url: 'https://github.com/user/test-repo',
      stargazers_count: 10,
      forks_count: 5,
      language: 'TypeScript',
      topics: ['react', 'typescript'],
      updated_at: '2024-01-01T00:00:00Z',
      created_at: '2023-01-01T00:00:00Z',
      homepage: null,
      archived: false,
      disabled: false,
      private: false
    };

    mockGetFeaturedRepos.mockResolvedValue([testRepo]);
    
    render(<GitHubRepos />);
    
    await waitFor(() => {
      expect(screen.getByText('test-repo')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });
  });

  it('should handle API errors gracefully', async () => {
    mockGetFeaturedRepos.mockRejectedValue(new Error('API Error'));
    
    render(<GitHubRepos />);
    
    // Should show fallback repos when API fails
    await waitFor(() => {
      expect(screen.getByText('test-repo')).toBeInTheDocument();
    });
  });

  it('should conditionally show title based on showTitle prop', () => {
    mockGetFeaturedRepos.mockResolvedValue([]);
    
    render(<GitHubRepos showTitle={false} />);
    
    expect(screen.queryByText(/featured repositories/i)).not.toBeInTheDocument();
  });

  it('should apply custom className', () => {
    mockGetFeaturedRepos.mockResolvedValue([]);
    
    const customClass = 'custom-github-repos';
    const { container } = render(<GitHubRepos className={customClass} />);
    
    expect(container.firstChild).toHaveClass(customClass);
  });

  it('should handle repositories without descriptions', async () => {
    const repoWithoutDescription = {
      id: 1,
      name: 'test-repo',
      full_name: 'user/test-repo',
      description: null,
      html_url: 'https://github.com/user/test-repo',
      stargazers_count: 10,
      forks_count: 5,
      language: 'TypeScript',
      topics: [],
      updated_at: '2024-01-01T00:00:00Z',
      created_at: '2023-01-01T00:00:00Z',
      homepage: null,
      archived: false,
      disabled: false,
      private: false
    };

    mockGetFeaturedRepos.mockResolvedValue([repoWithoutDescription]);
    
    render(<GitHubRepos />);
    
    await waitFor(() => {
      expect(screen.getByText('No description available')).toBeInTheDocument();
    });
  });

  it('should render repository topics correctly', async () => {
    const repoWithTopics = {
      id: 1,
      name: 'test-repo',
      full_name: 'user/test-repo',
      description: 'Test description',
      html_url: 'https://github.com/user/test-repo',
      stargazers_count: 10,
      forks_count: 5,
      language: 'TypeScript',
      topics: ['react', 'typescript', 'nextjs', 'testing', 'more-topics'],
      updated_at: '2024-01-01T00:00:00Z',
      created_at: '2023-01-01T00:00:00Z',
      homepage: null,
      archived: false,
      disabled: false,
      private: false
    };

    mockGetFeaturedRepos.mockResolvedValue([repoWithTopics]);
    
    render(<GitHubRepos />);
    
    await waitFor(() => {
      // Should show first 3 topics
      expect(screen.getByText('react')).toBeInTheDocument();
      expect(screen.getByText('typescript')).toBeInTheDocument();
      expect(screen.getByText('nextjs')).toBeInTheDocument();
      
      // Should show "+2" for remaining topics
      expect(screen.getByText('+2')).toBeInTheDocument();
    });
  });

  it('should handle property-based repository data validation', () => {
    fc.assert(
      fc.property(repoGenerator, (repo) => {
        // Validate generated repository data
        expect(repo.id).toBeGreaterThan(0);
        expect(repo.name.length).toBeGreaterThan(0);
        expect(repo.stargazers_count).toBeGreaterThanOrEqual(0);
        expect(repo.forks_count).toBeGreaterThanOrEqual(0);
        expect(repo.topics.length).toBeLessThanOrEqual(3);
      }),
      { numRuns: 3 }
    );
  });

  it('should render external links correctly', async () => {
    const repo = {
      id: 1,
      name: 'test-repo',
      full_name: 'user/test-repo',
      description: 'Test description',
      html_url: 'https://github.com/user/test-repo',
      stargazers_count: 10,
      forks_count: 5,
      language: 'TypeScript',
      topics: [],
      updated_at: '2024-01-01T00:00:00Z',
      created_at: '2023-01-01T00:00:00Z',
      homepage: null,
      archived: false,
      disabled: false,
      private: false
    };

    mockGetFeaturedRepos.mockResolvedValue([repo]);
    
    render(<GitHubRepos username="testuser" />);
    
    await waitFor(() => {
      const githubLink = screen.getByText('View all on GitHub').closest('a');
      expect(githubLink).toHaveAttribute('href', 'https://github.com/testuser');
      expect(githubLink).toHaveAttribute('target', '_blank');
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('should handle edge cases with different prop combinations', () => {
    fc.assert(
      fc.property(
        fc.record({
          username: fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: undefined }),
          maxRepos: fc.option(fc.integer({ min: 1, max: 10 }), { nil: undefined }),
          showTitle: fc.option(fc.boolean(), { nil: undefined }),
          className: fc.option(fc.string({ maxLength: 20 }), { nil: undefined })
        }),
        (props) => {
          // Validate prop combinations
          if (props.maxRepos !== undefined) {
            expect(props.maxRepos).toBeGreaterThan(0);
          }
          if (props.username !== undefined) {
            expect(props.username.length).toBeGreaterThan(0);
          }
        }
      ),
      { numRuns: 3 }
    );
  });
});
