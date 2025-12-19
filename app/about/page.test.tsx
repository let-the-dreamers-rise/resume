/**
 * Property-based tests for About page
 * Feature: portfolio-website, Property 12-15: About page functionality
 * Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import AboutPage from './page';

// Mock ParticleBackground to avoid complex dependencies
vi.mock('@/components/particles/ParticleBackground', () => ({
  default: () => <div data-testid="particle-background">Particle Background</div>
}));

// Mock GitHubRepos component
vi.mock('@/components/ui/GitHubRepos', () => ({
  GitHubRepos: ({ username, maxRepos }: { username: string; maxRepos: number }) => (
    <div data-testid="github-repos">
      <div data-testid="github-username">{username}</div>
      <div data-testid="github-max-repos">{maxRepos}</div>
    </div>
  )
}));

describe('About Page Property Tests', () => {
  /**
   * Property 12: Bio length validation
   * The bio should be between 150-300 words for optimal readability
   * Validates: Requirements 4.1
   */
  it('Property 12: Bio length validation - should have bio within 150-300 word range', () => {
    const { unmount } = render(<AboutPage />);
    
    try {
      // Find the bio section
      const bioSection = screen.getByText(/My Story/i).closest('section');
      expect(bioSection).toBeInTheDocument();
      
      // Get the bio text content
      const bioText = bioSection?.textContent || '';
      
      // Extract just the bio paragraphs (exclude heading and other elements)
      const bioContent = bioText.replace(/My Story/g, '').trim();
      
      // Count words (split by whitespace and filter out empty strings)
      const wordCount = bioContent.split(/\s+/).filter(word => word.length > 0).length;
      
      // Bio should be between 150-300 words
      expect(wordCount).toBeGreaterThanOrEqual(150);
      expect(wordCount).toBeLessThanOrEqual(300);
    } finally {
      unmount();
    }
  });

  /**
   * Property 13: Skills categorization
   * Skills should be properly categorized into logical groups
   * Validates: Requirements 4.2
   */
  it('Property 13: Skills categorization - should have properly categorized skills', () => {
    const { unmount } = render(<AboutPage />);
    
    try {
      // Check for Technical Skills section
      const skillsSection = screen.getByText(/Technical Skills/i);
      expect(skillsSection).toBeInTheDocument();
      
      // Expected skill categories
      const expectedCategories = [
        'Frontend Development',
        'Backend Development', 
        'AI/ML',
        'Tools & Platforms'
      ];
      
      // Verify each category exists
      expectedCategories.forEach(category => {
        const categoryElement = screen.getByText(category);
        expect(categoryElement).toBeInTheDocument();
      });
      
      // Verify we have at least 4 skill categories
      const categoryElements = expectedCategories.map(cat => screen.getByText(cat));
      expect(categoryElements.length).toBeGreaterThanOrEqual(4);
    } finally {
      unmount();
    }
  });

  /**
   * Property 14: Skill proficiency indicators
   * Each skill should have visual proficiency indicators (progress bars)
   * Validates: Requirements 4.3
   */
  it('Property 14: Skill proficiency indicators - should display proficiency bars for skills', () => {
    const { unmount } = render(<AboutPage />);
    
    try {
      // Check for skills with proficiency percentages
      const proficiencyElements = screen.getAllByText(/%$/);
      expect(proficiencyElements.length).toBeGreaterThan(0);
      
      // Check for progress bars (elements with specific width styles)
      const progressBars = document.querySelectorAll('[style*="width:"]');
      expect(progressBars.length).toBeGreaterThan(0);
      
      // Verify proficiency values are reasonable (0-100%)
      proficiencyElements.forEach(element => {
        const percentText = element.textContent || '';
        const percentValue = parseInt(percentText.replace('%', ''));
        expect(percentValue).toBeGreaterThanOrEqual(0);
        expect(percentValue).toBeLessThanOrEqual(100);
      });
    } finally {
      unmount();
    }
  });

  /**
   * Property 15: About section completeness
   * About page should contain all required sections
   * Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5
   */
  it('Property 15: About section completeness - should contain all required sections', () => {
    const { unmount } = render(<AboutPage />);
    
    try {
      // Required sections that should be present
      const requiredSections = [
        'About Me', // Hero section
        'My Story', // Bio section
        'Technical Skills', // Skills section
        'Education', // Education section
        'Certifications', // Certifications section
        'Career Goals & Focus', // Career goals section
        "Let's Connect" // Social links section
      ];
      
      // Verify each required section exists
      requiredSections.forEach(sectionTitle => {
        const sectionElement = screen.getByText(sectionTitle);
        expect(sectionElement).toBeInTheDocument();
      });
      
      // Verify ParticleBackground is integrated
      const particleBackground = screen.getByTestId('particle-background');
      expect(particleBackground).toBeInTheDocument();
      
      // Verify GitHub integration is present
      const githubRepos = screen.getByTestId('github-repos');
      expect(githubRepos).toBeInTheDocument();
      
      // Verify social links are present
      const githubLink = screen.getByText('GitHub');
      const linkedinLink = screen.getByText('LinkedIn');
      const twitterLink = screen.getByText('Twitter');
      
      expect(githubLink).toBeInTheDocument();
      expect(linkedinLink).toBeInTheDocument();
      expect(twitterLink).toBeInTheDocument();
    } finally {
      unmount();
    }
  });

  // Additional property tests for robustness
  it('should have proper education information structure', () => {
    const { unmount } = render(<AboutPage />);
    
    try {
      // Check for education section
      const educationSection = screen.getByText(/Education/i);
      expect(educationSection).toBeInTheDocument();
      
      // Should have degree information
      const degreeElements = screen.getAllByText(/Master of Science|Bachelor of Science/);
      expect(degreeElements.length).toBeGreaterThan(0);
      
      // Should have institution information
      const institutionElements = screen.getAllByText(/Stanford University|UC Berkeley/);
      expect(institutionElements.length).toBeGreaterThan(0);
    } finally {
      unmount();
    }
  });

  it('should have certifications displayed', () => {
    const { unmount } = render(<AboutPage />);
    
    try {
      // Check for certifications section
      const certificationsSection = screen.getByText(/Certifications/i);
      expect(certificationsSection).toBeInTheDocument();
      
      // Should have at least one certification
      const awsCert = screen.getByText(/AWS Certified/);
      expect(awsCert).toBeInTheDocument();
    } finally {
      unmount();
    }
  });

  it('should have career goals listed', () => {
    const { unmount } = render(<AboutPage />);
    
    try {
      // Check for career goals section
      const careerGoalsSection = screen.getByText(/Career Goals & Focus/i);
      expect(careerGoalsSection).toBeInTheDocument();
      
      // Should have numbered goals (look for numbered indicators)
      const numberedGoals = document.querySelectorAll('[class*="bg-primary"][class*="rounded-full"]');
      expect(numberedGoals.length).toBeGreaterThan(0);
    } finally {
      unmount();
    }
  });

  it('should have contact information', () => {
    const { unmount } = render(<AboutPage />);
    
    try {
      // Should have location information
      const locationElement = screen.getByText(/San Francisco, CA/);
      expect(locationElement).toBeInTheDocument();
      
      // Should have email link
      const emailLink = screen.getByText(/alex@example.com/);
      expect(emailLink).toBeInTheDocument();
    } finally {
      unmount();
    }
  });
});