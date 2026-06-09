import { ProjectCard } from "@/components/project/projectCard";
import type { GetAllProjects } from "@/lib/db/queries/project";

export function ProjectCardGrid({ projects }: { projects: GetAllProjects }) {
    return (
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
            ))}
        </div>
    );
}
