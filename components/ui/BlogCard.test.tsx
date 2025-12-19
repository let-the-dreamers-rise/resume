/**
 * Property-based tests for Blog listing functionality
 * Feature: portfolio-website, Property 45, 49: Blog listing and tagging
 * Validates: Requirements 12.1, 12.5
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import fc from 'fast-check';
import { BlogCard } from './BlogCard';
import { BlogPost } from '../../lib/content/types';

// Generator for blog post data
const blogPostArb = fc.record({
  slug: fc.oneof(
    fc.constant('test-post'),
    fc.constant('my-blog-post'),
    fc.constant('react-tutorial'),
    fc.string({ minLength: 5, maxLength: 30 }).filter(s => /^[a-z0-9-]+$/.test(s))
  ),
  title: fc.oneof(
    fc.constant('Getting Started with React'),
    fc.constant('Advanced TypeScript Patterns'),
    fc.constant('Building Modern Web Applications'),
    fc.string({ minLength: 10, maxLength: 80 }).filter(s => s.trim().length > 0)
  ),
  excerpt: fc.oneof(
    fc.constant('This is a comprehensive guide to modern web development practices and patterns.'),
    fc.constant('Learn how to build scalable applications with the latest technologies and best practices.'),
    fc.string({ minLength: 30, maxLength: 200 }).filter(s => s.trim().length > 0)
  ),
  date: fc.date({ min: new Date('2020-01-01'), max: new Date('2024-12-31') })
    .map((d: Date) => d.toISOString().split('T')[0]),
  readingTime: fc.integer({ min: 1, max: 30 }),
  tags: fc.array(
    fc.oneof(
      fc.constant('React'),
      fc.constant('TypeScript'),
      fc.constant('JavaScript'),
      fc.constant('Next.js'),
      fc.constant('Web Development'),
      fc.constant('Testing'),
      fc.constant('Performance'),
      fc.constant('Accessibility'),
      fc.constant('SEO'),
      fc.constant('UI/UX'),
      fc.constant('Backend'),
      fc.constant('Database'),
      fc.string({ minLength: 3, maxLength: 15 }).filter(s => /^[A-Za-z][A-Za-z0-9\s]*$/.test(s.trim()))
    ),
    { minLength: 1, maxLength: 6 }
  ).map(tags => [...new Set(tags)]), // Remove duplicates to prevent React key warnings
  author: fc.oneof(
    fc.constant('John Doe'),
    fc.constant('Jane Smith'),
    fc.constant('Alex Chen'),
    fc.string({ minLength: 5, maxLength: 30 }).filter(s => /^[A-Za-z\s]+$/.test(s.trim()))
  ),
  featured: fc.boolean()
});

describe('Blog Listing Property Tests', () => {
  /**
   * Property 45: Article metadata completeness
   * For any blog post, all required metadata should be displayed
   */
  it('Property 45: Article metadata completeness - should display all required metadata fields', () => {
    fc.assert(fc.property(
      blogPostArb,
      (post: BlogPost) => {
        const { container, unmount } = render(<BlogCard post={post} />);

        try {
          // Title should be present and visible
          expect(container).toHaveTextContent(post.title.trim());

          // Excerpt should be present
          expect(container).toHaveTextContent(post.excerpt.trim());

          // Date should be formatted and displayed
          expect(container).toHaveTextContent(post.date.split('-')[0]); // Year should be visible

          // Reading time should be displayed
          expect(container).toHaveTextContent(`${post.readingTime} min`);

          // Author should be displayed
          expect(container).toHaveTextContent(post.author.trim());

          // At least one tag should be visible
          const firstTag = post.tags[0];
          if (firstTag && firstTag.trim()) {
            expect(container).toHaveTextContent(firstTag.trim());
          }
        } finally {
          unmount();
        }
      }
    ), { numRuns: 10 });
  });

  /**
   * Property 49: Article tagging
   * For any blog post with tags, all tags should be properly displayed and accessible
   */
  it('Property 49: Article tagging - should display all tags with proper formatting', () => {
    fc.assert(fc.property(
      blogPostArb.filter(post => post.tags.length > 0 && post.tags.every(tag => tag.trim().length > 0)),
      (post: BlogPost) => {
        const { container, unmount } = render(<BlogCard post={post} />);

        try {
          // All tags should be rendered (only check first 3 as component may truncate)
          const visibleTags = post.tags.slice(0, 3);
          visibleTags.forEach(tag => {
            expect(container).toHaveTextContent(tag.trim());
          });

          // Should have tag elements
          const tagElements = container.querySelectorAll('.bg-primary\\/10');
          expect(tagElements.length).toBeGreaterThan(0);
        } finally {
          unmount();
        }
      }
    ), { numRuns: 10 });
  });

  // Additional property: Link functionality
  it('should create proper navigation links for all blog posts', () => {
    fc.assert(fc.property(
      blogPostArb,
      (post: BlogPost) => {
        const { container } = render(<BlogCard post={post} />);

        // Should have a link to the blog post
        const linkElements = container.querySelectorAll('a[href]');
        expect(linkElements.length).toBeGreaterThan(0);
        
        const mainLink = linkElements[0] as HTMLAnchorElement;
        expect(mainLink).toHaveAttribute('href', `/blog/${post.slug}`);
      }
    ), { numRuns: 10 });
  });

  // Edge case: Posts with many tags
  it('should handle posts with maximum number of tags', () => {
    const postWithManyTags: BlogPost = {
      slug: 'test-post',
      title: 'Test Post with Many Tags',
      excerpt: 'This is a test post with many tags to test the display.',
      date: '2024-01-01',
      readingTime: 5,
      tags: ['React', 'TypeScript', 'Next.js', 'Testing', 'Performance', 'Accessibility', 'SEO', 'Web Development'],
      author: 'Test Author',
      featured: false
    };

    render(<BlogCard post={postWithManyTags} />);

    // First 3 tags should be displayed (component truncates)
    const visibleTags = postWithManyTags.tags.slice(0, 3);
    visibleTags.forEach(tag => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
    
    // Should show "+X more" indicator for remaining tags
    if (postWithManyTags.tags.length > 3) {
      expect(screen.getByText(`+${postWithManyTags.tags.length - 3} more`)).toBeInTheDocument();
    }
  });

  // Edge case: Posts with minimal content
  it('should handle posts with minimal required content', () => {
    const minimalPost: BlogPost = {
      slug: 'min',
      title: 'Short',
      excerpt: 'Minimal excerpt here.',
      date: '2024-01-01',
      readingTime: 1,
      tags: ['Test'],
      author: 'Me',
      featured: false
    };

    render(<BlogCard post={minimalPost} />);

    expect(screen.getByText('Short')).toBeInTheDocument();
    expect(screen.getByText('Minimal excerpt here.')).toBeInTheDocument();
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  // Edge case: Featured posts
  it('should handle featured posts with special styling', () => {
    fc.assert(fc.property(
      blogPostArb.map(post => ({ ...post, featured: true })),
      (post: BlogPost) => {
        const { container, unmount } = render(<BlogCard post={post} />);

        try {
          // Featured posts should still display all required content
          expect(container).toHaveTextContent(post.title.trim());
          expect(container).toHaveTextContent(post.excerpt.trim());
          
          // Should have proper link
          const linkElements = container.querySelectorAll('a[href]');
          expect(linkElements.length).toBeGreaterThan(0);
          
          const mainLink = linkElements[0] as HTMLAnchorElement;
          expect(mainLink).toHaveAttribute('href', `/blog/${post.slug}`);
        } finally {
          unmount();
        }
      }
    ), { numRuns: 5 });
  });
});
