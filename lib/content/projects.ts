import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { Project, ProjectFrontmatter, ProjectFrontmatterSchema, CodeDemoConfig } from './types';

const PROJECTS_DIRECTORY = path.join(process.cwd(), 'content/projects');

/**
 * Get all project files from the content/projects directory
 */
function getProjectFiles(): string[] {
  if (!fs.existsSync(PROJECTS_DIRECTORY)) {
    return [];
  }
  
  return fs.readdirSync(PROJECTS_DIRECTORY)
    .filter(file => file.endsWith('.mdx'));
}

/**
 * Parse and validate project frontmatter
 */
function parseProjectFrontmatter(frontmatter: any, slug: string): ProjectFrontmatter {
  try {
    return ProjectFrontmatterSchema.parse(frontmatter);
  } catch (error) {
    console.error(`Error parsing frontmatter for project ${slug}:`, error);
    throw new Error(`Invalid frontmatter in project ${slug}`);
  }
}

/**
 * Convert frontmatter to full Project object
 */
function frontmatterToProject(frontmatter: ProjectFrontmatter, slug: string, _content: string): Project {
  return {
    id: slug,
    slug,
    title: frontmatter.title,
    description: frontmatter.description,
    longDescription: frontmatter.longDescription,
    technologies: frontmatter.technologies,
    category: frontmatter.category,
    image: frontmatter.image,
    images: frontmatter.images,
    demoUrl: frontmatter.demoUrl,
    githubUrl: frontmatter.githubUrl,
    featured: frontmatter.featured,
    startDate: frontmatter.startDate,
    endDate: frontmatter.endDate,
    codeDemo: frontmatter.codeDemo as CodeDemoConfig | undefined,
    highlights: frontmatter.highlights,
    challenges: frontmatter.challenges,
    outcomes: frontmatter.outcomes,
  };
}

/**
 * Get all projects with their metadata
 */
export async function getProjects(): Promise<Project[]> {
  const files = getProjectFiles();
  const projects: Project[] = [];

  for (const file of files) {
    const slug = file.replace(/\.mdx$/, '');
    const filePath = path.join(PROJECTS_DIRECTORY, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    const { data: frontmatter, content } = matter(fileContent);
    
    try {
      const validatedFrontmatter = parseProjectFrontmatter(frontmatter, slug);
      const project = frontmatterToProject(validatedFrontmatter, slug, content);
      projects.push(project);
    } catch (error) {
      console.error(`Skipping project ${slug} due to validation error:`, error);
      continue;
    }
  }

  // Sort projects by start date (newest first)
  return projects.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
}

/**
 * Get a specific project by slug with MDX content
 */
export async function getProjectBySlug(slug: string): Promise<{
  project: Project;
  mdxSource: MDXRemoteSerializeResult;
} | null> {
  const filePath = path.join(PROJECTS_DIRECTORY, `${slug}.mdx`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data: frontmatter, content } = matter(fileContent);

  try {
    const validatedFrontmatter = parseProjectFrontmatter(frontmatter, slug);
    const project = frontmatterToProject(validatedFrontmatter, slug, content);
    
    // Serialize MDX content
    const mdxSource = await serialize(content, {
      mdxOptions: {
        remarkPlugins: [],
        rehypePlugins: [],
      },
    });

    return {
      project,
      mdxSource,
    };
  } catch (error) {
    console.error(`Error loading project ${slug}:`, error);
    return null;
  }
}

/**
 * Get featured projects only
 */
export async function getFeaturedProjects(): Promise<Project[]> {
  const allProjects = await getProjects();
  return allProjects.filter(project => project.featured);
}

/**
 * Get projects by category
 */
export async function getProjectsByCategory(category: string): Promise<Project[]> {
  const allProjects = await getProjects();
  return allProjects.filter(project => project.category === category);
}

/**
 * Get all unique technologies used across projects
 */
export async function getAllTechnologies(): Promise<string[]> {
  const allProjects = await getProjects();
  const technologies = new Set<string>();
  
  allProjects.forEach(project => {
    project.technologies.forEach(tech => {
      technologies.add(tech.name);
    });
  });
  
  return Array.from(technologies).sort();
}

/**
 * Search projects by title, description, or technologies
 */
export async function searchProjects(query: string): Promise<Project[]> {
  const allProjects = await getProjects();
  const lowercaseQuery = query.toLowerCase();
  
  return allProjects.filter(project => {
    const titleMatch = project.title.toLowerCase().includes(lowercaseQuery);
    const descriptionMatch = project.description.toLowerCase().includes(lowercaseQuery);
    const techMatch = project.technologies.some(tech => 
      tech.name.toLowerCase().includes(lowercaseQuery)
    );
    
    return titleMatch || descriptionMatch || techMatch;
  });
}