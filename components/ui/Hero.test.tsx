import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import * as fc from 'fast-check';
import { Hero } from './Hero';
import { ThemeProvider } from '../../lib/theme/theme-context';

// Clean up after each test to avoid DOM conflicts
afterEach(() => {
  cleanup();
});

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href, className }: any) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

// Mock 3D Scene component
vi.mock('../3d/Scene', () => ({
  default: () => <div data-testid="3d-scene" />,
}));

// Mock Particle Background component
vi.mock('../particles/ParticleBackground', () => ({
  default: () => <div data-testid="particle-background" />,
}));

// Mock the theme context for testing
const renderWithTheme = (component: React.ReactElement, theme: 'light' | 'dark' = 'light') => {
  return render(
    <ThemeProvider>
      <div className={theme}>
        {component}
      </div>
    </ThemeProvider>
  );
};

// Generators for Hero component props
const heroPropsArbitrary = fc.record({
  name: fc.string({ minLength: 2, maxLength: 50 }).filter(s => s.trim().length >= 2),
  title: fc.string({ minLength: 5, maxLength: 100 }).filter(s => s.trim().length >= 5),
  tagline: fc.string({ minLength: 10, maxLength: 200 }).filter(s => s.trim().length >= 10),
  skills: fc.array(fc.string({ minLength: 2, maxLength: 30 }).filter(s => s.trim().length >= 2), { minLength: 1, maxLength: 10 }),
  ctaButtons: fc.array(
    fc.record({
      label: fc.string({ minLength: 3, maxLength: 30 }).filter(s => s.trim().length >= 3),
      href: fc.oneof(
        fc.constant('/projects'),
        fc.constant('/contact'),
        fc.constant('/about'),
        fc.constant('/blog')
      ),
      variant: fc.constantFrom('primary', 'secondary'),
    }),
    { minLength: 1, maxLength: 4 }
  ),
});

