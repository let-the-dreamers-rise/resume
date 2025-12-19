/**
 * Simplified tests for ProjectDetail component
 * These tests use fixed data instead of property-based testing for reliability
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectDetail } from './ProjectDetail';

const mockProject = {
  id: '1',
  slug: 'test-project',
  title: 'Test Project',
  description: 'A test project for validation',
  longDescription: 'This is a detailed description of the test project that explains what it does and how it works.',
  technologies: [
    { name: 'React', category: 'framework' as const },
    { name: 'TypeScript', category: 'language' as const },
  ],
  category: 'frontend' as const,
  image: 'https://example.com/image.jpg',
  images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
  demoUrl: 'https://example.com/demo',
  githubUrl: 'https://github.com/user/repo',
  featured: true,
  startDate: new Date('2023-01-01'),
  endDate: new Date('2023-12-31'),
  highlights: ['Key feature 1', 'Key feature 2'],
  challenges: ['Challenge 1', 'Challenge 2'],
  outcomes: ['Outcome 1', 'Outcome 2'],
};

describe('ProjectDetail Component - Simple Tests', () => {
  it('should render project title and description', () => {
    render(<ProjectDetail project={mockProject} />);
    
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test Project');
    expect(screen.getByText(mockProject.longDescription)).toBeInTheDocument();
  });

  it('should render technologies', () => {
    render(<ProjectDetail project={mockProject} />);
    
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('should render demo and GitHub links when provided', () => {
    render(<ProjectDetail project={mockProject} />);
    
    const demoLink = screen.getByRole('link', { name: /live demo/i });
    expect(demoLink).toHaveAttribute('href', mockProject.demoUrl);
    
    const githubLinks = screen.getAllByRole('link', { name: /view code/i });
    expect(githubLinks[0]).toHaveAttribute('href', mockProject.githubUrl);
  });

  it('should render project metadata', () => {
    render(<ProjectDetail project={mockProject} />);
    
    expect(screen.getByText('frontend')).toBeInTheDocument();
    expect(screen.getByText(/January 2023/)).toBeInTheDocument();
  });

  it('should render featured badge when project is featured', () => {
    render(<ProjectDetail project={mockProject} />);
    
    expect(screen.getByText('Featured Project')).toBeInTheDocument();
  });

  it('should not render demo link when not provided', () => {
    const projectWithoutDemo = { ...mockProject, demoUrl: undefined };
    render(<ProjectDetail project={projectWithoutDemo} />);
    
    expect(screen.queryByRole('link', { name: /live demo/i })).not.toBeInTheDocument();
  });

  it('should not render GitHub link when not provided', () => {
    const projectWithoutGithub = { ...mockProject, githubUrl: undefined };
    render(<ProjectDetail project={projectWithoutGithub} />);
    
    expect(screen.queryByRole('link', { name: /view code/i })).not.toBeInTheDocument();
  });

  it('should not render featured badge when project is not featured', () => {
    const nonFeaturedProject = { ...mockProject, featured: false };
    render(<ProjectDetail project={nonFeaturedProject} />);
    
    expect(screen.queryByText('Featured Project')).not.toBeInTheDocument();
  });
});