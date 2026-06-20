import { cacheLife, cacheTag } from "next/cache";
import { cacheTags } from "@/lib/cache-tags";
import { GetAllProjects } from "@/lib/connected-db-oc/project";
import { ProjectCardGrid } from "./projectCardGrid";

export default async function AllProjectsCardGrid({ id }: { id?: string }) {
    "use cache";
    cacheLife("minutes");
    cacheTag(cacheTags.projects.all, cacheTags.projects.grid);

    const projects = await GetAllProjects();

    return <ProjectCardGrid projects={projects} id={id} />;
}
