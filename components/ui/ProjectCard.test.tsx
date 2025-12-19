import { describe, it, expect, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import * as fc from 'fast-check';
import { ProjectCard } from './ProjectCard';
import { projectArbitrary } from '../../lib/test/generators';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

// Create generators that produce valid, non-whitespace strings with unique prefixes
const titleArbitrary = fc.string({ minLength: 3, maxLength: 50 })
  .filter(s => s.trim().length >= 3 && !/^\s+$/.test(s))
  .map(s => `Title: ${s.trim()}`);

const descriptionArbitrary = fc.string({ minLength: 3, maxLength: 100 })
  .filter(s => s.trim().length >= 3 && !/^\s+$/.test(s))
  .map(s => `Description: ${s.trim()}`);

const techNameArbitrary = fc.string({ minLength: 2, maxLength: 30 })
  .filter(s => s.trim().length >= 2 && !/^\s+$/.test(s))
  .map(s => `Tech-${s.trim()}`);

const validProjectArbitrary = fc.record({
  id: fc.uuid(),
  slug: fc.stringMatching(/^[a-z0-9-]+$/),
  title: titleArbitrary,
  description: descriptionArbitrary,
  longDescription: descriptionArbitrary,
  technologies: fc.array(
    fc.record({
      name: techNameArbitrary,
      icon: fc.option(fc.webUrl(), { nil: undefined }),
      category: fc.constantFrom('language', 'framework', 'tool', 'platform'),
    }),
    { minLength: 1, maxLength: 10 }
  ),
  category: fc.constantFrom('frontend', 'ml', 'ai', 'fullstack', 'other'),
  image: fc.webUrl(),
  images: fc.array(fc.webUrl(), { minLength: 1, maxLength: 5 }),
  demoUrl: fc.option(fc.webUrl(), { nil: undefined }),
  githubUrl: fc.option(fc.webUrl(), { nil: undefined }),
  featured: fc.boolean(),
  startDate: fc.date({ min: new Date('2020-01-01'), max: new Date() }),
  endDate: fc.option(fc.date({ min: new Date('2020-01-01'), max: new Date() }), { nil: undefined }),
  highlights: fc.array(fc.string({ minLength: 3, maxLength: 50 }), { minLength: 1, maxLength: 5 }),
  challenges: fc.array(fc.string({ minLength: 3, maxLength: 50 }), { minLength: 1, maxLength: 5 }),
  outcomes: fc.array(fc.string({ minLength: 3, maxLength: 50 }), { minLength: 1, maxLength: 5 }),
});

describe('ProjectCard Component', () => {
  describe('Property 4: Project card required fields', () => {
    it('**Feature: portfolio-website, Property 4: Project card required fields** - should display title, description, technologies, and image for any project with valid non-empty content', () => {
      fc.assert(
        fc.property(validProjectArbitrary, (project) => {
          // Clean up any previous renders
          cleanup();
          
          const { unmount } = render(<ProjectCard project={project} />);
          
          // Check that title is present (using role for more specific query)
          expect(screen.getByRole('heading', { name: project.title })).toBeInTheDocument();
          
          // Check that description is present (using a more specific selector)
          const descriptionElement = screen.getByText(project.description);
          expect(descriptionElement).toBeInTheDocument();
          expect(descriptionElement.tagName.toLowerCase()).toBe('p');
          
          // Check that image is present with correct alt text
          const imageElement = screen.getByAltText(`${project.title} preview`);
          expect(imageElement).toBeInTheDocument();
          expect(imageElement).toHaveAttribute('src', project.image);
          
          // Check that at least one technology is displayed
          if (project.technologies.length > 0) {
            const firstTech = project.technologies[0];
            const techElement = screen.getByText(firstTech.name);
            expect(techElement).toBeInTheDocument();
            expect(techElement.className).toContain('bg-primary/10');
          }
          
          // Check that the project card links to the correct project page
          // Find the main link by checking href attribute
          const allLinks = screen.getAllByRole('link');
          const mainLinkElement = allLinks.find(link => 
            link.getAttribute('href') === `/projects/${project.slug}`
          );
          expect(mainLinkElement).toBeDefined();
          expect(mainLinkElement).toHaveAttribute('href', `/projects/${project.slug}`);
          
          unmount();
        }),
        { numRuns: 5 }
      );
    });

    it('should display technology tags correctly', () => {
      // Simplified test with fixed project data
      const project = {
        id: '1',
        title: 'Test Project',
        description: 'Test description',
        longDescription: 'Test long description',
        technologies: [
          { name: 'React', icon: undefined, category: 'frontend' },
          { name: 'TypeScript', icon: undefined, category: 'language' },
          { name: 'Node.js', icon: undefined, category: 'backend' }
        ],
        category: 'frontend',
        image: '/test-image.jpg',
        images: ['/test-image.jpg'],
        demoUrl: undefined,
        githubUrl: undefined,
        featured: false,
        startDate: new Date('2024-01-01'),
        endDate: undefined,
        highlights: ['Test highlight'],
        challenges: ['Test challenge'],
        outcomes: ['Test outcome'],
        slug: 'test-project'
      };
      
      render(<ProjectCard project={project} />);
      
      // Check that technologies are displayed (up to 4)
      const displayedTechCount = Math.min(project.technologies.length, 4);
      
      for (let i = 0; i < displayedTechCount; i++) {
        const tech = project.technologies[i];
        const techElements = screen.getAllByText(tech.name);
        expect(techElements.length).toBeGreaterThan(0);
        expect(techElements[0].className).toContain('bg-primary/10');
      }
      
      // If there are more than 4 technologies, check for the "+X more" indicator
      if (project.technologies.length > 4) {
        expect(screen.getByText(`+${project.technologies.length - 4} more`)).toBeInTheDocument();
      }
    });

    it('should display featured badge when project is featured', () => {
      fc.assert(
        fc.property(validProjectArbitrary, (project) => {
          cleanup();
          const { unmount } = render(<ProjectCard project={project} />);
          
          if (project.featured) {
            expect(screen.getByText('Featured')).toBeInTheDocument();
          } else {
            expect(screen.queryByText('Featured')).not.toBeInTheDocument();
          }
          
          unmount();
        }),
        { numRuns: 5 }
      );
    });

    it('should display demo and GitHub links when available', () => {
      fc.assert(
        fc.property(validProjectArbitrary, (project) => {
          cleanup();
          const { unmount } = render(<ProjectCard project={project} />);
          
          if (project.demoUrl) {
            const demoLink = screen.getByText('Live Demo →');
            expect(demoLink).toBeInTheDocument();
            expect(demoLink.closest('a')).toHaveAttribute('href', project.demoUrl);
            expect(demoLink.closest('a')).toHaveAttribute('target', '_blank');
            expect(demoLink.closest('a')).toHaveAttribute('rel', 'noopener noreferrer');
          }
          
          if (project.githubUrl) {
            const githubLink = screen.getByText('GitHub →');
            expect(githubLink).toBeInTheDocument();
            expect(githubLink.closest('a')).toHaveAttribute('href', project.githubUrl);
            expect(githubLink.closest('a')).toHaveAttribute('target', '_blank');
            expect(githubLink.closest('a')).toHaveAttribute('rel', 'noopener noreferrer');
          }
          
          unmount();
        }),
        { numRuns: 5 }
      );
    });

    it('should display category badge', () => {
      fc.assert(
        fc.property(validProjectArbitrary, (project) => {
          cleanup();
          const { unmount } = render(<ProjectCard project={project} />);
          
          // Category should be displayed with proper capitalization
          expect(screen.getByText(project.category)).toBeInTheDocument();
          
          unmount();
        }),
        { numRuns: 5 }
      );
    });
  });
});
