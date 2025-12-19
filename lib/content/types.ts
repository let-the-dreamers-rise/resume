import { z } from 'zod';

// Project category enum
export type ProjectCategory = 'frontend' | 'ml' | 'ai' | 'fullstack' | 'other';

// Technology interface
export interface Technology {
  name: string;
  icon?: string;
  category: 'language' | 'framework' | 'tool' | 'platform';
}

// Code demo configuration
export interface CodeDemoConfig {
  files: Record<string, string>;
  entry: string;
  template: 'react' | 'vanilla' | 'node';
}

// Main Project interface
export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: Technology[];
  category: ProjectCategory;
  image: string;
  images: string[];
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  startDate: Date;
  endDate?: Date;
  codeDemo?: CodeDemoConfig;
  highlights: string[];
  challenges: string[];
  outcomes: string[];
}

// Zod validation schemas
export const TechnologySchema = z.object({
  name: z.string().min(1),
  icon: z.string().optional(),
  category: z.enum(['language', 'framework', 'tool', 'platform']),
});

export const CodeDemoConfigSchema = z.object({
  files: z.record(z.string(), z.string()),
  entry: z.string(),
  template: z.enum(['react', 'vanilla', 'node']),
});

export const ProjectFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  longDescription: z.string().min(1),
  technologies: z.array(TechnologySchema),
  category: z.enum(['frontend', 'ml', 'ai', 'fullstack', 'other']),
  image: z.string().min(1),
  images: z.array(z.string()).default([]),
  demoUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  featured: z.boolean().default(false),
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z.string().transform((str) => new Date(str)).optional(),
  codeDemo: CodeDemoConfigSchema.optional(),
  highlights: z.array(z.string()).default([]),
  challenges: z.array(z.string()).default([]),
  outcomes: z.array(z.string()).default([]),
});

export type ProjectFrontmatter = z.infer<typeof ProjectFrontmatterSchema>;

// Blog post interface
export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content?: string;
  tags: string[];
  readingTime: number;
  author: string;
  published?: boolean;
  featured?: boolean;
}

// Zod validation schema for blog post frontmatter
export const BlogPostFrontmatterSchema = z.object({
  title: z.string().min(1),
  date: z.string(),
  excerpt: z.string().min(1),
  tags: z.array(z.string()).default([]),
  author: z.string().default('Ashwin Goyal'),
  published: z.boolean().default(true),
});

export type BlogPostFrontmatter = z.infer<typeof BlogPostFrontmatterSchema>;