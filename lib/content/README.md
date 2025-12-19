# Project Content Management System

This directory contains the content management system for portfolio projects.

## Files

- `types.ts` - TypeScript interfaces and Zod validation schemas
- `projects.ts` - Functions for loading and managing project data
- `index.ts` - Main exports

## Usage

```typescript
import { getProjects, getProjectBySlug, getFeaturedProjects } from '@/lib/content';

// Get all projects
const allProjects = await getProjects();

// Get a specific project with MDX content
const projectData = await getProjectBySlug('ai-portfolio-chatbot');
if (projectData) {
  const { project, mdxSource } = projectData;
  // Use project metadata and render mdxSource with next-mdx-remote
}

// Get only featured projects
const featured = await getFeaturedProjects();

// Search projects
const searchResults = await searchProjects('AI');
```

## Project Structure

Projects are stored as MDX files in `content/projects/` with frontmatter containing:

- Basic info: title, description, longDescription
- Technical details: technologies, category, dates
- Links: demoUrl, githubUrl
- Content: highlights, challenges, outcomes
- Optional: codeDemo configuration

## Validation

All project frontmatter is validated using Zod schemas to ensure data consistency and type safety.