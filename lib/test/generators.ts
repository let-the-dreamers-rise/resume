import * as fc from 'fast-check';

/**
 * Generator for Project model
 */
export const projectArbitrary = fc.record({
  id: fc.uuid(),
  slug: fc.stringMatching(/^[a-z0-9-]+$/),
  title: fc.string({ minLength: 5, maxLength: 100 }).filter(s => s.trim().length >= 5),
  description: fc.string({ minLength: 20, maxLength: 300 }).filter(s => s.trim().length >= 20),
  longDescription: fc.string({ minLength: 100, maxLength: 2000 }).filter(s => s.trim().length >= 100),
  technologies: fc.array(
    fc.record({
      name: fc.string({ minLength: 2, maxLength: 30 }).filter(s => s.trim().length >= 2),
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
  highlights: fc.array(fc.string({ minLength: 10, maxLength: 200 }).filter(s => s.trim().length >= 10), { minLength: 1, maxLength: 5 }),
  challenges: fc.array(fc.string({ minLength: 10, maxLength: 200 }).filter(s => s.trim().length >= 10), { minLength: 1, maxLength: 5 }),
  outcomes: fc.array(fc.string({ minLength: 10, maxLength: 200 }).filter(s => s.trim().length >= 10), { minLength: 1, maxLength: 5 }),
});

/**
 * Generator for BlogPost model
 */
export const blogPostArbitrary = fc.record({
  slug: fc.stringMatching(/^[a-z0-9-]+$/),
  title: fc.string({ minLength: 10, maxLength: 150 }),
  excerpt: fc.string({ minLength: 50, maxLength: 300 }),
  content: fc.string({ minLength: 500, maxLength: 10000 }),
  rawContent: fc.string({ minLength: 500, maxLength: 10000 }),
  publishedAt: fc.date({ min: new Date('2020-01-01'), max: new Date() }),
  updatedAt: fc.option(fc.date({ min: new Date('2020-01-01'), max: new Date() }), { nil: undefined }),
  readingTime: fc.integer({ min: 1, max: 60 }),
  tags: fc.array(fc.string({ minLength: 2, maxLength: 20 }), { minLength: 1, maxLength: 10 }),
  category: fc.string({ minLength: 3, maxLength: 30 }),
  author: fc.record({
    name: fc.string({ minLength: 2, maxLength: 50 }),
    avatar: fc.webUrl(),
    bio: fc.string({ minLength: 20, maxLength: 200 }),
    social: fc.record({
      github: fc.option(fc.webUrl(), { nil: undefined }),
      linkedin: fc.option(fc.webUrl(), { nil: undefined }),
      twitter: fc.option(fc.webUrl(), { nil: undefined }),
    }),
  }),
  coverImage: fc.option(fc.webUrl(), { nil: undefined }),
  featured: fc.boolean(),
});

/**
 * Generator for ContactFormData model
 */
export const contactFormDataArbitrary = fc.record({
  name: fc.string({ minLength: 2, maxLength: 100 }),
  email: fc.emailAddress(),
  message: fc.string({ minLength: 10, maxLength: 1000 }),
});

/**
 * Generator for valid contact form data (passes validation)
 */
export const validContactFormDataArbitrary = fc.record({
  name: fc.string({ minLength: 2, maxLength: 100 }).filter(s => s.trim().length >= 2),
  email: fc.emailAddress(),
  message: fc.string({ minLength: 10, maxLength: 1000 }).filter(s => s.trim().length >= 10),
});

/**
 * Generator for invalid contact form data (fails validation)
 */
export const invalidContactFormDataArbitrary = fc.oneof(
  // Empty name
  fc.record({
    name: fc.constant(''),
    email: fc.emailAddress(),
    message: fc.string({ minLength: 10, maxLength: 1000 }),
  }),
  // Invalid email
  fc.record({
    name: fc.string({ minLength: 2, maxLength: 100 }),
    email: fc.string({ minLength: 1, maxLength: 50 }).filter(s => !s.includes('@')),
    message: fc.string({ minLength: 10, maxLength: 1000 }),
  }),
  // Empty message
  fc.record({
    name: fc.string({ minLength: 2, maxLength: 100 }),
    email: fc.emailAddress(),
    message: fc.constant(''),
  })
);

/**
 * Generator for Skill model
 */
export const skillArbitrary = fc.record({
  name: fc.string({ minLength: 2, maxLength: 50 }),
  category: fc.constantFrom('Frontend', 'Backend', 'ML/AI', 'Tools', 'Other'),
  proficiency: fc.integer({ min: 1, max: 5 }),
  yearsOfExperience: fc.integer({ min: 0, max: 20 }),
});

/**
 * Generator for viewport dimensions
 */
export const viewportArbitrary = fc.record({
  width: fc.integer({ min: 320, max: 2560 }),
  height: fc.integer({ min: 568, max: 1440 }),
});

/**
 * Generator for mobile viewport dimensions
 */
export const mobileViewportArbitrary = fc.record({
  width: fc.integer({ min: 320, max: 767 }),
  height: fc.integer({ min: 568, max: 1024 }),
});

/**
 * Generator for desktop viewport dimensions
 */
export const desktopViewportArbitrary = fc.record({
  width: fc.integer({ min: 1024, max: 2560 }),
  height: fc.integer({ min: 768, max: 1440 }),
});

/**
 * Generator for theme preference
 */
export const themeArbitrary = fc.constantFrom('light', 'dark');

/**
 * Generator for non-empty whitespace strings
 */
export const whitespaceStringArbitrary = fc
  .array(fc.constantFrom(' ', '\t', '\n', '\r'), { minLength: 1, maxLength: 20 })
  .map(arr => arr.join(''));
