import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost } from './types';

const BLOG_DIRECTORY = path.join(process.cwd(), 'content/blog');

/**
 * Get all blog posts with metadata
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    // Ensure blog directory exists
    if (!fs.existsSync(BLOG_DIRECTORY)) {
      return [];
    }

    const files = fs.readdirSync(BLOG_DIRECTORY);
    const mdxFiles = files.filter(file => file.endsWith('.mdx'));

    const posts = await Promise.all(
      mdxFiles.map(async (filename) => {
        const slug = filename.replace(/\.mdx$/, '');
        const post = await getBlogPostBySlug(slug);
        return post;
      })
    );

    // Filter out null posts and sort by date (newest first)
    return posts
      .filter((post): post is BlogPost => post !== null)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }
}

/**
 * Get a single blog post by slug
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const filePath = path.join(BLOG_DIRECTORY, `${slug}.mdx`);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    // Validate required frontmatter fields
    if (!data.title || !data.date || !data.excerpt) {
      console.warn(`Blog post ${slug} is missing required frontmatter fields`);
      return null;
    }

    // Calculate reading time (average 200 words per minute)
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    return {
      slug,
      title: data.title,
      date: data.date,
      excerpt: data.excerpt,
      content,
      tags: data.tags || [],
      readingTime,
      author: data.author || 'Alex Chen',
      published: data.published !== false, // Default to true unless explicitly false
    };
  } catch (error) {
    console.error(`Error loading blog post ${slug}:`, error);
    return null;
  }
}

/**
 * Get blog posts filtered by tag
 */
export async function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  const allPosts = await getBlogPosts();
  return allPosts.filter(post => 
    post.tags.some(postTag => 
      postTag.toLowerCase() === tag.toLowerCase()
    )
  );
}

/**
 * Get all unique tags from blog posts
 */
export async function getBlogTags(): Promise<string[]> {
  const allPosts = await getBlogPosts();
  const tagSet = new Set<string>();
  
  allPosts.forEach(post => {
    post.tags.forEach(tag => tagSet.add(tag));
  });
  
  return Array.from(tagSet).sort();
}

/**
 * Search blog posts by title, excerpt, or content
 */
export async function searchBlogPosts(query: string): Promise<BlogPost[]> {
  const allPosts = await getBlogPosts();
  const searchTerm = query.toLowerCase();
  
  return allPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm) ||
    post.excerpt.toLowerCase().includes(searchTerm) ||
    post.content.toLowerCase().includes(searchTerm) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
}