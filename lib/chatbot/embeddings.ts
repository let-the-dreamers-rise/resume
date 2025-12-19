import { openai } from '@ai-sdk/openai';
import { embed } from 'ai';

export interface EmbeddedContent {
  id: string;
  type: 'project' | 'skill' | 'experience' | 'education' | 'general';
  content: string;
  embedding: number[];
  metadata: Record<string, any>;
}

/**
 * Generate embedding for a single text
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const { embedding } = await embed({
      model: openai.embedding('text-embedding-ada-002'),
      value: text,
    });
    
    return embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error('Failed to generate embedding');
  }
}

/**
 * Generate embeddings for portfolio content
 */
export async function generatePortfolioEmbeddings(): Promise<EmbeddedContent[]> {
  const embeddings: EmbeddedContent[] = [];

  try {
    // Import content functions
    const { getProjects } = await import('../content/projects');
    const { getBlogPosts } = await import('../content/blog');

    // Generate project embeddings
    const projects = await getProjects();
    for (const project of projects) {
      const content = `
        Project: ${project.title}
        Description: ${project.description}
        Long Description: ${project.longDescription}
        Technologies: ${project.technologies.map(t => t.name).join(', ')}
        Category: ${project.category}
        Highlights: ${project.highlights.join('. ')}
        Challenges: ${project.challenges.join('. ')}
        Outcomes: ${project.outcomes.join('. ')}
      `.trim();

      const embedding = await generateEmbedding(content);
      
      embeddings.push({
        id: `project-${project.id}`,
        type: 'project',
        content,
        embedding,
        metadata: {
          title: project.title,
          slug: project.slug,
          category: project.category,
          technologies: project.technologies,
          demoUrl: project.demoUrl,
          githubUrl: project.githubUrl,
        },
      });
    }

    // Generate blog post embeddings
    const blogPosts = await getBlogPosts();
    for (const post of blogPosts) {
      const content = `
        Blog Post: ${post.title}
        Excerpt: ${post.excerpt}
        Tags: ${post.tags.join(', ')}
        Content Preview: ${post.content.substring(0, 500)}...
      `.trim();

      const embedding = await generateEmbedding(content);
      
      embeddings.push({
        id: `blog-${post.slug}`,
        type: 'general',
        content,
        embedding,
        metadata: {
          title: post.title,
          slug: post.slug,
          tags: post.tags,
          readingTime: post.readingTime,
        },
      });
    }

    // Generate skills embeddings
    const skills = [
      {
        category: 'Frontend Development',
        skills: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS', 'Framer Motion'],
        description: 'Expert in modern frontend technologies with focus on React ecosystem and performance optimization'
      },
      {
        category: 'Machine Learning & AI',
        skills: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'OpenAI API', 'Hugging Face', 'Computer Vision', 'NLP'],
        description: 'Experienced in building ML models, AI applications, and integrating LLMs into web applications'
      },
      {
        category: 'Backend & DevOps',
        skills: ['Node.js', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS', 'Vercel', 'Git', 'CI/CD'],
        description: 'Proficient in full-stack development with cloud deployment and DevOps practices'
      }
    ];

    for (const skillGroup of skills) {
      const content = `
        Skill Category: ${skillGroup.category}
        Technologies: ${skillGroup.skills.join(', ')}
        Description: ${skillGroup.description}
      `.trim();

      const embedding = await generateEmbedding(content);
      
      embeddings.push({
        id: `skills-${skillGroup.category.toLowerCase().replace(/\s+/g, '-')}`,
        type: 'skill',
        content,
        embedding,
        metadata: {
          category: skillGroup.category,
          skills: skillGroup.skills,
        },
      });
    }

    // Generate experience embeddings
    const experiences = [
      {
        title: 'Senior Frontend Developer',
        company: 'Tech Innovations Inc.',
        period: '2022 - Present',
        description: 'Lead frontend development for enterprise applications using React and TypeScript. Built scalable component libraries and mentored junior developers.',
        achievements: ['Improved app performance by 40%', 'Led team of 5 developers', 'Implemented design system']
      },
      {
        title: 'Full Stack Developer',
        company: 'StartupXYZ',
        period: '2020 - 2022',
        description: 'Developed full-stack web applications using React, Node.js, and PostgreSQL. Integrated AI features and built RESTful APIs.',
        achievements: ['Built MVP from scratch', 'Integrated OpenAI API', 'Deployed on AWS']
      }
    ];

    for (const exp of experiences) {
      const content = `
        Position: ${exp.title} at ${exp.company}
        Period: ${exp.period}
        Description: ${exp.description}
        Key Achievements: ${exp.achievements.join(', ')}
      `.trim();

      const embedding = await generateEmbedding(content);
      
      embeddings.push({
        id: `experience-${exp.company.toLowerCase().replace(/\s+/g, '-')}`,
        type: 'experience',
        content,
        embedding,
        metadata: {
          title: exp.title,
          company: exp.company,
          period: exp.period,
        },
      });
    }

    // Generate general information embeddings
    const generalInfo = [
      {
        topic: 'About Alex Chen',
        content: 'Alex Chen is a passionate full-stack developer and AI enthusiast with expertise in React, TypeScript, and machine learning. Based in San Francisco, Alex loves building innovative web applications that solve real-world problems.'
      },
      {
        topic: 'Contact Information',
        content: 'You can reach Ashwin Goyal via email at ashwingoyal2006@gmail.com or connect on LinkedIn. Ashwin is open to internship opportunities, collaboration projects, and full-time positions.'
      },
      {
        topic: 'Availability',
        content: 'Alex is currently available for new opportunities including full-time positions, consulting work, and interesting side projects. Particularly interested in AI/ML applications and modern web development.'
      }
    ];

    for (const info of generalInfo) {
      const embedding = await generateEmbedding(info.content);
      
      embeddings.push({
        id: `general-${info.topic.toLowerCase().replace(/\s+/g, '-')}`,
        type: 'general',
        content: info.content,
        embedding,
        metadata: {
          topic: info.topic,
        },
      });
    }

    console.log(`Generated ${embeddings.length} embeddings for portfolio content`);
    return embeddings;

  } catch (error) {
    console.error('Error generating portfolio embeddings:', error);
    throw new Error('Failed to generate portfolio embeddings');
  }
}