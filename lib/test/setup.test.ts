import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  projectArbitrary,
  blogPostArbitrary,
  contactFormDataArbitrary,
  validContactFormDataArbitrary,
} from './generators';

describe('Test Infrastructure Setup', () => {
  it('should have vitest configured correctly', () => {
    expect(true).toBe(true);
  });

  it('should have fast-check working', () => {
    fc.assert(
      fc.property(fc.integer(), (n) => {
        return n === n;
      })
    );
  });

  describe('Generators', () => {
    it('should generate valid Project objects', () => {
      fc.assert(
        fc.property(projectArbitrary, (project) => {
          expect(project).toBeDefined();
          expect(project.id).toBeDefined();
          expect(project.title).toBeDefined();
          expect(project.technologies.length).toBeGreaterThan(0);
          return true;
        }),
        { numRuns: 10 }
      );
    });

    it('should generate valid BlogPost objects', () => {
      fc.assert(
        fc.property(blogPostArbitrary, (post) => {
          expect(post).toBeDefined();
          expect(post.slug).toBeDefined();
          expect(post.title).toBeDefined();
          expect(post.readingTime).toBeGreaterThan(0);
          return true;
        }),
        { numRuns: 10 }
      );
    });

    it('should generate valid ContactFormData objects', () => {
      fc.assert(
        fc.property(contactFormDataArbitrary, (formData) => {
          expect(formData).toBeDefined();
          expect(formData.name).toBeDefined();
          expect(formData.email).toBeDefined();
          expect(formData.message).toBeDefined();
          return true;
        }),
        { numRuns: 10 }
      );
    });

    it('should generate valid contact form data that passes validation', () => {
      fc.assert(
        fc.property(validContactFormDataArbitrary, (formData) => {
          expect(formData.name.trim().length).toBeGreaterThanOrEqual(2);
          expect(formData.email).toContain('@');
          expect(formData.message.trim().length).toBeGreaterThanOrEqual(10);
          return true;
        }),
        { numRuns: 10 }
      );
    });
  });
});
