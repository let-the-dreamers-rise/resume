'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { GitHubRepo, getFeaturedRepos, fallbackRepos } from '@/lib/github/api';

interface GitHubReposProps {
  username?: string;
  maxRepos?: number;
  showTitle?: boolean;
  className?: string;
}

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const ForkIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2H10a2 2 0 01-2-2v-1M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
  </svg>
);

const ExternalLinkIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const LanguageColors: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#2b7489',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Vue: '#2c3e50',
  React: '#61dafb',
  Go: '#00ADD8',
  Rust: '#dea584',
  PHP: '#4F5D95',
  Ruby: '#701516',
  Swift: '#ffac45',
  Kotlin: '#F18E33',
  Dart: '#00B4AB',
};

export const GitHubRepos: React.FC<GitHubReposProps> = ({
  username = 'let-the-dreamers-rise',
  maxRepos = 6,
  showTitle = true,
  className = ''
}) => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const fetchedRepos = await getFeaturedRepos(username, maxRepos);
        
        if (fetchedRepos.length === 0) {
          // Use fallback data if API fails or returns no repos
          setRepos(fallbackRepos.slice(0, maxRepos));
        } else {
          setRepos(fetchedRepos);
        }
      } catch (err) {
        console.error('Error fetching GitHub repos:', err);
        setError('Failed to load repositories');
        setRepos(fallbackRepos.slice(0, maxRepos));
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [username, maxRepos]);

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {showTitle && (
          <h3 className="text-2xl font-bold text-foreground mb-6">Featured Repositories</h3>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: maxRepos }).map((_, index) => (
            <div key={index} className="bg-background/30 backdrop-blur-sm border border-foreground/10 rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-foreground/20 rounded mb-3"></div>
              <div className="h-3 bg-foreground/10 rounded mb-4"></div>
              <div className="flex justify-between items-center">
                <div className="h-3 bg-foreground/10 rounded w-16"></div>
                <div className="h-3 bg-foreground/10 rounded w-12"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error && repos.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        {showTitle && (
          <h3 className="text-2xl font-bold text-foreground mb-6">Featured Repositories</h3>
        )}
        <div className="bg-background/30 backdrop-blur-sm border border-foreground/10 rounded-lg p-8">
          <p className="text-foreground/60 mb-4">{error}</p>
          <p className="text-sm text-foreground/40">
            Unable to load GitHub repositories. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {showTitle && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-foreground">Featured Repositories</h3>
          <Link
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-foreground/70 hover:text-primary transition-colors"
          >
            View all on GitHub
            <ExternalLinkIcon className="w-4 h-4 ml-1" />
          </Link>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {repos.map((repo) => (
          <div
            key={repo.id}
            className="bg-background/30 backdrop-blur-sm border border-foreground/10 rounded-lg p-6 hover:border-foreground/20 transition-all duration-200 group"
          >
            <div className="flex items-start justify-between mb-3">
              <h4 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                <Link
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {repo.name}
                </Link>
              </h4>
              <Link
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/40 hover:text-foreground/70 transition-colors"
              >
                <ExternalLinkIcon className="w-4 h-4" />
              </Link>
            </div>
            
            <p className="text-foreground/70 text-sm mb-4 line-clamp-2">
              {repo.description || 'No description available'}
            </p>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                {repo.language && (
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: LanguageColors[repo.language] || '#6b7280' }}
                    />
                    <span className="text-foreground/60">{repo.language}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center text-foreground/60">
                  <StarIcon className="w-4 h-4 mr-1" />
                  <span>{repo.stargazers_count}</span>
                </div>
                <div className="flex items-center text-foreground/60">
                  <ForkIcon className="w-4 h-4 mr-1" />
                  <span>{repo.forks_count}</span>
                </div>
              </div>
            </div>
            
            {repo.topics && repo.topics.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {repo.topics.slice(0, 3).map((topic) => (
                  <span
                    key={topic}
                    className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                  >
                    {topic}
                  </span>
                ))}
                {repo.topics.length > 3 && (
                  <span className="px-2 py-1 bg-foreground/10 text-foreground/60 text-xs rounded-full">
                    +{repo.topics.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {error && (
        <p className="text-center text-sm text-foreground/40 mt-4">
          Showing cached data due to API limitations
        </p>
      )}
    </div>
  );
};

export default GitHubRepos;