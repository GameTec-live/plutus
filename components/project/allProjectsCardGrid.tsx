import { getAllProjects } from "@/lib/db/queries/project";
import { ProjectCardGrid } from "./projectCardGrid";

export default async function AllProjectsCardGrid() {
    const projects = await getAllProjects();

    return <ProjectCardGrid projects={projects} />;
}
