import { notFound } from 'next/navigation';
import { getProjectBySlug, getProjects } from '@/lib/content/projects';
import ParticleBackground from '@/components/particles/ParticleBackground';
import { ProjectDetail } from '@/components/ui/ProjectDetail';
import { ProjectMDXContent } from '@/components/ui/ProjectMDXContent';

// Generate static params for all projects
export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const result = await getProjectBySlug(params.slug);
  
  if (!result) {
    return {
      title: 'Project Not Found',
    };
  }

  const { project } = result;
  
  return {
    title: `${project.title} | Portfolio`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: [project.image],
    },
  };
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const result = await getProjectBySlug(params.slug);

  if (!result) {
    notFound();
  }

  const { project, content } = result;

  return (
    <div className="relative min-h-screen">
      {/* Particle Background */}
      <ParticleBackground 
        section="projects"
        particleCount={30}
        className="fixed inset-0"
      />
      
      {/* Main Content */}
      <div className="relative z-10">
        <ProjectDetail project={project}>
          <ProjectMDXContent content={content} />
        </ProjectDetail>
      </div>
    </div>
  );
}