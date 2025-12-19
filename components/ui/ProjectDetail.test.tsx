import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import { ProjectDetail } from './ProjectDetail';
import { projectArbitrary } from '@/lib/test/generators';

describe('ProjectDetail Component', () => {
  describe('Property 5: Project detail completeness', () => {
    /**
     * Feature: portfolio-website, Property 5: Project detail completeness
     * For any project detail view, the rendered output should include problem statement, solution, and outcomes sections
     * Validates: Requirements 2.4
     */
    it('should display complete project details including highlights, challenges, and outcomes', () => {
      fc.assert(
        fc.property(projectArbitrary, (project) => {
          // Ensure project has the required sections for completeness
          const projectWithSections = {
            ...project,
            highlights: project.highlights.length > 0 ? project.highlights : ['Test highlight'],
            challenges: project.challenges.length > 0 ? project.challenges : ['Test challenge'],
            outcomes: project.outcomes.length > 0 ? project.outcomes : ['Test outcome'],
          };

          const { container } = render(<ProjectDetail project={projectWithSections} />);

          // Check for project title
          const heading = container.querySelector('h1');
          expect(heading).toBeInTheDocument();
          expect(heading).toHaveTextContent(project.title.trim());

          // Check for long description (problem statement/solution)
          expect(screen.getByText(project.longDescription)).toBeInTheDocument();

          // Check for highlights section (solution aspects)
          expect(screen.getByText('Key Highlights')).toBeInTheDocument();
          projectWithSections.highlights.forEach(highlight => {
            expect(screen.getByText(highlight)).toBeInTheDocument();
          });

          // Check for challenges section (problem statement aspects)
          expect(screen.getByText('Challenges & Solutions')).toBeInTheDocument();
          projectWithSections.challenges.forEach(challenge => {
            expect(screen.getByText(challenge)).toBeInTheDocument();
          });

          // Check for outcomes section (results/impact)
          expect(screen.getByText('Results & Impact')).toBeInTheDocument();
          projectWithSections.outcomes.forEach(outcome => {
            expect(screen.getByText(outcome)).toBeInTheDocument();
          });

          // Check for technologies section
          expect(screen.getByText('Technologies Used')).toBeInTheDocument();
          project.technologies.forEach(tech => {
            expect(screen.getByText(tech.name)).toBeInTheDocument();
          });

          // Verify the completeness by checking all major sections are present
          const sectionsPresent = [
            container.querySelector('h1'), // Title
            screen.queryByText('Key Highlights'),
            screen.queryByText('Challenges & Solutions'),
            screen.queryByText('Results & Impact'),
            screen.queryByText('Technologies Used'),
          ];

          // All sections should be present for a complete project detail view
          sectionsPresent.forEach(section => {
            expect(section).toBeInTheDocument();
          });
        }),
        { numRuns: 5 }
      );
    });
  });

  describe('Property 6: Project links presence', () => {
    /**
     * Feature: portfolio-website, Property 6: Project links presence
     * For any project with demoUrl or githubUrl defined, the detail view should render those as clickable links
     * Validates: Requirements 2.5
     */
    it('should display clickable links when demoUrl or githubUrl are provided', () => {
      fc.assert(
        fc.property(
          projectArbitrary.filter(p => p.demoUrl !== undefined || p.githubUrl !== undefined),
          (project) => {
            render(<ProjectDetail project={project} />);

            // Check for demo link if demoUrl is provided
            if (project.demoUrl) {
              const demoLinks = screen.getAllByRole('link', { name: /live demo/i });
              expect(demoLinks.length).toBeGreaterThan(0);
              expect(demoLinks[0]).toHaveAttribute('href', project.demoUrl);
              expect(demoLink).toHaveAttribute('target', '_blank');
              expect(demoLink).toHaveAttribute('rel', 'noopener noreferrer');
            }

            // Check for GitHub link if githubUrl is provided
            if (project.githubUrl) {
              const githubLinks = screen.getAllByRole('link', { name: /view code/i });
              expect(githubLinks.length).toBeGreaterThan(0);
              const githubLink = githubLinks[0];
              expect(githubLink).toHaveAttribute('href', project.githubUrl);
              expect(githubLink).toHaveAttribute('target', '_blank');
              expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
            }

            // Verify that at least one link is present (since we filtered for projects with links)
            const links = screen.getAllByRole('link').filter(link => 
              link.getAttribute('href') === project.demoUrl || 
              link.getAttribute('href') === project.githubUrl
            );
            expect(links.length).toBeGreaterThan(0);
          }
        ),
        { numRuns: 5 }
      );
    });

    it('should not display demo or code links when URLs are not provided', () => {
      fc.assert(
        fc.property(
          projectArbitrary.filter(p => p.demoUrl === undefined && p.githubUrl === undefined),
          (project) => {
            render(<ProjectDetail project={project} />);

            // Should not have demo link
            expect(screen.queryByRole('link', { name: /live demo/i })).not.toBeInTheDocument();

            // Should not have GitHub link
            expect(screen.queryByRole('link', { name: /view code/i })).not.toBeInTheDocument();
          }
        ),
        { numRuns: 5 }
      );
    });
  });

  describe('Additional Project Detail Properties', () => {
    it('should display project metadata correctly', () => {
      fc.assert(
        fc.property(projectArbitrary, (project) => {
          render(<ProjectDetail project={project} />);

          // Check category display
          const categoryElements = screen.getAllByText(project.category);
          expect(categoryElements.length).toBeGreaterThan(0);

          // Check timeline display
          const startDateText = project.startDate.toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
          });
          const dateElements = screen.getAllByText(new RegExp(startDateText));
          expect(dateElements.length).toBeGreaterThan(0);

          // Check featured badge if applicable
          if (project.featured) {
            expect(screen.getByText('Featured Project')).toBeInTheDocument();
          }
        }),
        { numRuns: 5 }
      );
    });

    it('should display image gallery when images are provided', () => {
      fc.assert(
        fc.property(
          projectArbitrary.filter(p => p.images.length > 0),
          (project) => {
            render(<ProjectDetail project={project} />);

            // Should display gallery section
            const galleryElements = screen.getAllByText('Project Gallery');
            expect(galleryElements.length).toBeGreaterThan(0);

            // Should have main image
            const images = screen.getAllByRole('img');
            expect(images.length).toBeGreaterThan(0);

            // If multiple images, should have thumbnails
            if (project.images.length > 1) {
              // Should have thumbnail navigation buttons
              const thumbnailButtons = screen.getAllByRole('button');
              const imageThumbnails = thumbnailButtons.filter(button => 
                button.querySelector('img') !== null
              );
              expect(imageThumbnails.length).toBeGreaterThanOrEqual(1);
            }
          }
        ),
        { numRuns: 5 }
      );
    });

    it('should handle projects with empty sections gracefully', () => {
      fc.assert(
        fc.property(projectArbitrary, (project) => {
          // Create project with potentially empty sections
          const projectWithEmptySections = {
            ...project,
            highlights: [],
            challenges: [],
            outcomes: [],
          };

          render(<ProjectDetail project={projectWithEmptySections} />);

          // Should still render basic project information
          const headings = screen.getAllByRole('heading', { level: 1 });
          expect(headings.length).toBeGreaterThan(0);
          expect(headings[0]).toHaveTextContent(project.title.trim());
          expect(screen.getByText(project.longDescription)).toBeInTheDocument();
          expect(screen.getByText('Technologies Used')).toBeInTheDocument();

          // Empty sections should not be displayed
          expect(screen.queryByText('Key Highlights')).not.toBeInTheDocument();
          expect(screen.queryByText('Challenges & Solutions')).not.toBeInTheDocument();
          expect(screen.queryByText('Results & Impact')).not.toBeInTheDocument();
        }),
        { numRuns: 5 }
      );
    });
  });
});
