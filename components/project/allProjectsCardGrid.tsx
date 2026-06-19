import { GetAllProjects } from "@/lib/connected-db-oc/project";
import { ProjectCardGrid } from "./projectCardGrid";

export const revalidate = 3600;

export default async function AllProjectsCardGrid() {
    const projects = await GetAllProjects();

    return <ProjectCardGrid projects={projects} />;
}
