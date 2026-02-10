import { ExternalLink, Github, Folder } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  tech_stack: string[];
  live_url: string | null;
  github_url: string | null;
}

interface ProjectsSectionProps {
  projects: Project[];
}

const ProjectsSection = ({ projects }: ProjectsSectionProps) => {
  return (
    <section id="projects" className="relative">
      <div className="section-container">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-4 neon-text">
          My Projects
        </h2>
        <div className="w-20 h-1 bg-primary mx-auto mb-12 rounded-full" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="glass-card overflow-hidden group hover:border-primary/30 transition-all duration-300"
            >
              {/* Image */}
              <div className="h-48 bg-secondary/50 overflow-hidden flex items-center justify-center">
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <Folder className="text-primary/30" size={48} />
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-heading text-base font-semibold mb-2 text-foreground">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech_stack?.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-mono px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-3">
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Github size={18} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
