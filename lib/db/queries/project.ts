import { desc } from "drizzle-orm";
import { db } from "@/lib";
import { project } from "../schema";

export async function getAllProjects() {
    const projectData = await db
        .select({
            id: project.id,
            title: project.title,
            shortDescription: project.shortDescription,
        })
        .from(project)
        .orderBy(desc(project.createdAt));
    return projectData;
}

export type GetAllProjects = Awaited<ReturnType<typeof getAllProjects>>;
export type Project = GetAllProjects[number];
