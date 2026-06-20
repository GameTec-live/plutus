import { and, desc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib";
import { project, projectImage } from "../schema";

export async function getAllProjects() {
    "use cache";
    cacheLife("days");
    cacheTag("projectsdb", "project-listing");
    const projectData = await db
        .select({
            id: project.id,
            title: project.title,
            shortDescription: project.shortDescription,
            openCollectiveID: project.openCollectiveID,
            projectMainImage: projectImage.url,
        })
        .from(project)
        .leftJoin(
            projectImage,
            and(
                eq(project.id, projectImage.projectId),
                eq(projectImage.isPrimary, true),
            ),
        )
        .orderBy(desc(project.createdAt));
    return projectData;
}

export type projects = Awaited<ReturnType<typeof getAllProjects>>;
export type Project = projects[number];
