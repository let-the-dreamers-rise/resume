'use client';

import React from 'react';
import Link from 'next/link';
import { BlogPost } from '../../lib/content/types';

// Simple SVG icons
const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const TagIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <article className="group bg-background/50 backdrop-blur-sm border border-foreground/10 rounded-lg p-6 hover:border-foreground/20 transition-all duration-200 hover:shadow-lg">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="space-y-4">
          {/* Header */}
          <div>
            <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
              {post.title}
            </h2>
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-4 text-sm text-foreground/60">
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-4 h-4" />
              <time dateTime={post.date}>
                {formatDate(post.date)}
              </time>
            </div>
            
            <div className="flex items-center gap-1">
              <ClockIcon className="w-4 h-4" />
              <span>{post.readingTime} min read</span>
            </div>
            
            <div className="flex items-center gap-1">
              <span>by {post.author}</span>
            </div>
          </div>

          {/* Excerpt */}
          <p className="text-foreground/80 line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <TagIcon className="w-4 h-4 text-foreground/40" />
              {post.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={`${tag}-${index}`}
                  className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
                >
                  {tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="text-xs text-foreground/60">
                  +{post.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Read More */}
          <div className="pt-2">
            <span className="text-primary font-medium group-hover:underline">
              Read more →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default BlogCard;