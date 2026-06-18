import { desc } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib";
import { project } from "../schema";

export async function getAllProjects() {
    "use cache";
    cacheLife("days");
    cacheTag("projects");
    const projectData = await db
        .select({
            id: project.id,
            title: project.title,
            shortDescription: project.shortDescription,
            openCollectiveID: project.openCollectiveID,
        })
        .from(project)
        .orderBy(desc(project.createdAt));
    return projectData;
}

export type GetAllProjects = Awaited<ReturnType<typeof getAllProjects>>;
export type Project = GetAllProjects[number];
