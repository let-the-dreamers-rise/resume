import { getProjects, getFeaturedProjects } from '@/lib/content/projects';
import { ProjectCard } from '@/components/ui/ProjectCard';
import ParticleBackground from '@/components/particles/ParticleBackground';


export default async function Projects() {
  // Get all projects, prioritizing featured ones
  const allProjects = await getProjects();
  const featuredProjects = await getFeaturedProjects();
  
  // Display 3-6 featured projects, or fall back to first 6 projects if not enough featured
  const displayProjects = featuredProjects.length >= 3 
    ? featuredProjects.slice(0, 6)
    : allProjects.slice(0, 6);

  return (
    <div className="relative min-h-screen">
      {/* Particle Background */}
      <ParticleBackground 
        section="projects"
        particleCount={40}
        className="fixed inset-0"
      />
      
      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6">
            Featured Projects
          </h1>
          <p className="text-lg sm:text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            A showcase of my work in Frontend Engineering, Machine Learning, and Generative AI. 
            Each project demonstrates different aspects of modern web development and emerging technologies.
          </p>
        </div>

        {/* Projects Grid */}
        {displayProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {displayProjects.map((project, index) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-foreground/60 text-lg">
              No projects found. Check back soon for updates!
            </p>
          </div>
        )}



        {/* View All Projects Link */}
        {allProjects.length > displayProjects.length && (
          <div className="text-center mt-16">
            <a
              href="/projects/all"
              className="inline-flex items-center px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              View All Projects
              <svg 
                className="ml-2 w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 8l4 4m0 0l-4 4m4-4H3" 
                />
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}