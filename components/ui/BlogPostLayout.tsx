'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/lib/content/types';
import ParticleBackground from '@/components/particles/ParticleBackground';

// Simple SVG icons
const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

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

const ShareIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
  </svg>
);

const ListIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}

interface BlogPostLayoutProps {
  post: BlogPost;
  children: React.ReactNode;
}

export function BlogPostLayout({ post, children }: BlogPostLayoutProps) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>([]);
  const [showToc, setShowToc] = useState(false);

  // Calculate reading progress
  useEffect(() => {
    const updateReadingProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', updateReadingProgress);
    return () => window.removeEventListener('scroll', updateReadingProgress);
  }, []);

  // Generate table of contents from headings
  useEffect(() => {
    const generateToc = () => {
      const headings = document.querySelectorAll('h1, h2, h3');
      const tocItems: TableOfContentsItem[] = [];

      headings.forEach((heading) => {
        if (heading.id && heading.textContent) {
          tocItems.push({
            id: heading.id,
            title: heading.textContent,
            level: parseInt(heading.tagName.charAt(1)),
          });
        }
      });

      setTableOfContents(tocItems);
    };

    // Generate TOC after content is rendered
    const timer = setTimeout(generateToc, 100);
    return () => clearTimeout(timer);
  }, [children]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const sharePost = async () => {
    const url = window.location.href;
    const title = post.title;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(url);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(url);
    }
  };

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setShowToc(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <ParticleBackground />
      
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-foreground/10 z-50">
        <div
          className="h-full bg-primary transition-all duration-150 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-foreground/70 hover:text-foreground transition-colors duration-200"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Blog
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <header className="mb-12">
            <div className="text-center mb-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex items-center justify-center gap-6 text-foreground/60 mb-6">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  <time dateTime={post.date}>
                    {formatDate(post.date)}
                  </time>
                </div>
                
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-4 h-4" />
                  <span>{post.readingTime} min read</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span>by {post.author}</span>
                </div>
              </div>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex items-center justify-center gap-2 flex-wrap mb-6">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Share Button */}
              <button
                onClick={sharePost}
                className="inline-flex items-center gap-2 px-4 py-2 bg-foreground/10 text-foreground rounded-lg hover:bg-foreground/20 transition-colors duration-200"
              >
                <ShareIcon className="w-4 h-4" />
                Share Article
              </button>
            </div>
          </header>

          <div className="flex gap-8">
            {/* Main Content */}
            <article className="flex-1 min-w-0">
              <div className="prose prose-lg max-w-none">
                <div className="bg-background/30 backdrop-blur-sm border border-foreground/10 rounded-lg p-8">
                  {children}
                </div>
              </div>
            </article>

            {/* Table of Contents Sidebar */}
            {tableOfContents.length > 0 && (
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-24">
                  <div className="bg-background/50 backdrop-blur-sm border border-foreground/10 rounded-lg p-4">
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <ListIcon className="w-4 h-4" />
                      Table of Contents
                    </h3>
                    <nav>
                      <ul className="space-y-1">
                        {tableOfContents.map((item) => (
                          <li key={item.id}>
                            <button
                              onClick={() => scrollToHeading(item.id)}
                              className={`block w-full text-left text-sm text-foreground/70 hover:text-foreground transition-colors duration-200 ${
                                item.level === 1 ? 'font-medium' : 
                                item.level === 2 ? 'pl-3' : 'pl-6'
                              }`}
                            >
                              {item.title}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </div>
                </div>
              </aside>
            )}
          </div>

          {/* Mobile TOC Toggle */}
          {tableOfContents.length > 0 && (
            <div className="lg:hidden fixed bottom-6 right-6 z-40">
              <button
                onClick={() => setShowToc(!showToc)}
                className="w-12 h-12 bg-primary text-white rounded-full shadow-lg flex items-center justify-center"
              >
                <ListIcon className="w-5 h-5" />
              </button>

              {/* Mobile TOC Overlay */}
              {showToc && (
                <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowToc(false)}>
                  <div className="absolute bottom-20 right-6 bg-background border border-foreground/10 rounded-lg p-4 max-w-xs">
                    <h3 className="font-semibold text-foreground mb-3">Table of Contents</h3>
                    <nav>
                      <ul className="space-y-1">
                        {tableOfContents.map((item) => (
                          <li key={item.id}>
                            <button
                              onClick={() => scrollToHeading(item.id)}
                              className={`block w-full text-left text-sm text-foreground/70 hover:text-foreground transition-colors duration-200 ${
                                item.level === 1 ? 'font-medium' : 
                                item.level === 2 ? 'pl-3' : 'pl-6'
                              }`}
                            >
                              {item.title}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-center pt-12 mt-12 border-t border-foreground/10">
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-3 bg-foreground/10 text-foreground font-semibold rounded-lg hover:bg-foreground/20 transition-colors duration-200"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to All Articles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogPostLayout;