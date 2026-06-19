import { GetAllProjects } from "@/lib/connected-db-oc/project";
import { ProjectCardGrid } from "./projectCardGrid";

export default async function AllProjectsCardGrid() {
    const projects = await GetAllProjects();

    return <ProjectCardGrid projects={projects} />;
}
