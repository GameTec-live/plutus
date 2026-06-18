import { cacheLife, cacheTag } from "next/cache";
import { GetAllProjects } from "@/lib/connected-db-oc/project";
import { ProjectCardGrid } from "./projectCardGrid";

export default async function AllProjectsCardGrid() {
    "use cache";
    cacheLife("days");
    cacheTag("projectGrid");

    const projects = await GetAllProjects();

    return <ProjectCardGrid projects={projects} />;
}
