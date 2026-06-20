import { Suspense } from "react";
import { ProjectCard } from "@/components/project/projectCard";
import type {
    Project,
    ProjectPromiseEntry,
} from "@/lib/connected-db-oc/project";
import { getProjectWithBalance } from "@/lib/connected-db-oc/project";

function ProjectCardSkeleton() {
    return (
        <div className="rounded-3xl border border-border bg-muted/70 p-4 min-h-104" />
    );
}

async function ProjectCardShell({ project }: { project: ProjectPromiseEntry }) {
    const projectWithBalance: Project = await getProjectWithBalance(project);
    return <ProjectCard project={projectWithBalance} />;
}

export function ProjectCardGrid({
    projects,
}: {
    projects: ProjectPromiseEntry[];
}) {
    return (
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-4 sm:px-8 lg:px-16">
            {projects.map((project) => (
                <Suspense key={project.id} fallback={<ProjectCardSkeleton />}>
                    <ProjectCardShell project={project} />
                </Suspense>
            ))}
        </div>
    );
}
