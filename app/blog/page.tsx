'use client';

import React, { useState, useEffect } from 'react';
import { BlogPost } from '@/lib/content/types';
import { BlogCard } from '@/components/ui/BlogCard';
import ParticleBackground from '@/components/particles/ParticleBackground';

// Simple SVG icons
const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const FilterIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
  </svg>
);

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch blog posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blog');
        if (response.ok) {
          const data = await response.json();
          setPosts(data.posts);
          setFilteredPosts(data.posts);
          
          // Extract unique tags
          const tagSet = new Set<string>();
          data.posts.forEach((post: BlogPost) => {
            post.tags.forEach(tag => tagSet.add(tag));
          });
          setAllTags(Array.from(tagSet).sort());
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter posts based on search and tag
  useEffect(() => {
    let filtered = posts;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by selected tag
    if (selectedTag) {
      filtered = filtered.filter(post =>
        post.tags.includes(selectedTag)
      );
    }

    setFilteredPosts(filtered);
  }, [posts, searchQuery, selectedTag]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTag('');
  };

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <ParticleBackground />
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-foreground/70">Loading articles...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <ParticleBackground />
      
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6">
            Technical Blog
          </h1>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
            Insights, tutorials, and thoughts on modern web development, AI, and software engineering
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/40" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-background/50 backdrop-blur-sm border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder-foreground/50"
            />
          </div>

          {/* Tag Filter */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <FilterIcon className="w-4 h-4 text-foreground/60" />
              <span className="text-sm text-foreground/60">Filter by tag:</span>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedTag('')}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedTag === ''
                    ? 'bg-primary text-white'
                    : 'bg-foreground/10 text-foreground/70 hover:bg-foreground/20'
                }`}
              >
                All
              </button>
              
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    selectedTag === tag
                      ? 'bg-primary text-white'
                      : 'bg-foreground/10 text-foreground/70 hover:bg-foreground/20'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {(searchQuery || selectedTag) && (
              <button
                onClick={clearFilters}
                className="text-sm text-primary hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="text-center mb-8">
          <p className="text-foreground/60">
            {filteredPosts.length === posts.length
              ? `${posts.length} article${posts.length !== 1 ? 's' : ''}`
              : `${filteredPosts.length} of ${posts.length} article${posts.length !== 1 ? 's' : ''}`
            }
          </p>
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-foreground/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <SearchIcon className="w-8 h-8 text-foreground/40" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No articles found
              </h3>
              <p className="text-foreground/60 mb-4">
                {searchQuery || selectedTag
                  ? "Try adjusting your search or filter criteria"
                  : "No blog posts are available yet"
                }
              </p>
              {(searchQuery || selectedTag) && (
                <button
                  onClick={clearFilters}
                  className="text-primary hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* Pagination placeholder */}
        {filteredPosts.length > 9 && (
          <div className="mt-12 text-center">
            <p className="text-foreground/60 text-sm">
              Pagination will be implemented for larger collections
            </p>
          </div>
        )}
      </div>
    </div>
  );
}