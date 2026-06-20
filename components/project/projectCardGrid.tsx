import { Suspense } from "react";
import { ProjectCard } from "@/components/project/projectCard";
import type {
    Project,
    ProjectPromiseEntry,
} from "@/lib/connected-db-oc/project";
import { getProjectWithBalance } from "@/lib/connected-db-oc/project";
import ProjectCardSkeleton from "./projectCardSkeleton";

async function ProjectCardShell({ project }: { project: ProjectPromiseEntry }) {
    const projectWithBalance: Project = await getProjectWithBalance(project);
    return <ProjectCard project={projectWithBalance} />;
}

export function ProjectCardGrid({
    projects,
    id,
}: {
    projects: ProjectPromiseEntry[];
    id?: string;
}) {
    return (
        <div
            className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-4 sm:px-8 lg:px-16"
            id={id}
        >
            {projects.map((project) => (
                <Suspense key={project.id} fallback={<ProjectCardSkeleton />}>
                    <ProjectCardShell project={project} />
                </Suspense>
            ))}
        </div>
    );
}