describe('Hero Component', () => {
  describe('Property-Based Tests', () => {
    it('**Feature: portfolio-website, Property 1: Hero section completeness** - For any hero section render, the DOM should contain name, title, tagline, and CTA button elements', () => {
      fc.assert(
        fc.property(
          heroPropsArbitrary,
          (props) => {
            // Clean up before each property test
            cleanup();
            
            const { container } = renderWithTheme(<Hero {...props} />);
            
            // Check for name element (h1)
            const nameElement = container.querySelector('h1');
            expect(nameElement).toBeTruthy();
            expect(nameElement?.textContent?.trim()).toBe(props.name.trim());
            
            // Check for title element (h2)
            const titleElement = container.querySelector('h2');
            expect(titleElement).toBeTruthy();
            expect(titleElement?.textContent?.trim()).toBe(props.title.trim());
            
            // Check for tagline element (typing animation)
            const taglineElement = container.querySelector('[data-testid="typing-animation"]');
            expect(taglineElement).toBeTruthy();
            
            // Check for CTA button elements
            const ctaButtons = container.querySelectorAll('a[href^="/"]');
            expect(ctaButtons.length).toBe(props.ctaButtons.length);
            
            // Verify each CTA button
            props.ctaButtons.forEach((button, index) => {
              const buttonElement = ctaButtons[index];
              expect(buttonElement?.textContent?.trim()).toBe(button.label.trim());
              expect(buttonElement?.getAttribute('href')).toBe(button.href);
            });
            
            // Clean up after test
            cleanup();
          }
        ),
        { numRuns: 5 }
      );
    });

    it('**Feature: portfolio-website, Property 2: Hero navigation links** - For any hero section render, the section should contain links to projects, about, and contact sections', () => {
      fc.assert(
        fc.property(
          heroPropsArbitrary,
          (props) => {
            // Clean up before each property test
            cleanup();
            
            const { container } = renderWithTheme(<Hero {...props} />);
            
            // Get all navigation links
            const links = container.querySelectorAll('a[href^="/"]');
            const linkHrefs = Array.from(links).map(link => link.getAttribute('href'));
            
            // Check that the hero contains navigation links from the CTA buttons
            props.ctaButtons.forEach(button => {
              expect(linkHrefs).toContain(button.href);
            });
            
            // Verify that links are properly structured
            links.forEach(link => {
              expect(link.getAttribute('href')).toMatch(/^\/[a-z]*$/);
              expect(link.textContent?.trim()).toBeTruthy();
            });
            
            // Clean up after test
            cleanup();
          }
        ),
        { numRuns: 5 }
      );
    });

    it('**Feature: portfolio-website, Property 3: Hero skill display** - For any hero section render with skill data, the rendered output should include visual elements highlighting those skills', () => {
      fc.assert(
        fc.property(
          heroPropsArbitrary,
          (props) => {
            // Clean up before each property test
            cleanup();
            
            const { container } = renderWithTheme(<Hero {...props} />);
            
            // Find skill elements - they should be in containers with specific styling
            const skillElements = container.querySelectorAll('[class*="bg-primary/10"]');
            
            // Should have the same number of skill elements as skills provided
            expect(skillElements.length).toBe(props.skills.length);
            
            // Each skill should be displayed
            props.skills.forEach(skill => {
              const skillElement = Array.from(skillElements).find(
                el => el.textContent?.trim() === skill.trim()
              );
              expect(skillElement).toBeTruthy();
              
              // Skill elements should have proper styling classes
              expect(skillElement?.classList.toString()).toMatch(/bg-primary\/10/);
              expect(skillElement?.classList.toString()).toMatch(/border-primary\/20/);
              expect(skillElement?.classList.toString()).toMatch(/text-primary/);
            });
            
            // Clean up after test
            cleanup();
          }
        ),
        { numRuns: 5 }
      );
    });

    it('should render 3D scene and particle background components', () => {
      fc.assert(
        fc.property(
          heroPropsArbitrary,
          (props) => {
            // Clean up before each property test
            cleanup();
            
            const { container } = renderWithTheme(<Hero {...props} />);
            
            // Check for 3D scene component
            const sceneElement = container.querySelector('[data-testid="3d-scene"]');
            expect(sceneElement).toBeTruthy();
            
            // Check for particle background component
            const particleElement = container.querySelector('[data-testid="particle-background"]');
            expect(particleElement).toBeTruthy();
            
            // Clean up after test
            cleanup();
          }
        ),
        { numRuns: 5 }
      );
    });

    it('should handle different CTA button variants correctly', () => {
      fc.assert(
        fc.property(
          heroPropsArbitrary,
          (props) => {
            // Clean up before each property test
            cleanup();
            
            const { container } = renderWithTheme(<Hero {...props} />);
            
            const ctaButtons = container.querySelectorAll('a[href^="/"]');
            
            props.ctaButtons.forEach((button, index) => {
              const buttonElement = ctaButtons[index];
              const classList = buttonElement?.classList.toString() || '';
              
              if (button.variant === 'primary') {
                expect(classList).toMatch(/bg-primary/);
                expect(classList).toMatch(/text-white/);
              } else if (button.variant === 'secondary') {
                expect(classList).toMatch(/bg-transparent/);
                expect(classList).toMatch(/border-primary/);
                expect(classList).toMatch(/text-primary/);
              }
            });
            
            // Clean up after test
            cleanup();
          }
        ),
        { numRuns: 5 }
      );
    });

    it('should have proper responsive classes and structure', () => {
      fc.assert(
        fc.property(
          heroPropsArbitrary,
          (props) => {
            // Clean up before each property test
            cleanup();
            
            const { container } = renderWithTheme(<Hero {...props} />);
            
            // Check for responsive section structure
            const section = container.querySelector('section');
            expect(section).toBeTruthy();
            expect(section?.classList.toString()).toMatch(/min-h-screen/);
            expect(section?.classList.toString()).toMatch(/flex/);
            expect(section?.classList.toString()).toMatch(/items-center/);
            expect(section?.classList.toString()).toMatch(/justify-center/);
            
            // Check for responsive text classes on name (h1)
            const nameElement = container.querySelector('h1');
            expect(nameElement?.classList.toString()).toMatch(/text-4xl|sm:text-5xl|md:text-6xl|lg:text-7xl/);
            
            // Check for responsive text classes on title (h2)
            const titleElement = container.querySelector('h2');
            expect(titleElement?.classList.toString()).toMatch(/text-xl|sm:text-2xl|md:text-3xl|lg:text-4xl/);
            
            // Clean up after test
            cleanup();
          }
        ),
        { numRuns: 5 }
      );
    });
  });

  describe('Unit Tests', () => {
    const defaultProps = {
      name: 'John Doe',
      title: 'Frontend Developer',
      tagline: 'Building amazing web experiences',
      skills: ['React', 'TypeScript', 'Next.js'],
      ctaButtons: [
        { label: 'View Projects', href: '/projects', variant: 'primary' as const },
        { label: 'Contact Me', href: '/contact', variant: 'secondary' as const },
      ],
    };

    it('should render hero section with all required elements', () => {
      const { container } = renderWithTheme(<Hero {...defaultProps} />);
      
      // Check basic structure
      const section = container.querySelector('section');
      expect(section).toBeTruthy();
      
      // Check name
      const nameElement = container.querySelector('h1');
      expect(nameElement?.textContent).toBe('John Doe');
      
      // Check title
      const titleElement = container.querySelector('h2');
      expect(titleElement?.textContent).toBe('Frontend Developer');
      
      // Check skills
      const skillElements = container.querySelectorAll('[class*="bg-primary/10"]');
      expect(skillElements.length).toBe(3);
      
      // Check CTA buttons
      const ctaButtons = container.querySelectorAll('a[href^="/"]');
      expect(ctaButtons.length).toBe(2);
    });

    it('should render with minimal props', () => {
      const minimalProps = {
        name: 'Test',
        title: 'Developer',
        tagline: 'Hello world',
        skills: ['JavaScript'],
        ctaButtons: [{ label: 'Click', href: '/test', variant: 'primary' as const }],
      };
      
      const { container } = renderWithTheme(<Hero {...minimalProps} />);
      
      const section = container.querySelector('section');
      expect(section).toBeTruthy();
      
      const nameElement = container.querySelector('h1');
      expect(nameElement?.textContent).toBe('Test');
    });

    it('should handle empty skills array', () => {
      const propsWithNoSkills = {
        ...defaultProps,
        skills: [],
      };
      
      const { container } = renderWithTheme(<Hero {...propsWithNoSkills} />);
      
      const skillElements = container.querySelectorAll('[class*="bg-primary/10"]');
      expect(skillElements.length).toBe(0);
    });

    it('should handle single CTA button', () => {
      const propsWithSingleButton = {
        ...defaultProps,
        ctaButtons: [{ label: 'Single Button', href: '/single', variant: 'primary' as const }],
      };
      
      const { container } = renderWithTheme(<Hero {...propsWithSingleButton} />);
      
      const ctaButtons = container.querySelectorAll('a[href^="/"]');
      expect(ctaButtons.length).toBe(1);
      expect(ctaButtons[0]?.textContent?.trim()).toBe('Single Button');
    });
  });
});
